'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, ShieldCheck, Activity, TrendingUp, Landmark } from 'lucide-react';

const PILLARS = [
  {
    id: 'stage-01',
    stageNumber: 'Stage 01',
    title: 'Trainee Discovery & AI Diagnostic Engine',
    subtitle: 'From Unstructured Ambition to Verified Competency',
    description:
      'Replaces subjective paper resumes with deep AI-driven competency mapping. Trainees complete real-world scenario challenges that benchmark their capabilities directly against National Skill Qualification Framework (NSQF Level 4–8) standards.',
    tags: ['AI Skill Diagnostics', 'NSQF Level 4–8', 'Adaptive Assessment', 'Skill Gap Heatmap', 'Career Matching'],
    ctaText: 'Explore Trainee Journey',
    ctaLink: '/student',
    image: '/images/reference/platform-telemetry-banner.png',
    bgColor: 'linear-gradient(150deg, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%)',
    borderColor: 'rgba(59, 130, 246, 0.25)',
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
    ctaText: 'Launch Employer Portal',
    ctaLink: '/employer',
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
    ctaText: 'Inspect Outcome Telemetry',
    ctaLink: '/verify/demo-hash',
    image: '/images/reference/retention-telemetry.png',
    bgColor: 'linear-gradient(150deg, rgba(6, 95, 70, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
    reversed: false,
    stats: [
      { label: '12-Month Retention', value: '89.6%' },
      { label: 'Median Wage Uplift', value: '+34.2%' },
    ],
  },
  {
    id: 'stage-04',
    stageNumber: 'Stage 04',
    title: 'Sovereign Governance & State Policy Cockpit',
    subtitle: 'Macro Impact Intelligence for National Skill Missions',
    description:
      'Equips state skill development missions and national policymakers with district-level skill supply-demand heatmaps, training provider performance rankings, scheme expenditure ROI, and automated intervention recommendations.',
    tags: ['Policy Intelligence', 'District Heatmaps', 'Scheme ROI', 'State Missions', 'National Ledger'],
    ctaText: 'Access Government Cockpit',
    ctaLink: '/admin/governance',
    image: '/images/reference/cockpit-laptop-preview.png',
    bgColor: 'linear-gradient(150deg, rgba(120, 53, 15, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%)',
    borderColor: 'rgba(245, 158, 11, 0.25)',
    reversed: true,
    stats: [
      { label: 'Coverage', value: '36 States & UTs' },
      { label: 'Verified Cohorts', value: '142.8k+' },
    ],
  },
];

export default function FramerPillars() {
  return (
    <section style={{ padding: '90px 24px', background: '#070a10', position: 'relative' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: 9999,
              background: 'rgba(6, 182, 212, 0.12)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              color: '#06b6d4',
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 14,
            }}
          >
            <Sparkles size={13} /> Editorial Showcase
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
            Pillars That Drive Sustainable Livelihoods
          </h2>
          <p
            className="font-manrope"
            style={{ fontSize: 'clamp(15px, 1.8vw, 18px)', color: '#94a3b8', maxWidth: 680, margin: '0 auto' }}
          >
            Deep dive into the 4 strategic phases engineered to guarantee measurable career and economic outcomes.
          </p>
        </div>

        {/* ── Case Study Panels Stack ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {PILLARS.map((pillar) => (
            <div
              key={pillar.id}
              className="editorial-case-panel"
              style={{
                background: pillar.bgColor,
                borderColor: pillar.borderColor,
              }}
            >
              <div className={`pillar-layout-row${pillar.reversed ? ' reversed' : ''}`}>
                {/* Visual Preview (Mockup) */}
                <div>
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
                </div>

                {/* Content & Details */}
                <div>
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

                  {/* Tag Pills Inspired by Reference */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
                    {pillar.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className={tIdx === 0 ? 'editorial-tag-pill' : 'editorial-tag-pill-dark'}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

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
                      <div key={sIdx}>
                        <div style={{ fontSize: 22, fontWeight: 900, color: '#f8fafc' }}>
                          {s.value}
                        </div>
                        <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Link */}
                  <Link href={pillar.ctaLink} className="editorial-arrow-link">
                    <span>{pillar.ctaText}</span>
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
