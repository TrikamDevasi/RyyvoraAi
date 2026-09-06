'use client';

import React from 'react';
import { ShieldCheck, Sparkles, Activity, AlertCircle } from 'lucide-react';

interface AIBadgeProps {
  type?: 'ai' | 'verified' | 'live' | 'nsqf' | 'error';
  label?: string;
}

export function AIBadge({ type = 'ai', label }: AIBadgeProps) {
  if (type === 'error') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '2px 8px',
          background: 'var(--error-surface, rgba(239,68,68,0.1))',
          border: '1px solid var(--error-border, rgba(239,68,68,0.25))',
          color: 'var(--error, #ef4444)',
          fontSize: 10.5,
          fontWeight: 700,
          borderRadius: 'var(--radius-sm, 6px)',
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        <AlertCircle size={12} />
        {label || 'INVALID RECORD'}
      </span>
    );
  }

  if (type === 'verified') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '2px 8px',
          background: 'var(--success-surface, rgba(16,185,129,0.1))',
          border: '1px solid var(--success-border, rgba(16,185,129,0.25))',
          color: 'var(--success, #10b981)',
          fontSize: 10.5,
          fontWeight: 700,
          borderRadius: 'var(--radius-sm, 6px)',
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        <ShieldCheck size={12} />
        {label || 'VERIFIED CREDENTIAL'}
      </span>
    );
  }

  if (type === 'live') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          padding: '2px 8px',
          background: 'var(--info-surface, rgba(6,182,212,0.1))',
          border: '1px solid var(--info-border, rgba(6,182,212,0.25))',
          color: 'var(--info, #06b6d4)',
          fontSize: 10.5,
          fontWeight: 700,
          borderRadius: 'var(--radius-sm, 6px)',
          letterSpacing: '0.03em',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--info, #06b6d4)' }} />
        {label || 'LIVE TELEMETRY'}
      </span>
    );
  }

  if (type === 'nsqf') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '2px 8px',
          background: 'var(--brand-gold-subtle, rgba(245,158,11,0.08))',
          border: '1px solid var(--brand-gold-border, rgba(245,158,11,0.25))',
          color: 'var(--brand-gold, #f59e0b)',
          fontSize: 10.5,
          fontWeight: 700,
          borderRadius: 'var(--radius-sm, 6px)',
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        <Activity size={12} />
        {label || 'NSQF LEVEL 4'}
      </span>
    );
  }

  // AI telemetry badge — Telemetry Cyan identity
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        background: 'var(--info-surface, rgba(6,182,212,0.1))',
        border: '1px solid var(--info-border, rgba(6,182,212,0.25))',
        color: 'var(--info, #06b6d4)',
        fontSize: 10.5,
        fontWeight: 700,
        borderRadius: 'var(--radius-sm, 6px)',
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      <Sparkles size={11} />
      {label || 'AI ASSISTED'}
    </span>
  );
}
