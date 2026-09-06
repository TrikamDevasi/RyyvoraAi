'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2, CircleAlert, KeyRound } from 'lucide-react';
import { RyyvoraMark } from '@/components/shared/BrandLogo';
import '../auth.css';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setVerifying(false);
      return;
    }
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/auth/reset-password/${token}`)
      .then((r) => r.json())
      .then((d) => {
        setTokenValid(Boolean(d.valid));
        setVerifying(false);
      })
      .catch(() => setVerifying(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must contain at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/auth/reset-password/${token}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Reset failed');
      setDone(true);
      setTimeout(() => router.push('/auth'), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <p className="auth-subtitle">Verifying security token...</p>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 14, padding: '16px 0' }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f87171',
          }}
        >
          <CircleAlert size={26} />
        </div>
        <h2 className="auth-title" style={{ fontSize: 20 }}>Link Expired or Invalid</h2>
        <p className="auth-subtitle" style={{ margin: 0 }}>
          This password reset token has expired or is invalid. Please request a new recovery link.
        </p>
        <button
          type="button"
          onClick={() => router.push('/auth/forgot-password')}
          className="auth-btn-primary"
          style={{ marginTop: 8 }}
        >
          <span>Request New Link</span>
          <ArrowRight size={15} />
        </button>
      </div>
    );
  }

  if (done) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 14, padding: '16px 0' }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#34d399',
          }}
        >
          <CheckCircle2 size={26} />
        </div>
        <h2 className="auth-title" style={{ fontSize: 20 }}>Password Reset Successfully</h2>
        <p className="auth-subtitle" style={{ margin: 0 }}>
          Your credentials have been updated. Redirecting to sign in page in 3 seconds...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="auth-header">
        <div className="auth-eyebrow">
          <KeyRound size={12} />
          <span>Credential Security</span>
        </div>
        <h1 className="auth-title">Create New Password</h1>
        <p className="auth-subtitle">Must contain at least 8 characters</p>
      </div>

      {error && (
        <div className="auth-alert-error" role="alert" style={{ marginBottom: 16 }}>
          <CircleAlert size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <strong style={{ display: 'block', fontSize: 13, marginBottom: 2 }}>Reset error</strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div className="auth-field">
          <label htmlFor="new-password" className="auth-label">
            New password
          </label>
          <div className="auth-input-container">
            <div className="auth-icon-slot">
              <Lock size={17} />
            </div>
            <input
              id="new-password"
              type={showPass ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="auth-text-input"
              style={{ paddingRight: 44 }}
              required
              autoFocus
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowPass(!showPass)}
              aria-label={showPass ? 'Hide password' : 'Show password'}
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="confirm-new-password" className="auth-label">
            Confirm password
          </label>
          <div className="auth-input-container">
            <div className="auth-icon-slot">
              <Lock size={17} />
            </div>
            <input
              id="confirm-new-password"
              type={showPass ? 'text' : 'password'}
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="auth-text-input"
              required
            />
          </div>
        </div>

        <button type="submit" className="auth-btn-primary" disabled={loading}>
          {loading ? (
            <span>Updating password...</span>
          ) : (
            <>
              <span>Save New Password</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();

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
        <div className="auth-surface">
          <Suspense
            fallback={
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <p className="auth-subtitle">Loading reset form...</p>
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>

          {/* Footer Back Link */}
          <div className="auth-footer-nav" style={{ marginTop: 24 }}>
            <button
              type="button"
              onClick={() => router.push('/auth')}
              className="auth-link-gold"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <ArrowLeft size={14} /> Back to Sign In
            </button>
          </div>

          {/* DPDP Legal Note */}
          <div className="auth-legal-text">
            <span>
              Protected under Ryyvora AI's{' '}
              <Link href="/privacy">Privacy Policy</Link> and data consent safeguards.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
