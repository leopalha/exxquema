const InventoryService = require('../services/inventoryService');
const { Product } = require('../models');

class InventoryController {
  /**
   * GET /api/inventory/dashboard
   * Resumo do dashboard de inventário para admin
   */
  static async getDashboard(req, res) {
    try {
      const alerts = await InventoryService.getStockAlerts();
      const report = await InventoryService.generateInventoryReport();
      const consumption = await InventoryService.getConsumptionByProduct(30);
      const consumptionByCategory = await InventoryService.getConsumptionByCategory(30);

      res.json({
        success: true,
        data: {
          summary: {
            totalProducts: report.total_products,
            totalValue: report.total_value,
            alertsCount: alerts.total,
            criticalCount: alerts.critical,
            warningCount: alerts.warning
          },
          alerts: alerts.products.slice(0, 10), // Top 10 alertas
          topConsumption: consumption.slice(0, 5), // Top 5 produtos consumidos
          consumptionByCategory,
          movements: report.summary
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/inventory/movements
   * Histórico de movimentações paginado
   */
  static async getMovements(req, res) {
    try {
      const { limit = 50, offset = 0, type, reason, startDate, endDate } = req.query;
      const { InventoryMovement } = require('../models');
      const { Op } = require('sequelize');

      const where = {};
      if (type) where.type = type;
      if (reason) where.reason = reason;

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt[Op.gte] = new Date(startDate);
        if (endDate) where.createdAt[Op.lte] = new Date(endDate);
      }

      const { rows, count } = await InventoryMovement.findAndCountAll({
        where,
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'category']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        success: true,
        data: {
          movements: rows,
          pagination: {
            total: count,
            limit: parseInt(limit),
            offset: parseInt(offset),
            pages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/inventory/products/:productId/movements
   * Movimentos de um produto específico
   */
  static async getProductMovements(req, res) {
    try {
      const { productId } = req.params;
      const { limit = 50, offset = 0 } = req.query;

      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado'
        });
      }

      const result = await InventoryService.getProductMovements(
        productId,
        parseInt(limit),
        parseInt(offset)
      );

      res.json({
        success: true,
        data: {
          product: {
            id: product.id,
            name: product.name,
            currentStock: product.stock,
            minStock: product.minStock
          },
          movements: result.rows,
          pagination: {
            total: result.count,
            limit: parseInt(limit),
            offset: parseInt(offset),
            pages: result.total_pages
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/inventory/alerts
   * Produtos com estoque baixo
   */
  static async getAlerts(req, res) {
    try {
      const alerts = await InventoryService.getStockAlerts();

      res.json({
        success: true,
        data: alerts
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/inventory/report
   * Relatório completo de inventário
   */
  static async getReport(req, res) {
    try {
      const { startDate, endDate } = req.query;

      const report = await InventoryService.generateInventoryReport(
        startDate ? new Date(startDate) : null,
        endDate ? new Date(endDate) : null
      );

      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * POST /api/inventory/adjust
   * Ajuste manual de estoque
   */
  static async adjustStock(req, res) {
    try {
      const { productId, newQuantity, reason, notes } = req.body;

      if (!productId || newQuantity === undefined) {
        return res.status(400).json({
          success: false,
          error: 'productId e newQuantity são obrigatórios'
        });
      }

      if (newQuantity < 0) {
        return res.status(400).json({
          success: false,
          error: 'Nova quantidade não pode ser negativa'
        });
      }

      if (!reason) {
        return res.status(400).json({
          success: false,
          error: 'Reason é obrigatório'
        });
      }

      const movement = await InventoryService.recordMovement(
        productId,
        'ajuste',
        newQuantity, // Para ajuste, quantity é o novo valor
        reason,
        notes,
        req.user?.id // ID do usuário autenticado
      );

      res.json({
        success: true,
        message: 'Estoque ajustado com sucesso',
        data: movement
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/inventory/forecast
   * Previsão de falta de estoque
   */
  static async getForecast(req, res) {
    try {
      const products = await Product.findAll({
        where: { hasStock: true, isActive: true },
        attributes: ['id']
      });

      const forecasts = await Promise.all(
        products.map(p => InventoryService.predictStockOut(p.id))
      );

      // Ordenar por dias até acabar (menor primeiro = mais urgente)
      const sortedForecasts = forecasts
        .filter(f => f.daysUntilStockOut !== null && f.daysUntilStockOut <= 30)
        .sort((a, b) => (a.daysUntilStockOut || Infinity) - (b.daysUntilStockOut || Infinity));

      res.json({
        success: true,
        data: {
          forecasts: sortedForecasts,
          total: sortedForecasts.length,
          summary: {
            criticalCount: sortedForecasts.filter(f => f.isCritical).length,
            warningCount: sortedForecasts.filter(f => f.isAlert && !f.isCritical).length
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/inventory/consumption
   * Análise de consumo por produto e categoria
   */
  static async getConsumption(req, res) {
    try {
      const { days = 30 } = req.query;

      const byProduct = await InventoryService.getConsumptionByProduct(parseInt(days));
      const byCategory = await InventoryService.getConsumptionByCategory(parseInt(days));

      res.json({
        success: true,
        data: {
          period: {
            days: parseInt(days)
          },
          byProduct: byProduct.slice(0, 20), // Top 20
          byCategory,
          summary: {
            topProduct: byProduct[0] || null,
            topCategory: byCategory[0] || null
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = InventoryController;
