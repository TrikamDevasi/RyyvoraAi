// frontend/components/public/PublicPageShell.tsx
import React from 'react';
import Link from 'next/link';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';
import { BreadcrumbJsonLd, BreadcrumbItem } from '@/components/seo/JsonLd';
import { ChevronRight, Home } from 'lucide-react';

interface PublicPageShellProps {
  badge?: string;
  title: string;
  subtitle?: string;
  breadcrumbs: BreadcrumbItem[];
  children: React.ReactNode;
}

export default function PublicPageShell({
  badge,
  title,
  subtitle,
  breadcrumbs,
  children,
}: PublicPageShellProps) {
  return (
    <div style={{ background: 'var(--bg, #08060f)', color: 'var(--text-primary, #f8fafc)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <PublicNavbar />

      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <section
          style={{
            padding: '48px 24px 36px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.08) 0%, transparent 70%)',
          }}
        >
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {/* Visual Breadcrumbs */}
            <nav aria-label="Breadcrumbs" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94a3b8', marginBottom: 20 }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#94a3b8', textDecoration: 'none' }}>
                <Home size={13} /> Home
              </Link>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.path}>
                  <ChevronRight size={12} style={{ opacity: 0.6 }} />
                  {idx === breadcrumbs.length - 1 ? (
                    <span style={{ color: 'var(--gold, #f59e0b)', fontWeight: 600 }}>{crumb.name}</span>
                  ) : (
                    <Link href={crumb.path} style={{ color: '#94a3b8', textDecoration: 'none' }}>
                      {crumb.name}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </nav>

            {/* Eyebrow / Badge */}
            {badge && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 99, background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', color: 'var(--gold, #f59e0b)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
                {badge}
              </div>
            )}

            {/* Semantic Primary H1 */}
            <h1
              className="font-display font-outfit"
              style={{
                fontSize: 'clamp(32px, 5vw, 56px)',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                color: '#f8fafc',
                margin: '0 0 16px',
              }}
            >
              {title}
            </h1>

            {subtitle && (
              <p
                className="font-manrope"
                style={{
                  fontSize: 'clamp(16px, 2vw, 20px)',
                  color: '#94a3b8',
                  lineHeight: 1.6,
                  maxWidth: 820,
                  margin: 0,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </section>

        {/* Main Content Area */}
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>
          {children}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
