# ANÁLISE CRÍTICA DE FLUXOS - FLAME

## PROBLEMA IMEDIATO: Painel Admin Tela Branca

### Causa Provável
O admin/index.js usa stores que podem não estar inicializados corretamente no SSR/hydration.

---

## MAPEAMENTO COMPLETO DE FLUXOS DO SISTEMA

### 1. FLUXO DO CLIENTE (PEDIDO)

#### 1.1 Fazer Pedido
```
Cliente → Cardápio → Adiciona ao Carrinho → Checkout → Seleciona Mesa → Escolhe Pagamento → Confirma
```

**Cenários Possíveis:**
| Cenário | Situação Atual | O que Falta |
|---------|----------------|-------------|
| Cliente faz pedido com PIX | ✅ Funciona | - |
| Cliente faz pedido com cartão online | ✅ Funciona | - |
| Cliente faz pedido "pagar com atendente" | ✅ Funciona | - |
| **Cliente cancela antes de pagar** | ⚠️ FALTA | Botão cancelar no app cliente |
| **Cliente fecha o app antes de confirmar** | ⚠️ FALTA | Carrinho persiste mas pedido não foi criado |
| **Conexão cai durante pagamento** | ⚠️ FALTA | Retry automático, verificar status |
| **Mesa está ocupada/inativa** | ✅ Backend valida | - |
| **Produto esgota durante checkout** | ✅ Backend valida estoque | - |
| **Valor mínimo não atingido** | ✅ Backend valida R$15 | - |

#### 1.2 Cancelar Pedido (CLIENTE)
```
Cliente → Meus Pedidos → Pedido Pendente → Botão Cancelar → Confirma
```

**O que acontece no cancelamento:**
- [ ] Estoque é restaurado?
- [ ] Pagamento é estornado (se já foi pago)?
- [ ] Cozinha/Bar são notificados?
- [ ] Cliente recebe confirmação?
- [ ] Cashback usado é devolvido?

**Regras de negócio para cancelamento:**
| Status do Pedido | Pode Cancelar? | Quem Pode? |
|------------------|----------------|------------|
| pending_payment | ✅ Sim | Cliente, Atendente, Admin |
| pending | ✅ Sim | Cliente (até 5 min?), Atendente, Admin |
| confirmed | ⚠️ Verificar | Atendente, Admin |
| preparing | ⚠️ Verificar | Admin (com perda?) |
| ready | ❌ Não | - |
| on_way | ❌ Não | - |
| delivered | ❌ Não | - |

---

### 2. FLUXO DO ATENDENTE

#### 2.1 Receber Pagamento
```
Cliente pede "pagar com atendente" → Atendente recebe notificação →
Abre modal → Seleciona método (crédito/débito/pix/dinheiro) → Confirma →
Pedido vai para Cozinha/Bar
```
✅ **IMPLEMENTADO** (Sprint atual)

#### 2.2 Pedidos Prontos para Retirar
```
Cozinha/Bar marca como "ready" → Atendente recebe notificação →
Aparece na aba "Prontos" → Atendente entrega → Marca como "delivered"
```
✅ **IMPLEMENTADO** (Sprint atual)

**Cenários Faltando:**
| Cenário | O que Falta |
|---------|-------------|
| Cliente não está na mesa quando pedido fica pronto | Botão "Chamar Cliente" ✅ existe |
| Cliente saiu sem pagar | Botão para marcar como "dívida" ou acionar segurança? |
| Cliente reclama do pedido | Fluxo de reclamação/reembolso |
| Pedido errado entregue | Correção de pedido |

---

### 3. FLUXO DA COZINHA

#### 3.1 Preparar Pedido
```
Pedido entra na fila (confirmed) → Cozinheiro clica "Iniciar Preparo" (preparing) →
Prepara → Clica "Pronto" (ready) → Pedido sai da cozinha
```
✅ **IMPLEMENTADO**

**Cenários Faltando:**
| Cenário | O que Falta |
|---------|-------------|
| Falta ingrediente durante preparo | Notificar cliente/atendente, opção de substituir |
| Pedido muito grande/demorado | Estimativa de tempo dinâmica |
| Cozinha fecha mais cedo | Bloquear novos pedidos de comida |
| Pedido prioritário (VIP, aniversário) | Tag de prioridade |

---

### 4. FLUXO DO BAR

#### 4.1 Preparar Bebidas
```
Pedido de bebida entra → Bartender prepara → Marca como "ready" →
Atendente retira
```
✅ **IMPLEMENTADO**

**Cenários Faltando:**
| Cenário | O que Falta |
|---------|-------------|
| Cliente menor de idade pede bebida alcoólica | Verificação de idade? |
| Bebida promocional (happy hour) | Horário automático de desconto |
| Limite de consumo de álcool | Alerta de consumo excessivo? |

---

### 5. FLUXO DO CAIXA

#### 5.1 Gerenciar Caixa
```
Abre caixa → Registra movimentos → Fecha caixa → Relatório
```
✅ **IMPLEMENTADO**

**Cenários Faltando:**
| Cenário | O que Falta |
|---------|-------------|
| Diferença no fechamento | Registro de diferença, justificativa |
| Sangria durante turno | ✅ Existe |
| Reforço durante turno | ✅ Existe |
| Troca de turno | Passagem de caixa documentada |

---

### 6. FLUXO DO ADMIN

#### 6.1 Dashboard
```
Admin acessa /admin → Vê métricas → Gerencia sistema
```
⚠️ **PROBLEMA ATUAL: TELA BRANCA**

**Problemas Identificados:**
1. `getActiveOrders()` e `getUpcomingReservations()` podem falhar se store não hydratou
2. Dados mockados no dashboard
3. Falta tratamento de erro

---

### 7. FLUXOS DE ERRO E EXCEÇÕES

#### 7.1 Problemas de Rede
| Situação | Tratamento Atual | Ideal |
|----------|------------------|-------|
| API offline | Toast de erro | Retry + Fallback offline |
| Socket desconecta | Reconecta auto | ✅ Funciona |
| Timeout longo | Nada | Loading state + Cancel |

#### 7.2 Problemas de Dados
| Situação | Tratamento Atual | Ideal |
|----------|------------------|-------|
| Produto deletado durante pedido | Erro | Notificar e sugerir alternativa |
| Mesa desativada com pedido ativo | ? | Bloquear desativação |
| Usuário deletado com pedidos | ? | Soft delete |

#### 7.3 Problemas de Pagamento
| Situação | Tratamento Atual | Ideal |
|----------|------------------|-------|
| Stripe falha | Toast erro | Retry + Métodos alternativos |
| PIX expira | ? | Gerar novo QR |
| Cartão recusado | Toast erro | Sugerir outro cartão/método |
| Chargeback | ? | Notificar admin, marcar cliente |

---

### 8. FLUXOS DE NARGUILÉ

#### 8.1 Sessão de Narguilé
```
Cliente pede narguilé → Atendente inicia sessão → Timer roda →
Troca de carvão periódica → Cliente pede fim → Atendente finaliza
```
✅ **IMPLEMENTADO**

**Cenários Faltando:**
| Cenário | O que Falta |
|---------|-------------|
| Cliente esquece sessão aberta | Alerta após X horas |
| Carvão acaba | Notificar estoque |
| Sessão pausada muito tempo | Cobrar ou cancelar automaticamente? |

---

### 9. FLUXOS DE RESERVA

#### 9.1 Fazer Reserva
```
Cliente → Escolhe data/hora → Preenche dados → Confirma →
Recebe confirmação
```
✅ **IMPLEMENTADO**

**Cenários Faltando:**
| Cenário | O que Falta |
|---------|-------------|
| Cliente não aparece (no-show) | Marcar no histórico, possível bloqueio |
| Cancelamento em cima da hora | Política de cancelamento |
| Overbooking | Limite por horário |
| Fila de espera | Quando lotado |

---

## CORREÇÕES PRIORITÁRIAS

### P0 - CRÍTICO (Fazer agora)
1. **Fix Admin Dashboard** - Tela branca
2. **Cancelamento de Pedido pelo Cliente** - Não existe botão

### P1 - ALTO (Próxima sprint)
3. **Estorno de Cashback no Cancelamento**
4. **Notificação de Pedido Cancelado para Cozinha/Bar**
5. **Tratamento de Erros de Rede**

### P2 - MÉDIO (Futuro próximo)
6. **Política de No-Show em Reservas**
7. **Alerta de Narguilé Aberto**
8. **Verificação de Idade para Álcool**

### P3 - BAIXO (Backlog)
9. **Modo Offline Básico**
10. **Fila de Espera para Reservas**
11. **Sistema de Reclamações**

---

## IMPLEMENTAÇÃO DO FIX ADMIN

### Problema
O admin/index.js quebra porque:
1. Usa stores (orderStore, reservationStore) que dependem de hydration
2. Chama `getActiveOrders()` e `getUpcomingReservations()` antes do store estar pronto
3. Não tem try/catch nem fallback

### Solução
1. Adicionar verificação de hydration com `isHydrated` state
2. Adicionar try/catch com fallback para arrays vazios
3. Verificar se stores estão inicializados antes de usar

---

## IMPLEMENTAÇÃO DE CANCELAMENTO PELO CLIENTE

### Problema Atual
O `cancelOrder` no orderStore.js (linha 323-357) é um **MOCK**!
- Usa `setTimeout` em vez de chamar API
- Não chama backend
- Não restaura estoque
- Não processa reembolso
- Não notifica staff

### Backend (JÁ EXISTE - orderController.js linha 668-753)
O método `cancelOrder` já existe e faz:
✅ Verifica status com `order.canBeCancelled()`
✅ Cancela pagamento no Stripe
✅ Restaura estoque
✅ Registra movimento de inventário
❌ **NÃO** devolve cashback
❌ **NÃO** notifica cozinha/bar via Socket

### Frontend (PRECISA IMPLEMENTAR)
1. Modificar `cancelOrder` no orderStore.js para chamar API real:
   - `DELETE /api/orders/:id` ou `POST /api/orders/:id/cancel`
2. O botão já existe no pedidos.js (linha 338-347)
3. Precisa chamar API real em vez de mock

---

## PLANO DE IMPLEMENTAÇÃO - SPRINT 51

### Fase 1: Fix Admin Dashboard (P0)
**Arquivo:** `frontend/src/pages/admin/index.js`
1. Adicionar `isHydrated` state
2. Retornar loading até hydrated
3. Wrap stores em try/catch
4. Fallback para arrays vazios

### Fase 2: Cancelamento Real (P0)
**Arquivo:** `frontend/src/stores/orderStore.js`
1. Substituir mock por chamada API real
2. Adicionar `getAuthToken()` helper

**Arquivo:** `backend/src/controllers/orderController.js`
1. Adicionar devolução de cashback no cancelamento
2. Adicionar notificação Socket para staff

### Fase 3: Notificações de Cancelamento (P1)
**Arquivo:** `backend/src/services/socket.service.js`
1. Adicionar `notifyOrderCancelled(order)`

**Arquivos:** `frontend/src/pages/cozinha/index.js`, `frontend/src/pages/staff/bar.js`
1. Ouvir evento `order_cancelled`
2. Remover pedido da fila com animação
