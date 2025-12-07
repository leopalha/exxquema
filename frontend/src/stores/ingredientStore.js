/**
 * Ingredient Store - FLAME Lounge Bar
 * Gerencia estado de insumos e ficha técnica
 */

import { create } from 'zustand';
import api from '../services/api';

const useIngredientStore = create((set, get) => ({
  // Estado
  ingredients: [],
  selectedIngredient: null,
  recipe: [],
  movements: [],
  lowStock: [],
  categories: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 50,
    total: 0,
    pages: 1
  },

  // ============== INSUMOS ==============

  // Buscar todos os insumos
  fetchIngredients: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams({
        page: filters.page || 1,
        limit: filters.limit || 50,
        ...filters
      });

      const response = await api.get(`/ingredients?${params}`);
      if (response.data.success) {
        set({
          ingredients: response.data.data.ingredients,
          pagination: response.data.data.pagination,
          loading: false
        });
        return response.data.data;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false
      });
      throw error;
    }
  },

  // Buscar insumo por ID
  fetchIngredientById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/ingredients/${id}`);
      if (response.data.success) {
        set({
          selectedIngredient: response.data.data.ingredient,
          loading: false
        });
        return response.data.data.ingredient;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false
      });
      throw error;
    }
  },

  // Criar insumo
  createIngredient: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/ingredients', data);
      if (response.data.success) {
        // Adicionar à lista local
        set(state => ({
          ingredients: [response.data.data.ingredient, ...state.ingredients],
          loading: false
        }));
        return response.data.data.ingredient;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false
      });
      throw error;
    }
  },

  // Atualizar insumo
  updateIngredient: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/ingredients/${id}`, data);
      if (response.data.success) {
        // Atualizar na lista local
        set(state => ({
          ingredients: state.ingredients.map(i =>
            i.id === id ? response.data.data.ingredient : i
          ),
          selectedIngredient: response.data.data.ingredient,
          loading: false
        }));
        return response.data.data.ingredient;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false
      });
      throw error;
    }
  },

  // Desativar insumo
  deactivateIngredient: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.patch(`/ingredients/${id}/deactivate`);
      if (response.data.success) {
        // Atualizar na lista local
        set(state => ({
          ingredients: state.ingredients.map(i =>
            i.id === id ? { ...i, isActive: false } : i
          ),
          loading: false
        }));
        return true;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false
      });
      throw error;
    }
  },

  // Buscar categorias
  fetchCategories: async () => {
    try {
      const response = await api.get('/ingredients/categories');
      if (response.data.success) {
        set({ categories: response.data.data.categories });
        return response.data.data.categories;
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  },

  // ============== ESTOQUE ==============

  // Buscar insumos com estoque baixo
  fetchLowStock: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/ingredients/low-stock');
      if (response.data.success) {
        set({
          lowStock: response.data.data.ingredients,
          loading: false
        });
        return response.data.data;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false
      });
      throw error;
    }
  },

  // Adicionar estoque (entrada)
  addStock: async (ingredientId, data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`/ingredients/${ingredientId}/stock/add`, data);
      if (response.data.success) {
        // Atualizar estoque local
        set(state => ({
          ingredients: state.ingredients.map(i =>
            i.id === ingredientId
              ? { ...i, currentStock: response.data.data.newStock }
              : i
          ),
          loading: false
        }));
        return response.data.data;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false
      });
      throw error;
    }
  },

  // Ajustar estoque (inventário)
  adjustStock: async (ingredientId, data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`/ingredients/${ingredientId}/stock/adjust`, data);
      if (response.data.success) {
        // Atualizar estoque local
        set(state => ({
          ingredients: state.ingredients.map(i =>
            i.id === ingredientId
              ? { ...i, currentStock: response.data.data.newStock }
              : i
          ),
          loading: false
        }));
        return response.data.data;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false
      });
      throw error;
    }
  },

  // Registrar perda
  registerLoss: async (ingredientId, data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`/ingredients/${ingredientId}/stock/loss`, data);
      if (response.data.success) {
        // Atualizar estoque local
        set(state => ({
          ingredients: state.ingredients.map(i =>
            i.id === ingredientId
              ? { ...i, currentStock: response.data.data.newStock }
              : i
          ),
          loading: false
        }));
        return response.data.data;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false
      });
      throw error;
    }
  },

  // Buscar movimentações de um insumo
  fetchMovements: async (ingredientId, filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/ingredients/${ingredientId}/movements?${params}`);
      if (response.data.success) {
        set({
          movements: response.data.data.movements,
          loading: false
        });
        return response.data.data.movements;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false
      });
      throw error;
    }
  },

  // ============== FICHA TÉCNICA ==============

  // Buscar ficha técnica de um produto
  fetchProductRecipe: async (productId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/ingredients/recipe/product/${productId}`);
      if (response.data.success) {
        set({
          recipe: response.data.data.recipe,
          loading: false
        });
        return response.data.data;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false
      });
      throw error;
    }
  },

  // Adicionar item à ficha técnica
  addRecipeItem: async (productId, data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(`/ingredients/recipe/product/${productId}/items`, data);
      if (response.data.success) {
        // Atualizar ficha técnica local
        set(state => ({
          recipe: [...state.recipe, response.data.data.item],
          loading: false
        }));
        return response.data.data.item;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false
      });
      throw error;
    }
  },

  // Atualizar item da ficha técnica
  updateRecipeItem: async (itemId, data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/ingredients/recipe/items/${itemId}`, data);
      if (response.data.success) {
        // Atualizar na lista local
        set(state => ({
          recipe: state.recipe.map(item =>
            item.id === itemId ? response.data.data.item : item
          ),
          loading: false
        }));
        return response.data.data.item;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false
      });
      throw error;
    }
  },

  // Remover item da ficha técnica
  removeRecipeItem: async (itemId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.delete(`/ingredients/recipe/items/${itemId}`);
      if (response.data.success) {
        // Remover da lista local
        set(state => ({
          recipe: state.recipe.filter(item => item.id !== itemId),
          loading: false
        }));
        return true;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false
      });
      throw error;
    }
  },

  // Verificar disponibilidade de estoque
  checkAvailability: async (productId, quantity = 1) => {
    try {
      const response = await api.get(
        `/ingredients/recipe/product/${productId}/availability?quantity=${quantity}`
      );
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error);
      return { available: false, error: error.message };
    }
  },

  // ============== RELATÓRIOS ==============

  // Relatório de CMV
  fetchCMVReport: async (startDate, endDate) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(
        `/ingredients/reports/cmv?startDate=${startDate}&endDate=${endDate}`
      );
      if (response.data.success) {
        set({ loading: false });
        return response.data.data;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false
      });
      throw error;
    }
  },

  // ============== UTILITÁRIOS ==============

  // Limpar erro
  clearError: () => set({ error: null }),

  // Limpar seleção
  clearSelection: () => set({ selectedIngredient: null, recipe: [], movements: [] }),

  // Reset completo
  reset: () => set({
    ingredients: [],
    selectedIngredient: null,
    recipe: [],
    movements: [],
    lowStock: [],
    categories: [],
    loading: false,
    error: null,
    pagination: { page: 1, limit: 50, total: 0, pages: 1 }
  })
}));

export default useIngredientStore;
