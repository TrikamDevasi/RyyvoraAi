'use client';

import React from 'react';
import { ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

export interface EvidenceItem {
  label: string;
  value: React.ReactNode;
}

export interface InsightPanelProps {
  type?: 'policy' | 'career' | 'hiring' | 'performance' | 'ai';
  signalTag?: string;
  signalType?: 'POSITIVE' | 'WARNING' | 'NEUTRAL';
  title: string;
  evidence?: React.ReactNode | EvidenceItem[];
  recommendation: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  primaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: React.ReactNode;
  };
  className?: string;
  style?: React.CSSProperties;
}

export function InsightPanel({
  type = 'policy',
  signalTag,
  signalType = 'NEUTRAL',
  title,
  evidence,
  recommendation,
  actionText,
  onAction,
  primaryAction,
  secondaryAction,
  className = '',
  style = {},
}: InsightPanelProps) {
  const defaultTag = signalTag || (signalType === 'POSITIVE' ? 'POLICY SIGNAL' : signalType === 'WARNING' ? 'SYSTEM SIGNAL' : 'OUTCOME DIRECTIVE');
  const accentColor = signalType === 'POSITIVE'
    ? 'var(--success, #10B981)'
    : signalType === 'WARNING'
    ? 'var(--warning, #EF4444)'
    : type === 'ai'
    ? 'var(--info, #06B6D4)'
    : 'var(--brand-gold, #F59E0B)';

  const borderLeftColor = accentColor;

  const resolvedPrimaryAction = primaryAction || (actionText ? { label: actionText, onClick: onAction } : undefined);

  return (
    <div
      className={`insight-panel ${className}`.trim()}
      style={{
        background: 'var(--bg-surface, #111827)',
        border: '1px solid var(--border-default, rgba(255, 255, 255, 0.08))',
        borderLeft: `3px solid ${borderLeftColor}`,
        borderRadius: 'var(--radius-lg, 10px)',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.35))',
        ...style,
      }}
    >
      {/* Top Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: accentColor,
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '2px 7px',
              borderRadius: 4,
              border: `1px solid ${accentColor}40`,
            }}
          >
            {defaultTag}
          </span>
        </div>

        {evidence && (
          <div style={{ fontSize: 11, color: 'var(--text-muted, #64748B)', fontWeight: 600 }}>
            {Array.isArray(evidence) ? (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {evidence.map((item, i) => (
                  <span
                    key={i}
                    style={{
                      display: 'inline-flex',
                      gap: 4,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: 11,
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)' }}>{item.label}:</span>
                    <strong style={{ color: '#f8fafc' }}>{item.value}</strong>
                  </span>
                ))}
              </div>
            ) : (
              evidence
            )}
          </div>
        )}
      </div>

      {/* Main Signal Title */}
      <h4
        className="font-display"
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: 'var(--text-primary, #F8FAFC)',
          margin: 0,
          lineHeight: 1.35,
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </h4>

      {/* Recommended Action / Brief */}
      <div
        style={{
          fontSize: 12.5,
          color: 'var(--text-secondary, #94A3B8)',
          lineHeight: 1.5,
        }}
      >
        <strong style={{ color: '#E2E8F0', fontWeight: 600, marginRight: 6 }}>
          Recommended action:
        </strong>
        {recommendation}
      </div>

      {/* Action CTA Buttons */}
      {(resolvedPrimaryAction || secondaryAction) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2, flexWrap: 'wrap' }}>
          {resolvedPrimaryAction && (
            resolvedPrimaryAction.href ? (
              <a
                href={resolvedPrimaryAction.href}
                className="btn-gold"
                style={{
                  fontSize: 12,
                  padding: '6px 14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  textDecoration: 'none',
                }}
              >
                {resolvedPrimaryAction.icon}
                <span>{resolvedPrimaryAction.label}</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={resolvedPrimaryAction.onClick}
                className="btn-gold"
                style={{
                  fontSize: 12,
                  padding: '6px 14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  cursor: 'pointer',
                  border: 'none',
                  borderRadius: 6,
                }}
              >
                {resolvedPrimaryAction.icon}
                <span>{resolvedPrimaryAction.label}</span>
              </button>
            )
          )}

          {secondaryAction && (
            secondaryAction.href ? (
              <a
                href={secondaryAction.href}
                className="btn-secondary"
                style={{
                  fontSize: 12,
                  padding: '6px 14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  textDecoration: 'none',
                }}
              >
                {secondaryAction.icon}
                <span>{secondaryAction.label}</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={secondaryAction.onClick}
                className="btn-secondary"
                style={{
                  fontSize: 12,
                  padding: '6px 14px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  cursor: 'pointer',
                  borderRadius: 6,
                }}
              >
                {secondaryAction.icon}
                <span>{secondaryAction.label}</span>
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
