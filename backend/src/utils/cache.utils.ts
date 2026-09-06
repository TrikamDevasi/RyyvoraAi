import redisClient from '../config/redis';
import logger from './logger';

const DEFAULT_TTL = 300; // 5 minutes

const isRedisReady = (): boolean => redisClient.status === 'ready';

export const get = async <T>(key: string): Promise<T | null> => {
  if (!isRedisReady()) return null;
  try {
    const data = await redisClient.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch (err) {
    logger.warn(`Cache GET failed for key "${key}":`, err);
    return null;
  }
};

export const set = async (key: string, value: unknown, ttl: number = DEFAULT_TTL): Promise<void> => {
  if (!isRedisReady()) return;
  try {
    await redisClient.set(key, JSON.stringify(value), 'EX', ttl);
  } catch (err) {
    logger.warn(`Cache SET failed for key "${key}":`, err);
  }
};

export const invalidate = async (key: string): Promise<void> => {
  if (!isRedisReady()) return;
  try {
    await redisClient.del(key);
  } catch (err) {
    logger.warn(`Cache DEL failed for key "${key}":`, err);
  }
};

export const invalidatePattern = async (pattern: string): Promise<void> => {
  if (!isRedisReady()) return;
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
  } catch (err) {
    logger.warn(`Cache DEL pattern failed for "${pattern}":`, err);
  }
};
