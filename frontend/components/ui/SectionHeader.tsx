'use client';

import React from 'react';
import Link from 'next/link';

export interface SectionHeaderProps {
  breadcrumbs?: { label: string; href?: string }[];
  badge?: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  filters?: React.ReactNode;
  tabs?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function SectionHeader({
  breadcrumbs,
  badge,
  title,
  description,
  actions,
  filters,
  tabs,
  className = '',
  style = {},
}: SectionHeaderProps) {
  return (
    <div
      className={`section-header ${className}`.trim()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        marginBottom: 20,
        ...style,
      }}
    >
      {/* Breadcrumb row if present */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb navigation"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            color: 'var(--text-muted, #64748B)',
          }}
        >
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={idx}>
                {idx > 0 && <span>/</span>}
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    style={{
                      color: 'var(--text-secondary, #94A3B8)',
                      textDecoration: 'none',
                      transition: 'color 150ms ease',
                    }}
                    className="hover:text-white"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span style={{ color: isLast ? 'var(--text-primary, #F8FAFC)' : 'inherit', fontWeight: isLast ? 600 : 400 }}>
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      {/* Main Title & Action Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <h1
              className="font-display"
              style={{
                fontSize: 'clamp(20px, 3vw, 26px)',
                fontWeight: 800,
                color: 'var(--text-primary, #F8FAFC)',
                margin: 0,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </h1>
            {badge}
          </div>

          {description && (
            <p
              style={{
                fontSize: 13,
                color: 'var(--text-secondary, #94A3B8)',
                margin: 0,
                lineHeight: 1.45,
                maxWidth: 780,
              }}
            >
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
            {actions}
          </div>
        )}
      </div>

      {/* Filter Row if present */}
      {filters && (
        <div style={{ marginTop: 2 }}>
          {filters}
        </div>
      )}

      {/* Tabs Row if present */}
      {tabs && (
        <div style={{ marginTop: 4 }}>
          {tabs}
        </div>
      )}
    </div>
  );
}
