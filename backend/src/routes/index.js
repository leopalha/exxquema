const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const productRoutes = require('./products');
const orderRoutes = require('./orders');
const tableRoutes = require('./tables');
const adminRoutes = require('./admin');

// Rota de health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Red Light funcionando',
    timestamp: new Date().toISOString()
  });
});

// Rotas de autenticação
router.use('/auth', authRoutes);

// Rotas de produtos
router.use('/products', productRoutes);

// Rotas de pedidos
router.use('/orders', orderRoutes);

// Rotas de mesas
router.use('/tables', tableRoutes);

// Rotas administrativas
router.use('/admin', adminRoutes);

// Rota não encontrada
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

module.exports = router;