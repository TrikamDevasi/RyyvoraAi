'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  QrCode,
  CheckCircle2,
  Lock,
  ChevronDown,
  Activity,
  Award,
  Zap,
} from 'lucide-react';

export default function FramerHero() {
  return (
    <section className="cosmic-hero-canvas">
      {/* Background Starfield & Glow */}
      <div className="cosmic-stars-overlay" />
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(30, 58, 138, 0.22) 0%, rgba(6, 182, 212, 0.12) 40%, transparent 75%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        {/* Top Eyebrow Tag */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 18px',
              borderRadius: 9999,
              background: 'rgba(17, 24, 39, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(12px)',
              fontSize: 12,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#cbd5e1',
              fontFamily: 'var(--font-mono, monospace)',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 8px #10b981',
              }}
            />
            <span>Workforce Outcome Intelligence — Y:2026</span>
          </div>
        </motion.div>

        {/* Spaced Subtitle: "T h e   I n t e l l i g e n c e   o f" */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            textAlign: 'center',
            fontSize: 'clamp(14px, 2.4vw, 24px)',
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            color: '#94a3b8',
            fontFamily: 'var(--font-outfit), sans-serif',
            fontWeight: 300,
            marginBottom: 12,
            textIndent: '0.38em',
          }}
        >
          The Intelligence of
        </motion.div>

        {/* Monumental Headline: "RYYVORA AI" + Semantic H1: Workforce Outcome Intelligence */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', position: 'relative', marginBottom: 20 }}
        >
          <div
            className="font-display font-outfit"
            style={{
              fontSize: 'clamp(52px, 11vw, 148px)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 0.92,
              textTransform: 'uppercase',
              margin: 0,
              background: 'linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 55%, #94A3B8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 20px 60px rgba(0,0,0,0.8)',
              display: 'inline-block',
            }}
          >
            RYYVORA <span style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
          </div>
          <h1
            className="font-manrope"
            style={{
              fontSize: 'clamp(20px, 3.2vw, 36px)',
              fontWeight: 800,
              color: 'var(--gold, #f59e0b)',
              letterSpacing: '-0.02em',
              margin: '14px auto 0',
              maxWidth: 820,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #fef08a 0%, #f59e0b 50%, #d97706 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Workforce Outcome Intelligence
          </h1>
        </motion.div>

        {/* Tagline & Descriptor */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 36px' }}
        >
          <p
            className="font-manrope"
            style={{
              fontSize: 'clamp(17px, 2.2vw, 22px)',
              fontWeight: 700,
              color: '#f8fafc',
              letterSpacing: '-0.01em',
              marginBottom: 10,
            }}
          >
            From Skills to Sustainable Outcomes.
          </p>
          <p
            className="font-manrope"
            style={{
              fontSize: 'clamp(14px, 1.6vw, 16px)',
              color: '#94a3b8',
              lineHeight: 1.65,
              maxWidth: 620,
              margin: '0 auto',
            }}
          >
            Unified national outcome intelligence connecting training, biometric-verified certification, employer hiring, 12-month retention, and predictive policy action.
          </p>
        </motion.div>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            flexWrap: 'wrap',
            marginBottom: 60,
          }}
        >
          <Link
            href="/exam"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 9,
              padding: '14px 28px',
              borderRadius: 9999,
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#090a0f',
              fontWeight: 800,
              fontSize: 15,
              textDecoration: 'none',
              boxShadow: '0 8px 24px -4px rgba(245, 158, 11, 0.35)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <Sparkles size={16} /> Analyze Skills Now <ArrowRight size={15} />
          </Link>

          <Link
            href="/admin/governance"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 26px',
              borderRadius: 9999,
              background: 'rgba(17, 24, 39, 0.8)',
              color: '#f8fafc',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontWeight: 700,
              fontSize: 15,
              textDecoration: 'none',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)';
              e.currentTarget.style.background = 'rgba(26, 34, 52, 0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.background = 'rgba(17, 24, 39, 0.8)';
            }}
          >
            <Activity size={16} style={{ color: '#06b6d4' }} /> Government Cockpit
          </Link>

          <Link
            href="/verify/demo-hash"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              padding: '14px 22px',
              borderRadius: 9999,
              background: 'transparent',
              color: '#94a3b8',
              fontWeight: 600,
              fontSize: 14,
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#f59e0b')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
          >
            <ShieldCheck size={16} /> Public Verifier
          </Link>
        </motion.div>

        {/* ── 3D Tilted Interactive Floating Bento Hero Cards ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 28,
            maxWidth: 1120,
            margin: '0 auto',
            position: 'relative',
            zIndex: 12,
          }}
        >
          {/* Card Left: Sovereign Skill Passport Preview (-8deg tilt) */}
          <motion.div
            initial={{ opacity: 0, x: -30, rotate: -8 }}
            animate={{ opacity: 1, x: 0, rotate: -8 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="tilted-hero-card-left"
            style={{
              background: 'linear-gradient(145deg, rgba(26, 34, 52, 0.85) 0%, rgba(17, 24, 39, 0.95) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: 22,
              padding: 24,
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.65), 0 0 25px rgba(245, 158, 11, 0.15)',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    position: 'relative',
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid #f59e0b',
                  }}
                >
                  <Image
                    src="/images/reference/avatar-verified.jpeg"
                    alt="Verified Trainee Profile"
                    fill
                    sizes="44px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: '#f8fafc' }}>Aarav Sharma</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'var(--font-mono, monospace)' }}>
                    PASSPORT ID · RYY-7821-MH
                  </div>
                </div>
              </div>
              <span
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '4px 10px',
                  borderRadius: 9999,
                  fontSize: 11,
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <CheckCircle2 size={12} /> DPDP Verified
              </span>
            </div>

            <div
              style={{
                background: 'rgba(11, 15, 23, 0.6)',
                borderRadius: 14,
                padding: '14px 16px',
                marginBottom: 16,
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>Employment Readiness Score</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#f59e0b' }}>98.4%</span>
              </div>
              <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 9999, overflow: 'hidden' }}>
                <div style={{ width: '98.4%', height: '100%', background: 'linear-gradient(90deg, #10b981, #f59e0b)' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 11, color: '#64748b' }}>
                <span>NSQF Level: 6</span>
                <span>Role: Full Stack AI Engineer</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Lock size={12} style={{ color: '#06b6d4' }} /> Cryptographic SHA-256 Ledger
              </span>
              <span style={{ color: '#f59e0b', fontWeight: 700 }}>Verified by 3 Employers</span>
            </div>
          </motion.div>

          {/* Card Right: Live Outcome Telemetry Cockpit (+7deg tilt) */}
          <motion.div
            initial={{ opacity: 0, x: 30, rotate: 7 }}
            animate={{ opacity: 1, x: 0, rotate: 7 }}
            transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="tilted-hero-card-right"
            style={{
              background: 'linear-gradient(145deg, rgba(19, 27, 46, 0.85) 0%, rgba(11, 15, 23, 0.95) 100%)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              borderRadius: 22,
              padding: 24,
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.65), 0 0 25px rgba(6, 182, 212, 0.15)',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: '#06b6d4', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Macro Telemetry
                </div>
                <div style={{ fontWeight: 800, fontSize: 16, color: '#f8fafc' }}>
                  Wage Progression & Retention
                </div>
              </div>
              <span
                style={{
                  background: 'rgba(6, 182, 212, 0.15)',
                  color: '#06b6d4',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  padding: '4px 10px',
                  borderRadius: 9999,
                  fontSize: 11,
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <TrendingUp size={12} /> +34.2% Growth
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                background: 'rgba(11, 15, 23, 0.6)',
                borderRadius: 14,
                padding: '14px 16px',
                marginBottom: 16,
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>12-Month Retention</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#10b981', marginTop: 2 }}>89.6%</div>
                <div style={{ fontSize: 10, color: '#64748b' }}>vs. 48% natl. benchmark</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>Median Starting Wage</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#f59e0b', marginTop: 2 }}>₹18,500<span style={{ fontSize: 11, fontWeight: 500 }}>/mo</span></div>
                <div style={{ fontSize: 10, color: '#64748b' }}>Verified via EPFO API</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Activity size={12} style={{ color: '#10b981' }} /> 142,800+ Active Cohorts
              </span>
              <span style={{ color: '#06b6d4', fontWeight: 700 }}>Real-Time Telemetry</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Atmospheric Planet Horizon Arc (Inspired by Reference) ── */}
      <div className="cosmic-horizon-arc">
        <div style={{ width: 1.5, height: 32, background: 'linear-gradient(180deg, rgba(6, 182, 212, 0.8), transparent)' }} />
        <span
          style={{
            fontSize: 11,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#94a3b8',
            fontWeight: 600,
            marginTop: 8,
            fontFamily: 'var(--font-mono, monospace)',
          }}
        >
          Scroll to Explore
        </span>
      </div>
    </section>
  );
}
