'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import {
  Brain,
  ShieldCheck,
  TrendingUp,
  Award,
  Zap,
  Layers,
  Sparkles,
  Users,
  Building2,
  Landmark,
  FileCheck,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  GraduationCap,
  School,
  Briefcase,
  BarChart3,
  Lock,
  ExternalLink,
  Target,
  FileText,
  AlertTriangle,
  Flame,
} from 'lucide-react';

import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import FramerHero from '@/components/landing/FramerHero';
import FramerMarquee from '@/components/landing/FramerMarquee';
import FramerCTA from '@/components/landing/FramerCTA';
import SkillPassportShowcase from '@/components/sections/SkillPassportShowcase';
import PricingSection from '@/components/sections/PricingSection';
import { AIBadge } from '@/components/ui/AIBadge';

export default function LandingPage() {
  const shouldReduceMotion = useReducedMotion();
  const [activeRoleTab, setActiveRoleTab] = useState<'student' | 'institute' | 'employer' | 'government'>('student');

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base, #07090e)', color: 'var(--text-primary, #f8fafc)', overflowX: 'hidden' }}>
      {/* ── 1. Sovereign Navigation ── */}
      <PublicNavbar />

      <main id="main-content">
        {/* ── 2. Monumental Hero Section ── */}
        <FramerHero />

        {/* ── 3. Continuous Ecosystem Marquee ── */}
        <FramerMarquee />

        {/* ── 4. The Problem: The Broken National Skilling Funnel ── */}
        <section
          id="problem"
          style={{
            padding: '56px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            background: 'rgba(255, 255, 255, 0.015)',
            position: 'relative',
          }}
        >
          <div style={{ maxWidth: 1240, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto 36px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 14px',
                  borderRadius: 9999,
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  fontSize: 11.5,
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  color: '#ef4444',
                  textTransform: 'uppercase',
                  marginBottom: 16,
                }}
              >
                <AlertTriangle size={13} /> The Workforce Outcome Crisis
              </div>
              <h2
                style={{
                  fontSize: 'clamp(28px, 4vw, 42px)',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  marginBottom: 16,
                }}
              >
                Why Traditional Placement Reporting Fails Indian Industry
              </h2>
              <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: 16, lineHeight: 1.65 }}>
                Billions are deployed into vocational and technical education every year, yet industry faces chronic skill shortages while graduates struggle with job placement.
              </p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 24,
              }}
            >
              {[
                {
                  icon: FileText,
                  badge: 'Degree vs. Competency',
                  title: 'Subjective Paper Resumes',
                  desc: 'Traditional degrees and PDF resumes rely on self-reported assertions. Recruiters spend hours sifting through unverified keyword-stuffed claims with 0 proof of practical competency.',
                  stat: '64%',
                  statLabel: 'of resumes contain inflated skill proficiencies',
                },
                {
                  icon: TrendingUp,
                  badge: 'Day-1 Illusion',
                  title: 'The 90-Day Retention Chasm',
                  desc: 'Traditional placement statistics stop counting on Day 1 of joining. Upwards of 40% of fresh hires leave or churn within 90 days due to fundamental skill-job misalignments.',
                  stat: '42%',
                  statLabel: 'first-year technical attrition across Indian IT/Core sectors',
                },
                {
                  icon: ShieldCheck,
                  badge: 'Accountability Void',
                  title: 'Unverifiable Skilling ROI',
                  desc: 'Government skilling missions and institutions lack longitudinal data systems to verify which curriculum updates generate measurable wage progression and career longevity.',
                  stat: '₹14,000Cr+',
                  statLabel: 'annual public skilling expenditure with unlinked retention telemetry',
                },
              ].map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    style={{
                      background: 'var(--bg-surface, #0f131d)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: 14,
                      padding: 28,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'transform 0.2s ease, border-color 0.2s ease',
                    }}
                    whileHover={{ y: -4, borderColor: 'rgba(245, 158, 11, 0.35)' }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 10,
                            background: 'rgba(245, 158, 11, 0.12)',
                            border: '1px solid rgba(245, 158, 11, 0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--gold, #f59e0b)',
                          }}
                        >
                          <IconComponent size={22} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold, #f59e0b)', background: 'rgba(245,158,11,0.08)', padding: '3px 8px', borderRadius: 6 }}>
                          {item.badge}
                        </span>
                      </div>
                      <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 10, color: 'var(--text-primary, #f8fafc)' }}>
                        {item.title}
                      </h3>
                      <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                        {item.desc}
                      </p>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: 16 }}>
                      <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--gold, #f59e0b)' }}>{item.stat}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted, #64748b)', marginTop: 2 }}>{item.statLabel}</div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ── 5. How Ryyvora Works: The 4-Stage Verifiable Outcome Lifecycle ── */}
        <section
          id="how-it-works"
          style={{
            padding: '90px 24px',
            position: 'relative',
          }}
        >
          <div style={{ maxWidth: 1240, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto 60px' }}>
              <AIBadge type="nsqf" label="VERIFIABLE WORKFORCE PIPELINE" />
              <h2
                style={{
                  fontSize: 'clamp(28px, 4vw, 42px)',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  marginTop: 14,
                  marginBottom: 16,
                }}
              >
                How Workforce Outcome Intelligence Works
              </h2>
              <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: 16, lineHeight: 1.65 }}>
                A closed-loop architecture connecting candidate competency, tamper-proof credential issuance, enterprise hiring, and 365-day retention validation.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 20,
                position: 'relative',
              }}
            >
              {[
                {
                  step: '01',
                  title: 'AI Diagnostic Assessment',
                  subtitle: 'Objective Benchmark',
                  desc: 'Trainees solve domain-specific, NSQF-aligned technical scenarios. AI extracts granular technical and soft competency vectors across 4,500+ occupational standards.',
                  tag: 'NSQF Level 1–8',
                },
                {
                  step: '02',
                  title: 'Cryptographic Skill Passport',
                  subtitle: 'HMAC-SHA256 Ledger',
                  desc: 'Assessment results and verified competencies are cryptographically signed into an immutable Skill Passport with public QR and hash validation.',
                  tag: 'Tamper-Proof',
                },
                {
                  step: '03',
                  title: 'Precision Employer Match',
                  subtitle: 'Direct Talent Conduit',
                  desc: 'Hiring partners review pre-screened talent matched directly against verified skill vectors, reducing recruitment latency by over 60%.',
                  tag: 'Zero Resume Fraud',
                },
                {
                  step: '04',
                  title: 'Longitudinal Retention Tracking',
                  subtitle: '365-Day Outcome Proof',
                  desc: 'Automated 90d, 180d, and 365d follow-ups verify employment continuity, wage growth, and career progression with DPDP-compliant consent.',
                  tag: 'Policy Telemetry',
                },
              ].map((stage, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-surface, #0f131d)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 14,
                    padding: 24,
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 900,
                          fontFamily: 'monospace',
                          color: 'var(--gold, #f59e0b)',
                          background: 'rgba(245, 158, 11, 0.1)',
                          padding: '4px 10px',
                          borderRadius: 6,
                          border: '1px solid rgba(245, 158, 11, 0.25)',
                        }}
                      >
                        STAGE {stage.step}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: 4 }}>
                        {stage.tag}
                      </span>
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: '#f8fafc' }}>
                      {stage.title}
                    </h3>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gold, #f59e0b)', marginBottom: 12 }}>
                      {stage.subtitle}
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: 13.5, lineHeight: 1.6 }}>
                      {stage.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <Link
                href="/how-it-works"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  color: 'var(--gold, #f59e0b)',
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: 'none',
                }}
              >
                Explore the complete technical architecture and longitudinal lifecycle <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── 6. Core Platform Capabilities ── */}
        <section
          id="features"
          style={{
            padding: '80px 24px',
            background: 'rgba(255, 255, 255, 0.015)',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div style={{ maxWidth: 1240, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto 50px' }}>
              <span style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--gold, #f59e0b)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Platform Intelligence Engines
              </span>
              <h2
                style={{
                  fontSize: 'clamp(28px, 4vw, 42px)',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  marginTop: 12,
                  marginBottom: 16,
                }}
              >
                Comprehensive Outcome Infrastructure
              </h2>
              <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: 16, lineHeight: 1.65 }}>
                Purpose-built modules for candidate diagnostics, credential sovereignty, employer matching, and state policy planning.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 24,
              }}
            >
              {[
                {
                  title: 'AI Skill Analyzer',
                  href: '/student/analyzer',
                  badge: 'Multi-Format Ingestion',
                  desc: 'Ingests resumes (PDF, DOCX, TXT), GitHub repositories, and architectural projects to derive multi-vector competency scores benchmarked against NSQF levels.',
                  features: ['PDF/DOCX Document Extraction', 'Server GitHub Inspector', 'Radar Competency Vectors', 'Candidate Percentile Benchmark'],
                  color: 'var(--gold, #f59e0b)',
                },
                {
                  title: 'Digital Skill Passport',
                  href: '/skill-passport',
                  badge: 'HMAC-SHA256 Signed',
                  desc: 'A permanent, tamper-evident digital credential proving candidate mastery. Employers and accreditation bodies verify authenticity with zero phone calls or friction.',
                  features: ['Instant QR Verification', 'Cryptographic Proof Hash', 'NSQF Level Mapping', 'Printable A4 Dossier Export'],
                  color: '#10b981',
                },
                {
                  title: 'AI Brainstorm & Career Copilot',
                  href: '/brainstorm',
                  badge: 'Context-Aware AI',
                  desc: 'Interactive guidance engine helping candidates identify skill deficiencies, explore career mobility pathways, and prepare for industry interviews.',
                  features: ['Role-Specific Suggestions', 'Curriculum Gap Diagnostics', 'Salary Trajectory Projections', 'Non-Repeating Recommendation Engine'],
                  color: '#06b6d4',
                },
                {
                  title: 'Automated Retention Engine',
                  href: '/workforce-analytics',
                  badge: '365d Telemetry',
                  desc: 'Automated follow-up scheduler tracking 90-day, 180-day, and 365-day employment outcomes with DPDP Act 2023 compliant candidate consent governance.',
                  features: ['Automated Survey Scheduler', 'Wage Progression Curves', 'Employer Verification Portal', 'Institutional ROI Metrics'],
                  color: '#a855f7',
                },
              ].map((feat, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-surface, #0f131d)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 14,
                    padding: 28,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: feat.color, background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: 4, border: `1px solid ${feat.color}40` }}>
                        {feat.badge}
                      </span>
                    </div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10, color: '#f8fafc' }}>
                      {feat.title}
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                      {feat.desc}
                    </p>
                    <ul style={{ padding: 0, margin: '0 0 20px 0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {feat.features.map((f, fIdx) => (
                        <li key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#cbd5e1' }}>
                          <CheckCircle2 size={14} style={{ color: feat.color, flexShrink: 0 }} /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href={feat.href}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      color: feat.color,
                      fontWeight: 700,
                      fontSize: 13.5,
                      textDecoration: 'none',
                    }}
                  >
                    Learn more <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. Role-Based Ecosystem Switcher ── */}
        <section
          id="ecosystem"
          style={{
            padding: '90px 24px',
            position: 'relative',
          }}
        >
          <div style={{ maxWidth: 1240, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto 40px' }}>
              <AIBadge type="verified" label="MULTI-STAKEHOLDER ECOSYSTEM" />
              <h2
                style={{
                  fontSize: 'clamp(28px, 4vw, 42px)',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  marginTop: 14,
                  marginBottom: 16,
                }}
              >
                Built for Every Workforce Participant
              </h2>
              <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: 16, lineHeight: 1.65 }}>
                Unified workflows tailored to the distinct operational needs of trainees, training providers, corporate recruiters, and state policy planners.
              </p>

              {/* Role Tabs */}
              <div
                style={{
                  display: 'inline-flex',
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: 4,
                  borderRadius: 10,
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  gap: 4,
                  marginTop: 16,
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                {[
                  { id: 'student', label: 'Trainees & Students', icon: GraduationCap },
                  { id: 'institute', label: 'Training Providers', icon: School },
                  { id: 'employer', label: 'Employers & Recruiters', icon: Briefcase },
                  { id: 'government', label: 'Government & Policy', icon: Landmark },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeRoleTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveRoleTab(tab.id as any)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 18px',
                        borderRadius: 8,
                        border: 'none',
                        background: isActive ? 'var(--gold, #f59e0b)' : 'transparent',
                        color: isActive ? '#090a0f' : '#94a3b8',
                        fontWeight: isActive ? 800 : 600,
                        fontSize: 13,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Icon size={14} /> {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Active Role Showcase */}
            <div
              style={{
                background: 'var(--bg-surface, #0f131d)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 16,
                padding: '36px 32px',
                maxWidth: 1040,
                margin: '0 auto',
              }}
            >
              {activeRoleTab === 'student' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--gold, #f59e0b)', textTransform: 'uppercase' }}>Candidate Cockpit</span>
                    <h3 style={{ fontSize: 24, fontWeight: 800, margin: '8px 0 14px', color: '#f8fafc' }}>
                      Build a Verified Skill Passport & Unlock Matching Jobs
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.65, marginBottom: 20 }}>
                      Stop relying on static resumes. Take diagnostic NSQF-aligned assessments, verify your GitHub and practical projects, receive a tamper-proof credential, and access live job matches.
                    </p>
                    <Link href="/for-trainees" className="btn-gold" style={{ padding: '10px 20px', fontSize: 13.5, borderRadius: 8, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      Explore Trainee Features <ArrowRight size={14} />
                    </Link>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: 24, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold, #f59e0b)', marginBottom: 12 }}>Trainee Highlights</div>
                    <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13.5, color: '#cbd5e1' }}>
                      <li>✓ Cryptographically signed SHA-256 Skill Passport</li>
                      <li>✓ AI Skill Gap diagnostics against B.Tech engineering branches</li>
                      <li>✓ 30-minute timed adaptive domain assessments</li>
                      <li>✓ Direct employer job matches with skill-fit ranking</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeRoleTab === 'institute' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>Institutional Accreditation</span>
                    <h3 style={{ fontSize: 24, fontWeight: 800, margin: '8px 0 14px', color: '#f8fafc' }}>
                      Accreditation, Cohort Tracking & Verifiable Placement ROI
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.65, marginBottom: 20 }}>
                      Equip training batches with verified credentials, track student retention milestones beyond graduation, and showcase verified placement ROI to regulatory boards and industry recruiters.
                    </p>
                    <Link href="/for-training-providers" className="btn-gold" style={{ padding: '10px 20px', fontSize: 13.5, borderRadius: 8, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      Explore Institute Portal <ArrowRight size={14} />
                    </Link>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: 24, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#10b981', marginBottom: 12 }}>Provider Capabilities</div>
                    <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13.5, color: '#cbd5e1' }}>
                      <li>✓ Cohort batch upload & automated passport generation</li>
                      <li>✓ Longitudinal 90d, 180d, and 365d retention analytics</li>
                      <li>✓ Curriculum gap benchmarking against regional demand</li>
                      <li>✓ Verified placement evidence dossiers for NAAC & NBA</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeRoleTab === 'employer' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#06b6d4', textTransform: 'uppercase' }}>Enterprise Recruiter</span>
                    <h3 style={{ fontSize: 24, fontWeight: 800, margin: '8px 0 14px', color: '#f8fafc' }}>
                      Hire Pre-Assessed Talent with Zero Credential Fraud
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.65, marginBottom: 20 }}>
                      Access an verified pool of technical graduates with authenticated diagnostic scores, instant ledger hash verification, and automated hiring attestation.
                    </p>
                    <Link href="/for-employers" className="btn-gold" style={{ padding: '10px 20px', fontSize: 13.5, borderRadius: 8, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      Explore Employer Intelligence <ArrowRight size={14} />
                    </Link>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: 24, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#06b6d4', marginBottom: 12 }}>Recruiter Advantage</div>
                    <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13.5, color: '#cbd5e1' }}>
                      <li>✓ Instant cryptographic credential verification</li>
                      <li>✓ Multi-dimensional radar competency scoring</li>
                      <li>✓ Pre-screened candidates filtered by NSQF Level</li>
                      <li>✓ Automated 4-stage hiring & retention attestation</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeRoleTab === 'government' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#a855f7', textTransform: 'uppercase' }}>State Policy & Governance</span>
                    <h3 style={{ fontSize: 24, fontWeight: 800, margin: '8px 0 14px', color: '#f8fafc' }}>
                      Sovereign Workforce Telemetry & District Skill Heatmaps
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.65, marginBottom: 20 }}>
                      Monitor real-time employment outcomes across all districts. Utilize our AI Policy Copilot to identify training bottlenecks, target voucher subsidies, and ensure DPDP Act 2023 compliance.
                    </p>
                    <Link href="/for-government" className="btn-gold" style={{ padding: '10px 20px', fontSize: 13.5, borderRadius: 8, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      Explore Policy Intelligence <ArrowRight size={14} />
                    </Link>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: 24, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#a855f7', marginBottom: 12 }}>Policy Insights</div>
                    <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13.5, color: '#cbd5e1' }}>
                      <li>✓ 9-stage Macro Outcome Funnel tracking</li>
                      <li>✓ District skill gap heatmaps with small-sample protection</li>
                      <li>✓ Grounded AI Policy Copilot with citation backing</li>
                      <li>✓ Fully DPDP Act 2023 compliant data governance</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── 8. Verifiable Skill Passport Showcase ── */}
        <section
          id="passport"
          style={{
            padding: '80px 24px',
            background: 'rgba(255, 255, 255, 0.015)',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <SkillPassportShowcase />
        </section>

        {/* ── 9. Longitudinal Impact & National Alignment ── */}
        <section
          id="impact"
          style={{
            padding: '80px 24px',
            position: 'relative',
          }}
        >
          <div style={{ maxWidth: 1240, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto 50px' }}>
              <AIBadge type="nsqf" label="MEASURABLE IMPACT" />
              <h2
                style={{
                  fontSize: 'clamp(28px, 4vw, 42px)',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  marginTop: 14,
                  marginBottom: 16,
                }}
              >
                National Outcomes at Scale
              </h2>
              <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: 16, lineHeight: 1.65 }}>
                Engineered for state skill development missions, technical universities, and national employment exchanges.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 20,
              }}
            >
              {[
                { label: 'Verified Skill Passports', value: '48,200+', sub: 'Cryptographically sealed across Maharashtra' },
                { label: '90-Day Retention Rate', value: '88.4%', sub: 'Verified longitudinal employment continuity' },
                { label: 'Hiring Latency Reduction', value: '-62%', sub: 'From initial search to verified offer' },
                { label: 'NSQF Standards Aligned', value: 'Levels 1–8', sub: 'Compliant with NCVET qualification files' },
              ].map((metric, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-surface, #0f131d)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 14,
                    padding: 24,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 'clamp(28px, 3.5vw, 38px)', fontWeight: 900, color: 'var(--gold, #f59e0b)', marginBottom: 6 }}>
                    {metric.value}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', marginBottom: 4 }}>
                    {metric.label}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted, #64748b)' }}>
                    {metric.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 10. Transparent Institutional Plans & Billing ── */}
        <PricingSection />

        {/* ── 11. Framer Atmospheric Call to Action ── */}
        <FramerCTA />
      </main>

      {/* ── 11. Institutional Public Footer ── */}
      <PublicFooter />
    </div>
  );
}
