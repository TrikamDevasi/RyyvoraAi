'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Award,
  Compass,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  Users,
  Building2,
  Landmark,
  FileCheck,
  QrCode,
  Lock,
  ChevronRight,
  Copy,
  Check,
  Bot,
  ExternalLink,
  GraduationCap,
  School,
  Milestone,
  Briefcase,
  ChevronDown,
  HelpCircle,
  FileText,
  CheckCheck,
  BarChart3,
  Database,
  Target,
  Code,
} from 'lucide-react';

import { AIBadge } from '@/components/ui/AIBadge';
import Tilt3D from '@/components/ui/Tilt3D';
import PricingSection from '@/components/sections/PricingSection';
import ThemeToggle from '@/components/shared/ThemeToggle';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import DistrictTelemetrySandbox from '@/components/sections/DistrictTelemetrySandbox';
import SkillPassportShowcase from '@/components/sections/SkillPassportShowcase';

function DynamicBidirectionalCounter({
  target,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 2000,
}: {
  target: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let animFrame: number;

    const formatValue = (val: number) => {
      const numStr =
        decimals > 0
          ? val.toFixed(decimals)
          : Math.round(val).toLocaleString('en-IN');
      return `${prefix}${numStr}${suffix}`;
    };

    // Set initial text content
    el.textContent = formatValue(target);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (animFrame) cancelAnimationFrame(animFrame);
            let startTime: number | null = null;

            const animate = (timestamp: number) => {
              if (!startTime) startTime = timestamp;
              const elapsed = timestamp - startTime;
              const progress = Math.min(elapsed / duration, 1);

              // Quartic ease-out curve for buttery smooth rolling stop
              const ease = 1 - Math.pow(1 - progress, 4);
              const current = ease * target;

              if (el) {
                el.textContent = formatValue(current);
              }

              if (progress < 1) {
                animFrame = requestAnimationFrame(animate);
              } else {
                if (el) el.textContent = formatValue(target);
              }
            };

            animFrame = requestAnimationFrame(animate);
          } else {
            // When scrolled out of view, reset to 0 so next scroll into view animates smoothly
            if (el) {
              el.textContent = formatValue(0);
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, [target, duration, decimals, prefix, suffix]);

  const initialFormatted =
    decimals > 0
      ? target.toFixed(decimals)
      : target.toLocaleString('en-IN');

  return (
    <span
      ref={ref}
      style={{
        fontVariantNumeric: 'tabular-nums',
        display: 'inline-block',
        minWidth: '1ch',
      }}
    >
      {prefix}{initialFormatted}{suffix}
    </span>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<'dashboard' | 'analyzer' | 'gaps' | 'career' | 'copilot' | 'passport'>('dashboard');
  const [activeRoleTab, setActiveRoleTab] = useState<'student' | 'employer' | 'institute' | 'government' | 'industry' | 'admin'>('student');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyHash = () => {
    navigator.clipboard.writeText('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text-primary)', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* ── 1. Sticky Navigation Bar ── */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          zIndex: 100,
          background: scrolled ? 'var(--bg-surface)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          transition: 'all 0.25s ease',
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            padding: '0 24px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: 14,
                color: '#090a0f',
                boxShadow: '0 2px 10px rgba(245,158,11,0.3)',
              }}
            >
              SK
            </div>
            <span className="font-display" style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              SkillSense <span style={{ color: 'var(--gold)' }}>AI</span>
            </span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex" style={{ gap: 24, alignItems: 'center' }}>
            <a href="#roles" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>Role Features</a>
            <a href="#features" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>Core Capabilities</a>
            <a href="#how-it-works" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>How It Works</a>
            <a href="#passport" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>Skill Passport</a>
            <a href="#pricing" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>Pricing</a>
            <a href="#faq" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>FAQ</a>
            <a href="#trust" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>DPDP Trust</a>
          </div>

          {/* Auth Actions & Theme Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ThemeToggle variant="icon" />
            <Link
              href="/auth"
              className="btn-secondary hidden sm:inline-flex"
              style={{ fontSize: 12.5, padding: '7px 14px' }}
            >
              Sign In
            </Link>
            <Link
              href="/student/analyzer"
              className="btn-gold"
              style={{ fontSize: 12.5, padding: '7px 16px' }}
            >
              <BarChart3 size={13} /> Analyze Skills
            </Link>
          </div>
        </div>
      </nav>

      {/* ── 2. Hero Section ── */}
      <section
        style={{
          paddingTop: 130,
          paddingBottom: 70,
          position: 'relative',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse at 50% 10%, rgba(245, 158, 11, 0.08) 0%, transparent 60%)',
        }}
      >
        {/* Subtle Maharashtra Workforce Intelligence Silhouette Background */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: 1040,
            height: '80%',
            opacity: 0.16,
            pointerEvents: 'none',
            zIndex: 0,
            maskImage: 'radial-gradient(ellipse 70% 65% at 50% 45%, black 35%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 65% at 50% 45%, black 35%, transparent 85%)',
          }}
          aria-hidden="true"
        >
          <img
            src="/images/landing/maharashtra-telemetry-map.svg"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            loading="eager"
          />
        </div>

        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20 }}
          >
            <AIBadge type="nsqf" label="GOVERNMENT OF MAHARASHTRA" />
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display"
            style={{
              fontSize: 'clamp(32px, 5.5vw, 60px)',
              fontWeight: 900,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              maxWidth: 980,
              margin: '0 auto 20px',
              color: '#f8fafc',
            }}
          >
            From Training Data to{' '}
            <span className="text-gradient-gold">Real Employment Outcomes</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: 'clamp(15px, 1.8vw, 18px)',
              color: 'var(--text-secondary)',
              maxWidth: 780,
              margin: '0 auto 36px',
              lineHeight: 1.6,
            }}
          >
            SkillSense connects vocational training, NSQF assessments, employment transitions, 365-day retention, and longitudinal wage growth into one privacy-conscious intelligence platform.
          </motion.p>

          {/* CTA Buttons & Role Portals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}
          >
            <Link
              href="/government"
              className="btn-gold btn-3d"
              style={{ fontSize: 13.5, padding: '12px 24px', boxShadow: '0 4px 20px rgba(245,158,11,0.3)' }}
            >
              <Landmark size={16} /> Government State Cockpit <ArrowRight size={15} className="interactive-arrow" />
            </Link>

            <Link
              href="/student/journey"
              className="btn-secondary btn-3d"
              style={{ fontSize: 13.5, padding: '12px 22px' }}
            >
              <Milestone size={16} /> Trainee Outcome Journey
            </Link>

            <Link
              href="/employer/validations"
              className="btn-secondary btn-3d"
              style={{ fontSize: 13.5, padding: '12px 22px' }}
            >
              <ShieldCheck size={16} /> Employer Verification Ledger
            </Link>
          </motion.div>


          {/* ── Realistic Product Dashboard Preview with 3D Spatial Tilt ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ position: 'relative', maxWidth: 1040, margin: '0 auto' }}
          >
            {/* Spatial Floating Badge 1 (Top-Right) */}
            <div
              className="floating-badge-1 hidden sm:flex"
              style={{
                position: 'absolute',
                top: -14,
                right: 24,
                background: 'var(--bg-surface)',
                border: '1px solid var(--gold-border)',
                boxShadow: '0 8px 24px -4px rgba(245,158,11,0.22)',
                borderRadius: 'var(--radius-pill)',
                padding: '6px 14px',
                alignItems: 'center',
                gap: 8,
                zIndex: 10,
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
              <span style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--text-primary)' }}>
                98.4% Cryptographically Verified
              </span>
            </div>

            {/* Spatial Floating Badge 2 (Bottom-Left) */}
            <div
              className="floating-badge-2 hidden sm:flex"
              style={{
                position: 'absolute',
                bottom: -14,
                left: 24,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.3)',
                borderRadius: 'var(--radius-pill)',
                padding: '6px 14px',
                alignItems: 'center',
                gap: 8,
                zIndex: 10,
              }}
            >
              <Sparkles size={13} color="var(--gold)" />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-secondary)' }}>
                NSQF Level 6 Competency Matrix
              </span>
            </div>

            <Tilt3D maxRotation={2.5} translateZ={10}>
              <div
                className="card-accent"
                style={{
                  padding: 24,
                  borderRadius: 18,
                  textAlign: 'left',
                  boxShadow: '0 20px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08)',
                }}
              >
                {/* Top Preview Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, borderBottom: '1px solid var(--border)', paddingBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8, fontFamily: 'monospace' }}>
                      skillsense.ai/student/intelligence-cockpit
                    </span>
                  </div>
                  <AIBadge type="verified" label="SHA-256 VERIFIED" />
                </div>

                {/* Mock Cockpit Content */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  {/* Score & Profile */}
                  <div className="card-standard" style={{ padding: 18, borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase' }}>
                      Verified Readiness Score
                    </div>
                    <div className="font-display" style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-primary)', marginTop: 2 }}>
                      84<span style={{ fontSize: 16, color: 'var(--text-muted)' }}>/100</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600, marginTop: 4 }}>
                      ✓ NSQF Level 5 (Software Engineering)
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>
                      Top Strengths: TypeScript, Node.js REST APIs, Database Optimization.
                    </div>
                  </div>

                  {/* Career Match */}
                  <div className="card-standard" style={{ padding: 18, borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--info)', textTransform: 'uppercase' }}>
                      Top Career Match
                    </div>
                    <div className="font-display" style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
                      Full-Stack Cloud Engineer
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 700, marginTop: 2 }}>
                      92% Compatibility · ₹8L–₹16L/yr (Est.)
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>
                      Targeted Upskilling: Distributed Caching & Docker CI/CD (+8%).
                    </div>
                  </div>

                  {/* AI Insight Pill */}
                  <div className="card-ai" style={{ padding: 18, borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase' }}>
                      <Sparkles size={13} className="interactive-ai-icon" /> Active AI Copilot Recommendation
                    </div>
                    <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5, margin: '8px 0 0' }}>
                      "Candidate has demonstrated advanced API and state management capabilities. Closing the container orchestration gap will accelerate placement readiness in Tier-1 tech hubs."
                    </p>
                  </div>
                </div>
              </div>
            </Tilt3D>

            {/* Ambient Base Reflection & Spatial Glow */}
            <div
              style={{
                position: 'absolute',
                bottom: -28,
                left: '10%',
                right: '10%',
                height: 48,
                background: 'radial-gradient(ellipse at 50% 50%, rgba(245,158,11,0.22) 0%, rgba(6,182,212,0.14) 45%, transparent 75%)',
                filter: 'blur(24px)',
                zIndex: -1,
                pointerEvents: 'none',
              }}
              aria-hidden="true"
            />
          </motion.div>
        </div>
      </section>

      {/* ── 3. Platform Credibility & Tech Partners Grid ── */}
      <section style={{ padding: '36px 24px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface-elevated)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>
            Architected With Multi-Provider AI Inference & National Standards
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))',
              gap: 14,
              alignItems: 'stretch',
            }}
          >
            {[
              { label: 'Groq Cloud Llama-3.3', sub: 'Ultra-Low Latency Inference', badge: '120 tok/s' },
              { label: 'OpenAI GPT-4o Mini', sub: 'Multi-Vector Reasoning', badge: 'Active' },
              { label: 'Perplexity Sonar', sub: 'Real-Time Market Grounding', badge: 'Live Data' },
              { label: 'NSQF National Framework', sub: 'Govt Aligned Standards', badge: 'Levels 1–10' },
              { label: 'SHA-256 HMAC Signatures', sub: 'Immutable Credential Ledger', badge: 'Tamper-Proof' },
              { label: 'Algorithmic Fairness 4/5ths', sub: 'Automated Bias Auditing', badge: 'EEOC / DPDP' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="card-linear"
                style={{
                  padding: '12px 14px',
                  borderRadius: 10,
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--gold)', background: 'rgba(245,158,11,0.1)', padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(245,158,11,0.2)' }}>
                    {item.badge}
                  </span>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Problem → Solution Narrative ── */}
      <section style={{ padding: '80px 24px', position: 'relative' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <AIBadge type="ai" label="THE WORKFORCE DISCONNECT" />
            <h2 className="font-display" style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 800, color: '#f8fafc', margin: '8px 0 12px' }}>
              From Unverified Resumes to a Shared Intelligence Layer
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 640, margin: '0 auto' }}>
              Traditional educational degrees lack granular competency verification, while employers struggle with hiring friction. SkillSense bridges this divide.
            </p>
          </div>

          {/* Visual Progression Flow */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
              gap: 12,
              marginBottom: 40,
            }}
          >
            {[
              {
                step: '01',
                stage: 'INPUT',
                title: 'Raw Profile / Code',
                desc: 'Resumes, GitHub commits, coursework and project scope',
                icon: Code,
                color: '#38bdf8',
              },
              {
                step: '02',
                stage: 'EXTRACT',
                title: 'Neural Extraction',
                desc: '50+ competency dimensions evaluated against NSQF',
                icon: Brain,
                color: '#a855f7',
              },
              {
                step: '03',
                stage: 'ANALYZE',
                title: 'Skill Graph & Gaps',
                desc: 'Deficiency matrix and step-by-step milestone roadmap',
                icon: Layers,
                color: '#f59e0b',
              },
              {
                step: '04',
                stage: 'PREDICT',
                title: 'Career Matcher',
                desc: 'Live market compatibility & salary projections in INR',
                icon: Compass,
                color: '#10b981',
              },
              {
                step: '05',
                stage: 'VERIFY',
                title: 'Verified Passport',
                desc: 'Cryptographically signed SHA-256 public credential',
                icon: ShieldCheck,
                color: '#ec4899',
              },
            ].map((node, i) => {
              const IconComp = node.icon;
              return (
                <div
                  key={i}
                  className="pipeline-step-card card-shine"
                  style={{
                    padding: '20px 18px',
                    minHeight: 185,
                  }}
                >
                  {/* Top Header Row: Step Number + Icon Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <span
                      className="font-mono pipeline-number-badge"
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color: 'var(--gold)',
                        background: 'rgba(245,158,11,0.08)',
                        border: '1px solid rgba(245,158,11,0.25)',
                        padding: '3px 8px',
                        borderRadius: 6,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {node.step}
                    </span>

                    <div
                      className="pipeline-icon-badge"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: node.color,
                      }}
                    >
                      <IconComp size={16} />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div>
                    <h4
                      className="pipeline-card-title"
                      style={{
                        fontSize: 14.5,
                        fontWeight: 700,
                        color: '#f8fafc',
                        margin: '0 0 6px',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {node.title}
                    </h4>
                    <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
                      {node.desc}
                    </p>
                  </div>

                  {/* Bottom Stage Indicator */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      marginTop: 18,
                      paddingTop: 10,
                      borderTop: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <span
                      className="pipeline-stage-dot"
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'rgba(245,158,11,0.6)',
                      }}
                    />
                    <span
                      className="pipeline-stage-label"
                      style={{
                        fontSize: 9.5,
                        fontWeight: 800,
                        color: 'var(--text-muted)',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Stage {node.step} · {node.stage}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. Core AI Capabilities (WHAT, WHY, HOW) ── */}
      <section id="features" style={{ padding: '80px 24px', background: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 54 }}>
            <AIBadge type="ai" label="CORE CAPABILITIES" />
            <h2 className="font-display" style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, color: '#f8fafc', margin: '8px 0 12px' }}>
              Built for Deep Technical Precision
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 680, margin: '0 auto' }}>
              Every AI capability in SkillSense is backed by resilient multi-provider LLMs, safe JSON repair, and strict Zod runtime schemas.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
            {/* Feature 1: AI Skill Analyzer */}
            <div
              className="tech-feature-card card-shine"
              style={
                {
                  padding: 24,
                  '--card-accent': 'var(--gold)',
                  '--card-accent-glow': 'rgba(245,158,11,0.25)',
                  '--card-accent-border': 'rgba(245,158,11,0.5)',
                } as React.CSSProperties
              }
            >
              <div>
                <div
                  className="tech-feature-icon"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: 'rgba(245,158,11,0.12)',
                    border: '1px solid rgba(245,158,11,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold)',
                    marginBottom: 16,
                  }}
                >
                  <Brain size={20} />
                </div>
                <h3 className="font-display" style={{ fontSize: 17, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
                  Multi-Modal AI Skill Analyzer
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
                  <strong style={{ color: '#f8fafc' }}>WHAT:</strong> Ingests raw resume text, GitHub repositories, and submitted code snippets.<br />
                  <strong style={{ color: '#f8fafc' }}>WHY:</strong> Eliminates keyword stuffing by verifying actual architectural and coding syntax.<br />
                  <strong style={{ color: '#f8fafc' }}>HOW:</strong> Powered by Groq Llama-3.3-70b with safe JSON repair and NSQF taxonomy mapping.
                </p>
              </div>
              <Link href="/student/analyzer" className="tech-feature-link" style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--gold)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                Test Skill Analyzer <ChevronRight size={14} className="tech-feature-arrow" />
              </Link>
            </div>

            {/* Feature 2: Career Prediction */}
            <div
              className="tech-feature-card card-shine"
              style={
                {
                  padding: 24,
                  '--card-accent': '#60a5fa',
                  '--card-accent-glow': 'rgba(96,165,250,0.25)',
                  '--card-accent-border': 'rgba(96,165,250,0.5)',
                } as React.CSSProperties
              }
            >
              <div>
                <div
                  className="tech-feature-icon"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: 'rgba(59,130,246,0.12)',
                    border: '1px solid rgba(59,130,246,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#60a5fa',
                    marginBottom: 16,
                  }}
                >
                  <Compass size={20} />
                </div>
                <h3 className="font-display" style={{ fontSize: 17, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
                  Predictive Career Pathways
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
                  <strong style={{ color: '#f8fafc' }}>WHAT:</strong> Matches candidate competencies to high-growth Indian tech roles.<br />
                  <strong style={{ color: '#f8fafc' }}>WHY:</strong> Prevents career misalignment by forecasting market demand and compensation.<br />
                  <strong style={{ color: '#f8fafc' }}>HOW:</strong> Calculates mathematical compatibility scores and transparent INR model estimates.
                </p>
              </div>
              <Link href="/student/career" className="tech-feature-link" style={{ fontSize: 12.5, fontWeight: 700, color: '#60a5fa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                Explore Career Paths <ChevronRight size={14} className="tech-feature-arrow" />
              </Link>
            </div>

            {/* Feature 3: Gap Analysis */}
            <div
              className="tech-feature-card card-shine"
              style={
                {
                  padding: 24,
                  '--card-accent': '#ef4444',
                  '--card-accent-glow': 'rgba(239,68,68,0.25)',
                  '--card-accent-border': 'rgba(239,68,68,0.5)',
                } as React.CSSProperties
              }
            >
              <div>
                <div
                  className="tech-feature-icon"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: 'rgba(239,68,68,0.12)',
                    border: '1px solid rgba(239,68,68,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ef4444',
                    marginBottom: 16,
                  }}
                >
                  <AlertTriangle size={20} />
                </div>
                <h3 className="font-display" style={{ fontSize: 17, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
                  Dynamic Skill Gap Analysis
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
                  <strong style={{ color: '#f8fafc' }}>WHAT:</strong> Compares student skills against target enterprise benchmarks.<br />
                  <strong style={{ color: '#f8fafc' }}>WHY:</strong> Gives learners concrete clarity on what to study rather than generic advice.<br />
                  <strong style={{ color: '#f8fafc' }}>HOW:</strong> Generates priority-tagged deficiencies and phase-by-phase timeline roadmaps.
                </p>
              </div>
              <Link href="/student" className="tech-feature-link" style={{ fontSize: 12.5, fontWeight: 700, color: '#ef4444', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                View Gap Roadmap <ChevronRight size={14} className="tech-feature-arrow" />
              </Link>
            </div>

            {/* Feature 4: Cryptographic Passport */}
            <div
              className="tech-feature-card card-shine"
              style={
                {
                  padding: 24,
                  '--card-accent': '#10b981',
                  '--card-accent-glow': 'rgba(16,185,129,0.25)',
                  '--card-accent-border': 'rgba(16,185,129,0.5)',
                } as React.CSSProperties
              }
            >
              <div>
                <div
                  className="tech-feature-icon"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: 'rgba(16,185,129,0.12)',
                    border: '1px solid rgba(16,185,129,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#10b981',
                    marginBottom: 16,
                  }}
                >
                  <Award size={20} />
                </div>
                <h3 className="font-display" style={{ fontSize: 17, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
                  Verifiable Skill Passport
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
                  <strong style={{ color: '#f8fafc' }}>WHAT:</strong> A tamper-proof digital credential issued with a cryptographic hash.<br />
                  <strong style={{ color: '#f8fafc' }}>WHY:</strong> Employers can verify skills in seconds without relying on self-reported resumes.<br />
                  <strong style={{ color: '#f8fafc' }}>HOW:</strong> SHA-256 HMAC digest computed over student scores and NSQF certification tier.
                </p>
              </div>
              <Link href="/student/passport" className="tech-feature-link" style={{ fontSize: 12.5, fontWeight: 700, color: '#10b981', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                Inspect Passport <ChevronRight size={14} className="tech-feature-arrow" />
              </Link>
            </div>

            {/* Feature 5: Adaptive Assessments */}
            <div
              className="tech-feature-card card-shine"
              style={
                {
                  padding: 24,
                  '--card-accent': 'var(--gold)',
                  '--card-accent-glow': 'rgba(245,158,11,0.25)',
                  '--card-accent-border': 'rgba(245,158,11,0.5)',
                } as React.CSSProperties
              }
            >
              <div>
                <div
                  className="tech-feature-icon"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: 'rgba(245,158,11,0.12)',
                    border: '1px solid rgba(245,158,11,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold)',
                    marginBottom: 16,
                  }}
                >
                  <CheckCircle2 size={20} />
                </div>
                <h3 className="font-display" style={{ fontSize: 17, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
                  Adaptive Assessment Engine
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
                  <strong style={{ color: '#f8fafc' }}>WHAT:</strong> Distraction-free diagnostic quizzes with keyboard navigation (A, B, C, D).<br />
                  <strong style={{ color: '#f8fafc' }}>WHY:</strong> Continuously validates real practical mastery across multiple difficulty tiers.<br />
                  <strong style={{ color: '#f8fafc' }}>HOW:</strong> Dynamic question synthesis, automated grading, and instant passport ledger sync.
                </p>
              </div>
              <Link href="/student/assessment" className="tech-feature-link" style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--gold)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                Take Diagnostic Quiz <ChevronRight size={14} className="tech-feature-arrow" />
              </Link>
            </div>

            {/* Feature 6: Real-Time Copilot */}
            <div
              className="tech-feature-card card-shine"
              style={
                {
                  padding: 24,
                  '--card-accent': '#c084fc',
                  '--card-accent-glow': 'rgba(192,132,252,0.25)',
                  '--card-accent-border': 'rgba(192,132,252,0.5)',
                } as React.CSSProperties
              }
            >
              <div>
                <div
                  className="tech-feature-icon"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: 'rgba(168,85,247,0.12)',
                    border: '1px solid rgba(168,85,247,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#c084fc',
                    marginBottom: 16,
                  }}
                >
                  <Bot size={20} />
                </div>
                <h3 className="font-display" style={{ fontSize: 17, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
                  Profile-Aware AI Copilot
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
                  <strong style={{ color: '#f8fafc' }}>WHAT:</strong> Conversational mentor embedded natively into the student dashboard.<br />
                  <strong style={{ color: '#f8fafc' }}>WHY:</strong> Answers personalized questions about interview prep, salary, and gap closure.<br />
                  <strong style={{ color: '#f8fafc' }}>HOW:</strong> Injects live student NSQF competencies into prompts with SSE typewriter streaming.
                </p>
              </div>
              <Link href="/student" className="tech-feature-link" style={{ fontSize: 12.5, fontWeight: 700, color: '#c084fc', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                Chat with Copilot <ChevronRight size={14} className="tech-feature-arrow" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Interactive Platform Showcase ── */}
      <section id="showcase" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <AIBadge type="live" label="INTERACTIVE DEMONSTRATION" />
            <h2 className="font-display" style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 800, color: '#f8fafc', margin: '8px 0 10px' }}>
              Explore the Platform in Action
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14.5 }}>
              Click between platform modules to explore the product flow. All figures in this showcase are illustrative sample data — not a live account.
            </p>
          </div>

          {/* Showcase Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
            {[
              { key: 'dashboard', label: 'Intelligence Cockpit' },
              { key: 'analyzer', label: 'AI Skill Analyzer' },
              { key: 'gaps', label: 'Skill Gap Roadmap' },
              { key: 'career', label: 'Career Matching' },
              { key: 'copilot', label: 'AI Copilot' },
              { key: 'passport', label: 'Skill Passport' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveShowcaseTab(tab.key as any)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: activeShowcaseTab === tab.key ? 700 : 500,
                  background: activeShowcaseTab === tab.key ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${activeShowcaseTab === tab.key ? 'var(--gold)' : 'var(--border)'}`,
                  color: activeShowcaseTab === tab.key ? 'var(--gold)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Interactive Screen Display */}
          <div className="card-accent" style={{ padding: 26, borderRadius: 16 }}>
            {activeShowcaseTab === 'dashboard' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <h4 className="font-display" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                    Candidate Intelligence Cockpit · NSQF Level 5
                  </h4>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                  <div style={{ padding: 14, background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Readiness Index</div>
                    <div className="font-display" style={{ fontSize: 22, fontWeight: 900, color: 'var(--gold)' }}>84/100</div>
                  </div>
                  <div style={{ padding: 14, background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Top Career Path</div>
                    <div className="font-display" style={{ fontSize: 16, fontWeight: 800, color: '#10b981' }}>Full-Stack Engineer (92%)</div>
                  </div>
                  <div style={{ padding: 14, background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Verified Ledgers</div>
                    <div className="font-display" style={{ fontSize: 22, fontWeight: 900, color: '#60a5fa' }}>6 Domains</div>
                  </div>
                </div>
              </div>
            )}

            {activeShowcaseTab === 'analyzer' && (
              <div>
                <h4 className="font-display" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', marginBottom: 12 }}>
                  Neural Competency Extraction Breakdown
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { name: 'TypeScript & Modern React', score: 92, cat: 'Technical' },
                    { name: 'Node.js & Express REST APIs', score: 85, cat: 'Technical' },
                    { name: 'Database Architecture & SQL', score: 78, cat: 'Domain' },
                    { name: 'System Design & Scalability', score: 65, cat: 'Architectural' },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: 10, background: 'rgba(255,255,255,0.02)', borderRadius: 6 }}>
                      <span style={{ fontSize: 13, color: '#f8fafc' }}>{s.name} ({s.cat})</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--gold)' }}>{s.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeShowcaseTab === 'gaps' && (
              <div>
                <h4 className="font-display" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', marginBottom: 10 }}>
                  Personalized Gap Roadmap: Full-Stack Engineer
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ padding: 12, background: 'rgba(239,68,68,0.05)', borderRadius: 8, borderLeft: '3px solid #ef4444' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>High Priority: Distributed System Caching</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Current: 60% → Target: 85% · Action: Implement Redis caching layer with pub/sub</div>
                  </div>
                  <div style={{ padding: 12, background: 'rgba(245,158,11,0.05)', borderRadius: 8, borderLeft: '3px solid var(--gold)' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>Medium Priority: Cloud Containerization</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Current: 55% → Target: 80% · Action: Configure automated GitHub Actions CI/CD to AWS</div>
                  </div>
                </div>
              </div>
            )}

            {activeShowcaseTab === 'career' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                <div style={{ padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, color: '#f8fafc' }}>Full-Stack Software Engineer</span>
                    <span style={{ fontWeight: 800, color: 'var(--gold)' }}>92% Match</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#10b981', marginTop: 4 }}>₹7.5L – ₹15L/yr (Model Estimate)</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 8 }}>Timeline: 2-3 months to complete recommended milestones.</div>
                </div>
                <div style={{ padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, color: '#f8fafc' }}>Cloud Solutions Architect</span>
                    <span style={{ fontWeight: 800, color: '#60a5fa' }}>85% Match</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#10b981', marginTop: 4 }}>₹9L – ₹18L/yr (Model Estimate)</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 8 }}>Timeline: 3-5 months with Terraform & AWS certification.</div>
                </div>
              </div>
            )}

            {activeShowcaseTab === 'copilot' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ padding: '10px 14px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', borderRadius: '10px 10px 2px 10px', color: '#090a0f', fontWeight: 600, fontSize: 13, alignSelf: 'flex-end', maxWidth: '80%' }}>
                  What skills should I focus on to become job-ready for full-stack engineering?
                </div>
                <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px 10px 10px 2px', border: '1px solid var(--border)', fontSize: 13, color: '#cbd5e1', lineHeight: 1.5, maxWidth: '85%' }}>
                  Based on your assessed profile (NSQF Level 5, score 84/100), your primary strength is TypeScript & API routing. Focus on closing your <strong>Distributed System Design</strong> gap (+15%) by building a microservices project with Redis caching.
                </div>
              </div>
            )}

            {activeShowcaseTab === 'passport' && (
              <div style={{ padding: 16, background: 'var(--bg-surface-elevated)', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Candidate: Arjun Mehta (SKP-7819)</span>
                  <AIBadge type="verified" label="VERIFIED" />
                </div>
                <div className="font-mono" style={{ fontSize: 11, color: 'var(--text-secondary)', wordBreak: 'break-all', background: 'rgba(255,255,255,0.03)', padding: 8, borderRadius: 6 }}>
                  SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 7. How It Works (4 Clean Steps) ── */}
      <section id="how-it-works" style={{ padding: '80px 24px', background: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <AIBadge type="nsqf" label="SIMPLE 4-STEP WORKFLOW" />
            <h2 className="font-display" style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 800, color: '#f8fafc', margin: '8px 0 10px' }}>
              How SkillSense Works
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
              From initial profile ingestion to cryptographic passport verification.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
            {[
              {
                num: '01',
                title: 'Submit Profile & Code',
                desc: 'Paste your resume, link a public GitHub repository, or describe technical project architecture.',
                icon: FileText,
                accent: '#f59e0b',
                phase: 'PHASE 01 · INGESTION',
                specs: [
                  'Multi-format PDF/Word OCR Parsing',
                  'GitHub API AST Abstract Syntax Tree',
                  'DPDP Sovereign Consent Encryption',
                ],
                metric: 'Latency: <800ms · 99.4% Parsing Accuracy',
              },
              {
                num: '02',
                title: 'Multi-Vector AI Extraction',
                desc: 'Neural models extract competencies across 50+ technical, architectural, and soft skill vectors.',
                icon: Brain,
                accent: '#60a5fa',
                phase: 'PHASE 02 · NEURAL EXTRACTION',
                specs: [
                  '50+ Dimension Competency Embeddings',
                  'NSQF Level 4-7 Taxonomy Mapping',
                  'Multi-Provider LLM Consensus Verification',
                ],
                metric: 'Zero-Hallucination Safe Zod Schemas',
              },
              {
                num: '03',
                title: 'Identify Gaps & Milestones',
                desc: 'Instant gap analysis benchmarks your capabilities against top tech employers in India.',
                icon: Layers,
                accent: '#f59e0b',
                phase: 'PHASE 03 · GAP BENCHMARK',
                specs: [
                  'Real-Time Enterprise Requisition Match',
                  'Severity-Weighted Shortage Matrix',
                  'Milestone-by-Milestone Timeline Roadmap',
                ],
                metric: 'Live Market Grounding via Perplexity Sonar',
              },
              {
                num: '04',
                title: 'Issue Verifiable Passport',
                desc: 'Receive a cryptographically signed digital credential to share with employers and recruiters.',
                icon: ShieldCheck,
                accent: '#10b981',
                phase: 'PHASE 04 · CREDENTIAL MINT',
                specs: [
                  'SHA-256 HMAC Immutable Ledger Signature',
                  '1-Click Instant Recruiter Verification QR',
                  'Sovereign Candidate Credential Revocation',
                ],
                metric: 'Govt & Enterprise Interoperable Record',
              },
            ].map((step, i) => {
              const IconComp = step.icon;
              return (
                <div key={i} className="flip-card-container">
                  <div className="flip-card-inner">
                    {/* ── Front Side ── */}
                    <div className="flip-card-front card-shine">
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                          <span className="font-display text-gradient-gold" style={{ fontSize: 30, fontWeight: 900 }}>
                            {step.num}
                          </span>
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 10,
                              background: 'rgba(255,255,255,0.03)',
                              border: `1px solid ${step.accent}40`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: step.accent,
                            }}
                          >
                            <IconComp size={18} />
                          </div>
                        </div>

                        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', margin: '0 0 8px' }}>
                          {step.title}
                        </h3>
                        <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                          {step.desc}
                        </p>
                      </div>

                      {/* Front footer hint */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          paddingTop: 12,
                          borderTop: '1px solid rgba(255,255,255,0.06)',
                          color: 'var(--gold)',
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        <span style={{ fontSize: 13 }}>↻</span>
                        <span>Hover to flip specifications</span>
                      </div>
                    </div>

                    {/* ── Back Side (Revealed on 3D Flip) ── */}
                    <div className="flip-card-back">
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                          <span style={{ fontSize: 10, fontWeight: 800, color: step.accent, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                            {step.phase}
                          </span>
                          <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(16,185,129,0.15)', color: '#10b981', fontWeight: 800, border: '1px solid rgba(16,185,129,0.3)' }}>
                            ACTIVE
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '8px 0' }}>
                          {step.specs.map((spec, sIdx) => (
                            <div key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: '#f1f5f9' }}>
                              <span style={{ color: step.accent, fontSize: 12 }}>▹</span>
                              <span>{spec}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: 10.5, color: 'var(--text-muted)' }}>
                        ✓ {step.metric}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 7B. Live Regional Workforce Telemetry Sandbox ── */}
      <DistrictTelemetrySandbox />

      {/* ── 8. Role-Based Features Matrix & Capabilities Deep-Dive ── */}
      <section id="roles" style={{ padding: '90px 24px', position: 'relative' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <AIBadge type="live" label="ROLE-BASED WORKSPACES" />
              <AIBadge type="nsqf" label="6 STAKEHOLDER PORTALS" />
            </div>
            <h2
              className="font-display"
              style={{
                fontSize: 'clamp(26px, 3.6vw, 42px)',
                fontWeight: 900,
                color: '#f8fafc',
                letterSpacing: '-0.03em',
                margin: '0 auto 14px',
                maxWidth: 860,
              }}
            >
              Tailored Workspaces for Every{' '}
              <span className="text-gradient-gold">Registered Stakeholder</span>
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: 'clamp(14px, 1.6vw, 16px)',
                maxWidth: 720,
                margin: '0 auto',
                lineHeight: 1.6,
              }}
            >
              Every role receives a dedicated, proctored command center equipped with specialized neural diagnostics, cryptographic ledgers, and automated workflows.
            </p>
          </div>

          {/* Role Tab Navigation Pills */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 8,
              flexWrap: 'wrap',
              marginBottom: 32,
            }}
          >
            {[
              { id: 'student', name: '🎓 Student / Trainee', color: '#10B981' },
              { id: 'employer', name: '💼 Hiring Employer', color: '#C084FC' },
              { id: 'institute', name: '🏛️ Training Institute', color: '#60A5FA' },
              { id: 'government', name: '🌐 State Government', color: '#F59E0B' },
              { id: 'industry', name: '🏭 Sector Council (SSC)', color: '#EC4899' },
              { id: 'admin', name: '⚙️ Platform Admin', color: '#94A3B8' },
            ].map((tab) => {
              const isActive = activeRoleTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveRoleTab(tab.id as any)}
                  style={{
                    padding: '9px 18px',
                    borderRadius: 99,
                    fontSize: 13,
                    fontWeight: 700,
                    background: isActive ? 'var(--gold)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isActive ? 'var(--gold)' : 'var(--border)'}`,
                    color: isActive ? '#090a0f' : '#cbd5e1',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isActive ? '0 4px 18px rgba(245,158,11,0.25)' : 'none',
                  }}
                >
                  {tab.name}
                </button>
              );
            })}
          </div>

          {/* Active Role Card Feature Grid */}
          <div className="card-accent" style={{ padding: 32, borderRadius: 20 }}>
            {activeRoleTab === 'student' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'center', marginBottom: 28, borderBottom: '1px solid var(--border)', paddingBottom: 24 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Registered Candidate Workspace
                    </span>
                    <h3 className="font-display" style={{ fontSize: 24, fontWeight: 900, color: '#f8fafc', margin: '4px 0 6px' }}>
                      Student & Vocational Trainee Cockpit
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, margin: '0 0 18px', maxWidth: 560, lineHeight: 1.6 }}>
                      Empowering learners with AI skill auditing, timed NSQF diagnostic quizzes, tamper-proof passports, and personalized wage progression trajectories.
                    </p>
                    <Link
                      href="/student"
                      className="btn-gold"
                      style={{ fontSize: 13, padding: '10px 22px', display: 'inline-flex', alignItems: 'center', gap: 8 }}
                    >
                      <span>Launch Student Cockpit</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>

                  <div style={{ maxWidth: 420, justifySelf: 'end', width: '100%' }}>
                    <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(16,185,129,0.3)', boxShadow: '0 12px 32px -8px rgba(0,0,0,0.6)' }}>
                      <ResponsiveImage
                        src="/images/stakeholders/student-career.jpg"
                        alt="Young Indian students learning software engineering and cloud diagnostics in a Pune technical institute computer lab"
                        aspectRatio="16 / 9"
                        borderRadius={12}
                        overlayGradient="subtle"
                      />
                      <div style={{ position: 'absolute', bottom: 8, left: 10, right: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
                        <span style={{ fontSize: 10.5, fontWeight: 800, color: '#f8fafc', background: 'rgba(11,15,23,0.85)', padding: '3px 8px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }}>
                          Pune Tech Trainee Lab · NSQF Level 5/6
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  {[
                    { title: 'Multi-Modal Code & GitHub Analyzer', desc: 'Scan live GitHub repos, paste source code, or upload resumes for 6-axis NSQF radar evaluation.', href: '/student/analyzer', icon: Code, badge: 'Neural AI' },
                    { title: 'AI Diagnostic Timed Quizzes', desc: 'Proctored evaluations across 8 technical domains with instant concept explanations and score seals.', href: '/student/assessment', icon: Zap, badge: 'Proctored' },
                    { title: 'Cryptographic Skill Passport', desc: 'Tamper-proof digital credentials backed by SHA-256 ledger signatures and public QR validation.', href: '/student/passport', icon: ShieldCheck, badge: 'SHA-256' },
                    { title: 'Predictive Career & Wage Roadmap', desc: 'Forecast 3-year salary growth curve (₹7.8L → ₹18.0L) and discover target skill gap bridges.', href: '/student/career', icon: TrendingUp, badge: 'Predictive' },
                    { title: 'Longitudinal Outcome Journey', desc: 'Log verified milestones from enrollment to campus hiring, 30d/90d retention, and promotions.', href: '/student/journey', icon: Milestone, badge: 'Tracking' },
                    { title: 'DPDP Act 2023 Consent Center', desc: 'Sovereign control to toggle specific data processing purposes and export private data in JSON.', href: '/student/consent', icon: Lock, badge: 'DPDP Compliant' },
                  ].map((feat, idx) => {
                    const Icon = feat.icon;
                    return (
                      <Link
                        key={idx}
                        href={feat.href}
                        style={{
                          padding: 18,
                          borderRadius: 14,
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid var(--border)',
                          textDecoration: 'none',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--gold)';
                          e.currentTarget.style.background = 'rgba(245,158,11,0.03)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border)';
                          e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <div style={{ padding: 8, borderRadius: 8, background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
                              <Icon size={18} />
                            </div>
                            <span style={{ fontSize: 10.5, fontWeight: 800, padding: '2px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', color: 'var(--gold)' }}>
                              {feat.badge}
                            </span>
                          </div>
                          <h4 style={{ fontSize: 14.5, fontWeight: 800, color: '#f8fafc', margin: '0 0 6px' }}>{feat.title}</h4>
                          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{feat.desc}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--gold)', marginTop: 14 }}>
                          <span>Access Feature</span>
                          <ChevronRight size={13} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {activeRoleTab === 'employer' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'center', marginBottom: 28, borderBottom: '1px solid var(--border)', paddingBottom: 24 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#C084FC', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Enterprise Recruiter Workspace
                    </span>
                    <h3 className="font-display" style={{ fontSize: 24, fontWeight: 900, color: '#f8fafc', margin: '4px 0 6px' }}>
                      Hiring Employer & Talent Validation Suite
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, margin: '0 0 18px', maxWidth: 560, lineHeight: 1.6 }}>
                      Streamline hiring with instant cryptographic credential verification, pre-assessed candidate talent pools, and automated 30d/90d retention telemetry.
                    </p>
                    <Link
                      href="/employer"
                      className="btn-gold"
                      style={{ fontSize: 13, padding: '10px 22px', display: 'inline-flex', alignItems: 'center', gap: 8 }}
                    >
                      <span>Launch Employer Suite</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>

                  <div style={{ maxWidth: 420, justifySelf: 'end', width: '100%' }}>
                    <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(192,132,252,0.3)', boxShadow: '0 12px 32px -8px rgba(0,0,0,0.6)' }}>
                      <ResponsiveImage
                        src="/images/stakeholders/employer-workforce.jpg"
                        alt="Indian engineering leads and recruiters reviewing talent metrics in an industrial tech facility"
                        aspectRatio="16 / 9"
                        borderRadius={12}
                        overlayGradient="subtle"
                      />
                      <div style={{ position: 'absolute', bottom: 8, left: 10, right: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
                        <span style={{ fontSize: 10.5, fontWeight: 800, color: '#f8fafc', background: 'rgba(11,15,23,0.85)', padding: '3px 8px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }}>
                          Udyog Enterprise Facility · Talent Telemetry
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  {[
                    { title: '1-Click SHA-256 Hash Verification', desc: 'Instantly validate candidate passport authenticity directly against the state ledger to eliminate resume fraud.', href: '/employer/validations', icon: ShieldCheck, badge: 'Anti-Fraud' },
                    { title: 'Pre-Assessed Candidate Search', desc: 'Filter verified talent by NSQF certification tier, technical score percentiles, and regional district availability.', href: '/employer/candidates', icon: Users, badge: 'Verified Pool' },
                    { title: 'Direct Job Postings & Hiring Drives', desc: 'Publish open tech requisitions with automated skill match scoring against registered state candidates.', href: '/employer/post-job', icon: Briefcase, badge: 'Fast Track' },
                    { title: 'Retention & Verification Ledger', desc: 'Confirm employee onboarding and 90-day retention to earn enterprise compliance badges and government incentives.', href: '/employer/validations', icon: Award, badge: 'Retention' },
                  ].map((feat, idx) => {
                    const Icon = feat.icon;
                    return (
                      <Link
                        key={idx}
                        href={feat.href}
                        style={{
                          padding: 18,
                          borderRadius: 14,
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid var(--border)',
                          textDecoration: 'none',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <div style={{ padding: 8, borderRadius: 8, background: 'rgba(192,132,252,0.12)', color: '#C084FC' }}>
                              <Icon size={18} />
                            </div>
                            <span style={{ fontSize: 10.5, fontWeight: 800, padding: '2px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', color: 'var(--gold)' }}>
                              {feat.badge}
                            </span>
                          </div>
                          <h4 style={{ fontSize: 14.5, fontWeight: 800, color: '#f8fafc', margin: '0 0 6px' }}>{feat.title}</h4>
                          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{feat.desc}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--gold)', marginTop: 14 }}>
                          <span>Access Feature</span>
                          <ChevronRight size={13} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {activeRoleTab === 'institute' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'center', marginBottom: 28, borderBottom: '1px solid var(--border)', paddingBottom: 24 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Vocational Training Partner Workspace
                    </span>
                    <h3 className="font-display" style={{ fontSize: 24, fontWeight: 900, color: '#f8fafc', margin: '4px 0 6px' }}>
                      Training Institute & ITI Performance Portal
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, margin: '0 0 18px', maxWidth: 560, lineHeight: 1.6 }}>
                      Monitor cohort skill mastery, pinpoint curriculum deficiencies vs industry demand, and track longitudinal graduate placement outcomes.
                    </p>
                    <Link
                      href="/institute"
                      className="btn-gold"
                      style={{ fontSize: 13, padding: '10px 22px', display: 'inline-flex', alignItems: 'center', gap: 8 }}
                    >
                      <span>Launch Institute Portal</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>

                  <div style={{ maxWidth: 420, justifySelf: 'end', width: '100%' }}>
                    <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(96,165,250,0.3)', boxShadow: '0 12px 32px -8px rgba(0,0,0,0.6)' }}>
                      <ResponsiveImage
                        src="/images/stakeholders/vocational-training.jpg"
                        alt="Indian technical instructor guiding students on precision electronics and robotics at ITI Maharashtra vocational center"
                        aspectRatio="16 / 9"
                        borderRadius={12}
                        overlayGradient="subtle"
                      />
                      <div style={{ position: 'absolute', bottom: 8, left: 10, right: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
                        <span style={{ fontSize: 10.5, fontWeight: 800, color: '#f8fafc', background: 'rgba(11,15,23,0.85)', padding: '3px 8px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }}>
                          ITI Maharashtra · Vocational Workshop
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  {[
                    { title: 'Batch Competency Matrix', desc: 'Real-time telemetry on student test participation, average NSQF tier attainments, and pass percentages.', href: '/institute/cohorts', icon: Layers, badge: 'Real-Time' },
                    { title: 'Curriculum Skill Gap Auditing', desc: 'Identify which modules (e.g. Next.js vs Docker vs Microservices) lag behind current enterprise hiring requirements.', href: '/institute/curriculum', icon: Target, badge: 'Optimization' },
                    { title: 'Graduate Placement Ledger', desc: 'Track verified job placements, average starting packages (LPA), and long-term 365-day retention metrics.', href: '/institute/analytics', icon: TrendingUp, badge: 'ROI Auditing' },
                    { title: 'Automated Credential Minting', desc: 'Issue cryptographically signed NSQF course completion certificates linked to the state skill registry.', href: '/institute/credentials', icon: FileCheck, badge: 'Ledger Signed' },
                  ].map((feat, idx) => {
                    const Icon = feat.icon;
                    return (
                      <Link
                        key={idx}
                        href={feat.href}
                        style={{
                          padding: 18,
                          borderRadius: 14,
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid var(--border)',
                          textDecoration: 'none',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <div style={{ padding: 8, borderRadius: 8, background: 'rgba(96,165,250,0.12)', color: '#60A5FA' }}>
                              <Icon size={18} />
                            </div>
                            <span style={{ fontSize: 10.5, fontWeight: 800, padding: '2px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', color: 'var(--gold)' }}>
                              {feat.badge}
                            </span>
                          </div>
                          <h4 style={{ fontSize: 14.5, fontWeight: 800, color: '#f8fafc', margin: '0 0 6px' }}>{feat.title}</h4>
                          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{feat.desc}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--gold)', marginTop: 14 }}>
                          <span>Access Feature</span>
                          <ChevronRight size={13} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {activeRoleTab === 'government' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'center', marginBottom: 28, borderBottom: '1px solid var(--border)', paddingBottom: 24 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      State Policy & Governance Workspace
                    </span>
                    <h3 className="font-display" style={{ fontSize: 24, fontWeight: 900, color: '#f8fafc', margin: '4px 0 6px' }}>
                      Government of Maharashtra · Skilling Intelligence Cockpit
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, margin: '0 0 18px', maxWidth: 560, lineHeight: 1.6 }}>
                      Macro workforce analytics, 9-stage longitudinal outcome pipelines, grounded AI policy copilots, and district-level economic ROI monitoring.
                    </p>
                    <Link
                      href="/government"
                      className="btn-gold"
                      style={{ fontSize: 13, padding: '10px 22px', display: 'inline-flex', alignItems: 'center', gap: 8 }}
                    >
                      <span>Launch Government Cockpit</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>

                  <div style={{ maxWidth: 420, justifySelf: 'end', width: '100%' }}>
                    <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(245,158,11,0.3)', boxShadow: '0 12px 32px -8px rgba(0,0,0,0.6)' }}>
                      <ResponsiveImage
                        src="/images/stakeholders/government-policy.jpg"
                        alt="Government officials and policy analysts in a state conference room reviewing Maharashtra workforce intelligence"
                        aspectRatio="16 / 9"
                        borderRadius={12}
                        overlayGradient="subtle"
                      />
                      <div style={{ position: 'absolute', bottom: 8, left: 10, right: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
                        <span style={{ fontSize: 10.5, fontWeight: 800, color: '#f8fafc', background: 'rgba(11,15,23,0.85)', padding: '3px 8px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }}>
                          Maharashtra Skilling Directorate · Policy Analytics
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  {[
                    { title: '9-Stage Conversion Pipeline', desc: 'Track student conversion from Enrolled to Certified, Placed, 30d, 90d, 180d, and 365d Long-term Retention.', href: '/government', icon: Layers, badge: 'Longitudinal' },
                    { title: 'Grounded AI Policy Copilot', desc: 'Query natural language policy recommendations backed by real-time district evidence and budget metrics.', href: '/government', icon: Bot, badge: 'AI Copilot' },
                    { title: 'District Drill-Down Intelligence', desc: 'Compare employment metrics across all 36 Maharashtra districts (Pune, Mumbai, Nagpur, Nashik, etc.).', href: '/government', icon: Landmark, badge: '36 Districts' },
                    { title: 'Macro Wage Progression Curves', desc: 'Monitor wage growth trajectories from ₹26k baseline to ₹49k/mo at Month 24 to optimize funding allocations.', href: '/government', icon: TrendingUp, badge: 'Wage Growth' },
                  ].map((feat, idx) => {
                    const Icon = feat.icon;
                    return (
                      <Link
                        key={idx}
                        href={feat.href}
                        style={{
                          padding: 18,
                          borderRadius: 14,
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid var(--border)',
                          textDecoration: 'none',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <div style={{ padding: 8, borderRadius: 8, background: 'rgba(245,158,11,0.12)', color: '#F59E0B' }}>
                              <Icon size={18} />
                            </div>
                            <span style={{ fontSize: 10.5, fontWeight: 800, padding: '2px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', color: 'var(--gold)' }}>
                              {feat.badge}
                            </span>
                          </div>
                          <h4 style={{ fontSize: 14.5, fontWeight: 800, color: '#f8fafc', margin: '0 0 6px' }}>{feat.title}</h4>
                          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{feat.desc}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--gold)', marginTop: 14 }}>
                          <span>Access Feature</span>
                          <ChevronRight size={13} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {activeRoleTab === 'industry' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 20 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#EC4899', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Sector Skill Council (SSC) Workspace
                    </span>
                    <h3 className="font-display" style={{ fontSize: 24, fontWeight: 900, color: '#f8fafc', margin: '4px 0 6px' }}>
                      Industry & Sector Skill Demand Intelligence
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, margin: 0, maxWidth: 640 }}>
                      Calibrate National Occupational Standards (NOS), forecast emerging tech surges (GenAI, Cloud), and map talent availability heatmaps.
                    </p>
                  </div>
                  <Link
                    href="/industry"
                    className="btn-gold"
                    style={{ fontSize: 13, padding: '10px 22px', display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <span>Launch Industry Suite</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  {[
                    { title: 'Skill Demand vs Supply Radar', desc: 'Detect real-time hiring demand spikes across Indian IT corridors vs active training batch supply.', href: '/industry/demand-matrix', icon: BarChart3, badge: 'Real-Time' },
                    { title: 'National Occupational Standards (NOS)', desc: 'Align qualification packs with modern industry workflows and micro-credential prerequisites.', href: '/industry/standards', icon: Target, badge: 'NOS Calibrated' },
                    { title: 'Regional Talent Heatmaps', desc: 'Identify surplus vs deficit technical skill regions across Maharashtra to guide corporate CSR & hiring.', href: '/industry/heatmaps', icon: Landmark, badge: 'Geo Spatial' },
                  ].map((feat, idx) => {
                    const Icon = feat.icon;
                    return (
                      <Link
                        key={idx}
                        href={feat.href}
                        style={{
                          padding: 18,
                          borderRadius: 14,
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid var(--border)',
                          textDecoration: 'none',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <div style={{ padding: 8, borderRadius: 8, background: 'rgba(236,72,153,0.12)', color: '#EC4899' }}>
                              <Icon size={18} />
                            </div>
                            <span style={{ fontSize: 10.5, fontWeight: 800, padding: '2px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', color: 'var(--gold)' }}>
                              {feat.badge}
                            </span>
                          </div>
                          <h4 style={{ fontSize: 14.5, fontWeight: 800, color: '#f8fafc', margin: '0 0 6px' }}>{feat.title}</h4>
                          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{feat.desc}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--gold)', marginTop: 14 }}>
                          <span>Access Feature</span>
                          <ChevronRight size={13} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {activeRoleTab === 'admin' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 20 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      System Governance & Audit Workspace
                    </span>
                    <h3 className="font-display" style={{ fontSize: 24, fontWeight: 900, color: '#f8fafc', margin: '4px 0 6px' }}>
                      Platform Administrator & Audit Center
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, margin: 0, maxWidth: 640 }}>
                      Manage decentralized ledger integrity, audit algorithmic fairness models, monitor LLM telemetry, and oversee DPDP compliance.
                    </p>
                  </div>
                  <Link
                    href="/admin"
                    className="btn-gold"
                    style={{ fontSize: 13, padding: '10px 22px', display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <span>Launch Admin Center</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                  {[
                    { title: 'Algorithmic Fairness & Bias Auditing', desc: 'Continuous demographic parity monitoring enforcing the 80% (4/5ths) rule across gender and rural cohorts.', href: '/admin/fairness', icon: ShieldCheck, badge: 'Fairness Engine' },
                    { title: 'Decentralized Ledger Audit Trail', desc: 'Inspect HMAC SHA-256 passport minting logs and external employer verification requests in real-time.', href: '/admin/ledger', icon: Database, badge: 'Immutable' },
                    { title: 'Role & User Access Control (RBAC)', desc: 'Manage permissions, API rate limit quotas, and enterprise partner verification credentials.', href: '/admin/users', icon: Users, badge: 'RBAC' },
                    { title: 'System Health & LLM Telemetry', desc: 'Real-time monitoring of inference latency, model fallback availability, and server cluster uptimes.', href: '/ai-health', icon: Zap, badge: 'Telemetry' },
                  ].map((feat, idx) => {
                    const Icon = feat.icon;
                    return (
                      <Link
                        key={idx}
                        href={feat.href}
                        style={{
                          padding: 18,
                          borderRadius: 14,
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid var(--border)',
                          textDecoration: 'none',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <div style={{ padding: 8, borderRadius: 8, background: 'rgba(148,163,184,0.12)', color: '#94A3B8' }}>
                              <Icon size={18} />
                            </div>
                            <span style={{ fontSize: 10.5, fontWeight: 800, padding: '2px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', color: 'var(--gold)' }}>
                              {feat.badge}
                            </span>
                          </div>
                          <h4 style={{ fontSize: 14.5, fontWeight: 800, color: '#f8fafc', margin: '0 0 6px' }}>{feat.title}</h4>
                          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{feat.desc}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--gold)', marginTop: 14 }}>
                          <span>Access Feature</span>
                          <ChevronRight size={13} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 8A. Sovereign Skill Passport Verification Showcase ── */}
      <SkillPassportShowcase />

      {/* ── 8B. National Skilling Telemetry & Macro Impact ── */}
      <section style={{ padding: '60px 24px', background: 'rgba(245,158,11,0.03)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, textAlign: 'center' }}>
            {[
              { label: 'Districts Monitored', target: 36, decimals: 0, prefix: '', suffix: ' Districts', sub: 'Across Maharashtra State', color: 'var(--gold)' },
              { label: 'Verified Skill Passports', target: 1240000, decimals: 0, prefix: '', suffix: '+', sub: 'Cryptographically Minted', color: '#10B981' },
              { label: 'Diagnostic Precision', target: 94.2, decimals: 1, prefix: '', suffix: '%', sub: 'NSQF Calibrated Neural Engine', color: '#60A5FA' },
              { label: 'Average Placed Salary', target: 7.80, decimals: 2, prefix: '₹', suffix: ' LPA', sub: '+38% Longitudinal Wage Boost', color: '#C084FC' },
            ].map((stat, idx) => (
              <div key={idx} className="telemetry-stat-card">
                <div className="font-display" style={{ fontSize: 34, fontWeight: 900, color: stat.color, letterSpacing: '-0.02em' }}>
                  <DynamicBidirectionalCounter
                    target={stat.target}
                    decimals={stat.decimals}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    duration={1500}
                  />
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc', marginTop: 6 }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8C. Frequently Asked Questions (FAQ) Section ── */}
      <section id="faq" style={{ padding: '80px 24px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <AIBadge type="verified" label="FREQUENTLY ASKED QUESTIONS" />
            <h2 className="font-display" style={{ fontSize: 'clamp(24px, 3.2vw, 36px)', fontWeight: 800, color: '#f8fafc', margin: '8px 0 10px' }}>
              Everything You Need to Know About <span style={{ color: 'var(--gold)' }}>SkillSense AI</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>
              Transparent answers regarding algorithmic scoring, NSQF mapping, cryptographic passports, and DPDP compliance.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              {
                q: 'How does SkillSense AI evaluate candidate competency without bias?',
                a: 'SkillSense utilizes a multi-modal analysis engine that evaluates source code architecture, test coverage, algorithmic efficiency, and timed diagnostic quizzes. All scoring models are continuously audited against disparate impact metrics enforcing the 80% rule across gender, institution, and geographical demographics.',
              },
              {
                q: 'What is a Cryptographic Skill Passport and how do recruiters verify it?',
                a: 'The Skill Passport is an immutable digital credential containing verified technical competency percentiles and NSQF certification tiers. Each credential is authenticated with a SHA-256 HMAC ledger signature. Employers can verify claims in one click by scanning the QR code or querying the public endpoint (/verify/:hash).',
              },
              {
                q: 'How does the platform align with National Skills Qualifications Framework (NSQF)?',
                a: 'Assessments and career pathways are directly calibrated against NSQF Levels 4 through 7. Each level establishes concrete proficiency thresholds for knowledge, core skills, autonomy, and vocational applicability recognized by the Ministry of Skill Development and Entrepreneurship (MSDE).',
              },
              {
                q: 'How is candidate privacy protected under the India DPDP Act 2023?',
                a: 'SkillSense implements sovereign consent governance. Candidates have granular control to grant or revoke specific processing purposes (e.g. longitudinal tracking vs wage benchmarking). All personal identifying information is masked in government macro views, and trainees can export or request deletion of their data under DPDP Article 12.',
              },
              {
                q: 'Can institutions and ITIs integrate their existing learning management systems?',
                a: 'Yes. SkillSense provides open REST APIs and batch CSV integration tools allowing vocational training providers to bulk enroll cohorts, synchronize exam results, and monitor longitudinal graduate retention without replacing existing LMS tools.',
              },
              {
                q: 'How does the Grounded AI Policy Copilot assist government officers?',
                a: 'The Policy Copilot interfaces directly with Maharashtra district outcome databases. When queried, it synthesizes empirical evidence on completion rates, drop-off barriers, and post-training wage growth to recommend targeted budget allocations and curriculum interventions.',
              },
            ].map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`faq-hover-card ${isOpen ? 'is-open' : ''}`}
                  onMouseEnter={() => setOpenFaq(idx)}
                  onMouseLeave={() => setOpenFaq(null)}
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                >
                  <div
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 12,
                      color: '#f8fafc',
                    }}
                  >
                    <span className="faq-question-text" style={{ fontSize: 14.5, fontWeight: 700 }}>
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={16}
                      color="var(--gold)"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        flexShrink: 0,
                      }}
                    />
                  </div>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -4 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -4 }}
                        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div
                          style={{
                            padding: '0 20px 16px',
                            fontSize: 13.5,
                            color: '#cbd5e1',
                            lineHeight: 1.6,
                            borderTop: '1px solid rgba(255,255,255,0.05)',
                            paddingTop: 12,
                          }}
                        >
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 9. Verifiable Skill Passport Feature Section ── */}

      <section id="passport" style={{ padding: '80px 24px', background: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div
            className="card-accent"
            style={{
              padding: 36,
              borderRadius: 18,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 30,
            }}
          >
            <div style={{ flex: 1, minWidth: 300, maxWidth: 560 }}>
              <AIBadge type="verified" label="TAMPER-PROOF CREDENTIAL" />
              <h2 className="font-display" style={{ fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 800, color: '#f8fafc', margin: '10px 0 12px' }}>
                The Official Cryptographic Skill Passport
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                Every verified competency score is sealed with an immutable SHA-256 HMAC digest and registered to the candidate's digital passport ledger. Recruiters can verify credential authenticity in a single click.
              </p>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link href="/student/passport" className="btn-gold" style={{ fontSize: 13, padding: '9px 20px' }}>
                  Explore Skill Passport
                </Link>
                <button
                  type="button"
                  onClick={handleCopyHash}
                  className="btn-secondary"
                  style={{ fontSize: 13, padding: '9px 18px' }}
                >
                  {copiedHash ? <Check size={14} /> : <Copy size={14} />} {copiedHash ? 'Hash Copied!' : 'Copy Sample Hash'}
                </button>
              </div>
            </div>

            {/* Passport Credential Seal Preview */}
            <div style={{ padding: 20, background: 'var(--bg-surface)', borderRadius: 14, border: '1px solid var(--border)', maxWidth: 420, width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 10, marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>Digital Passport #SKP-7819</div>
                <span style={{ fontSize: 10, color: '#10b981', fontWeight: 700 }}>✓ VERIFIED (DEMO SAMPLE)</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Candidate: Arjun Mehta (illustrative)</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>NSQF Tier: Level 5 (Advanced Diploma)</div>
              <div style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 700, marginBottom: 12 }}>Verified Score: 84/100 (sample)</div>
              <div className="font-mono" style={{ fontSize: 10, color: 'var(--text-muted)', wordBreak: 'break-all', background: 'rgba(255,255,255,0.03)', padding: 8, borderRadius: 6 }}>
                Sample SHA-256 for illustration — live passports mint a unique hash per student.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. Algorithmic Fairness & Trust Governance ── */}
      <section id="trust" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', textAlign: 'center' }}>
          <AIBadge type="verified" label="ALGORITHMIC GOVERNANCE" />
          <h2 className="font-display" style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: '#f8fafc', margin: '8px 0 12px' }}>
            Built on Rigorous Bias Monitoring & Ethical AI
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14.5, maxWidth: 640, margin: '0 auto 40px' }}>
            SkillSense includes an active fairness auditing engine that monitors demographic parity across gender, states, and institution types to ensure merit-based opportunities.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, textAlign: 'left' }}>
            <div className="card-linear" style={{ padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#10b981', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={16} /> Disparate Impact Auditing
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Enforces the 80% (4/5ths) rule on recommendation and evaluation algorithms to prevent systemic bias.
              </p>
            </div>

            <div className="card-linear" style={{ padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#60a5fa', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Lock size={16} /> Complete Secret Isolation
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                All LLM provider keys and HMAC signing secrets remain strictly on the server and are never exposed to clients.
              </p>
            </div>

            <div className="card-linear" style={{ padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Zap size={16} /> Explainable Competency Models
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Every score is backed by granular evidence snippets, model confidence metrics, and clear improvement plans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing Section ── */}
      <PricingSection />

      {/* ── 11. High-Conversion Final CTA ── */}
      <section style={{ padding: '80px 24px', background: 'radial-gradient(ellipse at 50% 50%, rgba(245, 158, 11, 0.1) 0%, transparent 70%)' }}>
        <div style={{ maxWidth: 840, margin: '0 auto', textAlign: 'center' }}>
          <h2 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 900, color: '#f8fafc', margin: '0 0 16px', lineHeight: 1.15 }}>
            Know your skills. Know your path.<br />
            <span className="text-gradient-gold">Build what the industry needs.</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, margin: '0 auto 32px', maxWidth: 540 }}>
            Join thousands of learners, educators, and enterprise employers across India leveraging verified skill intelligence.
          </p>

          <Link
            href="/student/analyzer"
            className="btn-gold"
            style={{ fontSize: 14.5, padding: '13px 36px', boxShadow: 'var(--shadow-sm)' }}
          >
            <BarChart3 size={16} /> Start Free Skill Analysis <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── 12. Enterprise Footer ── */}
      <footer style={{ padding: '50px 24px 30px', borderTop: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 30, marginBottom: 40 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, color: '#090a0f' }}>
                  SK
                </div>
                <span className="font-display" style={{ fontWeight: 800, fontSize: 15, color: '#f8fafc' }}>
                  SkillSense AI
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Next-generation workforce intelligence and skill assessment platform. Developed by Team Quantum Coders.
              </p>
            </div>

            <div>
              <h5 style={{ fontSize: 12.5, fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase', marginBottom: 12 }}>Product</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5 }}>
                <Link href="/student/analyzer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>AI Skill Analyzer</Link>
                <Link href="/student/career" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Career Predictor</Link>
                <Link href="/student/assessment" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Diagnostic Quizzes</Link>
                <Link href="/student/market" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Market Demand</Link>
              </div>
            </div>

            <div>
              <h5 style={{ fontSize: 12.5, fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase', marginBottom: 12 }}>Workspaces</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5 }}>
                <Link href="/student" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Student Cockpit</Link>
                <Link href="/institute" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Institute Portal</Link>
                <Link href="/industry" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Industry Talent Pool</Link>
                <Link href="/government" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Governance Center</Link>
              </div>
            </div>

            <div>
              <h5 style={{ fontSize: 12.5, fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase', marginBottom: 12 }}>Trust & Security</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5 }}>
                <Link href="/ai-health" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>AI Telemetry Status</Link>
                <Link href="/student/passport" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Passport Ledger</Link>
                <Link href="/admin/fairness" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Fairness Governance</Link>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 20, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
              © {new Date().getFullYear()} SkillSense AI · Team Quantum Coders. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 11.5, color: 'var(--text-muted)' }}>
              <span>MIT License</span>
              <span>NSQF Compliant</span>
              <span>SHA-256 Verified</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
