'use client';

import React from 'react';
import { CheckCircle2, Circle, Loader2, ShieldCheck } from 'lucide-react';

interface ScanningStateProps {
  title?: string;
  subtitle?: string;
  stage?: string;
  stages?: string[];
  currentStageIndex?: number;
}

export function ScanningState({
  title = 'Processing Competency Assessment',
  subtitle = 'Benchmarking submitted competencies against NSQF vocational standards.',
  stage,
  stages = [
    'Reading submission data',
    'Identifying verified skill evidence',
    'Mapping against NSQF Level benchmarks',
    'Generating credential assessment summary',
  ],
  currentStageIndex = 1,
}: ScanningStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        padding: '32px 24px',
        borderRadius: 12,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        textAlign: 'center',
        position: 'relative',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: 'var(--accent-glow)',
          border: '1px solid var(--border-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          color: 'var(--gold)',
        }}
      >
        <Loader2 size={22} className="animate-spin" aria-hidden="true" />
      </div>

      <h4
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: 0,
        }}
      >
        {title}
      </h4>

      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: 13,
          maxWidth: 480,
          margin: '8px auto 20px',
          lineHeight: 1.5,
        }}
      >
        {subtitle}
      </p>

      {/* Structured Stepper */}
      <div
        style={{
          maxWidth: 440,
          margin: '0 auto 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          textAlign: 'left',
          background: 'var(--bg-surface-elevated)',
          padding: '14px 18px',
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
                fontSize: 12.5,
                color: isDone
                  ? 'var(--success)'
                  : isCurrent
                  ? 'var(--gold)'
                  : 'var(--text-muted)',
                fontWeight: isCurrent ? 600 : 450,
              }}
            >
              {isDone ? (
                <CheckCircle2 size={14} color="var(--success)" aria-hidden="true" />
              ) : isCurrent ? (
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    border: '2px solid var(--gold)',
                    borderTopColor: 'transparent',
                    animation: 'spin 1s linear infinite',
                  }}
                  aria-hidden="true"
                />
              ) : (
                <Circle size={12} color="var(--text-muted)" aria-hidden="true" />
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
            padding: '4px 12px',
            borderRadius: 6,
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border)',
            fontSize: 11.5,
            color: 'var(--text-secondary)',
            fontFamily: 'monospace',
          }}
        >
          <ShieldCheck size={13} color="var(--gold)" />
          <span>{stage}</span>
        </div>
      )}
    </div>
  );
}
