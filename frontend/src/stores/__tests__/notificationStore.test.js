import { renderHook, act } from '@testing-library/react';

jest.resetModules();

// Mock safeLocalStorage
jest.mock('../../utils/storage', () => ({
  safeLocalStorage: {
    getItem: jest.fn(() => null),
    setItem: jest.fn()
  }
}));

// Mock zustand persist middleware
jest.mock('zustand/middleware', () => ({
  persist: (config) => config
}));

// Mock fetch
global.fetch = jest.fn();

// Import after mocks
import useNotificationStore from '../notificationStore';

describe('NotificationStore', () => {
  beforeEach(() => {
    useNotificationStore.setState({
      preferences: {
        orderUpdates: true,
        promotions: true,
        reservations: true,
        marketing: false
      },
      isEnabled: false,
      lastPrompt: null
    }, true);
    jest.clearAllMocks();
  });

  test('has correct initial state', () => {
    const { result } = renderHook(() => useNotificationStore());
    expect(result.current.preferences.orderUpdates).toBe(true);
    expect(result.current.preferences.promotions).toBe(true);
    expect(result.current.preferences.reservations).toBe(true);
    expect(result.current.preferences.marketing).toBe(false);
    expect(result.current.isEnabled).toBe(false);
    expect(result.current.lastPrompt).toBeNull();
  });

  test('can set preferences', () => {
    const { result } = renderHook(() => useNotificationStore());

    act(() => {
      result.current.setPreferences({
        orderUpdates: false,
        promotions: false,
        reservations: true,
        marketing: true
      });
    });

    expect(result.current.preferences.orderUpdates).toBe(false);
    expect(result.current.preferences.promotions).toBe(false);
    expect(result.current.preferences.marketing).toBe(true);
  });

  test('can enable notifications', () => {
    const { result } = renderHook(() => useNotificationStore());

    act(() => {
      result.current.setEnabled(true);
    });

    expect(result.current.isEnabled).toBe(true);
  });

  test('can disable notifications', () => {
    const { result } = renderHook(() => useNotificationStore());

    act(() => {
      result.current.setEnabled(true);
    });

    expect(result.current.isEnabled).toBe(true);

    act(() => {
      result.current.setEnabled(false);
    });

    expect(result.current.isEnabled).toBe(false);
  });

  test('can set last prompt date', () => {
    const { result } = renderHook(() => useNotificationStore());

    const testDate = new Date('2024-01-15');

    act(() => {
      result.current.setLastPrompt(testDate);
    });

    expect(result.current.lastPrompt).toEqual(testDate);
  });

  test('shouldShowPrompt returns true if never prompted', () => {
    const { result } = renderHook(() => useNotificationStore());

    act(() => {
      useNotificationStore.setState({ lastPrompt: null, isEnabled: false });
    });

    expect(result.current.shouldShowPrompt()).toBe(true);
  });

  test('shouldShowPrompt returns false if notifications enabled', () => {
    const { result } = renderHook(() => useNotificationStore());

    act(() => {
      useNotificationStore.setState({ isEnabled: true, lastPrompt: null });
    });

    expect(result.current.shouldShowPrompt()).toBe(false);
  });

  test('shouldShowPrompt returns false if prompted less than 7 days ago', () => {
    const { result } = renderHook(() => useNotificationStore());

    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

    act(() => {
      useNotificationStore.setState({
        lastPrompt: threeDaysAgo.toISOString(),
        isEnabled: false
      });
    });

    expect(result.current.shouldShowPrompt()).toBe(false);
  });

  test('shouldShowPrompt returns true if prompted more than 7 days ago', () => {
    const { result } = renderHook(() => useNotificationStore());

    const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);

    act(() => {
      useNotificationStore.setState({
        lastPrompt: eightDaysAgo.toISOString(),
        isEnabled: false
      });
    });

    expect(result.current.shouldShowPrompt()).toBe(true);
  });

  test('syncPreferences sends correct data to API', async () => {
    const { result } = renderHook(() => useNotificationStore());

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        preferences: {
          orderUpdates: false,
          promotions: true,
          reservations: true,
          marketing: false
        }
      })
    });

    let syncResult;
    await act(async () => {
      syncResult = await result.current.syncPreferences('test-token', 'test-endpoint');
    });

    expect(syncResult).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/push/preferences'),
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token'
        })
      })
    );
  });

  test('syncPreferences handles API error', async () => {
    const { result } = renderHook(() => useNotificationStore());

    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });

    let syncResult;
    await act(async () => {
      syncResult = await result.current.syncPreferences('test-token', 'test-endpoint');
    });

    expect(syncResult).toBe(false);
  });

  test('syncPreferences handles network error', async () => {
    const { result } = renderHook(() => useNotificationStore());

    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    let syncResult;
    await act(async () => {
      syncResult = await result.current.syncPreferences('test-token', 'test-endpoint');
    });

    expect(syncResult).toBe(false);
  });

  test('can toggle individual preferences', () => {
    const { result } = renderHook(() => useNotificationStore());

    act(() => {
      result.current.setPreferences({
        ...result.current.preferences,
        orderUpdates: false
      });
    });

    expect(result.current.preferences.orderUpdates).toBe(false);
    expect(result.current.preferences.promotions).toBe(true);
  });

  test('real-world scenario: user enables notifications for first time', () => {
    const { result } = renderHook(() => useNotificationStore());

    // User sees prompt
    expect(result.current.shouldShowPrompt()).toBe(true);

    // User enables notifications
    act(() => {
      result.current.setEnabled(true);
      result.current.setLastPrompt(new Date());
    });

    expect(result.current.isEnabled).toBe(true);
    expect(result.current.lastPrompt).not.toBeNull();

    // Should not show prompt again
    expect(result.current.shouldShowPrompt()).toBe(false);
  });

  test('real-world scenario: user dismisses prompt, sees it again after 7 days', () => {
    const { result } = renderHook(() => useNotificationStore());

    // User dismisses prompt
    const today = new Date();
    act(() => {
      result.current.setLastPrompt(today);
    });

    // Should not show prompt immediately
    expect(result.current.shouldShowPrompt()).toBe(false);

    // 8 days later
    const eightDaysLater = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
    act(() => {
      useNotificationStore.setState({ lastPrompt: eightDaysLater.toISOString() });
    });

    // Should show prompt again
    expect(result.current.shouldShowPrompt()).toBe(true);
  });
});
