import * as validation from '../validation';

// Mock countries data
jest.mock('../../data/countries', () => ({
  countries: [
    {
      code: 'BR',
      name: 'Brasil',
      dial: '+55',
      digits: { min: 10, max: 11 },
      mobileStart: ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28']
    },
    {
      code: 'US',
      name: 'United States',
      dial: '+1',
      digits: { min: 10, max: 10 },
      mobileStart: []
    },
    {
      code: 'JM',
      name: 'Jamaica',
      dial: '+1876',
      digits: { min: 7, max: 7 },
      mobileStart: []
    }
  ],
  getCountryByCode: (code) => {
    const countries = [
      {
        code: 'BR',
        name: 'Brasil',
        dial: '+55',
        digits: { min: 10, max: 11 },
        mobileStart: ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28']
      },
      {
        code: 'US',
        name: 'United States',
        dial: '+1',
        digits: { min: 10, max: 10 },
        mobileStart: []
      }
    ];
    return countries.find(c => c.code === code);
  },
  isBrazilian: (code) => code === 'BR'
}));

describe('Validation Utils', () => {
  // ============= CPF VALIDATION =============
  describe('validateCPF', () => {
    test('validates correct CPF', () => {
      expect(validation.validateCPF('111.444.777-35')).toBe(true);
      expect(validation.validateCPF('11144477735')).toBe(true);
    });

    test('rejects invalid CPF', () => {
      expect(validation.validateCPF('111.444.777-36')).toBe(false);
      expect(validation.validateCPF('11144477736')).toBe(false);
    });

    test('rejects CPF with all same digits', () => {
      expect(validation.validateCPF('111.111.111-11')).toBe(false);
      expect(validation.validateCPF('00000000000')).toBe(false);
      expect(validation.validateCPF('99999999999')).toBe(false);
    });

    test('rejects CPF with wrong length', () => {
      expect(validation.validateCPF('123')).toBe(false);
      expect(validation.validateCPF('123456789012')).toBe(false);
    });

    test('handles empty input', () => {
      expect(validation.validateCPF('')).toBe(false);
      expect(validation.validateCPF(null)).toBe(false);
      expect(validation.validateCPF(undefined)).toBe(false);
    });

    test('handles CPF with special characters', () => {
      expect(validation.validateCPF('111.444.777-35')).toBe(true);
      // Function removes all non-numeric chars, so any format with correct digits is valid
      expect(validation.validateCPF('111-444-777-35')).toBe(true);
    });
  });

  describe('formatCPF', () => {
    test('formats CPF correctly', () => {
      expect(validation.formatCPF('11144477735')).toBe('111.444.777-35');
    });

    test('formats partial CPF', () => {
      expect(validation.formatCPF('111')).toBe('111');
      expect(validation.formatCPF('1114')).toBe('111.4');
      expect(validation.formatCPF('111444')).toBe('111.444');
      expect(validation.formatCPF('111444777')).toBe('111.444.777');
    });

    test('handles empty input', () => {
      expect(validation.formatCPF('')).toBe('');
      expect(validation.formatCPF(null)).toBe('');
    });

    test('removes non-digit characters', () => {
      expect(validation.formatCPF('111.444.777-35')).toBe('111.444.777-35');
    });
  });

  describe('cleanCPF', () => {
    test('removes all non-digit characters', () => {
      expect(validation.cleanCPF('111.444.777-35')).toBe('11144477735');
      expect(validation.cleanCPF('111-444-777-35')).toBe('11144477735');
    });

    test('handles empty input', () => {
      expect(validation.cleanCPF('')).toBe('');
      expect(validation.cleanCPF(null)).toBe('');
    });

    test('handles already clean CPF', () => {
      expect(validation.cleanCPF('11144477735')).toBe('11144477735');
    });
  });

  // ============= BIRTH DATE VALIDATION =============
  describe('calculateAge', () => {
    test('calculates age correctly', () => {
      const birthDate = new Date('2000-01-01');
      const age = validation.calculateAge(birthDate);
      expect(age).toBeGreaterThanOrEqual(24); // As of 2026
      expect(age).toBeLessThanOrEqual(26);
    });

    test('handles birthday not yet occurred this year', () => {
      const today = new Date();
      const birthDate = new Date(today.getFullYear() - 25, today.getMonth() + 1, today.getDate());
      const age = validation.calculateAge(birthDate);
      expect(age).toBe(24); // Birthday hasn't occurred yet
    });

    test('handles empty input', () => {
      expect(validation.calculateAge(null)).toBe(0);
      expect(validation.calculateAge(undefined)).toBe(0);
    });

    test('handles string date', () => {
      const age = validation.calculateAge('2000-06-15');
      expect(age).toBeGreaterThanOrEqual(24);
      expect(age).toBeLessThanOrEqual(26);
    });
  });

  describe('isMinimumAge', () => {
    test('validates minimum age correctly', () => {
      const birthDate25YearsAgo = new Date();
      birthDate25YearsAgo.setFullYear(birthDate25YearsAgo.getFullYear() - 25);

      expect(validation.isMinimumAge(birthDate25YearsAgo, 18)).toBe(true);
      expect(validation.isMinimumAge(birthDate25YearsAgo, 30)).toBe(false);
    });

    test('uses default minimum age of 18', () => {
      const birthDate20YearsAgo = new Date();
      birthDate20YearsAgo.setFullYear(birthDate20YearsAgo.getFullYear() - 20);

      expect(validation.isMinimumAge(birthDate20YearsAgo)).toBe(true);
    });
  });

  describe('validateBirthDate', () => {
    test('validates correct birth date', () => {
      const birthDate = new Date('2000-01-01');
      const result = validation.validateBirthDate(birthDate);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('rejects empty birth date', () => {
      const result = validation.validateBirthDate(null);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Data de nascimento é obrigatória');
    });

    test('rejects invalid date', () => {
      const result = validation.validateBirthDate('invalid-date');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Data de nascimento inválida');
    });

    test('rejects future date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const result = validation.validateBirthDate(futureDate);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Data de nascimento não pode ser no futuro');
    });

    test('rejects age over 120 years', () => {
      const veryOldDate = new Date();
      veryOldDate.setFullYear(veryOldDate.getFullYear() - 125);
      const result = validation.validateBirthDate(veryOldDate);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Data de nascimento inválida');
    });

    test('rejects age under 18 years', () => {
      const recentDate = new Date();
      recentDate.setFullYear(recentDate.getFullYear() - 15);
      const result = validation.validateBirthDate(recentDate);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Você deve ter pelo menos 18 anos');
    });
  });

  describe('formatBirthDate', () => {
    test('formats date correctly', () => {
      const date = new Date('2000-01-15');
      const formatted = validation.formatBirthDate(date);
      expect(formatted).toBe('15/01/2000');
    });

    test('handles string date', () => {
      const formatted = validation.formatBirthDate('2000-06-25');
      expect(formatted).toBe('25/06/2000');
    });

    test('handles empty input', () => {
      expect(validation.formatBirthDate('')).toBe('');
      expect(validation.formatBirthDate(null)).toBe('');
    });

    test('handles invalid date', () => {
      expect(validation.formatBirthDate('invalid')).toBe('');
    });

    test('pads single digits with zero', () => {
      const date = new Date('2000-03-05');
      const formatted = validation.formatBirthDate(date);
      expect(formatted).toBe('05/03/2000');
    });
  });

  describe('parseBirthDateInput', () => {
    test('converts DD/MM/YYYY to YYYY-MM-DD', () => {
      expect(validation.parseBirthDateInput('15/06/2000')).toBe('2000-06-15');
    });

    test('handles empty input', () => {
      expect(validation.parseBirthDateInput('')).toBe('');
      expect(validation.parseBirthDateInput(null)).toBe('');
    });

    test('returns unchanged if not in expected format', () => {
      expect(validation.parseBirthDateInput('2000-06-15')).toBe('2000-06-15');
      expect(validation.parseBirthDateInput('invalid')).toBe('invalid');
    });
  });

  // ============= PHONE VALIDATION =============
  describe('validatePhone', () => {
    test('validates correct Brazilian mobile', () => {
      const result = validation.validatePhone('11999887766', 'BR');
      expect(result.valid).toBe(true);
    });

    test('validates correct Brazilian landline', () => {
      const result = validation.validatePhone('1133334444', 'BR');
      expect(result.valid).toBe(true);
    });

    test('rejects Brazilian phone with wrong length', () => {
      const result = validation.validatePhone('119998877', 'BR');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('pelo menos 10 dígitos');
    });

    test('rejects Brazilian phone with invalid mobile prefix', () => {
      const result = validation.validatePhone('1099887766', 'BR'); // Invalid prefix
      expect(result.valid).toBe(false);
      expect(result.error).toContain('deve começar com');
    });

    test('validates US phone', () => {
      const result = validation.validatePhone('2025551234', 'US');
      expect(result.valid).toBe(true);
    });

    test('rejects empty phone', () => {
      const result = validation.validatePhone('', 'BR');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Número de celular é obrigatório');
    });

    test('rejects invalid country code', () => {
      const result = validation.validatePhone('11999887766', 'INVALID');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('País inválido');
    });

    test('strips non-digit characters', () => {
      const result = validation.validatePhone('(11) 99988-7766', 'BR');
      expect(result.valid).toBe(true);
    });
  });

  describe('toE164Format', () => {
    test('converts to E.164 format', () => {
      expect(validation.toE164Format('11999887766', 'BR')).toBe('+5511999887766');
      expect(validation.toE164Format('2025551234', 'US')).toBe('+12025551234');
    });

    test('handles formatted phone numbers', () => {
      expect(validation.toE164Format('(11) 99988-7766', 'BR')).toBe('+5511999887766');
    });

    test('returns null for invalid country', () => {
      expect(validation.toE164Format('11999887766', 'INVALID')).toBeNull();
    });

    test('returns null for empty phone', () => {
      expect(validation.toE164Format('', 'BR')).toBeNull();
      expect(validation.toE164Format(null, 'BR')).toBeNull();
    });
  });

  describe('parseE164', () => {
    test('parses Brazilian E.164 number', () => {
      const result = validation.parseE164('+5511999887766');
      expect(result).toEqual({
        countryCode: 'BR',
        phone: '11999887766'
      });
    });

    test('parses US E.164 number', () => {
      const result = validation.parseE164('+12025551234');
      expect(result).toEqual({
        countryCode: 'US',
        phone: '2025551234'
      });
    });

    test('handles longer dial codes first (Jamaica +1876 vs US +1)', () => {
      const result = validation.parseE164('+18761234567');
      expect(result.countryCode).toBe('JM');
    });

    test('returns null for invalid format', () => {
      expect(validation.parseE164('5511999887766')).toBeNull(); // Missing +
      expect(validation.parseE164('')).toBeNull();
      expect(validation.parseE164(null)).toBeNull();
      expect(validation.parseE164(undefined)).toBeNull();
    });

    test('returns null for non-string input', () => {
      expect(validation.parseE164(123)).toBeNull();
      expect(validation.parseE164({})).toBeNull();
    });

    test('returns null for unknown country code', () => {
      const result = validation.parseE164('+999123456789');
      expect(result).toBeNull();
    });
  });

  // ============= FOREIGN ID VALIDATION =============
  describe('validateForeignId', () => {
    test('validates correct foreign ID', () => {
      const result = validation.validateForeignId('ABC123456');
      expect(result.valid).toBe(true);
    });

    test('rejects empty foreign ID', () => {
      const result = validation.validateForeignId('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Número do documento é obrigatório');
    });

    test('rejects too short foreign ID', () => {
      const result = validation.validateForeignId('ABC');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Número do documento muito curto');
    });

    test('rejects too long foreign ID', () => {
      const result = validation.validateForeignId('A'.repeat(35));
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Número do documento muito longo');
    });

    test('rejects foreign ID with invalid characters', () => {
      const result = validation.validateForeignId('ABC@123#456');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Documento contém caracteres inválidos');
    });

    test('accepts alphanumeric with dots and hyphens', () => {
      expect(validation.validateForeignId('ABC-123.456').valid).toBe(true);
      expect(validation.validateForeignId('A1B2C3').valid).toBe(true);
    });

    test('trims whitespace', () => {
      const result = validation.validateForeignId('  ABC123  ');
      expect(result.valid).toBe(true);
    });
  });

  // ============= COMPLETE REGISTRATION VALIDATION =============
  describe('validateRegistration', () => {
    const validBrazilianData = {
      nome: 'João Silva',
      email: 'joao@example.com',
      phone: '11999887766',
      countryCode: 'BR',
      birthDate: new Date('2000-01-01'),
      cpf: '11144477735',
      password: 'senha123',
      confirmPassword: 'senha123',
      acceptTerms: true
    };

    const validForeignData = {
      nome: 'John Doe',
      email: 'john@example.com',
      phone: '2025551234',
      countryCode: 'US',
      birthDate: new Date('2000-01-01'),
      foreignId: 'ABC123456',
      password: 'password123',
      confirmPassword: 'password123',
      acceptTerms: true
    };

    test('validates correct Brazilian registration', () => {
      const result = validation.validateRegistration(validBrazilianData);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('validates correct foreign registration', () => {
      const result = validation.validateRegistration(validForeignData);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('rejects invalid name', () => {
      const result = validation.validateRegistration({ ...validBrazilianData, nome: 'A' });
      expect(result.valid).toBe(false);
      expect(result.errors.nome).toBe('Nome deve ter pelo menos 2 caracteres');
    });

    test('rejects invalid email', () => {
      const result = validation.validateRegistration({ ...validBrazilianData, email: 'invalid' });
      expect(result.valid).toBe(false);
      expect(result.errors.email).toBe('Email inválido');
    });

    test('rejects invalid phone', () => {
      const result = validation.validateRegistration({ ...validBrazilianData, phone: '123' });
      expect(result.valid).toBe(false);
      expect(result.errors.phone).toBeTruthy();
    });

    test('rejects invalid birth date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const result = validation.validateRegistration({ ...validBrazilianData, birthDate: futureDate });
      expect(result.valid).toBe(false);
      expect(result.errors.birthDate).toBeTruthy();
    });

    test('requires CPF for Brazilians', () => {
      const result = validation.validateRegistration({ ...validBrazilianData, cpf: '' });
      expect(result.valid).toBe(false);
      expect(result.errors.cpf).toBe('CPF é obrigatório para brasileiros');
    });

    test('validates CPF for Brazilians', () => {
      const result = validation.validateRegistration({ ...validBrazilianData, cpf: '11111111111' });
      expect(result.valid).toBe(false);
      expect(result.errors.cpf).toBe('CPF inválido');
    });

    test('requires foreign ID for non-Brazilians', () => {
      const result = validation.validateRegistration({ ...validForeignData, foreignId: '' });
      expect(result.valid).toBe(false);
      expect(result.errors.foreignId).toBeTruthy();
    });

    test('rejects short password', () => {
      const result = validation.validateRegistration({ ...validBrazilianData, password: '123' });
      expect(result.valid).toBe(false);
      expect(result.errors.password).toBe('Senha deve ter pelo menos 6 caracteres');
    });

    test('rejects mismatched passwords', () => {
      const result = validation.validateRegistration({
        ...validBrazilianData,
        password: 'senha123',
        confirmPassword: 'senha456'
      });
      expect(result.valid).toBe(false);
      expect(result.errors.confirmPassword).toBe('Senhas não conferem');
    });

    test('requires terms acceptance', () => {
      const result = validation.validateRegistration({ ...validBrazilianData, acceptTerms: false });
      expect(result.valid).toBe(false);
      expect(result.errors.acceptTerms).toBe('Você deve aceitar os termos de uso');
    });

    test('returns multiple errors', () => {
      const invalidData = {
        nome: 'A',
        email: 'invalid',
        phone: '123',
        countryCode: 'BR',
        birthDate: null,
        cpf: '',
        password: '123',
        confirmPassword: '456',
        acceptTerms: false
      };
      const result = validation.validateRegistration(invalidData);
      expect(result.valid).toBe(false);
      expect(Object.keys(result.errors).length).toBeGreaterThan(5);
    });
  });
});
