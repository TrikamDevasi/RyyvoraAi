'use client';

import React, { useState, useEffect, useRef, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CircleAlert,
  Smartphone,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { RyyvoraMark } from '@/components/shared/BrandLogo';
import '../../auth.css';

const ROLE_DASHBOARD: Record<string, string> = {
  student: '/student',
  employer: '/employer',
  institute: '/institute',
  government: '/government',
  industry: '/industry',
  admin: '/admin',
};

export default function MobileVerifyPage() {
  const router = useRouter();
  const { mobileState, verifyMobileOtp, sendMobileOtp } = useAuthStore();
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Guard: Ensure mobileState exists
  useEffect(() => {
    if (!mobileState?.phone) {
      toast.error('Please enter your mobile number first.');
      router.replace('/auth');
      return;
    }

    if (mobileState.cooldownRemaining) {
      setTimer(mobileState.cooldownRemaining);
    }
  }, [mobileState, router]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    setCanResend(false);
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleDigitChange = (index: number, value: string) => {
    setError(null);
    const char = value.slice(-1);

    if (!/^\d*$/.test(char)) return;

    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    // Auto-advance to next slot
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify if all 6 digits are populated
    if (char && index === 5 && newDigits.every((d) => d !== '')) {
      submitOtp(newDigits.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    setError(null);
    const pasted = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pasted)) {
      toast.error('Please paste a valid 6-digit OTP.');
      return;
    }

    const pastedDigits = pasted.split('');
    setDigits(pastedDigits);
    inputRefs.current[5]?.focus();
    submitOtp(pasted);
  };

  const submitOtp = async (otpCode: string) => {
    if (!mobileState?.phone) return;
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await verifyMobileOtp(mobileState.phone, otpCode);
      if (result.isNewUser) {
        toast.success('Mobile verified! Set up your profile to continue.');
        startTransition(() => {
          router.push('/auth/mobile/name');
        });
      } else {
        const user = result.user;
        const role = (user?.role || 'student').toLowerCase();
        const destination = ROLE_DASHBOARD[role] || `/${role}`;
        toast.success(`Welcome back, ${user?.name || 'User'}!`);
        window.location.replace(destination);
      }
    } catch (err: any) {
      setLoading(false);
      const msg = err.response?.data?.message || err.message || 'Incorrect verification code. Please try again.';
      setError(msg);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (!mobileState?.phone || !canResend || resending) return;

    setResending(true);
    setError(null);

    try {
      const res = await sendMobileOtp(mobileState.phone);
      setTimer(res.cooldownRemaining || 60);
      setCanResend(false);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      toast.success('A new 6-digit verification code has been dispatched.');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to resend code. Please try again.';
      setError(msg);
    } finally {
      setResending(false);
    }
  };

  const handleAutofillDevOtp = () => {
    if (mobileState?.devOtp) {
      const devDigits = mobileState.devOtp.split('');
      setDigits(devDigits);
      submitOtp(mobileState.devOtp);
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
        <div className="auth-surface">
          
          {/* Back link */}
          <button
            type="button"
            onClick={() => router.push('/auth')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary, #94A3B8)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12.5,
              fontWeight: 600,
              padding: 0,
              marginBottom: 16,
              transition: 'color 150ms ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary, #F8FAFC)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary, #94A3B8)')}
          >
            <ArrowLeft size={14} /> Change mobile number
          </button>

          {/* Header */}
          <div className="auth-header">
            <div className="auth-eyebrow">
              <Smartphone size={12} />
              <span>Mobile Verification</span>
            </div>

            <h1 className="auth-title">Verify your mobile</h1>
            <p className="auth-subtitle">
              We sent a 6-digit verification code to{' '}
              <strong style={{ color: 'var(--text-primary, #F8FAFC)' }}>
                {mobileState?.maskedPhone || mobileState?.phone || 'your phone'}
              </strong>
            </p>
          </div>

          {/* Dev Simulation Badge (Subtle helper) */}
          {mobileState?.devOtp && (
            <div
              style={{
                marginBottom: 16,
                padding: '8px 12px',
                borderRadius: 8,
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 12,
                color: '#34d399',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={13} />
                <span>Dev Test Code: <strong>{mobileState.devOtp}</strong></span>
              </div>
              <button
                type="button"
                onClick={handleAutofillDevOtp}
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  color: '#34d399',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                Auto-Fill
              </button>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="auth-alert-error" role="alert" style={{ marginBottom: 16 }}>
              <CircleAlert size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <strong style={{ display: 'block', fontSize: 13, marginBottom: 2 }}>Verification failed</strong>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* 6-Slot OTP Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitOtp(digits.join(''));
            }}
            className="auth-form"
          >
            <div className="auth-otp-row" onPaste={handlePaste}>
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={idx === 0 ? 'one-time-code' : 'off'}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  disabled={loading}
                  className="auth-otp-slot"
                  aria-label={`Digit ${idx + 1} of 6`}
                />
              ))}
            </div>

            <button
              type="submit"
              className="auth-btn-primary"
              disabled={loading || digits.some((d) => d === '')}
            >
              {loading ? (
                <span>Verifying code...</span>
              ) : (
                <>
                  <span>Verify Code & Continue</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Resend Cooldown Section */}
          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 12.5, color: 'var(--text-secondary, #94A3B8)' }}>
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="auth-link-gold"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <RefreshCw size={12} className={resending ? 'animate-spin' : ''} />
                <span>{resending ? 'Sending new code...' : 'Resend verification code'}</span>
              </button>
            ) : (
              <span>
                Didn't receive it? Resend in{' '}
                <strong style={{ color: 'var(--text-primary, #F8FAFC)' }}>{timer}s</strong>
              </span>
            )}
          </div>

          {/* DPDP Legal Note */}
          <div className="auth-legal-text">
            <span>
              Your phone number is authenticated in accordance with{' '}
              <Link href="/privacy">DPDP consent frameworks</Link>.
            </span>
          </div>

        </div>
      </main>
    </div>
  );
}
