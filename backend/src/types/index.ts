/**
 * FLAME Lounge Bar - Backend Type Definitions
 *
 * Este arquivo centraliza todas as definições de tipos TypeScript
 * usadas no backend da aplicação.
 */

import { Request } from 'express';

// ============================================
// USER TYPES
// ============================================

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  phone: string | null;
  phone_verified: boolean;
  google_id: string | null;
  role: UserRole;
  tier: UserTier;
  cashback_balance: number;
  profile_image: string | null;
  preferences: UserPreferences | null;
  created_at: Date;
  updated_at: Date;
}

export type UserRole = 'customer' | 'staff' | 'admin';
export type UserTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface UserPreferences {
  notifications: boolean;
  marketing: boolean;
  theme?: 'light' | 'dark' | 'auto';
}

// ============================================
// PRODUCT TYPES
// ============================================

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  subcategory: string | null;
  image: string | null;
  available: boolean;
  stock: number | null;
  ingredients: ProductIngredient[] | null;
  nutritional: NutritionalInfo | null;
  created_at: Date;
  updated_at: Date;
}

export type ProductCategory = 'food' | 'drink' | 'hookah' | 'dessert' | 'combo';

export interface ProductIngredient {
  name: string;
  quantity: number;
  unit?: string;
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// ============================================
// ORDER TYPES
// ============================================

export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  status: OrderStatus;
  type: OrderType;
  table_number: number | null;
  items: OrderItem[];
  subtotal: number;
  service_fee: number;
  cashback_used: number;
  total: number;
  cashback_earned: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  notes: string | null;
  estimated_time: number | null;
  created_at: Date;
  updated_at: Date;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type OrderType = 'dine_in' | 'takeout' | 'delivery';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'pix' | 'cash';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  product_id: number;
  product_name?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes: string | null;
}

// ============================================
// RESERVATION TYPES
// ============================================

export interface Reservation {
  id: number;
  user_id: number;
  date: string;
  time: string;
  guests: number;
  status: ReservationStatus;
  table_number: number | null;
  notes: string | null;
  confirmed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

// ============================================
// CASHBACK TYPES
// ============================================

export interface CashbackTransaction {
  id: number;
  user_id: number;
  type: CashbackType;
  amount: number;
  order_id: number | null;
  description: string | null;
  expires_at: Date | null;
  created_at: Date;
}

export type CashbackType = 'earned' | 'used' | 'expired' | 'bonus' | 'refund';

// ============================================
// NOTIFICATION TYPES
// ============================================

export interface Notification {
  id: number;
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, any> | null;
  read: boolean;
  created_at: Date;
}

export type NotificationType = 'order_status' | 'reservation' | 'cashback' | 'promotion' | 'system';

// ============================================
// AUTH TYPES
// ============================================

export interface AuthRequest extends Request {
  user?: User;
}

export interface JWTPayload {
  userId: number;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface LoginResponse {
  user: Omit<User, 'password'>;
  token: string;
}

// ============================================
// VALIDATION TYPES
// ============================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  error: string;
  details?: ValidationError[];
  code?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: ValidationError[];
}

// ============================================
// PAGINATION TYPES
// ============================================

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ============================================
// SOCKET.IO TYPES
// ============================================

export interface SocketUser {
  userId: number;
  role: UserRole;
  socketId: string;
}

export interface OrderUpdatePayload {
  orderId: number;
  status: OrderStatus;
  estimatedTime?: number;
}

export interface NotificationPayload {
  userId: number;
  notification: Notification;
}

// ============================================
// CONFIG TYPES
// ============================================

export interface AppConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  FRONTEND_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRE: string;
  DATABASE_URL?: string;
  STRIPE_SECRET_KEY: string;
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
}

// ============================================
// BUSINESS RULES
// ============================================

export interface BusinessRules {
  MINIMUM_ORDER_VALUE: number;
  SERVICE_FEE_PERCENTAGE: number;
  CASHBACK_RATES: {
    bronze: number;
    silver: number;
    gold: number;
    platinum: number;
  };
  TIER_THRESHOLDS: {
    silver: number;
    gold: number;
    platinum: number;
  };
  CASHBACK_MAX_USE_PERCENTAGE: number;
  CASHBACK_EXPIRY_DAYS: number;
}
