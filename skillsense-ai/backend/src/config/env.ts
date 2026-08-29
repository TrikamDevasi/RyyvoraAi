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

  // Email (Gmail or SMTP)
  GMAIL_USER: z.string().optional(),
  GMAIL_APP_PASSWORD: z.string().optional(),
  
  // AI Keys
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
  
  // Passport secret
  PASSPORT_SECRET: z.string().default('skillsense-passport-verification-secret'),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    logger.error('Invalid environment variables:', result.error.format());
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Fatal: Invalid environment configuration in production');
    }
  }
  return result.success ? result.data : envSchema.parse({});
};

export const env = parseEnv();
export default env;
