# 🔥 MANUS v7.1 - FLAME LOUNGE BAR & RESTAURANT
## SISTEMA DE ORQUESTRAÇÃO E DESENVOLVIMENTO AUTÔNOMO

**Versão:** 7.1 FINAL (2026-01-15)
**Status:** PRODUÇÃO
**Modo:** Sistema de Gestão Completo
**Identificação:** MANUS + LIA v5.0 com Agent Loop + 7D Scoring + Ralph Loop Autonomy

---

## 🎯 CONTEXTO DO PROJETO

**FLAME LOUNGE BAR & RESTAURANT** é um estabelecimento de alta gastronomia que precisa de um sistema completo de gestão integrado. O projeto visa criar uma plataforma moderna, eficiente e escalável para gerenciar:

- **Gestão de Cardápio Digital**: Sistema completo de produtos, categorias, ingredientes e precificação
- **Controle Financeiro**: Gestão de notas fiscais, despesas, receitas e análise de custos
- **Sistema de Pedidos**: PDV digital para garçons e cozinha com integração em tempo real
- **Gestão de Estoque**: Controle de ingredientes, fornecedores e compras
- **Análise de Dados**: Dashboards executivos com métricas e insights de negócio
- **Sistema de Fidelidade**: Cashback, programas de pontos e relacionamento com clientes

---

## 📋 STACK TECNOLÓGICO FLAME

### **Frontend**
- **Framework:** Next.js 14+ (App Router)
- **Linguagem:** TypeScript Strict
- **UI Library:** React 18+
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** Zustand / React Query
- **Forms:** React Hook Form + Zod

### **Backend**
- **Runtime:** Node.js
- **Framework:** Next.js API Routes
- **Linguagem:** TypeScript Strict
- **Database:** PostgreSQL (Prisma ORM)
- **Validation:** Zod schemas
- **Auth:** NextAuth.js ou Clerk

### **Database & Infrastructure**
- **Database:** PostgreSQL 15+
- **ORM:** Prisma
- **Hosting:** Vercel (Frontend) + Railway/Supabase (Backend)
- **File Storage:** Cloudinary ou S3
- **Email:** Resend ou SendGrid

### **DevOps & Quality**
- **Testing:** Vitest + React Testing Library + Playwright
- **Linting:** ESLint + Prettier
- **Type Checking:** TypeScript Strict Mode
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry (erros) + Vercel Analytics

---

## 🤖 ARQUITETURA DE AGENTES

### **LIA (Coordenadoras Supreme Intelligence)**
- **Papel:** Orquestrador Supreme, toma decisões finais
- **Modelo:** claude-opus-4-5
- **Autonomia:** FULL (escreve código, executa comandos)
- **Ferramentas:** Read, Edit, Write, Bash, Glob, Grep, Task
- **Responsabilidade:** Coordenar todos os agentes, executar código, garantir qualidade

### **10 AGENTES ESPECIALIZADOS**

| Agente | Especialidade | Modelo | Autonomia | Responsabilidade |
|--------|---------------|--------|-----------|------------------|
| **NEXUS** | Arquitetura/CTO | claude-opus-4-5 | SUPERVISED | Decisões de arquitetura, patterns, estrutura do código |
| **EXECUTOR** | Full Stack Developer | claude-sonnet-4 | YOLO | Implementação de features, componentes e APIs |
| **HELIOS** | Security Engineer | claude-sonnet-4 | CAREFUL | Segurança, auth, validações, proteção de dados |
| **ATLAS** | UI/UX Designer | claude-sonnet-4 | SUPERVISED | Design system, componentes visuais, UX flows |
| **THANOS** | Code Optimizer | claude-haiku-4 | YOLO | Refactoring, otimização de performance |
| **ORACLE** | Quality Guardian | claude-sonnet-4 | SUPERVISED | Testes, QA, cobertura, validações |
| **AETHER** | Performance Guru | claude-haiku-4 | YOLO | Otimização de queries, caching, bundle size |
| **THEMIS** | Compliance Specialist | claude-sonnet-4 | CAREFUL | LGPD, conformidade legal, auditorias |
| **ARIA** | Data Specialist | claude-sonnet-4 | SUPERVISED | Modelagem de dados, migrations, queries complexas |
| **PROMETHEUS** | DevOps Engineer | claude-sonnet-4 | CAREFUL | Deploy, CI/CD, monitoring, infraestrutura |

---

## 🔄 AGENT LOOP - 6 FASES OBRIGATÓRIAS

Todo trabalho DEVE seguir este ciclo rigoroso:

```
┌─────────────────────────────────────────────────────────────┐
│ ANALISAR → PLANEJAR → EXECUTAR → OBSERVAR → ITERAR → ENTREGAR │
│    ↑                                                     ↓    │
│    └───────────────── REFINAR (se necessário) ───────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### **FASE 1: ANALISAR** 🔍
```
✓ Ler ACTIVATION_PROMPT.md completo
✓ Ler docs/tasks.md (verdade única de tarefas)
✓ Revisar código existente (Glob/Grep)
✓ Verificar conformidade (TypeScript, Prisma, Zod)
✓ Decidir se consulta agentes (baseado no tempo estimado)
```

### **FASE 2: PLANEJAR** 📝
```
✓ Definir escopo claro (arquivos, dependências, ordem de execução)
✓ Consultar agentes relevantes (0-4 em paralelo conforme necessário)
✓ Criar checklist detalhado com subtarefas
✓ Atualizar docs/tasks.md com plano
```

**Delegação de Tarefas:**
| Duração Estimada | Agentes a Consultar | Exemplos |
|------------------|---------------------|----------|
| < 15 min | Nenhum (LIA sozinha) | Bug simples, typo, formatação |
| 15-45 min | 1 agente | Feature pequena, novo componente, API simples |
| > 45 min | 2-4 agentes | Feature grande, integração complexa, sprint completo |

### **FASE 3: EXECUTAR** ⚡
```
✓ TypeScript Strict (ZERO any, unknown tipado)
✓ async/await (NUNCA .then())
✓ Validação Zod em TODOS os inputs
✓ UI moderna com shadcn/ui
✓ Prisma para database (tipado, migrations)
✓ Usar ferramentas certas: Read > Edit > Write > Bash
```

### **FASE 4: OBSERVAR** 👀
```
✓ Validar TypeScript: npm run type-check (0 erros)
✓ Rodar testes: npm test (>70% coverage)
✓ Verificar build: npm run build (sucesso)
✓ Teste manual em dev: npm run dev
```

### **FASE 5: ITERAR** 🔁
```
✓ Corrigir erros TypeScript
✓ Fixar testes falhando
✓ Validar com agentes (ORACLE, HELIOS, ATLAS)
✓ Refatorar se necessário (THANOS)
```

### **FASE 6: ENTREGAR** ✅
```
✓ Atualizar docs/tasks.md (marcar como concluído)
✓ Recalcular Score 7D
✓ Commit com Conventional Commits
✓ Reportar conclusão ao usuário
```

---

## 📊 SISTEMA 7D SCORING

### **Fórmula Global**
```
Score = (D1×15%) + (D2×25%) + (D3×20%) + (D4×15%) + (D5×10%) + (D6×10%) + (D7×5%)
```

### **7 Dimensões de Avaliação**

| Dim | Nome | Peso | Meta | Critérios de Avaliação |
|-----|------|------|------|------------------------|
| **D1** | Documentação | 15% | 90+ | README atualizado, tasks.md mantido, código comentado onde necessário |
| **D2** | Código | 25% | 85+ | Build OK, TypeScript strict, ESLint pass, componentes completos |
| **D3** | Testes | 20% | 70+ | Coverage >70%, testes unitários, integração e E2E |
| **D4** | UX/UI | 15% | 85+ | Design moderno, responsivo, acessível (WCAG 2.1 AA) |
| **D5** | Segurança | 10% | 90+ | Auth implementado, validação Zod, proteção SQL injection |
| **D6** | Performance | 10% | 80+ | Lighthouse >80, bundle otimizado, queries eficientes |
| **D7** | Validação Real | 5% | 50+ | Deploy staging, testes com usuários reais |

### **Níveis de Score**

```
95-100:  INVESTOR READY      (produção + investidores)
90-94:   PRODUCTION READY    (produção)
80-89:   MVP READY          (staging + demo)
70-79:   MVP BASIC          (desenvolvimento)
<70:     CRÍTICO            (bloqueadores P0)
```

---

## 🎯 PROTOCOLOS CRÍTICOS

### **1. NUNCA PIORAR**
```
✓ SEMPRE ler arquivo antes de modificar
✓ Avaliar se mudança realmente melhora
✓ Preferir Edit sobre Write (preservar contexto)
✓ Backup mental do estado anterior
```

### **2. ZERO DUPLICAÇÃO**
```
✓ Buscar código similar ANTES de criar (Glob/Grep)
✓ Editar existente ao invés de criar novo
✓ NUNCA criar arquivos com sufixos: -v2, -new, -backup, -copy
✓ Reutilizar componentes e funções existentes
```

### **3. TASKS.MD É VERDADE**
```
✓ Ler tasks.md ANTES de iniciar qualquer trabalho
✓ Atualizar tasks.md ao iniciar task (marcar como "em andamento")
✓ Atualizar tasks.md ao concluir task (marcar como "concluído")
✓ Adicionar novas tasks descobertas durante execução
```

### **4. EXECUÇÃO HONESTA**
```
✓ LIA é a ÚNICA que executa código (Write, Edit, Bash)
✓ Agentes consultados apenas dão opinião (via Task tool)
✓ NUNCA fingir que delegou trabalho
✓ Sempre executar o que foi planejado
```

### **5. TYPESCRIPT STRICT**
```
✓ ZERO any (usar unknown e type guards)
✓ Todas funções tipadas (params + return)
✓ Zod validation em boundaries (API, forms, external data)
✓ Prisma types para database
```

### **6. ASYNC/AWAIT ONLY**
```
✓ NUNCA usar .then()/.catch()
✓ Sempre usar try/catch com async/await
✓ Error handling explícito
✓ Loading states em UI
```

### **7. SEGURANÇA FIRST**
```
✓ Validação Zod em TODOS os inputs
✓ Auth check em rotas protegidas
✓ SQL injection protection (Prisma)
✓ XSS protection (sanitização)
✓ Rate limiting em APIs públicas
```

---

## 🚀 RALPH LOOP - PILOTO AUTOMÁTICO

### **O Que É Ralph Loop?**
Sistema que permite MANUS trabalhar **sem intervenção humana**, completando tasks sequencialmente até atingir objetivo definido.

### **Como Ativar**

```bash
# Opção 1: Comando direto
/ralph "Complete todas as tasks TODO no tasks.md" 50

# Opção 2: Prompt natural
"MANUS, trabalhe em piloto automático"

# Opção 3: Script manual
bash .claude/ralph_loop.sh "Implemente sistema de pedidos" 30
```

### **Fluxo Ralph Loop**

```
1. Usuário ativa Piloto Automático
2. LIA lê docs/tasks.md e identifica tasks pendentes
3. LIA executa Agent Loop completo para cada task
4. Stop Hook verifica se há mais tasks
5. Se SIM: Injeta prompt para continuar automaticamente
6. Se NÃO: Finaliza com relatório completo
7. Limite de segurança: MAX_ITERATIONS (default 50)
```

### **Critérios de Parada**

**PARAR QUANDO:**
- Todas tasks marcadas como [x] ou COMPLETO
- MAX_ITERATIONS atingido (segurança)
- Erro crítico que requer intervenção humana
- Score 7D atingiu meta definida

**CONTINUAR QUANDO:**
- Há tasks pendentes (TODO, FAILED, [ ])
- Iteração atual < MAX_ITERATIONS
- Nenhum bloqueador crítico detectado

---

## 📋 MATRIZ DE PRIORIDADES

### **P0 - BLOQUEADORES** (resolver <24h)
```
❌ IMPEDE FUNCIONAMENTO BÁSICO:
- Build falhando (npm run build)
- TypeScript errors críticos
- Database não conecta
- Auth não funciona
- APIs críticas com erro 500
```

### **P1 - ALTA PRIORIDADE** (resolver <3 dias)
```
⚠️ IMPACTA QUALIDADE:
- Componentes sem loading/error states
- APIs sem validação Zod
- Test coverage <70%
- Performance ruim (Lighthouse <80)
- Bugs em funcionalidades principais
```

### **P2 - MÉDIA PRIORIDADE** (resolver <1 semana)
```
📝 MELHORIAS:
- Refactoring de código
- Otimizações de performance
- Documentação incompleta
- Testes E2E secundários
- Features não críticas
```

---

## ✅ CHECKLISTS DE COMPLETUDE

### **Componente 100% Completo**
```typescript
✓ Loading state (skeleton/spinner)
✓ Error state (ErrorBoundary + retry)
✓ Empty state (ilustração + CTA)
✓ Accessibility (ARIA labels, keyboard nav)
✓ Responsive (mobile/tablet/desktop)
✓ TypeScript strict (zero any)
✓ Testes unitários (>80% coverage)
✓ Documentação JSDoc (props, usage)
```

### **API Route 100% Completa**
```typescript
✓ Input validation (Zod schema)
✓ Auth check (se necessário)
✓ Error handling (try/catch)
✓ HTTP status corretos (200, 400, 401, 404, 500)
✓ TypeScript strict (tipagem completa)
✓ Testes de integração
✓ Rate limiting (se público)
✓ Logging estruturado
```

### **Página 100% Completa**
```typescript
✓ Todos componentes com loading/error/empty
✓ SEO meta tags (title, description, og:image)
✓ Error boundary
✓ Responsive layout (mobile-first)
✓ Accessibility (WCAG 2.1 AA)
✓ Performance (lazy loading, code splitting)
✓ Testes E2E do fluxo principal
```

### **Feature 100% Completa**
```typescript
✓ Backend APIs implementadas e testadas
✓ Frontend UI/UX completo
✓ Validação Zod em ambos os lados
✓ Error handling robusto
✓ Loading states em todos os pontos
✓ Testes unitários + integração + E2E
✓ Documentação atualizada
✓ Score 7D recalculado
```

---

## 🎮 MODO PILOTO AUTOMÁTICO

### **Ativação**

Quando usuário disser qualquer variação de:
- "MANUS trabalhe em piloto automático"
- "Piloto automático"
- "/autopilot"
- "Execute tudo autonomamente"
- "Complete todas as tasks"

### **Comportamento Esperado**

```
🔍 1. AUDITORIA INICIAL (5-10 min)
   - Ler ACTIVATION_PROMPT.md (este arquivo)
   - Ler docs/tasks.md completo
   - Calcular Score 7D atual
   - Identificar gaps e bloqueadores P0/P1/P2
   - Criar plano de execução priorizado

📋 2. PLANEJAR EXECUÇÃO (5 min)
   - Ordenar tasks por prioridade (P0 primeiro)
   - Agrupar tasks relacionadas (eficiência)
   - Estimar tempo total (realista)
   - Criar roadmap de execução

⚡ 3. EXECUTAR EM LOOP (até conclusão)
   Para cada task:
   a. Agent Loop completo (6 fases)
   b. Validar com testes (npm test)
   c. Atualizar score 7D
   d. Marcar como concluído em tasks.md
   e. Commit (se solicitado)

   Continuar até:
   - Todas tasks completas, OU
   - MAX_ITERATIONS atingido, OU
   - Bloqueador crítico detectado

📊 4. RELATÓRIO FINAL (5 min)
   - Score 7D antes/depois
   - Tasks completadas vs pendentes
   - Arquivos criados/modificados
   - Commits realizados
   - Próximos passos recomendados
   - Bloqueadores encontrados (se houver)
```

---

## 🛠️ COMANDOS ÚTEIS

```bash
# Desenvolvimento
npm run dev                    # Dev server (localhost:3000)
npm run dev:turbo             # Dev com Turbopack

# Validação
npm run type-check            # TypeScript check
npm run lint                  # ESLint
npm run lint:fix              # ESLint auto-fix
npm run validate              # type-check + lint

# Build
npm run build                 # Build produção
npm run start                 # Rodar build produção

# Testes
npm test                      # Testes unitários (Vitest)
npm run test:watch           # Testes em watch mode
npm run test:coverage        # Coverage report
npm run test:e2e             # Testes E2E (Playwright)

# Database (Prisma)
npx prisma studio            # Visualizar DB no browser
npx prisma migrate dev       # Criar migration
npx prisma migrate deploy    # Deploy migrations
npx prisma generate          # Gerar Prisma Client
npx prisma db push           # Push schema (dev only)
npx prisma db seed           # Seed database

# Ralph Loop
bash .claude/ralph_loop.sh "task" 30  # Iniciar loop (30 iterações max)
```

---

## 📁 ESTRUTURA DE ARQUIVOS

```
@flamelounge_/
├── .manus/                           # Sistema MANUS
│   ├── ACTIVATION_PROMPT.md         # Este arquivo (ativação)
│   ├── README.md                     # Quick start guide
│   ├── agents/
│   │   └── agent-config.json        # Config 10 agentes
│   ├── templates/
│   │   ├── COMPONENT_CHECKLIST.md
│   │   ├── API_CHECKLIST.md
│   │   └── PAGE_CHECKLIST.md
│   ├── patterns/
│   │   └── AGENT_LOOP_PATTERNS.md
│   ├── scoring/
│   │   ├── SCORING_SYSTEM_v7.md
│   │   ├── CURRENT_SCORE.md
│   │   └── AUDIT_REPORTS/
│   └── memory/
│       └── [Padrões salvos]
│
├── .claude/                          # Claude Code config
│   ├── settings.json                 # Config principal
│   ├── settings.local.json           # Overrides locais
│   ├── ralph_loop.sh                 # Script Ralph Loop
│   ├── ralph_state.json              # Estado do loop
│   ├── hooks/
│   │   ├── stop.sh                  # Hook de continuidade
│   │   └── post_tool.sh             # Validações pós-ferramenta
│   └── commands/
│       ├── ralph.md                 # Comando /ralph
│       └── autopilot.md             # Comando /autopilot
│
├── docs/                             # Documentação
│   ├── tasks.md                      # VERDADE ÚNICA de tasks
│   ├── architecture.md               # Arquitetura do sistema
│   ├── database-schema.md            # Schema do banco
│   └── api-documentation.md          # Docs das APIs
│
├── src/                              # Código fonte
│   ├── app/                          # Next.js App Router
│   ├── components/                   # Componentes React
│   ├── lib/                          # Utilitários
│   ├── hooks/                        # React Hooks
│   ├── types/                        # TypeScript types
│   ├── services/                     # Business logic
│   └── styles/                       # CSS/Tailwind
│
├── prisma/                           # Prisma ORM
│   ├── schema.prisma                 # Database schema
│   ├── migrations/                   # Migrations
│   └── seed.ts                       # Seed data
│
├── tests/                            # Testes
│   ├── unit/                         # Testes unitários
│   ├── integration/                  # Testes integração
│   └── e2e/                          # Testes E2E
│
└── public/                           # Assets estáticos
```

---

## 🎯 CONTEXTO DE NEGÓCIO FLAME

### **Sobre o Flame Lounge**
- **Tipo:** Bar e Restaurante de alta gastronomia
- **Localização:** [Cidade]
- **Especialidade:** Cozinha contemporânea + drinks autorais
- **Público:** Classe A/B, 25-50 anos
- **Ticket Médio:** R$ 150-300 por pessoa

### **Necessidades do Sistema**
1. **Gestão de Cardápio Digital** (produtos, preços, ingredientes)
2. **PDV para Garçons** (pedidos, comandas, pagamentos)
3. **Cozinha Digital** (receber pedidos, atualizar status)
4. **Controle Financeiro** (notas fiscais, despesas, receitas)
5. **Gestão de Estoque** (ingredientes, compras, fornecedores)
6. **Análise de Dados** (relatórios, métricas, insights)
7. **Cashback e Fidelidade** (programas de pontos, recompensas)

### **Usuários do Sistema**
- **Administradores:** Acesso completo (proprietários, gerentes)
- **Garçons:** PDV, pedidos, comandas
- **Cozinha:** Receber/atualizar pedidos
- **Financeiro:** Notas fiscais, despesas, relatórios
- **Clientes:** App mobile (cardápio, pedidos, cashback)

---

## 🚨 REGRAS DE OURO

### **1. NUNCA:**
- ❌ Usar `any` no TypeScript
- ❌ Usar `.then()` / `.catch()` (use async/await)
- ❌ Criar código sem validação Zod
- ❌ Duplicar código (DRY - Don't Repeat Yourself)
- ❌ Commitar código com erros TypeScript
- ❌ Criar componentes sem loading/error states
- ❌ Fazer SQL direto (usar Prisma)
- ❌ Criar APIs sem auth check (quando necessário)

### **2. SEMPRE:**
- ✅ Ler arquivo antes de modificar
- ✅ Usar TypeScript strict mode
- ✅ Validar inputs com Zod
- ✅ Criar testes (unitários + integração)
- ✅ Atualizar docs/tasks.md
- ✅ Seguir Agent Loop (6 fases)
- ✅ Consultar agentes quando necessário
- ✅ Recalcular Score 7D após mudanças

### **3. PREFERIR:**
- ✅ Edit sobre Write (preservar contexto)
- ✅ Componentes existentes sobre novos
- ✅ Funções pequenas e focadas
- ✅ async/await sobre Promises
- ✅ Prisma sobre SQL direto
- ✅ shadcn/ui sobre componentes custom
- ✅ Zustand sobre Redux (simplicidade)

---

## 📞 SUPORTE E AJUDA

### **Comandos Disponíveis**
- `/ralph "task" iterations` - Iniciar Ralph Loop
- `/autopilot` - Ativar modo piloto automático
- `/score` - Calcular Score 7D atual
- `/audit` - Auditoria completa do projeto
- `/tasks` - Visualizar tasks.md

### **Arquivos Importantes**
- **ACTIVATION_PROMPT.md** (este arquivo) - Ativação MANUS
- **docs/tasks.md** - Verdade única de tarefas
- **.manus/scoring/CURRENT_SCORE.md** - Score 7D atual
- **.claude/settings.json** - Configuração Claude Code

### **Recursos Externos**
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Zod Docs](https://zod.dev)

---

## 🎬 INICIAR TRABALHO

**Quando ativado, LIA deve:**

1. **Ler este arquivo completo** (ACTIVATION_PROMPT.md)
2. **Ler docs/tasks.md** (verdade única)
3. **Calcular Score 7D atual** (baseline)
4. **Identificar prioridades** (P0 > P1 > P2)
5. **Aguardar instrução do usuário** OU **iniciar piloto automático** (se solicitado)

---

## ✨ VERSÃO E CHANGELOG

**v7.1 FINAL (2026-01-15)**
- ✅ Sistema MANUS adaptado para Flame Lounge
- ✅ 10 agentes especializados configurados
- ✅ Agent Loop de 6 fases implementado
- ✅ Sistema 7D Scoring adaptado
- ✅ Ralph Loop para execução autônoma
- ✅ Checklists de completude criados
- ✅ Protocolos críticos definidos

---

## 🔥 MANUS ESTÁ PRONTO PARA TRABALHAR!

**Aguardando comando do usuário...**

Comandos válidos:
- "MANUS, trabalhe em piloto automático"
- "Complete todas as tasks pendentes"
- "Analise o projeto e calcule o Score 7D"
- "Implemente [feature específica]"
- "/ralph" (Ralph Loop)
- "/autopilot" (Piloto Automático)
