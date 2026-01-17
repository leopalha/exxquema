/**
 * FLAME Lounge Bar - Winston Logger Configuration
 *
 * Structured logging with rotation and multiple transports
 */

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

// Custom log format
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console format (human-readable)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
  })
);

// Create logs directory
const logsDir = path.join(process.cwd(), 'logs');

/**
 * Daily rotate file transport for errors
 */
const errorFileTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxSize: '20m',
  maxFiles: '14d',
  format: customFormat,
});

/**
 * Daily rotate file transport for all logs
 */
const combinedFileTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'combined-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '30d',
  format: customFormat,
});

/**
 * Daily rotate file transport for security events
 */
const securityFileTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'security-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  level: 'warn',
  maxSize: '20m',
  maxFiles: '90d', // Keep security logs longer
  format: customFormat,
});

/**
 * Create Winston logger instance
 */
const logger = winston.createLogger({
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
    new DailyRotateFile({
      filename: path.join(logsDir, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
    }),
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(logsDir, 'rejections-%DATE%.log'),
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
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
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

export const logInfo = (message: string, meta?: Record<string, any>) => {
  logger.info(message, meta);
};

export const logError = (message: string, error?: Error, meta?: Record<string, any>) => {
  logger.error(message, {
    error: error?.message,
    stack: error?.stack,
    ...meta,
  });
};

export const logWarn = (message: string, meta?: Record<string, any>) => {
  logger.warn(message, meta);
};

export const logDebug = (message: string, meta?: Record<string, any>) => {
  logger.debug(message, meta);
};

export const logHttp = (message: string, meta?: Record<string, any>) => {
  logger.http(message, meta);
};

/**
 * Log security events (auth failures, suspicious activity, etc.)
 */
export const logSecurity = (event: string, details: Record<string, any>) => {
  logger.warn(`SECURITY: ${event}`, {
    ...details,
    timestamp: new Date().toISOString(),
    security: true,
  });
};

/**
 * Log database queries (for performance monitoring)
 */
export const logQuery = (query: string, duration: number, meta?: Record<string, any>) => {
  if (duration > 1000) {
    // Log slow queries as warnings
    logger.warn('Slow query detected', {
      query,
      duration: `${duration}ms`,
      ...meta,
    });
  } else if (process.env.LOG_LEVEL === 'debug') {
    logger.debug('Database query', {
      query,
      duration: `${duration}ms`,
      ...meta,
    });
  }
};

/**
 * Log API requests
 */
export const logRequest = (req: any) => {
  logger.http(`${req.method} ${req.url}`, {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: req.user?.id,
  });
};

/**
 * Log API responses
 */
export const logResponse = (req: any, res: any, duration: number) => {
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

export default logger;
