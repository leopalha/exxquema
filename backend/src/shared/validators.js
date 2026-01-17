/**
 * FLAME Lounge - Shared Validators
 *
 * Funções de validação reutilizáveis para CPF, telefone, email, etc.
 * Centraliza validações para evitar duplicação entre backend e frontend.
 */

/**
 * Valida CPF brasileiro
 * @param {string} cpf - CPF com ou sem formatação
 * @returns {boolean} true se válido
 */
function validateCPF(cpf) {
  if (!cpf) return false;

  // Remove formatação
  const cleanCPF = cpf.replace(/\D/g, '');

  // Valida tamanho
  if (cleanCPF.length !== 11) return false;

  // Valida CPFs conhecidos como inválidos
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  // Valida primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleanCPF.charAt(9))) return false;

  // Valida segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleanCPF.charAt(10))) return false;

  return true;
}

/**
 * Formata CPF para o padrão brasileiro (000.000.000-00)
 * @param {string} cpf - CPF sem formatação
 * @returns {string} CPF formatado
 */
function formatCPF(cpf) {
  if (!cpf) return '';
  const cleanCPF = cpf.replace(/\D/g, '');
  if (cleanCPF.length !== 11) return cpf;
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Remove formatação do CPF
 * @param {string} cpf - CPF com formatação
 * @returns {string} CPF apenas com dígitos
 */
function cleanCPF(cpf) {
  if (!cpf) return '';
  return cpf.replace(/\D/g, '');
}

/**
 * Valida email
 * @param {string} email - Email a validar
 * @returns {boolean} true se válido
 */
function validateEmail(email) {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida telefone brasileiro
 * @param {string} phone - Telefone com ou sem formatação
 * @returns {boolean} true se válido
 */
function validatePhone(phone) {
  if (!phone) return false;

  // Remove formatação
  const cleanPhone = phone.replace(/\D/g, '');

  // Telefone brasileiro: 10 dígitos (fixo) ou 11 dígitos (celular)
  // Formato: (DD) XXXX-XXXX ou (DD) 9XXXX-XXXX
  if (cleanPhone.length < 10 || cleanPhone.length > 11) return false;

  // Valida DDD (11 a 99)
  const ddd = parseInt(cleanPhone.substring(0, 2));
  if (ddd < 11 || ddd > 99) return false;

  // Se tiver 11 dígitos, deve começar com 9
  if (cleanPhone.length === 11 && cleanPhone.charAt(2) !== '9') return false;

  return true;
}

/**
 * Formata telefone brasileiro
 * @param {string} phone - Telefone sem formatação
 * @returns {string} Telefone formatado (DD) XXXXX-XXXX
 */
function formatPhone(phone) {
  if (!phone) return '';
  const cleanPhone = phone.replace(/\D/g, '');

  if (cleanPhone.length === 10) {
    return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }

  return phone;
}

/**
 * Remove formatação do telefone
 * @param {string} phone - Telefone com formatação
 * @returns {string} Telefone apenas com dígitos
 */
function cleanPhone(phone) {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}

/**
 * Valida CEP brasileiro
 * @param {string} cep - CEP com ou sem formatação
 * @returns {boolean} true se válido
 */
function validateCEP(cep) {
  if (!cep) return false;
  const cleanCEP = cep.replace(/\D/g, '');
  return cleanCEP.length === 8;
}

/**
 * Formata CEP brasileiro
 * @param {string} cep - CEP sem formatação
 * @returns {string} CEP formatado (00000-000)
 */
function formatCEP(cep) {
  if (!cep) return '';
  const cleanCEP = cep.replace(/\D/g, '');
  if (cleanCEP.length !== 8) return cep;
  return cleanCEP.replace(/(\d{5})(\d{3})/, '$1-$2');
}

/**
 * Valida CNPJ brasileiro
 * @param {string} cnpj - CNPJ com ou sem formatação
 * @returns {boolean} true se válido
 */
function validateCNPJ(cnpj) {
  if (!cnpj) return false;

  const cleanCNPJ = cnpj.replace(/\D/g, '');

  if (cleanCNPJ.length !== 14) return false;

  // Valida CNPJs conhecidos como inválidos
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;

  // Valida primeiro dígito verificador
  let length = cleanCNPJ.length - 2;
  let numbers = cleanCNPJ.substring(0, length);
  const digits = cleanCNPJ.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  // Valida segundo dígito verificador
  length = length + 1;
  numbers = cleanCNPJ.substring(0, length);
  sum = 0;
  pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
}

/**
 * Formata CNPJ brasileiro
 * @param {string} cnpj - CNPJ sem formatação
 * @returns {string} CNPJ formatado (00.000.000/0000-00)
 */
function formatCNPJ(cnpj) {
  if (!cnpj) return '';
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  if (cleanCNPJ.length !== 14) return cnpj;
  return cleanCNPJ.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

module.exports = {
  validateCPF,
  formatCPF,
  cleanCPF,
  validateEmail,
  validatePhone,
  formatPhone,
  cleanPhone,
  validateCEP,
  formatCEP,
  validateCNPJ,
  formatCNPJ,
};
