# 🧪 GUIA DE TESTES MANUAIS - FLAME

**Data**: 06/12/2025
**URLs**:
- Frontend: https://flame-lounge.vercel.app
- Backend: https://backend-production-28c3.up.railway.app

---

## ✅ STATUS ATUAL DO SISTEMA

### Produtos no Banco:
- **Total**: 20 produtos (não 94!)
- **Motivo**: Os 94 produtos estão no **MOCK** (frontend/src/data/mockData.js)
- **Produtos reais**:
  1. Caipirinha Clássica - R$ 28 (bebida)
  2. Caipirinha - R$ XX (drink autoral)
  3. Gin Tônica - R$ 38 (bebida)
  4. Mojito - R$ 32 (bebida)
  5. Cerveja Heineken - R$ 12 (bebida)
  6. Cerveja Brahma - R$ XX (bebida)
  7. Coca-Cola - R$ 7 (não alcoólica)
  8. Água Mineral - R$ 5 (não alcoólica)
  9. Refrigerante - R$ XX (não alcoólica)
  10. Hambúrguer FLAME - R$ 42 (prato principal)
  11. Picanha na Chapa - R$ XX (prato principal)
  12. Filé com Fritas - R$ XX (prato principal)
  13. Frango Grelhado - R$ XX (prato principal)
  14. Batata Rústica - R$ 32 (petisco)
  15. Batata Frita - R$ XX (porção)
  16. Isca de Frango - R$ XX (petisco)
  17. Polenta Frita - R$ XX (porção)
  18. Mix de Petiscos - R$ XX (petisco)
  19. Petit Gateau - R$ XX (sobremesa)
  20. Pudim - R$ XX (sobremesa)

---

## 📋 TESTES OBRIGATÓRIOS

### TESTE 1: Login dos Usuários ✅

**URL**: https://flame-lounge.vercel.app/login

Testar TODOS os usuários:

1. **Admin**
   - Email: `admin@flamelounge.com.br`
   - Senha: `admin123`
   - ✅ Deve logar com sucesso

2. **Gerente**
   - Email: `gerente@flamelounge.com.br`
   - Senha: `gerente123`
   - ✅ Deve logar com sucesso

3. **Cozinha**
   - Email: `cozinha@flamelounge.com.br`
   - Senha: `cozinha123`
   - ✅ Deve logar e ver painel da cozinha

4. **Bar**
   - Email: `bar@flamelounge.com.br`
   - Senha: `bar123`
   - ✅ Deve logar e ver painel do bar

5. **Atendente**
   - Email: `atendente@flamelounge.com.br`
   - Senha: `atendente123`
   - ✅ Deve logar e ver painel de pedidos

6. **Caixa**
   - Email: `caixa@flamelounge.com.br`
   - Senha: `caixa123`
   - ✅ Deve logar e ver painel do caixa

7. **Cliente Teste**
   - Email: `cliente@flamelounge.com.br`
   - Senha: `cliente123`
   - ✅ Deve logar e ver cardápio

8. **Leonardo (seu usuário)**
   - Email: `leonardo.palha@gmail.com`
   - Senha: (sua senha)
   - ✅ Deve logar com sucesso

---

### TESTE 2: PhoneInput Melhorado ✅

**Página**: Login ou Registro

**O que testar**:
1. ✅ Clicar no botão do país
2. ✅ Deve aparecer dropdown com lista de países
3. ✅ Deve mostrar **código do país** (BR, US, PT) no botão
4. ✅ Buscar país digitando nome ou código
5. ✅ Selecionar país e verificar se muda o formato
6. ✅ Digitar número e apertar **Enter** (deve confirmar)

**Antes**: 🇧🇷 +55 ▼
**Depois**: 🇧🇷 +55
          BR  ▼

---

### TESTE 3: Pedido de BEBIDA (Caipirinha) 🔥

**ESTE É O TESTE MAIS IMPORTANTE!**

**Passos**:
1. Login como cliente (leonardo.palha@gmail.com)
2. Ir no cardápio
3. Adicionar **Caipirinha Clássica** ao pedido
4. Finalizar pedido

**O que DEVE acontecer**:
- ✅ **BAR deve receber notificação IMEDIATAMENTE** (WebSocket)
- ✅ **BAR deve receber Push Notification**
- ✅ **ATENDENTE deve receber notificação**
- ✅ **Estoque deve decrementar** (50 → 49)
- ✅ **Cliente recebe SMS de confirmação** (se pagamento cash)

**Como verificar**:
1. Abrir outra aba do navegador
2. Login como `bar@flamelounge.com.br`
3. Verificar se pedido aparece **IMEDIATAMENTE**
4. Abrir terceira aba
5. Login como `atendente@flamelounge.com.br`
6. Verificar se pedido aparece

---

### TESTE 4: Pedido de COMIDA (Hambúrguer) 🍔

**Passos**:
1. Login como cliente
2. Adicionar **Hambúrguer FLAME** ao pedido
3. Finalizar pedido

**O que DEVE acontecer**:
- ✅ **COZINHA deve receber notificação IMEDIATAMENTE**
- ✅ **COZINHA deve receber Push Notification**
- ✅ **ATENDENTE deve receber notificação**
- ✅ **Estoque deve decrementar** (20 → 19)

**Como verificar**:
1. Login como `cozinha@flamelounge.com.br`
2. Verificar se pedido aparece

---

### TESTE 5: Pedido MISTO (Bebida + Comida) 🍹🍔

**Passos**:
1. Login como cliente
2. Adicionar **Caipirinha + Hambúrguer**
3. Finalizar pedido

**O que DEVE acontecer**:
- ✅ **BAR recebe apenas a Caipirinha**
- ✅ **COZINHA recebe apenas o Hambúrguer**
- ✅ **ATENDENTE recebe AMBOS os itens**
- ✅ **Estoque de ambos decrementado**

---

### TESTE 6: Fluxo Completo de Status ⏭️

**Passos**:
1. Cliente faz pedido
2. Login como `bar@flamelounge.com.br`
3. Alterar status: `pending` → `preparing`
4. Alterar status: `preparing` → `ready`
5. Login como `atendente@flamelounge.com.br`
6. Alterar status: `ready` → `on_way`
7. Alterar status: `on_way` → `delivered`

**O que DEVE acontecer**:
- ✅ Cliente recebe notificação de cada mudança
- ✅ Atendente recebe alerta quando pedido fica `ready`

---

## ⚠️ PROBLEMAS CONHECIDOS

### 1. Produtos do Mock Não Estão no Banco
**Situação**: Você vê 94 produtos no frontend, mas API só tem 20

**Por que**:
- Frontend ainda usa dados do `/frontend/src/data/mockData.js`
- Banco tem apenas 20 produtos reais

**Soluções**:
A. **Desabilitar mock** - Frontend usa API real (20 produtos)
B. **Migrar todos os 94** - Criar endpoint que insere os 94 do mock

**Qual você prefere?**

### 2. Categorias Diferentes
**Problema**: Mock usa categorias como "Drinks Clássicos", mas banco usa "bebidas_alcoolicas"

**Impacto**: Pode haver confusão na categorização

---

## 🔧 COMANDOS ÚTEIS

### Verificar produtos na API:
```bash
curl https://backend-production-28c3.up.railway.app/api/products?limit=100
```

### Inserir mais produtos:
```bash
curl -X POST https://backend-production-28c3.up.railway.app/api/seed-products \
  -H "x-seed-key: FLAME2024SEED"
```

### Verificar saúde do backend:
```bash
curl https://backend-production-28c3.up.railway.app/health
```

---

## ✅ CHECKLIST FINAL

Marque conforme testa:

**Logins**:
- [ ] admin@flamelounge.com.br funciona
- [ ] gerente@flamelounge.com.br funciona
- [ ] cozinha@flamelounge.com.br funciona
- [ ] bar@flamelounge.com.br funciona
- [ ] atendente@flamelounge.com.br funciona
- [ ] caixa@flamelounge.com.br funciona
- [ ] cliente@flamelounge.com.br funciona
- [ ] leonardo.palha@gmail.com funciona

**PhoneInput**:
- [ ] Dropdown abre corretamente
- [ ] Mostra código do país (BR)
- [ ] Busca funciona
- [ ] Enter confirma input

**Fluxo de Pedidos**:
- [ ] Pedido de bebida → BAR recebe IMEDIATAMENTE
- [ ] Pedido de comida → COZINHA recebe IMEDIATAMENTE
- [ ] Pedido misto → BAR e COZINHA recebem suas partes
- [ ] ATENDENTE recebe TODOS os pedidos
- [ ] Estoque atualiza corretamente
- [ ] Cliente recebe notificações de status

**Integrações**:
- [ ] WebSocket funcionando
- [ ] Push Notifications funcionando
- [ ] SMS funcionando (se configurado)

---

## 🚨 SE ALGO NÃO FUNCIONAR

### BAR/COZINHA não recebem pedido:
1. Verificar se funcionário está logado
2. Abrir Console do navegador (F12)
3. Verificar erros de WebSocket
4. Reportar log de erro

### Estoque não atualiza:
1. Verificar via API: GET /api/products/{id}
2. Verificar se produto tem `hasStock: true`
3. Reportar o produto específico

### Login não funciona:
1. Verificar email digitado (sem espaços)
2. Verificar senha (case-sensitive)
3. Limpar cache do navegador
4. Tentar em aba anônima

---

**Boa sorte nos testes!** 🚀

Se encontrar qualquer problema, anote:
- Qual teste estava fazendo
- O que esperava acontecer
- O que aconteceu de fato
- Mensagem de erro (se houver)
