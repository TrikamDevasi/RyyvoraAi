'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { setTokens } from '@/lib/auth';

// ── Role → dashboard route map ─────────────────────────────────────────────────
const ROLE_ROUTES: Record<string, string> = {
  student:    '/student',
  employer:   '/employer',
  institute:  '/institute',
  industry:   '/industry',
  government: '/government',
  admin:      '/admin',
};

interface OAuthUser {
  id:           string;
  name:         string;
  email:        string;
  role:         string;
  avatar:       string;
  isVerified:   boolean;
  isActive:     boolean;
  authProvider: string;
}

// ── Spinner UI ────────────────────────────────────────────────────────────────
function OAuthSpinner({ label }: { label: string }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: '#08060f', gap: 20,
    }}>
      <div style={{
        width: 56, height: 56,
        border: '3px solid rgba(212,168,67,0.15)',
        borderTop: '3px solid #D4A843',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ fontSize: 14, color: 'rgba(212,168,67,0.7)', margin: 0, fontFamily: 'Inter, sans-serif' }}>
        {label}
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AuthCallbackPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { setToken } = useAuthStore();
  const [label, setLabel] = useState('Completing sign in…');

  useEffect(() => {
    const token    = searchParams.get('token');
    const userB64  = searchParams.get('user');
    const provider = searchParams.get('provider') ?? 'oauth';
    const error    = searchParams.get('error');

    console.log('[OAuth Callback] provider:', provider, '| token present:', !!token, '| user present:', !!userB64);

    // ── Error path ────────────────────────────────────────────────────────────
    if (error || !token) {
      console.error('[OAuth Callback] Error or missing token:', error);
      router.replace(`/auth?error=${error ?? 'oauth_failed'}`);
      return;
    }

    try {
      // 1. Decode or fetch user first (needed for role to set cookie correctly)
      let user: OAuthUser | null = null;
      if (userB64) {
        const json = atob(userB64);
        user = JSON.parse(json) as OAuthUser;
        console.log('[OAuth Callback] User decoded — name:', user.name, '| role:', user.role);
      }

      // 2. Store JWT + role in both localStorage AND cookie via setAuth
      if (user && token) {
        const authUser = {
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as any,
          avatar: user.avatar,
          isVerified: user.isVerified,
          isActive: user.isActive,
          createdAt: new Date().toISOString(),
          authProvider: user.authProvider as any,
        };
        useAuthStore.getState().setAuth(authUser, token);
        console.log('[OAuth Callback] Token + cookie stored ✓');
      } else if (token) {
        // No user payload — store token only and let checkAuth fetch user
        setTokens(token);
        console.log('[OAuth Callback] Token stored (no user payload) ✓');
      }

      // 4. Check if account is suspended
      if (user && !user.isActive) {
        console.warn('[OAuth Callback] Account suspended!');
        router.replace('/auth?error=account_suspended');
        return;
      }

      // 5. Route to correct dashboard
      const role = user?.role ?? 'student';
      const destination = ROLE_ROUTES[role] || (role === 'employer' ? '/employer' : '/student');
      setLabel(`Welcome back${user?.name ? `, ${user.name.split(' ')[0]}` : ''}! Redirecting…`);

      console.log('[OAuth Callback] Redirecting to:', destination);
      setTimeout(() => router.replace(destination), 800);

    } catch (err) {
      console.error('[OAuth Callback] Failed to process callback:', err);
      router.replace('/auth?error=oauth_failed');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <OAuthSpinner label={label} />;
}
