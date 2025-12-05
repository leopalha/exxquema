# 🌐 Tutorial: Configurar DNS para www.flamelounge.com.br no Vercel

## 📋 Pré-requisitos
- Domínio **flamelounge.com.br** já registrado
- Acesso ao painel do seu provedor de domínio (Registro.br, HostGator, GoDaddy, etc.)
- Projeto FLAME já deployado no Vercel

---

## 🎯 Passo 1: Adicionar Domínio no Vercel

### 1.1 Acessar o Projeto no Vercel
1. Entre em https://vercel.com
2. Faça login com sua conta
3. Clique no projeto **flame** (leopalhas-projects/flame)

### 1.2 Adicionar o Domínio
1. Vá na aba **Settings** (Configurações)
2. No menu lateral, clique em **Domains** (Domínios)
3. Clique no botão **Add Domain**
4. Digite: `flamelounge.com.br`
5. Clique em **Add**

### 1.3 Adicionar também o www
1. Repita o processo acima
2. Digite: `www.flamelounge.com.br`
3. Clique em **Add**

**Resultado:** Vercel vai mostrar os registros DNS que você precisa configurar.

---

## 🔧 Passo 2: Configurar DNS no Provedor do Domínio

O Vercel vai pedir 2 tipos de configuração:

### Opção A: Nameservers da Vercel (RECOMENDADO - Mais Fácil)

Se o Vercel oferecer usar os nameservers deles, você verá algo como:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**Como configurar:**

1. Acesse o painel do seu provedor (exemplo: Registro.br)
2. Vá em **Gerenciar DNS** ou **Nameservers**
3. Troque os nameservers atuais por:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
4. Salve as alterações

✅ **Vantagem:** Vercel gerencia tudo automaticamente (SSL, redirecionamentos, etc)
⏰ **Tempo:** 24-48 horas para propagar

---

### Opção B: Registros DNS Manuais (Se não puder mudar nameservers)

O Vercel vai mostrar registros específicos. Você precisa adicionar estes no seu provedor:

#### 2.1 Para o domínio raiz (flamelounge.com.br)

**Tipo A:**
```
Tipo: A
Nome: @ (ou deixe em branco)
Valor: 76.76.21.21
TTL: 3600
```

**OU Tipo CNAME (depende do provedor):**
```
Tipo: CNAME
Nome: @ (ou deixe em branco)
Valor: cname.vercel-dns.com
TTL: 3600
```

#### 2.2 Para www (www.flamelounge.com.br)

**Tipo CNAME:**
```
Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
TTL: 3600
```

---

## 📝 Passo 3: Configuração no Provedor (Exemplos)

### Se seu domínio está no Registro.br:

1. Acesse https://registro.br
2. Faça login
3. Vá em **Meus Domínios**
4. Clique em **flamelounge.com.br**
5. Clique em **Editar Zona DNS**
6. Adicione os registros conforme Opção A ou B acima
7. Clique em **Salvar**

### Se seu domínio está em outro provedor (GoDaddy, HostGator, etc):

1. Acesse o painel do seu provedor
2. Procure por **DNS Management** ou **Gerenciar DNS**
3. Adicione os registros conforme mostrado no Vercel
4. Salve as alterações

---

## 🔐 Passo 4: SSL Automático (HTTPS)

O Vercel **configura SSL automaticamente** assim que o DNS propagar!

✅ Não precisa fazer nada, aguarde 5-10 minutos após o DNS estar correto.

Você verá o cadeado 🔒 no navegador quando estiver pronto.

---

## ✅ Passo 5: Verificar Configuração

### 5.1 Verificar DNS
Após configurar, aguarde alguns minutos e teste:

```bash
# Windows (PowerShell)
nslookup flamelounge.com.br
nslookup www.flamelounge.com.br

# Mac/Linux (Terminal)
dig flamelounge.com.br
dig www.flamelounge.com.br
```

Deve mostrar o IP da Vercel: **76.76.21.21**

### 5.2 Testar no Navegador
Acesse:
- https://flamelounge.com.br
- https://www.flamelounge.com.br

Ambos devem carregar o site FLAME! 🎉

---

## ⏰ Tempo de Propagação

| Ação | Tempo Médio |
|------|-------------|
| Adicionar registro DNS | 5-30 minutos |
| Nameservers | 24-48 horas |
| SSL/HTTPS ativado | 5-10 minutos após DNS |

💡 **Dica:** Use modo anônimo do navegador para testar sem cache!

---

## 🔄 Redirecionamentos Automáticos

O Vercel configura automaticamente:

✅ `http://` → `https://` (Force HTTPS)
✅ `flamelounge.com.br` → `www.flamelounge.com.br` (ou vice-versa)

Você pode escolher qual preferir nas configurações do domínio no Vercel.

---

## ❌ Problemas Comuns

### "Domain not configured correctly"
- **Causa:** DNS ainda não propagou
- **Solução:** Aguarde 24-48h ou verifique os registros DNS

### "SSL Certificate Error"
- **Causa:** SSL ainda não foi emitido
- **Solução:** Aguarde 10 minutos, o Vercel emite automaticamente

### "DNS_PROBE_FINISHED_NXDOMAIN"
- **Causa:** Registro DNS incorreto
- **Solução:** Revise os valores copiados do Vercel

### O site demora para carregar
- **Causa:** DNS ainda propagando
- **Solução:** Limpe cache do navegador (Ctrl + Shift + Del)

---

## 📞 Suporte

Se tiver problemas:

1. **Vercel Support:** https://vercel.com/support
2. **Registro.br:** https://registro.br/ajuda/
3. **Verificar DNS:** https://dnschecker.org

---

## ✅ Checklist Final

- [ ] Domínio adicionado no Vercel
- [ ] Registros DNS configurados no provedor
- [ ] Aguardado tempo de propagação (24-48h)
- [ ] Testado https://flamelounge.com.br
- [ ] Testado https://www.flamelounge.com.br
- [ ] SSL ativo (cadeado 🔒 aparecendo)
- [ ] Redirecionamentos funcionando

---

## 🎉 Pronto!

Após seguir todos os passos, seu site estará acessível em:

**🔥 https://www.flamelounge.com.br**

O domínio antigo (vercel.app) continuará funcionando como alternativa.

---

*Criado em: 04/12/2024*
*Projeto: FLAME Lounge Bar*
