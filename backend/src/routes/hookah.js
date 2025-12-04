const express = require('express');
const router = express.Router();
const hookahController = require('../controllers/hookahController');
const { authenticate } = require('../middlewares/auth.middleware');
const { requireRole } = require('../middlewares/role.middleware');

/**
 * Rotas Públicas (Cliente)
 */

// GET /api/hookah/flavors - Obter todos sabores
router.get('/flavors', hookahController.getFlavors);

// GET /api/hookah/popular-flavors - Sabores populares
router.get('/popular-flavors', hookahController.getPopularFlavors);

// GET /api/hookah/flavors/category/:category - Por categoria
router.get('/flavors/category/:category', hookahController.getFlavorsByCategory);

/**
 * Rotas Protegidas (Staff Bar)
 */

// POST /api/hookah/sessions - Criar nova sessão
router.post(
  '/sessions',
  authenticate,
  requireRole(['bar', 'staff', 'admin']),
  hookahController.createSession
);

// GET /api/hookah/sessions - Listar sessões ativas
router.get(
  '/sessions',
  authenticate,
  requireRole(['bar', 'staff', 'admin']),
  hookahController.getActiveSessions
);

// GET /api/hookah/sessions/:id - Detalhes de uma sessão
router.get(
  '/sessions/:id',
  authenticate,
  requireRole(['bar', 'staff', 'admin']),
  hookahController.getSessionDetails
);

// PUT /api/hookah/sessions/:id/coal - Registrar troca de carvão
router.put(
  '/sessions/:id/coal',
  authenticate,
  requireRole(['bar', 'staff', 'admin']),
  hookahController.registerCoalChange
);

// PUT /api/hookah/sessions/:id/pause - Pausar sessão
router.put(
  '/sessions/:id/pause',
  authenticate,
  requireRole(['bar', 'staff', 'admin']),
  hookahController.pauseSession
);

// PUT /api/hookah/sessions/:id/resume - Retomar sessão
router.put(
  '/sessions/:id/resume',
  authenticate,
  requireRole(['bar', 'staff', 'admin']),
  hookahController.resumeSession
);

// PUT /api/hookah/sessions/:id/end - Finalizar sessão
router.put(
  '/sessions/:id/end',
  authenticate,
  requireRole(['bar', 'staff', 'admin']),
  hookahController.endSession
);

/**
 * Rotas Admin (Relatórios)
 */

// GET /api/hookah/history - Histórico de sessões
router.get(
  '/history',
  authenticate,
  requireRole(['admin']),
  hookahController.getHistory
);

// GET /api/hookah/revenue-report - Relatório de receita
router.get(
  '/revenue-report',
  authenticate,
  requireRole(['admin']),
  hookahController.getRevenueReport
);

module.exports = router;
