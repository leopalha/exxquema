'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Alterar coluna tableId para permitir NULL
    await queryInterface.changeColumn('orders', 'tableId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'tables',
        key: 'id'
      }
    });
    console.log('✅ Coluna tableId alterada para permitir NULL');
  },

  async down(queryInterface, Sequelize) {
    // Reverter para NOT NULL (cuidado: pode falhar se houver registros com NULL)
    await queryInterface.changeColumn('orders', 'tableId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'tables',
        key: 'id'
      }
    });
  }
};
