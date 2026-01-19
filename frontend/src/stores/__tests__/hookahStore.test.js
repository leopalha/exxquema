import { renderHook, act, waitFor } from '@testing-library/react';
import { useHookahStore } from '../hookahStore';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};
global.localStorage = localStorageMock;

// Mock fetch
global.fetch = jest.fn();

describe('hookahStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    fetch.mockClear();
  });

  describe('Initial State', () => {
    it('has correct initial state', () => {
      const { result } = renderHook(() => useHookahStore());

      expect(result.current.flavors).toEqual([]);
      expect(result.current.sessions).toEqual([]);
      expect(result.current.selectedFlavor).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.sessionTimers).toEqual({});
      expect(result.current.revenueReport).toBeNull();
      expect(result.current.history).toEqual([]);
    });
  });

  describe('Fetch Flavors', () => {
    it('fetches flavors successfully', async () => {
      const mockFlavors = [
        { id: '1', name: 'Apple', category: 'fruit', price: 25 },
        { id: '2', name: 'Mint', category: 'mint', price: 20 }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockFlavors })
      });

      const { result } = renderHook(() => useHookahStore());

      await act(async () => {
        await result.current.fetchFlavors();
      });

      await waitFor(() => {
        expect(result.current.flavors).toEqual(mockFlavors);
        expect(result.current.loading).toBe(false);
      });
    });

    it('handles fetch flavors error', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useHookahStore());

      await act(async () => {
        await result.current.fetchFlavors();
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Network error');
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('Sessions Management', () => {
    it('fetches sessions successfully', async () => {
      const mockSessions = [
        { id: '1', mesaId: '1', status: 'active', flavorId: '1' }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockSessions })
      });

      const { result } = renderHook(() => useHookahStore());

      await act(async () => {
        await result.current.fetchSessions();
      });

      await waitFor(() => {
        expect(result.current.sessions).toEqual(mockSessions);
        expect(result.current.loading).toBe(false);
      });
    });

    it('starts new session', async () => {
      const newSession = {
        id: '1',
        mesaId: '1',
        flavorId: '1',
        quantity: 1,
        duration: 30,
        status: 'active'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: newSession })
      });

      const { result } = renderHook(() => useHookahStore());

      await act(async () => {
        await result.current.startSession('1', '1', 1, 30);
      });

      await waitFor(() => {
        expect(result.current.sessions).toContainEqual(newSession);
        expect(result.current.loading).toBe(false);
      });
    });

    it('registers coal change', async () => {
      const updatedSession = {
        id: '1',
        coalChanges: 1,
        lastCoalChange: new Date().toISOString()
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: updatedSession })
      });

      const { result } = renderHook(() => useHookahStore());

      act(() => {
        result.current.sessions = [{ id: '1', coalChanges: 0 }];
      });

      await act(async () => {
        await result.current.registerCoalChange('1');
      });

      await waitFor(() => {
        expect(result.current.sessions[0]).toEqual(updatedSession);
      });
    });

    it('pauses session', async () => {
      const pausedSession = { id: '1', status: 'paused' };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: pausedSession })
      });

      const { result } = renderHook(() => useHookahStore());

      act(() => {
        result.current.sessions = [{ id: '1', status: 'active' }];
      });

      await act(async () => {
        await result.current.pauseSession('1');
      });

      await waitFor(() => {
        expect(result.current.sessions[0].status).toBe('paused');
      });
    });

    it('resumes session', async () => {
      const resumedSession = { id: '1', status: 'active' };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: resumedSession })
      });

      const { result } = renderHook(() => useHookahStore());

      act(() => {
        result.current.sessions = [{ id: '1', status: 'paused' }];
      });

      await act(async () => {
        await result.current.resumeSession('1');
      });

      await waitFor(() => {
        expect(result.current.sessions[0].status).toBe('active');
      });
    });

    it('marks session as preparing', async () => {
      const preparingSession = { id: '1', status: 'preparing' };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: preparingSession })
      });

      const { result } = renderHook(() => useHookahStore());

      act(() => {
        result.current.sessions = [{ id: '1', status: 'pending' }];
      });

      await act(async () => {
        await result.current.markAsPreparing('1');
      });

      await waitFor(() => {
        expect(result.current.sessions[0].status).toBe('preparing');
      });
    });

    it('marks session as ready', async () => {
      const readySession = { id: '1', status: 'ready' };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: readySession })
      });

      const { result } = renderHook(() => useHookahStore());

      act(() => {
        result.current.sessions = [{ id: '1', status: 'preparing' }];
      });

      await act(async () => {
        await result.current.markAsReady('1');
      });

      await waitFor(() => {
        expect(result.current.sessions[0].status).toBe('ready');
      });
    });

    it('ends session', async () => {
      const endedSession = { id: '1', status: 'completed' };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: endedSession })
      });

      const { result } = renderHook(() => useHookahStore());

      act(() => {
        result.current.sessions = [{ id: '1', status: 'active' }];
      });

      await act(async () => {
        await result.current.endSession('1', 'Session completed');
      });

      await waitFor(() => {
        expect(result.current.sessions[0].status).toBe('completed');
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('History and Reports', () => {
    it('fetches session history', async () => {
      const mockHistory = [
        { id: '1', mesaId: '1', status: 'completed', date: '2024-03-20' }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockHistory })
      });

      const { result } = renderHook(() => useHookahStore());

      await act(async () => {
        await result.current.fetchHistory(30);
      });

      await waitFor(() => {
        expect(result.current.history).toEqual(mockHistory);
        expect(result.current.loading).toBe(false);
      });
    });

    it('fetches revenue report', async () => {
      const mockReport = {
        totalRevenue: 5000,
        sessionsCount: 50,
        averageRevenue: 100
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockReport })
      });

      const { result } = renderHook(() => useHookahStore());

      await act(async () => {
        await result.current.fetchRevenueReport(30);
      });

      await waitFor(() => {
        expect(result.current.revenueReport).toEqual(mockReport);
        expect(result.current.loading).toBe(false);
      });
    });

    it('fetches popular flavors', async () => {
      const mockPopular = [
        { id: '1', name: 'Apple', orders: 50 },
        { id: '2', name: 'Mint', orders: 45 }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockPopular })
      });

      const { result } = renderHook(() => useHookahStore());

      let popularFlavors;
      await act(async () => {
        popularFlavors = await result.current.fetchPopularFlavors(5);
      });

      expect(popularFlavors).toEqual(mockPopular);
    });
  });

  describe('Timer Management', () => {
    it('updates session timer', () => {
      const { result } = renderHook(() => useHookahStore());

      act(() => {
        result.current.tickTimer('1', 300, 1500);
      });

      expect(result.current.sessionTimers['1']).toEqual({
        elapsed: 300,
        remaining: 1500
      });
    });
  });

  describe('Flavor Selection', () => {
    it('selects a flavor', () => {
      const { result } = renderHook(() => useHookahStore());
      const flavor = { id: '1', name: 'Apple' };

      act(() => {
        result.current.selectFlavor(flavor);
      });

      expect(result.current.selectedFlavor).toEqual(flavor);
    });

    it('clears selection', () => {
      const { result } = renderHook(() => useHookahStore());

      act(() => {
        result.current.selectedFlavor = { id: '1', name: 'Apple' };
        result.current.error = 'Some error';
      });

      act(() => {
        result.current.clearSelection();
      });

      expect(result.current.selectedFlavor).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });

  describe('Getters', () => {
    it('gets flavor by ID', () => {
      const { result } = renderHook(() => useHookahStore());

      act(() => {
        result.current.flavors = [
          { id: '1', name: 'Apple' },
          { id: '2', name: 'Mint' }
        ];
      });

      const flavor = result.current.getFlavorById('1');
      expect(flavor).toEqual({ id: '1', name: 'Apple' });
    });

    it('gets session by ID', () => {
      const { result } = renderHook(() => useHookahStore());

      act(() => {
        result.current.sessions = [
          { id: '1', status: 'active' },
          { id: '2', status: 'paused' }
        ];
      });

      const session = result.current.getSessionById('1');
      expect(session).toEqual({ id: '1', status: 'active' });
    });

    it('gets active sessions count', () => {
      const { result } = renderHook(() => useHookahStore());

      act(() => {
        result.current.sessions = [
          { id: '1', status: 'active' },
          { id: '2', status: 'paused' },
          { id: '3', status: 'active' }
        ];
      });

      const count = result.current.getActiveCount();
      expect(count).toBe(2);
    });
  });
});
