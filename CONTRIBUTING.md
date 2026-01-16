# Guia de Contribuição - Flame Lounge Bar

Obrigado por considerar contribuir com o projeto Flame Lounge Bar! Este documento fornece diretrizes e instruções para facilitar o processo de contribuição.

## Tabela de Conteúdos

- [Como Contribuir](#como-contribuir)
- [Padrões de Código](#padrões-de-código)
- [Commit Conventions](#commit-conventions)
- [Como Rodar Testes](#como-rodar-testes)
- [Code Review Process](#code-review-process)
- [Código de Conduta](#código-de-conduta)

---

## Como Contribuir

### 1. Preparar seu Ambiente

**Pré-requisitos:**
- Node.js 18+ instalado
- Git configurado com seu nome e email
- Uma conta GitHub

**Passos iniciais:**

```bash
# 1. Faça um fork do repositório
# Via GitHub: clique em "Fork" na página do repositório

# 2. Clone seu fork
git clone https://github.com/seu-usuario/flamelounge.git
cd flamelounge

# 3. Configure o upstream
git remote add upstream https://github.com/original-owner/flamelounge.git

# 4. Instale as dependências
npm install
```

### 2. Criar uma Branch para sua Contribuição

```bash
# Atualize a branch main
git fetch upstream
git checkout main
git merge upstream/main

# Crie uma nova branch com um nome descritivo
git checkout -b feature/sua-funcionalidade
# ou
git checkout -b fix/descricao-do-bug
# ou
git checkout -b docs/melhorias-documentacao
```

**Nomes de branch recomendados:**
- `feature/nova-funcionalidade` - para novas features
- `fix/correcao-bug` - para correções
- `docs/melhorias` - para documentação
- `refactor/nome` - para refatoração
- `test/cobertura` - para testes

### 3. Fazer Suas Alterações

```bash
# Faça suas mudanças nos arquivos
# Comite seguindo as conventions (veja próxima seção)
# Teste suas mudanças localmente

git add .
git commit -m "feat: descrição clara da mudança"
```

### 4. Manter sua Branch Atualizada

```bash
# Antes de fazer push, atualize sua branch
git fetch upstream
git rebase upstream/main

# Se houver conflitos, resolva-os manualmente
# Após resolver:
git add .
git rebase --continue
```

### 5. Push e Criar um Pull Request

```bash
# Faça push da sua branch
git push origin feature/sua-funcionalidade

# Acesse GitHub e clique em "New Pull Request"
# Preencha o template de PR com detalhes claros
```

**Template de PR:**

```markdown
## Descrição
Breve descrição do que foi alterado e por quê.

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Como foi testado?
Descreva os testes realizados.

## Checklist
- [ ] Meu código segue os padrões do projeto
- [ ] Realizei self-review do meu código
- [ ] Adicionei comentários nas partes complexas
- [ ] Atualizei a documentação
- [ ] Meus testes passam localmente
```

---

## Padrões de Código

### Linguagem e Formatação

**JavaScript/TypeScript:**

```javascript
// Bom - Clear and concise
function calculateDiscount(price, discountPercent) {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error('Discount must be between 0 and 100');
  }
  return price * (1 - discountPercent / 100);
}

// Evitar
function calc(p, d) {
  return p * (1 - d / 100);
}
```

### Regras Gerais

1. **Indentação:** 2 espaços (não tabs)
2. **Linha máxima:** 100 caracteres
3. **Variáveis:** camelCase
4. **Constantes:** UPPER_SNAKE_CASE
5. **Classes:** PascalCase
6. **Funções:** camelCase

```javascript
// Exemplos
const MAX_RETRIES = 3;
const userEmail = 'user@example.com';

class OrderService {
  processOrder(order) {
    // implementação
  }
}
```

### Comentários

```javascript
// Use comentários para explicar o "por quê", não o "o quê"

// Bom - explica a razão
// Usamos setTimeout para aguardar a renderização do DOM
setTimeout(() => {
  element.focus();
}, 0);

// Evitar - óbvio pelo código
// Define timeout
setTimeout(() => {
  element.focus();
}, 0);
```

### Imports e Exports

```javascript
// Mantenha imports organizados e agrupados

// 1. Node modules
import fs from 'fs';
import path from 'path';

// 2. Modules locais
import { OrderService } from '../services/order.service';
import { logger } from '../utils/logger';

// 3. Exports
export default OrderService;
export { OrderService };
```

### Tratamento de Erros

```javascript
// Bom - tratamento específico
try {
  await database.connect();
} catch (error) {
  if (error.code === 'ECONNREFUSED') {
    logger.error('Database connection refused');
  }
  throw error;
}

// Evitar - catch genérico
try {
  await database.connect();
} catch (error) {
  console.log('Error occurred');
}
```

### Naming Conventions para Arquivos

```
src/
├── controllers/
│   └── orderController.js
├── services/
│   └── orderService.js
├── models/
│   └── Order.js
├── utils/
│   └── validators.js
└── tests/
    └── order.test.js
```

---

## Commit Conventions

Utilizamos **Conventional Commits** para manter o histórico de commits organizado e automatizar o versionamento.

### Formato

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: Uma nova feature
- **fix**: Correção de bug
- **docs**: Mudanças na documentação
- **style**: Formatação, missing semi-colons, etc (sem mudança de código)
- **refactor**: Refatoração de código (sem mudança de features)
- **perf**: Melhorias de performance
- **test**: Adição ou atualização de testes
- **chore**: Atualizações de dependencies, scripts, etc

### Exemplos Práticos

```bash
# Feature simples
git commit -m "feat: adicionar autenticação com JWT"

# Feature com escopo
git commit -m "feat(auth): implementar refresh token"

# Fix com corpo
git commit -m "fix(order): corrigir cálculo de desconto"

# Refactor
git commit -m "refactor(api): simplificar estrutura de rotas"

# Docs
git commit -m "docs: atualizar README com instruções de setup"

# Breaking change
git commit -m "feat(api)!: remover endpoint /v1/orders

BREAKING CHANGE: endpoint /v1/orders foi removido. Use /v2/orders"

# Commit com corpo e footer
git commit -m "fix(payment): corrigir processamento de reembolso

Quando um reembolso era processado, o status do pedido não era
atualizado corretamente. Agora atualizamos o status para 'refunded'
após o processamento bem-sucedido.

Closes #123"
```

### Boas Práticas

1. **Use o tempo presente:** "add feature" não "added feature"
2. **Não capitalize:** "add feature" não "Add feature"
3. **Sem ponto final:** "add feature" não "add feature."
4. **Seja descritivo:** "fix: corrigir calculo de desconto" em vez de "fix: bug"
5. **Uma funcionalidade por commit:** Evite commits grandes com múltiplas mudanças não relacionadas

---

## Como Rodar Testes

### Estrutura de Testes

```
tests/
├── unit/
│   ├── services/
│   └── utils/
├── integration/
│   └── api/
└── e2e/
    └── user-flows/
```

### Executar Testes

```bash
# Rodar todos os testes
npm test

# Rodar testes de um arquivo específico
npm test -- order.test.js

# Rodar com coverage
npm test -- --coverage

# Modo watch (re-rodar ao salvar)
npm test -- --watch

# Apenas testes de integração
npm test -- tests/integration/

# Apenas testes unitários
npm test -- tests/unit/
```

### Escrevendo Testes

```javascript
// order.test.js
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { OrderService } from '../services/orderService';

describe('OrderService', () => {
  let service;

  beforeEach(() => {
    service = new OrderService();
  });

  afterEach(() => {
    // Limpeza após testes
  });

  it('deve calcular o total do pedido corretamente', () => {
    const order = { items: [{ price: 100, quantity: 2 }] };
    const total = service.calculateTotal(order);
    expect(total).toBe(200);
  });

  it('deve lançar erro para pedido vazio', () => {
    const order = { items: [] };
    expect(() => {
      service.calculateTotal(order);
    }).toThrow('Order must have items');
  });

  it('deve aplicar desconto corretamente', () => {
    const order = { items: [{ price: 100, quantity: 1 }], discount: 0.1 };
    const total = service.calculateTotal(order);
    expect(total).toBe(90);
  });
});
```

### Cobertura de Testes

Esperamos uma cobertura mínima de:
- **Statements:** 80%
- **Branches:** 75%
- **Functions:** 80%
- **Lines:** 80%

```bash
# Verificar cobertura
npm test -- --coverage

# Visualizar relatório HTML
npm test -- --coverage --reporter=html
# Abra coverage/index.html no navegador
```

---

## Code Review Process

### Antes de Submeter seu PR

- [ ] Rebase com `upstream/main`
- [ ] Rode `npm test` e todos os testes passam
- [ ] Rode `npm run lint` e sem erros
- [ ] Rode `npm run format` para formatar código
- [ ] Verificou seu próprio código antes de submeter
- [ ] Adicionou testes para novas features
- [ ] Atualizou documentação se necessário

### Durante o Code Review

1. **Receba feedback aberto:** Reviewers estão ajudando a melhorar o código
2. **Responda a todos os comentários:** Mesmo que discorde, responda educadamente
3. **Faça pequenas mudanças:** Para cada mudança solicitada, faça um novo commit
4. **Não rebase/force push:** Mantenha o histórico de mudanças visível
5. **Solicite re-review:** Após fazer mudanças, peça para revisar novamente

```bash
# Fazer mudanças solicitadas
git add .
git commit -m "fix: endereço do feedback do reviewer"
git push origin feature/sua-funcionalidade

# GitHub notificará automaticamente o reviewer
```

### Como Ser um Bom Revisor

- Seja respeitoso e construtivo
- Foque no código, não na pessoa
- Aproveite para aprender
- Pergunte se não entender algo
- Aprove quando estiver satisfeito

### Merge

Uma vez aprovado:
1. Garanta que está atualizado com `main`
2. GitHub fará o merge automático (squash recomendado)
3. Delete a branch após merge
4. Atualize sua cópia local: `git fetch upstream && git checkout main && git pull upstream main`

---

## Código de Conduta

### Nossos Valores

Somos comprometidos em oferecer um ambiente acolhedor e respeitoso para todos, independentemente de:
- Identidade e expressão de gênero
- Orientação sexual
- Deficiência
- Aparência pessoal
- Tamanho do corpo
- Raça ou etnia
- Religião
- Nacionalidade
- Experiência profissional

### Comportamento Esperado

- Use linguagem inclusiva
- Respeite diferentes pontos de vista e experiências
- Aceite crítica construtiva graciosamente
- Foque no que é melhor para a comunidade
- Mostre empatia com outros membros da comunidade

### Comportamento Inaceitável

- Uso de linguagem ou imagens sexualizadas
- Assédio pessoal ou profissional
- Ataques baseados em características pessoais
- Spam ou autopromoção indevida
- Qualquer violação de privacidade ou segurança

### Reportar Problemas

Se você testemunhar ou sofrer comportamento inaceitável:

1. **Documente:** Salve screenshots ou registre as mensagens
2. **Reporte:** Envie um email para `conduct@flamelounge.dev` com:
   - Descrição do incidente
   - Pessoas envolvidas
   - Data e hora
   - Qualquer evidência
3. **Confidencialidade:** Todos os reports são tratados com confidencialidade

### Consequências

Violações do código de conduta podem resultar em:
- Aviso privado
- Remoção temporária de privilégios
- Ban permanente do projeto

---

## Perguntas Frequentes

### Quanto tempo leva para meu PR ser revisado?

Geralmente 3-5 dias úteis. Às vezes pode ser mais rápido ou mais lento dependendo da complexidade.

### Meu PR foi rejeitado. Posso resubmeter?

Sim! Leia o feedback cuidadosamente, faça as mudanças sugeridas e resubmeta. Aprendemos com tentativas anteriores.

### Como começo se sou iniciante?

Procure por issues com a label `good-first-issue`. Essas são issues pensadas para iniciantes.

### Preciso de ajuda? Onde pergunto?

- Discussões no GitHub
- Issues com a tag `question`
- Email: `hello@flamelounge.dev`

---

## Recursos Úteis

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)

---

## Licença

Ao contribuir com este projeto, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto.

---

**Obrigado por contribuir! Sua ajuda torna o Flame Lounge Bar melhor para todos.**

Versão: 1.0.0
Última atualização: 2026-01-16
