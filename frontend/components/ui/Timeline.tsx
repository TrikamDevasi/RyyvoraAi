'use client';

import React from 'react';
import { CheckCircle2, Clock, Circle, AlertCircle } from 'lucide-react';

export interface TimelineItem {
  id: string;
  stage: string;
  title: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING' | 'FLAGGED';
  date?: string;
  description?: React.ReactNode;
  metadata?: { label: string; value: string | number }[];
  action?: React.ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
  style?: React.CSSProperties;
}

export function Timeline({ items, className = '', style = {} }: TimelineProps) {
  return (
    <div className={`timeline-vertical ${className}`.trim()} style={{ display: 'flex', flexDirection: 'column', ...style }}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        const isCompleted = item.status === 'COMPLETED';
        const isInProgress = item.status === 'IN_PROGRESS';
        const isFlagged = item.status === 'FLAGGED';

        const iconColor = isCompleted
          ? 'var(--success, #10B981)'
          : isInProgress
          ? 'var(--brand-gold, #F59E0B)'
          : isFlagged
          ? 'var(--error, #EF4444)'
          : 'var(--text-muted, #64748B)';

        return (
          <div key={item.id || idx} style={{ display: 'flex', gap: 14, position: 'relative' }}>
            {/* Left Track & Icon Node */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: isCompleted
                    ? 'rgba(16, 185, 129, 0.12)'
                    : isInProgress
                    ? 'rgba(245, 158, 11, 0.12)'
                    : 'rgba(255, 255, 255, 0.04)',
                  border: `1.5px solid ${iconColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: iconColor,
                  zIndex: 2,
                }}
              >
                {isCompleted ? (
                  <CheckCircle2 size={13} />
                ) : isInProgress ? (
                  <Clock size={12} />
                ) : isFlagged ? (
                  <AlertCircle size={12} />
                ) : (
                  <Circle size={8} fill="currentColor" />
                )}
              </div>

              {!isLast && (
                <div
                  style={{
                    width: 1.5,
                    flex: 1,
                    minHeight: 36,
                    background: isCompleted ? 'rgba(16, 185, 129, 0.35)' : 'rgba(255, 255, 255, 0.08)',
                    margin: '4px 0',
                  }}
                />
              )}
            </div>

            {/* Right Content */}
            <div style={{ flex: 1, paddingBottom: isLast ? 0 : 20, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      fontSize: 9.5,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: iconColor,
                    }}
                  >
                    {item.stage}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary, #F8FAFC)' }}>
                    {item.title}
                  </span>
                </div>

                {item.date && (
                  <span style={{ fontSize: 11, color: 'var(--text-muted, #64748B)', fontFamily: 'var(--font-mono, monospace)' }}>
                    {item.date}
                  </span>
                )}
              </div>

              {item.description && (
                <div style={{ fontSize: 12, color: 'var(--text-secondary, #94A3B8)', marginTop: 3, lineHeight: 1.4 }}>
                  {item.description}
                </div>
              )}

              {item.metadata && item.metadata.length > 0 && (
                <div style={{ display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
                  {item.metadata.map((m, mIdx) => (
                    <div
                      key={mIdx}
                      style={{
                        fontSize: 11,
                        background: 'rgba(255, 255, 255, 0.03)',
                        padding: '2px 7px',
                        borderRadius: 4,
                        border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))',
                      }}
                    >
                      <span style={{ color: 'var(--text-muted, #64748B)', marginRight: 4 }}>{m.label}:</span>
                      <strong style={{ color: 'var(--text-primary, #F8FAFC)' }}>{m.value}</strong>
                    </div>
                  ))}
                </div>
              )}

              {item.action && <div style={{ marginTop: 8 }}>{item.action}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
