"use strict";
/**
 * FLAME Lounge Bar - Constants
 *
 * Constantes centralizadas do sistema
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATE_FORMATS = exports.FILE_UPLOAD = exports.PAGINATION = exports.ENV = exports.REGEX = exports.SOCKET_EVENTS = exports.RATE_LIMITS = exports.HTTP_STATUS = exports.ERROR_CODES = exports.CASHBACK_TYPES = exports.NOTIFICATION_TYPES = exports.RESERVATION_STATUS_LABELS = exports.RESERVATION_STATUS = exports.PRODUCT_CATEGORY_LABELS = exports.PRODUCT_CATEGORIES = exports.USER_TIER_LABELS = exports.USER_TIERS = exports.USER_ROLE_LABELS = exports.USER_ROLES = exports.PAYMENT_STATUS = exports.PAYMENT_METHOD_LABELS = exports.PAYMENT_METHODS = exports.ORDER_TYPE_LABELS = exports.ORDER_TYPES = exports.ORDER_STATUS_LABELS = exports.ORDER_STATUS = exports.BUSINESS_RULES = void 0;
// ============================================
// BUSINESS RULES
// ============================================
exports.BUSINESS_RULES = {
    // Cashback - Taxas oficiais em produção (User.js getTierBenefits)
    CASHBACK_RATES: {
        bronze: 0.015, // 1.5%
        silver: 0.03, // 3%
        gold: 0.045, // 4.5%
        platinum: 0.05, // 5% (máximo)
    },
    // Tier thresholds (valor gasto total) - Baseado em User.js calculateTier()
    TIER_THRESHOLDS: {
        bronze: 0,
        silver: 1000, // R$ 1.000
        gold: 5000, // R$ 5.000
        platinum: 10000, // R$ 10.000 (corrigido de 15000)
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
};
// ============================================
// ORDER STATUS
// ============================================
exports.ORDER_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PREPARING: 'preparing',
    READY: 'ready',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
};
exports.ORDER_STATUS_LABELS = {
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
exports.ORDER_TYPES = {
    DINE_IN: 'dine_in',
    TAKEOUT: 'takeout',
    DELIVERY: 'delivery',
};
exports.ORDER_TYPE_LABELS = {
    DINE_IN: 'No Local',
    TAKEOUT: 'Para Retirar',
    DELIVERY: 'Delivery',
};
// ============================================
// PAYMENT
// ============================================
exports.PAYMENT_METHODS = {
    CREDIT_CARD: 'credit_card',
    DEBIT_CARD: 'debit_card',
    PIX: 'pix',
    CASH: 'cash',
};
exports.PAYMENT_METHOD_LABELS = {
    CREDIT_CARD: 'Cartão de Crédito',
    DEBIT_CARD: 'Cartão de Débito',
    PIX: 'PIX',
    CASH: 'Dinheiro',
};
exports.PAYMENT_STATUS = {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded',
};
// ============================================
// USER ROLES
// ============================================
exports.USER_ROLES = {
    CUSTOMER: 'customer',
    STAFF: 'staff',
    ADMIN: 'admin',
};
exports.USER_ROLE_LABELS = {
    CUSTOMER: 'Cliente',
    STAFF: 'Funcionário',
    ADMIN: 'Administrador',
};
// ============================================
// USER TIERS
// ============================================
exports.USER_TIERS = {
    BRONZE: 'bronze',
    SILVER: 'silver',
    GOLD: 'gold',
    PLATINUM: 'platinum',
};
exports.USER_TIER_LABELS = {
    BRONZE: 'Bronze',
    SILVER: 'Prata',
    GOLD: 'Ouro',
    PLATINUM: 'Platina',
};
// ============================================
// PRODUCT CATEGORIES
// ============================================
exports.PRODUCT_CATEGORIES = {
    FOOD: 'food',
    DRINK: 'drink',
    HOOKAH: 'hookah',
    DESSERT: 'dessert',
    COMBO: 'combo',
};
exports.PRODUCT_CATEGORY_LABELS = {
    FOOD: 'Comida',
    DRINK: 'Bebida',
    HOOKAH: 'Narguile',
    DESSERT: 'Sobremesa',
    COMBO: 'Combo',
};
// ============================================
// RESERVATION STATUS
// ============================================
exports.RESERVATION_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    NO_SHOW: 'no_show',
};
exports.RESERVATION_STATUS_LABELS = {
    PENDING: 'Pendente',
    CONFIRMED: 'Confirmada',
    COMPLETED: 'Concluída',
    CANCELLED: 'Cancelada',
    NO_SHOW: 'Não Compareceu',
};
// ============================================
// NOTIFICATION TYPES
// ============================================
exports.NOTIFICATION_TYPES = {
    ORDER_STATUS: 'order_status',
    RESERVATION: 'reservation',
    CASHBACK: 'cashback',
    PROMOTION: 'promotion',
    SYSTEM: 'system',
};
// ============================================
// CASHBACK TYPES
// ============================================
exports.CASHBACK_TYPES = {
    EARNED: 'earned',
    USED: 'used',
    EXPIRED: 'expired',
    BONUS: 'bonus',
    REFUND: 'refund',
};
// ============================================
// ERROR CODES
// ============================================
exports.ERROR_CODES = {
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
};
// ============================================
// HTTP STATUS CODES
// ============================================
exports.HTTP_STATUS = {
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
};
// ============================================
// RATE LIMITS
// ============================================
exports.RATE_LIMITS = {
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
};
// ============================================
// SOCKET EVENTS
// ============================================
exports.SOCKET_EVENTS = {
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
};
// ============================================
// REGEX PATTERNS
// ============================================
exports.REGEX = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^\+?[1-9]\d{10,14}$/,
    CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    CNPJ: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
    CEP: /^\d{5}-\d{3}$/,
    PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    PASSWORD_MEDIUM: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
};
// ============================================
// ENVIRONMENT
// ============================================
exports.ENV = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TEST: 'test',
};
// ============================================
// PAGINATION
// ============================================
exports.PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
};
// ============================================
// FILE UPLOAD
// ============================================
exports.FILE_UPLOAD = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_MIME_TYPES: [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
    ],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
};
// ============================================
// DATES
// ============================================
exports.DATE_FORMATS = {
    ISO: 'YYYY-MM-DD',
    ISO_DATETIME: 'YYYY-MM-DDTHH:mm:ss',
    BR_DATE: 'DD/MM/YYYY',
    BR_DATETIME: 'DD/MM/YYYY HH:mm',
    TIME: 'HH:mm',
};
