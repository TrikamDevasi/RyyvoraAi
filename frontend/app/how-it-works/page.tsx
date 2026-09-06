// frontend/app/how-it-works/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import PublicPageShell from '@/components/public/PublicPageShell';
import { createPageMetadata } from '@/lib/seo';
import {
  Brain,
  Award,
  ShieldCheck,
  Briefcase,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  Layers,
  Database,
} from 'lucide-react';

export const metadata: Metadata = createPageMetadata({
  title: 'How Workforce Outcome Intelligence Works',
  description:
    'Discover the 5-stage longitudinal workforce outcome tracking lifecycle connecting skills ingestion, AI competency modeling, cryptographic ledger issuance, and retention analytics.',
  path: '/how-it-works',
  keywords: [
    'How Ryyvora AI Works',
    'Workforce Outcome Lifecycle',
    'Skill Verification Process',
    'Cryptographic Skill Passport',
    'Employment Retention Tracking',
  ],
});

export default function HowItWorksPage() {
  const STAGES = [
    {
      step: '01',
      title: 'Skill DNA & Diagnostic Ingestion',
      icon: Brain,
      color: '#f59e0b',
      desc: 'Candidates and training institutes ingest multi-modal evidence: GitHub project repositories, technical resumes, and institutional coursework transcripts. Ryyvora’s multi-provider AI performs deterministic semantic parsing against industry taxonomies.',
      deliverables: ['Automated Code Quality Scoring', 'Resume Entity Extraction', 'Baseline NSQF Tier Mapping'],
    },
    {
      step: '02',
      title: 'Adaptive Diagnostic Benchmarking',
      icon: FileCheck,
      color: '#38bdf8',
      desc: 'Instead of static questionnaires, Ryyvora dynamically calibrates timed diagnostic assessments based on the candidate’s stated competencies. Evaluates algorithmic problem-solving, architectural design, and domain proficiency with anti-cheat telemetry.',
      deliverables: ['Sub-skill Mastery Heatmap', 'Readiness Score (0–100%)', 'Wage Affinity Projection'],
    },
    {
      step: '03',
      title: 'Cryptographic Ledger Issuance',
      icon: ShieldCheck,
      color: '#10b981',
      desc: 'Upon validation, a W3C-compliant Verifiable Credential is created. The credential payload is hashed with SHA-256 HMAC and recorded with an immutable timestamp. Candidate identity is secured with DPDP consent controls.',
      deliverables: ['Cryptographic SHA-256 Hash', 'Scannable Verification QR Code', 'Tamper-Evident Ledger Entry'],
    },
    {
      step: '04',
      title: 'Instant Employer Verification & Hiring',
      icon: Briefcase,
      color: '#a855f7',
      desc: 'Enterprise hiring teams query candidate hashes through our instant verification portal or automated HRIS webhooks. Verification confirms authentic coursework, validated test scores, and issuing institution signatures without manual phone calls.',
      deliverables: ['Zero-Fraud Candidate Profile', 'Attested Skill Breakdown', '1-Click Verification Certificate'],
    },
    {
      step: '05',
      title: 'Longitudinal Retention & Wage Analytics',
      icon: TrendingUp,
      color: '#ec4899',
      desc: 'Post-placement, Ryyvora tracks 90-day, 180-day, and 365-day employment retention, wage increments, and employer competency satisfaction. Aggregated anonymized telemetry feeds back to state governments and training institutes.',
      deliverables: ['Longitudinal Retention Tracking', 'Curriculum Placement ROI', 'Macro Labor Supply Telemetry'],
    },
  ];

  return (
    <PublicPageShell
      badge="End-to-End Lifecycle Architecture"
      title="How Workforce Outcome Intelligence Works"
      subtitle="A closed-loop system connecting skill ingestion, deterministic assessment, cryptographic credential issuance, and longitudinal employment verification."
      breadcrumbs={[{ name: 'How It Works', path: '/how-it-works' }]}
    >
      {/* Stages Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36, marginBottom: 56 }}>
        {STAGES.map((stage) => {
          const Icon = stage.icon;
          return (
            <div
              key={stage.step}
              className="card-linear"
              style={{
                padding: 32,
                borderRadius: 16,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 24,
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: stage.color,
                      background: `${stage.color}20`,
                      padding: '3px 10px',
                      borderRadius: 6,
                    }}
                  >
                    STAGE {stage.step}
                  </span>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${stage.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color={stage.color} />
                  </div>
                </div>

                <h2 className="font-display" style={{ fontSize: 22, fontWeight: 800, color: '#f8fafc', marginBottom: 10 }}>
                  {stage.title}
                </h2>
                <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.6, margin: 0 }}>
                  {stage.desc}
                </p>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.25)', padding: 20, borderRadius: 12, border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                  Key Architectural Output
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {stage.deliverables.map((item) => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#e2e8f0' }}>
                      <CheckCircle2 size={15} color={stage.color} style={{ flexShrink: 0 }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Next Steps CTA */}
      <section style={{ textAlign: 'center', padding: '48px 24px', background: 'rgba(245,158,11,0.04)', borderRadius: 16, border: '1px solid rgba(245,158,11,0.2)' }}>
        <h2 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', marginBottom: 12 }}>
          Experience Deterministic Workforce Outcomes
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 15, maxWidth: 640, margin: '0 auto 24px' }}>
          Explore our cryptographic credential verifier or see how Ryyvora empowers your organization’s role.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          <Link href="/employer-verification" className="btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
            Verify Credential Hash <ArrowRight size={14} />
          </Link>
          <Link href="/skill-passport" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 8, fontWeight: 600, textDecoration: 'none' }}>
            Learn About Skill Passport
          </Link>
        </div>
      </section>
    </PublicPageShell>
  );
}
