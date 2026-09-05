'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore, UserRole } from '@/store/authStore';
import { setTokens, removeTokens } from '@/lib/auth';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  GraduationCap,
  Briefcase,
  Building2,
  Globe,
  Factory,
  Settings,
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Smartphone,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import './auth.css';

const ROLES: { key: UserRole; label: string; desc: string; icon: any; href: string; badge: string }[] = [
  { key: 'student', label: 'Student', desc: 'Skill Passport & AI Analytics', icon: GraduationCap, href: '/student', badge: 'Candidate' },
  { key: 'employer', label: 'Employer', desc: 'Talent Pool & Direct Hiring', icon: Briefcase, href: '/employer', badge: 'Corporate' },
  { key: 'institute', label: 'Institute', desc: 'Curriculum & Placement ROI', icon: Building2, href: '/institute', badge: 'Academia' },
  { key: 'government', label: 'Govt / Policy', desc: 'National Skill Heatmaps', icon: Globe, href: '/government', badge: 'National' },
  { key: 'industry', label: 'Industry', desc: 'Market Skill Demand Signals', icon: Factory, href: '/industry', badge: 'Ecosystem' },
  { key: 'admin', label: 'Admin', desc: 'Platform Governance & Auditing', icon: Settings, href: '/admin', badge: 'System' },
];

const ROLE_DASHBOARD: Record<string, string> = {
  student: '/student',
  employer: '/employer',
  institute: '/institute',
  government: '/government',
  industry: '/industry',
  admin: '/admin',
};

const DEMO_ACCOUNTS: Record<UserRole, { name: string; email: string; role: UserRole; defaultRoute: string }> = {
  student: { name: 'Aarav Deshmukh', email: 'trainee@skillsense.demo', role: 'student', defaultRoute: '/student' },
  employer: { name: 'Tata Consultancy Services (TCS)', email: 'employer@skillsense.demo', role: 'employer', defaultRoute: '/employer' },
  institute: { name: 'MSSDS Pune Regional Training Center', email: 'provider@skillsense.demo', role: 'institute', defaultRoute: '/institute' },
  government: { name: 'Maharashtra Skilling Directorate', email: 'government@skillsense.demo', role: 'government', defaultRoute: '/government' },
  industry: { name: 'Sector Skill Council Intelligence Lead', email: 'industry@skillsense.demo', role: 'industry', defaultRoute: '/industry' },
  admin: { name: 'SkillSense Chief Administrator', email: 'admin@skillsense.demo', role: 'admin', defaultRoute: '/admin' },
};

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register, setAuth, sendMobileOtp } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'demo'>('signin');
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
      const destination = ROLE_DASHBOARD[role] || `/${role}`;
      toast.success('Signed in successfully!');
      window.location.replace(destination);
    } catch (err: any) {
      setLoading(false);
      const status = err.response?.status;
      const message = err.response?.data?.message || err.message || 'Authentication failed';

      if (status === 404 || message.toLowerCase().includes('not found') || message.toLowerCase().includes('no user')) {
        setError('No account found with this email. Please sign up or try 1-click demo access.');
      } else if (status === 401 || message.toLowerCase().includes('incorrect') || message.toLowerCase().includes('password')) {
        setError('Incorrect email or password. Please verify your credentials.');
      } else if (err.code === 'ECONNABORTED' || message.includes('timeout')) {
        setError('Server connection timed out. Please try again.');
      } else {
        setError(message || 'Unable to sign in. Please check your credentials.');
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedRole) {
      setError('Please select your platform role.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password, selectedRole);
      const destination = ROLE_DASHBOARD[selectedRole] || `/${selectedRole}`;
      toast.success('Account created successfully!');
      window.location.replace(destination);
    } catch (err: any) {
      setLoading(false);
      const status = err.response?.status;
      const message = err.response?.data?.message || err.message || 'Registration failed';
      
      if (status === 409 || message.toLowerCase().includes('already registered') || message.toLowerCase().includes('already exists')) {
        setError('An account with this email already exists. Please switch to the Sign In tab to log in.');
      } else if (err.code === 'ECONNABORTED' || message.includes('timeout')) {
        setError('Server connection timed out. Please try again.');
      } else {
        setError(message);
      }
    }
  };

  // ── Mobile OTP Handler ─────────────────────────────────────────────
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

  // ── Instant 1-Click Demo Login ──────────────────────────────────────────────
  const handleInstantDemoLogin = (role: UserRole) => {
    const demo = DEMO_ACCOUNTS[role];
    const demoUser = {
      _id: `demo_${role}_001`,
      id: `demo_${role}_001`,
      name: demo.name,
      email: demo.email,
      role,
      isVerified: true,
      authProvider: 'local' as const,
    };
    const demoToken = `demo_token_${role}_${Date.now()}`;
    setAuth(demoUser, demoToken);
    router.push(demo.defaultRoute);
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-canvas">
        <div className="auth-bg-orb auth-bg-orb--1" />
        <div className="auth-bg-orb auth-bg-orb--2" />
        <div className="auth-bg-orb auth-bg-orb--3" />
        <div className="auth-bg-orb auth-bg-orb--4" />
        <div className="auth-bg-grid" />
      </div>

      <div className="auth-container">
        {/* Contextual Institutional Workforce Visual (Desktop Only) */}
        <div className="auth-visual-panel">
          <div className="auth-visual-card">
            <ResponsiveImage
              src="/images/auth/auth-workforce-growth.jpg"
              alt="Indian workforce professional in Maharashtra state research and innovation facility"
              aspectRatio="3 / 4"
              borderRadius={20}
              overlayGradient="navy"
              priority
            />
            <div className="auth-visual-overlay">
              <div className="auth-visual-badge">
                <img
                  src="/images/brand/maharashtra-seal-emblem.svg"
                  alt=""
                  style={{ width: 18, height: 18 }}
                />
                <span>Ryyvora AI · Maharashtra</span>
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

        <div className="auth-card" style={{ maxWidth: activeTab === 'demo' ? 520 : 440 }}>
        {/* ── HEADER ── */}
        <div className="auth-header" style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', padding: '4px 12px', borderRadius: 99, marginBottom: 12 }}>
            <Sparkles size={13} color="var(--gold, #f59e0b)" />
            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--gold, #f59e0b)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Ryyvora AI · Neural Telemetry
            </span>
          </div>
          <h1 className="auth-title" style={{ fontSize: 24, fontWeight: 800, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {activeTab === 'signin' && 'Welcome to Ryyvora AI'}
            {activeTab === 'signup' && 'Create Verified Account'}
            {activeTab === 'demo' && (
              <>
                <Zap size={20} style={{ color: 'var(--gold)' }} />
                <span>Instant Demo Portals</span>
              </>
            )}
          </h1>
          <p className="auth-subtitle" style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
            {activeTab === 'signin' && 'Sign in to access your skills dashboard and verified credentials'}
            {activeTab === 'signup' && 'Join the National Skill Qualifications Framework ecosystem'}
            {activeTab === 'demo' && 'Select any stakeholder role to preview interactive dashboards'}
          </p>
        </div>

        {/* ── TABS ── */}
        <div className="auth-tabs" style={{ display: 'flex', gap: 4, background: 'rgba(0,0,0,0.4)', padding: 4, borderRadius: 10, marginBottom: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('signin')}
            className={`auth-tab ${activeTab === 'signin' ? 'auth-tab--active' : ''}`}
            style={{ flex: 1, padding: '8px 12px', fontSize: 12.5, fontWeight: 700, borderRadius: 8, border: 'none', cursor: 'pointer' }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            className={`auth-tab ${activeTab === 'signup' ? 'auth-tab--active' : ''}`}
            style={{ flex: 1, padding: '8px 12px', fontSize: 12.5, fontWeight: 700, borderRadius: 8, border: 'none', cursor: 'pointer' }}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('demo')}
            className={`auth-tab ${activeTab === 'demo' ? 'auth-tab--active' : ''}`}
            style={{
              flex: 1,
              padding: '8px 12px',
              fontSize: 12.5,
              fontWeight: 700,
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              color: activeTab === 'demo' ? '#000' : 'var(--gold)',
              background: activeTab === 'demo' ? 'var(--gold)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}
          >
            <Zap size={13} /> Demo
          </button>
        </div>

        {/* ── METHOD TOGGLE (EMAIL vs MOBILE) ── */}
        {activeTab !== 'demo' && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, background: 'rgba(255,255,255,0.03)', padding: 3, borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
            <button
              type="button"
              onClick={() => { setAuthMethod('email'); setError(null); }}
              style={{
                flex: 1,
                padding: '7px 10px',
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                background: authMethod === 'email' ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: authMethod === 'email' ? '#f8fafc' : '#94a3b8',
                transition: 'all 0.15s ease',
              }}
            >
              <Mail size={13} /> Email & Password
            </button>
            <button
              type="button"
              onClick={() => { setAuthMethod('mobile'); setError(null); }}
              style={{
                flex: 1,
                padding: '7px 10px',
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                background: authMethod === 'mobile' ? 'rgba(245,158,11,0.15)' : 'transparent',
                color: authMethod === 'mobile' ? 'var(--gold, #f59e0b)' : '#94a3b8',
                transition: 'all 0.15s ease',
              }}
            >
              <Smartphone size={13} /> Mobile Number (OTP)
            </button>
          </div>
        )}

        {/* ── MOBILE NUMBER AUTH FORM ── */}
        {activeTab !== 'demo' && authMethod === 'mobile' && (
          <form onSubmit={handleSendMobileOtp} className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="auth-field">
              <label className="auth-field-label">Mobile Number</label>
              <div className="auth-input-wrap" style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  padding: '0 10px',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  background: 'rgba(255,255,255,0.05)',
                  borderRight: '1px solid rgba(255,255,255,0.1)',
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#f8fafc',
                }}>
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.04em', color: 'var(--gold)', background: 'rgba(245,158,11,0.12)', padding: '1px 5px', borderRadius: 3, border: '1px solid rgba(245,158,11,0.25)' }}>IND</span>
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={mobilePhone}
                  onChange={(e) => {
                    setMobilePhone(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="98765 43210"
                  className="auth-input"
                  style={{ paddingLeft: 12 }}
                  required
                  autoFocus
                />
              </div>
              <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 4 }}>
                We'll send a 6-digit verification code to this phone.
              </div>
            </div>

            {error && (
              <div style={{ color: '#f87171', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.1)', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)' }}>
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="auth-btn"
              disabled={mobileLoading || !mobilePhone.trim()}
              style={{
                padding: '11px',
                borderRadius: 8,
                background: 'var(--gold, #f59e0b)',
                color: '#000',
                fontWeight: 800,
                fontSize: 13.5,
                border: 'none',
                cursor: mobileLoading || !mobilePhone.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginTop: 4,
              }}
            >
              {mobileLoading ? (
                <span>Sending code...</span>
              ) : (
                <>
                  <span>Get Verification Code</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        {/* ── 1-CLICK DEMO ACCESS TAB ── */}
        {activeTab === 'demo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>
              Click any persona to log in instantly with pre-loaded NSQF skill telemetry data:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
              {ROLES.map(({ key, label, desc, icon: Icon, badge }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleInstantDemoLogin(key)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '12px 14px',
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--gold)';
                    e.currentTarget.style.background = 'rgba(245,158,11,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  }}
                >
                  <div style={{ padding: 8, borderRadius: 8, background: 'rgba(245,158,11,0.12)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>{label}</span>
                      <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--gold)', background: 'rgba(245,158,11,0.15)', padding: '1px 6px', borderRadius: 4 }}>
                        {badge}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{desc}</div>
                  </div>
                </button>
              ))}
            </div>

            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: '#10b981' }}>
              <ShieldCheck size={14} /> Zero password required · Full interactive features enabled
            </div>
          </div>
        )}

        {/* ── FORM (SIGN IN & SIGN UP - EMAIL METHOD) ── */}
        {activeTab !== 'demo' && authMethod === 'email' && (
          <form onSubmit={activeTab === 'signin' ? handleSignIn : handleSignUp} className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {activeTab === 'signup' && (
              <>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', marginBottom: 2 }}>
                  Select Platform Role
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 6 }}>
                  {ROLES.map(({ key, label, icon: Icon }) => (
                    <div
                      key={key}
                      onClick={() => setSelectedRole(key)}
                      style={{
                        padding: '10px 8px',
                        borderRadius: 8,
                        background: selectedRole === key ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${selectedRole === key ? 'var(--gold)' : 'rgba(255,255,255,0.06)'}`,
                        color: selectedRole === key ? 'var(--gold)' : '#cbd5e1',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Icon size={16} style={{ margin: '0 auto 4px' }} />
                      <span style={{ fontSize: 11.5, fontWeight: 700, display: 'block' }}>{label}</span>
                    </div>
                  ))}
                </div>

                <div className="auth-field">
                  <label className="auth-field-label">Full Name</label>
                  <div className="auth-input-wrap">
                    <User className="auth-input-icon" size={17} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Aarav Sharma"
                      className="auth-input"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className="auth-field">
              <label className="auth-field-label">Email Address</label>
              <div className="auth-input-wrap">
                <Mail className="auth-input-icon" size={17} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="auth-input"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <div className="auth-label-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="auth-field-label">Password</label>
                {activeTab === 'signin' && (
                  <button
                    type="button"
                    className="auth-forgot-btn"
                    onClick={() => router.push('/auth/forgot-password')}
                    style={{ fontSize: 11.5, color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="auth-input-wrap">
                <Lock className="auth-input-icon" size={17} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="auth-input"
                  required
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {activeTab === 'signup' && (
              <div className="auth-field">
                <label className="auth-field-label">Confirm Password</label>
                <div className="auth-input-wrap">
                  <Lock className="auth-input-icon" size={17} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="auth-input"
                    required
                  />
                </div>
              </div>
            )}

            {activeTab === 'signin' && (
              <label className="auth-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#94a3b8', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                />
                <span>Remember this session for 30 days</span>
              </label>
            )}

            {error && (
              <div style={{ color: '#f87171', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.1)', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)' }}>
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="auth-btn"
              disabled={loading}
              style={{
                padding: '11px',
                borderRadius: 8,
                background: 'var(--gold, #f59e0b)',
                color: '#000',
                fontWeight: 800,
                fontSize: 13.5,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginTop: 4,
              }}
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{activeTab === 'signin' ? 'Sign In to Dashboard' : 'Create Verified Account'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        {/* ── SOCIAL AUTH (GOOGLE & GITHUB) ── */}
        {activeTab !== 'demo' && (
          <>
            <div className="auth-divider" style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0 14px', color: '#64748b', fontSize: 11.5, textTransform: 'uppercase' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
              <span>or connect with</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            </div>

            <div className="auth-socials" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button
                type="button"
                onClick={() => handleOAuth('google')}
                className="auth-social-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '9px',
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#fff',
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" width="16" height="16">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>

              <button
                type="button"
                onClick={() => handleOAuth('github')}
                className="auth-social-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '9px',
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#fff',
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24" width="16" height="16" fill="#fff">
                  <path fill="#fff" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div>
          </>
        )}

        {/* ── FOOTER SWITCH ── */}
        <div className="auth-footer" style={{ marginTop: 20, textAlign: 'center', fontSize: 12.5, color: '#94a3b8' }}>
          {activeTab === 'signin' && (
            <>
              Need a new account?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                style={{ color: 'var(--gold)', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer' }}
              >
                Create Account
              </button>
            </>
          )}
          {activeTab === 'signup' && (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('signin')}
                style={{ color: 'var(--gold)', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer' }}
              >
                Sign In
              </button>
            </>
          )}
          {activeTab === 'demo' && (
            <>
              Ready to log in with custom credentials?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('signin')}
                style={{ color: 'var(--gold)', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer' }}
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
  );
}
