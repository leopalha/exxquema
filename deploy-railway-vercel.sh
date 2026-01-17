#!/bin/bash
# FLAME Lounge Bar - Deploy Automatizado Railway + Vercel

set -e

echo "🔥 FLAME Lounge Bar - Deploy Automatizado"
echo "=========================================="
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Verificar se Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}📦 Railway CLI não encontrado. Instalando...${NC}"
    npm install -g @railway/cli
fi

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Vercel CLI não encontrado. Instalando...${NC}"
    npm install -g vercel
fi

echo -e "${GREEN}✅ CLIs instaladas!${NC}"
echo ""

# ==========================================
# PARTE 1: RAILWAY (BACKEND + DATABASE)
# ==========================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚂 RAILWAY - Backend Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo -e "${BLUE}1. Faça login no Railway:${NC}"
railway login

echo ""
echo -e "${BLUE}2. Criando novo projeto...${NC}"
railway init

echo ""
echo -e "${BLUE}3. Adicionando PostgreSQL...${NC}"
railway add --plugin postgresql

echo ""
echo -e "${BLUE}4. Adicionando Redis...${NC}"
railway add --plugin redis

echo ""
echo -e "${GREEN}✅ Serviços criados no Railway!${NC}"
echo ""

# Obter variáveis de ambiente do Railway
echo -e "${BLUE}5. Configurando variáveis de ambiente...${NC}"

# Gerar JWT_SECRET forte
JWT_SECRET=$(openssl rand -base64 32)

# Configurar variáveis
railway variables set NODE_ENV=production
railway variables set PORT=7000
railway variables set JWT_SECRET="$JWT_SECRET"
railway variables set JWT_EXPIRES_IN=7d

echo ""
echo -e "${GREEN}✅ Variáveis configuradas!${NC}"
echo ""

# Fazer deploy do backend
echo -e "${BLUE}6. Fazendo deploy do backend...${NC}"
cd backend
railway up
cd ..

echo ""
echo -e "${GREEN}✅ Backend deployed!${NC}"
echo ""

# Obter URL do backend
BACKEND_URL=$(railway domain)
echo -e "${GREEN}Backend URL: $BACKEND_URL${NC}"

# ==========================================
# PARTE 2: VERCEL (FRONTEND)
# ==========================================

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "▲ VERCEL - Frontend Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo -e "${BLUE}1. Fazendo login no Vercel...${NC}"
vercel login

echo ""
echo -e "${BLUE}2. Configurando projeto...${NC}"
cd frontend

# Criar arquivo de variáveis para Vercel
cat > .env.production << ENVEOF
NEXT_PUBLIC_API_URL=$BACKEND_URL
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_SENTRY_DSN=
ENVEOF

echo -e "${YELLOW}⚠️  Configure NEXT_PUBLIC_GA_ID se tiver Google Analytics${NC}"
echo ""

echo -e "${BLUE}3. Fazendo deploy...${NC}"
vercel --prod

cd ..

echo ""
echo -e "${GREEN}✅ Frontend deployed!${NC}"
echo ""

# ==========================================
# RESUMO FINAL
# ==========================================

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 DEPLOY COMPLETO!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}Backend (Railway):${NC}"
echo "  URL: $BACKEND_URL"
echo "  Database: PostgreSQL (provisionado)"
echo "  Cache: Redis (provisionado)"
echo ""
echo -e "${GREEN}Frontend (Vercel):${NC}"
echo "  Execute: cd frontend && vercel ls"
echo "  Para ver URL"
echo ""
echo -e "${YELLOW}📝 Próximos Passos:${NC}"
echo ""
echo "1. Configure Google Analytics (opcional):"
echo "   vercel env add NEXT_PUBLIC_GA_ID"
echo ""
echo "2. Configure Sentry (opcional):"
echo "   railway variables set SENTRY_DSN=your-dsn"
echo "   vercel env add NEXT_PUBLIC_SENTRY_DSN"
echo ""
echo "3. Configure Twilio para SMS (opcional):"
echo "   railway variables set TWILIO_ACCOUNT_SID=xxx"
echo "   railway variables set TWILIO_AUTH_TOKEN=xxx"
echo "   railway variables set TWILIO_PHONE_NUMBER=+5511999999999"
echo ""
echo "4. Teste o sistema:"
echo "   curl $BACKEND_URL/health"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}🔥 FLAME Lounge Bar está ONLINE!${NC}"
echo ""

