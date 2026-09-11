// frontend/lib/auth.ts
// Token helpers — sets and removes JWT tokens in localStorage and cookies.
//
// DUAL-TOKEN DESIGN (intentional backward compatibility):
//   - Canonical token: ryyvora_token  (primary, current brand)
//   - Legacy token:    skillsense_token (kept for session backward compat during brand migration)
//   Both tokens carry the same JWT value. Middleware accepts either.
//   Once all legacy sessions expire (after JWT_EXPIRE period), skillsense_token can be removed.

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export function setTokens(accessToken: string, role?: string) {
  if (typeof window === 'undefined') return;

  localStorage.setItem('ryyvora_token', accessToken);
  localStorage.setItem('skillsense_token', accessToken); // backward compat
  if (role) {
    localStorage.setItem('ryyvora_role', role);
    localStorage.setItem('skillsense_role', role); // backward compat
  }

  // Cookie for Next.js Edge Middleware route gating
  document.cookie = `ryyvora_token=${accessToken}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.cookie = `skillsense_token=${accessToken}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`; // backward compat
  if (role) {
    document.cookie = `ryyvora_role=${role}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
    document.cookie = `skillsense_role=${role}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`; // backward compat
  }
}

export function removeTokens() {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('ryyvora_token');
  localStorage.removeItem('skillsense_token');
  localStorage.removeItem('ryyvora_role');
  localStorage.removeItem('skillsense_role');
  localStorage.removeItem('ss_user');
  localStorage.removeItem('ryyvora_user');

  document.cookie = 'ryyvora_token=; path=/; max-age=0; SameSite=Lax';
  document.cookie = 'skillsense_token=; path=/; max-age=0; SameSite=Lax';
  document.cookie = 'ryyvora_role=; path=/; max-age=0; SameSite=Lax';
  document.cookie = 'skillsense_role=; path=/; max-age=0; SameSite=Lax';
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ryyvora_token') || localStorage.getItem('skillsense_token');
}

export function getTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)(?:ryyvora_token|skillsense_token)=([^;]+)/);
  return match ? match[1] : null;
}
