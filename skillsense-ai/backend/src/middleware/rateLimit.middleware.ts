import rateLimit from 'express-rate-limit';

const rateLimitResponse = (message: string) => ({
  success: false,
  message,
  data: null,
});

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3000, // Generous ceiling for rich SPA dashboards and telemetry
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS' || req.path === '/health' || req.path === '/',
  message: rateLimitResponse('Too many requests. Please try again in 15 minutes.'),
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60, // Increased for authentication attempts
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
  message: rateLimitResponse('Too many authentication attempts. Please try again in 15 minutes.'),
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Increased for interactive neural assessments & analysis
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
  message: rateLimitResponse('AI rate limit exceeded. Please wait before making more AI requests.'),
});

