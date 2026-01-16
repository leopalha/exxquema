# Database Schema Documentation - FLAME Lounge Bar

## Visao Geral

O sistema FLAME Lounge Bar utiliza **PostgreSQL** como banco de dados principal com **Sequelize ORM** para gerenciamento de modelos e migracoes. A arquitetura foi desenvolvida para suportar um sistema completo de bar/restaurante com recursos avancados de cashback, narguilé, reservas e CRM.

### Tecnologias
- **Banco de Dados**: PostgreSQL 14+
- **ORM**: Sequelize v6
- **Total de Models**: 20 modelos principais
- **Migrations**: Sistema versionado para controle de schema

### Caracteristicas Principais
- Autenticacao multi-provedor (Local, Google OAuth, SMS)
- Sistema de pedidos com rastreamento em tempo real
- Cashback com tiers (Bronze, Prata, Ouro, Platina)
- Gerenciamento de narguilé com temporizacao
- Sistema de reservas com confirmacao
- Controle de caixa e movimentacoes financeiras
- Gestao de estoque (produtos e ingredientes)
- Chat entre staff e cliente vinculado a pedidos
- Divisao de conta entre multiplos usuarios

---

## Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              FLAME LOUNGE BAR - ERD                              │
└─────────────────────────────────────────────────────────────────────────────────┘

                                    ┌──────────┐
                                    │  Users   │
                                    │ (UUID)   │
                                    └────┬─────┘
                                         │
                ┌────────────────────────┼────────────────────────────┐
                │                        │                            │
                │                        │                            │
         ┌──────▼───────┐        ┌──────▼───────┐          ┌────────▼────────┐
         │   Orders     │        │ Reservations │          │  CashbackHistory│
         │   (UUID)     │        │   (UUID)     │          │     (UUID)      │
         └──────┬───────┘        └──────┬───────┘          └─────────────────┘
                │                       │
                │                       │
        ┌───────┼───────┐               │
        │       │       │               │
┌───────▼──┐ ┌──▼─────────────┐ ┌──────▼──────┐
│OrderItems│ │ SplitPayments  │ │   Tables    │
│  (UUID)  │ │    (UUID)      │ │   (UUID)    │
└────┬─────┘ └────────────────┘ └──────┬──────┘
     │                                  │
     │                           ┌──────┼──────┐
     │                           │             │
┌────▼────────┐         ┌────────▼────┐  ┌────▼──────────┐
│  Products   │         │HookahSession│  │  Messages     │
│   (UUID)    │         │   (UUID)    │  │   (UUID)      │
└─────┬───────┘         └────┬────────┘  └───────────────┘
      │                      │
      │                      │
      │              ┌───────▼────────┐
      │              │ HookahFlavors  │
      │              │    (UUID)      │
      │              └────────────────┘
      │
      │
┌─────▼──────────┐
│  RecipeItems   │
│    (UUID)      │
└────┬───────────┘
     │
     │
┌────▼──────────┐       ┌──────────────────┐
│ Ingredients   │◄──────┤IngredientMovement│
│   (UUID)      │       │     (UUID)       │
└───────────────┘       └──────────────────┘


┌──────────────┐       ┌─────────────────┐
│   Cashiers   │◄──────┤CashierMovements │
│    (UUID)    │       │     (UUID)      │
└──────────────┘       └─────────────────┘


┌──────────────┐       ┌──────────────────┐       ┌─────────────────┐
│   Users      │◄──────┤PushSubscriptions │       │   Campaigns     │
│   (UUID)     │       │     (UUID)       │       │     (UUID)      │
└──────────────┘       └──────────────────┘       └─────────────────┘


┌──────────────┐       ┌──────────────────┐
│   Orders     │◄──────┤InstagramCashback │
│   (UUID)     │       │     (UUID)       │
└──────────────┘       └──────────────────┘


┌──────────────┐
│InventoryMove │
│   (UUID)     │
└──────────────┘
```

---

## Models Detalhados

### 1. User (users)

Gerencia usuarios do sistema (clientes e funcionarios).

#### Schema

```javascript
{
  id: UUID (PK),
  nome: STRING(100) NOT NULL,
  cpf: STRING(14) UNIQUE,
  email: STRING UNIQUE,
  celular: STRING(20) NOT NULL UNIQUE,
  password: STRING (hash bcrypt),
  role: ENUM('cliente', 'atendente', 'cozinha', 'bar', 'caixa', 'gerente', 'admin') DEFAULT 'cliente',
  isActive: BOOLEAN DEFAULT true,
  emailVerified: BOOLEAN DEFAULT false,
  phoneVerified: BOOLEAN DEFAULT false,
  profileComplete: BOOLEAN DEFAULT false,

  // SMS Verification
  smsCode: STRING(6),
  smsAttempts: INTEGER DEFAULT 0,
  smsCodeExpiry: DATE,
  lastLogin: DATE,

  // CRM Metrics
  totalOrders: INTEGER DEFAULT 0,
  totalSpent: DECIMAL(10,2) DEFAULT 0,
  lastVisit: DATE,
  lastOrderDate: DATE,

  // Google OAuth
  googleId: STRING UNIQUE,
  googleProfilePicture: STRING,
  authProvider: ENUM('local', 'google') DEFAULT 'local',

  // Cashback System
  cashbackBalance: DECIMAL(10,2) DEFAULT 0,
  loyaltyTier: ENUM('bronze', 'silver', 'gold', 'platinum') DEFAULT 'bronze',
  birthDate: DATEONLY,
  lastBirthdayBonusYear: INTEGER,

  // Referral System
  referralCode: STRING(10) UNIQUE,
  referredBy: UUID,
  referralBonusGiven: BOOLEAN DEFAULT false,
  totalReferrals: INTEGER DEFAULT 0,

  // International Support
  countryCode: STRING(2),
  foreignId: STRING(30),

  // Instagram Cashback
  cashbackEnabled: BOOLEAN DEFAULT false,
  lastInstagramCashbackAt: DATE,
  instagramValidationsCount: INTEGER DEFAULT 0,

  createdAt: DATE,
  updatedAt: DATE
}
```

#### Metodos de Instancia

- `checkPassword(password)` - Verifica senha com bcrypt
- `isAdmin()` - Retorna se e admin
- `isEmployee()` - Retorna se e funcionario
- `hasCompleteProfile()` - Verifica se perfil esta completo
- `calculateTier()` - Calcula tier baseado em totalSpent
- `updateTier()` - Atualiza tier automaticamente
- `addCashback(amount, orderId, description)` - Adiciona cashback
- `useCashback(maxAmount, description)` - Usa cashback disponivel
- `getTierBenefits()` - Retorna beneficios do tier atual
- `getNextTierInfo()` - Info para proximo tier

#### Relacionamentos

- **1:N** → Orders (como customer)
- **1:N** → Orders (como attendant)
- **1:N** → Orders (como kitchenUser)
- **1:N** → Reservations
- **1:N** → CashbackHistory
- **1:N** → Cashiers
- **1:N** → CashierMovements
- **1:N** → PushSubscriptions
- **1:N** → Campaigns
- **1:N** → Messages
- **1:N** → SplitPayments

#### Indices

```javascript
indexes: [
  { fields: ['email'] },
  { fields: ['celular'], unique: true },
  { fields: ['cpf'], unique: true },
  { fields: ['googleId'], unique: true },
  { fields: ['referralCode'], unique: true },
  { fields: ['role'] },
  { fields: ['loyaltyTier'] }
]
```

---

### 2. Product (products)

Catalogo de produtos (bebidas, comidas, narguilé).

#### Schema

```javascript
{
  id: UUID (PK),
  name: STRING(100) NOT NULL,
  description: TEXT,
  price: DECIMAL(8,2) NOT NULL,
  category: ENUM(
    'bebidas_alcoolicas',
    'bebidas_nao_alcoolicas',
    'drinks_autorais',
    'petiscos',
    'pratos_principais',
    'sobremesas',
    'porcoes',
    'combos',
    'hookah'
  ) NOT NULL,
  subcategory: STRING(50),
  image: STRING,
  ingredients: TEXT,
  allergens: JSON ARRAY,
  dietary: JSON ARRAY, // ['vegetariano', 'vegano', 'sem_lactose', 'sem_gluten']
  preparationTime: INTEGER DEFAULT 15,
  calories: INTEGER,
  isActive: BOOLEAN DEFAULT true,
  isPromotional: BOOLEAN DEFAULT false,
  discountPercentage: DECIMAL(5,2),
  hasStock: BOOLEAN DEFAULT false,
  stock: INTEGER,
  minStock: INTEGER DEFAULT 5,
  position: INTEGER DEFAULT 0,
  tags: JSON ARRAY,
  isSignature: BOOLEAN DEFAULT false,
  alcoholicContent: DECIMAL(4,2),
  volume: STRING(20),
  spiceLevel: INTEGER (0-5),
  createdAt: DATE,
  updatedAt: DATE
}
```

#### Metodos de Instancia

- `isAvailable()` - Verifica se esta disponivel
- `getPriceWithDiscount()` - Calcula preco com desconto
- `isVegetarian()` - Verifica se e vegetariano
- `isLactoseFree()` - Verifica se e sem lactose

#### Relacionamentos

- **1:N** → OrderItems
- **1:N** → InventoryMovements
- **1:N** → RecipeItems

#### Indices

```javascript
indexes: [
  { fields: ['category'] },
  { fields: ['isActive'] },
  { fields: ['position'] },
  { fields: ['name'], type: 'fulltext' }
]
```

---

### 3. Table (tables)

Mesas do estabelecimento.

#### Schema

```javascript
{
  id: UUID (PK),
  number: INTEGER NOT NULL UNIQUE,
  name: STRING(50),
  capacity: INTEGER DEFAULT 4,
  location: ENUM('interno', 'externo', 'balcao', 'vip', 'reservado') DEFAULT 'interno',
  status: ENUM('available', 'occupied', 'reserved', 'maintenance') DEFAULT 'available',
  isActive: BOOLEAN DEFAULT true,
  qrCode: STRING,
  lastCleaned: DATE,
  notes: TEXT,
  position: JSON, // {x: 100, y: 200}
  createdAt: DATE,
  updatedAt: DATE
}
```

#### Metodos de Instancia

- `isOccupied()` - Verifica se esta ocupada
- `isAvailable()` - Verifica se esta disponivel
- `getQRCodeURL()` - Gera URL do QR code

#### Relacionamentos

- **1:N** → Orders
- **1:N** → HookahSessions
- **1:N** → Reservations

#### Indices

```javascript
indexes: [
  { fields: ['number'], unique: true },
  { fields: ['status'] },
  { fields: ['isActive'] }
]
```

---

### 4. Order (orders)

Pedidos dos clientes.

#### Schema

```javascript
{
  id: UUID (PK),
  orderNumber: INTEGER AUTO_INCREMENT UNIQUE,
  userId: UUID FK NOT NULL → users.id,
  tableId: UUID FK → tables.id,
  status: ENUM(
    'pending',
    'pending_payment',
    'confirmed',
    'preparing',
    'ready',
    'on_way',
    'delivered',
    'cancelled'
  ) DEFAULT 'pending',
  paymentStatus: ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  paymentMethod: ENUM(
    'credit_card',
    'debit_card',
    'pix',
    'apple_pay',
    'cash',
    'pay_later',
    'card_at_table',
    'split'
  ),
  paymentId: STRING,
  subtotal: DECIMAL(8,2) NOT NULL,
  serviceFee: DECIMAL(6,2) DEFAULT 0,
  taxes: DECIMAL(6,2) DEFAULT 0,
  total: DECIMAL(8,2) NOT NULL,
  notes: TEXT,
  estimatedTime: INTEGER DEFAULT 20,

  // Timeline
  confirmedAt: DATE,
  startedAt: DATE,
  finishedAt: DATE,
  pickedUpAt: DATE,
  deliveredAt: DATE,
  cancelledAt: DATE,
  cancelledBy: UUID FK → users.id,
  preparationTime: INTEGER,

  // Staff
  attendantId: UUID FK → users.id,
  kitchenUserId: UUID FK → users.id,

  // Rating
  rating: INTEGER (1-5),
  review: TEXT,
  isDelivered: BOOLEAN DEFAULT false,

  // Discounts & Tips
  cashbackUsed: DECIMAL(8,2) DEFAULT 0,
  discount: DECIMAL(8,2) DEFAULT 0,
  tip: DECIMAL(8,2) DEFAULT 0,

  // Instagram Cashback
  wantsInstagramCashback: BOOLEAN DEFAULT false,
  instagramCashbackStatus: ENUM('pending_validation', 'validated', 'rejected', null),
  instagramValidatedBy: UUID FK → users.id,
  instagramValidatedAt: DATE,

  createdAt: DATE,
  updatedAt: DATE
}
```

#### Metodos de Instancia

- `calculateTotal()` - Calcula total do pedido
- `isDelayed()` - Verifica se esta atrasado (>30min)
- `getPreparationTime()` - Calcula tempo de preparo
- `canBeCancelled()` - Verifica se pode ser cancelado
- `getNextValidStatus()` - Proximo status valido
- `isAttendantPayment()` - Verifica se e pagamento com atendente

#### Relacionamentos

- **N:1** → User (customer)
- **N:1** → User (attendant)
- **N:1** → User (kitchenUser)
- **N:1** → Table
- **1:N** → OrderItems
- **1:N** → InventoryMovements
- **1:N** → CashbackHistory
- **1:N** → CashierMovements
- **1:N** → Messages
- **1:N** → SplitPayments

#### Hooks

- `beforeCreate`: Calcula taxa de servico e total
- `beforeUpdate`: Atualiza timestamps baseado no status
- `afterCreate`: Atualiza metricas CRM do usuario
- `afterUpdate`: Adiciona cashback quando pedido e entregue

#### Indices

```javascript
indexes: [
  { fields: ['userId'] },
  { fields: ['tableId'] },
  { fields: ['status'] },
  { fields: ['paymentStatus'] },
  { fields: ['orderNumber'], unique: true },
  { fields: ['createdAt'] }
]
```

---

### 5. OrderItem (order_items)

Itens individuais de cada pedido.

#### Schema

```javascript
{
  id: UUID (PK),
  orderId: UUID FK NOT NULL → orders.id,
  productId: UUID FK NOT NULL → products.id,
  quantity: INTEGER NOT NULL (1-50),
  unitPrice: DECIMAL(8,2) NOT NULL,
  subtotal: DECIMAL(8,2) NOT NULL,
  notes: TEXT,
  status: ENUM('pending', 'preparing', 'ready', 'delivered') DEFAULT 'pending',

  // Snapshot do produto
  productName: STRING NOT NULL,
  productDescription: TEXT,
  productImage: STRING,
  productCategory: STRING NOT NULL,

  createdAt: DATE,
  updatedAt: DATE
}
```

#### Metodos de Instancia

- `getSubtotal()` - Calcula subtotal do item
- `hasSpecialRequests()` - Verifica se tem observacoes

#### Relacionamentos

- **N:1** → Order
- **N:1** → Product

#### Hooks

- `beforeSave`: Calcula subtotal automaticamente

#### Indices

```javascript
indexes: [
  { fields: ['orderId'] },
  { fields: ['productId'] },
  { fields: ['status'] }
]
```

---

### 6. Reservation (reservations)

Reservas de mesas.

#### Schema

```javascript
{
  id: UUID (PK),
  userId: UUID FK → users.id,
  confirmationCode: STRING(12) UNIQUE NOT NULL,
  guestName: STRING(100) NOT NULL,
  guestEmail: STRING(100) NOT NULL,
  guestPhone: STRING(20) NOT NULL,
  reservationDate: DATE NOT NULL,
  partySize: INTEGER NOT NULL (1-50),
  status: ENUM('pending', 'confirmed', 'cancelled', 'no_show', 'completed') DEFAULT 'pending',
  specialRequests: TEXT,
  guestNotes: TEXT,
  tableId: UUID FK → tables.id,
  confirmedAt: DATE,
  arrivedAt: DATE,
  cancelledAt: DATE,
  cancelReason: TEXT,
  reminderSentAt: DATE,
  createdAt: DATE,
  updatedAt: DATE
}
```

#### Metodos de Instancia

- `isConfirmed()` - Verifica se esta confirmada
- `isPast()` - Verifica se ja passou
- `isUpcoming()` - Verifica se e futura
- `getTimeUntilReservation()` - Tempo ate a reserva (minutos)
- `shouldSendReminder()` - Se deve enviar lembrete (2h antes)
- `confirm(tableId)` - Confirma reserva
- `cancel(reason)` - Cancela reserva
- `markArrived()` - Marca chegada
- `markNoShow()` - Marca como nao compareceu
- `complete()` - Completa reserva

#### Metodos Estaticos

- `getByConfirmationCode(code)` - Busca por codigo
- `getUpcomingReservations(days)` - Reservas futuras
- `getAvailableSlots(date)` - Horarios disponiveis
- `getReservationsNeedingReminder()` - Que precisam lembrete
- `getNoShowReservations()` - Nao compareceram

#### Relacionamentos

- **N:1** → User
- **N:1** → Table

#### Indices

```javascript
indexes: [
  { fields: ['reservationDate'] },
  { fields: ['status'] },
  { fields: ['guestEmail'] },
  { fields: ['confirmationCode'], unique: true },
  { fields: ['userId', 'reservationDate'] }
]
```

---

### 7. HookahSession (hookah_sessions)

Sessoes de narguilé nas mesas.

#### Schema

```javascript
{
  id: UUID (PK),
  mesaId: UUID FK NOT NULL → tables.id,
  flavorId: UUID FK NOT NULL → hookah_flavors.id,
  quantity: INTEGER DEFAULT 1,
  startedAt: DATE DEFAULT NOW,
  endedAt: DATE,
  pausedAt: DATE,
  status: ENUM('active', 'paused', 'preparing', 'ready', 'ended') DEFAULT 'active',
  duration: INTEGER DEFAULT 30,
  scheduledEndTime: DATE,
  coalChanges: JSON ARRAY,
  totalPausedTime: INTEGER DEFAULT 0,
  price: DECIMAL(10,2),
  notes: TEXT,
  createdAt: DATE,
  updatedAt: DATE
}
```

#### Metodos de Instancia

- `getElapsedTime()` - Tempo decorrido (minutos)
- `getRemainingTime()` - Tempo restante (minutos)
- `isOvertime()` - Verifica se passou do tempo
- `registerCoalChange()` - Registra troca de carvao
- `getCoalChangeCount()` - Total de trocas de carvao
- `pause()` - Pausa sessao
- `resume()` - Resume sessao
- `end()` - Finaliza sessao
- `getTotalDuration()` - Duracao total
- `calculatePrice(basePrice)` - Calcula preco (com overtime)

#### Metodos Estaticos

- `getActiveSessions()` - Sessoes ativas
- `getSessionsByMesa(mesaId)` - Sessoes por mesa
- `getSessionsByDate(date)` - Sessoes por data
- `getRevenueReport(days)` - Relatorio de receita

#### Relacionamentos

- **N:1** → Table
- **N:1** → HookahFlavor

#### Indices

```javascript
indexes: [
  { fields: ['mesaId'] },
  { fields: ['flavorId'] },
  { fields: ['status'] },
  { fields: ['startedAt'] },
  { fields: ['endedAt'] },
  { fields: ['mesaId', 'status'] }
]
```

---

### 8. HookahFlavor (hookah_flavors)

Sabores de narguilé disponiveis.

#### Schema

```javascript
{
  id: UUID (PK),
  name: STRING(100) NOT NULL UNIQUE,
  description: TEXT,
  category: ENUM('frutas', 'mentol', 'especial', 'classico', 'premium') DEFAULT 'classico',
  image: STRING,
  price: DECIMAL(10,2) DEFAULT 25.00,
  inStock: BOOLEAN DEFAULT true,
  popularity: INTEGER DEFAULT 0,
  rating: DECIMAL(3,2) DEFAULT 0,
  createdAt: DATE,
  updatedAt: DATE
}
```

#### Metodos de Instancia

- `isAvailable()` - Verifica se esta disponivel
- `getPriceForDuration(minutes)` - Calcula preco por duracao
- `incrementPopularity()` - Incrementa popularidade

#### Metodos Estaticos

- `getPopularFlavors(limit)` - Sabores mais populares
- `getByCategory(category)` - Sabores por categoria

#### Relacionamentos

- **1:N** → HookahSessions

#### Indices

```javascript
indexes: [
  { fields: ['category'] },
  { fields: ['inStock'] },
  { fields: ['popularity'] }
]
```

---

### 9. Cashier (cashiers)

Controle de caixas (abertura/fechamento).

#### Schema

```javascript
{
  id: UUID (PK),
  operatorId: UUID FK NOT NULL → users.id,
  operatorName: STRING(100) NOT NULL,
  openedAt: DATE NOT NULL DEFAULT NOW,
  closedAt: DATE,
  status: ENUM('open', 'closed') DEFAULT 'open',
  openingAmount: DECIMAL(10,2) NOT NULL DEFAULT 0,
  closingAmount: DECIMAL(10,2),
  totalSales: DECIMAL(10,2) NOT NULL DEFAULT 0,
  totalDeposits: DECIMAL(10,2) NOT NULL DEFAULT 0,
  totalWithdrawals: DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes: TEXT,
  closedBy: UUID FK → users.id,
  closedByName: STRING(100),
  createdAt: DATE,
  updatedAt: DATE
}
```

#### Metodos de Instancia

- `calculateExpectedTotal()` - Calcula total esperado
- `calculateDifference()` - Calcula diferenca (sobra/falta)
- `getStatus()` - Status formatado
- `getSummary()` - Resumo do caixa

#### Relacionamentos

- **N:1** → User (operator)
- **N:1** → User (closer)
- **1:N** → CashierMovements

#### Indices

```javascript
indexes: [
  { fields: ['operatorId'] },
  { fields: ['status'] },
  { fields: ['openedAt'] },
  { fields: ['closedAt'] },
  { fields: ['status', 'openedAt'] }
]
```

---

### 10. CashierMovement (cashier_movements)

Movimentacoes financeiras do caixa.

#### Schema

```javascript
{
  id: UUID (PK),
  cashierId: UUID FK NOT NULL → cashiers.id,
  type: ENUM('sale', 'deposit', 'withdrawal', 'opening', 'closing') NOT NULL,
  amount: DECIMAL(10,2) NOT NULL,
  description: TEXT,
  orderId: UUID FK → orders.id,
  orderNumber: STRING(20),
  createdBy: UUID FK NOT NULL → users.id,
  createdByName: STRING(100) NOT NULL,
  metadata: JSON,
  createdAt: DATE
}
```

#### Metodos de Instancia

- `getDescription()` - Descricao formatada
- `getTypeLabel()` - Tipo formatado
- `isIncome()` - Verifica se e entrada
- `toSummary()` - Formata para exibicao

#### Relacionamentos

- **N:1** → Cashier
- **N:1** → User (creator)
- **N:1** → Order

#### Indices

```javascript
indexes: [
  { fields: ['cashierId'] },
  { fields: ['type'] },
  { fields: ['orderId'] },
  { fields: ['createdBy'] },
  { fields: ['createdAt'] },
  { fields: ['cashierId', 'type'] },
  { fields: ['cashierId', 'createdAt'] }
]
```

---

### 11. CashbackHistory (cashback_history)

Historico de transacoes de cashback.

#### Schema

```javascript
{
  id: UUID (PK),
  userId: UUID FK NOT NULL → users.id,
  orderId: UUID FK → orders.id,
  amount: DECIMAL(10,2) NOT NULL,
  type: ENUM('earned', 'redeemed', 'expired', 'bonus', 'adjustment') NOT NULL,
  description: TEXT,
  balanceBefore: DECIMAL(10,2) NOT NULL,
  balanceAfter: DECIMAL(10,2) NOT NULL,
  expiresAt: DATE,
  metadata: JSON,
  createdAt: DATE,
  updatedAt: DATE
}
```

#### Metodos de Instancia

- `getDescription()` - Descricao formatada da transacao

#### Relacionamentos

- **N:1** → User
- **N:1** → Order

#### Indices

```javascript
indexes: [
  { fields: ['userId'] },
  { fields: ['orderId'] },
  { fields: ['type'] },
  { fields: ['createdAt'] },
  { fields: ['expiresAt'] }
]
```

---

### 12. Campaign (campaigns)

Campanhas de marketing e CRM.

#### Schema

```javascript
{
  id: UUID (PK),
  name: STRING NOT NULL,
  description: TEXT,
  type: ENUM('reactivation', 'promotion', 'loyalty', 'announcement') DEFAULT 'promotion',
  status: ENUM('draft', 'active', 'paused', 'completed') DEFAULT 'draft',
  targetType: ENUM('all', 'inactive', 'tier', 'custom') DEFAULT 'all',
  targetFilters: JSON DEFAULT {},
  content: JSON DEFAULT { subject: '', body: '', sms: '' },
  incentive: JSON,
  channels: JSON DEFAULT ['email'],
  scheduledAt: DATE,
  sentAt: DATE,
  stats: JSON DEFAULT { totalTargets: 0, sent: 0, opened: 0, clicked: 0, converted: 0 },
  createdBy: UUID FK NOT NULL → users.id,
  createdAt: DATE,
  updatedAt: DATE
}
```

#### Relacionamentos

- **N:1** → User (creator)

---

### 13. Ingredient (ingredients)

Insumos utilizados nas receitas.

#### Schema

```javascript
{
  id: UUID (PK),
  name: STRING(100) NOT NULL,
  description: TEXT,
  category: STRING(50) DEFAULT 'geral',
  unit: STRING(20) DEFAULT 'un',
  currentStock: DECIMAL(10,3) DEFAULT 0,
  minStock: DECIMAL(10,3) DEFAULT 0,
  maxStock: DECIMAL(10,3),
  costPerUnit: DECIMAL(10,4) DEFAULT 0,
  supplier: STRING(100),
  supplierCode: STRING(50),
  lastPurchaseDate: DATE,
  lastPurchasePrice: DECIMAL(10,4),
  expirationDays: INTEGER,
  storageLocation: STRING(50),
  isActive: BOOLEAN DEFAULT true,
  notes: TEXT,
  createdAt: DATE,
  updatedAt: DATE
}
```

#### Metodos de Instancia

- `isLowStock()` - Verifica se estoque esta baixo
- `isOutOfStock()` - Verifica se esta sem estoque
- `getAvailablePortions(portionSize)` - Porcoes disponiveis

#### Relacionamentos

- **1:N** → RecipeItems
- **1:N** → IngredientMovements

#### Indices

```javascript
indexes: [
  { fields: ['name'] },
  { fields: ['category'] },
  { fields: ['isActive'] },
  { fields: ['currentStock'] }
]
```

---

### 14. RecipeItem (recipe_items)

Ficha tecnica - ingredientes por produto.

#### Schema

```javascript
{
  id: UUID (PK),
  productId: UUID FK NOT NULL → products.id,
  ingredientId: UUID FK NOT NULL → ingredients.id,
  quantity: DECIMAL(10,4) NOT NULL,
  unit: STRING(20) NOT NULL,
  isOptional: BOOLEAN DEFAULT false,
  notes: TEXT,
  preparationNotes: TEXT,
  createdAt: DATE,
  updatedAt: DATE
}
```

#### Metodos de Instancia

- `calculateCost()` - Calcula custo do item
- `hasEnoughStock(portions)` - Verifica se ha estoque suficiente

#### Relacionamentos

- **N:1** → Product
- **N:1** → Ingredient

#### Indices

```javascript
indexes: [
  { fields: ['productId'] },
  { fields: ['ingredientId'] },
  { fields: ['productId', 'ingredientId'], unique: true }
]
```

---

### 15. IngredientMovement (ingredient_movements)

Movimentacoes de estoque de ingredientes.

#### Schema

```javascript
{
  id: UUID (PK),
  ingredientId: UUID FK NOT NULL → ingredients.id,
  type: ENUM('entrada', 'saida', 'ajuste', 'perda', 'transferencia') NOT NULL,
  quantity: DECIMAL(10,4) NOT NULL,
  previousStock: DECIMAL(10,3) NOT NULL,
  newStock: DECIMAL(10,3) NOT NULL,
  reason: ENUM('compra', 'producao', 'vencimento', 'quebra', 'inventario', 'devolucao', 'outro'),
  description: TEXT,
  orderId: UUID FK → orders.id,
  userId: UUID FK → users.id,
  unitCost: DECIMAL(10,4),
  totalCost: DECIMAL(10,2),
  supplierInvoice: STRING(50),
  expirationDate: DATEONLY,
  batchNumber: STRING(50),
  createdAt: DATE,
  updatedAt: DATE
}
```

#### Relacionamentos

- **N:1** → Ingredient
- **N:1** → Order
- **N:1** → User

#### Indices

```javascript
indexes: [
  { fields: ['ingredientId'] },
  { fields: ['type'] },
  { fields: ['orderId'] },
  { fields: ['userId'] },
  { fields: ['createdAt'] }
]
```

---

### 16. InventoryMovement (inventory_movements)

Movimentacoes de estoque de produtos.

#### Schema

```javascript
{
  id: UUID (PK),
  productId: UUID FK NOT NULL → products.id,
  orderId: UUID FK → orders.id,
  type: ENUM('entrada', 'saida', 'ajuste', 'devolucao') NOT NULL,
  quantity: INTEGER NOT NULL,
  reason: ENUM('entrada_fornecedor', 'venda', 'ajuste_inventario', 'devolucao', 'perda', 'cortesia', 'reposicao') NOT NULL,
  previousStock: INTEGER NOT NULL,
  newStock: INTEGER NOT NULL,
  notes: TEXT,
  userId: UUID FK → users.id,
  createdAt: DATE
}
```

#### Metodos de Instancia

- `getTypeLabel()` - Tipo formatado
- `getReasonLabel()` - Razao formatada
- `getStockDifference()` - Calcula diferenca de estoque
- `isSaleMovement()` - Verifica se foi venda

#### Relacionamentos

- **N:1** → Product
- **N:1** → Order
- **N:1** → User

#### Indices

```javascript
indexes: [
  { fields: ['productId'] },
  { fields: ['orderId'] },
  { fields: ['createdAt'] },
  { fields: ['type'] },
  { fields: ['reason'] },
  { fields: ['productId', 'createdAt'] }
]
```

---

### 17. Message (messages)

Chat entre staff e cliente vinculado a pedidos.

#### Schema

```javascript
{
  id: UUID (PK),
  orderId: UUID FK NOT NULL → orders.id,
  senderId: UUID FK NOT NULL → users.id,
  senderType: ENUM('cliente', 'staff', 'sistema') DEFAULT 'cliente',
  content: TEXT NOT NULL,
  messageType: ENUM('text', 'status_update', 'system', 'image') DEFAULT 'text',
  isRead: BOOLEAN DEFAULT false,
  readAt: DATE,
  metadata: JSON,
  createdAt: DATE,
  updatedAt: DATE
}
```

#### Relacionamentos

- **N:1** → Order
- **N:1** → User (sender)

#### Indices

```javascript
indexes: [
  { fields: ['orderId'] },
  { fields: ['senderId'] },
  { fields: ['createdAt'] }
]
```

---

### 18. SplitPayment (split_payments)

Divisao de conta entre multiplos usuarios.

#### Schema

```javascript
{
  id: UUID (PK),
  orderId: UUID FK NOT NULL → orders.id,
  userId: UUID FK NOT NULL → users.id,
  amount: DECIMAL(10,2) NOT NULL,
  percentage: DECIMAL(5,2),
  status: ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
  paymentMethod: TEXT,
  paymentIntentId: TEXT,
  paidAt: DATE,
  notes: TEXT,
  createdAt: DATE,
  updatedAt: DATE
}
```

#### Metodos de Instancia

- `isPaid()` - Verifica se foi pago
- `canBeCancelled()` - Verifica se pode ser cancelado

#### Relacionamentos

- **N:1** → Order
- **N:1** → User

---

### 19. PushSubscription (push_subscriptions)

Subscricoes para notificacoes push.

#### Schema

```javascript
{
  id: UUID (PK),
  userId: UUID FK NOT NULL → users.id,
  endpoint: TEXT NOT NULL UNIQUE,
  p256dh: TEXT NOT NULL,
  auth: TEXT NOT NULL,
  deviceType: ENUM('web', 'android', 'ios', 'desktop') DEFAULT 'web',
  userAgent: TEXT,
  active: BOOLEAN DEFAULT true,
  failedAttempts: INTEGER DEFAULT 0,
  lastError: DATE,
  lastUsed: DATE,
  preferences: JSON DEFAULT { orderUpdates: true, promotions: true, reservations: true, marketing: false },
  createdAt: DATE,
  updatedAt: DATE
}
```

#### Metodos de Instancia

- `isActive()` - Verifica se esta ativa
- `markFailed()` - Marca como falha
- `markSuccess()` - Reseta contagem de falhas

#### Relacionamentos

- **N:1** → User

#### Indices

```javascript
indexes: [
  { fields: ['userId'] },
  { fields: ['endpoint'], unique: true },
  { fields: ['active'] }
]
```

---

### 20. InstagramCashback (instagram_cashbacks)

Cashback por posts no Instagram.

#### Schema

```javascript
{
  id: UUID (PK),
  userId: UUID FK NOT NULL → users.id,
  orderId: UUID FK NOT NULL UNIQUE → orders.id,
  instagramPostUrl: STRING(500) NOT NULL,
  cashbackAmount: DECIMAL(10,2) NOT NULL,
  status: ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  expiresAt: DATE NOT NULL,
  approvedBy: UUID FK → users.id,
  approvedAt: DATE,
  rejectedBy: UUID FK → users.id,
  rejectedAt: DATE,
  rejectionReason: STRING(500),
  createdAt: DATE,
  updatedAt: DATE
}
```

#### Relacionamentos

- **N:1** → User
- **N:1** → Order
- **N:1** → User (approver)
- **N:1** → User (rejecter)

#### Indices

```javascript
indexes: [
  { fields: ['userId'] },
  { fields: ['orderId'], unique: true },
  { fields: ['status'] }
]
```

---

## Relacionamentos Principais

### Um para Muitos (1:N)

```
User → Orders (como customer, attendant, kitchenUser)
User → Reservations
User → CashbackHistory
User → Cashiers
User → PushSubscriptions
User → Messages (como sender)
User → SplitPayments

Table → Orders
Table → HookahSessions
Table → Reservations

Order → OrderItems
Order → CashbackHistory
Order → Messages
Order → SplitPayments
Order → CashierMovements
Order → InventoryMovements
Order → IngredientMovements

Product → OrderItems
Product → RecipeItems
Product → InventoryMovements

Ingredient → RecipeItems
Ingredient → IngredientMovements

Cashier → CashierMovements

HookahFlavor → HookahSessions
```

### Muitos para Muitos (N:M) via Tabela de Juncao

```
Product N:M Ingredient
  via RecipeItem (ficha tecnica)
  - Define quantidade de cada ingrediente por produto
```

### Auto-Relacionamentos

```
User.referredBy → User.id (sistema de indicacao)
```

---

## Indices e Performance

### Indices Compostos Criticos

```javascript
// Orders - busca rapida por usuario e status
{ fields: ['userId', 'status'] }

// HookahSessions - sessoes ativas por mesa
{ fields: ['mesaId', 'status'] }

// Reservations - reservas por usuario e data
{ fields: ['userId', 'reservationDate'] }

// CashierMovements - movimentacoes por caixa e tipo
{ fields: ['cashierId', 'type'] }
{ fields: ['cashierId', 'createdAt'] }

// InventoryMovements - movimentacoes por produto e data
{ fields: ['productId', 'createdAt'] }
```

### Full-Text Search

```javascript
// Products - busca textual no catalogo
{ fields: ['name'], type: 'fulltext' }
```

### Indices de Unicidade

```javascript
// Business Rules
users.email (UNIQUE)
users.celular (UNIQUE)
users.cpf (UNIQUE)
users.googleId (UNIQUE)
users.referralCode (UNIQUE)

tables.number (UNIQUE)
orders.orderNumber (UNIQUE)
reservations.confirmationCode (UNIQUE)
push_subscriptions.endpoint (UNIQUE)
instagram_cashbacks.orderId (UNIQUE)

// Composite Unique
recipe_items(productId, ingredientId) (UNIQUE)
```

### Estrategias de Performance

1. **Paginacao**: Todas as listagens usam LIMIT/OFFSET
2. **Eager Loading**: Include com Sequelize para evitar N+1
3. **Indices Seletivos**: Campos frequentemente usados em WHERE
4. **Desnormalizacao Estrategica**:
   - `Order.orderNumber` (auto-increment separado)
   - `OrderItem` copia dados do produto (snapshot)
   - `Cashier.operatorName`, `CashierMovement.createdByName`

---

## Migrations

### Sistema de Migracoes

O sistema utiliza migrations versionadas para controle de schema. Cada migration tem timestamp no nome:

```
YYYYMMDD_descricao.js
```

### Migrations Principais

1. **20251205-make-cpf-optional.js**
   - Torna CPF opcional no cadastro

2. **20251206_allow_null_tableId.js**
   - Permite pedidos sem mesa (balcao/pickup)

3. **20251207_add_order_timeline_fields.js**
   - Adiciona campos de timeline aos pedidos

4. **20251207_add_cashback_to_orders.js**
   - Sistema de cashback nos pedidos

5. **20251207_add_birthday_fields.js**
   - Campos de aniversario para bonus

6. **20251207_create_ingredients_tables.js**
   - Cria tabelas de ingredientes e fichas tecnicas

7. **20251207_add_google_oauth_fields.js**
   - Adiciona campos para Google OAuth

8. **20251207_add_referral_fields.js**
   - Sistema de indicacao (referral)

9. **20251207_add_user_identity_fields.js**
   - Campos para cadastro internacional

10. **20251208_add_product_images.js**
    - Sistema de imagens dos produtos

11. **20251208_add_tip_to_orders.js**
    - Gorjeta opcional nos pedidos

12. **20251209_create_messages_table.js**
    - Chat staff-cliente

13. **20251209_create_split_payments.js**
    - Divisao de conta

14. **20251210_add_instagram_cashback_fields.js**
    - Cashback por post Instagram

15. **20251210_add_instagram_cashback_user_fields.js**
    - Campos de controle Instagram no User

### Executando Migrations

```bash
# Aplicar todas as migrations pendentes
npm run migrate

# Reverter ultima migration
npm run migrate:undo

# Reverter todas
npm run migrate:undo:all

# Status das migrations
npm run migrate:status
```

### Criando Nova Migration

```bash
npx sequelize-cli migration:generate --name nome_descritivo
```

**Estrutura basica:**

```javascript
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Alteracoes para frente
    await queryInterface.addColumn('table_name', 'column_name', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Reverter alteracoes
    await queryInterface.removeColumn('table_name', 'column_name');
  }
};
```

---

## Queries Comuns

### 1. Buscar pedidos ativos com itens

```javascript
// Sequelize
const activeOrders = await Order.findAll({
  where: {
    status: {
      [Op.in]: ['confirmed', 'preparing', 'ready', 'on_way']
    }
  },
  include: [
    {
      model: OrderItem,
      as: 'items',
      include: [{ model: Product, as: 'product' }]
    },
    { model: User, as: 'customer', attributes: ['id', 'nome', 'celular'] },
    { model: Table, as: 'table', attributes: ['id', 'number'] }
  ],
  order: [['createdAt', 'ASC']]
});
```

```sql
-- SQL Raw
SELECT o.*,
       json_agg(oi.*) as items,
       u.nome as customer_name,
       t.number as table_number
FROM orders o
LEFT JOIN order_items oi ON o.id = oi."orderId"
LEFT JOIN users u ON o."userId" = u.id
LEFT JOIN tables t ON o."tableId" = t.id
WHERE o.status IN ('confirmed', 'preparing', 'ready', 'on_way')
GROUP BY o.id, u.nome, t.number
ORDER BY o."createdAt" ASC;
```

### 2. Calcular vendas do dia por categoria

```javascript
// Sequelize
const today = new Date();
today.setHours(0, 0, 0, 0);

const salesByCategory = await OrderItem.findAll({
  attributes: [
    'productCategory',
    [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity'],
    [sequelize.fn('SUM', sequelize.col('subtotal')), 'totalRevenue']
  ],
  include: [{
    model: Order,
    as: 'order',
    attributes: [],
    where: {
      createdAt: { [Op.gte]: today },
      status: 'delivered'
    }
  }],
  group: ['productCategory'],
  raw: true
});
```

```sql
-- SQL Raw
SELECT
  oi."productCategory",
  SUM(oi.quantity) as "totalQuantity",
  SUM(oi.subtotal) as "totalRevenue"
FROM order_items oi
INNER JOIN orders o ON oi."orderId" = o.id
WHERE o."createdAt" >= CURRENT_DATE
  AND o.status = 'delivered'
GROUP BY oi."productCategory";
```

### 3. Usuarios com baixo engajamento (inatividade)

```javascript
// Sequelize
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const inactiveUsers = await User.findAll({
  where: {
    role: 'cliente',
    totalOrders: { [Op.gt]: 0 },
    lastOrderDate: { [Op.lt]: thirtyDaysAgo }
  },
  attributes: ['id', 'nome', 'email', 'celular', 'totalOrders', 'totalSpent', 'lastOrderDate'],
  order: [['lastOrderDate', 'DESC']]
});
```

```sql
-- SQL Raw
SELECT id, nome, email, celular, "totalOrders", "totalSpent", "lastOrderDate"
FROM users
WHERE role = 'cliente'
  AND "totalOrders" > 0
  AND "lastOrderDate" < NOW() - INTERVAL '30 days'
ORDER BY "lastOrderDate" DESC;
```

### 4. Ficha tecnica completa de um produto

```javascript
// Sequelize
const productRecipe = await Product.findByPk(productId, {
  include: [{
    model: RecipeItem,
    as: 'recipe',
    include: [{
      model: Ingredient,
      as: 'ingredient',
      attributes: ['id', 'name', 'unit', 'currentStock', 'costPerUnit']
    }]
  }]
});

// Calcular custo total
const recipeCost = await Promise.all(
  productRecipe.recipe.map(item => item.calculateCost())
);
const totalCost = recipeCost.reduce((sum, cost) => sum + cost, 0);
```

```sql
-- SQL Raw
SELECT
  p.name as product_name,
  i.name as ingredient_name,
  ri.quantity,
  ri.unit,
  i."currentStock",
  i."costPerUnit",
  (ri.quantity * i."costPerUnit") as item_cost
FROM products p
INNER JOIN recipe_items ri ON p.id = ri."productId"
INNER JOIN ingredients i ON ri."ingredientId" = i.id
WHERE p.id = 'product-uuid-here'
ORDER BY i.name;
```

### 5. Sessoes de narguilé em overtime

```javascript
// Sequelize
const overtimeSessions = await HookahSession.findAll({
  where: {
    status: 'active',
    scheduledEndTime: { [Op.lt]: new Date() }
  },
  include: [
    { model: Table, as: 'Table', attributes: ['number'] },
    { model: HookahFlavor, as: 'HookahFlavor', attributes: ['name', 'price'] }
  ]
});
```

```sql
-- SQL Raw
SELECT
  hs.*,
  t.number as table_number,
  hf.name as flavor_name,
  hf.price as base_price,
  EXTRACT(EPOCH FROM (NOW() - hs."startedAt"))/60 as elapsed_minutes
FROM hookah_sessions hs
INNER JOIN tables t ON hs."mesaId" = t.id
INNER JOIN hookah_flavors hf ON hs."flavorId" = hf.id
WHERE hs.status = 'active'
  AND hs."scheduledEndTime" < NOW();
```

### 6. Relatorio de caixa do dia

```javascript
// Sequelize
const cashierReport = await Cashier.findOne({
  where: {
    status: 'open',
    openedAt: {
      [Op.gte]: sequelize.fn('DATE_TRUNC', 'day', sequelize.fn('NOW'))
    }
  },
  include: [{
    model: CashierMovement,
    as: 'movements',
    order: [['createdAt', 'ASC']]
  }]
});

const summary = cashierReport.getSummary();
```

```sql
-- SQL Raw
SELECT
  c.*,
  COUNT(cm.id) as total_movements,
  SUM(CASE WHEN cm.type = 'sale' THEN cm.amount ELSE 0 END) as sales,
  SUM(CASE WHEN cm.type = 'deposit' THEN cm.amount ELSE 0 END) as deposits,
  SUM(CASE WHEN cm.type = 'withdrawal' THEN ABS(cm.amount) ELSE 0 END) as withdrawals
FROM cashiers c
LEFT JOIN cashier_movements cm ON c.id = cm."cashierId"
WHERE c.status = 'open'
  AND c."openedAt" >= DATE_TRUNC('day', NOW())
GROUP BY c.id;
```

### 7. Top 10 produtos mais vendidos

```javascript
// Sequelize
const topProducts = await Product.findAll({
  attributes: [
    'id',
    'name',
    'category',
    'price',
    [sequelize.fn('COUNT', sequelize.col('orderItems.id')), 'totalOrders'],
    [sequelize.fn('SUM', sequelize.col('orderItems.quantity')), 'totalQuantity'],
    [sequelize.fn('SUM', sequelize.col('orderItems.subtotal')), 'totalRevenue']
  ],
  include: [{
    model: OrderItem,
    as: 'orderItems',
    attributes: [],
    include: [{
      model: Order,
      as: 'order',
      attributes: [],
      where: { status: 'delivered' }
    }]
  }],
  group: ['Product.id'],
  order: [[sequelize.literal('"totalRevenue"'), 'DESC']],
  limit: 10,
  subQuery: false
});
```

```sql
-- SQL Raw
SELECT
  p.id,
  p.name,
  p.category,
  p.price,
  COUNT(DISTINCT oi."orderId") as total_orders,
  SUM(oi.quantity) as total_quantity,
  SUM(oi.subtotal) as total_revenue
FROM products p
INNER JOIN order_items oi ON p.id = oi."productId"
INNER JOIN orders o ON oi."orderId" = o.id
WHERE o.status = 'delivered'
GROUP BY p.id
ORDER BY total_revenue DESC
LIMIT 10;
```

### 8. Historico de cashback de um usuario

```javascript
// Sequelize
const cashbackHistory = await CashbackHistory.findAll({
  where: { userId: userId },
  include: [{
    model: Order,
    as: 'order',
    attributes: ['orderNumber', 'total']
  }],
  order: [['createdAt', 'DESC']],
  limit: 50
});

// Saldo atual
const user = await User.findByPk(userId, {
  attributes: ['cashbackBalance', 'loyaltyTier', 'totalSpent']
});
const tierInfo = user.getTierBenefits();
```

```sql
-- SQL Raw
SELECT
  ch.*,
  o."orderNumber",
  o.total as order_total
FROM cashback_history ch
LEFT JOIN orders o ON ch."orderId" = o.id
WHERE ch."userId" = 'user-uuid-here'
ORDER BY ch."createdAt" DESC
LIMIT 50;
```

### 9. Reservas do dia com detalhes

```javascript
// Sequelize
const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);
const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999);

const todayReservations = await Reservation.findAll({
  where: {
    reservationDate: {
      [Op.between]: [startOfDay, endOfDay]
    }
  },
  include: [
    { model: User, as: 'user', attributes: ['nome', 'celular'] },
    { model: Table, as: 'table', attributes: ['number', 'location'] }
  ],
  order: [['reservationDate', 'ASC']]
});
```

```sql
-- SQL Raw
SELECT
  r.*,
  u.nome as customer_name,
  u.celular as customer_phone,
  t.number as table_number,
  t.location as table_location
FROM reservations r
LEFT JOIN users u ON r."userId" = u.id
LEFT JOIN tables t ON r."tableId" = t.id
WHERE r."reservationDate" BETWEEN
  DATE_TRUNC('day', NOW()) AND
  DATE_TRUNC('day', NOW()) + INTERVAL '1 day' - INTERVAL '1 second'
ORDER BY r."reservationDate" ASC;
```

### 10. Movimentacoes de estoque por periodo

```javascript
// Sequelize
const startDate = new Date('2024-01-01');
const endDate = new Date('2024-12-31');

const inventoryReport = await InventoryMovement.findAll({
  where: {
    createdAt: { [Op.between]: [startDate, endDate] }
  },
  include: [{
    model: Product,
    as: 'product',
    attributes: ['name', 'category']
  }],
  attributes: [
    'type',
    'reason',
    [sequelize.fn('COUNT', sequelize.col('InventoryMovement.id')), 'totalMovements'],
    [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity']
  ],
  group: ['type', 'reason', 'product.id', 'product.name', 'product.category'],
  order: [[sequelize.literal('"totalMovements"'), 'DESC']]
});
```

```sql
-- SQL Raw
SELECT
  im.type,
  im.reason,
  p.name as product_name,
  p.category,
  COUNT(im.id) as total_movements,
  SUM(im.quantity) as total_quantity
FROM inventory_movements im
INNER JOIN products p ON im."productId" = p.id
WHERE im."createdAt" BETWEEN '2024-01-01' AND '2024-12-31'
GROUP BY im.type, im.reason, p.id
ORDER BY total_movements DESC;
```

---

## Triggers e Procedures (PostgreSQL)

### Auto-atualizar estoque apos venda

```sql
CREATE OR REPLACE FUNCTION update_product_stock_after_order()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
    -- Atualizar estoque dos produtos
    UPDATE products p
    SET stock = stock - oi.quantity
    FROM order_items oi
    WHERE oi."orderId" = NEW.id
      AND p.id = oi."productId"
      AND p."hasStock" = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_stock
AFTER UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_product_stock_after_order();
```

### Calcular tier automaticamente

```sql
CREATE OR REPLACE FUNCTION update_user_tier()
RETURNS TRIGGER AS $$
DECLARE
  new_tier TEXT;
BEGIN
  IF NEW."totalSpent" >= 10000 THEN
    new_tier := 'platinum';
  ELSIF NEW."totalSpent" >= 5000 THEN
    new_tier := 'gold';
  ELSIF NEW."totalSpent" >= 1000 THEN
    new_tier := 'silver';
  ELSE
    new_tier := 'bronze';
  END IF;

  IF NEW."loyaltyTier" != new_tier THEN
    NEW."loyaltyTier" := new_tier;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_tier
BEFORE UPDATE ON users
FOR EACH ROW
WHEN (OLD."totalSpent" IS DISTINCT FROM NEW."totalSpent")
EXECUTE FUNCTION update_user_tier();
```

---

## Backup e Manutencao

### Backup Diario Automatizado

```bash
#!/bin/bash
# backup-db.sh

BACKUP_DIR="/var/backups/flamelounge"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="flamelounge_production"

pg_dump -U postgres -h localhost $DB_NAME | gzip > "$BACKUP_DIR/backup_$TIMESTAMP.sql.gz"

# Manter apenas ultimos 7 dias
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
```

### Otimizacao de Indices

```sql
-- Reindexar tabelas criticas semanalmente
REINDEX TABLE orders;
REINDEX TABLE order_items;
REINDEX TABLE users;
REINDEX TABLE products;

-- Atualizar estatisticas do query planner
ANALYZE orders;
ANALYZE order_items;
ANALYZE users;
ANALYZE products;

-- Vacuum para recuperar espaco
VACUUM ANALYZE;
```

### Monitoramento de Performance

```sql
-- Consultas lentas (>500ms)
SELECT
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
WHERE mean_time > 500
ORDER BY mean_time DESC
LIMIT 20;

-- Tamanho das tabelas
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Indices nao utilizados
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND indexrelname NOT LIKE 'pg_%'
ORDER BY pg_relation_size(indexrelid) DESC;
```

---

## Consideracoes Finais

### Boas Praticas Implementadas

1. **UUIDs como Primary Keys**: Escalabilidade e seguranca
2. **Soft Deletes**: Usar `isActive` em vez de DELETE fisico
3. **Timestamps**: Todas as tabelas tem `createdAt` e `updatedAt`
4. **Desnormalizacao Estrategica**: Para performance e auditoria
5. **Validacoes no Model**: Sequelize valida antes de salvar
6. **Hooks**: Logica de negocio automatizada
7. **Indices Compostos**: Para queries frequentes
8. **Foreign Keys com Cascade**: Integridade referencial

### Seguranca

- Senhas com bcrypt (salt rounds: 12)
- Tokens JWT para autenticacao
- Validacao de entrada em todos os campos
- Sanitizacao de queries (ORM previne SQL injection)
- Rate limiting nas APIs
- Logs de auditoria em operacoes criticas

### Escalabilidade

- Connection pooling configurado
- Indices otimizados para queries comuns
- Paginacao em todas as listagens
- Cache em Redis para sessoes
- Read replicas para relatorios (futuro)

### Manutencao

- Migrations versionadas
- Seeds para dados iniciais
- Scripts de backup automatizados
- Monitoramento de slow queries
- Documentacao atualizada

---

**Documentacao gerada em**: 2026-01-16
**Versao do Schema**: 2.1.0
**Ultima Migration**: 20251210_add_instagram_cashback_user_fields
**Total de Tabelas**: 20
**Total de Relacionamentos**: 45+
