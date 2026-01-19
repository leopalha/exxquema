import { renderHook, act, waitFor } from '@testing-library/react';
import useInventoryStore from '../inventoryStore';
import axios from 'axios';

jest.mock('axios');

describe('inventoryStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('has correct initial state', () => {
      const { result } = renderHook(() => useInventoryStore());

      expect(result.current.products).toEqual([]);
      expect(result.current.alerts).toEqual({
        critical: 0,
        warning: 0,
        total: 0,
        products: []
      });
      expect(result.current.movements).toEqual([]);
      expect(result.current.report).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Dashboard', () => {
    it('fetches dashboard data successfully', async () => {
      const mockData = {
        data: {
          success: true,
          data: {
            alerts: [{ id: 1, name: 'Product A', stock: 5 }],
            summary: {
              alertsCount: 2,
              warningCount: 1
            }
          }
        }
      };

      axios.get.mockResolvedValueOnce(mockData);

      const { result } = renderHook(() => useInventoryStore());

      await act(async () => {
        await result.current.fetchDashboard();
      });

      await waitFor(() => {
        expect(result.current.products).toEqual(mockData.data.data.alerts);
        expect(result.current.alerts.critical).toBe(2);
        expect(result.current.loading).toBe(false);
      });
    });

    it('handles dashboard fetch error', async () => {
      axios.get.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useInventoryStore());

      await act(async () => {
        await result.current.fetchDashboard();
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Network error');
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('Movements', () => {
    it('fetches movements with pagination', async () => {
      const mockData = {
        data: {
          success: true,
          data: {
            movements: [{ id: 1, type: 'entrada', quantity: 10 }],
            pagination: {
              total: 50,
              pages: 3
            }
          }
        }
      };

      axios.get.mockResolvedValueOnce(mockData);

      const { result } = renderHook(() => useInventoryStore());

      await act(async () => {
        await result.current.fetchMovements(1, 50);
      });

      await waitFor(() => {
        expect(result.current.movements).toEqual(mockData.data.data.movements);
        expect(result.current.pagination.total).toBe(50);
        expect(result.current.loading).toBe(false);
      });
    });

    it('fetches product movements', async () => {
      const mockData = {
        data: {
          success: true,
          data: {
            movements: [{ id: 1, productId: '123', type: 'saida' }],
            pagination: {
              total: 20,
              pages: 1
            }
          }
        }
      };

      axios.get.mockResolvedValueOnce(mockData);

      const { result } = renderHook(() => useInventoryStore());

      await act(async () => {
        await result.current.fetchProductMovements('123', 1, 50);
      });

      await waitFor(() => {
        expect(result.current.movements).toEqual(mockData.data.data.movements);
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('Alerts', () => {
    it('fetches stock alerts', async () => {
      const mockAlerts = {
        critical: 5,
        warning: 3,
        total: 8,
        products: [{ id: 1, stock: 2 }]
      };

      axios.get.mockResolvedValueOnce({
        data: { success: true, data: mockAlerts }
      });

      const { result } = renderHook(() => useInventoryStore());

      await act(async () => {
        await result.current.fetchAlerts();
      });

      await waitFor(() => {
        expect(result.current.alerts).toEqual(mockAlerts);
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('Stock Adjustment', () => {
    it('adjusts stock successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: { newQuantity: 50 }
        }
      };

      axios.post.mockResolvedValueOnce(mockResponse);
      axios.get.mockResolvedValueOnce({
        data: {
          success: true,
          data: { alerts: [], summary: {} }
        }
      });

      const { result } = renderHook(() => useInventoryStore());

      await act(async () => {
        await result.current.adjustStock('1', 50, 'ajuste_inventario', 'Test');
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('handles stock adjustment error', async () => {
      axios.post.mockRejectedValueOnce({
        response: { data: { error: 'Insufficient stock' } }
      });

      const { result } = renderHook(() => useInventoryStore());

      await act(async () => {
        try {
          await result.current.adjustStock('1', -100);
        } catch (error) {
          expect(error).toBeDefined();
        }
      });
    });
  });

  describe('Reports', () => {
    it('generates inventory report', async () => {
      const mockReport = {
        totalProducts: 100,
        lowStockCount: 5,
        totalValue: 50000
      };

      axios.get.mockResolvedValueOnce({
        data: { success: true, data: mockReport }
      });

      const { result } = renderHook(() => useInventoryStore());

      await act(async () => {
        await result.current.generateReport('2024-01-01', '2024-01-31');
      });

      await waitFor(() => {
        expect(result.current.report).toEqual(mockReport);
        expect(result.current.loading).toBe(false);
      });
    });

    it('fetches consumption analysis', async () => {
      const mockConsumption = {
        byProduct: [{ productId: '1', consumed: 50 }],
        byCategory: [{ category: 'Bebidas', total: 100 }],
        summary: { totalConsumed: 150 }
      };

      axios.get.mockResolvedValueOnce({
        data: { success: true, data: mockConsumption }
      });

      const { result } = renderHook(() => useInventoryStore());

      await act(async () => {
        await result.current.fetchConsumption(30);
      });

      await waitFor(() => {
        expect(result.current.consumption).toEqual(mockConsumption);
        expect(result.current.loading).toBe(false);
      });
    });

    it('fetches stock forecasts', async () => {
      const mockForecasts = {
        forecasts: [
          { productId: '1', daysUntilStockout: 5 }
        ]
      };

      axios.get.mockResolvedValueOnce({
        data: { success: true, data: mockForecasts }
      });

      const { result } = renderHook(() => useInventoryStore());

      await act(async () => {
        await result.current.fetchForecasts();
      });

      await waitFor(() => {
        expect(result.current.forecasts).toEqual(mockForecasts.forecasts);
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('Utility Actions', () => {
    it('clears error', () => {
      const { result } = renderHook(() => useInventoryStore());

      act(() => {
        result.current.error = 'Test error';
      });

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });

    it('resets store', () => {
      const { result } = renderHook(() => useInventoryStore());

      act(() => {
        result.current.products = [{ id: 1 }];
        result.current.error = 'Test error';
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.products).toEqual([]);
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });
});
