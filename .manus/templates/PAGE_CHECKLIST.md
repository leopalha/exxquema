# ✅ CHECKLIST: PÁGINA 100% COMPLETA

**Versão:** 7.1
**Projeto:** Flame Lounge
**Tipo:** Template para validação de páginas Next.js

---

## 🎯 OBJETIVO

Este checklist garante que uma página Next.js está 100% completa e pronta para produção, seguindo os padrões MANUS v7.1.

---

## 📋 CHECKLIST COMPLETO

### **1. ESTRUTURA E TIPAGEM** ✅

```typescript
□ Usa App Router do Next.js 14+
□ Arquivo page.tsx na estrutura correta
□ Props tipadas (params, searchParams)
□ Metadata exportada (SEO)
□ ZERO uso de `any`
□ TypeScript strict mode
```

**Exemplo:**
```typescript
// app/products/[id]/page.tsx
import { Metadata } from 'next';

interface ProductPageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({
  params
}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.id);

  return {
    title: `${product.name} | Flame Lounge`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({
  params,
  searchParams
}: ProductPageProps) {
  // ...
}
```

---

### **2. SEO E METADATA** ✅

```typescript
□ Title tag único e descritivo
□ Meta description (150-160 caracteres)
□ Open Graph tags (og:title, og:description, og:image)
□ Twitter Card tags
□ Canonical URL (quando necessário)
□ Robots meta (index, follow)
□ Schema.org markup (quando aplicável)
```

**Exemplo:**
```typescript
export const metadata: Metadata = {
  title: 'Cardápio | Flame Lounge Bar & Restaurant',
  description: 'Explore nosso cardápio de alta gastronomia com pratos exclusivos e drinks autorais. Flame Lounge Bar & Restaurant.',
  keywords: ['cardápio', 'restaurante', 'bar', 'gastronomia', 'drinks'],
  authors: [{ name: 'Flame Lounge' }],
  creator: 'Flame Lounge',
  publisher: 'Flame Lounge',

  openGraph: {
    title: 'Cardápio | Flame Lounge',
    description: 'Explore nosso cardápio de alta gastronomia',
    url: 'https://flamelounge.com/cardapio',
    siteName: 'Flame Lounge',
    images: [{
      url: 'https://flamelounge.com/og-cardapio.jpg',
      width: 1200,
      height: 630,
      alt: 'Cardápio Flame Lounge',
    }],
    locale: 'pt_BR',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Cardápio | Flame Lounge',
    description: 'Explore nosso cardápio de alta gastronomia',
    images: ['https://flamelounge.com/og-cardapio.jpg'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};
```

---

### **3. COMPONENTES E ESTADOS** ✅

```typescript
□ Todos componentes têm loading state
□ Todos componentes têm error state
□ Empty states implementados
□ Error Boundary na página ou layout
□ Suspense boundaries quando necessário
□ Skeleton loaders para conteúdo assíncrono
```

**Exemplo:**
```typescript
import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ProductList } from '@/components/ProductList';
import { ProductListSkeleton } from '@/components/ProductListSkeleton';

export default function ProductsPage() {
  return (
    <ErrorBoundary>
      <div>
        <h1>Nossos Produtos</h1>

        <Suspense fallback={<ProductListSkeleton />}>
          <ProductList />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}
```

---

### **4. RESPONSIVIDADE** ✅

```typescript
□ Mobile-first design
□ Testado em mobile (<640px)
□ Testado em tablet (640-1024px)
□ Testado em desktop (>1024px)
□ Breakpoints consistentes (Tailwind)
□ Touch-friendly (botões grandes em mobile)
□ Menu hamburger em mobile (se header)
□ Imagens responsivas (sizes, srcset)
```

**Exemplo:**
```typescript
export default function HomePage() {
  return (
    <div className="container mx-auto px-4">
      {/* Grid responsivo */}
      <div className="
        grid grid-cols-1        /* mobile: 1 coluna */
        md:grid-cols-2          /* tablet: 2 colunas */
        lg:grid-cols-3          /* desktop: 3 colunas */
        gap-4 md:gap-6 lg:gap-8 /* espaçamento responsivo */
      ">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Imagem responsiva */}
      <Image
        src="/hero.jpg"
        alt="Flame Lounge"
        width={1200}
        height={600}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority
      />
    </div>
  );
}
```

---

### **5. ACESSIBILIDADE** ✅

```typescript
□ Heading hierarchy correta (h1 → h2 → h3)
□ ARIA labels quando necessário
□ Keyboard navigation funciona
□ Focus visible em elementos interativos
□ Skip links implementados
□ Color contrast adequado (WCAG 2.1 AA)
□ Alt text em todas as imagens
□ Forms com labels corretos
```

**Exemplo:**
```typescript
export default function ProductsPage() {
  return (
    <main>
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
      >
        Pular para conteúdo principal
      </a>

      {/* Heading hierarchy */}
      <h1>Nossos Produtos</h1>

      <section aria-labelledby="featured-products">
        <h2 id="featured-products">Produtos em Destaque</h2>
        {/* ... */}
      </section>

      <section aria-labelledby="all-products">
        <h2 id="all-products">Todos os Produtos</h2>
        <div id="main-content">
          {/* Conteúdo principal */}
        </div>
      </section>
    </main>
  );
}
```

---

### **6. PERFORMANCE** ✅

```typescript
□ Lazy loading de componentes pesados
□ Code splitting implementado
□ Imagens otimizadas (next/image)
□ Fontes otimizadas (next/font)
□ Preload de recursos críticos
□ Prefetch de links importantes
□ Bundle size otimizado
□ Core Web Vitals verdes
```

**Exemplo:**
```typescript
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Inter } from 'next/font/google';

// Lazy load componente pesado
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // Desabilitar SSR se necessário
});

// Otimizar fonte
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function DashboardPage() {
  return (
    <div className={inter.className}>
      {/* Imagem otimizada */}
      <Image
        src="/banner.jpg"
        alt="Banner"
        width={1200}
        height={400}
        priority // Preload imagem acima da dobra
        quality={85}
      />

      {/* Componente pesado lazy loaded */}
      <HeavyChart data={data} />

      {/* Prefetch links importantes */}
      <Link href="/products" prefetch>
        Ver Produtos
      </Link>
    </div>
  );
}
```

---

### **7. DATA FETCHING** ✅

```typescript
□ Server Components quando possível (padrão)
□ Client Components apenas quando necessário
□ Revalidação configurada (ISR)
□ Cache strategy definida
□ Error handling em fetch
□ Loading states durante fetch
□ Parallel fetching quando possível
```

**Exemplo:**
```typescript
// Server Component (padrão)
async function getProducts() {
  const res = await fetch('https://api.flamelounge.com/products', {
    next: {
      revalidate: 3600, // ISR: revalidar a cada 1 hora
      tags: ['products'], // Cache tag para invalidação
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  return res.json();
}

export default async function ProductsPage() {
  // Parallel fetching
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div>
      <h1>Produtos</h1>
      <ProductList products={products} categories={categories} />
    </div>
  );
}

// Revalidate programmatically
import { revalidateTag } from 'next/cache';

// Em API route ou Server Action
revalidateTag('products'); // Invalida cache de produtos
```

---

### **8. ERROR HANDLING** ✅

```typescript
□ Error Boundary implementado
□ error.tsx na pasta da rota
□ not-found.tsx para 404s
□ Mensagens de erro user-friendly
□ Opção de retry/voltar
□ Logging de erros (Sentry)
```

**Exemplo:**
```typescript
// app/products/error.tsx
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to Sentry
    console.error('Products page error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-2xl font-bold mb-4">
        Algo deu errado!
      </h2>
      <p className="text-gray-600 mb-6">
        Não conseguimos carregar os produtos. Tente novamente.
      </p>
      <Button onClick={reset}>
        Tentar Novamente
      </Button>
    </div>
  );
}

// app/products/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-2xl font-bold mb-4">
        Página não encontrada
      </h2>
      <p className="text-gray-600 mb-6">
        O produto que você procura não existe.
      </p>
      <Button asChild>
        <Link href="/products">Ver todos os produtos</Link>
      </Button>
    </div>
  );
}
```

---

### **9. SEGURANÇA** ✅

```typescript
□ Auth check para páginas protegidas
□ Redirect para login se não autenticado
□ Sanitização de query params
□ Validação de params da URL
□ Headers de segurança configurados
□ Não expõe dados sensíveis no client
```

**Exemplo:**
```typescript
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function DashboardPage() {
  // Auth check
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Verificar permissão
  if (session.user.role !== 'ADMIN') {
    redirect('/unauthorized');
  }

  return (
    <div>
      <h1>Dashboard Admin</h1>
      {/* Conteúdo protegido */}
    </div>
  );
}

// Validar params
interface PageProps {
  params: { id: string };
}

export default async function ProductPage({ params }: PageProps) {
  // Validar UUID
  const productId = z.string().uuid().parse(params.id);

  // Buscar produto
  const product = await getProduct(productId);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
```

---

### **10. TESTES E DOCUMENTAÇÃO** ✅

```typescript
□ Testes E2E escritos (Playwright)
□ Testa fluxo principal da página
□ Testa navegação entre páginas
□ Testa formulários (se houver)
□ Testa estados (loading, error, empty)
□ Lighthouse score > 90
□ Documentada em docs/ (se necessário)
```

**Exemplo:**
```typescript
// tests/e2e/products.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Products Page', () => {
  test('should display products list', async ({ page }) => {
    await page.goto('/products');

    // Verificar título
    await expect(page.getByRole('heading', { name: 'Produtos' })).toBeVisible();

    // Verificar que produtos foram carregados
    await expect(page.getByTestId('product-card')).toHaveCount(10);
  });

  test('should navigate to product detail', async ({ page }) => {
    await page.goto('/products');

    // Clicar no primeiro produto
    await page.getByTestId('product-card').first().click();

    // Verificar que navegou
    await expect(page).toHaveURL(/\/products\/[a-z0-9-]+/);

    // Verificar que página de detalhe carregou
    await expect(page.getByTestId('product-detail')).toBeVisible();
  });

  test('should show error state when API fails', async ({ page }) => {
    // Mock API failure
    await page.route('**/api/products', route => {
      route.fulfill({ status: 500 });
    });

    await page.goto('/products');

    // Verificar mensagem de erro
    await expect(page.getByText('Algo deu errado')).toBeVisible();

    // Verificar botão de retry
    await expect(page.getByRole('button', { name: 'Tentar Novamente' })).toBeVisible();
  });
});
```

---

## 🎯 VALIDAÇÃO FINAL

Antes de considerar a página 100% completa, verifique:

```
✅ Todos os 10 itens acima estão completos
✅ npm run build passa sem erros
✅ npm run type-check passa sem erros
✅ npm run lint passa sem erros
✅ Testes E2E passam (npm run test:e2e)
✅ Lighthouse score > 90 (Performance, Accessibility, Best Practices, SEO)
✅ Página testada manualmente em dev
✅ Testada em mobile, tablet e desktop
✅ Testada com slow 3G (DevTools)
✅ Acessibilidade testada (keyboard nav, screen reader)
```

---

## 📊 SCORE DA PÁGINA

Calcule o score da página:

- Cada seção completa = 10 pontos
- **Score total = soma / 10**
- **Meta: 90+/100**

| Seção | Pontos | Status |
|-------|--------|--------|
| 1. Estrutura/Tipagem | /10 | ☐ |
| 2. SEO/Metadata | /10 | ☐ |
| 3. Componentes/Estados | /10 | ☐ |
| 4. Responsividade | /10 | ☐ |
| 5. Acessibilidade | /10 | ☐ |
| 6. Performance | /10 | ☐ |
| 7. Data Fetching | /10 | ☐ |
| 8. Error Handling | /10 | ☐ |
| 9. Segurança | /10 | ☐ |
| 10. Testes/Docs | /10 | ☐ |
| **TOTAL** | **/100** | |

---

## 🚀 PÁGINA APROVADA!

Quando todas as checkboxes estiverem marcadas e o score >= 90:

```
✅ Página 100% completa
✅ Pronta para produção
✅ Segue padrões MANUS v7.1
✅ SEO otimizado
✅ Performance excelente
```

---

**Última atualização:** 2026-01-15
**Versão:** 7.1
