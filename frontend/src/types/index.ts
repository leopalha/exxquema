/**
 * FLAME Lounge Bar - Frontend Type Definitions
 *
 * Este arquivo centraliza todas as definições de tipos TypeScript
 * usadas no frontend da aplicação.
 */

// ============================================
// USER TYPES
// ============================================

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  phone_verified: boolean;
  role: UserRole;
  tier: UserTier;
  cashback_balance: number;
  profile_image: string | null;
  preferences: UserPreferences | null;
  total_spent?: number;
  orders_count?: number;
  created_at: string;
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
  ingredients?: ProductIngredient[];
  nutritional?: NutritionalInfo;
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
// CART TYPES
// ============================================

export interface CartItem {
  product: Product;
  quantity: number;
  notes: string | null;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  serviceFee: number;
  cashbackUsed: number;
  total: number;
}

// ============================================
// ORDER TYPES
// ============================================

export interface Order {
  id: number;
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
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type OrderType = 'dine_in' | 'takeout' | 'delivery';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'pix' | 'cash';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id?: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes: string | null;
}

export interface CreateOrderPayload {
  type: OrderType;
  table_number?: number;
  items: {
    product_id: number;
    quantity: number;
    notes?: string;
  }[];
  payment_method: PaymentMethod;
  use_cashback?: number;
  notes?: string;
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
  confirmed_at: string | null;
  created_at: string;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export interface CreateReservationPayload {
  date: string;
  time: string;
  guests: number;
  notes?: string;
}

// ============================================
// CASHBACK TYPES
// ============================================

export interface CashbackTransaction {
  id: number;
  type: CashbackType;
  amount: number;
  order_id: number | null;
  description: string | null;
  expires_at: string | null;
  created_at: string;
}

export type CashbackType = 'earned' | 'used' | 'expired' | 'bonus' | 'refund';

export interface CashbackSummary {
  balance: number;
  tier: UserTier;
  rate: number;
  history: CashbackTransaction[];
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, any> | null;
  read: boolean;
  created_at: string;
}

export type NotificationType = 'order_status' | 'reservation' | 'cashback' | 'promotion' | 'system';

// ============================================
// AUTH TYPES
// ============================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ============================================
// API TYPES
// ============================================

export interface ApiError {
  error: string;
  details?: ValidationError[];
  code?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: ValidationError[];
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
// STORE TYPES
// ============================================

export interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

export interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, notes?: string) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  updateNotes: (productId: number, notes: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotal: (serviceFee: number, cashbackUsed: number) => number;
}

export interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

// ============================================
// COMPONENT PROPS TYPES
// ============================================

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  showStock?: boolean;
}

export interface OrderCardProps {
  order: Order;
  onViewDetails?: (order: Order) => void;
}

export interface ReservationCardProps {
  reservation: Reservation;
  onCancel?: (id: number) => void;
  onEdit?: (reservation: Reservation) => void;
}

// ============================================
// UTILITY TYPES
// ============================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ============================================
// SOCKET.IO TYPES
// ============================================

export interface SocketEvents {
  'order:status': (data: OrderStatusUpdate) => void;
  'order:ready': (data: OrderReady) => void;
  'reservation:confirmed': (data: ReservationConfirmed) => void;
  'notification:new': (data: Notification) => void;
}

export interface OrderStatusUpdate {
  orderId: number;
  status: OrderStatus;
  estimatedTime?: number;
}

export interface OrderReady {
  orderId: number;
  orderNumber: string;
}

export interface ReservationConfirmed {
  reservationId: number;
  tableNumber: number;
}
