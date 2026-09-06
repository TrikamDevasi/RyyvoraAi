import Redis from 'ioredis';
import logger from '../utils/logger';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const isTLS = redisUrl.startsWith('rediss://');

const redisClient = new Redis(redisUrl, {
  lazyConnect: true,
  maxRetriesPerRequest: 0,
  enableOfflineQueue: false,
  retryStrategy: () => null,
  ...(isTLS ? { tls: { rejectUnauthorized: false } } : {}),
});

redisClient.on('connect', () => {
  logger.info('Redis connected successfully');
});

redisClient.on('error', (err) => {
  if ((err as NodeJS.ErrnoException).code !== 'ECONNREFUSED') {
    logger.error('Redis error:', err);
  }
});

export default redisClient;
