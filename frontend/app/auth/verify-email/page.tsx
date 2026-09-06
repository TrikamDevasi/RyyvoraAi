'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, CircleAlert, ArrowRight, ShieldCheck, MailCheck } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import toast from 'react-hot-toast';
import '../auth.css';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { request } = useApi();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email token...');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No verification token found in URL.');
        return;
      }

      try {
        await request('GET', `/auth/verify-email/${token}`);
        setStatus('success');
        setMessage('Email verified successfully. You now have full access to your workspace.');
        toast.success('Verification successful');
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. The link may have expired.');
        toast.error('Verification failed');
      }
    };

    verify();
  }, [token, request]);

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
        <div className="auth-surface" style={{ maxWidth: 440 }}>
          
          {/* Header */}
          <div className="auth-header">
            <div className="auth-eyebrow">
              <MailCheck size={12} />
              <span>Identity Verification</span>
            </div>
            <h1 className="auth-title">Email Verification</h1>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 0', gap: 16, textAlign: 'center' }}>
            {status === 'loading' && (
              <>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    border: '3px solid rgba(245, 158, 11, 0.2)',
                    borderTopColor: 'var(--brand-gold, #F59E0B)',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
                <p className="auth-subtitle">{message}</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </>
            )}

            {status === 'success' && (
              <>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#34d399',
                  }}
                >
                  <CheckCircle2 size={30} />
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary, #F8FAFC)', lineHeight: 1.5, margin: 0 }}>
                  {message}
                </p>
                <button
                  type="button"
                  onClick={() => router.push('/auth')}
                  className="auth-btn-primary"
                >
                  <span>Continue to Workspace</span>
                  <ArrowRight size={16} />
                </button>
              </>
            )}

            {status === 'error' && (
              <>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f87171',
                  }}
                >
                  <CircleAlert size={30} />
                </div>
                <p style={{ fontSize: 13.5, color: '#fca5a5', lineHeight: 1.5, margin: 0 }}>
                  {message}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => router.push('/auth')}
                    className="auth-btn-primary"
                  >
                    <span>Return to Sign In</span>
                    <ArrowRight size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/auth/forgot-password')}
                    className="auth-link-gold"
                    style={{ fontSize: 12.5 }}
                  >
                    Need a new verification link?
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Legal Note */}
          <div className="auth-legal-text">
            <span>
              Protected under Ryyvora AI's{' '}
              <Link href="/privacy">Privacy Policy</Link> and national compliance standards.
            </span>
          </div>

        </div>
      </main>
    </div>
  );
}
