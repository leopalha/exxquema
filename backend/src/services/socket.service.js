const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map(); // userId -> socketId
    this.connectedSockets = new Map(); // socketId -> userId
  }

  // Inicializar Socket.IO server
  init(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    this.setupMiddlewares();
    this.setupEventHandlers();
    
    console.log('✅ Socket.IO server inicializado');
    return this.io;
  }

  // Configurar middlewares do Socket.IO
  setupMiddlewares() {
    // Middleware de autenticação
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
          return next(new Error('Token não fornecido'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.userId);

        if (!user || !user.isActive) {
          return next(new Error('Usuário inválido'));
        }

        socket.userId = user.id;
        socket.user = user;
        next();
      } catch (error) {
        next(new Error('Token inválido'));
      }
    });
  }

  // Configurar event handlers
  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`Usuário conectado: ${socket.user.nome} (${socket.userId})`);
      
      // Registrar conexão
      this.connectedUsers.set(socket.userId, socket.id);
      this.connectedSockets.set(socket.id, socket.userId);

      // Juntar usuário a rooms baseado na role
      this.joinUserToRooms(socket);

      // Event handlers específicos
      this.setupUserEvents(socket);
      this.setupOrderEvents(socket);
      this.setupKitchenEvents(socket);
      this.setupAttendantEvents(socket);

      // Cleanup na desconexão
      socket.on('disconnect', () => {
        console.log(`Usuário desconectado: ${socket.user.nome} (${socket.userId})`);
        this.connectedUsers.delete(socket.userId);
        this.connectedSockets.delete(socket.id);
      });
    });
  }

  // Juntar usuário às rooms apropriadas
  joinUserToRooms(socket) {
    // Todos os usuários autenticados
    socket.join('authenticated');

    // Rooms específicas por role
    if (socket.user.role === 'admin') {
      socket.join('admins');
      socket.join('kitchen');
      socket.join('attendants');
    } else if (socket.user.role === 'cozinha') {
      socket.join('kitchen');
    } else if (socket.user.role === 'atendente') {
      socket.join('attendants');
    }

    // Room do próprio usuário
    socket.join(`user_${socket.userId}`);
  }

  // Eventos gerais do usuário
  setupUserEvents(socket) {
    socket.on('join_table', (tableId) => {
      socket.join(`table_${tableId}`);
      console.log(`Usuário ${socket.user.nome} entrou na mesa ${tableId}`);
    });

    socket.on('leave_table', (tableId) => {
      socket.leave(`table_${tableId}`);
      console.log(`Usuário ${socket.user.nome} saiu da mesa ${tableId}`);
    });

    socket.on('user_typing', (data) => {
      socket.to(`table_${data.tableId}`).emit('user_typing', {
        userId: socket.userId,
        userName: socket.user.nome,
        isTyping: data.isTyping
      });
    });
  }

  // Eventos relacionados a pedidos
  setupOrderEvents(socket) {
    socket.on('track_order', (orderId) => {
      socket.join(`order_${orderId}`);
      console.log(`Usuário ${socket.user.nome} acompanhando pedido ${orderId}`);
    });

    socket.on('stop_tracking_order', (orderId) => {
      socket.leave(`order_${orderId}`);
    });
  }

  // Eventos da cozinha
  setupKitchenEvents(socket) {
    if (!['cozinha', 'admin'].includes(socket.user.role)) return;

    socket.on('start_preparing_order', (orderId) => {
      this.emitToRoom('attendants', 'order_status_changed', {
        orderId,
        status: 'preparing',
        timestamp: new Date(),
        kitchenUser: socket.user.nome
      });
    });

    socket.on('finish_preparing_order', (orderId) => {
      this.emitToRoom('attendants', 'order_ready_notification', {
        orderId,
        timestamp: new Date(),
        kitchenUser: socket.user.nome
      });
    });
  }

  // Eventos do atendente
  setupAttendantEvents(socket) {
    if (!['atendente', 'admin'].includes(socket.user.role)) return;

    socket.on('pickup_order', (orderId) => {
      this.emitToRoom('kitchen', 'order_picked_up', {
        orderId,
        attendant: socket.user.nome,
        timestamp: new Date()
      });
    });

    socket.on('deliver_order', (orderId) => {
      this.emitToRoom('admins', 'order_delivered', {
        orderId,
        attendant: socket.user.nome,
        timestamp: new Date()
      });
    });
  }

  // Notificar novo pedido para cozinha e atendentes
  notifyNewOrder(orderData) {
    this.emitToRoom('kitchen', 'new_order', {
      orderId: orderData.id,
      orderNumber: orderData.orderNumber,
      tableNumber: orderData.table?.number,
      items: orderData.items,
      customerName: orderData.customer?.nome,
      estimatedTime: orderData.estimatedTime,
      timestamp: new Date()
    });

    this.emitToRoom('attendants', 'new_order_notification', {
      orderId: orderData.id,
      orderNumber: orderData.orderNumber,
      tableNumber: orderData.table?.number,
      customerName: orderData.customer?.nome,
      total: orderData.total,
      timestamp: new Date()
    });
  }

  // Notificar mudança de status do pedido
  notifyOrderStatusChange(orderId, status, additionalData = {}) {
    const eventData = {
      orderId,
      status,
      timestamp: new Date(),
      ...additionalData
    };

    // Notificar cliente que está acompanhando o pedido
    this.emitToRoom(`order_${orderId}`, 'order_status_updated', eventData);

    // Notificar funcionários baseado no status
    if (status === 'preparing') {
      this.emitToRoom('attendants', 'order_status_changed', eventData);
    } else if (status === 'ready') {
      this.emitToRoom('attendants', 'order_ready_notification', eventData);
    } else if (status === 'on_way') {
      this.emitToRoom('kitchen', 'order_picked_up', eventData);
    } else if (status === 'delivered') {
      this.emitToRoom('admins', 'order_delivered', eventData);
    }
  }

  // Notificar pedido atrasado
  notifyDelayedOrder(orderData) {
    this.emitToRoom('admins', 'order_delayed', {
      orderId: orderData.id,
      orderNumber: orderData.orderNumber,
      tableNumber: orderData.table?.number,
      delayMinutes: orderData.delayMinutes,
      timestamp: new Date()
    });
  }

  // Enviar notificação para usuário específico
  notifyUser(userId, event, data) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
      return true;
    }
    return false;
  }

  // Enviar notificação para room específica
  emitToRoom(room, event, data) {
    this.io.to(room).emit(event, data);
  }

  // Broadcast para todos os usuários conectados
  broadcast(event, data) {
    this.io.emit(event, data);
  }

  // Obter usuários conectados
  getConnectedUsers() {
    return Array.from(this.connectedUsers.entries()).map(([userId, socketId]) => ({
      userId,
      socketId
    }));
  }

  // Obter contagem de usuários por role
  async getConnectionStats() {
    const sockets = await this.io.fetchSockets();
    
    const stats = {
      total: sockets.length,
      roles: {
        cliente: 0,
        atendente: 0,
        cozinha: 0,
        admin: 0
      }
    };

    sockets.forEach(socket => {
      if (socket.user && socket.user.role) {
        stats.roles[socket.user.role] = (stats.roles[socket.user.role] || 0) + 1;
      }
    });

    return stats;
  }

  // Desconectar usuário específico
  disconnectUser(userId) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      const socket = this.io.sockets.sockets.get(socketId);
      if (socket) {
        socket.disconnect();
        return true;
      }
    }
    return false;
  }

  // Enviar mensagem de manutenção para todos
  sendMaintenanceMessage(message) {
    this.broadcast('maintenance_message', {
      message,
      timestamp: new Date()
    });
  }
}

// Instância singleton
const socketService = new SocketService();

module.exports = socketService;