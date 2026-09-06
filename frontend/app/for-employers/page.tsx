// frontend/app/for-employers/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import PublicPageShell from '@/components/public/PublicPageShell';
import { createPageMetadata } from '@/lib/seo';
import {
  Briefcase,
  ShieldCheck,
  Zap,
  TrendingUp,
  UserCheck,
  ArrowRight,
  CheckCircle2,
  Clock,
  Coins,
} from 'lucide-react';

export const metadata: Metadata = createPageMetadata({
  title: 'Employer Outcome Verification & Talent Intelligence | Ryyvora AI',
  description:
    'Accelerate enterprise hiring and eliminate resume fraud with Ryyvora AI. Verify cryptographically attested candidate competencies, track 90-day retention, and benchmark wage progression.',
  path: '/for-employers',
  keywords: [
    'Employer Outcome Verification',
    'Verified Talent Pool',
    'Zero Resume Fraud',
    'Skill Verification API',
    'Hiring Cost Reduction',
    'Retention Analytics',
  ],
});

export default function ForEmployersPage() {
  const BENEFITS = [
    {
      title: 'Zero-Fraud Talent Pipelines',
      desc: 'Verify candidate coursework, project repositories, and diagnostic exam scores through SHA-256 cryptographic signatures directly from accredited training centers.',
      icon: ShieldCheck,
      stat: '100% Attested',
    },
    {
      title: '70% Faster Time-to-Hire',
      desc: 'Skip lengthy first-round technical screening. Candidate competencies are pre-calibrated against NSQF tiers and validated by deterministic diagnostic benchmarks.',
      icon: Clock,
      stat: '3.2x Faster',
    },
    {
      title: '90-Day Retention Tracking',
      desc: 'Measure real workforce longevity. Track cohort retention rates, identify high-stability skill profiles, and reduce costly early-turnover cycles.',
      icon: TrendingUp,
      stat: '94.2% Stability',
    },
    {
      title: 'Automated Workplace Attestation',
      desc: 'Empower supervisors to validate apprenticeships and on-the-job milestones with one click, establishing verified career records on the immutable ledger.',
      icon: UserCheck,
      stat: '1-Click Attest',
    },
  ];

  return (
    <PublicPageShell
      badge="Enterprise Talent Acquisition & Retention"
      title="Employer Outcome Verification & High-Trust Hiring"
      subtitle="Eliminate resume fraud, cut technical screening time, and hire pre-verified candidates with tamper-evident W3C cryptographic skill passports."
      breadcrumbs={[{ name: 'For Employers', path: '/for-employers' }]}
    >
      {/* Problem / Solution Section */}
      <section style={{ marginBottom: 56 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, alignItems: 'center' }}>
          <div>
            <h2 className="font-display" style={{ fontSize: 28, fontWeight: 800, color: '#f8fafc', marginBottom: 16 }}>
              Hire with Ground-Truth Competency Verification
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>
              Traditional hiring relying on self-declared resumes is broken. Over 40% of technical resumes contain embellished skills, unverified certifications, or exaggerated project roles, forcing engineering leaders into repetitive technical phone screens.
            </p>
            <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7 }}>
              Ryyvora AI changes the equation. Every candidate profile is backed by an immutable ledger entry containing actual code diagnostics, test performance benchmarks, and institutional signing keys.
            </p>
          </div>

          <div className="card-linear" style={{ padding: 28, borderRadius: 16, background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold, #f59e0b)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
              Enterprise Impact Invariants
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#10b981" /> Direct access to verified regional talent pools
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#10b981" /> Instant hash verification via web portal or HRIS API
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#10b981" /> Automated apprenticeship attestation & compliance
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#10b981" /> Zero recruiter spam; pure competency matching
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section style={{ marginBottom: 56 }}>
        <h2 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', marginBottom: 24, textAlign: 'center' }}>
          Enterprise Capabilities
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="card-linear" style={{ padding: 24, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={19} color="var(--gold, #f59e0b)" />
                  </div>
                  <span className="font-mono" style={{ fontSize: 12, fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '3px 8px', borderRadius: 4 }}>
                    {b.stat}
                  </span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>{b.title}</h3>
                <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>{b.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Verification CTA */}
      <section style={{ padding: 36, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
        <h2 className="font-display" style={{ fontSize: 24, fontWeight: 800, color: '#f8fafc', marginBottom: 12 }}>
          Verify a Candidate Credential Right Now
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 15, maxWidth: 620, margin: '0 auto 20px' }}>
          Test the cryptographic public ledger with a live sample hash or integrate our enterprise API.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          <Link href="/employer-verification" className="btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
            Open Verifier Portal <ArrowRight size={14} />
          </Link>
          <Link href="/pricing" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 8, fontWeight: 600, textDecoration: 'none' }}>
            View Enterprise Pricing
          </Link>
        </div>
      </section>
    </PublicPageShell>
  );
}
