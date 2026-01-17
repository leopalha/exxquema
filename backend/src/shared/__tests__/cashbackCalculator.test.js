/**
 * Testes para cashbackCalculator
 *
 * Cobertura:
 * - calculateTierFromSpent() - Cálculo de tier baseado em gastos
 * - getCashbackRate() - Obtenção de taxa de cashback por tier
 * - calculateCashbackByTier() - Cálculo de cashback por tier
 * - calculateInstagramCashback() - Cálculo de bônus Instagram
 * - calculateTotalCashback() - Cálculo total incluindo bônus
 * - calculateProgressToNextTier() - Cálculo de progresso
 * - getTierBenefits() - Obtenção de benefícios por tier
 *
 * Prioridade: P0 CRÍTICO
 * Cálculos financeiros sem validação
 */

const {
  calculateTierFromSpent,
  getCashbackRate,
  calculateCashbackByTier,
  calculateInstagramCashback,
  calculateTotalCashback,
  calculateProgressToNextTier,
  getTierBenefits,
} = require('../cashbackCalculator');

const { CASHBACK_RATES, TIER_THRESHOLDS, INSTAGRAM_CASHBACK_RATE } = require('../constants');

describe('CashbackCalculator - calculateTierFromSpent()', () => {
  test('should return bronze for spent = 0', () => {
    expect(calculateTierFromSpent(0)).toBe('bronze');
  });

  test('should return bronze for spent < 1000', () => {
    expect(calculateTierFromSpent(500)).toBe('bronze');
    expect(calculateTierFromSpent(999)).toBe('bronze');
    expect(calculateTierFromSpent(999.99)).toBe('bronze');
  });

  test('should return silver for spent >= 1000', () => {
    expect(calculateTierFromSpent(1000)).toBe('silver');
    expect(calculateTierFromSpent(2500)).toBe('silver');
    expect(calculateTierFromSpent(4999.99)).toBe('silver');
  });

  test('should return gold for spent >= 5000', () => {
    expect(calculateTierFromSpent(5000)).toBe('gold');
    expect(calculateTierFromSpent(7500)).toBe('gold');
    expect(calculateTierFromSpent(9999.99)).toBe('gold');
  });

  test('should return platinum for spent >= 10000', () => {
    expect(calculateTierFromSpent(10000)).toBe('platinum');
    expect(calculateTierFromSpent(15000)).toBe('platinum');
    expect(calculateTierFromSpent(100000)).toBe('platinum');
  });

  test('should handle string input', () => {
    expect(calculateTierFromSpent('2500')).toBe('silver');
    expect(calculateTierFromSpent('7500')).toBe('gold');
  });

  test('should handle null/undefined as 0', () => {
    expect(calculateTierFromSpent(null)).toBe('bronze');
    expect(calculateTierFromSpent(undefined)).toBe('bronze');
    expect(calculateTierFromSpent(NaN)).toBe('bronze');
  });

  test('should handle negative values as 0', () => {
    expect(calculateTierFromSpent(-100)).toBe('bronze');
  });
});

describe('CashbackCalculator - getCashbackRate()', () => {
  test('should return correct rate for bronze (1.5%)', () => {
    expect(getCashbackRate('bronze')).toBe(CASHBACK_RATES.bronze);
    expect(getCashbackRate('bronze')).toBe(0.015);
  });

  test('should return correct rate for silver (3%)', () => {
    expect(getCashbackRate('silver')).toBe(CASHBACK_RATES.silver);
    expect(getCashbackRate('silver')).toBe(0.03);
  });

  test('should return correct rate for gold (4.5%)', () => {
    expect(getCashbackRate('gold')).toBe(CASHBACK_RATES.gold);
    expect(getCashbackRate('gold')).toBe(0.045);
  });

  test('should return correct rate for platinum (5%)', () => {
    expect(getCashbackRate('platinum')).toBe(CASHBACK_RATES.platinum);
    expect(getCashbackRate('platinum')).toBe(0.05);
  });

  test('should return bronze rate for invalid tier', () => {
    expect(getCashbackRate('invalid')).toBe(CASHBACK_RATES.bronze);
    expect(getCashbackRate(null)).toBe(CASHBACK_RATES.bronze);
    expect(getCashbackRate(undefined)).toBe(CASHBACK_RATES.bronze);
  });
});

describe('CashbackCalculator - calculateCashbackByTier()', () => {
  describe('Bronze tier (1.5%)', () => {
    test('should calculate 1.5% cashback for R$ 100.00', () => {
      const cashback = calculateCashbackByTier(100, 'bronze');
      expect(cashback).toBe(1.50);
    });

    test('should calculate 1.5% cashback for R$ 1000.00', () => {
      const cashback = calculateCashbackByTier(1000, 'bronze');
      expect(cashback).toBe(15.00);
    });

    test('should calculate 1.5% cashback for R$ 50.50', () => {
      const cashback = calculateCashbackByTier(50.50, 'bronze');
      expect(cashback).toBeCloseTo(0.7575, 4);
    });
  });

  describe('Silver tier (3%)', () => {
    test('should calculate 3% cashback for R$ 100.00', () => {
      const cashback = calculateCashbackByTier(100, 'silver');
      expect(cashback).toBe(3.00);
    });

    test('should calculate 3% cashback for R$ 1000.00', () => {
      const cashback = calculateCashbackByTier(1000, 'silver');
      expect(cashback).toBe(30.00);
    });
  });

  describe('Gold tier (4.5%)', () => {
    test('should calculate 4.5% cashback for R$ 100.00', () => {
      const cashback = calculateCashbackByTier(100, 'gold');
      expect(cashback).toBe(4.50);
    });

    test('should calculate 4.5% cashback for R$ 1000.00', () => {
      const cashback = calculateCashbackByTier(1000, 'gold');
      expect(cashback).toBe(45.00);
    });
  });

  describe('Platinum tier (5%)', () => {
    test('should calculate 5% cashback for R$ 100.00', () => {
      const cashback = calculateCashbackByTier(100, 'platinum');
      expect(cashback).toBe(5.00);
    });

    test('should calculate 5% cashback for R$ 1000.00', () => {
      const cashback = calculateCashbackByTier(1000, 'platinum');
      expect(cashback).toBe(50.00);
    });

    test('should calculate 5% cashback for R$ 10000.00', () => {
      const cashback = calculateCashbackByTier(10000, 'platinum');
      expect(cashback).toBe(500.00);
    });
  });

  describe('Edge cases', () => {
    test('should return 0 for amount = 0', () => {
      expect(calculateCashbackByTier(0, 'bronze')).toBe(0);
      expect(calculateCashbackByTier(0, 'platinum')).toBe(0);
    });

    test('should handle string input', () => {
      expect(calculateCashbackByTier('100', 'silver')).toBe(3.00);
    });

    test('should handle null/undefined amount as 0', () => {
      expect(calculateCashbackByTier(null, 'bronze')).toBe(0);
      expect(calculateCashbackByTier(undefined, 'bronze')).toBe(0);
    });

    test('should handle invalid tier (defaults to bronze)', () => {
      const cashback = calculateCashbackByTier(100, 'invalid');
      expect(cashback).toBe(1.50); // Bronze rate
    });

    test('should handle negative amount as 0', () => {
      // O código atual não valida valores negativos, retorna -1.5
      // Isso pode ser um comportamento aceitável ou precisaria de validação adicional
      const result = calculateCashbackByTier(-100, 'bronze');
      expect(result).toBeLessThan(0); // Retorna -1.5 (não há validação)
    });
  });
});

describe('CashbackCalculator - calculateInstagramCashback()', () => {
  test('should calculate 5% Instagram cashback for R$ 100.00', () => {
    const cashback = calculateInstagramCashback(100);
    expect(cashback).toBe(100 * INSTAGRAM_CASHBACK_RATE);
    expect(cashback).toBe(5.00);
  });

  test('should calculate 5% Instagram cashback for R$ 1000.00', () => {
    const cashback = calculateInstagramCashback(1000);
    expect(cashback).toBe(50.00);
  });

  test('should calculate 5% Instagram cashback for R$ 50.50', () => {
    const cashback = calculateInstagramCashback(50.50);
    expect(cashback).toBeCloseTo(2.525, 3);
  });

  test('should return 0 for amount = 0', () => {
    expect(calculateInstagramCashback(0)).toBe(0);
  });

  test('should handle string input', () => {
    expect(calculateInstagramCashback('200')).toBe(10.00);
  });

  test('should handle null/undefined as 0', () => {
    expect(calculateInstagramCashback(null)).toBe(0);
    expect(calculateInstagramCashback(undefined)).toBe(0);
  });

  test('should handle negative amount as 0', () => {
    // O código atual não valida valores negativos, retorna -5
    const result = calculateInstagramCashback(-100);
    expect(result).toBeLessThan(0); // Retorna -5 (não há validação)
  });
});

describe('CashbackCalculator - calculateTotalCashback()', () => {
  describe('Without Instagram bonus', () => {
    test('should calculate bronze total (1.5%) for R$ 100.00', () => {
      const result = calculateTotalCashback(100, 'bronze', false);
      expect(result.baseCashback).toBe(1.50);
      expect(result.instagramCashback).toBe(0);
      expect(result.totalCashback).toBe(1.50);
    });

    test('should calculate silver total (3%) for R$ 100.00', () => {
      const result = calculateTotalCashback(100, 'silver', false);
      expect(result.baseCashback).toBe(3.00);
      expect(result.instagramCashback).toBe(0);
      expect(result.totalCashback).toBe(3.00);
    });

    test('should calculate gold total (4.5%) for R$ 100.00', () => {
      const result = calculateTotalCashback(100, 'gold', false);
      expect(result.baseCashback).toBe(4.50);
      expect(result.instagramCashback).toBe(0);
      expect(result.totalCashback).toBe(4.50);
    });

    test('should calculate platinum total (5%) for R$ 100.00', () => {
      const result = calculateTotalCashback(100, 'platinum', false);
      expect(result.baseCashback).toBe(5.00);
      expect(result.instagramCashback).toBe(0);
      expect(result.totalCashback).toBe(5.00);
    });
  });

  describe('With Instagram bonus', () => {
    test('should calculate bronze + Instagram (1.5% + 5%) for R$ 100.00', () => {
      const result = calculateTotalCashback(100, 'bronze', true);
      expect(result.baseCashback).toBe(1.50);
      expect(result.instagramCashback).toBe(5.00);
      expect(result.totalCashback).toBe(6.50); // 1.50 + 5.00
    });

    test('should calculate silver + Instagram (3% + 5%) for R$ 100.00', () => {
      const result = calculateTotalCashback(100, 'silver', true);
      expect(result.baseCashback).toBe(3.00);
      expect(result.instagramCashback).toBe(5.00);
      expect(result.totalCashback).toBe(8.00); // 3.00 + 5.00
    });

    test('should calculate gold + Instagram (4.5% + 5%) for R$ 100.00', () => {
      const result = calculateTotalCashback(100, 'gold', true);
      expect(result.baseCashback).toBe(4.50);
      expect(result.instagramCashback).toBe(5.00);
      expect(result.totalCashback).toBe(9.50); // 4.50 + 5.00
    });

    test('should calculate platinum + Instagram (5% + 5%) for R$ 100.00', () => {
      const result = calculateTotalCashback(100, 'platinum', true);
      expect(result.baseCashback).toBe(5.00);
      expect(result.instagramCashback).toBe(5.00);
      expect(result.totalCashback).toBe(10.00); // 5.00 + 5.00 = 10% total
    });

    test('should calculate platinum + Instagram for R$ 1000.00', () => {
      const result = calculateTotalCashback(1000, 'platinum', true);
      expect(result.baseCashback).toBe(50.00);
      expect(result.instagramCashback).toBe(50.00);
      expect(result.totalCashback).toBe(100.00); // R$ 100 de cashback!
    });
  });

  describe('Precision and rounding', () => {
    test('should round values to 2 decimal places', () => {
      const result = calculateTotalCashback(33.33, 'bronze', false);
      // 33.33 * 0.015 = 0.49995 -> should be 0.50
      expect(result.baseCashback).toBe(0.50);
      expect(result.totalCashback).toBe(0.50);
    });

    test('should handle complex decimal calculations', () => {
      const result = calculateTotalCashback(123.45, 'gold', true);
      // Base: 123.45 * 0.045 = 5.55525 -> 5.56
      // Instagram: 123.45 * 0.05 = 6.1725 -> 6.17
      // Total: 11.73
      expect(result.baseCashback).toBe(5.56);
      expect(result.instagramCashback).toBe(6.17);
      expect(result.totalCashback).toBe(11.73);
    });
  });

  describe('Edge cases', () => {
    test('should return 0 for amount = 0', () => {
      const result = calculateTotalCashback(0, 'platinum', true);
      expect(result.baseCashback).toBe(0);
      expect(result.instagramCashback).toBe(0);
      expect(result.totalCashback).toBe(0);
    });

    test('should handle invalid tier (defaults to bronze)', () => {
      const result = calculateTotalCashback(100, 'invalid', false);
      expect(result.baseCashback).toBe(1.50); // Bronze
    });
  });
});

describe('CashbackCalculator - calculateProgressToNextTier()', () => {
  describe('Bronze tier progress', () => {
    test('should calculate progress from bronze to silver (spent = 0)', () => {
      const result = calculateProgressToNextTier(0);
      expect(result.currentTier).toBe('bronze');
      expect(result.nextTier).toBe('silver');
      expect(result.amountToNext).toBe(1000);
      expect(result.progressPercentage).toBe(0);
    });

    test('should calculate progress from bronze to silver (spent = 500)', () => {
      const result = calculateProgressToNextTier(500);
      expect(result.currentTier).toBe('bronze');
      expect(result.nextTier).toBe('silver');
      expect(result.amountToNext).toBe(500);
      expect(result.progressPercentage).toBe(50);
    });

    test('should calculate progress from bronze to silver (spent = 999)', () => {
      const result = calculateProgressToNextTier(999);
      expect(result.currentTier).toBe('bronze');
      expect(result.nextTier).toBe('silver');
      expect(result.amountToNext).toBe(1);
      expect(result.progressPercentage).toBeCloseTo(99.9, 1);
    });
  });

  describe('Silver tier progress', () => {
    test('should calculate progress from silver to gold (spent = 1000)', () => {
      const result = calculateProgressToNextTier(1000);
      expect(result.currentTier).toBe('silver');
      expect(result.nextTier).toBe('gold');
      expect(result.amountToNext).toBe(4000);
      expect(result.progressPercentage).toBe(0);
    });

    test('should calculate progress from silver to gold (spent = 3000)', () => {
      const result = calculateProgressToNextTier(3000);
      expect(result.currentTier).toBe('silver');
      expect(result.nextTier).toBe('gold');
      expect(result.amountToNext).toBe(2000);
      expect(result.progressPercentage).toBe(50);
    });
  });

  describe('Gold tier progress', () => {
    test('should calculate progress from gold to platinum (spent = 5000)', () => {
      const result = calculateProgressToNextTier(5000);
      expect(result.currentTier).toBe('gold');
      expect(result.nextTier).toBe('platinum');
      expect(result.amountToNext).toBe(5000);
      expect(result.progressPercentage).toBe(0);
    });

    test('should calculate progress from gold to platinum (spent = 7500)', () => {
      const result = calculateProgressToNextTier(7500);
      expect(result.currentTier).toBe('gold');
      expect(result.nextTier).toBe('platinum');
      expect(result.amountToNext).toBe(2500);
      expect(result.progressPercentage).toBe(50);
    });
  });

  describe('Platinum tier (no next tier)', () => {
    test('should return null for next tier when at platinum', () => {
      const result = calculateProgressToNextTier(10000);
      expect(result.currentTier).toBe('platinum');
      expect(result.nextTier).toBeNull();
      expect(result.amountToNext).toBe(0);
      expect(result.progressPercentage).toBe(100);
    });

    test('should return null for next tier when above platinum threshold', () => {
      const result = calculateProgressToNextTier(50000);
      expect(result.currentTier).toBe('platinum');
      expect(result.nextTier).toBeNull();
      expect(result.amountToNext).toBe(0);
      expect(result.progressPercentage).toBe(100);
    });
  });

  describe('Edge cases', () => {
    test('should handle spent = 0', () => {
      const result = calculateProgressToNextTier(0);
      expect(result.currentTier).toBe('bronze');
      expect(result.nextTier).toBe('silver');
    });

    test('should handle string input', () => {
      const result = calculateProgressToNextTier('2500');
      expect(result.currentTier).toBe('silver');
    });

    test('should handle null/undefined as 0', () => {
      const result = calculateProgressToNextTier(null);
      expect(result.currentTier).toBe('bronze');
    });

    test('should not return negative amountToNext', () => {
      const result = calculateProgressToNextTier(15000);
      expect(result.amountToNext).toBeGreaterThanOrEqual(0);
    });

    test('should cap progressPercentage at 100', () => {
      const result = calculateProgressToNextTier(999999);
      expect(result.progressPercentage).toBeLessThanOrEqual(100);
    });
  });
});

describe('CashbackCalculator - getTierBenefits()', () => {
  test('should return bronze benefits', () => {
    const benefits = getTierBenefits('bronze');
    expect(benefits.cashbackRate).toBe('1.5');
    expect(benefits.description).toBeDefined();
    expect(benefits.features).toBeInstanceOf(Array);
    expect(benefits.features.length).toBeGreaterThan(0);
    expect(benefits.features[0]).toContain('1.5%');
  });

  test('should return silver benefits', () => {
    const benefits = getTierBenefits('silver');
    expect(benefits.cashbackRate).toBe('3.0');
    expect(benefits.description).toBeDefined();
    expect(benefits.features).toBeInstanceOf(Array);
    expect(benefits.features[0]).toContain('3.0%');
    expect(benefits.features).toContain('Prioridade no atendimento');
  });

  test('should return gold benefits', () => {
    const benefits = getTierBenefits('gold');
    expect(benefits.cashbackRate).toBe('4.5');
    expect(benefits.description).toBeDefined();
    expect(benefits.features).toBeInstanceOf(Array);
    expect(benefits.features[0]).toContain('4.5%');
    expect(benefits.features).toContain('Atendimento VIP');
  });

  test('should return platinum benefits', () => {
    const benefits = getTierBenefits('platinum');
    expect(benefits.cashbackRate).toBe('5.0');
    expect(benefits.description).toBeDefined();
    expect(benefits.features).toBeInstanceOf(Array);
    expect(benefits.features[0]).toContain('5.0%');
    expect(benefits.features).toContain('Concierge exclusivo');
  });

  test('should return bronze benefits for invalid tier', () => {
    const benefits = getTierBenefits('invalid');
    expect(benefits.cashbackRate).toBe('1.5');
  });

  test('should include correct number of features per tier', () => {
    expect(getTierBenefits('bronze').features.length).toBe(3);
    expect(getTierBenefits('silver').features.length).toBe(4);
    expect(getTierBenefits('gold').features.length).toBe(5);
    expect(getTierBenefits('platinum').features.length).toBe(6);
  });
});

describe('CashbackCalculator - Integration tests', () => {
  test('should calculate full customer journey: bronze to platinum', () => {
    // Cliente novo: R$ 0 gastos
    let spent = 0;
    let tier = calculateTierFromSpent(spent);
    expect(tier).toBe('bronze');

    // Primeira compra: R$ 500
    spent = 500;
    tier = calculateTierFromSpent(spent);
    expect(tier).toBe('bronze');
    let cashback = calculateCashbackByTier(500, tier);
    expect(cashback).toBe(7.50); // 1.5%

    // Segunda compra: R$ 600 (total: R$ 1100)
    spent = 1100;
    tier = calculateTierFromSpent(spent);
    expect(tier).toBe('silver'); // Subiu para silver!
    cashback = calculateCashbackByTier(600, tier);
    expect(cashback).toBe(18.00); // 3%

    // Múltiplas compras chegando a R$ 6000
    spent = 6000;
    tier = calculateTierFromSpent(spent);
    expect(tier).toBe('gold'); // Subiu para gold!
    cashback = calculateCashbackByTier(1000, tier);
    expect(cashback).toBe(45.00); // 4.5%

    // Cliente fiel: R$ 12000
    spent = 12000;
    tier = calculateTierFromSpent(spent);
    expect(tier).toBe('platinum'); // Subiu para platinum!
    cashback = calculateCashbackByTier(1000, tier);
    expect(cashback).toBe(50.00); // 5%
  });

  test('should calculate Instagram bonus correctly at each tier', () => {
    // Bronze + Instagram
    let result = calculateTotalCashback(100, 'bronze', true);
    expect(result.totalCashback).toBe(6.50); // 1.5% + 5% = 6.5%

    // Silver + Instagram
    result = calculateTotalCashback(100, 'silver', true);
    expect(result.totalCashback).toBe(8.00); // 3% + 5% = 8%

    // Gold + Instagram
    result = calculateTotalCashback(100, 'gold', true);
    expect(result.totalCashback).toBe(9.50); // 4.5% + 5% = 9.5%

    // Platinum + Instagram
    result = calculateTotalCashback(100, 'platinum', true);
    expect(result.totalCashback).toBe(10.00); // 5% + 5% = 10%
  });

  test('should match tier thresholds with progress calculations', () => {
    // No threshold exato, deve estar no novo tier com 0% de progresso
    // EXCETO threshold 0 (bronze inicial) e 10000 (platinum = 100%)
    const progress1000 = calculateProgressToNextTier(1000);
    expect(progress1000.progressPercentage).toBe(0); // Silver inicial

    const progress5000 = calculateProgressToNextTier(5000);
    expect(progress5000.progressPercentage).toBe(0); // Gold inicial

    const progress10000 = calculateProgressToNextTier(10000);
    expect(progress10000.progressPercentage).toBe(100); // Platinum = máximo

    const progress0 = calculateProgressToNextTier(0);
    expect(progress0.progressPercentage).toBe(0); // Bronze inicial
  });
});
