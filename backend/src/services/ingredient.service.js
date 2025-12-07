/**
 * Ingredient Service - FLAME Lounge Bar
 * Gerencia operações de insumos e baixa de estoque por receita
 */

const { Ingredient, RecipeItem, IngredientMovement, Product, Order, sequelize } = require('../models');
const { Op } = require('sequelize');

class IngredientService {
  /**
   * Calcula o custo de um produto baseado na ficha técnica
   */
  async calculateProductCost(productId) {
    const recipe = await RecipeItem.findAll({
      where: { productId },
      include: [{
        model: Ingredient,
        as: 'ingredient',
        attributes: ['costPerUnit', 'unit']
      }]
    });

    let totalCost = 0;
    for (const item of recipe) {
      if (item.ingredient) {
        totalCost += parseFloat(item.quantity) * parseFloat(item.ingredient.costPerUnit);
      }
    }

    return totalCost;
  }

  /**
   * Verifica se há estoque suficiente para produzir X unidades de um produto
   */
  async checkStockAvailability(productId, quantity = 1) {
    const recipe = await RecipeItem.findAll({
      where: { productId, isOptional: false },
      include: [{
        model: Ingredient,
        as: 'ingredient',
        attributes: ['id', 'name', 'currentStock', 'unit']
      }]
    });

    const insufficientIngredients = [];

    for (const item of recipe) {
      if (item.ingredient) {
        const required = parseFloat(item.quantity) * quantity;
        const available = parseFloat(item.ingredient.currentStock);

        if (available < required) {
          insufficientIngredients.push({
            ingredientId: item.ingredient.id,
            name: item.ingredient.name,
            required,
            available,
            shortage: required - available,
            unit: item.ingredient.unit
          });
        }
      }
    }

    return {
      hasStock: insufficientIngredients.length === 0,
      insufficientIngredients
    };
  }

  /**
   * Dá baixa nos insumos quando um pedido é criado
   * @param {string} orderId - ID do pedido
   * @param {Array} orderItems - Itens do pedido [{productId, quantity}]
   * @param {string} userId - ID do usuário que fez o pedido
   */
  async deductIngredientsForOrder(orderId, orderItems, userId = null) {
    const transaction = await sequelize.transaction();

    try {
      const movements = [];

      for (const orderItem of orderItems) {
        const recipe = await RecipeItem.findAll({
          where: { productId: orderItem.productId },
          include: [{
            model: Ingredient,
            as: 'ingredient'
          }],
          transaction
        });

        for (const recipeItem of recipe) {
          if (recipeItem.ingredient) {
            const ingredient = recipeItem.ingredient;
            const quantityToDeduct = parseFloat(recipeItem.quantity) * orderItem.quantity;
            const previousStock = parseFloat(ingredient.currentStock);
            const newStock = Math.max(0, previousStock - quantityToDeduct);

            // Atualizar estoque do ingrediente
            await ingredient.update({ currentStock: newStock }, { transaction });

            // Registrar movimento
            const movement = await IngredientMovement.create({
              ingredientId: ingredient.id,
              type: 'saida',
              quantity: -quantityToDeduct,
              previousStock,
              newStock,
              reason: 'producao',
              description: `Pedido #${orderId}`,
              orderId,
              userId,
              unitCost: ingredient.costPerUnit,
              totalCost: quantityToDeduct * parseFloat(ingredient.costPerUnit)
            }, { transaction });

            movements.push(movement);

            // Log se estoque ficou baixo
            if (ingredient.isLowStock()) {
              console.log(`⚠️ [INGREDIENT] Estoque baixo: ${ingredient.name} (${newStock} ${ingredient.unit})`);
            }
          }
        }
      }

      await transaction.commit();

      return {
        success: true,
        movementsCount: movements.length,
        movements
      };
    } catch (error) {
      await transaction.rollback();
      console.error('[INGREDIENT] Erro ao dar baixa em insumos:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Adiciona entrada de estoque (compra)
   */
  async addStock(ingredientId, quantity, unitCost, userId, metadata = {}) {
    const transaction = await sequelize.transaction();

    try {
      const ingredient = await Ingredient.findByPk(ingredientId, { transaction });

      if (!ingredient) {
        throw new Error('Insumo não encontrado');
      }

      const previousStock = parseFloat(ingredient.currentStock);
      const newStock = previousStock + parseFloat(quantity);

      // Atualizar estoque e custo
      await ingredient.update({
        currentStock: newStock,
        costPerUnit: unitCost,
        lastPurchaseDate: new Date(),
        lastPurchasePrice: unitCost
      }, { transaction });

      // Registrar movimento
      const movement = await IngredientMovement.create({
        ingredientId,
        type: 'entrada',
        quantity: parseFloat(quantity),
        previousStock,
        newStock,
        reason: 'compra',
        description: metadata.description || 'Entrada de estoque',
        userId,
        unitCost,
        totalCost: parseFloat(quantity) * parseFloat(unitCost),
        supplierInvoice: metadata.invoiceNumber,
        expirationDate: metadata.expirationDate,
        batchNumber: metadata.batchNumber
      }, { transaction });

      await transaction.commit();

      return {
        success: true,
        movement,
        newStock
      };
    } catch (error) {
      await transaction.rollback();
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Ajuste de inventário
   */
  async adjustStock(ingredientId, newQuantity, reason, userId, description = '') {
    const transaction = await sequelize.transaction();

    try {
      const ingredient = await Ingredient.findByPk(ingredientId, { transaction });

      if (!ingredient) {
        throw new Error('Insumo não encontrado');
      }

      const previousStock = parseFloat(ingredient.currentStock);
      const difference = parseFloat(newQuantity) - previousStock;

      await ingredient.update({ currentStock: newQuantity }, { transaction });

      const movement = await IngredientMovement.create({
        ingredientId,
        type: 'ajuste',
        quantity: difference,
        previousStock,
        newStock: parseFloat(newQuantity),
        reason: reason || 'inventario',
        description: description || `Ajuste de inventário: ${previousStock} → ${newQuantity}`,
        userId
      }, { transaction });

      await transaction.commit();

      return {
        success: true,
        movement,
        previousStock,
        newStock: parseFloat(newQuantity),
        difference
      };
    } catch (error) {
      await transaction.rollback();
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Registrar perda/quebra
   */
  async registerLoss(ingredientId, quantity, reason, userId, description = '') {
    const transaction = await sequelize.transaction();

    try {
      const ingredient = await Ingredient.findByPk(ingredientId, { transaction });

      if (!ingredient) {
        throw new Error('Insumo não encontrado');
      }

      const previousStock = parseFloat(ingredient.currentStock);
      const newStock = Math.max(0, previousStock - parseFloat(quantity));

      await ingredient.update({ currentStock: newStock }, { transaction });

      const movement = await IngredientMovement.create({
        ingredientId,
        type: 'perda',
        quantity: -parseFloat(quantity),
        previousStock,
        newStock,
        reason: reason || 'quebra',
        description: description || 'Perda registrada',
        userId,
        totalCost: parseFloat(quantity) * parseFloat(ingredient.costPerUnit)
      }, { transaction });

      await transaction.commit();

      return {
        success: true,
        movement,
        lostValue: parseFloat(quantity) * parseFloat(ingredient.costPerUnit)
      };
    } catch (error) {
      await transaction.rollback();
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obter insumos com estoque baixo
   */
  async getLowStockIngredients() {
    return Ingredient.findAll({
      where: {
        isActive: true,
        currentStock: {
          [Op.lte]: sequelize.col('minStock')
        }
      },
      order: [['currentStock', 'ASC']]
    });
  }

  /**
   * Relatório de CMV (Custo de Mercadoria Vendida) por período
   */
  async getCMVReport(startDate, endDate) {
    const movements = await IngredientMovement.findAll({
      where: {
        type: 'saida',
        reason: 'producao',
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [{
        model: Ingredient,
        as: 'ingredient',
        attributes: ['name', 'category']
      }]
    });

    let totalCMV = 0;
    const byCategory = {};
    const byIngredient = {};

    for (const mov of movements) {
      const cost = Math.abs(parseFloat(mov.totalCost || 0));
      totalCMV += cost;

      const category = mov.ingredient?.category || 'outros';
      byCategory[category] = (byCategory[category] || 0) + cost;

      const name = mov.ingredient?.name || 'Desconhecido';
      byIngredient[name] = (byIngredient[name] || 0) + cost;
    }

    return {
      period: { startDate, endDate },
      totalCMV,
      byCategory,
      byIngredient,
      movementsCount: movements.length
    };
  }
}

module.exports = new IngredientService();
