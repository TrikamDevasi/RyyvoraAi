// frontend/app/for-training-providers/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import PublicPageShell from '@/components/public/PublicPageShell';
import { createPageMetadata } from '@/lib/seo';
import {
  School,
  TrendingUp,
  Award,
  Layers,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  UploadCloud,
  FileCheck,
} from 'lucide-react';

export const metadata: Metadata = createPageMetadata({
  title: 'Training Institute Outcomes & Placement Analytics | Ryyvora AI',
  description:
    'Equip ITIs, polytechnics, and vocational institutes with verified cohort placement tracking, curriculum-to-market alignment, accreditation analytics, and training ROI dashboards.',
  path: '/for-training-providers',
  keywords: [
    'Training Provider Analytics',
    'Vocational Institute Placement ROI',
    'ITI Outcome Verification',
    'Accreditation Tracking',
    'Curriculum Market Alignment',
    'Verifiable Student Credentials',
  ],
});

export default function ForTrainingProvidersPage() {
  const PILLARS = [
    {
      title: 'Automated Verifiable Credential Issuance',
      desc: 'Issue tamper-evident W3C cryptographic diplomas and NSQF certificates directly to student Skill Passports with institutional private signing keys.',
      icon: Award,
    },
    {
      title: 'Real-Time Cohort Placement ROI',
      desc: 'Track placement percentages, starting CTCs, and 90-day job retention across every academic department and training batch.',
      icon: TrendingUp,
    },
    {
      title: 'Curriculum-to-Market Alignment',
      desc: 'Compare syllabi against live regional employer demand signals. Identify emerging skill shortages and modernize course content automatically.',
      icon: Layers,
    },
    {
      title: 'Accreditation & Compliance Reporting',
      desc: 'Export 1-click verified outcome dossiers for regulatory reviews, NCVET audits, and state skill mission funding disbursements.',
      icon: FileCheck,
    },
  ];

  return (
    <PublicPageShell
      badge="Academic & Vocational Institutional Intelligence"
      title="Workforce Placement & Accreditation Analytics for Training Institutes"
      subtitle="Modernize your institution with deterministic placement analytics, automated cryptographic credentialing, and real-time employer demand alignment."
      breadcrumbs={[{ name: 'For Training Providers', path: '/for-training-providers' }]}
    >
      {/* Intro */}
      <section style={{ marginBottom: 56 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, alignItems: 'center' }}>
          <div>
            <h2 className="font-display" style={{ fontSize: 28, fontWeight: 800, color: '#f8fafc', marginBottom: 16 }}>
              Prove Institutional Excellence with Deterministic Outcomes
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>
              Vocational colleges, polytechnics, and ITIs face increasing pressure from regulatory bodies and prospective students to demonstrate verifiable placement rates and graduate wage progression.
            </p>
            <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7 }}>
              Ryyvora AI empowers institutes to replace manual student follow-up spreadsheets with automated outcome tracking. When students get hired, employer verification feeds directly into institutional dashboards.
            </p>
          </div>

          <div className="card-linear" style={{ padding: 28, borderRadius: 16, background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold, #f59e0b)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
              Institutional Value Metrics
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#10b981" /> 100% cryptographically attested student portfolios
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#10b981" /> Zero paperwork for NCVET / state compliance reporting
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#10b981" /> Real-time alerts when local employers post matching jobs
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#10b981" /> Multi-batch comparative placement ROI benchmarks
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section style={{ marginBottom: 56 }}>
        <h2 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', marginBottom: 24, textAlign: 'center' }}>
          Platform Capabilities for Institutes
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="card-linear" style={{ padding: 24, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Icon size={19} color="var(--gold, #f59e0b)" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 36, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
        <h2 className="font-display" style={{ fontSize: 24, fontWeight: 800, color: '#f8fafc', marginBottom: 12 }}>
          Onboard Your Institute to Ryyvora AI
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 15, maxWidth: 620, margin: '0 auto 20px' }}>
          Join leading vocational centers and universities issuing verifiable skill credentials.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          <Link href="/pricing" className="btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
            View Institute Tiers <ArrowRight size={14} />
          </Link>
          <Link href="/contact" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 8, fontWeight: 600, textDecoration: 'none' }}>
            Request Campus Demo
          </Link>
        </div>
      </section>
    </PublicPageShell>
  );
}
