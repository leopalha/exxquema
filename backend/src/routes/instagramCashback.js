/**
 * Rotas do Instagram Cashback
 * Sprint 44 - Cashback 5% para posts no Instagram
 */

const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middlewares/auth.middleware');
const instagramCashbackService = require('../services/instagramCashback.service');

/**
 * POST /api/instagram-cashback
 * Cliente submete link do post para ganhar cashback
 */
router.post('/', auth, async (req, res) => {
  try {
    const { orderId, instagramPostUrl } = req.body;
    const userId = req.user.id;

    if (!orderId || !instagramPostUrl) {
      return res.status(400).json({
        success: false,
        message: 'orderId e instagramPostUrl são obrigatórios'
      });
    }

    const result = await instagramCashbackService.createCashbackRequest(
      userId,
      orderId,
      instagramPostUrl
    );

    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    console.error('Erro ao criar solicitação de cashback:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * GET /api/instagram-cashback/my-requests
 * Lista solicitações do usuário logado
 */
router.get('/my-requests', auth, async (req, res) => {
  try {
    const result = await instagramCashbackService.getUserRequests(req.user.id);
    res.json(result);
  } catch (error) {
    console.error('Erro ao listar solicitações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * GET /api/instagram-cashback/check/:orderId
 * Verifica se pedido é elegível para cashback
 */
router.get('/check/:orderId', auth, async (req, res) => {
  try {
    const result = await instagramCashbackService.checkEligibility(req.params.orderId);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Erro ao verificar elegibilidade:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ============= ROTAS ADMINISTRATIVAS =============

/**
 * GET /api/instagram-cashback/pending
 * Lista solicitações pendentes (para staff)
 */
router.get('/pending', auth, authorize(['admin', 'gerente', 'atendente']), async (req, res) => {
  try {
    const result = await instagramCashbackService.getPendingRequests();
    res.json(result);
  } catch (error) {
    console.error('Erro ao listar pendentes:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * POST /api/instagram-cashback/:requestId/approve
 * Aprova uma solicitação de cashback
 */
router.post('/:requestId/approve', auth, authorize(['admin', 'gerente', 'atendente']), async (req, res) => {
  try {
    const result = await instagramCashbackService.approveRequest(
      req.params.requestId,
      req.user.id
    );
    res.json(result);
  } catch (error) {
    console.error('Erro ao aprovar:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * POST /api/instagram-cashback/:requestId/reject
 * Rejeita uma solicitação de cashback
 */
router.post('/:requestId/reject', auth, authorize(['admin', 'gerente', 'atendente']), async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Motivo da rejeição é obrigatório'
      });
    }

    const result = await instagramCashbackService.rejectRequest(
      req.params.requestId,
      req.user.id,
      reason
    );
    res.json(result);
  } catch (error) {
    console.error('Erro ao rejeitar:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
