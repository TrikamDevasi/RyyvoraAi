'use client';

import React from 'react';
import { Cpu, RefreshCw } from 'lucide-react';

interface ScanningStateProps {
  title?: string;
  subtitle?: string;
  stage?: string;
}

export function ScanningState({
  title = 'Analyzing Skill Profile',
  subtitle = 'Neural model extracting competencies against NSQF vocational taxonomy...',
  stage,
}: ScanningStateProps) {
  return (
    <div
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

      <h4 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', margin: 0 }}>
        {title}
      </h4>
      <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 6, maxWidth: 500, marginInline: 'auto' }}>
        {subtitle}
      </p>

      {stage && (
        <div style={{ marginTop: 16 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 12px',
              borderRadius: 99,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              fontSize: 11,
              fontFamily: 'monospace',
              color: '#f59e0b',
            }}
          >
            <Cpu size={12} /> {stage}
          </span>
        </div>
      )}
    </div>
  );
}
