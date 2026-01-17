# 📚 Índice de Documentação - FLAME Lounge

**Última atualização**: 2026-01-17
**Versão**: 1.0

---

## 🎯 Início Rápido

### Para Desenvolvedores
1. 📄 [STATUS.md](../STATUS.md) - Status atual do projeto
2. 📄 [MANUS_TASKS.md](MANUS_TASKS.md) - Tasks e progresso
3. 📄 [REFACTORING_GUIDE.md](REFACTORING_GUIDE.md) - Como migrar código

### Para Stakeholders
1. 📄 [RESUMO_SESSAO_P1.md](../RESUMO_SESSAO_P1.md) - Resumo executivo
2. 📄 [METRICAS_IMPACTO.md](../METRICAS_IMPACTO.md) - ROI e métricas
3. 📄 [STATUS.md](../STATUS.md) - Status geral

---

## 📖 Documentação por Categoria

### 🎯 Gestão de Projeto

#### MANUS_TASKS.md
**Descrição**: Single Source of Truth para todas as tasks
**Conteúdo**:
- Score 7D atualizado (78.4%)
- Tasks P0, P1, P2 completas
- Progresso detalhado
- Próximos passos

**Quando usar**: Para entender o que foi feito e o que falta fazer

---

#### STATUS.md
**Descrição**: Status consolidado do projeto
**Conteúdo**:
- Score 7D atual
- Progresso visual de tasks
- Próximas ações (esta semana, próximas 2 semanas)
- Itens de atenção

**Quando usar**: Para check rápido do status atual

---

### 📊 Métricas e Análise

#### METRICAS_IMPACTO.md
**Descrição**: Análise detalhada de métricas e impacto
**Conteúdo**:
- Evolução Score 7D
- Análise por dimensão
- Métricas de código
- ROI e projeções futuras

**Quando usar**: Para apresentar resultados e justificar decisões

---

#### RESUMO_SESSAO_P1.md
**Descrição**: Resumo executivo da sessão P1
**Conteúdo**:
- Objetivos vs resultados
- Entregáveis criados
- Descobertas importantes
- Aprendizados e recomendações

**Quando usar**: Para apresentação a stakeholders e onboarding

---

### 🔧 Guias Técnicos

#### REFACTORING_GUIDE.md
**Descrição**: Plano detalhado de refatoração
**Conteúdo**:
- Plano de migração (4 fases)
- Checklist completa
- Timeline de 3 dias
- Cuidados e riscos

**Quando usar**: Antes de executar migração para shared modules

---

#### GOOGLE_OAUTH_SETUP.md
**Descrição**: Configuração do Google OAuth passo a passo
**Conteúdo**:
- Como criar projeto no Google Cloud
- Gerar credenciais OAuth 2.0
- Configurar variáveis de ambiente
- Troubleshooting

**Quando usar**: Para habilitar login com Google

---

### 🏗️ Arquitetura

#### architecture.md
**Descrição**: Arquitetura geral do sistema
**Conteúdo**:
- Stack tecnológico
- Diagramas de alto nível
- Decisões arquiteturais

**Quando usar**: Para entender a estrutura geral do projeto

---

#### database-schema.md
**Descrição**: Schema completo do banco de dados
**Conteúdo**:
- 22 models documentados
- Relacionamentos
- ERD diagrams
- Queries comuns

**Quando usar**: Para entender estrutura de dados

---

### 📋 Product Requirements

#### 03_PRD.md
**Descrição**: Product Requirements Document
**Conteúdo**:
- Features implementadas
- Sprints históricos
- Roadmap

**Quando usar**: Para entender funcionalidades e histórico

⚠️ **Status**: Pendente atualização (P1-8)

---

## 🔧 Código Fonte

### Backend - Shared Modules

#### backend/src/shared/validators.js
**Descrição**: Validações centralizadas
**Funções**:
- validateCPF(), formatCPF(), cleanCPF()
- validateEmail()
- validatePhone(), formatPhone(), cleanPhone()
- validateCEP(), formatCEP()
- validateCNPJ(), formatCNPJ()

**Quando usar**: Para validar inputs em controllers/models

---

#### backend/src/shared/constants.js
**Descrição**: Constantes compartilhadas
**Conteúdo**:
- ORDER_STATUS, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS
- PAYMENT_METHODS, PAYMENT_METHOD_DETAILS
- CONSUMPTION_TYPES
- CASHBACK_RATES, TIER_THRESHOLDS
- SERVICE_FEE, DELIVERY_FEE
- REGEX patterns

**Quando usar**: Para garantir consistência de valores

---

#### backend/src/shared/cashbackCalculator.js
**Descrição**: Cálculos de cashback centralizados
**Funções**:
- calculateTierFromSpent()
- getCashbackRate()
- calculateCashbackByTier()
- calculateInstagramCashback()
- calculateTotalCashback()
- calculateProgressToNextTier()
- getTierBenefits()

**Quando usar**: Para calcular cashback em pedidos

---

### Frontend - Components

#### ProductCard.js
**Modificações**:
- Loading state `isAddingToCart`
- Spinner animado
- Error handling com try-catch

**Quando usar**: Card de produto no cardápio

---

#### OrderCard.js + OrderCardSkeleton
**Modificações**:
- Component `OrderCardSkeleton` exportado
- Skeleton loading com animate-pulse

**Quando usar**: Lista de pedidos com loading

---

### Frontend - Stores

#### cartStore.js
**Modificações**:
- Error state adicionado
- Validações robustas em `addItem()`
- Função `clearError()`

**Quando usar**: Gerenciar carrinho de compras

---

#### orderStore.js
**Modificações**:
- Error state adicionado
- Tratamento de erro em `fetchOrders()`
- Toast user-friendly

**Quando usar**: Gerenciar pedidos

---

### Backend - Controllers

#### orderController.js
**Modificações**:
- Transaction com sequelize (linhas 182-265)
- Atomicidade garantida
- Rollback automático

**Quando usar**: Criar/atualizar pedidos

---

#### splitPaymentController.js
**Modificações**:
- Split by_items implementado (linhas 121-226)
- Validações de itens
- Cálculo proporcional

**Quando usar**: Dividir conta entre pessoas

---

## 📊 Diagramas e Fluxos

### Score 7D Evolution
```
70.25% → 73% → 74.5% → 76.8% → 78.4%
```

### Task Progress
```
P0: ███████████████████████████████████ 100% (3/3)
P1: ████████████████████░░░░░░░ 62.5% (5/8)
P2: ░░░░░░░░░░░░░░░░░░░░░░░░░░░   0% (0/10)
```

---

## 🔍 Como Encontrar o que Preciso?

### "Quero saber o status atual"
👉 [STATUS.md](../STATUS.md)

### "Quero ver o que foi feito"
👉 [RESUMO_SESSAO_P1.md](../RESUMO_SESSAO_P1.md)

### "Quero métricas e ROI"
👉 [METRICAS_IMPACTO.md](../METRICAS_IMPACTO.md)

### "Quero executar a migração"
👉 [REFACTORING_GUIDE.md](REFACTORING_GUIDE.md)

### "Quero configurar Google OAuth"
👉 [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md)

### "Quero entender tasks e prioridades"
👉 [MANUS_TASKS.md](MANUS_TASKS.md)

### "Quero entender a arquitetura"
👉 [architecture.md](architecture.md)

### "Quero ver o schema do banco"
👉 [database-schema.md](database-schema.md)

### "Quero usar funções de validação"
👉 [backend/src/shared/validators.js](../backend/src/shared/validators.js)

### "Quero usar constantes"
👉 [backend/src/shared/constants.js](../backend/src/shared/constants.js)

### "Quero calcular cashback"
👉 [backend/src/shared/cashbackCalculator.js](../backend/src/shared/cashbackCalculator.js)

---

## 🎓 Glossário

### MANUS v7.1
Sistema de gestão de projeto com Score 7D

### Score 7D
Métrica de qualidade em 7 dimensões:
1. Documentação
2. Código
3. Testes
4. UX/UI
5. Segurança
6. Performance
7. Validação Real

### P0, P1, P2
- **P0**: Bloqueadores críticos (resolver <24h)
- **P1**: Alta prioridade (resolver <3 dias)
- **P2**: Média prioridade (resolver <1 semana)

### Shared Modules
Arquivos centralizados para evitar duplicação:
- validators.js
- constants.js
- cashbackCalculator.js

### Single Source of Truth (SSOT)
Um único local autoritativo para cada informação

---

## 📞 Suporte

### Dúvidas Técnicas
- Consultar MANUS_TASKS.md
- Revisar guias técnicos
- Ver código nos shared modules

### Dúvidas de Negócio
- Consultar RESUMO_SESSAO_P1.md
- Revisar METRICAS_IMPACTO.md
- Ver STATUS.md

### Issues Conhecidos
- ⚠️ CASHBACK_RATES inconsistente (ver REFACTORING_GUIDE.md)
- ⚠️ Google OAuth não configurado (ver GOOGLE_OAUTH_SETUP.md)
- ⚠️ Migração shared pendente (ver REFACTORING_GUIDE.md)

---

## 🔄 Histórico de Atualizações

### 2026-01-17 v1.0
- ✅ Sessão P1 completa (5/8 tasks)
- ✅ Score 7D: 78.4% (+8.15%)
- ✅ Shared modules criados
- ✅ Documentação completa
- ✅ 11 arquivos processados

---

## 🎯 Próxima Atualização

**Quando**: Após conclusão de P1-6, P1-7, P1-8
**Previsão**: 2 semanas
**Score esperado**: 82% (ÓTIMO)

---

**Mantido por**: MANUS v7.1
**Última revisão**: 2026-01-17 16:45
