/**
 * Feature Flags System - FLAME Lounge v2.0.0
 *
 * Simple, type-safe feature flag management for gradual rollouts and A/B testing
 */

export type FeatureFlag =
  | 'enable_pwa_install_prompt'
  | 'enable_cashback_system'
  | 'enable_table_reservations'
  | 'enable_hookah_ordering'
  | 'enable_google_login'
  | 'enable_sms_verification'
  | 'enable_review_system'
  | 'enable_loyalty_program'
  | 'enable_live_order_tracking'
  | 'enable_demo_mode'
  | 'enable_beta_features'
  | 'enable_analytics'
  | 'enable_push_notifications';

interface FeatureFlagConfig {
  enabled: boolean;
  description: string;
  rolloutPercentage?: number; // 0-100, for gradual rollouts
  enabledForUsers?: string[]; // Specific user IDs
  enabledForRoles?: string[]; // 'admin', 'staff', 'customer'
}

/**
 * Feature flag configurations
 * These can be controlled via environment variables or remote config
 */
const FLAGS: Record<FeatureFlag, FeatureFlagConfig> = {
  enable_pwa_install_prompt: {
    enabled: true,
    description: 'Show PWA install banner',
  },
  enable_cashback_system: {
    enabled: true,
    description: 'Customer cashback and rewards',
  },
  enable_table_reservations: {
    enabled: true,
    description: 'Table reservation system',
  },
  enable_hookah_ordering: {
    enabled: true,
    description: 'Hookah/narguile ordering',
  },
  enable_google_login: {
    enabled: true,
    description: 'Google OAuth authentication',
  },
  enable_sms_verification: {
    enabled: true,
    description: 'SMS-based phone verification',
  },
  enable_review_system: {
    enabled: true,
    description: 'Customer reviews and ratings',
  },
  enable_loyalty_program: {
    enabled: true,
    description: 'Loyalty tiers (Bronze, Silver, Gold)',
  },
  enable_live_order_tracking: {
    enabled: true,
    description: 'Real-time order status tracking',
  },
  enable_demo_mode: {
    enabled: process.env.NEXT_PUBLIC_DEMO_MODE === 'true',
    description: 'Demo mode with mock data',
  },
  enable_beta_features: {
    enabled: false,
    description: 'Beta features for testing',
    enabledForRoles: ['admin'],
  },
  enable_analytics: {
    enabled: process.env.NEXT_PUBLIC_ENV === 'production',
    description: 'Analytics and tracking',
  },
  enable_push_notifications: {
    enabled: false,
    description: 'Push notifications (beta)',
    rolloutPercentage: 0, // Gradual rollout
  },
};

/**
 * Check if a feature flag is enabled for the current user
 */
export function isFeatureEnabled(
  flag: FeatureFlag,
  context?: {
    userId?: string;
    userRole?: string;
  }
): boolean {
  const config = FLAGS[flag];

  if (!config) {
    console.warn(`Unknown feature flag: ${flag}`);
    return false;
  }

  // Check base enabled state
  if (!config.enabled) {
    return false;
  }

  // Check role-based access
  if (config.enabledForRoles && context?.userRole) {
    if (!config.enabledForRoles.includes(context.userRole)) {
      return false;
    }
  }

  // Check user-specific access
  if (config.enabledForUsers && context?.userId) {
    if (!config.enabledForUsers.includes(context.userId)) {
      return false;
    }
  }

  // Check rollout percentage (deterministic based on userId)
  if (config.rolloutPercentage !== undefined && config.rolloutPercentage < 100) {
    if (!context?.userId) {
      return false; // Need userId for rollout
    }

    // Simple hash function for deterministic rollout
    const hash = context.userId.split('').reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0
    );
    const bucket = hash % 100;

    if (bucket >= config.rolloutPercentage) {
      return false;
    }
  }

  return true;
}

/**
 * Get all enabled features for a user
 */
export function getEnabledFeatures(context?: {
  userId?: string;
  userRole?: string;
}): FeatureFlag[] {
  return (Object.keys(FLAGS) as FeatureFlag[]).filter(flag =>
    isFeatureEnabled(flag, context)
  );
}

/**
 * Get feature flag configuration (for debugging/admin panel)
 */
export function getFeatureFlagConfig(flag: FeatureFlag): FeatureFlagConfig | null {
  return FLAGS[flag] || null;
}

/**
 * Get all feature flags (for admin panel)
 */
export function getAllFeatureFlags(): Record<FeatureFlag, FeatureFlagConfig> {
  return FLAGS;
}

/**
 * React hook for feature flags
 */
export function useFeatureFlag(
  flag: FeatureFlag,
  context?: {
    userId?: string;
    userRole?: string;
  }
): boolean {
  // In a real implementation, this would use React context/state
  // For now, it's a simple wrapper
  return isFeatureEnabled(flag, context);
}

/**
 * HOC to conditionally render based on feature flag
 * @param flag - Feature flag to check
 * @param Component - Component to render if flag is enabled
 * @param Fallback - Optional fallback component if flag is disabled
 *
 * NOTE: Currently unused in the codebase. Commented out to avoid TypeScript build errors.
 * Uncomment when needed and add proper type handling for JSX component parameters.
 */
/*
export function withFeatureFlag<P extends object>(
  flag: FeatureFlag,
  Component: React.ComponentType<P>,
  Fallback?: React.ComponentType<P>
) {
  return function FeatureFlaggedComponent(props: P) {
    const enabled = useFeatureFlag(flag);

    if (!enabled) {
      return Fallback ? <Fallback {...props} /> : null;
    }

    return <Component {...props} />;
  };
}
*/

/**
 * Override feature flag for testing (use in development only)
 */
export function overrideFeatureFlag(flag: FeatureFlag, enabled: boolean): void {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('Feature flag overrides only work in development');
    return;
  }

  FLAGS[flag].enabled = enabled;
  console.log(`Feature flag "${flag}" overridden to ${enabled}`);
}

// Export for debugging
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).featureFlags = {
    isEnabled: isFeatureEnabled,
    getEnabled: getEnabledFeatures,
    getAll: getAllFeatureFlags,
    override: overrideFeatureFlag,
  };
  console.log('🚩 Feature flags available in window.featureFlags');
}
