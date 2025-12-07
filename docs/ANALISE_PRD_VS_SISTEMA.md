# FLAME - ANÁLISE COMPARATIVA PRD vs SISTEMA REAL

**Data da Análise**: 07/12/2024
**Versão**: 2.0 (Atualizada após Sprints 23-30)
**Objetivo**: Mapear divergências entre documentação (PRD/User Flows) e implementação real

> **NOTA**: Este documento foi atualizado após conclusão das Sprints 23-30.
> Muitas divergências críticas foram resolvidas. Veja seção 6 para status atualizado.

---

## SUMÁRIO EXECUTIVO

### Visão Geral do Sistema Implementado

| Categoria | Quantidade |
|-----------|------------|
| **Models (Backend)** | 15 |
| **Controllers** | 15 |
| **Routes** | 15 arquivos (~100+ endpoints) |
| **Services** | 14 |
| **Pages (Frontend)** | 48 |
| **Components** | 45 |
| **Stores (Zustand)** | 16 |
| **Hooks Customizados** | 20+ |

---

## 1. MÓDULO CLIENTE - ANÁLISE COMPLETA

### 1.1 Autenticação e Cadastro

| Feature (PRD) | Status | Componentes Implementados |
|---------------|--------|---------------------------|
| Cadastro Tradicional (Email+Celular+Senha) | ✅ Implementado | `authController.register()`, `authStore.register()`, `/register` |
| Cadastro Rápido (Phone-Only) | ✅ Implementado | `authController.registerPhone()`, `authStore.registerPhone()` |
| Google OAuth 2.0 | ⚠️ 90% | `google.service.js`, `GoogleLoginButton.js` - **Falta: credenciais Google Cloud** |
| Login SMS | ✅ Implementado | `authController.loginSMS()`, `authController.verifySMS()` |
| Login Email/Senha | ✅ Implementado | `authController.loginPassword()` |
| Verificação SMS | ✅ Implementado | `sms.service.js` (Twilio) |
| profileComplete | ✅ Implementado | Campo em User model, middleware de validação |
| Complete Profile | ✅ Implementado | `/complete-profile`, `authController.completeProfile()` |
| Recuperar Senha | ✅ Implementado | `authController.forgotPassword()`, `authController.resetPassword()` |

**Mapeamento de Arquivos - Autenticação:**
```
Backend:
├── controllers/authController.js (16 métodos)
├── services/sms.service.js (9 métodos)
├── services/google.service.js (1 método)
├── routes/auth.js (17 endpoints)
└── models/User.js (campos: googleId, authProvider, profileComplete, smsCode, etc)

Frontend:
├── pages/login.js
├── pages/register.js
├── pages/complete-profile.js
├── pages/recuperar-senha.js
├── stores/authStore.js (20+ actions)
├── components/GoogleLoginButton.js
└── components/PhoneInput.js
```

**Divergências Encontradas:**
1. ❌ **Google OAuth**: Código 100% pronto, mas faltam credenciais do Google Cloud Console
2. ⚠️ **Bônus de Cadastro**: PRD menciona R$10 de bônus, mas **não está automatizado** no código

---

### 1.2 Cardápio Digital

| Feature (PRD) | Status | Componentes Implementados |
|---------------|--------|---------------------------|
| Listagem de Produtos | ✅ Implementado | `productController.getAllProducts()`, `/cardapio` |
| Filtro por Categoria | ✅ Implementado | `productStore.filterByCategory()` |
| Busca de Produtos | ✅ Implementado | `productStore.searchProducts()` |
| Produtos em Destaque | ✅ Implementado | `productController.getFeaturedProducts()` |
| Detalhes do Produto | ✅ Implementado | `ProductCard.js`, modal de produto |
| Indicadores Dietéticos | ✅ Implementado | Campo `dietary` no Product model (vegetariano, vegano, etc) |
| Controle de Estoque | ✅ Implementado | Campo `stock`, `hasStock`, `minStock` |

**Mapeamento de Arquivos - Cardápio:**
```
Backend:
├── controllers/productController.js (10 métodos)
├── models/Product.js (30+ campos)
└── routes/products.js (10 endpoints)

Frontend:
├── pages/cardapio.js
├── components/ProductCard.js
└── stores/productStore.js (20+ actions)
```

**Divergências:** Nenhuma significativa

---

### 1.3 Carrinho e Checkout

| Feature (PRD) | Status | Componentes Implementados |
|---------------|--------|---------------------------|
| Adicionar/Remover Itens | ✅ Implementado | `cartStore.addItem()`, `cartStore.removeItem()` |
| Quantidade por Item | ✅ Implementado | `cartStore.updateItemQuantity()` |
| Observações por Item | ✅ Implementado | `cartStore.updateItemNotes()` |
| Subtotal/Total | ✅ Implementado | `cartStore.getSubtotal()`, `cartStore.getTotal()` |
| Taxa de Serviço (10%) | ✅ Implementado | Calculado no backend (`Order.beforeCreate`) |
| Seleção de Mesa | ✅ Implementado | `cartStore.setTable()` |
| Opção Balcão | ✅ Implementado | `tableId = null` no pedido |
| Persistência (localStorage) | ✅ Implementado | Zustand persist 'flame-cart' |

**Mapeamento de Arquivos - Carrinho:**
```
Frontend:
├── stores/cartStore.js (20+ actions, persist)
├── components/CartItem.js
└── pages/checkout.js
```

**Divergências:** Nenhuma significativa

---

### 1.4 Pedidos e Pagamentos

| Feature (PRD) | Status | Componentes Implementados |
|---------------|--------|---------------------------|
| Criar Pedido | ✅ Implementado | `orderController.createOrder()` |
| Status do Pedido | ✅ Implementado | 7 status: pending, confirmed, preparing, ready, on_way, delivered, cancelled |
| Tracking Real-time | ✅ Implementado | Socket.IO + `socket.service.js` |
| Pagamento Cartão (Stripe) | ✅ Configurado | `payment.service.js`, `payment.controller.js` |
| Pagamento PIX | ✅ Implementado | `payment.controller.createPixPayment()` |
| Pagamento Dinheiro | ✅ Implementado | `paymentMethod = 'cash'` |
| Timeline de Pedido | ✅ Implementado | Campos: confirmedAt, startedAt, finishedAt, pickedUpAt, deliveredAt |
| Avaliação de Pedido | ✅ Implementado | `orderController.rateOrder()` |
| Histórico de Pedidos | ✅ Implementado | `orderController.getUserOrders()` |
| Notificação Push | ⚠️ Parcial | `push.service.js` existe, mas **falta ativar envio em produção** |
| SMS Pedido Pronto | ✅ Implementado | `sms.service.js.sendOrderReady()` |

**Mapeamento de Arquivos - Pedidos:**
```
Backend:
├── controllers/orderController.js (9 métodos)
├── controllers/payment.controller.js (11 métodos)
├── services/payment.service.js (11 métodos)
├── services/socket.service.js
├── services/push.service.js (13 métodos)
├── models/Order.js (30+ campos, hooks para timeline)
├── models/OrderItem.js
├── routes/orders.js (10 endpoints)
└── routes/payment.routes.js (10 endpoints)

Frontend:
├── pages/pedidos.js
├── pages/pedido/[id].js
├── pages/checkout.js
├── stores/orderStore.js
├── components/OrderCard.js
└── services/socket.js (40+ métodos)
```

**Divergências Encontradas:**
1. ⚠️ **Fluxo de Status Incorreto**: PRD documenta fluxo correto, mas **na prática qualquer role pode mudar qualquer status**
2. ⚠️ **Push Notifications**: Service existe mas não está 100% ativo em produção
3. ❌ **Uso de Cashback no Checkout**: PRD menciona, mas **NÃO está implementado**

---

### 1.5 Reservas

| Feature (PRD) | Status | Componentes Implementados |
|---------------|--------|---------------------------|
| Calendário de Disponibilidade | ✅ Implementado | `reservationController.getAvailableSlots()` |
| Criar Reserva (Cliente) | ✅ Implementado | `reservationController.createReservation()` |
| Confirmar Reserva (Admin) | ✅ Implementado | `reservationController.confirmReservation()` |
| Cancelar Reserva | ✅ Implementado | `reservationController.cancelReservation()` |
| Lembrete (WhatsApp) | ✅ Implementado | `whatsapp.service.js`, `reservationService.sendReminder()` |
| No-show Automático | ⚠️ Parcial | Método existe (`markNoShows`), mas **job não está agendado** |
| Código de Confirmação | ✅ Implementado | Campo `confirmationCode` em Reservation |

**Mapeamento de Arquivos - Reservas:**
```
Backend:
├── controllers/reservationController.js (12 métodos)
├── services/reservationService.js (13 métodos)
├── services/whatsapp.service.js (3 métodos)
├── models/Reservation.js (20+ campos, 15+ métodos)
└── routes/reservations.js (12 endpoints)

Frontend:
├── pages/reservas.js
├── pages/admin/reservas.js
├── stores/reservationStore.js (20+ actions)
├── components/ReservationForm.js
├── components/ReservationCalendar.js
└── components/ReservationTimeSlots.js
```

**Divergências Encontradas:**
1. ⚠️ **No-show automático**: Método existe mas **job de verificação não está agendado**
2. ⚠️ **Penalização por no-show**: PRD menciona -50 pontos, mas **sistema é cashback, não pontos**

---

### 1.6 Cashback/Fidelidade

| Feature (PRD) | Status | Componentes Implementados |
|---------------|--------|---------------------------|
| Acúmulo Automático (% compra) | ✅ Implementado | `Order.afterUpdate` hook, `User.addCashback()` |
| Tiers (Bronze/Silver/Gold/Platinum) | ✅ Implementado | `User.calculateTier()`, `User.getTierBenefits()` |
| Progressão Automática de Tier | ✅ Implementado | `User.updateTier()` |
| Histórico de Cashback | ✅ Implementado | Model `CashbackHistory`, `crm.controller.getCashbackHistory()` |
| Saldo Visível | ✅ Implementado | Campo `cashbackBalance` em User, `/cashback` page |
| Uso de Cashback no Checkout | ❌ **NÃO IMPLEMENTADO** | Planejado mas não codificado |
| Bônus de Cadastro (R$10) | ❌ **NÃO IMPLEMENTADO** | Não automatizado |
| Bônus de Aniversário | ❌ **NÃO IMPLEMENTADO** | Não automatizado |
| Bônus de Indicação (R$15) | ❌ **NÃO IMPLEMENTADO** | Não implementado |
| Bônus de Avaliação (R$2) | ❌ **NÃO IMPLEMENTADO** | Não automatizado |
| Expiração de Cashback (90 dias) | ⚠️ Parcial | Job existe, mas **precisa verificar se está rodando** |

**Mapeamento de Arquivos - Cashback:**
```
Backend:
├── models/User.js (campos: cashbackBalance, loyaltyTier, totalSpent + métodos)
├── models/CashbackHistory.js
├── controllers/crm.controller.js
├── services/crm.service.js
└── routes/crm.js

Frontend:
├── pages/cashback.js
├── stores/cashbackStore.js
└── components/CashbackDisplay.js
```

**Divergências Críticas:**
1. ❌ **Uso de Cashback**: PRD diz "usar até 50% do pedido", mas **NÃO está implementado**
2. ❌ **Bônus automáticos**: Cadastro, aniversário, indicação, avaliação - **NENHUM está automatizado**
3. ⚠️ **Job de expiração**: Configurado mas precisa validar se está executando

---

## 2. MÓDULO STAFF - ANÁLISE COMPLETA

### 2.1 Roles e Permissões

| Role (PRD) | Implementado | Página | Permissões Reais |
|------------|--------------|--------|------------------|
| Cozinha | ✅ | `/cozinha` | Ver/mudar status de itens de comida |
| Bar | ✅ | `/staff/bar` | Ver/mudar status de bebidas |
| Atendente | ✅ | `/atendente` | Retirar pedidos prontos, entregar, chamar cliente |
| Caixa | ✅ | `/staff/caixa` | Abrir/fechar caixa, sangrias, suprimentos |
| Gerente | ✅ | `/admin` | Tudo |
| Admin | ✅ | `/admin` | Tudo + configurações |

**Mapeamento de Arquivos - Staff:**
```
Backend:
├── controllers/staffController.js (7 métodos)
├── routes/staff.js (7 endpoints)
└── middlewares/ (authorize por role)

Frontend:
├── pages/cozinha/index.js
├── pages/staff/bar.js
├── pages/staff/caixa.js
├── pages/staff/relatorios.js
├── pages/atendente/index.js
├── stores/staffStore.js
└── components/StaffOrderCard.js
```

### 2.2 Narguilé - MIGRAÇÃO PENDENTE

| Feature (PRD) | Status | Onde Está | Onde Deveria Estar |
|---------------|--------|-----------|-------------------|
| Controle de Sessões | ✅ Implementado | `/staff/bar` | **`/atendente`** |
| Criar Sessão | ✅ Implementado | Bar | Atendente |
| Trocar Carvão | ✅ Implementado | Bar | Atendente |
| Pausar/Retomar | ✅ Implementado | Bar | Atendente |
| Finalizar Sessão | ✅ Implementado | Bar | Atendente |

**Mapeamento de Arquivos - Narguilé:**
```
Backend:
├── controllers/hookahController.js (12 métodos)
├── services/hookahService.js (13 métodos)
├── models/HookahSession.js
├── models/HookahFlavor.js
└── routes/hookah.js (12 endpoints)

Frontend:
├── pages/staff/bar.js (CONTÉM Narguilé - ERRADO!)
├── stores/hookahStore.js
├── components/HookahFlavorCard.js
└── components/HookahSessionCard.js
```

**Divergência Crítica:**
- ❌ **PRD diz**: Narguilé controlado pelo ATENDENTE
- ❌ **Sistema atual**: Narguilé está no BAR
- 📋 **Ação necessária**: Migrar aba Narguilé de `/staff/bar` para `/atendente`

---

### 2.3 Caixa/PDV

| Feature (PRD) | Status | Componentes |
|---------------|--------|-------------|
| Abertura de Caixa | ✅ Implementado | `cashier.controller.openCashier()` |
| Fechamento de Caixa | ✅ Implementado | `cashier.controller.closeCashier()` |
| Sangria | ✅ Implementado | `cashier.controller.registerWithdrawal()` |
| Suprimento | ✅ Implementado | `cashier.controller.registerDeposit()` |
| Histórico | ✅ Implementado | `cashier.controller.getCashierHistory()` |
| Venda Manual | ⚠️ Parcial | Existe conceito mas interface incompleta |

**Mapeamento de Arquivos - Caixa:**
```
Backend:
├── controllers/cashier.controller.js (8 métodos)
├── services/cashier.service.js (9 métodos)
├── models/Cashier.js
├── models/CashierMovement.js
└── routes/cashier.routes.js (8 endpoints)

Frontend:
├── pages/staff/caixa.js
└── stores/cashierStore.js
```

---

## 3. MÓDULO ADMIN - ANÁLISE COMPLETA

### 3.1 Dashboard e Relatórios

| Feature (PRD) | Status | Componentes |
|---------------|--------|-------------|
| Dashboard Tempo Real | ✅ Implementado | `/admin`, `adminController.getDashboard()` |
| Relatório de Vendas | ✅ Implementado | `report.controller.getSalesReport()` |
| Relatório por Produto | ✅ Implementado | `report.controller.getProductsReport()` |
| Relatório por Categoria | ✅ Implementado | `report.controller.getCategoriesReport()` |
| Relatório Horário | ✅ Implementado | `report.controller.getHourlyReport()` |
| DRE Simplificado | ✅ Implementado | `report.controller.getDREReport()` |

**Mapeamento de Arquivos - Admin:**
```
Backend:
├── controllers/adminController.js (10 métodos)
├── controllers/report.controller.js (6 métodos)
├── services/report.service.js (5 métodos)
├── routes/admin.js (10 endpoints)
└── routes/report.routes.js (6 endpoints)

Frontend:
├── pages/admin/index.js (Dashboard)
├── pages/admin/orders.js
├── pages/admin/products.js
├── pages/admin/tables.js
├── pages/admin/estoque.js
├── pages/admin/clientes.js
├── pages/admin/reservas.js
├── pages/admin/campanhas.js
├── pages/admin/reports.js
├── pages/admin/logs.js
└── pages/admin/settings.js
```

### 3.2 CRM

| Feature (PRD) | Status | Componentes |
|---------------|--------|-------------|
| Lista de Clientes | ✅ Implementado | `crm.controller.listCustomers()` |
| Detalhes do Cliente | ✅ Implementado | `crm.controller.getCustomer()` |
| Histórico de Cashback | ✅ Implementado | `crm.controller.getCashbackHistory()` |
| Adicionar Cashback Manual | ✅ Implementado | `crm.controller.addCashback()` |
| Clientes Inativos | ✅ Implementado | `crm.controller.getInactiveCustomers()` |
| Próximos de Upgrade | ✅ Implementado | `crm.controller.getNearUpgrade()` |
| Ajustar Tier | ✅ Implementado | `crm.controller.adjustTier()` |

### 3.3 Campanhas

| Feature (PRD) | Status | Componentes |
|---------------|--------|-------------|
| Criar Campanha | ✅ Implementado | `campaign.controller.create()` |
| Listar Campanhas | ✅ Implementado | `campaign.controller.list()` |
| Simular Envio | ✅ Implementado | `campaign.controller.simulate()` |
| Executar Campanha | ✅ Implementado | `campaign.controller.execute()` |
| Reativação Rápida | ✅ Implementado | `campaign.controller.createQuickReactivation()` |

---

## 4. MÓDULO ESTOQUE - ANÁLISE COMPLETA

| Feature (PRD) | Status | Componentes |
|---------------|--------|-------------|
| Cadastro de Produtos | ✅ Implementado | Product model com 30+ campos |
| Movimentações | ✅ Implementado | `inventoryController`, `InventoryMovement` model |
| Baixa Automática (Venda) | ✅ Implementado | Hook em Order.afterCreate |
| Alertas de Mínimo | ✅ Implementado | `inventoryService.getStockAlerts()` |
| Relatório de Consumo | ✅ Implementado | `inventoryService.getConsumptionByProduct()` |
| Previsão de Falta | ✅ Implementado | `inventoryService.predictStockOut()` |

**Divergência:**
- ⚠️ **Ficha Técnica**: PRD menciona "ficha técnica de insumos", mas **não está implementada** (apenas controle de estoque direto no produto)

---

## 5. INTEGRAÇÕES - STATUS

| Integração | PRD | Status Real | Observação |
|------------|-----|-------------|------------|
| Stripe | ✅ | ✅ Configurado | Modo teste ativo |
| Twilio (SMS) | ✅ | ✅ Ativo | Funcionando em produção |
| Google OAuth | 🔄 | ⚠️ 90% | Código pronto, faltam credenciais |
| Socket.IO | ✅ | ✅ Ativo | Real-time funcionando |
| Push Notifications | 🔄 | ⚠️ Parcial | Service existe, precisa ativar |
| WhatsApp (Twilio) | ✅ | ✅ Implementado | Para reservas |

---

## 6. DIVERGÊNCIAS CRÍTICAS (RESUMO) - ATUALIZADO

> **Status após Sprints 23-30**: Maioria das divergências P0 e P1 foram resolvidas!

### Prioridade P0 (Bloqueadores) - ✅ RESOLVIDOS

| # | Problema | PRD | Sistema | Status |
|---|----------|-----|---------|--------|
| 1 | **Fluxo de Pedidos** | Transições controladas por role | ✅ Sprint 23 - Status machine implementada | ✅ RESOLVIDO |
| 2 | **Narguilé no lugar errado** | Atendente controla | ✅ Sprint 23 - Migrado para atendente | ✅ RESOLVIDO |
| 3 | **Uso de Cashback** | Usar até 50% no checkout | ✅ Sprint 24 - Implementado com slider | ✅ RESOLVIDO |

### Prioridade P1 (Importantes) - ✅ MAIORIA RESOLVIDA

| # | Problema | PRD | Sistema | Status |
|---|----------|-----|---------|--------|
| 4 | **Notificação do Atendente** | Recebe TODOS pedidos novos | ✅ Sprint 23 - Socket.IO configurado | ✅ RESOLVIDO |
| 5 | **Google OAuth** | Implementado | ⚠️ Código pronto, credenciais pendentes | ⚠️ PENDENTE |
| 6 | **Bônus automáticos** | Cadastro, aniversário, etc | ✅ Sprint 25/29 - Jobs implementados | ✅ RESOLVIDO |
| 7 | **Push Notifications** | Alertas em tempo real | ✅ Sprint 28 - Service Worker ativo | ✅ RESOLVIDO |

### Prioridade P2 (Melhorias) - PARCIALMENTE RESOLVIDOS

| # | Problema | PRD | Sistema | Status |
|---|----------|-----|---------|--------|
| 8 | **No-show automático** | Marca após 15min | ⏳ Sprint 36 planejada | ⏳ PENDENTE |
| 9 | **Ficha Técnica** | Insumos por produto | ✅ Sprint 26-27 - Backend completo, ⏳ Sprint 31 - UI | ✅ PARCIAL |
| 10 | **Job de expiração cashback** | 90 dias | ✅ Job configurado e rodando | ✅ RESOLVIDO |

### Novas Features Implementadas (Sprints 23-30)

| Sprint | Feature | Status |
|--------|---------|--------|
| 23 | Status Machine + Notificações + QR Code | ✅ |
| 24 | Cashback no Checkout | ✅ |
| 25 | Bônus Automáticos (Cadastro + Aniversário) | ✅ |
| 26-27 | Ficha Técnica/Insumos (Backend + Frontend) | ✅ |
| 28 | Push Notifications Ativo | ✅ |
| 29 | Sistema de Indicação + Bônus Avaliação | ✅ |
| 30 | Upload de Imagens + Gestão de Estoque | ✅ |

---

## 7. MATRIZ DE COMPONENTES POR MÓDULO

### 7.1 Autenticação
```
┌─────────────────────────────────────────────────────────────────┐
│                        AUTENTICAÇÃO                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRONTEND                          BACKEND                      │
│  ─────────                         ───────                      │
│  Pages:                            Controllers:                 │
│  ├─ /login                         └─ authController.js        │
│  ├─ /register                         ├─ register()            │
│  ├─ /complete-profile                 ├─ registerPhone()       │
│  └─ /recuperar-senha                  ├─ loginPassword()       │
│                                       ├─ loginSMS()            │
│  Components:                          ├─ verifySMS()           │
│  ├─ GoogleLoginButton.js              ├─ googleAuth()          │
│  └─ PhoneInput.js                     ├─ completeProfile()     │
│                                       └─ resetPassword()       │
│  Stores:                                                       │
│  └─ authStore.js                   Services:                   │
│      ├─ register()                 ├─ sms.service.js          │
│      ├─ loginWithPassword()        └─ google.service.js       │
│      ├─ loginWithSMS()                                         │
│      ├─ googleLogin()              Models:                     │
│      └─ completeProfile()          └─ User.js                 │
│                                       ├─ googleId             │
│                                       ├─ authProvider         │
│                                       ├─ profileComplete      │
│                                       └─ smsCode              │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Pedidos
```
┌─────────────────────────────────────────────────────────────────┐
│                          PEDIDOS                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRONTEND                          BACKEND                      │
│  ─────────                         ───────                      │
│  Pages:                            Controllers:                 │
│  ├─ /cardapio                      ├─ orderController.js       │
│  ├─ /checkout                      │   ├─ createOrder()        │
│  ├─ /pedidos                       │   ├─ getUserOrders()      │
│  └─ /pedido/[id]                   │   ├─ updateOrderStatus()  │
│                                    │   └─ rateOrder()          │
│  Components:                       │                           │
│  ├─ ProductCard.js                 └─ payment.controller.js    │
│  ├─ CartItem.js                        ├─ createPaymentIntent()│
│  └─ OrderCard.js                       └─ createPixPayment()   │
│                                                                 │
│  Stores:                           Services:                    │
│  ├─ cartStore.js                   ├─ payment.service.js       │
│  ├─ orderStore.js                  ├─ socket.service.js        │
│  └─ productStore.js                └─ push.service.js          │
│                                                                 │
│  Services:                         Models:                      │
│  └─ socket.js                      ├─ Order.js (timeline)      │
│      ├─ onOrderCreated()           ├─ OrderItem.js             │
│      ├─ onOrderStatusChanged()     └─ Product.js               │
│      └─ onOrderReady()                                         │
└─────────────────────────────────────────────────────────────────┘
```

### 7.3 Cashback
```
┌─────────────────────────────────────────────────────────────────┐
│                         CASHBACK                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRONTEND                          BACKEND                      │
│  ─────────                         ───────                      │
│  Pages:                            Controllers:                 │
│  └─ /cashback                      └─ crm.controller.js        │
│                                        ├─ getDashboard()       │
│  Components:                           ├─ getCashbackHistory() │
│  └─ CashbackDisplay.js                 └─ addCashback()        │
│                                                                 │
│  Stores:                           Services:                    │
│  └─ cashbackStore.js               └─ crm.service.js           │
│      ├─ fetchBalance()                 ├─ getCustomerStats()   │
│      ├─ fetchHistory()                 └─ addManualCashback()  │
│      └─ applyCashback() ❌                                     │
│          (não implementado)        Models:                      │
│                                    ├─ User.js                  │
│                                    │   ├─ cashbackBalance      │
│                                    │   ├─ loyaltyTier          │
│                                    │   ├─ totalSpent           │
│                                    │   ├─ addCashback()        │
│                                    │   └─ useCashback()        │
│                                    └─ CashbackHistory.js       │
│                                                                 │
│  ⚠️ GAPS:                                                      │
│  • Uso no checkout NÃO implementado                            │
│  • Bônus automáticos NÃO implementados                         │
└─────────────────────────────────────────────────────────────────┘
```

### 7.4 Staff/Operação
```
┌─────────────────────────────────────────────────────────────────┐
│                      STAFF/OPERAÇÃO                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRONTEND                          BACKEND                      │
│  ─────────                         ───────                      │
│  Pages:                            Controllers:                 │
│  ├─ /cozinha                       ├─ staffController.js       │
│  ├─ /staff/bar                     └─ hookahController.js      │
│  ├─ /staff/caixa                                               │
│  └─ /atendente                     Services:                   │
│      ⚠️ SEM narguilé               ├─ hookahService.js         │
│      (deveria ter!)                └─ cashier.service.js       │
│                                                                 │
│  Components:                       Models:                      │
│  ├─ StaffOrderCard.js              ├─ HookahSession.js         │
│  ├─ HookahSessionCard.js           ├─ HookahFlavor.js          │
│  └─ HookahFlavorCard.js            ├─ Cashier.js               │
│                                    └─ CashierMovement.js       │
│  Stores:                                                       │
│  ├─ staffStore.js                  ⚠️ PROBLEMA:                │
│  ├─ hookahStore.js                 Narguilé está no Bar        │
│  └─ cashierStore.js                Deveria estar no Atendente  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. AÇÕES RECOMENDADAS

### Imediatas (Sprint 23)

1. **Corrigir Fluxo de Pedidos**
   - Criar `orderStatus.service.js` com máquina de estados
   - Validar transições e permissões por role
   - Adicionar campos de timeline (já existem, usar corretamente)

2. **Migrar Narguilé para Atendente**
   - Mover aba de `/staff/bar` para `/atendente`
   - Atualizar permissões no backend

3. **Notificar Atendente em Novos Pedidos**
   - Adicionar room 'attendants' no Socket.IO
   - Emitir `order_created` para atendentes

### Curto Prazo (Sprint 24-25)

4. **Implementar Uso de Cashback no Checkout**
   - Adicionar campo `cashbackUsed` em Order
   - Calcular desconto (max 50% do total)
   - Deduzir de `cashbackBalance`

5. **Configurar Google OAuth**
   - Criar projeto no Google Cloud
   - Adicionar credenciais nas variáveis de ambiente

6. **Ativar Push Notifications**
   - Validar service worker
   - Testar envio em produção

### Médio Prazo (Sprint 26+)

7. **Automatizar Bônus de Cashback**
   - Job para bônus de aniversário
   - Trigger para bônus de cadastro
   - Sistema de indicação

8. **Implementar Ficha Técnica**
   - Model `Recipe` com insumos
   - Baixa automática de insumos por venda

---

## 9. CONCLUSÃO

O sistema FLAME está **80-85% alinhado** com o PRD. As principais divergências são:

1. **Operacionais**: Fluxo de pedidos e localização do narguilé precisam correção
2. **Fidelidade**: Uso de cashback e bônus automáticos não implementados
3. **Integrações**: Google OAuth e Push precisam finalização

A arquitetura está sólida, com boa separação de responsabilidades. As correções são majoritariamente de **lógica de negócio**, não de arquitetura.

---

*Documento gerado em 07/12/2024*
*Próxima revisão: Após Sprint 23*
