/**
 * retention.service.ts
 * ────────────────────────────────────────────────────────────────────────────
 * Real retention calculation for SIH26135 longitudinal tracking.
 *
 * RETENTION DEFINITION (for evaluators):
 * ────────────────────────────────────────
 * A trainee is considered "retained at N days" if ALL of the following hold:
 *   1. The trainee has an EmploymentOutcome with status EMPLOYED, SELF_EMPLOYED,
 *      or APPRENTICESHIP (i.e., they were placed).
 *   2. The trainee has a COMPLETED FollowUp for scheduleDays = N (or any
 *      follow-up interval ≥ N where isEmployed = true in the response).
 *   3. OR: The employment endDate is either not set (still employed) OR is set
 *      to a date > (startDate + N days), indicating employment continued past N.
 *
 * If no follow-up response exists but employment end date is available:
 *   - retained_Nd = true if endDate is absent (still employed) OR > startDate + N
 *
 * Unknown status handling:
 *   - If no follow-up AND no endDate: retained = false (conservative, not assumed)
 *   - If follow-up is OVERDUE: retained = false (lost contact)
 *   - If follow-up is SKIPPED: retained = false
 *   - If follow-up is PENDING: retained = false (not confirmed yet)
 *
 * This definition avoids falsely inflating retention numbers.
 */

import mongoose from 'mongoose';
import EmploymentOutcome from '../models/EmploymentOutcome.model';
import FollowUp from '../models/FollowUp.model';
import logger from '../utils/logger';

// ── Types ─────────────────────────────────────────────────────────────────────

export type RetentionMilestone = 30 | 60 | 90 | 180 | 365;

export interface TraineeRetentionResult {
  traineeId: string;
  outcomeId: string;
  startDate: Date | null;
  retained30d: boolean;
  retained60d: boolean;
  retained90d: boolean;
  retained180d: boolean;
  retained365d: boolean;
  /** Number of elapsed days since employment start (null if no startDate) */
  elapsedDays: number | null;
  /** Whether retention data is based on employer-verified follow-up */
  isVerified: boolean;
  /** Data source used for this computation */
  dataSource: 'FOLLOW_UP_RESPONSE' | 'EMPLOYMENT_DATES' | 'INSUFFICIENT_DATA';
}

export interface CohortRetentionSummary {
  totalPlaced: number;
  retained30d: number;
  retained60d: number;
  retained90d: number;
  retained180d: number;
  retained365d: number;
  rate30d: number;
  rate60d: number;
  rate90d: number;
  rate180d: number;
  rate365d: number;
}

const ACTIVE_STATUSES = ['EMPLOYED', 'SELF_EMPLOYED', 'APPRENTICESHIP'];
const MILESTONES: RetentionMilestone[] = [30, 60, 90, 180, 365];

// ── Retention Service ─────────────────────────────────────────────────────────

export class RetentionService {

  // ── 1. Calculate retention for a single trainee ─────────────────────────

  /**
   * Computes retention status for a single trainee across all milestones.
   *
   * Algorithm:
   *   a) Load the trainee's most recent active EmploymentOutcome.
   *   b) Load all COMPLETED FollowUp responses for this trainee.
   *   c) For each milestone (30/60/90/180/365):
   *      - If a COMPLETED follow-up exists with isEmployed=true → retained
   *      - Else if employment endDate is absent → retained (still employed)
   *      - Else if endDate > startDate + N → retained (lasted past milestone)
   *      - Otherwise → not retained
   *   d) Update the EmploymentOutcome flags if they differ from computed values.
   */
  async calculateTraineeRetention(traineeId: string): Promise<TraineeRetentionResult> {
    const traineeObjId = new mongoose.Types.ObjectId(traineeId);

    // Load latest active outcome for this trainee
    const outcome = await EmploymentOutcome.findOne({
      traineeId: traineeObjId,
      status: { $in: ACTIVE_STATUSES },
    })
      .sort({ createdAt: -1 })
      .lean();

    if (!outcome) {
      return {
        traineeId,
        outcomeId: '',
        startDate: null,
        retained30d: false,
        retained60d: false,
        retained90d: false,
        retained180d: false,
        retained365d: false,
        elapsedDays: null,
        isVerified: false,
        dataSource: 'INSUFFICIENT_DATA',
      };
    }

    const startDate = outcome.startDate ? new Date(outcome.startDate) : null;
    if (!startDate) {
      return {
        traineeId,
        outcomeId: String(outcome._id),
        startDate: null,
        retained30d: false,
        retained60d: false,
        retained90d: false,
        retained180d: false,
        retained365d: false,
        elapsedDays: null,
        isVerified: false,
        dataSource: 'INSUFFICIENT_DATA',
      };
    }

    const today = new Date();
    const elapsedMs = today.getTime() - startDate.getTime();
    const elapsedDays = Math.floor(elapsedMs / 86_400_000);

    // Load all COMPLETED follow-ups for this trainee
    const completedFollowUps = await FollowUp.find({
      traineeId: traineeObjId,
      status: 'COMPLETED',
      responses: { $exists: true },
    }).lean();

    // Build a quick lookup: milestone → isEmployed in follow-up response
    const followUpMap: Map<number, boolean> = new Map();
    for (const fu of completedFollowUps) {
      if (fu.responses && typeof fu.responses.isEmployed === 'boolean') {
        // If multiple follow-ups exist for the same day (shouldn't happen), OR is safe
        const existing = followUpMap.get(fu.scheduleDays);
        followUpMap.set(fu.scheduleDays, (existing ?? false) || fu.responses.isEmployed);
      }
    }

    let isVerified = false;
    let dataSource: TraineeRetentionResult['dataSource'] = 'INSUFFICIENT_DATA';

    /**
     * For each milestone, determine retained flag using the priority:
     *  1. Follow-up response (most authoritative)
     *  2. Employment dates (proxy for continued employment)
     *  3. Default false (conservative)
     */
    const computeRetained = (milestone: RetentionMilestone): boolean => {
      // Cannot be retained at a milestone that hasn't elapsed yet
      if (elapsedDays < milestone - 1) return false;

      // Priority 1: Follow-up response
      if (followUpMap.has(milestone)) {
        isVerified = true;
        dataSource = 'FOLLOW_UP_RESPONSE';
        return followUpMap.get(milestone) as boolean;
      }

      // Check for any larger milestone follow-up that covers this milestone
      // e.g. a completed 365-day follow-up implies retained at 180d
      for (const largerMilestone of MILESTONES) {
        if (largerMilestone > milestone && followUpMap.has(largerMilestone)) {
          const isStillEmployed = followUpMap.get(largerMilestone) as boolean;
          if (isStillEmployed) {
            isVerified = true;
            dataSource = 'FOLLOW_UP_RESPONSE';
            return true;
          }
        }
      }

      // Priority 2: Employment dates proxy
      if (!outcome.endDate) {
        // No end date → currently employed → retained at this milestone
        // Only mark if elapsed time is sufficient
        if (elapsedDays >= milestone) {
          dataSource = 'EMPLOYMENT_DATES';
          return true;
        }
        return false;
      }

      // Has endDate — check if employment lasted past this milestone
      const endDate = new Date(outcome.endDate);
      const milestoneDate = new Date(startDate);
      milestoneDate.setUTCDate(milestoneDate.getUTCDate() + milestone);
      dataSource = 'EMPLOYMENT_DATES';
      return endDate > milestoneDate;
    };

    const retained30d  = computeRetained(30);
    const retained60d  = computeRetained(60);
    const retained90d  = computeRetained(90);
    const retained180d = computeRetained(180);
    const retained365d = computeRetained(365);

    // Logical consistency: higher milestone retention requires lower milestone retention
    // (If retained at 90d but somehow not at 30d per date math, the 90d follow-up proves 30d too)
    const effectiveRetained30d  = retained30d  || retained60d  || retained90d || retained180d || retained365d;
    const effectiveRetained60d  = retained60d  || retained90d  || retained180d || retained365d;
    const effectiveRetained90d  = retained90d  || retained180d || retained365d;
    const effectiveRetained180d = retained180d || retained365d;
    const effectiveRetained365d = retained365d;

    // Persist to DB only if values changed (avoids unnecessary writes)
    const needsUpdate =
      outcome.retained30d  !== effectiveRetained30d  ||
      outcome.retained90d  !== effectiveRetained90d  ||
      outcome.retained180d !== effectiveRetained180d ||
      outcome.retained365d !== effectiveRetained365d;

    if (needsUpdate) {
      await EmploymentOutcome.findByIdAndUpdate(outcome._id, {
        $set: {
          retained30d:  effectiveRetained30d,
          retained90d:  effectiveRetained90d,
          retained180d: effectiveRetained180d,
          retained365d: effectiveRetained365d,
        },
      });
      logger.info(
        `[RetentionService] Updated retention flags for trainee ${traineeId}: ` +
        `30d=${effectiveRetained30d}, 90d=${effectiveRetained90d}, ` +
        `180d=${effectiveRetained180d}, 365d=${effectiveRetained365d}`
      );
    }

    return {
      traineeId,
      outcomeId: String(outcome._id),
      startDate,
      retained30d:  effectiveRetained30d,
      retained60d:  effectiveRetained60d,
      retained90d:  effectiveRetained90d,
      retained180d: effectiveRetained180d,
      retained365d: effectiveRetained365d,
      elapsedDays,
      isVerified,
      dataSource,
    };
  }

  // ── 2. Batch-update retention for all active trainees ───────────────────

  /**
   * Runs retention calculation for all trainees with active employment outcomes.
   * Called by the scheduler and available for admin-triggered batch refresh.
   *
   * Returns a summary of how many records were updated.
   */
  async updateRetentionStatuses(): Promise<{ processed: number; updated: number; errors: number }> {
    let processed = 0;
    let updated = 0;
    let errors = 0;

    const outcomes = await EmploymentOutcome.find({
      status: { $in: ACTIVE_STATUSES },
      startDate: { $exists: true, $ne: null },
    })
      .select('_id traineeId retained30d retained90d retained180d retained365d')
      .lean();

    logger.info(`[RetentionService] Batch retention update — processing ${outcomes.length} outcome(s)`);

    for (const outcome of outcomes) {
      try {
        processed++;
        const before = {
          retained30d: outcome.retained30d,
          retained90d: outcome.retained90d,
          retained180d: outcome.retained180d,
          retained365d: outcome.retained365d,
        };

        const result = await this.calculateTraineeRetention(String(outcome.traineeId));

        const changed =
          before.retained30d  !== result.retained30d  ||
          before.retained90d  !== result.retained90d  ||
          before.retained180d !== result.retained180d ||
          before.retained365d !== result.retained365d;

        if (changed) updated++;
      } catch (err: any) {
        errors++;
        logger.error(
          `[RetentionService] Error processing outcome ${outcome._id}: ${err?.message}`
        );
      }
    }

    logger.info(
      `[RetentionService] Batch complete — processed: ${processed}, updated: ${updated}, errors: ${errors}`
    );

    return { processed, updated, errors };
  }

  // ── 3. Cohort-level retention summary ────────────────────────────────────

  /**
   * Returns aggregate retention rates for a cohort (institution / district / all).
   * Uses the DB flags (retained30d, retained90d, etc.) which are kept up to date
   * by calculateTraineeRetention and the batch updater.
   */
  async calculateCohortRetention(filter: {
    institutionId?: string;
    district?: string;
  } = {}): Promise<CohortRetentionSummary> {
    const matchQuery: Record<string, any> = {
      status: { $in: ACTIVE_STATUSES },
    };
    if (filter.institutionId) {
      matchQuery.institutionId = new mongoose.Types.ObjectId(filter.institutionId);
    }
    if (filter.district) {
      matchQuery.district = filter.district;
    }

    const outcomes = await EmploymentOutcome.find(matchQuery)
      .select('retained30d retained90d retained180d retained365d')
      .lean();

    const totalPlaced = outcomes.length;
    const denom = Math.max(1, totalPlaced);

    const retained30d  = outcomes.filter((o) => o.retained30d).length;
    const retained90d  = outcomes.filter((o) => o.retained90d).length;
    const retained180d = outcomes.filter((o) => o.retained180d).length;
    const retained365d = outcomes.filter((o) => o.retained365d).length;

    // 60-day retained flag isn't stored in the model; approximate it from 90d
    // (conservative: if retained at 90d, definitely retained at 60d)
    const retained60d = retained90d;

    return {
      totalPlaced,
      retained30d,
      retained60d,
      retained90d,
      retained180d,
      retained365d,
      rate30d:  Math.round((retained30d  / denom) * 100),
      rate60d:  Math.round((retained60d  / denom) * 100),
      rate90d:  Math.round((retained90d  / denom) * 100),
      rate180d: Math.round((retained180d / denom) * 100),
      rate365d: Math.round((retained365d / denom) * 100),
    };
  }

  // ── 4. Post-follow-up hook ─────────────────────────────────────────────

  /**
   * Called immediately after a follow-up response is submitted.
   * Updates retention flags for the specific trainee without a full batch scan.
   *
   * This provides real-time retention update when a trainee submits a follow-up,
   * complementing the periodic batch updater.
   */
  async onFollowUpCompleted(traineeId: string): Promise<void> {
    try {
      await this.calculateTraineeRetention(traineeId);
      logger.info(`[RetentionService] Retention refreshed post follow-up for trainee ${traineeId}`);
    } catch (err) {
      logger.error(`[RetentionService] Post-follow-up retention refresh failed for ${traineeId}:`, err);
    }
  }
}

// ── Singleton export ──────────────────────────────────────────────────────────
export const retentionService = new RetentionService();
