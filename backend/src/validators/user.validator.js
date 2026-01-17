"use strict";
/**
 * FLAME Lounge Bar - User Validation Schemas
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRoleSchema = exports.userQuerySchema = exports.changePasswordSchema = exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
// ============================================
// UPDATE PROFILE VALIDATION
// ============================================
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(3, 'Nome deve ter pelo menos 3 caracteres')
        .max(100, 'Nome deve ter no máximo 100 caracteres')
        .trim()
        .optional(),
    phone: zod_1.z
        .string()
        .regex(/^\+?[1-9]\d{10,14}$/, 'Telefone inválido')
        .optional(),
    preferences: zod_1.z
        .object({
        notifications: zod_1.z.boolean().optional(),
        marketing: zod_1.z.boolean().optional(),
        theme: zod_1.z.enum(['light', 'dark', 'auto']).optional(),
    })
        .optional(),
    profile_image: zod_1.z
        .string()
        .url('URL da imagem inválida')
        .optional()
        .nullable(),
});
// ============================================
// CHANGE PASSWORD VALIDATION
// ============================================
exports.changePasswordSchema = zod_1.z
    .object({
    current_password: zod_1.z
        .string({ required_error: 'Senha atual é obrigatória' })
        .min(1),
    new_password: zod_1.z
        .string({ required_error: 'Nova senha é obrigatória' })
        .min(6, 'Senha deve ter pelo menos 6 caracteres')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter letras maiúsculas, minúsculas e números'),
    confirm_password: zod_1.z
        .string({ required_error: 'Confirmação de senha é obrigatória' }),
})
    .refine((data) => data.new_password === data.confirm_password, {
    message: 'Senhas não coincidem',
    path: ['confirm_password'],
})
    .refine((data) => data.new_password !== data.current_password, {
    message: 'Nova senha deve ser diferente da atual',
    path: ['new_password'],
});
// ============================================
// USER QUERY VALIDATION (Admin)
// ============================================
exports.userQuerySchema = zod_1.z.object({
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
    role: zod_1.z.enum(['customer', 'staff', 'admin']).optional(),
    tier: zod_1.z.enum(['bronze', 'silver', 'gold', 'platinum']).optional(),
    search: zod_1.z
        .string()
        .min(2, 'Busca deve ter pelo menos 2 caracteres')
        .max(100)
        .optional(),
    sort_by: zod_1.z
        .enum(['name', 'email', 'created_at', 'total_spent'])
        .optional()
        .default('created_at'),
    sort_order: zod_1.z.enum(['asc', 'desc']).optional().default('desc'),
});
// ============================================
// UPDATE USER ROLE (Admin)
// ============================================
exports.updateUserRoleSchema = zod_1.z.object({
    role: zod_1.z.enum(['customer', 'staff', 'admin'], {
        required_error: 'Role é obrigatório',
        invalid_type_error: 'Role inválido',
    }),
});
