/**
 * Migração para adicionar campos de timeline ao modelo Order
 * Campos: confirmedAt, pickedUpAt, cancelledAt, cancelledBy
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Verificar se colunas já existem
      const tableInfo = await queryInterface.describeTable('orders');

      // Adicionar confirmedAt se não existe
      if (!tableInfo.confirmedAt) {
        await queryInterface.addColumn('orders', 'confirmedAt', {
          type: Sequelize.DATE,
          allowNull: true
        }, { transaction });
        console.log('✅ Coluna confirmedAt adicionada');
      }

      // Adicionar pickedUpAt se não existe
      if (!tableInfo.pickedUpAt) {
        await queryInterface.addColumn('orders', 'pickedUpAt', {
          type: Sequelize.DATE,
          allowNull: true
        }, { transaction });
        console.log('✅ Coluna pickedUpAt adicionada');
      }

      // Adicionar cancelledAt se não existe
      if (!tableInfo.cancelledAt) {
        await queryInterface.addColumn('orders', 'cancelledAt', {
          type: Sequelize.DATE,
          allowNull: true
        }, { transaction });
        console.log('✅ Coluna cancelledAt adicionada');
      }

      // Adicionar cancelledBy se não existe
      if (!tableInfo.cancelledBy) {
        await queryInterface.addColumn('orders', 'cancelledBy', {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id'
          }
        }, { transaction });
        console.log('✅ Coluna cancelledBy adicionada');
      }

      await transaction.commit();
      console.log('✅ Migração de timeline concluída com sucesso');
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Erro na migração:', error.message);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeColumn('orders', 'confirmedAt', { transaction });
      await queryInterface.removeColumn('orders', 'pickedUpAt', { transaction });
      await queryInterface.removeColumn('orders', 'cancelledAt', { transaction });
      await queryInterface.removeColumn('orders', 'cancelledBy', { transaction });
      await transaction.commit();
      console.log('✅ Rollback de timeline concluído');
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
