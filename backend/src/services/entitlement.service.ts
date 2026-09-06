/**
 * Ryyvora AI — Entitlement Service
 *
 * Provides feature gating and quota enforcement based on a user's active plan.
 *
 * IMPORTANT: Government, Student, and Admin roles ALWAYS bypass all entitlement
 * checks. This guarantees the SIH26135 hackathon demo is never blocked by billing.
 *
 * Usage:
 *   const entitlement = await entitlementService.getEntitlements(userId, userRole);
 *   entitlement.hasFeature('advancedAnalytics')
 *   entitlement.checkQuota('aiRequests')   → { allowed, used, limit }
 */

import mongoose from 'mongoose';
import Subscription from '../models/Subscription.model';
import UsageRecord, { IUsageRecord } from '../models/UsageRecord.model';
import { getPlan, PlanLimits, PlanId } from '../config/plans';
import { UserRole } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

export type QuotaResource =
  | 'aiRequests'
  | 'trainees'
  | 'assessments'
  | 'outcomeRecords'
  | 'employerVerifications'
  | 'reports';

export interface QuotaCheck {
  allowed: boolean;
  used: number;
  limit: number | null; // null = unlimited
  remaining: number | null;
}

export interface EntitlementResult {
  plan: PlanId;
  status: string;
  bypassedByRole: boolean;       // true for government, student, admin
  demoMode: boolean;
  hasFeature: (feature: keyof PlanLimits) => boolean;
  checkQuota: (resource: QuotaResource) => QuotaCheck;
  limits: PlanLimits;
  currentUsage: Partial<IUsageRecord>;
  periodEnd?: Date;
}

// ─── Roles that bypass ALL entitlement checks ────────────────────────────────
const BYPASS_ROLES: UserRole[] = ['government', 'student', 'admin'];

// ─── Current billing period key (YYYY-MM) ────────────────────────────────────
function currentPeriod(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// ─── Entitlement Service ──────────────────────────────────────────────────────

class EntitlementService {
  /**
   * Resolve a user's current entitlements, including feature flags and quota checks.
   * Always returns an EntitlementResult — never throws.
   */
  async getEntitlements(userId: string, userRole: UserRole): Promise<EntitlementResult> {
    const isBypass = BYPASS_ROLES.includes(userRole);

    // Bypass roles get unlimited enterprise-level access
    if (isBypass) {
      const limits = getPlan('enterprise').limits;
      const unlimitedQuota: QuotaCheck = { allowed: true, used: 0, limit: null, remaining: null };
      return {
        plan: 'enterprise',
        status: 'active',
        bypassedByRole: true,
        demoMode: false,
        hasFeature: () => true,
        checkQuota: () => unlimitedQuota,
        limits,
        currentUsage: {},
        periodEnd: undefined,
      };
    }

    // Fetch subscription (defaults to free if none exists)
    const sub = await Subscription.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    const planId: PlanId = (sub?.plan as PlanId) ?? 'free';
    const planDef = getPlan(planId);
    const limits = planDef.limits;
    const status = sub?.status ?? 'active';
    const periodEnd = sub?.currentPeriodEnd;

    // Fetch current month's usage
    const period = currentPeriod();
    const usageDoc = await UsageRecord.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      period,
    });

    const usage = {
      aiRequests: usageDoc?.aiRequests ?? 0,
      traineesCreated: usageDoc?.traineesCreated ?? 0,
      assessmentsRun: usageDoc?.assessmentsRun ?? 0,
      outcomeRecords: usageDoc?.outcomeRecords ?? 0,
      employerVerifications: usageDoc?.employerVerifications ?? 0,
      reportsGenerated: usageDoc?.reportsGenerated ?? 0,
    };

    const hasFeature = (feature: keyof PlanLimits): boolean => {
      const val = limits[feature];
      if (typeof val === 'boolean') return val;
      if (val === null) return true;    // null = unlimited = allowed
      if (typeof val === 'number') return val > 0;
      return false;
    };

    const checkQuota = (resource: QuotaResource): QuotaCheck => {
      const { used, limit } = this._resolveQuota(resource, limits, usage);
      if (limit === null) return { allowed: true, used, limit: null, remaining: null };
      const remaining = Math.max(0, limit - used);
      return { allowed: used < limit, used, limit, remaining };
    };

    return {
      plan: planId,
      status,
      bypassedByRole: false,
      demoMode: sub?.provider === 'demo',
      hasFeature,
      checkQuota,
      limits,
      currentUsage: usage,
      periodEnd,
    };
  }

  /**
   * Increment a usage counter for the current billing period.
   * Creates the UsageRecord document if it doesn't exist (upsert).
   */
  async incrementUsage(userId: string, resource: QuotaResource, amount = 1): Promise<void> {
    const period = currentPeriod();
    const field = this._resourceToField(resource);
    await UsageRecord.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId), period },
      { $inc: { [field]: amount } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  /**
   * Quick check: can a user perform an action?
   * Returns true for bypass roles or if quota is not exceeded.
   */
  async canUse(userId: string, userRole: UserRole, resource: QuotaResource): Promise<boolean> {
    if (BYPASS_ROLES.includes(userRole)) return true;
    const ent = await this.getEntitlements(userId, userRole);
    return ent.checkQuota(resource).allowed;
  }

  private _resolveQuota(
    resource: QuotaResource,
    limits: PlanLimits,
    usage: Record<string, number>
  ): { used: number; limit: number | null } {
    switch (resource) {
      case 'aiRequests':
        return { used: usage.aiRequests, limit: limits.maxAIRequestsPerMonth };
      case 'trainees':
        return { used: usage.traineesCreated, limit: limits.maxTrainees };
      case 'assessments':
        return { used: usage.assessmentsRun, limit: limits.maxAssessmentsPerMonth };
      case 'outcomeRecords':
        return { used: usage.outcomeRecords, limit: limits.maxOutcomeRecords };
      case 'employerVerifications':
        return { used: usage.employerVerifications, limit: limits.maxEmployerVerifications };
      case 'reports':
        return { used: usage.reportsGenerated, limit: limits.maxReports };
      default:
        return { used: 0, limit: 0 };
    }
  }

  private _resourceToField(resource: QuotaResource): string {
    const map: Record<QuotaResource, string> = {
      aiRequests: 'aiRequests',
      trainees: 'traineesCreated',
      assessments: 'assessmentsRun',
      outcomeRecords: 'outcomeRecords',
      employerVerifications: 'employerVerifications',
      reports: 'reportsGenerated',
    };
    return map[resource] ?? 'aiRequests';
  }
}

export const entitlementService = new EntitlementService();
