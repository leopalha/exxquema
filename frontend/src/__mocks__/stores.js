/**
 * Mocks Centralizados de Zustand Stores
 *
 * Este arquivo contém todos os mocks de stores Zustand usados nos testes.
 * Centralizar os mocks facilita manutenção e garante consistência.
 */

// ========================================
// AUTH STORE MOCK
// ========================================
export const mockAuthStore = {
  // State
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,

  // Actions
  setAuth: jest.fn((authData) => {
    mockAuthStore.user = authData.user;
    mockAuthStore.token = authData.token;
    mockAuthStore.refreshToken = authData.refreshToken;
    mockAuthStore.isAuthenticated = true;
  }),

  clearAuth: jest.fn(() => {
    mockAuthStore.user = null;
    mockAuthStore.token = null;
    mockAuthStore.refreshToken = null;
    mockAuthStore.isAuthenticated = false;
  }),

  register: jest.fn().mockResolvedValue({ success: true }),
  verifySMS: jest.fn().mockResolvedValue({ success: true }),
  login: jest.fn().mockResolvedValue({ success: true }),
  loginWithGoogle: jest.fn().mockResolvedValue({ success: true }),
  logout: jest.fn().mockResolvedValue({ success: true }),
  refreshAuthToken: jest.fn().mockResolvedValue({ success: true }),
  updateProfile: jest.fn().mockResolvedValue({ success: true }),
  deleteAccount: jest.fn().mockResolvedValue({ success: true }),
};

// ========================================
// CART STORE MOCK
// ========================================
export const mockCartStore = {
  // State
  items: [],

  // Actions
  addItem: jest.fn((product, quantity = 1) => {
    const existing = mockCartStore.items.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      mockCartStore.items.push({ ...product, quantity });
    }
  }),

  removeItem: jest.fn((productId) => {
    mockCartStore.items = mockCartStore.items.filter(item => item.id !== productId);
  }),

  updateQuantity: jest.fn((productId, quantity) => {
    const item = mockCartStore.items.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
    }
  }),

  clearCart: jest.fn(() => {
    mockCartStore.items = [];
  }),

  getTotalItems: jest.fn(() => {
    return mockCartStore.items.reduce((sum, item) => sum + item.quantity, 0);
  }),

  getTotalPrice: jest.fn(() => {
    return mockCartStore.items.reduce((sum, item) => {
      const price = item.discount > 0
        ? item.price * (1 - item.discount / 100)
        : item.price;
      return sum + (price * item.quantity);
    }, 0);
  }),

  getCartSummary: jest.fn(() => ({
    subtotal: mockCartStore.getTotalPrice(),
    discount: 0,
    delivery: 0,
    total: mockCartStore.getTotalPrice(),
  })),
};

// ========================================
// THEME STORE MOCK
// ========================================
export const mockThemeStore = {
  // State
  currentPalette: 'default',
  palettes: {
    default: {
      name: 'FLAME Classic',
      textPrimary: 'text-orange-500',
      textSecondary: 'text-cyan-400',
      bgPrimary: 'bg-orange-500',
      bgSecondary: 'bg-cyan-400',
      borderPrimary: 'border-orange-500',
      borderSecondary: 'border-cyan-400',
    },
  },

  // Actions
  setPalette: jest.fn((paletteName) => {
    mockThemeStore.currentPalette = paletteName;
  }),

  applyTheme: jest.fn(() => {
    // Mock theme application
  }),

  getPalette: jest.fn((paletteName) => {
    const name = paletteName || mockThemeStore.currentPalette;
    return mockThemeStore.palettes[name] || mockThemeStore.palettes.default;
  }),

  getGradient: jest.fn(() => ({
    from: 'from-orange-500',
    to: 'to-cyan-400',
  })),
};

// ========================================
// PRODUCT STORE MOCK
// ========================================
export const mockProductStore = {
  // State
  products: [],
  featuredProducts: [],
  categories: [],
  isLoading: false,
  error: null,

  // Actions
  fetchProducts: jest.fn().mockResolvedValue({ success: true, data: [] }),
  fetchFeaturedProducts: jest.fn().mockResolvedValue({ success: true, data: [] }),
  fetchCategories: jest.fn().mockResolvedValue({ success: true, data: [] }),
  fetchProductById: jest.fn().mockResolvedValue({ success: true, data: null }),

  setProducts: jest.fn((products) => {
    mockProductStore.products = products;
  }),

  setFeaturedProducts: jest.fn((products) => {
    mockProductStore.featuredProducts = products;
  }),

  setCategories: jest.fn((categories) => {
    mockProductStore.categories = categories;
  }),
};

// ========================================
// ORDER STORE MOCK
// ========================================
export const mockOrderStore = {
  // State
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  // Actions
  createOrder: jest.fn().mockResolvedValue({ success: true, data: { id: 1 } }),
  fetchOrders: jest.fn().mockResolvedValue({ success: true, data: [] }),
  fetchOrderById: jest.fn().mockResolvedValue({ success: true, data: null }),
  updateOrderStatus: jest.fn().mockResolvedValue({ success: true }),
  cancelOrder: jest.fn().mockResolvedValue({ success: true }),

  setOrders: jest.fn((orders) => {
    mockOrderStore.orders = orders;
  }),

  setCurrentOrder: jest.fn((order) => {
    mockOrderStore.currentOrder = order;
  }),
};

// ========================================
// NOTIFICATION STORE MOCK
// ========================================
export const mockNotificationStore = {
  // State
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  // Actions
  fetchNotifications: jest.fn().mockResolvedValue({ success: true, data: [] }),
  markAsRead: jest.fn().mockResolvedValue({ success: true }),
  markAllAsRead: jest.fn().mockResolvedValue({ success: true }),
  deleteNotification: jest.fn().mockResolvedValue({ success: true }),

  addNotification: jest.fn((notification) => {
    mockNotificationStore.notifications.unshift(notification);
    mockNotificationStore.unreadCount++;
  }),

  setNotifications: jest.fn((notifications) => {
    mockNotificationStore.notifications = notifications;
    mockNotificationStore.unreadCount = notifications.filter(n => !n.read).length;
  }),
};

// ========================================
// CASHBACK STORE MOCK
// ========================================
export const mockCashbackStore = {
  // State
  balance: 0,
  history: [],
  isLoading: false,

  // Actions
  fetchBalance: jest.fn().mockResolvedValue({ success: true, data: { balance: 0 } }),
  fetchHistory: jest.fn().mockResolvedValue({ success: true, data: [] }),
  useCashback: jest.fn().mockResolvedValue({ success: true }),

  setBalance: jest.fn((balance) => {
    mockCashbackStore.balance = balance;
  }),

  setHistory: jest.fn((history) => {
    mockCashbackStore.history = history;
  }),
};

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Reset all mocks to initial state
 * Call this in beforeEach() of test suites
 */
export const resetAllMocks = () => {
  // Reset Auth Store
  mockAuthStore.user = null;
  mockAuthStore.token = null;
  mockAuthStore.refreshToken = null;
  mockAuthStore.isAuthenticated = false;
  mockAuthStore.isLoading = false;

  // Reset Cart Store
  mockCartStore.items = [];

  // Reset Theme Store
  mockThemeStore.currentPalette = 'default';

  // Reset Product Store
  mockProductStore.products = [];
  mockProductStore.featuredProducts = [];
  mockProductStore.categories = [];
  mockProductStore.isLoading = false;
  mockProductStore.error = null;

  // Reset Order Store
  mockOrderStore.orders = [];
  mockOrderStore.currentOrder = null;
  mockOrderStore.isLoading = false;
  mockOrderStore.error = null;

  // Reset Notification Store
  mockNotificationStore.notifications = [];
  mockNotificationStore.unreadCount = 0;
  mockNotificationStore.isLoading = false;

  // Reset Cashback Store
  mockCashbackStore.balance = 0;
  mockCashbackStore.history = [];
  mockCashbackStore.isLoading = false;

  // Clear all jest mocks
  jest.clearAllMocks();
};

/**
 * Setup authenticated user for tests
 */
export const setupAuthenticatedUser = (userData = {}) => {
  const defaultUser = {
    id: 1,
    name: 'Test User',
    email: 'test@test.com',
    role: 'customer',
    ...userData,
  };

  mockAuthStore.user = defaultUser;
  mockAuthStore.token = 'mock-token-123';
  mockAuthStore.isAuthenticated = true;

  return defaultUser;
};

/**
 * Setup cart with items for tests
 */
export const setupCartWithItems = (items = []) => {
  const defaultItems = items.length > 0 ? items : [
    { id: 1, name: 'Product 1', price: 10, quantity: 2 },
    { id: 2, name: 'Product 2', price: 20, quantity: 1 },
  ];

  mockCartStore.items = defaultItems;

  return defaultItems;
};

// ========================================
// EXPORTS
// ========================================
export default {
  mockAuthStore,
  mockCartStore,
  mockThemeStore,
  mockProductStore,
  mockOrderStore,
  mockNotificationStore,
  mockCashbackStore,
  resetAllMocks,
  setupAuthenticatedUser,
  setupCartWithItems,
};
