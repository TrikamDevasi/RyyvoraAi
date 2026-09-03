/**
 * followupScheduler.service.ts
 * ────────────────────────────────────────────────────────────────────────────
 * Automated longitudinal follow-up scheduling for SIH26135.
 *
 * Responsibilities:
 *  - Finds all employed trainees whose EmploymentOutcome.startDate is at or
 *    past a follow-up milestone (30 / 60 / 90 / 180 / 365 days).
 *  - Creates FollowUp documents only when none exists for that
 *    (traineeId × scheduleDays × employmentOutcomeId) combination.
 *  - Marks PENDING follow-ups as OVERDUE when their dueDate has passed
 *    with no response.
 *  - Respects DPDP consent — skips trainees who have withdrawn
 *    'longitudinal_followup' consent.
 *  - Is fully idempotent: safe to run multiple times or on server restart.
 *  - Never throws uncaught exceptions — all errors are logged and isolated.
 *  - Exposes runFollowUpScheduler() for manual/admin-triggered execution.
 *
 * Architecture decision:
 *  Uses node's built-in setInterval (runs every 6 hours by default).
 *  No external packages (BullMQ, Agenda, node-cron) needed; this keeps the
 *  dependency footprint minimal and is compatible with the existing stack.
 *  Redis is already in package.json if BullMQ is ever needed in the future.
 *
 * Date-boundary design:
 *  - "Due" means: today's UTC date >= (startDate + milestone) - 1 day grace.
 *  - Grace period of 1 day prevents off-by-one misses due to timezone drift.
 *  - All date math uses UTC milliseconds to avoid DST anomalies.
 */

import mongoose from 'mongoose';
import FollowUp, { FollowUpInterval } from '../models/FollowUp.model';
import EmploymentOutcome from '../models/EmploymentOutcome.model';
import Consent from '../models/Consent.model';
import logger from '../utils/logger';

// ── Constants ─────────────────────────────────────────────────────────────────

/** Follow-up milestones in calendar days */
const FOLLOW_UP_INTERVALS: FollowUpInterval[] = [30, 60, 90, 180, 365];

/**
 * Grace period (days). A milestone is considered "due" when:
 *   today >= (startDate + milestone) - GRACE_DAYS
 *
 * This prevents off-by-one misses caused by server downtime or timezone drift.
 */
const GRACE_DAYS = 1;

/** Default scheduler interval (milliseconds). 6 hours. */
const DEFAULT_INTERVAL_MS = 6 * 60 * 60 * 1_000;

/** Employment statuses that warrant follow-up scheduling */
const ACTIVE_EMPLOYMENT_STATUSES = ['EMPLOYED', 'SELF_EMPLOYED', 'APPRENTICESHIP'] as const;

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SchedulerRunResult {
  /** UTC timestamp when this run started */
  ranAt: string;
  /** Total eligible (employed) outcomes inspected */
  outcomesInspected: number;
  /** New FollowUp documents created in this run */
  followUpsCreated: number;
  /** PENDING FollowUps newly marked OVERDUE in this run */
  overdueMarked: number;
  /** Trainees skipped due to withdrawn consent */
  consentSkipped: number;
  /** Non-fatal errors encountered */
  errors: string[];
}

// ── Core Scheduler Service ───────────────────────────────────────────────────

export class FollowUpSchedulerService {
  private schedulerTimer: NodeJS.Timeout | null = null;

  // ── 1. Find eligible EmploymentOutcome records ──────────────────────────

  /**
   * Returns all EmploymentOutcome records that:
   *  1. Have an active employment status (EMPLOYED | SELF_EMPLOYED | APPRENTICESHIP).
   *  2. Have a startDate set (required for milestone math).
   */
  async findEligibleOutcomes(): Promise<any[]> {
    return EmploymentOutcome.find({
      status: { $in: ACTIVE_EMPLOYMENT_STATUSES },
      startDate: { $exists: true, $ne: null },
    })
      .select('_id traineeId institutionId startDate scheduleDays retained30d retained90d retained180d retained365d')
      .lean();
  }

  // ── 2. Calculate which milestones are now due for a given startDate ──────

  /**
   * Returns the list of milestone days (from FOLLOW_UP_INTERVALS) that are
   * due on today's date for the given employment start date.
   *
   * A milestone is "due" when:
   *   today (UTC midnight) >= startDate + milestone - GRACE_DAYS
   *
   * Boundary test table (GRACE_DAYS = 1):
   *   29 days → not due (< 30 - 1 = 29; equal to 29, so due)
   *   Wait — day 29: today = startDate + 29 >= startDate + 30 - 1 = startDate + 29 → DUE ✓
   *   30 days: startDate + 30 >= startDate + 29 → DUE ✓
   *   31 days: DUE ✓
   *   28 days: startDate + 28 >= startDate + 29 → false → NOT DUE ✓
   */
  calculateDueMilestones(startDate: Date, asOfDate: Date = new Date()): FollowUpInterval[] {
    // Normalise both dates to UTC midnight to avoid intra-day drift
    const start = Date.UTC(
      startDate.getUTCFullYear(),
      startDate.getUTCMonth(),
      startDate.getUTCDate()
    );
    const today = Date.UTC(
      asOfDate.getUTCFullYear(),
      asOfDate.getUTCMonth(),
      asOfDate.getUTCDate()
    );

    const elapsedDays = Math.floor((today - start) / 86_400_000);

    return FOLLOW_UP_INTERVALS.filter(
      (milestone) => elapsedDays >= milestone - GRACE_DAYS
    );
  }

  // ── 3. Check consent for longitudinal follow-up ─────────────────────────

  /**
   * Returns true if the trainee has an active consent record that includes
   * 'longitudinal_followup' in its purposes.
   *
   * If no consent record exists, defaults to ALLOWED (opt-in by default per
   * the seed logic; new registrations get GRANTED consent).
   */
  async hasFollowUpConsent(traineeId: mongoose.Types.ObjectId): Promise<boolean> {
    try {
      const consent = await Consent.findOne({ userId: traineeId }).lean();
      if (!consent) {
        // No consent record — treat as allowed (system default)
        return true;
      }
      if (consent.status === 'WITHDRAWN') {
        return false;
      }
      // Check specific purpose granularity
      if (
        Array.isArray(consent.purposes) &&
        !consent.purposes.includes('longitudinal_followup')
      ) {
        return false;
      }
      return true;
    } catch (err) {
      logger.error('[FollowUpScheduler] Consent check error:', err);
      // Conservative: allow if consent check itself fails (don't block legitimate follow-ups)
      return true;
    }
  }

  // ── 4. Create due follow-ups (idempotent via upsert/existence check) ─────

  /**
   * For a single EmploymentOutcome, creates FollowUp documents for each
   * milestone that is:
   *  1. Due today (per calculateDueMilestones).
   *  2. Not already present in the DB for this (traineeId × scheduleDays × outcomeId).
   *
   * Returns the count of newly created FollowUp documents.
   */
  async createDueFollowUpsForOutcome(outcome: any): Promise<number> {
    const { _id: outcomeId, traineeId, institutionId, startDate } = outcome;
    let created = 0;

    const dueMilestones = this.calculateDueMilestones(new Date(startDate));
    if (dueMilestones.length === 0) return 0;

    for (const milestone of dueMilestones) {
      try {
        // Idempotency: check if a FollowUp already exists for this exact combination
        const exists = await FollowUp.exists({
          traineeId,
          scheduleDays: milestone,
          employmentOutcomeId: outcomeId,
        });

        if (exists) continue; // Already scheduled — skip

        // Calculate precise due date from employment start date
        const dueDate = new Date(startDate);
        dueDate.setUTCDate(dueDate.getUTCDate() + milestone);

        await FollowUp.create({
          traineeId,
          institutionId: institutionId || undefined,
          employmentOutcomeId: outcomeId,
          scheduleDays: milestone,
          dueDate,
          status: 'PENDING',
          channel: 'PORTAL',
        });

        created++;
        logger.info(
          `[FollowUpScheduler] Created ${milestone}-day follow-up for trainee ${traineeId} (outcome ${outcomeId})`
        );
      } catch (err: any) {
        // Duplicate key = race condition → already exists, safe to ignore
        if (err?.code === 11000) {
          logger.debug(
            `[FollowUpScheduler] Duplicate follow-up suppressed for trainee ${traineeId}, ${milestone}d`
          );
          continue;
        }
        logger.error(
          `[FollowUpScheduler] Error creating ${milestone}-day follow-up for trainee ${traineeId}:`,
          err
        );
      }
    }

    return created;
  }

  // ── 5. Mark overdue follow-ups ───────────────────────────────────────────

  /**
   * Finds all PENDING FollowUp documents whose dueDate is in the past
   * (i.e., dueDate < today) and marks them OVERDUE.
   *
   * Returns the number of documents updated.
   */
  async markOverdueFollowUps(): Promise<number> {
    const now = new Date();
    // Use start of today so a follow-up due today is NOT marked overdue
    const startOfToday = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );

    const result = await FollowUp.updateMany(
      {
        status: 'PENDING',
        dueDate: { $lt: startOfToday },
      },
      { $set: { status: 'OVERDUE' } }
    );

    const count = result.modifiedCount ?? 0;
    if (count > 0) {
      logger.info(`[FollowUpScheduler] Marked ${count} follow-up(s) as OVERDUE`);
    }
    return count;
  }

  // ── 6. Main scheduler run function ──────────────────────────────────────

  /**
   * Executes one complete scheduler run:
   *  1. Loads all eligible (employed) outcomes from DB.
   *  2. Checks consent for each trainee.
   *  3. Creates due follow-ups (idempotent).
   *  4. Marks overdue follow-ups.
   *
   * Safe to call multiple times — fully idempotent.
   * Never throws — all errors are caught and logged.
   *
   * @returns SchedulerRunResult with detailed statistics
   */
  async runFollowUpScheduler(): Promise<SchedulerRunResult> {
    const ranAt = new Date().toISOString();
    const result: SchedulerRunResult = {
      ranAt,
      outcomesInspected: 0,
      followUpsCreated: 0,
      overdueMarked: 0,
      consentSkipped: 0,
      errors: [],
    };

    logger.info('[FollowUpScheduler] Starting scheduled follow-up run...');

    try {
      // Check MongoDB connection health before proceeding
      if (mongoose.connection.readyState !== 1) {
        const msg = 'MongoDB not ready — skipping scheduler run';
        logger.warn(`[FollowUpScheduler] ${msg}`);
        result.errors.push(msg);
        return result;
      }

      // Load eligible outcomes
      const eligibleOutcomes = await this.findEligibleOutcomes();
      result.outcomesInspected = eligibleOutcomes.length;
      logger.info(`[FollowUpScheduler] Inspecting ${eligibleOutcomes.length} eligible outcome(s)`);

      // Process each outcome
      for (const outcome of eligibleOutcomes) {
        try {
          const traineeId = (outcome as any).traineeId as mongoose.Types.ObjectId;

          // Consent check
          const hasConsent = await this.hasFollowUpConsent(traineeId);
          if (!hasConsent) {
            result.consentSkipped++;
            logger.debug(
              `[FollowUpScheduler] Skipped trainee ${traineeId} — longitudinal_followup consent withdrawn`
            );
            continue;
          }

          const created = await this.createDueFollowUpsForOutcome(outcome);
          result.followUpsCreated += created;
        } catch (err: any) {
          const msg = `Error processing outcome ${(outcome as any)._id}: ${err?.message}`;
          result.errors.push(msg);
          logger.error(`[FollowUpScheduler] ${msg}`);
        }
      }

      // Mark overdue follow-ups
      result.overdueMarked = await this.markOverdueFollowUps();

      logger.info(
        `[FollowUpScheduler] Run complete — created: ${result.followUpsCreated}, ` +
        `overdue: ${result.overdueMarked}, consent_skipped: ${result.consentSkipped}, ` +
        `errors: ${result.errors.length}`
      );
    } catch (err: any) {
      const msg = `Fatal scheduler error: ${err?.message}`;
      result.errors.push(msg);
      logger.error(`[FollowUpScheduler] ${msg}`);
    }

    return result;
  }

  // ── 7. Start / Stop the background scheduler ────────────────────────────

  /**
   * Starts the background scheduler that runs every `intervalMs` milliseconds.
   * Runs an initial pass immediately on startup, then repeats on the interval.
   * Safe to call multiple times — only one timer is active at a time.
   */
  start(intervalMs: number = DEFAULT_INTERVAL_MS): void {
    if (this.schedulerTimer) {
      logger.warn('[FollowUpScheduler] Already running — ignoring duplicate start()');
      return;
    }

    logger.info(
      `[FollowUpScheduler] Starting background scheduler (interval: ${Math.round(intervalMs / 60_000)} minutes)`
    );

    // Run once immediately, then on interval
    const tick = () => {
      this.runFollowUpScheduler().catch((err) => {
        logger.error('[FollowUpScheduler] Unhandled tick error:', err);
      });
    };

    tick(); // immediate first run
    this.schedulerTimer = setInterval(tick, intervalMs);

    // Unref so the timer does not keep the Node process alive artificially
    this.schedulerTimer.unref();
  }

  /**
   * Stops the background scheduler.
   */
  stop(): void {
    if (this.schedulerTimer) {
      clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
      logger.info('[FollowUpScheduler] Background scheduler stopped');
    }
  }
}

// ── Singleton export ──────────────────────────────────────────────────────────
export const followUpSchedulerService = new FollowUpSchedulerService();
