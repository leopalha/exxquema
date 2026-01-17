/**
 * FLAME Lounge Bar - Sentry Configuration
 *
 * Error tracking and performance monitoring
 */

import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

/**
 * Initialize Sentry for error tracking and performance monitoring
 */
export function initSentry(): void {
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
      new ProfilingIntegration(),
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
export const sentryErrorHandler = Sentry.Handlers.errorHandler();

/**
 * Express request handler middleware for Sentry
 */
export const sentryRequestHandler = Sentry.Handlers.requestHandler();

/**
 * Express tracing handler middleware for Sentry
 */
export const sentryTracingHandler = Sentry.Handlers.tracingHandler();

/**
 * Manually capture an exception
 */
export function captureException(error: Error, context?: Record<string, any>): string {
  return Sentry.captureException(error, {
    contexts: context ? { custom: context } : undefined,
  });
}

/**
 * Manually capture a message
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info'): string {
  return Sentry.captureMessage(message, level);
}

/**
 * Set user context for error tracking
 */
export function setUser(user: { id: string; email?: string; username?: string } | null): void {
  Sentry.setUser(user);
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(breadcrumb: Sentry.Breadcrumb): void {
  Sentry.addBreadcrumb(breadcrumb);
}

/**
 * Flush all pending events to Sentry
 * Use this before shutting down the application
 */
export async function flushSentry(timeout = 2000): Promise<boolean> {
  return Sentry.close(timeout);
}
