const { HookahFlavor, HookahSession, Table } = require('../models');

class HookahService {
  /**
   * Criar uma nova sessão de narguilé
   * @param {UUID} mesaId - ID da mesa
   * @param {UUID} flavorId - ID do sabor
   * @param {number} quantity - Quantidade de narguilés
   * @param {number} duration - Duração em minutos (default: 30)
   * @returns {Object} Sessão criada com detalhes
   */
  static async createSession(mesaId, flavorId, quantity = 1, duration = 30) {
    try {
      // Validar mesa
      const mesa = await Table.findByPk(mesaId);
      if (!mesa) {
        throw new Error('Mesa não encontrada');
      }

      // Validar sabor
      const flavor = await HookahFlavor.findByPk(flavorId);
      if (!flavor) {
        throw new Error('Sabor não encontrado');
      }

      if (!flavor.isAvailable()) {
        throw new Error('Sabor não está disponível');
      }

      // Validar se mesa já tem sessão ativa
      const activeSession = await this.getActiveSessionByMesa(mesaId);
      if (activeSession) {
        throw new Error('Mesa já possui uma sessão ativa');
      }

      // Calcular horário de término previsto
      const scheduledEndTime = new Date();
      scheduledEndTime.setMinutes(scheduledEndTime.getMinutes() + duration);

      // Criar sessão
      const session = await HookahSession.create({
        mesaId,
        flavorId,
        quantity,
        duration,
        scheduledEndTime,
        status: 'active',
      });

      // Increment popularity do sabor
      await flavor.incrementPopularity();

      return this.enrichSession(session, flavor);
    } catch (error) {
      throw new Error(`Erro ao criar sessão: ${error.message}`);
    }
  }

  /**
   * Obter todas as sessões ativas com detalhes
   * @returns {Array} Lista de sessões ativas (active, paused, preparing, ready)
   */
  static async getActiveSessions() {
    try {
      const { Op } = require('sequelize');
      const sessions = await HookahSession.findAll({
        where: {
          status: {
            [Op.in]: ['active', 'paused', 'preparing', 'ready']
          }
        },
        include: [
          {
            model: Table,
            attributes: ['id', 'number'],
          },
          {
            model: HookahFlavor,
            attributes: ['id', 'name', 'category', 'image', 'price'],
          },
        ],
        order: [['startedAt', 'ASC']],
      });

      return sessions.map(session => this.enrichSession(session));
    } catch (error) {
      throw new Error(`Erro ao obter sessões ativas: ${error.message}`);
    }
  }

  /**
   * Obter sessão ativa de uma mesa específica
   * @param {UUID} mesaId - ID da mesa
   * @returns {Object|null} Sessão ou null
   */
  static async getActiveSessionByMesa(mesaId) {
    try {
      return await HookahSession.findOne({
        where: { mesaId, status: 'active' },
        include: [
          {
            model: HookahFlavor,
            attributes: ['id', 'name', 'category', 'image', 'price'],
          },
        ],
      });
    } catch (error) {
      throw new Error(`Erro ao obter sessão da mesa: ${error.message}`);
    }
  }

  /**
   * Registrar troca de carvão
   * @param {UUID} sessionId - ID da sessão
   * @returns {Object} Sessão atualizada
   */
  static async registerCoalChange(sessionId) {
    try {
      const session = await HookahSession.findByPk(sessionId);
      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      if (session.status !== 'active') {
        throw new Error('Sessão não está ativa');
      }

      await session.registerCoalChange();

      return this.enrichSession(session);
    } catch (error) {
      throw new Error(`Erro ao registrar troca de carvão: ${error.message}`);
    }
  }

  /**
   * Pausar uma sessão
   * @param {UUID} sessionId - ID da sessão
   * @returns {Object} Sessão atualizada
   */
  static async pauseSession(sessionId) {
    try {
      const session = await HookahSession.findByPk(sessionId, {
        include: [HookahFlavor],
      });

      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      await session.pause();

      return this.enrichSession(session);
    } catch (error) {
      throw new Error(`Erro ao pausar sessão: ${error.message}`);
    }
  }

  /**
   * Retomar uma sessão pausada
   * @param {UUID} sessionId - ID da sessão
   * @returns {Object} Sessão atualizada
   */
  static async resumeSession(sessionId) {
    try {
      const session = await HookahSession.findByPk(sessionId, {
        include: [HookahFlavor],
      });

      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      await session.resume();

      return this.enrichSession(session);
    } catch (error) {
      throw new Error(`Erro ao retomar sessão: ${error.message}`);
    }
  }

  /**
   * Marcar sessão como preparando
   * @param {UUID} sessionId - ID da sessão
   * @returns {Object} Sessão atualizada
   */
  static async markAsPreparing(sessionId) {
    try {
      const session = await HookahSession.findByPk(sessionId, {
        include: [
          { model: Table, attributes: ['id', 'number'] },
          { model: HookahFlavor },
        ],
      });

      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      if (session.status === 'ended') {
        throw new Error('Sessão já foi finalizada');
      }

      session.status = 'preparing';
      await session.save();

      return this.enrichSession(session);
    } catch (error) {
      throw new Error(`Erro ao marcar como preparando: ${error.message}`);
    }
  }

  /**
   * Marcar sessão como pronta
   * @param {UUID} sessionId - ID da sessão
   * @returns {Object} Sessão atualizada
   */
  static async markAsReady(sessionId) {
    try {
      const session = await HookahSession.findByPk(sessionId, {
        include: [
          { model: Table, attributes: ['id', 'number'] },
          { model: HookahFlavor },
        ],
      });

      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      if (session.status === 'ended') {
        throw new Error('Sessão já foi finalizada');
      }

      session.status = 'ready';
      await session.save();

      return this.enrichSession(session);
    } catch (error) {
      throw new Error(`Erro ao marcar como pronto: ${error.message}`);
    }
  }

  /**
   * Finalizar uma sessão
   * @param {UUID} sessionId - ID da sessão
   * @returns {Object} Sessão com preço calculado
   */
  static async endSession(sessionId) {
    try {
      const session = await HookahSession.findByPk(sessionId, {
        include: [HookahFlavor],
      });

      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      if (session.status === 'ended') {
        throw new Error('Sessão já foi finalizada');
      }

      // Se pausada, retomar antes de finalizar
      if (session.status === 'paused') {
        await session.resume();
      }

      // Calcular preço
      const price = session.calculatePrice(session.HookahFlavor.price);
      session.price = price;

      await session.end();

      return this.enrichSession(session);
    } catch (error) {
      throw new Error(`Erro ao finalizar sessão: ${error.message}`);
    }
  }

  /**
   * Obter detalhes de uma sessão
   * @param {UUID} sessionId - ID da sessão
   * @returns {Object} Sessão com detalhes enriquecidos
   */
  static async getSessionDetails(sessionId) {
    try {
      const session = await HookahSession.findByPk(sessionId, {
        include: [
          { model: Table, attributes: ['id', 'number'] },
          { model: HookahFlavor },
        ],
      });

      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      return this.enrichSession(session);
    } catch (error) {
      throw new Error(`Erro ao obter detalhes da sessão: ${error.message}`);
    }
  }

  /**
   * Obter histórico de sessões
   * @param {number} days - Número de dias retroativos (default: 30)
   * @returns {Array} Sessões finalizadas
   */
  static async getSessionHistory(days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      return await HookahSession.findAll({
        where: {
          status: 'ended',
          endedAt: {
            [require('sequelize').Op.gte]: startDate,
          },
        },
        include: [
          { model: Table, attributes: ['id', 'number'] },
          { model: HookahFlavor, attributes: ['id', 'name', 'category'] },
        ],
        order: [['endedAt', 'DESC']],
      });
    } catch (error) {
      throw new Error(`Erro ao obter histórico: ${error.message}`);
    }
  }

  /**
   * Enriquecer sessão com dados calculados
   * @param {Object} session - Sessão
   * @param {Object} flavor - Sabor (opcional)
   * @returns {Object} Sessão enriquecida
   */
  static enrichSession(session, flavor = null) {
    const f = flavor || session.HookahFlavor;

    return {
      id: session.id,
      mesaId: session.mesaId,
      mesa: session.Table,
      flavorId: session.flavorId,
      flavor: f
        ? {
            id: f.id,
            name: f.name,
            category: f.category,
            image: f.image,
            price: f.price,
          }
        : null,
      quantity: session.quantity,
      status: session.status,
      duration: session.duration,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      scheduledEndTime: session.scheduledEndTime,
      coalChanges: session.coalChanges || [],
      coalChangeCount: session.getCoalChangeCount(),
      elapsedTime: session.getElapsedTime(),
      remainingTime: session.status === 'ended' ? 0 : session.getRemainingTime(),
      isOvertime: session.isOvertime(),
      totalDuration: session.getTotalDuration(),
      price: session.price,
      notes: session.notes,
    };
  }

  /**
   * Obter relatório de receita
   * @param {number} days - Número de dias (default: 30)
   * @returns {Object} Relatório com métricas
   */
  static async getRevenueReport(days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const sessions = await HookahSession.findAll({
        where: {
          status: 'ended',
          endedAt: {
            [require('sequelize').Op.gte]: startDate,
          },
        },
      });

      const totalSessions = sessions.length;
      const totalRevenue = sessions.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);
      const averagePrice = totalSessions > 0 ? totalRevenue / totalSessions : 0;
      const totalMinutes = sessions.reduce((sum, s) => sum + s.getTotalDuration(), 0);

      return {
        period: `${days} dias`,
        totalSessions,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        averagePrice: parseFloat(averagePrice.toFixed(2)),
        totalMinutes,
        averageDuration: totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0,
      };
    } catch (error) {
      throw new Error(`Erro ao gerar relatório: ${error.message}`);
    }
  }

  /**
   * Obter sabores populares
   * @param {number} limit - Limite de resultados (default: 5)
   * @returns {Array} Sabores mais populares
   */
  static async getPopularFlavors(limit = 5) {
    try {
      return await HookahFlavor.getPopularFlavors(limit);
    } catch (error) {
      throw new Error(`Erro ao obter sabores populares: ${error.message}`);
    }
  }

  /**
   * Obter sabores por categoria
   * @param {string} category - Categoria
   * @returns {Array} Sabores da categoria
   */
  static async getFlavorsByCategory(category) {
    try {
      return await HookahFlavor.getByCategory(category);
    } catch (error) {
      throw new Error(`Erro ao obter sabores por categoria: ${error.message}`);
    }
  }

  /**
   * Verificar se mesa tem sessão ativa que está em overtime
   * @param {UUID} mesaId - ID da mesa
   * @returns {boolean} True se está em overtime
   */
  static async isMesaInOvertime(mesaId) {
    try {
      const session = await this.getActiveSessionByMesa(mesaId);
      if (!session) return false;
      return session.isOvertime();
    } catch (error) {
      return false;
    }
  }
}

module.exports = HookahService;
