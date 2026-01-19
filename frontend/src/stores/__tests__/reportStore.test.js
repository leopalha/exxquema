import { renderHook, act, waitFor } from '@testing-library/react';
import useReportStore from '../reportStore';
import axios from 'axios';

jest.mock('axios');

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};
global.localStorage = localStorageMock;

describe('reportStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Initial State', () => {
    it('has correct initial state', () => {
      const { result } = renderHook(() => useReportStore());

      expect(result.current.dashboard).toBeNull();
      expect(result.current.salesReport).toBeNull();
      expect(result.current.productsReport).toBeNull();
      expect(result.current.categoriesReport).toBeNull();
      expect(result.current.hourlyReport).toBeNull();
      expect(result.current.dreReport).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Dashboard Report', () => {
    it('fetches dashboard successfully', async () => {
      const mockDashboard = {
        totalRevenue: 50000,
        totalOrders: 500,
        avgTicket: 100,
        topProducts: []
      };

      axios.get.mockResolvedValueOnce({
        data: { data: mockDashboard }
      });

      const { result } = renderHook(() => useReportStore());

      await act(async () => {
        await result.current.fetchDashboard(30);
      });

      await waitFor(() => {
        expect(result.current.dashboard).toEqual(mockDashboard);
        expect(result.current.loading).toBe(false);
      });
    });

    it('handles dashboard fetch error', async () => {
      axios.get.mockRejectedValueOnce({
        response: { data: { message: 'Network error' } }
      });

      const { result } = renderHook(() => useReportStore());

      await expect(
        act(async () => {
          await result.current.fetchDashboard(30);
        })
      ).rejects.toThrow('Network error');
    });
  });

  describe('Sales Report', () => {
    it('fetches sales report with grouping', async () => {
      const mockSales = {
        totalSales: 50000,
        orderCount: 500,
        chartData: [
          { date: '2024-03-01', revenue: 1000 },
          { date: '2024-03-02', revenue: 1200 }
        ]
      };

      axios.get.mockResolvedValueOnce({
        data: { data: mockSales }
      });

      const { result } = renderHook(() => useReportStore());

      await act(async () => {
        await result.current.fetchSalesReport({
          startDate: '2024-03-01',
          endDate: '2024-03-31',
          groupBy: 'day'
        });
      });

      await waitFor(() => {
        expect(result.current.salesReport).toEqual(mockSales);
        expect(result.current.loading).toBe(false);
      });
    });

    it('handles sales report error', async () => {
      axios.get.mockRejectedValueOnce({
        response: { data: { message: 'Invalid date range' } }
      });

      const { result } = renderHook(() => useReportStore());

      await expect(
        act(async () => {
          await result.current.fetchSalesReport({
            startDate: '2024-03-31',
            endDate: '2024-03-01'
          });
        })
      ).rejects.toThrow('Invalid date range');
    });
  });

  describe('Products Report', () => {
    it('fetches top products report', async () => {
      const mockProducts = {
        topSelling: [
          { productId: '1', name: 'Product A', quantity: 100, revenue: 5000 },
          { productId: '2', name: 'Product B', quantity: 80, revenue: 4000 }
        ]
      };

      axios.get.mockResolvedValueOnce({
        data: { data: mockProducts }
      });

      const { result } = renderHook(() => useReportStore());

      await act(async () => {
        await result.current.fetchProductsReport({
          startDate: '2024-03-01',
          endDate: '2024-03-31',
          limit: 20
        });
      });

      await waitFor(() => {
        expect(result.current.productsReport).toEqual(mockProducts);
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('Categories Report', () => {
    it('fetches categories report', async () => {
      const mockCategories = {
        categories: [
          { name: 'Bebidas', revenue: 15000, percentage: 30 },
          { name: 'Comidas', revenue: 20000, percentage: 40 }
        ]
      };

      axios.get.mockResolvedValueOnce({
        data: { data: mockCategories }
      });

      const { result } = renderHook(() => useReportStore());

      await act(async () => {
        await result.current.fetchCategoriesReport({
          startDate: '2024-03-01',
          endDate: '2024-03-31'
        });
      });

      await waitFor(() => {
        expect(result.current.categoriesReport).toEqual(mockCategories);
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('Hourly Report', () => {
    it('fetches hourly sales report', async () => {
      const mockHourly = {
        hourlyData: [
          { hour: 12, revenue: 1000, orders: 10 },
          { hour: 13, revenue: 1500, orders: 15 },
          { hour: 18, revenue: 2000, orders: 20 }
        ],
        peakHour: 18
      };

      axios.get.mockResolvedValueOnce({
        data: { data: mockHourly }
      });

      const { result } = renderHook(() => useReportStore());

      await act(async () => {
        await result.current.fetchHourlyReport({
          startDate: '2024-03-01',
          endDate: '2024-03-31'
        });
      });

      await waitFor(() => {
        expect(result.current.hourlyReport).toEqual(mockHourly);
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('DRE Report', () => {
    it('fetches DRE (financial statement) report', async () => {
      const mockDRE = {
        receitas: {
          vendas: 50000,
          servicos: 5000,
          total: 55000
        },
        custos: {
          cmv: 15000,
          operacionais: 10000,
          total: 25000
        },
        lucro: {
          bruto: 40000,
          operacional: 30000,
          liquido: 28000
        }
      };

      axios.get.mockResolvedValueOnce({
        data: { data: mockDRE }
      });

      const { result } = renderHook(() => useReportStore());

      await act(async () => {
        await result.current.fetchDREReport({
          startDate: '2024-03-01',
          endDate: '2024-03-31'
        });
      });

      await waitFor(() => {
        expect(result.current.dreReport).toEqual(mockDRE);
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('Utility Actions', () => {
    it('clears specific report', () => {
      const { result } = renderHook(() => useReportStore());

      act(() => {
        result.current.salesReport = { totalSales: 50000 };
        result.current.productsReport = { topProducts: [] };
      });

      act(() => {
        result.current.clearReport('salesReport');
      });

      expect(result.current.salesReport).toBeNull();
      expect(result.current.productsReport).not.toBeNull();
    });

    it('clears error', () => {
      const { result } = renderHook(() => useReportStore());

      act(() => {
        result.current.error = 'Test error';
      });

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });

    it('resets store', () => {
      const { result } = renderHook(() => useReportStore());

      act(() => {
        result.current.dashboard = { totalRevenue: 50000 };
        result.current.salesReport = { totalSales: 50000 };
        result.current.error = 'Test error';
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.dashboard).toBeNull();
      expect(result.current.salesReport).toBeNull();
      expect(result.current.productsReport).toBeNull();
      expect(result.current.categoriesReport).toBeNull();
      expect(result.current.hourlyReport).toBeNull();
      expect(result.current.dreReport).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('handles network errors consistently', async () => {
      const errorMessage = 'Connection timeout';

      axios.get.mockRejectedValueOnce({
        response: { data: { message: errorMessage } }
      });

      const { result } = renderHook(() => useReportStore());

      await expect(
        act(async () => {
          await result.current.fetchDashboard(30);
        })
      ).rejects.toThrow(errorMessage);

      expect(result.current.loading).toBe(false);
    });

    it('handles missing response data', async () => {
      axios.get.mockRejectedValueOnce(new Error('Unknown error'));

      const { result } = renderHook(() => useReportStore());

      await expect(
        act(async () => {
          await result.current.fetchSalesReport({});
        })
      ).rejects.toThrow();
    });
  });
});
