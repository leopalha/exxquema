"use strict";
/**
 * FLAME Lounge Bar - Redis Configuration
 *
 * Caching layer para melhorar performance
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheMiddleware = exports.cacheDelPattern = exports.cacheDel = exports.cacheSet = exports.cacheGet = exports.closeRedis = exports.getRedisClient = exports.initRedis = void 0;
const redis_1 = require("redis");
const logger_1 = __importDefault(require("./logger"));
/**
 * Cliente Redis singleton
 */
let redisClient = null;
/**
 * Inicializa conexão com Redis
 */
const initRedis = async () => {
    // Skip se não tiver REDIS_URL configurado
    if (!process.env.REDIS_URL) {
        logger_1.default.info('Redis not configured (REDIS_URL not set) - caching disabled');
        return null;
    }
    // Skip em test environment
    if (process.env.NODE_ENV === 'test') {
        logger_1.default.info('Redis skipped in test environment');
        return null;
    }
    try {
        redisClient = (0, redis_1.createClient)({
            url: process.env.REDIS_URL,
            socket: {
                connectTimeout: 10000,
                reconnectStrategy: (retries) => {
                    if (retries > 10) {
                        logger_1.default.error('Redis: Max reconnection attempts reached');
                        return new Error('Max reconnection attempts reached');
                    }
                    // Exponential backoff: 100ms, 200ms, 400ms, 800ms, ...
                    const delay = Math.min(retries * 100, 3000);
                    logger_1.default.warn(`Redis: Reconnecting in ${delay}ms (attempt ${retries})`);
                    return delay;
                },
            },
        });
        // Event handlers
        redisClient.on('error', (err) => {
            logger_1.default.error('Redis client error', err);
        });
        redisClient.on('connect', () => {
            logger_1.default.info('Redis: Connected');
        });
        redisClient.on('reconnecting', () => {
            logger_1.default.warn('Redis: Reconnecting...');
        });
        redisClient.on('ready', () => {
            logger_1.default.info('Redis: Ready to accept commands');
        });
        // Connect
        await redisClient.connect();
        logger_1.default.info('✅ Redis initialized successfully');
        return redisClient;
    }
    catch (error) {
        logger_1.default.error('Failed to initialize Redis', error);
        redisClient = null;
        return null;
    }
};
exports.initRedis = initRedis;
/**
 * Retorna cliente Redis (se disponível)
 */
const getRedisClient = () => {
    return redisClient;
};
exports.getRedisClient = getRedisClient;
/**
 * Fecha conexão com Redis
 */
const closeRedis = async () => {
    if (redisClient) {
        try {
            await redisClient.quit();
            logger_1.default.info('Redis connection closed');
        }
        catch (error) {
            logger_1.default.error('Error closing Redis connection', error);
        }
    }
};
exports.closeRedis = closeRedis;
/**
 * Helper: Get com fallback
 */
const cacheGet = async (key) => {
    if (!redisClient)
        return null;
    try {
        const data = await redisClient.get(key);
        if (!data)
            return null;
        return JSON.parse(data);
    }
    catch (error) {
        logger_1.default.error(`Redis GET error for key: ${key}`, error);
        return null;
    }
};
exports.cacheGet = cacheGet;
/**
 * Helper: Set com TTL
 */
const cacheSet = async (key, value, ttlSeconds = 300 // 5 minutos default
) => {
    if (!redisClient)
        return false;
    try {
        await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
        return true;
    }
    catch (error) {
        logger_1.default.error(`Redis SET error for key: ${key}`, error);
        return false;
    }
};
exports.cacheSet = cacheSet;
/**
 * Helper: Delete
 */
const cacheDel = async (key) => {
    if (!redisClient)
        return false;
    try {
        await redisClient.del(key);
        return true;
    }
    catch (error) {
        logger_1.default.error(`Redis DEL error for key: ${key}`, error);
        return false;
    }
};
exports.cacheDel = cacheDel;
/**
 * Helper: Delete por padrão (ex: "products:*")
 */
const cacheDelPattern = async (pattern) => {
    if (!redisClient)
        return 0;
    try {
        const keys = await redisClient.keys(pattern);
        if (keys.length === 0)
            return 0;
        await redisClient.del(keys);
        return keys.length;
    }
    catch (error) {
        logger_1.default.error(`Redis DEL pattern error for: ${pattern}`, error);
        return 0;
    }
};
exports.cacheDelPattern = cacheDelPattern;
/**
 * Middleware para cache de rotas GET
 */
const cacheMiddleware = (ttlSeconds = 300) => {
    return async (req, res, next) => {
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
            const cachedData = await (0, exports.cacheGet)(cacheKey);
            if (cachedData) {
                logger_1.default.debug(`Cache HIT: ${cacheKey}`);
                return res.json(cachedData);
            }
            // Cache MISS - interceptar res.json
            logger_1.default.debug(`Cache MISS: ${cacheKey}`);
            const originalJson = res.json.bind(res);
            res.json = (data) => {
                // Salvar no cache (fire and forget)
                (0, exports.cacheSet)(cacheKey, data, ttlSeconds).catch((err) => {
                    logger_1.default.error('Failed to cache response', err);
                });
                return originalJson(data);
            };
            next();
        }
        catch (error) {
            logger_1.default.error('Cache middleware error', error);
            next();
        }
    };
};
exports.cacheMiddleware = cacheMiddleware;
exports.default = {
    initRedis: exports.initRedis,
    getRedisClient: exports.getRedisClient,
    closeRedis: exports.closeRedis,
    cacheGet: exports.cacheGet,
    cacheSet: exports.cacheSet,
    cacheDel: exports.cacheDel,
    cacheDelPattern: exports.cacheDelPattern,
    cacheMiddleware: exports.cacheMiddleware,
};
