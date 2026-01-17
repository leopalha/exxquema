/**
 * FLAME Lounge Bar - Order Validation Schemas
 *
 * Validações Zod para rotas de pedidos
 */

import { z } from 'zod';

// ============================================
// CREATE ORDER VALIDATION
// ============================================

const orderItemSchema = z.object({
  product_id: z
    .number({ required_error: 'ID do produto é obrigatório' })
    .int('ID do produto deve ser um número inteiro')
    .positive('ID do produto deve ser positivo'),

  quantity: z
    .number({ required_error: 'Quantidade é obrigatória' })
    .int('Quantidade deve ser um número inteiro')
    .min(1, 'Quantidade deve ser pelo menos 1')
    .max(99, 'Quantidade máxima é 99'),

  notes: z
    .string()
    .max(500, 'Observações devem ter no máximo 500 caracteres')
    .trim()
    .optional()
    .nullable(),
});

export const createOrderSchema = z.object({
  type: z.enum(['dine_in', 'takeout', 'delivery'], {
    required_error: 'Tipo de pedido é obrigatório',
    invalid_type_error: 'Tipo de pedido inválido',
  }),

  table_number: z
    .number()
    .int('Número da mesa deve ser um inteiro')
    .min(1, 'Número da mesa deve ser pelo menos 1')
    .max(99, 'Número da mesa deve ser no máximo 99')
    .optional()
    .nullable(),

  items: z
    .array(orderItemSchema, { required_error: 'Items são obrigatórios' })
    .min(1, 'Pedido deve ter pelo menos 1 item')
    .max(50, 'Pedido deve ter no máximo 50 items'),

  payment_method: z.enum(['credit_card', 'debit_card', 'pix', 'cash'], {
    required_error: 'Método de pagamento é obrigatório',
    invalid_type_error: 'Método de pagamento inválido',
  }),

  use_cashback: z
    .number()
    .nonnegative('Cashback usado não pode ser negativo')
    .optional()
    .default(0),

  notes: z
    .string()
    .max(1000, 'Observações devem ter no máximo 1000 caracteres')
    .trim()
    .optional()
    .nullable(),
}).refine(
  (data) => {
    // Se for dine_in, table_number é obrigatório
    if (data.type === 'dine_in' && !data.table_number) {
      return false;
    }
    return true;
  },
  {
    message: 'Número da mesa é obrigatório para pedidos no local',
    path: ['table_number'],
  }
);

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

// ============================================
// UPDATE ORDER STATUS VALIDATION
// ============================================

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'], {
    required_error: 'Status é obrigatório',
    invalid_type_error: 'Status inválido',
  }),

  estimated_time: z
    .number()
    .int('Tempo estimado deve ser um inteiro')
    .min(1, 'Tempo estimado deve ser pelo menos 1 minuto')
    .max(180, 'Tempo estimado deve ser no máximo 180 minutos')
    .optional()
    .nullable(),

  notes: z
    .string()
    .max(500, 'Observações devem ter no máximo 500 caracteres')
    .optional()
    .nullable(),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

// ============================================
// QUERY PARAMS VALIDATION
// ============================================

export const orderQuerySchema = z.object({
  status: z
    .enum(['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'])
    .optional(),

  type: z
    .enum(['dine_in', 'takeout', 'delivery'])
    .optional(),

  payment_status: z
    .enum(['pending', 'paid', 'failed', 'refunded'])
    .optional(),

  page: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1))
    .optional()
    .default('1'),

  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(100))
    .optional()
    .default('20'),

  date_from: z
    .string()
    .datetime({ message: 'Data inicial inválida' })
    .optional(),

  date_to: z
    .string()
    .datetime({ message: 'Data final inválida' })
    .optional(),
});

export type OrderQueryInput = z.infer<typeof orderQuerySchema>;
