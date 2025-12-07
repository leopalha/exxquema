import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  Plus,
  Edit3,
  Trash2,
  MapPin,
  Users,
  Clock,
  Check,
  X,
  Save,
  AlertTriangle,
  Grid,
  List,
  Eye,
  EyeOff,
  RotateCcw,
  Settings,
  QrCode,
  Download,
  Upload
} from 'lucide-react';
import Layout from '../../components/Layout';
import LoadingSpinner, { SkeletonCard } from '../../components/LoadingSpinner';
import { useAuthStore } from '../../stores/authStore';
import { useApi, useForm } from '../../hooks';
import { formatDate, formatRelativeTime } from '../../utils/format';

export default function AdminTables() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  
  // State
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    capacity: 'all'
  });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showTableModal, setShowTableModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [selectedTables, setSelectedTables] = useState([]);

  // API calls
  const { data: tablesData, loading: tablesLoading, refetch: refetchTables } = useApi(`/admin/tables?search=${filters.search}&status=${filters.status}&capacity=${filters.capacity}`);

  // Form for table creation/editing
  const { values, errors, handleChange, handleSubmit, resetForm, setValues } = useForm({
    initialValues: {
      numero: '',
      capacidade: '',
      descricao: '',
      localizacao: '',
      ativo: true,
      reservavel: true,
      observacoes: ''
    },
    validate: {
      numero: (value) => !value ? 'Número da mesa é obrigatório' : null,
      capacidade: (value) => !value || isNaN(value) || value < 1 ? 'Capacidade deve ser um número válido maior que 0' : null
    },
    onSubmit: handleTableSubmit
  });

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?returnTo=/admin/tables');
      return;
    }

    if (isAuthenticated && user?.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, router]);

  // Populate form when editing
  useEffect(() => {
    if (editingTable) {
      setValues({
        numero: editingTable.numero?.toString() || '',
        capacidade: editingTable.capacidade?.toString() || '',
        descricao: editingTable.descricao || '',
        localizacao: editingTable.localizacao || '',
        ativo: editingTable.ativo ?? true,
        reservavel: editingTable.reservavel ?? true,
        observacoes: editingTable.observacoes || ''
      });
    } else {
      resetForm();
    }
  }, [editingTable, setValues, resetForm]);

  const statusColors = {
    available: 'bg-green-500',
    occupied: 'bg-orange-500', // Keep semantic color for "occupied" status
    reserved: 'bg-yellow-500',
    cleaning: 'bg-blue-500',
    inactive: 'bg-gray-500'
  };

  const statusLabels = {
    available: 'Disponível',
    occupied: 'Ocupada',
    reserved: 'Reservada',
    cleaning: 'Limpeza',
    inactive: 'Inativa'
  };

  async function handleTableSubmit(formValues) {
    try {
      const tableData = {
        ...formValues,
        numero: parseInt(formValues.numero),
        capacidade: parseInt(formValues.capacidade)
      };

      if (editingTable) {
        // Update table
        await fetch(`/api/admin/tables/${editingTable._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify(tableData)
        });
      } else {
        // Create table
        await fetch('/api/admin/tables', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify(tableData)
        });
      }

      setShowTableModal(false);
      setEditingTable(null);
      refetchTables();
    } catch (error) {
      console.error('Error saving table:', error);
    }
  }

  const handleDeleteTable = async (tableId) => {
    if (confirm('Tem certeza que deseja excluir esta mesa?')) {
      try {
        await fetch(`/api/admin/tables/${tableId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        refetchTables();
      } catch (error) {
        console.error('Error deleting table:', error);
      }
    }
  };

  const updateTableStatus = async (tableId, newStatus) => {
    try {
      await fetch(`/api/admin/tables/${tableId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      refetchTables();
    } catch (error) {
      console.error('Error updating table status:', error);
    }
  };

  const toggleTableActive = async (tableId, currentStatus) => {
    try {
      await fetch(`/api/admin/tables/${tableId}/toggle-active`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ ativo: !currentStatus })
      });
      refetchTables();
    } catch (error) {
      console.error('Error toggling table active status:', error);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedTables.length === 0) return;

    try {
      await Promise.all(
        selectedTables.map(tableId => {
          switch (action) {
            case 'delete':
              return fetch(`/api/admin/tables/${tableId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
              });
            case 'activate':
              return fetch(`/api/admin/tables/${tableId}/toggle-active`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ ativo: true })
              });
            case 'deactivate':
              return fetch(`/api/admin/tables/${tableId}/toggle-active`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ ativo: false })
              });
            case 'clean':
              return fetch(`/api/admin/tables/${tableId}/status`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ status: 'cleaning' })
              });
            default:
              return Promise.resolve();
          }
        })
      );

      setSelectedTables([]);
      refetchTables();
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const generateQRCode = async (tableId) => {
    try {
      const response = await fetch(`/api/admin/tables/${tableId}/qr-code`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `qr-code-mesa-${tablesData.tables.find(t => t._id === tableId)?.numero}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const openEditModal = (table) => {
    setEditingTable(table);
    setShowTableModal(true);
  };

  const openCreateModal = () => {
    setEditingTable(null);
    setShowTableModal(true);
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
        <title>Gerenciar Mesas | Red Light Admin</title>
        <meta name="description" content="Gerencie mesas do Red Light" />
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
                    <h1 className="text-3xl font-bold text-white">Gerenciar Mesas</h1>
                    <p className="text-gray-400 mt-1">
                      {tablesData?.total || 0} mesas cadastradas
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* View Toggle */}
                  <div className="flex items-center bg-gray-800 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded transition-colors ${
                        viewMode === 'grid' ? 'text-white' : 'text-gray-400 hover:text-white'
                      }`}
                      style={viewMode === 'grid' ? { background: 'var(--theme-primary)' } : {}}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded transition-colors ${
                        viewMode === 'list' ? 'text-white' : 'text-gray-400 hover:text-white'
                      }`}
                      style={viewMode === 'list' ? { background: 'var(--theme-primary)' } : {}}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={openCreateModal}
                    className="text-white px-4 py-2 rounded-lg transition-all hover:opacity-90 flex items-center gap-2"
                    style={{ background: 'var(--theme-primary)' }}
                  >
                    <Plus className="w-4 h-4" />
                    Nova Mesa
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
                    placeholder="Buscar mesas..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-transparent"
                    style={{ '--tw-ring-color': 'var(--theme-primary)' }}
                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px var(--theme-primary)'}
                    onBlur={(e) => e.target.style.boxShadow = ''}
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none"
                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px var(--theme-primary)'}
                  onBlur={(e) => e.target.style.boxShadow = ''}
                >
                  <option value="all">Todos os Status</option>
                  <option value="available">Disponível</option>
                  <option value="occupied">Ocupada</option>
                  <option value="reserved">Reservada</option>
                  <option value="cleaning">Limpeza</option>
                  <option value="inactive">Inativa</option>
                </select>

                {/* Capacity Filter */}
                <select
                  value={filters.capacity}
                  onChange={(e) => setFilters(prev => ({ ...prev, capacity: e.target.value }))}
                  className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none"
                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px var(--theme-primary)'}
                  onBlur={(e) => e.target.style.boxShadow = ''}
                >
                  <option value="all">Todas as Capacidades</option>
                  <option value="1-2">1-2 pessoas</option>
                  <option value="3-4">3-4 pessoas</option>
                  <option value="5-6">5-6 pessoas</option>
                  <option value="7+">7+ pessoas</option>
                </select>
              </div>
            </div>

            {/* Table Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {Object.entries(statusLabels).map(([status, label]) => {
                const count = tablesData?.statusCount?.[status] || 0;
                return (
                  <div key={status} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${statusColors[status]}`} />
                      <div>
                        <div className="text-white font-semibold text-lg">{count}</div>
                        <div className="text-gray-400 text-sm">{label}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bulk Actions */}
            {selectedTables.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg p-4 mb-6 flex items-center justify-between"
                style={{ background: 'var(--theme-primary)' }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-white font-medium">
                    {selectedTables.length} mesa(s) selecionada(s)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleBulkAction('activate')}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Ativar
                    </button>
                    <button
                      onClick={() => handleBulkAction('deactivate')}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Desativar
                    </button>
                    <button
                      onClick={() => handleBulkAction('clean')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Limpeza
                    </button>
                    <button
                      onClick={() => handleBulkAction('delete')}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTables([])}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {/* Tables List/Grid */}
            {tablesLoading ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : tablesData?.tables?.length > 0 ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
                {tablesData.tables.map((table) => (
                  <motion.div
                    key={table._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-gray-900 rounded-xl border border-gray-700 overflow-hidden transition-colors ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                    style={{ '--hover-border': 'var(--theme-primary)' }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--theme-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = ''}
                  >
                    {/* Table Visual */}
                    <div className={`relative ${viewMode === 'list' ? 'w-32 h-24' : 'h-40'} bg-gray-800 flex items-center justify-center`}>
                      <div className="text-center">
                        <div className={`w-16 h-16 mx-auto rounded-lg flex items-center justify-center ${
                          !table.ativo ? 'bg-gray-600' : statusColors[table.status]
                        } bg-opacity-20 border border-current`}>
                          <span className={`text-2xl font-bold ${
                            !table.ativo ? 'text-gray-400' : 'text-white'
                          }`}>
                            {table.numero}
                          </span>
                        </div>
                        <div className={`mt-2 text-sm ${
                          !table.ativo ? 'text-gray-500' : 'text-gray-300'
                        }`}>
                          Mesa {table.numero}
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-2 left-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          !table.ativo 
                            ? 'bg-gray-600 text-white' 
                            : `bg-${statusColors[table.status].replace('bg-', '')} text-white`
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            !table.ativo ? 'bg-gray-400' : statusColors[table.status]
                          }`} />
                          {!table.ativo ? 'Inativa' : statusLabels[table.status]}
                        </span>
                      </div>

                      {/* Selection Checkbox */}
                      <div className="absolute top-2 right-2">
                        <input
                          type="checkbox"
                          checked={selectedTables.includes(table._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTables(prev => [...prev, table._id]);
                            } else {
                              setSelectedTables(prev => prev.filter(id => id !== table._id));
                            }
                          }}
                          className="rounded border-gray-600"
                          style={{
                            accentColor: 'var(--theme-primary)',
                            '--tw-ring-color': 'var(--theme-primary)'
                          }}
                        />
                      </div>

                      {/* Quick Status Actions */}
                      {table.ativo && table.status !== 'occupied' && (
                        <div className="absolute bottom-2 right-2">
                          <select
                            value={table.status}
                            onChange={(e) => updateTableStatus(table._id, e.target.value)}
                            className="bg-gray-700 border border-gray-600 text-white rounded text-xs px-2 py-1 focus:outline-none"
                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 1px var(--theme-primary)'}
                            onBlur={(e) => e.target.style.boxShadow = ''}
                          >
                            <option value="available">Disponível</option>
                            <option value="reserved">Reservada</option>
                            <option value="cleaning">Limpeza</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Table Content */}
                    <div className="p-4 flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1">
                            Mesa {table.numero}
                          </h3>
                          {table.descricao && (
                            <p className="text-gray-400 text-sm mb-2 line-clamp-1">{table.descricao}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-gray-300">
                              <Users className="w-4 h-4" />
                              <span>{table.capacidade} pessoas</span>
                            </div>
                            {table.localizacao && (
                              <div className="flex items-center gap-1 text-gray-300">
                                <MapPin className="w-4 h-4" />
                                <span>{table.localizacao}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 ml-4">
                          <button
                            onClick={() => generateQRCode(table._id)}
                            className="text-gray-400 hover:text-white transition-colors p-1"
                            title="Gerar QR Code"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => toggleTableActive(table._id, table.ativo)}
                            className="text-gray-400 hover:text-white transition-colors p-1"
                            title={table.ativo ? 'Desativar mesa' : 'Ativar mesa'}
                          >
                            {table.ativo ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            onClick={() => openEditModal(table)}
                            className="text-gray-400 hover:text-white transition-colors p-1"
                            title="Editar mesa"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteTable(table._id)}
                            className="text-gray-400 hover:text-red-400 transition-colors p-1"
                            title="Excluir mesa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Table Details */}
                      <div className="space-y-2">
                        {table.reservavel && (
                          <div className="text-xs text-green-400">✓ Permite reservas</div>
                        )}
                        
                        {table.pedidoAtual && (
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-yellow-400" />
                            <span className="text-gray-300">
                              Pedido #{table.pedidoAtual.numero} - {formatRelativeTime(new Date(table.pedidoAtual.createdAt))}
                            </span>
                          </div>
                        )}

                        {table.observacoes && (
                          <div className="text-xs text-gray-500 line-clamp-2">
                            {table.observacoes}
                          </div>
                        )}

                        <div className="text-xs text-gray-500">
                          Atualizada {formatRelativeTime(new Date(table.updatedAt))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-900 rounded-xl p-12 text-center border border-gray-700">
                <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Nenhuma mesa encontrada
                </h3>
                <p className="text-gray-400 mb-6">
                  Não há mesas que correspondam aos filtros selecionados.
                </p>
                <button
                  onClick={openCreateModal}
                  className="text-white px-6 py-3 rounded-lg transition-all hover:opacity-90 flex items-center gap-2 mx-auto"
                  style={{ background: 'var(--theme-primary)' }}
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Primeira Mesa
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Table Modal */}
        <AnimatePresence>
          {showTableModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowTableModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 rounded-xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">
                      {editingTable ? 'Editar Mesa' : 'Nova Mesa'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowTableModal(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Número da Mesa *
                        </label>
                        <input
                          type="number"
                          name="numero"
                          value={values.numero}
                          onChange={handleChange}
                          className={`w-full bg-gray-800 border ${
                            errors.numero ? 'border-red-500' : 'border-gray-700'
                          } rounded-lg px-4 py-2 text-white focus:outline-none`}
                          onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px var(--theme-primary)'}
                          onBlur={(e) => e.target.style.boxShadow = ''}
                          placeholder="Ex: 1"
                        />
                        {errors.numero && (
                          <p className="text-red-400 text-sm mt-1">{errors.numero}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Capacidade *
                        </label>
                        <input
                          type="number"
                          name="capacidade"
                          value={values.capacidade}
                          onChange={handleChange}
                          className={`w-full bg-gray-800 border ${
                            errors.capacidade ? 'border-red-500' : 'border-gray-700'
                          } rounded-lg px-4 py-2 text-white focus:outline-none`}
                          onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px var(--theme-primary)'}
                          onBlur={(e) => e.target.style.boxShadow = ''}
                          placeholder="Ex: 4"
                        />
                        {errors.capacidade && (
                          <p className="text-red-400 text-sm mt-1">{errors.capacidade}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Descrição
                      </label>
                      <input
                        type="text"
                        name="descricao"
                        value={values.descricao}
                        onChange={handleChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none"
                        onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px var(--theme-primary)'}
                        onBlur={(e) => e.target.style.boxShadow = ''}
                        placeholder="Ex: Mesa próxima à janela"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Localização
                      </label>
                      <input
                        type="text"
                        name="localizacao"
                        value={values.localizacao}
                        onChange={handleChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none"
                        onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px var(--theme-primary)'}
                        onBlur={(e) => e.target.style.boxShadow = ''}
                        placeholder="Ex: Área externa, Salão principal"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Observações
                      </label>
                      <textarea
                        name="observacoes"
                        value={values.observacoes}
                        onChange={handleChange}
                        rows={3}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none"
                        onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px var(--theme-primary)'}
                        onBlur={(e) => e.target.style.boxShadow = ''}
                        placeholder="Observações especiais sobre a mesa..."
                      />
                    </div>

                    {/* Settings */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-300">
                          Mesa Ativa
                        </label>
                        <input
                          type="checkbox"
                          name="ativo"
                          checked={values.ativo}
                          onChange={handleChange}
                          className="rounded border-gray-600"
                          style={{
                            accentColor: 'var(--theme-primary)',
                            '--tw-ring-color': 'var(--theme-primary)'
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-300">
                          Permite Reservas
                        </label>
                        <input
                          type="checkbox"
                          name="reservavel"
                          checked={values.reservavel}
                          onChange={handleChange}
                          className="rounded border-gray-600"
                          style={{
                            accentColor: 'var(--theme-primary)',
                            '--tw-ring-color': 'var(--theme-primary)'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-700">
                    <button
                      type="button"
                      onClick={() => setShowTableModal(false)}
                      className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 text-white rounded-lg transition-all hover:opacity-90 flex items-center gap-2"
                      style={{ background: 'var(--theme-primary)' }}
                    >
                      <Save className="w-4 h-4" />
                      {editingTable ? 'Atualizar' : 'Criar'} Mesa
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