import { io } from 'socket.io-client';

// Configuração da conexão Socket.IO
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  // Conectar ao servidor Socket.IO
  connect(token) {
    if (this.socket?.connected) {
      console.log('Socket.IO já conectado');
      return this.socket;
    }

    console.log('Conectando ao Socket.IO:', SOCKET_URL);

    this.socket = io(SOCKET_URL, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    // Event handlers
    this.socket.on('connect', () => {
      console.log('✅ Socket.IO conectado:', this.socket.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket.IO desconectado:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Erro de conexão Socket.IO:', error.message);
    });

    this.socket.on('error', (error) => {
      console.error('Erro Socket.IO:', error);
    });

    return this.socket;
  }

  // Desconectar
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
      console.log('Socket.IO desconectado');
    }
  }

  // Entrar em uma sala (room)
  joinRoom(room) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_room', room);
      console.log(`Entrou na sala: ${room}`);
    }
  }

  // Sair de uma sala
  leaveRoom(room) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_room', room);
      console.log(`Saiu da sala: ${room}`);
    }
  }

  // Emitir evento
  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
      console.log(`Emitido evento: ${event}`, data);
    } else {
      console.warn('Socket.IO não conectado. Evento não enviado:', event);
    }
  }

  // Adicionar listener para evento
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);

      // Guardar referência para possível remoção
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(callback);

      console.log(`Listener adicionado para: ${event}`);
    }
  }

  // Remover listener específico
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);

      // Remover da lista de listeners
      if (this.listeners.has(event)) {
        const callbacks = this.listeners.get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }

      console.log(`Listener removido de: ${event}`);
    }
  }

  // Remover todos os listeners de um evento
  removeAllListeners(event) {
    if (this.socket) {
      this.socket.removeAllListeners(event);
      this.listeners.delete(event);
      console.log(`Todos os listeners removidos de: ${event}`);
    }
  }

  // =======================
  // EVENTOS ESPECÍFICOS
  // =======================

  // PEDIDOS
  onOrderCreated(callback) {
    this.on('order_created', callback);
  }

  onOrderUpdated(callback) {
    this.on('order_updated', callback);
  }

  onOrderStatusChanged(callback) {
    this.on('order_status_changed', callback);
  }

  onOrderReady(callback) {
    this.on('order_ready', callback);
  }

  onOrderDelivered(callback) {
    this.on('order_delivered', callback);
  }

  // Atualizar status do pedido
  updateOrderStatus(orderId, status) {
    this.emit('update_order_status', { orderId, status });
  }

  // Marcar item como pronto
  markItemReady(orderId, itemId) {
    this.emit('mark_item_ready', { orderId, itemId });
  }

  // Marcar pedido como entregue
  markOrderDelivered(orderId) {
    this.emit('mark_order_delivered', { orderId });
  }

  // NOTIFICAÇÕES
  onNotification(callback) {
    this.on('notification', callback);
  }

  // Enviar notificação
  sendNotification(notification) {
    this.emit('send_notification', notification);
  }

  // SALAS ESPECÍFICAS
  joinOrderRoom(orderId) {
    this.joinRoom(`order_${orderId}`);
  }

  leaveOrderRoom(orderId) {
    this.leaveRoom(`order_${orderId}`);
  }

  joinKitchenRoom() {
    this.joinRoom('kitchen');
  }

  leaveKitchenRoom() {
    this.leaveRoom('kitchen');
  }

  joinWaiterRoom() {
    this.joinRoom('waiter');
  }

  leaveWaiterRoom() {
    this.leaveRoom('waiter');
  }

  joinAdminRoom() {
    this.joinRoom('admin');
  }

  leaveAdminRoom() {
    this.leaveRoom('admin');
  }

  // Verificar se está conectado
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      socketId: this.socket?.id || null
    };
  }
}

// Singleton instance
const socketService = new SocketService();

export default socketService;
