import { renderHook, act } from '@testing-library/react';

// Reset module cache
jest.resetModules();

// Mock dependencies BEFORE importing
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn()
  }
}));

jest.mock('../../services/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn()
  }
}));

jest.mock('../../utils/storage', () => ({
  safeLocalStorage: {
    getItem: jest.fn(() => null),
    setItem: jest.fn(),
    removeItem: jest.fn()
  }
}));

// Mock zustand persist
jest.mock('zustand/middleware', () => ({
  persist: (config) => config
}));

// Import after mocks
import { useOrderStore, ORDER_STATUS, PAYMENT_METHODS, CONSUMPTION_TYPES } from '../orderStore';

describe('OrderStore', () => {
  beforeEach(() => {
    // Reset store state
    useOrderStore.setState({
      orders: [],
      currentOrder: null,
      loading: false,
      error: null,
      checkoutData: {
        consumptionType: null,
        tableNumber: null,
        paymentMethod: null,
        address: null,
        observacoes: ''
      }
    }, true);

    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    test('has correct initial state', () => {
      const { result } = renderHook(() => useOrderStore());

      expect(result.current.orders).toEqual([]);
      expect(result.current.currentOrder).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    test('has empty checkout data', () => {
      const { result } = renderHook(() => useOrderStore());

      expect(result.current.checkoutData.consumptionType).toBeNull();
      expect(result.current.checkoutData.tableNumber).toBeNull();
      expect(result.current.checkoutData.paymentMethod).toBeNull();
      expect(result.current.checkoutData.address).toBeNull();
      expect(result.current.checkoutData.observacoes).toBe('');
    });
  });

  describe('Constants', () => {
    test('ORDER_STATUS has all statuses', () => {
      expect(ORDER_STATUS).toHaveProperty('PENDING');
      expect(ORDER_STATUS).toHaveProperty('CONFIRMED');
      expect(ORDER_STATUS).toHaveProperty('PREPARING');
      expect(ORDER_STATUS).toHaveProperty('READY');
      expect(ORDER_STATUS).toHaveProperty('DELIVERED');
      expect(ORDER_STATUS).toHaveProperty('CANCELLED');
    });

    test('PAYMENT_METHODS includes all options', () => {
      expect(PAYMENT_METHODS).toHaveLength(5);
      expect(PAYMENT_METHODS.find(pm => pm.id === 'pix')).toBeDefined();
      expect(PAYMENT_METHODS.find(pm => pm.id === 'credit')).toBeDefined();
      expect(PAYMENT_METHODS.find(pm => pm.id === 'pay_later')).toBeDefined();
    });

    test('CONSUMPTION_TYPES includes all options', () => {
      expect(CONSUMPTION_TYPES).toHaveLength(3);
      expect(CONSUMPTION_TYPES.find(ct => ct.id === 'table')).toBeDefined();
      expect(CONSUMPTION_TYPES.find(ct => ct.id === 'pickup')).toBeDefined();
      expect(CONSUMPTION_TYPES.find(ct => ct.id === 'delivery')).toBeDefined();
    });
  });

  describe('getActiveOrders', () => {
    test('returns only active orders', () => {
      const { result } = renderHook(() => useOrderStore());

      act(() => {
        useOrderStore.setState({
          orders: [
            { id: 1, status: ORDER_STATUS.PENDING, createdAt: '2024-01-01' },
            { id: 2, status: ORDER_STATUS.DELIVERED, createdAt: '2024-01-02' },
            { id: 3, status: ORDER_STATUS.PREPARING, createdAt: '2024-01-03' },
            { id: 4, status: ORDER_STATUS.CANCELLED, createdAt: '2024-01-04' }
          ]
        });
      });

      const activeOrders = result.current.getActiveOrders();
      expect(activeOrders).toHaveLength(2);
      expect(activeOrders.find(o => o.id === 1)).toBeDefined();
      expect(activeOrders.find(o => o.id === 3)).toBeDefined();
    });

    test('sorts active orders by date descending', () => {
      const { result } = renderHook(() => useOrderStore());

      act(() => {
        useOrderStore.setState({
          orders: [
            { id: 1, status: ORDER_STATUS.PENDING, createdAt: '2024-01-01' },
            { id: 2, status: ORDER_STATUS.READY, createdAt: '2024-01-03' },
            { id: 3, status: ORDER_STATUS.CONFIRMED, createdAt: '2024-01-02' }
          ]
        });
      });

      const activeOrders = result.current.getActiveOrders();
      expect(activeOrders[0].id).toBe(2); // Most recent
      expect(activeOrders[1].id).toBe(3);
      expect(activeOrders[2].id).toBe(1);
    });

    test('returns empty array when no active orders', () => {
      const { result } = renderHook(() => useOrderStore());

      act(() => {
        useOrderStore.setState({
          orders: [
            { id: 1, status: ORDER_STATUS.DELIVERED, createdAt: '2024-01-01' },
            { id: 2, status: ORDER_STATUS.CANCELLED, createdAt: '2024-01-02' }
          ]
        });
      });

      const activeOrders = result.current.getActiveOrders();
      expect(activeOrders).toHaveLength(0);
    });
  });

  describe('getOrderHistory', () => {
    test('returns only completed/cancelled orders', () => {
      const { result } = renderHook(() => useOrderStore());

      act(() => {
        useOrderStore.setState({
          orders: [
            { id: 1, status: ORDER_STATUS.PENDING, createdAt: '2024-01-01' },
            { id: 2, status: ORDER_STATUS.DELIVERED, createdAt: '2024-01-02' },
            { id: 3, status: ORDER_STATUS.PREPARING, createdAt: '2024-01-03' },
            { id: 4, status: ORDER_STATUS.CANCELLED, createdAt: '2024-01-04' }
          ]
        });
      });

      const history = result.current.getOrderHistory();
      expect(history).toHaveLength(2);
      expect(history.find(o => o.id === 2)).toBeDefined();
      expect(history.find(o => o.id === 4)).toBeDefined();
    });

    test('sorts history by date descending', () => {
      const { result } = renderHook(() => useOrderStore());

      act(() => {
        useOrderStore.setState({
          orders: [
            { id: 1, status: ORDER_STATUS.DELIVERED, createdAt: '2024-01-01' },
            { id: 2, status: ORDER_STATUS.CANCELLED, createdAt: '2024-01-03' },
            { id: 3, status: ORDER_STATUS.DELIVERED, createdAt: '2024-01-02' }
          ]
        });
      });

      const history = result.current.getOrderHistory();
      expect(history[0].id).toBe(2); // Most recent
      expect(history[1].id).toBe(3);
      expect(history[2].id).toBe(1);
    });
  });

  describe('getOrderById', () => {
    test('finds order by id', () => {
      const { result } = renderHook(() => useOrderStore());

      act(() => {
        useOrderStore.setState({
          orders: [
            { id: 1, orderId: 'ORD001', status: ORDER_STATUS.PENDING },
            { id: 2, orderId: 'ORD002', status: ORDER_STATUS.READY }
          ]
        });
      });

      const order = result.current.getOrderById(1);
      expect(order).toBeDefined();
      expect(order.id).toBe(1);
    });

    test('finds order by orderId', () => {
      const { result } = renderHook(() => useOrderStore());

      act(() => {
        useOrderStore.setState({
          orders: [
            { id: 1, orderId: 'ORD001', status: ORDER_STATUS.PENDING },
            { id: 2, orderId: 'ORD002', status: ORDER_STATUS.READY }
          ]
        });
      });

      const order = result.current.getOrderById('ORD002');
      expect(order).toBeDefined();
      expect(order.orderId).toBe('ORD002');
    });

    test('returns undefined for non-existent order', () => {
      const { result } = renderHook(() => useOrderStore());

      act(() => {
        useOrderStore.setState({
          orders: [
            { id: 1, status: ORDER_STATUS.PENDING }
          ]
        });
      });

      const order = result.current.getOrderById(999);
      expect(order).toBeUndefined();
    });
  });

  describe('clearError', () => {
    test('clears error', () => {
      const { result } = renderHook(() => useOrderStore());

      act(() => {
        useOrderStore.setState({ error: 'Test error' });
      });

      expect(result.current.error).toBe('Test error');

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('real-world scenarios', () => {
    test('customer views active orders', () => {
      const { result } = renderHook(() => useOrderStore());

      act(() => {
        useOrderStore.setState({
          orders: [
            {
              id: 1,
              orderNumber: '#001',
              status: ORDER_STATUS.PREPARING,
              createdAt: '2024-01-15T10:00:00Z',
              items: [{ name: 'Burger', quantity: 1 }],
              totalAmount: 25.00
            },
            {
              id: 2,
              orderNumber: '#002',
              status: ORDER_STATUS.READY,
              createdAt: '2024-01-15T10:30:00Z',
              items: [{ name: 'Fries', quantity: 2 }],
              totalAmount: 15.00
            }
          ]
        });
      });

      const activeOrders = result.current.getActiveOrders();
      expect(activeOrders).toHaveLength(2);
      expect(activeOrders[0].status).toBe(ORDER_STATUS.READY);
    });

    test('customer reviews order history', () => {
      const { result } = renderHook(() => useOrderStore());

      act(() => {
        useOrderStore.setState({
          orders: [
            {
              id: 1,
              status: ORDER_STATUS.DELIVERED,
              createdAt: '2024-01-10T10:00:00Z',
              totalAmount: 50.00
            },
            {
              id: 2,
              status: ORDER_STATUS.DELIVERED,
              createdAt: '2024-01-12T15:00:00Z',
              totalAmount: 75.00
            }
          ]
        });
      });

      const history = result.current.getOrderHistory();
      expect(history).toHaveLength(2);
      expect(history[0].id).toBe(2); // Most recent first
    });

    test('checkout data can be updated', () => {
      const { result } = renderHook(() => useOrderStore());

      act(() => {
        useOrderStore.setState({
          checkoutData: {
            consumptionType: 'table',
            tableNumber: 5,
            paymentMethod: 'pix',
            address: null,
            observacoes: 'Sem cebola'
          }
        });
      });

      expect(result.current.checkoutData.consumptionType).toBe('table');
      expect(result.current.checkoutData.tableNumber).toBe(5);
      expect(result.current.checkoutData.paymentMethod).toBe('pix');
      expect(result.current.checkoutData.observacoes).toBe('Sem cebola');
    });

    test('filters orders by status for kitchen display', () => {
      const { result } = renderHook(() => useOrderStore());

      act(() => {
        useOrderStore.setState({
          orders: [
            { id: 1, status: ORDER_STATUS.PENDING },
            { id: 2, status: ORDER_STATUS.CONFIRMED },
            { id: 3, status: ORDER_STATUS.PREPARING },
            { id: 4, status: ORDER_STATUS.READY },
            { id: 5, status: ORDER_STATUS.DELIVERED }
          ]
        });
      });

      const activeOrders = result.current.getActiveOrders();
      const preparingOrders = activeOrders.filter(o => o.status === ORDER_STATUS.PREPARING);

      expect(activeOrders).toHaveLength(4);
      expect(preparingOrders).toHaveLength(1);
    });
  });
});
