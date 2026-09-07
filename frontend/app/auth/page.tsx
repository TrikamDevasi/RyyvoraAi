'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore, UserRole } from '@/store/authStore';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  User,
  GraduationCap,
  Briefcase,
  Building2,
  Globe,
  Factory,
  Settings,
  ShieldCheck,
  CircleAlert,
  Smartphone,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { RyyvoraMark } from '@/components/shared/BrandLogo';
import './auth.css';

const ROLES: { key: UserRole; label: string; desc: string; icon: any; href: string; badge: string }[] = [
  { key: 'student', label: 'Student', desc: 'Skill Passport & Outcomes', icon: GraduationCap, href: '/student', badge: 'Candidate' },
  { key: 'employer', label: 'Employer', desc: 'Verified Talent & Hiring', icon: Briefcase, href: '/employer', badge: 'Corporate' },
  { key: 'institute', label: 'Institute', desc: 'Cohort Metrics & ROI', icon: Building2, href: '/institute', badge: 'Academia' },
  { key: 'government', label: 'Govt / Policy', desc: 'District Skill Heatmaps', icon: Globe, href: '/government', badge: 'National' },
  { key: 'industry', label: 'Industry', desc: 'Labor Demand Foresight', icon: Factory, href: '/industry', badge: 'Ecosystem' },
  { key: 'admin', label: 'Admin', desc: 'Platform Governance & Audit', icon: Settings, href: '/admin', badge: 'System' },
];

const ROLE_DASHBOARD: Record<string, string> = {
  student: '/student',
  employer: '/employer',
  institute: '/institute',
  government: '/government',
  industry: '/industry',
  admin: '/admin',
};


/**
 * Validates and sanitizes redirect destinations to prevent open redirect vulnerabilities.
 * Only allows safe, relative internal paths starting with a single '/' and rejects protocols/cross-origins.
 */
function getSafeRedirect(redirectParam: string | null, fallback: string): string {
  if (!redirectParam) return fallback;
  const trimmed = redirectParam.trim();
  if (
    !trimmed.startsWith('/') ||
    trimmed.startsWith('//') ||
    trimmed.startsWith('/\\') ||
    trimmed.includes('\\') ||
    trimmed.toLowerCase().startsWith('/javascript:') ||
    trimmed.toLowerCase().startsWith('/data:')
  ) {
    return fallback;
  }
  try {
    const parsed = new URL(trimmed, 'https://ryyvora.local');
    if (parsed.origin !== 'https://ryyvora.local') {
      return fallback;
    }
    return parsed.pathname + (parsed.search || '');
  } catch {
    return fallback;
  }
}

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register, setAuth, sendMobileOtp } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [authMethod, setAuthMethod] = useState<'email' | 'mobile'>('email');
  const [mobilePhone, setMobilePhone] = useState('');
  const [mobileLoading, setMobileLoading] = useState(false);

  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const methodParam = searchParams.get('method');
    if (methodParam === 'mobile') {
      setAuthMethod('mobile');
    }
  }, [searchParams]);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'signup') {
      setActiveTab('signup');
    }
  }, [searchParams]);

  useEffect(() => {
    const errParam = searchParams.get('error');
    if (errParam) {
      const messages: Record<string, string> = {
        google_failed: 'Google sign in failed. Please try again.',
        github_failed: 'GitHub sign in failed. Please try again.',
        oauth_failed: 'OAuth sign in was interrupted. Please try again.',
        session_expired: 'Your session expired. Please sign in again.',
        missing_token: 'Missing authentication credentials. Please sign in.',
        account_suspended: 'This account has been suspended. Please contact support.',
      };
      setError(messages[errParam] || 'Authentication failed. Please try again.');
    }
  }, [searchParams]);

  const handleOAuth = (provider: 'google' | 'github') => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
    const role = activeTab === 'signup' ? selectedRole : '';
    const roleParam = role ? `&role=${encodeURIComponent(role)}` : '';
    window.location.href = `${backendUrl}/api/v1/auth/${provider}?origin=${encodeURIComponent(origin)}${roleParam}`;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email.trim(), password);
      const user = useAuthStore.getState().user;
      const role = (user?.role || 'student').toLowerCase();
      const fallback = ROLE_DASHBOARD[role] || `/${role}`;
      const destination = getSafeRedirect(searchParams.get('redirect'), fallback);
      toast.success('Signed in successfully!');
      window.location.replace(destination);
    } catch (err: any) {
      setLoading(false);
      const status = err.response?.status;
      const message = err.response?.data?.message || err.message || 'Authentication failed';

      if (status === 404 || message.toLowerCase().includes('not found') || message.toLowerCase().includes('no user')) {
        setError('No account found with this email. Please check your credentials or create an account.');
      } else if (status === 401 || message.toLowerCase().includes('incorrect') || message.toLowerCase().includes('password')) {
        setError('Incorrect email or password. Please verify your credentials and try again.');
      } else if (err.code === 'ECONNABORTED' || message.includes('timeout')) {
        setError('Connection timed out. Please check your network and try again.');
      } else {
        setError(message || 'Unable to sign in. Please verify your details and try again.');
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedRole) {
      setError('Please select your platform stakeholder role.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password, selectedRole);
      const fallback = ROLE_DASHBOARD[selectedRole] || `/${selectedRole}`;
      const destination = getSafeRedirect(searchParams.get('redirect'), fallback);
      toast.success('Account created successfully!');
      window.location.replace(destination);
    } catch (err: any) {
      setLoading(false);
      const status = err.response?.status;
      const message = err.response?.data?.message || err.message || 'Registration failed';

      if (status === 409 || message.toLowerCase().includes('already registered') || message.toLowerCase().includes('already exists')) {
        setError('An account with this email already exists. Please sign in instead.');
      } else if (err.code === 'ECONNABORTED' || message.includes('timeout')) {
        setError('Connection timed out. Please try again.');
      } else {
        setError(message);
      }
    }
  };

  const handleSendMobileOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanNumber = mobilePhone.replace(/\D/g, '');
    if (cleanNumber.length < 10) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setMobileLoading(true);
    try {
      const res = await sendMobileOtp(mobilePhone);
      toast.success(`Verification code sent to ${res.maskedPhone}!`);
      router.push('/auth/mobile/verify');
    } catch (err: any) {
      setMobileLoading(false);
      const status = err.response?.status;
      const msg = err.response?.data?.message || err.message || 'Failed to send verification code.';
      if (status === 429) {
        setError('Too many requests. Please wait 60 seconds before requesting another code.');
      } else {
        setError(msg);
      }
    }
  };


  return (
    <div className="auth-page">
      {/* ── Top Bar: Brand + Factual Trust Signal ── */}
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
          <ShieldCheck size={13} color="#10B981" />
          <span>DPDP & NSQF Compliant</span>
          <span className="auth-trust-dot" />
        </div>
      </header>

      {/* ── Main Auth Content (Zero-Scroll Strict Viewport) ── */}
      <main className="auth-main-wrap">
        <div className="auth-container">
          {/* Contextual Institutional Workforce Visual (Desktop Only) */}
          <div className="auth-visual-panel" aria-hidden="true">
            <div className="auth-visual-card">
              <ResponsiveImage
                src="/images/auth/auth-workforce-growth.jpg"
                alt="Workforce candidates achieving verified skill certification and employment outcomes"
                fill={true}
                borderRadius={12}
                overlayGradient="navy"
                priority
              />
              <div className="auth-visual-overlay">
                <div className="auth-visual-badge">
                  <img
                    src="/images/brand/maharashtra-seal-emblem.svg"
                    alt=""
                    style={{ width: 16, height: 16 }}
                  />
                  <span>Ryyvora AI · National Workforce Network</span>
                </div>

                <div className="auth-visual-footer">
                  <p className="auth-visual-quote">
                    "Advancing vocational candidates from NSQF certifications into verified corporate employment and long-term wage mobility."
                  </p>
                  <div className="auth-visual-stats">
                    <div className="auth-visual-stat-item">
                      <strong>36</strong>
                      <span>Districts</span>
                    </div>
                    <div className="auth-visual-stat-item">
                      <strong>98.4%</strong>
                      <span>Verified</span>
                    </div>
                    <div className="auth-visual-stat-item">
                      <strong>NSQF</strong>
                      <span>Accredited</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Focused Application Surface */}
          <div className="auth-surface">
            {/* Header */}
            <div className="auth-header">
              <div className="auth-eyebrow">
                <ShieldCheck size={11} />
                <span>
                  {activeTab === 'signup'
                    ? 'Institutional Onboarding'
                    : 'Enterprise Authentication'}
                </span>
              </div>

              <h1 className="auth-title">
                {activeTab === 'signin' && 'Welcome back'}
                {activeTab === 'signup' && 'Create Verified Account'}
              </h1>

              <p className="auth-subtitle">
                {activeTab === 'signin' && 'Sign in to continue to your sovereign workspace.'}
                {activeTab === 'signup' && 'Join the national workforce outcome intelligence ecosystem.'}
              </p>
            </div>

            {/* ── Error Notification (Calm, Actionable) ── */}
            {error && (
              <div className="auth-alert-error" role="alert" style={{ marginBottom: 6 }}>
                <CircleAlert size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{error}</span>
              </div>
            )}

            {/* ── Mode 1: Sign In ── */}
            {activeTab === 'signin' && (
              <>
                {/* Method Switcher for Sign-In (Email vs Mobile OTP) */}
                <div className="auth-tabs-segmented">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('email');
                      setError(null);
                    }}
                    className={`auth-tab-btn ${authMethod === 'email' ? 'auth-tab-btn--active' : ''}`}
                  >
                    <Mail size={12} /> Email & Password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('mobile');
                      setError(null);
                    }}
                    className={`auth-tab-btn ${authMethod === 'mobile' ? 'auth-tab-btn--active-gold' : ''}`}
                  >
                    <Smartphone size={12} /> Mobile Number (OTP)
                  </button>
                </div>

                {/* Sign In: Email Form */}
                {authMethod === 'email' && (
                  <form onSubmit={handleSignIn} className="auth-form" noValidate>
                    <div className="auth-field">
                      <label htmlFor="signin-email" className="auth-label">
                        Email address
                      </label>
                      <div className="auth-input-container">
                        <div className="auth-icon-slot">
                          <Mail size={15} />
                        </div>
                        <input
                          id="signin-email"
                          type="email"
                          name="email"
                          autoComplete="email"
                          inputMode="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (error) setError(null);
                          }}
                          placeholder="name@organization.com"
                          className="auth-text-input"
                          required
                        />
                      </div>
                    </div>

                    <div className="auth-field">
                      <label htmlFor="signin-password" className="auth-label">
                        Password
                      </label>
                      <div className="auth-input-container">
                        <div className="auth-icon-slot">
                          <Lock size={15} />
                        </div>
                        <input
                          id="signin-password"
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          autoComplete="current-password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (error) setError(null);
                          }}
                          placeholder="••••••••"
                          className="auth-text-input"
                          style={{ paddingRight: 40 }}
                          required
                        />
                        <button
                          type="button"
                          className="auth-password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11.5, marginTop: -2 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary, #94A3B8)', cursor: 'pointer', userSelect: 'none' }}>
                        <input
                          type="checkbox"
                          checked={keepSignedIn}
                          onChange={(e) => setKeepSignedIn(e.target.checked)}
                          style={{ accentColor: 'var(--brand-gold, #F59E0B)', width: 13, height: 13, borderRadius: 3 }}
                        />
                        <span>Remember session</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => router.push('/auth/forgot-password')}
                        className="auth-link-gold"
                        style={{ fontSize: 11.5 }}
                      >
                        Forgot password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="auth-btn-primary"
                      disabled={loading || !email.trim() || !password}
                    >
                      {loading ? (
                        <span>Authenticating...</span>
                      ) : (
                        <>
                          <span>Sign In to Workspace</span>
                          <ArrowRight size={15} />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Sign In: Mobile OTP Form */}
                {authMethod === 'mobile' && (
                  <form onSubmit={handleSendMobileOtp} className="auth-form" noValidate>
                    <div className="auth-field">
                      <label htmlFor="signin-mobile" className="auth-label">
                        Mobile number
                      </label>
                      <div className="auth-input-container">
                        <div className="auth-prefix-slot">
                          <span className="auth-prefix-tag">IND</span>
                          <span>+91</span>
                        </div>
                        <input
                          id="signin-mobile"
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel-national"
                          value={mobilePhone}
                          onChange={(e) => {
                            setMobilePhone(e.target.value);
                            if (error) setError(null);
                          }}
                          placeholder="98765 43210"
                          className="auth-text-input auth-prefix-input"
                          required
                          autoFocus
                        />
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--text-muted, #64748B)', marginTop: 1 }}>
                        A 6-digit verification code will be sent via SMS.
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="auth-btn-primary"
                      disabled={mobileLoading || !mobilePhone.trim()}
                    >
                      {mobileLoading ? (
                        <span>Sending code...</span>
                      ) : (
                        <>
                          <span>Get Verification Code</span>
                          <ArrowRight size={15} />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Single High-Conversion Continue with Google CTA */}
                <div className="auth-divider">
                  <span>or continue with</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleOAuth('google')}
                  className="auth-btn-secondary"
                  aria-label="Continue with Google"
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>


                {/* Footer Switch */}
                <div className="auth-footer-nav">
                  <span>
                    New to Ryyvora?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('signup');
                        setError(null);
                      }}
                      className="auth-link-gold"
                    >
                      Create an account →
                    </button>
                  </span>
                </div>
              </>
            )}

            {/* ── Mode 2: Sign Up (Zero-Scroll Compact Layout) ── */}
            {activeTab === 'signup' && (
              <>
                <form onSubmit={handleSignUp} className="auth-form" noValidate>
                  <div className="auth-field">
                    <label htmlFor="signup-role" className="auth-label">
                      Stakeholder Role
                    </label>
                    <select
                      id="signup-role"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                      className="auth-select"
                    >
                      {ROLES.map(({ key, label, badge, desc }) => (
                        <option key={key} value={key}>
                          {label} ({badge}) — {desc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="auth-field">
                    <label htmlFor="signup-name" className="auth-label">
                      Full name
                    </label>
                    <div className="auth-input-container">
                      <div className="auth-icon-slot">
                        <User size={15} />
                      </div>
                      <input
                        id="signup-name"
                        type="text"
                        name="name"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Aarav Sharma"
                        className="auth-text-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="auth-field">
                    <label htmlFor="signup-email" className="auth-label">
                      Work / Institution email
                    </label>
                    <div className="auth-input-container">
                      <div className="auth-icon-slot">
                        <Mail size={15} />
                      </div>
                      <input
                        id="signup-email"
                        type="email"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@organization.com"
                        className="auth-text-input"
                        required
                      />
                    </div>
                  </div>

                  {/* Password + Confirm side-by-side to eliminate 50px vertical height */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div className="auth-field">
                      <label htmlFor="signup-password" className="auth-label">
                        Password
                      </label>
                      <div className="auth-input-container">
                        <div className="auth-icon-slot">
                          <Lock size={14} />
                        </div>
                        <input
                          id="signup-password"
                          type={showPassword ? 'text' : 'password'}
                          name="new-password"
                          autoComplete="new-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min 8 chars"
                          className="auth-text-input"
                          required
                        />
                      </div>
                    </div>

                    <div className="auth-field">
                      <label htmlFor="signup-confirm-password" className="auth-label">
                        Confirm
                      </label>
                      <div className="auth-input-container">
                        <div className="auth-icon-slot">
                          <Lock size={14} />
                        </div>
                        <input
                          id="signup-confirm-password"
                          type={showPassword ? 'text' : 'password'}
                          name="confirm-password"
                          autoComplete="new-password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter"
                          className="auth-text-input"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="auth-btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <span>Creating Account...</span>
                    ) : (
                      <>
                        <span>Create Verified Account</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </form>

                {/* Footer Switch */}
                <div className="auth-footer-nav">
                  <span>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('signin');
                        setError(null);
                      }}
                      className="auth-link-gold"
                    >
                      Sign In →
                    </button>
                  </span>
                </div>
              </>
            )}


            {/* ── Legal & DPDP Compliance Footnote ── */}
            <div className="auth-legal-text">
              <span>
                Protected under DPDP standards & role-based consent ·{' '}
                <Link href="/privacy">Privacy</Link> ·{' '}
                <Link href="/terms">Terms</Link>
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
