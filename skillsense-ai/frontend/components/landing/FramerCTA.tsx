'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Landmark } from 'lucide-react';

const VIEWPORT_OPTS = { once: true, margin: '-60px' } as const;

export default function FramerCTA() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={VIEWPORT_OPTS}
      transition={{ duration: 0.8 }}
      style={{
        padding: '120px 24px 100px',
        background: 'radial-gradient(circle at 50% 100%, rgba(30, 58, 138, 0.35) 0%, rgba(11, 15, 23, 0.98) 60%, #06080e 100%)',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Ambient background glow ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={VIEWPORT_OPTS}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute',
          bottom: '-150px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '350px',
          background: 'radial-gradient(ellipse, rgba(245, 158, 11, 0.15) 0%, rgba(6, 182, 212, 0.1) 40%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 1080, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={VIEWPORT_OPTS}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
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
        </motion.div>

        {/* Monumental Headline Inspired by Reference */}
        <motion.h2
          className="font-outfit"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_OPTS}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
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
        </motion.h2>

        <motion.p
          className="font-manrope"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_OPTS}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: '#94a3b8',
            maxWidth: 680,
            margin: '0 auto 48px',
            lineHeight: 1.6,
          }}
        >
          Deploy Ryyvora AI across state skill missions, academic institutes, and enterprise hiring pipelines to guarantee verifiable workforce outcomes.
        </motion.p>

        {/* Primary Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_OPTS}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
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
                transition: 'box-shadow 0.2s ease',
              }}
            >
              Start Skill Assessment <ArrowRight size={17} />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
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
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
