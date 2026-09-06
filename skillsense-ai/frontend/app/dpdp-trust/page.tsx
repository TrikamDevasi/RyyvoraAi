// frontend/app/dpdp-trust/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import PublicPageShell from '@/components/public/PublicPageShell';
import { createPageMetadata } from '@/lib/seo';
import {
  Lock,
  ShieldCheck,
  UserCheck,
  Database,
  FileText,
  CheckCircle2,
  ArrowRight,
  Server,
  KeyRound,
} from 'lucide-react';

export const metadata: Metadata = createPageMetadata({
  title: 'DPDP Act 2023 Trust & Data Sovereignty | Ryyvora AI',
  description:
    'Understand how Ryyvora AI implements India’s Digital Personal Data Protection Act 2023 with granular candidate consent, Mumbai data residency, and cryptographic privacy.',
  path: '/dpdp-trust',
  keywords: [
    'DPDP Act 2023 Compliance',
    'Data Privacy Workforce Platform',
    'Consent Management Candidate Data',
    'Data Sovereignty India',
    'Zero Knowledge Credential Proofs',
    'Mumbai Data Residency',
  ],
});

export default function DpdpTrustPage() {
  const PRIVACY_PRINCIPLES = [
    {
      title: 'Explicit Granular Consent',
      desc: 'No employer, government agency, or training provider can view candidate personal data without affirmative consent recorded with cryptographic timestamps.',
      icon: UserCheck,
    },
    {
      title: 'Right to Withdraw Consent',
      desc: 'Candidates retain unilateral authority to revoke employer access to their Skill Passport, assessment logs, and contact credentials at any time.',
      icon: KeyRound,
    },
    {
      title: '100% Indian Data Residency',
      desc: 'All user data, cryptographic ledger logs, and AI inference models are hosted exclusively in Tier-IV sovereign data centers within Mumbai, India.',
      icon: Server,
    },
    {
      title: 'Tamper-Evident Privacy Audit Logs',
      desc: 'Every access query, credential verification, and consent change is permanently hashed on an append-only audit trail to prevent unauthorized data scraping.',
      icon: Lock,
    },
  ];

  return (
    <PublicPageShell
      badge="Data Privacy, Ethics & Regulatory Trust"
      title="Data Privacy, Consent Governance & DPDP Act 2023 Compliance"
      subtitle="Ryyvora AI is architected from the ground up to respect candidate data sovereignty under the Digital Personal Data Protection Act 2023."
      breadcrumbs={[{ name: 'DPDP Trust', path: '/dpdp-trust' }]}
    >
      {/* Intro */}
      <section style={{ marginBottom: 56 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, alignItems: 'center' }}>
          <div>
            <h2 className="font-display" style={{ fontSize: 28, fontWeight: 800, color: '#f8fafc', marginBottom: 16 }}>
              Candidate-Centric Privacy by Design
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>
              Unlike legacy recruitment portals that monetize student data and broadcast phone numbers to third-party telemarketers, Ryyvora AI treats personal data as a sovereign trust.
            </p>
            <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7 }}>
              Our platform adheres strictly to the statutory mandates of the Digital Personal Data Protection (DPDP) Act 2023: purpose limitation, data minimization, explicit consent, and robust data principal grievance redressal.
            </p>
          </div>

          <div className="card-linear" style={{ padding: 28, borderRadius: 16, background: 'rgba(16,185,129,0.03)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
              Statutory DPDP Guardrails
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#10b981" /> Section 6: Clear notice in plain English and Hindi
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#10b981' }}>
                <CheckCircle2 size={16} color="#10b981" /> Section 8: Zero unauthorized secondary data monetization
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#10b981" /> Section 11: Candidate right to access, correct, and erase data
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#10b981" /> Dedicated Data Protection Officer (DPO) grievance channel
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section style={{ marginBottom: 56 }}>
        <h2 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', marginBottom: 24, textAlign: 'center' }}>
          Four Pillars of Ryyvora Data Governance
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {PRIVACY_PRINCIPLES.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="card-linear" style={{ padding: 24, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Icon size={19} color="#10b981" />
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
          Have Questions About Data Governance?
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 15, maxWidth: 620, margin: '0 auto 20px' }}>
          Our compliance and legal architecture team is available to discuss enterprise security audits and government data agreements.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          <Link href="/contact" className="btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
            Contact Privacy Officer <ArrowRight size={14} />
          </Link>
          <Link href="/skill-passport" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 8, fontWeight: 600, textDecoration: 'none' }}>
            View Skill Passport Architecture
          </Link>
        </div>
      </section>
    </PublicPageShell>
  );
}
