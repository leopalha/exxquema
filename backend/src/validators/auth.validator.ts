/**
 * FLAME Lounge Bar - Auth Validation Schemas
 *
 * Validações Zod para rotas de autenticação
 */

import { z } from 'zod';

// ============================================
// REGISTER VALIDATION
// ============================================

export const registerSchema = z.object({
  name: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),

  email: z
    .string({ required_error: 'Email é obrigatório' })
    .email('Email inválido')
    .toLowerCase()
    .trim(),

  password: z
    .string({ required_error: 'Senha é obrigatória' })
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Senha deve conter letras maiúsculas, minúsculas e números'
    ),

  phone: z
    .string({ required_error: 'Telefone é obrigatório' })
    .regex(/^\+?[1-9]\d{10,14}$/, 'Telefone inválido (formato: +5521999999999)')
    .trim(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// ============================================
// LOGIN VALIDATION
// ============================================

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email é obrigatório' })
    .email('Email inválido')
    .toLowerCase()
    .trim(),

  password: z
    .string({ required_error: 'Senha é obrigatória' })
    .min(1, 'Senha é obrigatória'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ============================================
// GOOGLE AUTH VALIDATION
// ============================================

export const googleAuthSchema = z.object({
  token: z
    .string({ required_error: 'Token do Google é obrigatório' })
    .min(1, 'Token do Google é obrigatório'),
});

export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;

// ============================================
// PHONE VERIFICATION
// ============================================

export const verifyPhoneSchema = z.object({
  phone: z
    .string({ required_error: 'Telefone é obrigatório' })
    .regex(/^\+?[1-9]\d{10,14}$/, 'Telefone inválido (formato: +5521999999999)'),
});

export type VerifyPhoneInput = z.infer<typeof verifyPhoneSchema>;

export const verifyCodeSchema = z.object({
  phone: z
    .string({ required_error: 'Telefone é obrigatório' })
    .regex(/^\+?[1-9]\d{10,14}$/, 'Telefone inválido'),

  code: z
    .string({ required_error: 'Código é obrigatório' })
    .length(6, 'Código deve ter 6 dígitos')
    .regex(/^\d{6}$/, 'Código deve conter apenas números'),
});

export type VerifyCodeInput = z.infer<typeof verifyCodeSchema>;

// ============================================
// PASSWORD RESET
// ============================================

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email é obrigatório' })
    .email('Email inválido')
    .toLowerCase(),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string({ required_error: 'Token é obrigatório' }),

  password: z
    .string({ required_error: 'Nova senha é obrigatória' })
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Senha deve conter letras maiúsculas, minúsculas e números'
    ),

  confirmPassword: z.string({ required_error: 'Confirmação de senha é obrigatória' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
