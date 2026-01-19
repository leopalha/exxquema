import { apiFetch, apiGet, apiPost, apiPut, apiPatch, apiDelete } from '../apiClient';

// Mock fetch globally
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock window.location
delete window.location;
window.location = { href: '' };

describe('API Client Utils', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorageMock.getItem.mockClear();
    localStorageMock.removeItem.mockClear();
    window.location.href = '';
  });

  describe('apiFetch', () => {
    test('makes successful request', async () => {
      const mockData = { id: 1, name: 'Test' };
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData
      });

      const result = await apiFetch('/api/test');

      expect(fetch).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    test('handles 401 unauthorized response', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized' })
      });

      await expect(apiFetch('/api/test')).rejects.toThrow();
    });

    test('handles 404 not found', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Not found' })
      });

      await expect(apiFetch('/api/test')).rejects.toThrow();
    });

    test('handles 500 server error', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Server error' })
      });

      await expect(apiFetch('/api/test')).rejects.toThrow();
    });

    test('handles network error', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(apiFetch('/api/test')).rejects.toThrow('Network error');
    });
  });

  describe('apiGet', () => {
    test('makes GET request', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: 'test' })
      });

      const result = await apiGet('/api/resource');

      expect(fetch).toHaveBeenCalled();
      expect(result).toEqual({ data: 'test' });
    });
  });

  describe('apiPost', () => {
    test('makes POST request with body', async () => {
      const postData = { name: 'New Item' };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ id: 1, ...postData })
      });

      const result = await apiPost('/api/resource', postData);

      expect(fetch).toHaveBeenCalled();
      const callArgs = fetch.mock.calls[0];
      expect(callArgs[1].method).toBe('POST');
      expect(callArgs[1].body).toBe(JSON.stringify(postData));
    });
  });

  describe('apiPut', () => {
    test('makes PUT request', async () => {
      const updateData = { name: 'Updated' };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => updateData
      });

      await apiPut('/api/resource/1', updateData);

      expect(fetch).toHaveBeenCalled();
      const callArgs = fetch.mock.calls[0];
      expect(callArgs[1].method).toBe('PUT');
    });
  });

  describe('apiPatch', () => {
    test('makes PATCH request', async () => {
      const patchData = { status: 'active' };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => patchData
      });

      await apiPatch('/api/resource/1', patchData);

      expect(fetch).toHaveBeenCalled();
      const callArgs = fetch.mock.calls[0];
      expect(callArgs[1].method).toBe('PATCH');
    });
  });

  describe('apiDelete', () => {
    test('makes DELETE request', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => ({})
      });

      await apiDelete('/api/resource/1');

      expect(fetch).toHaveBeenCalled();
      const callArgs = fetch.mock.calls[0];
      expect(callArgs[1].method).toBe('DELETE');
    });
  });

  describe('error handling', () => {
    test('throws error for non-ok responses', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Bad request' })
      });

      await expect(apiFetch('/api/test')).rejects.toThrow();
    });

    test('handles JSON parse errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error('Invalid JSON');
        }
      });

      await expect(apiFetch('/api/test')).rejects.toThrow();
    });
  });
});
