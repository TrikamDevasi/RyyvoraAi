// frontend/app/employer-verification/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PublicPageShell from '@/components/public/PublicPageShell';
import {
  ShieldCheck,
  Search,
  Lock,
  CheckCircle2,
  Award,
  ExternalLink,
  ArrowRight,
  FileCheck,
  Building2,
  AlertCircle,
} from 'lucide-react';

export default function EmployerVerificationPage() {
  const [hashInput, setHashInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const sampleHashes = [
    { label: 'Aarav Deshmukh (Full Stack Engineer)', hash: 'e9b2a7d4c8f10356789abcdef0123456789abcdef0123456789abcdef0123456' },
    { label: 'Priya Sharma (Data Analytics Specialist)', hash: '8f7d6e5c4b3a210987654321fedcba0987654321fedcba0987654321fedcba09' },
  ];

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleaned = hashInput.trim();
    if (!cleaned) {
      setError('Please enter a 64-character hexadecimal credential hash.');
      return;
    }
    // Redirect to direct verification record
    window.location.href = `/verify/${encodeURIComponent(cleaned)}`;
  };

  const handleUseSample = (hash: string) => {
    setHashInput(hash);
    setError(null);
  };

  return (
    <PublicPageShell
      badge="Public Credential & Ledger Gateway"
      title="Cryptographic Credential & Outcome Verification"
      subtitle="Verify candidate qualifications, NSQF competency levels, and training certificates on the Ryyvora immutable ledger using unique SHA-256 credential hashes."
      breadcrumbs={[{ name: 'Employer Verification', path: '/employer-verification' }]}
    >
      {/* 1. Interactive Verification Card */}
      <section style={{ marginBottom: 56 }}>
        <div
          className="card-linear"
          style={{
            maxWidth: 780,
            margin: '0 auto',
            padding: 36,
            borderRadius: 16,
            background: 'linear-gradient(180deg, rgba(245,158,11,0.06) 0%, rgba(15,17,26,0.95) 100%)',
            border: '1px solid rgba(245,158,11,0.3)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(245,158,11,0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <ShieldCheck size={26} color="var(--gold, #f59e0b)" />
            </div>
            <h2 className="font-display" style={{ fontSize: 24, fontWeight: 800, color: '#f8fafc', margin: '0 0 6px' }}>
              Query the Immutable Credential Ledger
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>
              Enter a candidate’s SHA-256 passport hash or scan a credential QR code.
            </p>
          </div>

          <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                placeholder="e.g. e9b2a7d4c8f10356789abcdef0123456789abcdef0123456..."
                className="font-mono"
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 44px',
                  borderRadius: 10,
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#f8fafc',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#f87171' }}>
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-gold"
              style={{
                padding: '14px 24px',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: 'pointer',
                border: 'none',
              }}
            >
              <ShieldCheck size={18} /> Verify Credential Authenticity
            </button>
          </form>

          {/* Sample Pre-fills */}
          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              Try a Verifiable Sample Ledger Record:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sampleHashes.map((s) => (
                <button
                  key={s.hash}
                  type="button"
                  onClick={() => handleUseSample(s.hash)}
                  style={{
                    textAlign: 'left',
                    padding: '8px 12px',
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: '#e2e8f0',
                    fontSize: 12,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{s.label}</span>
                  <span className="font-mono" style={{ fontSize: 10.5, color: 'var(--gold, #f59e0b)' }}>Load Hash →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Verification Guarantees */}
      <section style={{ marginBottom: 56 }}>
        <h2 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#f8fafc', marginBottom: 24, textAlign: 'center' }}>
          What Employers Can Deterministically Verify
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          <div className="card-linear" style={{ padding: 24, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Award size={19} color="#10b981" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>Institutional Issuance</h3>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              Direct cryptographic attestation from the issuing training institute or vocational body, signed with their accredited authority key.
            </p>
          </div>

          <div className="card-linear" style={{ padding: 24, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(56,189,248,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <FileCheck size={19} color="#38bdf8" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>Diagnostic Benchmarks</h3>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              Verified test scores, timed coding submissions, and anti-cheat proctoring metrics validated on Ryyvora’s testing engine.
            </p>
          </div>

          <div className="card-linear" style={{ padding: 24, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Lock size={19} color="var(--gold, #f59e0b)" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>NSQF Tier Level</h3>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              Official National Skills Qualification Framework alignment (Level 4 through 8) certifying candidate seniority and competency depth.
            </p>
          </div>

          <div className="card-linear" style={{ padding: 24, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(168,85,247,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Building2 size={19} color="#a855f7" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>DPDP Consent Proof</h3>
            <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              Verifies that the candidate explicitly granted lawful consent under India’s DPDP Act 2023 for credential verification.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 36, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
        <h2 className="font-display" style={{ fontSize: 24, fontWeight: 800, color: '#f8fafc', marginBottom: 12 }}>
          Integrate Automated Verification via Enterprise API
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 15, maxWidth: 620, margin: '0 auto 20px' }}>
          Connect your ATS, HRIS, or background check platform directly to Ryyvora’s verification endpoints.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          <Link href="/for-employers" className="btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
            Employer Platform Overview <ArrowRight size={14} />
          </Link>
          <Link href="/contact" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 8, fontWeight: 600, textDecoration: 'none' }}>
            Request API Credentials
          </Link>
        </div>
      </section>
    </PublicPageShell>
  );
}
