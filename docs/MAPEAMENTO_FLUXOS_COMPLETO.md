# MAPEAMENTO COMPLETO DE FLUXOS - FLAME

## STATUS POSSÍVEIS

### Order Status (Pedido)
| Status | Descrição | Quem Altera |
|--------|-----------|-------------|
| `pending` | Pedido criado, aguardando pagamento online (PIX/Cartão) | Sistema |
| `pending_payment` | Aguardando pagamento com atendente (dinheiro/cartão na mesa) | Sistema |
| `confirmed` | Pagamento confirmado, vai para produção | Stripe webhook / Atendente |
| `preparing` | Em preparo na cozinha/bar | Cozinheiro / Bartender |
| `ready` | Pronto para entrega | Cozinheiro / Bartender |
| `on_way` | Atendente retirou da cozinha | Atendente |
| `delivered` | Entregue na mesa | Atendente |
| `cancelled` | Cancelado | Cliente / Admin |

### Payment Status (Pagamento)
| Status | Descrição |
|--------|-----------|
| `pending` | Aguardando pagamento |
| `processing` | Processando no Stripe |
| `completed` | Pagamento confirmado |
| `failed` | Pagamento falhou |
| `refunded` | Reembolsado |

### Payment Methods (Formas de Pagamento)
| Método | Tipo | Fluxo |
|--------|------|-------|
| `credit_card` | Online (Stripe) | Paga antes → vai direto para produção |
| `debit_card` | Online (Stripe) | Paga antes → vai direto para produção |
| `pix` | Online (Stripe) | Paga antes → vai direto para produção |
| `apple_pay` | Online (Stripe) | Paga antes → vai direto para produção |
| `cash` | Com Atendente | Aguarda atendente → confirma → produção |
| `pay_later` | Com Atendente | Aguarda atendente → confirma → produção |
| `card_at_table` | Com Atendente | Aguarda atendente → confirma → produção |
| `split` | Com Atendente | Aguarda atendente → confirma → produção |

---

## FLUXO 1: PEDIDO COM PAGAMENTO ONLINE (PIX/Cartão)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FLUXO: PAGAMENTO ONLINE                               │
└─────────────────────────────────────────────────────────────────────────────┘

CLIENTE                    STRIPE                    BACKEND                 STAFF
   │                          │                         │                      │
   ├─── Faz pedido ──────────►│                         │                      │
   │    (PIX/Cartão)          │                         │                      │
   │                          │                         │                      │
   │◄── PaymentIntent ────────┤                         │                      │
   │    (clientSecret)        │                         │                      │
   │                          │                         │                      │
   ├─── Confirma pagamento ──►│                         │                      │
   │                          │                         │                      │
   │                          ├─── Webhook ────────────►│                      │
   │                          │    (succeeded)          │                      │
   │                          │                         │                      │
   │                          │                         ├─── Socket.IO ───────►│
   │                          │                         │    (order_created)   │
   │                          │                         │                      │
   │◄── Push notification ────┼─────────────────────────┤                      │
   │    "Pedido confirmado"   │                         │                      │
   │                          │                         │                      │

STATUS: pending → confirmed → preparing → ready → on_way → delivered
PAYMENT: pending → processing → completed
```

### O que acontece em cada etapa:
1. **Cliente faz pedido**:
   - Cria pedido com status `pending`
   - Reserva estoque
   - Deduz cashback (se usado)

2. **Stripe processa**:
   - Cria PaymentIntent
   - Cliente paga
   - Webhook dispara

3. **Backend confirma**:
   - Atualiza status para `confirmed`
   - Notifica cozinha/bar via Socket.IO
   - Envia push notification

---

## FLUXO 2: PEDIDO COM ATENDENTE (Dinheiro/Cartão na Mesa)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FLUXO: PAGAR COM ATENDENTE                            │
└─────────────────────────────────────────────────────────────────────────────┘

CLIENTE                    ATENDENTE                 BACKEND                 STAFF
   │                          │                         │                      │
   ├─── Faz pedido ──────────►│                         │                      │
   │    (pay_later)           │                         │                      │
   │                          │                         │                      │
   │                          │◄── Notificação ─────────┤                      │
   │                          │    "Pagto pendente"     │                      │
   │                          │                         │                      │
   │◄── Vai à mesa ───────────┤                         │                      │
   │    receber pagamento     │                         │                      │
   │                          │                         │                      │
   │─── Paga ─────────────────►│                         │                      │
   │    (dinheiro/cartão)     │                         │                      │
   │                          │                         │                      │
   │                          ├─── POST /confirm ──────►│                      │
   │                          │    paymentMethod        │                      │
   │                          │                         │                      │
   │                          │                         ├─── Socket.IO ───────►│
   │                          │                         │    (order_created)   │
   │                          │                         │                      │
   │◄── Push ─────────────────┼─────────────────────────┤                      │
   │    "Preparando"          │                         │                      │
   │                          │                         │                      │

STATUS: pending_payment → confirmed → preparing → ready → on_way → delivered
PAYMENT: pending → completed
```

### O que acontece:
1. **Cliente escolhe "Pagar com Atendente"**:
   - Status vai para `pending_payment` (NÃO vai para cozinha ainda!)
   - Reserva estoque
   - Notifica atendentes via Socket.IO

2. **Atendente recebe pagamento**:
   - Abre modal, seleciona método real (crédito/débito/pix/dinheiro)
   - Confirma via `POST /orders/:id/confirm-payment`
   - Registra movimento no caixa

3. **Backend confirma**:
   - Atualiza para `confirmed`
   - AGORA notifica cozinha/bar

---

## FLUXO 3: CANCELAMENTO DE PEDIDO

### 3.1 Quem pode cancelar?

| Status do Pedido | Cliente | Atendente | Admin |
|------------------|---------|-----------|-------|
| `pending` | ✅ | ✅ | ✅ |
| `pending_payment` | ✅ | ✅ | ✅ |
| `confirmed` | ✅ (até 5 min?) | ✅ | ✅ |
| `preparing` | ❌ | ⚠️ (com perda) | ✅ |
| `ready` | ❌ | ❌ | ⚠️ |
| `on_way` | ❌ | ❌ | ❌ |
| `delivered` | ❌ | ❌ | ❌ |

### 3.2 O que acontece no cancelamento?

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FLUXO: CANCELAMENTO                                   │
└─────────────────────────────────────────────────────────────────────────────┘

CLIENTE                    BACKEND                   STRIPE                  STAFF
   │                          │                         │                      │
   ├─── Cancela pedido ──────►│                         │                      │
   │    PATCH /orders/:id/    │                         │                      │
   │    cancel                │                         │                      │
   │                          │                         │                      │
   │                          ├─── cancelPayment() ────►│                      │
   │                          │    (se tiver paymentId) │                      │
   │                          │                         │                      │
   │                          │◄── OK ──────────────────┤                      │
   │                          │                         │                      │
   │                          ├─── Restaura estoque     │                      │
   │                          │                         │                      │
   │                          ├─── Devolve cashback     │                      │
   │                          │    (se usou)            │                      │
   │                          │                         │                      │
   │                          ├─── Socket.IO ──────────────────────────────────►│
   │                          │    (order_cancelled)    │                      │
   │                          │                         │                      │
   │◄── { success: true } ────┤                         │                      │
   │                          │                         │                      │
```

### 3.3 Detalhes do cancelamento atual

**✅ O que FUNCIONA:**
| Ação | Implementado? | Arquivo |
|------|---------------|---------|
| Verificar se pode cancelar | ✅ | Order.canBeCancelled() |
| Cancelar PaymentIntent no Stripe | ✅ | paymentService.cancelPayment() |
| Restaurar estoque | ✅ | Product.increment('stock') |
| Registrar movimento inventário | ✅ | InventoryService.recordMovement() |
| Devolver cashback usado | ✅ | user.addCashback() |
| Notificar staff via Socket | ✅ | socketService.notifyOrderStatusChange() |

**⚠️ PROBLEMAS IDENTIFICADOS:**

| Problema | Situação Atual | Solução |
|----------|----------------|---------|
| **Refund Stripe** | Cancela PaymentIntent, NÃO faz refund | Usar createRefund() se já foi cobrado |
| **PIX já pago** | PaymentIntent cancelado não devolve | Precisa chamar refunds.create() |
| **Cartão já cobrado** | Mesmo problema | Precisa chamar refunds.create() |

### 3.4 Diferença: Cancel vs Refund

```
CANCEL (cancelPayment):
- Só funciona ANTES do pagamento ser capturado
- Se PaymentIntent status = 'requires_payment_method' → OK
- Se PaymentIntent status = 'succeeded' → NÃO FUNCIONA

REFUND (createRefund):
- Funciona DEPOIS do pagamento ser capturado
- Se PaymentIntent status = 'succeeded' → USA REFUND
- Dinheiro volta para o cliente em 5-10 dias úteis
```

---

## FLUXO 4: O QUE DEVERIA ACONTECER NO ESTORNO

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   FLUXO IDEAL: CANCELAMENTO COM ESTORNO                      │
└─────────────────────────────────────────────────────────────────────────────┘

CLIENTE                    BACKEND                   STRIPE
   │                          │                         │
   ├─── Cancela pedido ──────►│                         │
   │                          │                         │
   │                          ├─── Verifica status ────►│
   │                          │    getPaymentStatus()   │
   │                          │                         │
   │                          │◄── { status: X } ───────┤
   │                          │                         │
   │                   ┌──────┴──────┐                  │
   │                   │ status?     │                  │
   │                   └──────┬──────┘                  │
   │                          │                         │
   │              ┌───────────┼───────────┐             │
   │              │           │           │             │
   │    requires_payment   succeeded    processing      │
   │              │           │           │             │
   │              ▼           ▼           ▼             │
   │        cancelPayment  createRefund  cancelPayment  │
   │              │           │           │             │
   │              │           │◄─ refund ─┤             │
   │              │           │   ID      │             │
   │              │           │           │             │
   │◄── "Cancelado" ──────────┼───────────┼─────────────┤
   │    (sem cobrança)        │           │             │
   │                          │           │             │
   │◄── "Estorno em X dias" ──┤           │             │
   │    (com refund)          │           │             │
```

---

## MATRIZ COMPLETA DE CENÁRIOS

### Pagamento Online (PIX/Cartão Stripe)

| Cenário | Status Pedido | Payment Status | Ação no Cancel | Cliente Recebe |
|---------|---------------|----------------|----------------|----------------|
| Não pagou ainda | pending | pending | cancelPayment() | Nada (não foi cobrado) |
| Pagando (processando) | pending | processing | cancelPayment() | Nada |
| Pagou (succeeded) | confirmed | completed | **createRefund()** | Estorno 5-10 dias |
| Em preparo | preparing | completed | **createRefund()** | Estorno 5-10 dias |
| Pronto | ready | completed | ❌ Não pode cancelar | - |
| Entregue | delivered | completed | ❌ Não pode cancelar | - |

### Pagamento com Atendente

| Cenário | Status Pedido | Ação no Cancel | Cliente Recebe |
|---------|---------------|----------------|----------------|
| Aguardando atendente | pending_payment | Cancelar | Nada (não pagou) |
| Atendente confirmou | confirmed | ⚠️ Dinheiro de volta | Staff devolve |
| Em preparo | preparing | ⚠️ Complicado | Depende política |

---

## CORREÇÕES NECESSÁRIAS

### P0 - CRÍTICO: Estorno Real no Stripe

**Problema:**
O método `cancelPayment()` só cancela PaymentIntent que ainda não foi capturado.
Se o pagamento já foi `succeeded`, precisa usar `createRefund()`.

**Arquivo:** `backend/src/controllers/orderController.js`

**Correção:**
```javascript
// Dentro de cancelOrder()

// Verificar se já foi pago
if (order.paymentId) {
  const paymentStatus = await paymentService.getPaymentStatus(order.paymentId);

  if (paymentStatus.status === 'succeeded') {
    // Pagamento já foi capturado - fazer REFUND
    const refundResult = await paymentService.createRefund(order.paymentId);
    if (refundResult.success) {
      console.log(`💰 Refund criado: ${refundResult.refundId}`);
      await order.update({ paymentStatus: 'refunded' });
    }
  } else {
    // Pagamento ainda não foi capturado - apenas cancelar
    const cancelResult = await paymentService.cancelPayment(order.paymentId);
    // ...
  }
}
```

### P1 - ALTO: Notificar Cliente sobre Estorno

**Arquivo:** `backend/src/controllers/orderController.js`

Após refund, enviar notificação:
- Push notification
- SMS (se configurado)
- Email (futuro)

### P2 - MÉDIO: Política de Cancelamento

Definir regras claras:
- Até quando cliente pode cancelar?
- Preparo já iniciou = taxa de cancelamento?
- Perda de ingredientes = cobrança parcial?

---

## RESUMO EXECUTIVO

### O que funciona ✅
1. Cancelar pedidos que ainda não foram pagos
2. Restaurar estoque
3. Devolver cashback usado
4. Notificar staff via Socket.IO
5. Registrar movimento de inventário

### O que NÃO funciona ⚠️
1. **Estorno real no Stripe** - Usa cancel em vez de refund
2. **Cliente não sabe que terá estorno** - Falta notificação clara
3. **Não há prazo para cancelar** - Cliente pode cancelar a qualquer hora

### O que precisa implementar 🔧
1. Verificar status do pagamento antes de cancelar
2. Usar refund para pagamentos já capturados
3. Notificar cliente sobre prazo de estorno
4. Definir política de cancelamento
5. Permitir cancelamento parcial (remover item)

---

## PRÓXIMOS PASSOS

1. **Sprint 52**: Implementar refund real no Stripe
2. **Sprint 53**: Política de cancelamento com prazos
3. **Sprint 54**: Cancelamento parcial de itens
4. **Sprint 55**: Dashboard de reembolsos para admin
