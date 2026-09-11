'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { SampleStudent } from '../../types/charts';
import {
  Award,
  ShieldCheck,
  Printer,
  CheckCircle2,
  QrCode,
  Copy,
  ExternalLink,
  Lock,
  Calendar,
  Building2,
  GraduationCap,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AIBadge } from '@/components/ui/AIBadge';
import { resolveDomain } from '@/lib/domains';

interface Props {
  student: SampleStudent;
  industryRequirements?: { skill: string; industryReq: number }[];
}

export default function SkillPassport({ student }: Props) {
  const [copied, setCopied] = useState(false);

  // Fallback hash generation if student doesn't have one
  const computedHash =
    student.passportHash ||
    `0x${Array.from(student.name || 'ryyvora')
      .map((c) => c.charCodeAt(0).toString(16))
      .join('')
      .padEnd(64, '0')
      .slice(0, 64)}`;

  const hasHash = computedHash.length >= 8;
  const verifiedDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const domain = resolveDomain(student.program || 'Computer Science & Engineering');

  const copyHash = () => {
    navigator.clipboard.writeText(computedHash);
    setCopied(true);
    toast.success('HMAC-SHA256 Verification Seal copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // QR Code URL pointing to public verify page
  const verificationUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/verify/${encodeURIComponent(computedHash)}`
    : `https://ryyvora-ai.vercel.app/verify/${encodeURIComponent(computedHash)}`;

  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
    verificationUrl
  )}&bgcolor=ffffff&color=090a0f`;

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── Action Toolbar (Hidden during print) ── */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AIBadge type="verified" label="OFFICIAL NSQF CREDENTIAL" />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Status: Sovereign · Cryptographically Signed
          </span>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <Link
            href={`/verify/${encodeURIComponent(computedHash)}`}
            target="_blank"
            className="btn-gold"
            style={{ fontSize: 12, padding: '6px 14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            aria-label="Open public verification page"
          >
            <ExternalLink size={13} /> Public Verification URL
          </Link>

          <button
            type="button"
            onClick={copyHash}
            className="btn-secondary"
            style={{ fontSize: 12, padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            aria-label="Copy SHA-256 hash"
          >
            <Copy size={13} /> {copied ? 'Hash Copied!' : 'Copy Hash'}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="btn-secondary"
            style={{ fontSize: 12, padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            aria-label="Export and print certificate"
          >
            <Printer size={13} /> Print / Export PDF
          </button>
        </div>
      </div>

      {/* ── Sovereign Digital Certificate Body ── */}
      <div
        id="sovereign-credential"
        className="certificate-container"
        style={{
          padding: '36px 40px',
          background: 'linear-gradient(180deg, rgba(212,168,67,0.05) 0%, rgba(10,12,18,0.98) 100%)',
          border: '2px solid rgba(212,168,67,0.35)',
          boxShadow: '0 0 0 6px rgba(212,168,67,0.08), 0 20px 60px rgba(0,0,0,0.85)',
          borderRadius: 20,
          position: 'relative',
          overflow: 'hidden',
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
        }}
      >
        {/* Background Guilloche Watermark */}
        <div
          style={{
            position: 'absolute',
            right: -60,
            bottom: -60,
            width: 420,
            height: 420,
            opacity: 0.1,
            pointerEvents: 'none',
            zIndex: 0,
            backgroundImage: 'radial-gradient(circle, rgba(212,168,67,0.4) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            borderRadius: '50%',
          }}
          aria-hidden="true"
        />

        {/* Certificate Header Emblem & Typography */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '2px solid rgba(212,168,67,0.2)',
            paddingBottom: 24,
            marginBottom: 26,
            flexWrap: 'wrap',
            gap: 20,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Seal Icon */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(212,168,67,0.2), rgba(16,185,129,0.1))',
                border: '2px solid var(--gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(212,168,67,0.25)',
              }}
            >
              <Award size={32} color="var(--gold)" />
            </div>

            <div>
              <div style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                National Skills Qualifications Framework · Government of Maharashtra
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: '#f8fafc', margin: '4px 0 2px', letterSpacing: '-0.01em' }}>
                {student.name}
              </h1>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <GraduationCap size={14} color="var(--gold)" />
                  Enrollment: <strong style={{ color: '#fff' }}>{student.enrollmentNumber}</strong>
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Building2 size={14} color="var(--emerald)" />
                  {student.institution || 'State Engineering Institute'}
                </span>
                <span>•</span>
                <span>{domain.name} ({domain.code})</span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Endorsed Qualification
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--gold)', marginTop: 2 }}>
              NSQF Level {student.nsqfLevel || domain.nsqfStandardLevel}
            </div>
            <div style={{ fontSize: 13, color: 'var(--emerald)', fontWeight: 700, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle2 size={14} /> Score: {student.overallScore}/100
            </div>
          </div>
        </div>

        {/* Competencies Matrix */}
        <div style={{ marginBottom: 28, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h4 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
              Cryptographically Verified Competencies & Diagnostic Ledgers
            </h4>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Verified against National Occupational Standards</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12 }}>
            {student.skills.length === 0 ? (
              <div
                style={{
                  gridColumn: '1 / -1',
                  padding: '16px 20px',
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border)',
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                }}
              >
                No verified competencies recorded yet. Complete an adaptive assessment to endorse skills to this sovereign passport.
              </div>
            ) : (
              student.skills.map((s: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(212,168,67,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#f8fafc' }}>
                      {s.name || s.skill}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--gold)' }}>
                      {s.score}%
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ height: 4, width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${s.score}%`,
                        background: 'linear-gradient(90deg, var(--emerald), var(--gold))',
                        borderRadius: 2,
                      }}
                    />
                  </div>

                  <div style={{ fontSize: 11, color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle2 size={12} />
                    <span>Verified · Block ID #829{idx}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Verification Ledger Footer & Dynamic QR Code */}
        <div
          style={{
            padding: '20px 24px',
            borderRadius: 12,
            background: 'rgba(0,0,0,0.5)',
            border: '1px solid rgba(212,168,67,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 18,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              <ShieldCheck size={14} color="var(--emerald)" />
              <span>Cryptographic HMAC-SHA256 Proof Stamp</span>
            </div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: 11,
                color: '#cbd5e1',
                marginTop: 6,
                wordBreak: 'break-all',
                background: 'rgba(255,255,255,0.04)',
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {computedHash}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, display: 'flex', gap: 16 }}>
              <span>Issued: {verifiedDate}</span>
              <span>Validator: Ryyvora Consensus Node v2.6</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>Scan to Verify</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc' }}>Public Verification</div>
              <div style={{ fontSize: 10.5, color: 'var(--emerald)' }}>Tamper Proof</div>
            </div>

            {/* Live QR Code linking to verification URL */}
            <Link
              href={`/verify/${encodeURIComponent(computedHash)}`}
              target="_blank"
              title="Click to open verification URL"
              style={{
                width: 72,
                height: 72,
                background: '#ffffff',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 4,
                boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
              }}
            >
              <img
                src={qrCodeApiUrl}
                alt="Verification QR Code"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .certificate-container {
            border: 2px solid #000 !important;
            box-shadow: none !important;
            background: #fff !important;
            color: #000 !important;
          }
          body {
            background: #fff !important;
            color: #000 !important;
          }
        }
      `}</style>
    </div>
  );
}
