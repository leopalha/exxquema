/**
 * FLAME Lounge Bar - Product Validator Tests
 */

import { describe, it, expect } from 'vitest';
import { createProductSchema, updateProductSchema, productQuerySchema } from './product.validator';

describe('Product Validators', () => {
  describe('createProductSchema', () => {
    it('should validate correct product data', () => {
      const validData = {
        name: 'Hambúrguer FLAME',
        description: 'Blend premium 180g com queijo cheddar',
        price: 45.0,
        category: 'food',
        subcategory: 'burgers',
        stock: 25,
        available: true,
      };

      const result = createProductSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject name < 3 characters', () => {
      const invalidData = {
        name: 'AB',
        description: 'Test description here',
        price: 45.0,
        category: 'food',
      };

      const result = createProductSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject negative price', () => {
      const invalidData = {
        name: 'Test Product',
        description: 'Test description here',
        price: -10,
        category: 'food',
      };

      const result = createProductSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid category', () => {
      const invalidData = {
        name: 'Test Product',
        description: 'Test description here',
        price: 45.0,
        category: 'invalid_category',
      };

      const result = createProductSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should validate with ingredients', () => {
      const validData = {
        name: 'Hambúrguer',
        description: 'Delicioso hambúrguer',
        price: 45.0,
        category: 'food',
        ingredients: [
          { name: 'Carne', quantity: 180, unit: 'g' },
          { name: 'Queijo', quantity: 50, unit: 'g' },
        ],
      };

      const result = createProductSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate with nutritional info', () => {
      const validData = {
        name: 'Hambúrguer',
        description: 'Delicioso hambúrguer',
        price: 45.0,
        category: 'food',
        nutritional: {
          calories: 650,
          protein: 35,
          carbs: 45,
          fat: 28,
        },
      };

      const result = createProductSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should default available to true', () => {
      const data = {
        name: 'Test Product',
        description: 'Test description here',
        price: 45.0,
        category: 'food',
      };

      const result = createProductSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.available).toBe(true);
      }
    });
  });

  describe('productQuerySchema', () => {
    it('should validate query params', () => {
      const validData = {
        page: '1',
        limit: '20',
        category: 'food',
        search: 'hambúrguer',
      };

      const result = productQuerySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should default page to 1', () => {
      const data = {};

      const result = productQuerySchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
      }
    });

    it('should default limit to 20', () => {
      const data = {};

      const result = productQuerySchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.limit).toBe(20);
      }
    });

    it('should transform available string to boolean', () => {
      const data = {
        available: 'true',
      };

      const result = productQuerySchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.available).toBe(true);
        expect(typeof result.data.available).toBe('boolean');
      }
    });

    it('should validate price range', () => {
      const data = {
        min_price: '10',
        max_price: '50',
      };

      const result = productQuerySchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.min_price).toBe(10);
        expect(result.data.max_price).toBe(50);
      }
    });

    it('should default sort_by to created_at', () => {
      const data = {};

      const result = productQuerySchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.sort_by).toBe('created_at');
      }
    });
  });
});
