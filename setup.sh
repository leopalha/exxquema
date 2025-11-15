#!/bin/bash

# 🔴 Red Light - Setup Script
# Automatiza a configuração inicial do projeto

set -e  # Exit on any error

echo "
╔══════════════════════════════════════╗
║     🔴 RED LIGHT - SETUP SCRIPT     ║
║                                      ║
║  Automatizando a configuração...     ║
╚══════════════════════════════════════╝
"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js não encontrado. Instale Node.js 18+ primeiro."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2)
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)
    
    if [ "$MAJOR_VERSION" -lt 18 ]; then
        print_error "Node.js 18+ é necessário. Versão atual: v$NODE_VERSION"
        exit 1
    fi
    
    print_success "Node.js v$NODE_VERSION detectado"
}

# Check if PostgreSQL is installed
check_postgres() {
    if ! command -v psql &> /dev/null; then
        print_warning "PostgreSQL não encontrado. Instale PostgreSQL primeiro."
        print_status "Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
        print_status "macOS: brew install postgresql"
        exit 1
    fi
    
    print_success "PostgreSQL detectado"
}

# Install dependencies
install_dependencies() {
    print_status "Instalando dependências do backend..."
    cd backend
    npm install
    cd ..
    
    print_status "Instalando dependências do frontend..."
    cd frontend
    npm install
    cd ..
    
    print_success "Dependências instaladas!"
}

# Setup environment files
setup_env_files() {
    print_status "Configurando arquivos de ambiente..."
    
    # Backend .env
    if [ ! -f "backend/.env" ]; then
        cp backend/.env.example backend/.env
        print_warning "Configure as variáveis em backend/.env antes de continuar"
    fi
    
    # Frontend .env.local
    if [ ! -f "frontend/.env.local" ]; then
        cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_publica
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
EOF
        print_success "Arquivo frontend/.env.local criado"
    fi
}

# Setup database
setup_database() {
    print_status "Configurando banco de dados..."
    
    DB_NAME="red_light"
    
    # Check if database exists
    if psql -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
        print_warning "Banco '$DB_NAME' já existe"
    else
        createdb $DB_NAME
        print_success "Banco '$DB_NAME' criado"
    fi
}

# Generate JWT secret
generate_jwt_secret() {
    JWT_SECRET=$(openssl rand -hex 32)
    print_status "JWT Secret gerado: $JWT_SECRET"
    print_warning "Adicione este JWT_SECRET ao seu arquivo backend/.env"
}

# Create start scripts
create_scripts() {
    print_status "Criando scripts de inicialização..."
    
    # Start script
    cat > start.sh << 'EOF'
#!/bin/bash
echo "🔴 Iniciando Red Light..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""

# Start backend in background
cd backend && npm run dev &
BACKEND_PID=$!

# Start frontend in background  
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo "✅ Servidores iniciados!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Para parar os serviços:"
echo "kill $BACKEND_PID $FRONTEND_PID"

# Wait for user input
read -p "Pressione Enter para parar os serviços..."
kill $BACKEND_PID $FRONTEND_PID
EOF
    
    chmod +x start.sh
    
    # Stop script
    cat > stop.sh << 'EOF'
#!/bin/bash
echo "🛑 Parando serviços Red Light..."
pkill -f "npm run dev"
echo "✅ Serviços parados!"
EOF
    
    chmod +x stop.sh
    
    print_success "Scripts de inicialização criados (start.sh, stop.sh)"
}

# Create Docker files
create_docker_files() {
    print_status "Criando arquivos Docker..."
    
    # Docker Compose
    cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: red_light
      POSTGRES_USER: redlight
      POSTGRES_PASSWORD: redlight123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - postgres
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://redlight:redlight123@postgres:5432/red_light
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5000
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  postgres_data:
EOF

    # Backend Dockerfile
    cat > backend/Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
EOF

    # Frontend Dockerfile
    cat > frontend/Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
EOF

    print_success "Arquivos Docker criados"
}

# Main setup function
main() {
    print_status "Iniciando setup do Red Light..."
    
    check_node
    check_postgres
    install_dependencies
    setup_env_files
    setup_database
    generate_jwt_secret
    create_scripts
    create_docker_files
    
    echo "
╔══════════════════════════════════════╗
║            🎉 SETUP COMPLETO!        ║
║                                      ║
║  Próximos passos:                    ║
║  1. Configure backend/.env           ║
║  2. Execute: ./start.sh              ║
║  3. Acesse: http://localhost:3000    ║
║                                      ║
║  Docker: docker-compose up -d        ║
╚══════════════════════════════════════╝
    "
    
    print_success "Setup do Red Light concluído!"
}

# Run main function
main