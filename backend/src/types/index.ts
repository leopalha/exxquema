/**
 * FLAME Lounge Bar - Shared TypeScript Types
 */

// Re-export model types
export type { UserAttributes, UserCreationAttributes } from '../models/User';
export type { ProductAttributes, ProductCreationAttributes, ProductCategory, DietaryOption } from '../models/Product';
export type { OrderAttributes, OrderCreationAttributes, OrderStatus, PaymentStatus, PaymentMethod } from '../models/Order';

/**
 * API Response Types
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * JWT Payload
 */
export interface JwtPayload {
  id: string;
  role: string;
  email?: string;
}
