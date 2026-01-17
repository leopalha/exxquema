# ✅ CHECKLIST DE VALIDAÇÃO - D7 (100%)

**Data**: 2026-01-18
**Sistema**: MANUS v7.1
**Objetivo**: Validar todos os fluxos críticos em ambiente real (staging/production)
**Score Atual D7**: 95%
**Meta**: 100%

---

## 📋 METODOLOGIA

### Ambientes de Teste
- ✅ **Staging**: `https://staging.flamelounge.com` (preferencial)
- ⚠️ **Production**: `https://flamelounge.com` (apenas leitura/não-destrutivo)

### Critérios de Sucesso
- ✅ Fluxo completa sem erros
- ✅ Dados salvos corretamente no banco
- ✅ Notificações enviadas (WebSocket + Push)
- ✅ UI atualiza em tempo real
- ✅ Performance aceitável (<2s por operação)

### Usuários de Teste
```
Cliente:
- Email: cliente.teste@flamelounge.com
- Senha: TesteCliente123!

Atendente:
- Email: atendente.teste@flamelounge.com
- Senha: TesteAtendente123!

Admin:
- Email: admin.teste@flamelounge.com
- Senha: TesteAdmin123!
```

---

## 🎯 FLUXOS CRÍTICOS (P0)

### 1. FLUXO COMPLETO DE PEDIDO (Cliente → Atendente → Cozinha/Bar)

**Tempo estimado**: 10 minutos
**Dispositivos**: 3 (Cliente mobile, Atendente tablet, Cozinha desktop)

#### 1.1 Cliente - Criar Pedido
- [ ] **Passo 1**: Login como cliente no mobile
  - URL: `/login`
  - Esperar: Redirecionamento para `/`
  - Validar: Nome do usuário aparece no header

- [ ] **Passo 2**: Adicionar produtos ao carrinho
  - URL: `/menu` ou `/`
  - Ação: Adicionar 2 bebidas + 1 comida
  - Validar: Contador do carrinho atualiza (badge com "3")
  - Validar: Valor total calculado corretamente

- [ ] **Passo 3**: Ir para checkout
  - URL: `/checkout`
  - Validar: Step 1 mostra os 3 produtos
  - Validar: Subtotal, taxa de serviço, total corretos

- [ ] **Passo 4**: Selecionar tipo de consumo
  - Ação: Escolher "Mesa" e selecionar mesa 5
  - Clicar: "Próximo"
  - Validar: Avança para Step 3 (era Step 2)

- [ ] **Passo 5**: Revisar e confirmar
  - Validar: Mostra "Pagar com Atendente"
  - Validar: Aviso: "Um atendente virá até sua mesa"
  - Ação: Clicar "Confirmar Pedido"
  - Esperar: Toast de sucesso
  - Validar: Redirecionado para `/orders`
  - Validar: Pedido aparece com status "Aguardando Pagamento"

#### 1.2 Atendente - Confirmar Pagamento
- [ ] **Passo 6**: Login como atendente no tablet
  - URL: `/atendente`
  - Validar: Recebeu notificação sonora (ding!)
  - Validar: Toast: "Novo pedido na Mesa 5"
  - Validar: Badge vermelho em "PAGAMENTOS" com número

- [ ] **Passo 7**: Abrir seção de pagamentos
  - Ação: Clicar "PAGAMENTOS"
  - Validar: Card do pedido aparece
  - Validar: Mostra Mesa 5, valor total, status "Aguardando Pagamento"

- [ ] **Passo 8**: Confirmar pagamento
  - Ação: Clicar "Confirmar Pagamento"
  - Validar: Modal abre com 4 botões (Crédito, Débito, PIX, Dinheiro)
  - Ação: Clicar "Crédito"
  - Validar: Modal fecha
  - Validar: Pedido some de "PAGAMENTOS"
  - Validar: Toast de sucesso: "Pagamento confirmado"

#### 1.3 Cozinha/Bar - Receber e Preparar
- [ ] **Passo 9**: Abrir painel da cozinha
  - URL: `/cozinha`
  - Validar: Recebeu notificação sonora
  - Validar: Pedido aparece em "NOVOS PEDIDOS"
  - Validar: Mostra itens de comida (não bebidas)

- [ ] **Passo 10**: Aceitar pedido na cozinha
  - Ação: Clicar "Aceitar Pedido"
  - Validar: Status muda para "Em Preparo"
  - Validar: Pedido move para seção "EM PREPARO"

- [ ] **Passo 11**: Abrir painel do bar
  - URL: `/bar`
  - Validar: Mostra itens de bebida (não comida)
  - Ação: Clicar "Aceitar Pedido"
  - Validar: Status muda para "Em Preparo"

- [ ] **Passo 12**: Finalizar preparo
  - Ação (Cozinha): Clicar "Pronto"
  - Validar: Item de comida marca como "Pronto"
  - Ação (Bar): Clicar "Pronto"
  - Validar: Item de bebida marca como "Pronto"
  - Validar: Pedido completo muda para status "Pronto"

#### 1.4 Atendente - Entregar
- [ ] **Passo 13**: Entregar na mesa
  - URL: `/atendente`
  - Validar: Pedido aparece em "PRONTOS PARA ENTREGA"
  - Ação: Clicar "Entregar"
  - Validar: Status muda para "Entregue"
  - Validar: Toast: "Pedido entregue na Mesa 5"

#### 1.5 Cliente - Confirmar Recebimento
- [ ] **Passo 14**: Verificar status no app
  - URL: `/orders` (mobile)
  - Validar: Status mostra "Entregue"
  - Validar: Histórico completo visível
  - Validar: Cashback calculado e exibido

**✅ Sucesso**: Fluxo completo funciona de ponta a ponta

---

### 2. CASHBACK - CÁLCULO E APLICAÇÃO

**Tempo estimado**: 8 minutos

#### 2.1 Verificar Tier Atual
- [ ] **Passo 1**: Login como cliente
  - URL: `/profile` ou `/cashback`
  - Validar: Mostra tier atual (Bronze/Silver/Gold/Platinum)
  - Validar: Mostra total gasto (totalSpent)
  - Validar: Mostra saldo de cashback disponível
  - Validar: Mostra progresso para próximo tier (barra %)

#### 2.2 Acumular Cashback em Pedido
- [ ] **Passo 2**: Criar pedido de R$ 100
  - Seguir fluxo de pedido (steps 1-5 do Fluxo 1)
  - Validar: Não marcar "Usar cashback"
  - Confirmar pedido e completar pagamento

- [ ] **Passo 3**: Verificar cashback acumulado
  - URL: `/cashback`
  - Validar: Saldo aumentou em 1.5% do valor (R$ 1.50 para Bronze)
  - Validar: Histórico mostra transação de acúmulo
  - Validar: totalSpent aumentou em R$ 100

#### 2.3 Usar Cashback em Pedido
- [ ] **Passo 4**: Criar novo pedido de R$ 50
  - Adicionar produtos ao carrinho
  - No checkout, marcar "Usar cashback disponível"
  - Validar: Valor do desconto aparece
  - Validar: Total final = Subtotal - Cashback usado
  - Confirmar pedido

- [ ] **Passo 5**: Verificar dedução
  - URL: `/cashback`
  - Validar: Saldo diminuiu corretamente
  - Validar: Histórico mostra transação de uso (negativa)

#### 2.4 Instagram Cashback Bonus
- [ ] **Passo 6**: Criar pedido com Instagram bonus
  - Criar pedido de R$ 100
  - Marcar opção "Quero compartilhar no Instagram (+5% cashback)"
  - Confirmar pedido
  - Validar: Recebe 1.5% base + 5% Instagram = 6.5% total (R$ 6.50)

- [ ] **Passo 7**: Verificar saldo
  - URL: `/cashback`
  - Validar: Saldo aumentou em R$ 6.50
  - Validar: Histórico discrimina cashback base + Instagram

#### 2.5 Progressão de Tier
- [ ] **Passo 8**: Simular avanço de tier
  - Verificar totalSpent atual
  - Calcular quanto falta para próximo tier:
    - Bronze → Silver: R$ 1.000
    - Silver → Gold: R$ 5.000
    - Gold → Platinum: R$ 10.000
  - Criar pedidos até atingir threshold
  - Validar: Tier muda automaticamente
  - Validar: Taxa de cashback aumenta
  - Validar: Notificação de "Parabéns! Você subiu de tier!"

**✅ Sucesso**: Sistema de cashback funciona corretamente

---

### 3. SPLIT PAYMENT - PAGAMENTO DIVIDIDO

**Tempo estimado**: 6 minutos

#### 3.1 Dividir Conta por Valor
- [ ] **Passo 1**: Cliente cria pedido de R$ 200
  - Seguir fluxo normal até confirmação

- [ ] **Passo 2**: Atendente divide por valor
  - URL: `/atendente`
  - Clicar no pedido → "Dividir Conta"
  - Escolher: "Dividir por Valor"
  - Dividir em 2 partes: R$ 120 e R$ 80
  - Validar: Soma das partes = Total (R$ 200)
  - Confirmar divisão

- [ ] **Passo 3**: Processar pagamentos
  - Cliente 1 paga R$ 120 com Crédito
  - Cliente 2 paga R$ 80 com PIX
  - Validar: Ambos pagamentos registrados
  - Validar: Status muda para "Pago" após ambos confirmados

#### 3.2 Dividir Conta por Itens
- [ ] **Passo 4**: Cliente cria pedido com 4 itens
  - Item A: R$ 50
  - Item B: R$ 30
  - Item C: R$ 40
  - Item D: R$ 20
  - Total: R$ 140

- [ ] **Passo 5**: Atendente divide por itens
  - Escolher: "Dividir por Itens"
  - Cliente 1: Itens A + B (R$ 80)
  - Cliente 2: Itens C + D (R$ 60)
  - Validar: Soma = Total
  - Confirmar divisão

- [ ] **Passo 6**: Processar pagamentos
  - Confirmar ambos pagamentos
  - Validar: Cashback calculado proporcionalmente
  - Validar: Status final "Pago"

**✅ Sucesso**: Split payment funciona corretamente

---

### 4. NOTIFICAÇÕES - WEBSOCKET E PUSH

**Tempo estimado**: 5 minutos

#### 4.1 WebSocket Real-Time
- [ ] **Passo 1**: Abrir 3 janelas simultâneas
  - Janela 1: Cliente (`/`)
  - Janela 2: Atendente (`/atendente`)
  - Janela 3: Cozinha (`/cozinha`)

- [ ] **Passo 2**: Cliente cria pedido
  - Validar (Atendente): Notificação aparece imediatamente
  - Validar (Atendente): Som toca
  - Validar (Atendente): Badge atualiza

- [ ] **Passo 3**: Atendente confirma pagamento
  - Validar (Cozinha): Notificação aparece imediatamente
  - Validar (Cozinha): Som toca
  - Validar (Cliente): Status atualiza em tempo real

- [ ] **Passo 4**: Cozinha marca como pronto
  - Validar (Atendente): Notificação de "Pedido pronto"
  - Validar (Cliente): Status atualiza

#### 4.2 Push Notifications (PWA)
- [ ] **Passo 5**: Instalar PWA no mobile
  - Abrir site no Chrome mobile
  - Clicar "Adicionar à tela inicial"
  - Permitir notificações

- [ ] **Passo 6**: Testar com app fechado
  - Fechar PWA completamente
  - Criar pedido em outro dispositivo
  - Validar: Push notification aparece
  - Clicar na notificação
  - Validar: Abre direto na tela do pedido

**✅ Sucesso**: Notificações funcionam em tempo real

---

### 5. AUTENTICAÇÃO E AUTORIZAÇÃO

**Tempo estimado**: 5 minutos

#### 5.1 Login e Logout
- [ ] **Passo 1**: Login com credenciais válidas
  - URL: `/login`
  - Validar: Redirecionamento correto por role
    - Cliente → `/`
    - Atendente → `/atendente`
    - Admin → `/admin`
    - Cozinha → `/cozinha`

- [ ] **Passo 2**: Login com credenciais inválidas
  - Validar: Erro "Email ou senha incorretos"
  - Validar: Não redireciona

- [ ] **Passo 3**: Logout
  - Clicar no botão de logout
  - Validar: Redireciona para `/login`
  - Validar: Token removido
  - Validar: Tentar acessar rota protegida → Redirect para login

#### 5.2 Proteção de Rotas
- [ ] **Passo 4**: Cliente tenta acessar `/atendente`
  - Validar: Redirect para `/` ou erro 403

- [ ] **Passo 5**: Atendente tenta acessar `/admin`
  - Validar: Redirect ou erro 403

- [ ] **Passo 6**: Usuário não logado tenta acessar `/orders`
  - Validar: Redirect para `/login`

#### 5.3 Refresh Token
- [ ] **Passo 7**: Deixar sessão expirar (15min)
  - Validar: Após expiração, requisição falha
  - Validar: Refresh token usado automaticamente
  - Validar: Nova requisição funciona com novo token

**✅ Sucesso**: Autenticação e autorização funcionam

---

### 6. CAIXA - FLUXO FINANCEIRO

**Tempo estimado**: 7 minutos

#### 6.1 Abertura de Caixa
- [ ] **Passo 1**: Admin abre caixa
  - URL: `/admin/caixa`
  - Clicar "Abrir Caixa"
  - Informar valor inicial: R$ 200
  - Validar: Status muda para "Aberto"
  - Validar: Registro criado no banco

#### 6.2 Movimentações
- [ ] **Passo 2**: Realizar vendas (pedidos)
  - Criar 3 pedidos:
    - Pedido 1: R$ 50 (Crédito)
    - Pedido 2: R$ 100 (Dinheiro)
    - Pedido 3: R$ 75 (PIX)
  - Validar: Movimentações aparecem no caixa em tempo real

- [ ] **Passo 3**: Sangria
  - Ação: "Retirar Dinheiro"
  - Valor: R$ 100
  - Motivo: "Troco para operação"
  - Validar: Saldo diminui em R$ 100
  - Validar: Movimento registrado com tipo "sangria"

- [ ] **Passo 4**: Suprimento
  - Ação: "Adicionar Dinheiro"
  - Valor: R$ 50
  - Motivo: "Reforço de troco"
  - Validar: Saldo aumenta em R$ 50
  - Validar: Movimento registrado com tipo "suprimento"

#### 6.3 Fechamento de Caixa
- [ ] **Passo 5**: Fechar caixa
  - Clicar "Fechar Caixa"
  - Validar: Mostra resumo:
    - Valor inicial: R$ 200
    - Entradas: R$ 225 (vendas + suprimento)
    - Saídas: R$ 100 (sangria)
    - Saldo esperado: R$ 325
  - Informar valor contado: R$ 325
  - Validar: Diferença = R$ 0 (sem divergência)
  - Confirmar fechamento
  - Validar: Status muda para "Fechado"
  - Validar: Relatório gerado

- [ ] **Passo 6**: Divergência no fechamento
  - Abrir novo caixa
  - Realizar vendas
  - Fechar informando valor diferente
  - Validar: Mostra diferença (positiva/negativa)
  - Validar: Permite adicionar justificativa
  - Validar: Registra divergência no relatório

**✅ Sucesso**: Fluxo de caixa funciona corretamente

---

### 7. PERFORMANCE E RESPONSIVIDADE

**Tempo estimado**: 5 minutos

#### 7.1 Performance de Carregamento
- [ ] **Passo 1**: Medir tempo de carregamento inicial
  - Abrir DevTools → Network
  - Limpar cache
  - Recarregar `/`
  - Validar: First Contentful Paint < 1.5s
  - Validar: Time to Interactive < 3s
  - Validar: Largest Contentful Paint < 2.5s

- [ ] **Passo 2**: Lighthouse Score
  - Abrir DevTools → Lighthouse
  - Rodar audit (Mobile)
  - Validar: Performance > 80
  - Validar: Accessibility > 90
  - Validar: Best Practices > 90
  - Validar: SEO > 80

#### 7.2 Responsividade
- [ ] **Passo 3**: Testar breakpoints
  - Mobile (375px): Menu hamburger, cards verticais
  - Tablet (768px): Layout 2 colunas
  - Desktop (1920px): Layout completo

- [ ] **Passo 4**: Testar em dispositivos reais
  - iPhone: Safari
  - Android: Chrome
  - iPad: Safari
  - Desktop: Chrome, Firefox, Edge

#### 7.3 Performance de Listagens
- [ ] **Passo 5**: Carregar lista de produtos (>50 itens)
  - URL: `/menu`
  - Validar: Paginação ou scroll infinito
  - Validar: Imagens lazy loading
  - Validar: Não trava ao scrollar

- [ ] **Passo 6**: Carregar histórico de pedidos (>100)
  - URL: `/orders`
  - Validar: Paginação funciona
  - Validar: Busca filtra corretamente

**✅ Sucesso**: Performance e responsividade adequadas

---

## 🔍 TESTES EXPLORATÓRIOS

### Edge Cases para Testar

#### Pedidos
- [ ] Pedido com 0 itens (deve bloquear)
- [ ] Pedido com quantidade negativa (deve bloquear)
- [ ] Pedido com valor mínimo não atingido
- [ ] Pedido para mesa já ocupada
- [ ] Pedido com produto sem estoque
- [ ] Cancelar pedido em cada status
- [ ] Editar pedido após confirmação (deve bloquear)

#### Cashback
- [ ] Usar cashback maior que o disponível (deve limitar)
- [ ] Usar cashback em pedido menor que o cashback (deve funcionar)
- [ ] Cashback com valor negativo (deve bloquear)
- [ ] Progressão de tier exatamente no threshold
- [ ] Instagram bonus sem marcar opção (não deve aplicar)

#### Pagamento
- [ ] Split payment com divisão errada (soma ≠ total)
- [ ] Confirmar pagamento sem método selecionado
- [ ] Dinheiro sem informar troco
- [ ] Dinheiro com valor insuficiente (deve bloquear)
- [ ] Pagamento duplicado (deve bloquear)

#### Autenticação
- [ ] Token expirado (deve refresh automaticamente)
- [ ] Login simultâneo em 2 dispositivos
- [ ] Trocar senha (deve invalidar outros tokens)
- [ ] Reset de senha por email
- [ ] Login com email não verificado

#### Concorrência
- [ ] 2 atendentes confirmam o mesmo pagamento simultaneamente
- [ ] 2 cozinheiros aceitam o mesmo pedido simultaneamente
- [ ] Cliente edita carrinho enquanto checkout está aberto
- [ ] Admin fecha caixa enquanto pedido está sendo processado

---

## 📊 MÉTRICAS DE SUCESSO

### Critérios Obrigatórios (100%)
- ✅ Todos os 7 fluxos críticos passam sem erros
- ✅ Performance adequada (<2s por operação)
- ✅ Responsivo em todos os dispositivos
- ✅ Notificações funcionam em tempo real
- ✅ Dados salvos corretamente no banco
- ✅ Sem erros no console do navegador
- ✅ Sem erros no log do servidor

### Critérios Desejáveis (Bonus)
- 🎯 Lighthouse Score > 90 em todas as categorias
- 🎯 0 edge cases descobertos
- 🎯 Usuários conseguem completar fluxos sem ajuda
- 🎯 Nenhum bug crítico encontrado

---

## 📝 RELATÓRIO DE VALIDAÇÃO

### Template para Documentar Resultados

```markdown
## RELATÓRIO DE VALIDAÇÃO - [DATA]

**Testador**: [Nome]
**Ambiente**: [Staging/Production]
**Duração**: [Xh Ymin]

### Fluxos Testados
- [x] Fluxo 1: Pedido completo - ✅ PASSOU
- [x] Fluxo 2: Cashback - ✅ PASSOU
- [x] Fluxo 3: Split payment - ✅ PASSOU
- [x] Fluxo 4: Notificações - ⚠️ PASSOU com ressalvas
- [x] Fluxo 5: Autenticação - ✅ PASSOU
- [x] Fluxo 6: Caixa - ✅ PASSOU
- [x] Fluxo 7: Performance - ✅ PASSOU

### Bugs Encontrados
1. **[CRÍTICO/ALTO/MÉDIO/BAIXO]** - Descrição do bug
   - Passos para reproduzir
   - Comportamento esperado
   - Comportamento observado
   - Screenshot/Video

### Observações
- Lista de observações importantes
- Sugestões de melhoria
- Feedback geral

### Conclusão
- [ ] Sistema está pronto para produção
- [ ] Requer correções antes de produção
```

---

## 🚀 PRÓXIMOS PASSOS

### Após Validação
1. Documentar todos os bugs encontrados
2. Criar issues no GitHub para bugs críticos
3. Corrigir bugs P0/P1
4. Re-validar fluxos afetados
5. Atualizar Score D7 para 100%

### Atualização do Score
```
Antes: D7 = 95%
Após validação completa: D7 = 100%
Score Total: 86% → 87% (+1%)
```

---

**Criado por**: MANUS v7.1
**Data**: 2026-01-18
**Status**: ✅ PRONTO PARA EXECUTAR
**Tempo estimado**: 46 minutos (todos os fluxos)

**Recomendação**: Executar em staging primeiro, depois validar em production com testes não-destrutivos.
