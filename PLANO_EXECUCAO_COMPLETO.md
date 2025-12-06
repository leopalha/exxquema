# 📋 PLANO DE EXECUÇÃO COMPLETO - FLAME

**Data**: 06/12/2025
**Objetivo**: Migrar de sistema mock para produção real com todos os fluxos funcionando

---

## 🎯 PROBLEMAS IDENTIFICADOS E SOLUÇÕES

### 1️⃣ PHONEINPUT - NÚMERO NÃO REGISTRA

#### Problema Reportado:
> "aparece, mas ai eu insiro o numero dou enter o numero nao é registrado decidamente e fica la congelado o +55"

#### Análise:
**Arquivo**: [PhoneInput.js:165-174](frontend/src/components/PhoneInput.js#L165)

```javascript
const handlePhoneChange = (e) => {
  const input = e.target.value;
  const formatted = formatPhoneNumber(input, selectedCountry.format);
  setPhoneNumber(formatted);  // ✅ Atualiza state local

  if (onChange) {
    const fullNumber = selectedCountry.dial + getPhoneNumbers(formatted);
    onChange(fullNumber);  // ✅ Envia para parent component
  }
};
```

**O código está correto**, mas há 2 problemas UX:

1. **Não mostra nome do país** - só mostra bandeira e código
2. **Enter não confirma** - precisa clicar fora ou tab

#### Solução:

**A. Mostrar nome do país após selecionar**:
```javascript
// PhoneInput.js - Linha 196 (dentro do botão)
<button className="...">
  <span className="text-xl">{selectedCountry.flag}</span>
  <div className="flex flex-col items-start">
    <span className="text-white text-xs">{selectedCountry.code}</span>
    <span className="text-neutral-400 text-[10px]">{selectedCountry.name}</span>
  </div>
  <span className="text-white text-sm font-medium">{selectedCountry.dial}</span>
  <ChevronDown className="..." />
</button>
```

**B. Adicionar handler para Enter**:
```javascript
const handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    if (onBlur) onBlur();
  }
};

// No input (linha 258)
<input
  onKeyDown={handleKeyDown}
  // ... resto
/>
```

**Tempo estimado**: 10 minutos

---

### 2️⃣ MIGRAÇÃO PRODUTOS MOCK → BANCO REAL

#### Situação Atual:
- ✅ **134 produtos mockados** em mockData.js
- ✅ **13 categorias** definidas
- ✅ **API de produtos funcionando** (backend/routes/products.js)
- ✅ **Endpoint POST /products** para criar produtos
- ❌ **Banco vazio** - nenhum produto cadastrado

#### Decisão do Usuário:
> "vc nao acha melhor criar logo esses itens do cardapio no banco de dados como definitivos e eu la pelo admin se quiser adicionar ou excluir decidir o que fazer? assim a gente nao perde tempo mexendo em mock e ja trabalha com coisas reais..."

✅ **APROVADO** - Abandonar mock e trabalhar com dados reais

#### Categorias dos 134 Produtos:

1. **Drinks Clássicos** (15 produtos)
2. **Signature Drinks** (14 produtos)
3. **Drinks Tropicais** (8 produtos)
4. **Coquetéis Zero** (9 produtos)
5. **Petiscos** (12 produtos)
6. **Pratos Principais** (10 produtos)
7. **Sobremesas** (8 produtos)
8. **Bebidas sem Álcool** (10 produtos)
9. **Cervejas** (12 produtos)
10. **Vinhos** (11 produtos)
11. **Destilados** (12 produtos)
12. **Narguilés** (8 produtos)
13. **Combos** (5 produtos)

**Total**: 134 produtos prontos para migração

#### Solução Proposta:

**Opção A: Script de Seed Automático** (RECOMENDADO)

Criar endpoint `/api/seed-products` que:
1. Lê os 134 produtos do mockData.js
2. Converte formato mock → formato banco
3. Insere todos de uma vez via bulk insert
4. Retorna relatório de sucesso

**Vantagens**:
- Rápido (1 request, todos os produtos)
- Replicável (pode executar em staging/produção)
- Seguro (usa mesma validação da API)

**Código**:
```javascript
// backend/src/routes/seed-route.js (adicionar)

router.post('/seed-products', async (req, res) => {
  const secretKey = req.headers['x-seed-key'] || req.body.secretKey;
  if (secretKey !== 'FLAME2024SEED') {
    return res.status(403).json({ success: false, message: 'Chave inválida' });
  }

  try {
    // Importar produtos do frontend (converter para backend)
    const mockProducts = [/* copiar de mockData.js */];

    const results = [];
    let position = 1;

    for (const mockProduct of mockProducts) {
      const [product, created] = await Product.findOrCreate({
        where: { name: mockProduct.nome },
        defaults: {
          name: mockProduct.nome,
          description: mockProduct.descricao,
          price: mockProduct.preco,
          category: mockProduct.categoria,
          image: mockProduct.imagem,
          ingredients: mockProduct.ingredientes,
          tags: mockProduct.tags || [],
          isActive: mockProduct.disponivel !== false,
          isFeatured: mockProduct.destaque || false,
          hasStock: mockProduct.estoque !== undefined,
          stock: mockProduct.estoque || 0,
          minStock: 5,
          position: position++,
          preparationTime: 15,
          // Campos adicionais do mock
          alcoholicContent: mockProduct.teorAlcoolico,
          volume: mockProduct.volume,
          spiceLevel: mockProduct.nivelPicancia,
          allergens: mockProduct.alergenos ? [mockProduct.alergenos] : [],
          dietary: mockProduct.dietetico ? [mockProduct.dietetico] : [],
          calories: mockProduct.calorias
        }
      });

      results.push({
        nome: mockProduct.nome,
        categoria: mockProduct.categoria,
        created,
        id: product.id
      });
    }

    const createdCount = results.filter(r => r.created).length;
    const existingCount = results.filter(r => !r.created).length;

    res.json({
      success: true,
      message: `${createdCount} produtos criados, ${existingCount} já existiam`,
      data: {
        created: createdCount,
        existing: existingCount,
        total: results.length,
        products: results
      }
    });
  } catch (error) {
    console.error('Seed products error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
```

**Opção B: Interface Admin Manual** (NÃO RECOMENDADO)

Cadastrar 134 produtos manualmente via interface admin.

**Desvantagens**:
- Muito trabalhoso (134 cliques)
- Propenso a erros
- Não replicável

#### Decisão: USAR OPÇÃO A

**Tempo estimado**: 30 minutos (criar endpoint + testar + executar)

---

### 3️⃣ FLUXO DE PEDIDOS COMPLETO

#### Problema Atual:

```
createOrder() [orderController.js:11]
  ├─ ✅ Cria pedido
  ├─ ✅ Atualiza estoque
  ├─ ✅ Registra inventário
  ├─ Cria pagamento
  └─ ❌ NÃO NOTIFICA BAR/COZINHA/ATENDENTES

confirmPayment() [orderController.js:295]
  ├─ Confirma pedido
  └─ ✅ Aqui sim notifica (tarde demais!)
```

**Consequência**: Bar/Cozinha só vê pedido DEPOIS do pagamento confirmado.

#### Solução Completa:

**A. Notificar IMEDIATAMENTE após criar pedido** (linhas 140-170):

```javascript
// orderController.js - ANTES da linha 171 (antes do res.status)

// ========================================
// NOTIFICAÇÕES IMEDIATAS
// ========================================

// 1. WebSocket: Notificar cozinha/bar/atendentes
socketService.notifyNewOrder(completeOrder);

// 2. Push Notification: Notificar funcionários
try {
  await pushService.notifyNewOrder(completeOrder);
} catch (pushError) {
  console.error('⚠️ Erro ao enviar push:', pushError);
  // Não falha pedido se push der erro
}

// 3. SMS: Enviar confirmação (se pagamento cash)
if (paymentMethod === 'cash') {
  try {
    await smsService.sendOrderConfirmation(
      req.user.celular,
      order.orderNumber,
      order.estimatedTime
    );
  } catch (smsError) {
    console.error('⚠️ Erro ao enviar SMS:', smsError);
  }
}

// Retornar pedido criado
res.status(201).json({...});
```

**B. Evitar duplicação no confirmPayment**:

```javascript
// orderController.js - Linha 334

// Só notifica se ainda estava pending (evita duplicação)
const wasPending = order.status === 'pending';

// Atualizar status
await order.update({
  status: 'confirmed',
  paymentStatus: 'completed',
  paymentId
});

// Buscar pedido completo
const completeOrder = await Order.findByPk(...);

// Só notifica se não notificou antes
if (wasPending) {
  socketService.notifyNewOrder(completeOrder);
  await pushService.notifyNewOrder(completeOrder);
}

// SMS sempre envia (confirma pagamento)
await smsService.sendOrderConfirmation(...);
```

**C. Verificar categorização** (já implementado):

O código em [socket.service.js:185-244](backend/src/services/socket.service.js#L185) JÁ categoriza corretamente:

```javascript
if (category.includes('bebida') || category.includes('drink')) {
  drinkItems.push(item); // → BAR
} else if (category.includes('nargui') || category.includes('hookah')) {
  hookahItems.push(item); // → BAR
} else {
  foodItems.push(item); // → COZINHA
}
```

✅ **Lógica correta** - só precisa ser chamada!

**Tempo estimado**: 20 minutos

---

### 4️⃣ SINCRONIZAÇÃO CAIXA E ESTOQUE

#### Requisito do Usuário:
> "deveria ser alem disso sincronizado com caixa e estoque tudo..."

#### Fluxo Ideal:

```
CLIENTE FAZ PEDIDO
  ↓
createOrder()
  ├─ ✅ Decrementa estoque (linha 98)
  ├─ ✅ Registra movimento inventário (linha 105)
  ├─ ✅ Notifica bar/cozinha (após correção)
  └─ ✅ Notifica atendentes (após correção)
  ↓
confirmPayment()
  ├─ ✅ Registra venda no caixa
  ├─ Atualiza métricas do dia
  └─ Atualiza total de vendas do cliente
  ↓
updateOrderStatus('preparing')
  └─ ✅ Notifica atendentes (já implementado)
  ↓
updateOrderStatus('ready')
  └─ ✅ Notifica atendentes para retirar (já implementado)
  ↓
updateOrderStatus('on_way')
  └─ ✅ Notifica que pedido saiu (já implementado)
  ↓
updateOrderStatus('delivered')
  ├─ ✅ Fecha pedido
  ├─ Atualiza métricas cliente (totalOrders, totalSpent)
  └─ Adiciona cashback
```

#### Status Atual:

**Estoque**:
- ✅ Atualização automática implementada (linha 98-101)
- ✅ Registro de movimento implementado (linha 105-117)
- ✅ Alerta de estoque baixo implementado

**Caixa**:
- ❓ Precisa verificar se `confirmPayment` atualiza caixa
- ❓ Precisa verificar relatórios diários

#### Verificações Necessárias:

```javascript
// Verificar se existe:
// 1. Modelo de Caixa/Cashier
// 2. Registro de vendas no caixa
// 3. Fechamento de caixa
// 4. Relatórios financeiros
```

**Arquivos a verificar**:
- backend/src/models/ (Cashier.js, CashierMovement.js)
- backend/src/routes/cashier.routes.js
- backend/src/controllers/cashierController.js

**Tempo estimado**: 30 minutos (verificação + implementação se necessário)

---

## 📊 ORDEM DE EXECUÇÃO RECOMENDADA

### FASE 1: PREPARAÇÃO (1 hora)

#### 1.1 Criar Endpoint de Seed Products (30 min)
- [ ] Criar `/api/seed-products` em seed-route.js
- [ ] Converter 134 produtos mockData → formato banco
- [ ] Testar endpoint localmente
- [ ] Executar seed em produção (Railway)
- [ ] Verificar produtos via `/api/products`

#### 1.2 Desabilitar Mock em Produção (10 min)
- [ ] Atualizar `.env.production` com `NEXT_PUBLIC_API_URL`
- [ ] Remover ou ocultar `MockDataToggle` em produção
- [ ] Garantir que productStore usa API real

#### 1.3 Melhorias PhoneInput (10 min)
- [ ] Adicionar nome do país no botão
- [ ] Adicionar handler para tecla Enter
- [ ] Testar em login e registro

#### 1.4 Verificar Sistema de Caixa (10 min)
- [ ] Verificar se modelo Cashier existe
- [ ] Verificar se confirmPayment atualiza caixa
- [ ] Verificar relatórios financeiros

---

### FASE 2: CORREÇÕES CRÍTICAS (30 min)

#### 2.1 Corrigir Notificações de Pedidos (20 min)
- [ ] Adicionar `socketService.notifyNewOrder()` em createOrder (linha 171)
- [ ] Adicionar `pushService.notifyNewOrder()` em createOrder
- [ ] Adicionar SMS para pagamento cash
- [ ] Modificar confirmPayment para evitar duplicação
- [ ] Commit: "fix: enviar notificações imediatamente ao criar pedido"

#### 2.2 Deploy Backend (10 min)
- [ ] `cd backend && railway up`
- [ ] Aguardar deploy completo
- [ ] Verificar logs do Railway
- [ ] Testar health endpoint

---

### FASE 3: TESTES E2E (30 min)

#### 3.1 Teste de Fluxo Completo - Bebida
- [ ] Login como cliente (leonardo.palha@gmail.com)
- [ ] Fazer pedido de Caipirinha (categoria: Drinks Clássicos)
- [ ] ✅ Verificar: BAR recebe notificação WebSocket
- [ ] ✅ Verificar: BAR recebe Push Notification
- [ ] ✅ Verificar: Atendente recebe notificação
- [ ] ✅ Verificar: Estoque foi decrementado
- [ ] ✅ Verificar: Movimento de inventário registrado

#### 3.2 Teste de Fluxo Completo - Comida
- [ ] Fazer pedido de Hambúrguer FLAME (categoria: Pratos Principais)
- [ ] ✅ Verificar: COZINHA recebe notificação
- [ ] ✅ Verificar: Atendente recebe notificação
- [ ] ✅ Verificar: Estoque atualizado

#### 3.3 Teste de Fluxo Completo - Pedido Misto
- [ ] Fazer pedido: 1 Caipirinha + 1 Hambúrguer
- [ ] ✅ Verificar: BAR recebe caipirinha
- [ ] ✅ Verificar: COZINHA recebe hambúrguer
- [ ] ✅ Verificar: Atendente recebe ambos

#### 3.4 Teste de Mudança de Status
- [ ] Login como funcionário (bar@flamelounge.com.br)
- [ ] Alterar status pedido: preparing → ready → on_way → delivered
- [ ] ✅ Verificar: Cliente recebe notificações de status
- [ ] ✅ Verificar: Atendente recebe alertas apropriados

#### 3.5 Teste de Caixa
- [ ] Verificar registro de venda no caixa
- [ ] Verificar total do dia
- [ ] Verificar cashback do cliente

---

## 🔧 ARQUIVOS QUE SERÃO MODIFICADOS

### Backend:

1. **backend/src/routes/seed-route.js** (NOVO)
   - Adicionar endpoint `/seed-products`
   - Inserir 134 produtos no banco

2. **backend/src/controllers/orderController.js**
   - Linha ~171: Adicionar notificações em `createOrder()`
   - Linha ~334: Modificar `confirmPayment()` para evitar duplicação

### Frontend:

3. **frontend/src/components/PhoneInput.js**
   - Linha ~196: Adicionar nome do país no botão
   - Linha ~258: Adicionar handler Enter no input

4. **frontend/.env.production**
   - Garantir `NEXT_PUBLIC_API_URL=https://backend-production-28c3.up.railway.app`

---

## 📈 RESULTADOS ESPERADOS

### Após Implementação:

✅ **Sistema de Produtos**:
- 134 produtos reais no banco de dados
- Cardápio funcionando via API
- Mock desabilitado em produção
- Admin pode adicionar/editar produtos

✅ **Fluxo de Pedidos**:
- Cliente faz pedido → Bar/Cozinha recebe IMEDIATAMENTE
- Categorização automática (bebida→bar, comida→cozinha)
- Atendentes recebem todos os pedidos
- Push notifications funcionando
- SMS de confirmação enviado

✅ **Estoque**:
- Atualização automática ao criar pedido
- Registro de movimentos de inventário
- Alertas de estoque baixo

✅ **Caixa** (se implementado):
- Registro automático de vendas
- Relatórios diários
- Fechamento de caixa

✅ **UX PhoneInput**:
- Mostra nome do país selecionado
- Aceita Enter para confirmar
- Mais intuitivo para o usuário

---

## ⚠️ RISCOS E MITIGAÇÕES

### Risco 1: Seed Products Falhar
**Mitigação**: Criar produtos em lotes (10-20 por vez), log detalhado de erros

### Risco 2: Notificações Duplicadas
**Mitigação**: Verificar status do pedido antes de notificar

### Risco 3: Estoque Negativo
**Mitigação**: Validação já implementada (linha 34-39 orderController)

### Risco 4: WebSocket Desconectado
**Mitigação**: Push notification como backup

---

## 🎯 MÉTRICAS DE SUCESSO

- [ ] 134 produtos cadastrados no banco
- [ ] Mock desabilitado em produção
- [ ] Bar recebe pedidos de bebidas em < 2 segundos
- [ ] Cozinha recebe pedidos de comida em < 2 segundos
- [ ] Atendentes recebem todas as notificações
- [ ] Estoque atualizado corretamente em 100% dos pedidos
- [ ] Zero duplicação de notificações
- [ ] PhoneInput com UX melhorada

---

## 📝 CHECKLIST PRÉ-EXECUÇÃO

- [ ] Backup do banco de dados produção
- [ ] Railway CLI configurado
- [ ] Vercel CLI configurado
- [ ] Acesso admin ao sistema
- [ ] Usuários de teste criados (✅ já feito)
- [ ] Backend online e saudável

---

**Aprovação necessária antes de iniciar**: SIM ✋

**Perguntas para o usuário**:
1. ✅ Confirma migração completa de mock → banco real?
2. ✅ Confirma desabilitar mock em produção?
3. ❓ Quer que eu execute TUDO de uma vez ou fase por fase?
4. ❓ Tem backup do banco de dados produção?

**Próximo passo**: Aguardar aprovação do usuário para iniciar FASE 1
