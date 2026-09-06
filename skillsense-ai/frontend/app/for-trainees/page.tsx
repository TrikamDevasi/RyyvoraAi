// frontend/app/for-trainees/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import PublicPageShell from '@/components/public/PublicPageShell';
import { createPageMetadata } from '@/lib/seo';
import {
  GraduationCap,
  Award,
  Compass,
  FileCheck,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  QrCode,
} from 'lucide-react';

export const metadata: Metadata = createPageMetadata({
  title: 'Trainee Skill Passport & Career Mobility | Ryyvora AI',
  description:
    'Own your verified professional identity with the Ryyvora Verifiable Skill Passport. Prove diagnostic competency, discover wage predictions, and unlock direct employer hiring pathways.',
  path: '/for-trainees',
  keywords: [
    'Trainee Skill Passport',
    'Career Mobility Platform',
    'AI Skill Assessment',
    'Verified Credentials Students',
    'Wage Prediction India',
    'Free Skill Passport',
  ],
});

export default function ForTraineesPage() {
  const FEATURES = [
    {
      title: 'Cryptographic Skill Passport',
      desc: 'Carry an immutable, tamper-evident digital credential that proves your actual skill competencies, NSQF level, and verified project contributions to any employer.',
      icon: Award,
    },
    {
      title: 'AI Code & Resume Diagnostics',
      desc: 'Connect your GitHub profile and upload your resume. Ryyvora’s multi-provider AI analyzes real project code, highlights skill gaps, and suggests high-yield upskilling pathways.',
      icon: Compass,
    },
    {
      title: 'Live Market Salary Affinity',
      desc: 'See real INR salary projections for your skill set across top hiring metros (Mumbai, Pune, Bengaluru). Know your market value before stepping into an interview.',
      icon: TrendingUp,
    },
    {
      title: '1-Click Verification Sharing',
      desc: 'Share a secure public verification link or scannable QR code on LinkedIn and your resume. Employers can verify your credentials instantly without middleman delays.',
      icon: QrCode,
    },
  ];

  return (
    <PublicPageShell
      badge="Candidate Sovereignty & Career Growth"
      title="Cryptographic Skill Passport & Career Mobility for Trainees"
      subtitle="Own your verifiable professional identity. Showcase ground-truth competencies, discover market compensation benchmarks, and connect directly with verified employers."
      breadcrumbs={[{ name: 'For Trainees', path: '/for-trainees' }]}
    >
      {/* Intro */}
      <section style={{ marginBottom: 56 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, alignItems: 'center' }}>
          <div>
            <h2 className="font-display" style={{ fontSize: 28, fontWeight: 800, color: '#f8fafc', marginBottom: 16 }}>
              Prove What You Can Actually Build
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>
              Degrees and self-written resumes no longer guarantee job interviews. Employers receive thousands of applications and filter out candidates with automated keyword scrapers.
            </p>
            <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7 }}>
              With Ryyvora AI, you build a verified competency ledger. When you write code, pass diagnostic benchmarks, or finish certified vocational courses, your accomplishments receive an immutable cryptographic seal.
            </p>
          </div>

          <div className="card-linear" style={{ padding: 28, borderRadius: 16, background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold, #f59e0b)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
              100% Free Forever for Candidates
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#10b981" /> Unlimited Skill Passport credential storage
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#10b981" /> Full DPDP 2023 consent control over who views your data
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#10b981" /> Portable across employers, institutes, and state boundaries
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#10b981" /> Direct matching with employers looking for verified skills
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ marginBottom: 56 }}>
        <h2 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', marginBottom: 24, textAlign: 'center' }}>
          Trainee Tools & Features
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="card-linear" style={{ padding: 24, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Icon size={19} color="var(--gold, #f59e0b)" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trainee Action CTA */}
      <section style={{ padding: 36, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
        <h2 className="font-display" style={{ fontSize: 24, fontWeight: 800, color: '#f8fafc', marginBottom: 12 }}>
          Create Your Free Skill Passport
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 15, maxWidth: 620, margin: '0 auto 20px' }}>
          Sign up in under 60 seconds with email or mobile OTP. No credit card required.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          <Link href="/auth?tab=signup" className="btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
            Claim Your Skill Passport <ArrowRight size={14} />
          </Link>
          <Link href="/skill-passport" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 8, fontWeight: 600, textDecoration: 'none' }}>
            How Skill Passports Work
          </Link>
        </div>
      </section>
    </PublicPageShell>
  );
}
