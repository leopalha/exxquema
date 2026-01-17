// Catch ALL unhandled errors at the very top
process.on('uncaughtException', (error) => {
  console.error('[FATAL] Uncaught Exception:', error.message);
  console.error('[FATAL] Stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[FATAL] Unhandled Rejection at:', promise);
  console.error('[FATAL] Reason:', reason);
  process.exit(1);
});

require('dotenv').config();

// DEBUG: Log startup
console.log('[DEBUG] Starting FLAME API server...');
console.log('[DEBUG] NODE_ENV:', process.env.NODE_ENV);
console.log('[DEBUG] PORT:', process.env.PORT);
console.log('[DEBUG] DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('[DEBUG] REDIS_URL exists:', !!process.env.REDIS_URL);

const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

console.log('[DEBUG] Express and middleware modules loaded');

// Import Logger
console.log('[DEBUG] Loading logger...');
const logger = require('./config/logger');
console.log('[DEBUG] Logger loaded successfully');
const { requestLoggingMiddleware } = require('./middleware/logging');

// Import Redis
console.log('[DEBUG] Loading Redis...');
const { initRedis, cacheMiddleware } = require('./config/redis');
console.log('[DEBUG] Redis loaded');

// Import Sentry (optional - only if available)
let sentryRequestHandler, sentryTracingHandler, sentryErrorHandler;
try {
  const sentry = require('./config/sentry');
  sentry.initSentry();
  sentryRequestHandler = sentry.sentryRequestHandler;
  sentryTracingHandler = sentry.sentryTracingHandler;
  sentryErrorHandler = sentry.sentryErrorHandler;
  logger.info('Sentry initialized successfully');
} catch (error) {
  logger.warn('Sentry not available, continuing without error tracking:', error.message);
  // Create no-op middleware
  sentryRequestHandler = (req, res, next) => next();
  sentryTracingHandler = (req, res, next) => next();
  sentryErrorHandler = (err, req, res, next) => next(err);
}

// Import services
console.log('[DEBUG] Loading services...');
const { testConnection } = require('./config/database');
console.log('[DEBUG] Database config loaded');
const { createTables } = require('./models');
console.log('[DEBUG] Models loaded');
const socketService = require('./services/socket.service');
console.log('[DEBUG] Socket service loaded');
const jobScheduler = require('./jobs');
console.log('[DEBUG] Job scheduler loaded');

// Import middlewares
console.log('[DEBUG] Loading middlewares...');
const { authenticate, optionalAuth } = require('./middlewares/auth.middleware');
console.log('[DEBUG] Auth middleware loaded');

// Import controllers
console.log('[DEBUG] Loading controllers...');
const authController = require('./controllers/authController');
console.log('[DEBUG] Auth controller loaded');

console.log('[DEBUG] Creating Express app...');
const app = express();
const server = http.createServer(app);
console.log('[DEBUG] Express app and HTTP server created');

// Trust proxy for Railway/Heroku/etc
app.set('trust proxy', 1);

// Initialize Socket.IO
console.log('[DEBUG] Initializing Socket.IO...');
const io = socketService.init(server);
console.log('[DEBUG] Socket.IO initialized');

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration - aceita multiplas origens
const allowedOrigins = [
  'http://localhost:3000',
  'https://flameloungebar.vercel.app',
  'https://flame-lounge-bar.vercel.app',
  'https://flame-lounge.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Permite requests sem origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);

    // Permite qualquer subdominio do Vercel para o projeto flame
    if (origin.includes('leopalhas-projects.vercel.app') ||
        origin.includes('flameloungebar.vercel.app') ||
        origin.includes('flame-lounge.vercel.app') ||
        allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

// Rate limiting - muito permissivo para evitar bloqueios durante uso normal
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 1 * 60 * 1000, // 1 minuto
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 500, // 500 requests por minuto
  message: {
    success: false,
    message: 'Muitas requisições. Aguarde um momento.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limit para rotas frequentes e críticas
  skip: (req) => {
    const skipPaths = [
      '/api/auth/me',
      '/api/auth/login',
      '/api/products',
      '/api/health',
      '/api/staff', // Todas as operações de staff (dashboard, orders, etc)
      '/api/orders', // Todas as operações de pedidos (criar, atualizar status, etc)
      '/api/tables' // Operações de mesas
    ];
    return skipPaths.some(path => req.path.startsWith(path));
  },
  // Usar IP + userId para rate limit mais granular
  keyGenerator: (req) => {
    const userId = req.user?.id || 'anonymous';
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    return `${ip}-${userId}`;
  }
});

// Sentry request handler - MUST be first
app.use(sentryRequestHandler);
app.use(sentryTracingHandler);

app.use('/api', limiter);

// Body parsing middleware
// IMPORTANTE: Webhook do Stripe precisa receber body raw
// Deve vir ANTES do express.json()
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Winston logging middleware
app.use(requestLoggingMiddleware);

// Morgan logging (desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FLAME API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Swagger API Documentation
const { setupSwagger } = require('./config/swagger');
setupSwagger(app);

// API Routes
app.use('/api/auth', require('./routes/auth'));

// Cache for products (5 minutes)
app.use('/api/products', cacheMiddleware(300), require('./routes/products'));

// Cache for orders (1 minute - pedidos mudam frequentemente)
app.use('/api/orders', cacheMiddleware(60), require('./routes/orders'));

// Cache for tables (2 minutes)
app.use('/api/tables', cacheMiddleware(120), require('./routes/tables'));

app.use('/api/admin', authenticate, require('./routes/admin'));
app.use('/api/cashier', require('./routes/cashier.routes'));
app.use('/api/reports', require('./routes/report.routes'));
app.use('/api/push', require('./routes/push.routes'));
app.use('/api/payments', require('./routes/payment.routes'));

// Cache for hookah (5 minutes - sabores raramente mudam)
app.use('/api/hookah', cacheMiddleware(300), require('./routes/hookah'));

app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/inventory', require('./routes/inventory'));

// Cache for staff (2 minutes - lista de funcionários)
app.use('/api/staff', cacheMiddleware(120), require('./routes/staff'));

app.use('/api/migrate', require('./routes/migrate')); // Temporário - para migração CPF
app.use('/api/crm', require('./routes/crm'));
app.use('/api/upload', require('./routes/upload.routes')); // Sprint 30 - Upload de imagens
app.use('/api/chat', require('./routes/chat')); // Sprint 56 - Chat staff-cliente

// Cache for ingredients (5 minutes - insumos raramente mudam)
app.use('/api/ingredients', cacheMiddleware(300), require('./routes/ingredients'));

// Cache for campaigns (10 minutes - campanhas raramente mudam)
app.use('/api/campaigns', cacheMiddleware(600), require('./routes/campaign.routes'));
app.use('/api/split-payment', require('./routes/splitPayment')); // Split Payment (divisão de conta)
app.use('/api/instagram-cashback', require('./routes/instagramCashback')); // Instagram Cashback
app.use('/api', require('./routes/seed-route'));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint não encontrado',
    path: req.originalUrl
  });
});

// Sentry error handler - MUST be before other error handlers
app.use(sentryErrorHandler);

// Global error handler
app.use((error, req, res, next) => {
  // Log error with Winston
  logger.error('Global error handler', error, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id
  });

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors
    });
  }

  // Sequelize validation error
  if (error.name === 'SequelizeValidationError') {
    const errors = error.errors.map(err => ({
      field: err.path,
      message: err.message
    }));
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors
    });
  }

  // Sequelize unique constraint error
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'Dados já existem no sistema'
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expirado'
    });
  }

  // Default error response
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Initialize server
const startServer = async () => {
  try {
    console.log('[DEBUG] startServer() called');

    // Test database connection
    console.log('[DEBUG] Testing database connection...');
    const dbConnected = await testConnection();
    console.log('[DEBUG] Database connection result:', dbConnected);
    if (!dbConnected) {
      console.error('❌ Falha na conexão com banco de dados');
      process.exit(1);
    }
    console.log('[DEBUG] Database connected successfully');

    // Create/update database tables
    console.log('[DEBUG] Creating/updating database tables...');
    const tablesCreated = await createTables();
    console.log('[DEBUG] Tables creation result:', tablesCreated);
    if (!tablesCreated) {
      console.error('❌ Falha ao criar/atualizar tabelas');
      process.exit(1);
    }
    console.log('[DEBUG] Tables created successfully');

    // Initialize Redis (optional - won't crash if not configured)
    console.log('[DEBUG] Initializing Redis...');
    await initRedis();
    console.log('[DEBUG] Redis initialized');

    // Initialize job scheduler
    console.log('[DEBUG] Initializing job scheduler...');
    const jobCount = jobScheduler.initializeJobs();
    console.log('[DEBUG] Job scheduler initialized, jobs:', jobCount);

    // Start server
    const PORT = process.env.PORT || 7000;
    console.log('[DEBUG] Starting HTTP server on port:', PORT);
    server.listen(PORT, () => {
      console.log('[DEBUG] Server listen callback executed');
      console.log(`
╔══════════════════════════════════════╗
║           🔥 FLAME API 🔥            ║
║                                      ║
║  Servidor: http://localhost:${PORT}     ║
║  Ambiente: ${process.env.NODE_ENV?.toUpperCase() || 'DEVELOPMENT'}             ║
║  Socket.IO: ✅ Ativo                 ║
║  Database: ✅ Conectado              ║
║  Jobs: ✅ ${jobCount} agendados               ║
║                                      ║
║  Endpoints disponíveis:              ║
║  GET  /health                        ║
║  POST /api/auth/register             ║
║  POST /api/auth/verify-sms           ║
║  POST /api/auth/login                ║
║                                      ║
╚══════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('Recebido SIGTERM. Encerrando servidor graciosamente...');
      jobScheduler.stopAllJobs();
      server.close(() => {
        console.log('Servidor encerrado.');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('Recebido SIGINT. Encerrando servidor graciosamente...');
      jobScheduler.stopAllJobs();
      server.close(() => {
        console.log('Servidor encerrado.');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('[DEBUG] ❌ FATAL ERROR during server startup:');
    console.error('[DEBUG] Error message:', error.message);
    console.error('[DEBUG] Error stack:', error.stack);
    console.error('[DEBUG] Error details:', JSON.stringify(error, null, 2));
    process.exit(1);
  }
};

console.log('[DEBUG] Calling startServer()...');

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('Unhandled Promise Rejection:', err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Start the server
startServer();

module.exports = { app, server, io };