import { renderHook, act, waitFor } from '@testing-library/react';
import useCashierStore from '../cashierStore';
import axios from 'axios';

jest.mock('axios');

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};
global.localStorage = localStorageMock;

describe('cashierStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Initial State', () => {
    it('has correct initial state', () => {
      const { result } = renderHook(() => useCashierStore());

      expect(result.current.currentCashier).toBeNull();
      expect(result.current.cashierHistory).toEqual([]);
      expect(result.current.cashierDetails).toBeNull();
      expect(result.current.cashierStats).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Open Cashier', () => {
    it('opens cashier successfully', async () => {
      const mockCashier = {
        id: '1',
        openingAmount: 100,
        status: 'open',
        openedAt: new Date().toISOString()
      };

      axios.post.mockResolvedValueOnce({
        data: { data: mockCashier }
      });

      const { result } = renderHook(() => useCashierStore());

      await act(async () => {
        await result.current.openCashier(100, 'Abertura normal');
      });

      await waitFor(() => {
        expect(result.current.currentCashier).toEqual(mockCashier);
        expect(result.current.loading).toBe(false);
      });
    });

    it('handles open cashier error', async () => {
      axios.post.mockRejectedValueOnce({
        response: { data: { message: 'Já existe um caixa aberto' } }
      });

      const { result } = renderHook(() => useCashierStore());

      await expect(
        act(async () => {
          await result.current.openCashier(100, 'Test');
        })
      ).rejects.toThrow('Já existe um caixa aberto');
    });
  });

  describe('Fetch Current Cashier', () => {
    it('fetches current cashier successfully', async () => {
      const mockCashier = {
        id: '1',
        openingAmount: 100,
        currentAmount: 150
      };

      axios.get.mockResolvedValueOnce({
        data: { data: mockCashier }
      });

      const { result } = renderHook(() => useCashierStore());

      await act(async () => {
        await result.current.fetchCurrentCashier();
      });

      await waitFor(() => {
        expect(result.current.currentCashier).toEqual(mockCashier);
        expect(result.current.loading).toBe(false);
      });
    });

    it('handles no open cashier (404)', async () => {
      axios.get.mockRejectedValueOnce({
        response: { status: 404 }
      });

      const { result } = renderHook(() => useCashierStore());

      await act(async () => {
        await result.current.fetchCurrentCashier();
      });

      await waitFor(() => {
        expect(result.current.currentCashier).toBeNull();
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('Transactions', () => {
    it('registers deposit successfully', async () => {
      axios.post.mockResolvedValueOnce({
        data: { data: { id: '1', amount: 50 } }
      });

      axios.get.mockResolvedValueOnce({
        data: { data: { currentAmount: 150 } }
      });

      const { result } = renderHook(() => useCashierStore());

      await act(async () => {
        await result.current.registerDeposit('1', 50, 'Suprimento');
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('registers withdrawal successfully', async () => {
      axios.post.mockResolvedValueOnce({
        data: { data: { id: '1', amount: 30 } }
      });

      axios.get.mockResolvedValueOnce({
        data: { data: { currentAmount: 70 } }
      });

      const { result } = renderHook(() => useCashierStore());

      await act(async () => {
        await result.current.registerWithdrawal('1', 30, 'Sangria');
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('Close Cashier', () => {
    it('closes cashier successfully', async () => {
      const mockClosed = {
        id: '1',
        status: 'closed',
        closingAmount: 200
      };

      axios.post.mockResolvedValueOnce({
        data: { data: mockClosed }
      });

      const { result } = renderHook(() => useCashierStore());

      act(() => {
        result.current.currentCashier = { id: '1', status: 'open' };
      });

      await act(async () => {
        await result.current.closeCashier('1', 200, 'Fechamento normal');
      });

      await waitFor(() => {
        expect(result.current.currentCashier).toBeNull();
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('History', () => {
    it('fetches cashier history with pagination', async () => {
      const mockHistory = [
        { id: '1', openedAt: '2024-03-20', closedAt: '2024-03-20' }
      ];

      axios.get.mockResolvedValueOnce({
        data: {
          data: mockHistory,
          pagination: { total: 10, pages: 2 }
        }
      });

      const { result } = renderHook(() => useCashierStore());

      await act(async () => {
        await result.current.fetchCashierHistory(1, 20);
      });

      await waitFor(() => {
        expect(result.current.cashierHistory).toEqual(mockHistory);
        expect(result.current.historyPagination.total).toBe(10);
        expect(result.current.loading).toBe(false);
      });
    });

    it('fetches cashier details', async () => {
      const mockDetails = {
        id: '1',
        openingAmount: 100,
        transactions: []
      };

      axios.get.mockResolvedValueOnce({
        data: { data: mockDetails }
      });

      const { result } = renderHook(() => useCashierStore());

      await act(async () => {
        await result.current.fetchCashierDetails('1');
      });

      await waitFor(() => {
        expect(result.current.cashierDetails).toEqual(mockDetails);
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('Statistics', () => {
    it('fetches cashier stats', async () => {
      const mockStats = {
        totalRevenue: 10000,
        avgTicket: 50,
        totalTransactions: 200
      };

      axios.get.mockResolvedValueOnce({
        data: { data: mockStats }
      });

      const { result } = renderHook(() => useCashierStore());

      await act(async () => {
        await result.current.fetchCashierStats(30);
      });

      await waitFor(() => {
        expect(result.current.cashierStats).toEqual(mockStats);
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('Utility Actions', () => {
    it('clears cashier details', () => {
      const { result } = renderHook(() => useCashierStore());

      act(() => {
        result.current.cashierDetails = { id: '1' };
      });

      act(() => {
        result.current.clearCashierDetails();
      });

      expect(result.current.cashierDetails).toBeNull();
    });

    it('clears error', () => {
      const { result } = renderHook(() => useCashierStore());

      act(() => {
        result.current.error = 'Test error';
      });

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });

    it('resets store', () => {
      const { result } = renderHook(() => useCashierStore());

      act(() => {
        result.current.currentCashier = { id: '1' };
        result.current.error = 'Test error';
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.currentCashier).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });
});
