#!/bin/bash

###############################################################################
# FLAME Lounge - Production Deployment Script
# Version: 2.0.0
# Author: FLAME DevOps Team
# Date: 2026-01-17
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Emojis
CHECK="✅"
CROSS="❌"
ROCKET="🚀"
WARN="⚠️"
INFO="ℹ️"

###############################################################################
# Functions
###############################################################################

print_header() {
    echo -e "${BLUE}"
    echo "═══════════════════════════════════════════════════════════════"
    echo "  FLAME LOUNGE - PRODUCTION DEPLOYMENT"
    echo "  Version 2.0.0"
    echo "═══════════════════════════════════════════════════════════════"
    echo -e "${NC}"
}

print_step() {
    echo -e "${BLUE}${ROCKET} $1${NC}"
}

print_success() {
    echo -e "${GREEN}${CHECK} $1${NC}"
}

print_error() {
    echo -e "${RED}${CROSS} $1${NC}"
}

print_warn() {
    echo -e "${YELLOW}${WARN} $1${NC}"
}

print_info() {
    echo -e "${BLUE}${INFO} $1${NC}"
}

confirm() {
    read -p "$1 (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Abortado pelo usuário"
        exit 1
    fi
}

check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 não está instalado"
        exit 1
    fi
}

###############################################################################
# Pre-flight Checks
###############################################################################

preflight_checks() {
    print_step "Executando verificações pré-deploy..."

    # Check required commands
    check_command "git"
    check_command "node"
    check_command "npm"

    # Check Node version
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js 18+ é necessário (atual: $NODE_VERSION)"
        exit 1
    fi
    print_success "Node.js version OK ($NODE_VERSION)"

    # Check if on main branch
    CURRENT_BRANCH=$(git branch --show-current)
    if [ "$CURRENT_BRANCH" != "main" ]; then
        print_warn "Você não está na branch main (atual: $CURRENT_BRANCH)"
        confirm "Continuar mesmo assim?"
    fi

    # Check for uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        print_warn "Existem alterações não commitadas"
        git status --short
        confirm "Continuar com deploy?"
    fi

    # Check if vercel CLI is installed (optional)
    if command -v vercel &> /dev/null; then
        print_success "Vercel CLI detectado"
        HAS_VERCEL_CLI=true
    else
        print_warn "Vercel CLI não instalado (deploy manual será necessário)"
        HAS_VERCEL_CLI=false
    fi

    # Check if railway CLI is installed (optional)
    if command -v railway &> /dev/null; then
        print_success "Railway CLI detectado"
        HAS_RAILWAY_CLI=true
    else
        print_warn "Railway CLI não instalado (deploy manual será necessário)"
        HAS_RAILWAY_CLI=false
    fi

    print_success "Verificações pré-deploy concluídas"
}

###############################################################################
# Run Tests
###############################################################################

run_tests() {
    print_step "Executando testes..."

    # Frontend tests
    print_info "Testando frontend..."
    cd frontend
    if npm test -- --passWithNoTests --silent; then
        print_success "Testes frontend passaram"
    else
        print_error "Testes frontend falharam"
        confirm "Continuar com deploy mesmo assim?"
    fi
    cd ..

    # Backend tests (se existir script de test)
    if [ -f "backend/package.json" ] && grep -q "\"test\"" backend/package.json; then
        print_info "Testando backend..."
        cd backend
        if npm test 2>/dev/null; then
            print_success "Testes backend passaram"
        else
            print_warn "Testes backend falharam ou não configurados"
        fi
        cd ..
    fi
}

###############################################################################
# Build Projects
###############################################################################

build_frontend() {
    print_step "Building frontend..."

    cd frontend

    # Install dependencies
    print_info "Instalando dependências do frontend..."
    npm ci --production=false

    # Run build
    print_info "Compilando frontend..."
    if npm run build; then
        print_success "Frontend build concluído"
    else
        print_error "Frontend build falhou"
        exit 1
    fi

    cd ..
}

build_backend() {
    print_step "Preparando backend..."

    cd backend

    # Install dependencies
    print_info "Instalando dependências do backend..."
    npm ci --production=false

    # Run linter (se existir)
    if grep -q "\"lint\"" package.json; then
        print_info "Executando linter..."
        npm run lint || print_warn "Linter encontrou problemas"
    fi

    print_success "Backend preparado"
    cd ..
}

###############################################################################
# Deploy Functions
###############################################################################

deploy_frontend() {
    print_step "Deploying frontend para Vercel..."

    cd frontend

    if [ "$HAS_VERCEL_CLI" = true ]; then
        print_info "Usando Vercel CLI..."

        # Check if logged in
        if ! vercel whoami &> /dev/null; then
            print_warn "Não está logado no Vercel"
            print_info "Execute: vercel login"
            cd ..
            return
        fi

        # Deploy
        print_info "Fazendo deploy..."
        if vercel --prod --yes; then
            print_success "Frontend deployed com sucesso!"
        else
            print_error "Deploy do frontend falhou"
            exit 1
        fi
    else
        print_warn "Vercel CLI não disponível"
        print_info "Deploy manual necessário:"
        print_info "1. Acesse https://vercel.com/dashboard"
        print_info "2. Selecione o projeto FLAME"
        print_info "3. Clique em 'Deploy'"
        print_info "   OU"
        print_info "   Push para GitHub irá triggar deploy automático"
    fi

    cd ..
}

deploy_backend() {
    print_step "Deploying backend para Railway..."

    cd backend

    if [ "$HAS_RAILWAY_CLI" = true ]; then
        print_info "Usando Railway CLI..."

        # Check if logged in
        if ! railway whoami &> /dev/null; then
            print_warn "Não está logado no Railway"
            print_info "Execute: railway login"
            cd ..
            return
        fi

        # Deploy
        print_info "Fazendo deploy..."
        if railway up; then
            print_success "Backend deployed com sucesso!"

            # Run migrations (optional)
            print_info "Executando migrações..."
            if railway run npm run migrate; then
                print_success "Migrações executadas"
            else
                print_warn "Migrações falharam ou não configuradas"
            fi
        else
            print_error "Deploy do backend falhou"
            exit 1
        fi
    else
        print_warn "Railway CLI não disponível"
        print_info "Deploy manual necessário:"
        print_info "1. Acesse https://railway.app/dashboard"
        print_info "2. Selecione o projeto FLAME"
        print_info "3. Clique em 'Deploy'"
        print_info "   OU"
        print_info "   Push para GitHub irá triggar deploy automático"
    fi

    cd ..
}

###############################################################################
# Post-Deploy Verification
###############################################################################

verify_deployment() {
    print_step "Verificando deployment..."

    # Ask for URLs
    read -p "Frontend URL (ex: https://flame.com.br): " FRONTEND_URL
    read -p "Backend URL (ex: https://api.flame.com.br): " BACKEND_URL

    if [ -z "$FRONTEND_URL" ] || [ -z "$BACKEND_URL" ]; then
        print_warn "URLs não fornecidas, pulando verificação"
        return
    fi

    # Test Frontend
    print_info "Testando frontend..."
    if curl -f -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" | grep -q "200"; then
        print_success "Frontend está respondendo"
    else
        print_error "Frontend não está acessível"
    fi

    # Test Backend Health
    print_info "Testando backend health check..."
    HEALTH_RESPONSE=$(curl -s "$BACKEND_URL/health")
    if echo "$HEALTH_RESPONSE" | grep -q "ok"; then
        print_success "Backend health check passou"
        echo "$HEALTH_RESPONSE" | grep -o '"status":"[^"]*"'
    else
        print_error "Backend health check falhou"
        echo "$HEALTH_RESPONSE"
    fi

    # Test API endpoint
    print_info "Testando endpoint público da API..."
    if curl -f -s -o /dev/null "$BACKEND_URL/api/products"; then
        print_success "API está respondendo"
    else
        print_warn "API pode não estar acessível (ou requer autenticação)"
    fi
}

###############################################################################
# Git Tag
###############################################################################

create_git_tag() {
    print_step "Criando tag de release..."

    read -p "Version tag (ex: v2.0.0): " VERSION_TAG

    if [ -z "$VERSION_TAG" ]; then
        print_warn "Tag não fornecida, pulando"
        return
    fi

    # Check if tag exists
    if git rev-parse "$VERSION_TAG" >/dev/null 2>&1; then
        print_error "Tag $VERSION_TAG já existe"
        return
    fi

    # Create tag
    git tag -a "$VERSION_TAG" -m "Production release $VERSION_TAG"

    print_success "Tag criada: $VERSION_TAG"

    confirm "Push tag para o repositório?"
    git push origin "$VERSION_TAG"
    print_success "Tag pushed para origin"
}

###############################################################################
# Rollback
###############################################################################

rollback() {
    print_step "ROLLBACK MODE"

    print_warn "Rollback irá reverter para o último deployment estável"
    confirm "Tem certeza que deseja fazer rollback?"

    # Vercel rollback
    if [ "$HAS_VERCEL_CLI" = true ]; then
        print_info "Listando deployments do Vercel..."
        cd frontend
        vercel ls
        read -p "URL do deployment para promover: " DEPLOY_URL
        if [ -n "$DEPLOY_URL" ]; then
            vercel promote "$DEPLOY_URL"
            print_success "Frontend rollback concluído"
        fi
        cd ..
    else
        print_info "Faça rollback manual no dashboard do Vercel"
    fi

    # Railway rollback
    print_info "Para rollback do backend, acesse:"
    print_info "https://railway.app/dashboard → Deployments → Selecione deployment anterior"
}

###############################################################################
# Main
###############################################################################

main() {
    print_header

    # Parse arguments
    case "${1:-deploy}" in
        deploy)
            confirm "Iniciar deploy para PRODUÇÃO?"

            preflight_checks
            run_tests
            build_frontend
            build_backend
            deploy_frontend
            deploy_backend
            verify_deployment
            create_git_tag

            print_success "✨ Deploy concluído com sucesso!"
            print_info "Verifique os logs nos dashboards da Vercel e Railway"
            ;;

        rollback)
            rollback
            ;;

        verify)
            verify_deployment
            ;;

        test)
            run_tests
            ;;

        build)
            build_frontend
            build_backend
            ;;

        *)
            echo "Uso: ./deploy.sh [deploy|rollback|verify|test|build]"
            echo ""
            echo "Comandos:"
            echo "  deploy   - Deploy completo para produção (padrão)"
            echo "  rollback - Reverter para deployment anterior"
            echo "  verify   - Verificar deployment atual"
            echo "  test     - Executar apenas testes"
            echo "  build    - Executar apenas builds"
            exit 1
            ;;
    esac
}

# Run main
main "$@"
