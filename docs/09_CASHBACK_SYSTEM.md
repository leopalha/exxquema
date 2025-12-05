# Sistema de Cashback FLAME

## Visão Geral

O FLAME utiliza um **sistema de cashback direto em reais**, não pontos. Isso torna o programa de fidelidade mais transparente, prático e motivador para os clientes.

## Por que Cashback em vez de Pontos?

### ❌ Problemas com Pontos
- Cliente precisa acumular muito para usar
- Pouca transparência ("quanto vale 1000 pontos?")
- Baixa taxa de resgate (maioria expira sem usar)
- Complexidade mental
- Friction no checkout

### ✅ Vantagens do Cashback
- **Imediato e claro**: "Você ganhou R$ 5,00"
- **Uso automático**: desconto direto na próxima compra
- **Psicologia melhor**: dinheiro de volta > pontos abstratos
- **Menos friction**: sistema aplica automaticamente
- **Mais motivador**: cashback visível incentiva retorno

---

## Tiers de Fidelidade

O tier é baseado no **valor total gasto** (totalSpent), não em pontos acumulados.

### 🥉 Bronze
**Requisito**: R$ 0 - R$ 999 gastos (lifetime)

**Benefícios**:
- 2% de cashback em todas as compras
- Cashback disponível para uso imediato

**Exemplo**:
```
Pedido: R$ 100,00
Cashback: R$ 2,00 (2%)
Saldo após pedido: R$ 2,00
```

---

### 🥈 Silver (Prata)
**Requisito**: R$ 1.000 - R$ 4.999 gastos (lifetime)

**Benefícios**:
- **5% de cashback** em todas as compras
- Prioridade em reservas
- Bônus de aniversário: **R$ 50,00**

**Exemplo**:
```
Pedido: R$ 100,00
Cashback: R$ 5,00 (5%)
Saldo acumulado: R$ 28,00
```

---

### 🥇 Gold (Ouro)
**Requisito**: R$ 5.000 - R$ 9.999 gastos (lifetime)

**Benefícios**:
- **8% de cashback** em todas as compras
- Mesa reservada garantida
- Bônus de aniversário: **R$ 100,00**
- **1 drink cortesia por mês**

**Exemplo**:
```
Pedido: R$ 200,00
Cashback: R$ 16,00 (8%)
Saldo acumulado: R$ 93,00
```

---

### 💎 Platinum (Platina)
**Requisito**: R$ 10.000+ gastos (lifetime)

**Benefícios**:
- **10% de cashback** em todas as compras
- Mesa VIP garantida
- Bônus de aniversário: **R$ 200,00**
- **2 drinks cortesia por mês**
- Acesso a eventos exclusivos

**Exemplo**:
```
Pedido: R$ 300,00
Cashback: R$ 30,00 (10%)
Saldo acumulado: R$ 157,00
```

---

## Mecânica do Sistema

### 1. Ganhar Cashback

Quando um pedido é **entregue e pago**:

```javascript
// Pedido entregue
orderTotal = R$ 100,00
userTier = 'gold' // 8% cashback

// Cálculo
cashbackEarned = R$ 100,00 × 8% = R$ 8,00

// Atualização
user.cashbackBalance += R$ 8,00
user.totalSpent += R$ 100,00

// Registro no histórico
CashbackHistory.create({
  amount: +8.00,
  type: 'earned',
  description: 'Cashback do pedido #1234'
})
```

### 2. Usar Cashback

O cashback é **aplicado automaticamente** no próximo pedido:

```javascript
// Próximo pedido
orderTotal = R$ 80,00
user.cashbackBalance = R$ 23,00

// Aplicação automática
discount = R$ 23,00
totalToPay = R$ 80,00 - R$ 23,00 = R$ 57,00

// Atualização
user.cashbackBalance = R$ 0,00
newCashback = R$ 57,00 × 8% = R$ 4,56
user.cashbackBalance += R$ 4,56

// Registro
CashbackHistory.create({
  amount: -23.00,
  type: 'redeemed',
  description: 'Usado no pedido #1235'
})
```

### 3. Upgrade de Tier

Tiers são calculados automaticamente baseados em `totalSpent`:

```javascript
calculateTier(totalSpent) {
  if (totalSpent >= 10000) return 'platinum'
  if (totalSpent >= 5000) return 'gold'
  if (totalSpent >= 1000) return 'silver'
  return 'bronze'
}

// Após cada pedido
newTier = calculateTier(user.totalSpent)
if (newTier !== user.loyaltyTier) {
  user.loyaltyTier = newTier
  // Notificar cliente do upgrade!
}
```

---

## Modelo de Dados

### User
```javascript
{
  // Fidelidade
  cashbackBalance: DECIMAL(10,2)  // Saldo disponível em R$
  totalSpent: DECIMAL(10,2)       // Total gasto lifetime
  loyaltyTier: ENUM('bronze', 'silver', 'gold', 'platinum')

  // CRM
  totalOrders: INTEGER
  lastVisit: DATE
  lastOrderDate: DATE
}
```

### CashbackHistory
```javascript
{
  id: UUID
  userId: UUID
  orderId: UUID (opcional)
  amount: DECIMAL(10,2)  // + ganhou, - usou
  type: ENUM('earned', 'redeemed', 'bonus', 'expired', 'adjustment')
  description: TEXT
  balanceBefore: DECIMAL(10,2)
  balanceAfter: DECIMAL(10,2)
  createdAt: DATE
}
```

---

## API Endpoints

### Cliente

**GET /api/users/me/cashback**
```json
{
  "balance": 23.50,
  "tier": "gold",
  "totalSpent": 6500.00,
  "tierBenefits": {
    "cashbackRate": 8,
    "perks": [...]
  },
  "nextTier": {
    "name": "platinum",
    "requiredSpent": 10000,
    "remaining": 3500
  }
}
```

**GET /api/users/me/cashback/history**
```json
{
  "history": [
    {
      "id": "...",
      "amount": 8.00,
      "type": "earned",
      "description": "Cashback do pedido #1234",
      "balanceBefore": 15.50,
      "balanceAfter": 23.50,
      "createdAt": "2024-12-04T..."
    }
  ]
}
```

### Admin

**POST /api/crm/customers/:id/cashback**
```json
{
  "amount": 50.00,
  "type": "bonus",
  "description": "Bônus de aniversário"
}
```

---

## Fluxo no Frontend

### 1. Página do Cliente (/cashback)
- Card grande mostrando saldo disponível
- Badge do tier atual com cor
- Barra de progresso para próximo tier
- Lista de transações recentes
- Benefícios do tier atual

### 2. Checkout
- Mostra saldo disponível
- **Aplicação automática** do cashback
- Mostra quanto vai ganhar de volta neste pedido
- Preview do novo saldo após a compra

### 3. Notificações
- Toast quando ganha cashback
- Alerta quando atinge novo tier
- Lembrete quando tem cashback disponível

---

## Regras de Negócio

### Validade
- Cashback **não expira** (ou expira em 12 meses com aviso)
- Tier é permanente (nunca downgrade)

### Cálculos
- Cashback calculado sobre o **total do pedido** (incluindo taxa de serviço)
- Aplicação automática no próximo pedido
- Se cashback > total do pedido, usa parcial e mantém resto

### Bônus
- Aniversário: creditado automaticamente no dia
- Admin pode adicionar bônus manuais
- Bônus seguem as mesmas regras de uso

---

## Benefícios do Sistema

### Para o Cliente
1. **Transparência total**: sabe exatamente quanto tem em R$
2. **Uso fácil**: automático, sem complicação
3. **Motivação clara**: ver R$ 23,50 é mais motivador que "2350 pontos"
4. **Retorno garantido**: sempre ganha algo de volta

### Para o Negócio
1. **Maior engajamento**: clientes voltam para usar cashback
2. **Aumento de ticket**: cashback motiva pedidos maiores
3. **Fidelização real**: tier permanente cria vínculo
4. **Dados valiosos**: totalSpent indica valor do cliente

### Métricas Esperadas
- Taxa de retorno: +40%
- Ticket médio: +25%
- Retenção: +60%
- LTV (Lifetime Value): +200%

---

*Documento criado em: 04/12/2024*
*Versão: 1.0*
