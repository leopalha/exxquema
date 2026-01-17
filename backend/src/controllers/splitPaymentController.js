const SplitPayment = require('../models/SplitPayment');
const Order = require('../models/Order');
const User = require('../models/User');
const { sequelize } = require('../config/database');

class SplitPaymentController {
  // POST /orders/:id/split - Iniciar divisao de conta
  async createSplit(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const { id: orderId } = req.params;
      const { splitType, participants, splits } = req.body;
      // splitType: 'equal' | 'custom' | 'by_items'
      // participants: number (para equal)
      // splits: [{ userId, amount, percentage }] (para custom)

      // Buscar pedido
      const order = await Order.findByPk(orderId, {
        include: [{ model: User, as: 'customer' }]
      });

      if (!order) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Pedido não encontrado'
        });
      }

      // Verificar permissao (dono do pedido ou staff)
      const isOwner = order.userId === req.user.id;
      const isStaff = ['admin', 'atendente', 'gerente'].includes(req.user.role);

      if (!isOwner && !isStaff) {
        await transaction.rollback();
        return res.status(403).json({
          success: false,
          message: 'Acesso negado'
        });
      }

      // Verificar se pedido ja foi pago
      if (order.paymentStatus === 'completed') {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Pedido já foi pago'
        });
      }

      // Verificar se ja existe divisao pendente
      const existingSplit = await SplitPayment.findOne({
        where: { orderId, status: 'pending' }
      });

      if (existingSplit) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Já existe uma divisão pendente para este pedido'
        });
      }

      const total = parseFloat(order.total);
      let splitPayments = [];

      if (splitType === 'equal') {
        // Divisao igual
        if (!participants || participants < 2) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: 'Número de participantes inválido (mínimo 2)'
          });
        }

        const amountPerPerson = (total / participants).toFixed(2);
        const percentage = (100 / participants).toFixed(2);

        // Criar split para cada participante
        for (let i = 0; i < participants; i++) {
          splitPayments.push({
            orderId,
            userId: i === 0 ? order.userId : null, // Primeiro é o dono
            amount: parseFloat(amountPerPerson),
            percentage: parseFloat(percentage),
            status: 'pending'
          });
        }

      } else if (splitType === 'custom') {
        // Divisao personalizada por valor
        if (!splits || !Array.isArray(splits) || splits.length < 2) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: 'Splits inválidos'
          });
        }

        // Validar soma dos valores
        const totalSplit = splits.reduce((sum, s) => sum + parseFloat(s.amount), 0);
        if (Math.abs(totalSplit - total) > 0.01) { // Margem de 1 centavo
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: `Soma das partes (R$ ${totalSplit.toFixed(2)}) diferente do total (R$ ${total.toFixed(2)})`
          });
        }

        splitPayments = splits.map(s => ({
          orderId,
          userId: s.userId || null,
          amount: parseFloat(s.amount),
          percentage: ((parseFloat(s.amount) / total) * 100).toFixed(2),
          status: 'pending',
          notes: s.notes || null
        }));

      } else if (splitType === 'by_items') {
        // Divisao por itens específicos
        const OrderItem = require('../models/OrderItem');

        if (!splits || !Array.isArray(splits) || splits.length < 2) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: 'Splits inválidos (mínimo 2 participantes)'
          });
        }

        // Buscar itens do pedido
        const orderItems = await OrderItem.findAll({
          where: { orderId },
          transaction
        });

        if (orderItems.length === 0) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: 'Pedido não possui itens'
          });
        }

        // Validar que todos os itens foram atribuídos
        const allOrderItemIds = orderItems.map(item => item.id);
        const assignedItemIds = splits.flatMap(s => s.itemIds || []);

        // Verificar se todos os itens foram atribuídos
        const missingItems = allOrderItemIds.filter(id => !assignedItemIds.includes(id));
        if (missingItems.length > 0) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: `${missingItems.length} item(ns) não foram atribuídos a nenhum participante`
          });
        }

        // Verificar se algum item foi atribuído mais de uma vez
        const duplicateItems = assignedItemIds.filter((id, index) =>
          assignedItemIds.indexOf(id) !== index
        );
        if (duplicateItems.length > 0) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: 'Alguns itens foram atribuídos a mais de um participante'
          });
        }

        // Calcular valor de cada participante baseado nos itens atribuídos
        const subtotal = parseFloat(order.subtotal);
        const serviceFee = parseFloat(order.serviceFee);
        const taxes = parseFloat(order.taxes) || 0;
        const tip = parseFloat(order.tip) || 0;

        splitPayments = splits.map(participant => {
          // Somar valor dos itens deste participante
          const participantItems = orderItems.filter(item =>
            participant.itemIds && participant.itemIds.includes(item.id)
          );

          const participantSubtotal = participantItems.reduce((sum, item) =>
            sum + parseFloat(item.subtotal), 0
          );

          // Calcular proporção deste participante no subtotal
          const proportion = participantSubtotal / subtotal;

          // Aplicar proporção na taxa de serviço, impostos e gorjeta
          const participantServiceFee = serviceFee * proportion;
          const participantTaxes = taxes * proportion;
          const participantTip = tip * proportion;

          // Total deste participante
          const participantTotal = participantSubtotal + participantServiceFee + participantTaxes + participantTip;

          return {
            orderId,
            userId: participant.userId || null,
            amount: parseFloat(participantTotal.toFixed(2)),
            percentage: parseFloat((proportion * 100).toFixed(2)),
            status: 'pending',
            notes: `${participantItems.length} item(ns): ${participantItems.map(i => i.productName).join(', ')}`
          };
        });

        // Validar que a soma bate com o total (com margem de erro de 2 centavos)
        const totalSplitByItems = splitPayments.reduce((sum, s) => sum + s.amount, 0);
        if (Math.abs(totalSplitByItems - total) > 0.02) {
          await transaction.rollback();
          return res.status(400).json({
            success: false,
            message: `Soma das partes (R$ ${totalSplitByItems.toFixed(2)}) não corresponde ao total (R$ ${total.toFixed(2)})`
          });
        }

      } else {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Tipo de divisão inválido. Use: equal, custom ou by_items'
        });
      }

      // Criar registros de split
      const createdSplits = await SplitPayment.bulkCreate(splitPayments, { transaction });

      // Atualizar paymentMethod do pedido para 'split'
      await order.update({ paymentMethod: 'split' }, { transaction });

      await transaction.commit();

      res.status(201).json({
        success: true,
        message: 'Divisão criada com sucesso',
        data: {
          orderId,
          total,
          splitType,
          participants: createdSplits.length,
          splits: createdSplits
        }
      });

    } catch (error) {
      await transaction.rollback();
      console.error('Erro ao criar divisão:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao criar divisão',
        error: error.message
      });
    }
  }

  // GET /orders/:id/split - Ver status da divisao
  async getSplitStatus(req, res) {
    try {
      const { id: orderId } = req.params;

      const order = await Order.findByPk(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Pedido não encontrado'
        });
      }

      const splits = await SplitPayment.findAll({
        where: { orderId },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'nome', 'email']
          }
        ],
        order: [['createdAt', 'ASC']]
      });

      if (splits.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Divisão não encontrada'
        });
      }

      const total = parseFloat(order.total);
      const paid = splits
        .filter(s => s.status === 'paid')
        .reduce((sum, s) => sum + parseFloat(s.amount), 0);
      const remaining = total - paid;
      const paidCount = splits.filter(s => s.status === 'paid').length;

      res.json({
        success: true,
        data: {
          orderId,
          orderNumber: order.orderNumber,
          total,
          paid,
          remaining,
          percentage: ((paid / total) * 100).toFixed(2),
          isComplete: remaining <= 0.01,
          participants: splits.map(s => ({
            id: s.id,
            userId: s.userId,
            userName: s.user?.nome || 'Não atribuído',
            amount: parseFloat(s.amount),
            percentage: parseFloat(s.percentage),
            status: s.status,
            paymentMethod: s.paymentMethod,
            paidAt: s.paidAt
          })),
          paidCount,
          totalParticipants: splits.length
        }
      });

    } catch (error) {
      console.error('Erro ao buscar status da divisão:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar status da divisão',
        error: error.message
      });
    }
  }

  // POST /orders/:id/split/pay - Pagar parte individual
  async paySplit(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const { id: orderId } = req.params;
      const { splitId, paymentMethod, paymentIntentId, amountReceived, change } = req.body;
      // paymentMethod: 'credit', 'debit', 'pix', 'cash', 'card_at_table'

      const split = await SplitPayment.findOne({
        where: { id: splitId, orderId }
      });

      if (!split) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Divisão não encontrada'
        });
      }

      if (split.status === 'paid') {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Esta parte já foi paga'
        });
      }

      // Atualizar split
      await split.update({
        status: 'paid',
        paymentMethod,
        paymentIntentId,
        paidAt: new Date()
      }, { transaction });

      // Verificar se todos pagaram
      const allSplits = await SplitPayment.findAll({
        where: { orderId }
      });

      const allPaid = allSplits.every(s => s.status === 'paid');

      if (allPaid) {
        // Atualizar pedido como pago
        const order = await Order.findByPk(orderId);
        await order.update({
          paymentStatus: 'completed',
          status: order.status === 'pending_payment' ? 'confirmed' : order.status
        }, { transaction });
      }

      await transaction.commit();

      res.json({
        success: true,
        message: 'Pagamento registrado com sucesso',
        data: {
          split: {
            id: split.id,
            amount: parseFloat(split.amount),
            status: split.status,
            paymentMethod: split.paymentMethod,
            paidAt: split.paidAt
          },
          allPaid
        }
      });

    } catch (error) {
      await transaction.rollback();
      console.error('Erro ao registrar pagamento:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao registrar pagamento',
        error: error.message
      });
    }
  }

  // POST /orders/:id/split/assign - Atribuir split a um usuario
  async assignSplit(req, res) {
    try {
      const { id: orderId } = req.params;
      const { splitId, userId } = req.body;

      const split = await SplitPayment.findOne({
        where: { id: splitId, orderId }
      });

      if (!split) {
        return res.status(404).json({
          success: false,
          message: 'Divisão não encontrada'
        });
      }

      if (split.status === 'paid') {
        return res.status(400).json({
          success: false,
          message: 'Não é possível reatribuir uma parte já paga'
        });
      }

      // Verificar se usuario existe
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      await split.update({ userId });

      res.json({
        success: true,
        message: 'Participante atribuído com sucesso',
        data: {
          split: {
            id: split.id,
            userId: split.userId,
            userName: user.nome,
            amount: parseFloat(split.amount)
          }
        }
      });

    } catch (error) {
      console.error('Erro ao atribuir participante:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao atribuir participante',
        error: error.message
      });
    }
  }

  // DELETE /orders/:id/split - Cancelar divisao
  async cancelSplit(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const { id: orderId } = req.params;

      const order = await Order.findByPk(orderId);

      if (!order) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Pedido não encontrado'
        });
      }

      const splits = await SplitPayment.findAll({
        where: { orderId }
      });

      if (splits.length === 0) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Divisão não encontrada'
        });
      }

      // Verificar se algum pagamento ja foi feito
      const hasPaidSplits = splits.some(s => s.status === 'paid');

      if (hasPaidSplits) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Não é possível cancelar divisão com pagamentos já realizados'
        });
      }

      // Deletar todos os splits
      await SplitPayment.destroy({
        where: { orderId },
        transaction
      });

      // Restaurar paymentMethod do pedido
      await order.update({ paymentMethod: null }, { transaction });

      await transaction.commit();

      res.json({
        success: true,
        message: 'Divisão cancelada com sucesso'
      });

    } catch (error) {
      await transaction.rollback();
      console.error('Erro ao cancelar divisão:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao cancelar divisão',
        error: error.message
      });
    }
  }
}

module.exports = new SplitPaymentController();
