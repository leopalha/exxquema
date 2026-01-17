const { getRedisClient } = require('../config/redis');
const logger = require('../config/logger');

const cacheMiddleware = (ttl = 300) => {
  return async (req, res, next) => {
    if (process.env.NODE_ENV === 'test' || req.method !== 'GET') {
      return next();
    }

    const redis = getRedisClient();
    if (!redis) return next();

    try {
      const cacheKey = 'cache:' + (req.originalUrl || req.url);
      const cached = await redis.get(cacheKey);

      if (cached) {
        logger.debug('Cache HIT: ' + cacheKey);
        return res.json(JSON.parse(cached));
      }

      logger.debug('Cache MISS: ' + cacheKey);

      const originalJson = res.json.bind(res);
      res.json = async (data) => {
        if (res.statusCode === 200) {
          try {
            await redis.setEx(cacheKey, ttl, JSON.stringify(data));
          } catch (error) {
            logger.error('Error saving to cache', error);
          }
        }
        return originalJson(data);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error', error);
      next();
    }
  };
};

const invalidateCache = async (pattern) => {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    const keys = [];
    for await (const key of redis.scanIterator({ MATCH: pattern })) {
      keys.push(key);
    }
    if (keys.length > 0) {
      await redis.del(keys);
      logger.info('Invalidated ' + keys.length + ' cache keys');
    }
  } catch (error) {
    logger.error('Error invalidating cache', error);
  }
};

module.exports = { cacheMiddleware, invalidateCache };
