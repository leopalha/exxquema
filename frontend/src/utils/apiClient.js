// API Client com cache-busting e error handling

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetch com headers anti-cache para evitar problemas com Service Worker
 */
export async function apiFetch(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;

  // Headers padrão anti-cache
  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    ...options.headers
  };

  // Token de autenticação se disponível
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      cache: 'no-store' // NUNCA cachear requisições da API
    });

    // Se 401, limpar token e redirecionar
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/login';
      }
      throw new Error('Não autorizado');
    }

    // Parse JSON
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Erro: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('[API Error]', endpoint, error);
    throw error;
  }
}

/**
 * GET request
 */
export function apiGet(endpoint) {
  return apiFetch(endpoint, {
    method: 'GET'
  });
}

/**
 * POST request
 */
export function apiPost(endpoint, body) {
  return apiFetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

/**
 * PUT request
 */
export function apiPut(endpoint, body) {
  return apiFetch(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body)
  });
}

/**
 * PATCH request
 */
export function apiPatch(endpoint, body) {
  return apiFetch(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(body)
  });
}

/**
 * DELETE request
 */
export function apiDelete(endpoint) {
  return apiFetch(endpoint, {
    method: 'DELETE'
  });
}

export default {
  fetch: apiFetch,
  get: apiGet,
  post: apiPost,
  put: apiPut,
  patch: apiPatch,
  delete: apiDelete
};
