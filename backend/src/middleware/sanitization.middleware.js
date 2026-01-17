/**
 * FLAME Lounge - Input Sanitization Middleware
 *
 * Protege contra XSS (Cross-Site Scripting) e SQL Injection
 * através de sanitização e validação de inputs
 */

const validator = require('validator');
const logger = require('../config/logger');

/**
 * Lista de campos permitidos que podem conter HTML limitado
 * (ex: descrições de produtos, notas de pedidos)
 */
const ALLOWED_HTML_FIELDS = ['description', 'notes', 'review', 'bio'];

/**
 * Lista de campos que devem ser strings vazias se não fornecidos
 */
const OPTIONAL_STRING_FIELDS = ['notes', 'description', 'address', 'complement'];

/**
 * Sanitiza string removendo tags HTML perigosas
 * Mantém apenas tags seguras se o campo permitir HTML
 */
function sanitizeString(value, fieldName = '', allowHTML = false) {
  if (typeof value !== 'string') {
    return value;
  }

  let sanitized = value.trim();

  if (allowHTML && ALLOWED_HTML_FIELDS.includes(fieldName)) {
    // Permitir apenas tags seguras
    const allowedTags = ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'];
    sanitized = validator.stripLow(sanitized);

    // Remove scripts e event handlers
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    sanitized = sanitized.replace(/javascript:/gi, '');
  } else {
    // Remove todas as tags HTML
    sanitized = validator.stripLow(sanitized);
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  }

  // Remove caracteres de controle perigosos
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  return sanitized;
}

/**
 * Sanitiza objeto recursivamente
 */
function sanitizeObject(obj, depth = 0) {
  // Prevenir recursão infinita
  if (depth > 10) {
    logger.warn('Sanitization: Max recursion depth reached');
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, depth + 1));
  }

  if (obj !== null && typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value, key);
      } else if (typeof value === 'object') {
        sanitized[key] = sanitizeObject(value, depth + 1);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  return obj;
}

/**
 * Valida e sanitiza email
 */
function sanitizeEmail(email) {
  if (!email || typeof email !== 'string') {
    return null;
  }

  const trimmed = email.trim().toLowerCase();

  if (!validator.isEmail(trimmed)) {
    return null;
  }

  return validator.normalizeEmail(trimmed, {
    gmail_remove_dots: false,
    gmail_remove_subaddress: false
  });
}

/**
 * Valida e sanitiza URL
 */
function sanitizeURL(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const trimmed = url.trim();

  if (!validator.isURL(trimmed, {
    protocols: ['http', 'https'],
    require_protocol: true,
    require_valid_protocol: true
  })) {
    return null;
  }

  return trimmed;
}

/**
 * Valida e sanitiza número de telefone
 */
function sanitizePhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return null;
  }

  // Remove tudo exceto números, + e espaços
  let sanitized = phone.replace(/[^\d+\s()-]/g, '');

  // Formato brasileiro: +55 (XX) XXXXX-XXXX
  const brPattern = /^\+?55\s?\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;

  // Formato internacional: +X... (10-15 dígitos)
  const intPattern = /^\+\d{10,15}$/;

  if (brPattern.test(sanitized.replace(/[\s()-]/g, ''))) {
    return sanitized;
  }

  if (intPattern.test(sanitized.replace(/[\s()-]/g, ''))) {
    return sanitized;
  }

  return null;
}

/**
 * Middleware de sanitização para requisições
 */
const sanitizationMiddleware = (options = {}) => {
  const {
    sanitizeBody = true,
    sanitizeQuery = true,
    sanitizeParams = true,
    strict = false // Se true, rejeita requisições com tentativas de XSS
  } = options;

  return (req, res, next) => {
    try {
      let hasXSSAttempt = false;

      // Sanitizar body
      if (sanitizeBody && req.body) {
        const originalBody = JSON.stringify(req.body);
        req.body = sanitizeObject(req.body);

        // Detectar tentativas de XSS
        if (strict && originalBody !== JSON.stringify(req.body)) {
          const removedContent = originalBody.length - JSON.stringify(req.body).length;
          if (removedContent > 10) { // Se removeu mais de 10 caracteres, pode ser ataque
            hasXSSAttempt = true;
            logger.warn('Possible XSS attempt detected in body', {
              ip: req.ip,
              path: req.path,
              removedBytes: removedContent
            });
          }
        }

        // Sanitizar emails específicos
        if (req.body.email) {
          const sanitizedEmail = sanitizeEmail(req.body.email);
          if (!sanitizedEmail && req.body.email) {
            return res.status(400).json({
              success: false,
              message: 'Email inválido',
              field: 'email'
            });
          }
          req.body.email = sanitizedEmail;
        }

        // Sanitizar URLs específicas
        if (req.body.website || req.body.url || req.body.instagramPostUrl) {
          const urlField = req.body.website ? 'website' : req.body.url ? 'url' : 'instagramPostUrl';
          const sanitizedURL = sanitizeURL(req.body[urlField]);
          if (!sanitizedURL && req.body[urlField]) {
            return res.status(400).json({
              success: false,
              message: 'URL inválida',
              field: urlField
            });
          }
          req.body[urlField] = sanitizedURL;
        }

        // Sanitizar telefone
        if (req.body.celular || req.body.phone) {
          const phoneField = req.body.celular ? 'celular' : 'phone';
          const sanitizedPhone = sanitizePhone(req.body[phoneField]);
          if (!sanitizedPhone && req.body[phoneField]) {
            return res.status(400).json({
              success: false,
              message: 'Telefone inválido',
              field: phoneField
            });
          }
          req.body[phoneField] = sanitizedPhone;
        }
      }

      // Sanitizar query params
      if (sanitizeQuery && req.query) {
        req.query = sanitizeObject(req.query);
      }

      // Sanitizar route params
      if (sanitizeParams && req.params) {
        req.params = sanitizeObject(req.params);
      }

      // Se modo strict e detectou XSS, rejeitar
      if (strict && hasXSSAttempt) {
        return res.status(400).json({
          success: false,
          message: 'Requisição contém conteúdo inválido',
          code: 'INVALID_INPUT'
        });
      }

      next();
    } catch (error) {
      logger.error('Sanitization middleware error', error);
      next(error);
    }
  };
};

/**
 * Middleware de sanitização estrita (rejeita XSS)
 */
const strictSanitization = sanitizationMiddleware({ strict: true });

/**
 * Middleware de sanitização apenas para body
 */
const sanitizeBody = sanitizationMiddleware({
  sanitizeQuery: false,
  sanitizeParams: false
});

/**
 * Utilitários exportados
 */
module.exports = {
  sanitizationMiddleware,
  strictSanitization,
  sanitizeBody,
  sanitizeString,
  sanitizeObject,
  sanitizeEmail,
  sanitizeURL,
  sanitizePhone
};
