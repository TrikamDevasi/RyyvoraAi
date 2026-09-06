'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft, ArrowRight, ShieldCheck, KeyRound, CheckCircle2, CircleAlert } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import toast from 'react-hot-toast';
import '../auth.css';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { request } = useApi();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await request('POST', '/auth/forgot-password', { email: email.trim() });
      setSubmitted(true);
      toast.success('Password recovery link dispatched');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to dispatch recovery link. Please verify your email.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ── Top Bar ── */}
      <header className="auth-top-bar">
        <Link href="/" className="auth-brand-link" aria-label="Ryyvora AI Home">
          <div className="auth-brand-monogram">RY</div>
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
          
          {/* Header */}
          <div className="auth-header">
            <div className="auth-eyebrow">
              <KeyRound size={12} />
              <span>Credential Recovery</span>
            </div>

            <h1 className="auth-title">Forgot Password</h1>
            <p className="auth-subtitle">
              {submitted
                ? 'A password recovery link has been dispatched to your inbox.'
                : 'Enter your work or institution email to receive a recovery link.'}
            </p>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="auth-alert-error" role="alert" style={{ marginBottom: 16 }}>
              <CircleAlert size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <strong style={{ display: 'block', fontSize: 13, marginBottom: 2 }}>Request failed</strong>
                <span>{error}</span>
              </div>
            </div>
          )}

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#34d399',
                  marginBottom: 14,
                }}
              >
                <CheckCircle2 size={26} />
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary, #94A3B8)', lineHeight: 1.6, marginBottom: 20 }}>
                Please check <strong style={{ color: 'var(--text-primary, #F8FAFC)' }}>{email}</strong> and follow the instructions in the email to set a new password.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="auth-link-gold"
                style={{ fontSize: 13 }}
              >
                Try a different email address
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="auth-field">
                <label htmlFor="forgot-email" className="auth-label">
                  Email address
                </label>
                <div className="auth-input-container">
                  <div className="auth-icon-slot">
                    <Mail size={17} />
                  </div>
                  <input
                    id="forgot-email"
                    type="email"
                    name="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="name@organization.com"
                    className="auth-text-input"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                className="auth-btn-primary"
                disabled={loading || !email.trim()}
              >
                {loading ? (
                  <span>Sending recovery link...</span>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

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

          {/* Legal disclaimer */}
          <div className="auth-legal-text">
            <span>
              Protected under Ryyvora AI's{' '}
              <Link href="/privacy">Privacy Policy</Link> and security safeguards.
            </span>
          </div>

        </div>
      </main>
    </div>
  );
}
