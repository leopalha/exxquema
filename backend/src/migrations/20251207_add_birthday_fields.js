/**
 * Migration: Add birthday fields to users
 * Adiciona campos para bônus de aniversário
 */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Verificar se as colunas já existem
      const tableInfo = await queryInterface.describeTable('users');

      if (!tableInfo.birthDate) {
        await queryInterface.addColumn('users', 'birthDate', {
          type: Sequelize.DATEONLY,
          allowNull: true,
          comment: 'Data de nascimento do usuário'
        }, { transaction });
        console.log('✅ Coluna birthDate adicionada');
      }

      if (!tableInfo.lastBirthdayBonusYear) {
        await queryInterface.addColumn('users', 'lastBirthdayBonusYear', {
          type: Sequelize.INTEGER,
          allowNull: true,
          comment: 'Último ano em que recebeu bônus de aniversário'
        }, { transaction });
        console.log('✅ Coluna lastBirthdayBonusYear adicionada');
      }

      await transaction.commit();
      console.log('✅ Migration birthday fields concluída com sucesso');
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Erro na migration:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeColumn('users', 'birthDate', { transaction });
      await queryInterface.removeColumn('users', 'lastBirthdayBonusYear', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
