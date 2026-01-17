#!/bin/bash
# FLAME Lounge Bar - Production Setup Script
# Execute este script para configurar o ambiente de produção

set -e

echo "🔥 FLAME Lounge Bar - Setup de Produção"
echo "========================================"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para verificar se comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar dependências
echo "📋 Verificando dependências..."
if ! command_exists node; then
    echo -e "${RED}❌ Node.js não encontrado. Instale Node.js 18+ primeiro.${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm não encontrado. Instale npm primeiro.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version)${NC}"
echo -e "${GREEN}✅ npm $(npm --version)${NC}"
echo ""

# Backend Setup
echo "🔧 Configurando Backend..."
cd backend

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Criando arquivo .env do backend...${NC}"
    cat > .env << 'ENVEOF'
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/flame_production

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Redis (opcional - para caching)
# REDIS_URL=redis://localhost:6379

# Sentry (opcional - para error tracking)
# SENTRY_DSN=https://xxx@sentry.io/xxx

# Twilio (opcional - para SMS)
# TWILIO_ACCOUNT_SID=
# TWILIO_AUTH_TOKEN=
# TWILIO_PHONE_NUMBER=

# Frontend URL
FRONTEND_URL=https://seu-dominio.com

# Environment
NODE_ENV=production
PORT=7000
ENVEOF
    echo -e "${YELLOW}⚠️  Configure as variáveis em backend/.env${NC}"
else
    echo -e "${GREEN}✅ .env já existe${NC}"
fi

echo "📦 Instalando dependências do backend..."
npm ci --production

echo "✅ Backend configurado!"
cd ..

# Frontend Setup
echo ""
echo "🎨 Configurando Frontend..."
cd frontend

if [ ! -f ".env.production" ]; then
    echo -e "${YELLOW}⚠️  Criando arquivo .env.production do frontend...${NC}"
    cat > .env.production << 'ENVEOF'
# API URL
NEXT_PUBLIC_API_URL=https://api.seu-dominio.com

# Google Analytics 4
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
ENVEOF
    echo -e "${YELLOW}⚠️  Configure as variáveis em frontend/.env.production${NC}"
else
    echo -e "${GREEN}✅ .env.production já existe${NC}"
fi

echo "📦 Instalando dependências do frontend..."
npm ci

echo "🏗️  Building frontend..."
npm run build

echo "✅ Frontend configurado!"
cd ..

# Testes
echo ""
echo "🧪 Executando testes..."
cd backend
npm test

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Todos os testes passaram!${NC}"
else
    echo -e "${RED}❌ Alguns testes falharam. Verifique antes de deployar.${NC}"
    exit 1
fi
cd ..

# Resumo
echo ""
echo "=========================================="
echo "🎉 Setup Completo!"
echo "=========================================="
echo ""
echo "📝 Próximos Passos:"
echo ""
echo "1. Configure as variáveis de ambiente:"
echo "   - backend/.env"
echo "   - frontend/.env.production"
echo ""
echo "2. Configure o banco de dados PostgreSQL"
echo ""
echo "3. (Opcional) Configure Redis para caching:"
echo "   REDIS_URL=redis://localhost:6379"
echo ""
echo "4. (Opcional) Configure Sentry para error tracking"
echo ""
echo "5. (Opcional) Configure Google Analytics:"
echo "   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX"
echo ""
echo "6. Para iniciar em produção:"
echo "   cd backend && npm start"
echo "   cd frontend && npm start"
echo ""
echo "🔥 FLAME Lounge Bar está pronto para produção!"
