# MAPEAMENTO COMPLETO DE USUARIOS E FLUXOS - FLAME

**Data**: 08/12/2024
**Sprint**: 53 - Mapeamento Critico

---

## 1. TIPOS DE USUARIOS DO SISTEMA

### 1.1 Roles no Backend (User.js)
```javascript
roles: ['cliente', 'atendente', 'cozinha', 'bar', 'caixa', 'gerente', 'admin']
```

### 1.2 Descricao de Cada Role

| Role | Descricao | Paginas de Acesso |
|------|-----------|-------------------|
| **cliente** | Usuario final, faz pedidos | /cardapio, /pedidos, /checkout, /perfil, /cashback, /reservas, /avaliacoes |
| **atendente** | Garcom/Atendente, gerencia entregas | /atendente |
| **cozinha** | Cozinheiro, prepara comida | /cozinha |
| **bar** | Bartender, prepara bebidas | /staff/bar |
| **caixa** | Operador de caixa | /staff/caixa |
| **gerente** | Gerente, acesso parcial admin | /admin/* (limitado) |
| **admin** | Administrador total | /admin/* (completo) |

---

## 2. FLUXOS POR TIPO DE USUARIO

### 2.1 CLIENTE

#### Paginas:
- `/cardapio` - Ver produtos, adicionar ao carrinho
- `/checkout` - Finalizar pedido
- `/pedidos` - Acompanhar pedidos
- `/perfil` - Dados pessoais
- `/cashback` - Ver saldo e historico
- `/reservas` - Fazer reservas de mesa
- `/avaliacoes` - Avaliar pedidos

#### Fluxo Principal - Fazer Pedido:
```
1. Cliente acessa /cardapio (pode vir de QR Code com ?mesa=X)
2. Adiciona produtos ao carrinho
3. Vai para /checkout
4. Seleciona:
   - Tipo de consumo: Mesa / Balcao / Delivery
   - Mesa (se tipo = Mesa)
   - Forma de pagamento: PIX / Credito / Debito / Dinheiro / Pagar com Atendente
5. Usa cashback (opcional)
6. Confirma pedido
7. Frontend chama POST /api/orders
8. Backend:
   - Valida dados
   - Busca tableId pelo numero
   - Cria Order com status 'pending'
   - Se pay_later: status = 'pending_payment'
   - Emite socket 'order_created' para cozinha/bar/atendente
9. Cliente vai para /pedidos para acompanhar
```

#### Fluxo - Cancelar Pedido:
```
1. Cliente em /pedidos ve pedido com status 'pending'
2. Clica em "Cancelar"
3. Frontend chama PATCH /api/orders/:id/cancel
4. Backend:
   - Verifica se pode cancelar (status != ready/delivered)
   - Se pagamento ja foi feito (Stripe): cria refund
   - Se usou cashback: devolve ao usuario
   - Atualiza status para 'cancelled'
   - Emite socket 'order_cancelled'
5. Cliente ve mensagem de estorno (se aplicavel)
```

#### Fluxo - Acompanhar Pedido:
```
1. Cliente em /pedidos
2. Conecta Socket.IO
3. Recebe eventos:
   - order_status_updated: atualiza UI
   - order_ready: notificacao "Pedido pronto!"
4. Ve timeline visual do pedido
```

#### Gaps Identificados (CLIENTE):
- [ ] **Sem atualizacao em tempo real na pagina /pedidos** - Socket nao implementado no frontend
- [ ] **Sem push notification quando pedido fica pronto** - Apenas toast local
- [ ] **Nao pode adicionar mais itens a pedido existente** - Precisa criar novo pedido
- [ ] **Sem opcao de gorjeta** - Apenas taxa de servico fixa 10%

---

### 2.2 ATENDENTE

#### Paginas:
- `/atendente` - Painel principal

#### Funcionalidades:
1. **Aba Pagamentos**: Pedidos aguardando pagamento (pay_later)
2. **Aba Novos**: Pedidos pendentes/em preparo
3. **Aba Prontos**: Pedidos prontos para entregar
4. **Aba Entregues**: Historico do dia
5. **Aba Balcao**: Pedidos para retirada
6. **Aba Narguile**: Sessoes de narguile ativas

#### Fluxo - Confirmar Pagamento (pay_later):
```
1. Atendente ve pedido na aba "Pagamentos"
2. Clica em "Confirmar Pagamento"
3. Seleciona forma: Credito / Debito / PIX / Dinheiro
4. Se dinheiro: informa valor recebido, ve troco
5. Confirma
6. Backend POST /api/orders/:id/confirm-payment:
   - Atualiza paymentStatus para 'paid'
   - Atualiza paymentMethod real
   - Muda status para 'confirmed' (vai para producao)
   - Emite socket para cozinha/bar
7. Pedido some da aba Pagamentos, vai para Novos
```

#### Fluxo - Entregar Pedido:
```
1. Atendente ve pedido na aba "Prontos"
2. Pode clicar em "Chamar Cliente" (SMS) ou entregar diretamente
3. Clica em "Marcar Entregue"
4. Backend PATCH /api/orders/:id/status (status: 'delivered')
5. Backend:
   - Atualiza status
   - Credita cashback ao cliente (2-10% conforme tier)
   - Emite socket
6. Pedido vai para historico
```

#### Fluxo - Gerenciar Narguile:
```
1. Atendente vai na aba "Narguile"
2. Ve sessoes ativas com timer
3. Pode:
   - Registrar troca de carvao (todos ou individual)
   - Pausar sessao
   - Retomar sessao pausada
   - Finalizar sessao
4. Backend hookah routes atualizam sessao
```

#### Gaps Identificados (ATENDENTE):
- [ ] **Sem visualizacao de mesa no mapa** - Apenas numero
- [ ] **Sem chat com cliente** - Apenas SMS automatico
- [ ] **Sem historico de pagamentos do dia** - Apenas pedidos entregues
- [ ] **Sem alerta de pedido aguardando pagamento ha muito tempo**

---

### 2.3 COZINHA

#### Paginas:
- `/cozinha` - Fila de producao

#### Funcionalidades:
1. Ver pedidos pendentes (comida)
2. Ver pedidos em preparo
3. Marcar como "Em Preparo"
4. Marcar como "Pronto"
5. Alerta de pedidos atrasados (>15min)

#### Fluxo - Preparar Pedido:
```
1. Cozinheiro ve novo pedido na fila (Socket 'order_created')
2. Clica em "Iniciar Preparo"
3. Backend PATCH /api/orders/:id/status (status: 'preparing')
4. Timer comeca a contar
5. Quando termina, clica em "Pronto"
6. Backend PATCH /api/orders/:id/status (status: 'ready')
7. Emite socket 'order_ready' para atendente
8. Notifica cliente via push (se ativado)
```

#### Gaps Identificados (COZINHA):
- [ ] **Sem filtragem por categoria de produto** - Ve todos os itens misturados
- [ ] **Sem priorizacao automatica** - Apenas ordenacao por tempo
- [ ] **Sem impressao de comanda** - Tudo visual na tela
- [ ] **Sem comunicacao com atendente** - Apenas status do pedido

---

### 2.4 BAR

#### Paginas:
- `/staff/bar` - Fila de bebidas

#### Funcionalidades:
1. Ver pedidos de bebidas pendentes
2. Ver pedidos em preparo
3. Marcar como "Em Preparo"
4. Marcar como "Pronto"
5. Alerta de bebidas atrasadas

#### Fluxo - Preparar Bebida:
```
1. Bartender ve novo pedido (Socket 'order_created')
2. Identifica itens de categoria "Bebidas"/"Drinks"
3. Clica em "Iniciar Preparo"
4. Backend atualiza status
5. Clica em "Pronto"
6. Emite socket para atendente
```

#### Gaps Identificados (BAR):
- [ ] **Narguile foi migrado para /atendente** - OK, mas bar pode querer ver
- [ ] **Sem receitas/fichas tecnicas visiveis** - Precisa ir no admin
- [ ] **Sem controle de insumos em tempo real** - Baixa e automatica mas sem alerta

---

### 2.5 CAIXA

#### Paginas:
- `/staff/caixa` - Gestao de caixa

#### Funcionalidades:
1. Abrir caixa (com valor inicial)
2. Registrar suprimento (entrada de dinheiro)
3. Registrar sangria (retirada de dinheiro)
4. Fechar caixa (contar e comparar esperado vs real)
5. Ver historico de caixas
6. Ver estatisticas (7/15/30/60 dias)

#### Fluxo - Operar Caixa:
```
1. Caixa abre turno: POST /api/cashier/open
   - Informa valor inicial (fundo de troco)
2. Durante o dia:
   - Pedidos pagos em dinheiro entram automaticamente
   - Pode registrar suprimentos (troco adicional)
   - Pode registrar sangrias (despesas, retiradas)
3. No fim: POST /api/cashier/:id/close
   - Conta dinheiro real
   - Sistema mostra esperado
   - Calcula diferenca (sobra/falta)
4. Gera relatorio do turno
```

#### Gaps Identificados (CAIXA):
- [ ] **Sem integracao com maquininha de cartao** - Apenas registro manual
- [ ] **Sem impressao de comprovante** - Apenas visual
- [ ] **Vendas de pedidos pay_later nao entram automaticamente** - Precisa confirmar manualmente
- [ ] **Sem alerta de fechamento proximo** - Operador pode esquecer

---

### 2.6 ADMIN/GERENTE

#### Paginas:
- `/admin` - Dashboard
- `/admin/orders` - Pedidos
- `/admin/products` - Produtos
- `/admin/tables` - Mesas
- `/admin/estoque` - Estoque
- `/admin/insumos` - Insumos
- `/admin/reports` - Relatorios
- `/admin/clientes` - CRM
- `/admin/campanhas` - Campanhas marketing
- `/admin/reservas` - Reservas
- `/admin/logs` - Logs do sistema
- `/admin/settings` - Configuracoes

#### Funcionalidades Principais:

**Dashboard**:
- KPIs do dia (pedidos, receita, ticket medio)
- Pedidos ativos por status
- Grafico de vendas

**Pedidos**:
- Listar todos os pedidos
- Filtrar por status/data/cliente
- Ver detalhes
- Mudar status manualmente
- Cancelar pedidos

**Produtos**:
- CRUD de produtos
- Upload de imagens
- Categorias
- Ficha tecnica (insumos)
- Marcar destaque

**Mesas**:
- CRUD de mesas
- Ver status (livre/ocupada)
- Gerar QR Code

**Estoque**:
- Ver niveis de estoque
- Alertas de estoque baixo
- Ajustar estoque manualmente

**Relatorios**:
- Vendas por periodo
- Produtos mais vendidos
- Clientes top
- Analise de cancelamentos

**CRM**:
- Ver todos clientes
- Tier de fidelidade
- Historico de pedidos
- Cashback acumulado

#### Gaps Identificados (ADMIN):
- [ ] **Dashboard tem problema de hydration** - ✅ Corrigido Sprint 51
- [ ] **Sem relatorio de estorno** - Precisa consultar Stripe
- [ ] **Sem controle de acesso granular** - Admin ve tudo, gerente tambem
- [ ] **Sem auditoria de acoes** - Logs basicos apenas
- [ ] **Sem gestao de usuarios staff** - Precisa criar via seed/db

---

## 3. FLUXO COMPLETO DE UM PEDIDO (END-TO-END)

```
CLIENTE                 BACKEND                 STAFF
-------                 -------                 -----
1. Seleciona produtos
2. Vai pro checkout
3. Escolhe forma pag
   |
   v
4. POST /orders ------> 5. Cria Order
                           status: pending
                           Se pay_later:
                             status: pending_payment
                        |
                        v
                        6. Socket: order_created
                                                |
                                                v
                                        7. ATENDENTE ve na aba
                                           "Pagamentos" (se pay_later)
                                           ou vai direto pra cozinha
                                                |
                                                v
                                        8. Se pay_later:
                                           - Cobra cliente
                                           - Confirma pagamento
                                           - PATCH /confirm-payment
                                                |
                        <-----------------------|
                        9. status: confirmed
                           Socket: order_updated
                                                |
                                                v
                                        10. COZINHA ve pedido
                                            - Inicia preparo
                                            - status: preparing
                                                |
                                                v
                                        11. COZINHA termina
                                            - status: ready
                                            - Socket: order_ready
                                                |
                                                v
                                        12. ATENDENTE ve "Pronto"
                                            - Entrega ao cliente
                                            - status: delivered
                                                |
                        <-----------------------|
                        13. Credita cashback
                            Socket: order_delivered
   |
   v
14. Cliente ve status
    "Entregue"
15. Pode avaliar
```

---

## 4. FLUXO DE CANCELAMENTO (END-TO-END)

```
CLIENTE/STAFF           BACKEND                 ACOES
-------------           -------                 -----
1. Solicita cancelar
   PATCH /cancel
   |
   v
                        2. Verifica se pode cancelar
                           - Status != ready/delivered
                           - Se nao pode: erro
                        |
                        v
                        3. Se tem paymentId (pagou online):
                           - Verifica status no Stripe
                           - Se 'succeeded': createRefund()
                           - Se outro: cancelPayment()
                        |
                        v
                        4. Se usou cashback:
                           - user.addCashback(valor, orderId)
                        |
                        v
                        5. Atualiza:
                           - status: cancelled
                           - paymentStatus: refunded (se aplicavel)
                           - cancelledAt: now()
                        |
                        v
                        6. Socket: order_cancelled
                           - Notifica staff
                           - Atualiza cozinha/bar
   |
   v
7. Cliente recebe:
   - Toast de sucesso
   - Info de estorno (se aplicavel)
   - Cashback devolvido (se usou)
```

---

## 5. GAPS E FUNCIONALIDADES FALTANTES

### 5.1 Prioridade CRITICA (P0)

| # | Gap | Impacto | Solucao |
|---|-----|---------|---------|
| 1 | Socket.IO nao conecta na pagina /pedidos do cliente | Cliente nao ve atualizacao em tempo real | Implementar socketService na pagina |
| 2 | Push notification nao dispara para cliente | Cliente nao e avisado quando pedido pronto | Verificar push.service.js e frontend |
| 3 | Nao ha validacao se mesa esta livre ao criar pedido | Pode ter 2 pedidos na mesma mesa | Validar tableId unico em orders ativos |

### 5.2 Prioridade ALTA (P1)

| # | Gap | Impacto | Solucao |
|---|-----|---------|---------|
| 4 | Cozinha/Bar veem todos os itens misturados | Confuso, precisa filtrar manualmente | Separar itens por categoria no backend |
| 5 | Atendente nao ve mapa de mesas | Precisa saber numero de cor | Criar componente visual de mesas |
| 6 | Caixa nao recebe vendas pay_later automaticamente | Diferenca no fechamento | Integrar com confirm-payment |
| 7 | Sem alerta de pedido parado muito tempo | Pode esquecer pedido | Cron job ou socket para alertas |

### 5.3 Prioridade MEDIA (P2)

| # | Gap | Impacto | Solucao |
|---|-----|---------|---------|
| 8 | Sem impressao de comanda | Staff precisa de papel | Integrar com impressora termica |
| 9 | Sem chat entre staff e cliente | Comunicacao limitada | Criar sistema de mensagens |
| 10 | Sem gorjeta customizada | Apenas 10% fixo | Adicionar opcao no checkout |
| 11 | Sem gestao de usuarios staff via admin | Precisa seed manual | CRUD de usuarios no admin |

### 5.4 Prioridade BAIXA (P3)

| # | Gap | Impacto | Solucao |
|---|-----|---------|---------|
| 12 | Sem integracao com maquininha | Registro manual | Integrar TEF/POS |
| 13 | Sem relatorio de estornos | Consultar Stripe | Dashboard de estornos |
| 14 | Sem modo offline para staff | Se internet cair, para | PWA com sync |

---

## 6. MATRIZ DE PERMISSOES

| Funcionalidade | cliente | atendente | cozinha | bar | caixa | gerente | admin |
|----------------|---------|-----------|---------|-----|-------|---------|-------|
| Ver cardapio | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Fazer pedido | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Cancelar proprio pedido | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Confirmar pagamento | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Mudar status pedido | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Cancelar qualquer pedido | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Ver fila cozinha | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Ver fila bar | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Operar caixa | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| CRUD produtos | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Ver relatorios | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Gerenciar campanhas | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Gerenciar usuarios | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 7. SOCKET.IO - EVENTOS POR ROLE

### Eventos Emitidos pelo Backend:
```javascript
// Para todos
'order_status_updated' - Qualquer mudanca de status

// Para cozinha/bar
'order_created' - Novo pedido para preparar

// Para atendente
'order_ready' - Pedido pronto para entregar
'payment_request' - Cliente quer pagar (pay_later)

// Para cliente
'order_ready' - Seu pedido esta pronto
'order_delivered' - Pedido entregue
```

### Salas Socket:
```javascript
socketService.joinKitchenRoom()  // Cozinha
socketService.joinBarRoom()      // Bar
socketService.joinWaiterRoom()   // Atendente
socketService.joinAdminRoom()    // Admin
```

---

## 8. PROXIMOS PASSOS (TAREFAS)

### Sprint 54 - Correcoes Criticas

1. **[P0] Implementar Socket.IO na pagina /pedidos**
   - Conectar ao socket quando pagina monta
   - Escutar order_status_updated, order_ready
   - Atualizar UI em tempo real

2. **[P0] Validar mesa livre ao criar pedido**
   - Verificar se tableId tem pedidos ativos
   - Retornar erro se mesa ocupada
   - Permitir override com flag

3. **[P0] Testar push notifications end-to-end**
   - Verificar service worker
   - Testar notifyOrderReady
   - Testar em dispositivo movel

### Sprint 55 - Melhorias Staff

4. **[P1] Filtrar itens por categoria na cozinha/bar**
   - Criar flag `category` nos items
   - Cozinha ve apenas comida
   - Bar ve apenas bebidas

5. **[P1] Integrar caixa com confirm-payment**
   - Quando atendente confirma, registra no caixa
   - Mostrar vendas em tempo real

6. **[P1] Criar alertas de tempo**
   - Pedido > 15min: alert no staff
   - Pedido > 30min: notificar gerente

### Sprint 56 - UX

7. **[P2] Mapa visual de mesas**
   - Componente drag-and-drop
   - Mostrar status de cada mesa
   - Click para ver pedidos

8. **[P2] Opcao de gorjeta**
   - Slider no checkout
   - Valores sugeridos 10%, 15%, 20%
   - Campo customizado

9. **[P2] Chat staff-cliente**
   - Mensagens no pedido
   - Notificacao de nova mensagem

---

**Documento gerado para Sprint 53**
**Proxima revisao**: Apos implementacao das tarefas
