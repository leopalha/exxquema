const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate } = require('../middlewares/auth.middleware');

// Rotas públicas (sem autenticação)
router.get('/', productController.getProducts);
router.get('/categories', productController.getCategories);
router.get('/featured', productController.getFeaturedProducts);
router.get('/:id', productController.getProductById);

// Rotas protegidas para funcionários
router.post('/', authenticate, productController.createProduct);
router.put('/:id', authenticate, productController.updateProduct);
router.patch('/:id/deactivate', authenticate, productController.deactivateProduct);
router.patch('/:id/activate', authenticate, productController.activateProduct);
router.patch('/:id/stock', authenticate, productController.updateStock);
router.get('/stock/low', authenticate, productController.getLowStockProducts);

module.exports = router;
