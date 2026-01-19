import { renderHook, act, waitFor } from '@testing-library/react';
import useCampaignStore from '../campaignStore';
import axios from 'axios';

jest.mock('axios');

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};
global.localStorage = localStorageMock;

describe('campaignStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Initial State', () => {
    it('has correct initial state', () => {
      const { result } = renderHook(() => useCampaignStore());

      expect(result.current.campaigns).toEqual([]);
      expect(result.current.selectedCampaign).toBeNull();
      expect(result.current.stats).toBeNull();
      expect(result.current.audiencePreview).toEqual([]);
      expect(result.current.simulationStats).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('has correct default filters', () => {
      const { result } = renderHook(() => useCampaignStore());

      expect(result.current.filters).toEqual({
        page: 1,
        limit: 20,
        status: null,
        type: null
      });
    });
  });

  describe('Filters', () => {
    it('sets filters', () => {
      const { result } = renderHook(() => useCampaignStore());

      act(() => {
        result.current.setFilters({ status: 'active', page: 2 });
      });

      expect(result.current.filters.status).toBe('active');
      expect(result.current.filters.page).toBe(2);
      expect(result.current.filters.limit).toBe(20);
    });
  });

  describe('Fetch Campaigns', () => {
    it('fetches campaigns successfully', async () => {
      const mockCampaigns = [
        { id: '1', name: 'Summer Sale', status: 'active' },
        { id: '2', name: 'Black Friday', status: 'scheduled' }
      ];

      axios.get.mockResolvedValueOnce({
        data: {
          data: mockCampaigns,
          pagination: { total: 2, pages: 1 }
        }
      });

      const { result } = renderHook(() => useCampaignStore());

      await act(async () => {
        await result.current.fetchCampaigns();
      });

      await waitFor(() => {
        expect(result.current.campaigns).toEqual(mockCampaigns);
        expect(result.current.loading).toBe(false);
      });
    });

    it('fetches campaign stats', async () => {
      const mockStats = {
        total: 10,
        active: 3,
        scheduled: 5,
        completed: 2
      };

      axios.get.mockResolvedValueOnce({
        data: { data: mockStats }
      });

      const { result } = renderHook(() => useCampaignStore());

      await act(async () => {
        await result.current.fetchStats();
      });

      await waitFor(() => {
        expect(result.current.stats).toEqual(mockStats);
        expect(result.current.loading).toBe(false);
      });
    });

    it('fetches single campaign', async () => {
      const mockCampaign = {
        id: '1',
        name: 'Test Campaign',
        status: 'active'
      };

      axios.get.mockResolvedValueOnce({
        data: { data: mockCampaign }
      });

      const { result } = renderHook(() => useCampaignStore());

      await act(async () => {
        await result.current.fetchCampaign('1');
      });

      await waitFor(() => {
        expect(result.current.selectedCampaign).toEqual(mockCampaign);
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('CRUD Operations', () => {
    it('creates campaign', async () => {
      const newCampaign = {
        id: '1',
        name: 'New Campaign',
        type: 'promotional'
      };

      axios.post.mockResolvedValueOnce({
        data: { data: newCampaign }
      });

      const { result } = renderHook(() => useCampaignStore());

      await act(async () => {
        await result.current.createCampaign({
          name: 'New Campaign',
          type: 'promotional'
        });
      });

      await waitFor(() => {
        expect(result.current.campaigns).toContainEqual(newCampaign);
        expect(result.current.loading).toBe(false);
      });
    });

    it('updates campaign', async () => {
      const updatedCampaign = {
        id: '1',
        name: 'Updated Campaign',
        status: 'paused'
      };

      axios.put.mockResolvedValueOnce({
        data: { data: updatedCampaign }
      });

      const { result } = renderHook(() => useCampaignStore());

      act(() => {
        result.current.campaigns = [
          { id: '1', name: 'Old Name', status: 'active' }
        ];
      });

      await act(async () => {
        await result.current.updateCampaign('1', { name: 'Updated Campaign' });
      });

      await waitFor(() => {
        expect(result.current.campaigns[0]).toEqual(updatedCampaign);
        expect(result.current.selectedCampaign).toEqual(updatedCampaign);
        expect(result.current.loading).toBe(false);
      });
    });

    it('deletes campaign', async () => {
      axios.delete.mockResolvedValueOnce({ data: { success: true } });

      const { result } = renderHook(() => useCampaignStore());

      act(() => {
        result.current.campaigns = [
          { id: '1', name: 'Campaign 1' },
          { id: '2', name: 'Campaign 2' }
        ];
      });

      await act(async () => {
        await result.current.deleteCampaign('1');
      });

      await waitFor(() => {
        expect(result.current.campaigns).toHaveLength(1);
        expect(result.current.campaigns[0].id).toBe('2');
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('Audience and Simulation', () => {
    it('fetches audience preview', async () => {
      const mockAudience = [
        { id: '1', nome: 'User 1' },
        { id: '2', nome: 'User 2' }
      ];

      axios.get.mockResolvedValueOnce({
        data: { data: mockAudience }
      });

      const { result } = renderHook(() => useCampaignStore());

      await act(async () => {
        await result.current.fetchAudience('1');
      });

      await waitFor(() => {
        expect(result.current.audiencePreview).toEqual(mockAudience);
        expect(result.current.loading).toBe(false);
      });
    });

    it('simulates campaign send', async () => {
      const mockSimulation = {
        audienceSize: 100,
        estimatedCost: 50,
        estimatedReach: 95
      };

      axios.post.mockResolvedValueOnce({
        data: { data: mockSimulation }
      });

      const { result } = renderHook(() => useCampaignStore());

      await act(async () => {
        await result.current.simulateSend('1');
      });

      await waitFor(() => {
        expect(result.current.simulationStats).toEqual(mockSimulation);
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('Campaign Actions', () => {
    it('executes campaign', async () => {
      const executedCampaign = {
        campaign: { id: '1', status: 'executing' }
      };

      axios.post.mockResolvedValueOnce({
        data: { data: executedCampaign }
      });

      const { result } = renderHook(() => useCampaignStore());

      act(() => {
        result.current.campaigns = [{ id: '1', status: 'scheduled' }];
      });

      await act(async () => {
        await result.current.executeCampaign('1');
      });

      await waitFor(() => {
        expect(result.current.campaigns[0].status).toBe('executing');
        expect(result.current.loading).toBe(false);
      });
    });

    it('pauses campaign', async () => {
      const pausedCampaign = { id: '1', status: 'paused' };

      axios.post.mockResolvedValueOnce({
        data: { data: pausedCampaign }
      });

      const { result } = renderHook(() => useCampaignStore());

      act(() => {
        result.current.campaigns = [{ id: '1', status: 'active' }];
      });

      await act(async () => {
        await result.current.pauseCampaign('1');
      });

      await waitFor(() => {
        expect(result.current.campaigns[0].status).toBe('paused');
        expect(result.current.loading).toBe(false);
      });
    });

    it('completes campaign', async () => {
      const completedCampaign = { id: '1', status: 'completed' };

      axios.post.mockResolvedValueOnce({
        data: { data: completedCampaign }
      });

      const { result } = renderHook(() => useCampaignStore());

      act(() => {
        result.current.campaigns = [{ id: '1', status: 'active' }];
      });

      await act(async () => {
        await result.current.completeCampaign('1');
      });

      await waitFor(() => {
        expect(result.current.campaigns[0].status).toBe('completed');
        expect(result.current.loading).toBe(false);
      });
    });

    it('creates quick reactivation campaign', async () => {
      const quickCampaign = {
        id: '1',
        name: 'Reativação 30 dias',
        type: 'reactivation'
      };

      axios.post.mockResolvedValueOnce({
        data: { data: quickCampaign }
      });

      const { result } = renderHook(() => useCampaignStore());

      await act(async () => {
        await result.current.createQuickReactivation(30);
      });

      await waitFor(() => {
        expect(result.current.campaigns).toContainEqual(quickCampaign);
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('Utility Actions', () => {
    it('clears selection', () => {
      const { result } = renderHook(() => useCampaignStore());

      act(() => {
        result.current.selectedCampaign = { id: '1' };
        result.current.audiencePreview = [{ id: '1' }];
        result.current.simulationStats = { reach: 100 };
      });

      act(() => {
        result.current.clearSelection();
      });

      expect(result.current.selectedCampaign).toBeNull();
      expect(result.current.audiencePreview).toEqual([]);
      expect(result.current.simulationStats).toBeNull();
    });

    it('clears error', () => {
      const { result } = renderHook(() => useCampaignStore());

      act(() => {
        result.current.error = 'Test error';
      });

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });

    it('resets store', () => {
      const { result } = renderHook(() => useCampaignStore());

      act(() => {
        result.current.campaigns = [{ id: '1' }];
        result.current.error = 'Test error';
        result.current.filters = { status: 'active' };
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.campaigns).toEqual([]);
      expect(result.current.error).toBeNull();
      expect(result.current.filters).toEqual({
        page: 1,
        limit: 20,
        status: null,
        type: null
      });
    });
  });
});
