'use client';

import React from 'react';

export interface StatusRowProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  tags?: React.ReactNode[];
  metrics?: { label: string; value: React.ReactNode }[];
  status?: React.ReactNode;
  action?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function StatusRow({
  icon,
  title,
  subtitle,
  tags,
  metrics,
  status,
  action,
  onClick,
  className = '',
  style = {},
}: StatusRowProps) {
  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      className={`status-row ${className}`.trim()}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.05))',
        background: 'transparent',
        gap: 12,
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'background-color 150ms ease',
        ...style,
      }}
    >
      {/* Left: Icon/Avatar + Title/Subtitle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
        {icon && (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: 'var(--bg-surface-elevated, #1A2234)',
              border: '1px solid var(--border-default, rgba(255, 255, 255, 0.08))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-gold, #F59E0B)',
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}

        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--text-primary, #F8FAFC)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {title}
            </span>
            {tags?.map((tag, idx) => (
              <span key={idx}>{tag}</span>
            ))}
          </div>

          {subtitle && (
            <div
              style={{
                fontSize: 11.5,
                color: 'var(--text-muted, #64748B)',
                marginTop: 2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {/* Center: Structured Metrics */}
      {metrics && metrics.length > 0 && (
        <div className="hidden sm:flex" style={{ alignItems: 'center', gap: 16, flexShrink: 0 }}>
          {metrics.map((m, idx) => (
            <div key={idx} style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 9.5, color: 'var(--text-muted, #64748B)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {m.label}
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary, #F8FAFC)' }}>
                {m.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Right: Status badge & Action button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        {status}
        {action}
      </div>
    </div>
  );
}
