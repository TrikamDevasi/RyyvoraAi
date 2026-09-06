'use client';

import React from 'react';

export interface AnalyticsPanelProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  noPadding?: boolean;
}

export function AnalyticsPanel({
  title,
  description,
  eyebrow,
  badge,
  action,
  children,
  footer,
  className = '',
  style = {},
  noPadding = false,
}: AnalyticsPanelProps) {
  return (
    <section
      className={`analytics-panel ${className}`.trim()}
      style={{
        background: 'var(--bg-surface, #111827)',
        border: '1px solid var(--border-default, rgba(255, 255, 255, 0.08))',
        borderRadius: 'var(--radius-lg, 10px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.35))',
        ...style,
      }}
    >
      {(title || eyebrow || badge || action) && (
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <div>
            {eyebrow && (
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: 'var(--brand-gold, #F59E0B)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: 3,
                }}
              >
                {eyebrow}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {typeof title === 'string' ? (
                <h3
                  className="font-display"
                  style={{
                    fontSize: 14.5,
                    fontWeight: 700,
                    color: 'var(--text-primary, #F8FAFC)',
                    margin: 0,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {title}
                </h3>
              ) : (
                title
              )}
              {badge}
            </div>
            {description && (
              <p
                style={{
                  fontSize: 11.5,
                  color: 'var(--text-muted, #64748B)',
                  margin: '3px 0 0',
                  lineHeight: 1.4,
                }}
              >
                {description}
              </p>
            )}
          </div>

          {action && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{action}</div>}
        </div>
      )}

      <div
        style={{
          flex: 1,
          padding: noPadding ? 0 : '16px 18px',
        }}
      >
        {children}
      </div>

      {footer && (
        <div
          style={{
            padding: '10px 18px',
            borderTop: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))',
            background: 'rgba(0, 0, 0, 0.15)',
            fontSize: 11.5,
            color: 'var(--text-muted, #64748B)',
          }}
        >
          {footer}
        </div>
      )}
    </section>
  );
}
