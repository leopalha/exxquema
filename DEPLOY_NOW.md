# 🚀 DEPLOY AGORA - Instruções Passo a Passo

**Status:** ✅ Código pushed para GitHub
**Branch:** main
**Tag:** v2.0.0
**GitHub Actions:** Em execução (verificar em https://github.com/leopalha/flame/actions)

---

## 📋 PASSO 1: Verificar GitHub Actions

```bash
# Abrir no browser:
https://github.com/leopalha/flame/actions

# Ou via CLI:
gh run list --limit 5
```

**Esperado:** CI/CD Playwright deve estar rodando os testes E2E automaticamente.

---

## 🚂 PASSO 2: Deploy Backend no Railway

### 2.1. Login no Railway

```bash
railway login
```

**Ação:** Vai abrir o browser para fazer login.
- Use sua conta GitHub ou Email
- Autorize o Railway CLI

### 2.2. Criar Projeto

```bash
railway init
```

**Perguntas:**
- "Project name?" → Digite: `flame-lounge-backend`
- "Start with a template?" → Selecione: `Empty Project`

### 2.3. Adicionar PostgreSQL

```bash
railway add
```

**Selecione:** `PostgreSQL`

### 2.4. Adicionar Redis

```bash
railway add
```

**Selecione:** `Redis`

### 2.5. Configurar Variáveis de Ambiente

```bash
# Gerar JWT secret forte
JWT_SECRET=$(openssl rand -base64 32)

# Configurar variáveis
railway variables set NODE_ENV=production
railway variables set PORT=7000  
railway variables set JWT_SECRET="$JWT_SECRET"
railway variables set JWT_EXPIRES_IN=7d

# Verificar DATABASE_URL e REDIS_URL foram criadas automaticamente
railway variables
```

**Esperado:** Deve aparecer:
- ✅ DATABASE_URL (automático do PostgreSQL)
- ✅ REDIS_URL (automático do Redis)
- ✅ NODE_ENV=production
- ✅ PORT=7000
- ✅ JWT_SECRET=...
- ✅ JWT_EXPIRES_IN=7d

### 2.6. Deploy do Backend

```bash
cd backend
railway up
```

**Ação:** Railway vai fazer build e deploy.
**Tempo:** ~3-5 minutos

### 2.7. Obter URL do Backend

```bash
railway domain
```

**Exemplo de resposta:**
```
https://flame-lounge-backend-production.up.railway.app
```

**⚠️ IMPORTANTE:** Copie esta URL! Você vai precisar para o frontend.

### 2.8. Testar Backend

```bash
# Substituir pela sua URL
curl https://sua-url.up.railway.app/health
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "FLAME API is running!",
  "environment": "production"
}
```

---

## ▲ PASSO 3: Deploy Frontend no Vercel

### 3.1. Login no Vercel

```bash
vercel login
```

**Ação:** Vai abrir o browser para fazer login.
- Use sua conta GitHub ou Email
- Autorize o Vercel CLI

### 3.2. Configurar Variáveis de Ambiente

```bash
cd ../frontend

# Criar arquivo .env.production
cat > .env.production << ENVEOF
NEXT_PUBLIC_API_URL=https://sua-url.up.railway.app
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_SENTRY_DSN=
ENVEOF
```

**⚠️ SUBSTITUA** `https://sua-url.up.railway.app` pela URL do Railway (passo 2.7)

### 3.3. Deploy

```bash
vercel --prod
```

**Perguntas:**
- "Set up and deploy?" → `Y`
- "Which scope?" → Selecione sua conta
- "Link to existing project?" → `N` (primeira vez)
- "Project name?" → `flame-lounge` (ou qualquer nome)
- "Directory?" → `.` (enter)
- "Override settings?" → `N` (enter)

**Tempo:** ~2-3 minutos

### 3.4. Obter URL do Frontend

Vercel vai mostrar:
```
✅ Production: https://flame-lounge-xxx.vercel.app
```

### 3.5. Configurar Variável de Ambiente

```bash
# Se precisar adicionar Google Analytics depois:
vercel env add NEXT_PUBLIC_GA_ID production
# Cole: G-XXXXXXXXXX

# Se precisar adicionar Sentry depois:
vercel env add NEXT_PUBLIC_SENTRY_DSN production
# Cole o DSN do Sentry
```

### 3.6. Testar Frontend

Abra no browser: `https://flame-lounge-xxx.vercel.app`

**Verificações:**
- ✅ Página carrega
- ✅ Layout aparece corretamente
- ✅ Cardápio carrega (conectou no backend!)
- ✅ Login funciona

---

## ✅ PASSO 4: Verificações Finais

### 4.1. Health Check

```bash
# Backend
curl https://sua-url.up.railway.app/health

# Esperado: {"success": true, ...}
```

### 4.2. CORS Verificação

```bash
# Testar se frontend consegue chamar backend
# Abra o console do browser (F12) e execute:
fetch('https://sua-url.up.railway.app/health')
  .then(r => r.json())
  .then(d => console.log('✅ CORS OK:', d))
  .catch(e => console.error('❌ CORS Error:', e))
```

### 4.3. Dashboard Railway

```bash
railway open
```

**Verificar:**
- ✅ Service rodando (status verde)
- ✅ PostgreSQL provisionado
- ✅ Redis provisionado
- ✅ Logs sem erros

### 4.4. Dashboard Vercel

```bash
vercel dashboard
```

**Verificar:**
- ✅ Deployment successful
- ✅ Production URL ativa
- ✅ Sem erros de build

---

## 🔧 PASSO 5: Configurações Opcionais

### 5.1. Configurar Domínio Customizado

**Railway (Backend):**
```bash
railway domain add api.seudominio.com
```

**Vercel (Frontend):**
```bash
vercel domains add seudominio.com
```

### 5.2. Configurar Google Analytics

```bash
cd frontend
vercel env add NEXT_PUBLIC_GA_ID production
# Cole: G-XXXXXXXXXX

# Fazer redeploy para aplicar:
vercel --prod
```

### 5.3. Configurar Sentry

```bash
# Backend
railway variables set SENTRY_DSN=https://xxx@sentry.io/xxx

# Frontend  
cd frontend
vercel env add NEXT_PUBLIC_SENTRY_DSN production
# Cole o DSN

vercel --prod
```

### 5.4. Configurar Twilio (SMS)

```bash
railway variables set TWILIO_ACCOUNT_SID=ACxxxx
railway variables set TWILIO_AUTH_TOKEN=xxxxx
railway variables set TWILIO_PHONE_NUMBER=+5511999999999
```

---

## 📊 PASSO 6: Monitoramento

### 6.1. Ver Logs em Tempo Real

**Backend:**
```bash
railway logs --tail 100
```

**Frontend:**
```bash
cd frontend
vercel logs --follow
```

### 6.2. Ver Métricas

**Railway:**
```bash
railway status
```

**Vercel:**
- Acesse: https://vercel.com/dashboard
- Veja: Analytics, Performance, Logs

---

## 🐛 Troubleshooting

### Backend não inicia

**Problema:** Erro de conexão com banco

**Solução:**
```bash
railway variables
# Verificar se DATABASE_URL existe

# Se não existir:
railway add
# Selecione PostgreSQL novamente
```

### Frontend não conecta no Backend

**Problema:** CORS error

**Solução:**
```bash
# Verificar FRONTEND_URL no Railway
railway variables set FRONTEND_URL=https://seu-frontend.vercel.app

# Verificar NEXT_PUBLIC_API_URL no Vercel
cd frontend
vercel env ls

# Se estiver errado, remover e adicionar novamente:
vercel env rm NEXT_PUBLIC_API_URL production
vercel env add NEXT_PUBLIC_API_URL production
# Cole a URL correta do Railway
```

### Build falha

**Problema:** TypeScript error

**Solução:**
```bash
# Testar build localmente primeiro
cd frontend
npm run build

# Se funcionar local, forçar redeploy:
vercel --prod --force
```

---

## 📝 Anotar Informações

Após o deploy, anote:

```
BACKEND (Railway):
URL: https://_____________________.up.railway.app
Dashboard: railway open
Logs: railway logs

FRONTEND (Vercel):
URL: https://_____________________.vercel.app  
Dashboard: vercel dashboard
Logs: vercel logs

DATABASE:
PostgreSQL: (via Railway, automático)
Redis: (via Railway, automático)

CUSTOS:
Railway: $5/mês
Vercel: $0/mês (Free tier)
Total: ~$5/mês
```

---

## 🎉 Sucesso!

Se tudo funcionou:
- ✅ Backend rodando no Railway
- ✅ Frontend rodando no Vercel
- ✅ PostgreSQL provisionado
- ✅ Redis provisionado
- ✅ HTTPS automático
- ✅ Sistema online!

**Próximos passos:**
1. Testar sistema completo (criar pedido, etc)
2. Configurar Google Analytics (opcional)
3. Configurar Sentry (opcional)
4. Executar UAT com beta testers
5. Compartilhar URL com clientes!

---

**🔥 FLAME Lounge Bar v2.0.0 está ONLINE!**

**Última atualização:** $(date +"%d/%m/%Y %H:%M")
