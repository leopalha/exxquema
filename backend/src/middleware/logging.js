"use strict";
/**
 * FLAME Lounge Bar - Logging Middleware
 *
 * Request/response logging with Winston
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLoggingMiddleware = requestLoggingMiddleware;
exports.authLoggingMiddleware = authLoggingMiddleware;
const logger_1 = require("../config/logger");
/**
 * Middleware to log all HTTP requests
 */
function requestLoggingMiddleware(req, res, next) {
    const startTime = Date.now();
    // Log incoming request
    (0, logger_1.logRequest)(req);
    // Log response when finished
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        (0, logger_1.logResponse)(req, res, duration);
        // Log security events for suspicious activity
        if (res.statusCode === 401 || res.statusCode === 403) {
            (0, logger_1.logSecurity)('Authentication/Authorization failure', {
                method: req.method,
                url: req.url,
                statusCode: res.statusCode,
                ip: req.ip,
                userAgent: req.get('user-agent'),
            });
        }
        // Log rate limiting events
        if (res.statusCode === 429) {
            (0, logger_1.logSecurity)('Rate limit exceeded', {
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
function authLoggingMiddleware(req, res, next) {
    const originalJson = res.json;
    res.json = function (data) {
        // Log failed login attempts
        if (req.path.includes('/login') && res.statusCode >= 400) {
            (0, logger_1.logSecurity)('Failed login attempt', {
                email: req.body?.email,
                ip: req.ip,
                userAgent: req.get('user-agent'),
                statusCode: res.statusCode,
            });
        }
        // Log successful logins
        if (req.path.includes('/login') && res.statusCode === 200) {
            (0, logger_1.logSecurity)('Successful login', {
                email: req.body?.email,
                ip: req.ip,
                userAgent: req.get('user-agent'),
            });
        }
        return originalJson.call(this, data);
    };
    next();
}
