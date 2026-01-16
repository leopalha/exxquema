# 🔄 AGENT LOOP PATTERNS - MANUS v7.1

**Versão:** 7.1
**Projeto:** Flame Lounge
**Tipo:** Padrões e exemplos de execução do Agent Loop

---

## 🎯 VISÃO GERAL

Este documento contém padrões comprovados de como executar o Agent Loop de 6 fases para diferentes tipos de tarefas. Use como referência para garantir consistência e qualidade.

---

## 📐 O AGENT LOOP (6 FASES)

```
┌─────────────────────────────────────────────────────────────┐
│ ANALISAR → PLANEJAR → EXECUTAR → OBSERVAR → ITERAR → ENTREGAR │
│    ↑                                                     ↓    │
│    └───────────────── REFINAR (se necessário) ───────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 PADRÃO 1: CRIAR NOVO COMPONENTE

### Exemplo: Criar componente Button

#### FASE 1: ANALISAR (5 min)

```typescript
✓ Ler ACTIVATION_PROMPT.md (contexto geral)
✓ Ler docs/tasks.md (verificar se está na lista)
✓ Buscar componentes similares existentes:
  - Glob "**/*Button*.tsx"
  - Grep "export.*Button"
✓ Verificar design system (cores, tamanhos)
✓ Decidir: não precisa consultar agentes (< 15 min)
```

**Comandos:**
```bash
# Buscar componentes button existentes
Glob: **/*Button*.tsx
Grep: pattern="export.*Button" output_mode="files_with_matches"

# Verificar design system
Read: src/styles/design-system.ts (se existe)
```

#### FASE 2: PLANEJAR (5 min)

```typescript
✓ Definir escopo:
  - Arquivo: src/components/ui/Button.tsx
  - Variantes: primary, secondary, outline, ghost
  - Tamanhos: sm, md, lg
  - Estados: loading, disabled
  - Props: onClick, children, variant, size, disabled, loading

✓ Criar checklist:
  [ ] Criar arquivo Button.tsx
  [ ] Definir interface ButtonProps
  [ ] Implementar componente
  [ ] Adicionar todos os estados (loading, disabled, etc)
  [ ] Estilizar com Tailwind
  [ ] Garantir acessibilidade (ARIA)
  [ ] Criar testes unitários
  [ ] Atualizar docs/tasks.md

✓ Não consultar agentes (tarefa < 15 min)
```

#### FASE 3: EXECUTAR (10 min)

```typescript
// src/components/ui/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  ...props
}: ButtonProps) {
  const baseStyles = 'rounded-lg font-medium transition-all focus:outline-none focus:ring-2';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-secondary text-white hover:bg-secondary/90',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10',
    ghost: 'text-primary hover:bg-primary/10',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      disabled={disabled || loading}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Spinner className="h-4 w-4" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}

// Testes
describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalled();
  });

  // ... mais testes
});
```

#### FASE 4: OBSERVAR (5 min)

```bash
# Validar TypeScript
npm run type-check
# ✅ 0 erros

# Rodar testes
npm test Button.test.tsx
# ✅ Todos passando

# Teste manual
npm run dev
# ✅ Componente renderiza corretamente
```

#### FASE 5: ITERAR (se necessário)

```typescript
✓ Sem erros TypeScript ✅
✓ Todos testes passando ✅
✓ Componente funciona bem ✅

→ Não precisa iterar, avançar para ENTREGAR
```

#### FASE 6: ENTREGAR (5 min)

```markdown
✓ Atualizar docs/tasks.md:
  - [x] Criar componente Button (DONE)

✓ Não recalcular Score 7D (mudança pequena)

✓ Commit (se solicitado):
  git add src/components/ui/Button.tsx src/components/ui/Button.test.tsx
  git commit -m "feat: add Button component with variants and loading state"

✓ Reportar ao usuário:
  "Componente Button criado com sucesso!
   - Arquivo: src/components/ui/Button.tsx
   - Variantes: primary, secondary, outline, ghost
   - Tamanhos: sm, md, lg
   - Estados: loading, disabled
   - Testes: 100% cobertura
   - TypeScript: 0 erros"
```

---

## 🔌 PADRÃO 2: CRIAR API ROUTE

### Exemplo: API de Produtos (GET /api/products)

#### FASE 1: ANALISAR (5 min)

```typescript
✓ Ler ACTIVATION_PROMPT.md
✓ Ler docs/tasks.md
✓ Buscar APIs similares:
  - Glob "app/api/**/route.ts"
  - Grep "export.*GET"
✓ Verificar schema Prisma (Product model)
✓ Verificar auth necessário
✓ Decidir: consultar HELIOS (segurança) - tarefa média (30 min)
```

**Comandos:**
```bash
Glob: app/api/**/route.ts
Read: prisma/schema.prisma
Task: Consultar HELIOS sobre auth e validação para API de produtos
```

#### FASE 2: PLANEJAR (10 min)

```typescript
✓ Definir escopo:
  - Arquivo: app/api/products/route.ts
  - Método: GET (listar produtos)
  - Query params: page, limit, search, categoryId
  - Auth: Sim (Bearer token)
  - Validação: Zod para query params
  - Paginação: Sim
  - Filtros: Por categoria e busca

✓ Consultar agentes:
  - HELIOS: Validar auth strategy e rate limiting
  - ARIA: Revisar query Prisma e otimizações

✓ Criar checklist detalhado (ver template API_CHECKLIST.md)

✓ Atualizar docs/tasks.md
```

#### FASE 3: EXECUTAR (20 min)

```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Schema de validação
const GetProductsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
});

export async function GET(request: NextRequest) {
  try {
    // 1. Auth check
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // 2. Validar query params
    const { searchParams } = new URL(request.url);
    const query = GetProductsQuerySchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      search: searchParams.get('search'),
      categoryId: searchParams.get('categoryId'),
    });

    // 3. Construir filtros
    const where = {
      ...(query.search && {
        OR: [
          { name: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } },
        ],
      }),
      ...(query.categoryId && { categoryId: query.categoryId }),
      isActive: true, // Apenas produtos ativos
    };

    // 4. Buscar produtos (paginado)
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        take: query.limit,
        skip: (query.page - 1) * query.limit,
        orderBy: { position: 'asc' },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          image: true,
          category: { select: { id: true, name: true } },
          isActive: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    // 5. Retornar com paginação
    return NextResponse.json({
      data: products,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    });

  } catch (error) {
    console.error('Erro ao buscar produtos:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validação falhou', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Testes
describe('GET /api/products', () => {
  it('returns paginated products', async () => {
    const request = new NextRequest('http://localhost/api/products?page=1&limit=10');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toBeArrayOfSize(10);
    expect(data.pagination).toMatchObject({
      page: 1,
      limit: 10,
    });
  });

  // ... mais testes
});
```

#### FASE 4: OBSERVAR (10 min)

```bash
# Validar TypeScript
npm run type-check
# ✅ 0 erros

# Rodar testes
npm test -- products/route.test.ts
# ✅ Todos passando

# Teste manual (Postman/Thunder Client)
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/products
# ✅ API retorna produtos corretamente
```

#### FASE 5: ITERAR (se necessário)

```typescript
✓ Consultar ORACLE para revisar testes ✅
✓ Adicionar testes de edge cases (página inválida, etc)
✓ Re-rodar testes ✅
```

#### FASE 6: ENTREGAR (5 min)

```markdown
✓ Atualizar docs/tasks.md: [x] API GET /api/products (DONE)
✓ Não recalcular Score 7D (mudança média)
✓ Commit:
  feat: add GET /api/products with pagination and filters
✓ Reportar:
  "API GET /api/products criada com sucesso!
   - Paginação: ✅
   - Filtros: search, categoryId
   - Auth: Bearer token
   - Validação: Zod
   - Testes: 90% cobertura"
```

---

## 🏗️ PADRÃO 3: FEATURE COMPLEXA (> 45 min)

### Exemplo: Sistema de Pedidos Completo

#### FASE 1: ANALISAR (15 min)

```typescript
✓ Ler ACTIVATION_PROMPT.md
✓ Ler docs/tasks.md (verificar scope completo)
✓ Analisar código existente (Orders, OrderItems, Products)
✓ Verificar schema Prisma
✓ Identificar dependências (Products API, Tables API)
✓ Decidir: consultar NEXUS + EXECUTOR + HELIOS + ARIA (4 agentes, tarefa > 45 min)
```

#### FASE 2: PLANEJAR (20 min)

```typescript
✓ Consultar agentes em paralelo:
  - NEXUS: Arquitetura geral (fluxo de pedidos, states)
  - EXECUTOR: Implementação frontend (componentes, forms)
  - HELIOS: Segurança (auth, validação, proteções)
  - ARIA: Database (schema, queries, transactions)

✓ Definir escopo completo:
  Backend:
  - POST /api/orders (criar pedido)
  - GET /api/orders (listar pedidos)
  - GET /api/orders/[id] (detalhe pedido)
  - PATCH /api/orders/[id]/status (atualizar status)
  - DELETE /api/orders/[id] (cancelar)

  Frontend:
  - Página: app/orders/page.tsx (lista)
  - Página: app/orders/[id]/page.tsx (detalhe)
  - Componente: OrderForm (criar pedido)
  - Componente: OrderCard (item da lista)
  - Componente: OrderStatusBadge (status visual)

  Database:
  - Validar schema Order, OrderItem
  - Criar migrations se necessário

✓ Criar checklist detalhado (30+ sub-tasks)

✓ Atualizar docs/tasks.md com todas as sub-tasks
```

#### FASE 3: EXECUTAR (60-90 min)

```typescript
// Implementar uma de cada vez:
1. Backend APIs (5 routes)
2. Frontend pages (2 pages)
3. Frontend components (3 components)
4. Testes para tudo

// Seguir checklists:
- API_CHECKLIST.md para cada route
- COMPONENT_CHECKLIST.md para cada componente
- PAGE_CHECKLIST.md para cada página
```

#### FASE 4: OBSERVAR (15 min)

```bash
npm run type-check  # ✅
npm test            # ✅
npm run build       # ✅
npm run dev         # ✅ Teste manual completo
```

#### FASE 5: ITERAR (20-30 min)

```typescript
✓ Consultar ORACLE (revisar testes) ✅
✓ Consultar ATLAS (revisar UX) ✅
✓ Corrigir issues encontrados ✅
✓ Re-validar tudo ✅
```

#### FASE 6: ENTREGAR (10 min)

```markdown
✓ Atualizar docs/tasks.md: [x] Sistema de Pedidos completo (DONE)
✓ **RECALCULAR Score 7D** (mudança grande)
✓ Commit detalhado:
  feat: implement complete orders system

  - Backend: 5 API routes (CRUD + status update)
  - Frontend: 2 pages + 3 components
  - Tests: 85% coverage
  - TypeScript: 0 errors
  - All checklists validated

  Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>

✓ Reportar completo ao usuário
```

---

## 💡 DICAS E MELHORES PRÁTICAS

### ✅ DO's

1. **Sempre ler docs/tasks.md primeiro**
2. **Buscar código similar antes de criar novo** (DRY)
3. **Consultar agentes para tasks > 15 min**
4. **Validar TypeScript e testes antes de entregar**
5. **Atualizar tasks.md em cada fase relevante**
6. **Recalcular Score 7D após features grandes**
7. **Usar checklists (Component, API, Page)**
8. **Commitar com Conventional Commits**

### ❌ DON'Ts

1. **Nunca pular análise (Fase 1)**
2. **Nunca criar código sem planejar (Fase 2)**
3. **Nunca entregar sem validar (Fase 4)**
4. **Nunca fingir que consultou agentes**
5. **Nunca usar `any` no TypeScript**
6. **Nunca esquecer de atualizar tasks.md**
7. **Nunca duplicar código (buscar primeiro)**
8. **Nunca commitar com erros TypeScript**

---

## 📊 TEMPO ESTIMADO POR TIPO DE TASK

| Tipo de Task | Tempo Total | ANALISAR | PLANEJAR | EXECUTAR | OBSERVAR | ITERAR | ENTREGAR |
|---|---|---|---|---|---|---|---|
| **Simples** (bug fix, typo) | 5-15 min | 2 min | 2 min | 5 min | 2 min | 2 min | 2 min |
| **Média** (componente, API) | 15-45 min | 5 min | 5 min | 20 min | 5 min | 5 min | 5 min |
| **Grande** (feature completa) | 45-120 min | 15 min | 20 min | 60 min | 15 min | 30 min | 10 min |

---

**Última atualização:** 2026-01-15
**Versão:** 7.1
