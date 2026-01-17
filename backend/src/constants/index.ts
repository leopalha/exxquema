/**
 * FLAME Lounge Bar - Constants
 *
 * Constantes centralizadas do sistema
 */

// ============================================
// BUSINESS RULES
// ============================================

export const BUSINESS_RULES = {
  // Cashback
  CASHBACK_RATES: {
    bronze: 0.02, // 2%
    silver: 0.05, // 5%
    gold: 0.08, // 8%
    platinum: 0.12, // 12%
  },

  // Tier thresholds (valor gasto total)
  TIER_THRESHOLDS: {
    bronze: 0,
    silver: 1000, // R$ 1.000
    gold: 5000, // R$ 5.000
    platinum: 15000, // R$ 15.000
  },

  // Pedidos
  MINIMUM_ORDER_VALUE: 25.0, // R$ 25
  SERVICE_FEE_PERCENTAGE: 0.1, // 10%
  CASHBACK_MAX_USE_PERCENTAGE: 0.5, // 50% do valor
  CASHBACK_EXPIRY_DAYS: 90, // 90 dias

  // Reservas
  MIN_RESERVATION_GUESTS: 1,
  MAX_RESERVATION_GUESTS: 20,
  RESERVATION_TIME_SLOTS: 15, // minutos (intervalos de 15min)
  OPENING_HOUR: 18, // 18h
  CLOSING_HOUR: 2, // 02h (próximo dia)

  // Estoque
  LOW_STOCK_THRESHOLD: 10,
  OUT_OF_STOCK_THRESHOLD: 0,
} as const;

// ============================================
// ORDER STATUS
// ============================================

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const ORDER_STATUS_LABELS: Record<keyof typeof ORDER_STATUS, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  PREPARING: 'Preparando',
  READY: 'Pronto',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
};

// ============================================
// ORDER TYPES
// ============================================

export const ORDER_TYPES = {
  DINE_IN: 'dine_in',
  TAKEOUT: 'takeout',
  DELIVERY: 'delivery',
} as const;

export const ORDER_TYPE_LABELS: Record<keyof typeof ORDER_TYPES, string> = {
  DINE_IN: 'No Local',
  TAKEOUT: 'Para Retirar',
  DELIVERY: 'Delivery',
};

// ============================================
// PAYMENT
// ============================================

export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PIX: 'pix',
  CASH: 'cash',
} as const;

export const PAYMENT_METHOD_LABELS: Record<keyof typeof PAYMENT_METHODS, string> = {
  CREDIT_CARD: 'Cartão de Crédito',
  DEBIT_CARD: 'Cartão de Débito',
  PIX: 'PIX',
  CASH: 'Dinheiro',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

// ============================================
// USER ROLES
// ============================================

export const USER_ROLES = {
  CUSTOMER: 'customer',
  STAFF: 'staff',
  ADMIN: 'admin',
} as const;

export const USER_ROLE_LABELS: Record<keyof typeof USER_ROLES, string> = {
  CUSTOMER: 'Cliente',
  STAFF: 'Funcionário',
  ADMIN: 'Administrador',
};

// ============================================
// USER TIERS
// ============================================

export const USER_TIERS = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
} as const;

export const USER_TIER_LABELS: Record<keyof typeof USER_TIERS, string> = {
  BRONZE: 'Bronze',
  SILVER: 'Prata',
  GOLD: 'Ouro',
  PLATINUM: 'Platina',
};

// ============================================
// PRODUCT CATEGORIES
// ============================================

export const PRODUCT_CATEGORIES = {
  FOOD: 'food',
  DRINK: 'drink',
  HOOKAH: 'hookah',
  DESSERT: 'dessert',
  COMBO: 'combo',
} as const;

export const PRODUCT_CATEGORY_LABELS: Record<keyof typeof PRODUCT_CATEGORIES, string> = {
  FOOD: 'Comida',
  DRINK: 'Bebida',
  HOOKAH: 'Narguile',
  DESSERT: 'Sobremesa',
  COMBO: 'Combo',
};

// ============================================
// RESERVATION STATUS
// ============================================

export const RESERVATION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
} as const;

export const RESERVATION_STATUS_LABELS: Record<keyof typeof RESERVATION_STATUS, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmada',
  COMPLETED: 'Concluída',
  CANCELLED: 'Cancelada',
  NO_SHOW: 'Não Compareceu',
};

// ============================================
// NOTIFICATION TYPES
// ============================================

export const NOTIFICATION_TYPES = {
  ORDER_STATUS: 'order_status',
  RESERVATION: 'reservation',
  CASHBACK: 'cashback',
  PROMOTION: 'promotion',
  SYSTEM: 'system',
} as const;

// ============================================
// CASHBACK TYPES
// ============================================

export const CASHBACK_TYPES = {
  EARNED: 'earned',
  USED: 'used',
  EXPIRED: 'expired',
  BONUS: 'bonus',
  REFUND: 'refund',
} as const;

// ============================================
// ERROR CODES
// ============================================

export const ERROR_CODES = {
  // Auth
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',

  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',

  // Resources
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',

  // Business Logic
  INSUFFICIENT_CASHBACK: 'INSUFFICIENT_CASHBACK',
  PRODUCT_UNAVAILABLE: 'PRODUCT_UNAVAILABLE',
  MINIMUM_ORDER_NOT_MET: 'MINIMUM_ORDER_NOT_MET',
  RESERVATION_TIME_INVALID: 'RESERVATION_TIME_INVALID',

  // System
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

// ============================================
// HTTP STATUS CODES
// ============================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// ============================================
// RATE LIMITS
// ============================================

export const RATE_LIMITS = {
  // Geral
  GENERAL: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // 100 requests
  },

  // Auth
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // 5 tentativas
  },

  // SMS
  SMS: {
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 3, // 3 códigos
  },

  // API Pública
  PUBLIC_API: {
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 30, // 30 requests
  },
} as const;

// ============================================
// SOCKET EVENTS
// ============================================

export const SOCKET_EVENTS = {
  // Client → Server
  AUTHENTICATE: 'authenticate',
  JOIN_ORDER: 'join:order',
  JOIN_TABLE: 'join:table',
  LEAVE_ORDER: 'leave:order',
  LEAVE_TABLE: 'leave:table',

  // Server → Client
  ORDER_STATUS: 'order:status',
  ORDER_READY: 'order:ready',
  RESERVATION_NEW: 'reservation:new',
  RESERVATION_CONFIRMED: 'reservation:confirmed',
  INVENTORY_LOW: 'inventory:low',
  NOTIFICATION_NEW: 'notification:new',

  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
} as const;

// ============================================
// REGEX PATTERNS
// ============================================

export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[1-9]\d{10,14}$/,
  CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  CNPJ: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
  CEP: /^\d{5}-\d{3}$/,
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PASSWORD_MEDIUM: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
} as const;

// ============================================
// ENVIRONMENT
// ============================================

export const ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
} as const;

// ============================================
// PAGINATION
// ============================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// ============================================
// FILE UPLOAD
// ============================================

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_MIME_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
} as const;

// ============================================
// DATES
// ============================================

export const DATE_FORMATS = {
  ISO: 'YYYY-MM-DD',
  ISO_DATETIME: 'YYYY-MM-DDTHH:mm:ss',
  BR_DATE: 'DD/MM/YYYY',
  BR_DATETIME: 'DD/MM/YYYY HH:mm',
  TIME: 'HH:mm',
} as const;
