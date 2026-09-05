'use client';

import React from 'react';
import { Inbox, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: React.ReactNode;
  illustration?: 'outcomes' | 'candidates' | 'validations' | 'reports' | 'skill-gap';
  illustrationSrc?: string;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  style?: React.CSSProperties;
}

const ILLUSTRATION_MAP: Record<string, { src: string; alt: string }> = {
  outcomes: {
    src: '/images/empty-states/no-outcomes.svg',
    alt: 'Candidate pathway progression illustration',
  },
  candidates: {
    src: '/images/empty-states/no-candidates.svg',
    alt: 'Talent search radar telemetry illustration',
  },
  validations: {
    src: '/images/empty-states/no-validations.svg',
    alt: 'Cryptographic ledger document verification illustration',
  },
  reports: {
    src: '/images/empty-states/no-reports.svg',
    alt: 'District analytics and reporting pipeline illustration',
  },
  'skill-gap': {
    src: '/images/empty-states/no-skill-gap.svg',
    alt: 'Skills to analytics and career roadmap progression illustration',
  },
};

export function EmptyState({
  icon,
  illustration,
  illustrationSrc,
  title,
  description,
  actionText,
  actionHref,
  onAction,
  style = {},
}: EmptyStateProps) {
  const chosenIllustration = illustration ? ILLUSTRATION_MAP[illustration] : null;
  const imageSource = illustrationSrc || chosenIllustration?.src;
  const imageAlt = chosenIllustration?.alt || `${title} illustration`;

  return (
    <div
      style={{
        padding: '40px 24px',
        textAlign: 'center',
        background: 'var(--bg-surface)',
        border: '1px dashed var(--border)',
        borderRadius: 12,
        ...style,
      }}
    >
      {imageSource ? (
        <div style={{ maxWidth: 240, margin: '0 auto 16px', height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={imageSource}
            alt={imageAlt}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            loading="lazy"
          />
        </div>
      ) : (
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
      )}

      <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
        {title}
      </h4>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 6, maxWidth: 440, marginInline: 'auto', lineHeight: 1.5 }}>
        {description}
      </p>

      {actionText && (actionHref || onAction) && (
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
