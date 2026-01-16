# 📊 SISTEMA DE SCORING 7D - FLAME LOUNGE v7.1

**Versão:** 7.1
**Data:** 2026-01-15
**Projeto:** Flame Lounge Bar & Restaurant

---

## 🎯 VISÃO GERAL

O Sistema 7D Scoring é uma metodologia quantitativa para avaliar a qualidade, completude e prontidão para produção do projeto Flame Lounge. Ele mede 7 dimensões críticas e calcula um score global de 0-100.

### **Fórmula Global**

```
Score Global = (D1×15%) + (D2×25%) + (D3×20%) + (D4×15%) + (D5×10%) + (D6×10%) + (D7×5%)
```

### **Níveis de Prontidão**

| Score | Nível | Status | Ações Permitidas |
|-------|-------|--------|------------------|
| **95-100** | 🚀 INVESTOR READY | Pronto para investidores | Deploy produção + pitch investidores |
| **90-94** | ✅ PRODUCTION READY | Pronto para produção | Deploy produção + usuários reais |
| **80-89** | 🎯 MVP READY | MVP pronto | Deploy staging + demos |
| **70-79** | 🔧 MVP BASIC | MVP básico | Desenvolvimento contínuo |
| **<70** | ❌ CRÍTICO | Bloqueadores | Resolver P0 imediatamente |

---

## 📐 7 DIMENSÕES DE AVALIAÇÃO

### **D1: DOCUMENTAÇÃO** (Peso: 15%)

**Meta:** 90+

**Critérios de Avaliação:**

| Pontos | Critério | Como Avaliar |
|--------|----------|--------------|
| 0-30 | Documentação crítica ausente | Sem README, sem docs básicos |
| 31-60 | Documentação básica | README existe mas incompleto |
| 61-80 | Documentação completa | README + docs principais OK |
| 81-90 | Documentação excelente | Tudo documentado, exemplos claros |
| 91-100 | Documentação exemplar | SSOT perfeito, links funcionando, diagramas |

**Checklist D1:**
```
□ README.md completo e atualizado
□ docs/tasks.md existe e é mantido (SSOT)
□ docs/architecture.md descreve arquitetura
□ docs/database-schema.md documenta DB
□ docs/api-documentation.md lista todas APIs
□ Código crítico tem JSDoc/comentários
□ Todos os links funcionam
□ Diagramas quando necessário (arquitetura, fluxos)
□ Guia de setup para novos devs
□ Changelog mantido
```

**Como Calcular D1:**
- Cada item do checklist = 10 pontos
- Score D1 = (itens completos / 10) × 100

---

### **D2: CÓDIGO** (Peso: 25%)

**Meta:** 85+

**Critérios de Avaliação:**

| Pontos | Critério | Como Avaliar |
|--------|----------|--------------|
| 0-30 | Build falha ou muitos erros | `npm run build` falha |
| 31-60 | Build OK mas código problemático | Build OK mas many TypeScript errors |
| 61-80 | Código bom | Build OK, poucos erros, componentes básicos |
| 81-90 | Código excelente | Build OK, zero erros, componentes completos |
| 91-100 | Código exemplar | Tudo perfeito + best practices |

**Checklist D2:**
```
□ npm run build executa sem erros
□ TypeScript strict mode habilitado
□ Zero erros TypeScript em produção
□ ESLint configurado e passando
□ Prettier configurado
□ Todos componentes tem loading/error/empty states
□ Todas APIs implementadas e funcionando
□ Validação Zod em todos os inputs
□ async/await (zero .then())
□ Zero any no TypeScript
□ Prisma configurado e funcionando
□ Migrations rodando corretamente
```

**Como Calcular D2:**
- Build funciona: +30 pontos
- TypeScript strict + zero errors: +25 pontos
- ESLint pass: +10 pontos
- Componentes completos: +20 pontos
- APIs completas: +15 pontos
- Score D2 = soma dos pontos

---

### **D3: TESTES** (Peso: 20%)

**Meta:** 70+

**Critérios de Avaliação:**

| Pontos | Critério | Como Avaliar |
|--------|----------|--------------|
| 0-30 | Sem testes ou coverage <30% | `npm test` falha ou poucos testes |
| 31-50 | Testes básicos (30-50% coverage) | Alguns testes unitários |
| 51-70 | Testes bons (50-70% coverage) | Testes unitários + alguns integração |
| 71-90 | Testes excelentes (>70% coverage) | Unitários + integração + E2E críticos |
| 91-100 | Testes exemplares (>85% coverage) | Cobertura completa + E2E completo |

**Checklist D3:**
```
□ Vitest configurado
□ npm test executa sem erros
□ Coverage > 50% (básico)
□ Coverage > 70% (meta)
□ Coverage > 85% (excelente)
□ Testes unitários para funções críticas
□ Testes de integração para APIs
□ Playwright configurado
□ Testes E2E para fluxos críticos (login, pedido, etc)
□ Testes executam no CI/CD
```

**Como Calcular D3:**
- npm test funciona: +20 pontos
- Coverage 50-70%: +30 pontos
- Coverage >70%: +50 pontos
- E2E fluxos críticos: +30 pontos
- Score D3 = soma dos pontos

---

### **D4: UX/UI** (Peso: 15%)

**Meta:** 85+

**Critérios de Avaliação:**

| Pontos | Critério | Como Avaliar |
|--------|----------|--------------|
| 0-30 | UI básica ou quebrada | Componentes feios, não responsivo |
| 31-60 | UI funcional | Funciona mas design básico |
| 61-80 | UI boa | Design moderno, responsivo básico |
| 81-90 | UI excelente | Design profissional, totalmente responsivo |
| 91-100 | UI exemplar | Bloomberg-level, acessível, perfeito |

**Checklist D4:**
```
□ Design system definido (cores, tipografia, espaçamentos)
□ shadcn/ui implementado
□ Componentes consistentes visualmente
□ Responsivo (mobile, tablet, desktop)
□ Mobile-first approach
□ Loading states em todos os lugares
□ Error states com mensagens claras
□ Empty states com ilustrações + CTAs
□ Acessibilidade WCAG 2.1 AA (ARIA, keyboard nav)
□ Animações suaves (transitions, hover states)
```

**Como Calcular D4:**
- Design system: +15 pontos
- shadcn/ui: +10 pontos
- Responsivo completo: +25 pontos
- Loading/error/empty states: +25 pontos
- Acessibilidade: +25 pontos
- Score D4 = soma dos pontos

---

### **D5: SEGURANÇA** (Peso: 10%)

**Meta:** 90+

**Critérios de Avaliação:**

| Pontos | Critério | Como Avaliar |
|--------|----------|--------------|
| 0-30 | Vulnerabilidades críticas | Sem auth, sem validação, SQL injection |
| 31-60 | Segurança básica | Auth existe mas validação fraca |
| 61-80 | Segurança boa | Auth OK, validação Zod, básicos OK |
| 81-90 | Segurança excelente | Tudo protegido, rate limiting, OWASP OK |
| 91-100 | Segurança exemplar | Auditoria completa, zero vulnerabilidades |

**Checklist D5:**
```
□ Autenticação implementada (NextAuth/Clerk)
□ Autorização em todas as rotas protegidas
□ Validação Zod em TODOS os inputs
□ Proteção contra SQL Injection (Prisma)
□ Proteção contra XSS (sanitização)
□ Proteção contra CSRF (tokens)
□ Rate limiting em APIs públicas
□ Variáveis de ambiente seguras (.env.local)
□ HTTPS em produção
□ OWASP Top 10 verificado
```

**Como Calcular D5:**
- Auth implementado: +20 pontos
- Validação Zod completa: +20 pontos
- Proteções OWASP: +30 pontos
- Rate limiting: +15 pontos
- Env vars seguras: +15 pontos
- Score D5 = soma dos pontos

---

### **D6: PERFORMANCE** (Peso: 10%)

**Meta:** 80+

**Critérios de Avaliação:**

| Pontos | Critério | Como Avaliar |
|--------|----------|--------------|
| 0-30 | Performance ruim | Lighthouse <50, páginas lentas |
| 31-60 | Performance básica | Lighthouse 50-70, queries lentas |
| 61-80 | Performance boa | Lighthouse 70-85, otimizações básicas |
| 81-90 | Performance excelente | Lighthouse >85, tudo otimizado |
| 91-100 | Performance exemplar | Lighthouse >95, máxima otimização |

**Checklist D6:**
```
□ Lighthouse Performance > 70 (básico)
□ Lighthouse Performance > 85 (excelente)
□ Lighthouse Performance > 95 (perfeito)
□ Bundle size < 500KB (gzipped)
□ Lazy loading de componentes pesados
□ Code splitting implementado
□ Imagens otimizadas (WebP, sizes corretos)
□ Queries Prisma otimizadas (indices, select específico)
□ Caching implementado (React Query, Redis)
□ Core Web Vitals verdes (LCP, FID, CLS)
```

**Como Calcular D6:**
- Lighthouse >70: +30 pontos
- Lighthouse >85: +50 pontos (substitui os 30)
- Bundle <500KB: +20 pontos
- Lazy loading + code splitting: +15 pontos
- Queries otimizadas: +15 pontos
- Score D6 = soma dos pontos

---

### **D7: VALIDAÇÃO REAL** (Peso: 5%)

**Meta:** 50+

**Critérios de Avaliação:**

| Pontos | Critério | Como Avaliar |
|--------|----------|--------------|
| 0-30 | Apenas local | Nunca saiu do localhost |
| 31-50 | Deploy staging | Deploy em staging, sem usuários |
| 51-70 | Testes com usuários | Staging + testes com 1-5 usuários |
| 71-90 | Beta com usuários | Produção beta com >10 usuários |
| 91-100 | Produção validada | Produção com >50 usuários, métricas OK |

**Checklist D7:**
```
□ Deploy em staging (Vercel/Railway)
□ Variáveis de ambiente configuradas
□ Database produção/staging separados
□ Testes com usuários reais (5+ pessoas)
□ Feedback coletado e documentado
□ Métricas implementadas (analytics)
□ Monitoring implementado (Sentry)
□ Logs estruturados
□ Backup de database configurado
□ Plano de rollback definido
```

**Como Calcular D7:**
- Deploy staging: +30 pontos
- Testes com 5+ usuários: +25 pontos
- Monitoring + logs: +20 pontos
- Métricas + analytics: +15 pontos
- Backup + rollback: +10 pontos
- Score D7 = soma dos pontos

---

## 🧮 CALCULADORA DE SCORE

### **Passo a Passo para Calcular Score Global**

1. **Calcular cada dimensão individualmente** (D1 a D7)
2. **Aplicar pesos:**
   - D1 × 0.15
   - D2 × 0.25
   - D3 × 0.20
   - D4 × 0.15
   - D5 × 0.10
   - D6 × 0.10
   - D7 × 0.05
3. **Somar tudo:**
   - Score Global = soma de todos os valores ponderados
4. **Classificar:**
   - < 70: CRÍTICO
   - 70-79: MVP BASIC
   - 80-89: MVP READY
   - 90-94: PRODUCTION READY
   - 95-100: INVESTOR READY

### **Exemplo de Cálculo**

```
D1 (Documentação): 85/100 → 85 × 0.15 = 12.75
D2 (Código):        82/100 → 82 × 0.25 = 20.50
D3 (Testes):        72/100 → 72 × 0.20 = 14.40
D4 (UX/UI):         88/100 → 88 × 0.15 = 13.20
D5 (Segurança):     90/100 → 90 × 0.10 =  9.00
D6 (Performance):   78/100 → 78 × 0.10 =  7.80
D7 (Validação):     45/100 → 45 × 0.05 =  2.25

Score Global = 79.90 ≈ 80/100 (MVP READY)
```

---

## 📈 ROADMAP DE MELHORIA

### **De CRÍTICO (<70) para MVP BASIC (70)**
1. Resolver todos os bloqueadores P0
2. Garantir build funcionando
3. Implementar features mínimas viáveis
4. Documentação básica

### **De MVP BASIC (70) para MVP READY (80)**
1. Adicionar testes (coverage >70%)
2. Melhorar UX/UI (responsivo completo)
3. Implementar segurança básica (auth + validação)
4. Otimizar performance básica

### **De MVP READY (80) para PRODUCTION READY (90)**
1. Testes E2E completos
2. Segurança avançada (rate limiting, auditoria)
3. Performance excelente (Lighthouse >85)
4. Deploy staging + testes com usuários
5. Monitoring e logs

### **De PRODUCTION READY (90) para INVESTOR READY (95+)**
1. Cobertura de testes >85%
2. Performance máxima (Lighthouse >95)
3. Validação real com >50 usuários
4. Documentação exemplar
5. Zero débito técnico

---

## 🎯 METAS POR FASE

### **Fase 1: Foundation (Target: 70)**
- Build funciona: D2 = 60+
- Documentação básica: D1 = 60+
- Segurança mínima: D5 = 70+

### **Fase 2: MVP (Target: 80)**
- Testes básicos: D3 = 70+
- UX/UI moderno: D4 = 80+
- Performance OK: D6 = 70+

### **Fase 3: Production (Target: 90)**
- Testes completos: D3 = 85+
- Segurança avançada: D5 = 90+
- Deploy staging: D7 = 50+

### **Fase 4: Scale (Target: 95+)**
- Tudo excelente: todas dimensões >85
- Validação real: D7 = 70+

---

## 📝 FORMATO DE RELATÓRIO

```markdown
# SCORE 7D - FLAME LOUNGE
**Data:** [data]
**Calculado por:** MANUS LIA

## Score Global
**[XX]/100** - [NÍVEL]

## Detalhamento por Dimensão

### D1: Documentação (Peso: 15%)
- **Score:** XX/100
- **Ponderado:** XX × 0.15 = XX
- **Status:** [emoji] [status]
- **Gap para meta (90):** XX pontos

**Principais Issues:**
- [ ] Issue 1
- [ ] Issue 2

### D2: Código (Peso: 25%)
[...]

## Recomendações Prioritárias

### P0 (Bloqueadores)
1. [Recomendação 1]
2. [Recomendação 2]

### P1 (Alta Prioridade)
[...]

## Próximos Passos
1. [Passo 1]
2. [Passo 2]
```

---

## 🔄 QUANDO RECALCULAR SCORE

**Recalcular após:**
- Feature grande implementada (>45 min)
- Sprint concluído
- Deploy em staging/produção
- Solicitação explícita do usuário
- Mudanças significativas em qualquer dimensão

**NÃO recalcular após:**
- Mudanças triviais (typos, formatação)
- Features pequenas (<15 min)
- Trabalho em progresso

---

## 📊 HISTÓRICO DE SCORES

Manter histórico em `.manus/scoring/AUDIT_REPORTS/`:
- `score_YYYY-MM-DD_HHmm.md`
- Permite acompanhar evolução ao longo do tempo
- Facilita análise de tendências

---

**Fim do Documento**
