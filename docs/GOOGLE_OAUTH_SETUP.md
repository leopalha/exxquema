# Configuração do Google OAuth - FLAME Lounge

## 📋 Visão Geral

Este guia explica como configurar o Google OAuth 2.0 para autenticação no sistema FLAME Lounge.

**Status Atual**: ⚠️ Credenciais não configuradas (P1-4)
**Tempo Estimado**: 30 minutos

---

## 🔧 Passo 1: Google Cloud Console

### 1.1. Criar Projeto

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Clique em **"Select a project"** > **"New Project"**
3. Nome do projeto: `FLAME Lounge`
4. Clique em **"Create"**

### 1.2. Ativar Google+ API

1. No menu lateral, vá em **"APIs & Services"** > **"Library"**
2. Busque por **"Google+ API"** ou **"Google Identity"**
3. Clique em **"Enable"**

---

## 🔑 Passo 2: Criar Credenciais OAuth 2.0

### 2.1. Criar OAuth Consent Screen

1. Vá em **"APIs & Services"** > **"OAuth consent screen"**
2. Escolha **"External"** (para permitir qualquer conta Google)
3. Preencha:
   - **App name**: `FLAME Lounge`
   - **User support email**: `contato@flamelounge.com.br`
   - **Developer contact**: `dev@flamelounge.com.br`
4. Clique em **"Save and Continue"**

5. **Scopes**: Adicionar os seguintes escopos:
   - `email`
   - `profile`
   - `openid`
6. Clique em **"Save and Continue"**

7. **Test users** (opcional para desenvolvimento):
   - Adicione emails de teste se estiver em modo "Testing"
8. Clique em **"Save and Continue"**

### 2.2. Criar Credenciais

1. Vá em **"APIs & Services"** > **"Credentials"**
2. Clique em **"Create Credentials"** > **"OAuth client ID"**
3. **Application type**: `Web application`
4. **Name**: `FLAME Lounge Web Client`

5. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   https://flamelounge.com.br
   https://www.flamelounge.com.br
   ```

6. **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/google/callback
   https://flamelounge.com.br/api/auth/google/callback
   https://www.flamelounge.com.br/api/auth/google/callback
   ```

7. Clique em **"Create"**

8. **IMPORTANTE**: Copie os valores gerados:
   - `Client ID` (começa com algo como `123456-abc.apps.googleusercontent.com`)
   - `Client Secret` (sequência aleatória de caracteres)

---

## ⚙️ Passo 3: Configurar Variáveis de Ambiente

### 3.1. Backend (`.env`)

Adicione as seguintes variáveis no arquivo `.env` do backend:

```bash
# Google OAuth 2.0
GOOGLE_CLIENT_ID=seu-client-id-aqui.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret-aqui
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

**Produção** (`.env.production`):
```bash
GOOGLE_CLIENT_ID=seu-client-id-aqui.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret-aqui
GOOGLE_REDIRECT_URI=https://flamelounge.com.br/api/auth/google/callback
```

### 3.2. Frontend

O frontend já está configurado para usar Google Identity Services (GIS).

Verificar se o script está carregando em `_app.js`:
```javascript
<Script
  src="https://accounts.google.com/gsi/client"
  strategy="afterInteractive"
  async
  defer
/>
```

---

## 🧪 Passo 4: Testar Integração

### 4.1. Desenvolvimento Local

1. Reinicie o backend:
   ```bash
   cd backend
   npm run dev
   ```

2. Acesse: `http://localhost:3000/login`

3. Clique no botão **"Continuar com Google"**

4. Você deve ver a tela de consentimento do Google

5. Após autorizar, deve ser redirecionado para o sistema com login feito

### 4.2. Verificar Logs

No backend, você deve ver logs como:
```
✅ Google OAuth callback recebido
✅ Token do Google validado
✅ Usuário criado/atualizado: email@example.com
✅ JWT gerado
```

---

## 🚨 Troubleshooting

### Erro: "redirect_uri_mismatch"

**Causa**: A URI de redirecionamento não está configurada no Google Cloud Console.

**Solução**:
1. Vá em **"Credentials"** no Google Cloud Console
2. Edite o OAuth Client ID
3. Adicione exatamente a URI que aparece no erro
4. Aguarde 5 minutos para propagar

### Erro: "invalid_client"

**Causa**: Client ID ou Client Secret incorretos.

**Solução**:
1. Verifique se copiou corretamente do Google Cloud Console
2. Certifique-se de que não há espaços extras
3. Reinicie o backend após alterar o `.env`

### Erro: "access_denied"

**Causa**: Usuário negou permissão ou app está em modo "Testing" sem test users.

**Solução**:
- Se em **Testing**: Adicione o email em "Test users"
- Se em **Production**: Publique o app

---

## 📦 Arquivos Relacionados

### Backend
- `backend/src/controllers/authController.js` - Controller com lógica OAuth
- `backend/src/routes/auth.routes.js` - Rotas de autenticação
- `backend/.env` - Variáveis de ambiente

### Frontend
- `frontend/src/pages/_app.js` - Carrega Google Identity Services
- `frontend/src/pages/login.js` - Página de login com botão Google
- `frontend/src/components/GoogleLogin.js` - Componente de login Google (se houver)

---

## 🔒 Segurança

### ⚠️ IMPORTANTE - NÃO COMMITAR CREDENCIAIS

As credenciais do Google OAuth são **SENSÍVEIS** e não devem ser commitadas no Git.

**Verificar `.gitignore`**:
```gitignore
.env
.env.local
.env.production
.env.*.local
```

### Rotação de Credenciais

Em caso de vazamento:

1. Vá em **"Credentials"** no Google Cloud Console
2. Delete o OAuth Client ID comprometido
3. Crie um novo
4. Atualize o `.env`
5. Reinicie todos os ambientes

---

## ✅ Checklist de Configuração

- [ ] Projeto criado no Google Cloud Console
- [ ] Google+ API ativada
- [ ] OAuth Consent Screen configurado
- [ ] OAuth Client ID criado
- [ ] Authorized JavaScript origins adicionadas
- [ ] Authorized redirect URIs adicionadas
- [ ] `GOOGLE_CLIENT_ID` no `.env` do backend
- [ ] `GOOGLE_CLIENT_SECRET` no `.env` do backend
- [ ] `GOOGLE_REDIRECT_URI` no `.env` do backend
- [ ] Backend reiniciado
- [ ] Teste de login realizado
- [ ] Produção configurada (quando aplicável)

---

## 📞 Suporte

- **Google OAuth Docs**: https://developers.google.com/identity/protocols/oauth2
- **Google Identity Services**: https://developers.google.com/identity/gsi/web

**Criado em**: 2026-01-17
**Última atualização**: 2026-01-17
