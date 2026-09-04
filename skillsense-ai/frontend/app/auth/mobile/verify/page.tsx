'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import {
  Smartphone,
  ArrowRight,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
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
  const { mobileState, verifyMobileOtp, sendMobileOtp, setMobileState } = useAuthStore();
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
    const char = value.slice(-1); // Take latest char typed

    if (!/^\d*$/.test(char)) return;

    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    // Auto-advance
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // If all 6 digits entered, auto-verify
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
      setError('Please enter all 6 digits of the OTP.');
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
      // Reset inputs
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
      toast.success('A new 6-digit verification code has been sent!');
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
      <div className="auth-bg-canvas">
        <div className="auth-bg-orb auth-bg-orb--1" />
        <div className="auth-bg-orb auth-bg-orb--2" />
        <div className="auth-bg-orb auth-bg-orb--3" />
        <div className="auth-bg-grid" />
      </div>

      <div className="auth-card" style={{ maxWidth: 440 }}>
        {/* ── BACK BUTTON ── */}
        <button
          type="button"
          onClick={() => router.push('/auth')}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12.5,
            fontWeight: 600,
            marginBottom: 16,
            padding: 0,
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#f8fafc')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
        >
          <ArrowLeft size={15} /> Change mobile number
        </button>

        {/* ── HEADER ── */}
        <div className="auth-header" style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: 'rgba(245,158,11,0.12)',
              border: '1px solid rgba(245,158,11,0.3)',
              color: 'var(--gold, #f59e0b)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
            }}
          >
            <Smartphone size={26} />
          </div>

          <h1 className="auth-title" style={{ fontSize: 23, fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            Verify Mobile Number
          </h1>
          <p className="auth-subtitle" style={{ fontSize: 13, color: '#94a3b8', marginTop: 6, lineHeight: 1.5 }}>
            Enter the 6-digit verification code sent to{' '}
            <strong style={{ color: '#f8fafc', fontWeight: 700 }}>
              {mobileState?.maskedPhone || mobileState?.phone || 'your phone'}
            </strong>
          </p>
        </div>

        {/* ── DEV MODE SIMULATION BADGE ── */}
        {mobileState?.devOtp && (
          <div
            style={{
              marginBottom: 18,
              padding: '8px 12px',
              borderRadius: 8,
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 12,
              color: '#34d399',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={14} />
              <span>Dev Simulation OTP: <strong>{mobileState.devOtp}</strong></span>
            </div>
            <button
              type="button"
              onClick={handleAutofillDevOtp}
              style={{
                background: 'rgba(16,185,129,0.2)',
                border: '1px solid rgba(16,185,129,0.4)',
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

        {/* ── 6-DIGIT OTP INPUTS ── */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitOtp(digits.join(''));
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 8,
              marginBottom: 20,
            }}
          >
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                disabled={loading}
                style={{
                  width: '100%',
                  maxWidth: 52,
                  height: 56,
                  textAlign: 'center',
                  fontSize: 22,
                  fontWeight: 800,
                  color: '#f8fafc',
                  background: 'rgba(255,255,255,0.04)',
                  border: digit ? '2px solid var(--gold, #f59e0b)' : '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 10,
                  outline: 'none',
                  transition: 'all 0.15s ease',
                  boxShadow: digit ? '0 0 12px rgba(245,158,11,0.2)' : 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--gold, #f59e0b)';
                  e.currentTarget.style.background = 'rgba(245,158,11,0.06)';
                }}
                onBlur={(e) => {
                  if (!digit) {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  }
                }}
              />
            ))}
          </div>

          {/* ── ERROR DISPLAY ── */}
          {error && (
            <div
              style={{
                color: '#f87171',
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(239,68,68,0.1)',
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid rgba(239,68,68,0.2)',
                marginBottom: 16,
              }}
            >
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          {/* ── SUBMIT BUTTON ── */}
          <button
            type="submit"
            className="auth-btn"
            disabled={loading || digits.some((d) => !d)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 8,
              background: digits.every((d) => d) ? 'var(--gold, #f59e0b)' : 'rgba(255,255,255,0.08)',
              color: digits.every((d) => d) ? '#000' : '#64748b',
              fontWeight: 800,
              fontSize: 13.5,
              border: 'none',
              cursor: loading || digits.some((d) => !d) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginBottom: 16,
              transition: 'all 0.2s ease',
            }}
          >
            {loading ? (
              <span>Verifying code...</span>
            ) : (
              <>
                <span>Verify & Continue</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* ── RESEND TIMER ── */}
        <div
          style={{
            textAlign: 'center',
            fontSize: 12.5,
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--gold, #f59e0b)',
                fontWeight: 700,
                cursor: resending ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <RefreshCw size={13} className={resending ? 'animate-spin' : ''} />
              <span>{resending ? 'Sending...' : 'Resend Code'}</span>
            </button>
          ) : (
            <span>
              Resend code in{' '}
              <strong style={{ color: '#cbd5e1' }}>
                00:{timer < 10 ? `0${timer}` : timer}
              </strong>
            </span>
          )}
        </div>

        {/* ── FOOTER NOTICE ── */}
        <div
          style={{
            marginTop: 22,
            paddingTop: 16,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            fontSize: 11.5,
            color: '#64748b',
          }}
        >
          <ShieldCheck size={14} color="#10b981" />
          <span>Encrypted 256-bit secure authorization</span>
        </div>
      </div>
    </div>
  );
}
