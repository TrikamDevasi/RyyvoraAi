'use client';

import React from 'react';
import { ShieldCheck, Zap } from 'lucide-react';

interface ConfidenceScoreProps {
  score: number; // 0.0 to 1.0 or 0 to 100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function ConfidenceScore({ score, size = 'sm', showLabel = true }: ConfidenceScoreProps) {
  const normalized = Math.min(100, Math.max(0, Math.round(score <= 1 ? score * 100 : score)));
  
  const getColor = (val: number) => {
    if (val >= 85) return '#10b981'; // emerald
    if (val >= 70) return '#f59e0b'; // amber
    return '#64748b'; // slate
  };

  const color = getColor(normalized);

  if (size === 'sm') {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#94a3b8' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
        {showLabel && <span>Confidence:</span>}
        <span style={{ fontWeight: 700, color: '#f8fafc' }}>{normalized}%</span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 9px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 99,
        fontSize: 12,
        color: '#94a3b8',
      }}
    >
      <Zap size={13} color={color} />
      {showLabel && <span>Model Confidence:</span>}
      <strong style={{ color: '#f8fafc' }}>{normalized}%</strong>
    </div>
  );
}
