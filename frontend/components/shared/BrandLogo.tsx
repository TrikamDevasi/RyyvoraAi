'use client';

import React from 'react';

export type BrandLogoVariant = 'full' | 'compact' | 'mark';
export type BrandLogoTheme = 'auto' | 'dark' | 'light';
export type BrandLogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  theme?: BrandLogoTheme;
  size?: BrandLogoSize;
  withTagline?: boolean;
  className?: string;
  style?: React.CSSProperties;
  monogramClass?: string;
  href?: string;
}

const SIZE_MAP: Record<string, number> = {
  xs: 20,
  sm: 26,
  md: 32,
  lg: 40,
  xl: 56,
};

/**
 * Canonical Ryyvora AI Vector Logomark.
 * Communicates: Intelligence + Connection + Workforce + Progression + Trust.
 */
export function RyyvoraMark({
  size = 32,
  theme = 'auto',
  className = '',
  style = {},
}: {
  size?: number;
  theme?: BrandLogoTheme;
  className?: string;
  style?: React.CSSProperties;
}) {
  const isDark = theme === 'dark';
  const isLight = theme === 'light';

  // Theme-aware fill resolution
  const pillarFill = isLight ? '#0F172A' : isDark ? '#F59E0B' : 'var(--gold, #F59E0B)';
  const loopFill = isLight ? '#0F172A' : isDark ? '#F59E0B' : 'var(--gold, #F59E0B)';
  const vectorFill = isLight ? '#D97706' : isDark ? '#FBBF24' : 'var(--gold-light, #FBBF24)';

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', flexShrink: 0, verticalAlign: 'middle', ...style }}
      aria-hidden="true"
      focusable="false"
    >
      {/* 1. Sovereign Foundation: The Vertical Institutional Pillar */}
      <rect x="10" y="8" width="11" height="48" rx="4" fill={pillarFill} />

      {/* 2. Intelligence Convergence Loop */}
      <path
        d="M 21 8 H 39 C 47.28 8 54 14.72 54 23 C 54 31.28 47.28 38 39 38 H 21 V 28 H 38 C 40.76 28 43 25.76 43 23 C 43 20.24 40.76 18 38 18 H 21 Z"
        fill={loopFill}
      />

      {/* 3. Ascending Outcome Vector (Dynamic Trajectory) */}
      <path
        d="M 26 35 C 28.5 32 32 32 34.5 34.5 L 51 51 C 53.5 53.5 53.5 56 50.5 56 H 42.5 C 40.5 56 38.5 55 37 53.5 L 26 42.5 C 24 40.5 24 37 26 35 Z"
        fill={vectorFill}
      />
    </svg>
  );
}

/**
 * Standardized BrandLogo Component across Ryyvora AI platform.
 * Supports full wordmark, compact lockup, and standalone mark.
 */
export default function BrandLogo({
  variant = 'full',
  theme = 'auto',
  size = 'md',
  withTagline = false,
  className = '',
  style = {},
  monogramClass = '',
}: BrandLogoProps) {
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size] || 32;

  // Font sizing proportional to mark size
  const titleFontSize = Math.max(13, Math.round(pixelSize * 0.52));
  const descFontSize = Math.max(8, Math.round(pixelSize * 0.26));
  const gap = Math.max(6, Math.round(pixelSize * 0.28));

  const isDark = theme === 'dark';
  const isLight = theme === 'light';

  const textColor = isLight ? '#0F172A' : isDark ? '#F8FAFC' : 'var(--text-primary, #F8FAFC)';
  const aiColor = isLight ? '#D97706' : isDark ? '#F59E0B' : 'var(--gold, #F59E0B)';
  const descColor = isLight ? '#64748B' : isDark ? '#94A3B8' : 'var(--text-muted, #94A3B8)';

  if (variant === 'mark') {
    return (
      <span
        role="img"
        aria-label="Ryyvora AI"
        className={`brand-logo-mark ${className} ${monogramClass}`}
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }}
      >
        <RyyvoraMark size={pixelSize} theme={theme} />
      </span>
    );
  }

  return (
    <span
      role="img"
      aria-label="Ryyvora AI — Workforce Outcome Intelligence"
      className={`brand-logo-lockup ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap,
        textDecoration: 'none',
        userSelect: 'none',
        flexShrink: 0,
        ...style,
      }}
    >
      <RyyvoraMark size={pixelSize} theme={theme} className={monogramClass} />

      <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1, flexShrink: 0 }}>
        <span
          className="font-display"
          style={{
            fontSize: titleFontSize,
            fontWeight: 800,
            color: textColor,
            letterSpacing: '-0.025em',
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: 3,
          }}
        >
          Ryyvora
          {variant === 'full' && (
            <span style={{ color: aiColor, fontWeight: 900, letterSpacing: '-0.01em' }}>AI</span>
          )}
        </span>

        {withTagline && (
          <span
            className="font-mono"
            style={{
              fontSize: descFontSize,
              fontWeight: 700,
              color: descColor,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              marginTop: 2,
            }}
          >
            Workforce Intelligence
          </span>
        )}
      </span>
    </span>
  );
}
