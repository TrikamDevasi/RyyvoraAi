/**
 * Ryyvora AI — SaaS Plan Definitions (Server-Side Source of Truth)
 *
 * IMPORTANT: This is the ONLY authoritative source for plan prices and limits.
 * The frontend NEVER dictates a price. The backend always reads from here.
 */

export type PlanId = 'free' | 'starter' | 'growth' | 'enterprise';
export type BillingCycle = 'monthly' | 'yearly';

export interface PlanLimits {
  maxTrainees: number | null;           // null = unlimited
  maxAIRequestsPerMonth: number | null;
  maxAssessmentsPerMonth: number | null;
  maxOutcomeRecords: number | null;
  maxEmployerVerifications: number | null;
  maxReports: number | null;
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
  customIntegrations: boolean;
  dedicatedAccountManager: boolean;
}

export interface PlanDefinition {
  id: PlanId;
  name: string;
  description: string;
  pricing: {
    monthly: number;   // Price in INR (paisa-safe integer: 1999 = ₹1,999)
    yearly: number;    // Price in INR per year
    currency: 'INR';
    displayMonthly: string;
    displayYearly: string;
    yearlyPerMonth: string; // For display: yearly / 12
    savingsPercent: number; // Calculated, not hardcoded
  };
  limits: PlanLimits;
  isPopular: boolean;
  isCustom: boolean;    // Enterprise: contact sales
  ctaLabel: string;
  features: string[];   // Human-readable feature list for UI
}

// ─── Calculate savings percentage ────────────────────────────────────────────
function calcSavings(monthly: number, yearly: number): number {
  const annualIfMonthly = monthly * 12;
  if (annualIfMonthly === 0) return 0;
  return Math.round(((annualIfMonthly - yearly) / annualIfMonthly) * 100);
}

// ─── Plan Catalog ─────────────────────────────────────────────────────────────
export const PLANS: Record<PlanId, PlanDefinition> = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'For individuals evaluating Ryyvora AI.',
    pricing: {
      monthly: 0,
      yearly: 0,
      currency: 'INR',
      displayMonthly: '₹0',
      displayYearly: '₹0',
      yearlyPerMonth: '₹0',
      savingsPercent: 0,
    },
    limits: {
      maxTrainees: 10,
      maxAIRequestsPerMonth: 20,
      maxAssessmentsPerMonth: 5,
      maxOutcomeRecords: 10,
      maxEmployerVerifications: 0,
      maxReports: 2,
      advancedAnalytics: false,
      wageAnalytics: false,
      retentionAnalytics: false,
      skillGapAnalytics: false,
      policyCopilot: false,
      outcomeTracking: false,
      employerVerification: false,
      customDashboards: false,
      prioritySupport: false,
      apiAccess: false,
      customIntegrations: false,
      dedicatedAccountManager: false,
    },
    isPopular: false,
    isCustom: false,
    ctaLabel: 'Start Free',
    features: [
      'Up to 10 trainees',
      '20 AI analyses/month',
      'Basic skill assessment',
      'Student milestone journey',
      'Basic dashboard',
      'Community support',
    ],
  },

  starter: {
    id: 'starter',
    name: 'Starter',
    description: 'For small training institutes getting started.',
    pricing: {
      monthly: 1999,
      yearly: 19990,
      currency: 'INR',
      displayMonthly: '₹1,999',
      displayYearly: '₹19,990',
      yearlyPerMonth: '₹1,666',
      savingsPercent: calcSavings(1999, 19990), // ~16.6% → 17%
    },
    limits: {
      maxTrainees: 100,
      maxAIRequestsPerMonth: 200,
      maxAssessmentsPerMonth: 100,
      maxOutcomeRecords: 200,
      maxEmployerVerifications: 50,
      maxReports: 10,
      advancedAnalytics: false,
      wageAnalytics: false,
      retentionAnalytics: false,
      skillGapAnalytics: false,
      policyCopilot: false,
      outcomeTracking: true,
      employerVerification: true,
      customDashboards: false,
      prioritySupport: false,
      apiAccess: false,
      customIntegrations: false,
      dedicatedAccountManager: false,
    },
    isPopular: false,
    isCustom: false,
    ctaLabel: 'Start Starter',
    features: [
      'Up to 100 trainees',
      '200 AI analyses/month',
      'Outcome & retention tracking',
      'Employer verification portal',
      'Student journey & assessments',
      'Basic reports & exports',
      'Email support',
    ],
  },

  growth: {
    id: 'growth',
    name: 'Growth',
    description: 'For growing training organizations managing multi-cohort programs.',
    pricing: {
      monthly: 4999,
      yearly: 49990,
      currency: 'INR',
      displayMonthly: '₹4,999',
      displayYearly: '₹49,990',
      yearlyPerMonth: '₹4,166',
      savingsPercent: calcSavings(4999, 49990), // ~16.7% → 17%
    },
    limits: {
      maxTrainees: 500,
      maxAIRequestsPerMonth: 1000,
      maxAssessmentsPerMonth: 500,
      maxOutcomeRecords: 1000,
      maxEmployerVerifications: 200,
      maxReports: 50,
      advancedAnalytics: true,
      wageAnalytics: true,
      retentionAnalytics: true,
      skillGapAnalytics: true,
      policyCopilot: true,
      outcomeTracking: true,
      employerVerification: true,
      customDashboards: false,
      prioritySupport: true,
      apiAccess: false,
      customIntegrations: false,
      dedicatedAccountManager: false,
    },
    isPopular: true,
    isCustom: false,
    ctaLabel: 'Start Growth',
    features: [
      'Up to 500 trainees',
      '1,000 AI analyses/month',
      'Everything in Starter',
      'Advanced outcome analytics',
      'Wage progression & retention',
      'AI skill-gap intelligence',
      'AI Policy Copilot',
      'District/cohort reports',
      'Priority support',
    ],
  },

  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For government departments, universities, and large-scale training networks.',
    pricing: {
      monthly: 0, // Custom — negotiated
      yearly: 0,
      currency: 'INR',
      displayMonthly: 'Custom',
      displayYearly: 'Custom',
      yearlyPerMonth: 'Custom',
      savingsPercent: 0,
    },
    limits: {
      maxTrainees: null,
      maxAIRequestsPerMonth: null,
      maxAssessmentsPerMonth: null,
      maxOutcomeRecords: null,
      maxEmployerVerifications: null,
      maxReports: null,
      advancedAnalytics: true,
      wageAnalytics: true,
      retentionAnalytics: true,
      skillGapAnalytics: true,
      policyCopilot: true,
      outcomeTracking: true,
      employerVerification: true,
      customDashboards: true,
      prioritySupport: true,
      apiAccess: true,
      customIntegrations: true,
      dedicatedAccountManager: true,
    },
    isPopular: false,
    isCustom: true,
    ctaLabel: 'Contact Sales',
    features: [
      'Unlimited trainees & capacity',
      'Everything in Growth',
      'Government-scale analytics',
      'Custom dashboards & white-label',
      'Advanced RBAC & org controls',
      'Custom integrations & API access',
      'Dedicated account manager & SLA',
      'Custom data retention & compliance',
    ],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns the PlanDefinition for a given plan ID, defaulting to 'free'. */
export function getPlan(planId: string): PlanDefinition {
  return PLANS[planId as PlanId] ?? PLANS.free;
}

/** Returns all plans as an ordered array (for API response). */
export function getAllPlans(): PlanDefinition[] {
  return [PLANS.free, PLANS.starter, PLANS.growth, PLANS.enterprise];
}
