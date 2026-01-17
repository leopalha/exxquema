const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, requireRole } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Listar produtos
 *     description: Retorna lista de produtos do cardápio com filtros opcionais
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [drinks, food, narguile, special]
 *         description: Filtrar por categoria
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *         description: Filtrar por disponibilidade
 *     responses:
 *       200:
 *         description: Lista de produtos
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
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 */
router.get('/', productController.getProducts);

/**
 * @swagger
 * /api/products/categories:
 *   get:
 *     summary: Listar categorias
 *     description: Retorna lista de categorias de produtos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de categorias
 */
router.get('/categories', productController.getCategories);

/**
 * @swagger
 * /api/products/featured:
 *   get:
 *     summary: Produtos em destaque
 *     description: Retorna produtos marcados como destaque
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de produtos em destaque
 */
router.get('/featured', productController.getFeaturedProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obter produto por ID
 *     description: Retorna detalhes de um produto específico
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Dados do produto
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
 *                     product:
 *                       $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 */
router.get('/:id', productController.getProductById);

// Rotas protegidas - CRUD requer admin ou gerente
// SEGURANÇA: Apenas admin/gerente podem criar/editar/deletar produtos
router.post('/', authenticate, requireRole(['admin', 'gerente']), productController.createProduct);
router.put('/:id', authenticate, requireRole(['admin', 'gerente']), productController.updateProduct);
router.patch('/:id/deactivate', authenticate, requireRole(['admin', 'gerente']), productController.deactivateProduct);
router.patch('/:id/activate', authenticate, requireRole(['admin', 'gerente']), productController.activateProduct);

// Estoque: admin, gerente, ou cozinha/bar podem atualizar
router.patch('/:id/stock', authenticate, requireRole(['admin', 'gerente', 'cozinha', 'bar']), productController.updateStock);
router.get('/stock/low', authenticate, requireRole(['admin', 'gerente', 'cozinha', 'bar']), productController.getLowStockProducts);

module.exports = router;
