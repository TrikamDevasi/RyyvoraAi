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
          background: 'var(--error-bg, rgba(239,68,68,0.1))',
          border: '1px solid var(--error-border, rgba(239,68,68,0.3))',
          color: 'var(--error, #ef4444)',
          fontSize: 10.5,
          fontWeight: 700,
          borderRadius: 99,
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
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
          background: 'var(--success-bg, rgba(16,185,129,0.08))',
          border: '1px solid var(--success-border, rgba(16,185,129,0.25))',
          color: 'var(--success, #10b981)',
          fontSize: 10.5,
          fontWeight: 700,
          borderRadius: 99,
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
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
          background: 'var(--info-bg, rgba(59,130,246,0.08))',
          border: '1px solid var(--info-border, rgba(59,130,246,0.22))',
          color: 'var(--info, #3b82f6)',
          fontSize: 10.5,
          fontWeight: 700,
          borderRadius: 99,
          letterSpacing: '0.03em',
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--info, #3b82f6)', animation: 'pulse-slow 2s infinite' }} />
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
          background: 'var(--gold-muted, rgba(245,158,11,0.08))',
          border: '1px solid var(--gold-border, rgba(245,158,11,0.25))',
          color: 'var(--gold, #f59e0b)',
          fontSize: 10.5,
          fontWeight: 700,
          borderRadius: 99,
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
        }}
      >
        <Activity size={12} />
        {label || 'NSQF LEVEL 4'}
      </span>
    );
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        background: 'var(--gold-muted, rgba(245,158,11,0.08))',
        border: '1px solid var(--gold-border, rgba(245,158,11,0.25))',
        color: 'var(--gold, #f59e0b)',
        fontSize: 10.5,
        fontWeight: 700,
        borderRadius: 99,
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
      }}
    >
      <Sparkles size={11} />
      {label || 'AI ASSISTED'}
    </span>
  );
}
