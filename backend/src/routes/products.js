const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, requireRole } = require('../middlewares/auth.middleware');

// Rotas públicas (sem autenticação)
router.get('/', productController.getProducts);
router.get('/categories', productController.getCategories);
router.get('/featured', productController.getFeaturedProducts);
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
