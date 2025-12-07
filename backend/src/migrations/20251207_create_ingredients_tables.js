/**
 * Migration: Create ingredients, recipe_items, and ingredient_movements tables
 * Sistema de Ficha Técnica e Controle de Insumos
 */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // ============== TABELA INGREDIENTS ==============
      const tables = await queryInterface.showAllTables();

      if (!tables.includes('ingredients')) {
        await queryInterface.createTable('ingredients', {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
          },
          name: {
            type: Sequelize.STRING(100),
            allowNull: false
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: true
          },
          category: {
            type: Sequelize.ENUM(
              'bebidas_alcoolicas',
              'bebidas_nao_alcoolicas',
              'carnes',
              'frios',
              'hortifruti',
              'graos_cereais',
              'laticinios',
              'condimentos',
              'descartaveis',
              'limpeza',
              'outros'
            ),
            allowNull: false,
            defaultValue: 'outros'
          },
          unit: {
            type: Sequelize.ENUM('kg', 'g', 'l', 'ml', 'un', 'cx', 'pct', 'dz'),
            allowNull: false,
            defaultValue: 'un'
          },
          currentStock: {
            type: Sequelize.DECIMAL(10, 3),
            allowNull: false,
            defaultValue: 0
          },
          minStock: {
            type: Sequelize.DECIMAL(10, 3),
            allowNull: false,
            defaultValue: 0
          },
          maxStock: {
            type: Sequelize.DECIMAL(10, 3),
            allowNull: true
          },
          costPerUnit: {
            type: Sequelize.DECIMAL(10, 4),
            allowNull: false,
            defaultValue: 0
          },
          lastPurchasePrice: {
            type: Sequelize.DECIMAL(10, 4),
            allowNull: true
          },
          lastPurchaseDate: {
            type: Sequelize.DATE,
            allowNull: true
          },
          supplier: {
            type: Sequelize.STRING(100),
            allowNull: true
          },
          supplierCode: {
            type: Sequelize.STRING(50),
            allowNull: true
          },
          barcode: {
            type: Sequelize.STRING(50),
            allowNull: true
          },
          isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
          },
          expirationAlertDays: {
            type: Sequelize.INTEGER,
            defaultValue: 7
          },
          notes: {
            type: Sequelize.TEXT,
            allowNull: true
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
          }
        }, { transaction });

        // Índices para ingredients
        await queryInterface.addIndex('ingredients', ['name'], { transaction });
        await queryInterface.addIndex('ingredients', ['category'], { transaction });
        await queryInterface.addIndex('ingredients', ['isActive'], { transaction });
        await queryInterface.addIndex('ingredients', ['barcode'], { transaction });

        console.log('✅ Tabela ingredients criada');
      }

      // ============== TABELA RECIPE_ITEMS ==============
      if (!tables.includes('recipe_items')) {
        await queryInterface.createTable('recipe_items', {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
          },
          productId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'products',
              key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
          },
          ingredientId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'ingredients',
              key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
          },
          quantity: {
            type: Sequelize.DECIMAL(10, 4),
            allowNull: false
          },
          unit: {
            type: Sequelize.ENUM('kg', 'g', 'l', 'ml', 'un', 'cx', 'pct', 'dz'),
            allowNull: false
          },
          isOptional: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
          },
          notes: {
            type: Sequelize.TEXT,
            allowNull: true
          },
          preparationNotes: {
            type: Sequelize.TEXT,
            allowNull: true
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
          }
        }, { transaction });

        // Índice único para evitar duplicatas produto-insumo
        await queryInterface.addIndex('recipe_items', ['productId', 'ingredientId'], {
          unique: true,
          name: 'recipe_items_product_ingredient_unique',
          transaction
        });
        await queryInterface.addIndex('recipe_items', ['productId'], { transaction });
        await queryInterface.addIndex('recipe_items', ['ingredientId'], { transaction });

        console.log('✅ Tabela recipe_items criada');
      }

      // ============== TABELA INGREDIENT_MOVEMENTS ==============
      if (!tables.includes('ingredient_movements')) {
        await queryInterface.createTable('ingredient_movements', {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
          },
          ingredientId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'ingredients',
              key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
          },
          type: {
            type: Sequelize.ENUM('entrada', 'saida', 'ajuste', 'perda', 'transferencia'),
            allowNull: false
          },
          quantity: {
            type: Sequelize.DECIMAL(10, 3),
            allowNull: false
          },
          quantityBefore: {
            type: Sequelize.DECIMAL(10, 3),
            allowNull: false
          },
          quantityAfter: {
            type: Sequelize.DECIMAL(10, 3),
            allowNull: false
          },
          unitCost: {
            type: Sequelize.DECIMAL(10, 4),
            allowNull: true
          },
          totalCost: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
          },
          reason: {
            type: Sequelize.ENUM('compra', 'producao', 'vencimento', 'quebra', 'inventario', 'devolucao'),
            allowNull: true
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: true
          },
          orderId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: 'orders',
              key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
          },
          userId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: 'users',
              key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
          },
          invoiceNumber: {
            type: Sequelize.STRING(50),
            allowNull: true
          },
          expirationDate: {
            type: Sequelize.DATEONLY,
            allowNull: true
          },
          batchNumber: {
            type: Sequelize.STRING(50),
            allowNull: true
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
          }
        }, { transaction });

        // Índices para ingredient_movements
        await queryInterface.addIndex('ingredient_movements', ['ingredientId'], { transaction });
        await queryInterface.addIndex('ingredient_movements', ['type'], { transaction });
        await queryInterface.addIndex('ingredient_movements', ['reason'], { transaction });
        await queryInterface.addIndex('ingredient_movements', ['orderId'], { transaction });
        await queryInterface.addIndex('ingredient_movements', ['userId'], { transaction });
        await queryInterface.addIndex('ingredient_movements', ['createdAt'], { transaction });

        console.log('✅ Tabela ingredient_movements criada');
      }

      await transaction.commit();
      console.log('✅ Migration de Ficha Técnica concluída com sucesso');
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Erro na migration:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Remover tabelas na ordem correta (dependências primeiro)
      await queryInterface.dropTable('ingredient_movements', { transaction });
      await queryInterface.dropTable('recipe_items', { transaction });
      await queryInterface.dropTable('ingredients', { transaction });

      await transaction.commit();
      console.log('✅ Rollback de Ficha Técnica concluído');
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
