const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const splitPaymentController = require('../controllers/splitPaymentController');
const { authenticate } = require('../middlewares/auth.middleware');
const { requireCompleteProfile } = require('../middlewares/profileComplete.middleware');
const { body, param, query } = require('express-validator');
const { handleValidationErrors } = require('../middlewares/validation.middleware');

// Validações
const createOrderValidation = [
  body('tableId').optional({ nullable: true }).isUUID().withMessage('ID da mesa inválido'), // tableId é opcional para pedidos de balcão
  body('items').isArray({ min: 1 }).withMessage('Pelo menos um item é obrigatório'),
  body('items.*.productId').isUUID().withMessage('ID do produto é obrigatório'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantidade deve ser maior que zero'),
  body('items.*.notes').optional({ nullable: true }).isString(),
  body('paymentMethod').optional({ nullable: true }).isIn([
    'cash', 'card', 'pix', 'credit', 'debit', 'credit_card', 'debit_card', 'pay_later', 'apple_pay', 'card_at_table', 'split'
  ]).withMessage('Método de pagamento inválido'),
  body('notes').optional({ nullable: true }).isString()
];

const updateOrderStatusValidation = [
  param('id').isUUID().withMessage('ID inválido'),
  body('status').isIn(['pending', 'pending_payment', 'confirmed', 'preparing', 'ready', 'on_way', 'delivered', 'cancelled'])
    .withMessage('Status inválido')
];

// Sprint 58: Adicionado paymentMethod que é obrigatório no frontend do atendente
const confirmAttendantPaymentValidation = [
  param('id').isUUID().withMessage('ID do pedido inválido'),
  body('paymentMethod').isIn(['cash', 'credit', 'debit', 'pix', 'credit_card', 'debit_card'])
    .withMessage('Método de pagamento inválido'),
  body('amountReceived').optional({ nullable: true }).isFloat({ min: 0 }).withMessage('Valor recebido inválido'),
  body('change').optional({ nullable: true }).isFloat({ min: 0 }).withMessage('Troco inválido')
];


const rateOrderValidation = [
  param('id').isUUID().withMessage('ID inválido'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Avaliação deve ser entre 1 e 5'),
  body('review').optional().isString()
];

const confirmPaymentValidation = [
  body('orderId').isUUID().withMessage('ID do pedido é obrigatório'),
  body('paymentId').notEmpty().withMessage('ID do pagamento é obrigatório')
];

// ============================================
// IMPORTANTE: Rotas específicas DEVEM vir ANTES de rotas com parâmetros (:id)
// ============================================

// Rotas específicas (sem parâmetros dinâmicos) - DEVEM VIR PRIMEIRO
router.get('/my-orders',
  authenticate,
  orderController.getUserOrders
);

router.get('/dashboard/metrics',
  authenticate,
  orderController.getDashboardMetrics
);

/**
 * @swagger
 * /api/orders/pending-payments:
 *   get:
 *     summary: Listar pedidos aguardando pagamento
 *     description: Retorna pedidos com status pending_payment (para painel do atendente)
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos aguardando pagamento
 */
router.get('/pending-payments',
  authenticate,
  orderController.getPendingPayments
);

/**
 * @swagger
 * /api/orders/payment/confirm:
 *   post:
 *     summary: Confirmar pagamento de pedido
 *     description: Confirma pagamento e atualiza status do pedido
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - paymentId
 *             properties:
 *               orderId:
 *                 type: string
 *                 format: uuid
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *               paymentId:
 *                 type: string
 *                 example: pi_1234567890
 *     responses:
 *       200:
 *         description: Pagamento confirmado
 */
router.post('/payment/confirm',
  authenticate, // Agora requer autenticação
  confirmPaymentValidation,
  handleValidationErrors,
  orderController.confirmPayment
);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Listar todos os pedidos
 *     description: Retorna lista de pedidos (admin/staff)
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     orders:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Order'
 */
router.get('/',
  authenticate,
  orderController.getAllOrders
);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Criar novo pedido
 *     description: Cria um novo pedido no sistema
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               tableId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: ID da mesa (opcional para pedidos de balcão)
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                       format: uuid
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                     notes:
 *                       type: string
 *                       nullable: true
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, credit, debit, pix, pay_later]
 *                 default: pay_later
 *               notes:
 *                 type: string
 *                 nullable: true
 *               tip:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *               useCashback:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Pedido criado com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     order:
 *                       $ref: '#/components/schemas/Order'
 *       400:
 *         description: Erro de validação
 */
router.post('/',
  authenticate,
  requireCompleteProfile, // Requer perfil completo para fazer pedidos
  createOrderValidation,
  handleValidationErrors,
  orderController.createOrder
);

// ============================================
// Rotas com parâmetros (:id) - DEVEM VIR DEPOIS
// ============================================

router.get('/:id',
  authenticate,
  param('id').isUUID().withMessage('ID inválido'),
  handleValidationErrors,
  orderController.getOrderById
);

router.patch('/:id/cancel',
  authenticate,
  param('id').isUUID().withMessage('ID inválido'),
  handleValidationErrors,
  orderController.cancelOrder
);

router.post('/:id/rate',
  authenticate,
  rateOrderValidation,
  handleValidationErrors,
  orderController.rateOrder
);

// Confirmar pagamento recebido pelo atendente (cash, card_at_table, split)
router.post('/:id/confirm-payment',
  authenticate,
  confirmAttendantPaymentValidation,
  handleValidationErrors,
  orderController.confirmAttendantPayment
);

router.patch('/:id/status',
  authenticate,
  updateOrderStatusValidation,
  handleValidationErrors,
  orderController.updateOrderStatus
);

// Sprint 59: Validar Instagram Cashback (pelo atendente)
const validateInstagramCashbackValidation = [
  param('id').isUUID().withMessage('ID do pedido inválido'),
  body('validated').isBoolean().withMessage('Campo validated é obrigatório')
];

router.patch('/:id/instagram-cashback',
  authenticate,
  validateInstagramCashbackValidation,
  handleValidationErrors,
  orderController.validateInstagramCashback
);

// Sprint 59: Cliente submete link do post do Instagram
const submitInstagramPostValidation = [
  param('id').isUUID().withMessage('ID do pedido inválido'),
  body('postUrl').isString().notEmpty().withMessage('URL do post é obrigatória')
];

router.post('/:id/instagram-submit',
  authenticate,
  submitInstagramPostValidation,
  handleValidationErrors,
  orderController.submitInstagramPost
);

// ============================================
// SPRINT 60: Split Payment Routes (Divisão de Conta)
// ============================================

const createSplitValidation = [
  param('id').isUUID().withMessage('ID do pedido inválido'),
  body('splitType').isIn(['equal', 'custom']).withMessage('Tipo de divisão inválido'),
  body('participants').optional().isInt({ min: 2 }).withMessage('Mínimo 2 participantes'),
  body('splits').optional().isArray({ min: 2 }).withMessage('Mínimo 2 divisões')
];

const paySplitValidation = [
  param('id').isUUID().withMessage('ID do pedido inválido'),
  body('splitId').isUUID().withMessage('ID da divisão inválido'),
  body('paymentMethod').isIn(['cash', 'credit', 'debit', 'pix', 'card_at_table'])
    .withMessage('Método de pagamento inválido')
];

const assignSplitValidation = [
  param('id').isUUID().withMessage('ID do pedido inválido'),
  body('splitId').isUUID().withMessage('ID da divisão inválido'),
  body('userId').isUUID().withMessage('ID do usuário inválido')
];

// POST /:id/split - Criar divisão
router.post(
  '/:id/split',
  authenticate,
  createSplitValidation,
  handleValidationErrors,
  splitPaymentController.createSplit
);

// GET /:id/split - Ver status
router.get(
  '/:id/split',
  authenticate,
  splitPaymentController.getSplitStatus
);

// POST /:id/split/pay - Pagar parte
router.post(
  '/:id/split/pay',
  authenticate,
  paySplitValidation,
  handleValidationErrors,
  splitPaymentController.paySplit
);

// POST /:id/split/assign - Atribuir a usuário
router.post(
  '/:id/split/assign',
  authenticate,
  assignSplitValidation,
  handleValidationErrors,
  splitPaymentController.assignSplit
);

// DELETE /:id/split - Cancelar divisão
router.delete(
  '/:id/split',
  authenticate,
  splitPaymentController.cancelSplit
);

module.exports = router;