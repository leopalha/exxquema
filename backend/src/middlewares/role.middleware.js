/**
 * Middlewares para verificação de roles específicas
 */

/**
 * Middleware genérico para verificar roles
 * @param {string|string[]} allowedRoles - Role(s) permitida(s)
 * @returns {Function} Middleware Express
 */
const requireRole = (allowedRoles) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autenticação necessária'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Acesso negado - roles permitidas: ${roles.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Middleware para verificar se é cozinheiro ou admin
 */
const requireKitchen = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Autenticação necessária'
    });
  }

  if (!['cozinha', 'admin'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado - apenas cozinheiros e admins'
    });
  }

  next();
};

/**
 * Middleware para verificar se é atendente ou admin
 */
const requireAttendant = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Autenticação necessária'
    });
  }

  if (!['atendente', 'admin'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado - apenas atendentes e admins'
    });
  }

  next();
};

/**
 * Middleware para verificar se é bartender ou admin (futuro)
 */
const requireBar = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Autenticação necessária'
    });
  }

  if (!['bar', 'admin'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado - apenas bartenders e admins'
    });
  }

  next();
};

/**
 * Middleware para verificar se é funcionário (qualquer role além de cliente)
 */
const requireStaff = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Autenticação necessária'
    });
  }

  if (req.user.role === 'cliente') {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado - apenas funcionários'
    });
  }

  next();
};

/**
 * Middleware para verificar se é cashier ou admin (futuro)
 */
const requireCashier = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Autenticação necessária'
    });
  }

  if (!['cashier', 'admin'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado - apenas caixas e admins'
    });
  }

  next();
};

module.exports = {
  requireRole,
  requireKitchen,
  requireAttendant,
  requireBar,
  requireStaff,
  requireCashier
};
