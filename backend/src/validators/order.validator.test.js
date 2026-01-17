"use strict";
/**
 * FLAME Lounge Bar - Order Validator Tests
 */
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const order_validator_1 = require("./order.validator");
(0, vitest_1.describe)('Order Validators', () => {
    (0, vitest_1.describe)('createOrderSchema', () => {
        (0, vitest_1.it)('should validate correct dine_in order', () => {
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
            const result = order_validator_1.createOrderSchema.safeParse(validData);
            (0, vitest_1.expect)(result.success).toBe(true);
        });
        (0, vitest_1.it)('should reject dine_in without table_number', () => {
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
            const result = order_validator_1.createOrderSchema.safeParse(invalidData);
            (0, vitest_1.expect)(result.success).toBe(false);
        });
        (0, vitest_1.it)('should validate takeout without table_number', () => {
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
            const result = order_validator_1.createOrderSchema.safeParse(validData);
            (0, vitest_1.expect)(result.success).toBe(true);
        });
        (0, vitest_1.it)('should reject order with empty items', () => {
            const invalidData = {
                type: 'takeout',
                items: [],
                payment_method: 'cash',
            };
            const result = order_validator_1.createOrderSchema.safeParse(invalidData);
            (0, vitest_1.expect)(result.success).toBe(false);
        });
        (0, vitest_1.it)('should reject items with quantity 0', () => {
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
            const result = order_validator_1.createOrderSchema.safeParse(invalidData);
            (0, vitest_1.expect)(result.success).toBe(false);
        });
        (0, vitest_1.it)('should reject items with quantity > 99', () => {
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
            const result = order_validator_1.createOrderSchema.safeParse(invalidData);
            (0, vitest_1.expect)(result.success).toBe(false);
        });
        (0, vitest_1.it)('should reject invalid payment method', () => {
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
            const result = order_validator_1.createOrderSchema.safeParse(invalidData);
            (0, vitest_1.expect)(result.success).toBe(false);
        });
        (0, vitest_1.it)('should default use_cashback to 0', () => {
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
            const result = order_validator_1.createOrderSchema.safeParse(data);
            (0, vitest_1.expect)(result.success).toBe(true);
            if (result.success) {
                (0, vitest_1.expect)(result.data.use_cashback).toBe(0);
            }
        });
    });
    (0, vitest_1.describe)('updateOrderStatusSchema', () => {
        (0, vitest_1.it)('should validate status update', () => {
            const validData = {
                status: 'preparing',
                estimated_time: 20,
            };
            const result = order_validator_1.updateOrderStatusSchema.safeParse(validData);
            (0, vitest_1.expect)(result.success).toBe(true);
        });
        (0, vitest_1.it)('should reject invalid status', () => {
            const invalidData = {
                status: 'invalid_status',
            };
            const result = order_validator_1.updateOrderStatusSchema.safeParse(invalidData);
            (0, vitest_1.expect)(result.success).toBe(false);
        });
        (0, vitest_1.it)('should reject estimated_time > 180', () => {
            const invalidData = {
                status: 'preparing',
                estimated_time: 200,
            };
            const result = order_validator_1.updateOrderStatusSchema.safeParse(invalidData);
            (0, vitest_1.expect)(result.success).toBe(false);
        });
        (0, vitest_1.it)('should validate status update without estimated_time', () => {
            const validData = {
                status: 'completed',
            };
            const result = order_validator_1.updateOrderStatusSchema.safeParse(validData);
            (0, vitest_1.expect)(result.success).toBe(true);
        });
    });
});
