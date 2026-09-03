'use client';

import React from 'react';
import { Sparkles, ArrowRight, Zap, Lightbulb } from 'lucide-react';
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
  title = 'AI Career Intelligence Brief',
  badgeText = 'AI RECOMMENDATION',
  insight,
  actionText = 'Execute Next Step',
  actionHref,
  onAction,
  confidence,
  category,
}: AIInsightCardProps) {
  return (
    <div
      className="card-ai card-interactive"
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: '20px 22px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="card-icon-container" style={{ width: 34, height: 34 }}>
            <Lightbulb size={17} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--gold)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {badgeText}
              </span>
              {category && (
                <span style={{ fontSize: 10, color: 'var(--text-muted)', background: 'var(--bg-surface-elevated)', padding: '1px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>
                  {category}
                </span>
              )}
            </div>
            <h4 className="font-display" style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0, marginTop: 2 }}>
              {title}
            </h4>
          </div>
        </div>

        {typeof confidence === 'number' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--gold-muted)', border: '1px solid var(--gold-border)', padding: '3px 8px', borderRadius: 'var(--radius-pill)', fontSize: 11, color: 'var(--gold)' }}>
            <Zap size={11} />
            <span>Confidence: <strong style={{ color: 'var(--text-primary)' }}>{Math.round(confidence <= 1 ? confidence * 100 : confidence)}%</strong></span>
          </div>
        )}
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, lineHeight: 1.6, margin: '10px 0 16px', maxWidth: 850 }}>
        {insight}
      </p>

      {(actionText && (actionHref || onAction)) && (
        <div style={{ display: 'flex', gap: 10 }}>
          {actionHref ? (
            <Link
              href={actionHref}
              className="btn-gold"
              style={{ fontSize: 12.5, padding: '7px 16px' }}
            >
              {actionText} <ArrowRight size={14} className="interactive-arrow" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="btn-gold"
              style={{ fontSize: 12.5, padding: '7px 16px' }}
            >
              {actionText} <ArrowRight size={14} className="interactive-arrow" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
