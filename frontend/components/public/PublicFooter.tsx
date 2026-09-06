// frontend/components/public/PublicFooter.tsx
import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Landmark,
  Lock,
  Globe,
  Building2,
  Brain,
  Terminal,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import BrandLogo from '@/components/shared/BrandLogo';

export default function PublicFooter() {
  return (
    <footer className="enterprise-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: 'var(--bg-surface-elevated, #0b0d14)', padding: '60px 24px 36px' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        {/* Telemetry Strip */}
        <div className="footer-telemetry-banner" style={{ marginBottom: 44, padding: '12px 18px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link
              href="/employer-verification"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 7,
                background: 'rgba(245,158,11,0.12)',
                border: '1px solid rgba(245,158,11,0.28)',
                color: 'var(--gold, #f59e0b)',
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

        {/* 5-Column Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 36,
            marginBottom: 48,
          }}
        >
          {/* Column 1: Brand */}
          <div>
            <div style={{ marginBottom: 14 }}>
              <BrandLogo variant="full" size="md" withTagline />
            </div>

            <p style={{ fontSize: 12.5, color: '#94a3b8', lineHeight: 1.6, margin: '0 0 18px' }}>
              Sovereign workforce outcome intelligence and cryptographic credential verification platform. Connecting higher education, skill development, and enterprise hiring through deterministic competency analytics.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <span className="footer-cert-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', fontSize: 10.5, color: '#94a3b8' }}>
                <Landmark size={11} color="var(--gold, #f59e0b)" /> NSQF Level 4–8
              </span>
              <span className="footer-cert-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', fontSize: 10.5, color: '#94a3b8' }}>
                <ShieldCheck size={11} color="#10b981" /> DPDP 2023
              </span>
              <span className="footer-cert-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', fontSize: 10.5, color: '#94a3b8' }}>
                <Lock size={11} color="#38bdf8" /> SHA-256 HMAC
              </span>
              <span className="footer-cert-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', fontSize: 10.5, color: '#94a3b8' }}>
                <Globe size={11} color="#a855f7" /> W3C Verifiable
              </span>
            </div>
          </div>

          {/* Column 2: Stakeholder Solutions */}
          <div className="footer-nav-col">
            <h5 style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Building2 size={13} color="var(--gold, #f59e0b)" /> Stakeholder Solutions
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href="/for-government" className="footer-link">
                <span>Government Policy Intelligence</span>
                <ChevronRight size={11} className="footer-link-arrow" />
              </Link>
              <Link href="/for-employers" className="footer-link">
                <span>Employer Outcome Verification</span>
                <ChevronRight size={11} className="footer-link-arrow" />
              </Link>
              <Link href="/for-training-providers" className="footer-link">
                <span>Training Provider ROI & Placements</span>
                <ChevronRight size={11} className="footer-link-arrow" />
              </Link>
              <Link href="/for-trainees" className="footer-link">
                <span>Trainee Skill Passport & Mobility</span>
                <ChevronRight size={11} className="footer-link-arrow" />
              </Link>
              <Link href="/pricing" className="footer-link">
                <span>Institutional Pricing Plans</span>
                <ChevronRight size={11} className="footer-link-arrow" />
              </Link>
              <Link href="/how-it-works" className="footer-link">
                <span>Outcome Lifecycle Architecture</span>
                <ChevronRight size={11} className="footer-link-arrow" />
              </Link>
            </div>
          </div>

          {/* Column 3: Intelligence Engines */}
          <div className="footer-nav-col">
            <h5 style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Brain size={13} color="var(--gold, #f59e0b)" /> Intelligence Engines
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href="/workforce-analytics" className="footer-link">
                <span>Workforce & Retention Analytics</span>
                <ChevronRight size={11} className="footer-link-arrow" />
              </Link>
              <Link href="/skill-passport" className="footer-link">
                <span>Verifiable Skill Passport</span>
                <ChevronRight size={11} className="footer-link-arrow" />
              </Link>
              <Link href="/employer-verification" className="footer-link">
                <span>Employer Verification Portal</span>
                <ChevronRight size={11} className="footer-link-arrow" />
              </Link>
              <Link href="/policy-intelligence" className="footer-link">
                <span>Policy Intelligence & Heatmaps</span>
                <ChevronRight size={11} className="footer-link-arrow" />
              </Link>
              <Link href="/dpdp-trust" className="footer-link">
                <span>Sovereign Data Governance</span>
                <ChevronRight size={11} className="footer-link-arrow" />
              </Link>
            </div>
          </div>

          {/* Column 4: Trust & Standards */}
          <div className="footer-nav-col">
            <h5 style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Lock size={13} color="var(--gold, #f59e0b)" /> Trust & Standards
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href="/employer-verification" className="footer-link">
                <span>Public Ledger Verifier</span>
                <ChevronRight size={11} className="footer-link-arrow" />
              </Link>
              <Link href="/dpdp-trust" className="footer-link">
                <span>DPDP Act 2023 Compliance</span>
                <ChevronRight size={11} className="footer-link-arrow" />
              </Link>
              <Link href="/skill-passport" className="footer-link">
                <span>W3C Verifiable Credentials</span>
                <ChevronRight size={11} className="footer-link-arrow" />
              </Link>
              <Link href="/for-government" className="footer-link">
                <span>NSQF Level 4–8 Matrix</span>
                <ChevronRight size={11} className="footer-link-arrow" />
              </Link>
              <Link href="/about" className="footer-link">
                <span>Tamper-Evident HMAC Proofs</span>
                <ChevronRight size={11} className="footer-link-arrow" />
              </Link>
            </div>
          </div>

          {/* Column 5: Company & Support */}
          <div className="footer-nav-col">
            <h5 style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Terminal size={13} color="var(--gold, #f59e0b)" /> Company & Support
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href="/about" className="footer-link">
                <span>About Ryyvora AI</span>
                <ChevronRight size={11} className="footer-link-arrow" />
              </Link>
              <Link href="/pricing" className="footer-link">
                <span>Pricing & Licensing</span>
                <ChevronRight size={11} className="footer-link-arrow" />
              </Link>
              <Link href="/faq" className="footer-link">
                <span>Knowledge Base & FAQ</span>
                <ChevronRight size={11} className="footer-link-arrow" />
              </Link>
              <Link href="/contact" className="footer-link">
                <span>Institutional Consultation</span>
                <ChevronRight size={11} className="footer-link-arrow" />
              </Link>
              <Link href="/auth" className="footer-link">
                <span>Sign In to Workspace</span>
                <ChevronRight size={11} className="footer-link-arrow" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
            © {new Date().getFullYear()} Ryyvora AI Technologies. All rights reserved. From Skills to Sustainable Outcomes.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12 }}>
            <Link href="/dpdp-trust" style={{ color: '#94a3b8', textDecoration: 'none' }}>
              Privacy & DPDP Policy
            </Link>
            <Link href="/about" style={{ color: '#94a3b8', textDecoration: 'none' }}>
              Governance Standards
            </Link>
            <Link href="/contact" style={{ color: '#94a3b8', textDecoration: 'none' }}>
              Support Desk
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
