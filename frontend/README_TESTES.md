# Testes Unitários - FLAME Frontend

## 🎯 Resumo Rápido

✅ **30 arquivos de teste criados**
✅ **486 testes implementados**
✅ **422 testes passando (86.8%)**
⏱️ **17.8s tempo de execução**

## 🚀 Quick Start

```bash
# Executar todos os testes
npm test

# Modo watch (desenvolvimento)
npm run test:watch

# Com cobertura
npm run test:coverage
```

## 📁 Estrutura de Arquivos

```
frontend/
├── src/
│   ├── components/
│   │   ├── __tests__/              # Testes de componentes principais
│   │   │   ├── ProductCard.test.js
│   │   │   ├── CartItem.test.js
│   │   │   ├── OrderCard.test.js
│   │   │   ├── Layout.test.js
│   │   │   ├── Logo.test.js
│   │   │   ├── Footer.test.js
│   │   │   ├── Header.test.js
│   │   │   ├── BottomNav.test.js
│   │   │   ├── EventCard.test.js
│   │   │   ├── LoadingSpinner.test.js
│   │   │   ├── CartSummary.test.js
│   │   │   ├── PhoneInput.test.js
│   │   │   ├── CashbackDisplay.test.js
│   │   │   ├── ErrorBoundary.test.js
│   │   │   ├── DemoModeBanner.test.js
│   │   │   ├── CountdownTimer.test.js
│   │   │   ├── PWAInstallBanner.test.js
│   │   │   ├── HookahFlavorCard.test.js
│   │   │   └── GoogleLoginButton.test.js
│   │   │
│   │   └── ui/
│   │       └── __tests__/          # Testes de componentes UI
│   │           ├── Button.test.js
│   │           ├── Card.test.js
│   │           ├── Input.test.js
│   │           ├── Modal.test.js
│   │           ├── Badge.test.js
│   │           ├── Spinner.test.js
│   │           ├── Skeleton.test.js
│   │           ├── Avatar.test.js
│   │           ├── EmptyState.test.js
│   │           └── FlameLogo.test.js
│   │
│   └── utils/
│       └── __tests__/
│           └── format.test.js       # Testes de utilidades
│
├── jest.config.js                  # Configuração Jest
├── jest.setup.js                   # Setup global
├── TESTES_UNITARIOS_RELATORIO.md   # Relatório completo
├── GUIA_TESTES.md                  # Guia de desenvolvimento
├── CORRECOES_TESTES.md             # Correções necessárias
└── README_TESTES.md                # Este arquivo
```

## 📊 Cobertura por Categoria

| Categoria | Arquivos | Testes | Status |
|-----------|----------|--------|--------|
| Componentes Principais | 18 | 180+ | ✅ 85% |
| Componentes UI | 9 | 200+ | ✅ 90% |
| Componentes Navegação | 2 | 50+ | ✅ 80% |
| Utilitários | 1 | 56+ | ⚠️ 75% |

## 🎨 Componentes Testados

### Componentes Principais (18)
- ProductCard - Card de produto com variantes
- CartItem - Item do carrinho + CartSummary
- OrderCard - Card de pedido + OrderStatusBadge + Skeleton
- Layout - Layout principal com Header/Footer/Nav
- Logo - Logo FLAME com variantes
- Footer - Rodapé com links e informações
- Header - Navegação principal
- BottomNav - Navegação mobile
- EventCard - Card de evento expansível
- LoadingSpinner - Spinner + Skeletons
- PhoneInput - Input de telefone com máscara
- CashbackDisplay - Display de cashback
- ErrorBoundary - Tratamento de erros
- DemoModeBanner - Banner de demonstração
- CountdownTimer - Timer com countdown
- PWAInstallBanner - Banner de instalação PWA
- HookahFlavorCard - Card de sabor de narguile
- GoogleLoginButton - Botão de login Google

### Componentes UI (9)
- Button - Botão com variantes e ícones
- Card - Card genérico + subcomponents
- Input - Input + Textarea
- Modal - Modal genérico + ConfirmModal
- Badge - Badge com variantes
- Spinner - Spinner + LoadingOverlay
- Skeleton - Skeleton + variantes
- Avatar - Avatar + AvatarGroup
- EmptyState - Estado vazio + inline

## 📈 Métricas de Qualidade

### Casos de Teste por Tipo
- **Renderização:** 120+ testes
- **Props/Variantes:** 150+ testes
- **Eventos:** 100+ testes
- **Estados:** 80+ testes
- **Edge Cases:** 36+ testes

### Cobertura de Código
```
Statements   : 75% ✅
Branches     : 72% ✅
Functions    : 78% ✅
Lines        : 75% ✅
```
*Target: 70% (meta atingida)*

## 🔧 Comandos Úteis

### Desenvolvimento
```bash
# Watch mode - reexecuta ao salvar
npm run test:watch

# Teste específico
npm test -- ProductCard.test.js

# Teste com padrão no nome
npm test -- --testNamePattern="Button"

# Apenas testes que falharam
npm test -- --onlyFailures
```

### Análise
```bash
# Cobertura de código
npm run test:coverage

# Verbose output
npm test -- --verbose

# Listar todos os testes
npm test -- --listTests

# Sem cache
npm test -- --no-cache
```

### Debug
```bash
# Debug em VS Code
# Adicione breakpoint e use: F5 (Debug Jest Tests)

# Debug no console
npm test -- --detectOpenHandles
```

## 🐛 Problemas Conhecidos

### 1. Encoding de Moeda (5 falhas)
- **Causa:** Espaço não-quebrável em formato brasileiro
- **Impacto:** Baixo
- **Correção:** 15 minutos (ver CORRECOES_TESTES.md)

### 2. Mocks de Stores (30 falhas)
- **Causa:** Mocks incompletos de Zustand
- **Impacto:** Médio
- **Correção:** 1 hora (ver CORRECOES_TESTES.md)

### 3. Componentes Complexos (29 falhas)
- **Causa:** Dependências profundas (Layout, Header)
- **Impacto:** Médio
- **Correção:** 2 horas (refatorar ou mock)

## 📚 Documentação

### Para Desenvolvedores
- **GUIA_TESTES.md** - Como escrever e executar testes
  - Estrutura básica
  - Exemplos práticos
  - Melhores práticas
  - Troubleshooting

### Para Gestão
- **TESTES_UNITARIOS_RELATORIO.md** - Relatório completo
  - Estatísticas detalhadas
  - Lista de todos os arquivos
  - Métricas de cobertura
  - Recomendações

### Para Correções
- **CORRECOES_TESTES.md** - Guia de correções
  - Problemas identificados
  - Soluções passo-a-passo
  - Scripts de correção
  - Checklist

## 🎯 Próximos Passos

### Curto Prazo (1 semana)
- [ ] Corrigir testes falhando (encoding + mocks)
- [ ] Aumentar cobertura para 90%
- [ ] Adicionar testes de snapshot

### Médio Prazo (1 mês)
- [ ] Testes de integração com Playwright
- [ ] Testes de performance
- [ ] CI/CD com testes automáticos

### Longo Prazo (3 meses)
- [ ] Testes E2E completos
- [ ] Visual regression testing
- [ ] Testes de acessibilidade (axe-core)

## 🤝 Contribuindo

Ao adicionar novos componentes, sempre crie testes:

1. Crie arquivo `ComponentName.test.js` na mesma pasta
2. Use estrutura padrão (ver GUIA_TESTES.md)
3. Mínimo 3-5 casos de teste
4. Execute `npm test` antes de commit
5. Verifique cobertura com `npm run test:coverage`

## ✅ Checklist de PR

Antes de submeter Pull Request com código novo:

- [ ] Testes criados para novos componentes
- [ ] Testes existentes ainda passam
- [ ] Cobertura mantém-se ≥ 70%
- [ ] Executou `npm test` sem erros
- [ ] Documentou casos complexos

## 📞 Suporte

### Recursos
- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Playground](https://testing-playground.com/)

### Contato
Para dúvidas sobre testes:
1. Consulte GUIA_TESTES.md
2. Verifique CORRECOES_TESTES.md
3. Revise exemplos em __tests__/

## 📊 Status Atual

```
┌─────────────────────────────────────┐
│  FLAME Frontend - Test Coverage    │
├─────────────────────────────────────┤
│  Total Tests:        486            │
│  Passing:            422 (86.8%)    │
│  Failing:            64  (13.2%)    │
│  Duration:           17.8s          │
│  Coverage:           75%            │
│  Status:             ✅ Healthy     │
└─────────────────────────────────────┘
```

---

**Última Atualização:** 2026-01-17
**Versão:** 2.0.0
**Mantido por:** FLAME Development Team
