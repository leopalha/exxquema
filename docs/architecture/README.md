# FLAME Lounge Bar - Architecture Documentation

## Visão Geral

Esta pasta contém a documentação completa da arquitetura do sistema FLAME Lounge Bar, organizada seguindo o **C4 Model** (Context, Containers, Components, Code).

---

## 📚 Documentos Disponíveis

### 1. [C4 Context Diagram](./C4_CONTEXT.md)
**Nível**: Sistema
**Público-alvo**: Stakeholders, Product Owners, C-Level

Mostra o sistema como uma caixa preta e seus relacionamentos com:
- Atores (Clientes, Staff, Administradores)
- Sistemas externos (Payment Gateway, WhatsApp, Analytics)
- Fluxos principais de dados

**Quando usar**: Para entender o sistema de forma high-level e suas integrações externas.

---

### 2. [C4 Container Diagram](./C4_CONTAINER.md)
**Nível**: Containers (Aplicações e Data Stores)
**Público-alvo**: Arquitetos, Tech Leads, DevOps

Detalha os principais containers do sistema:
- **Frontend**: Next.js PWA (3000)
- **Backend**: Express API (7000)
- **Database**: PostgreSQL (5432)
- **Cache**: Redis (6379)
- **CDN**: Vercel Edge
- **Storage**: Railway Volume

**Quando usar**: Para entender a arquitetura técnica, deploy e comunicação entre containers.

---

### 3. [C4 Component Diagram](./C4_COMPONENT.md) ⏳
**Nível**: Componentes internos de cada container
**Público-alvo**: Desenvolvedores, Tech Leads

Detalha a estrutura interna de:
- Frontend components (Pages, Stores, Services)
- Backend modules (Routes, Controllers, Services, Models)
- Padrões de design utilizados

**Status**: Em desenvolvimento

---

### 4. [C4 Code Diagram](./C4_CODE.md) ⏳
**Nível**: Classes e código-fonte
**Público-alvo**: Desenvolvedores

Diagrama de classes UML mostrando:
- Principais classes e interfaces
- Relacionamentos (herança, composição, associação)
- Métodos públicos importantes

**Status**: Em desenvolvimento

---

## 🎯 C4 Model - Níveis de Abstração

```
Level 1: CONTEXT (Sistema em caixa preta)
         ↓
Level 2: CONTAINERS (Aplicações e Data Stores)
         ↓
Level 3: COMPONENTS (Módulos internos)
         ↓
Level 4: CODE (Classes e implementação)
```

---

## 🏗️ Arquitetura Resumida

### Tech Stack Principal

**Frontend**:
- Next.js 14 (React 18)
- Zustand (State Management)
- Tailwind CSS + Framer Motion
- PWA (Service Worker)
- ISR (Incremental Static Regeneration)

**Backend**:
- Node.js + Express
- PostgreSQL (Sequelize ORM)
- Redis (Caching + Sessions)
- Socket.io (Real-time)
- JWT Authentication

**Infra**:
- Vercel (Frontend hosting + CDN)
- Railway (Backend + Database + Redis)
- GitHub Actions (CI/CD)
- Sentry (Error monitoring)
- Google Analytics 4

---

## 📊 Padrões Arquiteturais

### 1. **Layered Architecture (Backend)**
```
┌─────────────────────┐
│   Routes (API)      │ ← HTTP Endpoints
├─────────────────────┤
│   Controllers       │ ← Request handling
├─────────────────────┤
│   Services          │ ← Business logic
├─────────────────────┤
│   Models (ORM)      │ ← Data access
├─────────────────────┤
│   Database          │ ← Persistence
└─────────────────────┘
```

### 2. **Flux Pattern (Frontend - Zustand)**
```
┌──────────┐   dispatch   ┌───────┐   update   ┌───────┐
│  View    │─────────────→│ Store │───────────→│ View  │
│(Component)│              │(State)│            │(Re-render)
└──────────┘              └───────┘            └───────┘
```

### 3. **Repository Pattern (Database)**
```
Controller → Service → Repository → Model → Database
```

### 4. **Middleware Chain (Express)**
```
Request → [Auth] → [RBAC] → [CSRF] → [Sanitize] → [RateLimit] → Controller
```

---

## 🔐 Security Layers

1. **Authentication**: JWT (Access + Refresh tokens)
2. **Authorization**: RBAC (customer, staff, admin)
3. **CSRF Protection**: Double Submit Cookie
4. **XSS Prevention**: Input sanitization
5. **SQL Injection**: Parameterized queries (Sequelize)
6. **Rate Limiting**: 100 req/15min per IP
7. **Security Headers**: Helmet (CSP, HSTS, etc)
8. **HTTPS**: Enforced in production

---

## 📈 Performance Strategies

### Frontend
- **ISR**: Menu pages regenerated every 5min
- **Code Splitting**: Dynamic imports for heavy components
- **Image Optimization**: WebP/AVIF with Next.js Image
- **Bundle Size**: Modular imports (Lucide, Framer Motion)
- **PWA Caching**: Aggressive caching for static assets
- **Prefetch**: Navigation links preloaded

### Backend
- **Redis Caching**: API responses cached (5-10min TTL)
- **Database Indexes**: Optimized queries
- **Connection Pooling**: 20 DB connections
- **Query Optimization**: Select only needed fields
- **Pagination**: Limit results to 20-50 items

### Database
- **Indexes**: Strategic indexes on foreign keys
- **Transactions**: ACID compliance
- **Query Planning**: EXPLAIN ANALYZE for optimization
- **Partitioning**: Future: partition orders by date

---

## 🚀 Deployment Pipeline

```
Developer
   ↓ git push
GitHub
   ↓ trigger
GitHub Actions
   ├─ Run tests (Jest + Playwright)
   ├─ Lint code (ESLint)
   ├─ Build frontend (Next.js)
   └─ Build backend (Node.js)
   ↓ deploy
┌────────────┬────────────┐
│   Vercel   │  Railway   │
│ (Frontend) │ (Backend)  │
└────────────┴────────────┘
```

**CI/CD Steps**:
1. Run unit tests (Jest)
2. Run E2E tests (Playwright)
3. Lint check (ESLint + Prettier)
4. Type check (JSDoc/TypeScript)
5. Build production bundle
6. Deploy to staging
7. Smoke tests
8. Deploy to production

---

## 📊 Monitoring & Observability

**Metrics Collected**:
- Error tracking (Sentry)
- Performance monitoring (Sentry + GA4)
- User analytics (GA4)
- Server metrics (Railway dashboard)
- Database metrics (PostgreSQL stats)
- Cache hit rate (Redis INFO)

**Alerts Configured**:
- Error rate > 1% (Sentry → Slack)
- Response time > 2s (Railway → Email)
- Database CPU > 80% (Railway → Email)
- Disk usage > 90% (Railway → Email)

---

## 🔄 Data Flow Examples

### Example 1: User Places Order
```
1. User clicks "Confirmar Pedido" (checkout.js)
2. Frontend calls POST /api/orders (api.js)
3. Backend validates request (orderController.js)
4. Business logic processes order (orderService.js)
5. Database saves order + items (Order model)
6. Cashback calculated (cashbackService.js)
7. WebSocket notifies staff (orderSocket.js)
8. Response sent to client
9. Frontend updates UI (orderStore.js)
10. Success toast shown (react-hot-toast)
```

### Example 2: Menu Page Load (ISR)
```
1. User navigates to /cardapio
2. Next.js serves static HTML (generated 3min ago)
3. React hydrates page (client-side)
4. Frontend checks cache age
5. If stale, background revalidation triggered
6. Next.js calls getStaticProps
7. API fetches products (/api/products)
8. Redis returns cached response (if available)
9. New static page generated
10. Served on next request
```

---

## 📝 Decision Records (ADRs)

### ADR-001: Why Next.js over pure React?
**Decision**: Use Next.js 14 with Pages Router
**Reasoning**:
- SSR for better SEO
- ISR for optimal performance
- Built-in Image optimization
- File-based routing
- API routes (optional)

### ADR-002: Why Zustand over Redux?
**Decision**: Use Zustand for state management
**Reasoning**:
- Simpler API (no boilerplate)
- Better TypeScript support
- Smaller bundle size (~1KB vs 3KB)
- Middleware support (persist, devtools)

### ADR-003: Why PostgreSQL over MongoDB?
**Decision**: Use PostgreSQL as primary database
**Reasoning**:
- Strong ACID compliance (orders = money)
- Better relational data modeling
- Superior query optimization
- Industry standard for financial data

### ADR-004: Why Railway over AWS?
**Decision**: Use Railway for hosting
**Reasoning**:
- Simpler setup (no VPC/security groups)
- Better developer experience
- Auto-scaling included
- Integrated PostgreSQL + Redis
- Competitive pricing for startup phase

---

## 🎓 Learning Resources

**C4 Model**:
- [Official C4 Model Website](https://c4model.com/)
- [C4 Model Tutorial](https://www.infoq.com/articles/C4-architecture-model/)

**Architecture Patterns**:
- [Clean Architecture (Robert C. Martin)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Microservices Patterns](https://microservices.io/patterns/index.html)

**Next.js Best Practices**:
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js ISR Guide](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)

**Node.js Best Practices**:
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

---

## 📞 Contato

**Tech Lead**: MANUS v7.1
**Last Updated**: 2026-01-17
**Version**: 1.0

Para dúvidas sobre arquitetura, abra uma issue no GitHub ou contacte o tech lead.

---

**Status**: ✅ Documentação Completa (Context + Container)
**TODO**: Criar C4_COMPONENT.md e C4_CODE.md
