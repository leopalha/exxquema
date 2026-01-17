"use strict";
/**
 * FLAME Lounge Bar - Product Validator Tests
 */
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const product_validator_1 = require("./product.validator");
(0, vitest_1.describe)('Product Validators', () => {
    (0, vitest_1.describe)('createProductSchema', () => {
        (0, vitest_1.it)('should validate correct product data', () => {
            const validData = {
                name: 'Hambúrguer FLAME',
                description: 'Blend premium 180g com queijo cheddar',
                price: 45.0,
                category: 'food',
                subcategory: 'burgers',
                stock: 25,
                available: true,
            };
            const result = product_validator_1.createProductSchema.safeParse(validData);
            (0, vitest_1.expect)(result.success).toBe(true);
        });
        (0, vitest_1.it)('should reject name < 3 characters', () => {
            const invalidData = {
                name: 'AB',
                description: 'Test description here',
                price: 45.0,
                category: 'food',
            };
            const result = product_validator_1.createProductSchema.safeParse(invalidData);
            (0, vitest_1.expect)(result.success).toBe(false);
        });
        (0, vitest_1.it)('should reject negative price', () => {
            const invalidData = {
                name: 'Test Product',
                description: 'Test description here',
                price: -10,
                category: 'food',
            };
            const result = product_validator_1.createProductSchema.safeParse(invalidData);
            (0, vitest_1.expect)(result.success).toBe(false);
        });
        (0, vitest_1.it)('should reject invalid category', () => {
            const invalidData = {
                name: 'Test Product',
                description: 'Test description here',
                price: 45.0,
                category: 'invalid_category',
            };
            const result = product_validator_1.createProductSchema.safeParse(invalidData);
            (0, vitest_1.expect)(result.success).toBe(false);
        });
        (0, vitest_1.it)('should validate with ingredients', () => {
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
            const result = product_validator_1.createProductSchema.safeParse(validData);
            (0, vitest_1.expect)(result.success).toBe(true);
        });
        (0, vitest_1.it)('should validate with nutritional info', () => {
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
            const result = product_validator_1.createProductSchema.safeParse(validData);
            (0, vitest_1.expect)(result.success).toBe(true);
        });
        (0, vitest_1.it)('should default available to true', () => {
            const data = {
                name: 'Test Product',
                description: 'Test description here',
                price: 45.0,
                category: 'food',
            };
            const result = product_validator_1.createProductSchema.safeParse(data);
            (0, vitest_1.expect)(result.success).toBe(true);
            if (result.success) {
                (0, vitest_1.expect)(result.data.available).toBe(true);
            }
        });
    });
    (0, vitest_1.describe)('productQuerySchema', () => {
        (0, vitest_1.it)('should validate query params', () => {
            const validData = {
                page: '1',
                limit: '20',
                category: 'food',
                search: 'hambúrguer',
            };
            const result = product_validator_1.productQuerySchema.safeParse(validData);
            (0, vitest_1.expect)(result.success).toBe(true);
        });
        (0, vitest_1.it)('should default page to 1', () => {
            const data = {};
            const result = product_validator_1.productQuerySchema.safeParse(data);
            (0, vitest_1.expect)(result.success).toBe(true);
            if (result.success) {
                (0, vitest_1.expect)(result.data.page).toBe(1);
            }
        });
        (0, vitest_1.it)('should default limit to 20', () => {
            const data = {};
            const result = product_validator_1.productQuerySchema.safeParse(data);
            (0, vitest_1.expect)(result.success).toBe(true);
            if (result.success) {
                (0, vitest_1.expect)(result.data.limit).toBe(20);
            }
        });
        (0, vitest_1.it)('should transform available string to boolean', () => {
            const data = {
                available: 'true',
            };
            const result = product_validator_1.productQuerySchema.safeParse(data);
            (0, vitest_1.expect)(result.success).toBe(true);
            if (result.success) {
                (0, vitest_1.expect)(result.data.available).toBe(true);
                (0, vitest_1.expect)(typeof result.data.available).toBe('boolean');
            }
        });
        (0, vitest_1.it)('should validate price range', () => {
            const data = {
                min_price: '10',
                max_price: '50',
            };
            const result = product_validator_1.productQuerySchema.safeParse(data);
            (0, vitest_1.expect)(result.success).toBe(true);
            if (result.success) {
                (0, vitest_1.expect)(result.data.min_price).toBe(10);
                (0, vitest_1.expect)(result.data.max_price).toBe(50);
            }
        });
        (0, vitest_1.it)('should default sort_by to created_at', () => {
            const data = {};
            const result = product_validator_1.productQuerySchema.safeParse(data);
            (0, vitest_1.expect)(result.success).toBe(true);
            if (result.success) {
                (0, vitest_1.expect)(result.data.sort_by).toBe('created_at');
            }
        });
    });
});
