/**
 * FLAME Lounge Bar - Reservation Validation Schemas
 *
 * Validações Zod para rotas de reservas
 */

import { z } from 'zod';

// ============================================
// CREATE RESERVATION VALIDATION
// ============================================

export const createReservationSchema = z.object({
  date: z
    .string({ required_error: 'Data é obrigatória' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
    .refine(
      (date) => {
        const reservationDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return reservationDate >= today;
      },
      { message: 'Data não pode ser no passado' }
    ),

  time: z
    .string({ required_error: 'Horário é obrigatório' })
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Horário deve estar no formato HH:MM')
    .refine(
      (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        // Horário de funcionamento: 18:00 às 02:00
        return (hours >= 18 || hours <= 2) && minutes % 15 === 0;
      },
      {
        message: 'Horário deve ser entre 18:00 e 02:00, em intervalos de 15 minutos',
      }
    ),

  guests: z
    .number({ required_error: 'Número de pessoas é obrigatório' })
    .int('Número de pessoas deve ser um inteiro')
    .min(1, 'Deve haver pelo menos 1 pessoa')
    .max(20, 'Número máximo é 20 pessoas'),

  notes: z
    .string()
    .max(1000, 'Observações devem ter no máximo 1000 caracteres')
    .trim()
    .optional()
    .nullable(),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;

// ============================================
// UPDATE RESERVATION VALIDATION
// ============================================

export const updateReservationSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
    .refine(
      (date) => {
        const reservationDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return reservationDate >= today;
      },
      { message: 'Data não pode ser no passado' }
    )
    .optional(),

  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Horário deve estar no formato HH:MM')
    .refine(
      (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return (hours >= 18 || hours <= 2) && minutes % 15 === 0;
      },
      {
        message: 'Horário deve ser entre 18:00 e 02:00, em intervalos de 15 minutos',
      }
    )
    .optional(),

  guests: z
    .number()
    .int('Número de pessoas deve ser um inteiro')
    .min(1, 'Deve haver pelo menos 1 pessoa')
    .max(20, 'Número máximo é 20 pessoas')
    .optional(),

  notes: z
    .string()
    .max(1000, 'Observações devem ter no máximo 1000 caracteres')
    .trim()
    .optional()
    .nullable(),
});

export type UpdateReservationInput = z.infer<typeof updateReservationSchema>;

// ============================================
// UPDATE STATUS VALIDATION
// ============================================

export const updateReservationStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled', 'no_show'], {
    required_error: 'Status é obrigatório',
    invalid_type_error: 'Status inválido',
  }),

  table_number: z
    .number()
    .int('Número da mesa deve ser um inteiro')
    .min(1, 'Número da mesa deve ser pelo menos 1')
    .max(99, 'Número da mesa deve ser no máximo 99')
    .optional()
    .nullable(),

  notes: z
    .string()
    .max(500, 'Observações devem ter no máximo 500 caracteres')
    .optional()
    .nullable(),
});

export type UpdateReservationStatusInput = z.infer<typeof updateReservationStatusSchema>;

// ============================================
// QUERY PARAMS VALIDATION
// ============================================

export const reservationQuerySchema = z.object({
  status: z
    .enum(['pending', 'confirmed', 'completed', 'cancelled', 'no_show'])
    .optional(),

  date_from: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
    .optional(),

  date_to: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
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
});

export type ReservationQueryInput = z.infer<typeof reservationQuerySchema>;
