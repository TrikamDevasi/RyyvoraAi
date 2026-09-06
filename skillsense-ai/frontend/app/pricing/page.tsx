// frontend/app/pricing/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import PublicPageShell from '@/components/public/PublicPageShell';
import { createPageMetadata } from '@/lib/seo';
import {
  Check,
  Zap,
  Building2,
  Landmark,
  ArrowRight,
  ShieldCheck,
  Star,
  HelpCircle,
} from 'lucide-react';

export const metadata: Metadata = createPageMetadata({
  title: 'Enterprise & Institutional Pricing | Ryyvora AI',
  description:
    'Transparent pricing plans for Training Institutes, Enterprise Employers, and Government Directorates. Free forever for students and trainees.',
  path: '/pricing',
  keywords: [
    'Ryyvora AI Pricing',
    'Workforce Platform Plans',
    'Training Institute Subscription',
    'Enterprise Talent Intelligence Cost',
    'Government Skilling Telemetry Pricing',
  ],
});

export default function PricingPage() {
  const PLANS = [
    {
      id: 'free',
      name: 'Free Trainee & Starter',
      tagline: 'Permanent access for candidates and single classrooms.',
      monthlyPrice: '₹0',
      period: 'forever free',
      isPopular: false,
      badge: 'Free Forever',
      ctaLabel: 'Get Started Free',
      ctaHref: '/auth?tab=signup',
      features: [
        'Permanent Verifiable Skill Passport',
        'Unlimited SHA-256 credential storage',
        '20 AI diagnostic analyses / month',
        'Public verifiable QR code & share link',
        'DPDP Act 2023 consent dashboard',
      ],
    },
    {
      id: 'starter',
      name: 'Training Institute Starter',
      tagline: 'For regional training centers, ITIs, and polytechnics.',
      monthlyPrice: '₹1,999',
      period: 'per month billed annually',
      isPopular: false,
      badge: 'Academia',
      ctaLabel: 'Subscribe Starter',
      ctaHref: '/auth?tab=signup',
      features: [
        'Up to 100 active trainees per batch',
        'Automated W3C credential issuance',
        'Curriculum-to-market alignment radar',
        'Batch placement ROI analytics',
        'Exportable NCVET compliance reports',
      ],
    },
    {
      id: 'growth',
      name: 'Enterprise Employer',
      tagline: 'For corporate hiring teams and high-growth tech firms.',
      monthlyPrice: '₹4,999',
      period: 'per month billed annually',
      isPopular: true,
      badge: 'Most Popular',
      ctaLabel: 'Start Employer Trial',
      ctaHref: '/auth?tab=signup',
      features: [
        'Full access to verified talent pool',
        'Unlimited cryptographic hash verifications',
        'Automated 90-day retention tracking',
        'HRIS & ATS webhook integrations',
        '1-click workplace milestone attestation',
        'Dedicated account manager',
      ],
    },
    {
      id: 'enterprise',
      name: 'Sovereign Government',
      tagline: 'For state skill directorates, ministries, and councils.',
      monthlyPrice: 'Custom',
      period: 'statewide annual contract',
      isPopular: false,
      badge: 'Directorate',
      ctaLabel: 'Contact Directorate Team',
      ctaHref: '/contact',
      features: [
        'Statewide district workforce heatmaps',
        'CSR skill voucher allocation engine',
        'NSQF Level 4–8 compliance audits',
        'Dedicated on-prem or sovereign cloud cluster',
        'CAG audit-ready cryptographic trails',
        'Custom integration with state MIS portals',
      ],
    },
  ];

  return (
    <PublicPageShell
      badge="Transparent Institutional Licensing"
      title="Transparent Pricing for Workforce Outcome Intelligence"
      subtitle="Predictable, ROI-driven subscription plans for vocational institutes, enterprise employers, and state governments. 100% free forever for candidates."
      breadcrumbs={[{ name: 'Pricing', path: '/pricing' }]}
    >
      {/* Pricing Cards Grid */}
      <section style={{ marginBottom: 56 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className="card-linear"
              style={{
                padding: 28,
                borderRadius: 16,
                background: plan.isPopular
                  ? 'linear-gradient(180deg, rgba(245,158,11,0.08) 0%, rgba(15,17,26,0.95) 100%)'
                  : 'rgba(255,255,255,0.02)',
                border: plan.isPopular
                  ? '1px solid rgba(245,158,11,0.4)'
                  : '1px solid rgba(255,255,255,0.08)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: plan.isPopular ? 'var(--gold, #f59e0b)' : '#94a3b8',
                      background: plan.isPopular ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)',
                      padding: '3px 8px',
                      borderRadius: 4,
                      textTransform: 'uppercase',
                    }}
                  >
                    {plan.badge}
                  </span>
                  {plan.isPopular && <Star size={16} color="var(--gold, #f59e0b)" fill="var(--gold, #f59e0b)" />}
                </div>

                <h3 className="font-display" style={{ fontSize: 20, fontWeight: 800, color: '#f8fafc', marginBottom: 6 }}>
                  {plan.name}
                </h3>
                <p style={{ fontSize: 13, color: '#94a3b8', minHeight: 38, margin: '0 0 16px' }}>
                  {plan.tagline}
                </p>

                <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="font-display" style={{ fontSize: 32, fontWeight: 900, color: '#f8fafc' }}>
                    {plan.monthlyPrice}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{plan.period}</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                  {plan.features.map((feature) => (
                    <div key={feature} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#e2e8f0' }}>
                      <Check size={16} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={plan.ctaHref}
                className={plan.isPopular ? 'btn-gold' : 'btn-secondary'}
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: 8,
                  fontSize: 13.5,
                  fontWeight: 700,
                  textAlign: 'center',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                {plan.ctaLabel} <ArrowRight size={13} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ / Clarification */}
      <section style={{ padding: 36, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
        <h2 className="font-display" style={{ fontSize: 24, fontWeight: 800, color: '#f8fafc', marginBottom: 12 }}>
          Need a Custom Institutional Procurement Agreement?
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 15, maxWidth: 620, margin: '0 auto 20px' }}>
          We provide custom Master Service Agreements (MSAs), Government e-Marketplace (GeM) compatibility, and CSR pilot vouchers.
        </p>
        <Link href="/contact" className="btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
          Speak with Our Procurement Team <ArrowRight size={14} />
        </Link>
      </section>
    </PublicPageShell>
  );
}
