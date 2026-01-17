/**
 * FLAME Lounge Bar - Logging Middleware
 *
 * Request/response logging with Winston
 */

import { Request, Response, NextFunction } from 'express';
import { logRequest, logResponse, logSecurity } from '../config/logger';

/**
 * Middleware to log all HTTP requests
 */
export function requestLoggingMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();

  // Log incoming request
  logRequest(req);

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logResponse(req, res, duration);

    // Log security events for suspicious activity
    if (res.statusCode === 401 || res.statusCode === 403) {
      logSecurity('Authentication/Authorization failure', {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        ip: req.ip,
        userAgent: req.get('user-agent'),
      });
    }

    // Log rate limiting events
    if (res.statusCode === 429) {
      logSecurity('Rate limit exceeded', {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('user-agent'),
      });
    }
  });

  next();
}

/**
 * Middleware to log authentication attempts
 */
export function authLoggingMiddleware(req: Request, res: Response, next: NextFunction): void {
  const originalJson = res.json;

  res.json = function (data: any) {
    // Log failed login attempts
    if (req.path.includes('/login') && res.statusCode >= 400) {
      logSecurity('Failed login attempt', {
        email: req.body?.email,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        statusCode: res.statusCode,
      });
    }

    // Log successful logins
    if (req.path.includes('/login') && res.statusCode === 200) {
      logSecurity('Successful login', {
        email: req.body?.email,
        ip: req.ip,
        userAgent: req.get('user-agent'),
      });
    }

    return originalJson.call(this, data);
  };

  next();
}
