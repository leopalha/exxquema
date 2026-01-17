# ⚡ Comandos Rápidos - FLAME Lounge Bar

## 🚀 Deploy (Escolha uma opção)

### Opção 1: Script Automatizado (Mais Fácil)
```bash
./deploy-railway-vercel.sh
```

### Opção 2: Manual Railway + Vercel
```bash
# Backend (Railway)
railway login
railway init
railway add --plugin postgresql
railway add --plugin redis
cd backend && railway up

# Frontend (Vercel)
vercel login
cd frontend && vercel --prod
```

---

## 🔧 Desenvolvimento Local

### Iniciar Backend
```bash
cd backend
npm run dev
# Roda em: http://localhost:7000
```

### Iniciar Frontend
```bash
cd frontend
npm run dev
# Roda em: http://localhost:3000
```

### Rodar Testes
```bash
cd backend
npm test
# 124 testes unitários
```

### Testes E2E
```bash
cd frontend
npm run test:e2e
# 8 testes Playwright
```

---

## 📦 Build

### Build Backend
```bash
cd backend
npm ci --production
npm start
```

### Build Frontend
```bash
cd frontend
npm run build
npm start
```

---

## 🔍 Monitoramento

### Ver Logs Railway
```bash
railway logs
```

### Ver Logs Vercel
```bash
vercel logs
```

### Abrir Dashboards
```bash
railway open      # Railway dashboard
vercel dashboard  # Vercel dashboard
```

---

## 🛠️ Manutenção

### Atualizar Deploy

**Backend:**
```bash
cd backend
railway up
```

**Frontend:**
```bash
cd frontend
vercel --prod
```

### Variáveis de Ambiente

**Backend (Railway):**
```bash
railway variables set KEY=VALUE
railway variables           # Listar todas
```

**Frontend (Vercel):**
```bash
vercel env add KEY production
vercel env ls               # Listar todas
```

### Rollback

**Railway:**
```bash
railway status
railway rollback <deployment-id>
```

**Vercel:**
```bash
vercel rollback <url>
```

---

## 🔐 Segurança

### Gerar JWT Secret Forte
```bash
openssl rand -base64 32
```

### Verificar Variáveis Sensíveis
```bash
# Não deve estar no Git:
git ls-files | grep -E '\.env$|\.env\.'
```

---

## 🧪 Testing

### Test Individual
```bash
cd backend
npm test -- auth.validator.test
```

### Coverage Report
```bash
cd backend
npm test -- --coverage
```

### E2E Específico
```bash
cd frontend
npm run test:e2e -- homepage.spec.ts
```

---

## 📊 Status

### Health Check
```bash
# Local
curl http://localhost:7000/health

# Produção
curl https://seu-backend.railway.app/health
```

### Ver Todos os Endpoints
```bash
cd backend
grep -r "router\." src/routes/ | grep -E '\.(get|post|put|delete)'
```

---

## 🔄 Git

### Status Resumido
```bash
git status -sb
```

### Commits Recentes
```bash
git log --oneline -10
```

### Criar Tag
```bash
git tag -a v2.1.0 -m "Mensagem"
git push origin v2.1.0
```

---

## 💾 Database

### Acessar PostgreSQL (Railway)
```bash
railway connect postgres
```

### Executar SQL
```bash
railway run psql $DATABASE_URL -c "SELECT * FROM users LIMIT 5;"
```

### Backup
```bash
railway run pg_dump $DATABASE_URL > backup.sql
```

---

## 📈 Performance

### Ver Uso de Recursos (Railway)
```bash
railway status
```

### Limpar Cache Redis
```bash
railway run redis-cli FLUSHALL
```

### Ver Cache Stats
```bash
railway run redis-cli INFO stats
```

---

## 🔗 URLs Úteis

```bash
# Railway Dashboard
https://railway.app/dashboard

# Vercel Dashboard
https://vercel.com/dashboard

# GitHub Actions
https://github.com/seu-usuario/flame-lounge-bar/actions

# Sentry
https://sentry.io/

# Google Analytics
https://analytics.google.com/
```

---

## 🆘 Troubleshooting

### Ver Logs de Erro
```bash
railway logs --tail 100
vercel logs --follow
```

### Reiniciar Serviço
```bash
railway restart
```

### Ver Variáveis de Ambiente
```bash
railway variables
vercel env ls
```

### Forçar Novo Deploy
```bash
# Backend
cd backend && railway up --detach

# Frontend
cd frontend && vercel --prod --force
```

---

## 📱 Mobile

### Testar Responsividade
```bash
cd frontend
npm run dev

# No Chrome DevTools: Ctrl+Shift+M
# Ou acesse: http://localhost:3000?viewport=mobile
```

---

## 🎨 Frontend

### Limpar Cache Next.js
```bash
cd frontend
rm -rf .next node_modules
npm install
npm run build
```

### Ver Análise de Bundle
```bash
cd frontend
npm run build
# Vercel automaticamente mostra bundle size
```

---

**Última atualização:** Janeiro 2026
**Versão:** 2.0.0
