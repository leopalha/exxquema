/**
 * FLAME Lounge Bar - Auth Validator Tests
 */

import { describe, it, expect } from 'vitest';
import {
  registerSchema,
  loginSchema,
  verifyCodeSchema,
  googleAuthSchema,
} from './auth.validator';

describe('Auth Validators', () => {
  describe('registerSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        name: 'João Silva',
        email: 'joao@email.com',
        password: 'Test123!',
        phone: '+5521999999999',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject name with less than 3 characters', () => {
      const invalidData = {
        name: 'Jo',
        email: 'joao@email.com',
        password: 'Test123!',
        phone: '+5521999999999',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.issues;
        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some((e) => e.message?.includes('pelo menos'))).toBe(true);
      }
    });

    it('should reject invalid email', () => {
      const invalidData = {
        name: 'João Silva',
        email: 'invalid-email',
        password: 'Test123!',
        phone: '+5521999999999',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.issues;
        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some((e) => e.message?.toLowerCase().includes('email'))).toBe(true);
      }
    });

    it('should reject weak password', () => {
      const invalidData = {
        name: 'João Silva',
        email: 'joao@email.com',
        password: 'weak',
        phone: '+5521999999999',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid phone format', () => {
      const invalidData = {
        name: 'João Silva',
        email: 'joao@email.com',
        password: 'Test123!',
        phone: '123',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should trim and lowercase email', () => {
      const data = {
        name: 'João Silva',
        email: '  JOAO@EMAIL.COM  ',
        password: 'Test123!',
        phone: '+5521999999999',
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('joao@email.com');
      }
    });
  });

  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'joao@email.com',
        password: 'Test123!',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject missing email', () => {
      const invalidData = {
        password: 'Test123!',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing password', () => {
      const invalidData = {
        email: 'joao@email.com',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('verifyCodeSchema', () => {
    it('should validate correct verification code', () => {
      const validData = {
        phone: '+5521999999999',
        code: '123456',
      };

      const result = verifyCodeSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject code with wrong length', () => {
      const invalidData = {
        phone: '+5521999999999',
        code: '123',
      };

      const result = verifyCodeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject code with non-numeric characters', () => {
      const invalidData = {
        phone: '+5521999999999',
        code: '12345a',
      };

      const result = verifyCodeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('googleAuthSchema', () => {
    it('should validate google token', () => {
      const validData = {
        token: 'valid-google-token-here',
      };

      const result = googleAuthSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject empty token', () => {
      const invalidData = {
        token: '',
      };

      const result = googleAuthSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
