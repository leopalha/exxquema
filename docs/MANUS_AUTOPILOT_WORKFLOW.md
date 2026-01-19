# 🤖 MANUS - WORKFLOW PILOTO AUTOMÁTICO

**Versão**: 1.0
**Data**: 2026-01-19
**Trigger**: Quando o usuário disser "Manus, piloto automático"

---

## 🎯 OBJETIVO

Este workflow define EXATAMENTE o que o agente MANUS deve fazer automaticamente quando ativado em modo piloto automático, sem precisar de comandos repetidos do usuário.

---

## 📋 FASE 0: DIAGNÓSTICO INICIAL (Automático - 2 minutos)

Quando ativado, SEMPRE começar por:

### 0.1 Ler Contexto Completo
```
✓ Ler: docs/06_ACTIVATION_PROMPT.md (contexto do projeto)
✓ Ler: STATUS.md (status atual)
✓ Ler: FASE_2_PERFORMANCE_COMPLETO.md (último progresso)
✓ Ler: docs/MANUS_TASKS.md (se existir - lista de tasks)
✓ Verificar: git status (arquivos modificados/pendentes)
```

### 0.2 Identificar Estado Atual
```
✓ Score 7D atual em cada dimensão
✓ Fase em execução (FASE 0, 1, 2, 3...)
✓ Tasks P0 pendentes (bloqueadores críticos)
✓ Tasks P1 pendentes (alta prioridade)
✓ Builds quebrados (se houver)
✓ Testes falhando (se houver)
```

### 0.3 Criar TodoList Inicial
```
✓ Usar TodoWrite para criar lista de tasks baseado no STATUS.md
✓ Incluir apenas tasks PENDENTES
✓ Priorizar: P0 > P1 > P2
✓ Marcar primeira task como "in_progress"
```

**Output para o usuário:**
```
🤖 MANUS PILOTO AUTOMÁTICO ATIVADO

Status atual:
- Score: 99.3%
- Fase: FASE 3 - Segurança & Validação (PENDENTE)
- P0 bloqueadores: 0
- P1 alta prioridade: 3 tasks
- P2 melhorias: 6 tasks

Próxima ação: [primeira task da lista]

Iniciando trabalho...
```

---

## 📋 FASE 1: EXECUÇÃO AUTOMÁTICA (Loop contínuo)

### 1.1 Loop de Trabalho

Para cada task na lista (ordem: P0 → P1 → P2):

#### A. ANTES DE COMEÇAR A TASK
```
1. Marcar task como "in_progress" (TodoWrite)
2. Ler arquivos relevantes (Read tool)
3. Verificar dependências da task
4. Se precisar de decisão do usuário → usar AskUserQuestion
5. Caso contrário → continuar
```

#### B. EXECUTAR TASK
```
1. Fazer as modificações necessárias (Edit/Write)
2. Rodar testes se aplicável (Bash)
3. Verificar que não quebrou nada (build/test)
4. Commitar mudanças com mensagem descritiva (Bash)
```

#### C. DEPOIS DE COMPLETAR TASK
```
1. Marcar task como "completed" (TodoWrite)
2. Atualizar STATUS.md com progresso
3. Notificar usuário sobre conclusão
4. Passar para próxima task automaticamente
```

### 1.2 Regras de Execução

**SEM PERGUNTAR, APENAS EXECUTAR:**
- ✅ Corrigir bugs óbvios
- ✅ Implementar features bem definidas
- ✅ Otimizações de performance
- ✅ Adicionar testes
- ✅ Melhorias de código
- ✅ Atualizar documentação
- ✅ Commitar mudanças

**PERGUNTAR ANTES:**
- ❓ Mudanças de arquitetura
- ❓ Alterações de regras de negócio
- ❓ Múltiplas abordagens válidas
- ❓ Remoção de features existentes
- ❓ Mudanças que afetam UX drasticamente

---

## 📋 FASE 2: CICLO DE VALIDAÇÃO (A cada 5 tasks)

A cada 5 tasks completadas, AUTOMATICAMENTE:

### 2.1 Checkpoint de Qualidade
```
✓ Rodar todos os testes: npm test (frontend + backend)
✓ Verificar build: npm run build (frontend)
✓ Verificar lint: npm run lint (se configurado)
✓ Verificar git status (nada quebrado)
```

### 2.2 Atualizar Documentação
```
✓ Atualizar STATUS.md com novo score
✓ Listar commits feitos
✓ Atualizar métricas (score 7D)
```

### 2.3 Reportar Progresso
```
✓ Informar usuário:
  - X tasks completadas
  - Y commits criados
  - Score: A% → B% (+C%)
  - Tempo estimado restante
```

---

## 📋 FASE 3: PRIORIZAÇÃO INTELIGENTE

### 3.1 Ordem de Execução Padrão

**Sempre seguir esta ordem:**

```
1. P0 - Bloqueadores Críticos
   - Builds quebrados
   - Testes falhando
   - Bugs críticos em produção
   - Dependências faltando

2. P1 - Alta Prioridade (Features do roadmap)
   - Configurar integrações externas (Stripe, Google OAuth, etc)
   - Implementar features pendentes (Cashback usage, Split payment)
   - Corrigir testes falhando
   - Completar documentação crítica

3. P2 - Melhorias
   - Otimizações de performance
   - Refatorações
   - Testes adicionais
   - Documentação extra
   - CI/CD
```

### 3.2 Detecção Automática de Problemas

**Se encontrar durante execução:**

- **Build quebrado** → Interromper tudo, consertar imediatamente (P0)
- **Testes falhando** → Adicionar na lista como P0, consertar antes de continuar
- **Dependência faltando** → Instalar imediatamente
- **Configuração faltando** → Perguntar ao usuário (AskUserQuestion)

---

## 📋 FASE 4: TEMPLATES DE TASKS COMUNS

### 4.1 Implementar Feature Nova

```
[ ] Ler PRD da feature (docs/03_PRD.md)
[ ] Identificar arquivos afetados (Grep/Glob)
[ ] Backend:
    [ ] Criar/modificar model (se necessário)
    [ ] Criar/modificar controller
    [ ] Criar/modificar routes
    [ ] Adicionar validações (Zod)
    [ ] Adicionar testes
[ ] Frontend:
    [ ] Criar/modificar components
    [ ] Atualizar stores (Zustand)
    [ ] Adicionar UI
    [ ] Adicionar testes
[ ] Testar integração completa
[ ] Commitar: "feat: [nome da feature]"
[ ] Atualizar STATUS.md
```

### 4.2 Corrigir Bug

```
[ ] Ler issue/descrição do bug
[ ] Reproduzir bug (Bash - rodar app)
[ ] Identificar causa raiz (Read arquivos)
[ ] Implementar correção (Edit)
[ ] Adicionar teste que cobre o bug
[ ] Verificar que teste passa
[ ] Commitar: "fix: [descrição do bug]"
[ ] Atualizar STATUS.md
```

### 4.3 Otimização de Performance

```
[ ] Identificar bottleneck (ler relatórios)
[ ] Implementar otimização (Edit)
[ ] Medir impacto (antes/depois)
[ ] Adicionar testes de performance (se aplicável)
[ ] Commitar: "perf: [descrição]"
[ ] Atualizar STATUS.md com métricas
```

### 4.4 Configurar Integração Externa

```
[ ] Ler guia de setup (docs/guides/)
[ ] Verificar se código já existe (Grep)
[ ] Se código existe:
    [ ] Verificar variáveis de ambiente necessárias
    [ ] PERGUNTAR ao usuário as credenciais (AskUserQuestion)
    [ ] Atualizar .env.example
    [ ] Documentar em README
[ ] Se código não existe:
    [ ] Implementar integração completa
    [ ] Adicionar testes
[ ] Commitar: "feat: configure [nome integração]"
[ ] Atualizar STATUS.md
```

### 4.5 Adicionar Testes

```
[ ] Identificar arquivo sem testes (Grep __tests__)
[ ] Ler arquivo original (Read)
[ ] Criar arquivo de teste
[ ] Implementar testes:
    [ ] Happy path
    [ ] Edge cases
    [ ] Error cases
[ ] Rodar testes (npm test)
[ ] Verificar cobertura aumentou
[ ] Commitar: "test: add tests for [componente]"
[ ] Atualizar STATUS.md (score D3)
```

---

## 📋 FASE 5: DETECÇÃO DE CONCLUSÃO

### 5.1 Quando Parar?

**Parar automaticamente quando:**

```
✓ Todas tasks P0 completadas
✓ Todas tasks P1 completadas
✓ Score 7D atingiu meta (ex: 100%)
✓ Builds passando
✓ Testes passando
✓ Git status limpo (tudo commitado)
```

### 5.2 Relatório Final

**Gerar automaticamente:**

```markdown
## 🎉 PILOTO AUTOMÁTICO FINALIZADO

### Resumo da Sessão
- **Duração**: X horas
- **Tasks completadas**: Y
- **Commits criados**: Z
- **Score**: A% → B% (+C%)

### Mudanças Principais
1. Feature X implementada
2. Bug Y corrigido
3. Performance Z otimizada
...

### Arquivos Modificados
- backend/src/controllers/...
- frontend/src/components/...
...

### Próximos Passos Sugeridos
1. Testar manualmente feature X
2. Configurar credencial Y (necessário)
3. Deploy para staging
```

**Salvar relatório em:** `docs/sessions/SESSION_[data].md`

---

## 📋 FASE 6: CASOS ESPECIAIS

### 6.1 Se Encontrar Bloqueador

```
1. Notificar usuário imediatamente
2. Descrever bloqueador claramente
3. Sugerir ações:
   - Se for credencial faltando → pedir ao usuário
   - Se for decisão de negócio → perguntar (AskUserQuestion)
   - Se for bug externo → documentar e pular
4. Aguardar resposta do usuário
5. Continuar com outras tasks enquanto espera
```

### 6.2 Se Build Quebrar

```
1. PARAR TUDO imediatamente
2. Reverter último commit (git revert)
3. Investigar causa
4. Corrigir
5. Testar novamente
6. Só então continuar
```

### 6.3 Se Testes Falharem

```
1. Identificar quais testes falharam
2. Se são testes novos (adicionados nesta sessão):
   - Corrigir imediatamente
3. Se são testes antigos (já existiam):
   - Adicionar à lista como P0
   - Marcar como "testes falhando"
   - Corrigir antes de continuar outras tasks
```

---

## 🔄 FLUXOGRAMA VISUAL

```
┌─────────────────────────────────────┐
│ USUÁRIO: "Manus, piloto automático" │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ FASE 0: Diagnóstico                 │
│ - Ler contexto completo             │
│ - Identificar estado atual          │
│ - Criar TodoList                    │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ FASE 1: Loop de Execução            │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Para cada task (P0→P1→P2):      │ │
│ │ 1. Marcar in_progress           │ │
│ │ 2. Executar task                │ │
│ │ 3. Testar                       │ │
│ │ 4. Commitar                     │ │
│ │ 5. Marcar completed             │ │
│ │ 6. Próxima task                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│      ┌──────────────────┐           │
│      │ A cada 5 tasks:  │           │
│      │ - Checkpoint     │           │
│      │ - Atualizar docs │           │
│      │ - Reportar       │           │
│      └──────────────────┘           │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ Todas tasks completas?              │
│ ┌───────┐           ┌───────┐       │
│ │  SIM  │           │  NÃO  │       │
│ └───┬───┘           └───┬───┘       │
│     │                   │           │
│     ▼                   └──────┐    │
│ ┌─────────┐                    │    │
│ │ FASE 5: │                    │    │
│ │Concluir │                    │    │
│ └─────────┘                    │    │
│     │                          │    │
│     ▼                          │    │
│ Gerar relatório                │    │
│ Notificar usuário              │    │
│                                │    │
└────────────────────────────────┼────┘
                                 │
                                 │
                        ┌────────▼────────┐
                        │ Bloqueador?     │
                        │ ┌────┐  ┌────┐ │
                        │ │SIM │  │NÃO │ │
                        │ └─┬──┘  └─┬──┘ │
                        │   │       │    │
                        │   ▼       │    │
                        │ Notificar │    │
                        │ Aguardar  │    │
                        │   │       │    │
                        └───┼───────┼────┘
                            │       │
                            └───────┴──► FASE 1 (continuar)
```

---

## 📝 EXEMPLO DE EXECUÇÃO COMPLETA

### Input do Usuário:
```
"Manus, piloto automático"
```

### Output Esperado:

```
🤖 MANUS PILOTO AUTOMÁTICO ATIVADO

📊 Diagnóstico Inicial:
- Score atual: 99.3%
- Fase: FASE 3 - Segurança & Validação
- Tasks pendentes: 9 (P0: 0, P1: 3, P2: 6)

📋 Criando plano de execução...

✅ TodoList criada:
  1. [ ] Configurar Stripe (P0) - 1h
  2. [ ] Configurar Google OAuth (P1) - 30min
  3. [ ] Implementar uso de Cashback (P1) - 4-6h
  4. [ ] OWASP ZAP Scan (P2) - 2-3h
  5. ... (mais 5 tasks)

🚀 Iniciando execução automática...

---

[1/9] ⏳ Configurando Stripe...
  ✓ Código verificado - já implementado
  ✓ Falta apenas configurar credenciais

  ❓ AGUARDANDO USUÁRIO:
     Preciso das credenciais do Stripe:
     - STRIPE_SECRET_KEY
     - STRIPE_PUBLISHABLE_KEY

     Por favor, forneça ou diga "pular" para continuar outras tasks.

[Usuário fornece credenciais]

  ✓ Credenciais configuradas em .env
  ✓ Testando conexão... OK
  ✓ Commit: "feat: configure Stripe payment gateway"
  ✅ Task completada! (1/9)

---

[2/9] ⏳ Configurando Google OAuth...
  ✓ Lendo guia: docs/guides/GOOGLE_OAUTH_SETUP.md
  ✓ Código verificado - já implementado

  ❓ AGUARDANDO USUÁRIO:
     Preciso das credenciais do Google Cloud:
     - GOOGLE_CLIENT_ID
     - GOOGLE_CLIENT_SECRET

[Usuário diz "pular"]

  ⏸️ Task adiada. Continuando outras tasks...

---

[3/9] ⏳ Implementando uso de Cashback...
  ✓ Lendo: frontend/src/pages/checkout.js
  ✓ Lendo: frontend/src/stores/cartStore.js
  ✓ Implementando UI de toggle cashback...
  ✓ Adicionando validação de saldo...
  ✓ Integrando com backend...
  ✓ Testando... OK
  ✓ Commit: "feat: implement cashback usage in checkout"
  ✅ Task completada! (2/9)

---

[... continua automaticamente até completar todas as 9 tasks ...]

---

📊 CHECKPOINT (5 tasks completadas)

✅ Progresso:
  - Tasks: 5/9 (55%)
  - Commits: 5
  - Score: 99.3% → 99.7% (+0.4%)
  - Build: ✅ OK
  - Testes: ✅ 685/713 (96.1%)

Continuando...

---

[... execução continua ...]

---

🎉 PILOTO AUTOMÁTICO FINALIZADO!

### Resumo da Sessão
- **Duração**: 4h 30min
- **Tasks completadas**: 7/9 (78%)
- **Tasks adiadas**: 2 (aguardando credenciais)
- **Commits criados**: 7
- **Score**: 99.3% → 100.0% (+0.7%)

### Principais Mudanças
1. ✅ Stripe configurado e testado
2. ✅ Uso de cashback implementado no checkout
3. ✅ Modal de divisão de conta completo
4. ✅ OWASP ZAP scan executado (0 High, 3 Medium)
5. ✅ Load tests completos (todos targets atingidos)
6. ✅ CI/CD pipeline configurado
7. ✅ Documentação atualizada

### Arquivos Modificados
- frontend/src/pages/checkout.js
- frontend/src/stores/cartStore.js
- frontend/src/components/SplitPaymentModal.js
- backend/.env
- .github/workflows/frontend.yml
- .github/workflows/backend.yml
- STATUS.md

### Tasks Pendentes (aguardando usuário)
1. ⏸️ Google OAuth (aguardando credenciais)
2. ⏸️ SendGrid (aguardando API key)

### Próximos Passos Sugeridos
1. Testar manualmente uso de cashback no checkout
2. Fornecer credenciais Google OAuth para completar integração
3. Fazer deploy para staging
4. Executar testes manuais de ponta a ponta

### Relatório Completo
Salvo em: docs/sessions/SESSION_2026-01-19.md

---

🤖 Piloto automático finalizado. Aguardando próximo comando.
```

---

## ⚙️ CONFIGURAÇÕES E TUNNING

### Velocidade de Execução

**Modo Rápido** (padrão):
- Não espera confirmação entre tasks
- Commita automaticamente
- Só para em bloqueadores

**Modo Cauteloso**:
- Pergunta antes de cada commit
- Mostra diff antes de aplicar
- Aguarda confirmação a cada 3 tasks

### Nível de Detalhe

**Verbose** (padrão):
- Mostra cada passo
- Logs detalhados
- Output completo

**Silencioso**:
- Só mostra checkpoints (a cada 5 tasks)
- Só notifica conclusões
- Output resumido

---

## 🔒 REGRAS DE SEGURANÇA

**NUNCA fazer automaticamente:**
1. ❌ Deletar arquivos sem confirmação
2. ❌ Push para main/master sem aprovação
3. ❌ Rodar comandos destrutivos (DROP TABLE, rm -rf, etc)
4. ❌ Modificar .env em produção
5. ❌ Fazer deploy para produção sem aprovação
6. ❌ Alterar regras de negócio críticas sem confirmar

**SEMPRE fazer automaticamente:**
1. ✅ Criar branches para features
2. ✅ Commitar mudanças com mensagens descritivas
3. ✅ Rodar testes antes de commitar
4. ✅ Atualizar documentação
5. ✅ Manter git status limpo
6. ✅ Seguir convenções de código

---

## 📚 REFERÊNCIAS

### Documentos de Contexto
- [06_ACTIVATION_PROMPT.md](06_ACTIVATION_PROMPT.md) - Identidade do agente
- [STATUS.md](../STATUS.md) - Status atual do projeto
- [MANUS_TASKS.md](MANUS_TASKS.md) - Lista de tasks (se existir)
- [03_PRD.md](03_PRD.md) - Product Requirements

### Guias de Execução
- [REFACTORING_GUIDE.md](REFACTORING_GUIDE.md) - Como refatorar
- [GOOGLE_OAUTH_SETUP.md](guides/GOOGLE_OAUTH_SETUP.md) - Setup OAuth
- [CSRF_USAGE.md](../backend/CSRF_USAGE.md) - CSRF Protection

### Templates
- Template de commit: ver [ACTIVATION_PROMPT.md:139-145](06_ACTIVATION_PROMPT.md)
- Template de component: ver [ACTIVATION_PROMPT.md:147-155](06_ACTIVATION_PROMPT.md)

---

## 🎯 CONCLUSÃO

Este workflow garante que o agente MANUS opere de forma:
- ✅ **Autônoma**: Sem precisar de comandos repetidos
- ✅ **Inteligente**: Prioriza automaticamente (P0 > P1 > P2)
- ✅ **Segura**: Nunca faz mudanças destrutivas sem confirmação
- ✅ **Eficiente**: Trabalha continuamente até completar ou bloquear
- ✅ **Transparente**: Reporta progresso constantemente
- ✅ **Confiável**: Sempre valida (tests, build) antes de commitar

**Trigger de ativação**: `"Manus, piloto automático"`

**Resultado esperado**: Sistema completo, testado, documentado e pronto para produção, sem intervenção manual (exceto bloqueadores que requerem decisão/credenciais do usuário).

---

**Versão**: 1.0
**Autor**: Claude Sonnet 4.5
**Data**: 2026-01-19
**Status**: ✅ PRONTO PARA USO
