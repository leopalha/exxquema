# ✅ CHECKLIST: COMPONENTE 100% COMPLETO

**Versão:** 7.1
**Projeto:** Flame Lounge
**Tipo:** Template para validação de componentes React

---

## 🎯 OBJETIVO

Este checklist garante que um componente React está 100% completo e pronto para produção, seguindo os padrões MANUS v7.1.

---

## 📋 CHECKLIST COMPLETO

### **1. TIPAGEM TYPESCRIPT** ✅

```typescript
□ Todas as props tipadas (interface ou type)
□ ZERO uso de `any`
□ Return type da função definido (ou inferido corretamente)
□ Event handlers tipados corretamente
□ Refs tipados com tipos corretos do React
□ Children tipados (ReactNode, ReactElement, etc)
```

**Exemplo:**
```typescript
interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  loading = false
}: ButtonProps): JSX.Element {
  // ...
}
```

---

### **2. ESTADOS OBRIGATÓRIOS** ✅

```typescript
□ Loading State implementado (skeleton ou spinner)
□ Error State implementado (mensagem + retry)
□ Empty State implementado (quando aplicável)
□ Success State implementado
□ Disabled State implementado (quando aplicável)
```

**Exemplo:**
```typescript
// Loading
if (isLoading) {
  return <Skeleton className="h-20 w-full" />;
}

// Error
if (error) {
  return (
    <ErrorAlert
      message={error.message}
      onRetry={refetch}
    />
  );
}

// Empty
if (data.length === 0) {
  return (
    <EmptyState
      title="Nenhum item encontrado"
      description="Adicione seu primeiro item"
      action={<Button>Adicionar</Button>}
    />
  );
}
```

---

### **3. VALIDAÇÃO E SEGURANÇA** ✅

```typescript
□ Props validadas (Zod quando necessário)
□ Input sanitizado (prevenir XSS)
□ Validação de dados antes de renderizar
□ Error boundaries implementados (em nível superior)
□ Não expõe dados sensíveis no console/DOM
```

**Exemplo com Zod:**
```typescript
import { z } from 'zod';

const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  price: z.number().positive(),
});

type Product = z.infer<typeof ProductSchema>;

export function ProductCard({ product }: { product: unknown }) {
  // Validar antes de usar
  const validatedProduct = ProductSchema.parse(product);

  return (
    <div>
      <h3>{validatedProduct.name}</h3>
      <p>R$ {validatedProduct.price.toFixed(2)}</p>
    </div>
  );
}
```

---

### **4. ACESSIBILIDADE (a11y)** ✅

```typescript
□ ARIA labels quando necessário
□ ARIA roles corretos
□ Keyboard navigation funciona
□ Focus visible (outline customizado se necessário)
□ Color contrast adequado (WCAG 2.1 AA)
□ Screen reader friendly
□ Semantic HTML (button, nav, header, etc)
```

**Exemplo:**
```typescript
<button
  onClick={handleClick}
  disabled={isDisabled}
  aria-label="Adicionar ao carrinho"
  aria-busy={isLoading}
  className="focus:outline-none focus:ring-2 focus:ring-primary"
>
  {isLoading ? <Spinner /> : 'Adicionar'}
</button>
```

---

### **5. RESPONSIVIDADE** ✅

```typescript
□ Mobile-first approach (começa com mobile)
□ Breakpoints definidos (sm, md, lg, xl)
□ Testado em mobile (< 640px)
□ Testado em tablet (640-1024px)
□ Testado em desktop (> 1024px)
□ Touch-friendly em mobile (botões grandes)
□ Não usa hover exclusivo (mobile não tem hover)
```

**Exemplo com Tailwind:**
```typescript
<div className="
  flex flex-col gap-2          /* mobile: coluna */
  md:flex-row md:gap-4         /* tablet+: linha */
  lg:gap-6                     /* desktop: mais espaço */
">
  <Button className="
    w-full                     /* mobile: 100% */
    md:w-auto                  /* tablet+: largura auto */
    h-12                       /* altura touch-friendly */
  ">
    Clique Aqui
  </Button>
</div>
```

---

### **6. PERFORMANCE** ✅

```typescript
□ Memoização quando necessário (useMemo, useCallback, memo)
□ Lazy loading de imagens (loading="lazy")
□ Não re-renderiza desnecessariamente
□ Evita cálculos pesados em render (usar useMemo)
□ Virtualização para listas grandes (>100 itens)
□ Code splitting se componente grande
```

**Exemplo:**
```typescript
import { memo, useMemo, useCallback } from 'react';

export const ProductList = memo(function ProductList({
  products
}: { products: Product[] }) {

  // Memoizar cálculo pesado
  const totalPrice = useMemo(() => {
    return products.reduce((sum, p) => sum + p.price, 0);
  }, [products]);

  // Memoizar callback
  const handleDelete = useCallback((id: string) => {
    deleteProduct(id);
  }, []);

  return (
    <div>
      <p>Total: R$ {totalPrice.toFixed(2)}</p>
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
});
```

---

### **7. ESTILIZAÇÃO** ✅

```typescript
□ Usa Tailwind CSS (preferencial)
□ Ou usa shadcn/ui components
□ Ou usa CSS Modules (evitar CSS global)
□ Classes organizadas e legíveis
□ Cores do design system (via Tailwind)
□ Espaçamentos consistentes
□ Animações suaves (transitions)
```

**Exemplo:**
```typescript
<div className="
  rounded-lg                   /* bordas arredondadas */
  bg-white dark:bg-gray-800    /* tema claro/escuro */
  shadow-md hover:shadow-lg    /* sombra + hover */
  transition-shadow duration-200 /* animação suave */
  p-4 md:p-6                   /* padding responsivo */
">
  {children}
</div>
```

---

### **8. TRATAMENTO DE ERROS** ✅

```typescript
□ Try/catch em operações assíncronas
□ Error boundaries em nível superior
□ Mensagens de erro user-friendly
□ Opção de retry quando aplicável
□ Logging de erros (Sentry/console)
□ Fallback UI quando erro crítico
```

**Exemplo:**
```typescript
export function DataFetcher() {
  const [data, setData] = useState(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const result = await api.getData();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        console.error('Failed to fetch data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (error) {
    return (
      <ErrorAlert
        message={error.message}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // ... resto do código
}
```

---

### **9. DOCUMENTAÇÃO** ✅

```typescript
□ JSDoc com descrição do componente
□ Props documentadas (descrição de cada uma)
□ Exemplos de uso (quando complexo)
□ Comentários em lógica complexa
□ Export nomeado (não default export)
```

**Exemplo:**
```typescript
/**
 * Botão reutilizável com múltiplas variantes e estados.
 *
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Clique Aqui
 * </Button>
 * ```
 */
export function Button({
  /** Conteúdo do botão */
  children,
  /** Função chamada ao clicar */
  onClick,
  /** Variante visual do botão */
  variant = 'primary',
  /** Desabilita o botão */
  disabled = false,
  /** Mostra loading spinner */
  loading = false,
}: ButtonProps) {
  // ...
}
```

---

### **10. TESTES** ✅

```typescript
□ Testes unitários escritos (Vitest)
□ Testa renderização básica
□ Testa todos os estados (loading, error, empty)
□ Testa interações (clicks, inputs)
□ Testa edge cases
□ Testa acessibilidade (ARIA)
□ Coverage > 80% do componente
```

**Exemplo:**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button onClick={() => {}}>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('shows loading state', () => {
    render(<Button onClick={() => {}} loading>Click me</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button onClick={() => {}} disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

---

## 🎯 VALIDAÇÃO FINAL

Antes de considerar o componente 100% completo, verifique:

```
✅ Todos os 10 itens acima estão completos
✅ npm run type-check passa sem erros
✅ npm run lint passa sem erros
✅ npm test passa todos os testes
✅ Componente testado manualmente em dev
✅ Componente responsivo em mobile/tablet/desktop
✅ Acessibilidade testada (keyboard nav)
✅ Code review feito (ou auto-review rigoroso)
```

---

## 📊 SCORE DO COMPONENTE

Calcule o score do componente:

- Cada seção completa = 10 pontos
- **Score total = soma / 10**
- **Meta: 90+/100**

| Seção | Pontos | Status |
|-------|--------|--------|
| 1. TypeScript | /10 | ☐ |
| 2. Estados | /10 | ☐ |
| 3. Validação | /10 | ☐ |
| 4. Acessibilidade | /10 | ☐ |
| 5. Responsividade | /10 | ☐ |
| 6. Performance | /10 | ☐ |
| 7. Estilização | /10 | ☐ |
| 8. Erros | /10 | ☐ |
| 9. Documentação | /10 | ☐ |
| 10. Testes | /10 | ☐ |
| **TOTAL** | **/100** | |

---

## 🚀 COMPONENTE APROVADO!

Quando todas as checkboxes estiverem marcadas e o score >= 90:

```
✅ Componente 100% completo
✅ Pronto para produção
✅ Segue padrões MANUS v7.1
✅ Pode ser reutilizado
```

---

**Última atualização:** 2026-01-15
**Versão:** 7.1
