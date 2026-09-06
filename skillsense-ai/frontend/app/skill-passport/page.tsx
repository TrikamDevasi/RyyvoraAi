// frontend/app/skill-passport/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import PublicPageShell from '@/components/public/PublicPageShell';
import { createPageMetadata } from '@/lib/seo';
import {
  Award,
  ShieldCheck,
  Lock,
  QrCode,
  Globe,
  FileCheck,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
} from 'lucide-react';

export const metadata: Metadata = createPageMetadata({
  title: 'Verified Skill Passport | Ryyvora AI',
  description:
    'Discover the architecture of the Ryyvora Verifiable Skill Passport: immutable W3C cryptographic credentials, NSQF Level 4-8 alignment, and tamper-evident competency records.',
  path: '/skill-passport',
  keywords: [
    'Verified Skill Passport',
    'W3C Verifiable Credentials',
    'Cryptographic Skill Ledger',
    'NSQF Skill Passport',
    'Tamper Proof Career Identity',
    'Digital Skill Credentials India',
  ],
});

export default function SkillPassportPage() {
  const PASSPORT_LAYERS = [
    {
      title: 'Layer 1: Identity & DPDP Sovereignty',
      desc: 'Candidate identity is decoupled from unnecessary PII. Cryptographic public keys and decentralized identifiers (DIDs) ensure credentials can be proven without exposing Aadhaar or personal phone numbers.',
      icon: ShieldCheck,
      spec: 'DPDP 2023 Compliant',
    },
    {
      title: 'Layer 2: Multi-Modal Competency Claims',
      desc: 'Contains granular competency assertions: GitHub code evaluations, verified diagnostic test scores, institutional coursework grades, and employer apprenticeship hours.',
      icon: Cpu,
      spec: 'NSQF Levels 4–8',
    },
    {
      title: 'Layer 3: Cryptographic Integrity',
      desc: 'Every credential payload is signed with the issuer’s private key using SHA-256 HMAC digital signatures. Any modification of grades, dates, or names invalidates the hash signature immediately.',
      icon: Lock,
      spec: 'SHA-256 HMAC Proofs',
    },
    {
      title: 'Layer 4: Universal Interoperability',
      desc: 'Conforms to W3C Verifiable Credentials and open credential schemas. Portable across state skill missions, academic digilockers, and corporate enterprise ATS platforms.',
      icon: Globe,
      spec: 'W3C Open Standard',
    },
  ];

  return (
    <PublicPageShell
      badge="Cryptographic Career Infrastructure"
      title="The Verifiable Cryptographic Skill Passport"
      subtitle="A tamper-evident, student-owned digital credential that cryptographically proves verified technical competencies, NSQF qualification levels, and real workplace outcomes."
      breadcrumbs={[{ name: 'Skill Passport', path: '/skill-passport' }]}
    >
      {/* Intro */}
      <section style={{ marginBottom: 56 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, alignItems: 'center' }}>
          <div>
            <h2 className="font-display" style={{ fontSize: 28, fontWeight: 800, color: '#f8fafc', marginBottom: 16 }}>
              A Living Ledger of Verified Human Potential
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>
              Paper diplomas and static PDF certificates are easily forged, expensive to verify, and fail to describe a candidate’s actual practical ability.
            </p>
            <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7 }}>
              The Ryyvora Skill Passport replaces fragile paper with an immutable, cryptographically sealed record. Every score, code review, and employer attestation is timestamped on the ledger—giving candidates permanent ownership of their professional achievements.
            </p>
          </div>

          <div className="card-linear" style={{ padding: 28, borderRadius: 16, background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold, #f59e0b)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
              Passport Technical Invariants
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#10b981" /> Universal W3C Verifiable Credential standard
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#10b981" /> Scannable QR code for zero-latency verification
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#10b981" /> Granular candidate privacy consent toggles
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#e2e8f0' }}>
                <CheckCircle2 size={16} color="#10b981" /> Permanent cloud and offline verification capability
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Layers */}
      <section style={{ marginBottom: 56 }}>
        <h2 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', marginBottom: 24, textAlign: 'center' }}>
          Passport Architecture Layers
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {PASSPORT_LAYERS.map((layer) => {
            const Icon = layer.icon;
            return (
              <div key={layer.title} className="card-linear" style={{ padding: 24, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={19} color="var(--gold, #f59e0b)" />
                  </div>
                  <span className="font-mono" style={{ fontSize: 11, fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '3px 8px', borderRadius: 4 }}>
                    {layer.spec}
                  </span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>{layer.title}</h3>
                <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>{layer.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Verification CTA */}
      <section style={{ padding: 36, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
        <h2 className="font-display" style={{ fontSize: 24, fontWeight: 800, color: '#f8fafc', marginBottom: 12 }}>
          Experience Public Skill Verification
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 15, maxWidth: 620, margin: '0 auto 20px' }}>
          Query a live sample credential or create your own free verifiable skill passport.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          <Link href="/employer-verification" className="btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
            Verify Sample Credential <ArrowRight size={14} />
          </Link>
          <Link href="/for-trainees" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 8, fontWeight: 600, textDecoration: 'none' }}>
            Claim Free Trainee Passport
          </Link>
        </div>
      </section>
    </PublicPageShell>
  );
}
