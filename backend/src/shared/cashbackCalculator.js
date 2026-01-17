/**
 * FLAME Lounge - Cashback Calculator
 *
 * Centraliza toda lógica de cálculo de cashback
 * Single Source of Truth para evitar inconsistências
 */

const { CASHBACK_RATES, INSTAGRAM_CASHBACK_RATE, TIER_THRESHOLDS } = require('./constants');

/**
 * Calcula tier baseado no total gasto
 * @param {number} totalSpent - Total gasto pelo usuário (em R$)
 * @returns {string} Tier do usuário (bronze, silver, gold, platinum)
 */
function calculateTierFromSpent(totalSpent) {
  const spent = parseFloat(totalSpent) || 0;

  if (spent >= TIER_THRESHOLDS.platinum) return 'platinum';
  if (spent >= TIER_THRESHOLDS.gold) return 'gold';
  if (spent >= TIER_THRESHOLDS.silver) return 'silver';
  return 'bronze';
}

/**
 * Obtém a taxa de cashback para um tier
 * @param {string} tier - Tier do usuário
 * @returns {number} Taxa de cashback (decimal, ex: 0.05 para 5%)
 */
function getCashbackRate(tier) {
  return CASHBACK_RATES[tier] || CASHBACK_RATES.bronze;
}

/**
 * Calcula cashback baseado no tier e valor
 * @param {number} amount - Valor da compra (em R$)
 * @param {string} tier - Tier do usuário
 * @returns {number} Valor do cashback (em R$)
 */
function calculateCashbackByTier(amount, tier) {
  const value = parseFloat(amount) || 0;
  const rate = getCashbackRate(tier);
  return value * rate;
}

/**
 * Calcula cashback do Instagram (5% extra)
 * @param {number} amount - Valor da compra (em R$)
 * @returns {number} Valor do cashback Instagram (em R$)
 */
function calculateInstagramCashback(amount) {
  const value = parseFloat(amount) || 0;
  return value * INSTAGRAM_CASHBACK_RATE;
}

/**
 * Calcula cashback total de um pedido
 * @param {number} amount - Valor da compra (em R$)
 * @param {string} tier - Tier do usuário
 * @param {boolean} hasInstagramBonus - Se tem bônus do Instagram
 * @returns {object} { baseCashback, instagramCashback, totalCashback }
 */
function calculateTotalCashback(amount, tier, hasInstagramBonus = false) {
  const baseCashback = calculateCashbackByTier(amount, tier);
  const instagramCashback = hasInstagramBonus ? calculateInstagramCashback(amount) : 0;
  const totalCashback = baseCashback + instagramCashback;

  return {
    baseCashback: parseFloat(baseCashback.toFixed(2)),
    instagramCashback: parseFloat(instagramCashback.toFixed(2)),
    totalCashback: parseFloat(totalCashback.toFixed(2)),
  };
}

/**
 * Calcula quanto falta para o próximo tier
 * @param {number} totalSpent - Total gasto pelo usuário (em R$)
 * @returns {object} { currentTier, nextTier, amountToNext, progressPercentage }
 */
function calculateProgressToNextTier(totalSpent) {
  const spent = parseFloat(totalSpent) || 0;
  const currentTier = calculateTierFromSpent(spent);

  // Se já é platinum, não tem próximo tier
  if (currentTier === 'platinum') {
    return {
      currentTier: 'platinum',
      nextTier: null,
      amountToNext: 0,
      progressPercentage: 100,
    };
  }

  // Determinar próximo tier
  const tierOrder = ['bronze', 'silver', 'gold', 'platinum'];
  const currentIndex = tierOrder.indexOf(currentTier);
  const nextTier = tierOrder[currentIndex + 1];

  // Calcular progresso
  const currentThreshold = TIER_THRESHOLDS[currentTier];
  const nextThreshold = TIER_THRESHOLDS[nextTier];
  const amountToNext = nextThreshold - spent;
  const progressPercentage = ((spent - currentThreshold) / (nextThreshold - currentThreshold)) * 100;

  return {
    currentTier,
    nextTier,
    amountToNext: Math.max(0, amountToNext),
    progressPercentage: Math.min(100, Math.max(0, progressPercentage)),
  };
}

/**
 * Obtém benefícios do tier
 * @param {string} tier - Tier do usuário
 * @returns {object} Benefícios do tier
 */
function getTierBenefits(tier) {
  const rate = getCashbackRate(tier);
  const ratePercentage = (rate * 100).toFixed(1);

  const benefits = {
    bronze: {
      cashbackRate: ratePercentage,
      description: 'Cashback básico em todas as compras',
      features: [`${ratePercentage}% de cashback`, 'Programa de fidelidade', 'Ofertas exclusivas'],
    },
    silver: {
      cashbackRate: ratePercentage,
      description: 'Mais vantagens e cashback ampliado',
      features: [
        `${ratePercentage}% de cashback`,
        'Prioridade no atendimento',
        'Acesso antecipado a promoções',
        'Desconto em eventos',
      ],
    },
    gold: {
      cashbackRate: ratePercentage,
      description: 'Benefícios premium e experiência VIP',
      features: [
        `${ratePercentage}% de cashback`,
        'Atendimento VIP',
        'Convites para eventos exclusivos',
        'Brindes especiais',
        'Desconto em delivery',
      ],
    },
    platinum: {
      cashbackRate: ratePercentage,
      description: 'Máximo de privilégios e benefícios',
      features: [
        `${ratePercentage}% de cashback`,
        'Concierge exclusivo',
        'Mesa reservada permanente',
        'Acesso a menu degustação',
        'Eventos privados',
        'Desconto máximo em todos os serviços',
      ],
    },
  };

  return benefits[tier] || benefits.bronze;
}

module.exports = {
  calculateTierFromSpent,
  getCashbackRate,
  calculateCashbackByTier,
  calculateInstagramCashback,
  calculateTotalCashback,
  calculateProgressToNextTier,
  getTierBenefits,
};
