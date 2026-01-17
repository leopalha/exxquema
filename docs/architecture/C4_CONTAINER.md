# C4 Model - Container Diagram

## FLAME Lounge Bar - Container View

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              FLAME LOUNGE BAR                                   │
│                            (Sistema Completo)                                   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                ┌─────────────────────┼─────────────────────┐
                │                     │                     │
                │                     │                     │
    ┌───────────▼───────────┐ ┌──────▼──────┐   ┌─────────▼─────────┐
    │                       │ │             │   │                   │
    │   WEB APPLICATION     │ │  API REST   │   │   DATABASE        │
    │   (Next.js 14 PWA)    │ │  (Express)  │   │   (PostgreSQL)    │
    │                       │ │             │   │                   │
    │ • React 18            │ │ • Node.js   │   │ • Sequelize ORM   │
    │ • SSR + ISR           │ │ • JWT Auth  │   │ • 50+ tables      │
    │ • Service Worker      │ │ • Socket.io │   │ • Transactions    │
    │ • Zustand Store       │ │ • CRUD APIs │   │ • Indexes         │
    │ • Tailwind CSS        │ │ • WebSocket │   │ • Constraints     │
    │ • Framer Motion       │ │ • Rate Lim. │   │                   │
    │                       │ │             │   │                   │
    │ Port: 3000            │ │ Port: 7000  │   │ Port: 5432        │
    └───────────────────────┘ └─────────────┘   └───────────────────┘
                │                     │                     │
                │                     │                     │
                │         ┌───────────┼───────────┐         │
                │         │           │           │         │
    ┌───────────▼─────────▼───┐   ┌──▼───────┐   └─────────▼─────────┐
    │                         │   │          │                       │
    │   REDIS CACHE           │   │  STATIC  │   │   FILE STORAGE    │
    │   (In-Memory Store)     │   │  CDN     │   │   (Railway Volume)│
    │                         │   │          │                       │
    │ • Session Storage       │   │ • Images │   │ • Product Images  │
    │ • API Caching           │   │ • JS/CSS │   │ • User Avatars    │
    │ • Rate Limit Counters   │   │ • Fonts  │   │ • Temp Files      │
    │ • Real-time Data        │   │          │                       │
    │                         │   │ Vercel   │   │ /uploads/*        │
    │ Port: 6379              │   │ Edge     │   │                   │
    └─────────────────────────┘   └──────────┘   └───────────────────┘
```

---

## Containers Detalhados

### 1. Web Application (Frontend)

**Tecnologia**: Next.js 14 (React 18)
**Tipo**: Single Page Application + SSR
**Porta**: 3000
**Hosting**: Vercel

**Responsabilidades**:
- Interface do usuário (UI/UX)
- Client-side rendering (CSR)
- Server-side rendering (SSR)
- Incremental Static Regeneration (ISR)
- Progressive Web App (PWA)
- State management (Zustand)
- Real-time updates (Socket.io client)

**Principais Módulos**:

```
frontend/
├── src/
│   ├── pages/                 # Next.js pages (SSR/ISR)
│   │   ├── index.js          # Home
│   │   ├── cardapio.js       # Menu (ISR - 5min)
│   │   ├── checkout.js       # Checkout flow
│   │   ├── pedidos.js        # Order history
│   │   ├── admin/            # Admin panel
│   │   ├── atendente/        # Staff panel
│   │   └── cozinha/          # Kitchen display
│   │
│   ├── components/            # React components
│   │   ├── ProductCard.js    # Product display
│   │   ├── Header.js         # Navigation
│   │   ├── CartItem.js       # Cart item
│   │   └── ui/               # UI components
│   │
│   ├── stores/                # Zustand stores
│   │   ├── authStore.js      # Authentication
│   │   ├── cartStore.js      # Shopping cart
│   │   ├── productStore.js   # Products
│   │   └── orderStore.js     # Orders
│   │
│   ├── services/              # API clients
│   │   ├── api.js            # Axios instance
│   │   └── socket.js         # Socket.io client
│   │
│   └── utils/                 # Utilities
│       ├── format.js         # Formatters
│       └── validation.js     # Validators
│
└── public/
    ├── sw.js                  # Service Worker
    ├── manifest.json          # PWA Manifest
    └── icons/                 # PWA Icons
```

**APIs Consumidas**:
- `GET /api/products` - Lista produtos
- `POST /api/orders` - Cria pedido
- `GET /api/auth/me` - Usuário autenticado
- `WebSocket /` - Real-time updates

**Performance**:
- First Load: ~50-100ms (ISR)
- Bundle size: ~300KB (gzip)
- Lighthouse: 95+
- PWA: 100%

---

### 2. API REST (Backend)

**Tecnologia**: Express.js (Node.js)
**Tipo**: RESTful API + WebSocket
**Porta**: 7000
**Hosting**: Railway

**Responsabilidades**:
- Business logic
- Data validation
- Authentication (JWT)
- Authorization (RBAC)
- Database operations (CRUD)
- Real-time communication (WebSocket)
- File uploads
- Email/SMS sending
- External API integration

**Principais Módulos**:

```
backend/
├── src/
│   ├── server.js              # Express app
│   │
│   ├── routes/                # API routes
│   │   ├── auth.js           # /api/auth/*
│   │   ├── products.js       # /api/products/*
│   │   ├── orders.js         # /api/orders/*
│   │   ├── users.js          # /api/users/*
│   │   ├── cashback.js       # /api/cashback/*
│   │   └── tables.js         # /api/tables/*
│   │
│   ├── controllers/           # Route handlers
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── orderController.js
│   │
│   ├── models/                # Sequelize models
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── OrderItem.js
│   │   └── Cashback.js
│   │
│   ├── middlewares/           # Express middlewares
│   │   ├── auth.js           # JWT verification
│   │   ├── rbac.js           # Role-based access
│   │   ├── csrf.middleware.js # CSRF protection
│   │   ├── sanitization.js   # XSS prevention
│   │   └── rateLimit.js      # Rate limiting
│   │
│   ├── services/              # Business logic
│   │   ├── orderService.js   # Order processing
│   │   ├── cashbackService.js # Cashback calc
│   │   ├── emailService.js   # Email sending
│   │   └── smsService.js     # SMS sending
│   │
│   ├── config/                # Configuration
│   │   ├── database.js       # Sequelize config
│   │   ├── swagger.js        # API docs
│   │   └── logger.js         # Winston logger
│   │
│   └── socket/                # WebSocket handlers
│       ├── orderSocket.js    # Order events
│       └── notificationSocket.js # Notifications
│
└── uploads/                   # File uploads
    ├── products/
    └── avatars/
```

**Endpoints Principais**:

**Authentication**:
- `POST /api/auth/register` - Cadastro
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Perfil
- `POST /api/auth/logout` - Logout

**Products**:
- `GET /api/products` - Lista produtos
- `GET /api/products/:id` - Detalhes
- `POST /api/products` - Criar (admin)
- `PUT /api/products/:id` - Atualizar (admin)
- `DELETE /api/products/:id` - Deletar (admin)

**Orders**:
- `GET /api/orders` - Lista pedidos
- `GET /api/orders/:id` - Detalhes
- `POST /api/orders` - Criar pedido
- `PUT /api/orders/:id/status` - Atualizar status
- `POST /api/orders/:id/confirm-payment` - Confirmar pagamento

**Cashback**:
- `GET /api/cashback/balance` - Saldo
- `POST /api/cashback/redeem` - Resgatar
- `GET /api/cashback/history` - Histórico

**Security**:
- JWT Authentication (Bearer token)
- RBAC (customer, staff, admin)
- CSRF Protection (double submit cookie)
- XSS Sanitization (validator)
- Rate Limiting (100 req/15min)
- Helmet (security headers)

---

### 3. Database (PostgreSQL)

**Tecnologia**: PostgreSQL 15
**Tipo**: Relational Database
**Porta**: 5432
**Hosting**: Railway

**Responsabilidades**:
- Persistent data storage
- Transactional operations
- Data integrity (constraints)
- Query optimization (indexes)
- Backup and recovery

**Schema Principal**:

```sql
-- Usuários
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'customer',
  phone VARCHAR(20),
  cpf VARCHAR(14),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Produtos
CREATE TABLE products (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  image VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  stock INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Pedidos
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  table_id UUID REFERENCES tables(id),
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  payment_status VARCHAR(50),
  subtotal DECIMAL(10,2),
  discount DECIMAL(10,2) DEFAULT 0,
  tip DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Items do Pedido
CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  notes TEXT
);

-- Cashback
CREATE TABLE cashback_transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  order_id UUID REFERENCES orders(id),
  type VARCHAR(50), -- 'earn', 'redeem', 'expire'
  amount DECIMAL(10,2) NOT NULL,
  balance_after DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Mesas
CREATE TABLE tables (
  id UUID PRIMARY KEY,
  number INT UNIQUE NOT NULL,
  capacity INT,
  status VARCHAR(50) DEFAULT 'available',
  qr_code VARCHAR(500)
);
```

**Indexes**:
- `users(email)` - Login lookups
- `orders(user_id, created_at)` - Order history
- `orders(status, created_at)` - Staff queries
- `products(category, is_active)` - Menu filters
- `cashback_transactions(user_id, created_at)` - Balance calc

**Statistics**:
- ~50 tables
- ~10K+ users
- ~50K+ orders
- ~200K+ order items
- Database size: ~2GB

---

### 4. Redis Cache

**Tecnologia**: Redis 7
**Tipo**: In-Memory Data Store
**Porta**: 6379
**Hosting**: Railway

**Responsabilidades**:
- Session storage (JWT blacklist)
- API response caching
- Rate limiting counters
- Real-time data (pub/sub)
- Temporary data

**Key Patterns**:

```
# Sessions
session:{userId} → JWT token data (TTL: 7 days)

# API Caching
api:products:all → Product list (TTL: 5 min)
api:products:{id} → Product detail (TTL: 10 min)
api:menu:categories → Categories (TTL: 1 hour)

# Rate Limiting
ratelimit:{ip}:{endpoint} → Request count (TTL: 15 min)

# Real-time
orders:pending → Set of pending order IDs
notifications:{userId} → User notifications queue

# Cashback
cashback:balance:{userId} → Current balance (TTL: 5 min)
```

**Configuration**:
- Max memory: 512MB
- Eviction policy: `allkeys-lru`
- Persistence: AOF (Append-Only File)

---

### 5. Static CDN

**Tecnologia**: Vercel Edge Network
**Tipo**: Content Delivery Network
**Hosting**: Vercel

**Responsabilidades**:
- Static asset serving
- Image optimization
- Global distribution
- Automatic compression (Brotli/Gzip)

**Assets**:
- JavaScript bundles
- CSS stylesheets
- Images (WebP, AVIF)
- Fonts (WOFF2)
- PWA assets (icons, manifest)

**Performance**:
- Edge locations: 60+ worldwide
- Cache-Control: `public, max-age=31536000, immutable`
- Image optimization: auto WebP/AVIF
- Response time: <50ms (95th percentile)

---

### 6. File Storage

**Tecnologia**: Railway Volume
**Tipo**: Persistent File System
**Path**: `/uploads`

**Responsabilidades**:
- Product images
- User avatars
- Temporary uploads
- Generated reports (PDF)

**Structure**:
```
/uploads/
├── products/
│   ├── {productId}_1.jpg
│   └── {productId}_2.jpg
├── avatars/
│   └── {userId}.jpg
└── temp/
    └── {sessionId}_report.pdf
```

**Limits**:
- Max file size: 10MB
- Allowed formats: jpg, png, webp, pdf
- Storage quota: 5GB

---

## Inter-Container Communication

### Web App → API REST
**Protocol**: HTTPS
**Auth**: JWT Bearer Token
**Format**: JSON
**Methods**: GET, POST, PUT, DELETE, PATCH

### API REST → Database
**Protocol**: TCP (PostgreSQL Wire Protocol)
**Connection Pool**: 20 connections
**Query Timeout**: 30s

### API REST → Redis
**Protocol**: Redis Protocol (RESP)
**Connection Pool**: 10 connections
**Timeout**: 5s

### Web App ↔ API REST (Real-time)
**Protocol**: WebSocket (Socket.io)
**Events**:
- `order:created` - Novo pedido
- `order:status_changed` - Status atualizado
- `notification` - Notificação geral

---

## Deployment Architecture

```
┌─────────────────────┐
│   GitHub Repo       │
│   (Source Code)     │
└──────────┬──────────┘
           │ git push
           ▼
┌─────────────────────┐
│  GitHub Actions     │
│  (CI/CD Pipeline)   │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
┌─────────┐ ┌──────────┐
│ Vercel  │ │ Railway  │
│ (Front) │ │ (Backend)│
└─────────┘ └──────────┘
```

---

**Criado por**: MANUS v7.1
**Data**: 2026-01-17
**Versão**: 1.0
**Status**: ✅ Completo
