// backend/src/config/origins.ts
// Centralized trusted origins for CORS and OAuth redirect sanitization.

import env from './env';

export const allowedOrigins: string[] = [
  'https://ryyvora.ai',
  'https://www.ryyvora.ai',
  'https://ryyvora.com',
  'https://www.ryyvora.com',
  'https://ryyvora-ai.vercel.app',
  'https://skillsense-ai.vercel.app',
  'https://skillsense.vercel.app',
  ...(env.NODE_ENV !== 'production' ? [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:5173',
  ] : []),
  ...env.CORS_ORIGIN.split(',').map((o) => o.trim()),
].filter(Boolean);

/**
 * Validates and sanitizes untrusted origin queries to prevent OAuth open redirect attacks.
 */
export function validateTrustedOrigin(candidate: string | null | undefined): string {
  const fallback = env.FRONTEND_URL || (env.NODE_ENV === 'production' ? 'https://ryyvora.ai' : 'http://localhost:3000');
  if (!candidate) return fallback;
  try {
    const parsed = new URL(candidate);
    if (allowedOrigins.includes(parsed.origin)) {
      return parsed.origin;
    }
  } catch {
    // Ignore URL parse errors
  }
  return fallback;
}
