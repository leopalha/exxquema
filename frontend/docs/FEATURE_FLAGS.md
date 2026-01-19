# Feature Flags System - FLAME Lounge v2.0.0

## 🎯 Overview

A simple, type-safe feature flag system for gradual rollouts, A/B testing, and controlling feature availability.

## 🚩 Available Flags

| Flag | Status | Description |
|------|--------|-------------|
| `enable_pwa_install_prompt` | ✅ Enabled | Show PWA install banner |
| `enable_cashback_system` | ✅ Enabled | Customer cashback and rewards |
| `enable_table_reservations` | ✅ Enabled | Table reservation system |
| `enable_hookah_ordering` | ✅ Enabled | Hookah/narguile ordering |
| `enable_google_login` | ✅ Enabled | Google OAuth authentication |
| `enable_sms_verification` | ✅ Enabled | SMS-based phone verification |
| `enable_review_system` | ✅ Enabled | Customer reviews and ratings |
| `enable_loyalty_program` | ✅ Enabled | Loyalty tiers (Bronze, Silver, Gold) |
| `enable_live_order_tracking` | ✅ Enabled | Real-time order status |
| `enable_demo_mode` | 🔧 Configurable | Demo mode with mock data |
| `enable_beta_features` | 👥 Admin Only | Beta features for testing |
| `enable_analytics` | 📊 Production Only | Analytics and tracking |
| `enable_push_notifications` | 🚧 Beta (0%) | Push notifications |

## 📖 Usage

### Basic Check

```typescript
import { isFeatureEnabled } from '@/lib/featureFlags';

if (isFeatureEnabled('enable_cashback_system')) {
  // Show cashback features
}
```

### With User Context

```typescript
import { isFeatureEnabled } from '@/lib/featureFlags';

const enabled = isFeatureEnabled('enable_beta_features', {
  userId: user.id,
  userRole: user.role, // 'admin', 'staff', 'customer'
});
```

### React Hook

```typescript
import { useFeatureFlag } from '@/lib/featureFlags';

function MyComponent() {
  const showCashback = useFeatureFlag('enable_cashback_system', {
    userId: user.id,
    userRole: user.role,
  });

  if (!showCashback) {
    return null;
  }

  return <CashbackDisplay />;
}
```

### HOC Wrapper

```typescript
import { withFeatureFlag } from '@/lib/featureFlags';

const CashbackDisplay = () => <div>Your cashback</div>;

// Only render if feature is enabled
export default withFeatureFlag(
  'enable_cashback_system',
  CashbackDisplay,
  FallbackComponent // optional
);
```

### Get All Enabled Features

```typescript
import { getEnabledFeatures } from '@/lib/featureFlags';

const enabledFeatures = getEnabledFeatures({
  userId: user.id,
  userRole: user.role,
});

console.log('Enabled:', enabledFeatures);
// ['enable_pwa_install_prompt', 'enable_cashback_system', ...]
```

## 🔧 Configuration Options

Each feature flag supports:

```typescript
{
  enabled: boolean;                // Base on/off switch
  description: string;             // What the flag controls
  rolloutPercentage?: number;      // 0-100, for gradual rollouts
  enabledForUsers?: string[];      // Specific user IDs
  enabledForRoles?: string[];      // 'admin', 'staff', 'customer'
}
```

### Examples

#### 1. Simple On/Off

```typescript
enable_cashback_system: {
  enabled: true,
  description: 'Customer cashback and rewards',
}
```

#### 2. Admin-Only Feature

```typescript
enable_beta_features: {
  enabled: false,
  description: 'Beta features for testing',
  enabledForRoles: ['admin'],
}
```

#### 3. Gradual Rollout (Canary)

```typescript
enable_push_notifications: {
  enabled: false,
  description: 'Push notifications',
  rolloutPercentage: 10, // Enable for 10% of users
}
```

#### 4. Specific Users (Beta Testers)

```typescript
enable_new_checkout: {
  enabled: true,
  description: 'New checkout flow',
  enabledForUsers: ['user123', 'user456'],
}
```

## 🧪 Testing & Development

### Override Flags in Browser Console

```javascript
// Development only
window.featureFlags.override('enable_beta_features', true);
window.featureFlags.isEnabled('enable_beta_features'); // true

// See all flags
window.featureFlags.getAll();

// See enabled flags
window.featureFlags.getEnabled({ userId: 'test', userRole: 'admin' });
```

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_ENV=production
```

## 🎯 Use Cases

### 1. **Gradual Rollout (Canary)**
Roll out new features to a percentage of users first:

```typescript
enable_new_feature: {
  enabled: true,
  rolloutPercentage: 10, // Start with 10%
}
```

Then gradually increase: 10% → 25% → 50% → 100%

### 2. **A/B Testing**
Test different versions:

```typescript
const showNewDesign = isFeatureEnabled('enable_new_design', { userId });

return showNewDesign ? <NewDesign /> : <OldDesign />;
```

### 3. **Admin/Staff Features**
Features only for specific roles:

```typescript
enable_advanced_analytics: {
  enabled: true,
  enabledForRoles: ['admin', 'staff'],
}
```

### 4. **Beta Testers**
Give early access to specific users:

```typescript
enable_experimental_feature: {
  enabled: true,
  enabledForUsers: ['beta-tester-1', 'beta-tester-2'],
}
```

### 5. **Kill Switch**
Quickly disable problematic features:

```typescript
// Set enabled: false to turn off immediately
enable_problematic_feature: {
  enabled: false,
  description: 'Temporarily disabled due to issue',
}
```

## 🚀 Best Practices

1. **Descriptive Names**: Use clear, descriptive flag names
2. **Documentation**: Always add description
3. **Clean Up**: Remove flags once feature is fully rolled out
4. **Default Off**: Start with `enabled: false` for new features
5. **Test Both States**: Test with flag on AND off
6. **Monitor**: Track feature usage with analytics

## 📊 Monitoring

Track feature flag usage:

```typescript
import { addBreadcrumb } from '@/lib/sentry';

if (isFeatureEnabled('enable_new_feature')) {
  addBreadcrumb({
    category: 'feature-flag',
    message: 'New feature enabled',
    level: 'info',
  });
}
```

## 🔐 Security

- Flags are **NOT secret** - they're client-side
- Don't use for sensitive features that must be hidden
- Use server-side checks for security-critical features
- Role-based checks happen client-side (validate server-side too)

## ✅ Implementation Checklist

- [x] Feature flags system created
- [x] Type-safe flag definitions
- [x] Role-based access control
- [x] Gradual rollout support
- [x] React hooks
- [x] HOC wrapper
- [x] Development tools (console overrides)
- [x] Documentation
- [ ] Admin panel for flag management (future)
- [ ] Remote config integration (future)
- [ ] Analytics integration (future)

## 🎯 Future Enhancements

1. **Admin Panel**: Web UI to manage flags
2. **Remote Config**: Update flags without deployment
3. **Analytics**: Track feature usage automatically
4. **Scheduled Rollouts**: Auto-increase percentages over time
5. **User Segments**: More complex targeting rules

---

**Status: PRODUCTION READY** 🚀

All core features are controlled by feature flags and can be toggled as needed!
