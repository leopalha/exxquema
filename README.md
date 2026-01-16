# 🔥 FLAME Lounge Bar & Restaurant

**Sistema Completo de Gestão para Bar e Restaurante de Alta Gastronomia**

[![Next.js](https://img.shields.io/badge/Next.js-14.0.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-lightgrey)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)](https://www.postgresql.org/)

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Stack Tecnológico](#-stack-tecnológico)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Como Rodar](#-como-rodar)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Documentação](#-documentação)
- [Deploy](#-deploy)
- [Testes](#-testes)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

O **FLAME Lounge Bar & Restaurant** é uma aplicação full-stack completa para gestão de estabelecimentos de alta gastronomia, combinando:

- 🍽️ **Restaurante & Bar** - Cardápio digital, pedidos online e presencial
- 💨 **Lounge de Narguilé** - Gestão de sessões, sabores e cobrança por tempo
- 💳 **Sistema de Pagamentos** - Integração com Stripe, PIX e cartões
- 🎁 **Cashback e Fidelidade** - Programa de pontos e recompensas
- 📊 **Dashboard Administrativo** - Análise de vendas, estoque e relatórios
- 📱 **PWA** - Aplicativo instalável para mobile e desktop

### Localização

**Botafogo, Rio de Janeiro - RJ**

---

## ✨ Funcionalidades

### Para Clientes

- ✅ Cardápio digital interativo com fotos e descrições
- ✅ Pedidos via QR Code da mesa ou delivery
- ✅ Acompanhamento de pedido em tempo real
- ✅ Reservas online com escolha de mesa
- ✅ Sistema de cashback (ganhe 10% de volta)
- ✅ Programa de fidelidade com bônus
- ✅ Histórico de pedidos e favoritos
- ✅ Pagamento online (cartão, PIX)
- ✅ Notificações push

### Para Garçons

- ✅ PDV mobile para anotar pedidos
- ✅ Gestão de mesas e comandas
- ✅ Notificação de novos pedidos
- ✅ Controle de divisão de conta
- ✅ Integração com cozinha em tempo real

### Para Cozinha

- ✅ Painel de pedidos com priorização
- ✅ Atualização de status (preparando, pronto)
- ✅ Notificações sonoras de novos pedidos
- ✅ Tempo médio de preparo por prato

### Para Administradores

- ✅ Dashboard executivo com métricas
- ✅ Gestão de cardápio (produtos, categorias, preços)
- ✅ Controle de estoque e ingredientes
- ✅ Gestão de mesas e reservas
- ✅ Relatórios financeiros (vendas, despesas)
- ✅ Gestão de usuários e permissões
- ✅ Campanhas de cashback personalizadas
- ✅ Controle de caixa e fechamento

---

## 🛠️ Stack Tecnológico

### Frontend

- **Framework:** Next.js 14.0.4 (React 18.2.0)
- **Linguagem:** JavaScript/JSX (TypeScript configurado)
- **Estilização:** Tailwind CSS 3.3.6
- **State Management:** Zustand 4.4.7
- **Data Fetching:** React Query 3.39.3 + Axios 1.6.2
- **Forms:** React Hook Form 7.48.2
- **Real-time:** Socket.io-client 4.7.4
- **PWA:** next-pwa 5.6.0
- **Icons:** Heroicons 2.0.18 + Lucide React
- **Animações:** Framer Motion 10.16.16
- **E2E Testing:** Cypress 15.7.1

### Backend

- **Runtime:** Node.js 18+
- **Framework:** Express 4.18.2
- **Database:** PostgreSQL (produção) / SQLite (dev)
- **ORM:** Sequelize 6.35.2
- **Autenticação:** JWT (jsonwebtoken 9.0.2)
- **Password Hash:** bcryptjs 2.4.3
- **Real-time:** Socket.io 4.7.5
- **Validação:** express-validator 7.0.1
- **Security:** Helmet 7.1.0 + CORS
- **Rate Limiting:** express-rate-limit 7.1.5
- **Pagamentos:** Stripe 14.12.0
- **Notificações:** SendGrid 8.1.0 + Twilio 4.20.0 + web-push
- **Scheduled Jobs:** node-cron 3.0.3
- **Testing:** Jest 29.7.0 + Supertest 6.3.4

### Infraestrutura

- **Deploy Frontend:** Vercel
- **Deploy Backend:** Railway
- **Database:** PostgreSQL (Railway)
- **CI/CD:** GitHub Actions (planejado)
- **Monitoring:** (a configurar)

---

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18.0.0 ou superior
- **npm** 8.0.0 ou superior (ou **yarn** 1.22+)
- **PostgreSQL** 15+ (para produção) ou SQLite (para desenvolvimento)
- **Git** 2.0+

### Verificar versões

```bash
node --version    # deve ser >= 18.0.0
npm --version     # deve ser >= 8.0.0
git --version     # qualquer versão recente
```

---

## 📦 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/flame-lounge.git
cd flame-lounge
```

### 2. Instale todas as dependências

```bash
# Instalar dependências de root, frontend e backend
npm run install:all

# OU manualmente:
npm install                    # Root (concurrently)
cd frontend && npm install    # Frontend
cd ../backend && npm install  # Backend
```

---

## 🔧 Configuração

### 1. Variáveis de Ambiente

Copie os arquivos `.env.example` e preencha com suas credenciais:

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local
```

### 2. Configure o Backend (.env)

```env
# Servidor
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=flame_db
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
DB_DIALECT=postgres  # ou 'sqlite' para dev local

# JWT
JWT_SECRET=sua_chave_secreta_super_segura_aqui
JWT_EXPIRES_IN=7d

# Stripe (Pagamentos)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SendGrid (Email)
SENDGRID_API_KEY=SG....
SENDGRID_FROM_EMAIL=noreply@flamelounge.com

# Twilio (SMS)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+55...

# Web Push (Notificações)
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:contato@flamelounge.com

# Google OAuth (Opcional)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Uploads
MAX_FILE_SIZE=5242880  # 5MB
```

### 3. Configure o Frontend (.env.local)

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# Stripe (Frontend)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Google Maps (Opcional)
NEXT_PUBLIC_GOOGLE_MAPS_KEY=...

# Análise (Opcional)
NEXT_PUBLIC_GA_ID=G-...
```

### 4. Configurar Database

**Opção A: PostgreSQL (Produção/Staging)**

```bash
# 1. Crie o banco
createdb flame_db

# 2. Rode as migrations
cd backend
npm run migrate
```

**Opção B: SQLite (Desenvolvimento Local)**

```bash
# Apenas defina no .env:
DB_DIALECT=sqlite
DB_STORAGE=./database.sqlite

# As migrations rodam automaticamente
cd backend
npm run migrate
```

### 5. Seed (Dados Iniciais)

```bash
cd backend
npm run seed  # Cria usuário admin, categorias, produtos exemplo
```

**Credenciais padrão:**
- **Email:** admin@flamelounge.com
- **Senha:** admin123 (MUDAR EM PRODUÇÃO!)

---

## 🚀 Como Rodar

### Desenvolvimento (Frontend + Backend simultâneo)

```bash
# Na raiz do projeto
npm run dev
```

Isso vai iniciar:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Separadamente

**Backend:**
```bash
cd backend
npm run dev  # Inicia com nodemon (hot reload)
```

**Frontend:**
```bash
cd frontend
npm run dev  # Inicia Next.js dev server
```

### Produção

**Backend:**
```bash
cd backend
npm start  # Node.js sem hot reload
```

**Frontend:**
```bash
cd frontend
npm run build  # Build otimizado
npm start      # Servidor de produção
```

---

## 📜 Scripts Disponíveis

### Root

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Roda frontend + backend simultaneamente |
| `npm run dev:frontend` | Roda apenas frontend |
| `npm run dev:backend` | Roda apenas backend |
| `npm run build` | Build do frontend |
| `npm run install:all` | Instala todas as dependências |

### Frontend

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Dev server (localhost:3000) |
| `npm run build` | Build para produção |
| `npm start` | Servidor de produção |
| `npm run lint` | ESLint check |
| `npm run analyze` | Análise de bundle size |
| `npm run cypress` | Abre Cypress E2E |
| `npm run e2e` | Roda testes E2E |

### Backend

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Dev server com nodemon |
| `npm start` | Servidor de produção |
| `npm run migrate` | Roda migrations |
| `npm run seed` | Popula banco com dados iniciais |
| `npm test` | Roda testes Jest |
| `npm run test:watch` | Testes em modo watch |

---

## 📁 Estrutura de Pastas

```
flame-lounge/
├── frontend/                   # Aplicação Next.js/React
│   ├── public/                # Assets estáticos
│   │   ├── images/           # Imagens do cardápio, logo, etc
│   │   ├── icons/            # PWA icons
│   │   └── manifest.json     # PWA manifest
│   ├── src/
│   │   ├── pages/            # Rotas Next.js (51 páginas)
│   │   │   ├── index.js      # Landing page
│   │   │   ├── cardapio/     # Cardápio digital
│   │   │   ├── pedidos/      # Pedidos do cliente
│   │   │   ├── reservas/     # Sistema de reservas
│   │   │   ├── admin/        # Dashboard admin
│   │   │   ├── staff/        # Área de garçons/cozinha
│   │   │   └── api/          # API routes (se houver)
│   │   ├── components/       # Componentes React (~45)
│   │   │   ├── Admin/        # Componentes admin
│   │   │   ├── Auth/         # Login, registro
│   │   │   ├── Cart/         # Carrinho de compras
│   │   │   ├── Checkout/     # Finalização
│   │   │   ├── Landing/      # Home page
│   │   │   ├── Menu/         # Cardápio
│   │   │   ├── Tracking/     # Rastreamento de pedido
│   │   │   └── ui/           # Componentes base (Button, Input, etc)
│   │   ├── stores/           # Zustand stores (17)
│   │   │   ├── authStore.js
│   │   │   ├── cartStore.js
│   │   │   ├── orderStore.js
│   │   │   └── ...
│   │   ├── hooks/            # Custom React hooks (6)
│   │   ├── services/         # API clients (axios)
│   │   ├── context/          # React Context
│   │   ├── styles/           # Tailwind CSS
│   │   ├── utils/            # Funções utilitárias
│   │   └── data/             # Mock data / constantes
│   ├── next.config.js        # Configuração Next.js
│   ├── tailwind.config.js    # Configuração Tailwind
│   ├── package.json
│   └── .env.local
│
├── backend/                    # Servidor Express
│   ├── src/
│   │   ├── models/           # Sequelize models (18)
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Order.js
│   │   │   ├── OrderItem.js
│   │   │   ├── Table.js
│   │   │   ├── Reservation.js
│   │   │   ├── HookahSession.js
│   │   │   └── ... (15 outros)
│   │   ├── controllers/      # Request handlers (~15)
│   │   ├── services/         # Business logic (16)
│   │   ├── routes/           # Rotas Express (~20)
│   │   ├── middlewares/      # Auth, validation, etc
│   │   ├── migrations/       # Database migrations (15)
│   │   ├── jobs/             # Cron jobs (7)
│   │   ├── database/         # DB config
│   │   ├── __tests__/        # Testes Jest (3)
│   │   ├── utils/            # Helpers
│   │   ├── scripts/          # Utilitários (seed, etc)
│   │   └── server.js         # Entry point
│   ├── package.json
│   └── .env
│
├── docs/                       # Documentação
│   ├── 01_CONCEITO_FLAME.md
│   ├── 02_DESIGN_SYSTEM.md
│   ├── 03_PRD.md              # Product Requirements (126KB)
│   ├── 04_USER_FLOWS.md       # Fluxos de usuário
│   ├── 05_TECHNICAL_ARCHITECTURE.md
│   ├── MANUS_TASKS.md         # Tasks gerenciadas pelo MANUS
│   └── ... (40+ arquivos)
│
├── .manus/                     # Sistema MANUS v7.1
│   ├── ACTIVATION_PROMPT.md
│   ├── README.md
│   ├── agents/
│   ├── scoring/
│   ├── templates/
│   └── patterns/
│
├── .claude/                    # Configurações Claude Code
├── .git/                       # Repositório Git
├── .gitignore
├── package.json                # Workspace root
└── README.md                   # Este arquivo
```

---

## 📚 Documentação

### Documentação Principal

- **[README.md](README.md)** - Este arquivo
- **[PRD (Product Requirements)](docs/03_PRD.md)** - Requisitos completos do produto
- **[Arquitetura Técnica](docs/05_TECHNICAL_ARCHITECTURE.md)** - Stack e decisões técnicas
- **[Design System](docs/02_DESIGN_SYSTEM.md)** - Guia de design e componentes
- **[User Flows](docs/04_USER_FLOWS.md)** - Fluxos de usuário detalhados

### Documentação MANUS (Sistema de Orquestração)

- **[MANUS README](.manus/README.md)** - Guia do sistema MANUS v7.1
- **[ACTIVATION_PROMPT](.manus/ACTIVATION_PROMPT.md)** - Como o MANUS funciona
- **[MANUS_TASKS](docs/MANUS_TASKS.md)** - Tasks gerenciadas

### Documentação Adicional (a criar)

- [ ] API Documentation (Swagger/OpenAPI)
- [ ] Database Schema Diagram
- [ ] Deployment Guide
- [ ] Contributing Guide
- [ ] Changelog

---

## 🚢 Deploy

### Frontend (Vercel)

1. Conecte seu repositório no [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente (NEXT_PUBLIC_*)
3. Deploy automático em cada push para `main`

**OU via CLI:**

```bash
cd frontend
npx vercel --prod
```

### Backend (Railway)

1. Conecte seu repositório no [Railway](https://railway.app)
2. Crie um PostgreSQL database
3. Configure as variáveis de ambiente
4. Deploy automático em cada push para `main`

**Variáveis importantes:**
- `DATABASE_URL` (automático do Railway)
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `SENDGRID_API_KEY`
- Todas as outras do `.env.example`

---

## 🧪 Testes

### Backend (Jest)

```bash
cd backend

# Rodar todos os testes
npm test

# Testes com coverage
npm test -- --coverage

# Modo watch
npm run test:watch

# Teste específico
npm test -- auth.test.js
```

**Cobertura Atual:** ~15% (objetivo: >70%)

### Frontend (Cypress E2E)

```bash
cd frontend

# Abrir Cypress UI
npm run cypress

# Rodar testes headless
npm run cypress:run

# Rodar com servidor dev
npm run e2e
```

**Status:** Cypress configurado, testes a implementar

### Teste Manual

1. Inicie o sistema: `npm run dev`
2. Acesse: http://localhost:3000
3. Teste fluxos críticos:
   - ✅ Escanear QR Code → Ver cardápio → Adicionar ao carrinho → Finalizar pedido
   - ✅ Fazer reserva online
   - ✅ Login admin → Adicionar produto
   - ✅ Login garçom → Criar pedido
   - ✅ Cozinha → Atualizar status de pedido

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, siga estas diretrizes:

### 1. Fork o projeto

```bash
git clone https://github.com/seu-usuario/flame-lounge.git
cd flame-lounge
git checkout -b feature/minha-feature
```

### 2. Faça suas alterações

- Siga o Agent Loop do MANUS (se disponível)
- Escreva testes para novas funcionalidades
- Mantenha o código consistente com o estilo existente
- Atualize a documentação se necessário

### 3. Commit com Conventional Commits

```bash
git commit -m "feat: adiciona filtro de busca no cardápio"
git commit -m "fix: corrige cálculo de cashback"
git commit -m "docs: atualiza README com novos scripts"
```

Tipos válidos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### 4. Push e Pull Request

```bash
git push origin feature/minha-feature
```

Abra um Pull Request detalhando:
- O que foi alterado
- Por que foi alterado
- Como testar

---

## 📄 Licença

Este projeto é propriedade privada de **FLAME Lounge Bar & Restaurant**.

**Uso não autorizado é proibido.**

Copyright © 2024-2026 FLAME Team. Todos os direitos reservados.

---

## 👥 Equipe

- **Proprietários:** FLAME Team
- **Desenvolvimento:** [Adicionar nomes]
- **Design:** [Adicionar nomes]
- **Suporte:** contato@flamelounge.com

---

## 🆘 Suporte

### Problemas Comuns

**Build falhando no frontend:**
```bash
rm -rf .next node_modules
npm install
npm run build
```

**Database não conecta:**
```bash
# Verifique se PostgreSQL está rodando
sudo service postgresql status

# Teste a conexão
psql -U postgres -h localhost -d flame_db
```

**Socket.io não conecta:**
- Verifique se o backend está rodando
- Confirme a URL no frontend (.env.local)
- Desabilite adblockers temporariamente

### Contato

- **Email:** suporte@flamelounge.com
- **Issues:** [GitHub Issues](https://github.com/seu-usuario/flame-lounge/issues)
- **Documentação:** [Wiki](https://github.com/seu-usuario/flame-lounge/wiki)

---

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [Socket.io](https://socket.io/)
- [Stripe](https://stripe.com/)

---

**🔥 Feito com paixão pela equipe FLAME**

**Última atualização:** 2026-01-16
