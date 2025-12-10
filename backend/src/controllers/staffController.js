const { Order, OrderItem, Product, Table, User, sequelize } = require('../models');
const { Op } = require('sequelize');
const smsService = require('../services/sms.service');
const pushService = require('../services/push.service');
const socketService = require('../services/socket.service');

class StaffController {
  /**
   * GET /api/staff/dashboard
   * Dashboard com resumo baseado no role do usuário
   */
  static async getDashboard(req, res) {
    try {
      const { role } = req.user;

      // Filtrar pedidos por categoria baseado no role
      const filterOrdersByCategory = (orders) => {
        if (role === 'bar' || role === 'barman') {
          // Bar: apenas pedidos com bebidas ou narguilé
          return orders.filter(order => {
            return order.items && order.items.some(item => {
              const category = item.productCategory?.toLowerCase() || '';
              return category.includes('bebida') || category.includes('drink') ||
                     category.includes('nargui') || category.includes('hookah');
            });
          });
        } else if (role === 'cozinha') {
          // Cozinha: apenas pedidos com comida (NÃO bebidas/narguilé)
          return orders.filter(order => {
            return order.items && order.items.some(item => {
              const category = item.productCategory?.toLowerCase() || '';
              return !category.includes('bebida') && !category.includes('drink') &&
                     !category.includes('nargui') && !category.includes('hookah');
            });
          });
        }
        // Admin e atendente veem TODOS os pedidos
        return orders;
      };

      // Buscar pedidos pendentes e em preparação
      // Inclui pending_payment para que atendentes vejam pedidos aguardando pagamento
      let pendingOrders = await Order.findAll({
        where: {
          status: { [Op.in]: ['pending', 'pending_payment', 'confirmed'] }
        },
        include: [
          {
            model: OrderItem,
            as: 'items'
          },
          {
            model: Table,
            as: 'table',
            attributes: ['number', 'name']
          }
        ],
        order: [['createdAt', 'ASC']],
        limit: 50
      });

      let preparingOrders = await Order.findAll({
        where: { status: 'preparing' },
        include: [
          {
            model: OrderItem,
            as: 'items'
          },
          {
            model: Table,
            as: 'table',
            attributes: ['number', 'name']
          }
        ],
        order: [['createdAt', 'ASC']],
        limit: 50
      });

      // Pedidos prontos - apenas atendente e admin veem
      // Bar e cozinha NÃO devem ver pedidos prontos (já terminaram o trabalho)
      let readyOrders = [];
      let onWayOrders = [];
      if (role === 'atendente' || role === 'admin' || role === 'gerente') {
        readyOrders = await Order.findAll({
          where: { status: 'ready' },
          include: [
            {
              model: OrderItem,
              as: 'items'
            },
            {
              model: Table,
              as: 'table',
              attributes: ['number', 'name']
            },
            {
              model: User,
              as: 'customer',
              attributes: ['nome', 'celular']
            }
          ],
          order: [['createdAt', 'ASC']],
          limit: 50
        });

        // Pedidos em rota de entrega
        onWayOrders = await Order.findAll({
          where: { status: 'on_way' },
          include: [
            {
              model: OrderItem,
              as: 'items'
            },
            {
              model: Table,
              as: 'table',
              attributes: ['number', 'name']
            },
            {
              model: User,
              as: 'customer',
              attributes: ['nome', 'celular']
            }
          ],
          order: [['createdAt', 'ASC']],
          limit: 50
        });
      }

      // Aplicar filtro de categoria
      pendingOrders = filterOrdersByCategory(pendingOrders);
      preparingOrders = filterOrdersByCategory(preparingOrders);
      // ready e on_way orders não precisam de filtro - atendente vê todos

      // Calcular estatísticas
      const totalOrders = await Order.count();
      const completedToday = await Order.count({
        where: {
          status: 'delivered',
          createdAt: {
            [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      });

      // Calcular pedidos atrasados (>15 min)
      const delayedOrders = pendingOrders.filter(order => {
        const createdTime = new Date(order.createdAt);
        const now = new Date();
        const diffMinutes = (now - createdTime) / (1000 * 60);
        return diffMinutes > 15;
      });

      res.json({
        success: true,
        data: {
          userRole: role,
          stats: {
            total: totalOrders,
            completedToday,
            delayed: delayedOrders.length,
            pending: pendingOrders.length,
            preparing: preparingOrders.length,
            ready: readyOrders.length,
            on_way: onWayOrders.length
          },
          orders: {
            pending: pendingOrders,
            preparing: preparingOrders,
            ready: readyOrders,
            on_way: onWayOrders
          }
        }
      });
    } catch (error) {
      console.error('Erro ao buscar dashboard:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/staff/orders
   * Buscar pedidos com filtros
   */
  static async getOrders(req, res) {
    try {
      const { status = 'pending,preparing', limit = 50, offset = 0 } = req.query;

      const statuses = status.split(',').map(s => s.trim());

      const { rows, count } = await Order.findAndCountAll({
        where: {
          status: { [Op.in]: statuses }
        },
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product',
                attributes: ['name', 'category']
              }
            ]
          },
          {
            model: Table,
            as: 'table',
            attributes: ['number', 'name']
          }
        ],
        order: [['createdAt', 'ASC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        success: true,
        data: {
          orders: rows,
          pagination: {
            total: count,
            limit: parseInt(limit),
            offset: parseInt(offset),
            pages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/staff/orders/:id/details
   * Detalhes completos de um pedido
   */
  static async getOrderDetails(req, res) {
    try {
      const { id } = req.params;

      const order = await Order.findByPk(id, {
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product'
              }
            ]
          },
          {
            model: Table,
            as: 'table'
          },
          {
            model: User,
            as: 'customer',
            attributes: ['nome', 'celular']
          }
        ]
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Pedido não encontrado'
        });
      }

      res.json({
        success: true,
        data: { order }
      });
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * PUT /api/staff/orders/:id/status
   * Atualizar status do pedido
   */
  static async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      // Validar status permitido
      const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'on_way', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Status inválido'
        });
      }

      const order = await Order.findByPk(id, {
        include: [
          { model: Table, as: 'table' },
          { model: User, as: 'customer', attributes: ['id', 'nome', 'email'] }
        ]
      });
      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Pedido não encontrado'
        });
      }

      const previousStatus = order.status;

      // Atualizar status
      await order.update({
        status,
        notes: notes || order.notes
      });

      // IMPORTANTE: Emitir evento Socket.IO para notificar todos (cliente, staff, admins)
      socketService.notifyOrderStatusChange(id, status, {
        previousStatus,
        orderNumber: order.orderNumber,
        tableNumber: order.table?.number,
        customerName: order.customer?.nome,
        userId: order.userId,
        updatedBy: req.user?.nome || 'Sistema',
        timestamp: new Date()
      });

      console.log(`📡 [STAFF] Status do pedido #${order.orderNumber} alterado: ${previousStatus} → ${status}`);

      res.json({
        success: true,
        message: 'Status atualizado com sucesso',
        data: { order }
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/staff/alerts
   * Alertas: estoque baixo, pedidos atrasados
   */
  static async getAlerts(req, res) {
    try {
      // Pedidos atrasados (>15 min sem alteração)
      const delayedOrders = await Order.findAll({
        where: {
          status: { [Op.in]: ['pending', 'confirmed', 'preparing'] },
          createdAt: {
            [Op.lte]: new Date(Date.now() - 15 * 60 * 1000)
          }
        },
        include: [
          {
            model: Table,
            as: 'table',
            attributes: ['number', 'name']
          }
        ],
        limit: 20
      });

      // Produtos com estoque baixo
      const lowStockProducts = await Product.findAll({
        where: {
          hasStock: true,
          stock: {
            [Op.lte]: sequelize.col('minStock')
          }
        },
        limit: 20
      });

      res.json({
        success: true,
        data: {
          alerts: {
            delayed: delayedOrders.length,
            lowStock: lowStockProducts.length
          },
          delayedOrders,
          lowStockProducts
        }
      });
    } catch (error) {
      console.error('Erro ao buscar alertas:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * POST /api/staff/start-timer
   * Iniciar timer para um pedido (apenas para logging, timer é no frontend)
   */
  static async startTimer(req, res) {
    try {
      const { orderId } = req.body;

      const order = await Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Pedido não encontrado'
        });
      }

      // Registrar quando começou o preparo (se não estiver já)
      if (order.status === 'pending' || order.status === 'confirmed') {
        await order.update({
          status: 'preparing',
          startedAt: new Date()
        });
      }

      res.json({
        success: true,
        message: 'Timer iniciado',
        data: {
          order,
          startedAt: order.startedAt || new Date()
        }
      });
    } catch (error) {
      console.error('Erro ao iniciar timer:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * POST /api/staff/call-customer
   * Chamar cliente via SMS/Push
   */
  static async callCustomer(req, res) {
    try {
      const { orderId, tableNumber } = req.body;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          error: 'orderId é obrigatório'
        });
      }

      // Buscar pedido com cliente
      const order = await Order.findByPk(orderId, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'nome', 'celular']
          },
          {
            model: Table,
            as: 'table',
            attributes: ['number', 'name']
          }
        ]
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Pedido não encontrado'
        });
      }

      const mesa = tableNumber || order.table?.number || 'sua mesa';
      const results = {
        sms: false,
        push: false
      };

      // Enviar SMS se tiver celular
      if (order.user?.celular) {
        const smsResult = await smsService.sendCallCustomer(
          order.user.celular,
          mesa
        );
        results.sms = smsResult.success;
      }

      // Enviar Push notification
      if (order.user?.id) {
        try {
          await pushService.sendToUser(order.user.id, {
            title: 'FLAME - Solicitação de Presença',
            body: `Por favor, dirija-se à mesa ${mesa}. Nosso atendente está aguardando.`,
            icon: '/icons/icon-192x192.png',
            tag: 'call-customer',
            data: {
              type: 'call_customer',
              orderId: order.id,
              tableNumber: mesa
            }
          });
          results.push = true;
        } catch (pushError) {
          console.error('Erro ao enviar push:', pushError);
        }
      }

      res.json({
        success: true,
        message: 'Cliente notificado',
        data: {
          orderId: order.id,
          tableNumber: mesa,
          notifications: results
        }
      });
    } catch (error) {
      console.error('Erro ao chamar cliente:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * POST /api/staff/call-waiter
   * Cliente chama garçom - notifica atendentes via Socket.IO
   */
  static async callWaiter(req, res) {
    try {
      const { orderId, tableId, tableNumber, reason } = req.body;
      const userId = req.user?.id;
      const userName = req.user?.nome || 'Cliente';

      console.log(`🔔 [CALL WAITER] Cliente ${userName} chamou garçom`);

      // Buscar dados do pedido/mesa se fornecidos
      let orderInfo = null;
      let tableInfo = tableNumber;

      if (orderId) {
        const order = await Order.findByPk(orderId, {
          include: [{ model: Table, as: 'table' }]
        });
        if (order) {
          orderInfo = {
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status
          };
          tableInfo = order.table?.number || tableNumber;
        }
      }

      if (tableId && !tableInfo) {
        const table = await Table.findByPk(tableId);
        if (table) {
          tableInfo = table.number;
        }
      }

      // Notificar atendentes via Socket.IO
      const io = req.app.get('io');
      if (io) {
        io.to('attendants').emit('waiter_called', {
          userId,
          userName,
          tableNumber: tableInfo || 'Não identificada',
          orderId: orderInfo?.id,
          orderNumber: orderInfo?.orderNumber,
          reason: reason || 'Solicitação de atendimento',
          timestamp: new Date().toISOString()
        });

        // Também notificar admin
        io.to('admins').emit('waiter_called', {
          userId,
          userName,
          tableNumber: tableInfo || 'Não identificada',
          orderId: orderInfo?.id,
          orderNumber: orderInfo?.orderNumber,
          reason: reason || 'Solicitação de atendimento',
          timestamp: new Date().toISOString()
        });

        console.log(`✅ [CALL WAITER] Notificação enviada - Mesa ${tableInfo}`);
      }

      res.json({
        success: true,
        message: 'Garçom chamado! Um atendente irá até você.',
        data: {
          tableNumber: tableInfo,
          orderId: orderInfo?.id,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('❌ Erro ao chamar garçom:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * POST /api/staff/request-instagram-validation
   * Atendente solicita validação de Instagram ao cliente
   */
  static async requestInstagramValidation(req, res) {
    try {
      const { orderId } = req.body;
      const staffId = req.user?.id;
      const staffName = req.user?.nome || 'Atendente';

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: 'orderId é obrigatório'
        });
      }

      // Buscar pedido
      const order = await Order.findByPk(orderId, {
        include: [{ model: User, as: 'user' }]
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Pedido não encontrado'
        });
      }

      if (!order.wantsInstagramCashback) {
        return res.status(400).json({
          success: false,
          message: 'Este pedido não participou do programa Instagram Cashback'
        });
      }

      console.log(`📸 [INSTAGRAM] Atendente ${staffName} solicitou validação para pedido ${order.orderNumber}`);

      // Notificar cliente via Socket.IO
      const io = req.app.get('io');
      if (io && order.userId) {
        io.to(`user_${order.userId}`).emit('instagram_validation_requested', {
          orderId: order.id,
          orderNumber: order.orderNumber,
          staffName,
          message: 'O atendente está aguardando sua postagem no Instagram para validar o cashback de 5%!',
          timestamp: new Date().toISOString()
        });

        console.log(`✅ [INSTAGRAM] Notificação enviada para cliente ${order.userId}`);
      }

      // Enviar push notification
      if (order.user?.id) {
        try {
          await pushService.sendToUser(order.user.id, {
            title: '📸 Valide seu Cashback Instagram!',
            body: 'Poste uma foto marcando @flamelounge_ para ganhar 5% de cashback extra!',
            icon: '/icons/icon-192x192.png',
            tag: 'instagram-validation',
            data: {
              type: 'instagram_validation',
              orderId: order.id,
              orderNumber: order.orderNumber
            }
          });
        } catch (pushError) {
          console.error('Erro ao enviar push:', pushError);
        }
      }

      res.json({
        success: true,
        message: 'Solicitação de validação enviada ao cliente!',
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          clientNotified: true
        }
      });
    } catch (error) {
      console.error('❌ Erro ao solicitar validação Instagram:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = StaffController;
