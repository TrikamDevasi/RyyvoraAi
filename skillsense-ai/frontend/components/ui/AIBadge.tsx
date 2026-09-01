'use client';

import React from 'react';
import { Cpu, ShieldCheck, Sparkles, Activity } from 'lucide-react';

interface AIBadgeProps {
  type?: 'ai' | 'verified' | 'live' | 'nsqf';
  label?: string;
}

export function AIBadge({ type = 'ai', label }: AIBadgeProps) {
  if (type === 'verified') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '2px 8px',
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.25)',
          color: '#34d399',
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
          background: 'rgba(59,130,246,0.08)',
          border: '1px solid rgba(59,130,246,0.22)',
          color: '#60a5fa',
          fontSize: 10.5,
          fontWeight: 700,
          borderRadius: 99,
          letterSpacing: '0.03em',
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', animation: 'pulse-slow 2s infinite' }} />
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
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.25)',
          color: '#f59e0b',
          fontSize: 10.5,
          fontWeight: 700,
          borderRadius: 99,
          letterSpacing: '0.03em',
        }}
      >
        <Cpu size={12} />
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
        padding: '2px 7px',
        background: 'rgba(245,158,11,0.06)',
        border: '1px solid rgba(245,158,11,0.2)',
        color: '#f59e0b',
        fontSize: 10.5,
        fontWeight: 700,
        borderRadius: 4,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
      }}
    >
      <Sparkles size={11} />
      {label || 'AI ASSISTED'}
    </span>
  );
}
