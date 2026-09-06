// frontend/app/policy-intelligence/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import PublicPageShell from '@/components/public/PublicPageShell';
import { createPageMetadata } from '@/lib/seo';
import {
  Brain,
  Globe,
  PieChart,
  Landmark,
  Target,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Activity,
} from 'lucide-react';

export const metadata: Metadata = createPageMetadata({
  title: 'Policy Intelligence for Workforce Outcomes | Ryyvora AI',
  description:
    'Macro policy analytics for workforce development: district-level skilling heatmaps, supply-demand alignment, CSR voucher targeting, and evidence-based governance.',
  path: '/policy-intelligence',
  keywords: [
    'Policy Intelligence Workforce',
    'District Skilling Heatmaps',
    'CSR Skill Voucher Allocation',
    'Labor Supply Demand Alignment',
    'Evidence Based Workforce Policy',
    'Public Skilling Telemetry India',
  ],
});

export default function PolicyIntelligencePage() {
  const POLICY_DOMAINS = [
    {
      title: 'Dynamic District Heatmap Telemetry',
      desc: 'Deep territorial mapping tracking candidate enrollments, qualification completion, and verified industrial absorption across all state sub-districts.',
      icon: Globe,
    },
    {
      title: 'CSR Voucher & Skilling Subsidy Optimization',
      desc: 'Algorithmically allocate state grants and corporate CSR initiatives to industrial clusters where youth unemployment and employer vacancy rates are highest.',
      icon: PieChart,
    },
    {
      title: 'Predictive Structural Displacement Alerts',
      desc: 'Early warning systems analyzing AI automation and industry decarbonization impacts on regional blue-collar and mid-skill employment cohorts.',
      icon: Target,
    },
    {
      title: 'Longitudinal Return on Public Investment',
      desc: 'Calculate the true economic ROI of government skill development expenditures by measuring 12-month taxable wage contributions and employment longevity.',
      icon: TrendingUp,
    },
  ];

  return (
    <PublicPageShell
      badge="Macro Governance & Evidence-Based Policy"
      title="Policy Intelligence & Macro Workforce Planning"
      subtitle="Transforming public workforce administration from retrospective audits into forward-looking predictive governance using sovereign telemetry."
      breadcrumbs={[{ name: 'Policy Intelligence', path: '/policy-intelligence' }]}
    >
      {/* Intro */}
      <section style={{ marginBottom: 56 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, alignItems: 'center' }}>
          <div>
            <h2 className="font-display" style={{ fontSize: 28, fontWeight: 800, color: '#f8fafc', marginBottom: 16 }}>
              From Intentional Spending to Proven Impact
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>
              State governments and national skilling authorities allocate thousands of crores annually to vocational training schemes. Yet policy makers rarely have real-time visibility into whether candidates remain employed in their trained trades.
            </p>
            <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7 }}>
              Ryyvora AI’s Policy Intelligence engine aggregates multi-source employment signals into high-resolution territorial maps, empowering directorates to align funding with actual market absorption.
            </p>
          </div>

          <div className="card-linear" style={{ padding: 28, borderRadius: 16, background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold, #f59e0b)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
              Policy Decision Standards
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#10b981" /> Objective data-backed grant allocations
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#10b981" /> Real-time tracking of 90-day and 365-day placement retention
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#10b981" /> Seamless export for state legislative assembly reports
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#10b981" /> Sovereign cloud hosting with 100% data residency in India
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section style={{ marginBottom: 56 }}>
        <h2 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', marginBottom: 24, textAlign: 'center' }}>
          Policy Intelligence Capabilities
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {POLICY_DOMAINS.map((d) => {
            const Icon = d.icon;
            return (
              <div key={d.title} className="card-linear" style={{ padding: 24, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Icon size={19} color="var(--gold, #f59e0b)" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>{d.title}</h3>
                <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>{d.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 36, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
        <h2 className="font-display" style={{ fontSize: 24, fontWeight: 800, color: '#f8fafc', marginBottom: 12 }}>
          Equip Your Directorate with Sovereign Telemetry
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 15, maxWidth: 620, margin: '0 auto 20px' }}>
          Consult with our public policy architecture team to deploy district-level workforce analytics.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          <Link href="/for-government" className="btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
            Government Solutions Overview <ArrowRight size={14} />
          </Link>
          <Link href="/contact" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 8, fontWeight: 600, textDecoration: 'none' }}>
            Request Policy Consultation
          </Link>
        </div>
      </section>
    </PublicPageShell>
  );
}
