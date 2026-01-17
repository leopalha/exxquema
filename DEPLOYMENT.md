# 🚀 FLAME Lounge Bar - Guia de Deploy

**Versão:** 2.0.0
**Data:** Janeiro 2026
**Status:** ✅ Pronto para Produção

---

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Setup Rápido](#setup-rápido)
3. [Configuração Manual](#configuração-manual)
4. [Variáveis de Ambiente](#variáveis-de-ambiente)
5. [Deploy em Produção](#deploy-em-produção)
6. [Monitoramento](#monitoramento)
7. [Troubleshooting](#troubleshooting)

---

## Pré-requisitos

### Obrigatórios
- **Node.js** 18.x ou superior
- **npm** 9.x ou superior
- **PostgreSQL** 14+ (banco de dados)

### Opcionais (Recomendados)
- **Redis** 6+ (caching - melhora performance)
- **Conta Sentry** (error tracking)
- **Google Analytics 4** (analytics)

---

## Setup Rápido

### Usando o Script Automatizado

```bash
# Dar permissão de execução
chmod +x setup-production.sh

# Executar setup
./setup-production.sh
```

O script irá:
- ✅ Verificar dependências
- ✅ Instalar pacotes do backend e frontend
- ✅ Criar arquivos `.env` de template
- ✅ Fazer build do frontend
- ✅ Executar todos os testes

---

## Configuração Manual

### 1. Backend

```bash
cd backend

# Instalar dependências
npm ci

# Criar arquivo .env
cp .env.example .env

# Editar variáveis de ambiente
nano .env

# Executar testes
npm test

# Iniciar em produção
npm start
```

### 2. Frontend

```bash
cd frontend

# Instalar dependências
npm ci

# Criar arquivo .env.production
cp .env.example .env.production

# Editar variáveis de ambiente
nano .env.production

# Build
npm run build

# Iniciar em produção
npm start
```

---

## Variáveis de Ambiente

### Backend (.env)

```bash
# ==========================================
# OBRIGATÓRIAS
# ==========================================

# Database PostgreSQL
DATABASE_URL=postgresql://user:password@host:5432/flame_production

# JWT Secret (gere uma chave forte)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=7d

# Frontend URL (para CORS)
FRONTEND_URL=https://flameloungebar.com

# Ambiente
NODE_ENV=production
PORT=7000

# ==========================================
# OPCIONAIS (Mas Recomendadas)
# ==========================================

# Redis - Cache (melhora performance significativamente)
REDIS_URL=redis://localhost:6379

# Sentry - Error Tracking
SENTRY_DSN=https://xxxxx@o123456.ingest.sentry.io/123456

# Twilio - SMS (para autenticação por celular)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+5511999999999

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=500
```

### Frontend (.env.production)

```bash
# ==========================================
# OBRIGATÓRIAS
# ==========================================

# API URL do Backend
NEXT_PUBLIC_API_URL=https://api.flameloungebar.com

# ==========================================
# OPCIONAIS (Mas Recomendadas)
# ==========================================

# Google Analytics 4
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Sentry (Frontend)
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@o123456.ingest.sentry.io/123456
```

---

## Deploy em Produção

### Opção 1: Vercel (Frontend) + Railway/Heroku (Backend)

#### Frontend no Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod

# Configurar variáveis de ambiente no dashboard:
# https://vercel.com/your-project/settings/environment-variables
```

#### Backend no Railway

1. Acesse https://railway.app
2. Create New Project → Deploy from GitHub
3. Selecione o repositório `flame-lounge-bar`
4. Configure variáveis de ambiente:
   - `DATABASE_URL` (Railway provê PostgreSQL automático)
   - `JWT_SECRET`
   - `REDIS_URL` (Railway provê Redis automático)
   - `FRONTEND_URL`
   - Todas outras opcionais

### Opção 2: VPS (Ubuntu/Debian)

```bash
# 1. Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Instalar PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# 3. Instalar Redis (opcional)
sudo apt-get install redis-server

# 4. Clonar repositório
git clone https://github.com/seu-usuario/flame-lounge-bar.git
cd flame-lounge-bar

# 5. Executar setup
./setup-production.sh

# 6. Configurar PM2 (process manager)
npm install -g pm2

# Backend
cd backend
pm2 start npm --name "flame-api" -- start
pm2 save

# Frontend
cd ../frontend
pm2 start npm --name "flame-web" -- start
pm2 save

# Auto-start no boot
pm2 startup
```

### Opção 3: Docker

```bash
# Build
docker-compose -f docker-compose.prod.yml build

# Start
docker-compose -f docker-compose.prod.yml up -d

# Logs
docker-compose logs -f
```

---

## Monitoramento

### 1. Sentry (Error Tracking)

**Setup:**
1. Criar conta em https://sentry.io
2. Criar novo projeto
3. Copiar DSN
4. Adicionar `SENTRY_DSN` no backend e `NEXT_PUBLIC_SENTRY_DSN` no frontend

**Recursos:**
- ✅ Error tracking em tempo real
- ✅ Stack traces completos
- ✅ Alertas por email/Slack
- ✅ Performance monitoring

### 2. Google Analytics 4

**Setup:**
1. Criar propriedade GA4 em https://analytics.google.com
2. Copiar Measurement ID (G-XXXXXXXXXX)
3. Adicionar `NEXT_PUBLIC_GA_ID` no frontend

**Eventos Rastreados:**
- ✅ `view_item` - Produto visualizado
- ✅ `add_to_cart` - Item adicionado ao carrinho
- ✅ `remove_from_cart` - Item removido
- ✅ `begin_checkout` - Início do checkout
- ✅ `purchase` - Conversão (pedido finalizado)
- ✅ `generate_lead` - Reserva criada
- ✅ `search` - Busca no cardápio

### 3. Redis Caching

**Setup:**
1. Instalar Redis localmente ou usar serviço (Railway, Redis Cloud)
2. Adicionar `REDIS_URL=redis://host:6379` no backend

**Benefícios:**
- ✅ Cache de produtos (5 minutos)
- ✅ Cache de mesas (2 minutos)
- ✅ Invalidação automática em updates
- ✅ Reduz carga no banco de dados
- ✅ Melhora tempo de resposta

### 4. Health Check

Endpoint disponível: `GET /health`

```bash
curl https://api.flameloungebar.com/health
```

Resposta:
```json
{
  "success": true,
  "message": "FLAME API is running!",
  "timestamp": "2026-01-17T12:00:00.000Z",
  "environment": "production"
}
```

---

## CI/CD (GitHub Actions)

### Workflow Configurado

**Testes Automatizados:**
- ✅ Executa em push/PR para `main` e `develop`
- ✅ Instala dependências
- ✅ Roda testes Playwright E2E
- ✅ Upload de relatórios como artifacts

**Arquivo:** `.github/workflows/playwright.yml`

### Habilitar no GitHub

1. Push do código para GitHub
2. Actions são habilitadas automaticamente
3. Verificar em: `https://github.com/seu-usuario/flame-lounge-bar/actions`

---

## Troubleshooting

### Backend não inicia

**Problema:** Erro ao conectar no banco de dados

```
❌ Erro ao conectar com banco de dados
```

**Solução:**
1. Verificar se PostgreSQL está rodando
2. Verificar `DATABASE_URL` no `.env`
3. Testar conexão manual:
```bash
psql "postgresql://user:password@host:5432/dbname"
```

---

### Frontend não carrega

**Problema:** Build falha com erro de tipo

**Solução:**
```bash
cd frontend
rm -rf .next node_modules
npm install
npm run build
```

---

### Redis não conecta

**Problema:**
```
Redis not configured (REDIS_URL not set) - caching disabled
```

**Solução:**
- Isso é apenas um **aviso**, não um erro
- O sistema funciona sem Redis (apenas mais lento)
- Para habilitar cache: adicione `REDIS_URL` no `.env`

---

### Testes E2E falhando

**Problema:** Testes Playwright falhando localmente

**Solução:**
- Testes E2E precisam do servidor rodando
- Instalar browsers: `npx playwright install --with-deps`
- Ou aguardar CI/CD rodar automaticamente

---

## Checklist de Deploy

- [ ] Variáveis de ambiente configuradas (backend + frontend)
- [ ] PostgreSQL configurado e rodando
- [ ] Todos os testes passando (`npm test`)
- [ ] Build do frontend sem erros (`npm run build`)
- [ ] Redis configurado (opcional mas recomendado)
- [ ] Sentry configurado (opcional mas recomendado)
- [ ] Google Analytics configurado (opcional)
- [ ] Health check funcionando (`/health`)
- [ ] HTTPS configurado (SSL/TLS)
- [ ] Domínio apontando para servidor
- [ ] Firewall configurado (portas 80, 443, 7000)
- [ ] Backup do banco de dados configurado

---

## Suporte

- **Documentação:** `docs/`
- **Issues:** https://github.com/seu-usuario/flame-lounge-bar/issues
- **UAT Guide:** `docs/UAT_EXECUTION_GUIDE.md`

---

**Última atualização:** Janeiro 2026
**Versão do Sistema:** 2.0.0
**Status:** ✅ Pronto para Produção
