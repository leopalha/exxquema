# 🔥 PLANO DE AÇÃO - REFINAMENTO COMPLETO DA PLATAFORMA FLAME LOUNGE

**Data:** 2026-01-16
**Sistema:** MANUS v7.1
**Auditor:** Claude Sonnet 4.5
**Status do Projeto:** PRODUÇÃO (95% completude)
**Score 7D Atual:** 70.25% (BOM)

---

## 📊 SUMÁRIO EXECUTIVO

A auditoria completa identificou que o **Flame Lounge Bar & Restaurant** está **95% completo** e **em produção estável**, com 3 bloqueadores críticos (P0), 8 tasks de alta prioridade (P1) e 10 melhorias (P2).

### Status Geral

| Métrica | Valor | Status |
|---------|-------|--------|
| **Completude do PRD** | 95% | ✅ |
| **Build Frontend** | 50/50 páginas | ✅ |
| **Build Backend** | Funcional | ✅ |
| **Cobertura de Testes** | ~5% | ❌ |
| **Score 7D** | 70.25% | ⚠️ |
| **Deploy Produção** | Ativo | ✅ |

### Distribuição de Prioridades

- **P0 (Bloqueadores):** 3 tasks → 2-3 dias
- **P1 (Alta Prioridade):** 8 tasks → 4-6 semanas
- **P2 (Melhorias):** 10 tasks → 6-8 semanas

---

## 🎯 P0 - BLOQUEADORES CRÍTICOS (2-3 dias)

### P0-1: Validação de Estoque ao Criar Pedido

**Problema:**
- `orderController.createOrder` NÃO valida se há estoque suficiente
- Cliente pode pedir produto sem estoque
- Cozinha/Bar não consegue preparar

**Impacto:** CRÍTICO
- Pedidos impossíveis de completar
- Frustração do cliente
- Cancelamentos forçados

**Solução:**
```javascript
// backend/src/controllers/orderController.js
// Adicionar antes de criar Order:

// Validar estoque de todos os produtos
for (const item of items) {
  const product = await Product.findByPk(item.productId);
  if (!product) {
    return res.status(404).json({
      error: `Produto ${item.productId} não encontrado`
    });
  }

  if (product.hasStock && product.stock < item.quantity) {
    return res.status(400).json({
      error: `Produto "${product.name}" sem estoque suficiente. Disponível: ${product.stock}`
    });
  }
}
```

**Arquivos Afetados:**
- `backend/src/controllers/orderController.js` (linha ~50)

**Testes Necessários:**
- Teste unitário: criar pedido com produto sem estoque (deve falhar)
- Teste E2E: tentar checkout com produto sem estoque

**Estimativa:** 2 horas

**Status:** ⏸️ PENDENTE

---

### P0-2: Transaction Rollback ao Criar Pedido

**Problema:**
- Se criar Order mas falhar ao criar OrderItems, fica inconsistente
- Sem uso de `Sequelize.transaction()`

**Impacto:** ALTO
- Pedidos incompletos no banco
- Dados inconsistentes
- Dificuldade de debug

**Solução:**
```javascript
// backend/src/controllers/orderController.js
// Refatorar createOrder para usar transaction:

const t = await sequelize.transaction();

try {
  // 1. Criar Order
  const order = await Order.create({
    userId: req.user.id,
    tableId: req.body.tableId || null,
    subtotal,
    serviceFee,
    taxes,
    total,
    notes: req.body.notes,
    paymentMethod: req.body.paymentMethod,
    cashbackUsed: req.body.cashbackUsed || 0,
    tip: req.body.tip || 0,
  }, { transaction: t });

  // 2. Criar OrderItems
  const orderItems = items.map(item => ({
    orderId: order.id,
    productId: item.productId,
    quantity: item.quantity,
    unitPrice: item.product.price,
    subtotal: item.quantity * item.product.price,
    productName: item.product.name,
    productDescription: item.product.description,
    productImage: item.product.image,
    productCategory: item.product.category,
  }));

  await OrderItem.bulkCreate(orderItems, { transaction: t });

  // 3. Se usar cashback, deduzir saldo
  if (req.body.cashbackUsed > 0) {
    await req.user.useCashback(
      req.body.cashbackUsed,
      `Usado no pedido #${order.orderNumber}`
    );
  }

  // 4. Commit transaction
  await t.commit();

  // 5. Carregar order completo com associações
  const orderComplete = await Order.findByPk(order.id, {
    include: [
      { model: OrderItem, as: 'items' },
      { model: User, as: 'customer', attributes: ['id', 'nome', 'celular'] },
      { model: Table, as: 'table', attributes: ['id', 'number'] },
    ],
  });

  // 6. Emitir Socket.IO event
  socketService.emitOrderCreated(orderComplete);

  res.status(201).json(orderComplete);

} catch (error) {
  // Rollback se algo falhar
  await t.rollback();
  console.error('Erro ao criar pedido:', error);
  res.status(500).json({ error: 'Erro ao criar pedido' });
}
```

**Arquivos Afetados:**
- `backend/src/controllers/orderController.js` (linha ~50-150)

**Testes Necessários:**
- Teste unitário: simular erro ao criar OrderItems (deve fazer rollback)
- Verificar que Order não é criado se OrderItems falhar

**Estimativa:** 3 horas

**Status:** ⏸️ PENDENTE

---

### P0-3: Completar Lógica de Divisão de Conta (Sprint 60)

**Problema:**
- Model `SplitPayment` existe ✅
- UI básica existe ✅
- Lógica de divisão customizada incompleta ❌
- Interface do atendente para dividir incompleta ❌

**Impacto:** MÉDIO-ALTO
- Feature prometida no PRD não funciona completamente
- Clientes não conseguem dividir conta customizadamente

**Situação Atual:**
```javascript
// backend/src/controllers/splitPaymentController.js
// Implementado:
✅ dividirIgualmente(orderId, numPessoas)
✅ getSplitsByOrder(orderId)
✅ pagarSplit(splitId, paymentMethod)

// Faltando:
❌ dividirPorValor(orderId, divisoes) // ex: [150, 200, 100]
❌ dividirPorItem(orderId, itemsPerPerson) // ex: pessoa1: [item1, item3]
```

**Solução:**

#### 1. Backend - Adicionar Métodos de Divisão

```javascript
// backend/src/controllers/splitPaymentController.js

// Método 1: Divisão por valor customizado
exports.dividirPorValor = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { divisoes } = req.body; // ex: [{ userId, valor }, { userId, valor }]

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    // Validar que soma = total do pedido
    const somaValores = divisoes.reduce((acc, d) => acc + d.valor, 0);
    if (Math.abs(somaValores - order.total) > 0.01) {
      return res.status(400).json({
        error: `Soma das divisões (R$ ${somaValores.toFixed(2)}) não corresponde ao total (R$ ${order.total.toFixed(2)})`
      });
    }

    const t = await sequelize.transaction();

    try {
      // Deletar splits existentes
      await SplitPayment.destroy({ where: { orderId }, transaction: t });

      // Criar novos splits
      const splits = divisoes.map(d => ({
        orderId,
        userId: d.userId,
        amount: d.valor,
        percentage: (d.valor / order.total) * 100,
        status: 'pending',
      }));

      await SplitPayment.bulkCreate(splits, { transaction: t });

      await t.commit();

      const newSplits = await SplitPayment.findAll({
        where: { orderId },
        include: [{ model: User, as: 'user', attributes: ['nome', 'celular'] }],
      });

      res.json(newSplits);
    } catch (error) {
      await t.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Erro ao dividir por valor:', error);
    res.status(500).json({ error: 'Erro ao dividir conta por valor' });
  }
};

// Método 2: Divisão por itens
exports.dividirPorItem = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { itemsPerPerson } = req.body;
    // ex: [{ userId, itemIds: [uuid1, uuid2] }, { userId, itemIds: [uuid3] }]

    const order = await Order.findByPk(orderId, {
      include: [{ model: OrderItem, as: 'items' }],
    });

    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    // Validar que todos os itens foram atribuídos
    const allItemIds = order.items.map(i => i.id);
    const assignedItemIds = itemsPerPerson.flatMap(p => p.itemIds);
    const missingItems = allItemIds.filter(id => !assignedItemIds.includes(id));

    if (missingItems.length > 0) {
      return res.status(400).json({
        error: `Itens não atribuídos: ${missingItems.join(', ')}`
      });
    }

    const t = await sequelize.transaction();

    try {
      // Deletar splits existentes
      await SplitPayment.destroy({ where: { orderId }, transaction: t });

      // Calcular valor de cada pessoa
      const splits = itemsPerPerson.map(person => {
        const personItems = order.items.filter(item =>
          person.itemIds.includes(item.id)
        );
        const personTotal = personItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

        // Adicionar proporção da taxa de serviço
        const percentOfTotal = personTotal / order.subtotal;
        const personServiceFee = order.serviceFee * percentOfTotal;
        const personTip = order.tip * percentOfTotal;
        const personFinalTotal = personTotal + personServiceFee + personTip;

        return {
          orderId,
          userId: person.userId,
          amount: personFinalTotal,
          percentage: (personFinalTotal / order.total) * 100,
          status: 'pending',
          notes: `Itens: ${person.itemIds.length}`,
        };
      });

      await SplitPayment.bulkCreate(splits, { transaction: t });

      await t.commit();

      const newSplits = await SplitPayment.findAll({
        where: { orderId },
        include: [{ model: User, as: 'user', attributes: ['nome', 'celular'] }],
      });

      res.json(newSplits);
    } catch (error) {
      await t.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Erro ao dividir por item:', error);
    res.status(500).json({ error: 'Erro ao dividir conta por item' });
  }
};
```

#### 2. Frontend - UI do Atendente

```javascript
// frontend/src/components/Staff/SplitPaymentModal.js

import { useState } from 'react';
import { splitPaymentService } from '../../services/splitPaymentService';

export default function SplitPaymentModal({ order, onClose, onSuccess }) {
  const [splitMode, setSplitMode] = useState('igual'); // 'igual', 'valor', 'item'
  const [numPessoas, setNumPessoas] = useState(2);
  const [divisoes, setDivisoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDividirIgualmente = async () => {
    setLoading(true);
    setError(null);
    try {
      await splitPaymentService.dividirIgualmente(order.id, numPessoas);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDividirPorValor = async () => {
    setLoading(true);
    setError(null);
    try {
      await splitPaymentService.dividirPorValor(order.id, divisoes);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPessoa = () => {
    setDivisoes([...divisoes, { userId: null, valor: 0 }]);
  };

  const handleUpdateDivisao = (index, field, value) => {
    const newDivisoes = [...divisoes];
    newDivisoes[index][field] = value;
    setDivisoes(newDivisoes);
  };

  const totalDivisoes = divisoes.reduce((sum, d) => sum + parseFloat(d.valor || 0), 0);
  const diferenca = order.total - totalDivisoes;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Dividir Conta - Pedido #{order.orderNumber}</h2>
        <p>Total: R$ {order.total.toFixed(2)}</p>

        {/* Tabs de Modo */}
        <div className="tabs">
          <button
            className={splitMode === 'igual' ? 'active' : ''}
            onClick={() => setSplitMode('igual')}
          >
            Dividir Igualmente
          </button>
          <button
            className={splitMode === 'valor' ? 'active' : ''}
            onClick={() => setSplitMode('valor')}
          >
            Dividir por Valor
          </button>
          <button
            className={splitMode === 'item' ? 'active' : ''}
            onClick={() => setSplitMode('item')}
          >
            Dividir por Item
          </button>
        </div>

        {/* Modo: Dividir Igualmente */}
        {splitMode === 'igual' && (
          <div>
            <label>Número de Pessoas:</label>
            <input
              type="number"
              min="2"
              max="10"
              value={numPessoas}
              onChange={(e) => setNumPessoas(parseInt(e.target.value))}
            />
            <p>Cada pessoa pagará: R$ {(order.total / numPessoas).toFixed(2)}</p>
            <button onClick={handleDividirIgualmente} disabled={loading}>
              {loading ? 'Dividindo...' : 'Dividir Igualmente'}
            </button>
          </div>
        )}

        {/* Modo: Dividir por Valor */}
        {splitMode === 'valor' && (
          <div>
            <button onClick={handleAddPessoa}>+ Adicionar Pessoa</button>
            {divisoes.map((div, index) => (
              <div key={index} className="divisao-row">
                <input
                  type="text"
                  placeholder="Nome ou CPF"
                  value={div.userId || ''}
                  onChange={(e) => handleUpdateDivisao(index, 'userId', e.target.value)}
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Valor"
                  value={div.valor}
                  onChange={(e) => handleUpdateDivisao(index, 'valor', parseFloat(e.target.value))}
                />
              </div>
            ))}
            <p>Soma: R$ {totalDivisoes.toFixed(2)}</p>
            <p>Diferença: R$ {diferenca.toFixed(2)} {diferenca !== 0 && '⚠️'}</p>
            <button
              onClick={handleDividirPorValor}
              disabled={loading || Math.abs(diferenca) > 0.01}
            >
              {loading ? 'Dividindo...' : 'Confirmar Divisão'}
            </button>
          </div>
        )}

        {/* Modo: Dividir por Item */}
        {splitMode === 'item' && (
          <div>
            <p>EM DESENVOLVIMENTO</p>
            {/* TODO: Implementar UI drag-and-drop de itens */}
          </div>
        )}

        {error && <div className="error">{error}</div>}
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}
```

#### 3. Rotas

```javascript
// backend/src/routes/split-payments.js
router.post('/orders/:orderId/split-custom-values', splitPaymentController.dividirPorValor);
router.post('/orders/:orderId/split-by-items', splitPaymentController.dividirPorItem);
```

**Arquivos Afetados:**
- `backend/src/controllers/splitPaymentController.js` (+100 linhas)
- `backend/src/routes/split-payments.js` (+2 rotas)
- `frontend/src/components/Staff/SplitPaymentModal.js` (novo arquivo)
- `frontend/src/services/splitPaymentService.js` (+2 métodos)

**Testes Necessários:**
- Teste unitário: dividir por valor (soma = total)
- Teste unitário: dividir por valor (soma ≠ total - deve falhar)
- Teste unitário: dividir por item (todos itens atribuídos)
- Teste E2E: atendente divide conta em 3 partes customizadas

**Estimativa:** 2 dias (1 dia backend + 1 dia frontend)

**Status:** ⏸️ PENDENTE

---

## 🔥 P1 - ALTA PRIORIDADE (4-6 semanas)

### P1-1: Adicionar Loading States em Componentes Críticos

**Problema:**
- Componentes não mostram feedback visual durante ações assíncronas
- Usuário não sabe se ação está processando

**Impacto:** MÉDIO-ALTO
- UX ruim
- Usuário clica múltiplas vezes
- Possibilidade de pedidos duplicados

**Componentes Prioritários:**

1. **ProductCard.js** - loading ao adicionar ao carrinho
2. **OrderCard.js** - skeleton loading
3. **CheckoutCart.js** - loading durante pagamento
4. **ReservationForm.js** - loading ao criar reserva

**Padrão a Implementar:**

```javascript
// Exemplo: ProductCard.js
import { useState } from 'react';
import { cartStore } from '../../stores/cartStore';

export default function ProductCard({ product }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addItem } = cartStore();

  const handleAddToCart = async () => {
    setLoading(true);
    setError(null);
    try {
      await addItem(product, 1);
      // Mostrar toast de sucesso
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-card">
      {/* ... conteúdo do card ... */}
      <button
        onClick={handleAddToCart}
        disabled={loading}
      >
        {loading ? (
          <span className="spinner"></span>
        ) : (
          'Adicionar ao Carrinho'
        )}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

**Arquivos Afetados:**
- `frontend/src/components/Menu/ProductCard.js`
- `frontend/src/components/Order/OrderCard.js`
- `frontend/src/components/Checkout/CheckoutCart.js`
- `frontend/src/components/Reservation/ReservationForm.js`
- `frontend/src/styles/globals.css` (adicionar spinner CSS)

**Estimativa:** 1 semana

**Status:** ⏸️ PENDENTE

---

### P1-2: Adicionar Error States e Boundaries

**Problema:**
- Erros não são capturados e exibidos de forma user-friendly
- Componentes podem quebrar silenciosamente

**Impacto:** MÉDIO
- Usuário não entende o que aconteceu
- Experiência ruim
- Dificulta debug

**Solução:**

#### 1. Criar Error Boundary

```javascript
// frontend/src/components/ErrorBoundary.js
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // Enviar para Sentry ou outro serviço de logging
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Algo deu errado</h2>
          <p>Desculpe, ocorreu um erro inesperado.</p>
          <button onClick={() => window.location.reload()}>
            Recarregar Página
          </button>
          {process.env.NODE_ENV === 'development' && (
            <pre>{this.state.error?.toString()}</pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

#### 2. Usar Error Boundary em Páginas Críticas

```javascript
// frontend/src/pages/_app.js
import ErrorBoundary from '../components/ErrorBoundary';

function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}
```

#### 3. Error States em Stores

```javascript
// Exemplo: cartStore.js
import create from 'zustand';
import { cartService } from '../services/cartService';

export const cartStore = create((set, get) => ({
  items: [],
  loading: false,
  error: null,

  addItem: async (product, quantity) => {
    set({ loading: true, error: null });
    try {
      // Lógica de adicionar item
      const newItems = [...get().items, { product, quantity }];
      set({ items: newItems, loading: false });
    } catch (error) {
      set({
        error: error.message || 'Erro ao adicionar item',
        loading: false
      });
      throw error; // Re-throw para componente tratar
    }
  },

  clearError: () => set({ error: null }),
}));
```

**Arquivos Afetados:**
- `frontend/src/components/ErrorBoundary.js` (novo)
- `frontend/src/pages/_app.js` (atualizar)
- `frontend/src/stores/cartStore.js`
- `frontend/src/stores/orderStore.js`
- `frontend/src/stores/reservationStore.js`

**Estimativa:** 3 dias

**Status:** ⏸️ PENDENTE

---

### P1-3: Implementar Validação Consistente nas APIs

**Problema:**
- express-validator instalado mas não usado consistentemente
- Algumas rotas não validam inputs
- Possibilidade de dados inválidos no banco

**Impacto:** ALTO
- Segurança comprometida
- Dados inconsistentes
- Erros difíceis de debug

**Endpoints Prioritários:**

1. `/api/orders` POST
2. `/api/products` POST/PUT
3. `/api/cashier` POST
4. `/api/ingredients` POST/PUT

**Solução:**

```javascript
// backend/src/middlewares/validate.middleware.js
const { body, param, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: errors.array()
    });
  }
  next();
};

// Validações para Orders
const createOrderValidation = [
  body('items').isArray({ min: 1 }).withMessage('Pedido deve ter pelo menos 1 item'),
  body('items.*.productId').isUUID().withMessage('productId inválido'),
  body('items.*.quantity').isInt({ min: 1, max: 50 }).withMessage('Quantidade inválida'),
  body('paymentMethod').isIn(['credit_card', 'debit_card', 'pix', 'cash', 'pay_later', 'card_at_table']),
  body('cashbackUsed').optional().isFloat({ min: 0 }),
  body('tip').optional().isFloat({ min: 0 }),
  validateRequest,
];

// Validações para Products
const createProductValidation = [
  body('name').trim().notEmpty().isLength({ min: 3, max: 100 }),
  body('price').isFloat({ min: 0.01 }).withMessage('Preço deve ser maior que zero'),
  body('category').isIn([
    'bebidas_alcoolicas', 'bebidas_nao_alcoolicas', 'drinks_autorais',
    'petiscos', 'pratos_principais', 'sobremesas', 'porcoes', 'combos', 'hookah'
  ]),
  body('description').optional().trim(),
  body('preparationTime').optional().isInt({ min: 1 }),
  body('hasStock').optional().isBoolean(),
  body('stock').optional().isInt({ min: 0 }),
  validateRequest,
];

// Validações para Cashier
const openCashierValidation = [
  body('openingAmount').isFloat({ min: 0 }).withMessage('Valor de abertura inválido'),
  body('notes').optional().trim(),
  validateRequest,
];

// Validações para Ingredients
const createIngredientValidation = [
  body('name').trim().notEmpty().isLength({ min: 2, max: 100 }),
  body('unit').isIn(['kg', 'g', 'l', 'ml', 'un']),
  body('currentStock').isFloat({ min: 0 }),
  body('minStock').isFloat({ min: 0 }),
  body('costPerUnit').optional().isFloat({ min: 0 }),
  validateRequest,
];

module.exports = {
  validateRequest,
  createOrderValidation,
  createProductValidation,
  openCashierValidation,
  createIngredientValidation,
};
```

**Usar nas Rotas:**

```javascript
// backend/src/routes/orders.js
const { createOrderValidation } = require('../middlewares/validate.middleware');

router.post('/orders',
  authMiddleware,
  createOrderValidation,
  orderController.createOrder
);
```

**Arquivos Afetados:**
- `backend/src/middlewares/validate.middleware.js` (novo)
- `backend/src/routes/orders.js`
- `backend/src/routes/products.js`
- `backend/src/routes/cashier.js`
- `backend/src/routes/ingredients.js`

**Estimativa:** 1 semana

**Status:** ⏸️ PENDENTE

---

### P1-4: Completar Google OAuth

**Problema:**
- Código 100% pronto
- Faltam credenciais do Google Cloud

**Impacto:** BAIXO
- Feature não funciona
- Usuários não conseguem login via Google

**Solução:**

1. Criar projeto no [Google Cloud Console](https://console.cloud.google.com/)
2. Habilitar **Google Sign-In API**
3. Criar **OAuth 2.0 credentials**
4. Adicionar em `.env`:
   ```
   GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-abc123xyz
   GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
   ```
5. Configurar **Authorized redirect URIs** no Google Console:
   - Development: `http://localhost:3000/api/auth/google/callback`
   - Production: `https://flamelounge.vercel.app/api/auth/google/callback`

**Arquivos Afetados:**
- `.env` (adicionar 3 variáveis)
- Nenhum código (já implementado)

**Estimativa:** 30 minutos (após criar projeto Google)

**Status:** ⏸️ PENDENTE

---

### P1-5: Centralizar Código Duplicado

**Problema:**
- Lógica duplicada em múltiplos arquivos
- Dificulta manutenção
- Risco de divergências

**Impacto:** MÉDIO
- Manutenção difícil
- Bugs em um lugar mas não em outro
- Código maior que o necessário

**Instâncias Prioritárias:**

#### 1. Validação de CPF

**Situação Atual:**
- Duplicado em: `frontend/src/utils/validation.js` + `backend/src/utils/`

**Solução:**
```javascript
// Criar lib compartilhada
// shared/validators.js

export const validateCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]/g, '');

  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;

  return true;
};

export const validatePhone = (phone) => {
  // Lógica de validação
};

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
```

**Usar:**
```javascript
// frontend e backend
import { validateCPF, validatePhone, validateEmail } from '@flame/validators';
```

#### 2. Cálculo de Cashback

**Situação Atual:**
- Lógica em `User.js` (methods) + `crm.service.js`

**Solução:**
- Centralizar 100% no model `User.js`
- Remover de `crm.service.js`, apenas chamar `user.addCashback()`

#### 3. Status Labels

**Situação Atual:**
- Hardcoded em múltiplos componentes

**Solução:**
```javascript
// shared/constants.js
export const ORDER_STATUS_LABELS = {
  pending: 'Pendente',
  pending_payment: 'Aguardando Pagamento',
  confirmed: 'Confirmado',
  preparing: 'Em Preparo',
  ready: 'Pronto',
  on_way: 'A Caminho',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

export const ORDER_STATUS_COLORS = {
  pending: 'yellow',
  confirmed: 'blue',
  preparing: 'orange',
  ready: 'green',
  delivered: 'green',
  cancelled: 'red',
};
```

**Arquivos Afetados:**
- `shared/validators.js` (novo)
- `shared/constants.js` (novo)
- `frontend/src/utils/validation.js` (remover duplicação)
- `backend/src/utils/validation.js` (remover duplicação)
- `backend/src/services/crm.service.js` (remover cálculo cashback)
- Múltiplos componentes (usar constants)

**Estimativa:** 3 dias

**Status:** ⏸️ PENDENTE

---

### P1-6: Implementar Testes E2E Críticos (Cypress)

**Problema:**
- Cypress configurado
- 0 testes implementados

**Impacto:** ALTO
- Sem garantia de que fluxos funcionam
- Risco de regressões
- Dificuldade de validar mudanças

**Testes Críticos a Implementar:**

#### 1. Fluxo Completo de Pedido

```javascript
// cypress/e2e/order-flow.cy.js

describe('Fluxo Completo de Pedido', () => {
  it('Cliente faz pedido completo QR → Checkout → Tracking', () => {
    // 1. Acessar via QR code
    cy.visit('/mesa/1'); // Simular escanear QR da mesa 1

    // 2. Ver cardápio
    cy.contains('Cardápio').should('be.visible');
    cy.get('[data-testid="product-card"]').should('have.length.at.least', 1);

    // 3. Adicionar produto ao carrinho
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.contains('Adicionar').click();
    });

    // 4. Verificar carrinho
    cy.get('[data-testid="cart-badge"]').should('contain', '1');

    // 5. Ir para checkout
    cy.get('[data-testid="cart-icon"]').click();
    cy.contains('Finalizar Pedido').click();

    // 6. Preencher dados (se não logado)
    cy.get('input[name="nome"]').type('Teste E2E');
    cy.get('input[name="celular"]').type('11999999999');
    cy.contains('Continuar').click();

    // 7. Escolher pagamento
    cy.contains('Cartão de Crédito').click();

    // 8. Finalizar
    cy.contains('Fazer Pedido').click();

    // 9. Verificar redirect para tracking
    cy.url().should('include', '/pedidos/');
    cy.contains('Pedido Criado').should('be.visible');

    // 10. Verificar status inicial
    cy.get('[data-testid="order-status"]').should('contain', 'Pendente');
  });
});
```

#### 2. Checkout com Cashback

```javascript
// cypress/e2e/cashback-checkout.cy.js

describe('Usar Cashback no Checkout', () => {
  beforeEach(() => {
    // Criar usuário com R$ 50 de cashback
    cy.task('createUserWithCashback', { amount: 50 });
    cy.login('test@example.com', 'senha123');
  });

  it('Aplica cashback de 50% no pedido', () => {
    // Adicionar produto de R$ 100
    cy.visit('/cardapio');
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="add-to-cart"]').click();

    // Ir para checkout
    cy.get('[data-testid="cart-icon"]').click();
    cy.contains('Finalizar Pedido').click();

    // Usar cashback
    cy.get('[data-testid="cashback-slider"]').invoke('val', 50).trigger('change');

    // Verificar desconto aplicado
    cy.get('[data-testid="cashback-discount"]').should('contain', 'R$ 50,00');
    cy.get('[data-testid="total"]').should('contain', 'R$ 60,00'); // 100 - 50 + 10% taxa

    // Finalizar pedido
    cy.contains('Fazer Pedido').click();

    // Verificar que cashback foi deduzido
    cy.visit('/cashback');
    cy.get('[data-testid="cashback-balance"]').should('contain', 'R$ 0,00');
  });
});
```

#### 3. Login SMS

```javascript
// cypress/e2e/login-sms.cy.js

describe('Login via SMS', () => {
  it('Faz login com código SMS', () => {
    cy.visit('/login');

    // Escolher login via SMS
    cy.contains('Login com SMS').click();

    // Digitar celular
    cy.get('input[name="celular"]').type('11999999999');
    cy.contains('Enviar Código').click();

    // Verificar que código foi enviado (mock)
    cy.contains('Código enviado').should('be.visible');

    // Digitar código (pegar do mock)
    cy.task('getLastSMSCode').then((code) => {
      cy.get('input[name="codigo"]').type(code);
      cy.contains('Entrar').click();
    });

    // Verificar login bem-sucedido
    cy.url().should('include', '/cardapio');
    cy.contains('Olá,').should('be.visible');
  });
});
```

#### 4. Login Google OAuth

```javascript
// cypress/e2e/login-google.cy.js

describe('Login via Google OAuth', () => {
  it('Faz login com Google', () => {
    cy.visit('/login');

    // Clicar em "Entrar com Google"
    cy.contains('Entrar com Google').click();

    // Verificar redirect para Google (mock)
    cy.origin('https://accounts.google.com', () => {
      // Simular login no Google
      cy.get('input[type="email"]').type('test@gmail.com');
      cy.get('button').contains('Próxima').click();
      cy.get('input[type="password"]').type('senha123');
      cy.get('button').contains('Próxima').click();
    });

    // Verificar callback e login bem-sucedido
    cy.url().should('include', '/cardapio');
    cy.contains('Olá,').should('be.visible');
  });
});
```

#### 5. Checkout com Stripe

```javascript
// cypress/e2e/stripe-checkout.cy.js

describe('Pagamento com Stripe', () => {
  it('Processa pagamento com cartão de crédito', () => {
    cy.login('test@example.com', 'senha123');

    // Adicionar produto ao carrinho
    cy.visit('/cardapio');
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="add-to-cart"]').click();

    // Ir para checkout
    cy.get('[data-testid="cart-icon"]').click();
    cy.contains('Finalizar Pedido').click();

    // Escolher Stripe
    cy.contains('Cartão de Crédito').click();

    // Preencher dados do cartão (Stripe test card)
    cy.get('iframe[name^="__privateStripeFrame"]').then(($iframe) => {
      const $body = $iframe.contents().find('body');
      cy.wrap($body).find('input[name="cardnumber"]').type('4242424242424242');
      cy.wrap($body).find('input[name="exp-date"]').type('12/25');
      cy.wrap($body).find('input[name="cvc"]').type('123');
    });

    // Finalizar pagamento
    cy.contains('Pagar').click();

    // Aguardar processamento
    cy.contains('Processando', { timeout: 10000 }).should('not.exist');

    // Verificar sucesso
    cy.url().should('include', '/pedidos/');
    cy.contains('Pagamento Confirmado').should('be.visible');
  });
});
```

**Estrutura de Arquivos:**

```
cypress/
├── e2e/
│   ├── order-flow.cy.js
│   ├── cashback-checkout.cy.js
│   ├── login-sms.cy.js
│   ├── login-google.cy.js
│   └── stripe-checkout.cy.js
├── fixtures/
│   ├── users.json
│   ├── products.json
│   └── orders.json
├── support/
│   ├── commands.js (cy.login, cy.createUser, etc)
│   └── e2e.js
└── cypress.config.js
```

**Estimativa:** 1 semana

**Status:** ⏸️ PENDENTE

---

### P1-7: Implementar Testes Unitários (Jest)

**Problema:**
- Jest configurado
- 3 testes básicos
- Cobertura ~5%

**Impacto:** ALTO
- Sem garantia de que lógica funciona
- Risco alto de regressões
- Refactoring perigoso

**Testes Prioritários:**

#### 1. Autenticação

```javascript
// backend/src/__tests__/auth.test.js

describe('Autenticação', () => {
  describe('Cadastro', () => {
    it('deve criar usuário com dados válidos', async () => {
      const userData = {
        nome: 'Teste',
        email: 'test@example.com',
        celular: '11999999999',
        password: 'senha123',
      };

      const user = await User.create(userData);

      expect(user.nome).toBe('Teste');
      expect(user.email).toBe('test@example.com');
      expect(user.password).not.toBe('senha123'); // hash
      expect(user.loyaltyTier).toBe('bronze');
      expect(user.cashbackBalance).toBe(0);
    });

    it('não deve criar usuário com email duplicado', async () => {
      await User.create({
        nome: 'User 1',
        email: 'duplicate@example.com',
        celular: '11999999999',
        password: 'senha123',
      });

      await expect(
        User.create({
          nome: 'User 2',
          email: 'duplicate@example.com',
          celular: '11888888888',
          password: 'senha456',
        })
      ).rejects.toThrow();
    });

    it('deve validar formato de email', async () => {
      await expect(
        User.create({
          nome: 'Teste',
          email: 'email-invalido',
          celular: '11999999999',
          password: 'senha123',
        })
      ).rejects.toThrow();
    });
  });

  describe('Login', () => {
    it('deve retornar JWT válido ao fazer login', async () => {
      const user = await User.create({
        nome: 'Teste',
        email: 'login@example.com',
        celular: '11999999999',
        password: 'senha123',
      });

      const req = {
        body: { email: 'login@example.com', password: 'senha123' },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await authController.login(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          token: expect.any(String),
          user: expect.objectContaining({ email: 'login@example.com' }),
        })
      );
    });

    it('não deve fazer login com senha errada', async () => {
      const user = await User.create({
        nome: 'Teste',
        email: 'test@example.com',
        celular: '11999999999',
        password: 'senha123',
      });

      const req = {
        body: { email: 'test@example.com', password: 'senha-errada' },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe('Verificação SMS', () => {
    it('deve gerar código SMS de 6 dígitos', async () => {
      const user = await User.create({
        nome: 'Teste',
        email: 'test@example.com',
        celular: '11999999999',
        password: 'senha123',
      });

      await smsService.sendVerificationCode(user);

      expect(user.smsCode).toMatch(/^\d{6}$/);
      expect(user.smsCodeExpiry).toBeInstanceOf(Date);
      expect(user.smsCodeExpiry.getTime()).toBeGreaterThan(Date.now());
    });

    it('deve validar código SMS correto', async () => {
      const user = await User.create({
        nome: 'Teste',
        email: 'test@example.com',
        celular: '11999999999',
        password: 'senha123',
      });

      user.smsCode = '123456';
      user.smsCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      const isValid = await user.verifySMSCode('123456');
      expect(isValid).toBe(true);
    });

    it('não deve validar código SMS expirado', async () => {
      const user = await User.create({
        nome: 'Teste',
        email: 'test@example.com',
        celular: '11999999999',
        password: 'senha123',
      });

      user.smsCode = '123456';
      user.smsCodeExpiry = new Date(Date.now() - 10 * 60 * 1000); // expirado
      await user.save();

      const isValid = await user.verifySMSCode('123456');
      expect(isValid).toBe(false);
    });
  });
});
```

#### 2. Pedidos

```javascript
// backend/src/__tests__/order.test.js

describe('Pedidos', () => {
  describe('Criação de Pedido', () => {
    it('deve criar pedido com 1 item', async () => {
      const user = await User.create({
        nome: 'Cliente',
        email: 'cliente@example.com',
        celular: '11999999999',
        password: 'senha123',
      });

      const product = await Product.create({
        name: 'Hambúrguer',
        price: 25.00,
        category: 'pratos_principais',
      });

      const order = await Order.create({
        userId: user.id,
        subtotal: 25.00,
        serviceFee: 2.50,
        total: 27.50,
      });

      await OrderItem.create({
        orderId: order.id,
        productId: product.id,
        quantity: 1,
        unitPrice: 25.00,
        subtotal: 25.00,
        productName: product.name,
        productCategory: product.category,
      });

      const orderComplete = await Order.findByPk(order.id, {
        include: [{ model: OrderItem, as: 'items' }],
      });

      expect(orderComplete.items).toHaveLength(1);
      expect(orderComplete.total).toBe(27.50);
    });

    it('deve validar estoque ao criar pedido', async () => {
      const product = await Product.create({
        name: 'Produto Limitado',
        price: 10.00,
        category: 'petiscos',
        hasStock: true,
        stock: 5,
      });

      const req = {
        user: { id: 'user-id' },
        body: {
          items: [{ productId: product.id, quantity: 10 }], // mais que estoque
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await orderController.createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.stringContaining('sem estoque'),
        })
      );
    });

    it('deve calcular taxa de serviço corretamente (10%)', async () => {
      const order = await Order.create({
        userId: 'user-id',
        subtotal: 100.00,
        serviceFee: 0, // será calculado no hook
        total: 0,
      });

      expect(order.serviceFee).toBe(10.00);
      expect(order.total).toBe(110.00);
    });

    it('deve aplicar cashback usado no total', async () => {
      const user = await User.create({
        nome: 'Cliente',
        email: 'cliente@example.com',
        celular: '11999999999',
        password: 'senha123',
        cashbackBalance: 50.00,
      });

      const order = await Order.create({
        userId: user.id,
        subtotal: 100.00,
        serviceFee: 10.00,
        total: 110.00,
        cashbackUsed: 50.00,
      });

      expect(order.total).toBe(60.00); // 110 - 50
    });
  });

  describe('Status Machine', () => {
    it('deve transicionar pending → confirmed', async () => {
      const order = await Order.create({
        userId: 'user-id',
        subtotal: 100.00,
        serviceFee: 10.00,
        total: 110.00,
        status: 'pending',
      });

      order.status = 'confirmed';
      await order.save();

      expect(order.confirmedAt).toBeInstanceOf(Date);
    });

    it('deve transicionar confirmed → preparing → ready → delivered', async () => {
      const order = await Order.create({
        userId: 'user-id',
        subtotal: 100.00,
        total: 110.00,
        status: 'pending',
      });

      order.status = 'confirmed';
      await order.save();
      expect(order.confirmedAt).toBeTruthy();

      order.status = 'preparing';
      await order.save();
      expect(order.startedAt).toBeTruthy();

      order.status = 'ready';
      await order.save();
      expect(order.finishedAt).toBeTruthy();

      order.status = 'delivered';
      await order.save();
      expect(order.deliveredAt).toBeTruthy();
    });

    it('não deve permitir transição inválida (pending → ready)', async () => {
      const order = await Order.create({
        userId: 'user-id',
        subtotal: 100.00,
        total: 110.00,
        status: 'pending',
      });

      // Lógica de validação de transição (se implementada)
      // expect(() => order.status = 'ready').toThrow();
    });
  });

  describe('Cashback Automático', () => {
    it('deve adicionar cashback quando status = delivered', async () => {
      const user = await User.create({
        nome: 'Cliente',
        email: 'cliente@example.com',
        celular: '11999999999',
        password: 'senha123',
        cashbackBalance: 0,
        loyaltyTier: 'silver', // 5%
      });

      const order = await Order.create({
        userId: user.id,
        subtotal: 100.00,
        total: 110.00,
        status: 'pending',
      });

      // Mudar status para delivered
      order.status = 'delivered';
      await order.save();

      // Verificar que cashback foi adicionado
      await user.reload();
      expect(user.cashbackBalance).toBe(5.00); // 5% de 100
    });

    it('não deve adicionar cashback duas vezes', async () => {
      const user = await User.create({
        nome: 'Cliente',
        email: 'cliente@example.com',
        celular: '11999999999',
        password: 'senha123',
        cashbackBalance: 0,
        loyaltyTier: 'silver',
      });

      const order = await Order.create({
        userId: user.id,
        subtotal: 100.00,
        total: 110.00,
        status: 'pending',
      });

      // Primeira vez
      order.status = 'delivered';
      await order.save();
      await user.reload();
      expect(user.cashbackBalance).toBe(5.00);

      // Tentar adicionar novamente (salvar sem mudar status)
      await order.save();
      await user.reload();
      expect(user.cashbackBalance).toBe(5.00); // não deve duplicar
    });
  });
});
```

#### 3. Cashback

```javascript
// backend/src/__tests__/cashback.test.js

describe('Sistema de Cashback', () => {
  describe('Tiers', () => {
    it('deve calcular tier Bronze (R$ 0-999)', async () => {
      const user = await User.create({
        nome: 'Cliente',
        email: 'bronze@example.com',
        celular: '11999999999',
        password: 'senha123',
        totalSpent: 500,
      });

      const tier = user.calculateTier();
      expect(tier).toBe('bronze');
    });

    it('deve calcular tier Silver (R$ 1.000-4.999)', async () => {
      const user = await User.create({
        nome: 'Cliente',
        email: 'silver@example.com',
        celular: '11999999999',
        password: 'senha123',
        totalSpent: 2500,
      });

      const tier = user.calculateTier();
      expect(tier).toBe('silver');
    });

    it('deve calcular tier Gold (R$ 5.000-9.999)', async () => {
      const user = await User.create({
        nome: 'Cliente',
        email: 'gold@example.com',
        celular: '11999999999',
        password: 'senha123',
        totalSpent: 7000,
      });

      const tier = user.calculateTier();
      expect(tier).toBe('gold');
    });

    it('deve calcular tier Platinum (R$ 10.000+)', async () => {
      const user = await User.create({
        nome: 'Cliente',
        email: 'platinum@example.com',
        celular: '11999999999',
        password: 'senha123',
        totalSpent: 15000,
      });

      const tier = user.calculateTier();
      expect(tier).toBe('platinum');
    });

    it('deve atualizar tier automaticamente ao aumentar totalSpent', async () => {
      const user = await User.create({
        nome: 'Cliente',
        email: 'upgrade@example.com',
        celular: '11999999999',
        password: 'senha123',
        totalSpent: 900,
        loyaltyTier: 'bronze',
      });

      user.totalSpent = 1200;
      await user.save();

      expect(user.loyaltyTier).toBe('silver');
    });
  });

  describe('Percentual de Cashback', () => {
    it('Bronze deve retornar 2%', async () => {
      const user = await User.create({
        nome: 'Cliente',
        email: 'test@example.com',
        celular: '11999999999',
        password: 'senha123',
        loyaltyTier: 'bronze',
      });

      const benefits = user.getTierBenefits();
      expect(benefits.cashbackPercentage).toBe(2);
    });

    it('Silver deve retornar 5%', async () => {
      const user = await User.create({
        nome: 'Cliente',
        email: 'test@example.com',
        celular: '11999999999',
        password: 'senha123',
        loyaltyTier: 'silver',
      });

      const benefits = user.getTierBenefits();
      expect(benefits.cashbackPercentage).toBe(5);
    });

    it('Gold deve retornar 8%', async () => {
      const user = await User.create({
        nome: 'Cliente',
        email: 'test@example.com',
        celular: '11999999999',
        password: 'senha123',
        loyaltyTier: 'gold',
      });

      const benefits = user.getTierBenefits();
      expect(benefits.cashbackPercentage).toBe(8);
    });

    it('Platinum deve retornar 10%', async () => {
      const user = await User.create({
        nome: 'Cliente',
        email: 'test@example.com',
        celular: '11999999999',
        password: 'senha123',
        loyaltyTier: 'platinum',
      });

      const benefits = user.getTierBenefits();
      expect(benefits.cashbackPercentage).toBe(10);
    });
  });

  describe('Adicionar Cashback', () => {
    it('deve adicionar cashback corretamente', async () => {
      const user = await User.create({
        nome: 'Cliente',
        email: 'test@example.com',
        celular: '11999999999',
        password: 'senha123',
        cashbackBalance: 10.00,
      });

      await user.addCashback(5.00, null, 'Teste');

      expect(user.cashbackBalance).toBe(15.00);

      const history = await CashbackHistory.findOne({
        where: { userId: user.id },
      });
      expect(history.amount).toBe(5.00);
      expect(history.type).toBe('earned');
      expect(history.balanceBefore).toBe(10.00);
      expect(history.balanceAfter).toBe(15.00);
    });

    it('deve criar registro em CashbackHistory', async () => {
      const user = await User.create({
        nome: 'Cliente',
        email: 'test@example.com',
        celular: '11999999999',
        password: 'senha123',
        cashbackBalance: 0,
      });

      await user.addCashback(10.00, 'order-id', 'Pedido #123');

      const count = await CashbackHistory.count({
        where: { userId: user.id },
      });
      expect(count).toBe(1);
    });
  });

  describe('Usar Cashback', () => {
    it('deve deduzir cashback corretamente', async () => {
      const user = await User.create({
        nome: 'Cliente',
        email: 'test@example.com',
        celular: '11999999999',
        password: 'senha123',
        cashbackBalance: 50.00,
      });

      await user.useCashback(20.00, 'Usado no pedido');

      expect(user.cashbackBalance).toBe(30.00);

      const history = await CashbackHistory.findOne({
        where: { userId: user.id, type: 'redeemed' },
      });
      expect(history.amount).toBe(-20.00);
      expect(history.balanceBefore).toBe(50.00);
      expect(history.balanceAfter).toBe(30.00);
    });

    it('não deve permitir usar mais cashback que disponível', async () => {
      const user = await User.create({
        nome: 'Cliente',
        email: 'test@example.com',
        celular: '11999999999',
        password: 'senha123',
        cashbackBalance: 10.00,
      });

      await expect(
        user.useCashback(50.00, 'Tentativa de usar mais que disponível')
      ).rejects.toThrow('Saldo de cashback insuficiente');
    });

    it('deve respeitar limite de 50% do pedido', async () => {
      const user = await User.create({
        nome: 'Cliente',
        email: 'test@example.com',
        celular: '11999999999',
        password: 'senha123',
        cashbackBalance: 100.00,
      });

      const orderTotal = 100.00;
      const maxCashback = orderTotal * 0.5; // 50% = R$ 50

      await user.useCashback(maxCashback, 'Usado no pedido');

      expect(user.cashbackBalance).toBe(50.00);
    });
  });

  describe('Expiração', () => {
    it('deve criar cashback com data de expiração (90 dias)', async () => {
      const user = await User.create({
        nome: 'Cliente',
        email: 'test@example.com',
        celular: '11999999999',
        password: 'senha123',
      });

      await user.addCashback(10.00, null, 'Teste');

      const history = await CashbackHistory.findOne({
        where: { userId: user.id },
      });

      expect(history.expiresAt).toBeInstanceOf(Date);

      const diffDays = Math.floor(
        (history.expiresAt - new Date()) / (1000 * 60 * 60 * 24)
      );
      expect(diffDays).toBeGreaterThanOrEqual(89);
      expect(diffDays).toBeLessThanOrEqual(91);
    });
  });
});
```

#### 4. Payment Service (Stripe)

```javascript
// backend/src/__tests__/payment.test.js

const stripe = require('stripe');
const paymentService = require('../services/payment.service');

jest.mock('stripe');

describe('Payment Service', () => {
  describe('Criar Payment Intent', () => {
    it('deve criar payment intent no Stripe', async () => {
      const mockCreate = jest.fn().mockResolvedValue({
        id: 'pi_123',
        client_secret: 'secret_123',
        status: 'requires_payment_method',
      });

      stripe.mockReturnValue({
        paymentIntents: { create: mockCreate },
      });

      const result = await paymentService.createPaymentIntent(100.00, 'BRL');

      expect(mockCreate).toHaveBeenCalledWith({
        amount: 10000, // em centavos
        currency: 'brl',
      });
      expect(result.id).toBe('pi_123');
      expect(result.client_secret).toBe('secret_123');
    });

    it('deve tratar erro do Stripe', async () => {
      const mockCreate = jest.fn().mockRejectedValue(
        new Error('Stripe error')
      );

      stripe.mockReturnValue({
        paymentIntents: { create: mockCreate },
      });

      await expect(
        paymentService.createPaymentIntent(100.00, 'BRL')
      ).rejects.toThrow('Stripe error');
    });
  });

  describe('Confirmar Pagamento', () => {
    it('deve confirmar payment intent', async () => {
      const mockConfirm = jest.fn().mockResolvedValue({
        id: 'pi_123',
        status: 'succeeded',
      });

      stripe.mockReturnValue({
        paymentIntents: { confirm: mockConfirm },
      });

      const result = await paymentService.confirmPayment('pi_123');

      expect(mockConfirm).toHaveBeenCalledWith('pi_123');
      expect(result.status).toBe('succeeded');
    });
  });

  describe('Webhook', () => {
    it('deve processar webhook de pagamento bem-sucedido', async () => {
      const event = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_123',
            metadata: { orderId: 'order-123' },
          },
        },
      };

      const order = await Order.create({
        id: 'order-123',
        userId: 'user-id',
        subtotal: 100.00,
        total: 110.00,
        paymentStatus: 'processing',
      });

      await paymentService.handleWebhook(event);

      await order.reload();
      expect(order.paymentStatus).toBe('completed');
    });

    it('deve processar webhook de pagamento falhado', async () => {
      const event = {
        type: 'payment_intent.payment_failed',
        data: {
          object: {
            id: 'pi_123',
            metadata: { orderId: 'order-123' },
          },
        },
      };

      const order = await Order.create({
        id: 'order-123',
        userId: 'user-id',
        subtotal: 100.00,
        total: 110.00,
        paymentStatus: 'processing',
      });

      await paymentService.handleWebhook(event);

      await order.reload();
      expect(order.paymentStatus).toBe('failed');
    });
  });
});
```

**Estimativa:** 2 semanas

**Status:** ⏸️ PENDENTE

---

### P1-8: Atualizar PRD

**Problema:**
- PRD está em v3.6.0 (09/12/2024)
- Sistema está em v3.5.0+ (com Sprints 60+)
- Divergências documentadas

**Impacto:** BAIXO
- Documentação desatualizada
- Confusão para novos desenvolvedores

**O que Atualizar:**

1. **Sprint 58** - Pagamento com Atendente
   - Pagamento em dinheiro
   - Cartão na mesa
   - Confirmação manual
   - Cálculo de troco

2. **Sprint 60** - Divisão de Conta
   - Model SplitPayment
   - Lógica de divisão
   - UI de divisão

3. **Estatísticas Atualizadas:**
   - Models: 20 → 22
   - Páginas: 45 → 50
   - Migrations: 15 → 18

**Arquivos Afetados:**
- `docs/03_PRD.md` (atualizar)

**Estimativa:** 1 dia

**Status:** ⏸️ PENDENTE

---

## 🎨 P2 - MELHORIAS (6-8 semanas)

### P2-1: Documentação Swagger/OpenAPI

**Benefícios:**
- Documentação automática das APIs
- Teste interativo de endpoints
- Geração de clientes automaticamente

**Solução:**

```javascript
// backend/src/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Flame Lounge API',
      version: '1.0.0',
      description: 'API completa do Flame Lounge Bar & Restaurant',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development',
      },
      {
        url: 'https://api.flamelounge.com',
        description: 'Production',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js', './src/models/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerSpec };
```

**Documentar Rotas:**

```javascript
// backend/src/routes/orders.js

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - paymentMethod
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       format: uuid
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *               tableId:
 *                 type: string
 *                 format: uuid
 *               paymentMethod:
 *                 type: string
 *                 enum: [credit_card, debit_card, pix, cash, pay_later]
 *               cashbackUsed:
 *                 type: number
 *                 minimum: 0
 *               tip:
 *                 type: number
 *                 minimum: 0
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       500:
 *         description: Erro no servidor
 */
router.post('/orders', authMiddleware, createOrderValidation, orderController.createOrder);
```

**Montar no Server:**

```javascript
// backend/src/server.js
const { swaggerUi, swaggerSpec } = require('./swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

**Estimativa:** 1 semana

**Status:** ⏸️ PENDENTE

---

### P2-2: Error Boundaries no Frontend

**Ver P1-2 acima** (já documentado)

---

### P2-3: Melhorar UI de Ficha Técnica

**Situação Atual:**
- Backend 100% funcional
- UI básica mas poderia ser mais visual

**Melhorias:**

1. **Drag-and-Drop para Ingredientes**
2. **Cálculo Automático de Custo**
3. **Preview Visual da Receita**
4. **Alertas de Ingredientes Sem Estoque**

**Estimativa:** 1 semana

**Status:** ⏸️ PENDENTE

---

### P2-4: Dashboard de Cashback para Cliente

**Melhorias:**
- Barra de progresso visual para próximo tier
- Quantidade faltante (R$)
- Estimativa de tempo para alcançar
- Gráfico de acúmulo mensal

**Estimativa:** 1 semana

**Status:** ⏸️ PENDENTE

---

### P2-5: Model Settings

**Problema:**
- Configurações em `/admin/settings` são hardcoded
- Não há model Settings

**Solução:**
1. Criar model `Settings`
2. Criar `settingsController.js`
3. UI em `/admin/settings` salva no banco

**Estimativa:** 2 dias

**Status:** ⏸️ PENDENTE

---

### P2-6: Rate Limiting Granular

**Melhorias:**
- Limite diferenciado por tipo de endpoint
- Limite por usuário autenticado vs anônimo
- Headers informativos (X-RateLimit-Remaining)

**Estimativa:** 1 dia

**Status:** ⏸️ PENDENTE

---

### P2-7: CDN para Imagens (Cloudinary)

**Benefícios:**
- Carregamento mais rápido
- Redimensionamento automático
- Cache global
- Custo baixo

**Estimativa:** 2 dias

**Status:** ⏸️ PENDENTE

---

### P2-8: Logs Estruturados (Winston)

**Benefícios:**
- Logs estruturados (JSON)
- Níveis (debug, info, warn, error)
- Rotação automática de arquivos
- Integração com ferramentas de monitoramento

**Estimativa:** 2 dias

**Status:** ⏸️ PENDENTE

---

### P2-9: Importação/Exportação CSV de Produtos

**Benefícios:**
- Atualização em massa de preços
- Importação de catálogos de fornecedores
- Backup de produtos

**Estimativa:** 3 dias

**Status:** ⏸️ PENDENTE

---

### P2-10: Integração com Google Calendar

**Benefício:**
- Sincronizar reservas com calendário do estabelecimento
- Evitar conflitos manuais

**Estimativa:** 1 semana

**Status:** ⏸️ PENDENTE

---

## 📈 CRONOGRAMA RECOMENDADO

### Semana 1-2: P0 - Bloqueadores Críticos

**Dias 1-2:**
- ✅ P0-1: Validação de estoque (2h)
- ✅ P0-2: Transaction rollback (3h)

**Dias 3-7:**
- ✅ P0-3: Divisão de conta completa (2 dias)

### Semana 3-4: P1 Alta Prioridade (Parte 1)

**Semana 3:**
- ✅ P1-1: Loading states (1 semana)

**Semana 4:**
- ✅ P1-2: Error states (3 dias)
- ✅ P1-4: Google OAuth (0.5 dia)

### Semana 5-6: P1 Alta Prioridade (Parte 2)

**Semana 5:**
- ✅ P1-3: Validação de APIs (1 semana)

**Semana 6:**
- ✅ P1-5: Centralizar código duplicado (3 dias)
- ✅ P1-8: Atualizar PRD (1 dia)

### Semana 7-8: P1 Alta Prioridade (Parte 3 - Testes)

**Semanas 7-8:**
- ✅ P1-6: Testes E2E Cypress (1 semana)
- ✅ P1-7: Testes Unitários Jest (2 semanas - paralelizar)

### Semanas 9-16: P2 Melhorias

**Distribuir ao longo de 8 semanas:**
- P2-1: Swagger (1 semana)
- P2-3: UI Ficha Técnica (1 semana)
- P2-4: Dashboard Cashback (1 semana)
- P2-5: Model Settings (2 dias)
- P2-6: Rate Limiting (1 dia)
- P2-7: CDN Imagens (2 dias)
- P2-8: Logs Winston (2 dias)
- P2-9: CSV Produtos (3 dias)
- P2-10: Google Calendar (1 semana)

---

## 🎯 METAS DE SCORE 7D

### Score Atual: 70.25%

| Dimensão | Atual | Meta Curto Prazo | Meta Longo Prazo |
|----------|-------|------------------|------------------|
| D1 - Documentação | 70% | 85% | 95% |
| D2 - Código | 90% | 95% | 98% |
| D3 - Testes | 15% | 60% | 85% |
| D4 - UX/UI | 85% | 95% | 98% |
| D5 - Segurança | 75% | 90% | 95% |
| D6 - Performance | 70% | 85% | 90% |
| D7 - Validação Real | 95% | 95% | 100% |

**Score Meta Curto Prazo (após P0+P1):** 85% (PRODUCTION READY)
**Score Meta Longo Prazo (após P2):** 92% (INVESTOR READY)

---

## ✅ PRÓXIMOS PASSOS IMEDIATOS

### AGORA (Esta Semana):

1. ✅ **P0-1:** Adicionar validação de estoque ao criar pedido
2. ✅ **P0-2:** Implementar transaction rollback
3. ✅ **P0-3:** Começar divisão de conta completa

### PRÓXIMA SEMANA:

4. ✅ **P0-3:** Finalizar divisão de conta
5. ✅ **P1-1:** Adicionar loading states

---

## 📝 CONCLUSÃO

O projeto **Flame Lounge** está **95% completo** e **em produção estável**. Com a execução das **3 tasks P0** (2-3 dias), o sistema estará **100% funcional** sem bloqueadores críticos.

A execução das **8 tasks P1** (4-6 semanas) elevará o **Score 7D de 70% para 85%**, atingindo o nível **PRODUCTION READY**.

As **10 tasks P2** (6-8 semanas) são melhorias que levarão o projeto ao nível **INVESTOR READY (92%)**, com testes completos, documentação Swagger, e otimizações avançadas.

**Recomendação:** Focar 100% nas tasks P0 nos próximos 3 dias para eliminar bloqueadores críticos.

---

**Criado por:** MANUS v7.1 (Claude Sonnet 4.5)
**Data:** 2026-01-16
**Próxima Revisão:** Após completar P0

**Total de Tasks:** 21 tasks (3 P0 + 8 P1 + 10 P2)
**Tempo Total Estimado:** 12-16 semanas (3 meses)

---

## 🔗 LINKS IMPORTANTES

- [MANUS_TASKS.md](docs/MANUS_TASKS.md) - SSOT de tasks
- [architecture.md](docs/architecture.md) - Arquitetura completa
- [database-schema.md](docs/database-schema.md) - Schema do banco
- [03_PRD.md](docs/03_PRD.md) - Product Requirements Document
- [RELATORIO_AUDITORIA.md](.manus/scoring/AUDIT_REPORTS/audit_20260116.md) - Relatório de auditoria completo (gerado pelo agente)
