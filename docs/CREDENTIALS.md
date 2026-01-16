# 🔒 CREDENCIAIS E SENHAS

**⚠️ NUNCA ARMAZENE CREDENCIAIS EM ARQUIVOS DE TEXTO NO REPOSITÓRIO!**

---

## Onde Armazenar Credenciais

### Para Desenvolvimento Local

Use arquivos `.env` que estão no `.gitignore`:

```
backend/.env
frontend/.env.local
```

### Para Produção

Use variáveis de ambiente da plataforma de deploy:

- **Vercel:** Dashboard → Settings → Environment Variables
- **Railway:** Dashboard → Variables
- **GitHub Actions:** Settings → Secrets

---

## Gerenciadores de Senhas Recomendados

Para armazenar credenciais da equipe de forma segura:

1. **[1Password](https://1password.com/)** - Recomendado
2. **[LastPass](https://www.lastpass.com/)**
3. **[Bitwarden](https://bitwarden.com/)** - Open source

---

## Credenciais Necessárias

### Backend

- JWT_SECRET
- Database credentials (PostgreSQL)
- Stripe API keys
- SendGrid API key
- Twilio credentials
- VAPID keys (Push notifications)
- Google OAuth credentials

### Frontend

- Stripe publishable key
- Google Maps API key (opcional)
- Google Analytics ID (opcional)

---

## Rotação de Credenciais

Se credenciais foram expostas publicamente:

1. **Revogue imediatamente** as credenciais antigas
2. **Gere novas credenciais** nos respectivos serviços
3. **Atualize** nos ambientes (dev, staging, prod)
4. **Teste** se tudo ainda funciona
5. **Documente** o incidente (data, o que vazou, ações tomadas)

---

## Checklist de Segurança

- [ ] Nenhum arquivo com credenciais no git
- [ ] `.env` e `.env.local` no `.gitignore`
- [ ] Credenciais de produção diferentes de dev
- [ ] Apenas pessoas autorizadas têm acesso
- [ ] Credenciais armazenadas em gerenciador de senhas
- [ ] Rotação periódica de credenciais (a cada 90 dias)

---

**Última atualização:** 2026-01-16
**Por:** MANUS LIA v7.1 (Security Audit)
