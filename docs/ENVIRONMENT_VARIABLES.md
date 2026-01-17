# Environment Variables - FLAME Lounge Bar

Documentação completa de todas as variáveis de ambiente necessárias para executar o projeto.

---

## 📋 Índice

- [Backend (.env)](#backend-env)
- [Frontend (.env.local)](#frontend-envlocal)
- [Development vs Production](#development-vs-production)
- [Como Configurar](#como-configurar)

---

## Backend (.env)

Crie o arquivo `backend/.env` com as seguintes variáveis:

### 🔐 Database

```bash
# PostgreSQL Connection
DATABASE_URL=postgresql://user:password@host:port/database
# Exemplo local: postgresql://postgres:password@localhost:5432/flame_lounge
# Exemplo Railway: postgresql://postgres:xxx@containers-us-west-xxx.railway.app:6543/railway

# Database Pool Configuration
DB_POOL_MAX=10
DB_POOL_MIN=2
DB_POOL_ACQUIRE=30000
DB_POOL_IDLE=10000
```

### 🌍 Server Configuration

```bash
# Environment
NODE_ENV=development  # ou production, staging

# Server Port
PORT=7000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
# Production: https://flame-lounge.vercel.app
```

### 🔑 Authentication

```bash
# JWT Secret (64+ caracteres aleatórios)
JWT_SECRET=your-super-secret-jwt-key-min-64-chars-change-this-in-production
JWT_EXPIRE=7d

# Google OAuth
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
```

### 💳 Payment (Stripe)

```bash
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_xxx  # Development
# sk_live_xxx  # Production

# Stripe Webhook Secret
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### 📱 SMS (Twilio)

```bash
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+1234567890
```

### 📧 Email (SendGrid)

```bash
SENDGRID_API_KEY=SG.xxxxx
FROM_EMAIL=noreply@flamelounge.com
```

### 🔔 Push Notifications

```bash
# Web Push (VAPID Keys)
VAPID_PUBLIC_KEY=xxxxx
VAPID_PRIVATE_KEY=xxxxx
VAPID_SUBJECT=mailto:admin@flamelounge.com
```

### 📊 Monitoring

```bash
# Sentry (Error Tracking)
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx

# Logging
LOG_LEVEL=info  # error, warn, info, http, verbose, debug, silly
```

### 🔄 Redis (Optional - Caching)

```bash
REDIS_URL=redis://localhost:6379
# Railway: redis://default:xxx@red-xxx.railway.app:6379
```

### 🚦 Rate Limiting

```bash
RATE_LIMIT_WINDOW_MS=60000      # 1 minuto
RATE_LIMIT_MAX_REQUESTS=500     # 500 req/min
```

### 🖼️ File Upload

```bash
# Upload limits
MAX_FILE_SIZE=10485760  # 10MB em bytes
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/pdf
```

---

## Frontend (.env.local)

Crie o arquivo `frontend/.env.local` com as seguintes variáveis:

### 🌍 API Configuration

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:7000
# Production: https://api.flame-lounge.com
```

### 🔑 Authentication

```bash
# Google OAuth (mesmo do backend)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
```

### 💳 Payment (Stripe)

```bash
# Stripe Publishable Key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx  # Development
# pk_live_xxx  # Production
```

### 🗺️ Maps

```bash
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaxxxxx
```

### 📊 Analytics & Monitoring

```bash
# Google Analytics 4
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Sentry (Error Tracking)
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx

# Environment
NEXT_PUBLIC_ENV=development  # ou production, staging
```

### 🔔 Push Notifications

```bash
# Web Push (VAPID Public Key - mesmo do backend)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=xxxxx
```

### 🎨 Feature Flags (Optional)

```bash
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PUSH_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_CASHBACK=true
NEXT_PUBLIC_ENABLE_RESERVATIONS=true
```

---

## Development vs Production

### Development

**Backend (.env):**
```bash
NODE_ENV=development
PORT=7000
DATABASE_URL=postgresql://postgres:password@localhost:5432/flame_lounge
FRONTEND_URL=http://localhost:3000
JWT_SECRET=dev-secret-key-min-64-chars
STRIPE_SECRET_KEY=sk_test_xxx
SENTRY_DSN=  # Opcional, deixar vazio para skip
LOG_LEVEL=debug
```

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:7000
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
NEXT_PUBLIC_SENTRY_DSN=  # Opcional
```

### Production

**Backend (.env):**
```bash
NODE_ENV=production
PORT=7000
DATABASE_URL=postgresql://postgres:xxx@railway.app:5432/railway
FRONTEND_URL=https://flame-lounge.vercel.app
JWT_SECRET=super-secure-random-64-chars-production-key
STRIPE_SECRET_KEY=sk_live_xxx
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
LOG_LEVEL=warn
```

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_API_URL=https://api.flame-lounge.com
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## Como Configurar

### 1. Backend

```bash
cd backend
cp .env.example .env
# Editar .env com suas credenciais
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local
# Editar .env.local com suas credenciais
```

### 3. Gerar JWT Secret

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# OpenSSL
openssl rand -hex 64
```

### 4. Obter Credenciais

#### Google OAuth
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um projeto
3. Habilite Google+ API
4. Crie credenciais OAuth 2.0
5. Adicione redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://flame-lounge.vercel.app/api/auth/callback/google` (prod)

#### Stripe
1. Acesse [Stripe Dashboard](https://dashboard.stripe.com/)
2. Developers → API keys
3. Copie Publishable key e Secret key
4. Webhooks → Add endpoint:
   - URL: `https://api.flame-lounge.com/api/payments/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`

#### Twilio
1. Acesse [Twilio Console](https://www.twilio.com/console)
2. Compre um número de telefone
3. Copie Account SID e Auth Token

#### SendGrid
1. Acesse [SendGrid Dashboard](https://app.sendgrid.com/)
2. Settings → API Keys
3. Create API Key com permissões de envio

#### Sentry
1. Acesse [Sentry.io](https://sentry.io/)
2. Crie um projeto (Node.js para backend, Next.js para frontend)
3. Copie o DSN

#### Google Maps
1. [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → Library
3. Habilite Maps JavaScript API
4. Credentials → Create API Key

#### Google Analytics
1. [Google Analytics](https://analytics.google.com/)
2. Admin → Create Property
3. Data Streams → Add stream (Web)
4. Copie Measurement ID (G-XXXXXXXXXX)

---

## ⚠️ Segurança

### ✅ DO:
- Use `.env` files (nunca commite no git)
- Gere secrets aleatórios e longos (64+ chars)
- Use diferentes secrets para dev/staging/prod
- Rotacione secrets regularmente
- Use HTTPS em produção
- Limite acesso às credenciais

### ❌ DON'T:
- Nunca commite arquivos `.env` no git
- Nunca hardcode secrets no código
- Nunca compartilhe secrets em chat/email
- Nunca reutilize secrets entre ambientes
- Nunca use secrets fracos ou default

---

## 🔍 Validação

### Verificar Backend

```bash
cd backend
npm run check-env  # Se tiver script

# Ou manualmente:
node -e "require('dotenv').config(); console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✓' : '✗'); console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓' : '✗');"
```

### Verificar Frontend

```bash
cd frontend
npm run build  # Deve passar sem erros
```

---

## 📚 Recursos

- [dotenv documentation](https://github.com/motdotla/dotenv)
- [Twelve-Factor App - Config](https://12factor.net/config)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

**Última atualização:** 2026-01-17
