// frontend/app/workforce-analytics/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import PublicPageShell from '@/components/public/PublicPageShell';
import { createPageMetadata } from '@/lib/seo';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Layers,
  ArrowRight,
  CheckCircle2,
  PieChart,
  Target,
  Compass,
} from 'lucide-react';

export const metadata: Metadata = createPageMetadata({
  title: 'Workforce Analytics & Employment Outcomes | Ryyvora AI',
  description:
    'Explore macro labor market intelligence, real-time employer skill demand, wage index benchmarks, and longitudinal retention analytics powered by deterministic AI.',
  path: '/workforce-analytics',
  keywords: [
    'Workforce Analytics',
    'Employment Outcome Metrics',
    'Labor Demand Radar',
    'Wage Index Benchmarks',
    'Longitudinal Retention Analytics',
    'Skill Gaps India',
  ],
});

export default function WorkforceAnalyticsPage() {
  const ANALYTICS_MODULES = [
    {
      title: 'Macro Labor Demand Radar',
      desc: 'Aggregates millions of real employer postings and apprenticeship openings across IT, manufacturing, automotive, healthcare, and logistics to detect emerging skill deficits weeks before they manifest in production.',
      icon: Activity,
      highlight: 'Live Demand Signals',
    },
    {
      title: 'Longitudinal Retention Curves',
      desc: 'Tracks employment stability at 30, 90, 180, and 365 days post-placement. Benchmarks which training programs and curriculum specializations yield the lowest early turnover.',
      icon: TrendingUp,
      highlight: '1-Year Longevity Data',
    },
    {
      title: 'Regional Wage Progression Index',
      desc: 'Calculates true starting CTC distributions and 12-month salary increments across Tier-1, Tier-2, and Tier-3 industrial corridors, preventing under-compensation and wage exploitation.',
      icon: BarChart3,
      highlight: 'Granular Salary Curves',
    },
    {
      title: 'Skill Shortage & Scarcity Index',
      desc: 'Scores competency scarcity (0.0 to 1.0) by sector and geography. Helps training providers prioritize curriculum updates that maximize student employment probability.',
      icon: Target,
      highlight: 'Scarcity Coefficients',
    },
  ];

  return (
    <PublicPageShell
      badge="Deterministic Labor Market Intelligence"
      title="Workforce Analytics & Longitudinal Employment Outcomes"
      subtitle="Transforming disparate employment data into actionable ground truth: macro hiring demand, longitudinal retention curves, and verified wage benchmarks."
      breadcrumbs={[{ name: 'Workforce Analytics', path: '/workforce-analytics' }]}
    >
      {/* Overview */}
      <section style={{ marginBottom: 56 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, alignItems: 'center' }}>
          <div>
            <h2 className="font-display" style={{ fontSize: 28, fontWeight: 800, color: '#f8fafc', marginBottom: 16 }}>
              Beyond Simple Headcounts: True Longitudinal Outcomes
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>
              Most employment dashboards measure only the initial placement event. They cannot answer whether the candidate remained employed after 90 days, whether their wages grew, or whether their training matched the day-to-day requirements of the role.
            </p>
            <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7 }}>
              Ryyvora AI delivers longitudinal workforce intelligence. By correlating verifiable skill passports with ongoing employer attestations, we provide complete transparency into employment sustainability and economic mobility.
            </p>
          </div>

          <div className="card-linear" style={{ padding: 28, borderRadius: 16, background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold, #f59e0b)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
              Telemetry Accuracy Standards
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#10b981" /> Deterministic multi-source ingestion
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#10b981" /> Anonymized aggregation protecting individual PII
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#10b981" /> Normalized against NSQF skill hierarchies
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#10b981" /> Continuous model calibration against state economic data
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section style={{ marginBottom: 56 }}>
        <h2 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', marginBottom: 24, textAlign: 'center' }}>
          Workforce Intelligence Engines
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {ANALYTICS_MODULES.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.title} className="card-linear" style={{ padding: 24, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={19} color="var(--gold, #f59e0b)" />
                  </div>
                  <span className="font-mono" style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold, #f59e0b)', background: 'rgba(245,158,11,0.1)', padding: '3px 8px', borderRadius: 4 }}>
                    {m.highlight}
                  </span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>{m.title}</h3>
                <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>{m.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 36, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
        <h2 className="font-display" style={{ fontSize: 24, fontWeight: 800, color: '#f8fafc', marginBottom: 12 }}>
          Deploy Workforce Intelligence in Your Region
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 15, maxWidth: 620, margin: '0 auto 20px' }}>
          Schedule a consultation to see how Ryyvora’s analytics suite maps local labor supply to employer demand.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          <Link href="/contact" className="btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
            Request Analytics Consultation <ArrowRight size={14} />
          </Link>
          <Link href="/policy-intelligence" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 8, fontWeight: 600, textDecoration: 'none' }}>
            View Policy Intelligence
          </Link>
        </div>
      </section>
    </PublicPageShell>
  );
}
