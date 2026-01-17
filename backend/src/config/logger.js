"use strict";
/**
 * FLAME Lounge Bar - Winston Logger Configuration
 *
 * Structured logging with rotation and multiple transports
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logResponse = exports.logRequest = exports.logQuery = exports.logSecurity = exports.logHttp = exports.logDebug = exports.logWarn = exports.logError = exports.logInfo = void 0;
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const path_1 = __importDefault(require("path"));
// Custom log format
const customFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), winston_1.default.format.json());
// Console format (human-readable)
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
}));
// Create logs directory
const logsDir = path_1.default.join(process.cwd(), 'logs');
/**
 * Daily rotate file transport for errors
 */
const errorFileTransport = new winston_daily_rotate_file_1.default({
    filename: path_1.default.join(logsDir, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxSize: '20m',
    maxFiles: '14d',
    format: customFormat,
});
/**
 * Daily rotate file transport for all logs
 */
const combinedFileTransport = new winston_daily_rotate_file_1.default({
    filename: path_1.default.join(logsDir, 'combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '30d',
    format: customFormat,
});
/**
 * Daily rotate file transport for security events
 */
const securityFileTransport = new winston_daily_rotate_file_1.default({
    filename: path_1.default.join(logsDir, 'security-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'warn',
    maxSize: '20m',
    maxFiles: '90d', // Keep security logs longer
    format: customFormat,
});
/**
 * Create Winston logger instance
 */
const logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: customFormat,
    defaultMeta: {
        service: 'flame-lounge-api',
        environment: process.env.NODE_ENV || 'development',
    },
    transports: [
        // Always log errors and security events to files
        errorFileTransport,
        securityFileTransport,
    ],
    exceptionHandlers: [
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(logsDir, 'exceptions-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '30d',
        }),
    ],
    rejectionHandlers: [
        new winston_daily_rotate_file_1.default({
            filename: path_1.default.join(logsDir, 'rejections-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '30d',
        }),
    ],
});
// Add combined file transport in production
if (process.env.NODE_ENV === 'production') {
    logger.add(combinedFileTransport);
}
// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.default.transports.Console({
        format: consoleFormat,
    }));
}
/**
 * Log levels:
 * - error: 0
 * - warn: 1
 * - info: 2
 * - http: 3
 * - verbose: 4
 * - debug: 5
 * - silly: 6
 */
/**
 * Helper functions for structured logging
 */
const logInfo = (message, meta) => {
    logger.info(message, meta);
};
exports.logInfo = logInfo;
const logError = (message, error, meta) => {
    logger.error(message, {
        error: error?.message,
        stack: error?.stack,
        ...meta,
    });
};
exports.logError = logError;
const logWarn = (message, meta) => {
    logger.warn(message, meta);
};
exports.logWarn = logWarn;
const logDebug = (message, meta) => {
    logger.debug(message, meta);
};
exports.logDebug = logDebug;
const logHttp = (message, meta) => {
    logger.http(message, meta);
};
exports.logHttp = logHttp;
/**
 * Log security events (auth failures, suspicious activity, etc.)
 */
const logSecurity = (event, details) => {
    logger.warn(`SECURITY: ${event}`, {
        ...details,
        timestamp: new Date().toISOString(),
        security: true,
    });
};
exports.logSecurity = logSecurity;
/**
 * Log database queries (for performance monitoring)
 */
const logQuery = (query, duration, meta) => {
    if (duration > 1000) {
        // Log slow queries as warnings
        logger.warn('Slow query detected', {
            query,
            duration: `${duration}ms`,
            ...meta,
        });
    }
    else if (process.env.LOG_LEVEL === 'debug') {
        logger.debug('Database query', {
            query,
            duration: `${duration}ms`,
            ...meta,
        });
    }
};
exports.logQuery = logQuery;
/**
 * Log API requests
 */
const logRequest = (req) => {
    logger.http(`${req.method} ${req.url}`, {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        userId: req.user?.id,
    });
};
exports.logRequest = logRequest;
/**
 * Log API responses
 */
const logResponse = (req, res, duration) => {
    const level = res.statusCode >= 400 ? 'warn' : 'http';
    logger.log(level, `${req.method} ${req.url} ${res.statusCode}`, {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        userId: req.user?.id,
    });
};
exports.logResponse = logResponse;
exports.default = logger;
