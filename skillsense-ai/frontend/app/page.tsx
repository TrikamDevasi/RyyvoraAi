'use client';

import React, { useState, useEffect } from 'react';
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
  Briefcase,
} from 'lucide-react';
import { AIBadge } from '@/components/ui/AIBadge';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<'dashboard' | 'analyzer' | 'gaps' | 'career' | 'copilot' | 'passport'>('dashboard');
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
          background: scrolled ? 'rgba(9, 10, 15, 0.88)' : 'transparent',
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
            <span className="font-display" style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
              SkillSense <span style={{ color: 'var(--gold)' }}>AI</span>
            </span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex" style={{ gap: 28, alignItems: 'center' }}>
            <a href="#features" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>Features</a>
            <a href="#how-it-works" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>How It Works</a>
            <a href="#showcase" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>Platform Showcase</a>
            <a href="#stakeholders" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>Solutions</a>
            <a href="#passport" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>Skill Passport</a>
            <a href="#trust" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>Fairness & Trust</a>
          </div>

          {/* Auth Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
              <Sparkles size={13} /> Analyze Skills
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
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20 }}
          >
            <AIBadge type="live" label="NEXT-GEN WORKFORCE INTELLIGENCE" />
            <AIBadge type="nsqf" label="NSQF LEVEL ALIGNED" />
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display"
            style={{
              fontSize: 'clamp(32px, 5.5vw, 62px)',
              fontWeight: 900,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              maxWidth: 960,
              margin: '0 auto 20px',
              color: '#f8fafc',
            }}
          >
            AI-Powered Skill Intelligence Connecting{' '}
            <span className="text-gradient-gold">Education, Careers & Industry</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: 'clamp(15px, 1.8vw, 18px)',
              color: 'var(--text-secondary)',
              maxWidth: 720,
              margin: '0 auto 36px',
              lineHeight: 1.6,
            }}
          >
            Extract granular competencies from code and resumes, predict high-growth career trajectories in India, and issue cryptographically verifiable NSQF Skill Passports.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 50 }}
          >
            <Link
              href="/student/analyzer"
              className="btn-gold"
              style={{ fontSize: 14, padding: '12px 28px', boxShadow: '0 4px 20px rgba(245,158,11,0.3)' }}
            >
              <Brain size={16} /> Analyze My Skills Free <ArrowRight size={15} />
            </Link>

            <Link
              href="/student"
              className="btn-secondary"
              style={{ fontSize: 14, padding: '12px 26px' }}
            >
              Explore Live Intelligence Dashboard
            </Link>
          </motion.div>

          {/* ── Realistic Product Dashboard Preview ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="card-accent"
            style={{
              maxWidth: 1040,
              margin: '0 auto',
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
              <div style={{ padding: 18, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase' }}>
                  Verified Readiness Score
                </div>
                <div className="font-display" style={{ fontSize: 32, fontWeight: 900, color: '#f8fafc', marginTop: 2 }}>
                  84<span style={{ fontSize: 16, color: 'var(--text-muted)' }}>/100</span>
                </div>
                <div style={{ fontSize: 12, color: '#10b981', fontWeight: 600, marginTop: 4 }}>
                  ✓ NSQF Level 5 (Software Engineering)
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>
                  Top Strengths: TypeScript, Node.js REST APIs, Database Optimization.
                </div>
              </div>

              {/* Career Match */}
              <div style={{ padding: 18, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#60a5fa', textTransform: 'uppercase' }}>
                  Top Career Match
                </div>
                <div className="font-display" style={{ fontSize: 20, fontWeight: 800, color: '#f8fafc', marginTop: 4 }}>
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
              <div style={{ padding: 18, borderRadius: 12, background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase' }}>
                  <Sparkles size={13} /> Active AI Copilot Recommendation
                </div>
                <p style={{ fontSize: 12.5, color: '#cbd5e1', lineHeight: 1.5, margin: '8px 0 0' }}>
                  "Candidate has demonstrated advanced API and state management capabilities. Closing the container orchestration gap will accelerate placement readiness in Tier-1 tech hubs."
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 3. Platform Credibility & Tech Partners Grid ── */}
      <section style={{ padding: '36px 24px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'rgba(15,17,26,0.6)' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>
            Architected With Multi-Provider AI Inference & National Standards
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'clamp(20px, 4vw, 48px)', flexWrap: 'wrap' }}>
            {[
              { label: 'Groq Cloud Llama-3.3', sub: 'Ultra-Low Latency Inference' },
              { label: 'OpenAI GPT-4o Mini', sub: 'Advanced Multi-Vector Reasoning' },
              { label: 'Perplexity Sonar', sub: 'Real-Time Market Grounding' },
              { label: 'NSQF National Framework', sub: 'Govt Aligned Qualifications' },
              { label: 'SHA-256 HMAC Signatures', sub: 'Immutable Credential Ledger' },
              { label: 'Algorithmic Fairness 4/5ths', sub: 'Automated Bias Auditing' },
            ].map((item, idx) => (
              <div key={idx} style={{ textAlign: 'left', minWidth: 160 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc' }}>{item.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.sub}</div>
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
              { step: '01', title: 'Raw Profile / Code', desc: 'Resumes, GitHub commits, coursework and project scope' },
              { step: '02', title: 'Neural Extraction', desc: '50+ competency dimensions evaluated against NSQF' },
              { step: '03', title: 'Skill Graph & Gaps', desc: 'Deficiency matrix and step-by-step milestone roadmap' },
              { step: '04', title: 'Career Matcher', desc: 'Live market compatibility & salary projections in INR' },
              { step: '05', title: 'Verified Passport', desc: 'Cryptographically signed SHA-256 public credential' },
            ].map((node, i) => (
              <div
                key={i}
                className="card-linear"
                style={{ padding: 18, position: 'relative', borderTop: '2px solid var(--gold)' }}
              >
                <span className="font-mono" style={{ fontSize: 11, fontWeight: 800, color: 'var(--gold)' }}>
                  {node.step}
                </span>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', margin: '6px 0 4px' }}>
                  {node.title}
                </h4>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                  {node.desc}
                </p>
              </div>
            ))}
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
            <div className="card-linear" style={{ padding: 24 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', marginBottom: 16 }}>
                <Brain size={20} />
              </div>
              <h3 className="font-display" style={{ fontSize: 17, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
                Multi-Modal AI Skill Analyzer
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
                <strong>WHAT:</strong> Ingests raw resume text, GitHub repositories, and submitted code snippets.<br />
                <strong>WHY:</strong> Eliminates keyword stuffing by verifying actual architectural and coding syntax.<br />
                <strong>HOW:</strong> Powered by Groq Llama-3.3-70b with safe JSON repair and NSQF taxonomy mapping.
              </p>
              <Link href="/student/analyzer" style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--gold)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                Test Skill Analyzer <ChevronRight size={14} />
              </Link>
            </div>

            {/* Feature 2: Career Prediction */}
            <div className="card-linear" style={{ padding: 24 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', marginBottom: 16 }}>
                <Compass size={20} />
              </div>
              <h3 className="font-display" style={{ fontSize: 17, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
                Predictive Career Pathways
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
                <strong>WHAT:</strong> Matches candidate competencies to high-growth Indian tech roles.<br />
                <strong>WHY:</strong> Prevents career misalignment by forecasting market demand and compensation.<br />
                <strong>HOW:</strong> Calculates mathematical compatibility scores and transparent INR model estimates.
              </p>
              <Link href="/student/career" style={{ fontSize: 12.5, fontWeight: 700, color: '#60a5fa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                Explore Career Paths <ChevronRight size={14} />
              </Link>
            </div>

            {/* Feature 3: Gap Analysis */}
            <div className="card-linear" style={{ padding: 24 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', marginBottom: 16 }}>
                <AlertTriangle size={20} />
              </div>
              <h3 className="font-display" style={{ fontSize: 17, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
                Dynamic Skill Gap Analysis
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
                <strong>WHAT:</strong> Compares student skills against target enterprise benchmarks.<br />
                <strong>WHY:</strong> Gives learners concrete clarity on what to study rather than generic advice.<br />
                <strong>HOW:</strong> Generates priority-tagged deficiencies and phase-by-phase timeline roadmaps.
              </p>
              <Link href="/student" style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--gold)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                View Gap Roadmap <ChevronRight size={14} />
              </Link>
            </div>

            {/* Feature 4: Cryptographic Passport */}
            <div className="card-linear" style={{ padding: 24 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', marginBottom: 16 }}>
                <Award size={20} />
              </div>
              <h3 className="font-display" style={{ fontSize: 17, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
                Verifiable Skill Passport
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
                <strong>WHAT:</strong> A tamper-proof digital credential issued with a cryptographic hash.<br />
                <strong>WHY:</strong> Employers can verify skills in seconds without relying on self-reported resumes.<br />
                <strong>HOW:</strong> SHA-256 HMAC digest computed over student scores and NSQF certification tier.
              </p>
              <Link href="/student/passport" style={{ fontSize: 12.5, fontWeight: 700, color: '#10b981', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                Inspect Passport <ChevronRight size={14} />
              </Link>
            </div>

            {/* Feature 5: Adaptive Assessments */}
            <div className="card-linear" style={{ padding: 24 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', marginBottom: 16 }}>
                <CheckCircle2 size={20} />
              </div>
              <h3 className="font-display" style={{ fontSize: 17, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
                Adaptive Assessment Engine
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
                <strong>WHAT:</strong> Distraction-free diagnostic quizzes with keyboard navigation (A, B, C, D).<br />
                <strong>WHY:</strong> Continuously validates real practical mastery across multiple difficulty tiers.<br />
                <strong>HOW:</strong> Dynamic question synthesis, automated grading, and instant passport ledger sync.
              </p>
              <Link href="/student/assessment" style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--gold)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                Take Diagnostic Quiz <ChevronRight size={14} />
              </Link>
            </div>

            {/* Feature 6: Real-Time Copilot */}
            <div className="card-linear" style={{ padding: 24 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(168,85,247,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc', marginBottom: 16 }}>
                <Bot size={20} />
              </div>
              <h3 className="font-display" style={{ fontSize: 17, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
                Profile-Aware AI Copilot
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
                <strong>WHAT:</strong> Conversational mentor embedded natively into the student dashboard.<br />
                <strong>WHY:</strong> Answers personalized questions about interview prep, salary, and gap closure.<br />
                <strong>HOW:</strong> Injects live student NSQF competencies into prompts with SSE typewriter streaming.
              </p>
              <Link href="/student" style={{ fontSize: 12.5, fontWeight: 700, color: '#c084fc', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                Chat with Copilot <ChevronRight size={14} />
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
              <div style={{ padding: 16, background: '#090a0f', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>Candidate: Arjun Mehta (SKP-7819)</span>
                  <AIBadge type="verified" label="VERIFIED" />
                </div>
                <div className="font-mono" style={{ fontSize: 11, color: '#94a3b8', wordBreak: 'break-all', background: 'rgba(255,255,255,0.03)', padding: 8, borderRadius: 6 }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {[
              { num: '01', title: 'Submit Profile & Code', desc: 'Paste your resume, link a public GitHub repository, or describe technical project architecture.' },
              { num: '02', title: 'Multi-Vector AI Extraction', desc: 'Neural models extract competencies across 50+ technical, architectural, and soft skill vectors.' },
              { num: '03', title: 'Identify Gaps & Milestones', desc: 'Instant gap analysis benchmarks your capabilities against top tech employers in India.' },
              { num: '04', title: 'Issue Verifiable Passport', desc: 'Receive a cryptographically signed digital credential to share with employers and recruiters.' },
            ].map((step, i) => (
              <div key={i} className="card-linear" style={{ padding: 22 }}>
                <span className="font-display text-gradient-gold" style={{ fontSize: 28, fontWeight: 900 }}>
                  {step.num}
                </span>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', margin: '10px 0 6px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Multi-Stakeholder Solutions ── */}
      <section id="stakeholders" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <AIBadge type="ai" label="ECOSYSTEM IMPACT" />
            <h2 className="font-display" style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 800, color: '#f8fafc', margin: '8px 0 10px' }}>
              Built for Every Workforce Stakeholder
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
              Tailored workspaces engineered for students, educators, employers, and policymakers.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 18 }}>
            {/* Students */}
            <div className="card-linear" style={{ padding: 24, borderTop: '3px solid var(--gold)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', marginBottom: 14 }}>
                <Users size={18} />
              </div>
              <h3 className="font-display" style={{ fontSize: 17, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
                For Students & Learners
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
                Understand your true technical baseline, close high-impact skill gaps with personalized roadmaps, and showcase verifiable Skill Passports to recruiters.
              </p>
              <Link href="/student" style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--gold)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                Student Workspace →
              </Link>
            </div>

            {/* Institutions */}
            <div className="card-linear" style={{ padding: 24, borderTop: '3px solid #60a5fa' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', marginBottom: 14 }}>
                <Building2 size={18} />
              </div>
              <h3 className="font-display" style={{ fontSize: 17, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
                For Universities & Colleges
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
                Benchmark batch outcomes, detect curriculum alignment deficiencies against hiring trends, and prove educational ROI with automated institutional reporting.
              </p>
              <Link href="/institute" style={{ fontSize: 12.5, fontWeight: 700, color: '#60a5fa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                Institute Portal →
              </Link>
            </div>

            {/* Employers */}
            <div className="card-linear" style={{ padding: 24, borderTop: '3px solid #10b981' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', marginBottom: 14 }}>
                <Briefcase size={18} />
              </div>
              <h3 className="font-display" style={{ fontSize: 17, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
                For Industry & Employers
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
                Cut recruitment screening latency by searching pre-verified candidate talent pools with immutable skill proofs and diagnostic audit trails.
              </p>
              <Link href="/industry" style={{ fontSize: 12.5, fontWeight: 700, color: '#10b981', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                Industry Portal →
              </Link>
            </div>

            {/* Government */}
            <div className="card-linear" style={{ padding: 24, borderTop: '3px solid #c084fc' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(168,85,247,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc', marginBottom: 14 }}>
                <Landmark size={18} />
              </div>
              <h3 className="font-display" style={{ fontSize: 17, fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>
                For Government & Policymakers
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
                Access macro-economic talent supply/demand heatmaps across Indian states, monitor NSQF compliance, and simulate vocational funding impact.
              </p>
              <Link href="/government" style={{ fontSize: 12.5, fontWeight: 700, color: '#c084fc', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                Governance Center →
              </Link>
            </div>
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
            <div style={{ padding: 20, background: '#090a0f', borderRadius: 14, border: '1px solid var(--border)', maxWidth: 420, width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 10, marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc' }}>Digital Passport #SKP-7819</div>
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
            style={{ fontSize: 14.5, padding: '13px 36px', boxShadow: '0 6px 28px rgba(245,158,11,0.35)' }}
          >
            <Sparkles size={16} /> Start Your Free Skill Analysis <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── 12. Enterprise Footer ── */}
      <footer style={{ padding: '50px 24px 30px', borderTop: '1px solid var(--border)', background: '#07080c' }}>
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
