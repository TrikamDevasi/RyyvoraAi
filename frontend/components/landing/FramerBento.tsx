'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Activity,
  ArrowRight,
  Sparkles,
  Lock,
  Layers,
  Landmark,
  Building2,
  GraduationCap,
  Briefcase,
  QrCode,
  FileCheck,
} from 'lucide-react';

const EASING = [0.16, 1, 0.3, 1] as const;

/* ─── Animation Variants ─────────────────────────────────────────────── */
const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 48, filter: 'blur(4px)' },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.75,
      delay,
      ease: EASING,
    },
  }),
};

const columnVariant: Variants = {
  hidden: { opacity: 0, y: 64 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      delay,
      ease: EASING,
    },
  }),
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      delay,
      ease: EASING,
    },
  }),
};

/* ─── Data ───────────────────────────────────────────────────────────── */
const CAPABILITIES = [
  {
    id: 1,
    title: 'AI Diagnostic Skill Gap Engine',
    category: 'Stage 01 · Assessment',
    description: 'Deconstructs industry job descriptions into micro-competencies and maps trainee proficiencies with NSQF Level 4–8 precision.',
    metric: '98.4% Diagnostic Accuracy',
    tag: 'NSQF Aligned',
    image: '/images/reference/platform-telemetry-banner.png',
  },
  {
    id: 2,
    title: 'Cryptographic Sovereign Skill Passport',
    category: 'Stage 02 · Certification',
    description: 'Tamper-proof biometric-backed credentials anchored to SHA-256 verifiable ledgers with zero forged certifications.',
    metric: 'Zero Credential Fraud',
    tag: 'DPDP 2023 Compliant',
    image: '/images/reference/skill-passport-mobile.png',
  },
  {
    id: 3,
    title: 'Instant Employer Verification & Hiring',
    category: 'Stage 03 · Employment',
    description: 'Automated 1-click verification eliminating 3-week background check delays for enterprise recruiters.',
    metric: '4.2x Faster Hiring',
    tag: 'Instant SLA',
    image: '/images/reference/employer-verification-mobile.png',
  },
  {
    id: 4,
    title: 'Longitudinal Retention Tracking',
    category: 'Stage 04 · Retention',
    description: 'Automated 3-month, 6-month, and 12-month employment validation ensuring funded programs result in sustained livelihoods.',
    metric: '89.6% 12-Month Retention',
    tag: 'EPFO & Salary Validated',
    image: '/images/reference/retention-telemetry.png',
  },
  {
    id: 5,
    title: 'Wage Progression & Income Growth',
    category: 'Stage 05 · Livelihood',
    description: 'Continuous tracking of salary increments, role transitions, and economic mobility post-placement.',
    metric: '+34.2% Wage Uplift',
    tag: 'Longitudinal Analytics',
    image: '/images/reference/analytics-preview.png',
  },
  {
    id: 6,
    title: 'State & National Governance Cockpit',
    category: 'Stage 06 · Policy',
    description: 'District-level skill heatmaps, scheme expenditure ROI, and automated intervention triggers for policy leaders.',
    metric: '36 States & UTs',
    tag: 'Policy Intelligence',
    image: '/images/reference/cockpit-laptop-preview.png',
  },
];

/* ─── Component ──────────────────────────────────────────────────────── */
export default function FramerBento() {
  const [activeCapIndex, setActiveCapIndex] = useState(0);
  const activeCap = CAPABILITIES[activeCapIndex];

  const VIEWPORT_OPTS = { once: true, margin: '-80px' } as const;

  return (
    <section style={{ padding: '80px 24px', background: '#0B0F17', position: 'relative' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>

        {/* ── Section Header ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_OPTS}
          variants={fadeUpVariant}
          custom={0}
          style={{ textAlign: 'center', marginBottom: 54 }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: 9999,
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#f59e0b',
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 14,
            }}
          >
            <Sparkles size={13} /> Architecture of Measurable Outcomes
          </div>
          <h2
            className="font-outfit"
            style={{
              fontSize: 'clamp(32px, 4.5vw, 56px)',
              fontWeight: 800,
              color: '#f8fafc',
              letterSpacing: '-0.02em',
              marginBottom: 12,
            }}
          >
            Workforce Outcome Intelligence Bento
          </h2>
          <p
            className="font-manrope"
            style={{ fontSize: 'clamp(15px, 1.8vw, 18px)', color: '#94a3b8', maxWidth: 660, margin: '0 auto' }}
          >
            Six synchronized intelligence modules operating across the complete longitudinal workforce lifecycle.
          </p>
        </motion.div>

        {/* ── BENTO GRID LAYOUT ── */}
        <div className="bento-grid-12">

          {/* ── COLUMN 1 (Left 4 cols) ── */}
          <motion.div
            className="bento-col-4"
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_OPTS}
            variants={columnVariant}
            custom={0}
          >
            {/* Widget 1: Sovereign Telemetry Profile Card */}
            <motion.div className="bento-glass-card" style={{ padding: 26 }} variants={cardVariant} custom={0.05}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: 'var(--brand-gold, #f59e0b)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: 20,
                    color: '#090a0f',
                    flexShrink: 0,
                    boxShadow: '0 0 20px rgba(245, 158, 11, 0.35)',
                  }}
                >
                  RY
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc', margin: 0, lineHeight: 1.1 }}>
                    Ryyvora AI
                  </h3>
                  <span style={{ fontSize: 12, color: 'var(--brand-gold, #f59e0b)', fontWeight: 600 }}>
                    @ryyvora.intelligence
                  </span>
                </div>
              </div>

              <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginBottom: 20 }}>
                Sovereign workforce outcome intelligence connecting training, biometric-verified certification, employer verification, 12-month retention, and predictive policy action.
              </p>

              {/* Stakeholder Pill Icons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                {[
                  { href: '/for-government', icon: <Landmark size={17} />, title: 'Government Solutions' },
                  { href: '/for-employers', icon: <Building2 size={17} />, title: 'Employer Intelligence' },
                  { href: '/for-trainees', icon: <GraduationCap size={17} />, title: 'Trainee Hub' },
                  { href: '/employer-verification', icon: <ShieldCheck size={17} />, title: 'Public Verifier' },
                ].map(({ href, icon, title }) => (
                  <Link
                    key={href}
                    href={href}
                    title={title}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#f8fafc',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#f59e0b')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
                  >
                    {icon}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Widget 2: Live Ledger Status Banner */}
            <motion.div
              className="bento-glass-card"
              style={{
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                fontSize: 12,
                color: '#cbd5e1',
                fontFamily: 'var(--font-mono, monospace)',
              }}
              variants={cardVariant}
              custom={0.12}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 10px #10b981',
                }}
              />
              <span>Sovereign Ledger Active · 99.98% SLA</span>
            </motion.div>

            {/* Widget 3: Mobile Skill Passport Device Mockup */}
            <motion.div className="bento-glass-card" style={{ padding: 24, textAlign: 'center' }} variants={cardVariant} custom={0.2}>
              <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
                Pocket Verification
              </div>
              <h4 style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', marginBottom: 16 }}>
                Sovereign Skill Passport App
              </h4>

              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 240,
                  borderRadius: 16,
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <Image
                  src="/images/reference/skill-passport-mobile.png"
                  alt="Skill Passport Mobile View"
                  fill
                  sizes="(max-width: 768px) 100vw, 350px"
                  style={{ objectFit: 'contain' }}
                />
              </div>

              <Link
                href="/for-trainees"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  marginTop: 14,
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#f59e0b',
                  textDecoration: 'none',
                }}
              >
                Explore Trainee Passport <ArrowRight size={14} />
              </Link>
            </motion.div>
          </motion.div>

          {/* ── COLUMN 2 (Center 5 cols) ── */}
          <motion.div
            className="bento-col-5"
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_OPTS}
            variants={columnVariant}
            custom={0.12}
          >
            {/* Widget 4: Dynamic Placement Pulse Banner */}
            <motion.div
              style={{
                background: 'linear-gradient(135deg, #065f46 0%, #059669 50%, #10b981 100%)',
                borderRadius: 20,
                padding: '22px 28px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                boxShadow: '0 12px 30px -6px rgba(16, 185, 129, 0.35)',
              }}
              variants={cardVariant}
              custom={0}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Activity size={22} />
              </div>
              <div>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.85, fontWeight: 700 }}>
                  Live National Telemetry
                </div>
                <div style={{ fontSize: 17, fontWeight: 800, marginTop: 2, lineHeight: 1.25 }}>
                  Verifying 142,800+ Placements Across 36 States & UTs
                </div>
              </div>
            </motion.div>

            {/* Widget 5: Interactive Capability Showcase Container */}
            <motion.div
              className="bento-glass-card"
              style={{ padding: 28, flex: 1, display: 'flex', flexDirection: 'column' }}
              variants={cardVariant}
              custom={0.08}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span
                  style={{
                    background: 'rgba(6, 182, 212, 0.15)',
                    color: '#06b6d4',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    padding: '4px 12px',
                    borderRadius: 9999,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {activeCap.category}
                </span>

                {/* Arrow Navigation */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={() => setActiveCapIndex((prev) => (prev > 0 ? prev - 1 : CAPABILITIES.length - 1))}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Image src="/images/reference/arrow-left.svg" alt="Previous" width={14} height={14} />
                  </button>
                  <button
                    onClick={() => setActiveCapIndex((prev) => (prev < CAPABILITIES.length - 1 ? prev + 1 : 0))}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Image src="/images/reference/arrow-right.svg" alt="Next" width={14} height={14} />
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCap.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                >
                  <h4 style={{ fontSize: 20, fontWeight: 800, color: '#f8fafc', marginBottom: 8, lineHeight: 1.25 }}>
                    {activeCap.title}
                  </h4>
                  <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginBottom: 18 }}>
                    {activeCap.description}
                  </p>

                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: 180,
                      borderRadius: 14,
                      overflow: 'hidden',
                      marginBottom: 16,
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <Image
                      src={activeCap.image}
                      alt={activeCap.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 450px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#f59e0b' }}>
                      {activeCap.metric}
                    </span>
                    <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'var(--font-mono, monospace)' }}>
                      {activeCap.tag}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Pagination Dots */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 18 }}>
                {CAPABILITIES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveCapIndex(idx)}
                    style={{
                      width: idx === activeCapIndex ? 22 : 6,
                      height: 6,
                      borderRadius: 9999,
                      background: idx === activeCapIndex ? '#f59e0b' : 'rgba(255, 255, 255, 0.2)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      padding: 0,
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Widget 6: Accredited Standards Strip */}
            <motion.div
              className="bento-glass-card"
              style={{
                padding: '16px 22px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
              variants={cardVariant}
              custom={0.18}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981',
                  flexShrink: 0,
                }}
              >
                <CheckCircle2 size={18} />
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.4 }}>
                <span style={{ color: '#f8fafc', fontWeight: 700 }}>Institutional Sovereignty:</span> NCVET Aligned · NSDC Ready · APAAR & DigiLocker Interoperable.
              </div>
            </motion.div>
          </motion.div>

          {/* ── COLUMN 3 (Right 3 cols) ── */}
          <motion.div
            className="bento-col-3"
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_OPTS}
            variants={columnVariant}
            custom={0.24}
          >
            {/* Widget 7: Employer Verification SLA Card */}
            <motion.div
              style={{
                background: 'linear-gradient(145deg, #4c1d95 0%, #2e1065 100%)',
                borderRadius: 20,
                padding: 24,
                color: '#ffffff',
                boxShadow: '0 12px 30px -8px rgba(76, 29, 149, 0.5)',
              }}
              variants={cardVariant}
              custom={0}
            >
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c4b5fd', fontWeight: 700 }}>
                Verification SLA
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, marginTop: 4, lineHeight: 1.1 }}>
                4.2x Faster
              </div>
              <p style={{ fontSize: 12, color: '#ddd6fe', marginTop: 8, lineHeight: 1.5 }}>
                Zero forged resumes. Instant cryptographic validation backed by employer cryptographic seals.
              </p>
              <Link
                href="/for-employers"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  marginTop: 14,
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#ffffff',
                  textDecoration: 'none',
                }}
              >
                Employer Verification <ArrowRight size={13} />
              </Link>
            </motion.div>

            {/* Widget 8: Wage Progression Card */}
            <motion.div className="bento-glass-card" style={{ padding: 22 }} variants={cardVariant} custom={0.1}>
              <div style={{ fontSize: 11, color: '#10b981', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Livelihood Telemetry
              </div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#f8fafc', marginTop: 4 }}>
                +34.2%
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                Average verified starting wage increase across certified cohorts.
              </div>
            </motion.div>

            {/* Widget 9: Ecosystem Standards 2x2 Grid */}
            <motion.div className="bento-glass-card" style={{ padding: 22, flex: 1 }} variants={cardVariant} custom={0.18}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>Integrated Standards</span>
                <span style={{ color: '#f59e0b' }}>✦</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { label: 'NCVET', sub: 'Level 4–8' },
                  { label: 'DPDP', sub: 'Act 2023' },
                  { label: 'APAAR', sub: 'Edu-ID' },
                  { label: 'DigiLocker', sub: 'Sovereign' },
                ].map(({ label, sub }) => (
                  <div
                    key={label}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 12,
                      padding: '12px 10px',
                      textAlign: 'center',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc' }}>{label}</div>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{sub}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
