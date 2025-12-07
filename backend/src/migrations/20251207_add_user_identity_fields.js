/**
 * Migration: Adicionar campos de identidade e país ao usuário
 * Sprint 41 - Cadastro completo com CPF/Idade/Telefone Internacional
 *
 * Novos campos:
 * - countryCode: ISO 3166-1 alpha-2 (ex: 'BR', 'US')
 * - foreignId: Documento de identidade para estrangeiros
 * - birthDate já existe, mas garantir que está como DATEONLY
 */

const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Verificar se a coluna countryCode existe
      const tableInfo = await queryInterface.describeTable('users');

      // Adicionar countryCode se não existir
      if (!tableInfo.countryCode) {
        await queryInterface.addColumn('users', 'countryCode', {
          type: DataTypes.STRING(2),
          allowNull: true,
          comment: 'Código ISO 3166-1 alpha-2 do país (ex: BR, US, PT)'
        }, { transaction });
        console.log('✓ Coluna countryCode adicionada');
      }

      // Adicionar foreignId se não existir
      if (!tableInfo.foreignId) {
        await queryInterface.addColumn('users', 'foreignId', {
          type: DataTypes.STRING(30),
          allowNull: true,
          comment: 'Documento de identidade para estrangeiros (passaporte, RNE, etc.)'
        }, { transaction });
        console.log('✓ Coluna foreignId adicionada');
      }

      // Verificar e garantir que birthDate é DATEONLY (não DATE com hora)
      // A coluna birthDate já existe, mas pode precisar ser verificada
      if (tableInfo.birthDate) {
        console.log('✓ Coluna birthDate já existe');
      }

      await transaction.commit();
      console.log('✅ Migration 20251207_add_user_identity_fields concluída com sucesso');

    } catch (error) {
      await transaction.rollback();
      console.error('❌ Erro na migration:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeColumn('users', 'countryCode', { transaction });
      await queryInterface.removeColumn('users', 'foreignId', { transaction });

      await transaction.commit();
      console.log('✅ Rollback da migration concluído');

    } catch (error) {
      await transaction.rollback();
      console.error('❌ Erro no rollback:', error);
      throw error;
    }
  }
};
