'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Zap,
  Sparkles,
  Landmark,
  Shield,
  Check,
  AlertTriangle,
  Users,
  Brain,
  FileText,
  Lock,
  ArrowRight,
  RefreshCw,
  X,
  Info,
} from 'lucide-react';
import { AIBadge } from '@/components/ui/AIBadge';
import { billingApi, SubscriptionResponse, PlanId, BillingCycle } from '@/lib/api/billing.api';
import { useAuth } from '@/hooks/useAuth';

// ─── Plan display metadata ────────────────────────────────────────────────────

const PLAN_META: Record<PlanId, {
  label: string; color: string; icon: React.ElementType;
  monthlyDisplay: string; yearlyDisplay: string; tagline: string;
}> = {
  free:       { label: 'Free',       color: '#64748b', icon: Zap,      monthlyDisplay: '₹0',      yearlyDisplay: '₹0',         tagline: 'For exploring SkillSense AI' },
  starter:    { label: 'Starter',    color: '#60a5fa', icon: Zap,      monthlyDisplay: '₹1,999',  yearlyDisplay: '₹1,666/mo',  tagline: 'For small training institutes' },
  growth:     { label: 'Growth',     color: '#f59e0b', icon: Sparkles, monthlyDisplay: '₹4,999',  yearlyDisplay: '₹4,166/mo',  tagline: 'For growing organizations' },
  enterprise: { label: 'Enterprise', color: '#10b981', icon: Landmark, monthlyDisplay: 'Custom',  yearlyDisplay: 'Custom',     tagline: 'For government & universities' },
};

const PLAN_ORDER: PlanId[] = ['free', 'starter', 'growth', 'enterprise'];

function isPaidPlan(plan: PlanId): boolean {
  return plan === 'starter' || plan === 'growth';
}

// ─── Demo mode helpers ────────────────────────────────────────────────────────

function isDemoToken(token: string | null): boolean {
  if (!token) return false;
  return token.startsWith('demo_') || token.includes('demo');
}

function makeDemoSubscriptionData(planId: PlanId = 'growth', cycle: BillingCycle = 'monthly'): SubscriptionResponse {
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);
  return {
    subscription: {
      plan: planId,
      status: 'active',
      billingCycle: cycle,
      provider: 'demo',
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: periodEnd.toISOString(),
      cancelAtPeriodEnd: false,
      activatedAt: now.toISOString(),
    },
    entitlements: {
      bypassedByRole: true, // Demo users always get bypass
      limits: {
        maxTrainees: null,
        maxAIRequestsPerMonth: null,
        maxAssessmentsPerMonth: null,
        maxOutcomeRecords: null,
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
      },
    },
    usage: {
      period: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
      aiRequests: 7,
      traineesCreated: 3,
      assessmentsRun: 2,
      outcomeRecords: 5,
      employerVerifications: 0,
      reportsGenerated: 1,
    },
    isDemoMode: true,
  };
}

// ─── Inline spin animation (no Tailwind) ──────────────────────────────────────

const SPIN_CSS = `@keyframes billing-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;

function Spinner({ size = 18 }: { size?: number }) {
  return (
    <>
      <style>{SPIN_CSS}</style>
      <span style={{ display: 'inline-flex', animation: 'billing-spin 0.75s linear infinite' }}>
        <RefreshCw size={size} />
      </span>
    </>
  );
}

// ─── Usage Meter ──────────────────────────────────────────────────────────────

function UsageMeter({
  label, icon: Icon, used, limit, color,
}: {
  label: string; icon: React.ElementType; used: number; limit: number | null; color: string;
}) {
  const isUnlimited = limit === null;
  const pct = isUnlimited ? 0 : Math.min(100, Math.round((used / Math.max(limit!, 1)) * 100));
  const isWarning = !isUnlimited && pct >= 80;

  return (
    <div className="card-linear" style={{ padding: '13px 16px', borderRadius: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon size={13} color={color} />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1' }}>{label}</span>
        </div>
        <span style={{ fontSize: 11.5, color: isWarning ? '#f87171' : 'var(--text-muted)', fontWeight: 600 }}>
          {isUnlimited ? '∞ Unlimited' : `${used} / ${limit}`}
        </span>
      </div>
      {!isUnlimited && (
        <div style={{ height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 99, width: `${pct}%`,
            background: isWarning ? 'linear-gradient(90deg,#ef4444,#f87171)' : `linear-gradient(90deg,${color}99,${color})`,
            transition: 'width 0.8s ease',
          }} />
        </div>
      )}
    </div>
  );
}

// ─── Plan Option Row ──────────────────────────────────────────────────────────

function PlanOptionRow({
  planId, currentPlan, cycle, onSelect, loading,
}: {
  planId: PlanId; currentPlan: PlanId; cycle: BillingCycle;
  onSelect: (p: PlanId) => void; loading: boolean;
}) {
  const meta = PLAN_META[planId];
  const Icon = meta.icon;
  const isCurrent = planId === currentPlan;
  const isGrowth = planId === 'growth';
  const isEnterprise = planId === 'enterprise';
  const priceDisplay = cycle === 'monthly' ? meta.monthlyDisplay : meta.yearlyDisplay;
  const priceSuffix = (planId !== 'free' && !isEnterprise)
    ? (cycle === 'monthly' ? '/mo' : '/mo, billed yearly') : '';

  return (
    <div style={{
      padding: '14px 18px', borderRadius: 12, display: 'flex',
      justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      border: `1px solid ${isCurrent ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.07)'}`,
      background: isCurrent
        ? 'linear-gradient(135deg,rgba(245,158,11,0.06) 0%,rgba(15,17,26,0.9) 100%)'
        : 'rgba(255,255,255,0.02)',
      opacity: loading ? 0.55 : 1, transition: 'all 0.2s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9, flexShrink: 0,
          background: `${meta.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={16} color={meta.color} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc' }}>{meta.label}</span>
            {isCurrent && (
              <span style={{ fontSize: 9.5, fontWeight: 800, padding: '2px 7px', borderRadius: 99, background: 'rgba(245,158,11,0.15)', color: 'var(--gold)' }}>
                CURRENT
              </span>
            )}
            {isGrowth && !isCurrent && (
              <span style={{ fontSize: 9.5, fontWeight: 800, padding: '2px 7px', borderRadius: 99, background: 'rgba(245,158,11,0.12)', color: 'var(--gold)' }}>
                POPULAR
              </span>
            )}
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{meta.tagline}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: isCurrent ? 'var(--gold)' : '#f8fafc' }}>
            {priceDisplay}
          </span>
          {priceSuffix && <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 2 }}>{priceSuffix}</span>}
        </div>
        {!isCurrent ? (
          <button
            type="button"
            disabled={loading}
            onClick={() => onSelect(planId)}
            className={isGrowth ? 'btn-gold' : 'btn-secondary'}
            style={{ fontSize: 11.5, padding: '6px 14px', whiteSpace: 'nowrap' }}
          >
            {loading ? <Spinner size={12} /> : (isEnterprise ? 'Contact Sales' : <><ArrowRight size={12} /> Switch</>)}
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#10b981', fontWeight: 700 }}>
            <Check size={13} /> Active
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Inner Page Component (uses useSearchParams — must live inside Suspense) ──

function BillingPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  const [data, setData] = useState<SubscriptionResponse | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>('monthly');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [autoUpgradeDone, setAutoUpgradeDone] = useState(false);

  const queryPlan = (searchParams?.get('plan') ?? null) as PlanId | null;
  const queryCycle = (searchParams?.get('cycle') ?? 'monthly') as BillingCycle;

  // Redirect unauthenticated users (skip while auth is still loading)
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      const here = window.location.pathname + window.location.search;
      router.replace(`/auth?redirect=${encodeURIComponent(here)}`);
    }
  }, [authLoading, isAuthenticated, router]);

  const isDemo = isDemoToken(
    typeof window !== 'undefined' ? localStorage.getItem('skillsense_token') : null
  );

  const loadData = useCallback(async () => {
    setPageLoading(true);
    setError('');

    try {
      const subData = await billingApi.getSubscription();
      setData(subData);
      setSelectedCycle(subData.subscription?.billingCycle ?? 'monthly');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number } };
      if (axiosErr?.response?.status === 401) {
        router.replace('/auth');
        return;
      }
      // If backend is offline, provide graceful fallback
      const plan = (queryPlan && ['free','starter','growth','enterprise'].includes(queryPlan))
        ? queryPlan : 'growth';
      setData(makeDemoSubscriptionData(plan as PlanId, queryCycle));
    } finally {
      setPageLoading(false);
    }
  }, [queryPlan, queryCycle, router]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      loadData();
    }
  }, [authLoading, isAuthenticated, loadData]);

  // ── Plan change handlers ────────────────────────────────────────────────────

  const handleChangePlan = useCallback(async (planId: PlanId, cycle: BillingCycle) => {
    if (planId === 'enterprise') { window.location.href = '/#contact'; return; }
    setActionLoading(true);
    setSuccessMsg('');
    setError('');

    try {
      const res = await billingApi.checkout(planId, cycle);
      if (res.success) {
        setSuccessMsg(`${PLAN_META[planId].label} plan activated successfully!`);
        await loadData();
      } else {
        setError(res.message ?? 'Plan change failed. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setActionLoading(false);
    }
  }, [loadData]);

  const handleCancel = async () => {
    if (!window.confirm('Your subscription will remain active until the end of the current period. Continue?')) return;
    setActionLoading(true);
    try {
      const res = await billingApi.cancelSubscription();
      if (res.success) { 
        setSuccessMsg('Subscription scheduled for cancellation at period end.'); 
        await loadData(); 
      } else {
        setError(res.message ?? 'Cancellation failed.');
      }
    } catch { 
      setError('Something went wrong.'); 
    } finally { 
      setActionLoading(false); 
    }
  };

  const handleResume = async () => {
    setActionLoading(true);
    try {
      const res = await billingApi.resumeSubscription();
      if (res.success) { 
        setSuccessMsg('Subscription resumed successfully!'); 
        await loadData(); 
      } else {
        setError(res.message ?? 'Resume failed.');
      }
    } catch { 
      setError('Something went wrong.'); 
    } finally { 
      setActionLoading(false); 
    }
  };

  // Auto-trigger plan switch from landing page CTA query params
  useEffect(() => {
    if (autoUpgradeDone || !queryPlan || !data || pageLoading || actionLoading) return;
    if (queryPlan === data.subscription?.plan) return;
    setAutoUpgradeDone(true);
    handleChangePlan(queryPlan, queryCycle);
  }, [queryPlan, queryCycle, data, pageLoading, actionLoading, autoUpgradeDone, handleChangePlan]);

  // ── Render States ───────────────────────────────────────────────────────────

  if (authLoading || (pageLoading && !data)) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '64px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Spinner size={24} />
        <p style={{ fontSize: 13, marginTop: 14 }}>Loading your billing details...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
        <div className="card-linear" style={{ padding: 32, borderRadius: 14, textAlign: 'center' }}>
          <AlertTriangle size={28} color="#f87171" style={{ margin: '0 auto 12px', display: 'block' }} />
          <p style={{ fontSize: 14, color: '#f87171', marginBottom: 20 }}>{error}</p>
          <button type="button" className="btn-gold" onClick={loadData} style={{ fontSize: 13 }}>
            <RefreshCw size={13} /> Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { subscription, entitlements, usage, isDemoMode } = data;
  const plan = subscription?.plan ?? 'free';
  const currentMeta = PLAN_META[plan] ?? PLAN_META.free;
  const CurrentIcon = currentMeta.icon;
  const renewalDate = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', paddingBottom: 60 }}>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          <AIBadge type="verified" label="BILLING & SUBSCRIPTION" />
          {isDemoMode && <AIBadge type="nsqf" label="DEMO MODE — NO REAL PAYMENT" />}
        </div>
        <h1 className="font-display" style={{ fontSize: 24, fontWeight: 900, color: '#f8fafc', margin: '0 0 4px' }}>
          Billing & <span style={{ color: 'var(--gold)' }}>Subscription</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, margin: 0 }}>
          Manage your plan, usage limits, and billing preferences.
        </p>
        {isDemoMode && (
          <div style={{
            marginTop: 12, padding: '10px 14px', borderRadius: 8,
            background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)',
            fontSize: 12.5, color: '#fbbf24', display: 'flex', alignItems: 'flex-start', gap: 8,
          }}>
            <Shield size={13} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>Demo Mode — subscription changes are simulated locally. No real payment is processed. Safe for SIH26135 demonstration.</span>
          </div>
        )}
      </div>

      {/* ── Success / Error Banners ── */}
      {successMsg && (
        <div style={{
          marginBottom: 16, padding: '10px 14px', borderRadius: 8,
          background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
          fontSize: 13, color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Check size={14} /> {successMsg}
          <button type="button" onClick={() => setSuccessMsg('')} aria-label="Dismiss message" style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><X size={14} /></button>
        </div>
      )}
      {error && data && (
        <div style={{
          marginBottom: 16, padding: '10px 14px', borderRadius: 8,
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
          fontSize: 13, color: '#f87171', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <AlertTriangle size={14} /> {error}
          <button type="button" onClick={() => setError('')} aria-label="Dismiss error" style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><X size={14} /></button>
        </div>
      )}

      {/* ── Current Plan ── */}
      <div className="card-accent" style={{ padding: 22, borderRadius: 16, marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: `${currentMeta.color}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CurrentIcon size={22} color={currentMeta.color} />
            </div>
            <div>
              <p style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>Current Plan</p>
              <h2 className="font-display" style={{ fontSize: 26, fontWeight: 900, color: '#f8fafc', margin: '2px 0 4px' }}>
                {currentMeta.label}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: 10.5, fontWeight: 800, padding: '2px 8px', borderRadius: 99,
                  background: 'rgba(16,185,129,0.15)', color: '#10b981',
                }}>
                  ACTIVE
                </span>
                {subscription?.cancelAtPeriodEnd && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#f87171' }}>Cancels {renewalDate}</span>
                )}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            {isPaidPlan(plan) && (
              <>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 2px' }}>Billing Cycle</p>
                <p style={{ fontSize: 13.5, fontWeight: 700, color: '#f8fafc', margin: '0 0 8px', textTransform: 'capitalize' }}>
                  {subscription?.billingCycle ?? 'monthly'}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 2px' }}>
                  {subscription?.cancelAtPeriodEnd ? 'Access Until' : 'Renews'}
                </p>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc', margin: 0 }}>{renewalDate}</p>
              </>
            )}
            {plan === 'free' && (
              <p style={{ fontSize: 12.5, color: 'var(--text-muted)', margin: 0 }}>Forever free — no renewal</p>
            )}
          </div>
        </div>

        {isPaidPlan(plan) && (
          <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {subscription?.cancelAtPeriodEnd ? (
              <button type="button" onClick={handleResume} disabled={actionLoading} className="btn-gold" style={{ fontSize: 12.5 }}>
                {actionLoading ? <Spinner size={12} /> : <Check size={13} />}
                Resume Subscription
              </button>
            ) : (
              <button type="button" onClick={handleCancel} disabled={actionLoading} className="btn-secondary" style={{ fontSize: 12.5 }}>
                {actionLoading ? <Spinner size={12} /> : null}
                Cancel at Period End
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Usage This Period ── */}
      <div className="card-linear" style={{ padding: 20, borderRadius: 16, marginBottom: 18 }}>
        <h3 className="font-display" style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 7 }}>
          <Zap size={14} color="var(--gold)" />
          Usage This Period
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400, marginLeft: 2 }}>({usage?.period ?? '—'})</span>
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 10 }}>
          <UsageMeter label="AI Analyses"        icon={Brain}    used={usage?.aiRequests ?? 0}       limit={entitlements?.bypassedByRole ? null : (entitlements?.limits?.maxAIRequestsPerMonth ?? 20)}  color="var(--gold)" />
          <UsageMeter label="Trainees Enrolled"  icon={Users}    used={usage?.traineesCreated ?? 0}  limit={entitlements?.bypassedByRole ? null : (entitlements?.limits?.maxTrainees ?? 10)}            color="#60a5fa" />
          <UsageMeter label="Assessments Run"    icon={Zap}      used={usage?.assessmentsRun ?? 0}   limit={entitlements?.bypassedByRole ? null : (entitlements?.limits?.maxAssessmentsPerMonth ?? 5)}  color="#10b981" />
          <UsageMeter label="Outcome Records"    icon={FileText} used={usage?.outcomeRecords ?? 0}   limit={entitlements?.bypassedByRole ? null : (entitlements?.limits?.maxOutcomeRecords ?? null)}    color="#c084fc" />
        </div>
        {entitlements?.bypassedByRole && (
          <div style={{ marginTop: 12, fontSize: 12, color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Lock size={12} /> Your role has unlimited access — no quota limits apply.
          </div>
        )}
      </div>

      {/* ── Available Plans ── */}
      <div className="card-linear" style={{ padding: 20, borderRadius: 16, marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <h3 className="font-display" style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc', margin: 0 }}>Available Plans</h3>
          <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 99, padding: 3, gap: 3 }}>
            {(['monthly', 'yearly'] as BillingCycle[]).map((c) => (
              <button
                key={c} type="button" onClick={() => setSelectedCycle(c)}
                style={{
                  padding: '5px 14px', borderRadius: 99, fontSize: 11.5, fontWeight: 700,
                  cursor: 'pointer', border: 'none', transition: 'all 0.15s ease',
                  background: selectedCycle === c ? 'var(--gold)' : 'transparent',
                  color: selectedCycle === c ? '#090a0f' : 'var(--text-secondary)',
                }}
              >
                {c === 'monthly' ? 'Monthly' : 'Yearly (Save 17%)'}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {PLAN_ORDER.map((pid) => (
            <PlanOptionRow
              key={pid}
              planId={pid}
              currentPlan={plan}
              cycle={selectedCycle}
              onSelect={(p) => handleChangePlan(p, selectedCycle)}
              loading={actionLoading}
            />
          ))}
        </div>
      </div>

      {/* ── Security Note ── */}
      <div style={{
        padding: '12px 16px', borderRadius: 10,
        background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.12)',
        display: 'flex', alignItems: 'flex-start', gap: 9,
      }}>
        <Shield size={14} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
          {isDemoMode
            ? 'DEMO MODE: No real payment is processed. This simulates the full billing lifecycle for demonstration (SIH26135). All changes are local or in demo mode DB.'
            : 'Your payment information is never stored on our servers. All transactions are processed through a PCI-compliant payment provider with SHA-256 verification.'}
        </p>
      </div>

    </div>
  );
}

// ─── Exported Page — wraps inner in Suspense (required for useSearchParams) ──

export default function BillingPage() {
  return (
    <Suspense fallback={
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '64px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
        Loading billing details...
      </div>
    }>
      <BillingPageInner />
    </Suspense>
  );
}
