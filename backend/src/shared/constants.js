/**
 * FLAME Lounge - Shared Constants
 *
 * Constantes compartilhadas entre backend e frontend
 * Single Source of Truth para evitar inconsistências
 */

// ========================================
// ORDER STATUS
// ========================================

const ORDER_STATUS = {
  PENDING: 'pending',
  PENDING_PAYMENT: 'pending_payment',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  ON_WAY: 'on_way',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

const ORDER_STATUS_LABELS = {
  pending: 'Pendente',
  pending_payment: 'Aguardando Pagamento',
  confirmed: 'Confirmado',
  preparing: 'Em Preparo',
  ready: 'Pronto',
  on_way: 'A Caminho',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

const ORDER_STATUS_COLORS = {
  pending: {
    text: 'text-yellow-400',
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/30',
  },
  pending_payment: {
    text: 'text-orange-400',
    bg: 'bg-orange-500/20',
    border: 'border-orange-500/30',
  },
  confirmed: {
    text: 'text-blue-400',
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
  },
  preparing: {
    text: 'text-purple-400',
    bg: 'bg-purple-500/20',
    border: 'border-purple-500/30',
  },
  ready: {
    text: 'text-green-400',
    bg: 'bg-green-500/20',
    border: 'border-green-500/30',
  },
  on_way: {
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/20',
    border: 'border-cyan-500/30',
  },
  delivered: {
    text: 'text-green-400',
    bg: 'bg-green-500/20',
    border: 'border-green-500/30',
  },
  cancelled: {
    text: 'text-red-400',
    bg: 'bg-red-500/20',
    border: 'border-red-500/30',
  },
};

// ========================================
// PAYMENT METHODS
// ========================================

const PAYMENT_METHODS = {
  PIX: 'pix',
  CREDIT: 'credit',
  DEBIT: 'debit',
  CASH: 'cash',
  PAY_LATER: 'pay_later',
};

const PAYMENT_METHOD_DETAILS = [
  {
    id: 'pix',
    nome: 'PIX',
    icon: 'qr-code',
    descricao: 'Pagamento instantâneo',
  },
  {
    id: 'credit',
    nome: 'Cartão de Crédito',
    icon: 'credit-card',
    descricao: 'Até 12x sem juros',
  },
  {
    id: 'debit',
    nome: 'Cartão de Débito',
    icon: 'credit-card',
    descricao: 'Débito na hora',
  },
  {
    id: 'cash',
    nome: 'Dinheiro',
    icon: 'banknotes',
    descricao: 'Pagamento na entrega',
  },
  {
    id: 'pay_later',
    nome: 'Pagar com Atendente',
    icon: 'user',
    descricao: 'Solicite a conta ao atendente',
  },
];

const PAYMENT_METHOD_LABELS = {
  pix: 'PIX',
  credit: 'Cartão de Crédito',
  debit: 'Cartão de Débito',
  cash: 'Dinheiro',
  pay_later: 'Pagar com Atendente',
};

// ========================================
// CONSUMPTION TYPES
// ========================================

const CONSUMPTION_TYPES = {
  TABLE: 'table',
  PICKUP: 'pickup',
  DELIVERY: 'delivery',
};

const CONSUMPTION_TYPE_DETAILS = [
  {
    id: 'table',
    nome: 'Consumir no Local',
    icon: 'utensils',
    descricao: 'Escolha sua mesa',
  },
  {
    id: 'pickup',
    nome: 'Retirar no Balcão',
    icon: 'shopping-bag',
    descricao: 'Retire quando pronto',
  },
  {
    id: 'delivery',
    nome: 'Delivery',
    icon: 'truck',
    descricao: 'Receba em casa',
  },
];

// ========================================
// CASHBACK
// ========================================

// Taxas de cashback por tier (em decimal)
// Baseado em User.js getTierBenefits() - valores oficiais em produção
const CASHBACK_RATES = {
  bronze: 0.015, // 1.5%
  silver: 0.03,  // 3%
  gold: 0.045,   // 4.5%
  platinum: 0.05, // 5% (máximo)
};

// Taxas de Instagram Cashback
const INSTAGRAM_CASHBACK_RATE = 0.05; // 5% extra

// Thresholds para upgrade de tier (em R$)
// Baseado em User.js calculateTier() - valores oficiais em produção
const TIER_THRESHOLDS = {
  bronze: 0,
  silver: 1000,
  gold: 5000,
  platinum: 10000, // Corrigido de 15000 para 10000
};

// ========================================
// BUSINESS RULES
// ========================================

// Taxa de serviço padrão (10%)
const SERVICE_FEE_PERCENTAGE = 10; // Porcentagem (será dividida por 100 no cálculo)
const SERVICE_FEE_RATE = 0.10;     // Taxa decimal

// Taxa de entrega padrão
const DELIVERY_FEE = 8.00; // R$

// Validade do cashback (em dias)
const CASHBACK_EXPIRATION_DAYS = 365;

// Valor mínimo de cashback para uso
const MIN_CASHBACK_TO_USE = 5.00; // R$

// Tempo de preparação padrão (em minutos)
const DEFAULT_PREPARATION_TIME = 25;

// Limite de tempo para Instagram cashback após pedido (em horas)
const INSTAGRAM_VALIDATION_TIME_LIMIT = 48;

// ========================================
// REGEX PATTERNS
// ========================================

const REGEX = {
  CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  CNPJ: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[1-9]\d{10,14}$/,
  PHONE_BR: /^\(\d{2}\)\s?\d{4,5}-?\d{4}$/,
  CEP: /^\d{5}-\d{3}$/,
};

// ========================================
// USER ROLES
// ========================================

const USER_ROLES = {
  CUSTOMER: 'cliente',
  WAITER: 'atendente',
  COOK: 'cozinha',
  MANAGER: 'gerente',
  ADMIN: 'admin',
};

const USER_ROLE_LABELS = {
  cliente: 'Cliente',
  atendente: 'Atendente',
  cozinha: 'Cozinha',
  gerente: 'Gerente',
  admin: 'Administrador',
};

// ========================================
// EXPORTS
// ========================================

module.exports = {
  // Order
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,

  // Payment
  PAYMENT_METHODS,
  PAYMENT_METHOD_DETAILS,
  PAYMENT_METHOD_LABELS,

  // Consumption
  CONSUMPTION_TYPES,
  CONSUMPTION_TYPE_DETAILS,

  // Cashback
  CASHBACK_RATES,
  INSTAGRAM_CASHBACK_RATE,
  TIER_THRESHOLDS,

  // Business Rules
  SERVICE_FEE_PERCENTAGE,
  SERVICE_FEE_RATE,
  DELIVERY_FEE,
  CASHBACK_EXPIRATION_DAYS,
  MIN_CASHBACK_TO_USE,
  DEFAULT_PREPARATION_TIME,
  INSTAGRAM_VALIDATION_TIME_LIMIT,

  // Regex
  REGEX,

  // User
  USER_ROLES,
  USER_ROLE_LABELS,
};
