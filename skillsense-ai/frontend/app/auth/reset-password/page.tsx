'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
    if (!token) { setVerifying(false); return; }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password/${token}`)
      .then(r => r.json())
      .then(d => { setTokenValid(d.valid); setVerifying(false); })
      .catch(() => setVerifying(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword)
      return setError('Passwords do not match');
    if (password.length < 8)
      return setError('Password must be at least 8 characters');
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password/${token}`,
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (verifying) return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
       <div className="auth-spinner" style={{ margin: '0 auto 12px', width: '24px', height: '24px' }} />
       <p className="auth-subtitle">Verifying reset link...</p>
    </div>
  );

  if (!tokenValid) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', padding: '16px 0' }}>
      <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      </div>
      <h2 className="auth-title" style={{ marginBottom: 0 }}>Link Expired</h2>
      <p className="auth-subtitle">This reset link is invalid or has expired. Please request a new one.</p>
      <button onClick={() => router.push('/auth/forgot-password')} className="auth-btn" style={{ marginTop: '12px' }}>Request new link</button>
    </div>
  );

  if (done) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px', padding: '16px 0' }}>
      <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 2s infinite' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h2 className="auth-title" style={{ marginBottom: 0 }}>Password Reset!</h2>
      <p className="auth-subtitle">Redirecting to sign in page in 3 seconds...</p>
    </div>
  );

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 className="auth-title" style={{ marginBottom: '6px' }}>Create New Password</h1>
        <p className="auth-subtitle">Must be at least 8 characters</p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '12px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#f87171', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '6px', height: '6px', background: '#f87171', borderRadius: '50%' }} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-field">
          <label className="auth-field-label">New Password</label>
          <div className="auth-input-wrap">
            <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input type={showPass ? 'text' : 'password'} value={password}
              onChange={e => setPassword(e.target.value)} required placeholder="Min. 8 characters"
              className="auth-input" />
            <button type="button" onClick={() => setShowPass(!showPass)} className="auth-eye-btn">
              {showPass ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
            </button>
          </div>
        </div>

        <div className="auth-field">
          <label className="auth-field-label">Confirm Password</label>
          <div className="auth-input-wrap">
            <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input type="password" value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)} required placeholder="Repeat password"
              className="auth-input" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="auth-btn" style={{ marginTop: '8px' }}>
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="auth-spinner" />
              Resetting...
            </span>
          ) : (
            <>
              <span>Reset Password</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </>
          )}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <div className="auth-bg-canvas" aria-hidden="true">
        <div className="auth-bg-orb auth-bg-orb--1" />
        <div className="auth-bg-orb auth-bg-orb--2" />
        <div className="auth-bg-orb auth-bg-orb--3" />
        <div className="auth-bg-orb auth-bg-orb--4" />
        <div className="auth-bg-grid" />
      </div>

      <main className="auth-page">
        <div className="auth-card" style={{ maxWidth: '420px' }}>
          <div className="auth-logo">
            <img src="/logo.png" alt="SkillSense AI" />
            <p className="auth-tagline" style={{ color: 'rgba(156,163,175,0.5)' }}>
              Measuring Skills · Predicting Futures
            </p>
          </div>
          
          <Suspense fallback={<div style={{ textAlign: 'center' }}><div className="auth-spinner" style={{ margin: '0 auto' }} /></div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </main>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 24px rgba(245,158,11,0.2); }
          50% { box-shadow: 0 0 40px rgba(245,158,11,0.4); }
        }
      `}</style>
    </>
  );
}
