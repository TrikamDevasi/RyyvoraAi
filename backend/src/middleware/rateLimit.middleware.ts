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

export const otpSendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Max 10 OTP generation attempts per 15m per IP
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
  message: rateLimitResponse('Too many verification codes requested. Please wait 15 minutes before trying again.'),
});

export const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25, // Max 25 verification attempts per 15m
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
  message: rateLimitResponse('Too many verification attempts. Please wait 15 minutes before trying again.'),
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Increased for interactive neural assessments & analysis
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
  message: rateLimitResponse('AI rate limit exceeded. Please wait before making more AI requests.'),
});

export const verificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120, // Max 120 public verification queries per 15m per IP
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
  message: rateLimitResponse('Too many verification requests. Please try again in 15 minutes.'),
});

