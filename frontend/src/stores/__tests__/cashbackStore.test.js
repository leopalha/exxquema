import { renderHook, act } from '@testing-library/react';
import axios from 'axios';

jest.resetModules();

// Unmock cashbackStore to get actual implementation
jest.unmock('../cashbackStore');

// Mock axios
jest.mock('axios');

// Mock localStorage for getAuthToken
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn()
};
global.localStorage = localStorageMock;

// Import after mocks - must use require to bypass Jest's import hoisting
const useCashbackStore = require('../cashbackStore').default;

describe('CashbackStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  test('fetchBalance updates balance and tier successfully', async () => {
    const { result } = renderHook(() => useCashbackStore());

    // First reset the store
    act(() => {
      result.current.reset();
    });

    localStorageMock.getItem.mockReturnValue(JSON.stringify({
      state: { token: 'test-token' }
    }));

    axios.get.mockResolvedValueOnce({
      data: {
        data: {
          balance: 50.50,
          tier: 'gold',
          tierBenefits: { cashbackRate: 0.15 },
          nextTierInfo: { tier: 'platinum', requiredPoints: 1000 }
        }
      }
    });

    await act(async () => {
      await result.current.fetchBalance();
    });

    expect(result.current.balance).toBe(50.50);
    expect(result.current.tier).toBe('gold');
    expect(result.current.tierBenefits).toEqual({ cashbackRate: 0.15 });
    expect(result.current.loading).toBe(false);
  });

  test('fetchBalance handles errors gracefully', async () => {
    const { result } = renderHook(() => useCashbackStore());

    act(() => {
      result.current.reset();
    });

    localStorageMock.getItem.mockReturnValue(JSON.stringify({
      state: { token: 'test-token' }
    }));

    axios.get.mockRejectedValueOnce({
      response: { data: { message: 'Failed to fetch cashback' } }
    });

    await act(async () => {
      await result.current.fetchBalance();
    });

    expect(result.current.error).toBe('Failed to fetch cashback');
    expect(result.current.loading).toBe(false);
  });

  test('fetchHistory retrieves transaction history', async () => {
    const { result } = renderHook(() => useCashbackStore());

    act(() => {
      result.current.reset();
    });

    localStorageMock.getItem.mockReturnValue(JSON.stringify({
      state: { token: 'test-token' }
    }));

    const mockHistory = [
      { id: 1, type: 'earned', amount: 10, description: 'Order #123' },
      { id: 2, type: 'used', amount: -5, description: 'Used in Order #124' }
    ];

    axios.get.mockResolvedValueOnce({
      data: {
        data: {
          history: mockHistory,
          pagination: { page: 1, totalPages: 1 }
        }
      }
    });

    await act(async () => {
      await result.current.fetchHistory(1, 20);
    });

    expect(result.current.history).toEqual(mockHistory);
    expect(result.current.historyPagination).toEqual({ page: 1, totalPages: 1 });
    expect(result.current.loading).toBe(false);
  });

  test('calculateMaxCashbackUsable limits to 50% of order total', async () => {
    const { result } = renderHook(() => useCashbackStore());

    act(() => {
      result.current.reset();
    });

    localStorageMock.getItem.mockReturnValue(JSON.stringify({
      state: { token: 'test-token' }
    }));

    axios.get.mockResolvedValueOnce({
      data: {
        data: {
          balance: 100,
          tier: 'bronze',
          tierBenefits: null,
          nextTierInfo: null
        }
      }
    });

    await act(async () => {
      await result.current.fetchBalance();
    });

    // Order total: 100, max cashback: 50 (50%)
    const maxUsable = result.current.calculateMaxCashbackUsable(100);
    expect(maxUsable).toBe(50);
  });

  test('calculateMaxCashbackUsable respects balance limit', async () => {
    const { result } = renderHook(() => useCashbackStore());

    act(() => {
      result.current.reset();
    });

    localStorageMock.getItem.mockReturnValue(JSON.stringify({
      state: { token: 'test-token' }
    }));

    axios.get.mockResolvedValueOnce({
      data: {
        data: {
          balance: 20,
          tier: 'bronze',
          tierBenefits: null,
          nextTierInfo: null
        }
      }
    });

    await act(async () => {
      await result.current.fetchBalance();
    });

    // Order total: 100, max allowed: 50, but balance: 20
    const maxUsable = result.current.calculateMaxCashbackUsable(100);
    expect(maxUsable).toBe(20); // Limited by balance
  });

  test('clearError resets error state', async () => {
    const { result } = renderHook(() => useCashbackStore());

    act(() => {
      result.current.reset();
    });

    // Trigger an error first
    localStorageMock.getItem.mockReturnValue(JSON.stringify({
      state: { token: 'test-token' }
    }));

    axios.get.mockRejectedValueOnce({
      response: { data: { message: 'Test error' } }
    });

    await act(async () => {
      await result.current.fetchBalance();
    });

    expect(result.current.error).toBe('Test error');

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  test('reset clears all state to initial values', () => {
    const { result } = renderHook(() => useCashbackStore());

    // Call reset and verify all initial values
    act(() => {
      result.current.reset();
    });

    expect(result.current.balance).toBe(0);
    expect(result.current.tier).toBe('bronze');
    expect(result.current.history).toEqual([]);
    expect(result.current.tierBenefits).toBeNull();
    expect(result.current.nextTierInfo).toBeNull();
    expect(result.current.historyPagination).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
