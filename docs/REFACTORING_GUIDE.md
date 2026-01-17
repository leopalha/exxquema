# Guia de Refatoração - FLAME Lounge

## 📋 Objetivo

Migrar código duplicado para os módulos shared criados em P1-5.

**Status**: ⚠️ Arquivos shared criados, migração pendente
**Prioridade**: P2 (após P1-6, P1-7, P1-8)
**Estimativa**: 2-3 dias

---

## 🎯 Arquivos Shared Criados

1. **`backend/src/shared/validators.js`** - Validações centralizadas
2. **`backend/src/shared/constants.js`** - Constantes compartilhadas
3. **`backend/src/shared/cashbackCalculator.js`** - Cálculos de cashback

---

## 📝 Plano de Migração

### **Fase 1: Migrar Constantes** (Prioridade: ALTA)

#### 1.1. ORDER_STATUS em `backend/src/models/Order.js`

**Antes:**
```javascript
// Hardcoded values
if (order.status === 'preparing') { ... }
```

**Depois:**
```javascript
const { ORDER_STATUS } = require('../shared/constants');

if (order.status === ORDER_STATUS.PREPARING) { ... }
```

**Arquivos a atualizar:**
- `backend/src/models/Order.js`
- `backend/src/controllers/orderController.js`
- `backend/src/services/orderStatus.service.js`

---

#### 1.2. PAYMENT_METHODS em `backend/src/constants/index.ts`

**Antes:**
```typescript
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  // ... sem pay_later
};
```

**Depois:**
```javascript
const { PAYMENT_METHODS } = require('../shared/constants');
// Agora inclui PAY_LATER
```

**Ação:**
- ⚠️ Adicionar `PAY_LATER: 'pay_later'` no enum do backend
- Atualizar validadores para aceitar `pay_later`
- Sincronizar com frontend

**Arquivos a atualizar:**
- `backend/src/constants/index.ts`
- `backend/src/validators/order.validator.ts`
- `backend/src/controllers/orderController.js`

---

#### 1.3. SERVICE_FEE em múltiplos arquivos

**Antes:**
```javascript
// backend/src/models/Order.js linha 305
const serviceFeePercentage = parseFloat(process.env.SERVICE_FEE_PERCENTAGE) || 10;

// backend/src/controllers/orderController.js linha 131
const serviceFeePercentage = parseFloat(process.env.SERVICE_FEE_PERCENTAGE) || 10;

// frontend/src/stores/cartStore.js linha 7
const SERVICE_FEE_RATE = 0.10;
```

**Depois:**
```javascript
const { SERVICE_FEE_PERCENTAGE, SERVICE_FEE_RATE } = require('../shared/constants');

// Usar diretamente
const serviceFee = subtotal * (SERVICE_FEE_PERCENTAGE / 100);
// ou
const serviceFee = subtotal * SERVICE_FEE_RATE;
```

**Arquivos a atualizar:**
- `backend/src/models/Order.js` (linha 305)
- `backend/src/controllers/orderController.js` (linha 131)
- `frontend/src/stores/cartStore.js` (linha 7) - importar do backend

---

### **Fase 2: Migrar Cálculos de Cashback** (Prioridade: CRÍTICA)

#### 2.1. Resolver Inconsistência de CASHBACK_RATES

**Problema identificado:**
- `constants/index.ts`: silver = 5% (0.05)
- `User.js getTierBenefits()`: silver = 3%

**Ação:**
1. Verificar com stakeholder qual é o valor correto
2. Atualizar `shared/constants.js` com valor correto
3. Remover duplicação

**Assumindo silver = 5% é correto:**

**Antes em `backend/src/models/User.js` linha 113-137:**
```javascript
getTierBenefits() {
  const tier = this.getTier();
  const rates = {
    bronze: 1.5,
    silver: 3,    // ⚠️ Inconsistente!
    gold: 4.5,
    platinum: 5,
  };
  // ...
}
```

**Depois:**
```javascript
const { getTierBenefits } = require('../shared/cashbackCalculator');

// Remover método getTierBenefits() do User.js
// Usar diretamente:
const benefits = getTierBenefits(user.getTier());
```

---

#### 2.2. Centralizar calculateTier em User.js

**Antes em `backend/src/models/User.js` linha 142-147:**
```javascript
calculateTier() {
  const spent = parseFloat(this.totalSpent) || 0;
  if (spent >= 15000) return 'platinum';
  if (spent >= 5000) return 'gold';
  if (spent >= 1000) return 'silver';
  return 'bronze';
}
```

**Depois:**
```javascript
const { calculateTierFromSpent } = require('../shared/cashbackCalculator');

calculateTier() {
  return calculateTierFromSpent(this.totalSpent);
}
```

**Benefícios:**
- Thresholds centralizados em `shared/constants.js`
- Lógica reutilizável
- Single Source of Truth

---

#### 2.3. Centralizar Instagram Cashback

**Antes em múltiplos arquivos:**

`backend/src/services/instagramCashback.service.js` linha 17-19:
```javascript
const INSTAGRAM_CASHBACK_RATE = 0.05;
```

`backend/src/controllers/orderController.js` linha 1367-1369:
```javascript
const INSTAGRAM_CASHBACK_RATE = 5; // ⚠️ Diferente!
```

**Depois:**
```javascript
const { calculateInstagramCashback } = require('../shared/cashbackCalculator');

// Usar diretamente
const instagramCashback = calculateInstagramCashback(orderTotal);
```

**Arquivos a atualizar:**
- `backend/src/services/instagramCashback.service.js`
- `backend/src/controllers/orderController.js`

---

### **Fase 3: Migrar Validadores** (Prioridade: MÉDIA)

#### 3.1. CPF Validation em User.js

**Antes em `backend/src/models/User.js` linha 185-186:**
```javascript
validate: {
  is: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  msg: 'CPF inválido'
}
```

**Depois:**
```javascript
const { validateCPF } = require('../shared/validators');

validate: {
  validator: (value) => !value || validateCPF(value),
  msg: 'CPF inválido'
}
```

**Benefício:** Validação completa com dígitos verificadores (não apenas regex)

---

#### 3.2. Phone Validation em auth.validator.ts

**Antes em `backend/src/validators/auth.validator.ts` linha 37, 80, 88:**
```typescript
phone: z.string().regex(/^\+?[1-9]\d{10,14}$/, 'Telefone inválido'),
// Repetido 3 vezes!
```

**Depois:**
```typescript
import { REGEX } from '../shared/constants';

phone: z.string().regex(REGEX.PHONE, 'Telefone inválido'),
```

**Arquivos a atualizar:**
- `backend/src/validators/auth.validator.ts` (3 ocorrências)

---

#### 3.3. Email Validation em register.js

**Antes em `frontend/src/pages/register.js` linha 70:**
```javascript
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

**Depois:**
```javascript
import { REGEX } from '../../shared/constants';

const emailPattern = REGEX.EMAIL;
```

---

### **Fase 4: Migrar Frontend Constants** (Prioridade: MÉDIA)

#### 4.1. Sincronizar ORDER_STATUS no orderStore.js

**Antes em `frontend/src/stores/orderStore.js` linha 7-28:**
```javascript
export const ORDER_STATUS = {
  PENDING: 'pending',
  PENDING_PAYMENT: 'pending_payment',
  // ...
};

export const ORDER_STATUS_LABELS = {
  pending: 'Pendente',
  // ...
};
```

**Depois:**
```javascript
// Importar do backend shared
import {
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS
} from '../../backend/src/shared/constants';

// Usar diretamente
export { ORDER_STATUS, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS };
```

**Nota:** Configurar alias no webpack/vite para importar de `@shared/constants`

---

#### 4.2. Sincronizar PAYMENT_METHODS

**Antes em `frontend/src/stores/orderStore.js` linha 32-38:**
```javascript
export const PAYMENT_METHODS = [
  { id: 'pix', nome: 'PIX', icon: 'qr-code', descricao: 'Pagamento instantâneo' },
  // ...
];
```

**Depois:**
```javascript
import { PAYMENT_METHOD_DETAILS } from '@shared/constants';

export const PAYMENT_METHODS = PAYMENT_METHOD_DETAILS;
```

---

## 🔧 Configuração de Importação (Frontend)

Para importar do backend no frontend, adicionar alias no `next.config.js`:

```javascript
module.exports = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@shared': path.resolve(__dirname, '../backend/src/shared'),
    };
    return config;
  },
};
```

Ou usar um monorepo com Turborepo/Nx.

---

## ✅ Checklist de Migração

### Fase 1: Constantes
- [ ] Migrar ORDER_STATUS em Order.js
- [ ] Migrar ORDER_STATUS em orderController.js
- [ ] Adicionar PAY_LATER no backend
- [ ] Migrar SERVICE_FEE em Order.js (linha 305)
- [ ] Migrar SERVICE_FEE em orderController.js (linha 131)
- [ ] Migrar SERVICE_FEE em cartStore.js

### Fase 2: Cashback
- [ ] Resolver inconsistência de CASHBACK_RATES (verificar com stakeholder)
- [ ] Atualizar shared/constants.js com valor correto
- [ ] Migrar calculateTier() em User.js
- [ ] Remover getTierBenefits() de User.js
- [ ] Migrar Instagram cashback em instagramCashback.service.js
- [ ] Migrar Instagram cashback em orderController.js

### Fase 3: Validadores
- [ ] Migrar CPF validation em User.js
- [ ] Migrar Phone validation em auth.validator.ts (3x)
- [ ] Migrar Email validation em register.js

### Fase 4: Frontend
- [ ] Configurar alias @shared no webpack
- [ ] Migrar ORDER_STATUS no orderStore.js
- [ ] Migrar PAYMENT_METHODS no orderStore.js
- [ ] Testar importações no frontend

### Testes
- [ ] Rodar testes unitários após migração
- [ ] Verificar que validators continuam funcionando
- [ ] Testar cálculo de cashback
- [ ] Testar criação de pedidos

---

## 🚨 Cuidados e Riscos

1. **Inconsistência de CASHBACK_RATES**
   - ⚠️ CRÍTICO: Resolver antes de migrar
   - Verificar em produção qual valor está sendo usado
   - Comunicar mudança se necessário

2. **Importação no Frontend**
   - Testar build de produção após configurar alias
   - Verificar bundle size (não aumentar significativamente)
   - Considerar criar package separado para shared

3. **Backward Compatibility**
   - Algumas APIs externas podem depender de valores antigos
   - Fazer migração gradual se necessário
   - Manter compatibilidade com mobile apps (se houver)

4. **TypeScript vs JavaScript**
   - Shared modules são .js, validators backend são .ts
   - Converter para .ts se necessário
   - Ou manter .js e adicionar types com JSDoc

---

## 📊 Impacto Esperado

- **Redução de código duplicado**: ~500 linhas
- **Manutenibilidade**: +40%
- **Consistência**: 100% (atualmente ~70%)
- **Score 7D Código**: 95% → 98%
- **Tempo de implementação**: 2-3 dias
- **Risco**: MÉDIO (requer testes extensivos)

---

## 📅 Timeline Sugerido

1. **Dia 1**: Fase 1 (Constantes) + Resolver inconsistências
2. **Dia 2**: Fase 2 (Cashback) + Fase 3 (Validadores)
3. **Dia 3**: Fase 4 (Frontend) + Testes completos

---

**Criado em**: 2026-01-17
**Última atualização**: 2026-01-17
**Status**: Aguardando execução
