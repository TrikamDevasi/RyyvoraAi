'use client';

import React from 'react';
import { Cpu, RefreshCw, CheckCircle2, Circle } from 'lucide-react';

interface ScanningStateProps {
  title?: string;
  subtitle?: string;
  stage?: string;
  stages?: string[];
  currentStageIndex?: number;
}

export function ScanningState({
  title = 'Analyzing Skill Profile',
  subtitle = 'Neural model extracting competencies against NSQF vocational taxonomy...',
  stage,
  stages = [
    'Preparing Profile Input & Syntax Tokens',
    'Extracting Technical & Soft Competencies',
    'Aligning with NSQF National Framework',
    'Benchmarking Active Industry Requisitions',
    'Generating Cryptographic Verification Proof',
  ],
  currentStageIndex = 1,
}: ScanningStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        padding: '36px 24px',
        borderRadius: 14,
        background: 'rgba(15,17,26,0.95)',
        border: '1px solid rgba(245,158,11,0.25)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Laser Scanning Indicator */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)',
          animation: 'scan-line 2.5s ease-in-out infinite',
        }}
      />

      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: 'rgba(245,158,11,0.12)',
          border: '1px solid rgba(245,158,11,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          color: '#f59e0b',
        }}
      >
        <RefreshCw size={22} className="animate-spin" />
      </div>

      <h4 style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
        {title}
      </h4>

      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: 13,
          maxWidth: 520,
          margin: '8px auto 20px',
          lineHeight: 1.5,
        }}
      >
        {subtitle}
      </p>

      {/* Progress Stages Ledger */}
      <div
        style={{
          maxWidth: 480,
          margin: '0 auto 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          textAlign: 'left',
          background: 'rgba(255,255,255,0.02)',
          padding: '12px 16px',
          borderRadius: 8,
          border: '1px solid var(--border)',
        }}
      >
        {stages.map((stg, idx) => {
          const isDone = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 12,
                color: isDone ? '#10b981' : isCurrent ? 'var(--gold)' : 'var(--text-muted)',
                fontWeight: isCurrent ? 700 : 500,
              }}
            >
              {isDone ? (
                <CheckCircle2 size={13} color="#10b981" />
              ) : isCurrent ? (
                <RefreshCw size={12} className="animate-spin" color="var(--gold)" />
              ) : (
                <Circle size={10} color="#64748b" />
              )}
              <span>{stg}</span>
            </div>
          );
        })}
      </div>

      {stage && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            borderRadius: 99,
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.2)',
            fontSize: 11,
            color: 'var(--gold)',
            fontFamily: 'monospace',
          }}
        >
          <Cpu size={12} /> {stage}
        </div>
      )}
    </div>
  );
}
