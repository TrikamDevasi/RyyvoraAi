'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  AlertTriangle,
  Award,
  CheckCircle2,
  Copy,
  Printer,
  ExternalLink,
  QrCode,
  Building2,
  Sparkles,
  Lock,
  ArrowLeft,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AIBadge } from '@/components/ui/AIBadge';
import { ScanningState } from '@/components/ui/ScanningState';
import { ErrorState } from '@/components/ui/ErrorState';

export default function PublicVerifyPage() {
  const params = useParams();
  const hash = (params?.hash as string) || '';

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchVerification = async () => {
    if (!hash) return;
    setLoading(true);
    setError(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      const res = await fetch(`${baseUrl}/students/passport/verify/${encodeURIComponent(hash)}`);
      const json = await res.json();

      if (json.success === false || !json.data || json.data.status !== 'VERIFIED') {
        throw new Error(json?.message || 'Credential not found');
      }
      setData(json.data);
    } catch (err: any) {
      setError(err?.message || 'Verification could not be established');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerification();
  }, [hash]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Public Verification Link copied');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text-primary)', padding: '40px 20px' }}>
      {/* ── Top Verification Navigation ── */}
      <div style={{ maxWidth: 880, margin: '0 auto 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13 }}
        >
          <ArrowLeft size={16} /> Back to Ryyvora AI
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AIBadge type="live" label="PUBLIC VERIFIER" />
        </div>
      </div>

      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        {/* ── Loading State ── */}
        {loading && (
          <ScanningState
            title="Validating Cryptographic Credential"
            subtitle={`Verifying SHA-256 HMAC digital seal against the Ryyvora national competency ledger for hash: ${hash.slice(0, 16)}...`}
            stage="Consensus Validation · SHA-256 Digest Verification"
          />
        )}

        {/* ── Error / Not Found State ── */}
        {!loading && error && (
          <div className="card-linear" style={{ padding: 32, textAlign: 'center' }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.12)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <AlertTriangle size={28} />
            </div>

            <div style={{ display: 'inline-flex', marginBottom: 8 }}>
              <AIBadge type="error" label="UNVERIFIED / INVALID HASH" />
            </div>

            <h2 className="font-display" style={{ fontSize: 22, fontWeight: 800, color: '#f8fafc', margin: '4px 0 8px' }}>
              Credential Verification Failed
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 520, margin: '0 auto 20px', lineHeight: 1.5 }}>
              No active or verified skill passport exists matching the signature <code className="font-mono text-amber-400">{hash}</code>. The record may have expired, been revoked, or the verification link was altered.
            </p>

            <button type="button" onClick={fetchVerification} className="btn-gold" style={{ fontSize: 13, padding: '9px 22px' }}>
              Retry Verification Check
            </button>
          </div>
        )}

        {/* ── Success / Verified State ── */}
        {!loading && !error && data && data.status === 'VERIFIED' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Header Status Bar */}
            <div
              className="card-accent"
              style={{
                padding: '24px 28px',
                borderRadius: 16,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 16,
                background: 'linear-gradient(180deg, rgba(16,185,129,0.08) 0%, rgba(15,17,26,0.98) 100%)',
                border: '1px solid rgba(16,185,129,0.3)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 11,
                      fontWeight: 800,
                      color: '#10b981',
                      background: 'rgba(16,185,129,0.15)',
                      padding: '3px 8px',
                      borderRadius: 99,
                      textTransform: 'uppercase',
                    }}
                  >
                    <ShieldCheck size={13} /> Authenticity Cryptographically Verified
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Verified at {new Date(data.verifiedAt).toLocaleTimeString()}</span>
                </div>

                <h1 className="font-display" style={{ fontSize: 24, fontWeight: 900, color: '#f8fafc', margin: '4px 0 0' }}>
                  {data.candidate?.name}
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>
                  Enrollment: <strong style={{ color: '#f8fafc' }}>{data.candidate?.enrollmentNumber}</strong> · {data.candidate?.program}
                </p>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="btn-secondary"
                  style={{ fontSize: 12, padding: '7px 14px' }}
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? 'Link Copied!' : 'Share Verification'}
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="btn-secondary"
                  style={{ fontSize: 12, padding: '7px 14px' }}
                >
                  <Printer size={13} /> Print Certificate
                </button>
              </div>
            </div>

            {/* Credential Details Matrix */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              <div className="card-linear" style={{ padding: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  NSQF Qualification Tier
                </div>
                <div className="font-display" style={{ fontSize: 18, fontWeight: 900, color: 'var(--gold)', marginTop: 4 }}>
                  Level {data.candidate?.nsqfLevel}
                </div>
                <div style={{ fontSize: 11, color: '#10b981', marginTop: 2 }}>Advanced Technical Tier</div>
              </div>

              <div className="card-linear" style={{ padding: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Verified Readiness Score
                </div>
                <div className="font-display" style={{ fontSize: 18, fontWeight: 900, color: '#f8fafc', marginTop: 4 }}>
                  {data.candidate?.overallScore} / 100
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Multi-Factor Evaluation</div>
              </div>

              <div className="card-linear" style={{ padding: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Issuing Authority
                </div>
                <div className="font-display" style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc', marginTop: 4 }}>
                  {data.candidate?.institution}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>National Registry</div>
              </div>
            </div>

            {/* Verified Competencies Matrix */}
            <div className="card-linear" style={{ padding: 22 }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 14 }}>
                Evaluated Competency Ledgers
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
                {data.skills?.map((sk: any, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 8,
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>{sk.name}</div>
                      <div style={{ fontSize: 10.5, color: '#10b981', display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                        <CheckCircle2 size={11} /> Verified via AI Diagnostic
                      </div>
                    </div>

                    <div className="font-display" style={{ fontSize: 15, fontWeight: 800, color: 'var(--gold)' }}>
                      {sk.score}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cryptographic Seal & Verification Ledger */}
            <div
              style={{
                padding: 18,
                borderRadius: 12,
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 16,
              }}
            >
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Lock size={13} /> {data.algorithm || 'SHA-256 HMAC Digital Seal'}
                </div>
                <div
                  className="font-mono"
                  style={{
                    fontSize: 11,
                    color: '#cbd5e1',
                    marginTop: 6,
                    wordBreak: 'break-all',
                    background: 'rgba(255,255,255,0.03)',
                    padding: '8px 12px',
                    borderRadius: 6,
                  }}
                >
                  {data.passportHash || hash}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Verification Authority</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc' }}>Ryyvora AI Validator</div>
                  <div style={{ fontSize: 10.5, color: '#10b981' }}>Live Consensus</div>
                </div>

                <div
                  style={{
                    width: 44,
                    height: 44,
                    background: '#fff',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#090a0f',
                    padding: 4,
                  }}
                >
                  <QrCode size={36} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
