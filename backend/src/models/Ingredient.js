/**
 * Ingredient Model - FLAME Lounge Bar
 * Representa insumos (ingredientes) usados nas receitas dos produtos
 */

const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Ingredient extends Model {
  // Verificar se estoque está baixo
  isLowStock() {
    return parseFloat(this.currentStock) <= parseFloat(this.minStock);
  }

  // Verificar se está sem estoque
  isOutOfStock() {
    return parseFloat(this.currentStock) <= 0;
  }

  // Calcular quantidade disponível para produção
  getAvailablePortions(portionSize) {
    if (!portionSize || portionSize <= 0) return 0;
    return Math.floor(parseFloat(this.currentStock) / portionSize);
  }
}

Ingredient.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Nome do insumo (ex: Tomate, Queijo Mussarela)'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Descrição detalhada do insumo'
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'geral',
    comment: 'Categoria do insumo (proteinas, vegetais, laticinios, etc)'
  },
  unit: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'un',
    comment: 'Unidade de medida (kg, g, ml, l, un)'
  },
  currentStock: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
    defaultValue: 0,
    comment: 'Estoque atual'
  },
  minStock: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
    defaultValue: 0,
    comment: 'Estoque mínimo para alerta'
  },
  maxStock: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: true,
    comment: 'Estoque máximo (capacidade)'
  },
  costPerUnit: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: false,
    defaultValue: 0,
    comment: 'Custo por unidade (para cálculo de CMV)'
  },
  supplier: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Fornecedor principal'
  },
  supplierCode: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Código do produto no fornecedor'
  },
  lastPurchaseDate: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Data da última compra'
  },
  lastPurchasePrice: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: true,
    comment: 'Preço da última compra'
  },
  expirationDays: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Dias para vencimento após compra (perecíveis)'
  },
  storageLocation: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Local de armazenamento (geladeira, freezer, despensa)'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Se o insumo está ativo no sistema'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Observações gerais'
  }
}, {
  sequelize,
  modelName: 'Ingredient',
  tableName: 'ingredients',
  timestamps: true,
  indexes: [
    { fields: ['name'] },
    { fields: ['category'] },
    { fields: ['isActive'] },
    { fields: ['currentStock'] }
  ]
});

module.exports = Ingredient;
