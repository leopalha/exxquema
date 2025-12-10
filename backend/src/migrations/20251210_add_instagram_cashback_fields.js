/**
 * Migration: Adicionar campos de Instagram Cashback na tabela orders
 * Sprint 59: Sistema de Cashback Instagram (5% extra)
 * Data: 10/12/2024
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('orders');

    // Adicionar campo wantsInstagramCashback se não existir
    if (!tableInfo.wantsInstagramCashback) {
      await queryInterface.addColumn('orders', 'wantsInstagramCashback', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: 'Se cliente quer participar do cashback Instagram (5% extra)'
      });
      console.log('✅ Coluna wantsInstagramCashback adicionada à tabela orders');
    } else {
      console.log('ℹ️ Coluna wantsInstagramCashback já existe na tabela orders');
    }

    // Adicionar campo instagramCashbackStatus se não existir
    if (!tableInfo.instagramCashbackStatus) {
      await queryInterface.addColumn('orders', 'instagramCashbackStatus', {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: 'Status da validação do cashback Instagram (pending_validation, validated, rejected)'
      });
      console.log('✅ Coluna instagramCashbackStatus adicionada à tabela orders');
    } else {
      console.log('ℹ️ Coluna instagramCashbackStatus já existe na tabela orders');
    }

    // Adicionar campo instagramValidatedBy se não existir
    if (!tableInfo.instagramValidatedBy) {
      await queryInterface.addColumn('orders', 'instagramValidatedBy', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        comment: 'Atendente que validou o cashback Instagram'
      });
      console.log('✅ Coluna instagramValidatedBy adicionada à tabela orders');
    } else {
      console.log('ℹ️ Coluna instagramValidatedBy já existe na tabela orders');
    }

    // Adicionar campo instagramValidatedAt se não existir
    if (!tableInfo.instagramValidatedAt) {
      await queryInterface.addColumn('orders', 'instagramValidatedAt', {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Quando o cashback Instagram foi validado'
      });
      console.log('✅ Coluna instagramValidatedAt adicionada à tabela orders');
    } else {
      console.log('ℹ️ Coluna instagramValidatedAt já existe na tabela orders');
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orders', 'wantsInstagramCashback');
    await queryInterface.removeColumn('orders', 'instagramCashbackStatus');
    await queryInterface.removeColumn('orders', 'instagramValidatedBy');
    await queryInterface.removeColumn('orders', 'instagramValidatedAt');
    console.log('✅ Colunas de Instagram Cashback removidas da tabela orders');
  }
};
