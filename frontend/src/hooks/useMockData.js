import { useEffect, useState } from 'react';
import { 
  mockProducts, 
  mockCategories, 
  mockFeaturedProducts, 
  mockUsers, 
  mockTables, 
  mockOrders 
} from '../data/mockData';

// Hook para simular carregamento de dados mockados
export const useMockData = (type, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMockData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simula delay de rede
        await new Promise(resolve => setTimeout(resolve, options.delay || 500));

        let result = [];
        
        switch (type) {
          case 'products':
            result = mockProducts;
            if (options.category) {
              result = result.filter(product => product.categoria === options.category);
            }
            if (options.featured) {
              result = mockFeaturedProducts;
            }
            if (options.available) {
              result = result.filter(product => product.disponivel);
            }
            if (options.search) {
              const searchTerm = options.search.toLowerCase();
              result = result.filter(product => 
                product.nome.toLowerCase().includes(searchTerm) ||
                product.descricao.toLowerCase().includes(searchTerm) ||
                product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
              );
            }
            break;

          case 'categories':
            result = mockCategories;
            break;

          case 'users':
            result = mockUsers;
            if (options.role) {
              result = result.filter(user => user.role === options.role);
            }
            if (options.active !== undefined) {
              result = result.filter(user => user.ativo === options.active);
            }
            break;

          case 'tables':
            result = mockTables;
            if (options.status) {
              result = result.filter(table => table.status === options.status);
            }
            if (options.active !== undefined) {
              result = result.filter(table => table.ativo === options.active);
            }
            break;

          case 'orders':
            result = mockOrders;
            if (options.status) {
              result = result.filter(order => order.status === options.status);
            }
            if (options.table) {
              result = result.filter(order => order.mesa === options.table);
            }
            break;

          default:
            throw new Error(`Tipo de dados não suportado: ${type}`);
        }

        // Paginação simulada
        if (options.page && options.limit) {
          const start = (options.page - 1) * options.limit;
          const end = start + options.limit;
          result = {
            data: result.slice(start, end),
            total: result.length,
            page: options.page,
            totalPages: Math.ceil(result.length / options.limit)
          };
        }

        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMockData();
  }, [type, JSON.stringify(options)]);

  return { data, loading, error };
};

// Hook específico para produtos
export const useMockProducts = (options = {}) => {
  return useMockData('products', options);
};

// Hook específico para categorias
export const useMockCategories = (options = {}) => {
  return useMockData('categories', options);
};

// Hook específico para usuários
export const useMockUsers = (options = {}) => {
  return useMockData('users', options);
};

// Hook específico para mesas
export const useMockTables = (options = {}) => {
  return useMockData('tables', options);
};

// Hook específico para pedidos
export const useMockOrders = (options = {}) => {
  return useMockData('orders', options);
};

// Hook para simular operações CRUD
export const useMockCRUD = (type) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const create = async (newItem) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const id = String(Date.now());
    const item = { ...newItem, id, createdAt: new Date().toISOString() };
    
    setData(prev => [...prev, item]);
    setLoading(false);
    return item;
  };

  const update = async (id, updates) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
    ));
    setLoading(false);
  };

  const remove = async (id) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 400));
    
    setData(prev => prev.filter(item => item.id !== id));
    setLoading(false);
  };

  const bulkUpdate = async (ids, updates) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setData(prev => prev.map(item => 
      ids.includes(item.id) ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
    ));
    setLoading(false);
  };

  const bulkDelete = async (ids) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setData(prev => prev.filter(item => !ids.includes(item.id)));
    setLoading(false);
  };

  return {
    data,
    loading,
    create,
    update,
    remove,
    bulkUpdate,
    bulkDelete,
    setData
  };
};

export default useMockData;