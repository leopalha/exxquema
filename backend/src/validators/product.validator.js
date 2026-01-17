"use strict";
/**
 * FLAME Lounge Bar - Product Validation Schemas
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.productQuerySchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
// ============================================
// CREATE PRODUCT VALIDATION
// ============================================
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: 'Nome é obrigatório' })
        .min(3, 'Nome deve ter pelo menos 3 caracteres')
        .max(100, 'Nome deve ter no máximo 100 caracteres')
        .trim(),
    description: zod_1.z
        .string({ required_error: 'Descrição é obrigatória' })
        .min(10, 'Descrição deve ter pelo menos 10 caracteres')
        .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
        .trim(),
    price: zod_1.z
        .number({ required_error: 'Preço é obrigatório' })
        .positive('Preço deve ser positivo')
        .max(9999.99, 'Preço máximo é R$ 9.999,99'),
    category: zod_1.z.enum(['food', 'drink', 'hookah', 'dessert', 'combo'], {
        required_error: 'Categoria é obrigatória',
        invalid_type_error: 'Categoria inválida',
    }),
    subcategory: zod_1.z
        .string()
        .max(50, 'Subcategoria deve ter no máximo 50 caracteres')
        .trim()
        .optional()
        .nullable(),
    image: zod_1.z
        .string()
        .url('URL da imagem inválida')
        .optional()
        .nullable(),
    stock: zod_1.z
        .number()
        .int('Estoque deve ser um número inteiro')
        .nonnegative('Estoque não pode ser negativo')
        .optional()
        .nullable(),
    available: zod_1.z
        .boolean()
        .optional()
        .default(true),
    ingredients: zod_1.z
        .array(zod_1.z.object({
        name: zod_1.z.string().min(2).max(100),
        quantity: zod_1.z.number().positive(),
        unit: zod_1.z.string().max(20).optional(),
    }))
        .optional()
        .nullable(),
    nutritional: zod_1.z
        .object({
        calories: zod_1.z.number().nonnegative(),
        protein: zod_1.z.number().nonnegative(),
        carbs: zod_1.z.number().nonnegative(),
        fat: zod_1.z.number().nonnegative(),
    })
        .optional()
        .nullable(),
});
// ============================================
// UPDATE PRODUCT VALIDATION
// ============================================
exports.updateProductSchema = exports.createProductSchema.partial();
// ============================================
// PRODUCT QUERY VALIDATION
// ============================================
exports.productQuerySchema = zod_1.z.object({
    page: zod_1.z
        .string()
        .optional()
        .default('1')
        .transform((val) => parseInt(val, 10))
        .pipe(zod_1.z.number().int().min(1)),
    limit: zod_1.z
        .string()
        .optional()
        .default('20')
        .transform((val) => parseInt(val, 10))
        .pipe(zod_1.z.number().int().min(1).max(100)),
    category: zod_1.z
        .enum(['food', 'drink', 'hookah', 'dessert', 'combo'])
        .optional(),
    subcategory: zod_1.z.string().optional(),
    available: zod_1.z
        .string()
        .transform((val) => val === 'true')
        .pipe(zod_1.z.boolean())
        .optional(),
    search: zod_1.z
        .string()
        .min(2, 'Busca deve ter pelo menos 2 caracteres')
        .max(100)
        .optional(),
    min_price: zod_1.z
        .string()
        .transform((val) => parseFloat(val))
        .pipe(zod_1.z.number().nonnegative())
        .optional(),
    max_price: zod_1.z
        .string()
        .transform((val) => parseFloat(val))
        .pipe(zod_1.z.number().positive())
        .optional(),
    sort_by: zod_1.z
        .enum(['name', 'price', 'created_at', 'popularity'])
        .optional()
        .default('created_at'),
    sort_order: zod_1.z
        .enum(['asc', 'desc'])
        .optional()
        .default('desc'),
});
