import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import connectDB from './config/db';
import redisClient from './config/redis';
import logger from './utils/logger';
import { followUpSchedulerService } from './services/followupScheduler.service';
import { retentionService } from './services/retention.service';

const PORT = parseInt(process.env.PORT || '5000', 10);

const startServer = async () => {
  try {
    // Connect to MongoDB (required — will exit on failure)
    await connectDB();

    // Connect to Redis (optional — server continues without it)
    try {
      await redisClient.connect();
    } catch (redisErr) {
      logger.warn('Redis unavailable — caching disabled. Server will continue without Redis.', redisErr);
    }

    // ── Background Services ───────────────────────────────────────────────
    // Run an initial retention batch pass on startup (catches any missed updates)
    retentionService.updateRetentionStatuses().catch((err) => {
      logger.error('Initial retention batch failed (non-fatal):', err);
    });

    // Start the follow-up scheduler (runs every 6 hours; first run is immediate)
    followUpSchedulerService.start();

    // Start HTTP server
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV ?? 'development'} mode`);
    });

    // ── Graceful Shutdown ─────────────────────────────────────────────────
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received — shutting down gracefully`);

      // Stop background services first
      followUpSchedulerService.stop();

      server.close(async () => {
        logger.info('HTTP server closed');
        try {
          if (redisClient.status === 'ready') {
            await redisClient.quit();
            logger.info('Redis connection closed');
          }
          process.exit(0);
        } catch (err) {
          logger.error('Error during shutdown:', err);
          process.exit(1);
        }
      });

      // Force exit if shutdown takes too long
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10_000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
