// frontend/app/for-government/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import PublicPageShell from '@/components/public/PublicPageShell';
import { createPageMetadata } from '@/lib/seo';
import {
  Landmark,
  Globe,
  BarChart3,
  ShieldCheck,
  Award,
  ArrowRight,
  CheckCircle2,
  FileText,
  PieChart,
} from 'lucide-react';

export const metadata: Metadata = createPageMetadata({
  title: 'Government Workforce Intelligence & Policy | Ryyvora AI',
  description:
    'Empower state skill directorates and policy leaders with sovereign labor market heatmaps, NSQF compliance matrices, CSR skill voucher targeting, and real-time employment outcome metrics.',
  path: '/for-government',
  keywords: [
    'Government Workforce Intelligence',
    'District Skilling Heatmaps',
    'NSQF Compliance',
    'Skill Mission Policy',
    'CSR Voucher Targeting',
    'Labor Market Analytics India',
  ],
});

export default function ForGovernmentPage() {
  const CAPABILITIES = [
    {
      title: 'District-Level Workforce Heatmaps',
      desc: 'Visualize real-time talent availability, training capacity, and employer hiring deficits across 36 districts. Replace annual sample surveys with live employment telemetry.',
      icon: Globe,
    },
    {
      title: 'Targeted CSR & Skill Voucher Allocation',
      desc: 'Algorithmically match corporate CSR budgets and state skill vouchers to regions with severe youth underemployment and verified high placement absorption.',
      icon: PieChart,
    },
    {
      title: 'NSQF Compliance & Accreditation Audits',
      desc: 'Automate National Skills Qualification Framework (NSQF Level 4–8) auditing across all certified training centers with tamper-evident cryptographic ledgers.',
      icon: Award,
    },
    {
      title: 'Longitudinal Wage Progression Tracking',
      desc: 'Monitor whether government-funded trainees remain employed after 90, 180, and 365 days, and evaluate real wage progression against regional living benchmarks.',
      icon: BarChart3,
    },
  ];

  return (
    <PublicPageShell
      badge="Sovereign Policy & Directorate Intelligence"
      title="Sovereign Workforce Intelligence for Government & Policy Makers"
      subtitle="Equipping state skilling directorates, ministries, and policy analysts with real-time district telemetry, automated NSQF compliance, and verifiable training outcomes."
      breadcrumbs={[{ name: 'For Government', path: '/for-government' }]}
    >
      {/* Overview Grid */}
      <section style={{ marginBottom: 56 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, alignItems: 'center' }}>
          <div>
            <h2 className="font-display" style={{ fontSize: 28, fontWeight: 800, color: '#f8fafc', marginBottom: 16 }}>
              From Fund Disbursement to Verifiable Employment Outcomes
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>
              State skilling initiatives face a crucial challenge: funding programs based solely on trainee enrollment counts rather than verifiable post-placement employment and retention.
            </p>
            <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7 }}>
              Ryyvora AI equips government stakeholders with deterministic telemetry. Policy leaders can track training provider efficacy, verify employer wage reports, and ensure public investments generate sustainable livelihoods.
            </p>
          </div>

          <div className="card-linear" style={{ padding: 28, borderRadius: 16, background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold, #f59e0b)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
              Institutional Governance Standards
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#10b981" /> NSQF Levels 4–8 Deterministic Framework
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#10b981" /> DPDP Act 2023 Compliant Citizen Privacy
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#10b981" /> 100% In-Country Sovereign Cloud (Mumbai)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#10b981" /> Tamper-Proof Audit Trails for State CAG Review
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section style={{ marginBottom: 56 }}>
        <h2 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', marginBottom: 24, textAlign: 'center' }}>
          Key Directorate Capabilities
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {CAPABILITIES.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="card-linear" style={{ padding: 24, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon size={20} color="var(--gold, #f59e0b)" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>{c.title}</h3>
                <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cross-Link CTA */}
      <section style={{ padding: 36, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
        <h2 className="font-display" style={{ fontSize: 24, fontWeight: 800, color: '#f8fafc', marginBottom: 12 }}>
          Schedule a State Directorate Demonstration
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 15, maxWidth: 620, margin: '0 auto 20px' }}>
          Learn how Ryyvora AI integrates with state skill portals, MIS systems, and apprenticeship councils.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          <Link href="/contact" className="btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
            Request Directorate Briefing <ArrowRight size={14} />
          </Link>
          <Link href="/policy-intelligence" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 8, fontWeight: 600, textDecoration: 'none' }}>
            Explore Policy Intelligence
          </Link>
        </div>
      </section>
    </PublicPageShell>
  );
}
