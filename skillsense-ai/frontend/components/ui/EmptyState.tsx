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
        background: 'var(--bg-surface)',
        border: '1px dashed var(--border)',
        borderRadius: 10,
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 8,
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          color: 'var(--text-muted)',
        }}
      >
        {icon || <Inbox size={22} />}
      </div>

      <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
        {title}
      </h4>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 6, maxWidth: 440, marginInline: 'auto', lineHeight: 1.5 }}>
        {description}
      </p>

      {(actionText && (actionHref || onAction)) && (
        <div style={{ marginTop: 18 }}>
          {actionHref ? (
            <Link href={actionHref} className="btn-gold" style={{ fontSize: 12.5, padding: '7px 18px', borderRadius: 6 }}>
              {actionText} <ArrowRight size={13} />
            </Link>
          ) : (
            <button type="button" onClick={onAction} className="btn-gold" style={{ fontSize: 12.5, padding: '7px 18px', borderRadius: 6 }}>
              {actionText} <ArrowRight size={13} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
