# C4 Model - Context Diagram

## FLAME Lounge Bar - System Context

```
                                    ╔════════════════════════════════════╗
                                    ║                                    ║
                                    ║         FLAME LOUNGE BAR           ║
                                    ║      (Sistema Completo)            ║
                                    ║                                    ║
                                    ║  • Pedidos Online                  ║
                                    ║  • Gestão de Cardápio              ║
                                    ║  • Sistema de Cashback             ║
                                    ║  • Split Payment                   ║
                                    ║  • Gestão de Mesas                 ║
                                    ║  • Programa de Fidelidade          ║
                                    ║                                    ║
                                    ╚════════════════════════════════════╝
                                              ▲         ▲
                                              │         │
                    ┌─────────────────────────┼─────────┼─────────────────────────┐
                    │                         │         │                         │
                    │                         │         │                         │
          ┌─────────▼─────────┐     ┌────────▼────────┐│      ┌─────────────────▼─────────┐
          │                   │     │                 │ │      │                           │
          │    CLIENTES       │     │     STAFF       │ │      │    ADMINISTRADORES        │
          │                   │     │                 │ │      │                           │
          │ • Faz pedidos     │     │ • Atende mesas  │ │      │ • Gestão completa         │
          │ • Acumula cashback│     │ • Registra      │ │      │ • Relatórios              │
          │ • Avalia produtos │     │   pagamentos    │ │      │ • Configurações           │
          │ • Reserva mesas   │     │ • Prepara       │ │      │ • Usuários                │
          │                   │     │   pedidos       │ │      │ • Produtos                │
          │                   │     │                 │ │      │                           │
          └───────────────────┘     └─────────────────┘ │      └───────────────────────────┘
                    │                         │          │                    │
                    │                         │          │                    │
                    └─────────────────────────┼──────────┘                    │
                                              │                               │
                                    ┌─────────▼───────────┐         ┌─────────▼─────────┐
                                    │                     │         │                   │
                                    │  SISTEMAS EXTERNOS  │         │   SERVIÇOS        │
                                    │                     │         │   EXTERNOS        │
                                    │ • Gateway Pagamento │         │                   │
                                    │   (Stripe/Mercado   │         │ • Google OAuth    │
                                    │    Pago)            │         │ • Email Service   │
                                    │ • WhatsApp Business │         │   (SendGrid)      │
                                    │ • Google Analytics  │         │ • SMS Service     │
                                    │ • Sentry (Errors)   │         │   (Twilio)        │
                                    │                     │         │ • Redis (Cache)   │
                                    │                     │         │                   │
                                    └─────────────────────┘         └───────────────────┘
```

## Descrição dos Atores

### 1. Clientes (Customers)
**Tipo**: Pessoa
**Descrição**: Usuários finais que utilizam o sistema para fazer pedidos, acumular cashback e avaliar produtos.

**Principais Funcionalidades**:
- Navegar no cardápio digital
- Fazer pedidos online ou presenciais
- Acumular e resgatar cashback
- Avaliar produtos e serviços
- Reservar mesas
- Visualizar histórico de pedidos
- Dividir conta (Split Payment)

**Canais de Acesso**:
- Web App (PWA)
- Mobile Browser
- QR Code nas mesas

---

### 2. Staff (Funcionários)
**Tipo**: Pessoa
**Descrição**: Funcionários do estabelecimento (atendentes, cozinheiros, bartenders) que gerenciam o dia a dia operacional.

**Principais Funcionalidades**:
- **Atendentes**:
  - Registrar pedidos presenciais
  - Confirmar pagamentos
  - Gerenciar mesas
  - Atender solicitações de clientes

- **Cozinha/Bar**:
  - Visualizar pedidos em tempo real
  - Atualizar status de preparação
  - Gerenciar fila de produção
  - Notificar conclusão

- **Caixa**:
  - Abrir/fechar caixa
  - Registrar movimentações
  - Gerar relatórios de vendas
  - Controlar sangrias/reforços

**Canais de Acesso**:
- Web App (Desktop/Tablet)
- Painel específico por função

---

### 3. Administradores (Admins)
**Tipo**: Pessoa
**Descrição**: Gestores e proprietários com acesso completo ao sistema para configuração e análise.

**Principais Funcionalidades**:
- Gestão completa de produtos e cardápio
- Configuração de promoções e cashback
- Gerenciamento de usuários e permissões
- Análise de relatórios e dashboards
- Configurações do sistema
- Gestão de estoque e insumos
- Campanhas de marketing (CRM)
- Auditoria e logs

**Canais de Acesso**:
- Web App Admin Panel
- Dashboard Analytics

---

## Sistemas Externos

### 1. Gateway de Pagamento
**Tipo**: Sistema
**Descrição**: Processamento de pagamentos online (PIX, Cartão de Crédito/Débito)

**Integrações**:
- Stripe API (Principal)
- Mercado Pago API (Alternativa)

**Funcionalidades**:
- Payment Intents
- Webhooks de confirmação
- Tokenização de cartões
- Estornos

---

### 2. WhatsApp Business API
**Tipo**: Sistema
**Descrição**: Notificações e comunicação com clientes via WhatsApp

**Funcionalidades**:
- Confirmação de pedidos
- Atualizações de status
- Promoções e campanhas
- Suporte ao cliente

---

### 3. Google Analytics 4
**Tipo**: Sistema
**Descrição**: Análise de comportamento e métricas de uso

**Métricas Coletadas**:
- Pageviews e eventos
- Conversões de pedidos
- Funil de checkout
- Engagement do usuário
- Device analytics

---

### 4. Sentry
**Tipo**: Sistema
**Descrição**: Monitoramento de erros e performance

**Funcionalidades**:
- Error tracking
- Performance monitoring
- Source maps
- Alertas automáticos

---

### 5. Google OAuth
**Tipo**: Serviço
**Descrição**: Autenticação social via Google

**Funcionalidades**:
- Login social
- Sincronização de perfil
- Permissões granulares

---

### 6. Email Service (SendGrid)
**Tipo**: Serviço
**Descrição**: Envio de emails transacionais e marketing

**Funcionalidades**:
- Confirmação de cadastro
- Recuperação de senha
- Notificações de pedidos
- Newsletters

---

### 7. SMS Service (Twilio)
**Tipo**: Serviço
**Descrição**: Envio de SMS para verificação

**Funcionalidades**:
- Verificação de celular
- Código 2FA
- Notificações urgentes

---

### 8. Redis (Cache)
**Tipo**: Serviço
**Descrição**: Cache distribuído e sessões

**Funcionalidades**:
- Session storage
- API response caching
- Rate limiting
- Real-time data

---

## Fluxos Principais

### Fluxo 1: Pedido Online (Cliente)
```
Cliente → FLAME System → Gateway Pagamento → FLAME System → WhatsApp → Cliente
```

### Fluxo 2: Pedido Presencial (Atendente)
```
Cliente (Mesa) → Atendente → FLAME System → Cozinha/Bar → Atendente → Cliente
```

### Fluxo 3: Gestão de Produtos (Admin)
```
Admin → FLAME System → Redis Cache → Cliente (visualiza cardápio atualizado)
```

### Fluxo 4: Análise de Dados
```
FLAME System → Google Analytics → Admin Dashboard
FLAME System → Sentry → Admin Alertas
```

---

## Tecnologias Core

**Frontend**:
- Next.js 14 (React 18)
- Zustand (State Management)
- Tailwind CSS
- Framer Motion
- PWA (Service Worker)

**Backend**:
- Node.js + Express
- PostgreSQL (Sequelize ORM)
- Redis
- Socket.io (Real-time)
- JWT Authentication

**Infrastructure**:
- Railway (Hosting)
- Vercel (Frontend CDN)
- Cloudflare (DNS + WAF)
- GitHub Actions (CI/CD)

---

## Requisitos Não-Funcionais

**Performance**:
- First Load < 2s
- Time to Interactive < 3s
- Lighthouse Score > 90

**Segurança**:
- HTTPS obrigatório
- CSRF Protection
- XSS Sanitization
- Rate Limiting (100 req/15min)
- JWT + bcrypt

**Disponibilidade**:
- Uptime > 99.5%
- Backup diário
- Disaster recovery plan

**Escalabilidade**:
- Horizontal scaling ready
- CDN para assets estáticos
- Database connection pooling
- Redis caching strategy

---

**Criado por**: MANUS v7.1
**Data**: 2026-01-17
**Versão**: 1.0
**Status**: ✅ Completo
