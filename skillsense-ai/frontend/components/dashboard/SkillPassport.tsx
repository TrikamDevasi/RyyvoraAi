'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { SampleStudent } from '../../types/charts';
import { Award, ShieldCheck, Share2, Printer, CheckCircle2, QrCode, Copy, ExternalLink, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';
import { AIBadge } from '@/components/ui/AIBadge';

interface Props {
  student: SampleStudent;
  industryRequirements?: { skill: string; industryReq: number }[];
}

export default function SkillPassport({ student }: Props) {
  const [copied, setCopied] = useState(false);

  const hash: string = student.passportHash || '';

  const hasHash = hash.length >= 8;

  const copyHash = () => {
    if (!hasHash) return;
    navigator.clipboard.writeText(hash);
    setCopied(true);
    toast.success('SHA-256 Verification Hash copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── Action Toolbar ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AIBadge type="verified" label="OFFICIAL NSQF RECORD" />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Status: Active & Cryptographically Verified</span>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {hasHash ? (
            <Link
              href={`/verify/${encodeURIComponent(hash)}`}
              target="_blank"
              className="btn-gold"
              style={{ fontSize: 12, padding: '6px 14px', textDecoration: 'none' }}
              aria-label="Open public verification page"
            >
              <ExternalLink size={13} /> Public Verification URL
            </Link>
          ) : (
            <span className="badge" style={{ fontSize: 11, color: '#f59e0b', border: '1px solid rgba(245,158,11,0.4)', background: 'rgba(245,158,11,0.08)' }}>
              Passport not yet ledger-signed
            </span>
          )}
          {hasHash && (
            <button
              type="button"
              onClick={copyHash}
              className="btn-secondary"
              style={{ fontSize: 12, padding: '6px 12px' }}
              aria-label="Copy SHA-256 hash"
            >
              <Copy size={13} /> {copied ? 'Hash Copied!' : 'Copy Hash'}
            </button>
          )}
          <button
            type="button"
            onClick={handlePrint}
            className="btn-secondary"
            style={{ fontSize: 12, padding: '6px 12px' }}
            aria-label="Export and print certificate"
          >
            <Printer size={13} /> Export Credential
          </button>
        </div>
      </div>

      {/* ── Verified Credential Card ── */}
      <div
        className="card-accent card-shine"
        style={{
          padding: 28,
          background: 'linear-gradient(180deg, rgba(245,158,11,0.06) 0%, rgba(15,17,26,0.98) 100%)',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 16,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle Watermark Seal */}
        <div
          style={{
            position: 'absolute',
            right: -20,
            bottom: -20,
            opacity: 0.04,
            pointerEvents: 'none',
            color: 'var(--gold)',
          }}
          aria-hidden="true"
        >
          <Award size={260} />
        </div>

        {/* Certificate Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '1px solid var(--border)',
            paddingBottom: 20,
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: 20,
                color: '#090a0f',
                boxShadow: '0 4px 16px rgba(245,158,11,0.3)',
              }}
            >
              SK
            </div>

            <div>
              <div style={{ fontSize: 10.5, color: 'var(--gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                National Vocational Framework
              </div>
              <h2 className="font-display" style={{ fontSize: 22, fontWeight: 900, color: '#f8fafc', margin: '2px 0 0' }}>
                {student.name}
              </h2>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                Enrollment ID: <strong style={{ color: '#f8fafc' }}>{student.enrollmentNumber}</strong> · {student.program}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Verified Competency Tier</div>
            <div className="font-display" style={{ fontSize: 26, fontWeight: 900, color: 'var(--gold)', marginTop: 2 }}>
              NSQF Level {student.nsqfLevel}
            </div>
            <div style={{ fontSize: 12, color: '#10b981', fontWeight: 700, marginTop: 2 }}>
              Score: {student.overallScore}/100
            </div>
          </div>
        </div>

        {/* Competencies Matrix */}
        <div style={{ marginBottom: 24 }}>
          <h4 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
            Verified Skill Ledgers & Diagnostics
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
            {student.skills.length === 0 ? (
              <div
                style={{
                  gridColumn: '1 / -1',
                  padding: '14px 16px',
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border)',
                  fontSize: 12.5,
                  color: 'var(--text-secondary)',
                }}
              >
                No verified competencies are linked to this passport yet. Assess your skills to generate verified ledgers
                that can be signed into this credential.
              </div>
            ) : (
              student.skills.map((s: any, idx: number) => (
                <div
                  key={idx}
                  className="skill-row"
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
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>
                      {s.name || s.skill}
                    </div>
                    <div style={{ fontSize: 10.5, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <CheckCircle2 size={11} /> Cryptographically verified
                    </div>
                  </div>

                  <div className="font-display" style={{ fontSize: 15, fontWeight: 800, color: 'var(--gold)' }}>
                    {s.score}%
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Verification Seal & Hash Footer */}
        <div
          style={{
            padding: 16,
            borderRadius: 10,
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 14,
          }}
        >
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              <ShieldCheck size={14} color="#10b981" /> Immutable SHA-256 Ledger Signature
            </div>
            {hasHash ? (
              <div
                className="font-mono"
                style={{
                  fontSize: 11,
                  color: '#cbd5e1',
                  marginTop: 4,
                  wordBreak: 'break-all',
                  background: 'rgba(255,255,255,0.03)',
                  padding: '6px 10px',
                  borderRadius: 6,
                }}
              >
                {hash}
              </div>
            ) : (
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>
                No ledger signature has been issued yet. A signed hash will appear here once your passport is finalized.
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>Authority Seal</div>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: '#f8fafc' }}>SkillSense AI Validator</div>
              <div style={{ fontSize: 10, color: '#10b981' }}>Live Consensus</div>
            </div>

            {hasHash && (
              <Link
                href={`/verify/${encodeURIComponent(hash)}`}
                target="_blank"
                title="Click to open live public verification"
                aria-label="Scan QR or open verification"
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
                  textDecoration: 'none',
                  transition: 'transform 0.15s ease',
                }}
                className="hover:scale-105"
              >
                <QrCode size={36} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
