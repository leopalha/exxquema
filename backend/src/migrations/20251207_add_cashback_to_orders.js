/**
 * Migration: Add cashback fields to orders
 * Adiciona campos para suporte ao uso de cashback como desconto
 */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Verificar se as colunas já existem
      const tableInfo = await queryInterface.describeTable('orders');

      if (!tableInfo.cashbackUsed) {
        await queryInterface.addColumn('orders', 'cashbackUsed', {
          type: Sequelize.DECIMAL(8, 2),
          allowNull: false,
          defaultValue: 0,
          comment: 'Valor de cashback usado como desconto'
        }, { transaction });
        console.log('✅ Coluna cashbackUsed adicionada');
      }

      if (!tableInfo.discount) {
        await queryInterface.addColumn('orders', 'discount', {
          type: Sequelize.DECIMAL(8, 2),
          allowNull: false,
          defaultValue: 0,
          comment: 'Desconto total aplicado'
        }, { transaction });
        console.log('✅ Coluna discount adicionada');
      }

      await transaction.commit();
      console.log('✅ Migration cashback concluída com sucesso');
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Erro na migration:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeColumn('orders', 'cashbackUsed', { transaction });
      await queryInterface.removeColumn('orders', 'discount', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
