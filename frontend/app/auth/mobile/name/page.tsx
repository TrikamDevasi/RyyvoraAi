'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore, UserRole } from '@/store/authStore';
import {
  User,
  GraduationCap,
  Briefcase,
  Building2,
  Globe,
  Factory,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  CircleAlert,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { RyyvoraMark } from '@/components/shared/BrandLogo';
import '../../auth.css';

const AVAILABLE_ROLES: { key: UserRole; label: string; desc: string; icon: any; badge: string }[] = [
  {
    key: 'student',
    label: 'Student / Trainee',
    desc: 'Skill Passport & Career Outcomes',
    icon: GraduationCap,
    badge: 'Candidate',
  },
  {
    key: 'employer',
    label: 'Employer / Recruiter',
    desc: 'Verified Talent & Direct Hiring',
    icon: Briefcase,
    badge: 'Corporate',
  },
  {
    key: 'institute',
    label: 'Training Institute',
    desc: 'Cohort Metrics & Placement ROI',
    icon: Building2,
    badge: 'Academia',
  },
  {
    key: 'government',
    label: 'Govt / Policy Official',
    desc: 'District Heatmaps & Policy Analytics',
    icon: Globe,
    badge: 'National',
  },
  {
    key: 'industry',
    label: 'Industry Association',
    desc: 'Labor Demand & Sector Foresight',
    icon: Factory,
    badge: 'Ecosystem',
  },
];

const ROLE_DASHBOARD: Record<string, string> = {
  student: '/student',
  employer: '/employer',
  institute: '/institute',
  government: '/government',
  industry: '/industry',
};

export default function MobileNamePage() {
  const router = useRouter();
  const { mobileState, completeMobileRegistration } = useAuthStore();

  const [name, setName] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Guard: Ensure user has a valid registrationToken
  useEffect(() => {
    if (!mobileState?.registrationToken) {
      toast.error('Session expired. Please verify your mobile number.');
      router.replace('/auth');
    }
  }, [mobileState, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 80) {
      setError('Please enter a valid full name between 2 and 80 characters.');
      return;
    }

    if (!mobileState?.registrationToken) {
      setError('Verification session expired. Please verify your mobile number again.');
      return;
    }

    setLoading(true);

    try {
      const result = await completeMobileRegistration(
        mobileState.registrationToken,
        trimmedName,
        selectedRole
      );

      toast.success(`Welcome to Ryyvora AI, ${result.user.name}!`);
      const destination = ROLE_DASHBOARD[selectedRole] || '/student';
      window.location.replace(destination);
    } catch (err: any) {
      setLoading(false);
      const msg = err.response?.data?.message || err.message || 'Failed to complete profile. Please try again.';
      setError(msg);
    }
  };

  return (
    <div className="auth-page">
      {/* ── Top Bar ── */}
      <header className="auth-top-bar">
        <Link href="/" className="auth-brand-link" aria-label="Ryyvora AI Home">
          <div className="auth-brand-monogram">
            <RyyvoraMark size={28} />
          </div>
          <div className="auth-brand-meta">
            <span className="auth-brand-name">
              Ryyvora <span>AI</span>
            </span>
            <span className="auth-brand-descriptor">Workforce Outcome Intelligence</span>
          </div>
        </Link>

        <div className="auth-trust-signal">
          <ShieldCheck size={14} color="#10B981" />
          <span>Privacy-conscious workforce intelligence</span>
          <span className="auth-trust-dot" />
        </div>
      </header>

      {/* ── Main Auth Surface ── */}
      <main className="auth-main-wrap">
        <div className="auth-surface" style={{ maxWidth: 480 }}>
          
          {/* Header */}
          <div className="auth-header">
            <div
              className="auth-eyebrow"
              style={{
                background: 'rgba(16, 185, 129, 0.10)',
                borderColor: 'rgba(16, 185, 129, 0.28)',
                color: '#34d399',
              }}
            >
              <CheckCircle2 size={12} />
              <span>Mobile Verified</span>
            </div>

            <h1 className="auth-title">Welcome to Ryyvora AI</h1>
            <p className="auth-subtitle">
              What is your name? Set up your verified workforce profile to continue to your workspace.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="auth-alert-error" role="alert" style={{ marginBottom: 16 }}>
              <CircleAlert size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <strong style={{ display: 'block', fontSize: 13, marginBottom: 2 }}>Profile setup failed</strong>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Setup Form */}
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="auth-field">
              <label htmlFor="mobile-user-name" className="auth-label">
                Full name
              </label>
              <div className="auth-input-container">
                <div className="auth-icon-slot">
                  <User size={17} />
                </div>
                <input
                  id="mobile-user-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g. Aarav Sharma"
                  className="auth-text-input"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Select your platform role</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 2 }}>
                {AVAILABLE_ROLES.map(({ key, label, desc, icon: Icon, badge }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedRole(key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: 8,
                      background: selectedRole === key ? 'rgba(245, 158, 11, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${selectedRole === key ? 'var(--brand-gold, #F59E0B)' : 'rgba(255, 255, 255, 0.08)'}`,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 150ms ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 6,
                          background: selectedRole === key ? 'var(--brand-gold, #F59E0B)' : 'rgba(255, 255, 255, 0.06)',
                          color: selectedRole === key ? '#090A0F' : 'var(--text-secondary, #94A3B8)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={16} />
                      </div>
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary, #F8FAFC)', display: 'block' }}>
                          {label}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted, #64748B)' }}>
                          {desc}
                        </span>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: selectedRole === key ? 'var(--brand-gold, #F59E0B)' : 'var(--text-muted, #64748B)',
                        fontFamily: 'var(--font-mono, monospace)',
                      }}
                    >
                      {badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="auth-btn-primary"
              disabled={loading || name.trim().length < 2}
            >
              {loading ? (
                <span>Configuring your workspace...</span>
              ) : (
                <>
                  <span>Complete Setup & Continue</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* DPDP Legal Note */}
          <div className="auth-legal-text">
            <span>
              By continuing, you agree to Ryyvora AI's{' '}
              <Link href="/privacy">Privacy Policy</Link> and{' '}
              <Link href="/terms">Terms of Service</Link>.
            </span>
          </div>

        </div>
      </main>
    </div>
  );
}
