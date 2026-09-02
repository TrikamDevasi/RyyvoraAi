/**
 * SkillSense AI — Billing API Client (Frontend)
 *
 * All requests go through the backend. No prices are ever sent to the server
 * from client-side state — only plan IDs and billing cycles.
 */

import api from '@/lib/api';

export type PlanId = 'free' | 'starter' | 'growth' | 'enterprise';
export type BillingCycle = 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'trialing' | 'cancelled' | 'expired' | 'past_due';

export interface SubscriptionData {
  plan: PlanId;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  provider: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  activatedAt: string;
}

export interface UsageData {
  period: string;
  aiRequests: number;
  traineesCreated: number;
  assessmentsRun: number;
  outcomeRecords: number;
  employerVerifications: number;
  reportsGenerated: number;
}

export interface EntitlementLimits {
  maxTrainees: number | null;
  maxAIRequestsPerMonth: number | null;
  maxAssessmentsPerMonth: number | null;
  maxOutcomeRecords: number | null;
  advancedAnalytics: boolean;
  wageAnalytics: boolean;
  retentionAnalytics: boolean;
  skillGapAnalytics: boolean;
  policyCopilot: boolean;
  outcomeTracking: boolean;
  employerVerification: boolean;
  customDashboards: boolean;
  prioritySupport: boolean;
  apiAccess: boolean;
}

export interface SubscriptionResponse {
  subscription: SubscriptionData;
  entitlements: {
    bypassedByRole: boolean;
    limits: EntitlementLimits;
  };
  usage: UsageData;
  isDemoMode: boolean;
}

export interface CheckoutPayload {
  plan: PlanId;
  billingCycle: BillingCycle;
}

// ─── API Functions ────────────────────────────────────────────────────────────

export const billingApi = {
  /** Fetch the public plan catalog */
  getPlans: async () => {
    const res = await api.get('/billing/plans');
    return res.data;
  },

  /** Fetch the current user's subscription, entitlements, and usage */
  getSubscription: async (): Promise<SubscriptionResponse> => {
    const res = await api.get('/billing/subscription');
    return res.data.data as SubscriptionResponse;
  },

  /** Initiate a checkout. Only plan + billingCycle are sent — no price. */
  checkout: async (plan: PlanId, billingCycle: BillingCycle) => {
    const payload: CheckoutPayload = { plan, billingCycle };
    const res = await api.post('/billing/checkout', payload);
    return res.data;
  },

  /** Change the current plan */
  changePlan: async (plan: PlanId, billingCycle: BillingCycle) => {
    const res = await api.post('/billing/change-plan', { plan, billingCycle });
    return res.data;
  },

  /** Schedule subscription cancellation at period end */
  cancelSubscription: async () => {
    const res = await api.post('/billing/cancel');
    return res.data;
  },

  /** Reverse a pending cancellation */
  resumeSubscription: async () => {
    const res = await api.post('/billing/resume');
    return res.data;
  },

  /** Get current period usage and limits */
  getUsage: async () => {
    const res = await api.get('/billing/usage');
    return res.data;
  },
};
