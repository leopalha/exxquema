# 🔷 TypeScript & Zod - Guia de Uso

> **FLAME Lounge Bar** - Guia completo de TypeScript e Validação Zod

---

## 📚 Índice

1. [Introdução](#introdução)
2. [Configuração TypeScript](#configuração-typescript)
3. [Estrutura de Tipos](#estrutura-de-tipos)
4. [Validação com Zod](#validação-com-zod)
5. [Exemplos Práticos](#exemplos-práticos)
6. [Testes](#testes)
7. [Boas Práticas](#boas-práticas)

---

## 🎯 Introdução

O projeto usa **TypeScript strict mode** para máxima segurança de tipos e **Zod** para validação runtime de dados.

### Por que TypeScript + Zod?

- ✅ **Type Safety**: Erros detectados em compile-time
- ✅ **Validação Runtime**: Dados validados em runtime com Zod
- ✅ **IntelliSense**: Autocomplete e documentação inline
- ✅ **Refactoring Seguro**: Mudanças detectam quebras automaticamente
- ✅ **Menos Bugs**: Validação dupla (compile + runtime)

---

## ⚙️ Configuração TypeScript

### Backend (`backend/tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

**Strict Mode Habilitado:**
- `noImplicitAny`: Não permite `any` implícito
- `strictNullChecks`: `null` e `undefined` devem ser explícitos
- `noUnusedLocals`: Variáveis não usadas são erro
- `noUnusedParameters`: Parâmetros não usados são erro

### Frontend (`frontend/tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "jsx": "preserve",
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## 📦 Estrutura de Tipos

### Backend Types (`backend/src/types/index.ts`)

Todos os tipos do backend estão centralizados:

```typescript
import { User, Order, Reservation } from '@/types';

// User já tem todos os campos tipados
const user: User = {
  id: 1,
  name: 'João',
  email: 'joao@email.com',
  role: 'customer',
  tier: 'gold',
  // ...
};
```

### Frontend Types (`frontend/src/types/index.ts`)

```typescript
import { Product, Cart, OrderStatus } from '@/types';

const product: Product = {
  id: 1,
  name: 'Hambúrguer',
  price: 45.00,
  category: 'food',
  available: true,
};
```

### Tipos Principais

```typescript
// User Types
export type UserRole = 'customer' | 'staff' | 'admin';
export type UserTier = 'bronze' | 'silver' | 'gold' | 'platinum';

// Order Types
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'pix' | 'cash';

// Product Types
export type ProductCategory = 'food' | 'drink' | 'hookah' | 'dessert' | 'combo';
```

---

## ✅ Validação com Zod

### Schemas de Validação

Localizados em `backend/src/validators/`:

- `auth.validator.ts` - Autenticação
- `order.validator.ts` - Pedidos
- `reservation.validator.ts` - Reservas

### Exemplo: Register Schema

```typescript
// backend/src/validators/auth.validator.ts
import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100)
    .trim(),

  email: z
    .string({ required_error: 'Email é obrigatório' })
    .email('Email inválido')
    .toLowerCase()
    .trim(),

  password: z
    .string({ required_error: 'Senha é obrigatória' })
    .min(6)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Senha deve conter maiúsculas, minúsculas e números'
    ),

  phone: z
    .string()
    .regex(/^\+?[1-9]\d{10,14}$/, 'Telefone inválido'),
});

// Inferir tipo TypeScript do schema
export type RegisterInput = z.infer<typeof registerSchema>;
```

### Middleware de Validação

```typescript
// backend/src/middleware/validate.ts
import { validate } from '@/middleware/validate';
import { registerSchema } from '@/validators/auth.validator';

// Uso em rotas
router.post('/register',
  validate(registerSchema), // Valida req.body automaticamente
  authController.register
);
```

---

## 💡 Exemplos Práticos

### 1. Criar Nova Rota com Validação

```typescript
// 1. Criar schema de validação
// backend/src/validators/product.validator.ts
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  price: z.number().positive(),
  category: z.enum(['food', 'drink', 'hookah', 'dessert', 'combo']),
  stock: z.number().int().nonnegative().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

// 2. Usar no controller
// backend/src/controllers/productController.ts
import { Request, Response } from 'express';
import { CreateProductInput } from '@/validators/product.validator';

export async function createProduct(
  req: Request<{}, {}, CreateProductInput>,
  res: Response
) {
  // req.body já está validado e tipado!
  const { name, description, price, category, stock } = req.body;

  // Criar produto...
}

// 3. Aplicar na rota
// backend/src/routes/products.js
import { validate } from '@/middleware/validate';
import { createProductSchema } from '@/validators/product.validator';

router.post('/products',
  authenticate,
  authorize(['admin']),
  validate(createProductSchema),
  productController.createProduct
);
```

### 2. Validar Query Params

```typescript
// Schema para query params
export const productQuerySchema = z.object({
  page: z
    .string()
    .transform(val => parseInt(val, 10))
    .pipe(z.number().int().min(1))
    .optional()
    .default('1'),

  limit: z
    .string()
    .transform(val => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(100))
    .optional()
    .default('20'),

  category: z
    .enum(['food', 'drink', 'hookah', 'dessert', 'combo'])
    .optional(),
});

// Uso
router.get('/products',
  validate(productQuerySchema, 'query'),
  productController.list
);
```

### 3. Validar Múltiplas Fontes

```typescript
import { validateMultiple } from '@/middleware/validate';
import { idParamSchema } from '@/middleware/validate';
import { updateOrderSchema } from '@/validators/order.validator';

router.put('/orders/:id',
  validateMultiple({
    params: idParamSchema,
    body: updateOrderSchema,
  }),
  orderController.update
);
```

---

## 🧪 Testes

### Testar Schemas Zod

```typescript
// backend/src/validators/auth.validator.test.ts
import { describe, it, expect } from 'vitest';
import { registerSchema } from './auth.validator';

describe('Auth Validators', () => {
  it('should validate correct data', () => {
    const validData = {
      name: 'João Silva',
      email: 'joao@email.com',
      password: 'Test123!',
      phone: '+5521999999999',
    };

    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const invalidData = {
      name: 'João Silva',
      email: 'invalid-email',
      password: 'Test123!',
      phone: '+5521999999999',
    };

    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
```

### Rodar Testes

```bash
# Rodar todos os testes
npm test

# Rodar em watch mode
npm run test:watch

# Ver cobertura
npm run test:coverage

# UI interativa
npm run test:ui
```

**Cobertura Atual:**
- ✅ 111 testes
- ✅ 108 passando (97%)
- 🎯 Meta: 70%+ coverage

---

## 🎨 Boas Práticas

### 1. Sempre Tipar Funções

```typescript
// ❌ Ruim
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ Bom
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

### 2. Usar Type Inference do Zod

```typescript
// ❌ Não duplicar definições
const schema = z.object({ name: z.string() });
interface Input { name: string; }

// ✅ Inferir do schema
const schema = z.object({ name: z.string() });
type Input = z.infer<typeof schema>;
```

### 3. Validar na Borda do Sistema

```typescript
// ✅ Validar dados externos SEMPRE
router.post('/endpoint', validate(schema), controller);

// ✅ Dados internos já validados não precisam revalidar
function internalFunction(data: ValidatedData) {
  // data já foi validado antes, pode confiar
}
```

### 4. Tipos Utilitários

```typescript
// Partial - todos os campos opcionais
type UpdateUser = Partial<User>;

// Pick - selecionar campos
type UserPublic = Pick<User, 'id' | 'name' | 'email'>;

// Omit - remover campos
type UserWithoutPassword = Omit<User, 'password'>;

// Record - objeto com chaves específicas
type Errors = Record<string, string>;
```

### 5. Union Types para Estados

```typescript
// ✅ Bom - type safety
type LoadingState = 'idle' | 'loading' | 'success' | 'error';
let state: LoadingState = 'idle';
state = 'loading'; // OK
state = 'loaded'; // ❌ Erro!

// ❌ Ruim - sem type safety
let state = 'idle';
state = 'loaded'; // Sem erro, mas inválido!
```

---

## 🔗 Recursos

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Zod Documentation](https://zod.dev/)
- [Express + TypeScript Guide](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html)

---

## 📊 Status Atual

| Item | Status |
|------|--------|
| TypeScript Strict Mode | ✅ Configurado |
| Tipos Globais | ✅ Criados |
| Validação Zod | ✅ Implementada |
| Testes | ✅ 111 testes (97% pass) |
| Cobertura | 🎯 Em progresso |

---

**Última atualização:** 2026-01-16
**Autor:** MANUS EXECUTOR v7.1
