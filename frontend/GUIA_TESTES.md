# Guia de Testes Unitários - FLAME Frontend

## Índice
1. [Visão Geral](#visão-geral)
2. [Executando Testes](#executando-testes)
3. [Escrevendo Novos Testes](#escrevendo-novos-testes)
4. [Padrões e Melhores Práticas](#padrões-e-melhores-práticas)
5. [Troubleshooting](#troubleshooting)

## Visão Geral

O projeto utiliza **Jest** e **React Testing Library** para testes unitários. Atualmente temos:
- 30 arquivos de teste
- 486 casos de teste
- 86.8% de taxa de sucesso

## Executando Testes

### Comandos Básicos

```bash
# Executar todos os testes
npm test

# Executar em modo watch (reexecuta ao salvar)
npm run test:watch

# Executar com cobertura de código
npm run test:coverage

# Executar teste específico
npm test -- ProductCard.test.js

# Executar testes de uma pasta
npm test -- components/ui

# Executar com output detalhado
npm test -- --verbose

# Listar todos os arquivos de teste
npm test -- --listTests
```

### Filtrando Testes

```bash
# Executar apenas testes com "Button" no nome
npm test -- --testNamePattern="Button"

# Executar apenas testes que falharam
npm test -- --onlyFailures

# Pular cache (forçar reexecução)
npm test -- --no-cache
```

### Cobertura de Código

```bash
# Gerar relatório de cobertura
npm run test:coverage

# Abrir relatório HTML
# Arquivo gerado em: coverage/lcov-report/index.html
```

## Escrevendo Novos Testes

### Estrutura Básica

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import ComponentName from '../ComponentName';

// Mock de dependências se necessário
jest.mock('../../stores/useStore');

describe('ComponentName', () => {
  // Setup antes de cada teste
  beforeEach(() => {
    // Limpar mocks, resetar estado, etc
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interaction', () => {
    const handleClick = jest.fn();
    render(<ComponentName onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Exemplo Completo: Button Component

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';
import { User } from 'lucide-react';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders with icon', () => {
    render(
      <Button leftIcon={<User data-testid="user-icon" />}>
        With Icon
      </Button>
    );
    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });
});
```

### Testando Componentes com Props Complexas

```javascript
const mockProduct = {
  id: 1,
  name: 'Test Product',
  price: 29.90,
  image: '/test.jpg',
  category: 'Food',
  isActive: true,
};

describe('ProductCard', () => {
  it('displays product information', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText(/29\.90/)).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
  });

  it('handles add to cart action', () => {
    const mockAddToCart = jest.fn();
    render(
      <ProductCard
        product={mockProduct}
        onAddToCart={mockAddToCart}
      />
    );

    const addButton = screen.getByRole('button', { name: /adicionar/i });
    fireEvent.click(addButton);

    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });
});
```

### Testando com Zustand Stores

```javascript
import { useCartStore } from '../../stores/cartStore';

// Mock do store
jest.mock('../../stores/cartStore');

describe('CartItem', () => {
  const mockAddItem = jest.fn();
  const mockRemoveItem = jest.fn();

  beforeEach(() => {
    useCartStore.mockReturnValue({
      items: [],
      addItem: mockAddItem,
      removeItem: mockRemoveItem,
      getTotalItems: () => 0,
    });
  });

  it('adds item to cart', () => {
    render(<CartItem item={mockItem} />);

    fireEvent.click(screen.getByLabelText('Aumentar quantidade'));
    expect(mockAddItem).toHaveBeenCalled();
  });
});
```

### Testando Async/Await

```javascript
import { waitFor } from '@testing-library/react';

it('loads data asynchronously', async () => {
  render(<DataComponent />);

  // Esperar elemento aparecer
  await waitFor(() => {
    expect(screen.getByText('Loaded Data')).toBeInTheDocument();
  });
});

it('handles loading state', async () => {
  render(<DataComponent />);

  // Verificar loading inicial
  expect(screen.getByText('Loading...')).toBeInTheDocument();

  // Esperar dados carregarem
  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });
});
```

## Padrões e Melhores Práticas

### 1. Nomenclatura de Testes

```javascript
// ✅ BOM: Descreve comportamento
it('displays error message when form is invalid', () => {});

// ❌ RUIM: Muito genérico
it('works correctly', () => {});

// ✅ BOM: Específico e claro
it('calls onSubmit with form data when submit button is clicked', () => {});

// ❌ RUIM: Testa implementação ao invés de comportamento
it('sets state.loading to true', () => {});
```

### 2. Organize Testes com describe()

```javascript
describe('Button', () => {
  describe('Variants', () => {
    it('renders primary variant', () => {});
    it('renders secondary variant', () => {});
    it('renders ghost variant', () => {});
  });

  describe('States', () => {
    it('handles disabled state', () => {});
    it('handles loading state', () => {});
  });

  describe('Interactions', () => {
    it('handles click events', () => {});
    it('prevents click when disabled', () => {});
  });
});
```

### 3. Use Queries Semânticas

```javascript
// ✅ BOM: Usa role (melhor para acessibilidade)
screen.getByRole('button', { name: /adicionar/i });

// ✅ BOM: Usa label
screen.getByLabelText('Email');

// ⚠️ OK: Usa texto (pode quebrar com i18n)
screen.getByText('Submit');

// ❌ EVITAR: Usa classe CSS (frágil)
container.querySelector('.btn-primary');

// ❌ EVITAR: Usa testid (último recurso)
screen.getByTestId('submit-button');
```

### 4. Prioridade de Queries

1. `getByRole` - Melhor para acessibilidade
2. `getByLabelText` - Para inputs com labels
3. `getByPlaceholderText` - Para inputs com placeholder
4. `getByText` - Para texto visível
5. `getByDisplayValue` - Para inputs com valores
6. `getByAltText` - Para imagens
7. `getByTitle` - Para elementos com title
8. `getByTestId` - Último recurso

### 5. Setup e Teardown

```javascript
describe('Component', () => {
  let originalFetch;

  // Executado UMA VEZ antes de todos os testes
  beforeAll(() => {
    originalFetch = global.fetch;
  });

  // Executado ANTES de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  // Executado APÓS cada teste
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Executado UMA VEZ após todos os testes
  afterAll(() => {
    global.fetch = originalFetch;
  });
});
```

### 6. Testando Acessibilidade

```javascript
it('has accessible button', () => {
  render(<Button>Click me</Button>);

  const button = screen.getByRole('button', { name: /click me/i });
  expect(button).toBeInTheDocument();
  expect(button).toHaveAccessibleName('Click me');
});

it('has proper ARIA labels', () => {
  render(<Modal isOpen onClose={jest.fn()} />);

  const dialog = screen.getByRole('dialog');
  expect(dialog).toHaveAttribute('aria-modal', 'true');
});
```

## Troubleshooting

### Problema: "Cannot find module"

```bash
# Limpar cache do Jest
npm test -- --clearCache

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### Problema: "Element not found"

```javascript
// Use waitFor para elementos assíncronos
await waitFor(() => {
  expect(screen.getByText('Async Text')).toBeInTheDocument();
});

// Use query* ao invés de get* se elemento pode não existir
expect(screen.queryByText('Optional')).not.toBeInTheDocument();
```

### Problema: "Act warnings"

```javascript
// Envolva updates em act()
import { act } from '@testing-library/react';

act(() => {
  // código que atualiza estado
});

// Ou use waitFor
await waitFor(() => {
  expect(screen.getByText('Updated')).toBeInTheDocument();
});
```

### Problema: Testes lentos

```javascript
// Use fake timers
jest.useFakeTimers();

it('advances time', () => {
  render(<Timer />);

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  expect(screen.getByText('1 second')).toBeInTheDocument();
});

// Limpar após o teste
afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});
```

### Debugging Testes

```javascript
// Imprimir HTML atual
import { screen } from '@testing-library/react';

screen.debug(); // Imprime todo o documento
screen.debug(element); // Imprime elemento específico

// Verificar se elemento existe (sem error)
const element = screen.queryByText('Text');
console.log('Element exists:', element !== null);

// Ver todas as queries disponíveis
screen.logTestingPlaygroundURL();
```

## Recursos Adicionais

### Documentação Oficial
- [Jest](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)

### Ferramentas Úteis
- [Testing Playground](https://testing-playground.com/) - Explorar queries interativamente
- [Jest Extended](https://github.com/jest-community/jest-extended) - Matchers adicionais
- [MSW](https://mswjs.io/) - Mock de APIs

### Cheat Sheets
- [React Testing Library Cheat Sheet](https://testing-library.com/docs/react-testing-library/cheatsheet)
- [Jest Matchers](https://jestjs.io/docs/expect)

## Contribuindo

Ao adicionar novos testes:

1. ✅ Siga a estrutura de pastas existente
2. ✅ Use nomenclatura descritiva
3. ✅ Agrupe testes relacionados com `describe()`
4. ✅ Teste comportamento, não implementação
5. ✅ Cubra happy path e edge cases
6. ✅ Mantenha testes simples e focados
7. ✅ Execute `npm test` antes de commit

---

**Última atualização:** 2026-01-17
