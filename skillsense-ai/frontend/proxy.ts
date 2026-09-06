// frontend/proxy.ts
// Next.js Edge Proxy — enforces route protection and role-based access with JWT authority.

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
  '/exam',
  '/ai-health',
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
];

const isPublic = (pathname: string): boolean =>
  PUBLIC_PREFIXES.some((p) => pathname.startsWith(p)) || pathname === '/';

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

  // Always allow public routes through
  if (isPublic(pathname)) return NextResponse.next();

  // Only gate on protected paths
  if (!isProtected(pathname)) return NextResponse.next();

  const token = request.cookies.get('skillsense_token')?.value;

  // 1. Not authenticated → redirect to /auth
  if (!token) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/auth';
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Decode the authoritative role from the JWT token (avoids stale cookie desync)
  let role = request.cookies.get('skillsense_role')?.value;
  if (token && token.includes('.')) {
    try {
      const parts = token.split('.');
      if (parts[1]) {
        let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4 !== 0) {
          base64 += '=';
        }
        const json = atob(base64);
        const payload = JSON.parse(json);
        if (payload?.role) {
          role = String(payload.role).toLowerCase();
        }
      }
    } catch {
      // Keep cookie role as fallback
    }
  }

  // 3. Authenticated: verify role permission
  const isDemo = token.startsWith('demo_') || token.includes('demo');
  if (role && !isDemo) {
    const allowed = ROLE_ROUTES[role] ?? [];
    const hasAccess = allowed.some((p) => pathname.startsWith(p));

    if (!hasAccess) {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = `/${role}`;
      homeUrl.search = '';
      const response = NextResponse.redirect(homeUrl);
      response.cookies.set('skillsense_role', role, { path: '/' });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png).*)'],
};
