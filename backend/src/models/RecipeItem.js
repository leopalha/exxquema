/**
 * RecipeItem Model - FLAME Lounge Bar
 * Representa a ficha técnica - associação entre Produto e Insumos
 * Define quanto de cada insumo é necessário para produzir um produto
 */

const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class RecipeItem extends Model {
  // Calcular custo deste item na receita
  async calculateCost() {
    const Ingredient = require('./Ingredient');
    const ingredient = await Ingredient.findByPk(this.ingredientId);
    if (!ingredient) return 0;

    return parseFloat(ingredient.costPerUnit) * parseFloat(this.quantity);
  }

  // Verificar se há estoque suficiente para produzir
  async hasEnoughStock(portions = 1) {
    const Ingredient = require('./Ingredient');
    const ingredient = await Ingredient.findByPk(this.ingredientId);
    if (!ingredient) return false;

    const required = parseFloat(this.quantity) * portions;
    return parseFloat(ingredient.currentStock) >= required;
  }
}

RecipeItem.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    },
    comment: 'Produto que usa este insumo'
  },
  ingredientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'ingredients',
      key: 'id'
    },
    comment: 'Insumo utilizado'
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: false,
    comment: 'Quantidade do insumo por unidade do produto'
  },
  unit: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'Unidade de medida (deve ser compatível com o insumo)'
  },
  isOptional: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Se é um ingrediente opcional'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Observações (ex: pode substituir por X)'
  },
  preparationNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Instruções de preparo específicas para este ingrediente'
  }
}, {
  sequelize,
  modelName: 'RecipeItem',
  tableName: 'recipe_items',
  timestamps: true,
  indexes: [
    { fields: ['productId'] },
    { fields: ['ingredientId'] },
    {
      fields: ['productId', 'ingredientId'],
      unique: true,
      name: 'unique_product_ingredient'
    }
  ]
});

module.exports = RecipeItem;
