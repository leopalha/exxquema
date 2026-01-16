# ✅ CHECKLIST: API ROUTE 100% COMPLETA

**Versão:** 7.1
**Projeto:** Flame Lounge
**Tipo:** Template para validação de API Routes (Next.js)

---

## 🎯 OBJETIVO

Este checklist garante que uma API Route está 100% completa e pronta para produção, seguindo os padrões MANUS v7.1.

---

## 📋 CHECKLIST COMPLETO

### **1. TIPAGEM TYPESCRIPT** ✅

```typescript
□ Request tipado corretamente (NextRequest ou Request)
□ Response tipado corretamente (NextResponse)
□ Body da request validado com Zod
□ Query params tipados
□ Headers tipados quando necessário
□ ZERO uso de `any`
```

**Exemplo:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema de validação
const CreateProductSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().positive(),
  categoryId: z.string().uuid(),
});

type CreateProductInput = z.infer<typeof CreateProductSchema>;

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Validar body
  const body = await request.json();
  const validatedData = CreateProductSchema.parse(body);

  // ... rest of the code
}
```

---

### **2. VALIDAÇÃO ZOD** ✅

```typescript
□ Schema Zod definido para body
□ Schema Zod definido para query params (se houver)
□ Validação executa ANTES de qualquer lógica
□ Erros de validação retornam 400 Bad Request
□ Mensagens de erro são claras
```

**Exemplo:**
```typescript
import { z } from 'zod';

const GetProductsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
});

export async function GET(request: NextRequest) {
  try {
    // Validar query params
    const { searchParams } = new URL(request.url);
    const query = GetProductsQuerySchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      search: searchParams.get('search'),
      categoryId: searchParams.get('categoryId'),
    });

    // ... lógica
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validação falhou', details: error.errors },
        { status: 400 }
      );
    }
    // ... outros erros
  }
}
```

---

### **3. AUTENTICAÇÃO E AUTORIZAÇÃO** ✅

```typescript
□ Auth check implementado (quando necessário)
□ Valida token/session antes de processar
□ Retorna 401 Unauthorized se não autenticado
□ Retorna 403 Forbidden se sem permissão
□ User ID extraído do token/session
□ Permissões verificadas (admin, user, etc)
```

**Exemplo:**
```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // 1. Verificar autenticação
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { error: 'Não autenticado' },
      { status: 401 }
    );
  }

  // 2. Verificar permissão
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Sem permissão' },
      { status: 403 }
    );
  }

  // 3. Processar request
  // ...
}
```

---

### **4. TRATAMENTO DE ERROS** ✅

```typescript
□ Try/catch em todas as operações assíncronas
□ Erros de validação retornam 400
□ Erros de auth retornam 401/403
□ Recursos não encontrados retornam 404
□ Erros internos retornam 500
□ Mensagens de erro user-friendly
□ Logging de erros (console.error ou Sentry)
□ Stack trace não exposto em produção
```

**Exemplo:**
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validar ID
    const productId = z.string().uuid().parse(params.id);

    // Buscar produto
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    // Verificar se existe
    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    // Retornar sucesso
    return NextResponse.json(product, { status: 200 });

  } catch (error) {
    // Log do erro
    console.error('Erro ao buscar produto:', error);

    // Validação Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'ID inválido', details: error.errors },
        { status: 400 }
      );
    }

    // Erro genérico
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
```

---

### **5. HTTP STATUS CORRETOS** ✅

```typescript
□ 200 OK para sucesso (GET, PUT)
□ 201 Created para criação (POST)
□ 204 No Content para delete sem retorno
□ 400 Bad Request para validação
□ 401 Unauthorized para auth falhado
□ 403 Forbidden para sem permissão
□ 404 Not Found para recurso não encontrado
□ 409 Conflict para conflito (duplicate key)
□ 500 Internal Server Error para erros não tratados
```

**Exemplo:**
```typescript
// GET - Sucesso
return NextResponse.json(data, { status: 200 });

// POST - Criado
return NextResponse.json(newProduct, { status: 201 });

// DELETE - Sem conteúdo
return new NextResponse(null, { status: 204 });

// Validação falhou
return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });

// Não autenticado
return NextResponse.json({ error: 'Login necessário' }, { status: 401 });

// Sem permissão
return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });

// Não encontrado
return NextResponse.json({ error: 'Recurso não encontrado' }, { status: 404 });

// Conflito (duplicate)
return NextResponse.json({ error: 'Já existe' }, { status: 409 });

// Erro interno
return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
```

---

### **6. SEGURANÇA** ✅

```typescript
□ Proteção contra SQL Injection (Prisma automático)
□ Proteção contra XSS (sanitização de inputs)
□ Rate limiting implementado (se API pública)
□ CORS configurado corretamente
□ Não expõe dados sensíveis (senhas, tokens)
□ Logs não contém dados sensíveis
□ Headers de segurança configurados
```

**Exemplo:**
```typescript
import { ratelimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: 'Muitas requisições. Tente novamente em 1 minuto.' },
      { status: 429 }
    );
  }

  // ... resto da lógica
}

// Não retornar dados sensíveis
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    name: true,
    email: true,
    // NÃO incluir: password, refreshToken, etc
  },
});
```

---

### **7. DATABASE (PRISMA)** ✅

```typescript
□ Usa Prisma Client (não SQL direto)
□ Select específico (não busca campos desnecessários)
□ Includes apenas o necessário
□ Transações quando necessário (múltiplas operações)
□ Error handling de Prisma
□ Validação de relações (FK)
```

**Exemplo:**
```typescript
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const data = CreateOrderSchema.parse(body);

  try {
    // Transação (múltiplas operações)
    const order = await prisma.$transaction(async (tx) => {
      // 1. Criar pedido
      const newOrder = await tx.order.create({
        data: {
          customerId: data.customerId,
          total: data.total,
        },
      });

      // 2. Criar itens do pedido
      await tx.orderItem.createMany({
        data: data.items.map(item => ({
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002: Unique constraint violation
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'Registro já existe' },
          { status: 409 }
        );
      }
      // P2025: Record not found
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Registro não encontrado' },
          { status: 404 }
        );
      }
    }

    throw error; // Re-throw para ser pego pelo catch externo
  }
}
```

---

### **8. LOGGING** ✅

```typescript
□ Log de operações importantes (create, update, delete)
□ Log de erros com contexto
□ Não loga dados sensíveis
□ Logs estruturados (JSON quando possível)
□ Include request ID ou correlation ID
```

**Exemplo:**
```typescript
export async function PUT(request: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    console.log({
      requestId,
      method: 'PUT',
      path: '/api/products',
      timestamp: new Date().toISOString(),
    });

    // ... lógica

    console.log({
      requestId,
      action: 'product_updated',
      productId: product.id,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(product);

  } catch (error) {
    console.error({
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    throw error;
  }
}
```

---

### **9. DOCUMENTAÇÃO** ✅

```typescript
□ JSDoc com descrição da API
□ Documenta método HTTP (GET, POST, PUT, DELETE)
□ Documenta params esperados
□ Documenta response esperado
□ Documenta possíveis erros
□ Exemplos de uso (quando complexo)
```

**Exemplo:**
```typescript
/**
 * API Route: Criar novo produto
 *
 * @route POST /api/products
 * @auth Required (ADMIN only)
 *
 * @body {
 *   name: string (1-100 chars)
 *   price: number (positive)
 *   categoryId: string (UUID)
 * }
 *
 * @returns {Product} 201 - Produto criado com sucesso
 * @returns {Error} 400 - Dados inválidos
 * @returns {Error} 401 - Não autenticado
 * @returns {Error} 403 - Sem permissão (não é admin)
 * @returns {Error} 500 - Erro interno
 *
 * @example
 * ```typescript
 * const response = await fetch('/api/products', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     name: 'Pizza Margherita',
 *     price: 45.90,
 *     categoryId: '123e4567-e89b-12d3-a456-426614174000',
 *   }),
 * });
 * const product = await response.json();
 * ```
 */
export async function POST(request: NextRequest) {
  // ...
}
```

---

### **10. TESTES** ✅

```typescript
□ Testes de integração escritos
□ Testa caso de sucesso (200/201)
□ Testa validação (400)
□ Testa autenticação (401/403)
□ Testa not found (404)
□ Testa edge cases
□ Testa com dados reais (database test)
□ Coverage > 80% da API
```

**Exemplo:**
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { POST } from './route';

describe('POST /api/products', () => {
  beforeEach(async () => {
    // Limpar database de teste
    await prisma.product.deleteMany();
  });

  it('creates product successfully', async () => {
    const request = new Request('http://localhost/api/products', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Pizza',
        price: 45.90,
        categoryId: 'valid-uuid',
      }),
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.name).toBe('Pizza');
    expect(data.price).toBe(45.90);
  });

  it('returns 400 for invalid data', async () => {
    const request = new Request('http://localhost/api/products', {
      method: 'POST',
      body: JSON.stringify({
        name: '', // Invalid: empty
        price: -10, // Invalid: negative
      }),
    });

    const response = await POST(request as any);

    expect(response.status).toBe(400);
  });

  it('returns 401 for unauthenticated request', async () => {
    // Mock sem session
    const request = new Request('http://localhost/api/products', {
      method: 'POST',
      body: JSON.stringify(validData),
    });

    const response = await POST(request as any);

    expect(response.status).toBe(401);
  });
});
```

---

## 🎯 VALIDAÇÃO FINAL

Antes de considerar a API 100% completa, verifique:

```
✅ Todos os 10 itens acima estão completos
✅ npm run type-check passa sem erros
✅ npm run lint passa sem erros
✅ npm test passa todos os testes da API
✅ API testada manualmente (Postman/Thunder Client)
✅ Testada com dados válidos e inválidos
✅ Testada com e sem autenticação
✅ Documentada em docs/api-documentation.md
```

---

## 📊 SCORE DA API

Calcule o score da API:

- Cada seção completa = 10 pontos
- **Score total = soma / 10**
- **Meta: 90+/100**

| Seção | Pontos | Status |
|-------|--------|--------|
| 1. TypeScript | /10 | ☐ |
| 2. Validação Zod | /10 | ☐ |
| 3. Auth | /10 | ☐ |
| 4. Erros | /10 | ☐ |
| 5. HTTP Status | /10 | ☐ |
| 6. Segurança | /10 | ☐ |
| 7. Database | /10 | ☐ |
| 8. Logging | /10 | ☐ |
| 9. Documentação | /10 | ☐ |
| 10. Testes | /10 | ☐ |
| **TOTAL** | **/100** | |

---

## 🚀 API APROVADA!

Quando todas as checkboxes estiverem marcadas e o score >= 90:

```
✅ API 100% completa
✅ Pronta para produção
✅ Segue padrões MANUS v7.1
✅ Segura e testada
```

---

**Última atualização:** 2026-01-15
**Versão:** 7.1
