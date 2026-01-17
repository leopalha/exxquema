/**
 * FLAME Lounge Bar - Order Validator Tests
 */

import { describe, it, expect } from 'vitest';
import { createOrderSchema, updateOrderStatusSchema } from './order.validator';

describe('Order Validators', () => {
  describe('createOrderSchema', () => {
    it('should validate correct dine_in order', () => {
      const validData = {
        type: 'dine_in',
        table_number: 5,
        items: [
          {
            product_id: 1,
            quantity: 2,
            notes: 'Sem cebola',
          },
        ],
        payment_method: 'credit_card',
        use_cashback: 10.5,
      };

      const result = createOrderSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject dine_in without table_number', () => {
      const invalidData = {
        type: 'dine_in',
        items: [
          {
            product_id: 1,
            quantity: 2,
          },
        ],
        payment_method: 'credit_card',
      };

      const result = createOrderSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should validate takeout without table_number', () => {
      const validData = {
        type: 'takeout',
        items: [
          {
            product_id: 1,
            quantity: 1,
          },
        ],
        payment_method: 'pix',
      };

      const result = createOrderSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject order with empty items', () => {
      const invalidData = {
        type: 'takeout',
        items: [],
        payment_method: 'cash',
      };

      const result = createOrderSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject items with quantity 0', () => {
      const invalidData = {
        type: 'takeout',
        items: [
          {
            product_id: 1,
            quantity: 0,
          },
        ],
        payment_method: 'cash',
      };

      const result = createOrderSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject items with quantity > 99', () => {
      const invalidData = {
        type: 'takeout',
        items: [
          {
            product_id: 1,
            quantity: 100,
          },
        ],
        payment_method: 'cash',
      };

      const result = createOrderSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid payment method', () => {
      const invalidData = {
        type: 'takeout',
        items: [
          {
            product_id: 1,
            quantity: 1,
          },
        ],
        payment_method: 'bitcoin',
      };

      const result = createOrderSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should default use_cashback to 0', () => {
      const data = {
        type: 'takeout',
        items: [
          {
            product_id: 1,
            quantity: 1,
          },
        ],
        payment_method: 'cash',
      };

      const result = createOrderSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.use_cashback).toBe(0);
      }
    });
  });

  describe('updateOrderStatusSchema', () => {
    it('should validate status update', () => {
      const validData = {
        status: 'preparing',
        estimated_time: 20,
      };

      const result = updateOrderStatusSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid status', () => {
      const invalidData = {
        status: 'invalid_status',
      };

      const result = updateOrderStatusSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject estimated_time > 180', () => {
      const invalidData = {
        status: 'preparing',
        estimated_time: 200,
      };

      const result = updateOrderStatusSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should validate status update without estimated_time', () => {
      const validData = {
        status: 'completed',
      };

      const result = updateOrderStatusSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
});
