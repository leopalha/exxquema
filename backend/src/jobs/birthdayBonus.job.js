/**
 * Birthday Bonus Job - FLAME Lounge Bar
 * Dá bônus de aniversário baseado no tier do cliente
 */

const { User, CashbackHistory } = require('../models');
const { Op, fn, where, col } = require('sequelize');

// Bônus por tier
const BIRTHDAY_BONUS_BY_TIER = {
  bronze: 10,     // R$ 10
  silver: 50,     // R$ 50
  gold: 100,      // R$ 100
  platinum: 200   // R$ 200
};

/**
 * Verifica aniversariantes do dia e concede bônus
 * Executa diariamente às 8h
 */
async function processBirthdayBonus() {
  const startTime = Date.now();
  console.log(`[BIRTHDAY-BONUS] Iniciando verificação - ${new Date().toISOString()}`);

  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentDay = now.getDate();

    // Buscar usuários que fazem aniversário hoje
    // e que ainda não receberam bônus este ano
    const birthdayUsers = await User.findAll({
      where: {
        birthDate: {
          [Op.ne]: null
        },
        role: 'cliente',
        isActive: true,
        [Op.or]: [
          { lastBirthdayBonusYear: null },
          { lastBirthdayBonusYear: { [Op.lt]: currentYear } }
        ]
      },
      attributes: ['id', 'nome', 'birthDate', 'loyaltyTier', 'cashbackBalance', 'lastBirthdayBonusYear']
    });

    console.log(`[BIRTHDAY-BONUS] Verificando ${birthdayUsers.length} usuários`);

    let bonusCount = 0;

    for (const user of birthdayUsers) {
      try {
        // Verificar se é aniversário hoje
        const birthDate = new Date(user.birthDate);
        const birthMonth = birthDate.getMonth() + 1;
        const birthDay = birthDate.getDate();

        if (birthMonth === currentMonth && birthDay === currentDay) {
          const tier = user.loyaltyTier || 'bronze';
          const bonusAmount = BIRTHDAY_BONUS_BY_TIER[tier] || BIRTHDAY_BONUS_BY_TIER.bronze;

          const balanceBefore = parseFloat(user.cashbackBalance) || 0;
          const balanceAfter = balanceBefore + bonusAmount;

          // Registrar no histórico
          await CashbackHistory.create({
            userId: user.id,
            type: 'bonus',
            amount: bonusAmount,
            description: `🎂 Bônus de aniversário (${tier.toUpperCase()}) - R$ ${bonusAmount.toFixed(2)}`,
            balanceBefore,
            balanceAfter
          });

          // Atualizar saldo e marcar ano do bônus
          await user.update({
            cashbackBalance: balanceAfter,
            lastBirthdayBonusYear: currentYear
          });

          bonusCount++;
          console.log(`[BIRTHDAY-BONUS] 🎂 R$ ${bonusAmount} creditado para ${user.nome} (${tier})`);
        }
      } catch (error) {
        console.error(`[BIRTHDAY-BONUS] Erro ao processar usuário ${user.id}:`, error.message);
      }
    }

    const duration = Date.now() - startTime;
    console.log(`[BIRTHDAY-BONUS] Concluído em ${duration}ms - ${bonusCount} bônus de aniversário concedidos`);

    return {
      success: true,
      bonusCount,
      duration
    };
  } catch (error) {
    console.error('[BIRTHDAY-BONUS] Erro no job:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  name: 'birthdayBonus',
  schedule: '0 8 * * *', // Diariamente às 8h
  handler: processBirthdayBonus
};
