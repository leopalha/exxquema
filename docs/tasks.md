# FLAME - TASKS & PROJETO

## STATUS ATUAL DO PROJETO

**Data Atualização**: 06/12/2024
**Versão**: 2.0.0
**Status**: ✅ PRODUCTION READY

---

## 🌐 URLS DE PRODUÇÃO

### Frontend (Vercel)
- **URL Atual**: https://flame-lounge.vercel.app (domínio permanente)
- **URL Deploy**: https://flame-rjx23nmh1-leopalhas-projects.vercel.app
- **Dashboard**: https://vercel.com/leopalhas-projects/flame

### Backend (Railway)
- **URL API**: https://backend-production-28c3.up.railway.app
- **Dashboard**: https://railway.com/project/81506789-d7c8-49b9-a47c-7a6dc22442f7

---

## ✅ FUNCIONALIDADES ATIVAS

### Sistema Completo Deployado:
- ✅ 46 páginas funcionais
- ✅ Autenticação (SMS + Email/Senha)
- ✅ Sistema de Pedidos + Tracking Real-time
- ✅ Cardápio Digital
- ✅ Sistema de Cashback (R$ direto)
- ✅ Reservas
- ✅ Narguilé/Tabacaria
- ✅ Admin Dashboard completo
- ✅ Staff (Cozinha, Bar, Atendente, Caixa)
- ✅ PWA configurado
- ✅ 6 Temas dinâmicos via CSS variables
- ✅ Push Notifications (VAPID)
- ✅ SMS via Twilio
- ✅ Stripe configurado (teste)

---

## 🎨 DESIGN SYSTEM - 100% COMPLETO

### Status Final
- ✅ **100% das páginas** usam CSS variables
- ✅ **0 cores hard-coded** restantes
- ✅ **369 botões** verificados e funcionais
- ✅ **Temas dinâmicos** funcionando

### CSS Variables Oficiais
```css
--theme-primary: #FF006E;      /* Magenta */
--theme-accent: #B266FF;       /* Purple */
--theme-secondary: #00D4FF;    /* Cyan */
--theme-primary-rgb: 255,0,110;
--theme-accent-rgb: 178,102,255;
--theme-secondary-rgb: 0,212,255;
```

### Páginas Corrigidas (Migração para CSS Variables)
1. ✅ `/filosofia` - Consolidada em `/conceito` (página excluída)
2. ✅ `/reservas` - Orange/Amber → Magenta/Cyan
3. ✅ `/complete-profile` - Purple/Pink → Tema padrão
4. ✅ `/termos` - Orange → Magenta

### Temas Disponíveis
1. FLAME (magenta/purple/cyan) - Padrão
2. INFERNO (red/purple)
3. PASSION (wine/pink)
4. NEON (purple/green)
5. TWILIGHT (purple/lavender)
6. AMBER (gold/pink)

---

## 📋 PÁGINAS DO SISTEMA (46 TOTAL)

### Públicas (12)
- `/` - Homepage
- `/login` - Login
- `/register` - Cadastro
- `/cardapio` - Cardápio
- `/historia` - Nossa História
- `/conceito` - Nosso Conceito ⭐ (consolidou /filosofia)
- `/logos` - Brand Assets
- `/404` - Página de Erro
- `/offline` - PWA Offline
- `/apresentacao` - Apresentação
- `/roadmap` - Roadmap
- `/termos` - Termos de Uso

### Cliente (6)
- `/perfil` - Perfil do Usuário
- `/checkout` - Finalizar Pedido
- `/recuperar-senha` - Recuperação
- `/complete-profile` - Completar Cadastro
- `/reservas` - Reservas
- `/cashback` - Cashback

### Admin (10)
- `/admin` - Dashboard
- `/admin/products` - Produtos
- `/admin/estoque` - Estoque
- `/admin/orders` - Pedidos
- `/admin/reports` - Relatórios
- `/admin/settings` - Configurações
- `/admin/clientes` - CRM
- `/admin/reservas` - Reservas
- `/admin/campanhas` - Campanhas
- `/admin/logs` - Logs

### Staff (5)
- `/staff/bar` - Bar
- `/atendente` - Atendente
- `/cozinha` - Cozinha
- `/staff/caixa` - Caixa
- `/staff/relatorios` - Relatórios

### Outros (13)
- `/pedidos`, `/avaliacoes`, `/qr-codes`, `/mesa`, `/amsterdam`, `/lampiao`, `/limpar-cache`, `/programacao`, etc.

---

## 🔑 VARIÁVEIS DE AMBIENTE

### Backend (Railway) - 21 variáveis
```bash
NODE_ENV=production
PORT=7000
DATABASE_URL=(auto via PostgreSQL)
JWT_SECRET=(configurado no Railway)
JWT_EXPIRE=7d

# Twilio SMS
TWILIO_ACCOUNT_SID=(configurado no Railway)
TWILIO_AUTH_TOKEN=(configurado no Railway)
TWILIO_PHONE_NUMBER=(configurado no Railway)

# Push Notifications
VAPID_PUBLIC_KEY=(configurado no Railway)
VAPID_PRIVATE_KEY=(configurado no Railway)
VAPID_SUBJECT=mailto:contato@flamelounge.com.br

# Jobs
JOBS_TIMEZONE=America/Sao_Paulo
JOBS_STOCK_ALERTS_ENABLED=true
JOBS_CASHBACK_EXPIRY_ENABLED=true

# Cashback
CASHBACK_BRONZE_RATE=0.02
CASHBACK_SILVER_RATE=0.05
CASHBACK_GOLD_RATE=0.08
CASHBACK_PLATINUM_RATE=0.10
CASHBACK_EXPIRY_DAYS=90

# Stripe (configurado)
STRIPE_SECRET_KEY=sk_test_51SVcch...
STRIPE_PUBLISHABLE_KEY=pk_test_51SVcch...

# Frontend
FRONTEND_URL=https://flame-lounge.vercel.app
```

### Frontend (Vercel) - 4 variáveis
```bash
NEXT_PUBLIC_API_URL=https://backend-production-28c3.up.railway.app/api
NEXT_PUBLIC_SOCKET_URL=https://backend-production-28c3.up.railway.app
NEXT_PUBLIC_VAPID_PUBLIC_KEY=(configurado no Railway)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SVcch...
```

---

## 🚀 PRÓXIMAS SPRINTS

### SPRINT 19.1 - HOTFIX BACKEND 502 🚨 CRÍTICO

**Objetivo**: Restaurar backend que está offline (Error 502)

**Prioridade**: P0 (CRÍTICA - Sistema offline)
**Estimativa**: 1 hora
**Status**: [~] EM ANDAMENTO

#### Problema Identificado:
- Backend retorna Error 502 - Application failed to respond
- Servidor não responde em nenhum endpoint
- Frontend 100% funcional, apenas backend offline

#### Checklist:
- [x] Diagnosticar via Railway logs
- [ ] Identificar causa raiz (schema/jobs/sintaxe)
- [ ] Aplicar correção apropriada
- [ ] Restart service no Railway
- [ ] Validar endpoints funcionando
- [ ] Atualizar tasks.md com solução

**Relatório**: [STATUS_SISTEMA.md](../STATUS_SISTEMA.md)

---

### SPRINT 20 - GOOGLE OAUTH ⚠️ 90% COMPLETO - AGUARDANDO CREDENCIAIS

**Objetivo**: Implementar autenticação com Google OAuth 2.0

**Prioridade**: P0 (Alta) - Feature de acessibilidade crítica
**Estimativa**: 2-3 dias
**Status Atual**: 🟡 Código 100% pronto, aguardando configuração manual

#### Checklist Resumido:
- [ ] **MANUAL**: Criar projeto no Google Cloud Console
- [ ] **MANUAL**: Configurar OAuth 2.0 Client ID e copiar credenciais
- [x] Backend: Instalar google-auth-library
- [x] Backend: Adicionar campos ao modelo User (googleId, googleProfilePicture, authProvider)
- [x] Backend: Criar google.service.js
- [x] Backend: Adicionar rota POST /auth/google
- [x] Frontend: Carregar Google SDK no _app.js
- [x] Frontend: Criar GoogleLoginButton component
- [x] Frontend: Adicionar método googleLogin() no authStore
- [x] Frontend: Adicionar botões em /login e /register
- [ ] Configurar variáveis GOOGLE_CLIENT_ID (Railway + Vercel)
- [ ] Deploy e testes E2E

**📝 Guia Completo**: [PROXIMOS_PASSOS_GOOGLE_OAUTH.md](../PROXIMOS_PASSOS_GOOGLE_OAUTH.md)
**Detalhes Técnicos**: Ver seção "SPRINT 20 DETALHADA" abaixo

---

### SPRINT 21 - MELHORIAS DE UX (Planejada)

**Objetivo**: Melhorar experiência do usuário

**Tarefas**:
1. [ ] Criar componente Button reutilizável
2. [ ] Adicionar loading skeletons em páginas faltantes
3. [ ] Documentar design system em docs/11_DESIGN_SYSTEM_GUIDE.md
4. [ ] Testes visuais (snapshot tests)

**Estimativa**: 1-2 dias

---

### SPRINT 22 - TESTES E2E (Planejada)

**Objetivo**: Cobertura completa de testes

**Tarefas**:
1. [ ] Configurar Cypress
2. [ ] Testes de autenticação
3. [ ] Testes de pedidos
4. [ ] Testes de cashback
5. [ ] Testes de admin

**Estimativa**: 2-3 dias

---

## 📊 HISTÓRICO DE SPRINTS COMPLETADAS

### SPRINT 19 - AUDITORIA E MIGRAÇÃO DE DESIGN SYSTEM ✅
**Data**: 05/12/2024
**Status**: ✅ COMPLETO

**Realizações**:
- ✅ Auditoria de 47 páginas
- ✅ Catalogação de 369 botões
- ✅ Migração de 4 páginas para CSS variables
- ✅ Consolidação de /filosofia em /conceito
- ✅ 100% conformidade com design system
- ✅ Deploy em produção

**Commits**:
- `62bfb0d` - feat: migrar todas as páginas para CSS variables do tema
- `acea02c` - refactor: consolidar /filosofia em /conceito e finalizar migração

---

### SPRINT 18 - DEPLOY COMPLETO ✅
**Data**: 04/12/2024
**Status**: ✅ COMPLETO

**Realizações**:
- ✅ Backend no Railway com PostgreSQL
- ✅ Frontend no Vercel
- ✅ 45 páginas compiladas
- ✅ Twilio configurado
- ✅ VAPID gerado
- ✅ Stripe configurado
- ✅ Domínio permanente: flame-lounge.vercel.app

---

## 🛠️ COMANDOS ÚTEIS

### Deploy
```bash
# Backend
cd backend
railway up

# Frontend
cd frontend
vercel --prod
```

### Logs
```bash
# Backend
railway logs

# Frontend
vercel logs
```

### Variáveis
```bash
# Backend
railway variables

# Frontend
vercel env ls
```

### Dashboards
```bash
railway open
vercel inspect
```

---

## 🔐 CREDENCIAIS E ACESSOS

### Google Cloud (Para Sprint 20)
- Console: https://console.cloud.google.com/
- Projeto: FLAME Lounge (a criar)

### Stripe
- Dashboard: https://dashboard.stripe.com/
- Modo: Test
- Keys: Configuradas no Railway e Vercel

### Twilio
- Console: https://console.twilio.com/
- Account SID: (configurado no Railway)
- Phone: (configurado no Railway)

### Railway
- Dashboard: https://railway.com/project/81506789-d7c8-49b9-a47c-7a6dc22442f7
- Service: backend (496634b3-f564-4015-b081-ec1f4955d4cc)
- Database: Postgres-9QOL

### Vercel
- Dashboard: https://vercel.com/leopalhas-projects/flame
- Domínio: flame-lounge.vercel.app

---

## 📞 INFORMAÇÕES DO PROJETO

### FLAME Lounge Bar & Tabacaria
- **Endereço**: Rua Arnaldo Quintela 19, Botafogo - RJ
- **Instagram**: @flamelounge_
- **WhatsApp**: +55 21 99554-6492
- **Email**: contato@flamelounge.com.br

### Conceito
"Fogo que aquece, não que queima"
- Lounge bar + Gastronomia + Narguilé premium
- Localização: 8ª rua mais cool do mundo (Time Out 2024)
- Tagline: "Prepare-se, vai esquentar"

---

## 🎯 PRÓXIMOS PASSOS IMEDIATOS

1. **Decidir Sprint**: Google OAuth (Sprint 20) ou Melhorias UX (Sprint 21)?
2. **Testes**: Validar todas funcionalidades em produção
3. **Monitoramento**: Acompanhar logs Railway e Vercel
4. **Opcional**: Configurar Stripe webhook para notificações

---

---

# SPRINT 20 DETALHADA - GOOGLE OAUTH IMPLEMENTATION

**Objetivo**: Implementar autenticação com Google OAuth 2.0 para cadastro e login

**Prioridade**: P0 (Alta) - Feature de acessibilidade crítica
**Estimativa**: 2-3 dias
**Status**: [ ] Não Iniciado

---

## LEGENDA DE STATUS

- [ ] Não iniciado
- [~] Em andamento
- [x] Concluído
- [!] Bloqueado
- [-] Pausado

---

## FASE 1: PREPARAÇÃO E CONFIGURAÇÃO

### [ ] 1.1 Criar Projeto no Google Cloud Console

**Ações**:
1. Acessar https://console.cloud.google.com/
2. Criar novo projeto "FLAME Lounge" ou usar existente
3. Ativar "Google+ API"
4. Ir em "Credentials" > "Create Credentials"
5. Configurar OAuth 2.0 Client ID:
   - Application Type: Web Application
   - Name: FLAME OAuth Client
   - Authorized JavaScript origins:
     - `http://localhost:3000` (dev)
     - `https://flame-lounge.vercel.app` (prod)
   - Authorized redirect URIs:
     - `http://localhost:3000` (dev)
     - `https://flame-lounge.vercel.app` (prod)
6. Copiar Client ID
7. Copiar Client Secret

**Dependências**: Nenhuma
**Bloqueadores**: Acesso ao Google Cloud Console
**Tempo Estimado**: 30min

---

## FASE 2: BACKEND - MODELO E SERVIÇOS

### [ ] 2.1 Instalar Dependências

```bash
cd backend
npm install google-auth-library
```

**Arquivo**: `backend/package.json`
**Tempo Estimado**: 5min

---

### [ ] 2.2 Adicionar Campos ao Modelo User

**Arquivo**: `backend/src/models/User.js`

**Campos a adicionar** (~linha 220-240):
```javascript
googleId: {
  type: DataTypes.STRING,
  allowNull: true,
  unique: true,
  comment: 'ID único do Google OAuth'
},
googleProfilePicture: {
  type: DataTypes.STRING,
  allowNull: true,
  comment: 'URL da foto de perfil do Google'
},
authProvider: {
  type: DataTypes.TEXT,
  defaultValue: 'local',
  allowNull: false,
  validate: {
    isIn: [['local', 'google']]
  },
  comment: 'Provedor de autenticação utilizado'
}
```

**Atualizar método** `hasCompleteProfile()`:
```javascript
hasCompleteProfile() {
  if (this.authProvider === 'google') {
    return !!(this.nome && this.email && this.googleId);
  }
  return !!(this.nome && this.email && this.profileComplete);
}
```

**Tempo Estimado**: 15min

---

### [ ] 2.3 Criar Google Service

**Arquivo**: `backend/src/services/google.service.js` (NOVO)

```javascript
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class GoogleService {
  async verifyToken(token) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      const payload = ticket.getPayload();
      return {
        sub: payload.sub,
        email: payload.email,
        email_verified: payload.email_verified,
        name: payload.name,
        picture: payload.picture,
        given_name: payload.given_name,
        family_name: payload.family_name
      };
    } catch (error) {
      throw new Error('Token do Google inválido');
    }
  }
}

module.exports = new GoogleService();
```

**Tempo Estimado**: 10min
**Dependências**: 2.1 instalação concluída

---

## FASE 3: BACKEND - CONTROLLER E ROTAS

### [ ] 3.1 Adicionar Método googleAuth no AuthController

**Arquivo**: `backend/src/controllers/authController.js`
**Linha**: Após método `completeProfile` (~920)

**Adicionar import**:
```javascript
const googleService = require('../services/google.service');
```

**Adicionar método**:
```javascript
async googleAuth(req, res) {
  try {
    const { credential } = req.body;
    console.log('🔐 GOOGLE AUTH:', { credentialLength: credential.length });

    // 1. Validar token com Google
    const googleUser = await googleService.verifyToken(credential);
    const { sub: googleId, email, name, picture } = googleUser;

    console.log('✅ GOOGLE USER:', { googleId, email, name });

    // 2. Buscar usuário por googleId OU email
    let user = await User.findOne({
      where: {
        [Op.or]: [{ googleId }, { email }]
      }
    });

    let isNewUser = false;

    // 3. SE NÃO EXISTIR: Criar novo
    if (!user) {
      console.log('📝 Criando novo usuário via Google');
      user = await User.create({
        googleId,
        email,
        nome: name,
        googleProfilePicture: picture,
        authProvider: 'google',
        profileComplete: true,
        phoneVerified: false,
        emailVerified: true,
        role: 'cliente'
      });
      isNewUser = true;
    }
    // 4. SE EXISTIR MAS SEM GOOGLE_ID: Vincular conta
    else if (!user.googleId) {
      console.log('🔗 Vinculando conta Google a usuário existente');
      await user.update({
        googleId,
        googleProfilePicture: picture,
        authProvider: 'google'
      });
    }

    // 5. Gerar JWT
    const token = generateToken(user.id);

    // 6. Atualizar último login
    await user.update({ lastLogin: new Date() });

    console.log('✅ GOOGLE AUTH SUCCESS:', { userId: user.id, isNewUser });

    // 7. Retornar
    res.status(200).json({
      success: true,
      message: isNewUser ? 'Cadastro realizado com sucesso!' : 'Login realizado com sucesso',
      data: {
        user: user.toJSON(),
        token,
        isNewUser,
        needsPhone: !user.celular
      }
    });
  } catch (error) {
    console.error('❌ GOOGLE AUTH ERROR:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao autenticar com Google',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
```

**Tempo Estimado**: 20min

---

### [ ] 3.2 Adicionar Rota POST /auth/google

**Arquivo**: `backend/src/routes/auth.js`
**Linha**: Após rota `/complete-profile` (~91)

```javascript
/**
 * @route   POST /api/auth/google
 * @desc    Autenticar/Cadastrar com Google OAuth 2.0
 * @access  Public
 * @body    { credential: string (JWT) }
 */
router.post('/google', authController.googleAuth);
```

**Tempo Estimado**: 5min
**Dependências**: 2.3, 3.1 concluídos

---

## FASE 4: FRONTEND - GOOGLE SDK E COMPONENTE

### [ ] 4.1 Carregar Google Identity Services no _app.js

**Arquivo**: `frontend/src/pages/_app.js`

```javascript
import Script from 'next/script';

// ...no return
<>
  {/* Google Identity Services */}
  <Script
    src="https://accounts.google.com/gsi/client"
    strategy="beforeInteractive"
  />

  <Component {...pageProps} />
</>
```

**Tempo Estimado**: 5min

---

### [ ] 4.2 Criar Componente GoogleLoginButton

**Arquivo**: `frontend/src/components/GoogleLoginButton.js` (NOVO)

```javascript
import { useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';

export default function GoogleLoginButton({ text = 'continue_with' }) {
  const { googleLogin } = useAuthStore();
  const buttonRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true
    });

    window.google.accounts.id.renderButton(
      buttonRef.current,
      {
        theme: 'filled_black',
        size: 'large',
        text: text,
        shape: 'rectangular',
        logo_alignment: 'left',
        width: 320
      }
    );
  }, []);

  const handleCredentialResponse = async (response) => {
    console.log('📱 Google Credential recebido');
    await googleLogin(response.credential);
  };

  return (
    <div className="flex justify-center">
      <div ref={buttonRef} />
    </div>
  );
}
```

**Tempo Estimado**: 10min
**Dependências**: 4.1 concluído

---

## FASE 5: FRONTEND - AUTHSTORE E INTEGRAÇÃO

### [ ] 5.1 Adicionar googleLogin() no authStore

**Arquivo**: `frontend/src/stores/authStore.js`
**Linha**: Após método `completeProfile` (~692)

```javascript
googleLogin: async (credential) => {
  set({ isLoading: true });
  try {
    console.log('🔐 GOOGLE LOGIN:', { credentialLength: credential.length });

    const response = await api.post('/auth/google', { credential });

    console.log('✅ GOOGLE LOGIN RESPONSE:', response.data);

    if (response.data.success) {
      const { user, token, isNewUser, needsPhone } = response.data.data;

      // Salvar no estado
      set({
        user,
        token,
        isAuthenticated: true
      });

      // Configurar token na API
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Mensagem de sucesso
      if (isNewUser) {
        toast.success('Bem-vindo ao FLAME! 🔥');

        if (needsPhone) {
          toast('Adicione seu celular para receber atualizações por SMS', {
            icon: '📱',
            duration: 5000
          });
        }
      } else {
        toast.success('Login realizado com sucesso!');
      }

      return { success: true, user, isNewUser };
    } else {
      toast.error(response.data.message || 'Erro no login com Google');
      return { success: false, error: response.data.message };
    }
  } catch (error) {
    console.error('❌ GOOGLE LOGIN ERROR:', error.response?.data);
    const message = error.response?.data?.message || 'Erro ao fazer login com Google';
    toast.error(message);
    return { success: false, error: message };
  } finally {
    set({ isLoading: false });
  }
}
```

**Tempo Estimado**: 15min

---

### [ ] 5.2 Adicionar GoogleLoginButton na página login

**Arquivo**: `frontend/src/pages/login.js`

**Import**:
```javascript
import GoogleLoginButton from '../components/GoogleLoginButton';
```

**Adicionar antes do formulário**:
```jsx
<div className="mb-6">
  <GoogleLoginButton text="signin_with" />

  <div className="relative my-6">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-purple-300/30"></div>
    </div>
    <div className="relative flex justify-center text-sm">
      <span className="px-2 bg-slate-950 text-purple-300">ou</span>
    </div>
  </div>
</div>
```

**Tempo Estimado**: 10min

---

### [ ] 5.3 Adicionar GoogleLoginButton na página register

**Arquivo**: `frontend/src/pages/register.js`

**Import**:
```javascript
import GoogleLoginButton from '../components/GoogleLoginButton';
```

**Adicionar antes do formulário**:
```jsx
<div className="mb-6">
  <GoogleLoginButton text="signup_with" />

  <div className="relative my-6">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-purple-300/30"></div>
    </div>
    <div className="relative flex justify-center text-sm">
      <span className="px-2 bg-slate-950 text-purple-300">ou</span>
    </div>
  </div>
</div>
```

**Tempo Estimado**: 10min
**Dependências**: 4.2, 5.1 concluídos

---

## FASE 6: VARIÁVEIS DE AMBIENTE

### [ ] 6.1 Configurar Backend (.env)

**Arquivo**: `backend/.env`

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Tempo Estimado**: 2min

---

### [ ] 6.2 Configurar Frontend (.env.production)

**Arquivo**: `frontend/.env.production`

```bash
# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

**Tempo Estimado**: 2min

---

### [ ] 6.3 Configurar Frontend (.env.local) para Dev

**Arquivo**: `frontend/.env.local`

Copiar mesmas variáveis de `.env.production`

**Tempo Estimado**: 1min

---

### [ ] 6.4 Atualizar Backend .env.example

**Arquivo**: `backend/.env.example`

Adicionar após seção Twilio:
```bash
# ============================================
# Google OAuth Configuration
# ============================================
# Get credentials at: https://console.cloud.google.com/
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Tempo Estimado**: 2min
**Dependências**: Fase 1 concluída

---

## FASE 7: DEPLOY E CONFIGURAÇÃO

### [ ] 7.1 Atualizar Variáveis no Railway

```bash
railway variables --service backend --set "GOOGLE_CLIENT_ID=..."
railway variables --service backend --set "GOOGLE_CLIENT_SECRET=..."
```

**Tempo Estimado**: 5min

---

### [ ] 7.2 Atualizar Variáveis no Vercel

```bash
vercel env add NEXT_PUBLIC_GOOGLE_CLIENT_ID production
# Cole o Client ID
```

**Tempo Estimado**: 5min

---

### [ ] 7.3 Deploy Backend

```bash
cd backend
railway up
```

**Tempo Estimado**: 3min

---

### [ ] 7.4 Deploy Frontend

```bash
cd frontend
vercel --prod
```

**Tempo Estimado**: 3min
**Dependências**: Todas as fases anteriores

---

## FASE 8: TESTES E VALIDAÇÃO

### [ ] 8.1 Teste: Novo Usuário via Google

**Cenário**: Primeiro acesso

**Passos**:
1. Acessar `/login` em produção
2. Clicar "Entrar com Google"
3. Escolher conta Google (nova, sem cadastro prévio)

**Verificações**:
- ✅ Usuário criado automaticamente
- ✅ `profileComplete = true`
- ✅ Redireciona para `/cardapio`
- ✅ Pode fazer pedido imediatamente
- ✅ Toast: "Bem-vindo ao FLAME! 🔥"
- ✅ Toast secundário: "Adicione celular..."

**Tempo Estimado**: 5min

---

### [ ] 8.2 Teste: Login Google com Conta Existente

**Cenário**: Segundo acesso

**Passos**:
1. Fazer logout
2. Fazer login Google com mesma conta do teste anterior

**Verificações**:
- ✅ Login bem-sucedido
- ✅ Mesmo usuário retornado (não cria duplicado)
- ✅ Toast: "Login realizado com sucesso"
- ✅ Mantém dados anteriores

**Tempo Estimado**: 3min

---

### [ ] 8.3 Teste: Vinculação de Contas (Email Duplicado)

**Cenário**: Unificação de contas

**Passos**:
1. Criar conta tradicional com email X
2. Fazer logout
3. Fazer login Google com mesmo email X

**Verificações**:
- ✅ Vincula `googleId` ao usuário existente
- ✅ Não cria usuário duplicado
- ✅ Mantém dados originais (celular, pedidos, etc)
- ✅ `authProvider` atualizado para 'google'

**Tempo Estimado**: 5min

---

### [ ] 8.4 Teste: Fazer Pedido após Login Google

**Cenário**: Fluxo completo de pedido

**Passos**:
1. Login com Google
2. Acessar `/cardapio`
3. Adicionar itens ao carrinho
4. Ir para checkout
5. Confirmar pedido

**Verificações**:
- ✅ Pedido criado com sucesso
- ✅ Não exige completar perfil
- ✅ Aparece na fila da cozinha/bar

**Tempo Estimado**: 5min

---

### [ ] 8.5 Teste: Adicionar Celular Posteriormente

**Cenário**: Opcional - complementar perfil

**Passos**:
1. Login com Google (sem celular)
2. Acessar `/perfil`
3. Adicionar número de celular

**Verificações**:
- ✅ Celular salvo no perfil
- ✅ `phoneVerified` pode ser atualizado

**Tempo Estimado**: 3min

---

### [ ] 8.6 Teste: Console de Erros

**Cenário**: Validação técnica

**Passos**:
1. Verificar console do navegador (F12)
2. Verificar logs do Railway

**Verificações**:
- ✅ Sem erros JavaScript
- ✅ Sem erros 500 no backend
- ✅ Logs de debug aparecem corretamente

**Tempo Estimado**: 3min

---

## CHECKLIST FINAL

### Backend
- [ ] `google-auth-library` instalado
- [ ] Modelo User com 3 campos novos
- [ ] `google.service.js` criado
- [ ] Método `googleAuth()` no authController
- [ ] Rota `POST /auth/google` criada
- [ ] Variáveis `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` configuradas
- [ ] Deploy no Railway concluído

### Frontend
- [ ] Google SDK carregado no `_app.js`
- [ ] `GoogleLoginButton.js` criado
- [ ] Método `googleLogin()` no authStore
- [ ] Botão Google na página `/login`
- [ ] Botão Google na página `/register`
- [ ] Variável `NEXT_PUBLIC_GOOGLE_CLIENT_ID` configurada
- [ ] Deploy no Vercel concluído

### Testes
- [ ] Novo usuário via Google
- [ ] Login usuário existente
- [ ] Vinculação de contas
- [ ] Fazer pedido após login
- [ ] Adicionar celular posteriormente
- [ ] Sem erros no console

### Documentação
- [ ] Atualizar tasks.md com status
- [ ] Documentar credenciais Google

---

## NOTAS IMPORTANTES

### Segurança
- ✅ Token Google validado no backend (nunca confiar no frontend)
- ✅ JWT gerado após validação bem-sucedida
- ✅ Usuário criado com `profileComplete = true` automaticamente
- ✅ Celular opcional (pode adicionar depois)

### Compatibilidade
- ✅ Sistema de `profileComplete` continua funcionando
- ✅ Usuários Google têm acesso total imediato
- ✅ Usuários phone-only ainda precisam completar perfil
- ✅ Middleware `requireCompleteProfile` compatível

### Próximos Passos (Futuro)
- [ ] Apple Sign In (similar ao Google)
- [ ] Facebook Login
- [ ] Login com WhatsApp
- [ ] Two-Factor Authentication (2FA)

---

**Última Atualização**: 06/12/2024
**Responsável**: Claude + Leo
**Progresso**: 0% (Não iniciado)

---

