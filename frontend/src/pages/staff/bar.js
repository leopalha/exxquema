import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import useStaffStore from '../../stores/staffStore';
import useThemeStore from '../../stores/themeStore';
import { formatCurrency } from '../../utils/format';
import { toast } from 'react-hot-toast';
import socketService from '../../services/socket';
import StaffOrderCard from '../../components/StaffOrderCard';
import useNotificationSound from '../../hooks/useNotificationSound';
import {
  Wine,
  Clock,
  CheckCircle,
  Package,
  LogOut,
  AlertTriangle,
  Flame,
  User
} from 'lucide-react';

export default function PainelBar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { stats, orders, alerts, fetchDashboard, updateOrderStatus } = useStaffStore();
  const { getPalette } = useThemeStore();
  const { playNewOrder, playSuccess, playUrgent } = useNotificationSound();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Faça login como bartender');
      router.push('/login?returnTo=/staff/bar');
      return;
    }

    // Carregar dashboard inicial
    const loadDashboard = async () => {
      try {
        await fetchDashboard();
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        toast.error('Erro ao carregar pedidos');
      }
    };

    loadDashboard();

    // Conectar ao Socket.IO
    const token = localStorage.getItem('token');
    socketService.connect(token);
    socketService.joinBarRoom?.();

    // Listener para novos pedidos
    socketService.onOrderCreated((order) => {
      console.log('🆕 Novo pedido recebido:', order);
      toast.success(`Novo pedido #${order.orderNumber || order.id}`);
      playNewOrder();
      // Recarregar dashboard para incluir novo pedido
      fetchDashboard();
    });

    // Listener para atualização de status
    socketService.onOrderUpdated((updatedOrder) => {
      console.log('🔄 Pedido atualizado:', updatedOrder);
      // Recarregar dashboard quando pedido é atualizado
      fetchDashboard();
    });

    // Cleanup
    return () => {
      socketService.leaveBarRoom?.();
      socketService.removeAllListeners('order_created');
      socketService.removeAllListeners('order_updated');
    };
  }, [isAuthenticated, router, fetchDashboard]);

  const handleStatusUpdate = async (orderId) => {
    try {
      toast.success('Status da bebida atualizado');
      playSuccess();
      // Recarregar dashboard após atualizar
      await fetchDashboard();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const handleTimerAlert = (orderId) => {
    console.log('⏰ Alerta de atraso para pedido:', orderId);
    playUrgent();
    toast(
      `⏰ Bebida #${orderId} está atrasada (>15 min)`,
      {
        duration: 6000,
        style: {
          borderRadius: '10px',
          background: '#ff9500',
          color: '#fff',
        },
      }
    );
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  const palette = getPalette();

  return (
    <>
      <Head>
        <title>Painel Bar | FLAME</title>
        <meta name="description" content="Dashboard para bartenders" />
      </Head>

      <div className="min-h-screen bg-black">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Wine className="w-7 h-7" style={{ color: palette.primary }} />
                  FLAME - BAR
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Fila de Bebidas
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Current Time */}
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">
                    {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <Wine className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">Total Bebidas</p>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">Concluídas Hoje</p>
              <p className="text-3xl font-bold text-white">{stats.completedToday}</p>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                  <Flame className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">Em Preparação</p>
              <p className="text-3xl font-bold text-white">{stats.preparing}</p>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-orange-400" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">Atrasadas (&gt;15min)</p>
              <p className="text-3xl font-bold text-white">{stats.delayed}</p>
            </div>
          </div>

          {/* Delayed Alert */}
          {alerts.delayed && alerts.delayed.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-orange-900/20 border-2 border-orange-500 rounded-xl p-6 mb-6 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-orange-400 mb-1">
                  ⚠️ ATENÇÃO: {alerts.delayed.length} bebida(s) atrasada(s)
                </h3>
                <p className="text-gray-300">
                  {alerts.delayed.map(o => `Mesa #${o.table?.number || '?'}`).join(', ')} aguardando há mais de 15 minutos
                </p>
              </div>
            </motion.div>
          )}

          {/* Queue */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Wine className="w-6 h-6" style={{ color: palette.primary }} />
                Fila de Bebidas
              </h2>
              <span className="text-gray-400">
                {(orders.pending?.length || 0) + (orders.preparing?.length || 0)} {
                  ((orders.pending?.length || 0) + (orders.preparing?.length || 0)) === 1 ? 'bebida' : 'bebidas'
                }
              </span>
            </div>

            {(!orders.pending || orders.pending.length === 0) && (!orders.preparing || orders.preparing.length === 0) ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-gray-600" />
                </div>
                <p className="text-gray-400">Nenhuma bebida na fila</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Preparing Orders First */}
                <AnimatePresence>
                  {orders.preparing && orders.preparing.length > 0 && (
                    <>
                      <div className="mb-4 px-2">
                        <p className="text-sm font-semibold text-yellow-400">EM PREPARO ({orders.preparing.length})</p>
                      </div>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {orders.preparing.map((order) => (
                          <StaffOrderCard
                            key={order.id}
                            order={order}
                            onStatusUpdate={handleStatusUpdate}
                            onTimerAlert={handleTimerAlert}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {orders.pending && orders.pending.length > 0 && (
                    <>
                      <div className="mb-4 px-2">
                        <p className="text-sm font-semibold text-green-400">AGUARDANDO ({orders.pending.length})</p>
                      </div>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {orders.pending.map((order) => (
                          <StaffOrderCard
                            key={order.id}
                            order={order}
                            onStatusUpdate={handleStatusUpdate}
                            onTimerAlert={handleTimerAlert}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
