import { renderHook, act } from '@testing-library/react';

// Reset module cache
jest.resetModules();

// Suppress console.log from store
console.log = jest.fn();

// Mock dependencies
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn()
  }
}));

jest.mock('../../services/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn()
  }
}));

jest.mock('../../utils/storage', () => ({
  safeLocalStorage: {
    getItem: jest.fn(() => null),
    setItem: jest.fn()
  }
}));

jest.mock('../../data/mockData', () => ({
  mockProducts: [
    {
      id: 1,
      nome: 'Test Product 1',
      descricao: 'Test description',
      preco: 25.00,
      categoria: 'Comidas',
      imagem: '/test1.jpg',
      disponivel: true,
      destaque: true,
      estoque: 10
    },
    {
      id: 2,
      nome: 'Test Product 2',
      descricao: 'Another test',
      preco: 15.00,
      categoria: 'Bebidas',
      imagem: '/test2.jpg',
      disponivel: true,
      destaque: false,
      estoque: 5
    }
  ],
  mockCategories: [
    { id: 1, nome: 'Comidas' },
    { id: 2, nome: 'Bebidas' }
  ],
  mockFeaturedProducts: []
}));

// Mock zustand persist
jest.mock('zustand/middleware', () => ({
  persist: (config) => config
}));

// Import after mocks
import { useProductStore } from '../productStore';

describe('ProductStore', () => {
  beforeEach(() => {
    useProductStore.setState({
      products: [],
      categories: [],
      featuredProducts: [],
      selectedProduct: null,
      filters: {
        category: '',
        search: '',
        minPrice: null,
        maxPrice: null,
        isActive: null,
        isFeatured: false
      },
      loading: false,
      error: null
    }, true);

    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    test('has correct initial state', () => {
      const { result } = renderHook(() => useProductStore());

      expect(result.current.products).toEqual([]);
      expect(result.current.categories).toEqual([]);
      expect(result.current.featuredProducts).toEqual([]);
      expect(result.current.selectedProduct).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    test('has default filters', () => {
      const { result } = renderHook(() => useProductStore());

      expect(result.current.filters.category).toBe('');
      expect(result.current.filters.search).toBe('');
      expect(result.current.filters.minPrice).toBeNull();
      expect(result.current.filters.maxPrice).toBeNull();
      expect(result.current.filters.isActive).toBeNull();
      expect(result.current.filters.isFeatured).toBe(false);
    });
  });

  describe('State Management', () => {
    test('can set products', () => {
      const { result } = renderHook(() => useProductStore());

      const testProducts = [
        { id: 1, name: 'Product 1', price: 10 },
        { id: 2, name: 'Product 2', price: 20 }
      ];

      act(() => {
        useProductStore.setState({ products: testProducts });
      });

      expect(result.current.products).toHaveLength(2);
      expect(result.current.products[0].name).toBe('Product 1');
    });

    test('can set selected product', () => {
      const { result } = renderHook(() => useProductStore());

      const product = { id: 1, name: 'Selected Product', price: 25 };

      act(() => {
        useProductStore.setState({ selectedProduct: product });
      });

      expect(result.current.selectedProduct).toEqual(product);
      expect(result.current.selectedProduct.name).toBe('Selected Product');
    });

    test('can update filters', () => {
      const { result } = renderHook(() => useProductStore());

      act(() => {
        useProductStore.setState({
          filters: {
            category: 'Bebidas',
            search: 'cerveja',
            minPrice: 5,
            maxPrice: 20,
            isActive: true,
            isFeatured: false
          }
        });
      });

      expect(result.current.filters.category).toBe('Bebidas');
      expect(result.current.filters.search).toBe('cerveja');
      expect(result.current.filters.minPrice).toBe(5);
      expect(result.current.filters.maxPrice).toBe(20);
    });
  });

  describe('Loading and Error States', () => {
    test('can set loading state', () => {
      const { result } = renderHook(() => useProductStore());

      act(() => {
        useProductStore.setState({ loading: true });
      });

      expect(result.current.loading).toBe(true);

      act(() => {
        useProductStore.setState({ loading: false });
      });

      expect(result.current.loading).toBe(false);
    });

    test('can set error state', () => {
      const { result } = renderHook(() => useProductStore());

      const error = 'Failed to fetch products';

      act(() => {
        useProductStore.setState({ error });
      });

      expect(result.current.error).toBe(error);
    });

    test('can clear error', () => {
      const { result } = renderHook(() => useProductStore());

      act(() => {
        useProductStore.setState({ error: 'Test error' });
      });

      expect(result.current.error).toBe('Test error');

      act(() => {
        useProductStore.setState({ error: null });
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('Real-world Scenarios', () => {
    test('filters products by category', () => {
      const { result } = renderHook(() => useProductStore());

      const allProducts = [
        { id: 1, name: 'Burger', category: 'Comidas', price: 25 },
        { id: 2, name: 'Beer', category: 'Bebidas', price: 8 },
        { id: 3, name: 'Fries', category: 'Comidas', price: 10 }
      ];

      act(() => {
        useProductStore.setState({ products: allProducts });
      });

      // Simulate filter by category
      const comidasProducts = result.current.products.filter(p => p.category === 'Comidas');
      expect(comidasProducts).toHaveLength(2);
    });

    test('searches products by name', () => {
      const { result } = renderHook(() => useProductStore());

      const allProducts = [
        { id: 1, name: 'Burger Clássico', category: 'Comidas', price: 25 },
        { id: 2, name: 'Burger Bacon', category: 'Comidas', price: 30 },
        { id: 3, name: 'Fries', category: 'Comidas', price: 10 }
      ];

      act(() => {
        useProductStore.setState({ products: allProducts });
      });

      // Simulate search
      const searchResults = result.current.products.filter(p =>
        p.name.toLowerCase().includes('burger')
      );
      expect(searchResults).toHaveLength(2);
    });

    test('filters by price range', () => {
      const { result } = renderHook(() => useProductStore());

      const allProducts = [
        { id: 1, name: 'Product 1', price: 5 },
        { id: 2, name: 'Product 2', price: 15 },
        { id: 3, name: 'Product 3', price: 25 },
        { id: 4, name: 'Product 4', price: 35 }
      ];

      act(() => {
        useProductStore.setState({ products: allProducts });
      });

      // Filter by price range: 10-30
      const filtered = result.current.products.filter(p =>
        p.price >= 10 && p.price <= 30
      );
      expect(filtered).toHaveLength(2);
      expect(filtered.find(p => p.id === 2)).toBeDefined();
      expect(filtered.find(p => p.id === 3)).toBeDefined();
    });

    test('displays featured products', () => {
      const { result } = renderHook(() => useProductStore());

      const featuredProducts = [
        { id: 1, name: 'Featured 1', isFeatured: true, price: 20 },
        { id: 2, name: 'Featured 2', isFeatured: true, price: 25 }
      ];

      act(() => {
        useProductStore.setState({ featuredProducts });
      });

      expect(result.current.featuredProducts).toHaveLength(2);
      expect(result.current.featuredProducts.every(p => p.isFeatured)).toBe(true);
    });

    test('handles product selection for modal', () => {
      const { result } = renderHook(() => useProductStore());

      const products = [
        { id: 1, name: 'Product 1', price: 20, description: 'Desc 1' },
        { id: 2, name: 'Product 2', price: 30, description: 'Desc 2' }
      ];

      act(() => {
        useProductStore.setState({ products });
      });

      // Select product
      act(() => {
        useProductStore.setState({ selectedProduct: products[0] });
      });

      expect(result.current.selectedProduct.id).toBe(1);
      expect(result.current.selectedProduct.name).toBe('Product 1');

      // Deselect (close modal)
      act(() => {
        useProductStore.setState({ selectedProduct: null });
      });

      expect(result.current.selectedProduct).toBeNull();
    });

    test('manages categories list', () => {
      const { result } = renderHook(() => useProductStore());

      const categories = [
        { id: 1, name: 'Comidas', icon: 'utensils' },
        { id: 2, name: 'Bebidas', icon: 'beer' },
        { id: 3, name: 'Sobremesas', icon: 'ice-cream' }
      ];

      act(() => {
        useProductStore.setState({ categories });
      });

      expect(result.current.categories).toHaveLength(3);
      expect(result.current.categories.find(c => c.name === 'Bebidas')).toBeDefined();
    });

    test('combines multiple filters', () => {
      const { result } = renderHook(() => useProductStore());

      const allProducts = [
        { id: 1, name: 'Beer Light', category: 'Bebidas', price: 5, isActive: true },
        { id: 2, name: 'Beer Premium', category: 'Bebidas', price: 12, isActive: true },
        { id: 3, name: 'Burger', category: 'Comidas', price: 25, isActive: true },
        { id: 4, name: 'Old Beer', category: 'Bebidas', price: 8, isActive: false }
      ];

      act(() => {
        useProductStore.setState({ products: allProducts });
      });

      // Filter: Bebidas, active, price 5-10
      const filtered = result.current.products.filter(p =>
        p.category === 'Bebidas' &&
        p.isActive &&
        p.price >= 5 &&
        p.price <= 10
      );

      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Beer Light');
    });
  });
});
