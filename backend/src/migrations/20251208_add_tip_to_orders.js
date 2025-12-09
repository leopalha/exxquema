/**
 * Migration: Adicionar campo tip (gorjeta) na tabela orders
 * Sprint 56: Opcao de gorjeta no checkout
 * Data: 08/12/2024
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('orders');

    // Adicionar campo tip se não existir
    if (!tableInfo.tip) {
      await queryInterface.addColumn('orders', 'tip', {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Gorjeta opcional do cliente'
      });
      console.log('✅ Coluna tip adicionada à tabela orders');
    } else {
      console.log('ℹ️ Coluna tip já existe na tabela orders');
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orders', 'tip');
    console.log('✅ Coluna tip removida da tabela orders');
  }
};
