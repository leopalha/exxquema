import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  AlertCircle,
  ChevronDown,
  Edit2,
  History,
  TrendingDown,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import useInventoryStore from '../stores/inventoryStore';
import useThemeStore from '../stores/themeStore';

const InventoryTable = ({ onEditClick, onHistoryClick }) => {
  const { products, movements, loading, error, pagination, fetchProductMovements } = useInventoryStore();
  const { getPalette } = useThemeStore();
  const palette = getPalette();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'critical' && product.stock === 0) ||
      (filterStatus === 'warning' && product.stock > 0 && product.stock <= product.minStock) ||
      (filterStatus === 'ok' && product.stock > product.minStock);

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (product) => {
    if (product.stock === 0) return 'critical'; // Vermelho
    if (product.stock <= product.minStock) return 'warning'; // Amarelo
    return 'ok'; // Verde
  };

  const getStatusBadge = (status) => {
    const badges = {
      critical: {
        bg: 'bg-red-500/20',
        text: 'text-red-400',
        label: 'CRÍTICO',
        icon: AlertCircle
      },
      warning: {
        bg: 'bg-yellow-500/20',
        text: 'text-yellow-400',
        label: 'ALERTA',
        icon: AlertTriangle
      },
      ok: {
        bg: 'bg-green-500/20',
        text: 'text-green-400',
        label: 'OK',
        icon: null
      }
    };
    return badges[status];
  };

  const toggleRow = (productId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
      // Buscar movimentos do produto ao expandir
      fetchProductMovements(productId);
    }
    setExpandedRows(newExpanded);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Aqui você pode implementar paginação se necessário
  };

  return (
    <div className="space-y-4">
      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Busca */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gray-600"
            style={{ borderColor: `rgba(var(--theme-primary-rgb, 255, 0, 110), 0.3)` }}
          />
        </div>

        {/* Filtro de Status */}
        <div className="flex gap-2">
          {['all', 'ok', 'warning', 'critical'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                filterStatus === status
                  ? 'bg-opacity-100 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              style={
                filterStatus === status
                  ? { background: `var(--theme-primary)` }
                  : {}
              }
            >
              {status === 'all' ? 'Todos' : status === 'ok' ? '✓ Ok' : status === 'warning' ? '⚠ Alerta' : '🔴 Crítico'}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-800/50 border-b border-gray-700">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Expansão</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Produto</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Categoria</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Estoque</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Mínimo</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Status</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                  Carregando inventário...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-400">
                  Nenhum produto encontrado
                </td>
              </tr>
            ) : (
              filteredProducts.map(product => {
                const status = getStatusColor(product);
                const badge = getStatusBadge(status);
                const isExpanded = expandedRows.has(product.id);

                return (
                  <React.Fragment key={product.id}>
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors"
                    >
                      {/* Botão de expansão */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleRow(product.id)}
                          className="text-gray-400 hover:text-gray-200 transition-colors"
                        >
                          <ChevronDown
                            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </button>
                      </td>

                      {/* Nome do Produto */}
                      <td className="px-4 py-3">
                        <span className="font-medium text-white">{product.name}</span>
                      </td>

                      {/* Categoria */}
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {product.category?.replace('_', ' ')}
                      </td>

                      {/* Estoque */}
                      <td className="px-4 py-3 text-center">
                        <span className="font-bold" style={{ color: `var(--theme-primary)` }}>
                          {product.stock}
                        </span>
                      </td>

                      {/* Mínimo */}
                      <td className="px-4 py-3 text-center text-gray-400">
                        {product.minStock}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 text-center">
                        <motion.span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}
                        >
                          {badge.icon && <badge.icon className="w-3 h-3" />}
                          {badge.label}
                        </motion.span>
                      </td>

                      {/* Ações */}
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => onEditClick(product)}
                            className="p-2 text-gray-400 hover:text-gray-200 transition-colors"
                            title="Editar estoque"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onHistoryClick(product)}
                            className="p-2 text-gray-400 hover:text-gray-200 transition-colors"
                            title="Ver histórico"
                          >
                            <History className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>

                    {/* Linha expandida com movimentos recentes */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="bg-gray-800/30 border-b border-gray-700"
                        >
                          <td colSpan="7" className="px-4 py-4">
                            <div className="space-y-3">
                              <h4 className="font-semibold text-white flex items-center gap-2">
                                <History className="w-4 h-4" />
                                Últimos Movimentos
                              </h4>
                              {movements.length > 0 ? (
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                  {movements.slice(0, 5).map((movement, idx) => (
                                    <div
                                      key={idx}
                                      className="text-xs p-2 bg-black/20 rounded border border-gray-700"
                                    >
                                      <div className="flex justify-between">
                                        <span className="font-medium" style={{ color: `var(--theme-primary)` }}>
                                          {movement.type === 'saida' ? '⬇️' : movement.type === 'entrada' ? '⬆️' : '🔄'}{' '}
                                          {movement.type}
                                        </span>
                                        <span className="text-gray-500">
                                          {new Date(movement.createdAt).toLocaleDateString('pt-BR')}
                                        </span>
                                      </div>
                                      <div className="text-gray-400 mt-1">
                                        {movement.reason} - {Math.abs(movement.quantity)} unidades
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-gray-500">Nenhum movimento registrado</p>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {filteredProducts.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Mostrando {filteredProducts.length} de {products.length} produtos
          </p>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="p-2 text-gray-400 hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-2 text-sm text-gray-400">
              Página {currentPage}
            </span>
            <button
              disabled={currentPage >= pagination.totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="p-2 text-gray-400 hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mensagem de erro */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default InventoryTable;
