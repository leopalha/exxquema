/**
 * CSRF Protection Middleware
 *
 * Protege contra ataques CSRF (Cross-Site Request Forgery)
 * Usa csrf-csrf (biblioteca moderna e mantida)
 */

const { doubleCsrf } = require('csrf-csrf');
const logger = require('../config/logger');

// Configuração do CSRF
const {
  invalidCsrfTokenError,
  generateToken,
  validateRequest,
  doubleCsrfProtection,
} = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production',
  cookieName: '__Host-psifi.x-csrf-token',
  cookieOptions: {
    sameSite: 'strict',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  },
  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  getTokenFromRequest: (req) => {
    // Procurar token no header ou body
    return req.headers['x-csrf-token'] || req.body._csrf;
  },
});

/**
 * Middleware para gerar e anexar token CSRF
 * Use em rotas GET que renderizam formulários
 */
const csrfTokenMiddleware = (req, res, next) => {
  try {
    const csrfToken = generateToken(req, res);

    // Anexar token no response para o frontend usar
    res.locals.csrfToken = csrfToken;

    // Log apenas em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      logger.debug('[CSRF] Token gerado:', { token: csrfToken.substring(0, 10) + '...' });
    }

    next();
  } catch (error) {
    logger.error('[CSRF] Erro ao gerar token:', error);
    next(error);
  }
};

/**
 * Middleware para validar token CSRF
 * Use em rotas que modificam dados (POST, PUT, DELETE, PATCH)
 */
const csrfProtectionMiddleware = (req, res, next) => {
  try {
    validateRequest(req);
    next();
  } catch (error) {
    if (error === invalidCsrfTokenError) {
      logger.warn('[CSRF] Token inválido detectado:', {
        method: req.method,
        path: req.path,
        ip: req.ip,
        userAgent: req.get('user-agent'),
      });

      return res.status(403).json({
        success: false,
        message: 'Token CSRF inválido ou ausente',
        error: 'CSRF_TOKEN_INVALID',
      });
    }

    logger.error('[CSRF] Erro na validação:', error);
    next(error);
  }
};

/**
 * Rota helper para obter token CSRF
 * Frontend deve chamar isso para obter o token antes de fazer requests
 */
const getCsrfTokenHandler = (req, res) => {
  const token = generateToken(req, res);

  res.json({
    success: true,
    data: {
      csrfToken: token,
    },
  });
};

/**
 * Middleware combinado (double submit cookie)
 * Aplica automaticamente proteção e geração de token
 */
const csrfMiddleware = doubleCsrfProtection;

module.exports = {
  csrfTokenMiddleware,
  csrfProtectionMiddleware,
  csrfMiddleware,
  getCsrfTokenHandler,
  generateToken,
};
