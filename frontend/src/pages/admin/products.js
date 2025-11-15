import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Package,
  DollarSign,
  Tag,
  Upload,
  Save,
  X,
  Check,
  AlertTriangle,
  Filter,
  Grid,
  List,
  MoreVertical,
  Copy,
  Archive
} from 'lucide-react';
import Layout from '../../components/Layout';
import LoadingSpinner, { SkeletonCard } from '../../components/LoadingSpinner';
import { useAuthStore } from '../../stores/authStore';
import { useApi, useForm } from '../../hooks';
import { formatCurrency, formatDate } from '../../utils/format';

export default function AdminProducts() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  
  // State
  const [filters, setFilters] = useState({
    search: '',
    categoria: 'all',
    status: 'all'
  });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // API calls
  const { data: productsData, loading: productsLoading, refetch: refetchProducts } = useApi(`/admin/products?search=${filters.search}&categoria=${filters.categoria}&status=${filters.status}`);
  const { data: categoriesData } = useApi('/admin/categories');

  // Form for product creation/editing
  const { values, errors, handleChange, handleSubmit, resetForm, setValues } = useForm({
    initialValues: {
      nome: '',
      descricao: '',
      preco: '',
      categoria: '',
      imagem: '',
      disponivel: true,
      destaque: false,
      estoque: '',
      ingredientes: '',
      alergenos: '',
      tempoPreparo: '',
      calorias: ''
    },
    validate: {
      nome: (value) => !value ? 'Nome é obrigatório' : null,
      descricao: (value) => !value ? 'Descrição é obrigatória' : null,
      preco: (value) => !value || isNaN(value) ? 'Preço deve ser um número válido' : null,
      categoria: (value) => !value ? 'Categoria é obrigatória' : null
    },
    onSubmit: handleProductSubmit
  });

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?returnTo=/admin/products');
      return;
    }

    if (isAuthenticated && user?.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, router]);

  // Populate form when editing
  useEffect(() => {
    if (editingProduct) {
      setValues({
        nome: editingProduct.nome || '',
        descricao: editingProduct.descricao || '',
        preco: editingProduct.preco?.toString() || '',
        categoria: editingProduct.categoria?._id || editingProduct.categoria || '',
        imagem: editingProduct.imagem || '',
        disponivel: editingProduct.disponivel ?? true,
        destaque: editingProduct.destaque || false,
        estoque: editingProduct.estoque?.toString() || '',
        ingredientes: editingProduct.ingredientes || '',
        alergenos: editingProduct.alergenos || '',
        tempoPreparo: editingProduct.tempoPreparo?.toString() || '',
        calorias: editingProduct.calorias?.toString() || ''
      });
    } else {
      resetForm();
    }
  }, [editingProduct, setValues, resetForm]);

  async function handleProductSubmit(formValues) {
    try {
      const productData = {
        ...formValues,
        preco: parseFloat(formValues.preco),
        estoque: formValues.estoque ? parseInt(formValues.estoque) : undefined,
        tempoPreparo: formValues.tempoPreparo ? parseInt(formValues.tempoPreparo) : undefined,
        calorias: formValues.calorias ? parseInt(formValues.calorias) : undefined
      };

      if (editingProduct) {
        // Update product
        await fetch(`/api/admin/products/${editingProduct._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify(productData)
        });
      } else {
        // Create product
        await fetch('/api/admin/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify(productData)
        });
      }

      setShowProductModal(false);
      setEditingProduct(null);
      refetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await fetch(`/api/admin/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        refetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const toggleProductVisibility = async (productId, currentStatus) => {
    try {
      await fetch(`/api/admin/products/${productId}/toggle-visibility`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ disponivel: !currentStatus })
      });
      refetchProducts();
    } catch (error) {
      console.error('Error toggling product visibility:', error);
    }
  };

  const toggleProductHighlight = async (productId, currentStatus) => {
    try {
      await fetch(`/api/admin/products/${productId}/toggle-highlight`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ destaque: !currentStatus })
      });
      refetchProducts();
    } catch (error) {
      console.error('Error toggling product highlight:', error);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedProducts.length === 0) return;

    try {
      await Promise.all(
        selectedProducts.map(productId => {
          switch (action) {
            case 'delete':
              return fetch(`/api/admin/products/${productId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
              });
            case 'hide':
              return fetch(`/api/admin/products/${productId}/toggle-visibility`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ disponivel: false })
              });
            case 'show':
              return fetch(`/api/admin/products/${productId}/toggle-visibility`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ disponivel: true })
              });
            default:
              return Promise.resolve();
          }
        })
      );

      setSelectedProducts([]);
      refetchProducts();
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="large" text="Verificando permissões..." />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Gerenciar Produtos | Red Light Admin</title>
        <meta name="description" content="Gerencie produtos do cardápio Red Light" />
      </Head>

      <Layout>
        <div className="min-h-screen pt-16 bg-black">
          {/* Header */}
          <div className="bg-gray-900 border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => router.push('/admin')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <div>
                    <h1 className="text-3xl font-bold text-white">Gerenciar Produtos</h1>
                    <p className="text-gray-400 mt-1">
                      {productsData?.total || 0} produtos no cardápio
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* View Toggle */}
                  <div className="flex items-center bg-gray-800 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded transition-colors ${
                        viewMode === 'grid' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded transition-colors ${
                        viewMode === 'list' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={openCreateModal}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Novo Produto
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Filters */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={filters.categoria}
                  onChange={(e) => setFilters(prev => ({ ...prev, categoria: e.target.value }))}
                  className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">Todas as Categorias</option>
                  {categoriesData?.categories?.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.nome}
                    </option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">Todos os Status</option>
                  <option value="available">Disponível</option>
                  <option value="unavailable">Indisponível</option>
                  <option value="featured">Em Destaque</option>
                </select>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-orange-600 rounded-lg p-4 mb-6 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="text-white font-medium">
                    {selectedProducts.length} produto(s) selecionado(s)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleBulkAction('show')}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Mostrar
                    </button>
                    <button
                      onClick={() => handleBulkAction('hide')}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Ocultar
                    </button>
                    <button
                      onClick={() => handleBulkAction('delete')}
                      className="bg-orange-800 hover:bg-orange-900 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProducts([])}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {/* Products List/Grid */}
            {productsLoading ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : productsData?.products?.length > 0 ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {productsData.products.map((product) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-gray-900 rounded-xl border border-gray-700 overflow-hidden hover:border-orange-500 transition-colors ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    {/* Product Image */}
                    <div className={`relative ${viewMode === 'list' ? 'w-48 h-32' : 'h-48'}`}>
                      {product.imagem ? (
                        <Image
                          src={product.imagem}
                          alt={product.nome}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <Package className="w-12 h-12 text-gray-600" />
                        </div>
                      )}
                      
                      {/* Status Badges */}
                      <div className="absolute top-2 left-2 flex gap-2">
                        {product.destaque && (
                          <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-medium">
                            <Star className="w-3 h-3 inline mr-1" />
                            Destaque
                          </span>
                        )}
                        {!product.disponivel && (
                          <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Indisponível
                          </span>
                        )}
                      </div>

                      {/* Selection Checkbox */}
                      <div className="absolute top-2 right-2">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProducts(prev => [...prev, product._id]);
                            } else {
                              setSelectedProducts(prev => prev.filter(id => id !== product._id));
                            }
                          }}
                          className="rounded border-gray-600 text-orange-600 focus:ring-orange-500"
                        />
                      </div>

                      {/* Quick Actions */}
                      <div className="absolute bottom-2 right-2 flex gap-1">
                        <button
                          onClick={() => toggleProductVisibility(product._id, product.disponivel)}
                          className={`p-2 rounded-full ${
                            product.disponivel ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
                          } transition-colors`}
                          title={product.disponivel ? 'Ocultar produto' : 'Mostrar produto'}
                        >
                          {product.disponivel ? (
                            <Eye className="w-4 h-4 text-white" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-white" />
                          )}
                        </button>
                        
                        <button
                          onClick={() => toggleProductHighlight(product._id, product.destaque)}
                          className={`p-2 rounded-full ${
                            product.destaque ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-gray-600 hover:bg-gray-700'
                          } transition-colors`}
                          title={product.destaque ? 'Remover destaque' : 'Destacar produto'}
                        >
                          <Star className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Product Content */}
                    <div className="p-6 flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white mb-2">{product.nome}</h3>
                          <p className="text-gray-400 text-sm mb-2 line-clamp-2">{product.descricao}</p>
                          {product.categoria && (
                            <span className="inline-flex items-center gap-1 bg-gray-800 text-gray-300 px-2 py-1 rounded-full text-xs">
                              <Tag className="w-3 h-3" />
                              {product.categoria.nome || product.categoria}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => openEditModal(product)}
                            className="text-gray-400 hover:text-white transition-colors p-2"
                            title="Editar produto"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="text-gray-400 hover:text-orange-400 transition-colors p-2"
                            title="Excluir produto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Preço</span>
                          <span className="text-2xl font-bold text-green-400">
                            {formatCurrency(product.preco)}
                          </span>
                        </div>
                        
                        {product.estoque !== undefined && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Estoque</span>
                            <span className={`font-medium ${
                              product.estoque > 10 ? 'text-green-400' : 
                              product.estoque > 0 ? 'text-yellow-400' : 'text-orange-400'
                            }`}>
                              {product.estoque} unidades
                            </span>
                          </div>
                        )}
                        
                        {product.tempoPreparo && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Preparo</span>
                            <span className="text-white">{product.tempoPreparo} min</span>
                          </div>
                        )}
                      </div>

                      {/* Product Stats */}
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>Criado em {formatDate(product.createdAt)}</div>
                        {product.updatedAt !== product.createdAt && (
                          <div>Atualizado em {formatDate(product.updatedAt)}</div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-900 rounded-xl p-12 text-center border border-gray-700">
                <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-400 mb-6">
                  Não há produtos que correspondam aos filtros selecionados.
                </p>
                <button
                  onClick={openCreateModal}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Primeiro Produto
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Product Modal */}
        <AnimatePresence>
          {showProductModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowProductModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 rounded-xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">
                      {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowProductModal(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Basic Info */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nome do Produto *
                        </label>
                        <input
                          type="text"
                          name="nome"
                          value={values.nome}
                          onChange={handleChange}
                          className={`w-full bg-gray-800 border ${
                            errors.nome ? 'border-orange-500' : 'border-gray-700'
                          } rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500`}
                          placeholder="Ex: Caipirinha Premium"
                        />
                        {errors.nome && (
                          <p className="text-orange-400 text-sm mt-1">{errors.nome}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Descrição *
                        </label>
                        <textarea
                          name="descricao"
                          value={values.descricao}
                          onChange={handleChange}
                          rows={3}
                          className={`w-full bg-gray-800 border ${
                            errors.descricao ? 'border-orange-500' : 'border-gray-700'
                          } rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500`}
                          placeholder="Descreva o produto..."
                        />
                        {errors.descricao && (
                          <p className="text-orange-400 text-sm mt-1">{errors.descricao}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Preço *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            name="preco"
                            value={values.preco}
                            onChange={handleChange}
                            className={`w-full bg-gray-800 border ${
                              errors.preco ? 'border-orange-500' : 'border-gray-700'
                            } rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500`}
                            placeholder="0.00"
                          />
                          {errors.preco && (
                            <p className="text-orange-400 text-sm mt-1">{errors.preco}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Categoria *
                          </label>
                          <select
                            name="categoria"
                            value={values.categoria}
                            onChange={handleChange}
                            className={`w-full bg-gray-800 border ${
                              errors.categoria ? 'border-orange-500' : 'border-gray-700'
                            } rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500`}
                          >
                            <option value="">Selecione...</option>
                            {categoriesData?.categories?.map(category => (
                              <option key={category._id} value={category._id}>
                                {category.nome}
                              </option>
                            ))}
                          </select>
                          {errors.categoria && (
                            <p className="text-orange-400 text-sm mt-1">{errors.categoria}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          URL da Imagem
                        </label>
                        <input
                          type="url"
                          name="imagem"
                          value={values.imagem}
                          onChange={handleChange}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Product Settings */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-300">
                            Produto Disponível
                          </label>
                          <input
                            type="checkbox"
                            name="disponivel"
                            checked={values.disponivel}
                            onChange={handleChange}
                            className="rounded border-gray-600 text-orange-600 focus:ring-orange-500"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-300">
                            Produto em Destaque
                          </label>
                          <input
                            type="checkbox"
                            name="destaque"
                            checked={values.destaque}
                            onChange={handleChange}
                            className="rounded border-gray-600 text-orange-600 focus:ring-orange-500"
                          />
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Estoque
                          </label>
                          <input
                            type="number"
                            name="estoque"
                            value={values.estoque}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Quantidade"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Tempo de Preparo (min)
                          </label>
                          <input
                            type="number"
                            name="tempoPreparo"
                            value={values.tempoPreparo}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Minutos"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Ingredientes
                        </label>
                        <textarea
                          name="ingredientes"
                          value={values.ingredientes}
                          onChange={handleChange}
                          rows={2}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="Liste os ingredientes..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Alergênos
                        </label>
                        <input
                          type="text"
                          name="alergenos"
                          value={values.alergenos}
                          onChange={handleChange}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="Ex: Lactose, Glúten"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Calorias
                        </label>
                        <input
                          type="number"
                          name="calorias"
                          value={values.calorias}
                          onChange={handleChange}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="kcal"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-700">
                    <button
                      type="button"
                      onClick={() => setShowProductModal(false)}
                      className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {editingProduct ? 'Atualizar' : 'Criar'} Produto
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Layout>
    </>
  );
}