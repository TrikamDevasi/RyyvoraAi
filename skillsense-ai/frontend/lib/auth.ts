// frontend/lib/auth.ts
// Token helpers — sets and removes JWT tokens in localStorage and cookies.

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export function setTokens(accessToken: string, role?: string) {
  if (typeof window === 'undefined') return;

  localStorage.setItem('skillsense_token', accessToken);
  if (role) {
    localStorage.setItem('skillsense_role', role);
  }

  // Cookie for Next.js Edge Middleware route gating
  document.cookie = `skillsense_token=${accessToken}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  if (role) {
    document.cookie = `skillsense_role=${role}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  }
}

export function removeTokens() {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('skillsense_token');
  localStorage.removeItem('skillsense_role');
  localStorage.removeItem('ss_user');

  document.cookie = 'skillsense_token=; path=/; max-age=0; SameSite=Lax';
  document.cookie = 'skillsense_role=; path=/; max-age=0; SameSite=Lax';
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('skillsense_token');
}

export function getTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)skillsense_token=([^;]+)/);
  return match ? match[1] : null;
}
