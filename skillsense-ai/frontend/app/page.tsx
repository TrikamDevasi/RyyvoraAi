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
  Settings,
  Search,
  Activity,
  Globe,
  Terminal,
  Menu,
  X,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      {/* ── 1. Institutional Enterprise Header & Navigation ── */}
      <header className={`landing-header-wrapper ${scrolled ? 'is-scrolled' : ''}`}>
        {/* Top Institutional Sovereignty & Telemetry Bar */}
        <div className="landing-top-bar">
          <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="landing-gov-badge">
                <Landmark size={11} /> Sovereign Workforce Intelligence
              </span>
              <span className="hidden sm:inline font-mono" style={{ fontSize: 11, color: '#94a3b8' }}>
                NSQF Level 4–8 Aligned · DPDP Act 2023 Compliant · Sovereign Data Architecture
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11 }} className="font-mono">
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                Ledger Live (99.98%)
              </span>
              <span style={{ color: 'rgba(255,255,255,0.15)' }} className="hidden sm:inline">|</span>
              <Link
                href="/verify/demo-hash"
                style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 700, fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                className="font-mono"
              >
                Public Ledger Verifier <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </div>

        {/* Main Glassmorphic Navigation Bar */}
        <div className="landing-header-glass">
          <div className="landing-navbar">
            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'var(--gold, #f59e0b)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: 14,
                  color: '#090a0f',
                  flexShrink: 0,
                  boxShadow: '0 0 16px rgba(245,158,11,0.25)',
                }}
              >
                RY
              </div>
              <div style={{ flexShrink: 0 }}>
                <span className="font-display" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', display: 'block', lineHeight: 1.1, whiteSpace: 'nowrap' }}>
                  Ryyvora <span style={{ color: 'var(--gold, #f59e0b)' }}>AI</span>
                </span>
                <span className="font-mono" style={{ fontSize: 8.5, color: 'var(--gold)', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap', display: 'block' }}>
                  Workforce Intelligence
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links with Dropdowns */}
            <div className="landing-nav-links">
              {/* Dropdown 1: Ecosystem Workspaces */}
              <div className="nav-item-dropdown">
                <button className="nav-link-pill" style={{ background: 'transparent', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  Workspaces <ChevronDown size={13} style={{ opacity: 0.7 }} />
                </button>
                <div className="nav-dropdown-menu">
                  <Link href="/student" className="nav-dropdown-item">
                    <div className="nav-dropdown-icon">
                      <GraduationCap size={15} />
                    </div>
                    <div>
                      <div className="nav-dropdown-title" style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>Student Cockpit</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>Portfolio, passport & milestone journey</div>
                    </div>
                  </Link>
                  <Link href="/institute" className="nav-dropdown-item">
                    <div className="nav-dropdown-icon">
                      <School size={15} />
                    </div>
                    <div>
                      <div className="nav-dropdown-title" style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>Institute Portal</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>Accreditation, cohort ROI & placement analytics</div>
                    </div>
                  </Link>
                  <Link href="/industry" className="nav-dropdown-item">
                    <div className="nav-dropdown-icon">
                      <Briefcase size={15} />
                    </div>
                    <div>
                      <div className="nav-dropdown-title" style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>Industry Talent Pool</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>Verified candidates with zero resume fraud</div>
                    </div>
                  </Link>
                  <Link href="/government" className="nav-dropdown-item">
                    <div className="nav-dropdown-icon">
                      <Landmark size={15} />
                    </div>
                    <div>
                      <div className="nav-dropdown-title" style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>Governance Center</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>District skill heatmaps & policy analytics</div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Dropdown 2: AI Engines */}
              <div className="nav-item-dropdown">
                <button className="nav-link-pill" style={{ background: 'transparent', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  AI Engines <ChevronDown size={13} style={{ opacity: 0.7 }} />
                </button>
                <div className="nav-dropdown-menu">
                  <Link href="/student/analyzer" className="nav-dropdown-item">
                    <div className="nav-dropdown-icon">
                      <Brain size={15} />
                    </div>
                    <div>
                      <div className="nav-dropdown-title" style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>AI Skill Analyzer</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>Multi-modal GitHub code & resume diagnostics</div>
                    </div>
                  </Link>
                  <Link href="/student/career" className="nav-dropdown-item">
                    <div className="nav-dropdown-icon">
                      <Compass size={15} />
                    </div>
                    <div>
                      <div className="nav-dropdown-title" style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>Career Predictor</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>Live INR compensation & market affinity</div>
                    </div>
                  </Link>
                  <Link href="/student/assessment" className="nav-dropdown-item">
                    <div className="nav-dropdown-icon">
                      <FileCheck size={15} />
                    </div>
                    <div>
                      <div className="nav-dropdown-title" style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>Diagnostic Quizzes</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>Adaptive NSQF-calibrated testing</div>
                    </div>
                  </Link>
                  <Link href="/student/market" className="nav-dropdown-item">
                    <div className="nav-dropdown-icon">
                      <BarChart3 size={15} />
                    </div>
                    <div>
                      <div className="nav-dropdown-title" style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>Market Demand Radar</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>Macro hiring trends & skill shortages</div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Direct Links */}
              <a href="#how-it-works" className="nav-link-pill" style={{ whiteSpace: 'nowrap' }}>How It Works</a>
              <a href="#passport" className="nav-link-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
                <span>Skill Passport</span>
                <span style={{ fontSize: 9.5, fontWeight: 700, padding: '1px 5px', borderRadius: 4, background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)', whiteSpace: 'nowrap' }}>
                  SHA-256
                </span>
              </a>
              <a href="#pricing" className="nav-link-pill" style={{ whiteSpace: 'nowrap' }}>Pricing</a>
              <a href="#faq" className="nav-link-pill" style={{ whiteSpace: 'nowrap' }}>FAQ</a>
              <a href="#trust" className="nav-link-pill" style={{ whiteSpace: 'nowrap' }}>DPDP Trust</a>
            </div>

            {/* Auth Actions, Fast Verifier & Theme Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {/* Quick Verifier Action (Desktop only) */}
              <Link href="/verify/demo-hash" className="nav-verify-btn" style={{ whiteSpace: 'nowrap' }}>
                <ShieldCheck size={14} /> Verify Hash
              </Link>

              <div style={{ minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ThemeToggle variant="icon" />
              </div>

              <Link
                href="/auth"
                className="btn-secondary landing-signin-btn"
                style={{ fontSize: 12.5, fontWeight: 600, padding: '6px 14px', borderRadius: 7, whiteSpace: 'nowrap' }}
              >
                Sign In
              </Link>

              <Link
                href="/student/analyzer"
                className="btn-gold landing-header-cta"
                style={{ fontSize: 12.5, fontWeight: 700, padding: '7px 16px', borderRadius: 7, display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
              >
                <BarChart3 size={13} /> Analyze Skills <ArrowRight size={13} />
              </Link>

              {/* Mobile Menu Hamburger Toggle (Minimum 44x44px touch target) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="landing-nav-mobile-btn"
                style={{
                  width: 44,
                  height: 44,
                  minWidth: 44,
                  minHeight: 44,
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f8fafc',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav-drawer"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <div id="mobile-nav-drawer" className="mobile-nav-drawer">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Group 1: Product */}
                <div>
                  <div className="mobile-nav-group-label">Product</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <a
                      href="#roles"
                      onClick={() => setMobileMenuOpen(false)}
                      className="mobile-nav-link-item"
                    >
                      <div className="mobile-nav-icon-box">
                        <Users size={15} />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>Role Features</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>Student, Institute, Industry & Govt portals</div>
                      </div>
                    </a>

                    <a
                      href="#features"
                      onClick={() => setMobileMenuOpen(false)}
                      className="mobile-nav-link-item"
                    >
                      <div className="mobile-nav-icon-box">
                        <Cpu size={15} />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>Core Capabilities</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>AI Analyzer, Career Match & Diagnostic Quizzes</div>
                      </div>
                    </a>

                    <a
                      href="#how-it-works"
                      onClick={() => setMobileMenuOpen(false)}
                      className="mobile-nav-link-item"
                    >
                      <div className="mobile-nav-icon-box">
                        <Layers size={15} />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>How It Works</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>7-Stage Longitudinal Workforce Journey</div>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Group 2: Resources */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14 }}>
                  <div className="mobile-nav-group-label">Resources</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <a
                      href="#passport"
                      onClick={() => setMobileMenuOpen(false)}
                      className="mobile-nav-link-item"
                    >
                      <div className="mobile-nav-icon-box">
                        <ShieldCheck size={15} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>Skill Passport</span>
                        <span style={{ fontSize: 9.5, fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)' }}>
                          SHA-256
                        </span>
                      </div>
                    </a>

                    <a
                      href="#faq"
                      onClick={() => setMobileMenuOpen(false)}
                      className="mobile-nav-link-item"
                    >
                      <div className="mobile-nav-icon-box">
                        <HelpCircle size={15} />
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>Frequently Asked Questions</div>
                    </a>

                    <a
                      href="#trust"
                      onClick={() => setMobileMenuOpen(false)}
                      className="mobile-nav-link-item"
                    >
                      <div className="mobile-nav-icon-box">
                        <Lock size={15} />
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>DPDP Act 2023 Trust & Governance</div>
                    </a>
                  </div>
                </div>

                {/* Group 3: Actions */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Link
                    href="/student/analyzer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-gold"
                    style={{
                      height: 48,
                      fontSize: 14,
                      fontWeight: 700,
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      textDecoration: 'none',
                    }}
                  >
                    <BarChart3 size={16} /> Analyze Skills Now <ArrowRight size={15} />
                  </Link>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link
                      href="/verify/demo-hash"
                      onClick={() => setMobileMenuOpen(false)}
                      className="btn-secondary"
                      style={{
                        flex: 1,
                        height: 44,
                        fontSize: 12.5,
                        fontWeight: 600,
                        borderRadius: 8,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        textDecoration: 'none',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <ShieldCheck size={14} /> Verify Hash
                    </Link>

                    <Link
                      href="/auth"
                      onClick={() => setMobileMenuOpen(false)}
                      className="btn-secondary"
                      style={{
                        flex: 1,
                        height: 44,
                        fontSize: 12.5,
                        fontWeight: 600,
                        borderRadius: 8,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textDecoration: 'none',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── 2. Hero Section ── */}
      <section
        className="landing-hero-section"
        style={{
          paddingTop: 116,
          paddingBottom: 48,
          position: 'relative',
          overflow: 'hidden',
          background: 'var(--bg)',
        }}
      >
        {/* Subtle Maharashtra Workforce Intelligence & Human Skilling Ecosystem Background */}
        <div
          className="hero-bg-ecosystem"
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: 1360,
            height: '100%',
            opacity: 0.10,
            pointerEvents: 'none',
            zIndex: 0,
            maskImage: 'radial-gradient(ellipse 75% 65% at 50% 35%, black 20%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 50% 35%, black 20%, transparent 80%)',
          }}
          aria-hidden="true"
        >
          <img
            src="/images/landing/hero-workforce-ecosystem.jpg"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%', filter: 'grayscale(35%) contrast(85%)' }}
            loading="eager"
          />
        </div>

        <div
          className="hero-bg-map"
          style={{
            position: 'absolute',
            top: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: 1000,
            height: '75%',
            opacity: 0.08,
            pointerEvents: 'none',
            zIndex: 0,
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 25%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 25%, transparent 80%)',
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
          {/* Top Badge (Compact, High-Contrast, Institutional) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}
          >
            <div
              className="hero-gov-badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: 6,
                color: 'var(--gold, #f59e0b)',
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              <Landmark size={12} />
              <span>GOVERNMENT OF MAHARASHTRA</span>
            </div>
          </motion.div>

          {/* Main Headline (Balanced responsive typography) */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="font-display hero-headline-mobile"
            style={{
              fontSize: 'clamp(32px, 4.3vw, 50px)',
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: '-0.025em',
              maxWidth: 880,
              margin: '0 auto 16px',
              color: '#f8fafc',
            }}
          >
            From Training Data to{' '}
            <span style={{ color: 'var(--gold, #f59e0b)' }}>Real Employment Outcomes</span>
          </motion.h1>

          {/* Subheadline (Clean 2-4 lines, high readability) */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="hero-desc-mobile"
            style={{
              fontSize: 'clamp(14px, 1.4vw, 16px)',
              color: 'var(--text-secondary)',
              maxWidth: 620,
              margin: '0 auto 24px',
              lineHeight: 1.6,
            }}
          >
            Ryyvora AI connects training, certification and employment outcomes into one privacy-conscious workforce outcome intelligence platform.
          </motion.p>

          {/* CTA Buttons & Role Portals with Clear Institutional Hierarchy */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              marginBottom: 32,
              width: '100%',
            }}
          >
            {/* Primary Action — Visually Dominant Saffron Button */}
            <Link
              href="/government"
              className="btn-gold hero-primary-cta"
              style={{
                fontSize: 14,
                fontWeight: 700,
                padding: '12px 26px',
                borderRadius: 8,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                textDecoration: 'none',
              }}
            >
              <Landmark size={16} /> Government State Cockpit <ArrowRight size={15} />
            </Link>

            {/* Secondary Actions — Subordinated Neutral Surfaces */}
            <div className="hero-secondary-ctas" style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', width: '100%' }}>
              <Link
                href="/student/journey"
                className="btn-secondary hero-secondary-btn"
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  padding: '10px 18px',
                  borderRadius: 8,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                }}
              >
                <ArrowRight size={14} /> Trainee Outcome Journey
              </Link>

              <Link
                href="/employer/validations"
                className="btn-secondary hero-secondary-btn"
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  padding: '10px 18px',
                  borderRadius: 8,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                }}
              >
                <ShieldCheck size={14} /> Employer Outcome Verification
              </Link>
            </div>
          </motion.div>

          {/* ── Product Dashboard Preview: Dedicated Mobile View ── */}
          <div className="mobile-only-block" style={{ width: '100%', maxWidth: 360, margin: '0 auto 12px' }}>
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: '14px 16px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
                textAlign: 'left',
              }}
            >
              {/* Preview Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 6, fontFamily: 'monospace' }}>
                    ryyvora.ai/cockpit
                  </span>
                </div>
                <span style={{ fontSize: 9.5, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={10} /> VERIFIED
                </span>
              </div>

              {/* Strongest 2 Insights */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* 1. Verified Readiness Score */}
                <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Verified Readiness Score
                    </span>
                    <span style={{ fontSize: 24, fontWeight: 900, color: '#f8fafc' }}>
                      84<span style={{ fontSize: 13, color: 'var(--text-muted)' }}>/100</span>
                    </span>
                  </div>
                  <div style={{ fontSize: 11.5, color: '#10b981', fontWeight: 600, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle2 size={12} />
                    <span>NSQF Level 5 (Software Engineering)</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 4 }}>
                    Top Strengths: TypeScript, Node.js REST APIs
                  </div>
                </div>

                {/* 2. Top Career Match */}
                <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--info)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Top Career Match
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc', marginTop: 2 }}>
                    Full-Stack Cloud Engineer
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--gold)', fontWeight: 700, marginTop: 2 }}>
                    92% Match · ₹8L–₹16L/yr (Est.)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Product Dashboard Preview: Realistic Desktop View with 3D Spatial Tilt ── */}
          <div className="desktop-only-block">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ position: 'relative', maxWidth: 1040, margin: '0 auto' }}
            >
              {/* Spatial Floating Badge 1 (Top-Right) */}
              <div
                className="hidden sm:flex"
                style={{
                  position: 'absolute',
                  top: -12,
                  right: 24,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-pill, 9999px)',
                  padding: '5px 12px',
                  alignItems: 'center',
                  gap: 7,
                  zIndex: 10,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>
                  SHA-256 Verified Telemetry
                </span>
              </div>

              {/* Spatial Floating Badge 2 (Bottom-Left) */}
              <div
                className="hidden sm:flex"
                style={{
                  position: 'absolute',
                  bottom: -12,
                  left: 24,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-pill, 9999px)',
                  padding: '5px 12px',
                  alignItems: 'center',
                  gap: 7,
                  zIndex: 10,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                }}
              >
                <Sparkles size={12} color="var(--gold)" />
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  NSQF Level 5 Competency Model
                </span>
              </div>

              <Tilt3D maxRotation={1.2} translateZ={4}>
                <div
                  style={{
                    padding: 22,
                    borderRadius: 10,
                    textAlign: 'left',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 12px 36px -4px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.04)',
                  }}
                >
                  {/* Top Preview Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ef4444' }} />
                      <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#f59e0b' }} />
                      <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#10b981' }} />
                      <span style={{ fontSize: 11.5, color: 'var(--text-muted)', marginLeft: 8, fontFamily: 'monospace' }}>
                        ryyvora.ai/student/intelligence-cockpit
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
                      <div style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600, marginTop: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <CheckCircle2 size={13} />
                        <span>NSQF Level 5 (Software Engineering)</span>
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

              {/* Ambient Base Shadow (Restrained & Calm) */}
              <div
                style={{
                  position: 'absolute',
                  bottom: -12,
                  left: '12%',
                  right: '12%',
                  height: 24,
                  background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.4) 0%, transparent 70%)',
                  filter: 'blur(10px)',
                  zIndex: -1,
                  pointerEvents: 'none',
                }}
                aria-hidden="true"
              />
            </motion.div>
          </div>
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
              { label: 'SHA-256 HMAC Signatures', sub: 'Cryptographic Outcome Verification', badge: 'Verified' },
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
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
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
              Traditional educational degrees lack granular competency verification, while employers struggle with hiring friction. Ryyvora AI bridges this divide.
            </p>
          </div>

          {/* Visual Progression Flow */}
          <div className="pipeline-flow-wrapper">
            {/* Top Telemetry Strip */}
            <div className="pipeline-telemetry-strip">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#10b981',
                    boxShadow: '0 0 8px #10b981',
                  }}
                />
                <span className="font-mono" style={{ fontSize: 11, fontWeight: 700, color: '#f8fafc', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  National Workforce Verification Flow
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>//</span>
                <span className="font-mono" style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                  5-Stage Deterministic Intelligence Pipeline
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="font-mono" style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                  INPUT ➔ EXTRACT ➔ ANALYZE ➔ MATCH ➔ ATTEST
                </span>
                <span
                  className="font-mono"
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: 'rgba(16,185,129,0.12)',
                    color: '#10b981',
                    border: '1px solid rgba(16,185,129,0.25)',
                    letterSpacing: '0.04em',
                  }}
                >
                  100% AUDITABLE
                </span>
              </div>
            </div>

            {/* 5-Node Connected Flow Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 12,
              }}
            >
              {[
                {
                  step: '01',
                  code: 'STG-01',
                  stage: 'INPUT',
                  tag: 'MULTI-SOURCE INTAKE',
                  title: 'Raw Profile / Code',
                  desc: 'Resumes, GitHub commits, coursework and project scope parsed into structured semantic tokens.',
                  chips: ['GitHub AST', 'ATS Resumes', 'Transcripts'],
                  progress: 20,
                  progressLabel: '20% Ingestion',
                  icon: Code,
                  accent: '#38bdf8',
                  accentBg: 'rgba(56, 189, 248, 0.08)',
                  accentBorder: 'rgba(56, 189, 248, 0.28)',
                  accentGlow: 'rgba(56, 189, 248, 0.2)',
                },
                {
                  step: '02',
                  code: 'STG-02',
                  stage: 'EXTRACT',
                  tag: 'NSQF ONTOLOGY ENGINE',
                  title: 'Neural Extraction',
                  desc: '50+ competency dimensions evaluated against National Skills Qualification Framework benchmarks.',
                  chips: ['50+ Dimensions', 'Bloom Taxonomy', 'Code AST'],
                  progress: 40,
                  progressLabel: '40% Extracted',
                  icon: Brain,
                  accent: '#a855f7',
                  accentBg: 'rgba(168, 85, 247, 0.08)',
                  accentBorder: 'rgba(168, 85, 247, 0.28)',
                  accentGlow: 'rgba(168, 85, 247, 0.2)',
                },
                {
                  step: '03',
                  code: 'STG-03',
                  stage: 'ANALYZE',
                  tag: 'GAP RADAR SYNTHESIS',
                  title: 'Skill Graph & Gaps',
                  desc: 'Multi-dimensional deficiency matrix with step-by-step milestone curriculum roadmaps.',
                  chips: ['Gap Radar', 'Priority Roadmap', 'Curricula'],
                  progress: 60,
                  progressLabel: '60% Synthesis',
                  icon: Layers,
                  accent: '#f59e0b',
                  accentBg: 'rgba(245, 158, 11, 0.08)',
                  accentBorder: 'rgba(245, 158, 11, 0.28)',
                  accentGlow: 'rgba(245, 158, 11, 0.2)',
                },
                {
                  step: '04',
                  code: 'STG-04',
                  stage: 'PREDICT',
                  tag: 'ECONOMIC COMPATIBILITY',
                  title: 'Career Matcher',
                  desc: 'Live market compatibility, hiring demand indices, and salary projections in INR.',
                  chips: ['INR Benchmark', 'Role Affinity', '500+ Roles'],
                  progress: 80,
                  progressLabel: '80% Matched',
                  icon: Compass,
                  accent: '#10b981',
                  accentBg: 'rgba(16, 185, 129, 0.08)',
                  accentBorder: 'rgba(16, 185, 129, 0.28)',
                  accentGlow: 'rgba(16, 185, 129, 0.2)',
                },
                {
                  step: '05',
                  code: 'STG-05',
                  stage: 'VERIFY',
                  tag: 'CRYPTOGRAPHIC ATTESTATION',
                  title: 'Verified Passport',
                  desc: 'Cryptographically signed SHA-256 public credential instant-verifiable by employers & state.',
                  chips: ['SHA-256 Hash', 'Public Verifier', 'W3C Standard'],
                  progress: 100,
                  progressLabel: '100% Sealed',
                  icon: ShieldCheck,
                  accent: '#eab308',
                  accentBg: 'rgba(234, 179, 8, 0.1)',
                  accentBorder: 'rgba(234, 179, 8, 0.35)',
                  accentGlow: 'rgba(234, 179, 8, 0.25)',
                },
              ].map((node, i) => {
                const IconComp = node.icon;
                return (
                  <div
                    key={i}
                    className="pipeline-step-card card-shine"
                    style={{
                      '--card-accent': node.accent,
                      '--card-accent-bg': node.accentBg,
                      '--card-accent-border': node.accentBorder,
                      '--card-accent-glow': node.accentGlow,
                    } as React.CSSProperties}
                  >
                    {/* Header Row: Stage Number + Code + Icon Pod */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span
                            className="font-mono pipeline-number-badge"
                            style={{
                              color: node.accent,
                              background: node.accentBg,
                              border: `1px solid ${node.accentBorder}`,
                            }}
                          >
                            {node.step}
                          </span>
                          <span
                            className="font-mono"
                            style={{
                              fontSize: 9.5,
                              fontWeight: 700,
                              color: 'var(--text-muted)',
                              letterSpacing: '0.06em',
                            }}
                          >
                            {node.code}
                          </span>
                        </div>

                        <div
                          className="pipeline-icon-badge"
                          style={{
                            background: node.accentBg,
                            border: `1px solid ${node.accentBorder}`,
                            color: node.accent,
                          }}
                        >
                          <IconComp size={17} />
                        </div>
                      </div>

                      {/* Technical Protocol Tag */}
                      <div
                        className="font-mono"
                        style={{
                          fontSize: 9,
                          fontWeight: 750,
                          color: node.accent,
                          letterSpacing: '0.08em',
                          marginBottom: 6,
                          textTransform: 'uppercase',
                        }}
                      >
                        {node.tag}
                      </div>

                      {/* Title & Description */}
                      <h4
                        className="pipeline-card-title"
                        style={{
                          fontSize: 14.5,
                          fontWeight: 700,
                          color: '#f8fafc',
                          margin: '0 0 6px',
                          letterSpacing: '-0.015em',
                          lineHeight: 1.35,
                        }}
                      >
                        {node.title}
                      </h4>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.48, margin: '0 0 12px' }}>
                        {node.desc}
                      </p>

                      {/* Technical Capability Micro-Chips */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
                        {node.chips.map((chip, cIdx) => (
                          <span key={cIdx} className="pipeline-tech-chip">
                            {chip}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Pipeline Progress & Verification Status */}
                    <div>
                      <div className="pipeline-progress-rail">
                        <div
                          className="pipeline-progress-fill"
                          style={{
                            width: `${node.progress}%`,
                            background: node.accent,
                          }}
                        />
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 6,
                          paddingTop: 4,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0 }}>
                          <span
                            className="pipeline-stage-dot"
                            style={{
                              width: 5.5,
                              height: 5.5,
                              borderRadius: '50%',
                              background: node.accent,
                              flexShrink: 0,
                            }}
                          />
                          <span
                            className="pipeline-stage-label font-mono"
                            style={{
                              fontSize: 9,
                              fontWeight: 800,
                              color: '#cbd5e1',
                              letterSpacing: '0.04em',
                              textTransform: 'uppercase',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            STG {node.step} · {node.stage}
                          </span>
                        </div>

                        <span
                          className="font-mono"
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            color: node.accent,
                            letterSpacing: '0.02em',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                          }}
                        >
                          {node.progressLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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
              Every AI capability in Ryyvora is backed by resilient multi-provider LLMs, safe JSON repair, and strict Zod runtime schemas.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 20 }}>
            {/* Feature 1: AI Skill Analyzer */}
            <div
              className="editorial-panel"
              style={{
                padding: 22,
                borderRadius: 10,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ marginBottom: 14, overflow: 'hidden', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <ResponsiveImage
                    src="/images/training/code-diagnostic.jpg"
                    alt="Multi-modal neural skill extraction and code diagnostic evaluation in Pune lab"
                    aspectRatio="16 / 9"
                    borderRadius={8}
                    overlayGradient="subtle"
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--gold)', letterSpacing: '0.06em' }}>01 / NEURAL EXTRACTION</span>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      background: 'rgba(245,158,11,0.1)',
                      border: '1px solid rgba(245,158,11,0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--gold)',
                    }}
                  >
                    <Brain size={16} />
                  </div>
                </div>
                <h3 className="font-display" style={{ fontSize: 16.5, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
                  Multi-Modal AI Skill Analyzer
                </h3>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
                  <strong style={{ color: '#f8fafc' }}>WHAT:</strong> Ingests raw resume text, GitHub repositories, and submitted code snippets.<br />
                  <strong style={{ color: '#f8fafc' }}>WHY:</strong> Eliminates keyword stuffing by verifying actual architectural and coding syntax.<br />
                  <strong style={{ color: '#f8fafc' }}>HOW:</strong> Powered by Groq Llama-3.3-70b with safe JSON repair and NSQF taxonomy mapping.
                </p>
              </div>
              <Link href="/student/analyzer" style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                Test Skill Analyzer <ChevronRight size={13} />
              </Link>
            </div>

            {/* Feature 2: Career Prediction */}
            <div
              className="editorial-panel"
              style={{
                padding: 22,
                borderRadius: 10,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ marginBottom: 14, overflow: 'hidden', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <ResponsiveImage
                    src="/images/workforce/career-pathways.jpg"
                    alt="Predictive career matching and Indian tech salary trajectories in modern workspace"
                    aspectRatio="16 / 9"
                    borderRadius={8}
                    overlayGradient="subtle"
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: '#60a5fa', letterSpacing: '0.06em' }}>02 / PREDICTIVE TELEMETRY</span>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      background: 'rgba(59,130,246,0.1)',
                      border: '1px solid rgba(59,130,246,0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#60a5fa',
                    }}
                  >
                    <Compass size={16} />
                  </div>
                </div>
                <h3 className="font-display" style={{ fontSize: 16.5, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
                  Predictive Career Pathways
                </h3>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
                  <strong style={{ color: '#f8fafc' }}>WHAT:</strong> Matches candidate competencies to high-growth Indian tech roles.<br />
                  <strong style={{ color: '#f8fafc' }}>WHY:</strong> Prevents career misalignment by forecasting market demand and compensation.<br />
                  <strong style={{ color: '#f8fafc' }}>HOW:</strong> Calculates mathematical compatibility scores and transparent INR model estimates.
                </p>
              </div>
              <Link href="/student/career" style={{ fontSize: 12, fontWeight: 700, color: '#60a5fa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                Explore Career Paths <ChevronRight size={13} />
              </Link>
            </div>

            {/* Feature 3: Gap Analysis */}
            <div
              className="editorial-panel"
              style={{
                padding: 22,
                borderRadius: 10,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ marginBottom: 14, overflow: 'hidden', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <ResponsiveImage
                    src="/images/training/skill-gap-analysis.jpg"
                    alt="Dynamic skill gap analysis and NSQF competency roadmap review"
                    aspectRatio="16 / 9"
                    borderRadius={8}
                    overlayGradient="subtle"
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: '#ef4444', letterSpacing: '0.06em' }}>03 / SKILL GAP ROADMAPS</span>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ef4444',
                    }}
                  >
                    <AlertTriangle size={16} />
                  </div>
                </div>
                <h3 className="font-display" style={{ fontSize: 16.5, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
                  Dynamic Skill Gap Analysis
                </h3>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
                  <strong style={{ color: '#f8fafc' }}>WHAT:</strong> Compares student skills against target enterprise benchmarks.<br />
                  <strong style={{ color: '#f8fafc' }}>WHY:</strong> Gives learners concrete clarity on what to study rather than generic advice.<br />
                  <strong style={{ color: '#f8fafc' }}>HOW:</strong> Generates priority-tagged deficiencies and phase-by-phase timeline roadmaps.
                </p>
              </div>
              <Link href="/student" style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                View Gap Roadmap <ChevronRight size={13} />
              </Link>
            </div>

            {/* Feature 4: Cryptographic Passport */}
            <div
              className="editorial-panel"
              style={{
                padding: 22,
                borderRadius: 10,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ marginBottom: 14, overflow: 'hidden', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <ResponsiveImage
                    src="/images/credentials/credential-passport.jpg"
                    alt="Tamper-proof digital skill passport certificate with SHA-256 HMAC ledger signature"
                    aspectRatio="16 / 9"
                    borderRadius={8}
                    overlayGradient="subtle"
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: '#10b981', letterSpacing: '0.06em' }}>04 / VERIFIABLE CREDENTIALS</span>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      background: 'rgba(16,185,129,0.1)',
                      border: '1px solid rgba(16,185,129,0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#10b981',
                    }}
                  >
                    <Award size={16} />
                  </div>
                </div>
                <h3 className="font-display" style={{ fontSize: 16.5, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
                  Verifiable Skill Passport
                </h3>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
                  <strong style={{ color: '#f8fafc' }}>WHAT:</strong> A tamper-proof digital credential issued with a cryptographic hash.<br />
                  <strong style={{ color: '#f8fafc' }}>WHY:</strong> Employers can verify skills in seconds without relying on self-reported resumes.<br />
                  <strong style={{ color: '#f8fafc' }}>HOW:</strong> SHA-256 HMAC digest computed over student scores and NSQF certification tier.
                </p>
              </div>
              <Link href="/student/passport" style={{ fontSize: 12, fontWeight: 700, color: '#10b981', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                Inspect Passport <ChevronRight size={13} />
              </Link>
            </div>

            {/* Feature 5: Adaptive Assessments */}
            <div
              className="editorial-panel"
              style={{
                padding: 22,
                borderRadius: 10,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ marginBottom: 14, overflow: 'hidden', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <ResponsiveImage
                    src="/images/training/diagnostic-quiz.jpg"
                    alt="Proctored online technical assessment hall and candidate diagnostic evaluation"
                    aspectRatio="16 / 9"
                    borderRadius={8}
                    overlayGradient="subtle"
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--gold)', letterSpacing: '0.06em' }}>05 / ADAPTIVE EVALUATION</span>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      background: 'rgba(245,158,11,0.1)',
                      border: '1px solid rgba(245,158,11,0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--gold)',
                    }}
                  >
                    <CheckCircle2 size={16} />
                  </div>
                </div>
                <h3 className="font-display" style={{ fontSize: 16.5, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
                  Adaptive Assessment Engine
                </h3>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
                  <strong style={{ color: '#f8fafc' }}>WHAT:</strong> Distraction-free diagnostic quizzes with keyboard navigation (A, B, C, D).<br />
                  <strong style={{ color: '#f8fafc' }}>WHY:</strong> Continuously validates real practical mastery across multiple difficulty tiers.<br />
                  <strong style={{ color: '#f8fafc' }}>HOW:</strong> Dynamic question synthesis, automated grading, and instant passport ledger sync.
                </p>
              </div>
              <Link href="/student/assessment" style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                Take Diagnostic Quiz <ChevronRight size={13} />
              </Link>
            </div>

            {/* Feature 6: Real-Time Copilot */}
            <div
              className="editorial-panel"
              style={{
                padding: 22,
                borderRadius: 10,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ marginBottom: 14, overflow: 'hidden', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <ResponsiveImage
                    src="/images/government/policy-intelligence.jpg"
                    alt="Public sector data analyst examining regional workforce intelligence and policy interventions"
                    aspectRatio="16 / 9"
                    borderRadius={8}
                    overlayGradient="subtle"
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: '#c084fc', letterSpacing: '0.06em' }}>06 / PROFILE-AWARE COPILOT</span>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      background: 'rgba(168,85,247,0.1)',
                      border: '1px solid rgba(168,85,247,0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#c084fc',
                    }}
                  >
                    <Bot size={16} />
                  </div>
                </div>
                <h3 className="font-display" style={{ fontSize: 16.5, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
                  Profile-Aware AI Copilot
                </h3>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
                  <strong style={{ color: '#f8fafc' }}>WHAT:</strong> Conversational mentor embedded natively into the student dashboard.<br />
                  <strong style={{ color: '#f8fafc' }}>WHY:</strong> Answers personalized questions about interview prep, salary, and gap closure.<br />
                  <strong style={{ color: '#f8fafc' }}>HOW:</strong> Injects live student NSQF competencies into prompts with SSE typewriter streaming.
                </p>
              </div>
              <Link href="/student" style={{ fontSize: 12, fontWeight: 700, color: '#c084fc', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                Chat with Copilot <ChevronRight size={13} />
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
          <div className="card-accent" style={{ padding: 26, borderRadius: 10 }}>
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

      {/* ── 7. How It Works (7-Stage Longitudinal Workforce Journey) ── */}
      <section id="how-it-works" style={{ padding: '80px 24px', background: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 46 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <AIBadge type="nsqf" label="7-STAGE WORKFORCE JOURNEY" />
              <AIBadge type="verified" label="END-TO-END OUTCOME ARCHITECTURE" />
            </div>
            <h2 className="font-display" style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, color: '#f8fafc', margin: '0 0 12px' }}>
              The Ryyvora <span style={{ color: 'var(--gold, #f59e0b)' }}>Workforce Outcome Journey</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 740, margin: '0 auto' }}>
              Following what happens to candidates after skilling — connecting vocational training, NSQF proctored assessment, state certification, campus placement, employer verification, 365-day retention, and policy intelligence.
            </p>
          </div>

          {/* Mobile Vertical Step Timeline */}
          <div className="mobile-only-block" style={{ marginTop: 20 }}>
            <div style={{ position: 'relative', paddingLeft: 30, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Continuous vertical connecting line */}
              <div
                style={{
                  position: 'absolute',
                  top: 14,
                  bottom: 14,
                  left: 13,
                  width: 2,
                  background: 'linear-gradient(180deg, rgba(245,158,11,0.5) 0%, rgba(16,185,129,0.5) 50%, rgba(6,182,212,0.5) 100%)',
                  borderRadius: 1,
                }}
              />

              {[
                { num: '01', title: 'Vocational Training', desc: 'Accredited ITI & lab instruction aligned with NSQF Levels 4–7.', icon: FileText, accent: '#f59e0b' },
                { num: '02', title: 'Proctored Assessment', desc: 'Timed multi-domain evaluations across 50+ technical dimensions.', icon: Brain, accent: '#60a5fa' },
                { num: '03', title: 'State Certification', desc: 'Issuance of tamper-proof digital credentials on the state ledger.', icon: Award, accent: '#10b981' },
                { num: '04', title: 'Enterprise Placement', desc: 'Graduates matched directly to industrial tech corridors across Maharashtra.', icon: Briefcase, accent: '#c084fc' },
                { num: '05', title: 'Employer Verification', desc: '1-click instant SHA-256 hash query with zero resume fraud.', icon: ShieldCheck, accent: '#f59e0b' },
                { num: '06', title: '365-Day Retention', desc: 'Longitudinal wage growth and tenure milestone tracking.', icon: TrendingUp, accent: '#10b981' },
                { num: '07', title: 'Policy Intelligence', desc: '36-district heatmap telemetry for sovereign workforce planning.', icon: Landmark, accent: '#06b6d4' },
              ].map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 10,
                      padding: '12px 14px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                      textAlign: 'left',
                    }}
                  >
                    {/* Node Circle on the Line */}
                    <div
                      style={{
                        position: 'absolute',
                        left: -30,
                        top: 12,
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        background: 'var(--bg)',
                        border: `2px solid ${item.accent}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10,
                        fontWeight: 800,
                        color: item.accent,
                        zIndex: 2,
                      }}
                    >
                      {item.num}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <ItemIcon size={14} color={item.accent} />
                      <h4 style={{ fontSize: 13.5, fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                        {item.title}
                      </h4>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop 7-Card Grid */}
          <div
            className="desktop-only-block"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 16,
            }}
          >
            {[
              {
                num: '01',
                title: 'Vocational Training',
                desc: 'Technical lab instruction aligned with NSQF Levels 4-7 across accredited ITIs and skilling centers.',
                image: '/images/training/training-lab.jpg',
                alt: 'Indian technical students learning microcontrollers and circuit diagnostics in an ITI laboratory',
                icon: FileText,
                accent: '#f59e0b',
                phase: '01 · TRAINING LAB',
                specs: [
                  'Electronics, Cloud & Core Trades',
                  'NCVET Aligned Coursework',
                  'Hands-on Hardware Lab Hours',
                ],
                metric: '1,200+ Accredited ITIs & Centers',
              },
              {
                num: '02',
                title: 'Proctored Assessment',
                desc: 'Timed, multi-domain cognitive and code syntax evaluations across 50+ technical competency dimensions.',
                image: '/images/training/assessment-testing.jpg',
                alt: 'Indian candidates taking proctored online NSQF technical certification exams in a testing hall',
                icon: Brain,
                accent: '#60a5fa',
                phase: '02 · NSQF ASSESSMENT',
                specs: [
                  'Multi-Axis Radar Extraction',
                  'AI Anti-Cheating Telemetry',
                  'Dynamic Question Synthesis',
                ],
                metric: 'Zero Hallucination Zod Schemas',
              },
              {
                num: '03',
                title: 'State Certification',
                desc: 'Issuance of authenticated digital certificates sealed with official government authority marks.',
                image: '/images/credentials/digital-credential.jpg',
                alt: 'Official Government of Maharashtra verified digital skill credential and skill passport certificate',
                icon: Award,
                accent: '#10b981',
                phase: '03 · STATE CREDENTIAL',
                specs: [
                  'Government Directorate Seal',
                  'Tamper-Proof Ledger Stamp',
                  'Micro-Print Security Guilloche',
                ],
                metric: '100% Legally Recognized Record',
              },
              {
                num: '04',
                title: 'Enterprise Placement',
                desc: 'Graduates matched directly to industrial tech, manufacturing, and IT corridors across Maharashtra.',
                image: '/images/workforce/workplace-employment.jpg',
                alt: 'Newly hired Indian engineering graduates collaborating at modern technology workstation in Pune',
                icon: Briefcase,
                accent: '#c084fc',
                phase: '04 · CAMPUS PLACEMENT',
                specs: [
                  'High-Frequency Job Matching',
                  'Direct Recruiter Fast-Tracking',
                  'Pre-Assessed Candidate Pools',
                ],
                metric: 'Average Starting: ₹7.80 LPA',
              },
              {
                num: '05',
                title: 'Employer Verification',
                desc: 'Hiring managers instantly validate candidate competencies directly against the state ledger.',
                image: '/images/employers/employer-verification.jpg',
                alt: 'Corporate HR leaders validating candidate cryptographic skill passports and NSQF scores on screen',
                icon: ShieldCheck,
                accent: '#f59e0b',
                phase: '05 · LEDGER VERIFICATION',
                specs: [
                  '1-Click SHA-256 Hash Query',
                  'Instant Recruiter QR Scan',
                  'Zero Resume Keyword Fraud',
                ],
                metric: '<800ms Verification Latency',
              },
              {
                num: '06',
                title: '365-Day Retention',
                desc: 'Tracking 30-day, 90-day, 180-day, and 365-day industry tenure to ensure sustainable career stability.',
                image: '/images/workforce/career-progression.jpg',
                alt: 'Senior Indian engineering mentor reviewing career progression and system scalability with junior engineer',
                icon: TrendingUp,
                accent: '#10b981',
                phase: '06 · TENURE & WAGE GROWTH',
                specs: [
                  'Automated Follow-up Check-ins',
                  'Milestone Promotion Tracking',
                  'Longitudinal Wage Analytics',
                ],
                metric: '91.8% Retention Across Cohorts',
              },
              {
                num: '07',
                title: 'Policy Intelligence',
                desc: 'State policymakers synthesize district data to allocate funding and forecast emerging workforce trends.',
                image: '/images/government/policy-analytics.jpg',
                alt: 'Public policy analyst in Maharashtra Directorate of Skill Development evaluating district telemetry',
                icon: Landmark,
                accent: '#06b6d4',
                phase: '07 · STATE POLICY INSIGHT',
                specs: [
                  '36-District Heatmap Intelligence',
                  'Grounded AI Policy Copilot',
                  'Empirical Budget Optimizations',
                ],
                metric: 'Data-Driven Sovereign Decisions',
              },
            ].map((step, i) => {
              const IconComp = step.icon;
              return (
                <div
                  key={i}
                  className="editorial-panel"
                  style={{
                    padding: 18,
                    borderRadius: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    {/* Compact Visual Thumbnail */}
                    <div style={{ marginBottom: 12, borderRadius: 6, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <ResponsiveImage
                        src={step.image}
                        alt={step.alt}
                        aspectRatio="16 / 9"
                        borderRadius={6}
                        overlayGradient="subtle"
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: step.accent, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        {step.phase}
                      </span>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          background: 'rgba(255,255,255,0.03)',
                          border: `1px solid ${step.accent}40`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: step.accent,
                        }}
                      >
                        <IconComp size={14} />
                      </div>
                    </div>

                    <h3 style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc', margin: '0 0 6px' }}>
                      {step.title}
                    </h3>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.45, margin: '0 0 10px' }}>
                      {step.desc}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      {step.specs.map((spec, sIdx) => (
                        <div key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)' }}>
                          <span style={{ color: step.accent, fontSize: 10 }}>▹</span>
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <CheckCircle2 size={12} style={{ color: 'var(--success)', flexShrink: 0 }} />
                    <span>{step.metric}</span>
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
              <span style={{ color: 'var(--gold, #f59e0b)' }}>Registered Stakeholder</span>
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
              Every role receives a dedicated, proctored command center equipped with specialized neural diagnostics, verified skill credentials, and automated workflows.
            </p>
          </div>

          {/* Role Tab Navigation Pills */}
          <div
            className="mobile-role-scroll"
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 8,
              flexWrap: 'wrap',
              marginBottom: 32,
            }}
          >
            {[
              { id: 'student', name: 'Student / Trainee', icon: GraduationCap, color: '#10B981' },
              { id: 'employer', name: 'Hiring Employer', icon: Building2, color: '#C084FC' },
              { id: 'institute', name: 'Training Institute', icon: School, color: '#60A5FA' },
              { id: 'government', name: 'State Government', icon: Landmark, color: '#F59E0B' },
              { id: 'industry', name: 'Sector Council (SSC)', icon: Layers, color: '#EC4899' },
              { id: 'admin', name: 'Platform Admin', icon: Settings, color: '#94A3B8' },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeRoleTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveRoleTab(tab.id as any)}
                  style={{
                    padding: '10px 18px',
                    minHeight: 44,
                    borderRadius: 99,
                    fontSize: 13,
                    fontWeight: 700,
                    background: isActive ? 'var(--gold)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isActive ? 'var(--gold)' : 'var(--border)'}`,
                    color: isActive ? '#090a0f' : '#cbd5e1',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isActive ? '0 4px 18px rgba(245,158,11,0.25)' : 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <TabIcon size={15} color={isActive ? '#090a0f' : tab.color} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active Role Card Feature Grid */}
          <div className="card-accent" style={{ padding: 32, borderRadius: 10 }}>
            {activeRoleTab === 'student' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 24, alignItems: 'center', marginBottom: 28, borderBottom: '1px solid var(--border)', paddingBottom: 24 }}>
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
                          borderRadius: 8,
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 24, alignItems: 'center', marginBottom: 28, borderBottom: '1px solid var(--border)', paddingBottom: 24 }}>
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
                          borderRadius: 8,
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 24, alignItems: 'center', marginBottom: 28, borderBottom: '1px solid var(--border)', paddingBottom: 24 }}>
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
                          borderRadius: 8,
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 24, alignItems: 'center', marginBottom: 28, borderBottom: '1px solid var(--border)', paddingBottom: 24 }}>
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
                          borderRadius: 8,
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 24, alignItems: 'center', marginBottom: 28, borderBottom: '1px solid var(--border)', paddingBottom: 24 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#EC4899', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Sector Skill Council (SSC) Workspace
                    </span>
                    <h3 className="font-display" style={{ fontSize: 24, fontWeight: 900, color: '#f8fafc', margin: '4px 0 6px' }}>
                      Industry & Sector Skill Demand Intelligence
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, margin: '0 0 18px', maxWidth: 560, lineHeight: 1.6 }}>
                      Calibrate National Occupational Standards (NOS), forecast emerging tech surges (GenAI, Cloud), and map regional talent availability heatmaps.
                    </p>
                    <Link
                      href="/industry"
                      className="btn-gold"
                      style={{ fontSize: 13, padding: '10px 22px', display: 'inline-flex', alignItems: 'center', gap: 8 }}
                    >
                      <span>Launch Industry Suite</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>

                  <div style={{ maxWidth: 420, justifySelf: 'end', width: '100%' }}>
                    <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(236,72,153,0.3)', boxShadow: '0 12px 32px -8px rgba(0,0,0,0.6)' }}>
                      <ResponsiveImage
                        src="/images/stakeholders/industry-council.jpg"
                        alt="Indian Sector Skill Council leaders and engineering heads reviewing technical qualifications in automotive facility"
                        aspectRatio="16 / 9"
                        borderRadius={12}
                        overlayGradient="subtle"
                      />
                      <div style={{ position: 'absolute', bottom: 8, left: 10, right: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
                        <span style={{ fontSize: 10.5, fontWeight: 800, color: '#f8fafc', background: 'rgba(11,15,23,0.85)', padding: '3px 8px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }}>
                          Automotive & Tech SSC · Standards Board
                        </span>
                      </div>
                    </div>
                  </div>
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
                          borderRadius: 8,
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 24, alignItems: 'center', marginBottom: 28, borderBottom: '1px solid var(--border)', paddingBottom: 24 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      System Governance & Audit Workspace
                    </span>
                    <h3 className="font-display" style={{ fontSize: 24, fontWeight: 900, color: '#f8fafc', margin: '4px 0 6px' }}>
                      Platform Administrator & Audit Center
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, margin: '0 0 18px', maxWidth: 560, lineHeight: 1.6 }}>
                      Manage decentralized ledger integrity, audit algorithmic fairness models, monitor LLM telemetry, and oversee DPDP compliance.
                    </p>
                    <Link
                      href="/admin"
                      className="btn-gold"
                      style={{ fontSize: 13, padding: '10px 22px', display: 'inline-flex', alignItems: 'center', gap: 8 }}
                    >
                      <span>Launch Admin Center</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>

                  <div style={{ maxWidth: 420, justifySelf: 'end', width: '100%' }}>
                    <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(148,163,184,0.3)', boxShadow: '0 12px 32px -8px rgba(0,0,0,0.6)' }}>
                      <ResponsiveImage
                        src="/images/stakeholders/admin-governance.jpg"
                        alt="State government data operations center engineers monitoring server telemetry and cryptographic ledgers"
                        aspectRatio="16 / 9"
                        borderRadius={12}
                        overlayGradient="subtle"
                      />
                      <div style={{ position: 'absolute', bottom: 8, left: 10, right: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
                        <span style={{ fontSize: 10.5, fontWeight: 800, color: '#f8fafc', background: 'rgba(11,15,23,0.85)', padding: '3px 8px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }}>
                          State IT Center · System Audit Node
                        </span>
                      </div>
                    </div>
                  </div>
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
                          borderRadius: 8,
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
              Everything You Need to Know About <span style={{ color: 'var(--gold)' }}>Ryyvora AI</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0 }}>
              Essential answers regarding sovereign outcome intelligence, NSQF alignment, and algorithmic fairness.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              {
                q: 'How does Ryyvora AI evaluate candidate competency without bias?',
                a: 'Ryyvora AI utilizes a multi-modal analysis engine that evaluates source code architecture, test coverage, algorithmic efficiency, and timed diagnostic quizzes. All scoring models are continuously audited against disparate impact metrics enforcing the 80% rule across gender, institution, and geographical demographics.',
              },
              {
                q: 'What makes the Skill Passport verifiable and tamper-proof?',
                a: 'Every assessment milestone generates a cryptographic SHA-256 HMAC payload containing candidate anonymized hash, NSQF competency levels, and issuing authority identity. This signature can be independently verified on-chain or via public QR code verification endpoints without accessing raw student records.',
              },
              {
                q: 'How does the platform ensure compliance with DPDP Act 2023?',
                a: 'Ryyvora implements sovereign consent governance. Candidates have granular control to grant or revoke specific processing purposes (e.g. longitudinal tracking vs wage benchmarking). All personal identifying information is masked in government macro views, and trainees can export or request deletion of their data under DPDP Article 12.',
              },
              {
                q: 'Can existing vocational institutes integrate with the platform?',
                a: 'Yes. Ryyvora AI provides open REST APIs and batch CSV integration tools allowing vocational training providers to bulk enroll cohorts, synchronize exam results, and monitor longitudinal graduate retention without replacing existing LMS tools.',
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
              borderRadius: 10,
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
            <div style={{ padding: 20, background: 'var(--bg-surface)', borderRadius: 8, border: '1px solid var(--border)', maxWidth: 420, width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 10, marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>Digital Passport #SKP-7819</div>
                <span style={{ fontSize: 10, color: '#10b981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle2 size={11} />
                  <span>VERIFIED (DEMO SAMPLE)</span>
                </span>
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
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <AIBadge type="verified" label="ALGORITHMIC GOVERNANCE & TRUST" />
            <h2 className="font-display" style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: '#f8fafc', margin: '8px 0 12px' }}>
              Built on Rigorous Bias Monitoring & Ethical AI
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14.5, maxWidth: 640, margin: '0 auto' }}>
              Ryyvora AI includes an active fairness auditing engine that monitors demographic parity across gender, states, and institution types to ensure merit-based opportunities.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 20, alignItems: 'stretch' }}>
            {/* Visual Trust Card */}
            <div className="card-elevated" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 220, position: 'relative' }}>
                <ResponsiveImage
                  src="/images/credentials/dpdp-trust-security.jpg"
                  alt="Government data sovereignty and algorithmic fairness verification center"
                  aspectRatio="16/9"
                  overlayGradient="navy"
                  style={{ height: '100%', width: '100%' }}
                />
                <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 6, background: 'rgba(11, 15, 23, 0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 11, fontWeight: 700, color: '#10b981' }}>
                    <ShieldCheck size={14} /> DPDP Act 2023 Compliant
                  </div>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: '#94a3b8', background: 'rgba(11, 15, 23, 0.85)', padding: '3px 8px', borderRadius: 4 }}>
                    ISO-27001 Tier
                  </span>
                </div>
              </div>
              <div style={{ padding: 18, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
                  Audited Demographic Parity & Sovereign Hosting
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  All candidate inference, credential records, and enterprise telemetry run strictly within sovereign cloud boundaries with automated disparate-impact mitigation.
                </p>
              </div>
            </div>

            {/* Feature List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="card-linear" style={{ padding: 18, flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#10b981', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ShieldCheck size={16} /> Disparate Impact Auditing
                </div>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  Enforces the 80% (4/5ths) rule on recommendation and evaluation algorithms to prevent systemic bias across gender and socio-economic cohorts.
                </p>
              </div>

              <div className="card-linear" style={{ padding: 18, flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#60a5fa', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Lock size={16} /> Complete Secret Isolation
                </div>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  All LLM provider keys and HMAC signing secrets remain strictly on the server and are never exposed to clients or third-party trackers.
                </p>
              </div>

              <div className="card-linear" style={{ padding: 18, flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Zap size={16} /> Explainable Competency Models
                </div>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  Every score is backed by granular evidence snippets, model confidence metrics, and clear national NSQF qualification mappings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing Section ── */}
      <PricingSection />

      {/* ── 11. High-Conversion Final CTA ── */}
      <section style={{ padding: '80px 24px', background: 'var(--bg-surface-elevated)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 840, margin: '0 auto', textAlign: 'center' }}>
          <h2 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#f8fafc', margin: '0 0 16px', lineHeight: 1.15 }}>
            Know your skills. Know your path.<br />
            <span style={{ color: 'var(--gold, #f59e0b)' }}>Build what the industry needs.</span>
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

      {/* ── 12. Institutional Enterprise Footer ── */}
      <footer className="enterprise-footer">
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          {/* Top Telemetry & Verification Fast-Track Banner */}
          <div className="footer-telemetry-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#10b981',
                    boxShadow: '0 0 10px #10b981',
                    display: 'inline-block',
                  }}
                />
                <span className="font-mono" style={{ fontSize: 11.5, fontWeight: 700, color: '#f8fafc', letterSpacing: '0.04em' }}>
                  ALL SYSTEMS OPERATIONAL
                </span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, color: '#94a3b8' }} className="font-mono">
                <span>UPTIME: 99.98%</span>
                <span>LATENCY: ~840MS</span>
                <span>DATA RESIDENCY: MUMBAI/IN</span>
                <span>DPDP 2023 COMPLIANT</span>
              </div>
            </div>

            {/* Quick Public Credential Verification Shortcut */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <Link
                href="/verify/demo-hash"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 7,
                  background: 'rgba(245,158,11,0.12)',
                  border: '1px solid rgba(245,158,11,0.28)',
                  color: 'var(--gold)',
                  fontSize: 11.5,
                  fontWeight: 700,
                  textDecoration: 'none',
                  letterSpacing: '0.02em',
                }}
              >
                <ShieldCheck size={14} /> Verify Credential Hash <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Main 5-Column Navigation Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 36,
              marginBottom: 48,
            }}
          >
            {/* Column 1: Platform & Institutional Authority */}
            <div style={{ gridColumn: 'span 1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'var(--gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: 14,
                    color: '#090a0f',
                    boxShadow: '0 0 16px rgba(245,158,11,0.25)',
                  }}
                >
                  RY
                </div>
                <div>
                  <span className="font-display" style={{ fontWeight: 800, fontSize: 16, color: '#f8fafc', display: 'block', lineHeight: 1.1 }}>
                    Ryyvora AI
                  </span>
                  <span className="font-mono" style={{ fontSize: 9, color: 'var(--gold)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Workforce Outcome Intelligence
                  </span>
                </div>
              </div>

              <p style={{ fontSize: 12.5, color: '#94a3b8', lineHeight: 1.6, margin: '0 0 18px' }}>
                National workforce intelligence and cryptographic skill verification platform. Bridging higher education and enterprise hiring through deterministic competency analytics.
              </p>

              {/* Compliance & Standards Micro-Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                <span className="footer-cert-badge">
                  <Landmark size={11} color="var(--gold)" /> NSQF Level 4–8
                </span>
                <span className="footer-cert-badge">
                  <ShieldCheck size={11} color="#10b981" /> DPDP 2023
                </span>
                <span className="footer-cert-badge">
                  <Lock size={11} color="#38bdf8" /> SHA-256 HMAC
                </span>
                <span className="footer-cert-badge">
                  <Globe size={11} color="#a855f7" /> W3C Verifiable
                </span>
              </div>
            </div>

            {/* Column 2: AI Intelligence Engines */}
            <div className="footer-nav-col">
              <h5>
                <Brain size={13} color="var(--gold)" /> Intelligence Engines
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link href="/student/analyzer" className="footer-link">
                  <span>AI Skill Analyzer</span>
                  <ChevronRight size={11} className="footer-link-arrow" />
                </Link>
                <Link href="/student/career" className="footer-link">
                  <span>Career Predictor & Wage Index</span>
                  <ChevronRight size={11} className="footer-link-arrow" />
                </Link>
                <Link href="/student/assessment" className="footer-link">
                  <span>Adaptive Diagnostic Assessments</span>
                  <ChevronRight size={11} className="footer-link-arrow" />
                </Link>
                <Link href="/student/market" className="footer-link">
                  <span>Real-Time Market Demand</span>
                  <ChevronRight size={11} className="footer-link-arrow" />
                </Link>
                <Link href="/student/journey" className="footer-link">
                  <span>Dynamic Upskilling Roadmap</span>
                  <ChevronRight size={11} className="footer-link-arrow" />
                </Link>
                <Link href="/ai-health" className="footer-link">
                  <span>Multi-Model AI Telemetry</span>
                  <ChevronRight size={11} className="footer-link-arrow" />
                </Link>
              </div>
            </div>

            {/* Column 3: Ecosystem Workspaces */}
            <div className="footer-nav-col">
              <h5>
                <Building2 size={13} color="var(--gold)" /> Ecosystem Workspaces
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link href="/student" className="footer-link">
                  <span>Student Career Cockpit</span>
                  <ChevronRight size={11} className="footer-link-arrow" />
                </Link>
                <Link href="/institute" className="footer-link">
                  <span>Training Institute Portal</span>
                  <ChevronRight size={11} className="footer-link-arrow" />
                </Link>
                <Link href="/institute/roi" className="footer-link">
                  <span>Training ROI & Placements</span>
                  <ChevronRight size={11} className="footer-link-arrow" />
                </Link>
                <Link href="/industry/talent" className="footer-link">
                  <span>Industry Verified Talent Pool</span>
                  <ChevronRight size={11} className="footer-link-arrow" />
                </Link>
                <Link href="/government" className="footer-link">
                  <span>District Governance Center</span>
                  <ChevronRight size={11} className="footer-link-arrow" />
                </Link>
                <Link href="/government/fund-targeting" className="footer-link">
                  <span>CSR & Skill Voucher Allocation</span>
                  <ChevronRight size={11} className="footer-link-arrow" />
                </Link>
              </div>
            </div>

            {/* Column 4: Verification & Trust */}
            <div className="footer-nav-col">
              <h5>
                <Lock size={13} color="var(--gold)" /> Trust & Verification
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link href="/student/passport" className="footer-link">
                  <span>Cryptographic Skill Passport</span>
                  <ChevronRight size={11} className="footer-link-arrow" />
                </Link>
                <Link href="/verify/sample-hash" className="footer-link">
                  <span>Public Ledger Verifier</span>
                  <ChevronRight size={11} className="footer-link-arrow" />
                </Link>
                <Link href="/admin/fairness" className="footer-link">
                  <span>Fairness & Bias Governance</span>
                  <ChevronRight size={11} className="footer-link-arrow" />
                </Link>
                <Link href="/admin/audit-logs" className="footer-link">
                  <span>Tamper-Evident Audit Logs</span>
                  <ChevronRight size={11} className="footer-link-arrow" />
                </Link>
                <Link href="/government/heatmap" className="footer-link">
                  <span>District Workforce Heatmap</span>
                  <ChevronRight size={11} className="footer-link-arrow" />
                </Link>
                <Link href="/student/consent" className="footer-link">
                  <span>DPDP Data Consent Manager</span>
                  <ChevronRight size={11} className="footer-link-arrow" />
                </Link>
              </div>
            </div>

            {/* Column 5: Institutional Governance & Team */}
            <div className="footer-nav-col">
              <h5>
                <Terminal size={13} color="var(--gold)" /> Governance & Team
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span className="footer-link" style={{ color: '#cbd5e1' }}>
                  <span>Team Quantum Coders</span>
                </span>
                <Link href="/government/compliance" className="footer-link">
                  <span>NSQF Compliance Matrix</span>
                  <ChevronRight size={11} className="footer-link-arrow" />
                </Link>
                <Link href="/employer/validations" className="footer-link">
                  <span>Employer Competency Attestation</span>
                  <ChevronRight size={11} className="footer-link-arrow" />
                </Link>
                <Link href="/institute/upload" className="footer-link">
                  <span>Curricula Ingestion Service</span>
                  <ChevronRight size={11} className="footer-link-arrow" />
                </Link>
                <Link href="/settings/billing" className="footer-link">
                  <span>Enterprise Licensing</span>
                  <ChevronRight size={11} className="footer-link-arrow" />
                </Link>
                <span className="footer-link" style={{ color: '#64748b' }}>
                  <span>Open Source Intelligence (MIT)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Legal, Sovereignty & Copyright Rail */}
          <div className="footer-bottom-rail">
            <div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 3 }}>
                © {new Date().getFullYear()} Ryyvora AI · Developed by <strong style={{ color: '#f8fafc', fontWeight: 600 }}>Team Quantum Coders</strong>. All rights reserved.
              </div>
              <div className="font-mono" style={{ fontSize: 10.5, color: '#64748b', letterSpacing: '0.02em' }}>
                Engineered for National Workforce Intelligence, Technical Competency Verification & Sovereign Data Privacy.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', fontSize: 12 }}>
              <Link href="/student/consent" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>
                DPDP Privacy
              </Link>
              <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
              <Link href="/admin/fairness" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>
                AI Fairness Policy
              </Link>
              <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
              <Link href="/ai-health" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>
                System Status
              </Link>
              <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
              <span className="font-mono" style={{ fontSize: 11, color: 'var(--gold)', background: 'rgba(245,158,11,0.08)', padding: '2px 8px', borderRadius: 4, border: '1px solid rgba(245,158,11,0.2)' }}>
                ap-south-1 (Mumbai)
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
