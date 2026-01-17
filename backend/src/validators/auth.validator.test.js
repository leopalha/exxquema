"use strict";
/**
 * FLAME Lounge Bar - Auth Validator Tests
 */
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const auth_validator_1 = require("./auth.validator");
(0, vitest_1.describe)('Auth Validators', () => {
    (0, vitest_1.describe)('registerSchema', () => {
        (0, vitest_1.it)('should validate correct registration data', () => {
            const validData = {
                name: 'João Silva',
                email: 'joao@email.com',
                password: 'Test123!',
                phone: '+5521999999999',
            };
            const result = auth_validator_1.registerSchema.safeParse(validData);
            (0, vitest_1.expect)(result.success).toBe(true);
        });
        (0, vitest_1.it)('should reject name with less than 3 characters', () => {
            const invalidData = {
                name: 'Jo',
                email: 'joao@email.com',
                password: 'Test123!',
                phone: '+5521999999999',
            };
            const result = auth_validator_1.registerSchema.safeParse(invalidData);
            (0, vitest_1.expect)(result.success).toBe(false);
            if (!result.success) {
                const errors = result.error.issues;
                (0, vitest_1.expect)(errors.length).toBeGreaterThan(0);
                (0, vitest_1.expect)(errors.some((e) => e.message?.includes('pelo menos'))).toBe(true);
            }
        });
        (0, vitest_1.it)('should reject invalid email', () => {
            const invalidData = {
                name: 'João Silva',
                email: 'invalid-email',
                password: 'Test123!',
                phone: '+5521999999999',
            };
            const result = auth_validator_1.registerSchema.safeParse(invalidData);
            (0, vitest_1.expect)(result.success).toBe(false);
            if (!result.success) {
                const errors = result.error.issues;
                (0, vitest_1.expect)(errors.length).toBeGreaterThan(0);
                (0, vitest_1.expect)(errors.some((e) => e.message?.toLowerCase().includes('email'))).toBe(true);
            }
        });
        (0, vitest_1.it)('should reject weak password', () => {
            const invalidData = {
                name: 'João Silva',
                email: 'joao@email.com',
                password: 'weak',
                phone: '+5521999999999',
            };
            const result = auth_validator_1.registerSchema.safeParse(invalidData);
            (0, vitest_1.expect)(result.success).toBe(false);
        });
        (0, vitest_1.it)('should reject invalid phone format', () => {
            const invalidData = {
                name: 'João Silva',
                email: 'joao@email.com',
                password: 'Test123!',
                phone: '123',
            };
            const result = auth_validator_1.registerSchema.safeParse(invalidData);
            (0, vitest_1.expect)(result.success).toBe(false);
        });
        (0, vitest_1.it)('should trim and lowercase email', () => {
            const data = {
                name: 'João Silva',
                email: '  JOAO@EMAIL.COM  ',
                password: 'Test123!',
                phone: '+5521999999999',
            };
            const result = auth_validator_1.registerSchema.safeParse(data);
            (0, vitest_1.expect)(result.success).toBe(true);
            if (result.success) {
                (0, vitest_1.expect)(result.data.email).toBe('joao@email.com');
            }
        });
    });
    (0, vitest_1.describe)('loginSchema', () => {
        (0, vitest_1.it)('should validate correct login data', () => {
            const validData = {
                email: 'joao@email.com',
                password: 'Test123!',
            };
            const result = auth_validator_1.loginSchema.safeParse(validData);
            (0, vitest_1.expect)(result.success).toBe(true);
        });
        (0, vitest_1.it)('should reject missing email', () => {
            const invalidData = {
                password: 'Test123!',
            };
            const result = auth_validator_1.loginSchema.safeParse(invalidData);
            (0, vitest_1.expect)(result.success).toBe(false);
        });
        (0, vitest_1.it)('should reject missing password', () => {
            const invalidData = {
                email: 'joao@email.com',
            };
            const result = auth_validator_1.loginSchema.safeParse(invalidData);
            (0, vitest_1.expect)(result.success).toBe(false);
        });
    });
    (0, vitest_1.describe)('verifyCodeSchema', () => {
        (0, vitest_1.it)('should validate correct verification code', () => {
            const validData = {
                phone: '+5521999999999',
                code: '123456',
            };
            const result = auth_validator_1.verifyCodeSchema.safeParse(validData);
            (0, vitest_1.expect)(result.success).toBe(true);
        });
        (0, vitest_1.it)('should reject code with wrong length', () => {
            const invalidData = {
                phone: '+5521999999999',
                code: '123',
            };
            const result = auth_validator_1.verifyCodeSchema.safeParse(invalidData);
            (0, vitest_1.expect)(result.success).toBe(false);
        });
        (0, vitest_1.it)('should reject code with non-numeric characters', () => {
            const invalidData = {
                phone: '+5521999999999',
                code: '12345a',
            };
            const result = auth_validator_1.verifyCodeSchema.safeParse(invalidData);
            (0, vitest_1.expect)(result.success).toBe(false);
        });
    });
    (0, vitest_1.describe)('googleAuthSchema', () => {
        (0, vitest_1.it)('should validate google token', () => {
            const validData = {
                token: 'valid-google-token-here',
            };
            const result = auth_validator_1.googleAuthSchema.safeParse(validData);
            (0, vitest_1.expect)(result.success).toBe(true);
        });
        (0, vitest_1.it)('should reject empty token', () => {
            const invalidData = {
                token: '',
            };
            const result = auth_validator_1.googleAuthSchema.safeParse(invalidData);
            (0, vitest_1.expect)(result.success).toBe(false);
        });
    });
});
