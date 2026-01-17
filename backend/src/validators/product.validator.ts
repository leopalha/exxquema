/**
 * FLAME Lounge Bar - Product Validation Schemas
 */

import { z } from 'zod';
import { PRODUCT_CATEGORIES } from '../constants';

// ============================================
// CREATE PRODUCT VALIDATION
// ============================================

export const createProductSchema = z.object({
  name: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),

  description: z
    .string({ required_error: 'Descrição é obrigatória' })
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
    .trim(),

  price: z
    .number({ required_error: 'Preço é obrigatório' })
    .positive('Preço deve ser positivo')
    .max(9999.99, 'Preço máximo é R$ 9.999,99'),

  category: z.enum(['food', 'drink', 'hookah', 'dessert', 'combo'], {
    required_error: 'Categoria é obrigatória',
    invalid_type_error: 'Categoria inválida',
  }),

  subcategory: z
    .string()
    .max(50, 'Subcategoria deve ter no máximo 50 caracteres')
    .trim()
    .optional()
    .nullable(),

  image: z
    .string()
    .url('URL da imagem inválida')
    .optional()
    .nullable(),

  stock: z
    .number()
    .int('Estoque deve ser um número inteiro')
    .nonnegative('Estoque não pode ser negativo')
    .optional()
    .nullable(),

  available: z
    .boolean()
    .optional()
    .default(true),

  ingredients: z
    .array(
      z.object({
        name: z.string().min(2).max(100),
        quantity: z.number().positive(),
        unit: z.string().max(20).optional(),
      })
    )
    .optional()
    .nullable(),

  nutritional: z
    .object({
      calories: z.number().nonnegative(),
      protein: z.number().nonnegative(),
      carbs: z.number().nonnegative(),
      fat: z.number().nonnegative(),
    })
    .optional()
    .nullable(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

// ============================================
// UPDATE PRODUCT VALIDATION
// ============================================

export const updateProductSchema = createProductSchema.partial();

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

// ============================================
// PRODUCT QUERY VALIDATION
// ============================================

export const productQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1)),

  limit: z
    .string()
    .optional()
    .default('20')
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(100)),

  category: z
    .enum(['food', 'drink', 'hookah', 'dessert', 'combo'])
    .optional(),

  subcategory: z.string().optional(),

  available: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
    .optional(),

  search: z
    .string()
    .min(2, 'Busca deve ter pelo menos 2 caracteres')
    .max(100)
    .optional(),

  min_price: z
    .string()
    .transform((val) => parseFloat(val))
    .pipe(z.number().nonnegative())
    .optional(),

  max_price: z
    .string()
    .transform((val) => parseFloat(val))
    .pipe(z.number().positive())
    .optional(),

  sort_by: z
    .enum(['name', 'price', 'created_at', 'popularity'])
    .optional()
    .default('created_at'),

  sort_order: z
    .enum(['asc', 'desc'])
    .optional()
    .default('desc'),
});

export type ProductQueryInput = z.infer<typeof productQuerySchema>;
