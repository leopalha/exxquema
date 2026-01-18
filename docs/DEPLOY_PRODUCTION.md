# 🚀 FLAME Lounge - Production Deployment Guide

**Guia completo para deploy em produção do FLAME Lounge v2.0**

---

## 📋 Índice

- [Pré-requisitos](#pré-requisitos)
- [Checklist Pré-Deploy](#checklist-pré-deploy)
- [Deploy Frontend (Vercel)](#deploy-frontend-vercel)
- [Deploy Backend (Railway)](#deploy-backend-railway)
- [Configuração de Domínio](#configuração-de-domínio)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Testes Pós-Deploy](#testes-pós-deploy)
- [Monitoramento](#monitoramento)
- [Rollback](#rollback)
- [Troubleshooting](#troubleshooting)

---

## ✅ Pré-requisitos

### Contas Necessárias

- [ ] **GitHub** - Repositório do código
- [ ] **Vercel** - Frontend hosting
- [ ] **Railway** - Backend + Database hosting
- [ ] **Domínio** - flame.com.br (ou similar)
- [ ] **Twilio** - SMS (opcional mas recomendado)
- [ ] **Stripe** - Pagamentos (opcional para MVP)
- [ ] **Google OAuth** - Login social (opcional)

### Ferramentas Locais

```bash
# Node.js 18+
node --version  # v18.0.0+

# npm 8+
npm --version  # 8.0.0+

# Git
git --version

# CLI Tools (opcionais mas recomendados)
npm install -g vercel
npm install -g @railway/cli
```

---

## 📝 Checklist Pré-Deploy

### Código

- [ ] Todos os testes críticos passando (`npm test`)
- [ ] Build do frontend sem erros (`npm run build`)
- [ ] Build do backend sem erros
- [ ] Linter passando (`npm run lint`)
- [ ] TypeScript errors resolvidos (se aplicável)
- [ ] Sem console.logs desnecessários
- [ ] Sem TODOs críticos no código

### Segurança

- [ ] Variáveis de ambiente configuradas
- [ ] Secrets não commitados no Git
- [ ] CORS configurado corretamente
- [ ] Rate limiting ativo
- [ ] HTTPS forçado
- [ ] Security headers configurados (Helmet.js)
- [ ] SQL Injection protection (Sequelize ORM)
- [ ] XSS protection (sanitization)
- [ ] CSRF protection ativo

### Performance

- [ ] Imagens otimizadas (WebP)
- [ ] Code splitting configurado
- [ ] Lazy loading implementado
- [ ] CDN configurado (Vercel Edge)
- [ ] Database indexes criados (18 indexes)
- [ ] Redis caching ativo
- [ ] Gzip/Brotli compression ativo

### Database

- [ ] Migrações testadas
- [ ] Seeds de produção prontos (se necessário)
- [ ] Backup strategy definida
- [ ] Connection pooling configurado
- [ ] Indexes otimizados

### Monitoramento

- [ ] Health check endpoint (`/health`)
- [ ] Error tracking configurado (Sentry - opcional)
- [ ] Logging configurado (Winston)
- [ ] Alertas configurados

---

## 🎨 Deploy Frontend (Vercel)

### Método 1: Deploy via GitHub (Recomendado)

#### 1. Conectar Repositório

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"New Project"**
3. Selecione o repositório **flamelounge**
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend/`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

#### 2. Configurar Variáveis de Ambiente

```bash
# Production Environment Variables
NEXT_PUBLIC_API_URL=https://backend-production.up.railway.app
NEXT_PUBLIC_APP_URL=https://flame.com.br
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_xxx
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx (opcional)
NODE_ENV=production
```

#### 3. Deploy

```bash
# Via Vercel CLI
cd frontend
vercel --prod

# Ou apenas commit no GitHub (auto-deploy)
git add .
git commit -m "chore: deploy production v2.0"
git push origin main
```

#### 4. Verificação

- Acesse o domínio do Vercel (ex: `flame-lounge.vercel.app`)
- Verifique que a página carrega
- Teste navegação entre páginas
- Verifique console do browser (sem erros críticos)

### Método 2: Deploy Manual (Build Local)

```bash
cd frontend
npm run build
vercel --prod --prebuilt
```

---

## ⚙️ Deploy Backend (Railway)

### Método 1: Deploy via GitHub (Recomendado)

#### 1. Criar Projeto no Railway

1. Acesse [railway.app](https://railway.app)
2. **"New Project"** → **"Deploy from GitHub"**
3. Selecione repositório **flamelounge**
4. Configure:
   - **Root Directory:** `backend/`
   - **Build Command:** (auto-detectado)
   - **Start Command:** `npm start` ou `node src/server.js`

#### 2. Adicionar PostgreSQL Database

1. No projeto Railway, clique **"New Service"**
2. Selecione **"Database"** → **"PostgreSQL"**
3. Railway irá provisionar automaticamente
4. Anote a `DATABASE_URL`

#### 3. Adicionar Redis (Opcional mas Recomendado)

1. **"New Service"** → **"Database"** → **"Redis"**
2. Anote a `REDIS_URL`

#### 4. Configurar Variáveis de Ambiente

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/flame_prod
REDIS_URL=redis://:pass@host:6379 (se usar Redis)

# Server
NODE_ENV=production
PORT=5000
APP_URL=https://flame.com.br

# Authentication
JWT_SECRET=your_super_secret_jwt_token_min_32_chars
JWT_EXPIRATION=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRATION=30d

# CSRF Protection
CSRF_SECRET=your_csrf_secret_min_32_chars

# Twilio SMS (opcional)
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+5511999999999

# Stripe (opcional)
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx

# SendGrid Email (opcional)
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@flame.com.br

# Sentry (opcional)
SENTRY_DSN=https://xxx@sentry.io/xxx

# CORS
CORS_ORIGIN=https://flame.com.br,https://www.flame.com.br
```

#### 5. Executar Migrações

```bash
# Via Railway CLI
railway run npm run migrate

# Ou adicionar ao deploy
# Em package.json: "start": "npm run migrate && node src/server.js"
```

#### 6. Deploy

```bash
# Via Railway CLI
cd backend
railway up

# Ou commit no GitHub (auto-deploy)
git add .
git commit -m "chore: deploy production backend v2.0"
git push origin main
```

#### 7. Verificação

```bash
# Health check
curl https://backend-production.up.railway.app/health

# Deve retornar:
# {
#   "status": "ok",
#   "timestamp": "2026-01-17T20:00:00.000Z",
#   "uptime": 123.45,
#   "database": "connected",
#   "redis": "connected"
# }
```

---

## 🌐 Configuração de Domínio

### DNS (flame.com.br)

Configure os seguintes registros no seu provedor de DNS:

#### Para Frontend (Vercel)

```
Tipo: CNAME
Nome: @
Valor: cname.vercel-dns.com

Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
```

#### Para Backend (Railway)

```
Tipo: CNAME
Nome: api
Valor: seu-projeto.up.railway.app
```

#### Resultado Final

- **Frontend:** https://flame.com.br
- **Backend API:** https://api.flame.com.br
- **www:** https://www.flame.com.br (redirect para flame.com.br)

### Configurar no Vercel

1. **Settings** → **Domains**
2. Adicione `flame.com.br` e `www.flame.com.br`
3. Aguarde propagação DNS (5-60 minutos)
4. Vercel irá provisionar SSL automaticamente

### Configurar no Railway

1. **Settings** → **Domains**
2. Adicione `api.flame.com.br`
3. Aguarde propagação DNS
4. SSL automático via Let's Encrypt

---

## 🔐 Variáveis de Ambiente

### Template `.env.production` (Backend)

```bash
# ======================
# FLAME LOUNGE - PRODUCTION
# ======================

# Node Environment
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=postgresql://user:password@host:5432/flame_production
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=20
DATABASE_SSL=true

# Redis Cache
REDIS_URL=redis://:password@host:6379
REDIS_TTL=300

# Application
APP_URL=https://flame.com.br
API_URL=https://api.flame.com.br
FRONTEND_URL=https://flame.com.br

# JWT Authentication
JWT_SECRET=CHANGE_THIS_TO_RANDOM_STRING_MIN_32_CHARS
JWT_EXPIRATION=7d
REFRESH_TOKEN_SECRET=CHANGE_THIS_TO_RANDOM_STRING_MIN_32_CHARS
REFRESH_TOKEN_EXPIRATION=30d

# CSRF Protection
CSRF_SECRET=CHANGE_THIS_TO_RANDOM_STRING_MIN_32_CHARS

# Security
CORS_ORIGIN=https://flame.com.br,https://www.flame.com.br
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=500

# Twilio (SMS)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Stripe (Payments)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# SendGrid (Email)
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=noreply@flame.com.br
SENDGRID_FROM_NAME=FLAME Lounge

# Sentry (Error Tracking)
SENTRY_DSN=

# Logging
LOG_LEVEL=info
LOG_FILE=logs/production.log
```

### Template `.env.local` (Frontend)

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.flame.com.br
NEXT_PUBLIC_APP_URL=https://flame.com.br

# Feature Flags
NEXT_PUBLIC_ENABLE_GOOGLE_LOGIN=true
NEXT_PUBLIC_ENABLE_STRIPE=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# External Services
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=
NEXT_PUBLIC_SENTRY_DSN=

# Environment
NODE_ENV=production
```

---

## ✅ Testes Pós-Deploy

### 1. Smoke Tests Manuais

```bash
# Health Check
curl https://api.flame.com.br/health

# Public Endpoints
curl https://api.flame.com.br/api/products
curl https://api.flame.com.br/api/categories

# Frontend
curl -I https://flame.com.br
```

### 2. Functional Tests

#### Autenticação
- [ ] Registro de novo usuário funciona
- [ ] Login com email/senha funciona
- [ ] Login com Google funciona (se habilitado)
- [ ] Logout funciona
- [ ] Token refresh funciona

#### Pedidos
- [ ] Adicionar produto ao carrinho
- [ ] Remover produto do carrinho
- [ ] Finalizar pedido
- [ ] Ver histórico de pedidos
- [ ] Tracking de pedido em tempo real (Socket.IO)

#### Cashback
- [ ] Cashback é creditado após pedido
- [ ] Usar cashback em novo pedido
- [ ] Ver histórico de cashback
- [ ] Notificação de cashback recebido

#### Admin
- [ ] Login como admin
- [ ] CRUD de produtos
- [ ] Ver pedidos do dia
- [ ] Dashboard de estatísticas

### 3. Performance Tests

```bash
# Load test com Artillery
cd backend/load-tests
artillery run config.yml

# Expected Results:
# - p95 < 1.5s
# - p99 < 3s
# - Error rate < 1%
```

### 4. Security Tests

```bash
# OWASP ZAP Baseline Scan
docker run -t ghcr.io/zaproxy/zaproxy:stable \
  zap-baseline.py -t https://api.flame.com.br

# Expected: No HIGH/CRITICAL findings
```

---

## 📊 Monitoramento

### 1. Health Checks

```bash
# Endpoint de saúde
GET https://api.flame.com.br/health

# Response esperado:
{
  "status": "ok",
  "timestamp": "2026-01-17T20:00:00.000Z",
  "uptime": 3600,
  "database": "connected",
  "redis": "connected"
}
```

### 2. Logs

#### Backend (Railway)

```bash
# Via Railway Dashboard
# Logs → Realtime Logs

# Via CLI
railway logs --tail
```

#### Frontend (Vercel)

```bash
# Via Vercel Dashboard
# Project → Logs

# Via CLI
vercel logs
```

### 3. Métricas Importantes

| Métrica | Threshold OK | Threshold Critical |
|---------|--------------|-------------------|
| CPU Usage | < 70% | > 90% |
| Memory Usage | < 80% | > 95% |
| Response Time (p95) | < 1.5s | > 3s |
| Error Rate | < 1% | > 5% |
| Database Connections | < 15 | > 18 |
| Uptime | > 99.5% | < 99% |

### 4. Alertas (Recomendado)

Configure alertas para:

- [ ] API Down (health check failing)
- [ ] High error rate (> 5%)
- [ ] Slow response times (p95 > 3s)
- [ ] Database connection issues
- [ ] High CPU/Memory usage
- [ ] Disk space low

**Ferramentas Recomendadas:**
- **UptimeRobot** - Free monitoring
- **Sentry** - Error tracking
- **Railway** - Built-in monitoring
- **Vercel** - Built-in analytics

---

## 🔄 Rollback

### Rollback Frontend (Vercel)

#### Via Dashboard

1. Acesse **Deployments**
2. Encontre deployment anterior estável
3. Clique **"⋮"** → **"Promote to Production"**

#### Via CLI

```bash
# Listar deployments
vercel ls

# Promover deployment anterior
vercel promote <deployment-url>
```

### Rollback Backend (Railway)

#### Via Dashboard

1. Acesse **Deployments**
2. Selecione deployment anterior
3. Clique **"Deploy"**

#### Via Git

```bash
# Reverter para commit anterior
git revert HEAD
git push origin main

# Ou rollback completo
git reset --hard <commit-hash>
git push origin main --force
```

### Rollback Database (Cuidado!)

```bash
# Restaurar backup
railway database:restore --backup=<backup-id>

# Reverter última migração
npm run migrate:undo
```

---

## 🐛 Troubleshooting

### Problema: Frontend não carrega

**Sintomas:** Página em branco, erro 500

**Soluções:**
1. Verificar variáveis de ambiente no Vercel
2. Ver logs: `vercel logs`
3. Verificar se build passou: `npm run build`
4. Testar localmente: `npm run start`

### Problema: API retorna 500

**Sintomas:** Erros ao fazer requisições

**Soluções:**
1. Verificar logs no Railway
2. Verificar variáveis de ambiente
3. Testar health check: `curl https://api.flame.com.br/health`
4. Verificar conexão com database

### Problema: Database connection failed

**Sintomas:** `ECONNREFUSED`, `Connection timeout`

**Soluções:**
1. Verificar `DATABASE_URL` está correto
2. Verificar firewall do Railway
3. Verificar se database está online (Railway Dashboard)
4. Verificar connection pool: `DATABASE_POOL_MAX=20`

### Problema: CORS errors

**Sintomas:** `Access-Control-Allow-Origin` errors no browser

**Soluções:**
1. Verificar `CORS_ORIGIN` no backend inclui domínio do frontend
2. Verificar se HTTPS está ativo
3. Testar com curl:
   ```bash
   curl -H "Origin: https://flame.com.br" \
        -I https://api.flame.com.br/api/products
   ```

### Problema: Slow response times

**Sintomas:** p95 > 3s, timeout errors

**Soluções:**
1. Verificar database indexes: `SELECT * FROM pg_stat_user_indexes;`
2. Verificar Redis cache está ativo
3. Verificar N+1 queries (usar `include` do Sequelize)
4. Scale up Railway instance (mais CPU/RAM)

### Problema: High memory usage

**Sintomas:** Memory > 90%, crashes

**Soluções:**
1. Verificar memory leaks com `node --inspect`
2. Verificar connection pool não está vazando
3. Adicionar mais memória no Railway
4. Implementar garbage collection tuning

---

## 📚 Recursos Adicionais

- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

## 📞 Suporte

Em caso de problemas críticos:

1. **Verificar Status Pages:**
   - Vercel: https://vercel-status.com
   - Railway: https://status.railway.app

2. **Rollback Imediato** (se necessário)

3. **Contatar Equipe:**
   - Tech Lead: tech@flame.com.br
   - DevOps: devops@flame.com.br
   - Emergency: +55 11 99999-9999

---

**✅ Deploy Checklist Final:**

- [ ] Frontend deployado e acessível
- [ ] Backend deployado e health check OK
- [ ] Database migrada e com dados
- [ ] Domínio configurado e SSL ativo
- [ ] Variáveis de ambiente configuradas
- [ ] Smoke tests passando
- [ ] Monitoramento ativo
- [ ] Backups configurados
- [ ] Documentação atualizada
- [ ] Equipe notificada

---

**Última Atualização:** 2026-01-17
**Versão:** 2.0.0
**Autor:** FLAME DevOps Team
