/**
 * IngredientMovement Model - FLAME Lounge Bar
 * Registra todas as movimentações de estoque de insumos
 */

const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class IngredientMovement extends Model {}

IngredientMovement.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  ingredientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'ingredients',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['entrada', 'saida', 'ajuste', 'perda', 'transferencia']]
    },
    comment: 'Tipo de movimentação'
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: false,
    comment: 'Quantidade movimentada (positivo ou negativo)'
  },
  previousStock: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
    comment: 'Estoque antes da movimentação'
  },
  newStock: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
    comment: 'Estoque após a movimentação'
  },
  reason: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      isIn: [['compra', 'producao', 'vencimento', 'quebra', 'inventario', 'devolucao', 'outro']]
    },
    comment: 'Motivo da movimentação'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Descrição detalhada'
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'orders',
      key: 'id'
    },
    comment: 'Pedido relacionado (se for saída por venda)'
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Usuário que realizou a movimentação'
  },
  unitCost: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: true,
    comment: 'Custo unitário no momento (para entradas)'
  },
  totalCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Custo total da movimentação'
  },
  supplierInvoice: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Número da nota fiscal (para compras)'
  },
  expirationDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'Data de validade do lote (para entradas)'
  },
  batchNumber: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Número do lote'
  }
}, {
  sequelize,
  modelName: 'IngredientMovement',
  tableName: 'ingredient_movements',
  timestamps: true,
  indexes: [
    { fields: ['ingredientId'] },
    { fields: ['type'] },
    { fields: ['orderId'] },
    { fields: ['userId'] },
    { fields: ['createdAt'] }
  ]
});

module.exports = IngredientMovement;
