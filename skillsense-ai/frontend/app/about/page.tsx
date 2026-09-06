// frontend/app/about/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import PublicPageShell from '@/components/public/PublicPageShell';
import { createPageMetadata } from '@/lib/seo';
import {
  ShieldCheck,
  Award,
  Users,
  Building2,
  Landmark,
  Compass,
  ArrowRight,
  CheckCircle2,
  Lock,
  Globe,
} from 'lucide-react';

export const metadata: Metadata = createPageMetadata({
  title: 'About Our Platform & Mission',
  description:
    'Learn about Ryyvora AI, the sovereign workforce intelligence and outcome verification platform built by Team Quantum Coders to bridge education and enterprise hiring.',
  path: '/about',
  keywords: [
    'About Ryyvora AI',
    'Team Quantum Coders',
    'Workforce Outcome Intelligence',
    'NSQF Standards',
    'DPDP Act 2023 Compliance',
    'Sovereign Data Architecture',
  ],
});

export default function AboutPage() {
  return (
    <PublicPageShell
      badge="Platform Sovereignty & Mission"
      title="About Ryyvora AI"
      subtitle="Ryyvora AI is the sovereign workforce outcome intelligence platform connecting training, certification, employment verification, retention, and wage progression into one deterministic system."
      breadcrumbs={[{ name: 'About', path: '/about' }]}
    >
      {/* 1. Core Mission */}
      <section style={{ marginBottom: 56 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, alignItems: 'center' }}>
          <div>
            <h2 className="font-display" style={{ fontSize: 28, fontWeight: 800, color: '#f8fafc', marginBottom: 16 }}>
              Bridging Higher Education & Enterprise Hiring
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>
              The traditional workforce ecosystem suffers from a profound trust gap: employers struggle with resume fraud and unverified claims, training institutes lack visibility into post-placement retention, and government agencies lack granular telemetry to optimize multi-crore skilling budgets.
            </p>
            <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7 }}>
              Ryyvora AI replaces self-reported claims with cryptographically verifiable competency credentials, deterministic AI skill assessments, and longitudinal outcome tracking. From skills acquisition to sustainable wage growth, Ryyvora provides the ground truth of workforce outcomes.
            </p>
          </div>

          <div className="card-linear" style={{ padding: 32, borderRadius: 16, background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold, #f59e0b)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              Our Architectural Covenant
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 14, color: '#e2e8f0' }}>Zero-trust cryptographic verification with SHA-256 HMAC proofs.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 14, color: '#e2e8f0' }}>Strict compliance with India’s Digital Personal Data Protection (DPDP) Act 2023.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 14, color: '#e2e8f0' }}>NSQF Level 4 through Level 8 qualification framework alignment.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 14, color: '#e2e8f0' }}>100% sovereign data residency within Mumbai, India.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Pillars */}
      <section style={{ marginBottom: 56 }}>
        <h2 className="font-display" style={{ fontSize: 28, fontWeight: 800, color: '#f8fafc', marginBottom: 24, textAlign: 'center' }}>
          The Four Architectural Pillars
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          <div className="card-linear" style={{ padding: 24, borderRadius: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <ShieldCheck size={20} color="var(--gold, #f59e0b)" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>Cryptographic Trust</h3>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>
              W3C-compliant Verifiable Credentials anchored with SHA-256 HMAC digital signatures. Instantly verifiable by any employer without intermediaries.
            </p>
          </div>

          <div className="card-linear" style={{ padding: 24, borderRadius: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(56,189,248,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Compass size={20} color="#38bdf8" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>Deterministic AI</h3>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>
              Multi-model AI architecture calibrated against real labor market indices. Strict JSON schema repair eliminates hallucinations and bias.
            </p>
          </div>

          <div className="card-linear" style={{ padding: 24, borderRadius: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Lock size={20} color="#10b981" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>DPDP Consent</h3>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>
              Candidate-governed data sharing. Consent can be inspected, restricted, or revoked at any time with full cryptographic audit logging.
            </p>
          </div>

          <div className="card-linear" style={{ padding: 24, borderRadius: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(168,85,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Landmark size={20} color="#a855f7" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>Sovereign Telemetry</h3>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>
              District-by-district skilling heatmaps and real-time wage progression metrics providing macro intelligence for state policy leaders.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Team Quantum Coders & Origins */}
      <section style={{ padding: 36, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 48 }}>
        <h2 className="font-display" style={{ fontSize: 24, fontWeight: 800, color: '#f8fafc', marginBottom: 14 }}>
          Engineered by Team Quantum Coders
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7, maxWidth: 900, marginBottom: 20 }}>
          Ryyvora AI was developed by Team Quantum Coders as a next-generation national solution for workforce outcome intelligence. Aligned with national apprenticeship priorities and skill mission mandates, the platform proves that competency verification can be secure, private, and universally accessible.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          <Link href="/how-it-works" className="btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
            Explore Outcome Lifecycle <ArrowRight size={14} />
          </Link>
          <Link href="/contact" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 8, fontWeight: 600, textDecoration: 'none' }}>
            Contact Platform Leads
          </Link>
        </div>
      </section>
    </PublicPageShell>
  );
}
