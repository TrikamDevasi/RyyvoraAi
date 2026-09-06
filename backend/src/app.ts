import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import mongoose from 'mongoose';

import env from './config/env';
import { generalLimiter } from './middleware/rateLimit.middleware';
import errorHandler from './middleware/errorHandler.middleware';
import logger from './utils/logger';
import passportConfig from './config/passport';
import redisClient from './config/redis';

import authRouter from './routes/auth.routes';
import studentRouter from './routes/student.routes';
import instituteRouter from './routes/institute.routes';
import industryRouter from './routes/industry.routes';
import analyticsRouter from './routes/analytics.routes';
import governanceRouter from './routes/governance.routes';
import adminRouter from './routes/admin.routes';
import aiRouter from './routes/ai.routes';
import contactRouter from './routes/contact.routes';
import assessmentRouter from './routes/assessment.routes';
import outcomeRouter from './routes/outcome.routes';
import consentRouter from './routes/consent.routes';
import followupRouter from './routes/followup.routes';
import verificationRouter from './routes/verification.routes';
import dataQualityRouter from './routes/dataQuality.routes';
import billingRouter from './routes/billing.routes';


const app = express();

// Trust reverse proxies (Vercel, Render, AWS ALB, Nginx, Cloudflare)
app.set('trust proxy', 1);

// ── Simple Cookie Parser Middleware ─────────────────────────────────────────
app.use((req, _res, next) => {
  const cookieHeader = req.headers.cookie;
  (req as unknown as { cookies: Record<string, string> }).cookies = {};
  if (cookieHeader) {
    cookieHeader.split(';').forEach((cookie) => {
      const parts = cookie.split('=');
      const name = parts[0]?.trim();
      const val = parts.slice(1).join('=').trim();
      if (name) (req as unknown as { cookies: Record<string, string> }).cookies[name] = decodeURIComponent(val);
    });
  }
  next();
});

// ── Security & CORS ────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "unsafe-none" }
}));

// Strict allowlist: No wildcard regex patterns
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:5173',
  'https://ryyvora.com',
  'https://www.ryyvora.com',
  'https://ryyvora-ai.vercel.app',
  'https://skillsense-ai.vercel.app',
  'https://skillsense.vercel.app',
  ...env.CORS_ORIGIN.split(',').map(o => o.trim()),
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests without origin header (e.g. server-to-server, mobile app)
    if (!origin) return callback(null, true);
    
    // Strict exact allowlist match
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    logger.warn(`[CORS] Rejected untrusted origin: ${origin}`);
    return callback(new Error(`CORS blocked: Origin '${origin}' is not authorized.`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization', 'Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));

// ── Body Parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Session & Passport (for OAuth) ────────────────────────────────────────
app.use(session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: env.NODE_ENV === 'production', httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
}));
app.use(passportConfig.initialize());

app.use(
  morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  })
);

// ── Rate Limiting ──────────────────────────────────────────────────────────
app.use(generalLimiter);

// ── Root Route ──────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.status(200).json({ success: true, message: 'Ryyvora AI Backend API is running.' });
});

// ── Health Check ───────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected';
  const redisStatus = redisClient.status === 'ready' || redisClient.status === 'connect' ? 'connected' : 'disconnected';
  const isHealthy = dbState === 1;

  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    data: {
      status: isHealthy ? 'ok' : 'degraded',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      services: {
        database: { status: dbStatus, healthy: dbStatus === 'connected' },
        redis: { status: redisStatus, healthy: redisStatus === 'connected' },
      },
    },
    message: isHealthy ? 'All services operational' : 'Database service is unavailable',
  });
});

app.get('/api/v1/ai-health', async (_req, res) => {
  const { aiService } = await import('./services/ai.service');
  const results = await aiService.testConnectivity();
  res.status(200).json({ success: true, data: results });
});

// ── API Routes ─────────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/students', studentRouter);
app.use('/api/v1/institutes', instituteRouter);
app.use('/api/v1/ai', aiRouter);
app.use('/api/v1/contact', contactRouter);
app.use('/api/v1/industry', industryRouter);
app.use('/api/v1/analytics', analyticsRouter);
app.use('/api/v1/governance', governanceRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/assessments', assessmentRouter);
app.use('/api/v1/outcomes', outcomeRouter);
app.use('/api/v1/consent', consentRouter);
app.use('/api/v1/followups', followupRouter);
app.use('/api/v1/verification', verificationRouter);
app.use('/api/v1/data-quality', dataQualityRouter);
app.use('/api/v1/billing', billingRouter);


// ── 404 Handler ────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, data: null, message: 'Route not found' });
});

// ── Global Error Handler ───────────────────────────────────────────────────
app.use(errorHandler);

export default app;
