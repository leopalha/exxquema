/**
 * Welcome Bonus Job - FLAME Lounge Bar
 * Dá R$10 de bônus para novos usuários que completaram o perfil
 */

const { User, CashbackHistory } = require('../models');
const { Op } = require('sequelize');

// Valor do bônus de boas-vindas
const WELCOME_BONUS_AMOUNT = 10.00;

/**
 * Verifica usuários que completaram o perfil e ainda não receberam bônus
 * Executa a cada hora
 */
async function processWelcomeBonus() {
  const startTime = Date.now();
  console.log(`[WELCOME-BONUS] Iniciando verificação - ${new Date().toISOString()}`);

  try {
    // Buscar usuários com perfil completo que foram verificados nas últimas 24h
    // e que não têm transação de bônus de boas-vindas
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const eligibleUsers = await User.findAll({
      where: {
        profileComplete: true,
        phoneVerified: true,
        role: 'cliente', // Apenas clientes recebem bônus
        updatedAt: {
          [Op.gte]: twentyFourHoursAgo
        }
      },
      attributes: ['id', 'nome', 'cashbackBalance']
    });

    console.log(`[WELCOME-BONUS] Verificando ${eligibleUsers.length} usuários elegíveis`);

    let bonusCount = 0;

    for (const user of eligibleUsers) {
      try {
        // Verificar se já recebeu bônus de boas-vindas
        const existingBonus = await CashbackHistory.findOne({
          where: {
            userId: user.id,
            type: 'bonus',
            description: {
              [Op.like]: '%boas-vindas%'
            }
          }
        });

        if (!existingBonus) {
          // Dar bônus de boas-vindas
          const balanceBefore = parseFloat(user.cashbackBalance) || 0;
          const balanceAfter = balanceBefore + WELCOME_BONUS_AMOUNT;

          // Registrar no histórico
          await CashbackHistory.create({
            userId: user.id,
            type: 'bonus',
            amount: WELCOME_BONUS_AMOUNT,
            description: `🎁 Bônus de boas-vindas - R$ ${WELCOME_BONUS_AMOUNT.toFixed(2)}`,
            balanceBefore,
            balanceAfter
          });

          // Atualizar saldo do usuário
          await user.update({ cashbackBalance: balanceAfter });

          bonusCount++;
          console.log(`[WELCOME-BONUS] R$ ${WELCOME_BONUS_AMOUNT} creditado para ${user.nome}`);
        }
      } catch (error) {
        console.error(`[WELCOME-BONUS] Erro ao processar usuário ${user.id}:`, error.message);
      }
    }

    const duration = Date.now() - startTime;
    console.log(`[WELCOME-BONUS] Concluído em ${duration}ms - ${bonusCount} bônus concedidos`);

    return {
      success: true,
      bonusCount,
      duration
    };
  } catch (error) {
    console.error('[WELCOME-BONUS] Erro no job:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  name: 'welcomeBonus',
  schedule: '0 * * * *', // A cada hora
  handler: processWelcomeBonus
};
