// frontend/components/public/PublicNavbar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  Building2,
  Brain,
  ChevronDown,
  Menu,
  X,
  GraduationCap,
  School,
  Briefcase,
  Landmark,
  BarChart3,
  FileCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import ThemeToggle from '@/components/shared/ThemeToggle';
import BrandLogo from '@/components/shared/BrandLogo';
import { useAuth } from '@/hooks/useAuth';

export default function PublicNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const getStartedHref = isAuthenticated
    ? user?.role === 'employer'
      ? '/employer'
      : user?.role === 'government'
      ? '/government'
      : user?.role === 'institute'
      ? '/institute'
      : '/student'
    : '/auth';

  return (
    <header className="landing-header-wrapper is-scrolled" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Top Sovereignty & Compliance Bar */}
      <div className="landing-top-bar">
        <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="landing-gov-badge">
              <Landmark size={11} /> Sovereign Workforce Intelligence
            </span>
            <span className="hidden sm:inline font-mono" style={{ fontSize: 11, color: '#94a3b8' }}>
              NSQF Level 4–8 Aligned · DPDP Act 2023 Compliant · Mumbai Data Residency
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11 }} className="font-mono">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
              Ledger Live (99.98%)
            </span>
            <span style={{ color: 'rgba(255,255,255,0.15)' }} className="hidden sm:inline">|</span>
            <Link
              href="/employer-verification"
              style={{ color: 'var(--gold, #f59e0b)', textDecoration: 'none', fontWeight: 700, fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4 }}
              className="font-mono"
            >
              Public Ledger Verifier <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <div className="landing-header-glass">
        <div className="landing-navbar">
          {/* Logo */}
          <Link href="/" aria-label="Ryyvora AI home" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
            <BrandLogo variant="full" size="md" withTagline />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="landing-nav-links">
            {/* Workspaces Dropdown */}
            <div className="nav-item-dropdown">
              <button className="nav-link-pill" style={{ background: 'transparent', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Workspaces <ChevronDown size={13} style={{ opacity: 0.7 }} />
              </button>
              <div className="nav-dropdown-menu">
                <Link href="/for-trainees" className="nav-dropdown-item">
                  <div className="nav-dropdown-icon">
                    <GraduationCap size={15} />
                  </div>
                  <div>
                    <div className="nav-dropdown-title" style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Trainee & Student Hub</div>
                    <div className="nav-dropdown-desc" style={{ fontSize: 11, color: 'var(--text-muted)' }}>Portfolio, verifiable passport & career mobility</div>
                  </div>
                </Link>
                <Link href="/for-training-providers" className="nav-dropdown-item">
                  <div className="nav-dropdown-icon">
                    <School size={15} />
                  </div>
                  <div>
                    <div className="nav-dropdown-title" style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Training Providers</div>
                    <div className="nav-dropdown-desc" style={{ fontSize: 11, color: 'var(--text-muted)' }}>Accreditation, cohort ROI & placement tracking</div>
                  </div>
                </Link>
                <Link href="/for-employers" className="nav-dropdown-item">
                  <div className="nav-dropdown-icon">
                    <Briefcase size={15} />
                  </div>
                  <div>
                    <div className="nav-dropdown-title" style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Employer Intelligence</div>
                    <div className="nav-dropdown-desc" style={{ fontSize: 11, color: 'var(--text-muted)' }}>Verified candidates with zero credential fraud</div>
                  </div>
                </Link>
                <Link href="/for-government" className="nav-dropdown-item">
                  <div className="nav-dropdown-icon">
                    <Landmark size={15} />
                  </div>
                  <div>
                    <div className="nav-dropdown-title" style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Government & Policy</div>
                    <div className="nav-dropdown-desc" style={{ fontSize: 11, color: 'var(--text-muted)' }}>District skill heatmaps & policy analytics</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Engines Dropdown */}
            <div className="nav-item-dropdown">
              <button className="nav-link-pill" style={{ background: 'transparent', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Engines <ChevronDown size={13} style={{ opacity: 0.7 }} />
              </button>
              <div className="nav-dropdown-menu">
                <Link href="/workforce-analytics" className="nav-dropdown-item">
                  <div className="nav-dropdown-icon">
                    <BarChart3 size={15} />
                  </div>
                  <div>
                    <div className="nav-dropdown-title" style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Workforce Analytics</div>
                    <div className="nav-dropdown-desc" style={{ fontSize: 11, color: 'var(--text-muted)' }}>Macro hiring trends & longitudinal retention</div>
                  </div>
                </Link>
                <Link href="/skill-passport" className="nav-dropdown-item">
                  <div className="nav-dropdown-icon">
                    <FileCheck size={15} />
                  </div>
                  <div>
                    <div className="nav-dropdown-title" style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Skill Passport</div>
                    <div className="nav-dropdown-desc" style={{ fontSize: 11, color: 'var(--text-muted)' }}>W3C Verifiable Credentials & SHA-256 HMAC</div>
                  </div>
                </Link>
                <Link href="/employer-verification" className="nav-dropdown-item">
                  <div className="nav-dropdown-icon">
                    <ShieldCheck size={15} />
                  </div>
                  <div>
                    <div className="nav-dropdown-title" style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Employer Verification</div>
                    <div className="nav-dropdown-desc" style={{ fontSize: 11, color: 'var(--text-muted)' }}>Instant cryptographic credential verification</div>
                  </div>
                </Link>
                <Link href="/policy-intelligence" className="nav-dropdown-item">
                  <div className="nav-dropdown-icon">
                    <Brain size={15} />
                  </div>
                  <div>
                    <div className="nav-dropdown-title" style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Policy Intelligence</div>
                    <div className="nav-dropdown-desc" style={{ fontSize: 11, color: 'var(--text-muted)' }}>District skilling heatmaps & voucher targeting</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Direct Links */}
            <Link href="/how-it-works" className={`nav-link-pill ${pathname === '/how-it-works' ? 'active' : ''}`} style={{ whiteSpace: 'nowrap' }}>
              How It Works
            </Link>
            <Link href="/brainstorm" className={`nav-link-pill ${pathname === '/brainstorm' ? 'active' : ''}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
              <Sparkles size={13} style={{ color: 'var(--gold, #f59e0b)' }} />
              <span>Brainstorm</span>
            </Link>
            <Link href="/skill-passport" className={`nav-link-pill ${pathname === '/skill-passport' ? 'active' : ''}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
              <span>Skill Passport</span>
              <span style={{ fontSize: 9.5, fontWeight: 700, padding: '1px 5px', borderRadius: 4, background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)', whiteSpace: 'nowrap' }}>
                SHA-256
              </span>
            </Link>
            <Link href="/#pricing" className={`nav-link-pill ${pathname === '/pricing' ? 'active' : ''}`} style={{ whiteSpace: 'nowrap' }}>
              Pricing & Billing
            </Link>
            <Link href="/faq" className={`nav-link-pill ${pathname === '/faq' ? 'active' : ''}`} style={{ whiteSpace: 'nowrap' }}>
              FAQ
            </Link>
            <Link href="/dpdp-trust" className={`nav-link-pill ${pathname === '/dpdp-trust' ? 'active' : ''}`} style={{ whiteSpace: 'nowrap' }}>
              DPDP Trust
            </Link>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <Link href="/employer-verification" className="nav-verify-btn" style={{ whiteSpace: 'nowrap' }}>
              <ShieldCheck size={14} /> Verify Hash
            </Link>

            <div style={{ minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ThemeToggle variant="icon" />
            </div>

            {!isAuthenticated && (
              <Link
                href="/auth"
                className="btn-secondary landing-signin-btn"
                style={{ fontSize: 12.5, fontWeight: 600, padding: '6px 14px', borderRadius: 7, whiteSpace: 'nowrap' }}
              >
                Sign In
              </Link>
            )}

            <Link
              href={getStartedHref}
              className="btn-gold landing-header-cta"
              style={{ fontSize: 12.5, fontWeight: 700, padding: '7px 16px', borderRadius: 7, display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
            >
              {isAuthenticated ? 'Dashboard' : 'Get Started'} <ArrowRight size={13} />
            </Link>

            {/* Mobile Hamburger */}
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f8fafc',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-nav-drawer">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="mobile-nav-group-label">Stakeholder Solutions</div>
              <Link href="/for-trainees" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link-item">
                <GraduationCap size={15} /> For Trainees & Students
              </Link>
              <Link href="/for-training-providers" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link-item">
                <School size={15} /> For Training Providers
              </Link>
              <Link href="/for-employers" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link-item">
                <Briefcase size={15} /> For Employers
              </Link>
              <Link href="/for-government" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link-item">
                <Landmark size={15} /> For Government & Policy
              </Link>

              <div className="mobile-nav-group-label" style={{ marginTop: 10 }}>Intelligence Engines</div>
              <Link href="/brainstorm" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link-item" style={{ color: 'var(--gold, #f59e0b)', fontWeight: 700 }}>
                <Sparkles size={15} /> AI Brainstorm Cockpit
              </Link>
              <Link href="/workforce-analytics" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link-item">
                <BarChart3 size={15} /> Workforce Analytics
              </Link>
              <Link href="/skill-passport" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link-item">
                <FileCheck size={15} /> Verifiable Skill Passport
              </Link>
              <Link href="/employer-verification" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link-item">
                <ShieldCheck size={15} /> Employer Verification
              </Link>
              <Link href="/policy-intelligence" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link-item">
                <Brain size={15} /> Policy Intelligence
              </Link>

              <div className="mobile-nav-group-label" style={{ marginTop: 10 }}>Resources & Trust</div>
              <Link href="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link-item">
                How It Works
              </Link>
              <Link href="/#pricing" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link-item">
                Pricing & Billing
              </Link>
              <Link href="/faq" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link-item">
                FAQ
              </Link>
              <Link href="/dpdp-trust" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link-item">
                DPDP Act 2023 Trust
              </Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link-item">
                About Ryyvora AI
              </Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="mobile-nav-link-item">
                Contact & Pilot Inquiries
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
