// frontend/proxy.ts
// Authoritative Next.js Proxy (Next.js 16+) — enforces strict authentication and role-based route access.

import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PREFIXES = ['/admin', '/student', '/institute', '/industry', '/government', '/employer'];

const ROLE_ROUTES: Record<string, string[]> = {
  admin:      ['/admin', '/student', '/institute', '/industry', '/government', '/employer', '/settings', '/profile'],
  student:    ['/student', '/settings', '/profile'],
  institute:  ['/institute', '/settings', '/profile', '/student/profile'],
  industry:   ['/industry', '/employer', '/settings', '/profile', '/student/profile'],
  government: ['/government', '/admin/fairness', '/admin/reports', '/settings', '/profile', '/student/profile'],
  employer:   ['/employer', '/industry', '/settings', '/profile', '/student/profile'],
};

const PUBLIC_PREFIXES = [
  '/auth',
  '/api',
  '/_next',
  '/favicon',
  '/icon',
  '/share',
  '/verify',
  '/about',
  '/how-it-works',
  '/for-government',
  '/for-employers',
  '/for-training-providers',
  '/for-trainees',
  '/workforce-analytics',
  '/employer-verification',
  '/skill-passport',
  '/policy-intelligence',
  '/dpdp-trust',
  '/pricing',
  '/faq',
  '/contact',
  '/sitemap',
  '/robots',
  '/images',
];

const isPublic = (pathname: string): boolean =>
  pathname === '/' || PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));

const isProtected = (pathname: string): boolean =>
  PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

export default function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Legacy /login redirect to /auth
  if (pathname === '/login') {
    const authUrl = request.nextUrl.clone();
    authUrl.pathname = '/auth';
    return NextResponse.redirect(authUrl);
  }

  // Allow all public routes through immediately
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Only gate protected paths
  if (!isProtected(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('ryyvora_token')?.value || request.cookies.get('skillsense_token')?.value;

  // 1. Unauthenticated -> Redirect to /auth
  if (!token) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/auth';
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Decode authoritative role from JWT claims
  let role: string | null = null;
  if (token && token.includes('.')) {
    try {
      const parts = token.split('.');
      if (parts.length === 3 && parts[1]) {
        let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4 !== 0) {
          base64 += '=';
        }
        const json = atob(base64);
        const payload = JSON.parse(json);
        if (payload?.role) {
          role = String(payload.role).toLowerCase();
        }
        // Check JWT expiration if present
        if (payload?.exp && typeof payload.exp === 'number') {
          const nowInSec = Math.floor(Date.now() / 1000);
          if (payload.exp < nowInSec) {
            // Expired JWT
            const loginUrl = request.nextUrl.clone();
            loginUrl.pathname = '/auth';
            loginUrl.searchParams.set('error', 'session_expired');
            const res = NextResponse.redirect(loginUrl);
            res.cookies.delete('ryyvora_token');
            res.cookies.delete('skillsense_token');
            return res;
          }
        }
      }
    } catch {
      // Invalid JWT structure
    }
  }

  // Fallback to cookie role only if JWT decoding failed but token exists
  if (!role) {
    role = request.cookies.get('ryyvora_role')?.value || request.cookies.get('skillsense_role')?.value || null;
  }

  // If role is still undetermined, force sign in
  if (!role) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/auth';
    loginUrl.searchParams.set('error', 'missing_token');
    return NextResponse.redirect(loginUrl);
  }

  // 3. Authenticated: Enforce strict role-based access control (RBAC)
  const allowed = ROLE_ROUTES[role] ?? [];
  const hasAccess = allowed.some((p) => pathname.startsWith(p));

  if (!hasAccess) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = `/${role}`;
    homeUrl.search = '';
    const response = NextResponse.redirect(homeUrl);
    response.cookies.set('ryyvora_role', role, { path: '/' });
    response.cookies.set('skillsense_role', role, { path: '/' });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png).*)'],
};
