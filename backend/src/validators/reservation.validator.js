"use strict";
/**
 * FLAME Lounge Bar - Reservation Validation Schemas
 *
 * Validações Zod para rotas de reservas
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationQuerySchema = exports.updateReservationStatusSchema = exports.updateReservationSchema = exports.createReservationSchema = void 0;
const zod_1 = require("zod");
// ============================================
// CREATE RESERVATION VALIDATION
// ============================================
exports.createReservationSchema = zod_1.z.object({
    date: zod_1.z
        .string({ required_error: 'Data é obrigatória' })
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
        .refine((date) => {
        const reservationDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return reservationDate >= today;
    }, { message: 'Data não pode ser no passado' }),
    time: zod_1.z
        .string({ required_error: 'Horário é obrigatório' })
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Horário deve estar no formato HH:MM')
        .refine((time) => {
        const [hours, minutes] = time.split(':').map(Number);
        // Horário de funcionamento: 18:00 às 02:00
        return (hours >= 18 || hours <= 2) && minutes % 15 === 0;
    }, {
        message: 'Horário deve ser entre 18:00 e 02:00, em intervalos de 15 minutos',
    }),
    guests: zod_1.z
        .number({ required_error: 'Número de pessoas é obrigatório' })
        .int('Número de pessoas deve ser um inteiro')
        .min(1, 'Deve haver pelo menos 1 pessoa')
        .max(20, 'Número máximo é 20 pessoas'),
    notes: zod_1.z
        .string()
        .max(1000, 'Observações devem ter no máximo 1000 caracteres')
        .trim()
        .optional()
        .nullable(),
});
// ============================================
// UPDATE RESERVATION VALIDATION
// ============================================
exports.updateReservationSchema = zod_1.z.object({
    date: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
        .refine((date) => {
        const reservationDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return reservationDate >= today;
    }, { message: 'Data não pode ser no passado' })
        .optional(),
    time: zod_1.z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Horário deve estar no formato HH:MM')
        .refine((time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return (hours >= 18 || hours <= 2) && minutes % 15 === 0;
    }, {
        message: 'Horário deve ser entre 18:00 e 02:00, em intervalos de 15 minutos',
    })
        .optional(),
    guests: zod_1.z
        .number()
        .int('Número de pessoas deve ser um inteiro')
        .min(1, 'Deve haver pelo menos 1 pessoa')
        .max(20, 'Número máximo é 20 pessoas')
        .optional(),
    notes: zod_1.z
        .string()
        .max(1000, 'Observações devem ter no máximo 1000 caracteres')
        .trim()
        .optional()
        .nullable(),
});
// ============================================
// UPDATE STATUS VALIDATION
// ============================================
exports.updateReservationStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['pending', 'confirmed', 'completed', 'cancelled', 'no_show'], {
        required_error: 'Status é obrigatório',
        invalid_type_error: 'Status inválido',
    }),
    table_number: zod_1.z
        .number()
        .int('Número da mesa deve ser um inteiro')
        .min(1, 'Número da mesa deve ser pelo menos 1')
        .max(99, 'Número da mesa deve ser no máximo 99')
        .optional()
        .nullable(),
    notes: zod_1.z
        .string()
        .max(500, 'Observações devem ter no máximo 500 caracteres')
        .optional()
        .nullable(),
});
// ============================================
// QUERY PARAMS VALIDATION
// ============================================
exports.reservationQuerySchema = zod_1.z.object({
    status: zod_1.z
        .enum(['pending', 'confirmed', 'completed', 'cancelled', 'no_show'])
        .optional(),
    date_from: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
        .optional(),
    date_to: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
        .optional(),
    page: zod_1.z
        .string()
        .transform((val) => parseInt(val, 10))
        .pipe(zod_1.z.number().int().min(1))
        .optional()
        .default('1'),
    limit: zod_1.z
        .string()
        .transform((val) => parseInt(val, 10))
        .pipe(zod_1.z.number().int().min(1).max(100))
        .optional()
        .default('20'),
});
