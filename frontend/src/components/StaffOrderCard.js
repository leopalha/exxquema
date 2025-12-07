import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Users, MapPin, FileText, Zap } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import useThemeStore from '../stores/themeStore';
import useStaffStore from '../stores/staffStore';

const StaffOrderCard = ({ order, onStatusUpdate, onTimerAlert, userRole = 'staff' }) => {
  const { getPalette } = useThemeStore();
  const { updateOrderStatus } = useStaffStore();
  const [expanded, setExpanded] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const palette = getPalette();

  // Obter cor baseada no status
  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9500', // Laranja
      confirmed: '#3b82f6', // Azul
      preparing: '#f59e0b', // Âmbar
      ready: '#10b981', // Verde
      on_way: '#8b5cf6', // Roxo
      delivered: '#6b7280', // Cinza
      cancelled: '#ef4444' // Vermelho
    };
    return colors[status] || palette.primary;
  };

  // Obter label do status
  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      preparing: 'Preparando',
      ready: 'Pronto',
      on_way: 'Em Entrega',
      delivered: 'Entregue',
      cancelled: 'Cancelado'
    };
    return labels[status] || status;
  };

  // Configuração de botões por role
  const getRoleActionConfig = () => {
    const status = order.status;

    // Bar e Cozinha: podem Preparar (pending→preparing) e marcar Pronto (preparing→ready)
    if (userRole === 'bar' || userRole === 'cozinha') {
      if (status === 'pending' || status === 'confirmed') {
        return { nextStatus: 'preparing', label: 'Preparar', enabled: true, color: '#f59e0b' };
      }
      if (status === 'preparing') {
        return { nextStatus: 'ready', label: 'Pronto', enabled: true, color: '#10b981' };
      }
      return { enabled: false };
    }

    // Atendente: botão bloqueado até estar pronto, depois Retirar e Entregar
    if (userRole === 'atendente') {
      if (status === 'pending' || status === 'confirmed' || status === 'preparing') {
        return { enabled: false, label: 'Aguardando preparo...', color: '#6b7280' };
      }
      if (status === 'ready') {
        return { nextStatus: 'on_way', label: 'Retirar', enabled: true, color: '#3b82f6' };
      }
      if (status === 'on_way') {
        return { nextStatus: 'delivered', label: 'Entregar', enabled: true, color: '#10b981' };
      }
      return { enabled: false };
    }

    // Admin/Gerente: podem fazer todas as transições
    if (userRole === 'admin' || userRole === 'gerente') {
      const statusFlow = {
        pending: { nextStatus: 'preparing', label: 'Preparar' },
        confirmed: { nextStatus: 'preparing', label: 'Preparar' },
        preparing: { nextStatus: 'ready', label: 'Pronto' },
        ready: { nextStatus: 'on_way', label: 'Retirar' },
        on_way: { nextStatus: 'delivered', label: 'Entregar' }
      };
      const config = statusFlow[status];
      if (config) {
        return { ...config, enabled: true, color: getStatusColor(config.nextStatus) };
      }
      return { enabled: false };
    }

    // Default: fluxo completo
    const defaultFlow = {
      pending: 'confirmed',
      confirmed: 'preparing',
      preparing: 'ready',
      ready: 'on_way',
      on_way: 'delivered'
    };
    const nextStatus = defaultFlow[status];
    if (nextStatus) {
      return { nextStatus, label: getStatusLabel(nextStatus), enabled: true, color: getStatusColor(nextStatus) };
    }
    return { enabled: false };
  };

  // Passar para próximo status
  const handleNextStatus = async () => {
    const config = getRoleActionConfig();
    if (!config.enabled || !config.nextStatus) return;

    setUpdatingStatus(true);
    try {
      await updateOrderStatus(order.id, config.nextStatus);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const statusColor = getStatusColor(order.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border-2 transition-all hover:shadow-lg"
      style={{ borderColor: statusColor }}
    >
      {/* Header */}
      <div
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        style={{ backgroundColor: `${statusColor}15` }}
      >
        <div className="flex items-start justify-between mb-3">
          {/* Número do Pedido */}
          <div>
            <div className="text-xs font-semibold uppercase text-gray-500">Pedido #</div>
            <div className="text-2xl font-bold text-white">{order.orderNumber}</div>
          </div>

          {/* Status Badge */}
          <motion.div
            className="px-3 py-1 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: statusColor }}
          >
            {getStatusLabel(order.status)}
          </motion.div>

          {/* Ícone Expandir */}
          <button className="text-gray-400 hover:text-white transition-colors">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {/* Timer se em preparo */}
        {(order.status === 'preparing' || order.status === 'pending' || order.status === 'confirmed') && (
          <div className="mb-3">
            <CountdownTimer
              orderId={order.id}
              startedAt={order.startedAt || order.createdAt}
              thresholdMinutes={15}
              onThresholdReached={onTimerAlert}
            />
          </div>
        )}

        {/* Informações Rápidas */}
        <div className="flex items-center gap-4 text-sm text-gray-300">
          {order.table && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" style={{ color: palette.secondary }} />
              <span>Mesa {order.table.number}</span>
            </div>
          )}
          {order.customer && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" style={{ color: palette.secondary }} />
              <span>{order.customer.nome}</span>
            </div>
          )}
          {order.items && (
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" style={{ color: palette.secondary }} />
              <span>{order.items.length} itens</span>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo Expandido */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-gray-700 p-4 space-y-4"
        >
          {/* Itens do Pedido */}
          {order.items && order.items.length > 0 && (
            <div>
              <h4 className="font-semibold text-white mb-2">Itens</h4>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start p-2 bg-black/30 rounded">
                    <div>
                      <p className="text-sm font-medium text-white">{item.productName}</p>
                      <p className="text-xs text-gray-400">{item.productCategory}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-300">x{item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notas */}
          {order.notes && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4" style={{ color: palette.primary }} />
                <h4 className="font-semibold text-white">Observações</h4>
              </div>
              <p className="text-sm text-gray-300 italic">{order.notes}</p>
            </div>
          )}

          {/* Total */}
          <div className="pt-2 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total</span>
              <span className="text-lg font-bold" style={{ color: palette.primary }}>
                R$ {parseFloat(order.total).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Botão de Ação baseado no Role */}
          {order.status !== 'delivered' && order.status !== 'cancelled' && (() => {
            const config = getRoleActionConfig();
            return (
              <button
                onClick={handleNextStatus}
                disabled={updatingStatus || !config.enabled}
                className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition-all disabled:opacity-50 ${config.enabled ? 'hover:scale-105 cursor-pointer' : 'cursor-not-allowed'}`}
                style={{ backgroundColor: config.color || statusColor }}
              >
                {updatingStatus ? 'Atualizando...' : config.label || 'Aguardando...'}
              </button>
            );
          })()}
        </motion.div>
      )}
    </motion.div>
  );
};

export default StaffOrderCard;
