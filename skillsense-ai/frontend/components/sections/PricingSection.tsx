'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Check,
  X,
  Sparkles,
  Zap,
  Building2,
  Landmark,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// ─── Plan Data (display-only — never used for pricing logic) ──────────────────

type PlanId = 'free' | 'starter' | 'growth' | 'enterprise';
type BillingCycle = 'monthly' | 'yearly';

interface DisplayPlan {
  id: PlanId;
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  yearlyPerMonth: number;
  isPopular: boolean;
  isCustom: boolean;
  ctaLabel: string;
  ctaRoute: string; // Where CTA leads
  color: string;
  icon: React.ElementType;
  features: string[];
  notIncluded: string[];
}

const PLANS: DisplayPlan[] = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Explore SkillSense AI at no cost.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    yearlyPerMonth: 0,
    isPopular: false,
    isCustom: false,
    ctaLabel: 'Start Free',
    ctaRoute: '/auth',
    color: '#64748b',
    icon: Zap,
    features: [
      'Up to 10 trainees',
      '20 AI skill analyses / month',
      '5 assessments / month',
      'Basic student milestone journey',
      'Verifiable SHA-256 Skill Passport',
      'Community support',
    ],
    notIncluded: [
      'Outcome & retention tracking',
      'Advanced analytics',
      'AI Policy Copilot',
      'Employer verification portal',
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'For small training institutes getting started.',
    monthlyPrice: 1999,
    yearlyPrice: 19990,
    yearlyPerMonth: 1666,
    isPopular: false,
    isCustom: false,
    ctaLabel: 'Start Starter',
    ctaRoute: '/settings/billing',
    color: '#60a5fa',
    icon: Zap,
    features: [
      'Up to 100 trainees',
      '200 AI skill analyses / month',
      '100 assessments / month',
      'Outcome & retention tracking',
      'Employer verification portal',
      'Basic reports & CSV exports',
      'Email support',
    ],
    notIncluded: [
      'Advanced district analytics',
      'Wage progression analytics',
      'AI Policy Copilot',
      'Skill-gap intelligence',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    tagline: 'For growing organizations managing multi-cohort programs.',
    monthlyPrice: 4999,
    yearlyPrice: 49990,
    yearlyPerMonth: 4166,
    isPopular: true,
    isCustom: false,
    ctaLabel: 'Start Growth',
    ctaRoute: '/settings/billing',
    color: '#f59e0b',
    icon: Sparkles,
    features: [
      'Up to 500 trainees',
      '1,000 AI skill analyses / month',
      '500 assessments / month',
      'Everything in Starter',
      'Advanced outcome analytics',
      'Wage progression & retention curves',
      'AI Policy Copilot',
      'Skill-gap intelligence',
      'District & cohort reports',
      'Priority support',
    ],
    notIncluded: [],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'For government, universities & large-scale training networks.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    yearlyPerMonth: 0,
    isPopular: false,
    isCustom: true,
    ctaLabel: 'Contact Sales',
    ctaRoute: '/#contact',
    color: '#10b981',
    icon: Landmark,
    features: [
      'Unlimited trainees & capacity',
      'Everything in Growth',
      'Government-scale analytics',
      'Custom dashboards & white-label',
      'Advanced RBAC & org controls',
      'API access & custom integrations',
      'Dedicated account manager & SLA',
      'Custom data retention & compliance',
      'DPDP Act 2023 sovereign data controls',
    ],
    notIncluded: [],
  },
];

// ─── Comparison Table Data ────────────────────────────────────────────────────

const COMPARISON_ROWS = [
  { category: 'Platform', feature: 'Trainee capacity', free: '10', starter: '100', growth: '500', enterprise: 'Unlimited' },
  { category: 'Platform', feature: 'Assessments / month', free: '5', starter: '100', growth: '500', enterprise: 'Unlimited' },
  { category: 'Platform', feature: 'Outcome tracking', free: false, starter: true, growth: true, enterprise: true },
  { category: 'AI', feature: 'AI analyses / month', free: '20', starter: '200', growth: '1,000', enterprise: 'Unlimited' },
  { category: 'AI', feature: 'AI Career Insights', free: false, starter: false, growth: true, enterprise: true },
  { category: 'AI', feature: 'AI Policy Copilot', free: false, starter: false, growth: true, enterprise: true },
  { category: 'Analytics', feature: 'District analytics', free: false, starter: false, growth: true, enterprise: true },
  { category: 'Analytics', feature: 'Wage progression', free: false, starter: false, growth: true, enterprise: true },
  { category: 'Analytics', feature: 'Retention analytics', free: false, starter: false, growth: true, enterprise: true },
  { category: 'Analytics', feature: 'Skill-gap intelligence', free: false, starter: false, growth: true, enterprise: true },
  { category: 'Operations', feature: 'Employer verification', free: false, starter: true, growth: true, enterprise: true },
  { category: 'Operations', feature: 'Reports & exports', free: '2/mo', starter: '10/mo', growth: '50/mo', enterprise: 'Unlimited' },
  { category: 'Operations', feature: 'API access', free: false, starter: false, growth: false, enterprise: true },
  { category: 'Enterprise', feature: 'Custom integrations', free: false, starter: false, growth: false, enterprise: true },
  { category: 'Enterprise', feature: 'Custom dashboards', free: false, starter: false, growth: false, enterprise: true },
  { category: 'Enterprise', feature: 'SLA & dedicated support', free: false, starter: false, growth: false, enterprise: true },
];

// ─── Helper: format price ─────────────────────────────────────────────────────
function fmtPrice(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}

function calcSavings(monthly: number, yearly: number): number {
  if (monthly === 0) return 0;
  return Math.round(((monthly * 12 - yearly) / (monthly * 12)) * 100);
}

// ─── InView hook ─────────────────────────────────────────────────────────────
function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { rootMargin: '-80px' }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

// ─── Cell renderer for comparison table ──────────────────────────────────────
function TableCell({ value, isGrowth }: { value: string | boolean; isGrowth?: boolean }) {
  if (typeof value === 'boolean') {
    return value ? (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Check size={15} color={isGrowth ? '#f59e0b' : '#10b981'} />
      </div>
    ) : (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <X size={13} color='#334155' />
      </div>
    );
  }
  return (
    <span style={{ fontSize: 12, color: isGrowth ? '#f59e0b' : '#94a3b8', fontWeight: isGrowth ? 700 : 400 }}>
      {value}
    </span>
  );
}

// ─── PricingSection ───────────────────────────────────────────────────────────

export default function PricingSection() {
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [showComparison, setShowComparison] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef);
  const router = useRouter();

  const savingsPercent = calcSavings(4999, 49990); // Use Growth plan (most relevant) for badge

  const handleCta = (plan: DisplayPlan) => {
    // Enterprise: anchor to contact section
    if (plan.isCustom) {
      window.location.href = '/#contact';
      return;
    }
    // Free: go to auth
    if (plan.id === 'free') {
      router.push('/auth');
      return;
    }
    // Paid: go to billing page (redirects to auth if unauthenticated)
    router.push(`/settings/billing?plan=${plan.id}&cycle=${cycle}`);
  };

  return (
    <section
      ref={sectionRef}
      id="pricing"
      style={{
        padding: '100px 24px',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.05) 0%, transparent 60%)',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 60,
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: 99, padding: '5px 14px', marginBottom: 20,
          }}>
            <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Plans for Every Scale
            </span>
          </div>

          <h2
            className="font-display"
            style={{ fontSize: 'clamp(30px, 4vw, 50px)', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 14px', lineHeight: 1.1 }}
          >
            Start Small.{' '}
            <span style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Scale Your Impact.
            </span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 600, margin: '0 auto 32px' }}>
            Flexible plans for training providers, institutions, and organizations tracking skills,
            employment outcomes, and long-term workforce impact.
          </p>

          {/* ── Billing Cycle Toggle ── */}
          <div style={{
            display: 'inline-flex', alignItems: 'center',
            background: 'var(--bg-surface-elevated)', border: '1px solid var(--border)',
            borderRadius: 99, padding: 4, gap: 4,
          }}>
            {(['monthly', 'yearly'] as BillingCycle[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCycle(c)}
                style={{
                  padding: '7px 18px', borderRadius: 99, fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', border: 'none', transition: 'all 0.2s ease',
                  background: cycle === c ? 'var(--gold)' : 'transparent',
                  color: cycle === c ? '#090a0f' : 'var(--text-secondary)',
                }}
              >
                {c === 'monthly' ? 'Monthly' : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    Yearly
                    <span style={{
                      fontSize: 10, fontWeight: 800, padding: '1px 6px',
                      borderRadius: 99,
                      background: cycle === 'yearly' ? 'rgba(9,10,15,0.25)' : 'rgba(16,185,129,0.15)',
                      color: cycle === 'yearly' ? '#090a0f' : '#10b981',
                    }}>
                      Save {savingsPercent}%
                    </span>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Plan Cards ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 20,
          alignItems: 'start',
          marginBottom: 48,
        }}>
          {PLANS.map((plan, i) => {
            const Icon = plan.icon;
            const isGrowth = plan.id === 'growth';
            const displayPrice = cycle === 'monthly'
              ? (plan.isCustom ? 'Custom' : plan.monthlyPrice === 0 ? '₹0' : fmtPrice(plan.monthlyPrice))
              : (plan.isCustom ? 'Custom' : plan.yearlyPrice === 0 ? '₹0' : fmtPrice(plan.yearlyPerMonth));
            const subLabel = plan.isCustom
              ? 'Negotiated annually'
              : plan.monthlyPrice === 0 ? 'Forever free'
              : cycle === 'monthly' ? '/month' : '/month, billed yearly';

            return (
              <div
                key={plan.id}
                className={isGrowth ? 'pricing-card-growth' : 'pricing-card-standard'}
                style={{
                  position: 'relative',
                  borderRadius: 18,
                  padding: '28px 24px',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  transform: isGrowth ? 'scale(1.03)' : 'scale(1)',
                  opacity: inView ? 1 : 0,
                  animationDelay: `${i * 100}ms`,
                  backdropFilter: 'blur(12px)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = isGrowth ? 'scale(1.03) translateY(-8px)' : 'translateY(-8px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = isGrowth
                    ? '0 24px 64px rgba(245,158,11,0.2)'
                    : '0 16px 48px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = isGrowth ? 'scale(1.03)' : 'scale(1)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                {/* Most Popular badge */}
                {plan.isPopular && (
                  <div style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                    color: '#090a0f', fontSize: 10.5, fontWeight: 900,
                    padding: '4px 14px', borderRadius: 99, letterSpacing: '0.04em',
                    whiteSpace: 'nowrap',
                  }}>
                    ✦ Most Popular
                  </div>
                )}

                {/* Plan Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: `rgba(${plan.id === 'free' ? '100,116,139' : plan.id === 'starter' ? '96,165,250' : plan.id === 'growth' ? '245,158,11' : '16,185,129'},0.12)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={18} color={plan.color} />
                  </div>
                  <div>
                    <h3 className="font-display" style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      {plan.name}
                    </h3>
                    <p style={{ fontSize: 11.5, color: 'var(--text-muted)', margin: 0 }}>
                      {plan.tagline}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span
                      className="font-display"
                      style={{ fontSize: plan.isCustom ? 28 : 38, fontWeight: 900, color: isGrowth ? 'var(--gold)' : 'var(--text-primary)' }}
                    >
                      {displayPrice}
                    </span>
                    {!plan.isCustom && (
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{subLabel}</span>
                    )}
                  </div>
                  {plan.isCustom && (
                    <p style={{ fontSize: 12.5, color: 'var(--text-muted)', margin: '4px 0 0' }}>{subLabel}</p>
                  )}
                  {/* Yearly savings callout */}
                  {cycle === 'yearly' && !plan.isCustom && plan.monthlyPrice > 0 && (
                    <div style={{
                      marginTop: 6, fontSize: 11.5, color: '#10b981', fontWeight: 700,
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      <ShieldCheck size={12} />
                      You save {fmtPrice(plan.monthlyPrice * 12 - plan.yearlyPrice)} / year
                    </div>
                  )}
                </div>

                {/* Features */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 24 }}>
                  {plan.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                      <Check size={14} color={isGrowth ? 'var(--gold)' : '#10b981'} style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{f}</span>
                    </div>
                  ))}
                  {plan.notIncluded.slice(0, 2).map((f, j) => (
                    <div key={`x${j}`} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                      <X size={13} color='var(--text-disabled)' style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.4 }}>{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button
                  type="button"
                  onClick={() => handleCta(plan)}
                  style={{
                    width: '100%', padding: '12px 0', borderRadius: 12,
                    fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    fontFamily: "'Space Grotesk', sans-serif",
                    transition: 'all 0.2s ease',
                    background: isGrowth
                      ? 'linear-gradient(135deg, #f59e0b, #fbbf24)'
                      : 'transparent',
                    border: isGrowth ? 'none' : `1px solid rgba(255,255,255,0.12)`,
                    color: isGrowth ? '#090a0f' : '#f8fafc',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}
                  onMouseEnter={e => {
                    if (!isGrowth) {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)';
                    } else {
                      (e.currentTarget as HTMLElement).style.opacity = '0.9';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isGrowth) {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)';
                    } else {
                      (e.currentTarget as HTMLElement).style.opacity = '1';
                    }
                  }}
                >
                  {plan.ctaLabel}
                  {!plan.isCustom && <ArrowRight size={14} />}
                </button>
              </div>
            );
          })}
        </div>

        {/* ── Trust Strip ── */}
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginBottom: 40 }}>
          Every plan includes secure authentication, DPDP Act 2023 consent handling, cryptographic skill passports, and outcome tracking foundation.
        </p>

        {/* ── Plan Comparison Toggle ── */}
        <div style={{ textAlign: 'center', marginBottom: showComparison ? 24 : 0 }}>
          <button
            type="button"
            onClick={() => setShowComparison((v) => !v)}
            style={{
              background: 'transparent', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600,
              padding: '8px 20px', borderRadius: 8, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              transition: 'all 0.15s ease',
            }}
          >
            {showComparison ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {showComparison ? 'Hide' : 'View'} Full Feature Comparison
          </button>
        </div>

        {/* ── Comparison Table ── */}
        {showComparison && (
          <div style={{ overflowX: 'auto', marginTop: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '10px 14px', fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, width: '35%' }}>
                    Feature
                  </th>
                  {(['Free', 'Starter', 'Growth', 'Enterprise'] as const).map((name) => (
                    <th
                      key={name}
                      style={{
                        textAlign: 'center', padding: '10px 8px', fontSize: 12,
                        color: name === 'Growth' ? 'var(--gold)' : '#f8fafc',
                        fontWeight: 800,
                      }}
                    >
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr
                    key={i}
                    style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <td style={{ padding: '9px 14px', fontSize: 12.5, color: 'var(--text-secondary)' }}>
                      {row.feature}
                    </td>
                    <td style={{ textAlign: 'center', padding: '9px 8px' }}>
                      <TableCell value={row.free} />
                    </td>
                    <td style={{ textAlign: 'center', padding: '9px 8px' }}>
                      <TableCell value={row.starter} />
                    </td>
                    <td style={{
                      textAlign: 'center', padding: '9px 8px',
                      background: 'rgba(245,158,11,0.04)',
                    }}>
                      <TableCell value={row.growth} isGrowth />
                    </td>
                    <td style={{ textAlign: 'center', padding: '9px 8px' }}>
                      <TableCell value={row.enterprise} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
