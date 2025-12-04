import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const useInventoryStore = create((set, get) => ({
  // Estado
  products: [],
  alerts: {
    critical: 0,
    warning: 0,
    total: 0,
    products: []
  },
  movements: [],
  report: null,
  consumption: {
    byProduct: [],
    byCategory: [],
    summary: {}
  },
  forecasts: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 50
  },

  // Ações: Buscar dashboard
  fetchDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}/inventory/dashboard`);
      if (response.data.success) {
        set({
          products: response.data.data.alerts || [],
          alerts: {
            critical: response.data.data.summary?.alertsCount || 0,
            warning: response.data.data.summary?.warningCount || 0,
            total: response.data.data.summary?.alertsCount || 0,
            products: response.data.data.alerts || []
          },
          loading: false
        });
        return response.data.data;
      }
    } catch (error) {
      set({
        error: error.response?.data?.error || error.message,
        loading: false
      });
    }
  },

  // Ações: Buscar movimentos com paginação
  fetchMovements: async (page = 1, limit = 50, filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams({
        limit,
        offset: (page - 1) * limit,
        ...filters
      });

      const response = await axios.get(`${API_BASE_URL}/inventory/movements?${params}`);
      if (response.data.success) {
        set({
          movements: response.data.data.movements,
          pagination: {
            currentPage: page,
            total: response.data.data.pagination.total,
            totalPages: response.data.data.pagination.pages,
            limit
          },
          loading: false
        });
        return response.data.data;
      }
    } catch (error) {
      set({
        error: error.response?.data?.error || error.message,
        loading: false
      });
    }
  },

  // Ações: Buscar movimentos de um produto
  fetchProductMovements: async (productId, page = 1, limit = 50) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${API_BASE_URL}/inventory/products/${productId}/movements?limit=${limit}&offset=${(page - 1) * limit}`
      );
      if (response.data.success) {
        set({
          movements: response.data.data.movements,
          pagination: {
            currentPage: page,
            total: response.data.data.pagination.total,
            totalPages: response.data.data.pagination.pages,
            limit
          },
          loading: false
        });
        return response.data.data;
      }
    } catch (error) {
      set({
        error: error.response?.data?.error || error.message,
        loading: false
      });
    }
  },

  // Ações: Buscar alertas de estoque baixo
  fetchAlerts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}/inventory/alerts`);
      if (response.data.success) {
        set({
          alerts: response.data.data,
          loading: false
        });
        return response.data.data;
      }
    } catch (error) {
      set({
        error: error.response?.data?.error || error.message,
        loading: false
      });
    }
  },

  // Ações: Ajustar estoque
  adjustStock: async (productId, newQuantity, reason = 'ajuste_inventario', notes = '') => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/inventory/adjust`, {
        productId,
        newQuantity,
        reason,
        notes
      });
      if (response.data.success) {
        set({ loading: false });
        // Recarregar dashboard após ajuste
        get().fetchDashboard();
        return response.data.data;
      }
    } catch (error) {
      set({
        error: error.response?.data?.error || error.message,
        loading: false
      });
      throw error;
    }
  },

  // Ações: Gerar relatório
  generateReport: async (startDate = null, endDate = null) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await axios.get(`${API_BASE_URL}/inventory/report?${params}`);
      if (response.data.success) {
        set({
          report: response.data.data,
          loading: false
        });
        return response.data.data;
      }
    } catch (error) {
      set({
        error: error.response?.data?.error || error.message,
        loading: false
      });
    }
  },

  // Ações: Buscar análise de consumo
  fetchConsumption: async (days = 30) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}/inventory/consumption?days=${days}`);
      if (response.data.success) {
        set({
          consumption: response.data.data,
          loading: false
        });
        return response.data.data;
      }
    } catch (error) {
      set({
        error: error.response?.data?.error || error.message,
        loading: false
      });
    }
  },

  // Ações: Buscar previsão de falta de estoque
  fetchForecasts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}/inventory/forecast`);
      if (response.data.success) {
        set({
          forecasts: response.data.data.forecasts,
          loading: false
        });
        return response.data.data;
      }
    } catch (error) {
      set({
        error: error.response?.data?.error || error.message,
        loading: false
      });
    }
  },

  // Ações: Limpar erro
  clearError: () => {
    set({ error: null });
  },

  // Ações: Reset do estado
  reset: () => {
    set({
      products: [],
      alerts: { critical: 0, warning: 0, total: 0, products: [] },
      movements: [],
      report: null,
      consumption: { byProduct: [], byCategory: [], summary: {} },
      forecasts: [],
      loading: false,
      error: null,
      pagination: { currentPage: 1, totalPages: 1, total: 0, limit: 50 }
    });
  }
}));

export default useInventoryStore;
