'use client';

import React from 'react';
import { ArrowRight, Lightbulb } from 'lucide-react';
import Link from 'next/link';

interface AIInsightCardProps {
  title?: string;
  badgeText?: string;
  insight: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  confidence?: number;
  category?: string;
}

export function AIInsightCard({
  title = 'Workforce Intelligence Recommendation',
  badgeText = 'ANALYSIS BENCHMARK',
  insight,
  actionText = 'Review Details',
  actionHref,
  onAction,
  confidence,
  category,
}: AIInsightCardProps) {
  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderLeft: '4px solid var(--gold)',
        borderRadius: 10,
        padding: '18px 20px',
        position: 'relative',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Lightbulb size={18} color="var(--gold)" aria-hidden="true" />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.04em' }}>
                {badgeText}
              </span>
              {category && (
                <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-surface-elevated)', padding: '1px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>
                  {category}
                </span>
              )}
            </div>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0 0' }}>
              {title}
            </h4>
          </div>
        </div>

        {typeof confidence === 'number' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border)',
              padding: '2px 8px',
              borderRadius: 6,
              fontSize: 11.5,
              color: 'var(--text-secondary)',
            }}
          >
            <span>Confidence: <strong style={{ color: 'var(--gold)', fontVariantNumeric: 'tabular-nums' }}>{Math.round(confidence <= 1 ? confidence * 100 : confidence)}%</strong></span>
          </div>
        )}
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6, margin: '8px 0 14px', maxWidth: 850 }}>
        {insight}
      </p>

      {(actionText && (actionHref || onAction)) && (
        <div style={{ display: 'flex', gap: 10 }}>
          {actionHref ? (
            <Link
              href={actionHref}
              className="btn-gold"
              style={{ fontSize: 12.5, padding: '6px 14px', borderRadius: 6 }}
            >
              {actionText} <ArrowRight size={14} className="interactive-arrow" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="btn-gold"
              style={{ fontSize: 12.5, padding: '6px 14px', borderRadius: 6 }}
            >
              {actionText} <ArrowRight size={14} className="interactive-arrow" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
