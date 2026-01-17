/**
 * Migration: Add performance indexes for User, Product, and Order models
 *
 * Objetivo: Otimizar queries frequentes e eliminar problemas de N+1
 *
 * Indexes adicionados:
 * - Users: role, loyaltyTier, totalSpent, createdAt
 * - Products: isPromotional, isSignature, hasStock, composite indexes
 * - Orders: Já possuem indexes adequados (userId, tableId, status, paymentStatus, createdAt)
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // =====================
    // USERS INDEXES
    // =====================

    // Index para role (queries de staff)
    await queryInterface.addIndex('users', ['role'], {
      name: 'idx_users_role',
      where: { role: { [Sequelize.Op.ne]: 'cliente' } }
    });

    // Index para loyaltyTier (segmentação de clientes)
    await queryInterface.addIndex('users', ['loyaltyTier'], {
      name: 'idx_users_loyalty_tier'
    });

    // Index para totalSpent (ordenação e tier calculation)
    await queryInterface.addIndex('users', ['totalSpent'], {
      name: 'idx_users_total_spent'
    });

    // Index para createdAt (relatórios e analytics)
    await queryInterface.addIndex('users', ['createdAt'], {
      name: 'idx_users_created_at'
    });

    // =====================
    // PRODUCTS INDEXES
    // =====================

    // Index para isPromotional (produtos em promoção)
    await queryInterface.addIndex('products', ['isPromotional'], {
      name: 'idx_products_promotional',
      where: { isPromotional: true, isActive: true }
    });

    // Index para isSignature (produtos assinatura)
    await queryInterface.addIndex('products', ['isSignature'], {
      name: 'idx_products_signature',
      where: { isSignature: true, isActive: true }
    });

    // Index para hasStock (controle de estoque)
    await queryInterface.addIndex('products', ['hasStock'], {
      name: 'idx_products_has_stock',
      where: { hasStock: true }
    });

    // Composite index: category + isActive (query mais comum)
    await queryInterface.addIndex('products', ['category', 'isActive'], {
      name: 'idx_products_category_active'
    });

    // Composite index: produtos em destaque
    await queryInterface.addIndex('products', ['isSignature', 'isActive', 'position'], {
      name: 'idx_products_featured'
    });

    // Composite index: estoque baixo
    await queryInterface.addIndex('products', ['hasStock', 'stock'], {
      name: 'idx_products_low_stock',
      where: { hasStock: true }
    });

    // =====================
    // ORDERS INDEXES (verificação)
    // =====================
    // Orders já possui indexes adequados:
    // - userId
    // - tableId
    // - status
    // - paymentStatus
    // - createdAt

    console.log('✅ Performance indexes criados com sucesso!');
  },

  down: async (queryInterface) => {
    // Remove indexes na ordem reversa
    await queryInterface.removeIndex('products', 'idx_products_low_stock');
    await queryInterface.removeIndex('products', 'idx_products_featured');
    await queryInterface.removeIndex('products', 'idx_products_category_active');
    await queryInterface.removeIndex('products', 'idx_products_has_stock');
    await queryInterface.removeIndex('products', 'idx_products_signature');
    await queryInterface.removeIndex('products', 'idx_products_promotional');

    await queryInterface.removeIndex('users', 'idx_users_created_at');
    await queryInterface.removeIndex('users', 'idx_users_total_spent');
    await queryInterface.removeIndex('users', 'idx_users_loyalty_tier');
    await queryInterface.removeIndex('users', 'idx_users_role');

    console.log('✅ Performance indexes removidos');
  }
};
