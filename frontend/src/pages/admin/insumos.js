/**
 * Página de Gestão de Insumos - FLAME Lounge Bar
 * CRUD de insumos, controle de estoque e ficha técnica
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  RefreshCw,
  Plus,
  X,
  Search,
  AlertTriangle,
  Package,
  DollarSign,
  TrendingDown,
  Edit2,
  Trash2,
  History,
  ChevronDown,
  Filter,
  Download
} from 'lucide-react';
import Link from 'next/link';
import useIngredientStore from '../../stores/ingredientStore';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

// Categorias de insumos
const CATEGORIES = [
  { value: 'bebidas_alcoolicas', label: 'Bebidas Alcoólicas' },
  { value: 'bebidas_nao_alcoolicas', label: 'Bebidas Não Alcoólicas' },
  { value: 'carnes', label: 'Carnes' },
  { value: 'frios', label: 'Frios' },
  { value: 'hortifruti', label: 'Hortifruti' },
  { value: 'graos_cereais', label: 'Grãos e Cereais' },
  { value: 'laticinios', label: 'Laticínios' },
  { value: 'condimentos', label: 'Condimentos' },
  { value: 'descartaveis', label: 'Descartáveis' },
  { value: 'limpeza', label: 'Limpeza' },
  { value: 'outros', label: 'Outros' }
];

// Unidades de medida
const UNITS = [
  { value: 'kg', label: 'Quilograma (kg)' },
  { value: 'g', label: 'Grama (g)' },
  { value: 'l', label: 'Litro (L)' },
  { value: 'ml', label: 'Mililitro (mL)' },
  { value: 'un', label: 'Unidade (un)' },
  { value: 'cx', label: 'Caixa (cx)' },
  { value: 'pct', label: 'Pacote (pct)' },
  { value: 'dz', label: 'Dúzia (dz)' }
];

const InsumosPage = () => {
  const { user } = useAuthStore();
  const {
    ingredients,
    lowStock,
    loading,
    error,
    pagination,
    fetchIngredients,
    fetchLowStock,
    createIngredient,
    updateIngredient,
    deactivateIngredient,
    addStock,
    adjustStock,
    registerLoss,
    fetchMovements,
    movements,
    clearError
  } = useIngredientStore();

  // Estados locais
  const [activeTab, setActiveTab] = useState('all'); // all, lowStock
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [stockAction, setStockAction] = useState('add'); // add, adjust, loss
  const [lastUpdate, setLastUpdate] = useState(null);

  // Form state para criar/editar
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'outros',
    unit: 'un',
    currentStock: 0,
    minStock: 0,
    maxStock: '',
    costPerUnit: 0,
    supplier: '',
    supplierCode: '',
    barcode: '',
    notes: ''
  });

  // Form state para estoque
  const [stockData, setStockData] = useState({
    quantity: '',
    unitCost: '',
    description: '',
    invoiceNumber: '',
    reason: 'compra',
    newQuantity: ''
  });

  // Carregar dados iniciais
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      fetchIngredients({ search: searchTerm, category: categoryFilter }),
      fetchLowStock()
    ]);
    setLastUpdate(new Date());
  };

  // Buscar com filtros
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchIngredients({ search: searchTerm, category: categoryFilter });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, categoryFilter]);

  // Handlers
  const handleCreateIngredient = async () => {
    try {
      await createIngredient(formData);
      toast.success('Insumo criado com sucesso!');
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      toast.error(err.message || 'Erro ao criar insumo');
    }
  };

  const handleUpdateIngredient = async () => {
    try {
      await updateIngredient(selectedIngredient.id, formData);
      toast.success('Insumo atualizado!');
      setShowEditModal(false);
      resetForm();
    } catch (err) {
      toast.error(err.message || 'Erro ao atualizar insumo');
    }
  };

  const handleDeactivate = async (ingredient) => {
    if (!confirm(`Desativar o insumo "${ingredient.name}"?`)) return;
    try {
      await deactivateIngredient(ingredient.id);
      toast.success('Insumo desativado');
    } catch (err) {
      toast.error(err.message || 'Erro ao desativar');
    }
  };

  const handleStockAction = async () => {
    try {
      if (stockAction === 'add') {
        await addStock(selectedIngredient.id, {
          quantity: parseFloat(stockData.quantity),
          unitCost: parseFloat(stockData.unitCost) || undefined,
          description: stockData.description,
          invoiceNumber: stockData.invoiceNumber
        });
        toast.success('Estoque adicionado!');
      } else if (stockAction === 'adjust') {
        await adjustStock(selectedIngredient.id, {
          newQuantity: parseFloat(stockData.newQuantity),
          reason: stockData.reason,
          description: stockData.description
        });
        toast.success('Estoque ajustado!');
      } else if (stockAction === 'loss') {
        await registerLoss(selectedIngredient.id, {
          quantity: parseFloat(stockData.quantity),
          reason: stockData.reason,
          description: stockData.description
        });
        toast.success('Perda registrada!');
      }
      setShowStockModal(false);
      resetStockForm();
    } catch (err) {
      toast.error(err.message || 'Erro na operação de estoque');
    }
  };

  const handleOpenEdit = (ingredient) => {
    setSelectedIngredient(ingredient);
    setFormData({
      name: ingredient.name || '',
      description: ingredient.description || '',
      category: ingredient.category || 'outros',
      unit: ingredient.unit || 'un',
      currentStock: ingredient.currentStock || 0,
      minStock: ingredient.minStock || 0,
      maxStock: ingredient.maxStock || '',
      costPerUnit: ingredient.costPerUnit || 0,
      supplier: ingredient.supplier || '',
      supplierCode: ingredient.supplierCode || '',
      barcode: ingredient.barcode || '',
      notes: ingredient.notes || ''
    });
    setShowEditModal(true);
  };

  const handleOpenStock = (ingredient, action) => {
    setSelectedIngredient(ingredient);
    setStockAction(action);
    resetStockForm();
    setShowStockModal(true);
  };

  const handleOpenHistory = async (ingredient) => {
    setSelectedIngredient(ingredient);
    await fetchMovements(ingredient.id);
    setShowHistoryModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'outros',
      unit: 'un',
      currentStock: 0,
      minStock: 0,
      maxStock: '',
      costPerUnit: 0,
      supplier: '',
      supplierCode: '',
      barcode: '',
      notes: ''
    });
    setSelectedIngredient(null);
  };

  const resetStockForm = () => {
    setStockData({
      quantity: '',
      unitCost: '',
      description: '',
      invoiceNumber: '',
      reason: 'compra',
      newQuantity: ''
    });
  };

  // Dados a exibir
  const displayData = activeTab === 'lowStock' ? lowStock : ingredients;

  // Calcular estatísticas
  const stats = {
    total: ingredients.length,
    lowStock: lowStock.length,
    critical: ingredients.filter(i => parseFloat(i.currentStock) === 0).length,
    totalValue: ingredients.reduce((sum, i) =>
      sum + (parseFloat(i.currentStock) * parseFloat(i.costPerUnit || 0)), 0
    )
  };

  // Verificação de permissão
  const canEdit = ['admin', 'gerente'].includes(user?.role);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-900 border-b border-gray-800 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </motion.button>
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Gestão de Insumos</h1>
                <p className="text-sm text-gray-400">
                  {lastUpdate && `Atualizado: ${lastUpdate.toLocaleTimeString('pt-BR')}`}
                </p>
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadData}
                disabled={loading}
                className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </motion.button>
              {canEdit && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { resetForm(); setShowCreateModal(true); }}
                  className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
                  style={{ background: 'var(--theme-primary)' }}
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Novo Insumo</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-6 bg-gray-900 rounded-2xl border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-400">TOTAL</h3>
              <Package className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-gray-500 mt-1">insumos cadastrados</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 sm:p-6 bg-gray-900 rounded-2xl border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-400">CRÍTICOS</h3>
              <AlertTriangle className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
            </div>
            <p className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--theme-primary)' }}>{stats.critical}</p>
            <p className="text-xs text-gray-500 mt-1">sem estoque</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 sm:p-6 bg-gray-900 rounded-2xl border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-400">ALERTAS</h3>
              <TrendingDown className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-400">{stats.lowStock}</p>
            <p className="text-xs text-gray-500 mt-1">estoque baixo</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 sm:p-6 bg-gray-900 rounded-2xl border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-400">VALOR TOTAL</h3>
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-green-400">
              R$ {stats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-500 mt-1">em estoque</p>
          </motion.div>
        </div>

        {/* Tabs e Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Tabs */}
          <div className="flex gap-2 bg-gray-900 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'all'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              style={activeTab === 'all' ? { background: 'var(--theme-primary)' } : {}}
            >
              Todos ({ingredients.length})
            </button>
            <button
              onClick={() => setActiveTab('lowStock')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'lowStock'
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              style={activeTab === 'lowStock' ? { background: 'var(--theme-primary)' } : {}}
            >
              Estoque Baixo ({lowStock.length})
            </button>
          </div>

          {/* Filtros */}
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar insumo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-600"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gray-600"
            >
              <option value="">Todas categorias</option>
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabela de Insumos */}
        <div className="bg-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Nome</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Categoria</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Estoque</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Mínimo</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Custo/Un</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Carregando...
                    </td>
                  </tr>
                ) : displayData.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                      <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      Nenhum insumo encontrado
                    </td>
                  </tr>
                ) : (
                  displayData.map((ingredient) => {
                    const stock = parseFloat(ingredient.currentStock) || 0;
                    const minStock = parseFloat(ingredient.minStock) || 0;
                    const isLow = stock > 0 && stock <= minStock;
                    const isCritical = stock === 0;

                    return (
                      <tr key={ingredient.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-white">{ingredient.name}</p>
                            {ingredient.supplier && (
                              <p className="text-xs text-gray-500">{ingredient.supplier}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-300">
                            {CATEGORIES.find(c => c.value === ingredient.category)?.label || ingredient.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-medium ${
                            isCritical ? 'text-red-400' : isLow ? 'text-yellow-400' : 'text-white'
                          }`}>
                            {stock.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">{ingredient.unit}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-sm text-gray-400">
                            {minStock.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} {ingredient.unit}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-sm text-gray-300">
                            R$ {parseFloat(ingredient.costPerUnit || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {isCritical ? (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-500/20 text-red-400">
                              Sem estoque
                            </span>
                          ) : isLow ? (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-400">
                              Baixo
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400">
                              OK
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleOpenStock(ingredient, 'add')}
                              className="p-1.5 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                              title="Entrada de estoque"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenHistory(ingredient)}
                              className="p-1.5 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors"
                              title="Histórico"
                            >
                              <History className="w-4 h-4" />
                            </button>
                            {canEdit && (
                              <>
                                <button
                                  onClick={() => handleOpenEdit(ingredient)}
                                  className="p-1.5 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                                  title="Editar"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeactivate(ingredient)}
                                  className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                  title="Desativar"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: Criar Insumo */}
      <AnimatePresence>
        {showCreateModal && (
          <IngredientFormModal
            title="Novo Insumo"
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleCreateIngredient}
            onClose={() => { setShowCreateModal(false); resetForm(); }}
            loading={loading}
          />
        )}
      </AnimatePresence>

      {/* Modal: Editar Insumo */}
      <AnimatePresence>
        {showEditModal && (
          <IngredientFormModal
            title="Editar Insumo"
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdateIngredient}
            onClose={() => { setShowEditModal(false); resetForm(); }}
            loading={loading}
            isEdit
          />
        )}
      </AnimatePresence>

      {/* Modal: Operações de Estoque */}
      <AnimatePresence>
        {showStockModal && selectedIngredient && (
          <StockModal
            ingredient={selectedIngredient}
            action={stockAction}
            setAction={setStockAction}
            stockData={stockData}
            setStockData={setStockData}
            onSubmit={handleStockAction}
            onClose={() => { setShowStockModal(false); resetStockForm(); }}
            loading={loading}
          />
        )}
      </AnimatePresence>

      {/* Modal: Histórico */}
      <AnimatePresence>
        {showHistoryModal && selectedIngredient && (
          <HistoryModal
            ingredient={selectedIngredient}
            movements={movements}
            onClose={() => setShowHistoryModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Erro Global */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 z-50 max-w-md"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
              <button onClick={clearError} className="ml-2">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Componente: Modal de Formulário de Insumo
const IngredientFormModal = ({ title, formData, setFormData, onSubmit, onClose, loading, isEdit }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
  >
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nome */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Nome *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
            placeholder="Ex: Carne Bovina Picanha"
          />
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Categoria</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
          >
            {CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        {/* Unidade */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Unidade</label>
          <select
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
          >
            {UNITS.map(unit => (
              <option key={unit.value} value={unit.value}>{unit.label}</option>
            ))}
          </select>
        </div>

        {/* Estoque Atual (só no criar) */}
        {!isEdit && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Estoque Inicial</label>
            <input
              type="number"
              step="0.001"
              min="0"
              value={formData.currentStock}
              onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
            />
          </div>
        )}

        {/* Estoque Mínimo */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Estoque Mínimo</label>
          <input
            type="number"
            step="0.001"
            min="0"
            value={formData.minStock}
            onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
          />
        </div>

        {/* Custo por Unidade */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Custo/Unidade (R$)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.costPerUnit}
            onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
          />
        </div>

        {/* Fornecedor */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Fornecedor</label>
          <input
            type="text"
            value={formData.supplier}
            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
            placeholder="Nome do fornecedor"
          />
        </div>

        {/* Código do Fornecedor */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Cód. Fornecedor</label>
          <input
            type="text"
            value={formData.supplierCode}
            onChange={(e) => setFormData({ ...formData, supplierCode: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
          />
        </div>

        {/* Código de Barras */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Código de Barras</label>
          <input
            type="text"
            value={formData.barcode}
            onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
          />
        </div>

        {/* Descrição */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
            rows="2"
          />
        </div>

        {/* Observações */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Observações</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
            rows="2"
          />
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={onSubmit}
          disabled={loading || !formData.name}
          className="flex-1 px-4 py-2 text-white rounded-lg transition-all hover:scale-105 disabled:opacity-50"
          style={{ background: 'var(--theme-primary)' }}
        >
          {loading ? 'Salvando...' : isEdit ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// Componente: Modal de Estoque
const StockModal = ({ ingredient, action, setAction, stockData, setStockData, onSubmit, onClose, loading }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
  >
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Movimentação de Estoque</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Info do Insumo */}
      <div className="p-3 bg-gray-700/50 rounded-lg mb-4">
        <p className="text-sm text-gray-400">Insumo</p>
        <p className="font-bold text-white">{ingredient.name}</p>
        <p className="text-xs text-gray-500">
          Estoque atual: {parseFloat(ingredient.currentStock).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} {ingredient.unit}
        </p>
      </div>

      {/* Tabs de Ação */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setAction('add')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            action === 'add' ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
          }`}
        >
          Entrada
        </button>
        <button
          onClick={() => setAction('adjust')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            action === 'adjust' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-400'
          }`}
        >
          Ajuste
        </button>
        <button
          onClick={() => setAction('loss')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            action === 'loss' ? 'bg-red-500/20 text-red-400' : 'bg-gray-700 text-gray-400'
          }`}
        >
          Perda
        </button>
      </div>

      {/* Campos específicos por ação */}
      <div className="space-y-4">
        {action === 'add' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Quantidade</label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={stockData.quantity}
                onChange={(e) => setStockData({ ...stockData, quantity: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Custo Unitário (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={stockData.unitCost}
                onChange={(e) => setStockData({ ...stockData, unitCost: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nota Fiscal</label>
              <input
                type="text"
                value={stockData.invoiceNumber}
                onChange={(e) => setStockData({ ...stockData, invoiceNumber: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
              />
            </div>
          </>
        )}

        {action === 'adjust' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nova Quantidade</label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={stockData.newQuantity}
                onChange={(e) => setStockData({ ...stockData, newQuantity: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Motivo</label>
              <select
                value={stockData.reason}
                onChange={(e) => setStockData({ ...stockData, reason: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
              >
                <option value="inventario">Inventário</option>
                <option value="devolucao">Devolução</option>
              </select>
            </div>
          </>
        )}

        {action === 'loss' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Quantidade Perdida</label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={stockData.quantity}
                onChange={(e) => setStockData({ ...stockData, quantity: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Motivo</label>
              <select
                value={stockData.reason}
                onChange={(e) => setStockData({ ...stockData, reason: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
              >
                <option value="vencimento">Vencimento</option>
                <option value="quebra">Quebra/Dano</option>
              </select>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Observação</label>
          <textarea
            value={stockData.description}
            onChange={(e) => setStockData({ ...stockData, description: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
            rows="2"
          />
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={onSubmit}
          disabled={loading}
          className="flex-1 px-4 py-2 text-white rounded-lg transition-all hover:scale-105 disabled:opacity-50"
          style={{ background: action === 'loss' ? '#ef4444' : 'var(--theme-primary)' }}
        >
          {loading ? 'Processando...' : 'Confirmar'}
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// Componente: Modal de Histórico
const HistoryModal = ({ ingredient, movements, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
  >
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col border border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Histórico de Movimentações</h2>
          <p className="text-sm text-gray-400">{ingredient.name}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {movements.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
            Nenhuma movimentação registrada
          </div>
        ) : (
          <div className="space-y-3">
            {movements.map((mov) => (
              <div key={mov.id} className="p-3 bg-gray-700/50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${
                    mov.type === 'entrada' ? 'text-green-400' :
                    mov.type === 'saida' ? 'text-red-400' :
                    mov.type === 'perda' ? 'text-red-400' :
                    'text-blue-400'
                  }`}>
                    {mov.type.toUpperCase()}
                    {mov.reason && ` - ${mov.reason}`}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(mov.createdAt).toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">
                    {mov.type === 'entrada' ? '+' : '-'}{Math.abs(parseFloat(mov.quantity)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} {ingredient.unit}
                  </span>
                  <span className="text-gray-500">
                    {parseFloat(mov.quantityBefore).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} → {parseFloat(mov.quantityAfter).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                {mov.description && (
                  <p className="text-xs text-gray-500 mt-1">{mov.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onClose}
        className="mt-4 w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
      >
        Fechar
      </button>
    </motion.div>
  </motion.div>
);

export default InsumosPage;
