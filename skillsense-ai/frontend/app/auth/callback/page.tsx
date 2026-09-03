'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore, AuthUser } from '@/store/authStore';
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

// ── Safe Base64 / Unicode Decoder ─────────────────────────────────────────────
function safeBase64Decode(str: string): string {
  try {
    // 1. Normalize URL-safe base64
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    // 2. Add padding if needed
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
    // 3. Decode binary string
    const binary = atob(base64);
    // 4. Handle UTF-8 encoding
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch {
    // Direct atob fallback
    try {
      return atob(str);
    } catch {
      return '';
    }
  }
}

// ── Spinner UI ────────────────────────────────────────────────────────────────
function OAuthSpinner({ label }: { label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#08060f',
        gap: 20,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          border: '3px solid rgba(212,168,67,0.15)',
          borderTop: '3px solid #D4A843',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <p
        style={{
          fontSize: 14,
          color: 'rgba(212,168,67,0.85)',
          margin: 0,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
        }}
      >
        {label}
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Inner Callback Handler ────────────────────────────────────────────────────
function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [label, setLabel] = useState('Authenticating and preparing dashboard…');

  useEffect(() => {
    // Read parameters with fallback to window.location.search (synchronous & immune to SSR/hydration delays)
    let token: string | null = null;
    let userB64: string | null = null;
    let provider = 'oauth';
    let error: string | null = null;

    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      token = urlParams.get('token') || searchParams?.get('token') || null;
      userB64 = urlParams.get('user') || searchParams?.get('user') || null;
      provider = urlParams.get('provider') || searchParams?.get('provider') || 'oauth';
      error = urlParams.get('error') || searchParams?.get('error') || null;
    } else {
      token = searchParams?.get('token') || null;
      userB64 = searchParams?.get('user') || null;
      provider = searchParams?.get('provider') || 'oauth';
      error = searchParams?.get('error') || null;
    }

    // ── Error path ────────────────────────────────────────────────────────────
    if (error) {
      console.error('[OAuth Callback] OAuth error received:', error);
      if (typeof window !== 'undefined') {
        window.location.replace(`/auth?error=${encodeURIComponent(error)}`);
      } else {
        router.replace(`/auth?error=${error}`);
      }
      return;
    }

    if (!token) {
      console.error('[OAuth Callback] Missing token in query params');
      if (typeof window !== 'undefined') {
        window.location.replace('/auth?error=missing_token');
      } else {
        router.replace('/auth?error=missing_token');
      }
      return;
    }

    try {
      // 1. Parse user payload from base64 or decode directly from JWT
      let decodedUser: any = null;

      if (userB64) {
        const jsonStr = safeBase64Decode(userB64);
        if (jsonStr) {
          try {
            decodedUser = JSON.parse(jsonStr);
          } catch (e) {
            console.warn('[OAuth Callback] Failed to JSON.parse userB64:', e);
          }
        }
      }

      // If user payload wasn't provided or failed to parse, extract identity from JWT payload
      if (!decodedUser && token.includes('.')) {
        try {
          const parts = token.split('.');
          if (parts.length >= 2) {
            const jwtPayload = JSON.parse(safeBase64Decode(parts[1]));
            decodedUser = {
              id: jwtPayload.id,
              name: jwtPayload.name || 'Verified User',
              email: jwtPayload.email || '',
              role: jwtPayload.role || 'student',
              avatar: jwtPayload.avatar || '',
              isVerified: true,
              isActive: true,
              authProvider: provider,
            };
          }
        } catch (jwtErr) {
          console.warn('[OAuth Callback] Failed to decode JWT payload:', jwtErr);
        }
      }

      const role = (decodedUser?.role || 'student').toLowerCase();
      const authUser: AuthUser = {
        _id: decodedUser?.id || decodedUser?._id,
        id: decodedUser?.id || decodedUser?._id,
        name: decodedUser?.name || 'Verified User',
        email: decodedUser?.email || '',
        role: role as any,
        avatar: decodedUser?.avatar || '',
        isVerified: decodedUser?.isVerified ?? true,
        isActive: decodedUser?.isActive ?? true,
        authProvider: (decodedUser?.authProvider || provider) as any,
        createdAt: new Date().toISOString(),
      };

      // Check if account is suspended
      if (authUser.isActive === false) {
        console.warn('[OAuth Callback] Account is suspended');
        if (typeof window !== 'undefined') {
          window.location.replace('/auth?error=account_suspended');
        } else {
          router.replace('/auth?error=account_suspended');
        }
        return;
      }

      // 2. Persist tokens in localStorage, Cookies, and Zustand store
      setTokens(token, role);
      useAuthStore.getState().setAuth(authUser, token);

      // 3. Determine target destination route
      const destination = ROLE_ROUTES[role] || '/student';
      setLabel(`Welcome${authUser.name ? `, ${authUser.name}` : ''}! Launching workspace…`);

      // 4. Clean and reliable redirect: replace URL so token is not retained in browser history
      if (typeof window !== 'undefined') {
        window.location.replace(destination);
      } else {
        router.replace(destination);
      }
    } catch (err) {
      console.error('[OAuth Callback] Exception in callback processing:', err);
      if (typeof window !== 'undefined') {
        window.location.replace('/auth?error=oauth_failed');
      } else {
        router.replace('/auth?error=oauth_failed');
      }
    }
  }, [router, searchParams]);

  return <OAuthSpinner label={label} />;
}

// ── Main Page Export (Wrapped with Suspense boundary) ─────────────────────────
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<OAuthSpinner label="Completing sign in…" />}>
      <CallbackHandler />
    </Suspense>
  );
}
