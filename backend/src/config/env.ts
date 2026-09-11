import dotenv from 'dotenv';
dotenv.config();
import { z } from 'zod';
import logger from '../utils/logger';

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGIN: z.string().default('http://localhost:3000,http://localhost:5173'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  
  // Database
  MONGODB_URI: z.string().default('mongodb://localhost:27017/skillsense'),
  REDIS_URL: z.string().default('redis://localhost:6379'),

  // JWT
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters').default('skillsense_jwt_secret_production_key_32chars_min'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  SESSION_SECRET: z.string().default('skillsense_session_secret_key_production_32'),

  // Email — Resend is the primary provider; Gmail is the legacy fallback
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().optional(),
  GMAIL_USER: z.string().optional(),
  GMAIL_APP_PASSWORD: z.string().optional(),
  
  // AI Keys
  GEMINI_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  PERPLEXITY_API_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),

  // OAuth (Optional)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GITHUB_CALLBACK_URL: z.string().optional(),
  
  // Passport / Credential HMAC signing secret
  // In production this MUST be a strong random secret — the default will cause a fatal error.
  PASSPORT_SECRET: z.string().optional(),

  // Public passport verification base URL
  BASE_VERIFICATION_URL: z.string().optional(),

  // ── Demo Access Control ──────────────────────────────────────────────────────
  // DEMO_MODE=true enables the /auth/demo-login endpoint for hackathon evaluation.
  // This endpoint is blocked in production unless explicitly enabled.
  DEMO_MODE: z.enum(['true', 'false']).default('false'),

  // ── Billing Configuration ───────────────────────────────────────────────────
  // BILLING_MODE: 'demo' (default, no real payment) | 'razorpay' | 'stripe'
  BILLING_MODE: z.enum(['demo', 'razorpay', 'stripe']).default('demo'),
  // Razorpay (only needed when BILLING_MODE=razorpay)
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  // Generic webhook signature secret (used by any real provider)
  BILLING_WEBHOOK_SECRET: z.string().optional(),
});

/** Known insecure default secrets that must never be used in production */
const INSECURE_PASSPORT_DEFAULTS = [
  'skillsense-default-secret',
  'skillsense-passport-verification-secret',
  'passport-secret',
  'secret',
];

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    logger.error('Invalid environment variables:', result.error.format());
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Fatal: Invalid environment configuration in production');
    }
  }

  const data = result.success ? result.data : envSchema.parse({});

  // ── Security guard: JWT ──────────────────────────────────────────────────────
  if (data.NODE_ENV === 'production') {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'skillsense_jwt_secret_production_key_32chars_min') {
      throw new Error('Fatal Security Invariant: JWT_SECRET must be set to a secure, unique 32+ character key in production.');
    }
  }

  // ── Security guard: PASSPORT_SECRET ─────────────────────────────────────────
  const rawPassportSecret = data.PASSPORT_SECRET;
  if (data.NODE_ENV === 'production') {
    if (!rawPassportSecret || INSECURE_PASSPORT_DEFAULTS.includes(rawPassportSecret)) {
      throw new Error(
        'Fatal Security Invariant: PASSPORT_SECRET must be set to a strong, unique random value in production. ' +
        'Set PASSPORT_SECRET in your environment. Do not use default values.'
      );
    }
  } else if (!rawPassportSecret || INSECURE_PASSPORT_DEFAULTS.includes(rawPassportSecret)) {
    // Development: use a clearly-marked development-only value but warn loudly
    logger.warn(
      '[SECURITY WARNING] PASSPORT_SECRET is not set or is using an insecure default. ' +
      'Skill Passport HMAC signatures are NOT production-grade. ' +
      'Set PASSPORT_SECRET in your .env file before deploying.'
    );
  }

  return data;
};

export const env = parseEnv();
export default env;
