'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  CreditCard,
  Zap,
  Sparkles,
  Landmark,
  Shield,
  Check,
  X,
  AlertTriangle,
  RefreshCw,
  ArrowUpRight,
  Calendar,
  Users,
  Brain,
  FileText,
  ChevronRight,
  Lock,
} from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { AIBadge } from '@/components/ui/AIBadge';
import { billingApi, SubscriptionResponse, PlanId, BillingCycle } from '@/lib/api/billing.api';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

// ─── Plan display metadata ───────────────────────────────────────────────────

const PLAN_META: Record<PlanId, {
  label: string; color: string; icon: React.ElementType;
  monthlyDisplay: string; yearlyDisplay: string;
}> = {
  free:       { label: 'Free',       color: '#64748b', icon: Zap,      monthlyDisplay: '₹0',      yearlyDisplay: '₹0' },
  starter:    { label: 'Starter',    color: '#60a5fa', icon: Zap,      monthlyDisplay: '₹1,999',  yearlyDisplay: '₹19,990/yr' },
  growth:     { label: 'Growth',     color: '#f59e0b', icon: Sparkles, monthlyDisplay: '₹4,999',  yearlyDisplay: '₹49,990/yr' },
  enterprise: { label: 'Enterprise', color: '#10b981', icon: Landmark, monthlyDisplay: 'Custom',  yearlyDisplay: 'Custom' },
};

const PLAN_ORDER: PlanId[] = ['free', 'starter', 'growth', 'enterprise'];

function isPaidPlan(plan: PlanId): boolean {
  return plan === 'starter' || plan === 'growth';
}

// ─── Usage Meter Component ────────────────────────────────────────────────────

function UsageMeter({
  label, icon: Icon, used, limit, color,
}: {
  label: string;
  icon: React.ElementType;
  used: number;
  limit: number | null;
  color: string;
}) {
  const pct = limit === null ? 0 : Math.min(100, Math.round((used / limit) * 100));
  const isUnlimited = limit === null;
  const isWarning = !isUnlimited && pct >= 80;

  return (
    <div className="card-linear" style={{ padding: '14px 16px', borderRadius: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Icon size={14} color={color} />
          <span style={{ fontSize: 12.5, fontWeight: 700, color: '#cbd5e1' }}>{label}</span>
        </div>
        <span style={{ fontSize: 12, color: isWarning ? '#f87171' : 'var(--text-muted)' }}>
          {isUnlimited ? '∞ Unlimited' : `${used.toLocaleString()} / ${limit!.toLocaleString()}`}
        </span>
      </div>
      {!isUnlimited && (
        <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 99,
            width: `${pct}%`,
            background: isWarning
              ? 'linear-gradient(90deg, #ef4444, #f87171)'
              : `linear-gradient(90deg, ${color}, ${color}88)`,
            transition: 'width 0.8s ease',
          }} />
        </div>
      )}
    </div>
  );
}

// ─── Plan Card (in billing page) ─────────────────────────────────────────────

function PlanOption({
  planId, currentPlan, cycle, onSelect, loading,
}: {
  planId: PlanId;
  currentPlan: PlanId;
  cycle: BillingCycle;
  onSelect: (p: PlanId) => void;
  loading: boolean;
}) {
  const meta = PLAN_META[planId];
  const Icon = meta.icon;
  const isCurrent = planId === currentPlan;
  const isEnterprise = planId === 'enterprise';
  const priceDisplay = cycle === 'monthly' ? meta.monthlyDisplay : meta.yearlyDisplay;

  return (
    <div
      className={isCurrent ? 'card-accent' : 'card-linear'}
      style={{
        padding: '16px 18px', borderRadius: 12,
        border: isCurrent ? '1.5px solid rgba(245,158,11,0.5)' : undefined,
        opacity: loading ? 0.6 : 1,
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: `${meta.color}1a`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={16} color={meta.color} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 6 }}>
              {meta.label}
              {isCurrent && (
                <span style={{
                  fontSize: 9.5, fontWeight: 800, padding: '2px 7px', borderRadius: 99,
                  background: 'rgba(245,158,11,0.15)', color: 'var(--gold)',
                }}>CURRENT</span>
              )}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {priceDisplay}{planId !== 'free' && planId !== 'enterprise' ? (cycle === 'monthly' ? '/month' : '/year') : ''}
            </div>
          </div>
        </div>

        {!isCurrent && (
          <button
            type="button"
            disabled={loading}
            onClick={() => onSelect(planId)}
            className={planId === 'growth' ? 'btn-gold' : 'btn-secondary'}
            style={{ fontSize: 11.5, padding: '5px 12px' }}
          >
            {isEnterprise ? 'Contact Sales' : 'Switch'}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Billing Page ─────────────────────────────────────────────────────────────

export default function BillingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<SubscriptionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>('monthly');
  const [error, setError] = useState('');

  // Read query params (from landing page CTA: ?plan=growth&cycle=monthly)
  const queryPlan = searchParams?.get('plan') as PlanId | null;
  const queryCycle = searchParams?.get('cycle') as BillingCycle | null;

  const fetchSubscription = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const subData = await billingApi.getSubscription();
      setData(subData);
      setSelectedCycle(subData.subscription.billingCycle ?? 'monthly');
    } catch {
      setError('Unable to load subscription data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  // Auto-trigger checkout if query params are present (from landing page CTA)
  useEffect(() => {
    if (!queryPlan || !data || loading) return;
    if (queryPlan === data.subscription.plan) return; // Already on this plan
    const planCycle = (queryCycle ?? 'monthly') as BillingCycle;
    handleChangePlan(queryPlan, planCycle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryPlan, data, loading]);

  const handleChangePlan = async (planId: PlanId, cycle: BillingCycle) => {
    if (planId === 'enterprise') {
      window.location.href = '/#contact';
      return;
    }

    setActionLoading(true);
    try {
      const res = await billingApi.checkout(planId, cycle);
      if (res.success) {
        toast.success(`Plan activated: ${PLAN_META[planId].label}!`);
        confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 }, colors: ['#f59e0b', '#10b981'] });
        await fetchSubscription();
      } else {
        toast.error(res.message ?? 'Plan change failed.');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Cancel your subscription at the end of the current period?')) return;
    setActionLoading(true);
    try {
      const res = await billingApi.cancelSubscription();
      if (res.success) {
        toast.success('Subscription scheduled for cancellation.');
        await fetchSubscription();
      } else {
        toast.error(res.message ?? 'Cancellation failed.');
      }
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResume = async () => {
    setActionLoading(true);
    try {
      const res = await billingApi.resumeSubscription();
      if (res.success) {
        toast.success('Cancellation reversed — subscription active!');
        await fetchSubscription();
      } else {
        toast.error(res.message ?? 'Resume failed.');
      }
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', color: '#f8fafc' }}>
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 12px' }} />
          <p style={{ fontSize: 14 }}>Loading your billing details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', color: '#f8fafc' }}>
        <div className="card-linear" style={{ padding: 24, borderRadius: 14, textAlign: 'center' }}>
          <AlertTriangle size={28} color="#f87171" style={{ margin: '0 auto 12px' }} />
          <p style={{ fontSize: 14, color: '#f87171', marginBottom: 16 }}>{error}</p>
          <button type="button" className="btn-gold" onClick={fetchSubscription} style={{ fontSize: 13 }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { subscription, entitlements, usage, isDemoMode } = data;
  const currentMeta = PLAN_META[subscription.plan] ?? PLAN_META.free;
  const CurrentIcon = currentMeta.icon;
  const renewalDate = new Date(subscription.currentPeriodEnd).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <ErrorBoundary>
      <FadeIn style={{ maxWidth: 900, margin: '0 auto', paddingBottom: 60 }}>

        {/* ── Page Header ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <AIBadge type="verified" label="SUBSCRIPTION & BILLING MANAGEMENT" />
            {isDemoMode && (
              <AIBadge type="nsqf" label="🧪 DEMO BILLING MODE — NO REAL PAYMENT" />
            )}
          </div>
          <h1 className="font-display" style={{ fontSize: 24, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            Billing & <span style={{ color: 'var(--gold)' }}>Subscription</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
            Manage your plan, usage limits, and billing preferences.
          </p>
          {isDemoMode && (
            <div style={{
              marginTop: 12, padding: '10px 14px', borderRadius: 8,
              background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
              fontSize: 12.5, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: 7,
            }}>
              <Shield size={13} />
              Demo Mode: Subscription changes are stored in the database but no real payment is charged. This is safe for SIH demonstration.
            </div>
          )}
        </div>

        {/* ── Current Plan Card ── */}
        <div className="card-accent" style={{ padding: 22, borderRadius: 16, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: `${currentMeta.color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CurrentIcon size={22} color={currentMeta.color} />
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                  Current Plan
                </p>
                <h2 className="font-display" style={{ fontSize: 26, fontWeight: 900, color: '#f8fafc', margin: '2px 0' }}>
                  {currentMeta.label}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 99,
                    background: subscription.status === 'active' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                    color: subscription.status === 'active' ? '#10b981' : '#f87171',
                  }}>
                    {subscription.status.toUpperCase()}
                  </span>
                  {subscription.cancelAtPeriodEnd && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#f87171' }}>
                      Cancels {renewalDate}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              {isPaidPlan(subscription.plan) && (
                <>
                  <p style={{ fontSize: 11.5, color: 'var(--text-muted)', margin: '0 0 2px' }}>
                    Billing Cycle
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', margin: 0, textTransform: 'capitalize' }}>
                    {subscription.billingCycle}
                  </p>
                  <p style={{ fontSize: 11.5, color: 'var(--text-muted)', margin: '8px 0 2px' }}>
                    {subscription.cancelAtPeriodEnd ? 'Access Until' : 'Renews'}
                  </p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                    {renewalDate}
                  </p>
                </>
              )}
              {subscription.plan === 'free' && (
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No renewal — forever free</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {isPaidPlan(subscription.plan) && (
            <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {subscription.cancelAtPeriodEnd ? (
                <button
                  type="button"
                  onClick={handleResume}
                  disabled={actionLoading}
                  className="btn-gold"
                  style={{ fontSize: 12.5 }}
                >
                  {actionLoading ? <RefreshCw size={13} className="animate-spin" /> : <Check size={13} />}
                  Resume Subscription
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={actionLoading}
                  className="btn-secondary"
                  style={{ fontSize: 12.5 }}
                >
                  Cancel at Period End
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Usage Meters ── */}
        <div className="card-linear" style={{ padding: 22, borderRadius: 16, marginBottom: 20 }}>
          <h3 className="font-display" style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 7 }}>
            <Zap size={16} color="var(--gold)" /> Usage This Period
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400, marginLeft: 4 }}>
              ({usage.period})
            </span>
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            <UsageMeter
              label="AI Analyses"
              icon={Brain}
              used={usage.aiRequests}
              limit={entitlements.bypassedByRole ? null : entitlements.limits.maxAIRequestsPerMonth}
              color="var(--gold)"
            />
            <UsageMeter
              label="Trainees Enrolled"
              icon={Users}
              used={usage.traineesCreated}
              limit={entitlements.bypassedByRole ? null : entitlements.limits.maxTrainees}
              color="#60a5fa"
            />
            <UsageMeter
              label="Assessments Run"
              icon={Zap}
              used={usage.assessmentsRun}
              limit={entitlements.bypassedByRole ? null : entitlements.limits.maxAssessmentsPerMonth}
              color="#10b981"
            />
            <UsageMeter
              label="Outcome Records"
              icon={FileText}
              used={usage.outcomeRecords}
              limit={entitlements.bypassedByRole ? null : entitlements.limits.maxOutcomeRecords}
              color="#c084fc"
            />
          </div>
          {entitlements.bypassedByRole && (
            <p style={{ fontSize: 12, color: '#10b981', marginTop: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
              <Lock size={12} />
              Your role has unlimited access to all features. No quota limits apply.
            </p>
          )}
        </div>

        {/* ── Upgrade / Change Plan ── */}
        <div className="card-linear" style={{ padding: 22, borderRadius: 16, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <h3 className="font-display" style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Available Plans
            </h3>

            {/* Billing Cycle Toggle */}
            <div style={{
              display: 'flex', background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border)', borderRadius: 99, padding: 3, gap: 3,
            }}>
              {(['monthly', 'yearly'] as BillingCycle[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedCycle(c)}
                  style={{
                    padding: '5px 14px', borderRadius: 99, fontSize: 12, fontWeight: 700,
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PLAN_ORDER.map((planId) => (
              <PlanOption
                key={planId}
                planId={planId}
                currentPlan={subscription.plan}
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
          background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)',
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <Shield size={15} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
            {isDemoMode
              ? 'DEMO MODE: No real payment is processed. This simulates the billing flow for demonstration purposes.'
              : 'Your payment information is never stored on our servers. All transactions are processed through our PCI-compliant payment provider with SHA-256 verification.'}
          </p>
        </div>

      </FadeIn>
    </ErrorBoundary>
  );
}
