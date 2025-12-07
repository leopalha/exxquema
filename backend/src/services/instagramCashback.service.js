/**
 * Instagram Cashback Service
 * Sprint 44 - Sistema de cashback para posts no Instagram marcando @flamelounge_
 *
 * Fluxo:
 * 1. Cliente faz pedido e recebe 5% de cashback potencial
 * 2. Cliente posta foto no Instagram marcando @flamelounge_
 * 3. Cliente submete link do post no sistema
 * 4. Staff verifica manualmente se o post é válido
 * 5. Se aprovado, 5% do valor do pedido é creditado como cashback
 */

const { User, Order, InstagramCashback } = require('../models');
const { Op } = require('sequelize');

// Constantes
const INSTAGRAM_CASHBACK_RATE = 0.05; // 5%
const INSTAGRAM_ACCOUNT = '@flamelounge_';
const CASHBACK_EXPIRY_DAYS = 7; // Dias para submeter o post

class InstagramCashbackService {
  /**
   * Calcula o cashback potencial de um pedido
   * @param {number} orderTotal - Valor total do pedido
   * @returns {number} Valor do cashback potencial
   */
  calculatePotentialCashback(orderTotal) {
    return parseFloat((orderTotal * INSTAGRAM_CASHBACK_RATE).toFixed(2));
  }

  /**
   * Cria uma solicitação de cashback Instagram
   * @param {string} userId - ID do usuário
   * @param {string} orderId - ID do pedido
   * @param {string} instagramPostUrl - URL do post no Instagram
   * @returns {Object} Resultado da operação
   */
  async createCashbackRequest(userId, orderId, instagramPostUrl) {
    try {
      // Validar URL do Instagram
      if (!this.isValidInstagramUrl(instagramPostUrl)) {
        return {
          success: false,
          message: 'URL do Instagram inválida. Use o link direto do post.'
        };
      }

      // Buscar pedido
      const order = await Order.findOne({
        where: { id: orderId, userId }
      });

      if (!order) {
        return { success: false, message: 'Pedido não encontrado' };
      }

      // Verificar se pedido já foi entregue
      if (order.status !== 'delivered') {
        return {
          success: false,
          message: 'Cashback só pode ser solicitado após o pedido ser entregue'
        };
      }

      // Verificar se já existe solicitação para este pedido
      const existingRequest = await InstagramCashback.findOne({
        where: { orderId }
      });

      if (existingRequest) {
        return {
          success: false,
          message: 'Já existe uma solicitação de cashback para este pedido',
          status: existingRequest.status
        };
      }

      // Verificar prazo (7 dias após o pedido)
      const orderDate = new Date(order.createdAt);
      const expiryDate = new Date(orderDate);
      expiryDate.setDate(expiryDate.getDate() + CASHBACK_EXPIRY_DAYS);

      if (new Date() > expiryDate) {
        return {
          success: false,
          message: `Prazo expirado. O post deveria ter sido submetido até ${expiryDate.toLocaleDateString('pt-BR')}`
        };
      }

      // Calcular valor do cashback
      const cashbackAmount = this.calculatePotentialCashback(parseFloat(order.total));

      // Criar solicitação
      const cashbackRequest = await InstagramCashback.create({
        userId,
        orderId,
        instagramPostUrl,
        cashbackAmount,
        status: 'pending', // pending, approved, rejected
        expiresAt: expiryDate
      });

      return {
        success: true,
        message: 'Solicitação de cashback enviada! Aguarde a verificação.',
        data: {
          requestId: cashbackRequest.id,
          cashbackAmount,
          status: 'pending'
        }
      };
    } catch (error) {
      console.error('Erro ao criar solicitação de cashback:', error);
      return { success: false, message: 'Erro interno ao processar solicitação' };
    }
  }

  /**
   * Lista solicitações pendentes de cashback (para staff)
   * @returns {Array} Lista de solicitações
   */
  async getPendingRequests() {
    try {
      const requests = await InstagramCashback.findAll({
        where: { status: 'pending' },
        include: [
          { model: User, as: 'user', attributes: ['id', 'nome', 'email'] },
          { model: Order, as: 'order', attributes: ['id', 'orderNumber', 'total', 'createdAt'] }
        ],
        order: [['createdAt', 'ASC']]
      });

      return { success: true, data: requests };
    } catch (error) {
      console.error('Erro ao listar solicitações:', error);
      return { success: false, message: 'Erro ao listar solicitações' };
    }
  }

  /**
   * Aprova uma solicitação de cashback
   * @param {string} requestId - ID da solicitação
   * @param {string} approvedBy - ID do staff que aprovou
   * @returns {Object} Resultado
   */
  async approveRequest(requestId, approvedBy) {
    try {
      const request = await InstagramCashback.findByPk(requestId);

      if (!request) {
        return { success: false, message: 'Solicitação não encontrada' };
      }

      if (request.status !== 'pending') {
        return { success: false, message: 'Solicitação já foi processada' };
      }

      // Atualizar status
      await request.update({
        status: 'approved',
        approvedBy,
        approvedAt: new Date()
      });

      // Creditar cashback no saldo do usuário
      const user = await User.findByPk(request.userId);
      if (user) {
        const currentBalance = parseFloat(user.cashbackBalance) || 0;
        await user.update({
          cashbackBalance: currentBalance + request.cashbackAmount
        });

        console.log(`✅ Cashback Instagram aprovado: R$ ${request.cashbackAmount} para usuário ${user.nome}`);
      }

      return {
        success: true,
        message: 'Cashback aprovado e creditado!',
        data: {
          cashbackAmount: request.cashbackAmount,
          userId: request.userId
        }
      };
    } catch (error) {
      console.error('Erro ao aprovar cashback:', error);
      return { success: false, message: 'Erro ao aprovar cashback' };
    }
  }

  /**
   * Rejeita uma solicitação de cashback
   * @param {string} requestId - ID da solicitação
   * @param {string} rejectedBy - ID do staff que rejeitou
   * @param {string} reason - Motivo da rejeição
   * @returns {Object} Resultado
   */
  async rejectRequest(requestId, rejectedBy, reason) {
    try {
      const request = await InstagramCashback.findByPk(requestId);

      if (!request) {
        return { success: false, message: 'Solicitação não encontrada' };
      }

      if (request.status !== 'pending') {
        return { success: false, message: 'Solicitação já foi processada' };
      }

      await request.update({
        status: 'rejected',
        rejectedBy,
        rejectedAt: new Date(),
        rejectionReason: reason
      });

      return {
        success: true,
        message: 'Solicitação rejeitada',
        data: { reason }
      };
    } catch (error) {
      console.error('Erro ao rejeitar cashback:', error);
      return { success: false, message: 'Erro ao rejeitar cashback' };
    }
  }

  /**
   * Lista solicitações de um usuário
   * @param {string} userId - ID do usuário
   * @returns {Array} Lista de solicitações
   */
  async getUserRequests(userId) {
    try {
      const requests = await InstagramCashback.findAll({
        where: { userId },
        include: [
          { model: Order, as: 'order', attributes: ['id', 'orderNumber', 'total', 'createdAt'] }
        ],
        order: [['createdAt', 'DESC']]
      });

      return { success: true, data: requests };
    } catch (error) {
      console.error('Erro ao listar solicitações do usuário:', error);
      return { success: false, message: 'Erro ao listar solicitações' };
    }
  }

  /**
   * Verifica se pedido é elegível para cashback Instagram
   * @param {string} orderId - ID do pedido
   * @returns {Object} Elegibilidade
   */
  async checkEligibility(orderId) {
    try {
      const order = await Order.findByPk(orderId);

      if (!order) {
        return { eligible: false, reason: 'Pedido não encontrado' };
      }

      // Verificar status
      if (order.status !== 'delivered') {
        return { eligible: false, reason: 'Pedido ainda não foi entregue' };
      }

      // Verificar se já existe solicitação
      const existingRequest = await InstagramCashback.findOne({
        where: { orderId }
      });

      if (existingRequest) {
        return {
          eligible: false,
          reason: 'Já existe solicitação para este pedido',
          existingStatus: existingRequest.status
        };
      }

      // Verificar prazo
      const orderDate = new Date(order.createdAt);
      const expiryDate = new Date(orderDate);
      expiryDate.setDate(expiryDate.getDate() + CASHBACK_EXPIRY_DAYS);

      if (new Date() > expiryDate) {
        return { eligible: false, reason: 'Prazo expirado' };
      }

      const potentialCashback = this.calculatePotentialCashback(parseFloat(order.total));

      return {
        eligible: true,
        potentialCashback,
        expiresAt: expiryDate,
        instagramAccount: INSTAGRAM_ACCOUNT
      };
    } catch (error) {
      console.error('Erro ao verificar elegibilidade:', error);
      return { eligible: false, reason: 'Erro ao verificar' };
    }
  }

  /**
   * Valida URL do Instagram
   * @param {string} url - URL para validar
   * @returns {boolean}
   */
  isValidInstagramUrl(url) {
    if (!url) return false;

    // Aceita formatos:
    // https://www.instagram.com/p/XXXXX/
    // https://instagram.com/p/XXXXX/
    // https://www.instagram.com/reel/XXXXX/
    const instagramRegex = /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[a-zA-Z0-9_-]+\/?/i;
    return instagramRegex.test(url);
  }
}

module.exports = new InstagramCashbackService();
