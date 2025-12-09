# SPRINT 60 - DIVISAO DE CONTA

**Data**: 09/12/2024
**Prioridade**: P1 (Recurso importante para restaurantes)
**Status**: 🚧 EM PLANEJAMENTO

---

## OBJETIVO

Implementar funcionalidade de divisão de conta, permitindo que clientes em uma mesma mesa dividam o pagamento de forma flexível (igualmente ou por valores diferentes).

---

## CASOS DE USO

### 1. Divisão Igual
- 4 amigos em uma mesa, conta total R$ 200,00
- Cada um paga R$ 50,00
- Sistema divide automaticamente

### 2. Divisão Personalizada
- Casal + 2 amigos, conta R$ 300,00
- Casal paga R$ 150,00 (50%)
- Amigo 1 paga R$ 100,00 (33%)
- Amigo 2 paga R$ 50,00 (17%)

### 3. Divisão Por Itens
- Cada pessoa escolhe os itens que consumiu
- Sistema calcula total individual
- Taxa de serviço dividida proporcionalmente

---

## ARQUITETURA

### Model: SplitPayment

```javascript
{
  id: UUID,
  orderId: UUID,              // Pedido principal
  userId: UUID,               // Quem está pagando
  amount: DECIMAL,            // Valor da parte
  percentage: DECIMAL,        // % do total
  status: ENUM,               // pending, paid, cancelled
  paymentMethod: STRING,      // credit, debit, pix, cash
  paymentIntentId: STRING,    // Stripe payment intent (se online)
  paidAt: DATETIME
}
```

### Fluxo Backend

1. **POST /orders/:id/split** - Iniciar divisão
   - Input: `{ participants: number }` ou `{ splits: [{userId, amount}] }`
   - Output: `{ splitId, participants: [{userId, amount, status}] }`

2. **GET /orders/:id/split** - Ver status da divisão
   - Output: `{ total, paid, remaining, participants }`

3. **POST /orders/:id/split/pay** - Pagar parte individual
   - Input: `{ userId, paymentMethod, paymentDetails }`
   - Output: `{ success, remaining }`

4. **POST /orders/:id/split/complete** - Finalizar divisão
   - Valida que total foi pago
   - Atualiza order.paymentStatus = 'completed'
   - Envia confirmação para todos

### Fluxo Frontend

1. **Tela de Pedido** - Botão "Dividir Conta"
2. **Modal de Divisão**:
   - Opção A: "Dividir Igualmente" → Input: número de pessoas
   - Opção B: "Dividir Valores" → Lista de participantes com inputs
   - Opção C: "Dividir Por Itens" → Checkbox em cada item
3. **Confirmação** - Mostra preview da divisão
4. **Pagamento** - Cada um paga sua parte
5. **Status** - Dashboard mostrando quem já pagou

---

## INTERFACE

### Modal Divisão de Conta

```
┌─────────────────────────────────────┐
│  Dividir Conta - Pedido #123       │
│                                     │
│  Total: R$ 250,00                  │
│  Taxa Serviço: R$ 25,00            │
│  ────────────────────────────       │
│  Total com Taxa: R$ 275,00         │
│                                     │
│  [Dividir Igualmente]              │
│  [Dividir Valores]                 │
│  [Dividir Por Itens]               │
│                                     │
│  ────── Se Dividir Igualmente ───  │
│                                     │
│  Número de pessoas: [___]          │
│  Cada um paga: R$ 68,75           │
│                                     │
│  [Cancelar]  [Confirmar Divisão]  │
└─────────────────────────────────────┘
```

### Tela de Status da Divisão

```
┌─────────────────────────────────────┐
│  Status da Divisão - Pedido #123   │
│                                     │
│  Total: R$ 275,00                  │
│  Pago: R$ 137,50 (50%)            │
│  Restante: R$ 137,50              │
│                                     │
│  ✅ João Silva      R$ 68,75 (Pago)│
│  ⏳ Maria Santos    R$ 68,75       │
│  ⏳ Pedro Lima      R$ 68,75       │
│  ⏳ Ana Costa       R$ 68,75       │
│                                     │
│  [Pagar Minha Parte]               │
└─────────────────────────────────────┘
```

---

## REGRAS DE NEGÓCIO

1. **Permissões**:
   - Apenas clientes na mesma mesa podem dividir
   - Atendente pode forçar divisão para facilitar

2. **Validações**:
   - Soma das partes deve ser igual ao total
   - Não pode dividir pedido já pago
   - Não pode cancelar divisão após pagamento parcial

3. **Pagamentos**:
   - Cada participante escolhe seu método (PIX, cartão, cash)
   - Cash/cartão na mesa = atendente confirma
   - PIX/cartão online = automático

4. **Gorjetas**:
   - Gorjeta é opcional para cada participante
   - Dividida na mesma proporção da conta

5. **Cashback**:
   - Cada participante recebe cashback sobre sua parte
   - Distribuído proporcionalmente

---

## IMPLEMENTAÇÃO

### Fase 1: Backend (2h)
- ✅ Criar model SplitPayment
- ✅ Criar migration
- ✅ Criar rotas de divisão
- ✅ Criar controller splitPaymentController
- ✅ Testes unitários

### Fase 2: Frontend (3h)
- ✅ Criar componente SplitPaymentModal
- ✅ Integrar com página de pedido
- ✅ Criar tela de status da divisão
- ✅ Testes de UI

### Fase 3: Integração (1h)
- ✅ Socket.IO para atualização em tempo real
- ✅ Notificações push quando alguém paga
- ✅ Email de confirmação ao completar

---

## TESTES

### Cenários de Teste

1. **Dividir Igualmente**:
   - 2 pessoas, R$ 100,00 → R$ 50,00 cada
   - 3 pessoas, R$ 150,00 → R$ 50,00 cada
   - 5 pessoas, R$ 127,50 → R$ 25,50 cada

2. **Dividir Valores**:
   - Pessoa A: R$ 60,00
   - Pessoa B: R$ 40,00
   - Total: R$ 100,00 ✅

3. **Divisão Incompleta**:
   - Total: R$ 100,00
   - A paga: R$ 60,00
   - Status: 40% restante

4. **Cancelamento**:
   - Tentar cancelar após pagamento parcial → Erro
   - Cancelar sem pagamentos → OK

---

## PRÓXIMOS PASSOS

1. Aprovar arquitetura
2. Implementar model e rotas
3. Criar interface
4. Testar fluxos
5. Documentar em PRD e User Flows
6. Deploy

---

**Estimativa Total**: 6-8 horas
**Complexidade**: Média-Alta
**Impacto**: Alto (feature muito solicitada)
