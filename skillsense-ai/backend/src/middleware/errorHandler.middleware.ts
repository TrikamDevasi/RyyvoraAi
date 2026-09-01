import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { Error as MongooseError } from 'mongoose';
import { MongoServerError } from 'mongodb';
import { ZodError } from 'zod';
import logger from '../utils/logger';
import env from '../config/env';
import { AIUnavailableError, AI_UNAVAILABLE_MESSAGE } from '../services/ai.service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled error:', err);

  // AI provider unavailability (honest 503, never fabricated results)
  if (err instanceof AIUnavailableError) {
    res.status(503).json({
      success: false,
      data: null,
      message: AI_UNAVAILABLE_MESSAGE,
    });
    return;
  }

  // Duplicate key (MongoDB 11000)
  if (err instanceof MongoServerError && err.code === 11000) {
    const field = Object.keys(err.keyPattern ?? {})[0] ?? 'field';
    res.status(400).json({
      success: false,
      data: null,
      message: `Duplicate value for ${field}. Please use a different value.`,
    });
    return;
  }

  // JWT errors
  if (err instanceof JsonWebTokenError) {
    res.status(401).json({
      success: false,
      data: null,
      message: 'Invalid or expired authentication token.',
    });
    return;
  }

  // Mongoose ValidationError
  if (err instanceof MongooseError.ValidationError) {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    res.status(400).json({
      success: false,
      data: null,
      message: 'Validation failed',
      errors,
    });
    return;
  }

  // Zod ValidationError
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({ field: e.path.join('.'), message: e.message }));
    res.status(400).json({
      success: false,
      data: null,
      message: 'Request validation failed',
      errors,
    });
    return;
  }

  // Default 500: conceal internal details in production
  const isProd = env.NODE_ENV === 'production';
  const message = isProd
    ? 'An unexpected internal error occurred. Please try again later.'
    : (err instanceof Error ? err.message : 'Internal server error');

  res.status(500).json({
    success: false,
    data: null,
    message,
  });
};

export default errorHandler;
