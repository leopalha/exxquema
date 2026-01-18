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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

describe('API Client Utils', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorageMock.getItem.mockClear();
    localStorageMock.removeItem.mockClear();
    window.location.href = '';
  });

  describe('apiFetch', () => {
    test('makes successful GET request', async () => {
      const mockData = { id: 1, name: 'Test' };
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData
      });

      const result = await apiFetch('/api/test');

      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/api/test`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }),
          cache: 'no-store'
        })
      );
      expect(result).toEqual(mockData);
    });

    test('includes auth token if available', async () => {
      const token = 'test-token-123';
      localStorageMock.getItem.mockReturnValue(token);

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({})
      });

      await apiFetch('/api/test');

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${token}`
          })
        })
      );
    });

    test('does not include auth token if not available', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({})
      });

      await apiFetch('/api/test');

      const callArgs = fetch.mock.calls[0][1];
      expect(callArgs.headers.Authorization).toBeUndefined();
    });

    test('handles 401 unauthorized response', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized' })
      });

      await expect(apiFetch('/api/test')).rejects.toThrow('Não autorizado');

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('userId');
      expect(window.location.href).toBe('/login');
    });

    test('handles 404 not found response', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Not found' })
      });

      await expect(apiFetch('/api/test')).rejects.toThrow('Not found');
    });

    test('handles 500 server error', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Internal server error' })
      });

      await expect(apiFetch('/api/test')).rejects.toThrow('Internal server error');
    });

    test('handles network error', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(apiFetch('/api/test')).rejects.toThrow('Network error');
      expect(console.error).toHaveBeenCalledWith('[API Error]', '/api/test', expect.any(Error));
    });

    test('merges custom headers', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({})
      });

      await apiFetch('/api/test', {
        headers: {
          'X-Custom-Header': 'custom-value'
        }
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-Custom-Header': 'custom-value'
          })
        })
      );
    });

    test('uses no-store cache policy', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({})
      });

      await apiFetch('/api/test');

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          cache: 'no-store'
        })
      );
    });

    test('handles response without message in error', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({})
      });

      await expect(apiFetch('/api/test')).rejects.toThrow('Erro: 400');
    });
  });

  describe('apiGet', () => {
    test('makes GET request', async () => {
      const mockData = { id: 1 };
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData
      });

      const result = await apiGet('/api/products');

      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/api/products`,
        expect.objectContaining({
          method: 'GET'
        })
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('apiPost', () => {
    test('makes POST request with body', async () => {
      const requestBody = { name: 'New Product', price: 29.90 };
      const mockResponse = { id: 1, ...requestBody };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockResponse
      });

      const result = await apiPost('/api/products', requestBody);

      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/api/products`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestBody)
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('handles POST with nested objects', async () => {
      const complexBody = {
        user: { id: 1, name: 'Test' },
        items: [{ id: 1, qty: 2 }, { id: 2, qty: 1 }],
        metadata: { source: 'app', version: '2.0' }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ success: true })
      });

      await apiPost('/api/orders', complexBody);

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(complexBody)
        })
      );
    });
  });

  describe('apiPut', () => {
    test('makes PUT request with body', async () => {
      const updateBody = { name: 'Updated Product' };
      const mockResponse = { id: 1, ...updateBody };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      });

      const result = await apiPut('/api/products/1', updateBody);

      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/api/products/1`,
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updateBody)
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('apiPatch', () => {
    test('makes PATCH request with body', async () => {
      const patchBody = { status: 'active' };
      const mockResponse = { id: 1, status: 'active' };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      });

      const result = await apiPatch('/api/products/1', patchBody);

      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/api/products/1`,
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(patchBody)
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('apiDelete', () => {
    test('makes DELETE request', async () => {
      const mockResponse = { success: true };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      });

      const result = await apiDelete('/api/products/1');

      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/api/products/1`,
        expect.objectContaining({
          method: 'DELETE'
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('real-world scenarios', () => {
    test('handles authentication flow', async () => {
      const credentials = { email: 'test@example.com', password: 'password123' };
      const authResponse = { token: 'jwt-token-123', userId: 1 };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => authResponse
      });

      const result = await apiPost('/api/auth/login', credentials);
      expect(result).toEqual(authResponse);
    });

    test('handles order creation', async () => {
      const order = {
        items: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 }
        ],
        tableId: 5,
        paymentMethod: 'card'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ id: 123, ...order })
      });

      const result = await apiPost('/api/orders', order);
      expect(result.id).toBe(123);
    });

    test('handles pagination parameters', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: [], total: 0, page: 1 })
      });

      await apiGet('/api/products?page=1&limit=20&category=drinks');

      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/api/products?page=1&limit=20&category=drinks`,
        expect.any(Object)
      );
    });

    test('handles session timeout (401) during active use', async () => {
      localStorageMock.getItem.mockReturnValue('expired-token');

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Token expired' })
      });

      await expect(apiGet('/api/orders')).rejects.toThrow();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
      expect(window.location.href).toBe('/login');
    });
  });

  describe('error handling edge cases', () => {
    test('handles malformed JSON response', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => {
          throw new SyntaxError('Unexpected token');
        }
      });

      await expect(apiFetch('/api/test')).rejects.toThrow('Unexpected token');
    });

    test('handles empty response body', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => null
      });

      await expect(apiFetch('/api/test')).rejects.toThrow('Erro: 500');
    });

    test('handles timeout errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Request timeout'));

      await expect(apiFetch('/api/test')).rejects.toThrow('Request timeout');
    });
  });
});
