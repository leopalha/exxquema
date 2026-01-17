"use strict";
/**
 * FLAME Lounge Bar - Sentry Configuration
 *
 * Error tracking and performance monitoring
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.sentryTracingHandler = exports.sentryRequestHandler = exports.sentryErrorHandler = void 0;
exports.initSentry = initSentry;
exports.captureException = captureException;
exports.captureMessage = captureMessage;
exports.setUser = setUser;
exports.addBreadcrumb = addBreadcrumb;
exports.flushSentry = flushSentry;
const Sentry = __importStar(require("@sentry/node"));
const profiling_node_1 = require("@sentry/profiling-node");
/**
 * Initialize Sentry for error tracking and performance monitoring
 */
function initSentry() {
    // Only initialize in production or staging
    if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging') {
        console.log('📊 Sentry: Skipped (not in production/staging)');
        return;
    }
    // Require DSN in production
    if (!process.env.SENTRY_DSN) {
        console.warn('⚠️  Sentry: DSN not configured');
        return;
    }
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV || 'development',
        // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
        // Set sampling rate for profiling - this is relative to tracesSampleRate
        profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
        // Integrations
        integrations: [
            new profiling_node_1.ProfilingIntegration(),
            new Sentry.Integrations.Http({ tracing: true }),
        ],
        // Ignore common non-critical errors
        ignoreErrors: [
            // Browser extensions
            'top.GLOBALS',
            // Random network errors
            'NetworkError',
            'Network request failed',
            // Aborted requests
            'AbortError',
            'Request aborted',
        ],
        // BeforeSend hook to filter/modify events
        beforeSend(event, hint) {
            // Don't send if it's a 4xx error (client errors)
            const status = event.contexts?.response?.status_code;
            if (status && status >= 400 && status < 500) {
                return null;
            }
            // Scrub sensitive data
            if (event.request) {
                delete event.request.cookies;
                if (event.request.headers) {
                    delete event.request.headers['authorization'];
                    delete event.request.headers['cookie'];
                }
            }
            return event;
        },
    });
    console.log('✅ Sentry initialized for error tracking');
}
/**
 * Express error handler middleware for Sentry
 */
exports.sentryErrorHandler = Sentry.Handlers.errorHandler();
/**
 * Express request handler middleware for Sentry
 */
exports.sentryRequestHandler = Sentry.Handlers.requestHandler();
/**
 * Express tracing handler middleware for Sentry
 */
exports.sentryTracingHandler = Sentry.Handlers.tracingHandler();
/**
 * Manually capture an exception
 */
function captureException(error, context) {
    return Sentry.captureException(error, {
        contexts: context ? { custom: context } : undefined,
    });
}
/**
 * Manually capture a message
 */
function captureMessage(message, level = 'info') {
    return Sentry.captureMessage(message, level);
}
/**
 * Set user context for error tracking
 */
function setUser(user) {
    Sentry.setUser(user);
}
/**
 * Add breadcrumb for debugging
 */
function addBreadcrumb(breadcrumb) {
    Sentry.addBreadcrumb(breadcrumb);
}
/**
 * Flush all pending events to Sentry
 * Use this before shutting down the application
 */
async function flushSentry(timeout = 2000) {
    return Sentry.close(timeout);
}
