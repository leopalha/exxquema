/**
 * FLAME Lounge Bar - Redis Configuration
 *
 * Caching layer para melhorar performance
 */

import { createClient, RedisClientType } from 'redis';
import logger from './logger';

/**
 * Cliente Redis singleton
 */
let redisClient: RedisClientType | null = null;

/**
 * Inicializa conexão com Redis
 */
export const initRedis = async (): Promise<RedisClientType | null> => {
  // Skip se não tiver REDIS_URL configurado
  if (!process.env.REDIS_URL) {
    logger.info('Redis not configured (REDIS_URL not set) - caching disabled');
    return null;
  }

  // Skip em test environment
  if (process.env.NODE_ENV === 'test') {
    logger.info('Redis skipped in test environment');
    return null;
  }

  try {
    redisClient = createClient({
      url: process.env.REDIS_URL,
      socket: {
        connectTimeout: 10000,
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            logger.error('Redis: Max reconnection attempts reached');
            return new Error('Max reconnection attempts reached');
          }
          // Exponential backoff: 100ms, 200ms, 400ms, 800ms, ...
          const delay = Math.min(retries * 100, 3000);
          logger.warn(`Redis: Reconnecting in ${delay}ms (attempt ${retries})`);
          return delay;
        },
      },
    });

    // Event handlers
    redisClient.on('error', (err) => {
      logger.error('Redis client error', err);
    });

    redisClient.on('connect', () => {
      logger.info('Redis: Connected');
    });

    redisClient.on('reconnecting', () => {
      logger.warn('Redis: Reconnecting...');
    });

    redisClient.on('ready', () => {
      logger.info('Redis: Ready to accept commands');
    });

    // Connect
    await redisClient.connect();

    logger.info('✅ Redis initialized successfully');
    return redisClient;
  } catch (error) {
    logger.error('Failed to initialize Redis', error as Error);
    redisClient = null;
    return null;
  }
};

/**
 * Retorna cliente Redis (se disponível)
 */
export const getRedisClient = (): RedisClientType | null => {
  return redisClient;
};

/**
 * Fecha conexão com Redis
 */
export const closeRedis = async (): Promise<void> => {
  if (redisClient) {
    try {
      await redisClient.quit();
      logger.info('Redis connection closed');
    } catch (error) {
      logger.error('Error closing Redis connection', error as Error);
    }
  }
};

/**
 * Helper: Get com fallback
 */
export const cacheGet = async <T = any>(key: string): Promise<T | null> => {
  if (!redisClient) return null;

  try {
    const data = await redisClient.get(key);
    if (!data) return null;

    return JSON.parse(data) as T;
  } catch (error) {
    logger.error(`Redis GET error for key: ${key}`, error as Error);
    return null;
  }
};

/**
 * Helper: Set com TTL
 */
export const cacheSet = async (
  key: string,
  value: any,
  ttlSeconds: number = 300 // 5 minutos default
): Promise<boolean> => {
  if (!redisClient) return false;

  try {
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
    return true;
  } catch (error) {
    logger.error(`Redis SET error for key: ${key}`, error as Error);
    return false;
  }
};

/**
 * Helper: Delete
 */
export const cacheDel = async (key: string): Promise<boolean> => {
  if (!redisClient) return false;

  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error(`Redis DEL error for key: ${key}`, error as Error);
    return false;
  }
};

/**
 * Helper: Delete por padrão (ex: "products:*")
 */
export const cacheDelPattern = async (pattern: string): Promise<number> => {
  if (!redisClient) return 0;

  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length === 0) return 0;

    await redisClient.del(keys);
    return keys.length;
  } catch (error) {
    logger.error(`Redis DEL pattern error for: ${pattern}`, error as Error);
    return 0;
  }
};

/**
 * Middleware para cache de rotas GET
 */
export const cacheMiddleware = (ttlSeconds: number = 300) => {
  return async (req: any, res: any, next: any) => {
    // Apenas GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Skip se não tiver Redis
    if (!redisClient) {
      return next();
    }

    // Cache key baseado em URL + query params
    const cacheKey = `cache:${req.originalUrl || req.url}`;

    try {
      // Tentar obter do cache
      const cachedData = await cacheGet(cacheKey);
      if (cachedData) {
        logger.debug(`Cache HIT: ${cacheKey}`);
        return res.json(cachedData);
      }

      // Cache MISS - interceptar res.json
      logger.debug(`Cache MISS: ${cacheKey}`);
      const originalJson = res.json.bind(res);

      res.json = (data: any) => {
        // Salvar no cache (fire and forget)
        cacheSet(cacheKey, data, ttlSeconds).catch((err) => {
          logger.error('Failed to cache response', err);
        });

        return originalJson(data);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error', error as Error);
      next();
    }
  };
};

export default {
  initRedis,
  getRedisClient,
  closeRedis,
  cacheGet,
  cacheSet,
  cacheDel,
  cacheDelPattern,
  cacheMiddleware,
};
