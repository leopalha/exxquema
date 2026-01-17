# Teste Manual - Mobile Landscape Optimization

## 🎯 Objetivo
Validar otimizações de UX para dispositivos móveis em modo paisagem (landscape)

## 📱 Dispositivos para Testar

### Smartphone (Obrigatório)
- [ ] iPhone SE/12/13/14 (Safari)
- [ ] Android Samsung/Pixel (Chrome)

### Tablet (Opcional)
- [ ] iPad Mini/Air (Safari)

## 🧪 Checklist de Testes

### 1. Header - Compacto ✓
**Como testar**:
1. Abrir aplicação em modo portrait
2. Rotacionar dispositivo para landscape
3. Observar header

**Resultado esperado**:
- ✅ Header reduz de 64px para 48px
- ✅ Logo reduz de 40px para 32px
- ✅ Ícones reduzem de 24px para 20px
- ✅ Header permanece fixo no topo
- ✅ Todos elementos acessíveis

**Status**: [ ] Passou  [ ] Falhou  [ ] Não testado

### 2. BottomNav - Oculto ✓
**Como testar**:
1. Navegar no app em portrait (BottomNav visível)
2. Rotacionar para landscape
3. Observar BottomNav

**Resultado esperado**:
- ✅ BottomNav desaparece em landscape
- ✅ Navegação disponível via Header
- ✅ +64px de espaço para conteúdo
- ✅ Sem padding bottom extra

**Status**: [ ] Passou  [ ] Falhou  [ ] Não testado

### 3. Hero Section - Horizontal ✓
**Como testar**:
1. Abrir página inicial (/) em landscape
2. Observar Hero section

**Resultado esperado**:
- ✅ Hero não ocupa 100vh
- ✅ Layout horizontal (texto 60% + imagem 40%)
- ✅ Conteúdo visível sem scroll
- ✅ Call-to-action acessível
- ✅ Animações funcionando

**Status**: [ ] Passou  [ ] Falhou  [ ] Não testado

### 4. Cardápio - Grid 2 Colunas ✓
**Como testar**:
1. Navegar para /cardapio em landscape
2. Observar ProductCards

**Resultado esperado**:
- ✅ Grid muda de 1 coluna para 2 colunas
- ✅ Cards em layout horizontal (imagem + info)
- ✅ 4 cards visíveis (2x2 grid)
- ✅ Scroll vertical funciona
- ✅ Botão "Adicionar ao carrinho" acessível

**Status**: [ ] Passou  [ ] Falhou  [ ] Não testado

### 5. Modals - Fullscreen ✓
**Como testar**:
1. Abrir modal (ex: opções de narguile)
2. Observar em landscape

**Resultado esperado**:
- ✅ Modal ocupa 100% da tela
- ✅ Sem margens laterais
- ✅ Border-radius removido
- ✅ Scroll interno funcionando
- ✅ Botão fechar acessível

**Status**: [ ] Passou  [ ] Falhou  [ ] Não testado

### 6. Checkout - Otimizado ✓
**Como testar**:
1. Adicionar produtos ao carrinho
2. Ir para /checkout em landscape
3. Percorrer steps

**Resultado esperado**:
- ✅ Steps horizontais (não verticais)
- ✅ Cart items compactos
- ✅ Form fields em 2 colunas
- ✅ Resumo visível
- ✅ Botões "Próximo/Finalizar" acessíveis

**Status**: [ ] Passou  [ ] Falhou  [ ] Não testado

### 7. Formulários - Grid 2 Colunas ✓
**Como testar**:
1. Abrir página de login/cadastro
2. Observar em landscape

**Resultado esperado**:
- ✅ Campos dispostos em 2 colunas
- ✅ Textarea ocupa linha inteira
- ✅ Labels visíveis
- ✅ Botões acessíveis
- ✅ Validação funcionando

**Status**: [ ] Passou  [ ] Falhou  [ ] Não testado

### 8. Safe Areas - iOS ✓
**Como testar** (apenas iOS):
1. Abrir no iPhone com notch (X+)
2. Rotacionar para landscape
3. Observar margens

**Resultado esperado**:
- ✅ Conteúdo não oculto pelo notch
- ✅ Padding left/right aplicado
- ✅ Header respeita safe area
- ✅ Botões não sobrepostos

**Status**: [ ] Passou  [ ] Falhou  [ ] Não testado  [ ] N/A (sem notch)

### 9. Typography - Legível ✓
**Como testar**:
1. Navegar por diferentes páginas
2. Ler textos, títulos, botões

**Resultado esperado**:
- ✅ H1: 2rem (32px) - legível
- ✅ H2: 1.5rem (24px) - legível
- ✅ Body: 0.875rem (14px) - legível
- ✅ Botões: 0.875rem (14px) - legível
- ✅ Line-height adequado

**Status**: [ ] Passou  [ ] Falhou  [ ] Não testado

### 10. Performance ✓
**Como testar**:
1. Rotacionar dispositivo várias vezes
2. Navegar entre páginas
3. Abrir/fechar modals

**Resultado esperado**:
- ✅ Transição suave (< 200ms)
- ✅ Sem lag ao rotacionar
- ✅ Animações fluidas
- ✅ Scroll suave
- ✅ Sem reflows visíveis

**Status**: [ ] Passou  [ ] Falhou  [ ] Não testado

## 📊 Métricas Esperadas

### Espaço para Conteúdo
- **Portrait**: ~66% da altura (247px de 375px)
- **Landscape**: ~87% da altura (327px de 375px)
- **Ganho**: +32% (+80px)

### Densidade de Informação
- **Portrait**: 2 cards por viewport
- **Landscape**: 4 cards por viewport (2x2)
- **Ganho**: +100%

### Tempo de Checkout
- **Portrait**: ~45 segundos
- **Landscape**: ~30 segundos
- **Ganho**: -33%

## 🐛 Bugs Conhecidos

### P0 (Crítico)
- [ ] Nenhum identificado

### P1 (Alto)
- [ ] Nenhum identificado

### P2 (Médio)
- [ ] Nenhum identificado

### P3 (Baixo)
- [ ] Animações podem ser muito rápidas (200ms) - considerar aumentar para 250ms

## 📝 Notas de Teste

### Dispositivo 1: _________________
**Data**: ______
**Tester**: _________________

**Observações**:
-
-
-

**Screenshot**: [ ] Anexado

### Dispositivo 2: _________________
**Data**: ______
**Tester**: _________________

**Observações**:
-
-
-

**Screenshot**: [ ] Anexado

## ✅ Critérios de Aprovação

**Mínimo para aprovar**:
- [ ] 8 de 10 testes passando (80%)
- [ ] Nenhum bug P0
- [ ] Máximo 1 bug P1
- [ ] Performance aceitável (transições < 300ms)

**Ideal**:
- [ ] 10 de 10 testes passando (100%)
- [ ] Nenhum bug P0, P1, P2
- [ ] Performance excelente (transições < 200ms)

## 🎯 Resultado Final

**Data do teste**: __________
**Testes passando**: ___ / 10 (___%)
**Bugs encontrados**: P0: ___ | P1: ___ | P2: ___ | P3: ___
**Status**: [ ] ✅ Aprovado  [ ] ⚠️ Aprovado com ressalvas  [ ] ❌ Reprovado

**Assinatura**: _________________

---

**Versão**: 1.0.0
**Última atualização**: 2026-01-17
