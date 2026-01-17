/**
 * FLAME Lounge Bar - User Validation Schemas
 */

import { z } from 'zod';

// ============================================
// UPDATE PROFILE VALIDATION
// ============================================

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim()
    .optional(),

  phone: z
    .string()
    .regex(/^\+?[1-9]\d{10,14}$/, 'Telefone inválido')
    .optional(),

  preferences: z
    .object({
      notifications: z.boolean().optional(),
      marketing: z.boolean().optional(),
      theme: z.enum(['light', 'dark', 'auto']).optional(),
    })
    .optional(),

  profile_image: z
    .string()
    .url('URL da imagem inválida')
    .optional()
    .nullable(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ============================================
// CHANGE PASSWORD VALIDATION
// ============================================

export const changePasswordSchema = z
  .object({
    current_password: z
      .string({ required_error: 'Senha atual é obrigatória' })
      .min(1),

    new_password: z
      .string({ required_error: 'Nova senha é obrigatória' })
      .min(6, 'Senha deve ter pelo menos 6 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Senha deve conter letras maiúsculas, minúsculas e números'
      ),

    confirm_password: z
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

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// ============================================
// USER QUERY VALIDATION (Admin)
// ============================================

export const userQuerySchema = z.object({
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

  role: z.enum(['customer', 'staff', 'admin']).optional(),

  tier: z.enum(['bronze', 'silver', 'gold', 'platinum']).optional(),

  search: z
    .string()
    .min(2, 'Busca deve ter pelo menos 2 caracteres')
    .max(100)
    .optional(),

  sort_by: z
    .enum(['name', 'email', 'created_at', 'total_spent'])
    .optional()
    .default('created_at'),

  sort_order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type UserQueryInput = z.infer<typeof userQuerySchema>;

// ============================================
// UPDATE USER ROLE (Admin)
// ============================================

export const updateUserRoleSchema = z.object({
  role: z.enum(['customer', 'staff', 'admin'], {
    required_error: 'Role é obrigatório',
    invalid_type_error: 'Role inválido',
  }),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
