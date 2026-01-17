import { describe, it, expect } from 'vitest';
import {
  calculateTierFromSpent,
  getCashbackRate,
  calculateCashbackAmount,
} from '../cashbackCalculator.js';

describe('CashbackCalculator', () => {
  describe('calculateTierFromSpent', () => {
    it('deve retornar Bronze para gasto < R$ 500', () => {
      expect(calculateTierFromSpent(0)).toBe('bronze');
      expect(calculateTierFromSpent(100)).toBe('bronze');
      expect(calculateTierFromSpent(499)).toBe('bronze');
    });

    it('deve retornar Silver para gasto entre R$ 500 e R$ 2000', () => {
      expect(calculateTierFromSpent(500)).toBe('silver');
      expect(calculateTierFromSpent(1000)).toBe('silver');
      expect(calculateTierFromSpent(1999)).toBe('silver');
    });

    it('deve retornar Gold para gasto >= R$ 2000 e < R$ 10000', () => {
      expect(calculateTierFromSpent(2000)).toBe('gold');
      expect(calculateTierFromSpent(5000)).toBe('gold');
      expect(calculateTierFromSpent(9999)).toBe('gold');
    });

    it('deve retornar Platinum para gasto >= R$ 10000', () => {
      expect(calculateTierFromSpent(10000)).toBe('platinum');
      expect(calculateTierFromSpent(15000)).toBe('platinum');
    });
  });

  describe('getCashbackRate', () => {
    it('deve retornar 1.5% para Bronze', () => {
      expect(getCashbackRate('bronze')).toBe(0.015);
    });

    it('deve retornar 3% para Silver', () => {
      expect(getCashbackRate('silver')).toBe(0.03);
    });

    it('deve retornar 4.5% para Gold', () => {
      expect(getCashbackRate('gold')).toBe(0.045);
    });

    it('deve retornar 5% para Platinum', () => {
      expect(getCashbackRate('platinum')).toBe(0.05);
    });
  });

  describe('calculateCashbackAmount', () => {
    it('deve calcular cashback para Bronze (1.5%)', () => {
      expect(calculateCashbackAmount(100, 'bronze')).toBe(1.50);
    });

    it('deve calcular cashback para Silver (3%)', () => {
      expect(calculateCashbackAmount(100, 'silver')).toBe(3.00);
    });

    it('deve calcular cashback para Gold (4.5%)', () => {
      expect(calculateCashbackAmount(100, 'gold')).toBe(4.50);
    });

    it('deve calcular cashback para Platinum (5%)', () => {
      expect(calculateCashbackAmount(100, 'platinum')).toBe(5.00);
    });

    it('deve calcular corretamente para valores decimais', () => {
      expect(calculateCashbackAmount(123.45, 'silver')).toBeCloseTo(3.70, 2);
    });
  });
});
