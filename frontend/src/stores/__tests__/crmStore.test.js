import { renderHook, act, waitFor } from '@testing-library/react';
import useCRMStore from '../crmStore';
import axios from 'axios';

jest.mock('axios');

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};
global.localStorage = localStorageMock;

describe('crmStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Initial State', () => {
    it('has correct initial state', () => {
      const { result } = renderHook(() => useCRMStore());

      expect(result.current.customers).toEqual([]);
      expect(result.current.selectedCustomer).toBeNull();
      expect(result.current.customerStats).toBeNull();
      expect(result.current.dashboardStats).toBeNull();
      expect(result.current.inactiveCustomers).toEqual([]);
      expect(result.current.nearUpgradeCustomers).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('has correct default filters', () => {
      const { result } = renderHook(() => useCRMStore());

      expect(result.current.filters).toEqual({
        search: '',
        tier: null,
        sortBy: 'totalSpent',
        sortOrder: 'DESC',
        page: 1,
        limit: 20
      });
    });
  });

  describe('Filters Management', () => {
    it('sets filters', () => {
      const { result } = renderHook(() => useCRMStore());

      act(() => {
        result.current.setFilters({ tier: 'gold', search: 'john' });
      });

      expect(result.current.filters.tier).toBe('gold');
      expect(result.current.filters.search).toBe('john');
    });

    it('resets filters', () => {
      const { result } = renderHook(() => useCRMStore());

      act(() => {
        result.current.setFilters({ tier: 'gold', search: 'john', page: 3 });
      });

      act(() => {
        result.current.resetFilters();
      });

      expect(result.current.filters).toEqual({
        search: '',
        tier: null,
        sortBy: 'totalSpent',
        sortOrder: 'DESC',
        page: 1,
        limit: 20
      });
    });
  });

  describe('Dashboard Stats', () => {
    it('fetches dashboard stats successfully', async () => {
      const mockStats = {
        totalCustomers: 500,
        activeCustomers: 450,
        avgTicket: 75.50,
        ltv: 2500
      };

      axios.get.mockResolvedValueOnce({
        data: { data: mockStats }
      });

      const { result } = renderHook(() => useCRMStore());

      await act(async () => {
        await result.current.fetchDashboardStats();
      });

      await waitFor(() => {
        expect(result.current.dashboardStats).toEqual(mockStats);
        expect(result.current.loading).toBe(false);
      });
    });

    it('handles dashboard fetch error', async () => {
      axios.get.mockRejectedValueOnce({
        response: { data: { message: 'Network error' } }
      });

      const { result } = renderHook(() => useCRMStore());

      await act(async () => {
        await result.current.fetchDashboardStats();
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Network error');
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('Customer Management', () => {
    it('fetches customers with filters', async () => {
      const mockCustomers = [
        { id: '1', nome: 'John Doe', tier: 'gold', totalSpent: 1000 },
        { id: '2', nome: 'Jane Smith', tier: 'silver', totalSpent: 500 }
      ];

      axios.get.mockResolvedValueOnce({
        data: {
          data: mockCustomers,
          pagination: { total: 2, pages: 1 }
        }
      });

      const { result } = renderHook(() => useCRMStore());

      await act(async () => {
        await result.current.fetchCustomers();
      });

      await waitFor(() => {
        expect(result.current.customers).toEqual(mockCustomers);
        expect(result.current.pagination.total).toBe(2);
        expect(result.current.loading).toBe(false);
      });
    });

    it('fetches customer details', async () => {
      const mockCustomerData = {
        user: { id: '1', nome: 'John Doe' },
        totalOrders: 25,
        totalSpent: 1000,
        avgOrderValue: 40
      };

      axios.get.mockResolvedValueOnce({
        data: { data: mockCustomerData }
      });

      const { result } = renderHook(() => useCRMStore());

      await act(async () => {
        await result.current.fetchCustomerDetails('1');
      });

      await waitFor(() => {
        expect(result.current.selectedCustomer).toEqual(mockCustomerData.user);
        expect(result.current.customerStats).toEqual(mockCustomerData);
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('Inactive Customers', () => {
    it('fetches inactive customers', async () => {
      const mockInactive = [
        { id: '1', nome: 'John Doe', lastOrder: '2024-01-01' },
        { id: '2', nome: 'Jane Smith', lastOrder: '2024-01-15' }
      ];

      axios.get.mockResolvedValueOnce({
        data: { data: mockInactive }
      });

      const { result } = renderHook(() => useCRMStore());

      await act(async () => {
        await result.current.fetchInactiveCustomers(30);
      });

      await waitFor(() => {
        expect(result.current.inactiveCustomers).toEqual(mockInactive);
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('Near Upgrade Customers', () => {
    it('fetches customers near tier upgrade', async () => {
      const mockNearUpgrade = [
        { id: '1', nome: 'John Doe', currentTier: 'bronze', nextTier: 'silver', remaining: 50 }
      ];

      axios.get.mockResolvedValueOnce({
        data: { data: mockNearUpgrade }
      });

      const { result } = renderHook(() => useCRMStore());

      await act(async () => {
        await result.current.fetchNearUpgradeCustomers(100);
      });

      await waitFor(() => {
        expect(result.current.nearUpgradeCustomers).toEqual(mockNearUpgrade);
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('Cashback Management', () => {
    it('adds manual cashback', async () => {
      axios.post.mockResolvedValueOnce({
        data: { success: true }
      });

      axios.get.mockResolvedValueOnce({
        data: {
          data: {
            user: { id: '1', nome: 'John Doe' },
            cashbackBalance: 75
          }
        }
      });

      const { result } = renderHook(() => useCRMStore());

      act(() => {
        result.current.selectedCustomer = { id: '1' };
      });

      await act(async () => {
        await result.current.addManualCashback('1', 50, 'Bonus especial');
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('handles cashback error', async () => {
      axios.post.mockRejectedValueOnce({
        response: { data: { message: 'Invalid amount' } }
      });

      const { result } = renderHook(() => useCRMStore());

      let errorThrown = false;
      await act(async () => {
        try {
          await result.current.addManualCashback('1', -50, 'Test');
        } catch (error) {
          errorThrown = true;
          // Error object is thrown, check it exists
          expect(error).toBeDefined();
        }
      });

      // Verify error was thrown and store updated
      expect(errorThrown).toBe(true);
      expect(result.current.error).toBe('Invalid amount');
      expect(result.current.loading).toBe(false);
    });
  });

  describe('Tier Management', () => {
    it('adjusts customer tier', async () => {
      axios.put.mockResolvedValueOnce({
        data: { success: true }
      });

      axios.get.mockResolvedValueOnce({
        data: {
          data: {
            user: { id: '1', nome: 'John Doe', tier: 'gold' }
          }
        }
      });

      axios.get.mockResolvedValueOnce({
        data: { data: [], pagination: {} }
      });

      const { result } = renderHook(() => useCRMStore());

      act(() => {
        result.current.selectedCustomer = { id: '1' };
      });

      await act(async () => {
        await result.current.adjustTier('1');
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('Utility Actions', () => {
    it('clears selected customer', () => {
      const { result } = renderHook(() => useCRMStore());

      act(() => {
        result.current.selectedCustomer = { id: '1' };
        result.current.customerStats = { totalOrders: 10 };
      });

      act(() => {
        result.current.clearSelectedCustomer();
      });

      expect(result.current.selectedCustomer).toBeNull();
      expect(result.current.customerStats).toBeNull();
    });

    it('clears error', () => {
      const { result } = renderHook(() => useCRMStore());

      act(() => {
        result.current.error = 'Test error';
      });

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });

    it('resets store', () => {
      const { result } = renderHook(() => useCRMStore());

      act(() => {
        result.current.customers = [{ id: '1' }];
        result.current.error = 'Test error';
        result.current.filters = { tier: 'gold' };
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.customers).toEqual([]);
      expect(result.current.error).toBeNull();
      expect(result.current.filters).toEqual({
        search: '',
        tier: null,
        sortBy: 'totalSpent',
        sortOrder: 'DESC',
        page: 1,
        limit: 20
      });
    });
  });
});
