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
      className="interactive-card"
      style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(15,17,26,0.98) 60%)',
        border: '1px solid rgba(245,158,11,0.22)',
        borderRadius: 14,
        padding: '20px 22px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
            <Lightbulb size={16} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#f59e0b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {badgeText}
              </span>
              {category && (
                <span style={{ fontSize: 10, color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '1px 6px', borderRadius: 4 }}>
                  {category}
                </span>
              )}
            </div>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', margin: 0, marginTop: 2 }}>
              {title}
            </h4>
          </div>
        </div>

        {typeof confidence === 'number' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '3px 8px', borderRadius: 99, fontSize: 11, color: '#94a3b8' }}>
            <Zap size={11} color="#f59e0b" />
            <span>Confidence: <strong style={{ color: '#f8fafc' }}>{Math.round(confidence <= 1 ? confidence * 100 : confidence)}%</strong></span>
          </div>
        )}
      </div>

      <p style={{ color: '#cbd5e1', fontSize: 13.5, lineHeight: 1.6, margin: '10px 0 16px', maxWidth: 850 }}>
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
              {actionText} <ArrowRight size={14} />
            </Link>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="btn-gold"
              style={{ fontSize: 12.5, padding: '7px 16px' }}
            >
              {actionText} <ArrowRight size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
