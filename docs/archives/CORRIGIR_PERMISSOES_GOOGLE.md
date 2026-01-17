# 🚨 CORRIGIR PERMISSÕES GOOGLE CLOUD

## ❌ PROBLEMA ATUAL

Erro: **"Você precisa de acesso adicional a projeto: flame-lounge"**

**Permissões ausentes**:
- clientauthconfig.brands.get
- clientauthconfig.clients.get
- oauthconfig.testusers.get
- E outras...

## 🔍 CAUSA

Você está tentando acessar um projeto que:
- **NÃO foi criado por você** (foi criado por outra conta Google)
- OU está **logado com conta diferente** da que criou o projeto

## ✅ SOLUÇÕES

### Solução 1: CRIAR NOVO PROJETO (Recomendado - 10 minutos)

Crie um projeto totalmente novo onde você será o proprietário:

#### 1️⃣ Verificar qual conta está logada

No canto superior direito do Google Cloud Console, verifique qual e-mail está aparecendo.

**Deve ser**: `leonardo.palha@gmail.com`

Se estiver outra conta, **troque de conta** antes de continuar.

#### 2️⃣ Criar novo projeto

1. Acesse: https://console.cloud.google.com/
2. No topo, clique no **seletor de projeto** (ao lado de "Google Cloud")
3. Clique **"NEW PROJECT"** (Novo Projeto)
4. Preencha:
   - **Project name**: `FLAME Lounge Prod`
   - **Organization**: Deixe como "No organization"
   - **Location**: Deixe como está
5. Clique **CREATE**

#### 3️⃣ Ativar Google+ API

1. Com o novo projeto selecionado, vá em: **APIs & Services** → **Library**
2. Busque: **"Google+ API"**
3. Clique **ENABLE**

#### 4️⃣ Configurar OAuth Consent Screen

1. Vá em: **APIs & Services** → **OAuth consent screen**
2. Escolha: **External**
3. Clique **CREATE**

**Preencha**:
- **App name**: `FLAME Lounge`
- **User support email**: `leonardo.palha@gmail.com`
- **Authorized domains**: Adicione:
  - `vercel.app`
- **Developer contact email**: `leonardo.palha@gmail.com`

Clique **SAVE AND CONTINUE**.

**Scopes**:
- Clique **ADD OR REMOVE SCOPES**
- Selecione:
  - `email`
  - `profile`
  - `openid`
- Clique **UPDATE** → **SAVE AND CONTINUE**

**Test users** (IMPORTANTE):
- Clique **+ ADD USERS**
- Adicione: `leonardo.palha@gmail.com`
- Clique **ADD** → **SAVE AND CONTINUE**

Clique **BACK TO DASHBOARD**.

#### 5️⃣ Criar OAuth Client ID

1. Vá em: **APIs & Services** → **Credentials**
2. Clique **+ CREATE CREDENTIALS** → **OAuth client ID**
3. **Application type**: **Web application**

**Preencha**:
- **Name**: `FLAME Web Client`

**Authorized JavaScript origins**:
```
http://localhost:3000
https://flame-lounge.vercel.app
```

**Authorized redirect URIs**:
```
http://localhost:3000
https://flame-lounge.vercel.app
```

Clique **CREATE**.

#### 6️⃣ Copiar credenciais

Na janela popup, copie:
- **Client ID**: `xxxxx-xxxxx.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-xxxxxxxxxxxxx`

⚠️ **GUARDE EM LOCAL SEGURO!**

#### 7️⃣ Atualizar Vercel

```bash
# Remover variável antiga
vercel env rm NEXT_PUBLIC_GOOGLE_CLIENT_ID production

# Adicionar nova (substitua pelo SEU novo Client ID)
printf "SEU_NOVO_CLIENT_ID.apps.googleusercontent.com" | vercel env add NEXT_PUBLIC_GOOGLE_CLIENT_ID production

# Deploy
cd d:\flame\frontend
vercel --prod
```

#### 8️⃣ Atualizar Railway

```bash
cd d:\flame\backend

# Atualizar Client ID
railway variables set GOOGLE_CLIENT_ID="SEU_NOVO_CLIENT_ID.apps.googleusercontent.com"

# Atualizar Client Secret
railway variables set GOOGLE_CLIENT_SECRET="SEU_NOVO_CLIENT_SECRET"

# Deploy
railway up
```

#### 9️⃣ Aguardar e testar

```bash
# Aguardar backend (60 segundos)
timeout 60 bash -c 'while true; do status=$(curl -s https://backend-production-28c3.up.railway.app/health 2>/dev/null | grep -o "ok" || echo "waiting"); if [ "$status" = "ok" ]; then echo "✅ Backend ready!"; break; fi; echo "⏳ Aguardando..."; sleep 5; done'
```

Depois acesse: https://flame-lounge.vercel.app/login

---

### Solução 2: Obter acesso ao projeto existente

Se o projeto "flame-lounge" foi criado por você mas com outra conta:

1. **Descubra qual conta criou o projeto**
2. **Faça login com essa conta** no Google Cloud Console
3. **Configure o OAuth Client** com essa conta

OU

1. **Peça ao proprietário do projeto** para adicionar `leonardo.palha@gmail.com` como **Owner**
2. No projeto, vá em: **IAM & Admin** → **IAM**
3. Clique **+ GRANT ACCESS**
4. Adicione: `leonardo.palha@gmail.com`
5. Papel: **Owner**

---

## 🎯 RECOMENDAÇÃO

**Crie um NOVO projeto** (Solução 1). É mais rápido e você terá controle total.

O projeto "flame-lounge" parece ter sido criado automaticamente por alguma integração ou está inacessível.

---

## ✅ CHECKLIST

Após criar o novo projeto e configurar:

- [ ] Novo projeto Google Cloud criado
- [ ] Google+ API ativada
- [ ] OAuth Consent Screen configurado
- [ ] Usuário de teste `leonardo.palha@gmail.com` adicionado
- [ ] OAuth Client ID criado
- [ ] JavaScript origins e Redirect URIs configuradas
- [ ] Client ID e Secret copiados
- [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID` atualizado no Vercel
- [ ] `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` atualizados no Railway
- [ ] Deploy realizado em ambos (Vercel e Railway)
- [ ] Testado login em https://flame-lounge.vercel.app/login

---

**Data**: 06/12/2025
**Status**: 🚨 AGUARDANDO CRIAÇÃO DE NOVO PROJETO
