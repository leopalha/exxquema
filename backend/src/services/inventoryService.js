const { InventoryMovement, Product, Order } = require('../models');
const { Op } = require('sequelize');

class InventoryService {
  /**
   * Registrar movimento de estoque
   * @param {string} productId - ID do produto
   * @param {string} type - Tipo de movimento (entrada, saida, ajuste, devolucao)
   * @param {number} quantity - Quantidade do movimento
   * @param {string} reason - Razão do movimento
   * @param {string} notes - Observações adicionais
   * @param {string} userId - ID do usuário que fez o movimento
   * @param {string} orderId - ID do pedido (opcional)
   * @returns {Promise<InventoryMovement>}
   */
  static async recordMovement(
    productId,
    type,
    quantity,
    reason,
    notes = null,
    userId = null,
    orderId = null
  ) {
    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        throw new Error(`Produto com ID ${productId} não encontrado`);
      }

      if (!product.hasStock) {
        throw new Error(`Produto ${product.name} não possui controle de estoque ativado`);
      }

      const previousStock = product.stock || 0;

      // Calcular novo estoque baseado no tipo de movimento
      let newStock = previousStock;
      if (type === 'entrada') {
        newStock = previousStock + quantity;
      } else if (type === 'saida' || type === 'devolucao') {
        newStock = previousStock - quantity;
      } else if (type === 'ajuste') {
        // Para ajustes, quantity é o novo valor (não incremento)
        newStock = quantity;
      }

      // Validação: não permitir estoque negativo (exceto para ajustes explícitos)
      if (newStock < 0 && type !== 'ajuste') {
        throw new Error(
          `Estoque insuficiente. Disponível: ${previousStock}, Solicitado: ${quantity}`
        );
      }

      // Registrar movimento
      const movement = await InventoryMovement.create({
        productId,
        type,
        quantity: type === 'ajuste' ? quantity - previousStock : quantity,
        reason,
        previousStock,
        newStock,
        notes,
        userId,
        orderId
      });

      // Atualizar estoque do produto
      await product.update({ stock: newStock });

      return movement;
    } catch (error) {
      throw new Error(`Erro ao registrar movimento de estoque: ${error.message}`);
    }
  }

  /**
   * Obter movimentos de um produto com paginação
   * @param {string} productId - ID do produto
   * @param {number} limit - Limite de registros (default: 50)
   * @param {number} offset - Offset para paginação (default: 0)
   * @returns {Promise<{rows, count, total_pages}>}
   */
  static async getProductMovements(productId, limit = 50, offset = 0) {
    try {
      const { rows, count } = await InventoryMovement.findAndCountAll({
        where: { productId },
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'category']
          },
          {
            model: Order,
            as: 'order',
            attributes: ['id', 'status', 'total']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset
      });

      return {
        rows,
        count,
        total_pages: Math.ceil(count / limit)
      };
    } catch (error) {
      throw new Error(`Erro ao buscar movimentos: ${error.message}`);
    }
  }

  /**
   * Obter produtos com estoque baixo
   * @param {number} minStock - Limite mínimo (usa minStock padrão do produto se não informado)
   * @returns {Promise<Array>}
   */
  static async getLowStockProducts(minStock = null) {
    try {
      const where = {
        hasStock: true,
        isActive: true
      };

      if (minStock !== null) {
        where.stock = { [Op.lte]: minStock };
      } else {
        // Usar o minStock de cada produto
        // Sequelize raw query para comparar campo com campo
        // where: sequelize.where(sequelize.col('stock'), Op.lte, sequelize.col('minStock'))
      }

      const products = await Product.findAll({
        where,
        attributes: ['id', 'name', 'category', 'stock', 'minStock', 'price'],
        order: [['stock', 'ASC']],
        subQuery: false
      });

      // Filtrar produtos onde stock <= minStock
      return products.filter(p => p.stock <= p.minStock);
    } catch (error) {
      throw new Error(`Erro ao buscar produtos com estoque baixo: ${error.message}`);
    }
  }

  /**
   * Obter alertas de estoque (resumo)
   * @param {number} minStock - Limite mínimo (opcional)
   * @returns {Promise<{critical, warning, total}>}
   */
  static async getStockAlerts(minStock = null) {
    try {
      const lowStockProducts = await this.getLowStockProducts(minStock);

      const alerts = {
        critical: lowStockProducts.filter(p => p.stock === 0).length,
        warning: lowStockProducts.filter(p => p.stock > 0 && p.stock <= p.minStock).length,
        total: lowStockProducts.length,
        products: lowStockProducts
      };

      return alerts;
    } catch (error) {
      throw new Error(`Erro ao buscar alertas de estoque: ${error.message}`);
    }
  }

  /**
   * Gerar relatório de estoque (filtro por datas)
   * @param {Date} startDate - Data inicial
   * @param {Date} endDate - Data final
   * @returns {Promise<{total_products, total_value, movements, summary}>}
   */
  static async generateInventoryReport(startDate = null, endDate = null) {
    try {
      const where = {};

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt[Op.gte] = startDate;
        if (endDate) where.createdAt[Op.lte] = endDate;
      }

      const movements = await InventoryMovement.findAll({
        where,
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'price', 'category']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      const products = await Product.findAll({
        where: { hasStock: true },
        attributes: ['id', 'name', 'stock', 'price', 'category']
      });

      const totalProducts = products.length;
      const totalValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);

      // Resumo por tipo de movimento
      const summary = {
        entrada: movements.filter(m => m.type === 'entrada').length,
        saida: movements.filter(m => m.type === 'saida').length,
        ajuste: movements.filter(m => m.type === 'ajuste').length,
        devolucao: movements.filter(m => m.type === 'devolucao').length
      };

      return {
        total_products: totalProducts,
        total_value: parseFloat(totalValue.toFixed(2)),
        movements,
        summary,
        period: {
          startDate: startDate || null,
          endDate: endDate || null
        }
      };
    } catch (error) {
      throw new Error(`Erro ao gerar relatório: ${error.message}`);
    }
  }

  /**
   * Analisar consumo por produto nos últimos N dias
   * @param {number} days - Número de dias para análise (default: 30)
   * @returns {Promise<Array>}
   */
  static async getConsumptionByProduct(days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const movements = await InventoryMovement.findAll({
        where: {
          type: 'saida',
          reason: 'venda',
          createdAt: { [Op.gte]: startDate }
        },
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'category', 'price']
          }
        ]
      });

      // Agrupar por produto
      const consumption = {};
      movements.forEach(m => {
        if (!consumption[m.productId]) {
          consumption[m.productId] = {
            productId: m.productId,
            name: m.product.name,
            category: m.product.category,
            totalQuantity: 0,
            totalValue: 0,
            movements: []
          };
        }
        consumption[m.productId].totalQuantity += m.quantity;
        consumption[m.productId].totalValue += m.quantity * m.product.price;
        consumption[m.productId].movements.push(m);
      });

      // Converter para array e ordenar por quantidade
      return Object.values(consumption)
        .map(item => ({
          ...item,
          averagePerDay: parseFloat((item.totalQuantity / days).toFixed(2)),
          totalValue: parseFloat(item.totalValue.toFixed(2))
        }))
        .sort((a, b) => b.totalQuantity - a.totalQuantity);
    } catch (error) {
      throw new Error(`Erro ao analisar consumo por produto: ${error.message}`);
    }
  }

  /**
   * Analisar consumo por categoria nos últimos N dias
   * @param {number} days - Número de dias para análise (default: 30)
   * @returns {Promise<Array>}
   */
  static async getConsumptionByCategory(days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const movements = await InventoryMovement.findAll({
        where: {
          type: 'saida',
          reason: 'venda',
          createdAt: { [Op.gte]: startDate }
        },
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'category', 'price']
          }
        ]
      });

      // Agrupar por categoria
      const consumption = {};
      movements.forEach(m => {
        const category = m.product.category;
        if (!consumption[category]) {
          consumption[category] = {
            category,
            totalQuantity: 0,
            totalValue: 0,
            products: {}
          };
        }
        consumption[category].totalQuantity += m.quantity;
        consumption[category].totalValue += m.quantity * m.product.price;

        if (!consumption[category].products[m.productId]) {
          consumption[category].products[m.productId] = {
            name: m.product.name,
            quantity: 0
          };
        }
        consumption[category].products[m.productId].quantity += m.quantity;
      });

      // Converter para array
      return Object.values(consumption)
        .map(item => ({
          category: item.category,
          totalQuantity: item.totalQuantity,
          totalValue: parseFloat(item.totalValue.toFixed(2)),
          averagePerDay: parseFloat((item.totalQuantity / days).toFixed(2)),
          topProducts: Object.entries(item.products)
            .sort((a, b) => b[1].quantity - a[1].quantity)
            .slice(0, 3)
            .map(([id, p]) => ({ ...p, productId: id }))
        }))
        .sort((a, b) => b.totalQuantity - a.totalQuantity);
    } catch (error) {
      throw new Error(`Erro ao analisar consumo por categoria: ${error.message}`);
    }
  }

  /**
   * Prever quando um produto vai acabar
   * @param {string} productId - ID do produto
   * @param {number} days - Dias de histórico para análise (default: 30)
   * @returns {Promise<{productId, name, currentStock, dailyAverage, daysUntilStockOut, recommendedOrder}>}
   */
  static async predictStockOut(productId, days = 30) {
    try {
      const product = await Product.findByPk(productId, {
        attributes: ['id', 'name', 'stock', 'minStock', 'price']
      });

      if (!product || !product.hasStock) {
        throw new Error('Produto não encontrado ou sem controle de estoque');
      }

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const movements = await InventoryMovement.findAll({
        where: {
          productId,
          type: 'saida',
          reason: 'venda',
          createdAt: { [Op.gte]: startDate }
        }
      });

      const totalQuantity = movements.reduce((sum, m) => sum + m.quantity, 0);
      const dailyAverage = totalQuantity / days;

      // Calcular dias até acabar
      const daysUntilStockOut = dailyAverage > 0
        ? Math.ceil(product.stock / dailyAverage)
        : null;

      // Sugerir quantidade a encomendar (baseado em 30 dias de consumo + margem)
      const recommendedOrder = Math.ceil(dailyAverage * 30);

      return {
        productId,
        name: product.name,
        currentStock: product.stock,
        dailyAverage: parseFloat(dailyAverage.toFixed(2)),
        daysUntilStockOut,
        recommendedOrder,
        minimumStock: product.minStock,
        isAlert: product.stock <= product.minStock,
        isCritical: product.stock === 0
      };
    } catch (error) {
      throw new Error(`Erro ao prever falta de estoque: ${error.message}`);
    }
  }
}

module.exports = InventoryService;
