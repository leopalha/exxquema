# 🚀 Deploy Quickstart - FLAME Lounge Bar

**Tempo estimado:** 15-20 minutos
**Plataformas:** Railway (Backend) + Vercel (Frontend)

---

## 🎯 Opção 1: Deploy Automatizado (Recomendado)

### Passo Único

```bash
./deploy-railway-vercel.sh
```

O script irá:
1. ✅ Instalar Railway e Vercel CLI automaticamente
2. ✅ Criar projeto no Railway com PostgreSQL + Redis
3. ✅ Configurar variáveis de ambiente
4. ✅ Deploy do backend
5. ✅ Deploy do frontend
6. ✅ Conectar frontend ao backend

**Pronto em 10 minutos!** ⚡

---

## 📝 Opção 2: Deploy Manual

### Backend - Railway

#### 1. Instalar Railway CLI
```bash
npm install -g @railway/cli
```

#### 2. Login
```bash
railway login
```

#### 3. Criar Projeto
```bash
railway init
```

#### 4. Adicionar PostgreSQL
```bash
railway add --plugin postgresql
```

#### 5. Adicionar Redis
```bash
railway add --plugin redis
```

#### 6. Configurar Variáveis
```bash
# Gerar JWT secret forte
JWT_SECRET=$(openssl rand -base64 32)

# Configurar
railway variables set NODE_ENV=production
railway variables set PORT=7000
railway variables set JWT_SECRET="$JWT_SECRET"
railway variables set JWT_EXPIRES_IN=7d
```

#### 7. Deploy
```bash
cd backend
railway up
```

#### 8. Obter URL
```bash
railway domain
# Guarde esta URL para configurar o frontend
```

---

### Frontend - Vercel

#### 1. Instalar Vercel CLI
```bash
npm install -g vercel
```

#### 2. Login
```bash
vercel login
```

#### 3. Configurar Variáveis
```bash
cd frontend

# Criar .env.production
cat > .env.production << EOF
NEXT_PUBLIC_API_URL=https://seu-backend-railway.up.railway.app
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=
EOF
```

#### 4. Deploy
```bash
vercel --prod
```

---

## 🔧 Configurações Opcionais

### Google Analytics 4

```bash
# No dashboard da Vercel ou via CLI:
vercel env add NEXT_PUBLIC_GA_ID production
# Cole: G-XXXXXXXXXX
```

### Sentry (Error Tracking)

```bash
# Backend
railway variables set SENTRY_DSN=https://xxx@sentry.io/xxx

# Frontend
vercel env add NEXT_PUBLIC_SENTRY_DSN production
# Cole o DSN do Sentry
```

### Twilio (SMS)

```bash
railway variables set TWILIO_ACCOUNT_SID=ACxxxx
railway variables set TWILIO_AUTH_TOKEN=xxxxx
railway variables set TWILIO_PHONE_NUMBER=+5511999999999
```

---

## ✅ Verificar Deploy

### 1. Testar Backend
```bash
# Substituir pela sua URL do Railway
curl https://seu-backend.up.railway.app/health
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "FLAME API is running!",
  "environment": "production"
}
```

### 2. Testar Frontend
Abra a URL do Vercel no navegador e verifique:
- ✅ Página carrega
- ✅ Cardápio aparece
- ✅ Login funciona
- ✅ Pedidos podem ser criados

---

## 🔍 Monitoramento

### Railway Dashboard
```bash
railway open
```

**Ver:**
- Logs do backend
- Métricas de CPU/RAM
- Status do PostgreSQL e Redis

### Vercel Dashboard
```bash
vercel dashboard
```

**Ver:**
- Analytics
- Logs do frontend
- Performance metrics

---

## 🐛 Troubleshooting

### Backend não inicia no Railway

**Problema:** Erro de conexão com banco

**Solução:**
```bash
# Verificar se PostgreSQL está provisionado
railway variables

# Deve aparecer DATABASE_URL automaticamente
```

---

### Frontend não conecta ao Backend

**Problema:** CORS error ou 404

**Solução:**
```bash
# Verificar se NEXT_PUBLIC_API_URL está correto
cd frontend
vercel env ls

# Se necessário, atualizar:
vercel env rm NEXT_PUBLIC_API_URL production
vercel env add NEXT_PUBLIC_API_URL production
# Cole a URL correta do Railway
```

---

### Build do Frontend falha

**Problema:** TypeScript error

**Solução:**
```bash
cd frontend
npm run build

# Se build local funcionar:
vercel --prod --force
```

---

## 📊 Métricas Esperadas

### Performance
- Backend response time: **< 200ms**
- Frontend load time: **< 2s**
- Cache hit rate (Redis): **> 70%**

### Disponibilidade
- Uptime: **99.9%** (Railway + Vercel SLA)
- Auto-scaling: ✅ Automático
- Global CDN: ✅ Vercel Edge Network

---

## 💰 Custos Estimados

### Railway (Backend)
- **Free Tier:** $5 de crédito/mês
- **Hobby Plan:** $5/mês (recomendado)
  - PostgreSQL incluído
  - Redis incluído
  - 512MB RAM, CPU compartilhada

### Vercel (Frontend)
- **Free Tier:** Adequado para projetos pessoais
- **Pro Plan:** $20/mês (se precisar)
  - Analytics avançado
  - Mais banda

**Total estimado:** $5-25/mês

---

## 🔐 Segurança

### Checklist Pós-Deploy

- [ ] JWT_SECRET gerado com `openssl rand -base64 32`
- [ ] HTTPS habilitado (Railway e Vercel fazem automaticamente)
- [ ] Variáveis sensíveis não commitadas no Git
- [ ] CORS configurado apenas para domínio do frontend
- [ ] Rate limiting ativo (já configurado no código)

---

## 📞 Suporte

**Documentação Completa:** [DEPLOYMENT.md](DEPLOYMENT.md)

**Railway:**
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

**Vercel:**
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord

---

## 🎉 Próximos Passos

1. ✅ Configurar domínio customizado
2. ✅ Habilitar Google Analytics
3. ✅ Configurar Sentry
4. ✅ Executar UAT (User Acceptance Testing)
5. ✅ Monitorar métricas

---

**🔥 FLAME Lounge Bar - Deploy em 15 minutos!**
