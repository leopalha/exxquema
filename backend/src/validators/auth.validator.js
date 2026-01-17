"use strict";
/**
 * FLAME Lounge Bar - Auth Validation Schemas
 *
 * Validações Zod para rotas de autenticação
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.verifyCodeSchema = exports.verifyPhoneSchema = exports.googleAuthSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
// ============================================
// REGISTER VALIDATION
// ============================================
exports.registerSchema = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: 'Nome é obrigatório' })
        .min(3, 'Nome deve ter pelo menos 3 caracteres')
        .max(100, 'Nome deve ter no máximo 100 caracteres')
        .trim(),
    email: zod_1.z
        .string({ required_error: 'Email é obrigatório' })
        .trim()
        .toLowerCase()
        .email('Email inválido'),
    password: zod_1.z
        .string({ required_error: 'Senha é obrigatória' })
        .min(6, 'Senha deve ter pelo menos 6 caracteres')
        .max(100, 'Senha deve ter no máximo 100 caracteres')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter letras maiúsculas, minúsculas e números'),
    phone: zod_1.z
        .string({ required_error: 'Telefone é obrigatório' })
        .regex(/^\+?[1-9]\d{10,14}$/, 'Telefone inválido (formato: +5521999999999)')
        .trim(),
});
// ============================================
// LOGIN VALIDATION
// ============================================
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: 'Email é obrigatório' })
        .trim()
        .toLowerCase()
        .email('Email inválido'),
    password: zod_1.z
        .string({ required_error: 'Senha é obrigatória' })
        .min(1, 'Senha é obrigatória'),
});
// ============================================
// GOOGLE AUTH VALIDATION
// ============================================
exports.googleAuthSchema = zod_1.z.object({
    token: zod_1.z
        .string({ required_error: 'Token do Google é obrigatório' })
        .min(1, 'Token do Google é obrigatório'),
});
// ============================================
// PHONE VERIFICATION
// ============================================
exports.verifyPhoneSchema = zod_1.z.object({
    phone: zod_1.z
        .string({ required_error: 'Telefone é obrigatório' })
        .regex(/^\+?[1-9]\d{10,14}$/, 'Telefone inválido (formato: +5521999999999)'),
});
exports.verifyCodeSchema = zod_1.z.object({
    phone: zod_1.z
        .string({ required_error: 'Telefone é obrigatório' })
        .regex(/^\+?[1-9]\d{10,14}$/, 'Telefone inválido'),
    code: zod_1.z
        .string({ required_error: 'Código é obrigatório' })
        .length(6, 'Código deve ter 6 dígitos')
        .regex(/^\d{6}$/, 'Código deve conter apenas números'),
});
// ============================================
// PASSWORD RESET
// ============================================
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: 'Email é obrigatório' })
        .email('Email inválido')
        .toLowerCase(),
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string({ required_error: 'Token é obrigatório' }),
    password: zod_1.z
        .string({ required_error: 'Nova senha é obrigatória' })
        .min(6, 'Senha deve ter pelo menos 6 caracteres')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter letras maiúsculas, minúsculas e números'),
    confirmPassword: zod_1.z.string({ required_error: 'Confirmação de senha é obrigatória' }),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
});
