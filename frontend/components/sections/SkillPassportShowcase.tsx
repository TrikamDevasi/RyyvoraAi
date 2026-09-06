'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
  QrCode,
  Lock,
  Award,
  Sparkles,
  ArrowRight,
  Search,
  Check,
} from 'lucide-react';
import { AIBadge } from '@/components/ui/AIBadge';
import toast from 'react-hot-toast';

export default function SkillPassportShowcase() {
  const [hashInput, setHashInput] = useState('0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleSimulateVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      toast.success('SHA-256 Cryptographic Signature validated against Maharashtra State Ledger!');
    }, 600);
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(hashInput);
    setCopied(true);
    toast.success('Ledger Hash copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="passport" style={{ padding: '80px 24px', position: 'relative' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <AIBadge type="verified" label="OFFICIAL NSQF WORKFORCE CREDENTIAL" />
            <AIBadge type="nsqf" label="SHA-256 TAMPER-PROOF" />
          </div>
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(26px, 3.6vw, 40px)',
              fontWeight: 900,
              color: '#f8fafc',
              letterSpacing: '-0.03em',
              margin: '0 auto 12px',
              maxWidth: 860,
            }}
          >
            Cryptographic Skill Passport &{' '}
            <span style={{ color: 'var(--gold, #f59e0b)' }}>Employer Outcome Verification</span>
          </h2>
          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'clamp(14px, 1.6vw, 16px)',
              maxWidth: 720,
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Every candidate receives an immutable, cryptographically signed digital passport. Employers verify genuine competency in seconds — eliminating resume fraud.
          </p>
        </div>

        {/* Passport Showcase Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'center' }}>
          {/* Left: Interactive Verification Simulator */}
          <div style={{ padding: 24, borderRadius: 16, background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: '0 8px 24px -4px rgba(0,0,0,0.45)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
                <Search size={18} />
              </div>
              <div>
                <h3 className="font-display" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Instant Credential Authenticator
                </h3>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Query Maharashtra State Skill Ledger in Real-Time</div>
              </div>
            </div>

            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 18 }}>
              Try entering or verifying this live sample candidate hash to test cryptographic authenticity verification:
            </p>

            {/* Input & Action */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ position: 'relative', marginBottom: 10 }}>
                <input
                  type="text"
                  value={hashInput}
                  onChange={(e) => setHashInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--gold-border)',
                    color: '#f8fafc',
                    fontSize: 11.5,
                    fontFamily: 'monospace',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleSimulateVerify}
                  disabled={isVerifying}
                  className="btn-gold"
                  style={{ flex: 1, padding: '9px 18px', fontSize: 12.5, fontWeight: 700, cursor: isVerifying ? 'not-allowed' : 'pointer' }}
                >
                  <ShieldCheck size={14} />
                  <span>{isVerifying ? 'Authenticating Ledger...' : 'Verify Cryptographic Hash'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyHash}
                  className="btn-secondary"
                  style={{ padding: '9px 14px', fontSize: 12.5 }}
                >
                  {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Verification Telemetry Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#10b981' }}>
                <CheckCircle2 size={14} /> SHA-256 Root Hash Match (Block #1,842,910)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#10b981' }}>
                <CheckCircle2 size={14} /> Ministry of Skill Development NSQF Tier 6 Verified
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#10b981' }}>
                <CheckCircle2 size={14} /> Proctored Diagnostic Evaluation (94.2 Percentile)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#10b981' }}>
                <CheckCircle2 size={14} /> Zero Red Flags / Anti-Fraud Timestamp Validated
              </div>
            </div>
          </div>

          {/* Right: Realistic Verified Skill Passport Card Mockup */}
          <div
            style={{
              padding: 24,
              borderRadius: 16,
              border: '1px solid var(--border)',
              background: 'var(--bg-surface)',
              boxShadow: '0 10px 30px -4px rgba(0,0,0,0.5)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Visual Credential Header Banner */}
            <div style={{ height: 120, position: 'relative', margin: '-24px -24px 16px -24px', overflow: 'hidden' }}>
              <img
                src="/images/credentials/digital-credential.jpg"
                alt="Official cryptographically-signed NSQF Skill Passport certificate with state security seals"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, var(--bg-surface) 0%, rgba(11,15,23,0.7) 60%, rgba(11,15,23,0.3) 100%)',
                }}
              />
              <div style={{ position: 'absolute', top: 12, right: 12 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 800, color: '#10b981', background: 'rgba(11,15,23,0.85)', padding: '3px 8px', borderRadius: 4, border: '1px solid rgba(16,185,129,0.3)', backdropFilter: 'blur(4px)' }}>
                  <ShieldCheck size={11} aria-hidden="true" />
                  <span>DIGITALLY SEALED</span>
                </span>
              </div>
            </div>

            {/* Guilloche Watermark Pattern */}
            <div
              style={{
                position: 'absolute',
                right: -40,
                bottom: -40,
                width: 320,
                height: 320,
                opacity: 0.1,
                pointerEvents: 'none',
              }}
              aria-hidden="true"
            >
              <img
                src="/images/brand/credential-guilloche.svg"
                alt=""
                style={{ width: '100%', height: '100%' }}
              />
            </div>

            {/* Passport Certificate Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img
                  src="/images/brand/maharashtra-seal-emblem.svg"
                  alt="Maharashtra State Seal"
                  style={{ width: 46, height: 46, borderRadius: '50%' }}
                />
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Government of Maharashtra · Skill Registry
                  </div>
                  <div className="font-display" style={{ fontSize: 18, fontWeight: 900, color: '#f8fafc' }}>
                    Aarav Deshmukh
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                    ID: <strong>MH-NSQF-2026-8841</strong> · Pune Cluster
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Competency Tier</span>
                <div className="font-display" style={{ fontSize: 16, fontWeight: 900, color: 'var(--gold)' }}>
                  NSQF Level 6
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981' }}>Score: 94/100</span>
              </div>
            </div>

            {/* Skills Radar Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 16 }}>
              {[
                { name: 'TypeScript & Architecture', score: '94%' },
                { name: 'Distributed Caching (Redis)', score: '91%' },
                { name: 'Container CI/CD (Docker)', score: '88%' },
                { name: 'Data Pipeline Design', score: '85%' },
              ].map((s, idx) => (
                <div key={idx} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 6, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{s.name}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--gold)' }}>{s.score} Verified</div>
                </div>
              ))}
            </div>

            {/* QR Code & Signature Strip */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.4)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, background: '#f8fafc', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#090a0f' }}>
                  <QrCode size={28} />
                </div>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <ShieldCheck size={12} /> SHA-256 IMMUTABLE LEDGER
                  </div>
                  <div style={{ fontSize: 9.5, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    0x7f83b165...126d9069
                  </div>
                </div>
              </div>

              <Link
                href="/student/passport"
                className="btn-gold"
                style={{ fontSize: 11.5, padding: '6px 12px', textDecoration: 'none' }}
              >
                <span>View Full Passport</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
