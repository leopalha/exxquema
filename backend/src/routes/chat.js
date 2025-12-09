/**
 * Sprint 56: Rotas de Chat staff-cliente
 */
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { Message, User, Order } = require('../models');

// GET /chat/:orderId - Buscar mensagens de um pedido
router.get('/:orderId', authenticate, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    // Verificar se usuario tem acesso ao pedido
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido nao encontrado'
      });
    }

    // Apenas dono do pedido ou staff podem ver mensagens
    const isOwner = order.userId === userId;
    const isStaff = ['admin', 'atendente', 'cozinha', 'bar', 'barman', 'caixa'].includes(req.user.role);

    if (!isOwner && !isStaff) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    // Buscar mensagens
    const messages = await Message.findAll({
      where: { orderId },
      include: [{
        model: User,
        as: 'sender',
        attributes: ['id', 'nome', 'role']
      }],
      order: [['createdAt', 'ASC']]
    });

    // Marcar mensagens como lidas
    await Message.update(
      { isRead: true, readAt: new Date() },
      {
        where: {
          orderId,
          senderId: { [require('sequelize').Op.ne]: userId },
          isRead: false
        }
      }
    );

    res.json({
      success: true,
      data: {
        messages: messages.map(m => ({
          id: m.id,
          orderId: m.orderId,
          senderId: m.senderId,
          senderName: m.sender?.nome,
          senderType: m.senderType,
          senderRole: m.sender?.role,
          content: m.content,
          messageType: m.messageType,
          isRead: m.isRead,
          createdAt: m.createdAt
        })),
        orderNumber: order.orderNumber
      }
    });
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar mensagens'
    });
  }
});

// POST /chat/:orderId - Enviar mensagem
router.post('/:orderId', authenticate, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { content, messageType = 'text' } = req.body;
    const userId = req.user.id;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Mensagem não pode estar vazia'
      });
    }

    // Verificar se usuario tem acesso ao pedido
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    // Apenas dono do pedido ou staff podem enviar mensagens
    const isOwner = order.userId === userId;
    const isStaff = ['admin', 'atendente', 'cozinha', 'bar', 'barman', 'caixa'].includes(req.user.role);

    if (!isOwner && !isStaff) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    // Determinar tipo do remetente
    const senderType = isStaff ? 'staff' : 'cliente';

    // Criar mensagem
    const message = await Message.create({
      orderId,
      senderId: userId,
      senderType,
      content: content.trim(),
      messageType
    });

    // Buscar dados do sender
    const sender = await User.findByPk(userId, {
      attributes: ['id', 'nome', 'role']
    });

    const responseMessage = {
      id: message.id,
      orderId: message.orderId,
      senderId: message.senderId,
      senderName: sender?.nome,
      senderType: message.senderType,
      senderRole: sender?.role,
      content: message.content,
      messageType: message.messageType,
      isRead: message.isRead,
      createdAt: message.createdAt
    };

    res.status(201).json({
      success: true,
      data: { message: responseMessage }
    });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao enviar mensagem'
    });
  }
});

// GET /chat - Listar pedidos com chats ativos (para staff)
router.get('/', authenticate, async (req, res) => {
  try {
    const isStaff = ['admin', 'atendente', 'cozinha', 'bar', 'barman', 'caixa'].includes(req.user.role);

    if (!isStaff) {
      return res.status(403).json({
        success: false,
        message: 'Acesso apenas para staff'
      });
    }

    // Sprint 58: Buscar mensagens não lidas sem GROUP BY (compatível com SQLite)
    const unreadMessages = await Message.findAll({
      where: {
        senderType: 'cliente',
        isRead: false
      },
      attributes: ['orderId'],
      raw: true
    });

    // Obter orderIds únicos
    const uniqueOrderIds = [...new Set(unreadMessages.map(m => m.orderId))];

    // Formatar resposta
    const chats = [];

    for (const orderId of uniqueOrderIds) {
      // Buscar pedido com customer
      const order = await Order.findByPk(orderId, {
        include: [{
          model: User,
          as: 'customer',
          attributes: ['id', 'nome']
        }]
      });

      if (!order) continue;

      // Contar mensagens nao lidas
      const unreadCount = await Message.count({
        where: {
          orderId,
          senderType: 'cliente',
          isRead: false
        }
      });

      // Ultima mensagem
      const lastMessage = await Message.findOne({
        where: { orderId },
        order: [['createdAt', 'DESC']]
      });

      chats.push({
        orderId,
        orderNumber: order.orderNumber,
        customerName: order.customer?.nome,
        unreadCount,
        lastMessage: lastMessage?.content?.substring(0, 50),
        lastMessageAt: lastMessage?.createdAt
      });
    }

    res.json({
      success: true,
      data: { chats }
    });
  } catch (error) {
    console.error('Erro ao listar chats:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao listar chats'
    });
  }
});

module.exports = router;
