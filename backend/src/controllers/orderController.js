const { Order, OrderItem, User, Product, Table, sequelize } = require('../models');
const paymentService = require('../services/payment.service');
const smsService = require('../services/sms.service');
const socketService = require('../services/socket.service');
const pushService = require('../services/push.service');
const InventoryService = require('../services/inventoryService');
const orderStatusService = require('../services/orderStatus.service');
const { Op, fn, col } = require('sequelize');

class OrderController {
  // Criar novo pedido
  async createOrder(req, res) {
    let paymentResult = null; // Declarar no escopo externo
    try {
      console.log('📦 [CREATE ORDER] Iniciando criação de pedido');
      console.log('📦 [CREATE ORDER] Body:', JSON.stringify(req.body, null, 2));

      const { tableId, items, notes, paymentMethod, useCashback, tip, wantsInstagramCashback } = req.body;
      const userId = req.user.id;
      console.log('📦 [CREATE ORDER] userId:', userId);
      console.log('📦 [CREATE ORDER] tableId:', tableId);
      console.log('📦 [CREATE ORDER] items:', JSON.stringify(items));
      console.log('📦 [CREATE ORDER] useCashback:', useCashback);
      console.log('📦 [CREATE ORDER] tip:', tip);

      // Validar valor mínimo
      const minimumOrderValue = parseFloat(process.env.MINIMUM_ORDER_VALUE) || 15.00;
      
      // Calcular subtotal
      let subtotal = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await Product.findByPk(item.productId);
        
        if (!product || !product.isActive) {
          return res.status(404).json({
            success: false,
            message: `Produto ${item.productId} não encontrado ou inativo`
          });
        }

        // Verificar estoque se necessário
        if (product.hasStock && product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Estoque insuficiente para ${product.name}. Disponível: ${product.stock}`
          });
        }

        const itemPrice = parseFloat(product.getPriceWithDiscount());
        const itemSubtotal = itemPrice * item.quantity;
        subtotal += itemSubtotal;

        orderItems.push({
          productId: product.id,
          quantity: item.quantity,
          unitPrice: itemPrice,
          subtotal: itemSubtotal,
          notes: item.notes || null,
          productName: product.name,
          productDescription: product.description,
          productImage: product.image,
          productCategory: product.category
        });
      }

      // Validar valor mínimo
      if (subtotal < minimumOrderValue) {
        return res.status(400).json({
          success: false,
          message: `Valor mínimo do pedido é R$ ${minimumOrderValue.toFixed(2)}. Atual: R$ ${subtotal.toFixed(2)}`
        });
      }

      // Verificar se mesa existe (apenas se tableId foi informado)
      let table = null;
      if (tableId) {
        table = await Table.findByPk(tableId);
        if (!table || !table.isActive) {
          return res.status(404).json({
            success: false,
            message: 'Mesa não encontrada ou inativa'
          });
        }

        // Sprint 54: Verificar se mesa ja tem pedidos ativos de OUTRO usuario
        // Permite adicionar pedidos a mesa se for o mesmo usuario
        const { allowShared } = req.body; // Flag para permitir compartilhar mesa
        const activeOrdersOnTable = await Order.findAll({
          where: {
            tableId: tableId,
            status: {
              [Op.notIn]: ['delivered', 'cancelled']
            }
          }
        });

        if (activeOrdersOnTable.length > 0 && !allowShared) {
          // Verificar se todos os pedidos ativos sao do mesmo usuario
          const otherUserOrders = activeOrdersOnTable.filter(o => o.userId !== userId);

          if (otherUserOrders.length > 0) {
            console.log(`⚠️ [CREATE ORDER] Mesa ${table.number} ocupada por outro usuario`);
            return res.status(400).json({
              success: false,
              message: `Mesa ${table.number} ja esta ocupada por outro cliente. Escolha outra mesa ou solicite ao atendente.`,
              code: 'TABLE_OCCUPIED',
              tableNumber: table.number
            });
          }

          // Se sao pedidos do mesmo usuario, permitir (adicionar mais itens)
          console.log(`📦 [CREATE ORDER] Mesa ${table.number} tem ${activeOrdersOnTable.length} pedido(s) ativo(s) do mesmo usuario`);
        }
      }

      // Calcular tempo estimado baseado nos produtos
      const preparationTimes = [];
      for (const item of orderItems) {
        const product = await Product.findByPk(item.productId);
        if (product) {
          preparationTimes.push(product.preparationTime || 15);
        }
      }
      const estimatedTime = preparationTimes.length > 0 ? Math.max(...preparationTimes) : 15;

      // Calcular taxa de serviço e total (antes de criar o pedido)
      // COBRAR 10% de taxa de serviço tanto em mesa quanto em balcão
      const isCounterOrder = !tableId || tableId === null;
      const serviceFeePercentage = parseFloat(process.env.SERVICE_FEE_PERCENTAGE) || 10;
      const serviceFee = (subtotal * serviceFeePercentage / 100);
      const taxes = 0;
      const tipAmount = parseFloat(tip) || 0;
      let totalBeforeDiscount = subtotal + serviceFee + taxes + tipAmount;
      console.log('📦 [CREATE ORDER] isCounterOrder:', isCounterOrder, 'serviceFeePercentage:', serviceFeePercentage, 'tipAmount:', tipAmount);

      // Processar uso de cashback
      let cashbackUsed = 0;
      const user = await User.findByPk(userId);
      const userCashbackBalance = parseFloat(user?.cashbackBalance) || 0;

      // Sprint 59: Aplicar cashback acumulado
      // REGRA: Usuário só pode usar cashback se já tiver ativado o sistema (cashbackEnabled = true)
      // cashbackEnabled vira true após a primeira validação do Instagram
      if (useCashback && useCashback > 0 && user.cashbackEnabled && userCashbackBalance > 0) {
        // Limitar ao saldo disponível e ao total do pedido
        const requestedCashback = parseFloat(useCashback);
        cashbackUsed = Math.min(requestedCashback, userCashbackBalance, totalBeforeDiscount);
        console.log('📦 [CREATE ORDER] Cashback solicitado:', requestedCashback, 'Saldo:', userCashbackBalance, 'Usado:', cashbackUsed, 'cashbackEnabled:', user.cashbackEnabled);
      } else if (useCashback && useCashback > 0 && !user.cashbackEnabled) {
        console.log('📦 [CREATE ORDER] Cashback bloqueado - sistema não habilitado. Usuário precisa fazer primeira validação Instagram.');
      }

      // Sprint 59: Verificar se usuário pode participar do Instagram esta semana
      // REGRA: Limite de 1x por semana por usuário
      let canDoInstagram = true;
      let instagramBlockReason = null;

      if (wantsInstagramCashback) {
        const lastInstagramDate = user?.lastInstagramCashbackAt;
        if (lastInstagramDate) {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

          if (new Date(lastInstagramDate) > oneWeekAgo) {
            canDoInstagram = false;
            const nextAvailableDate = new Date(lastInstagramDate);
            nextAvailableDate.setDate(nextAvailableDate.getDate() + 7);
            instagramBlockReason = `Você já participou do Instagram Cashback esta semana. Próxima disponibilidade: ${nextAvailableDate.toLocaleDateString('pt-BR')}`;
            console.log('📦 [CREATE ORDER] Instagram Cashback bloqueado:', instagramBlockReason);
          }
        }
      }

      // Calcular total final com desconto
      const total = Math.max(0, totalBeforeDiscount - cashbackUsed);

      console.log('📦 [CREATE ORDER] subtotal:', subtotal, 'serviceFee:', serviceFee, 'tip:', tipAmount, 'cashbackUsed:', cashbackUsed, 'total:', total);
      console.log('📦 [CREATE ORDER] cashbackEnabled:', user.cashbackEnabled, 'canDoInstagram:', canDoInstagram);

      // ========================================
      // TRANSACTION: Criar pedido atomicamente
      // ========================================
      let order;
      const t = await sequelize.transaction();

      try {
        console.log('🔄 [TRANSACTION] Iniciando transaction para criar pedido');

        // 1. Criar pedido (tableId é opcional para pedidos de balcão)
        order = await Order.create({
          userId,
          tableId: tableId || null,
          subtotal: subtotal.toFixed(2),
          serviceFee: serviceFee.toFixed(2),
          taxes: taxes.toFixed(2),
          cashbackUsed: cashbackUsed.toFixed(2),
          discount: cashbackUsed.toFixed(2), // Por enquanto discount = cashbackUsed
          tip: tipAmount.toFixed(2), // Gorjeta opcional
          total: total.toFixed(2),
          notes,
          paymentMethod,
          estimatedTime,
          // Sprint 59: Cashback Instagram 5% extra (só permite se pode participar esta semana)
          wantsInstagramCashback: wantsInstagramCashback && canDoInstagram ? true : false,
          instagramCashbackStatus: wantsInstagramCashback && canDoInstagram ? 'pending_validation' : null
        }, { transaction: t });

        console.log('📦 [TRANSACTION] Pedido criado:', order.id);

        // 2. Debitar cashback do usuário se foi usado
        if (cashbackUsed > 0) {
          await user.useCashback(cashbackUsed, `Usado no pedido #${order.orderNumber}`);
          console.log('📦 [TRANSACTION] Cashback debitado:', cashbackUsed);
        }

        // 3. Criar itens do pedido e atualizar estoque
        for (const item of orderItems) {
          // Criar OrderItem
          await OrderItem.create({
            ...item,
            orderId: order.id
          }, { transaction: t });

          // Atualizar estoque
          const product = await Product.findByPk(item.productId, { transaction: t });
          if (product && product.hasStock) {
            await Product.decrement('stock', {
              by: item.quantity,
              where: { id: item.productId },
              transaction: t
            });

            // Registrar movimento de inventário
            try {
              await InventoryService.recordMovement(
                item.productId,
                'saida',
                item.quantity,
                'venda',
                `Pedido #${order.orderNumber}`,
                userId,
                order.id
              );
            } catch (inventoryError) {
              console.error('⚠️ Erro ao registrar movimento de estoque:', inventoryError);
              // Não falha o pedido se houver erro no registro de inventário
              // O estoque já foi atualizado, apenas o log falhou
            }
          }
        }

        // 4. Commit da transaction
        await t.commit();
        console.log('✅ [TRANSACTION] Pedido criado com sucesso! Commit realizado.');

      } catch (transactionError) {
        // Rollback em caso de erro
        await t.rollback();
        console.error('❌ [TRANSACTION] Erro ao criar pedido. Rollback realizado:', transactionError);

        // Re-lançar erro para ser capturado pelo catch externo
        throw new Error(`Erro ao criar pedido: ${transactionError.message}`);
      }

      // Buscar pedido completo com relacionamentos
      const completeOrder = await Order.findByPk(order.id, {
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [{
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'category', 'price']
            }]
          },
          {
            model: User,
            as: 'customer',
            attributes: ['id', 'nome', 'celular']
          },
          {
            model: Table,
            as: 'table',
            attributes: ['id', 'number', 'name']
          }
        ]
      });

      // ========================================
      // LÓGICA DE PAGAMENTO E STATUS
      // ========================================

      // Pagamentos que precisam de atendente (não vão direto pra cozinha/bar)
      const attendantPayments = ['cash', 'pay_later', 'card_at_table', 'split'];
      const isAttendantPayment = attendantPayments.includes(paymentMethod);

      if (isAttendantPayment) {
        // Pagamento com atendente: status = pending_payment
        // NÃO notifica cozinha/bar ainda - só após atendente confirmar pagamento
        await order.update({
          status: 'pending_payment',
          paymentStatus: 'pending'
        });

        console.log(`💳 [PAGAMENTO] Pedido #${order.orderNumber} aguardando pagamento com atendente (${paymentMethod})`);

        // Notificar APENAS atendentes sobre solicitação de pagamento
        try {
          console.log(`📡 [WEBSOCKET] Notificando atendentes sobre pagamento pendente...`);
          socketService.notifyPaymentRequest(completeOrder);
        } catch (socketError) {
          console.error('⚠️ Erro ao notificar atendentes:', socketError);
        }

      } else if (paymentMethod && paymentMethod !== 'cash') {
        // Pagamento online (Stripe): criar payment intent
        paymentResult = await paymentService.createPaymentIntent(
          parseFloat(order.total),
          'brl',
          {
            orderId: order.id,
            orderNumber: order.orderNumber,
            userId,
            tableId
          }
        );

        if (paymentResult.success) {
          await order.update({
            paymentId: paymentResult.paymentIntentId,
            paymentStatus: 'processing'
          });
        } else {
          // Se falhou criar pagamento, cancelar pedido
          await order.update({ status: 'cancelled' });

          return res.status(500).json({
            success: false,
            message: 'Erro ao processar pagamento',
            error: paymentResult.error
          });
        }

        // Notificar cozinha/bar (pagamento online = vai direto pra produção após confirmação)
        console.log(`🔔 [NOTIFICAÇÃO] Enviando notificações para pedido #${order.orderNumber} (pagamento online)`);
        try {
          socketService.notifyNewOrder(completeOrder);
        } catch (socketError) {
          console.error('⚠️ Erro ao notificar via WebSocket:', socketError);
        }

        try {
          await pushService.notifyNewOrder(completeOrder);
        } catch (pushError) {
          console.error('⚠️ Erro ao enviar push notification:', pushError);
        }
      }

      // NOTA: A notificação para admins já é enviada pelo notifyNewOrder()
      // Não duplicar aqui para evitar notificações repetidas

      console.log('📦 [CREATE ORDER] Pedido criado com sucesso! ID:', order.id);
      res.status(201).json({
        success: true,
        message: 'Pedido criado com sucesso',
        data: {
          order: completeOrder,
          paymentClientSecret: paymentResult?.clientSecret || null
        }
      });
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Buscar pedidos do usuário
  async getUserOrders(req, res) {
    try {
      const userId = req.user.id;
      const { status, page = 1, limit = 10 } = req.query;

      const where = { userId };
      if (status) {
        where.status = status;
      }

      const offset = (parseInt(page) - 1) * parseInt(limit);

      const { count, rows: orders } = await Order.findAndCountAll({
        where,
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
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset
      });

      const totalPages = Math.ceil(count / parseInt(limit));

      res.status(200).json({
        success: true,
        data: {
          orders,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalOrders: count,
            ordersPerPage: parseInt(limit)
          }
        }
      });
    } catch (error) {
      console.error('Erro ao buscar pedidos do usuário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Buscar pedido por ID
  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const order = await Order.findOne({
        where: { 
          id,
          userId // Só pode ver próprios pedidos
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
          },
          {
            model: User,
            as: 'attendant',
            attributes: ['nome']
          }
        ]
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Pedido não encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: { order }
      });
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Confirmar pagamento (webhook ou manual)
  async confirmPayment(req, res) {
    try {
      const { orderId, paymentId } = req.body;

      const order = await Order.findByPk(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Pedido não encontrado'
        });
      }

      // Verificar se já foi notificado (evitar duplicação)
      const wasPending = order.status === 'pending';

      // Atualizar status do pedido
      await order.update({
        status: 'confirmed',
        paymentStatus: 'completed',
        paymentId
      });

      // Buscar pedido completo
      const completeOrder = await Order.findByPk(orderId, {
        include: [
          {
            model: OrderItem,
            as: 'items'
          },
          {
            model: User,
            as: 'customer'
          },
          {
            model: Table,
            as: 'table'
          }
        ]
      });

      // Só notifica via WebSocket/Push se ainda estava pending (evita duplicação)
      if (wasPending) {
        try {
          socketService.notifyNewOrder(completeOrder);
        } catch (socketError) {
          console.error('⚠️ Erro ao notificar via WebSocket:', socketError);
        }

        try {
          await pushService.notifyNewOrder(completeOrder);
        } catch (pushError) {
          console.error('⚠️ Erro ao enviar push notification:', pushError);
        }
      }

      // SMS sempre envia (confirmação de pagamento)
      try {
        await smsService.sendOrderConfirmation(
          completeOrder.customer.celular,
          completeOrder.orderNumber,
          completeOrder.estimatedTime
        );
      } catch (smsError) {
        console.error('⚠️ Erro ao enviar SMS:', smsError);
      }

      res.status(200).json({
        success: true,
        message: 'Pagamento confirmado',
        data: { order: completeOrder }
      });
    } catch (error) {
      console.error('Erro ao confirmar pagamento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Confirmar pagamento recebido pelo atendente (cash, card_at_table, split)
  async confirmAttendantPayment(req, res) {
    try {
      const { id } = req.params;
      const { paymentMethod, amountReceived, change } = req.body;
      const attendantId = req.user.id;
      const attendantName = req.user.nome;

      console.log(`💳 [CONFIRM PAYMENT] Atendente ${attendantName} confirmando pagamento do pedido ${id}`);
      console.log(`💳 [CONFIRM PAYMENT] Método selecionado: ${paymentMethod}`);

      const order = await Order.findByPk(id, {
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [{
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'category']
            }]
          },
          {
            model: User,
            as: 'customer',
            attributes: ['id', 'nome', 'celular']
          },
          {
            model: Table,
            as: 'table',
            attributes: ['id', 'number', 'name']
          }
        ]
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Pedido não encontrado'
        });
      }

      // Verificar se pedido está aguardando pagamento
      if (order.status !== 'pending_payment') {
        return res.status(400).json({
          success: false,
          message: `Pedido não está aguardando pagamento. Status atual: ${order.status}`
        });
      }

      // Verificar permissão (atendente, caixa, admin, gerente)
      const allowedRoles = ['atendente', 'caixa', 'admin', 'gerente'];
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Você não tem permissão para confirmar pagamentos'
        });
      }

      // Atualizar pedido - incluindo o método de pagamento real selecionado pelo atendente
      const updateData = {
        status: 'confirmed',
        paymentStatus: 'completed',
        attendantId,
        confirmedAt: new Date()
      };

      // Se atendente selecionou um método diferente, atualizar
      if (paymentMethod) {
        updateData.paymentMethod = paymentMethod;
      }

      await order.update(updateData);

      console.log(`✅ [CONFIRM PAYMENT] Pedido #${order.orderNumber} confirmado com ${paymentMethod || order.paymentMethod}! Indo para produção.`);

      // Notificar via WebSocket (cozinha/bar agora podem preparar)
      socketService.notifyPaymentConfirmed(order, attendantName);

      // Registrar movimento no caixa para todos os métodos de pagamento
      const finalPaymentMethod = paymentMethod || order.paymentMethod;
      const paymentLabels = { credit: 'Crédito', debit: 'Débito', pix: 'PIX', cash: 'Dinheiro', credit_card: 'Crédito', debit_card: 'Débito' };
      try {
        const { Cashier, CashierMovement } = require('../models');
        // Buscar caixa aberto
        const openCashier = await Cashier.findOne({ where: { status: 'open' } });
        if (openCashier) {
          await CashierMovement.create({
            cashierId: openCashier.id,
            type: 'sale',
            amount: parseFloat(order.total),
            paymentMethod: finalPaymentMethod,
            description: `Pedido #${order.orderNumber} - Pagamento em ${paymentLabels[finalPaymentMethod] || finalPaymentMethod}`,
            orderId: order.id,
            orderNumber: order.orderNumber,
            createdBy: attendantId
          });
          console.log(`💰 [CAIXA] Movimento registrado para pedido #${order.orderNumber} (${paymentLabels[finalPaymentMethod]})`);
        } else {
          console.log(`⚠️ [CAIXA] Nenhum caixa aberto - movimento não registrado para pedido #${order.orderNumber}`);
        }
      } catch (cashError) {
        console.error('⚠️ Erro ao registrar movimento no caixa:', cashError.message);
        // Não falha a operação se caixa der erro
      }

      // Push notification para cliente
      try {
        await pushService.notifyOrderStatus(order, 'confirmed');
      } catch (pushError) {
        console.error('⚠️ Erro ao enviar push:', pushError);
      }

      res.status(200).json({
        success: true,
        message: 'Pagamento confirmado! Pedido enviado para produção.',
        data: {
          order,
          confirmedBy: attendantName,
          confirmedAt: new Date()
        }
      });
    } catch (error) {
      console.error('❌ Erro ao confirmar pagamento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Listar pedidos aguardando pagamento (para painel do atendente)
  async getPendingPayments(req, res) {
    try {
      const orders = await Order.findAll({
        where: {
          status: 'pending_payment'
        },
        include: [
          {
            model: OrderItem,
            as: 'items'
          },
          {
            model: User,
            as: 'customer',
            attributes: ['id', 'nome', 'celular']
          },
          {
            model: Table,
            as: 'table',
            attributes: ['id', 'number', 'name']
          }
        ],
        order: [['createdAt', 'ASC']]  // Mais antigos primeiro
      });

      const paymentLabels = {
        cash: 'Dinheiro',
        pay_later: 'Pagar Depois',
        card_at_table: 'Cartão na Mesa',
        split: 'Dividir Conta'
      };

      const formattedOrders = orders.map(order => ({
        ...order.toJSON(),
        paymentLabel: paymentLabels[order.paymentMethod] || order.paymentMethod,
        waitingTime: Math.round((new Date() - new Date(order.createdAt)) / 60000) // minutos esperando
      }));

      res.status(200).json({
        success: true,
        data: {
          orders: formattedOrders,
          count: orders.length
        }
      });
    } catch (error) {
      console.error('Erro ao buscar pagamentos pendentes:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Cancelar pedido
  async cancelOrder(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const order = await Order.findOne({
        where: { 
          id,
          userId
        }
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Pedido não encontrado'
        });
      }

      if (!order.canBeCancelled()) {
        return res.status(400).json({
          success: false,
          message: 'Pedido não pode ser cancelado no status atual'
        });
      }

      // Cancelar ou estornar pagamento se houver
      let refundInfo = null;
      if (order.paymentId) {
        // Verificar status atual do pagamento no Stripe
        const paymentStatus = await paymentService.getPaymentStatus(order.paymentId);
        console.log(`💳 Status do pagamento ${order.paymentId}: ${paymentStatus.status}`);

        if (paymentStatus.success) {
          if (paymentStatus.status === 'succeeded') {
            // Pagamento já foi capturado - fazer REFUND (estorno real)
            console.log(`💰 Pagamento já capturado, criando refund...`);
            const refundResult = await paymentService.createRefund(order.paymentId);

            if (refundResult.success) {
              console.log(`✅ Refund criado: ${refundResult.refundId} - R$${refundResult.amount}`);
              refundInfo = {
                refundId: refundResult.refundId,
                amount: refundResult.amount,
                status: refundResult.status,
                estimatedDays: '5-10 dias úteis'
              };
              // Atualizar status do pagamento para refunded
              await order.update({ paymentStatus: 'refunded' });
            } else {
              console.error('❌ Erro ao criar refund:', refundResult.error);
            }
          } else if (['requires_payment_method', 'requires_confirmation', 'requires_action', 'processing'].includes(paymentStatus.status)) {
            // Pagamento ainda não foi capturado - apenas cancelar
            console.log(`🚫 Pagamento não capturado, cancelando PaymentIntent...`);
            const cancelResult = await paymentService.cancelPayment(order.paymentId);
            if (!cancelResult.success) {
              console.error('❌ Erro ao cancelar pagamento:', cancelResult.error);
            } else {
              console.log(`✅ PaymentIntent cancelado`);
            }
          } else {
            console.log(`⚠️ Status do pagamento desconhecido: ${paymentStatus.status}`);
          }
        } else {
          console.error('❌ Erro ao verificar status do pagamento:', paymentStatus.error);
        }
      }

      // Restaurar estoque
      const orderItems = await OrderItem.findAll({
        where: { orderId: order.id },
        include: [{ model: Product, as: 'product' }]
      });

      for (const item of orderItems) {
        if (item.product && item.product.hasStock) {
          await Product.increment('stock', {
            by: item.quantity,
            where: { id: item.productId }
          });

          // Registrar movimento de devolução
          try {
            await InventoryService.recordMovement(
              item.productId,
              'devolucao',
              item.quantity,
              'devolucao',
              `Devolução - Pedido #${order.orderNumber} cancelado`,
              userId,
              order.id
            );
          } catch (inventoryError) {
            console.error('Erro ao registrar movimento de devolução:', inventoryError);
            // Não falha o cancelamento se houver erro no registro
          }
        }
      }

      // Devolver cashback usado (se houver)
      const cashbackUsed = parseFloat(order.cashbackUsed) || 0;
      if (cashbackUsed > 0) {
        try {
          const user = await User.findByPk(userId);
          if (user) {
            await user.addCashback(
              cashbackUsed,
              order.id,
              `Devolução de cashback - Pedido #${order.orderNumber} cancelado`
            );
            console.log(`💰 Devolvido R$${cashbackUsed.toFixed(2)} de cashback para usuário ${userId}`);
          }
        } catch (cashbackError) {
          console.error('Erro ao devolver cashback:', cashbackError);
          // Não falha o cancelamento se houver erro na devolução
        }
      }

      // Atualizar status
      await order.update({
        status: 'cancelled',
        paymentStatus: 'cancelled'
      });

      // Buscar dados completos do pedido para notificação
      const fullOrder = await Order.findByPk(order.id, {
        include: [
          { model: Table, as: 'table', attributes: ['id', 'number', 'name'] },
          { model: User, as: 'customer', attributes: ['id', 'nome'] },
          { model: OrderItem, as: 'items' }
        ]
      });

      // Notificar staff via Socket.IO
      try {
        socketService.notifyOrderStatusChange(order.id, 'cancelled', {
          orderNumber: order.orderNumber,
          tableNumber: fullOrder.table?.number || 'Balcão',
          customerName: fullOrder.customer?.nome,
          userId: order.userId, // Para notificar o cliente via socket
          reason: 'Cancelado pelo cliente',
          cashbackRefunded: cashbackUsed > 0 ? cashbackUsed : undefined
        });
        console.log(`📡 Notificação de cancelamento enviada para staff - Pedido #${order.orderNumber}`);
      } catch (socketError) {
        console.error('Erro ao notificar via Socket:', socketError);
        // Não falha o cancelamento se houver erro na notificação
      }

      // Notificar cliente via push se houve estorno
      if (refundInfo) {
        try {
          await pushService.sendToUser(userId, {
            title: 'FLAME - Pedido Cancelado',
            body: `Seu pedido #${order.orderNumber} foi cancelado. Estorno de R$${refundInfo.amount.toFixed(2)} em ${refundInfo.estimatedDays}.`,
            icon: '/icons/icon-192x192.png',
            tag: 'order-refund',
            data: {
              type: 'order_refunded',
              orderId: order.id,
              refundAmount: refundInfo.amount
            }
          });
          console.log(`📱 Push de estorno enviado para usuário ${userId}`);
        } catch (pushError) {
          console.error('Erro ao enviar push de estorno:', pushError);
        }
      }

      res.status(200).json({
        success: true,
        message: refundInfo
          ? `Pedido cancelado. Estorno de R$${refundInfo.amount.toFixed(2)} em ${refundInfo.estimatedDays}.`
          : 'Pedido cancelado com sucesso',
        data: {
          order,
          cashbackRefunded: cashbackUsed > 0 ? cashbackUsed : undefined,
          refund: refundInfo || undefined
        }
      });
    } catch (error) {
      console.error('Erro ao cancelar pedido:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Avaliar pedido
  async rateOrder(req, res) {
    try {
      const { id } = req.params;
      const { rating, review } = req.body;
      const userId = req.user.id;

      const order = await Order.findOne({
        where: { 
          id,
          userId,
          status: 'delivered'
        }
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Pedido não encontrado ou não foi entregue'
        });
      }

      await order.update({ rating, review });

      // Atualizar estatísticas do usuário
      await User.increment('totalOrders', {
        by: 1,
        where: { id: userId }
      });

      await User.increment('totalSpent', {
        by: parseFloat(order.total),
        where: { id: userId }
      });

      // Sprint 29: Bônus de Avaliação (R$2)
      const REVIEW_BONUS = 2;
      const CashbackHistory = require('../models/CashbackHistory');
      const { Op } = require('sequelize');

      // Verificar se já recebeu bônus por esta avaliação
      const existingBonus = await CashbackHistory.findOne({
        where: {
          userId,
          orderId: order.id,
          type: 'bonus',
          description: { [Op.like]: '%avaliação%' }
        }
      });

      let bonusGiven = false;
      if (!existingBonus) {
        const user = await User.findByPk(userId);
        const balanceBefore = parseFloat(user.cashbackBalance) || 0;
        user.cashbackBalance = (balanceBefore + REVIEW_BONUS).toFixed(2);
        await user.save();

        await CashbackHistory.create({
          userId,
          orderId: order.id,
          amount: REVIEW_BONUS,
          type: 'bonus',
          description: `Bônus de avaliação - Pedido #${order.orderNumber}`,
          balanceBefore,
          balanceAfter: parseFloat(user.cashbackBalance)
        });

        bonusGiven = true;
        console.log(`✅ Bônus de avaliação R$${REVIEW_BONUS} dado para usuário ${userId}`);
      }

      res.status(200).json({
        success: true,
        message: bonusGiven
          ? `Avaliação registrada! Você ganhou R$${REVIEW_BONUS} de cashback!`
          : 'Avaliação registrada com sucesso',
        data: { order, bonusGiven, bonusAmount: bonusGiven ? REVIEW_BONUS : 0 }
      });
    } catch (error) {
      console.error('Erro ao avaliar pedido:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // MÉTODOS PARA FUNCIONÁRIOS

  // Listar todos os pedidos (para funcionários)
  async getAllOrders(req, res) {
    try {
      const { status, date, page = 1, limit = 20 } = req.query;
      
      const where = {};
      
      if (status) {
        where.status = status;
      }

      if (date) {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);
        
        where.createdAt = {
          [Op.between]: [startDate, endDate]
        };
      }

      const offset = (parseInt(page) - 1) * parseInt(limit);

      const { count, rows: orders } = await Order.findAndCountAll({
        where,
        include: [
          {
            model: OrderItem,
            as: 'items'
          },
          {
            model: User,
            as: 'customer',
            attributes: ['nome', 'celular']
          },
          {
            model: Table,
            as: 'table',
            attributes: ['number', 'name']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset
      });

      res.status(200).json({
        success: true,
        data: { 
          orders,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / parseInt(limit)),
            totalOrders: count
          }
        }
      });
    } catch (error) {
      console.error('Erro ao listar pedidos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Atualizar status do pedido (funcionários)
  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status: newStatus } = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;

      console.log(`📝 [UPDATE STATUS] Pedido ${id}: ${newStatus} por ${userRole}`);

      const order = await Order.findByPk(id, {
        include: [
          {
            model: User,
            as: 'customer'
          },
          {
            model: Table,
            as: 'table'
          }
        ]
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Pedido não encontrado'
        });
      }

      const currentStatus = order.status;

      // Validar transição usando o serviço de status
      const validation = orderStatusService.validateTransition(currentStatus, newStatus, userRole);

      if (!validation.valid) {
        console.log(`❌ [UPDATE STATUS] Transição negada: ${validation.error}`);
        return res.status(400).json({
          success: false,
          message: validation.error,
          currentStatus: orderStatusService.getStatusLabel(currentStatus),
          requestedStatus: orderStatusService.getStatusLabel(newStatus),
          allowedTransitions: orderStatusService.getNextValidStatuses(currentStatus, userRole)
        });
      }

      // Obter campos de timestamp a atualizar
      const timestampFields = orderStatusService.getTimestampFields(newStatus, userId);

      // Atualizar pedido
      const updateData = {
        status: newStatus,
        ...timestampFields
      };

      await order.update(updateData);

      console.log(`✅ [UPDATE STATUS] Pedido ${order.orderNumber}: ${currentStatus} → ${newStatus}`);

      // Notificar mudança via WebSocket
      socketService.notifyOrderStatusChange(order.id, newStatus, {
        orderNumber: order.orderNumber,
        tableNumber: order.table?.number || 'Balcão',
        customerName: order.customer?.nome,
        userId: order.userId, // Para notificar o cliente via socket
        previousStatus: currentStatus,
        changedBy: req.user.nome,
        changedByRole: userRole
      });

      // Notificações específicas por status
      if (newStatus === 'ready') {
        // SMS quando pedido estiver pronto
        if (order.customer?.celular) {
          try {
            await smsService.sendOrderReady(
              order.customer.celular,
              order.orderNumber
            );
          } catch (smsError) {
            console.error('⚠️ Erro ao enviar SMS:', smsError);
          }
        }

        // Push Notification para cliente
        try {
          await pushService.notifyOrderReady(order);
        } catch (pushError) {
          console.error('⚠️ Erro ao enviar push para cliente:', pushError);
        }
      } else if (['preparing', 'on_way', 'delivered', 'cancelled'].includes(newStatus)) {
        // Notificar cliente sobre mudança de status
        try {
          await pushService.notifyOrderStatus(order, newStatus);
        } catch (pushError) {
          console.error('⚠️ Erro ao enviar push de status:', pushError);
        }
      }

      // Recarregar pedido com dados atualizados
      await order.reload();

      res.status(200).json({
        success: true,
        message: `Status atualizado para "${orderStatusService.getStatusLabel(newStatus)}"`,
        data: {
          order,
          timeline: orderStatusService.calculateTimeline(order),
          nextStatuses: orderStatusService.getNextValidStatuses(newStatus, userRole)
        }
      });
    } catch (error) {
      console.error('❌ Erro ao atualizar status:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Sprint 59: Cliente envia link do post do Instagram
  async submitInstagramPost(req, res) {
    try {
      const { id } = req.params;
      const { postUrl } = req.body;
      const userId = req.user.id;

      console.log(`📸 [INSTAGRAM] Cliente enviando link do post para pedido ${id}`);

      const order = await Order.findByPk(id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Pedido não encontrado'
        });
      }

      // Verificar se o pedido pertence ao usuário
      if (order.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Você não tem permissão para este pedido'
        });
      }

      if (!order.wantsInstagramCashback) {
        return res.status(400).json({
          success: false,
          message: 'Este pedido não participou do programa Instagram Cashback'
        });
      }

      if (order.instagramCashbackStatus === 'validated') {
        return res.status(400).json({
          success: false,
          message: 'Instagram já foi validado para este pedido'
        });
      }

      // Validar URL do Instagram
      if (!postUrl || !postUrl.includes('instagram.com')) {
        return res.status(400).json({
          success: false,
          message: 'Por favor, envie um link válido do Instagram'
        });
      }

      // Atualizar pedido com o link do post e marcar como aguardando validação
      await order.update({
        instagramCashbackStatus: 'pending_validation',
        notes: order.notes
          ? `${order.notes}\n[Instagram] Link enviado pelo cliente: ${postUrl}`
          : `[Instagram] Link enviado pelo cliente: ${postUrl}`
      });

      console.log(`✅ [INSTAGRAM] Link salvo para pedido ${id}: ${postUrl}`);

      // Emitir evento via Socket para atendentes saberem que tem link para validar
      const io = req.app.get('io');
      if (io) {
        io.to('staff').emit('instagram_link_submitted', {
          orderId: order.id,
          orderNumber: order.orderNumber,
          postUrl
        });
      }

      res.status(200).json({
        success: true,
        message: 'Link enviado! Aguarde a validação do atendente.',
        data: {
          orderId: order.id,
          postUrl,
          status: 'pending_validation'
        }
      });
    } catch (error) {
      console.error('❌ Erro ao enviar link Instagram:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Sprint 59: Validar Instagram Cashback
  // REGRAS:
  // 1. Na primeira validação Instagram, habilita o sistema de cashback do usuário
  // 2. Limite de 1x por semana por usuário
  // 3. Credita 5% de cashback extra do valor do pedido
  async validateInstagramCashback(req, res) {
    try {
      const { id } = req.params;
      const { validated } = req.body;
      const staffId = req.user.id;
      const staffName = req.user.nome;

      console.log(`📸 [INSTAGRAM] Validando cashback para pedido ${id}. Validado: ${validated}`);

      const order = await Order.findByPk(id, {
        include: [
          { model: User, as: 'customer' }
        ]
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

      if (order.instagramCashbackStatus !== 'pending_validation') {
        return res.status(400).json({
          success: false,
          message: `Instagram já foi ${order.instagramCashbackStatus === 'validated' ? 'validado' : 'recusado'}`
        });
      }

      // Atualizar status do Instagram cashback
      await order.update({
        instagramCashbackStatus: validated ? 'validated' : 'rejected',
        instagramValidatedBy: staffId,
        instagramValidatedAt: new Date()
      });

      // Se validado, creditar 5% de cashback extra e aplicar regras do sistema
      if (validated && order.customer) {
        const INSTAGRAM_CASHBACK_RATE = 5; // 5% extra
        const orderTotal = parseFloat(order.total);
        const instagramBonus = (orderTotal * INSTAGRAM_CASHBACK_RATE / 100);
        const customer = order.customer;

        // Verificar se é a primeira validação Instagram do usuário
        const isFirstValidation = !customer.cashbackEnabled || customer.instagramValidationsCount === 0;

        // Se for a primeira validação, HABILITAR o sistema de cashback do usuário
        if (!customer.cashbackEnabled) {
          await customer.update({ cashbackEnabled: true });
          console.log(`🎉 [INSTAGRAM] Sistema de cashback HABILITADO para ${customer.nome} (primeira validação)`);
        }

        // Atualizar controles de Instagram do usuário
        await customer.update({
          lastInstagramCashbackAt: new Date(),
          instagramValidationsCount: (customer.instagramValidationsCount || 0) + 1
        });

        // Creditar o bônus Instagram
        await customer.addCashback(
          instagramBonus,
          order.id,
          `Bônus Instagram (+${INSTAGRAM_CASHBACK_RATE}%) - Pedido #${order.orderNumber}`
        );

        console.log(`✅ [INSTAGRAM] Cashback de R$${instagramBonus.toFixed(2)} creditado para ${customer.nome}`);
        console.log(`📊 [INSTAGRAM] Total de validações do usuário: ${(customer.instagramValidationsCount || 0) + 1}`);

        // Mensagem especial para primeira validação
        const message = isFirstValidation
          ? `Primeira validação Instagram! Sistema de cashback ATIVADO. Bônus de R$${instagramBonus.toFixed(2)} creditado.`
          : `Instagram validado! Cashback de R$${instagramBonus.toFixed(2)} creditado.`;

        return res.status(200).json({
          success: true,
          message,
          data: {
            order,
            validated,
            validatedBy: staffName,
            validatedAt: new Date(),
            isFirstValidation,
            bonusAmount: instagramBonus.toFixed(2),
            cashbackEnabled: true,
            totalValidations: (customer.instagramValidationsCount || 0) + 1
          }
        });
      }

      res.status(200).json({
        success: true,
        message: 'Instagram não validado.',
        data: {
          order,
          validated,
          validatedBy: staffName,
          validatedAt: new Date()
        }
      });
    } catch (error) {
      console.error('❌ Erro ao validar Instagram:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Dashboard de métricas (admin)
  async getDashboardMetrics(req, res) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Pedidos de hoje
      const todaysOrders = await Order.findAll({
        where: {
          createdAt: {
            [Op.between]: [today, tomorrow]
          }
        }
      });

      // Métricas
      const totalOrdersToday = todaysOrders.length;
      const totalRevenueToday = todaysOrders
        .filter(order => order.paymentStatus === 'completed')
        .reduce((sum, order) => sum + parseFloat(order.total), 0);

      const averageTicket = totalOrdersToday > 0 ? totalRevenueToday / totalOrdersToday : 0;

      const ordersByStatus = await Order.findAll({
        attributes: ['status', [fn('COUNT', col('id')), 'count']],
        where: {
          createdAt: {
            [Op.between]: [today, tomorrow]
          }
        },
        group: ['status'],
        raw: true
      });

      // Tempo médio de preparo
      const completedOrders = todaysOrders.filter(order => order.preparationTime);
      const avgPreparationTime = completedOrders.length > 0 
        ? completedOrders.reduce((sum, order) => sum + order.preparationTime, 0) / completedOrders.length
        : 0;

      res.status(200).json({
        success: true,
        data: {
          totalOrdersToday,
          totalRevenueToday: totalRevenueToday.toFixed(2),
          averageTicket: averageTicket.toFixed(2),
          avgPreparationTime: Math.round(avgPreparationTime),
          ordersByStatus
        }
      });
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new OrderController();