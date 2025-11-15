import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Clock,
  User,
  MapPin,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
  Truck,
  Check,
  X,
  MoreVertical,
  Receipt
} from 'lucide-react';
import Layout from '../../components/Layout';
import LoadingSpinner, { SkeletonCard } from '../../components/LoadingSpinner';
import { useAuthStore } from '../../stores/authStore';
import { useApi } from '../../hooks';
import { formatCurrency, formatDate, formatRelativeTime } from '../../utils/format';

export default function AdminOrders() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  
  // State
  const [filters, setFilters] = useState({
    status: 'all',
    date: 'today',
    search: '',
    table: 'all'
  });
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showOrderDetails, setShowOrderDetails] = useState(null);
  const [page, setPage] = useState(1);

  // API calls
  const { data: ordersData, loading: ordersLoading, refetch: refetchOrders } = useApi(`/admin/orders?page=${page}&status=${filters.status}&date=${filters.date}&search=${filters.search}&table=${filters.table}`);
  const { data: tablesData } = useApi('/admin/tables');

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?returnTo=/admin/orders');
      return;
    }

    if (isAuthenticated && user?.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, router]);

  const statusColors = {
    pending: 'bg-yellow-500',
    confirmed: 'bg-blue-500',
    preparing: 'bg-orange-500',
    ready: 'bg-green-500',
    delivered: 'bg-green-600',
    cancelled: 'bg-orange-500'
  };

  const statusLabels = {
    pending: 'Pendente',
    confirmed: 'Confirmado',
    preparing: 'Preparando',
    ready: 'Pronto',
    delivered: 'Entregue',
    cancelled: 'Cancelado'
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      // API call to update status
      await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      refetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    try {
      await Promise.all(
        selectedOrders.map(orderId =>
          fetch(`/api/admin/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ status })
          })
        )
      );
      
      setSelectedOrders([]);
      refetchOrders();
    } catch (error) {
      console.error('Error bulk updating orders:', error);
    }
  };

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const selectAllOrders = () => {
    if (selectedOrders.length === ordersData?.orders?.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(ordersData?.orders?.map(order => order._id) || []);
    }
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
        <title>Gerenciar Pedidos | Red Light Admin</title>
        <meta name="description" content="Gerencie pedidos do Red Light" />
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
                    <h1 className="text-3xl font-bold text-white">Gerenciar Pedidos</h1>
                    <p className="text-gray-400 mt-1">
                      {ordersData?.total || 0} pedidos encontrados
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => refetchOrders()}
                    className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Atualizar
                  </button>
                  
                  <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Exportar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Filters */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar pedidos..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">Todos os Status</option>
                  <option value="pending">Pendente</option>
                  <option value="confirmed">Confirmado</option>
                  <option value="preparing">Preparando</option>
                  <option value="ready">Pronto</option>
                  <option value="delivered">Entregue</option>
                  <option value="cancelled">Cancelado</option>
                </select>

                {/* Date Filter */}
                <select
                  value={filters.date}
                  onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                  className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="today">Hoje</option>
                  <option value="yesterday">Ontem</option>
                  <option value="week">Esta Semana</option>
                  <option value="month">Este Mês</option>
                  <option value="all">Todos</option>
                </select>

                {/* Table Filter */}
                <select
                  value={filters.table}
                  onChange={(e) => setFilters(prev => ({ ...prev, table: e.target.value }))}
                  className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">Todas as Mesas</option>
                  {tablesData?.tables?.map(table => (
                    <option key={table._id} value={table.numero}>
                      Mesa {table.numero}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedOrders.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-orange-600 rounded-lg p-4 mb-6 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="text-white font-medium">
                    {selectedOrders.length} pedido(s) selecionado(s)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleBulkStatusUpdate('confirmed')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => handleBulkStatusUpdate('preparing')}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Preparar
                    </button>
                    <button
                      onClick={() => handleBulkStatusUpdate('ready')}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Pronto
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOrders([])}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {/* Orders List */}
            {ordersLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : ordersData?.orders?.length > 0 ? (
              <div className="space-y-4">
                {/* Table Header */}
                <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-700 flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === ordersData?.orders?.length}
                      onChange={selectAllOrders}
                      className="rounded border-gray-600 text-orange-600 focus:ring-orange-500"
                    />
                    <div className="flex-1 grid grid-cols-7 gap-4 text-sm font-medium text-gray-400">
                      <div>Pedido</div>
                      <div>Cliente</div>
                      <div>Mesa</div>
                      <div>Status</div>
                      <div>Total</div>
                      <div>Data</div>
                      <div>Ações</div>
                    </div>
                  </div>

                  {/* Orders */}
                  <div className="divide-y divide-gray-700">
                    {ordersData.orders.map((order) => (
                      <motion.div
                        key={order._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="px-6 py-4 hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order._id)}
                            onChange={() => toggleOrderSelection(order._id)}
                            className="rounded border-gray-600 text-orange-600 focus:ring-orange-500"
                          />
                          
                          <div className="flex-1 grid grid-cols-7 gap-4 items-center">
                            {/* Order ID */}
                            <div className="text-white font-medium">
                              #{order.numeroSequencial || order._id.slice(-6)}
                            </div>

                            {/* Customer */}
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <div>
                                <div className="text-white font-medium">
                                  {order.usuario?.nome || 'Cliente'}
                                </div>
                                {order.usuario?.telefone && (
                                  <div className="text-gray-400 text-sm flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {order.usuario.telefone}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Table */}
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-white">
                                Mesa {order.mesa || 'N/A'}
                              </span>
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${statusColors[order.status]}`} />
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                className="bg-gray-800 border border-gray-700 text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                              >
                                {Object.entries(statusLabels).map(([value, label]) => (
                                  <option key={value} value={value}>{label}</option>
                                ))}
                              </select>
                            </div>

                            {/* Total */}
                            <div className="text-white font-medium">
                              {formatCurrency(order.total)}
                            </div>

                            {/* Date */}
                            <div className="text-gray-400 text-sm">
                              <div>{formatDate(order.createdAt)}</div>
                              <div className="text-xs">
                                {formatRelativeTime(new Date(order.createdAt))}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setShowOrderDetails(order)}
                                className="text-gray-400 hover:text-white transition-colors p-1"
                                title="Ver detalhes"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              
                              <button
                                onClick={() => {/* Print receipt */}}
                                className="text-gray-400 hover:text-white transition-colors p-1"
                                title="Imprimir recibo"
                              >
                                <Receipt className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Pagination */}
                {ordersData?.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() => setPage(prev => Math.max(1, prev - 1))}
                      disabled={page === 1}
                      className="px-3 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                    >
                      Anterior
                    </button>
                    
                    <span className="text-gray-400">
                      Página {page} de {ordersData.totalPages}
                    </span>
                    
                    <button
                      onClick={() => setPage(prev => Math.min(ordersData.totalPages, prev + 1))}
                      disabled={page === ordersData.totalPages}
                      className="px-3 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                    >
                      Próxima
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-900 rounded-xl p-12 text-center border border-gray-700">
                <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Nenhum pedido encontrado
                </h3>
                <p className="text-gray-400">
                  Não há pedidos que correspondam aos filtros selecionados.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Order Details Modal */}
        <AnimatePresence>
          {showOrderDetails && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowOrderDetails(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 rounded-xl border border-gray-700 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">
                      Pedido #{showOrderDetails.numeroSequencial || showOrderDetails._id.slice(-6)}
                    </h3>
                    <button
                      onClick={() => setShowOrderDetails(null)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Order Info */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Cliente</div>
                        <div className="text-white font-medium">
                          {showOrderDetails.usuario?.nome || 'Cliente'}
                        </div>
                        {showOrderDetails.usuario?.telefone && (
                          <div className="text-gray-400 text-sm">
                            {showOrderDetails.usuario.telefone}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Mesa</div>
                        <div className="text-white font-medium">
                          Mesa {showOrderDetails.mesa || 'N/A'}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Status</div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${statusColors[showOrderDetails.status]}`} />
                          <span className="text-white font-medium">
                            {statusLabels[showOrderDetails.status]}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Data</div>
                        <div className="text-white font-medium">
                          {formatDate(showOrderDetails.createdAt)}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {formatRelativeTime(new Date(showOrderDetails.createdAt))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Itens do Pedido</h4>
                    <div className="space-y-3">
                      {showOrderDetails.itens?.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                          <div className="flex-1">
                            <div className="text-white font-medium">{item.produto?.nome}</div>
                            <div className="text-gray-400 text-sm">Qtd: {item.quantidade}</div>
                            {item.observacoes && (
                              <div className="text-gray-400 text-sm">Obs: {item.observacoes}</div>
                            )}
                          </div>
                          <div className="text-white font-medium">
                            {formatCurrency(item.preco * item.quantidade)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Notes */}
                  {showOrderDetails.observacoes && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-white mb-2">Observações</h4>
                      <div className="bg-gray-800 rounded-lg p-4 text-gray-300">
                        {showOrderDetails.observacoes}
                      </div>
                    </div>
                  )}

                  {/* Order Total */}
                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-semibold text-white">Total</span>
                      <span className="text-2xl font-bold text-green-400">
                        {formatCurrency(showOrderDetails.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Layout>
    </>
  );
}