/**
 * FLAME Lounge Bar - Sentry Configuration (Frontend)
 *
 * Error tracking and performance monitoring for Next.js
 */

import * as Sentry from '@sentry/nextjs';

/**
 * Initialize Sentry for error tracking
 */
export function initSentry(): void {
  // Only initialize in production or staging
  if (process.env.NEXT_PUBLIC_ENV !== 'production' && process.env.NEXT_PUBLIC_ENV !== 'staging') {
    console.log('📊 Sentry: Skipped (not in production/staging)');
    return;
  }

  // Require DSN in production
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.warn('⚠️  Sentry: DSN not configured');
    return;
  }

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_ENV || 'development',

    // Adjust this value in production, or use tracesSampler for finer control
    tracesSampleRate: process.env.NEXT_PUBLIC_ENV === 'production' ? 0.1 : 1.0,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,

    // Replay configuration
    replaysOnErrorSampleRate: 1.0, // Capture 100% of errors
    replaysSessionSampleRate: 0.1, // Sample 10% of sessions

    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
      Sentry.browserTracingIntegration(),
    ],

    // Ignore common non-critical errors
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      'canvas.contentDocument',
      // Network errors
      'NetworkError',
      'Network request failed',
      'Failed to fetch',
      // Aborted requests
      'AbortError',
      'Request aborted',
      // ResizeObserver errors (usually harmless)
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed',
    ],

    // BeforeSend hook to filter/modify events
    beforeSend(event, _hint) {
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
