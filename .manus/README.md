# 🔥 MANUS v7.1 - FLAME LOUNGE

**Sistema de Orquestração e Desenvolvimento Autônomo**

---

## 📌 O QUE É MANUS?

MANUS (Multi-Agent Unified System) é um sistema de orquestração inteligente que gerencia o desenvolvimento do projeto Flame Lounge através de:

- **10 Agentes Especializados** coordenados por LIA (Orquestrador Supreme)
- **Agent Loop de 6 Fases** (Analisar, Planejar, Executar, Observar, Iterar, Entregar)
- **Sistema 7D Scoring** para medir qualidade e prontidão
- **Ralph Loop** para execução autônoma de múltiplas tasks
- **Checklists e Templates** para garantir completude

---

## 🚀 QUICK START

### Ativar MANUS

```bash
# Dizer ao Claude Code
"MANUS, estou pronto para começar"
```

O sistema vai:
1. Ler `.manus/ACTIVATION_PROMPT.md`
2. Carregar configurações de `.claude/settings.json`
3. Ler tasks de `docs/MANUS_TASKS.md`
4. Aguardar sua instrução

### Comandos Comuns

```bash
# Auditoria e Score
"MANUS, faça auditoria completa e calcule Score 7D"

# Piloto Automático
"MANUS, trabalhe em piloto automático"
"MANUS, complete todas as tasks P0"

# Ralph Loop
bash .claude/ralph_loop.sh "Complete auditoria inicial" 20

# Task específica
"MANUS, implemente sistema de pedidos"

# Score
"MANUS, recalcule o Score 7D"
```

---

## 📁 ESTRUTURA DE ARQUIVOS

```
.manus/
├── ACTIVATION_PROMPT.md       # 🎯 Prompt de ativação principal
├── README.md                  # 📖 Este arquivo
├── agents/
│   └── agent-config.json      # 🤖 Configuração dos 10 agentes
├── templates/
│   ├── COMPONENT_CHECKLIST.md # ✅ Checklist de componentes
│   ├── API_CHECKLIST.md       # ✅ Checklist de APIs
│   └── PAGE_CHECKLIST.md      # ✅ Checklist de páginas
├── patterns/
│   └── AGENT_LOOP_PATTERNS.md # 📚 Padrões de execução
├── scoring/
│   ├── SCORING_SYSTEM_v7.md   # 📊 Sistema 7D detalhado
│   ├── CURRENT_SCORE.md       # 🎯 Score atual
│   └── AUDIT_REPORTS/         # 📋 Relatórios de auditoria
└── memory/
    └── [padrões salvos]       # 💾 Memória do sistema

.claude/
├── settings.json              # ⚙️  Configurações principais
├── settings.local.json        # 🔧 Overrides locais
├── ralph_loop.sh             # 🔁 Script Ralph Loop
├── ralph_state.json          # 💾 Estado do loop
├── hooks/
│   ├── stop.sh              # 🔍 Hook de continuidade
│   └── post_tool.sh         # ✅ Validações pós-ferramenta
└── commands/
    ├── ralph.md             # 📝 Comando /ralph
    └── autopilot.md         # 🚀 Comando /autopilot

docs/
├── MANUS_TASKS.md           # 📋 SSOT de tasks (principal)
├── tasks.md                 # 📜 Histórico de sprints
├── architecture.md          # 🏗️  Arquitetura (criar)
└── database-schema.md       # 🗄️  Schema DB (criar)
```

---

## 🤖 OS 10 AGENTES

| Agente | Papel | Quando Consultar |
|--------|-------|------------------|
| **LIA** | Orquestrador Supreme | Sempre (executa tudo) |
| **NEXUS** | Arquiteto/CTO | Decisões de arquitetura |
| **EXECUTOR** | Full Stack Dev | Implementação de features |
| **HELIOS** | Security Engineer | Auth, validações, segurança |
| **ATLAS** | UI/UX Designer | Design system, UX |
| **THANOS** | Code Optimizer | Refactoring, otimização |
| **ORACLE** | QA Guardian | Testes, qualidade |
| **AETHER** | Performance Guru | Performance, queries |
| **THEMIS** | Compliance | LGPD, conformidade |
| **ARIA** | Data Specialist | Modelagem DB, migrations |
| **PROMETHEUS** | DevOps | Deploy, CI/CD |

**IMPORTANTE:** Apenas LIA executa código. Os outros apenas consultam.

---

## 🔄 AGENT LOOP (6 FASES)

```
1. ANALISAR (5-15 min)
   ✓ Ler contexto (ACTIVATION_PROMPT, tasks)
   ✓ Revisar código existente
   ✓ Verificar conformidade
   ✓ Decidir consulta de agentes

2. PLANEJAR (5-20 min)
   ✓ Definir escopo claro
   ✓ Consultar agentes (0-4)
   ✓ Criar checklist
   ✓ Atualizar tasks.md

3. EXECUTAR (5-90 min)
   ✓ TypeScript Strict
   ✓ async/await only
   ✓ Validação Zod
   ✓ UI moderna (shadcn/ui)

4. OBSERVAR (5-15 min)
   ✓ npm run type-check (0 erros)
   ✓ npm test (>70% coverage)
   ✓ npm run build (sucesso)
   ✓ Teste manual

5. ITERAR (5-30 min)
   ✓ Corrigir erros
   ✓ Validar com agentes
   ✓ Refatorar se necessário

6. ENTREGAR (5-10 min)
   ✓ Atualizar tasks.md
   ✓ Recalcular Score 7D (se grande)
   ✓ Commit (se solicitado)
   ✓ Reportar
```

---

## 📊 SISTEMA 7D SCORING

```
Score = (D1×15%) + (D2×25%) + (D3×20%) + (D4×15%) + (D5×10%) + (D6×10%) + (D7×5%)
```

| Dimensão | Peso | Meta | O que mede |
|----------|------|------|------------|
| D1 - Documentação | 15% | 90+ | README, docs, comentários |
| D2 - Código | 25% | 85+ | Build, TypeScript, componentes |
| D3 - Testes | 20% | 70+ | Coverage, unitários, E2E |
| D4 - UX/UI | 15% | 85+ | Design, responsivo, a11y |
| D5 - Segurança | 10% | 90+ | Auth, validação, OWASP |
| D6 - Performance | 10% | 80+ | Lighthouse, bundle, queries |
| D7 - Validação Real | 5% | 50+ | Deploy, usuários reais |

**Níveis:**
- **95-100**: 🚀 INVESTOR READY
- **90-94**: ✅ PRODUCTION READY
- **80-89**: 🎯 MVP READY
- **70-79**: 🔧 MVP BASIC
- **<70**: ❌ CRÍTICO

---

## 🎯 PROTOCOLOS CRÍTICOS

### 1. NUNCA PIORAR
- Sempre ler arquivo antes de modificar
- Preferir Edit sobre Write

### 2. ZERO DUPLICAÇÃO
- Buscar código similar antes de criar
- Reutilizar existente

### 3. TASKS.MD É VERDADE
- Sempre ler antes de trabalhar
- Sempre atualizar ao concluir

### 4. EXECUÇÃO HONESTA
- LIA é única que executa
- Nunca fingir delegação

### 5. TYPESCRIPT STRICT
- Zero any
- Validação Zod em boundaries

### 6. ASYNC/AWAIT ONLY
- Nunca .then()
- Sempre try/catch

### 7. SEGURANÇA FIRST
- Validação em todos inputs
- Auth check em rotas protegidas

---

## 📋 CHECKLISTS

### Componente 100% Completo
```
✓ TypeScript strict (zero any)
✓ Loading/error/empty states
✓ Acessibilidade (ARIA, keyboard)
✓ Responsivo (mobile/tablet/desktop)
✓ Performance (memoização)
✓ Testes (>80% coverage)
✓ Documentação (JSDoc)
```

### API 100% Completa
```
✓ TypeScript strict
✓ Validação Zod em inputs
✓ Auth check (se necessário)
✓ Error handling (try/catch)
✓ HTTP status corretos
✓ Prisma (não SQL direto)
✓ Testes (>80% coverage)
✓ Logging estruturado
```

### Página 100% Completa
```
✓ SEO metadata completo
✓ Componentes com states
✓ Error boundary
✓ Responsivo completo
✓ Acessibilidade WCAG 2.1 AA
✓ Performance (Lighthouse >90)
✓ Testes E2E do fluxo
```

---

## 🚀 RALPH LOOP (PILOTO AUTOMÁTICO)

O Ralph Loop permite execução autônoma de múltiplas tasks.

### Ativação

```bash
# Script
bash .claude/ralph_loop.sh "Complete todas tasks P0" 50

# Prompt natural
"MANUS, trabalhe em piloto automático"
```

### Como Funciona

```
1. Usuário ativa piloto automático
2. LIA lê MANUS_TASKS.md e identifica pendentes
3. LIA executa Agent Loop para cada task
4. Stop Hook verifica se há mais tasks
5. Se SIM: continua automaticamente
6. Se NÃO: finaliza com relatório
7. Limite de segurança: MAX_ITERATIONS
```

### Critérios de Parada

**PARAR:**
- Todas tasks marcadas [x] ou DONE
- MAX_ITERATIONS atingido
- Erro crítico

**CONTINUAR:**
- Há tasks pendentes (TODO, IN_PROGRESS)
- Iteração < MAX_ITERATIONS
- Sem bloqueadores

---

## 📈 MATRIZ DE PRIORIDADES

### P0 - BLOQUEADORES (<24h)
```
❌ IMPEDE FUNCIONAMENTO:
- Build falhando
- TypeScript errors críticos
- Database não conecta
- Auth não funciona
```

### P1 - ALTA PRIORIDADE (<3 dias)
```
⚠️ IMPACTA QUALIDADE:
- Componentes sem states
- APIs sem validação
- Coverage <70%
- Performance ruim
```

### P2 - MÉDIA PRIORIDADE (<1 semana)
```
📝 MELHORIAS:
- Refactoring
- Otimizações
- Documentação
- Features não críticas
```

---

## 🔗 ARQUIVOS PRINCIPAIS

| Arquivo | Descrição | Ler Quando |
|---------|-----------|------------|
| `ACTIVATION_PROMPT.md` | Prompt de ativação | Sempre ao iniciar |
| `agent-config.json` | Config dos agentes | Consultar agentes |
| `SCORING_SYSTEM_v7.md` | Sistema 7D completo | Calcular score |
| `CURRENT_SCORE.md` | Score atual | Ver status |
| `AGENT_LOOP_PATTERNS.md` | Padrões de execução | Exemplos de tarefas |
| `MANUS_TASKS.md` | Tasks (SSOT) | Sempre (verdade única) |
| `settings.json` | Configurações | Ajustar comportamento |

---

## 💡 DICAS

### ✅ FAZER

- Ler MANUS_TASKS.md antes de começar
- Seguir Agent Loop rigorosamente
- Consultar agentes quando > 15 min
- Validar TypeScript/testes sempre
- Atualizar tasks.md constantemente
- Usar checklists para completude

### ❌ NÃO FAZER

- Pular análise (Fase 1)
- Criar sem planejar (Fase 2)
- Entregar sem validar (Fase 4)
- Fingir consulta de agentes
- Usar `any` no TypeScript
- Duplicar código
- Commitar com erros

---

## 🆘 TROUBLESHOOTING

### Build falhando
```bash
npm run type-check    # Ver erros TypeScript
npm run lint          # Ver erros ESLint
npm run build         # Ver erros de build
```

### Testes falhando
```bash
npm test              # Ver quais testes
npm run test:coverage # Ver coverage
```

### Ralph Loop travado
```bash
# Verificar estado
cat .claude/ralph_state.json

# Verificar tasks pendentes
cat docs/MANUS_TASKS.md | grep -E "(TODO|IN_PROGRESS)"
```

### Score 7D desatualizado
```bash
"MANUS, recalcule o Score 7D"
```

---

## 📚 DOCUMENTAÇÃO COMPLETA

- **Sistema completo**: [ACTIVATION_PROMPT.md](ACTIVATION_PROMPT.md)
- **Scoring 7D**: [SCORING_SYSTEM_v7.md](scoring/SCORING_SYSTEM_v7.md)
- **Padrões**: [AGENT_LOOP_PATTERNS.md](patterns/AGENT_LOOP_PATTERNS.md)
- **Checklists**: [templates/](templates/)
- **Tasks**: [../docs/MANUS_TASKS.md](../docs/MANUS_TASKS.md)

---

## ✨ VERSÃO

**MANUS v7.1 FINAL**
- Data: 2026-01-15
- Projeto: Flame Lounge Bar & Restaurant
- Baseado em: TributAI MANUS v7.1
- Status: Pronto para uso

---

## 🎬 PRÓXIMO PASSO

```bash
"MANUS, faça auditoria completa do projeto e calcule Score 7D inicial"
```

Isso vai:
1. Auditar todo o projeto
2. Identificar gaps e problemas
3. Calcular Score 7D baseline
4. Criar plano de ação priorizado

**MANUS está pronto! 🔥**
