# 🎯 ROADMAP PARA 100/100 NO SCORE 7D

**Data**: 2026-01-17 (atualizado 23:45)
**Score Inicial**: 79.7% (BOM)
**Score Atualizado**: 83% (ÓTIMO) - Após descoberta de testes
**Meta**: 100% (EXCELENTE)
**Gap**: +17%

---

## 🎉 ATUALIZAÇÃO IMPORTANTE - DESCOBERTA DE TESTES

**Situação**: Sistema tem 4-6x MAIS TESTES do que estimado!

**Descobertas**:
- ✅ Backend: 124 testes passando (88% coverage) - NÃO SABÍAMOS!
- ✅ Playwright: 8 testes E2E - NÃO SABÍAMOS!
- ⚠️ Cypress: 8 arquivos (~170-220 testes) - NÃO VALIDADOS (bug Windows 11)

**Impacto**:
- Score D3: 20% → 55% (+35%)
- Score Total: 79.7% → 83% (+3.3%)
- Tempo para 100%: 10 semanas → 8 semanas (-20%)

**Documentos**:
- Ver: `DESCOBERTA_TESTES.md`
- Ver: `TESTES_CONSOLIDADOS_COMPLETO.md`

---

## 📊 Score REVISADO por Dimensão

```
╔════════════════════════════════════════════════════════════╗
║  SCORE TOTAL: 83%  →  META: 100%  (+17%)                 ║
║  Ganho descoberto: +3.3% 🎉                               ║
╚════════════════════════════════════════════════════════════╝

D1 - Documentação:       74% → 100% (+26%) ⚠️ MAIOR GAP
D2 - Código:             96% → 100% (+4%)  ✅ QUASE LÁ
D3 - Testes:             55% → 100% (+45%) 🔴 CRÍTICO (era 20%, descobrimos +35%)
D4 - UX/UI:              93% → 100% (+7%)  ✅ BOM
D5 - Segurança:          77% → 100% (+23%) ⚠️ IMPORTANTE
D6 - Performance:        70% → 100% (+30%) ⚠️ IMPORTANTE
D7 - Validação Real:     95% → 100% (+5%)  ✅ QUASE LÁ
```

---

## 🔴 D3 - TESTES (55% → 100%, +45%)

### Status Atual (REVISADO após descoberta)
- ✅ **Backend Unitários**: 124 testes, 88% coverage (auth, services, validators)
- ⚠️ **Frontend E2E (Playwright)**: 8 testes (homepage, order-flow)
- ⚠️ **Frontend E2E (Cypress)**: 8 arquivos, ~170-220 testes (não validados - bug Windows 11)
- ❌ **Integração**: Não implementado (0%)
- ❌ **Gaps Críticos**: orderController (0%), cashbackCalculator (0%)

### O Que JÁ EXISTE ✅
```
Backend (Vitest) - 124 testes passando:
✅ auth.test.js              - 24 testes (registro, login, SMS, Google OAuth)
✅ report.service.test.js    - 30 testes (relatórios financeiros, métricas)
✅ cashier.service.test.js   - 31 testes (abertura, movimentações, fechamento)
✅ auth.validator.test.ts    - 14 testes (Zod schemas de autenticação)
✅ order.validator.test.ts   - 12 testes (Zod schemas de pedidos)
✅ product.validator.test.ts - 13 testes (Zod schemas de produtos)

Coverage: 88% statements, 100% branches, 66.66% functions

Frontend E2E (Playwright) - 8 testes:
✅ homepage.spec.ts          - 4 testes (homepage, navigation, responsive)
✅ order-flow.spec.ts        - 4 testes (menu, cart, add product)

Frontend E2E (Cypress) - ~170-220 testes (não validados):
⚠️ admin.cy.js              - ~50-60 testes (estimativa)
⚠️ auth.cy.js               - ~10-15 testes (estimativa)
⚠️ cart.cy.js               - ~10-15 testes (estimativa)
⚠️ cashback.cy.js           - ~40-50 testes (estimativa)
⚠️ checkout.cy.js           - ~10-15 testes (estimativa)
⚠️ menu.cy.js               - ~8-10 testes (estimativa)
⚠️ navigation.cy.js         - ~6-8 testes (estimativa)
⚠️ orders.cy.js             - ~40-50 testes (estimativa)
```

### Ações Necessárias (REVISADAS)

#### 1. Validar/Migrar Testes E2E - 2 semanas (antes: 3 semanas)
**Impacto Score: +15%** (reduzido de +30% pois já existe muito)

**Status**:
- ✅ Playwright já configurado (2 arquivos, 8 testes)
- ✅ Cypress já tem 8 arquivos (~170-220 testes)
- ❌ Cypress não roda (bug Windows 11 build 26220)

**Opção A: Validar Playwright (1 semana) - RECOMENDADO**
```bash
# Rodar com servidor Next.js
cd frontend
npm run dev &            # Iniciar servidor em background
npm run test:e2e         # Rodar 8 testes Playwright

# Expandir cobertura Playwright
e2e/
├── homepage.spec.ts          # ✅ JÁ EXISTE (4 testes)
├── order-flow.spec.ts        # ✅ JÁ EXISTE (4 testes)
├── checkout.spec.ts          # Criar (novo fluxo 3 steps)
├── cashback.spec.ts          # Criar
├── split-payment.spec.ts     # Criar
└── attendant-panel.spec.ts   # Criar
```

**Opção B: Migrar Cypress → Playwright (2 semanas)**
- Converter 8 arquivos Cypress para Playwright
- Aproveitar ~170-220 testes já escritos
- Garantir multi-browser (Chrome, Firefox, Safari, Mobile)

**Checklist:**
- [x] ✅ Playwright já instalado e configurado
- [ ] Rodar 8 testes Playwright com servidor (1h)
- [ ] Atualizar checkout.spec.ts para novo fluxo 3 steps (2h)
- [ ] Decidir: manter Cypress ou migrar para Playwright (discussão)
- [ ] Se migrar: converter 8 arquivos Cypress (2 semanas)
- [ ] Se manter: resolver bug Windows 11 Cypress (investigar alternativas)

---

#### 2. Completar Testes Unitários - 1 semana (antes: 2 semanas)
**Impacto Score: +20%** (reduzido de +35% pois já existe 124 testes)

**Status**:
- ✅ Vitest já configurado (não precisa Jest)
- ✅ 124 testes já passando (88% coverage)
- ✅ auth, services, validators já testados
- ❌ **GAPS CRÍTICOS**: orderController (0%), cashbackCalculator (0%)

**O Que FALTA (Prioridade P0)**:
```bash
backend/src/controllers/
└── orderController.test.js      # 🔴 CRÍTICO - 0% testado
    ├── createOrder() tests      # ~15 testes
    ├── confirmPayment() tests   # ~8 testes
    ├── updateStatus() tests     # ~5 testes
    └── cancelOrder() tests      # ~5 testes
    Total: ~30-35 testes

backend/src/shared/
└── cashbackCalculator.test.js   # 🔴 CRÍTICO - 0% testado
    ├── calculateTierFromSpent() # ~8 testes
    ├── getCashbackRate()        # ~5 testes
    ├── calculateCashbackAmount()# ~8 testes
    └── applyInstagramBonus()    # ~5 testes
    Total: ~20-25 testes
```

**Checklist REVISADO:**
- [x] ✅ Setup Vitest (JÁ FEITO)
- [x] ✅ Testes: validators (39 testes - JÁ FEITO)
- [x] ✅ Testes: auth API (24 testes - JÁ FEITO)
- [x] ✅ Testes: services (61 testes - JÁ FEITO)
- [ ] 🔴 Testes: orderController.js (3 dias) - P0 CRÍTICO
- [ ] 🔴 Testes: cashbackCalculator.js (2 dias) - P0 CRÍTICO
- [ ] Aumentar cobertura de funções: 66.66% → 75% (1 dia)
- [ ] Testes: paymentService.js (2 dias) - P1
- [ ] Coverage report atualizado (já existe, só rodar)

**Meta de Cobertura REVISADA:**
- **Crítico (100%)**: orderController, cashbackCalculator
- **Manter (88%)**: auth, validators, services (já ótimo)
- **Melhorar funções**: 66.66% → 75% (+8.34%)

---

#### 3. Testes de Integração - 1 semana
**Impacto Score: +15%**

```bash
backend/src/__tests__/integration/
├── order-with-cashback.test.js     # Pedido usando cashback
├── order-with-split.test.js        # Pedido com divisão
├── attendant-confirm.test.js       # Atendente confirma pagamento
└── instagram-cashback.test.js      # Validação Instagram cashback
```

**Checklist:**
- [ ] Setup ambiente de testes (DB separada) (1 dia)
- [ ] Teste: Pedido completo com cashback (2 dias)
- [ ] Teste: Split payment end-to-end (2 dias)
- [ ] Teste: Confirmação de pagamento (1 dia)
- [ ] Teste: Instagram cashback (1 dia)

---

## ⚠️ D1 - DOCUMENTAÇÃO (74% → 100%, +26%)

### Status Atual
- ✅ Architecture.md existe
- ✅ Database schema documentado
- ✅ README.md existe
- ❌ API docs (Swagger) não existe
- ❌ PRD desatualizado
- ❌ Guides de deploy incompletos
- ❌ Changelog não existe

### Ações Necessárias

#### 1. API Documentation (Swagger/OpenAPI) - 1 semana
**Impacto Score: +10%**

```javascript
// backend/src/swagger.js
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Flame Lounge API',
      version: '1.0.0',
      description: 'API completa do Flame Lounge Bar & Restaurant'
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Development' },
      { url: 'https://api.flamelounge.com', description: 'Production' }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
```

**Documentar:**
- [ ] Auth routes (login, register, verify)
- [ ] Orders routes (create, list, update, cancel)
- [ ] Products routes (CRUD)
- [ ] Cashback routes (balance, history)
- [ ] Payment routes (create, confirm, split)
- [ ] Tables routes (list, status)
- [ ] Users routes (profile, update)
- [ ] Reservations routes (CRUD)

**Checklist:**
- [ ] Instalar swagger-jsdoc + swagger-ui-express (1h)
- [ ] Configurar Swagger (2h)
- [ ] Documentar auth routes (4h)
- [ ] Documentar orders routes (6h)
- [ ] Documentar payment routes (4h)
- [ ] Documentar demais routes (1 dia)
- [ ] Adicionar exemplos de requests/responses (1 dia)
- [ ] Testar e ajustar (1 dia)

---

#### 2. Atualizar PRD - 1 dia
**Impacto Score: +5%**

```markdown
docs/03_PRD.md

Adicionar:
- Sprint 58: Pagamento com Atendente
- Sprint 59: Instagram Cashback +5%
- Sprint 60: Split Payment (by_items e by_percentage)
- Sprint 61: Checkout Simplificado (3 steps)
- Estatísticas atualizadas (22 models, 18 controllers, 50 páginas)
- Taxas oficiais de cashback (1.5%, 3%, 4.5%, 5%)
```

**Checklist:**
- [ ] Documentar Sprint 58 (1h)
- [ ] Documentar Sprint 59 (1h)
- [ ] Documentar Sprint 60 (2h)
- [ ] Documentar Sprint 61 (1h)
- [ ] Atualizar estatísticas (1h)
- [ ] Adicionar diagramas de fluxo (2h)

---

#### 3. Deploy Guides - 2 dias
**Impacto Score: +5%**

```markdown
docs/deployment/
├── DEPLOY_PRODUCTION.md     # Deploy em produção
├── DEPLOY_STAGING.md        # Deploy em staging
├── ENV_VARIABLES.md         # Todas as variáveis de ambiente
└── TROUBLESHOOTING.md       # Problemas comuns
```

**Checklist:**
- [ ] Guia de deploy frontend (Vercel) (2h)
- [ ] Guia de deploy backend (Railway/Heroku) (2h)
- [ ] Documentar todas ENV variables (2h)
- [ ] Guia de setup PostgreSQL (1h)
- [ ] Guia de setup Stripe (1h)
- [ ] Guia de setup SMS (Twilio) (1h)
- [ ] Guia de setup Google OAuth (✅ JÁ EXISTE)
- [ ] Troubleshooting comum (2h)

---

#### 4. CHANGELOG.md - 1 dia
**Impacto Score: +3%**

```markdown
# CHANGELOG

## [1.2.0] - 2026-01-17
### Added
- Checkout simplificado (3 steps)
- Cliente não escolhe mais método de pagamento
- Atendente confirma pagamento na mesa

### Fixed
- Cashback rates inconsistency (1.5%, 3%, 4.5%, 5%)
- Tier thresholds (platinum 10k)

## [1.1.0] - 2026-01-15
### Added
- Split payment (by_items e by_percentage)
- Instagram cashback +5%
- Pagamento com atendente

...
```

**Checklist:**
- [ ] Criar CHANGELOG.md (1h)
- [ ] Documentar últimas 10 releases (4h)
- [ ] Seguir formato Keep a Changelog (1h)
- [ ] Integrar com git tags (1h)

---

#### 5. Component Library Docs - 3 dias
**Impacto Score: +3%**

```markdown
docs/components/
├── COMPONENTS_OVERVIEW.md    # Visão geral
├── ProductCard.md            # Props, exemplos, variações
├── OrderCard.md              # Props, exemplos, variações
├── PaymentModal.md           # Props, exemplos, variações
└── ...
```

**Checklist:**
- [ ] Documentar 10 componentes principais (2 dias)
- [ ] Adicionar exemplos visuais (Storybook?) (1 dia)

---

## ⚠️ D5 - SEGURANÇA (77% → 100%, +23%)

### Status Atual
- ✅ JWT authentication
- ✅ Rate limiting básico
- ⚠️ CORS configurado mas não granular
- ❌ Input sanitization incompleta
- ❌ SQL injection protection (depende do ORM)
- ❌ XSS protection incompleta
- ❌ CSRF tokens não implementado
- ❌ Security headers incompletos

### Ações Necessárias

#### 1. Input Sanitization - 2 dias
**Impacto Score: +8%**

```javascript
// backend/src/middlewares/sanitize.js
const xss = require('xss');
const validator = require('validator');

const sanitizeInput = (req, res, next) => {
  // Sanitizar todos os inputs
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
        req.body[key] = validator.escape(req.body[key]);
      }
    });
  }

  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = xss(req.query[key]);
        req.query[key] = validator.escape(req.query[key]);
      }
    });
  }

  next();
};
```

**Checklist:**
- [ ] Instalar xss + validator (1h)
- [ ] Criar middleware sanitizeInput (2h)
- [ ] Aplicar em todas as rotas (4h)
- [ ] Testar com payloads XSS (4h)
- [ ] Documentar (1h)

---

#### 2. Security Headers - 1 dia
**Impacto Score: +5%**

```javascript
// backend/src/middlewares/security.js
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

**Checklist:**
- [ ] Instalar helmet (1h)
- [ ] Configurar CSP (2h)
- [ ] Configurar HSTS (1h)
- [ ] Configurar X-Frame-Options (1h)
- [ ] Configurar X-Content-Type-Options (1h)
- [ ] Testar com security scanner (2h)

---

#### 3. Rate Limiting Granular - 1 dia
**Impacto Score: +5%**

```javascript
// backend/src/middlewares/rateLimit.js
const rateLimit = require('express-rate-limit');

// Auth endpoints (mais restritivo)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5, // 5 tentativas
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
});

// API endpoints (normal)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Muitas requisições. Tente novamente em 15 minutos.'
});

// Usuários autenticados (mais permissivo)
const authenticatedLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  skip: (req) => !req.user // Pula se não autenticado
});
```

**Checklist:**
- [ ] Criar rate limiters diferenciados (2h)
- [ ] Aplicar por tipo de endpoint (2h)
- [ ] Adicionar headers informativos (1h)
- [ ] Testar limites (2h)
- [ ] Documentar (1h)

---

#### 4. CSRF Protection - 1 dia
**Impacto Score: +3%**

```javascript
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.use(csrfProtection);
app.use((req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
});
```

**Checklist:**
- [ ] Instalar csurf (1h)
- [ ] Configurar CSRF tokens (2h)
- [ ] Atualizar frontend para enviar tokens (2h)
- [ ] Testar proteção (2h)

---

#### 5. Audit Security - 1 dia
**Impacto Score: +2%**

```bash
# npm audit
npm audit --audit-level=moderate

# Snyk
npx snyk test

# OWASP Dependency Check
```

**Checklist:**
- [ ] Rodar npm audit (1h)
- [ ] Corrigir vulnerabilidades HIGH (4h)
- [ ] Configurar CI/CD security check (2h)
- [ ] Documentar vulnerabilidades conhecidas (1h)

---

## ⚠️ D6 - PERFORMANCE (70% → 100%, +30%)

### Status Atual
- ⚠️ Queries N+1 em alguns endpoints
- ❌ Caching não implementado
- ❌ Lazy loading incompleto
- ❌ Images não otimizadas
- ❌ Bundle size não otimizado
- ⚠️ Database indexes incompletos

### Ações Necessárias

#### 1. Database Optimization - 3 dias
**Impacto Score: +10%**

```sql
-- Adicionar indexes críticos
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_cashback_transactions_user_id ON cashback_transactions(user_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);

-- Queries otimizadas com eager loading
const orders = await Order.findAll({
  include: [
    { model: OrderItem, include: [Product] },
    { model: User, attributes: ['id', 'name'] },
    { model: Table }
  ]
});
```

**Checklist:**
- [ ] Analisar queries lentas (1 dia)
- [ ] Adicionar indexes necessários (1 dia)
- [ ] Otimizar queries N+1 (1 dia)
- [ ] Testar performance antes/depois (2h)
- [ ] Documentar indexes (2h)

---

#### 2. Caching Strategy - 3 dias
**Impacto Score: +10%**

```javascript
// backend/src/services/cache.js
const redis = require('redis');
const client = redis.createClient();

// Cache de produtos (TTL: 1 hora)
const getProducts = async () => {
  const cached = await client.get('products:all');
  if (cached) return JSON.parse(cached);

  const products = await Product.findAll();
  await client.setEx('products:all', 3600, JSON.stringify(products));
  return products;
};

// Cache de cashback balance (TTL: 5 min)
const getCashbackBalance = async (userId) => {
  const cached = await client.get(`cashback:${userId}`);
  if (cached) return parseFloat(cached);

  const balance = await calculateBalance(userId);
  await client.setEx(`cashback:${userId}`, 300, balance.toString());
  return balance;
};
```

**Checklist:**
- [ ] Instalar Redis (1h)
- [ ] Criar cache service (4h)
- [ ] Implementar cache de produtos (2h)
- [ ] Implementar cache de cashback (2h)
- [ ] Implementar cache de user profile (2h)
- [ ] Invalidação de cache (4h)
- [ ] Testar performance (2h)

---

#### 3. Image Optimization - 2 dias
**Impacto Score: +5%**

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['localhost', 'api.flamelounge.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  }
};

// Usar Next/Image
import Image from 'next/image';

<Image
  src="/products/burger.jpg"
  alt="Burger"
  width={300}
  height={200}
  loading="lazy"
  placeholder="blur"
/>
```

**Checklist:**
- [ ] Configurar Next/Image otimizado (2h)
- [ ] Converter imagens para WebP/AVIF (4h)
- [ ] Implementar lazy loading (2h)
- [ ] Adicionar placeholders blur (2h)
- [ ] Integrar CDN (Cloudinary) (4h)
- [ ] Testar Lighthouse score (1h)

---

#### 4. Bundle Optimization - 2 dias
**Impacto Score: +3%**

```javascript
// next.config.js
module.exports = {
  webpack: (config, { isServer }) => {
    // Análise de bundle
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunk
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20
          },
          // Common chunk
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true
          }
        }
      };
    }
    return config;
  }
};
```

**Checklist:**
- [ ] Analisar bundle size (2h)
- [ ] Configurar code splitting (4h)
- [ ] Lazy load de rotas pesadas (4h)
- [ ] Tree shaking (2h)
- [ ] Remover dependências não usadas (2h)
- [ ] Testar bundle final (1h)

---

#### 5. API Response Optimization - 1 dia
**Impacto Score: +2%**

```javascript
// Pagination
const getOrders = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const orders = await Order.findAndCountAll({
    limit,
    offset: (page - 1) * limit,
    order: [['createdAt', 'DESC']]
  });

  res.json({
    success: true,
    data: orders.rows,
    pagination: {
      total: orders.count,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(orders.count / limit)
    }
  });
};

// Compression
const compression = require('compression');
app.use(compression());
```

**Checklist:**
- [ ] Implementar pagination em todas listas (4h)
- [ ] Adicionar compression (1h)
- [ ] Minimizar payloads (selective fields) (2h)
- [ ] Testar response times (1h)

---

## ✅ D2 - CÓDIGO (96% → 100%, +4%)

### Status Atual
- ✅ Shared modules criados
- ✅ Error handling implementado
- ✅ Loading states implementados
- ⚠️ Migração para shared modules pendente (P2)
- ⚠️ TypeScript migration incompleta

### Ações Necessárias

#### 1. Refatorar para Shared Modules - 3 dias
**Impacto Score: +2%**

**Ver:** `docs/REFACTORING_GUIDE.md`

**Checklist:**
- [ ] Migrar controllers para usar shared/validators (1 dia)
- [ ] Migrar controllers para usar shared/constants (1 dia)
- [ ] Migrar User.js para usar shared/cashbackCalculator (1 dia)
- [ ] Remover código duplicado (~500 linhas) (4h)
- [ ] Testar tudo (4h)

---

#### 2. TypeScript Coverage - 2 dias
**Impacto Score: +1%**

```typescript
// Converter para TypeScript
backend/src/types/
├── order.types.ts
├── user.types.ts
├── payment.types.ts
└── cashback.types.ts
```

**Checklist:**
- [ ] Criar interfaces para todos os models (1 dia)
- [ ] Converter shared modules para TS (1 dia)
- [ ] Configurar strict mode (2h)

---

#### 3. Code Quality - 1 dia
**Impacto Score: +1%**

```bash
# ESLint + Prettier
npm install --save-dev eslint prettier eslint-config-prettier

# Husky + lint-staged
npm install --save-dev husky lint-staged
```

**Checklist:**
- [ ] Configurar ESLint (2h)
- [ ] Configurar Prettier (1h)
- [ ] Configurar Husky (pre-commit hooks) (2h)
- [ ] Rodar lint em todo codebase (2h)
- [ ] Corrigir warnings (2h)

---

## ✅ D4 - UX/UI (93% → 100%, +7%)

### Status Atual
- ✅ Loading states implementados
- ✅ Error states implementados
- ✅ Checkout simplificado
- ⚠️ Acessibilidade incompleta
- ⚠️ Mobile responsiveness tem gaps
- ⚠️ Skeleton loaders incompletos

### Ações Necessárias

#### 1. Acessibilidade (a11y) - 3 dias
**Impacto Score: +4%**

```jsx
// ARIA labels
<button aria-label="Adicionar ao carrinho">
  <ShoppingCart />
</button>

// Keyboard navigation
<div
  role="button"
  tabIndex={0}
  onKeyPress={(e) => e.key === 'Enter' && handleClick()}
>
  ...
</div>

// Skip links
<a href="#main-content" className="skip-link">
  Pular para o conteúdo
</a>
```

**Checklist:**
- [ ] Adicionar ARIA labels em todos botões (1 dia)
- [ ] Implementar keyboard navigation (1 dia)
- [ ] Adicionar skip links (2h)
- [ ] Testar com screen reader (4h)
- [ ] Corrigir contraste de cores (2h)
- [ ] Adicionar focus indicators (2h)

---

#### 2. Mobile Responsiveness - 2 dias
**Impacto Score: +2%**

**Checklist:**
- [ ] Testar em devices reais (4h)
- [ ] Corrigir breakpoints (1 dia)
- [ ] Otimizar touch targets (4h)
- [ ] Testar landscape mode (2h)

---

#### 3. Skeleton Loaders - 1 dia
**Impacto Score: +1%**

```jsx
// Skeleton para ProductCard
const ProductCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-700 h-48 rounded-t-lg" />
    <div className="p-4 space-y-3">
      <div className="bg-gray-700 h-4 w-3/4 rounded" />
      <div className="bg-gray-700 h-4 w-1/2 rounded" />
    </div>
  </div>
);
```

**Checklist:**
- [ ] Criar skeleton para ProductCard (✅ FEITO)
- [ ] Criar skeleton para OrderCard (✅ FEITO)
- [ ] Criar skeleton para Table list (2h)
- [ ] Criar skeleton para Dashboard (2h)

---

## ✅ D7 - VALIDAÇÃO REAL (95% → 100%, +5%)

### Status Atual
- ✅ Sistema funcionando em produção
- ✅ Pedidos sendo processados
- ✅ Cashback funcionando
- ⚠️ Métricas de uso não coletadas
- ⚠️ Analytics não implementado
- ⚠️ Error tracking não implementado

### Ações Necessárias

#### 1. Analytics (Mixpanel/GA) - 2 dias
**Impacto Score: +3%**

```javascript
// frontend/src/services/analytics.js
import mixpanel from 'mixpanel-browser';

mixpanel.init('YOUR_TOKEN');

export const trackEvent = (event, properties = {}) => {
  mixpanel.track(event, properties);
};

// Eventos críticos
trackEvent('Order Created', { total, items: items.length });
trackEvent('Cashback Used', { amount: cashbackAmount });
trackEvent('Payment Confirmed', { method: paymentMethod });
```

**Checklist:**
- [ ] Setup Mixpanel/GA (1h)
- [ ] Trackear eventos críticos (1 dia)
- [ ] Dashboard de métricas (1 dia)

---

#### 2. Error Tracking (Sentry) - 1 dia
**Impacto Score: +2%**

```javascript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

**Checklist:**
- [ ] Setup Sentry (2h)
- [ ] Configurar error boundaries (2h)
- [ ] Testar error reporting (2h)
- [ ] Configurar alertas (2h)

---

## 📊 ROADMAP RESUMIDO

### Semana 1-2: TESTES (D3: 20% → 60%, +40%)
- [ ] Setup Cypress + primeiros testes E2E (1 semana)
- [ ] Setup Jest + testes unitários críticos (1 semana)

### Semana 3-4: DOCUMENTAÇÃO (D1: 74% → 90%, +16%)
- [ ] API docs (Swagger) (1 semana)
- [ ] Atualizar PRD + Deploy guides (1 semana)

### Semana 5-6: SEGURANÇA + PERFORMANCE (D5+D6: 73.5% → 90%, +16.5%)
- [ ] Security: Input sanitization + headers + rate limiting (1 semana)
- [ ] Performance: DB optimization + caching (1 semana)

### Semana 7-8: FINALIZAÇÕES (Chegar a 95%+)
- [ ] Testes E2E completos
- [ ] Performance: Images + bundle
- [ ] UX: Acessibilidade
- [ ] Analytics + Error tracking

### Semana 9-10: POLIMENTO (Chegar a 100%)
- [ ] Code refactoring completo
- [ ] Documentação de componentes
- [ ] TypeScript migration
- [ ] Testes de integração

---

## 📋 CHECKLIST GERAL PARA 100%

### D1 - Documentação (74% → 100%)
- [ ] ✅ Architecture.md (JÁ EXISTE)
- [ ] ✅ Database schema (JÁ EXISTE)
- [ ] ✅ README.md (JÁ EXISTE)
- [ ] ❌ API docs (Swagger)
- [ ] ❌ PRD atualizado
- [ ] ❌ Deploy guides completos
- [ ] ❌ CHANGELOG.md
- [ ] ❌ Component library docs
- [ ] ❌ Contribution guide

### D2 - Código (96% → 100%)
- [ ] ✅ Shared modules criados
- [ ] ✅ Error handling
- [ ] ✅ Loading states
- [ ] ❌ Migração para shared completa
- [ ] ❌ TypeScript coverage
- [ ] ❌ ESLint + Prettier
- [ ] ❌ Husky hooks

### D3 - Testes (20% → 100%) 🔴 CRÍTICO
- [ ] ❌ Testes E2E (Cypress)
- [ ] ❌ Testes unitários (Jest)
- [ ] ❌ Testes de integração
- [ ] ❌ Coverage 80%+
- [ ] ❌ CI/CD integration

### D4 - UX/UI (93% → 100%)
- [ ] ✅ Loading states
- [ ] ✅ Error states
- [ ] ✅ Checkout simplificado
- [ ] ❌ Acessibilidade (a11y)
- [ ] ❌ Mobile 100% responsivo
- [ ] ❌ Skeleton loaders completos

### D5 - Segurança (77% → 100%)
- [ ] ✅ JWT auth
- [ ] ✅ Rate limiting básico
- [ ] ❌ Input sanitization
- [ ] ❌ Security headers (helmet)
- [ ] ❌ CSRF protection
- [ ] ❌ Rate limiting granular
- [ ] ❌ Security audit

### D6 - Performance (70% → 100%)
- [ ] ❌ DB indexes completos
- [ ] ❌ Caching (Redis)
- [ ] ❌ Image optimization
- [ ] ❌ Bundle optimization
- [ ] ❌ API pagination
- [ ] ❌ Compression

### D7 - Validação Real (95% → 100%)
- [ ] ✅ Sistema em produção
- [ ] ✅ Pedidos funcionando
- [ ] ❌ Analytics (Mixpanel/GA)
- [ ] ❌ Error tracking (Sentry)
- [ ] ❌ Métricas de uso

---

## 🎯 PRIORIZAÇÃO POR IMPACTO

### P0 - IMPACTO MÁXIMO (fazer primeiro)
1. **Testes E2E** (+30% D3) - 3 semanas
2. **Testes Unitários** (+35% D3) - 2 semanas
3. **DB Optimization** (+10% D6) - 3 dias
4. **Caching Strategy** (+10% D6) - 3 dias
5. **API Documentation** (+10% D1) - 1 semana

### P1 - ALTO IMPACTO
6. **Input Sanitization** (+8% D5) - 2 dias
7. **Security Headers** (+5% D5) - 1 dia
8. **Image Optimization** (+5% D6) - 2 dias
9. **Atualizar PRD** (+5% D1) - 1 dia
10. **Deploy Guides** (+5% D1) - 2 dias

### P2 - MÉDIO IMPACTO
11. **Acessibilidade** (+4% D4) - 3 dias
12. **Analytics** (+3% D7) - 2 dias
13. **Bundle Optimization** (+3% D6) - 2 dias
14. **CHANGELOG** (+3% D1) - 1 dia

### P3 - REFINAMENTO FINAL
15. **Testes Integração** (+15% D3) - 1 semana
16. **Component Docs** (+3% D1) - 3 dias
17. **Mobile Responsiveness** (+2% D4) - 2 dias
18. **Error Tracking** (+2% D7) - 1 dia
19. **Refactoring** (+2% D2) - 3 dias
20. **TypeScript** (+1% D2) - 2 dias

---

## 📈 TIMELINE ESTIMADO

```
┌─────────────────────────────────────────────────────────┐
│ META: 100/100 em 10 semanas (2.5 meses)                │
└─────────────────────────────────────────────────────────┘

Semana 1-2:  Testes E2E + Unitários       → 79.7% → 89.7%
Semana 3-4:  Docs (API + PRD + Deploy)    → 89.7% → 94.7%
Semana 5-6:  Security + Performance       → 94.7% → 97.5%
Semana 7-8:  UX + Analytics + Integração  → 97.5% → 99%
Semana 9-10: Polimento + Refinamentos     → 99%   → 100%
```

---

## ⚠️ RISCOS E BLOQUEADORES

### Alto Risco
- **Testes**: 6 semanas de trabalho intenso
- **Performance**: Requer Redis + CDN (infra)
- **Segurança**: Mudanças podem quebrar features

### Dependências Externas
- Redis para caching
- Cloudinary para images
- Sentry para error tracking
- Mixpanel/GA para analytics

---

## 💰 CUSTO ESTIMADO (se terceirizar)

```
Testes (5 semanas):          R$ 20.000
Documentação (2 semanas):    R$ 6.000
Segurança (1 semana):        R$ 4.000
Performance (2 semanas):     R$ 8.000
────────────────────────────────────
TOTAL:                       R$ 38.000
```

---

**Criado por**: MANUS v7.1
**Data**: 2026-01-17
**Score Atual**: 79.7%
**Meta**: 100%
**Prazo Estimado**: 10 semanas
