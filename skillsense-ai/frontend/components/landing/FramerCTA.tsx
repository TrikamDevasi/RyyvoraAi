'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Landmark } from 'lucide-react';

export default function FramerCTA() {
  return (
    <section
      style={{
        padding: '120px 24px 100px',
        background: 'radial-gradient(circle at 50% 100%, rgba(30, 58, 138, 0.35) 0%, rgba(11, 15, 23, 0.98) 60%, #06080e 100%)',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div style={{ maxWidth: 1080, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        {/* Eyebrow */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 18px',
            borderRadius: 9999,
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#f59e0b',
            fontSize: 12,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: 24,
          }}
        >
          <Sparkles size={13} /> The Sovereign Outcome Standard
        </div>

        {/* Monumental Headline Inspired by Reference */}
        <h2
          className="font-outfit"
          style={{
            fontSize: 'clamp(38px, 6.5vw, 84px)',
            fontWeight: 900,
            color: '#f8fafc',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            marginBottom: 24,
            textTransform: 'uppercase',
          }}
        >
          From Skills to{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #06B6D4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Sustainable Outcomes.
          </span>
        </h2>

        <p
          className="font-manrope"
          style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: '#94a3b8',
            maxWidth: 680,
            margin: '0 auto 48px',
            lineHeight: 1.6,
          }}
        >
          Deploy Ryyvora AI across state skill missions, academic institutes, and enterprise hiring pipelines to guarantee verifiable workforce outcomes.
        </p>

        {/* Primary Call to Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/exam"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '16px 36px',
              borderRadius: 9999,
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#090a0f',
              fontWeight: 800,
              fontSize: 16,
              textDecoration: 'none',
              boxShadow: '0 10px 30px -5px rgba(245, 158, 11, 0.4)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            Start Skill Assessment <ArrowRight size={17} />
          </Link>

          <Link
            href="/admin/governance"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 9,
              padding: '16px 32px',
              borderRadius: 9999,
              background: 'rgba(17, 24, 39, 0.85)',
              color: '#f8fafc',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              fontWeight: 700,
              fontSize: 16,
              textDecoration: 'none',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)';
              e.currentTarget.style.background = 'rgba(26, 34, 52, 0.95)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
              e.currentTarget.style.background = 'rgba(17, 24, 39, 0.85)';
            }}
          >
            <Landmark size={17} style={{ color: '#06b6d4' }} /> State Mission Cockpit
          </Link>
        </div>
      </div>
    </section>
  );
}
