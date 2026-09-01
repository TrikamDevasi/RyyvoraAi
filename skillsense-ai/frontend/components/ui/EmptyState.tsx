'use client';

import React from 'react';
import { Inbox, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionText,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div
      style={{
        padding: '48px 24px',
        textAlign: 'center',
        background: 'rgba(15,17,26,0.6)',
        border: '1px dashed rgba(255,255,255,0.1)',
        borderRadius: 14,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          color: '#94a3b8',
        }}
      >
        {icon || <Inbox size={22} />}
      </div>

      <h4 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', margin: 0 }}>
        {title}
      </h4>
      <p style={{ color: '#64748b', fontSize: 13, marginTop: 6, maxWidth: 440, marginInline: 'auto', lineHeight: 1.5 }}>
        {description}
      </p>

      {(actionText && (actionHref || onAction)) && (
        <div style={{ marginTop: 20 }}>
          {actionHref ? (
            <Link href={actionHref} className="btn-gold" style={{ fontSize: 12.5, padding: '7px 18px' }}>
              {actionText} <ArrowRight size={13} />
            </Link>
          ) : (
            <button type="button" onClick={onAction} className="btn-gold" style={{ fontSize: 12.5, padding: '7px 18px' }}>
              {actionText} <ArrowRight size={13} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
