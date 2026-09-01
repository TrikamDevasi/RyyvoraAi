// frontend/proxy.ts
// Next.js Edge Proxy — enforces route protection and role-based access.

import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PREFIXES = ['/admin', '/student', '/institute', '/industry', '/government', '/employer'];

const ROLE_ROUTES: Record<string, string[]> = {
  admin:      ['/admin', '/student', '/institute', '/industry', '/government', '/employer'],
  student:    ['/student'],
  institute:  ['/institute'],
  industry:   ['/industry'],
  government: ['/government'],
  employer:   ['/employer'],
};

const PUBLIC_PREFIXES = ['/auth', '/api', '/_next', '/favicon', '/icon', '/share', '/exam', '/ai-health', '/verify'];

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
  const role  = request.cookies.get('skillsense_role')?.value;

  // 1. Not authenticated → redirect to /auth
  if (!token) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/auth';
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated but wrong role → redirect to their own dashboard
  if (role) {
    const allowed = ROLE_ROUTES[role] ?? [];
    const hasAccess = allowed.some((p) => pathname.startsWith(p));

    if (!hasAccess) {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = `/${role}`;
      homeUrl.search = '';
      return NextResponse.redirect(homeUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png).*)'],
};
