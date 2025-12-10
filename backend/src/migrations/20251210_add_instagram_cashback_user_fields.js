/**
 * Migration: Adicionar campos de controle Instagram Cashback na tabela users
 * Sprint 59: Sistema de Cashback Instagram com regras especiais
 *
 * Regras:
 * - cashbackEnabled: Habilitado após 1ª validação Instagram
 * - lastInstagramCashbackAt: Controle de 1x por semana
 * - instagramValidationsCount: Histórico de validações
 *
 * Data: 10/12/2024
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('users');

    // Adicionar campo cashbackEnabled se não existir
    if (!tableInfo.cashbackEnabled) {
      await queryInterface.addColumn('users', 'cashbackEnabled', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: 'Se o sistema de cashback está habilitado (após 1ª validação Instagram)'
      });
      console.log('✅ Coluna cashbackEnabled adicionada à tabela users');
    } else {
      console.log('ℹ️ Coluna cashbackEnabled já existe na tabela users');
    }

    // Adicionar campo lastInstagramCashbackAt se não existir
    if (!tableInfo.lastInstagramCashbackAt) {
      await queryInterface.addColumn('users', 'lastInstagramCashbackAt', {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Data da última validação Instagram (limite 1x por semana)'
      });
      console.log('✅ Coluna lastInstagramCashbackAt adicionada à tabela users');
    } else {
      console.log('ℹ️ Coluna lastInstagramCashbackAt já existe na tabela users');
    }

    // Adicionar campo instagramValidationsCount se não existir
    if (!tableInfo.instagramValidationsCount) {
      await queryInterface.addColumn('users', 'instagramValidationsCount', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
        comment: 'Total de validações Instagram realizadas'
      });
      console.log('✅ Coluna instagramValidationsCount adicionada à tabela users');
    } else {
      console.log('ℹ️ Coluna instagramValidationsCount já existe na tabela users');
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'cashbackEnabled');
    await queryInterface.removeColumn('users', 'lastInstagramCashbackAt');
    await queryInterface.removeColumn('users', 'instagramValidationsCount');
    console.log('✅ Colunas de Instagram Cashback removidas da tabela users');
  }
};
