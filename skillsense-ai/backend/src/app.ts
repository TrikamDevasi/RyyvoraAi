import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import { generalLimiter } from './middleware/rateLimit.middleware';
import errorHandler from './middleware/errorHandler.middleware';
import logger from './utils/logger';
import passportConfig from './config/passport';
import session from 'express-session';

import authRouter from './routes/auth.routes';
import studentRouter from './routes/student.routes';
import instituteRouter from './routes/institute.routes';
import industryRouter from './routes/industry.routes';
import analyticsRouter from './routes/analytics.routes';
import governanceRouter from './routes/governance.routes';
import adminRouter from './routes/admin.routes';
import aiRouter from './routes/ai.routes';
import contactRouter from './routes/contact.routes';

const app = express();

// ── Security & CORS ────────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "unsafe-none" } // Helps with OAuth popup redirects if needed
}));

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://[::1]:3000',
  'https://skillsense-ai-seven.vercel.app',
  ...(process.env.CORS_ORIGIN?.split(',') || []),
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // 1. Allow if no origin (server-to-server, Postman)
    if (!origin) return callback(null, true);
    
    // 2. Allow if in explicit list
    if (allowedOrigins.includes(origin)) return callback(null, true);
    
    // 3. Allow all Vercel preview deployments
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    
    logger.warn(`[CORS] Rejected origin: ${origin}`);
    return callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));


// ── Body Parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Session & Passport (for OAuth) ────────────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET || 'skillsense_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
}));
app.use(passportConfig.initialize());
// Note: passportConfig.session() is intentionally omitted — we use JWT, not session auth
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
  res.status(200).json({ success: true, message: 'SkillSense Backend API is running locally.' });
});

// ── Health Check ───────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, data: { status: 'ok', uptime: process.uptime() }, message: 'Server is healthy' });
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

// ── 404 Handler ────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, data: null, message: 'Route not found' });
});

// ── Global Error Handler ───────────────────────────────────────────────────
app.use(errorHandler);

export default app;
