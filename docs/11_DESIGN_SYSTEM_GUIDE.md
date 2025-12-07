# FLAME Design System Guide

## Visão Geral

O Design System do FLAME foi criado para garantir consistência visual e experiência de usuário uniforme em toda a aplicação. Baseado em um tema escuro com acentos em magenta, roxo e ciano.

## Cores

### CSS Variables (Tema Principal)

```css
/* Cores primárias */
--theme-primary: #FF006E;      /* Magenta - Ações principais */
--theme-accent: #B266FF;       /* Roxo - Destaques */
--theme-secondary: #00D4FF;    /* Ciano - Links e info */

/* RGB para gradientes e transparências */
--theme-primary-rgb: 255, 0, 110;
--theme-accent-rgb: 178, 102, 255;
--theme-secondary-rgb: 0, 212, 255;
```

### Paleta de Cinzas

| Token | Hex | Uso |
|-------|-----|-----|
| `black` | `#000000` | Background principal |
| `gray-900` | `#111827` | Cards, containers |
| `gray-800` | `#1F2937` | Inputs, elementos interativos |
| `gray-700` | `#374151` | Bordas, divisores |
| `gray-600` | `#4B5563` | Texto secundário |
| `gray-500` | `#6B7280` | Placeholders |
| `gray-400` | `#9CA3AF` | Texto terciário |
| `gray-300` | `#D1D5DB` | Labels |
| `white` | `#FFFFFF` | Texto principal |

### Cores Semânticas

| Cor | Uso |
|-----|-----|
| `green-500` | Sucesso, confirmação |
| `yellow-500` | Alertas, avisos |
| `red-500` | Erros, danger |
| `blue-500` | Info, links |

## Tipografia

### Fonte Principal
- **Família**: `Inter` (via Tailwind)
- **Fallback**: `system-ui, sans-serif`

### Tamanhos

| Classe | Tamanho | Uso |
|--------|---------|-----|
| `text-xs` | 12px | Badges, hints |
| `text-sm` | 14px | Body text, labels |
| `text-base` | 16px | Parágrafo padrão |
| `text-lg` | 18px | Subtítulos |
| `text-xl` | 20px | Títulos de seção |
| `text-2xl` | 24px | Títulos de card |
| `text-3xl` | 30px | Títulos de página |

## Componentes

### Button

Importação:
```jsx
import Button, { IconButton, ButtonGroup } from '../components/Button';
```

#### Variantes

| Variante | Descrição | Uso |
|----------|-----------|-----|
| `primary` | Magenta sólido | CTAs principais |
| `secondary` | Outline magenta | CTAs secundários |
| `accent` | Roxo sólido | Destaque |
| `ghost` | Transparente | Ações discretas |
| `danger` | Vermelho | Ações destrutivas |
| `success` | Verde | Confirmações |
| `outline` | Borda cinza | Ações neutras |
| `dark` | Cinza escuro | Botões em dark mode |

#### Tamanhos

| Tamanho | Classe |
|---------|--------|
| `xs` | Compacto |
| `sm` | Pequeno |
| `md` | Padrão |
| `lg` | Grande |
| `xl` | Extra grande |

#### Exemplos

```jsx
// Botão primário
<Button variant="primary" onClick={handleClick}>
  Confirmar
</Button>

// Botão com loading
<Button variant="primary" loading>
  Salvando...
</Button>

// Botão com ícone
<Button
  variant="secondary"
  leftIcon={<Plus className="w-4 h-4" />}
>
  Adicionar
</Button>

// Botão de ícone
<IconButton
  variant="ghost"
  icon={<Trash className="w-5 h-5" />}
  aria-label="Excluir"
/>
```

### Input

Importação:
```jsx
import Input, {
  PasswordInput,
  SearchInput,
  TextArea,
  Select,
  Checkbox,
  Toggle
} from '../components/Input';
```

#### Exemplos

```jsx
// Input básico
<Input
  label="Email"
  type="email"
  placeholder="seu@email.com"
  required
/>

// Input com erro
<Input
  label="Nome"
  error="Nome é obrigatório"
/>

// Input de senha
<PasswordInput
  label="Senha"
  placeholder="••••••••"
/>

// Input de busca
<SearchInput
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  onClear={() => setSearch('')}
/>

// Select
<Select
  label="Categoria"
  options={[
    { value: 'food', label: 'Comida' },
    { value: 'drink', label: 'Bebida' },
  ]}
/>

// Toggle
<Toggle
  label="Notificações"
  description="Receber alertas push"
  checked={enabled}
  onChange={(e) => setEnabled(e.target.checked)}
/>
```

### Loading States

Importação:
```jsx
import LoadingSpinner, {
  SkeletonCard,
  SkeletonList,
  SkeletonTable,
  SkeletonChart,
  SkeletonProductCard,
  SkeletonOrderCard,
  SkeletonProfile,
  SkeletonStats,
  SkeletonMenu,
  SkeletonForm,
  InlineLoader,
  PageLoader
} from '../components/LoadingSpinner';
```

#### Uso

```jsx
// Spinner básico
<LoadingSpinner text="Carregando..." />

// Spinner fullscreen
<LoadingSpinner fullScreen text="Processando..." />

// Skeleton de cards
<div className="grid grid-cols-3 gap-4">
  {loading && Array.from({ length: 6 }).map((_, i) => (
    <SkeletonProductCard key={i} />
  ))}
</div>

// Loader de página inteira
{loading && <PageLoader text="Carregando cardápio..." />}

// Loader inline
<InlineLoader text="Buscando..." />
```

## Espaçamento

### Sistema de Grid

| Classe | Valor |
|--------|-------|
| `gap-2` | 8px |
| `gap-4` | 16px |
| `gap-6` | 24px |
| `gap-8` | 32px |

### Padding/Margin

| Classe | Valor |
|--------|-------|
| `p-2` | 8px |
| `p-4` | 16px |
| `p-6` | 24px |
| `p-8` | 32px |

## Border Radius

| Classe | Uso |
|--------|-----|
| `rounded-md` | Pequenos elementos |
| `rounded-lg` | Inputs, botões |
| `rounded-xl` | Cards médios |
| `rounded-2xl` | Cards grandes |
| `rounded-full` | Avatares, badges |

## Sombras

```css
/* Padrão para cards */
.card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Elevação para modais */
.modal {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
```

## Transições

```css
/* Padrão */
transition-all duration-200

/* Para cores */
transition-colors

/* Para escala (hover) */
transition-transform
```

## Animações (Framer Motion)

### Entrada de página

```jsx
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

<motion.div
  variants={pageVariants}
  initial="initial"
  animate="animate"
  exit="exit"
>
  {children}
</motion.div>
```

### Stagger de lista

```jsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

<motion.ul variants={containerVariants} initial="hidden" animate="visible">
  {items.map((item) => (
    <motion.li key={item.id} variants={itemVariants}>
      {item.name}
    </motion.li>
  ))}
</motion.ul>
```

### Hover de botão

```jsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
  Click me
</motion.button>
```

## Ícones

Usando **Lucide React**:

```jsx
import {
  Home,
  ShoppingBag,
  User,
  Settings,
  Plus,
  Minus,
  X,
  Check,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

// Tamanhos padrão
<Home className="w-5 h-5" />  // Padrão
<Home className="w-4 h-4" />  // Pequeno
<Home className="w-6 h-6" />  // Grande
```

## Breakpoints (Responsivo)

| Breakpoint | Min Width | Uso |
|------------|-----------|-----|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Large desktop |
| `2xl` | 1536px | Extra large |

### Exemplo

```jsx
<div className="
  grid
  grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
  gap-4
">
  {products.map(p => <ProductCard key={p.id} {...p} />)}
</div>
```

## Padrões de Layout

### Container de página

```jsx
<div className="min-h-screen bg-black">
  {/* Header sticky */}
  <div className="sticky top-0 z-40 bg-gray-900 border-b border-gray-800 p-4">
    <div className="max-w-7xl mx-auto">
      {/* Header content */}
    </div>
  </div>

  {/* Content */}
  <div className="max-w-7xl mx-auto p-4 sm:p-6">
    {/* Page content */}
  </div>
</div>
```

### Card padrão

```jsx
<div className="bg-gray-900 rounded-2xl border border-gray-700 p-6">
  <h3 className="text-xl font-bold text-white mb-4">Título</h3>
  <p className="text-gray-400">Conteúdo</p>
</div>
```

### Modal

```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
>
  <motion.div
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.95, opacity: 0 }}
    className="bg-gray-800 rounded-2xl p-6 max-w-md w-full border border-gray-700"
  >
    {/* Modal content */}
  </motion.div>
</motion.div>
```

## Temas Disponíveis

O FLAME suporta 6 temas que podem ser alterados pelo usuário:

1. **FLAME** (padrão) - Magenta/Purple/Cyan
2. **INFERNO** - Red/Purple
3. **PASSION** - Wine/Pink
4. **NEON** - Purple/Green
5. **TWILIGHT** - Purple/Lavender
6. **AMBER** - Gold/Pink

A troca de tema é feita via `useThemeStore`:

```jsx
const { currentTheme, setTheme, getPalette } = useThemeStore();
const palette = getPalette();

// Mudar tema
setTheme('inferno');

// Usar cor do tema
<div style={{ color: palette.primary }}>Texto</div>
```

## Boas Práticas

1. **Use CSS Variables** para cores do tema
2. **Sempre use componentes reutilizáveis** (Button, Input) em vez de estilos inline
3. **Mantenha consistência** nos espaçamentos (múltiplos de 4px)
4. **Use Framer Motion** para animações
5. **Teste em diferentes breakpoints**
6. **Garanta contraste adequado** (WCAG AA)
7. **Use estados de loading** apropriados
8. **Sempre inclua estados de erro** nos formulários

---

Última atualização: 07/12/2024
