'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const EASING = [0.16, 1, 0.3, 1] as const;

/* ─── Data ───────────────────────────────────────────────────────────── */
const PILLARS = [
  {
    id: 'stage-01',
    stageNumber: 'Stage 01',
    title: 'Trainee Discovery & AI Diagnostic Engine',
    subtitle: 'From Unstructured Ambition to Verified Competency',
    description:
      'Replaces subjective paper resumes with deep AI-driven competency mapping. Trainees complete real-world scenario challenges that benchmark their capabilities directly against National Skill Qualification Framework (NSQF Level 4–8) standards.',
    tags: ['AI Skill Diagnostics', 'NSQF Level 4–8', 'Adaptive Assessment', 'Skill Gap Heatmap', 'Career Matching'],
    ctaText: 'Explore Trainee Platform',
    ctaLink: '/for-trainees',
    image: '/images/reference/platform-telemetry-banner.png',
    bgColor: 'linear-gradient(150deg, rgba(16, 185, 129, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    reversed: false,
    stats: [
      { label: 'Diagnostic Precision', value: '98.4%' },
      { label: 'Assessment Time', value: '18 mins' },
    ],
  },
  {
    id: 'stage-02',
    stageNumber: 'Stage 02',
    title: 'Employer Instant Verification & Talent Pipeline',
    subtitle: 'Zero-Fraud Verification for High-Intent Enterprise Hiring',
    description:
      'Enterprise talent acquisition teams verify candidate capabilities instantly via cryptographic SHA-256 seals. Eliminates weeks of background checking and guarantees candidates possess verified, hands-on job readiness before day one.',
    tags: ['Instant Verification', 'Zero Credential Fraud', 'SLA Hiring', 'Enterprise Portal', 'DPDP Compliant'],
    ctaText: 'Explore Employer Verification',
    ctaLink: '/for-employers',
    image: '/images/reference/employer-verification-mobile.png',
    bgColor: 'linear-gradient(150deg, rgba(88, 28, 135, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%)',
    borderColor: 'rgba(168, 85, 247, 0.25)',
    reversed: true,
    stats: [
      { label: 'Verification SLA', value: 'Instant' },
      { label: 'Hiring Acceleration', value: '4.2x Faster' },
    ],
  },
  {
    id: 'stage-03',
    stageNumber: 'Stage 03',
    title: 'Longitudinal Retention & Wage Progression',
    subtitle: 'Sustained Employment Telemetry Past Day 90',
    description:
      'Traditional schemes celebrate initial job placement then lose visibility. Ryyvora tracks sustained career outcomes at 3-month, 6-month, and 12-month intervals with verified salary increments, employer satisfaction, and economic mobility telemetry.',
    tags: ['12-Month Retention', 'Wage Progression', 'EPFO Verification', 'Livelihood ROI', 'Longitudinal Tracking'],
    ctaText: 'Inspect Workforce Telemetry',
    ctaLink: '/workforce-analytics',
    image: '/images/reference/retention-telemetry.png',
    bgColor: 'linear-gradient(150deg, rgba(6, 95, 70, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%)',
    borderColor: 'rgba(168, 85, 129, 0.25)',
    reversed: false,
    stats: [
      { label: '12-Month Retention', value: '89.6%' },
      { label: 'Wage Uplift', value: '+34.2%' },
    ],
  },
  {
    id: 'stage-04',
    stageNumber: 'Stage 04',
    title: 'State & National Governance Intelligence Cockpit',
    subtitle: 'Policy Action Intelligence for 36 States & UTs',
    description:
      'Governments access live district-level heatmaps, scheme expenditure ROI dashboards, and automated policy intervention triggers. Transforms passive reporting into proactive, data-driven workforce policy reform.',
    tags: ['District Heatmaps', 'Scheme ROI', 'Policy Interventions', 'Real-Time Analytics', 'National Coverage'],
    ctaText: 'Explore Policy Intelligence',
    ctaLink: '/for-government',
    image: '/images/reference/cockpit-laptop-preview.png',
    bgColor: 'linear-gradient(150deg, rgba(120, 53, 15, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%)',
    borderColor: 'rgba(245, 158, 11, 0.25)',
    reversed: true,
    stats: [
      { label: 'States & UTs', value: '36' },
      { label: 'National Coverage', value: '87.4%' },
    ],
  },
];

/* ─── Animation Variants ─────────────────────────────────────────────── */
const headerVariant: Variants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease: EASING },
  },
};

// Each panel slides up with slight scale from below
const panelVariant: Variants = {
  hidden: { opacity: 0, y: 80, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.9, ease: EASING },
  },
};

// Image enters from the relevant side
const imageVariantLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.85, delay: 0.15, ease: EASING },
  },
};

const imageVariantRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.85, delay: 0.15, ease: EASING },
  },
};

// Content fades up after image
const contentVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.25, ease: EASING },
  },
};

// Tags stagger in one by one
const tagContainerVariant: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.35 } },
};

const tagVariant: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASING },
  },
};

/* ─── Component ──────────────────────────────────────────────────────── */
export default function FramerPillars() {
  const VIEWPORT = { once: true, margin: '-80px' } as const;

  return (
    <section
      style={{
        padding: '100px 24px',
        background: '#080c14',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(16,185,129,0.14) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 1240, margin: '0 auto', position: 'relative', zIndex: 2 }}>

        {/* ── Section Header ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          variants={headerVariant}
          style={{ textAlign: 'center', marginBottom: 72 }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: 9999,
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              color: '#06b6d4',
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 16,
            }}
          >
            <Sparkles size={13} /> Editorial Showcase
          </div>
          <h2
            className="font-outfit"
            style={{
              fontSize: 'clamp(32px, 5vw, 64px)',
              fontWeight: 900,
              color: '#f8fafc',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              marginBottom: 16,
            }}
          >
            Pillars That Drive Sustainable Livelihoods
          </h2>
          <p
            className="font-manrope"
            style={{ fontSize: 'clamp(15px, 1.8vw, 18px)', color: '#94a3b8', maxWidth: 680, margin: '0 auto' }}
          >
            Deep dive into the 4 strategic phases engineered to guarantee measurable career and economic outcomes.
          </p>
        </motion.div>

        {/* ── Case Study Panels Stack ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {PILLARS.map((pillar, panelIdx) => (
            <motion.div
              key={pillar.id}
              className="editorial-case-panel"
              style={{
                background: pillar.bgColor,
                borderColor: pillar.borderColor,
              }}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              variants={panelVariant}
            >
              <div className={`pillar-layout-row${pillar.reversed ? ' reversed' : ''}`}>

                {/* Visual Preview */}
                <motion.div
                  variants={pillar.reversed ? imageVariantRight : imageVariantLeft}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: 380,
                      borderRadius: 20,
                      overflow: 'hidden',
                      boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.65)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                    }}
                  >
                    <Image
                      src={pillar.image}
                      alt={pillar.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 600px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </motion.div>

                {/* Content & Details */}
                <motion.div variants={contentVariant}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <span
                      style={{
                        background: 'rgba(245, 158, 11, 0.2)',
                        color: '#f59e0b',
                        border: '1px solid rgba(245, 158, 11, 0.35)',
                        padding: '4px 12px',
                        borderRadius: 9999,
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      {pillar.stageNumber}
                    </span>
                    <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>
                      {pillar.subtitle}
                    </span>
                  </div>

                  <h3
                    className="font-outfit"
                    style={{
                      fontSize: 'clamp(26px, 3.2vw, 40px)',
                      fontWeight: 800,
                      color: '#f8fafc',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.15,
                      marginBottom: 16,
                    }}
                  >
                    {pillar.title}
                  </h3>

                  <p
                    className="font-manrope"
                    style={{
                      fontSize: 'clamp(14px, 1.6vw, 16px)',
                      color: '#cbd5e1',
                      lineHeight: 1.7,
                      marginBottom: 24,
                    }}
                  >
                    {pillar.description}
                  </p>

                  {/* Tag Pills with stagger */}
                  <motion.div
                    style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}
                    variants={tagContainerVariant}
                  >
                    {pillar.tags.map((tag, tIdx) => (
                      <motion.span
                        key={tIdx}
                        className={tIdx === 0 ? 'editorial-tag-pill' : 'editorial-tag-pill-dark'}
                        variants={tagVariant}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </motion.div>

                  {/* Stats Callouts */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 24,
                      paddingTop: 18,
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                      marginBottom: 24,
                    }}
                  >
                    {pillar.stats.map((s, sIdx) => (
                      <motion.div
                        key={sIdx}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={VIEWPORT}
                        transition={{ duration: 0.5, delay: 0.4 + sIdx * 0.1, ease: EASING }}
                      >
                        <div style={{ fontSize: 22, fontWeight: 900, color: '#f8fafc' }}>
                          {s.value}
                        </div>
                        <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {s.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Action Link */}
                  <Link href={pillar.ctaLink} className="editorial-arrow-link">
                    <span>{pillar.ctaText}</span>
                    <ArrowRight size={18} />
                  </Link>
                </motion.div>

              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
