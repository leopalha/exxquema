# Sentry Integration - FLAME Lounge v2.0.0

## 🎯 Overview

Sentry is fully integrated for comprehensive error monitoring and performance tracking across the FLAME Lounge platform.

## ✅ What's Configured

### 1. **Client-Side Monitoring** (`sentry.client.config.ts`)
- Browser error tracking
- Session replay (10% sampling)
- Performance monitoring
- User interaction tracking

### 2. **Server-Side Monitoring** (`sentry.server.config.ts`)
- API error tracking
- Server-side exceptions
- Performance bottlenecks

### 3. **Edge Runtime** (`sentry.edge.config.ts`)
- Middleware error tracking
- Edge function monitoring

### 4. **Error Boundary Integration**
All React component errors are automatically captured and sent to Sentry with:
- Component stack traces
- Error context
- User information (if authenticated)

## 🔧 Configuration

### Environment Variables

Add to `.env.local`:

```bash
# Sentry DSN (get from Sentry project settings)
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/your-project-id

# Environment
NEXT_PUBLIC_ENV=production
```

### Features Enabled

1. **Error Tracking**
   - Automatic capture of unhandled exceptions
   - React Error Boundary integration
   - API error logging

2. **Performance Monitoring**
   - Traces sample rate: 10% in production
   - Browser tracing
   - API call tracking

3. **Session Replay**
   - Error replay: 100% of sessions with errors
   - Session sampling: 10% of normal sessions
   - PII masking enabled (text and media)

4. **Smart Filtering**
   - 4xx errors ignored (client errors)
   - Common browser errors filtered
   - Sensitive data scrubbed (cookies, auth headers)

## 📊 Usage

### Manual Error Capture

```javascript
import { captureException, captureMessage, addBreadcrumb } from '@/lib/sentry';

// Capture an exception with context
try {
  dangerousOperation();
} catch (error) {
  captureException(error, {
    operation: 'dangerousOperation',
    userId: user.id
  });
}

// Log a message
captureMessage('Important event occurred', 'info');

// Add debugging breadcrumb
addBreadcrumb({
  category: 'user-action',
  message: 'User clicked checkout button',
  level: 'info'
});
```

### User Context

```javascript
import { setUser } from '@/lib/sentry';

// Set user after login
setUser({
  id: user.id,
  email: user.email,
  username: user.nome
});

// Clear user on logout
setUser(null);
```

## 🚀 Production Checklist

- [ ] Set `NEXT_PUBLIC_SENTRY_DSN` in production environment
- [ ] Set `NEXT_PUBLIC_ENV=production`
- [ ] Verify Sentry project is created at sentry.io
- [ ] Test error tracking in staging environment
- [ ] Set up alerts for critical errors
- [ ] Configure team notifications

## 📈 What Gets Tracked

### Automatically
- Unhandled JavaScript exceptions
- React component errors (via ErrorBoundary)
- Network errors (configurable)
- Performance metrics
- User sessions (with replay)

### Manually (when needed)
- API errors from stores
- Critical business logic errors
- Important user actions (breadcrumbs)

## 🔒 Privacy & Security

- **PII Masking**: All text and media masked in session replays
- **Sensitive Data**: Auth headers and cookies automatically scrubbed
- **Client Errors**: 4xx errors not sent (reduces noise)
- **Data Minimization**: Only errors and performance data sent

## 🛠️ Development

In development mode:
- Sentry is **disabled** to avoid noise
- Console logs still work normally
- Set `NEXT_PUBLIC_ENV=staging` to test Sentry locally

## 📚 Resources

- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Session Replay](https://docs.sentry.io/platforms/javascript/session-replay/)
- [Performance Monitoring](https://docs.sentry.io/platforms/javascript/performance/)

## ✅ Integration Status

- ✅ Client-side tracking configured
- ✅ Server-side tracking configured
- ✅ Edge runtime configured
- ✅ ErrorBoundary integrated
- ✅ Privacy filters configured
- ✅ Development mode disabled
- ✅ Production-ready

**Status: PRODUCTION READY** 🚀
