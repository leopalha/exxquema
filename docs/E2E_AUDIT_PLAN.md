# 🔥 FLAME - AUDITORIA E2E COMPLETA
**Data**: 2025-12-05
**Objetivo**: Testar todos os fluxos do sistema end-to-end e garantir produção

---

## 📋 ESCOPO DA AUDITORIA

### 1. CREDENCIAIS DE PRODUÇÃO
- ✅ admin@flamelounge.com.br / admin123
- ✅ gerente@flamelounge.com.br / gerente123
- ✅ cozinha@flamelounge.com.br / cozinha123
- ✅ bar@flamelounge.com.br / bar123
- ✅ atendente@flamelounge.com.br / atendente123
- ✅ caixa@flamelounge.com.br / caixa123
- ✅ cliente@flamelounge.com.br / cliente123

### 2. PÁGINAS PÚBLICAS (Não Autenticadas)
- [ ] `/` - Homepage
  - [ ] Logo e branding
  - [ ] Botões CTA funcionais
  - [ ] Links de navegação
  - [ ] Responsividade mobile
  - [ ] Animações e transições
- [ ] `/login` - Login Cliente
  - [ ] Formulário de login
  - [ ] Validação de campos
  - [ ] Redirecionamento pós-login
- [ ] `/staff/login` - Login Staff
  - [ ] Formulário de login
  - [ ] Validação de campos
  - [ ] Redirecionamento por role
- [ ] `/cardapio` - Cardápio Público
  - [ ] Listagem de produtos MOCK
  - [ ] Categorias funcionais
  - [ ] Adicionar ao carrinho
  - [ ] Filtros e busca
- [ ] `/reservas` - Sistema de Reservas
  - [ ] Formulário de reserva
  - [ ] Validação de dados
  - [ ] Confirmação
- [ ] `/logos` - Página de Logos
  - [ ] Exibição de logos
  - [ ] Download funcional

### 3. ÁREA DO CLIENTE (role: cliente)
- [ ] `/perfil` - Perfil do Cliente
  - [ ] Dados pessoais
  - [ ] Histórico de pedidos
  - [ ] Cashback
  - [ ] Edição de perfil
- [ ] `/cashback` - Sistema de Cashback
  - [ ] Saldo atual
  - [ ] Histórico de ganhos
  - [ ] Histórico de uso
  - [ ] Tier de fidelidade
- [ ] `/checkout` - Finalizar Pedido
  - [ ] Carrinho de compras
  - [ ] Resumo do pedido
  - [ ] Aplicar cashback
  - [ ] Finalizar compra
- [ ] `/pedidos` - Meus Pedidos
  - [ ] Lista de pedidos
  - [ ] Status em tempo real
  - [ ] Detalhes do pedido

### 4. ÁREA ADMINISTRATIVA (role: admin)
- [ ] `/admin` - Dashboard Admin
  - [ ] KPIs e métricas
  - [ ] Gráficos
  - [ ] Resumo de vendas
- [ ] `/admin/products` - Gestão de Produtos
  - [ ] Listar produtos
  - [ ] Criar produto
  - [ ] Editar produto
  - [ ] Deletar produto
  - [ ] Upload de imagens
- [ ] `/admin/orders` - Gestão de Pedidos
  - [ ] Listar pedidos
  - [ ] Filtros por status
  - [ ] Atualizar status
  - [ ] Detalhes do pedido
- [ ] `/admin/estoque` - Gestão de Estoque
  - [ ] Visualizar estoque
  - [ ] Ajustar quantidades
  - [ ] Alertas de estoque baixo
- [ ] `/admin/clientes` - CRM
  - [ ] Listar clientes
  - [ ] Clientes inativos
  - [ ] Filtros por tier
  - [ ] Detalhes do cliente
  - [ ] Botão "Ligar para Cliente"
- [ ] `/admin/campanhas` - Marketing
  - [ ] Listar campanhas
  - [ ] Criar campanha
  - [ ] Editar campanha
  - [ ] Executar campanha
  - [ ] Estatísticas
- [ ] `/admin/reservas` - Gestão de Reservas
  - [ ] Listar reservas
  - [ ] Criar reserva
  - [ ] Confirmar/Cancelar
  - [ ] Calendário visual
- [ ] `/admin/settings` - Configurações
  - [ ] Configurações do sistema
  - [ ] Horários de funcionamento
  - [ ] Taxas e impostos

### 5. ÁREA DE GERÊNCIA (role: gerente)
- [ ] `/admin` - Dashboard Gerente
  - [ ] Métricas limitadas
  - [ ] Relatórios
- [ ] Acesso limitado a outras páginas admin

### 6. ÁREA DA COZINHA (role: cozinha)
- [ ] `/cozinha` - Painel da Cozinha
  - [ ] Pedidos pendentes
  - [ ] Atualizar status para "preparando"
  - [ ] Atualizar status para "pronto"
  - [ ] Notificações sonoras
  - [ ] Tempo de preparo

### 7. ÁREA DO BAR/NARGUILÉ (role: bar)
- [ ] `/staff/bar` - Painel do Bar
  - [ ] Pedidos de bebidas
  - [ ] Sessões de narguilé ativas
  - [ ] Criar sessão de narguilé
  - [ ] Trocar sabor
  - [ ] Encerrar sessão
  - [ ] Timer de carvão

### 8. ÁREA DE ATENDIMENTO (role: atendente)
- [ ] `/atendente` - Painel do Atendente
  - [ ] Mesas ativas
  - [ ] Criar pedido para mesa
  - [ ] Status dos pedidos
  - [ ] Entregar pedido

### 9. ÁREA DO CAIXA (role: caixa)
- [ ] `/staff/caixa` - PDV
  - [ ] Abrir caixa
  - [ ] Fechar conta de mesa
  - [ ] Processar pagamento
  - [ ] Aplicar desconto
  - [ ] Aplicar cashback
  - [ ] Fechar caixa
  - [ ] Relatório de fechamento

### 10. FUNCIONALIDADES TRANSVERSAIS
- [ ] **Autenticação**
  - [ ] Login funcional para todas roles
  - [ ] Logout funcional
  - [ ] Token JWT válido
  - [ ] Proteção de rotas
  - [ ] Redirecionamento correto
- [ ] **Navegação**
  - [ ] Header funcional
  - [ ] Bottom nav mobile funcional
  - [ ] Links corretos
  - [ ] Breadcrumbs
- [ ] **Carrinho de Compras**
  - [ ] Adicionar item
  - [ ] Remover item
  - [ ] Atualizar quantidade
  - [ ] Badge contador correto
  - [ ] Persistência
- [ ] **WebSocket/Real-time**
  - [ ] Notificações de novos pedidos
  - [ ] Atualização de status em tempo real
  - [ ] Reconexão automática
- [ ] **Tema**
  - [ ] Seletor de cores funcionando
  - [ ] Persistência do tema
  - [ ] Aplicação correta do gradiente

---

## 🔧 PROBLEMAS IDENTIFICADOS A CORRIGIR

### P1 - Badge do Carrinho (RELATADO)
- **Problema**: Mostra 1 item quando carrinho está vazio
- **Local**: `BottomNav.js` / `cartStore.js`
- **Status**: 🔴 PENDENTE

### P2 - Dados Mock vs Produção
- **Problema**: Remover dados de desenvolvimento
- **Ação**: Manter apenas mocks realistas
- **Status**: 🔴 PENDENTE

### P3 - Cardápio Mock
- **Problema**: Garantir produtos mock realistas conectados ao BD
- **Status**: 🔴 PENDENTE

---

## 📊 PLANO DE EXECUÇÃO

### FASE 1: Auditoria de Navegação e UI ✅
1. Verificar todas as páginas carregam
2. Verificar links e navegação
3. Verificar responsividade

### FASE 2: Auditoria de Autenticação ✅
1. Testar login de todos os usuários
2. Verificar redirecionamentos
3. Testar logout

### FASE 3: Auditoria de Funcionalidades Core 🔴
1. Fluxo de compra completo (cliente)
2. Fluxo de pedido (cozinha → atendente)
3. Fluxo de pagamento (caixa)
4. Sistema de reservas
5. Sistema de narguilé

### FASE 4: Auditoria Administrativa 🔴
1. CRUD de produtos
2. Gestão de pedidos
3. CRM e campanhas
4. Relatórios

### FASE 5: Correções e Melhorias 🔴
1. Corrigir problemas encontrados
2. Adicionar dados mock realistas
3. Remover dados de desenvolvimento
4. Testes finais

---

## 📝 CHECKLIST DE VALIDAÇÃO FINAL

- [ ] Nenhum console.error em produção
- [ ] Todos os botões funcionam
- [ ] Todos os formulários validam
- [ ] Todas as rotas protegidas funcionam
- [ ] Socket.io conecta e funciona
- [ ] Imagens carregam corretamente
- [ ] Performance aceitável (<3s load)
- [ ] Mobile responsivo
- [ ] Cross-browser compatível
- [ ] Acessibilidade básica (a11y)

---

**Status Geral**: 🟡 EM ANDAMENTO
**Última Atualização**: 2025-12-05 12:30 UTC

---

## 📈 PROGRESSO DA AUDITORIA

### ✅ CORREÇÕES APLICADAS (2025-12-05 12:45)

1. **Badge do Carrinho** ✅
   - Mudou nome do localStorage de `redlight-cart` para `flame-cart`
   - Limpou dados antigos que causavam badge errado
   - Status: CORRIGIDO

2. **Limpeza de Branding** ✅
   - Removidas todas as referências "Red Light" → "FLAME"
   - Frontend: 4 arquivos atualizados
   - Backend: 2 arquivos atualizados
   - Status: COMPLETO

3. **Deploy** ✅
   - Frontend: https://flame-3x4xg5hhp-leopalhas-projects.vercel.app
   - Backend: https://backend-production-28c3.up.railway.app
   - Status: ONLINE

### 🔄 PRÓXIMOS PASSOS

1. Testar login em produção com todas as credenciais
2. Testar fluxo de compra completo
3. Verificar mock de produtos
4. Testar painéis de cada role
5. Validar real-time features

