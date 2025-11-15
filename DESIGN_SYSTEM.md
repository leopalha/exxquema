# 🎨 Red Light Design System

> Modern, professional design system for Exxquema Pub & Lounge Bar
> Built with Tailwind CSS, Framer Motion, and Lucide React icons

---

## Table of Contents

1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Spacing System](#spacing-system)
4. [Components](#components)
5. [Animations](#animations)
6. [Effects & Utilities](#effects--utilities)
7. [Responsive Breakpoints](#responsive-breakpoints)
8. [Code Examples](#code-examples)

---

## Color Palette

### Primary Colors (Orange Spectrum)

Our brand identity is built around vibrant orange tones that evoke energy, warmth, and connection.

```css
/* Primary Orange Colors */
--color-primary: #FF6B35;           /* Main Brand Orange */
--color-primary-dark: #E85A24;      /* Darker Orange */
--color-primary-light: #FF8C5A;     /* Lighter Orange */
--color-primary-glow: rgba(255, 107, 53, 0.3); /* Glow Effect */

/* Secondary Orange */
--color-golden: #F7931E;            /* Golden Orange */
```

**Tailwind Classes:**
```jsx
// Backgrounds
bg-primary-500      // #FF6B35
bg-primary-600      // #F7931E
bg-primary-700      // #c2410c

// Text
text-primary-500    // Orange text
text-orange-400     // Lighter orange

// Borders
border-primary-500
border-orange-500
```

### Dark Theme Colors

```css
/* Backgrounds */
--color-background: #000000;         /* Pure Black */
--color-surface: #0a0a0a;           /* Dark Surface */
--color-surface-elevated: #1a1a1a;  /* Elevated Surface */
--color-surface-hover: #262626;     /* Hover State */

/* Borders */
--color-border: #262626;
--color-border-light: #404040;
```

**Tailwind Classes:**
```jsx
bg-black          // #000000
bg-gray-900       // #0a0a0a
bg-gray-800       // #1a1a1a
border-gray-700   // Border color
```

### Text Colors

```css
--color-text-primary: #ffffff;      /* White */
--color-text-secondary: #a1a1a1;    /* Gray */
--color-text-tertiary: #737373;     /* Darker Gray */
```

**Tailwind Classes:**
```jsx
text-white        // Primary text
text-gray-400     // Secondary text
text-gray-500     // Tertiary text
```

### Semantic Colors

```css
--color-success: #10b981;   /* Green */
--color-warning: #f59e0b;   /* Amber */
--color-error: #ef4444;     /* Red */
--color-info: #3b82f6;      /* Blue */
```

**Tailwind Classes:**
```jsx
text-green-400    // Success
text-yellow-400   // Warning
text-red-400      // Error
text-blue-400     // Info
```

### Color Usage Examples

```jsx
// Hero sections with gradient overlay
<div className="bg-gradient-to-br from-black via-gray-900 to-black">
  <div className="absolute inset-0 bg-gradient-radial from-orange-500/20 to-transparent" />
</div>

// Cards with border accent
<div className="bg-gray-800 border border-gray-700 hover:border-orange-500">
  Content
</div>

// Buttons with orange gradient
<button className="bg-gradient-to-r from-orange-500 to-orange-600">
  Click me
</button>
```

---

## Typography

### Font Family

```css
font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI',
             'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
```

**Tailwind Classes:**
```jsx
font-sans         // Montserrat
font-display      // Montserrat (for headings)
font-body         // Montserrat (for body text)
```

### Heading Scale

```jsx
// H1 - Hero Headings
<h1 className="text-5xl md:text-7xl font-bold text-white">
  Exxquema
</h1>

// H2 - Section Headings
<h2 className="text-3xl md:text-5xl font-bold text-white">
  Nossa História
</h2>

// H3 - Subsection Headings
<h3 className="text-2xl md:text-3xl font-semibold text-white">
  Drinks Autorais
</h3>

// H4 - Card Titles
<h4 className="text-xl font-semibold text-white">
  Moscow Mule
</h4>
```

### Typography Utilities

```css
/* Responsive Font Sizes */
h1 { font-size: clamp(2.5rem, 5vw, 4rem); }
h2 { font-size: clamp(2rem, 4vw, 3rem); }
h3 { font-size: clamp(1.5rem, 3vw, 2rem); }

/* Letter Spacing */
letter-spacing: -0.025em;  /* Headings */
```

**Tailwind Classes:**
```jsx
// Font Weights
font-normal       // 400
font-medium       // 500
font-semibold     // 600
font-bold         // 700
font-extrabold    // 800

// Letter Spacing
tracking-tight    // -0.025em
tracking-normal   // 0
tracking-wide     // 0.025em

// Line Height
leading-none      // 1
leading-tight     // 1.25
leading-normal    // 1.5
leading-relaxed   // 1.75
```

### Text Styles

```jsx
// Gradient Text
<h1 className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
  Gradient Heading
</h1>

// Orange Gradient Text
<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
  Highlighted Text
</span>

// Body Text
<p className="text-gray-400 leading-relaxed">
  Regular paragraph text with good readability
</p>
```

---

## Spacing System

### Base Spacing Scale

```css
--spacing-xs: 0.25rem;    /* 4px */
--spacing-sm: 0.5rem;     /* 8px */
--spacing-md: 1rem;       /* 16px */
--spacing-lg: 1.5rem;     /* 24px */
--spacing-xl: 2rem;       /* 32px */
--spacing-2xl: 3rem;      /* 48px */
```

### Tailwind Spacing

```jsx
// Padding
p-1    // 4px
p-2    // 8px
p-4    // 16px
p-6    // 24px
p-8    // 32px
p-12   // 48px

// Margin
m-1, m-2, m-4, m-6, m-8, m-12

// Gap (for Flexbox/Grid)
gap-1, gap-2, gap-4, gap-6, gap-8
```

### Section Spacing

```jsx
// Standard Section
<section className="py-16 md:py-24 px-4">
  Content
</section>

// Large Section
<section className="py-20 md:py-32 px-6">
  Content
</section>

// Container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  Content
</div>
```

---

## Components

### Buttons

#### Primary Button (Orange Gradient)

```jsx
// Basic Primary Button
<button className="bg-gradient-to-r from-orange-500 to-orange-600
                   text-white font-semibold px-6 py-3 rounded-lg
                   hover:from-orange-600 hover:to-orange-700
                   transition-all duration-300 shadow-lg
                   hover:shadow-orange-glow">
  Primary Action
</button>

// With Framer Motion
<motion.button
  whileHover={{ scale: 1.02, y: -2 }}
  whileTap={{ scale: 0.98 }}
  className="bg-gradient-to-r from-orange-500 to-orange-600
             text-white font-semibold px-6 py-3 rounded-lg
             shadow-lg hover:shadow-orange-glow"
>
  Animated Button
</motion.button>
```

#### Secondary Button

```jsx
<button className="bg-gray-800 text-white font-semibold px-6 py-3
                   rounded-lg border border-gray-700
                   hover:border-orange-500 hover:bg-gray-700
                   transition-all duration-300">
  Secondary Action
</button>
```

#### Ghost Button

```jsx
<button className="bg-transparent text-gray-300 font-medium px-4 py-2
                   rounded-lg hover:bg-gray-800 transition-colors">
  Ghost Button
</button>
```

#### Button Sizes

```jsx
// Small
<button className="px-4 py-2 text-sm">Small</button>

// Medium (Default)
<button className="px-6 py-3 text-base">Medium</button>

// Large
<button className="px-8 py-4 text-lg">Large</button>
```

### Cards

#### Basic Card

```jsx
<div className="bg-gray-800 rounded-xl p-6 border border-gray-700
                hover:border-orange-500 transition-colors">
  <h3 className="text-white font-bold text-lg mb-2">Card Title</h3>
  <p className="text-gray-400">Card content goes here</p>
</div>
```

#### Card with Hover Effect

```jsx
<motion.div
  whileHover={{ y: -5 }}
  transition={{ duration: 0.2 }}
  className="bg-gray-800 rounded-xl p-6 border border-gray-700
             hover:border-orange-500 transition-colors cursor-pointer"
>
  <h3 className="text-white font-bold text-lg mb-2">Hover Card</h3>
  <p className="text-gray-400">Lifts up on hover</p>
</motion.div>
```

#### Product Card

```jsx
<motion.div
  whileHover={{ y: -5 }}
  className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700
             hover:border-orange-500 transition-colors"
>
  {/* Image Section */}
  <div className="relative h-48 overflow-hidden group">
    <Image
      src="/product.jpg"
      alt="Product"
      fill
      className="object-cover transition-transform duration-300
                 group-hover:scale-110"
    />
    <div className="absolute top-3 left-3">
      <span className="bg-orange-600 text-white text-xs font-bold
                       px-2 py-1 rounded-full">
        Destaque
      </span>
    </div>
  </div>

  {/* Content Section */}
  <div className="p-6">
    <h3 className="text-white font-bold text-lg mb-2">Product Name</h3>
    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
      Product description
    </p>
    <div className="flex items-center justify-between">
      <span className="text-orange-400 font-bold text-2xl">R$ 29,90</span>
      <button className="bg-orange-600 hover:bg-orange-700 text-white
                         px-4 py-2 rounded-lg transition-colors">
        Adicionar
      </button>
    </div>
  </div>
</motion.div>
```

#### Glass Card

```jsx
<div className="bg-black/50 backdrop-blur-lg rounded-xl p-6
                border border-white/10 shadow-glass">
  <h3 className="text-white font-bold">Glass Effect Card</h3>
  <p className="text-gray-300">With glassmorphism effect</p>
</div>
```

### Hero Sections

#### Gradient Hero with Orbs

```jsx
<section className="relative h-screen flex items-center justify-center overflow-hidden">
  {/* Background Gradient */}
  <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />

  {/* Animated Gradient Overlay (Orbs) */}
  <div className="absolute inset-0 opacity-30">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#FF6B35_0%,transparent_50%),radial-gradient(circle_at_80%_70%,#F7931E_0%,transparent_50%)]" />
  </div>

  {/* Geometric Pattern */}
  <div className="absolute inset-0 opacity-5">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF6B35' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }}
    />
  </div>

  {/* Content */}
  <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-5xl md:text-7xl font-bold text-white mb-6"
    >
      Entre no Esquema
    </motion.h1>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-xl md:text-2xl text-gray-400 mb-8"
    >
      Pub & Lounge Bar em Botafogo
    </motion.p>
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      whileHover={{ scale: 1.05 }}
      className="bg-gradient-to-r from-orange-500 to-orange-600
                 text-white font-bold px-8 py-4 rounded-lg
                 shadow-orange-glow hover:shadow-orange-glow-strong"
    >
      Explorar Cardápio
    </motion.button>
  </div>
</section>
```

### Forms

#### Input Field

```jsx
<div className="space-y-2">
  <label className="text-gray-300 text-sm font-medium">
    Nome
  </label>
  <input
    type="text"
    placeholder="Digite seu nome"
    className="w-full bg-gray-800 border border-gray-700
               rounded-lg px-4 py-3 text-white
               focus:border-orange-500 focus:ring-2
               focus:ring-orange-500/20 outline-none
               transition-all placeholder:text-gray-500"
  />
</div>
```

#### Textarea

```jsx
<textarea
  placeholder="Sua mensagem"
  rows={4}
  className="w-full bg-gray-800 border border-gray-700
             rounded-lg px-4 py-3 text-white
             focus:border-orange-500 focus:ring-2
             focus:ring-orange-500/20 outline-none
             transition-all resize-none placeholder:text-gray-500"
/>
```

#### Select Dropdown

```jsx
<select className="w-full bg-gray-800 border border-gray-700
                   rounded-lg px-4 py-3 text-white
                   focus:border-orange-500 focus:ring-2
                   focus:ring-orange-500/20 outline-none
                   transition-all">
  <option value="">Selecione uma opção</option>
  <option value="1">Opção 1</option>
  <option value="2">Opção 2</option>
</select>
```

### Badges

```jsx
// Primary Badge
<span className="bg-orange-600 text-white text-xs font-bold
                 px-2 py-1 rounded-full">
  Destaque
</span>

// Success Badge
<span className="bg-green-500 text-white text-xs font-bold
                 px-2 py-1 rounded-full">
  Disponível
</span>

// Warning Badge
<span className="bg-yellow-500 text-black text-xs font-bold
                 px-2 py-1 rounded-full">
  Últimas unidades
</span>

// Error Badge
<span className="bg-red-500 text-white text-xs font-bold
                 px-2 py-1 rounded-full">
  Esgotado
</span>

// Ghost Badge
<span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full">
  Categoria
</span>
```

### Loading States

#### Spinner

```jsx
<div className="flex items-center justify-center">
  <div className="w-12 h-12 border-4 border-gray-700
                  border-t-orange-500 rounded-full animate-spin" />
</div>

// Small Spinner
<div className="w-6 h-6 border-2 border-gray-700
                border-t-orange-500 rounded-full animate-spin" />

// Large Spinner
<div className="w-16 h-16 border-4 border-gray-700
                border-t-orange-500 rounded-full animate-spin" />
```

#### Skeleton Loader

```jsx
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-gray-700 rounded w-3/4" />
  <div className="h-4 bg-gray-700 rounded w-full" />
  <div className="h-4 bg-gray-700 rounded w-5/6" />
</div>
```

#### Pulse Effect

```jsx
<div className="animate-pulse-soft">
  <p className="text-gray-400">Loading content...</p>
</div>
```

---

## Animations

### Framer Motion Variants

#### Container Stagger

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
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

#### Fade In

```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content fades in
</motion.div>
```

#### Slide In (From Bottom)

```jsx
<motion.div
  initial={{ y: 50, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
>
  Content slides up
</motion.div>
```

#### Slide In (From Right)

```jsx
<motion.div
  initial={{ x: 100, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content slides from right
</motion.div>
```

#### Scale In

```jsx
<motion.div
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.4 }}
>
  Content scales in
</motion.div>
```

#### Hover Animations

```jsx
// Lift on Hover
<motion.div
  whileHover={{ y: -5 }}
  transition={{ duration: 0.2 }}
>
  Lifts on hover
</motion.div>

// Scale on Hover
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Interactive Button
</motion.button>

// Glow on Hover
<motion.div
  whileHover={{ boxShadow: "0 0 30px rgba(255, 107, 53, 0.5)" }}
  transition={{ duration: 0.3 }}
>
  Glows on hover
</motion.div>
```

#### Scroll Animations

```jsx
import { useScroll, useTransform, motion } from 'framer-motion';

function ScrollComponent() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <motion.div style={{ opacity, scale }}>
      Fades and scales on scroll
    </motion.div>
  );
}
```

#### Page Transitions

```jsx
// In _app.js
<AnimatePresence mode="wait">
  <motion.div
    key={router.route}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <Component {...pageProps} />
  </motion.div>
</AnimatePresence>
```

### Tailwind Animations

```jsx
// Fade In
<div className="animate-fade-in">Content</div>

// Slide Up
<div className="animate-slide-up">Content</div>

// Slide Down
<div className="animate-slide-down">Content</div>

// Slide Left
<div className="animate-slide-left">Content</div>

// Slide Right
<div className="animate-slide-right">Content</div>

// Pulse
<div className="animate-pulse-soft">Content</div>

// Glow (Infinite)
<div className="animate-glow">Content</div>

// Bounce
<div className="animate-bounce-soft">Content</div>
```

---

## Effects & Utilities

### Glass Morphism

```jsx
// Basic Glass Effect
<div className="bg-black/50 backdrop-blur-lg border border-white/10">
  Glass content
</div>

// Using Utility Class
<div className="glass-morphism">
  Glass content
</div>

// Glass Card
<div className="bg-gray-900/80 backdrop-blur-xl rounded-xl
                border border-gray-700/50 shadow-glass">
  Premium glass card
</div>
```

### Glow Effects

```jsx
// Orange Glow Shadow
<div className="shadow-orange-glow">
  Subtle glow
</div>

// Strong Orange Glow
<div className="shadow-orange-glow-strong">
  Intense glow
</div>

// Using Utility Class
<div className="exxquema-glow">
  Brand glow
</div>

// Text Glow
<h1 className="text-white" style={{
  textShadow: '0 0 20px rgba(255, 107, 53, 0.5)'
}}>
  Glowing Text
</h1>
```

### Gradient Backgrounds

```jsx
// Orange Gradient
<div className="bg-gradient-to-r from-orange-500 to-orange-600">
  Orange gradient
</div>

// Dark Gradient
<div className="bg-gradient-to-br from-black via-gray-900 to-black">
  Dark gradient
</div>

// Radial Gradient
<div className="bg-gradient-radial from-orange-500/20 to-transparent">
  Radial gradient
</div>

// Custom Exxquema Gradient
<div className="bg-exxquema-gradient">
  Brand gradient
</div>
```

### Gradient Text

```jsx
// White to Gray Gradient
<h1 className="text-transparent bg-clip-text
               bg-gradient-to-r from-white to-gray-400">
  Gradient Heading
</h1>

// Orange Gradient
<span className="text-transparent bg-clip-text
                 bg-gradient-to-r from-orange-500 to-orange-600">
  Orange Text
</span>

// Using Utility Class
<h1 className="text-gradient">
  Gradient Text
</h1>
```

### Background Patterns

```jsx
// Geometric Pattern
<div className="absolute inset-0 opacity-5">
  <div
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF6B35' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      backgroundSize: '60px 60px'
    }}
  />
</div>

// Dot Pattern
<div className="absolute inset-0 opacity-10">
  <div
    style={{
      backgroundImage: `radial-gradient(circle, #FF6B35 1px, transparent 1px)`,
      backgroundSize: '24px 24px'
    }}
  />
</div>
```

### Scrollbar Styling

The custom scrollbar is automatically styled globally. Features:
- Orange gradient thumb
- Smooth rounded corners
- Glow effect on hover
- Dark track

```jsx
// Hide scrollbar for horizontal sliders
<div className="scrollbar-hide overflow-x-auto">
  Horizontal content
</div>
```

### Text Shadows

```jsx
// Small Shadow
<h1 className="text-shadow">Heading</h1>

// Medium Shadow
<h1 className="text-shadow-md">Heading</h1>

// Large Shadow
<h1 className="text-shadow-lg">Heading</h1>
```

### Border Radius Scale

```jsx
rounded-none     // 0
rounded-sm       // 0.375rem (6px)
rounded          // 0.5rem (8px)
rounded-md       // 0.5rem (8px)
rounded-lg       // 0.75rem (12px)
rounded-xl       // 1rem (16px)
rounded-2xl      // 1.5rem (24px)
rounded-full     // 9999px
```

---

## Responsive Breakpoints

### Tailwind Breakpoints

```jsx
// Mobile First Approach
xs:   // 475px
sm:   // 640px
md:   // 768px
lg:   // 1024px
xl:   // 1280px
2xl:  // 1536px
3xl:  // 1600px
```

### Usage Examples

```jsx
// Responsive Text Sizes
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
  Responsive Heading
</h1>

// Responsive Padding
<section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
  Content
</section>

// Responsive Grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>

// Responsive Flex Direction
<div className="flex flex-col md:flex-row gap-4">
  <div>Column 1</div>
  <div>Column 2</div>
</div>

// Hide on Mobile
<div className="hidden md:block">
  Desktop only content
</div>

// Show on Mobile Only
<div className="block md:hidden">
  Mobile only content
</div>
```

### Container Widths

```jsx
// Standard Container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  Content
</div>

// Narrow Container
<div className="max-w-4xl mx-auto px-4">
  Content
</div>

// Wide Container
<div className="max-w-8xl mx-auto px-4">
  Content
</div>

// Full Width
<div className="w-full px-4">
  Content
</div>
```

---

## Code Examples

### Complete Product Card Component

```jsx
import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

export default function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700
                 hover:border-orange-500 transition-colors"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden group">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300
                     group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {product.featured && (
            <span className="bg-yellow-500 text-black text-xs font-bold
                             px-2 py-1 rounded-full">
              Destaque
            </span>
          )}
          {product.discount > 0 && (
            <span className="bg-orange-600 text-white text-xs font-bold
                             px-2 py-1 rounded-full">
              -{product.discount}%
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-white font-bold text-lg mb-2">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-orange-400 font-bold text-2xl">
            R$ {product.price.toFixed(2)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Quantity */}
          <div className="flex items-center border border-gray-600 rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 text-gray-400 hover:text-white
                         hover:bg-gray-700 transition-colors rounded-l-lg"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 text-white font-medium bg-gray-700">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 text-gray-400 hover:text-white
                         hover:bg-gray-700 transition-colors rounded-r-lg"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart */}
          <button className="flex-1 bg-orange-600 hover:bg-orange-700
                             text-white font-semibold py-3 px-6 rounded-lg
                             transition-colors">
            Adicionar
          </button>
        </div>
      </div>
    </motion.div>
  );
}
```

### Complete Hero Section

```jsx
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center
                        overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black
                      via-gray-900 to-black" />

      {/* Animated Orbs */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#FF6B35_0%,transparent_50%),radial-gradient(circle_at_80%_70%,#F7931E_0%,transparent_50%)]" />
      </div>

      {/* Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF6B35' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6"
        >
          Entre no{' '}
          <span className="text-transparent bg-clip-text
                           bg-gradient-to-r from-orange-500 to-orange-600">
            Esquema
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-400 mb-8"
        >
          Pub & Lounge Bar em Botafogo
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center
                     gap-4"
        >
          <Link href="/cardapio">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-orange-500 to-orange-600
                         text-white font-bold px-8 py-4 rounded-lg
                         shadow-orange-glow hover:shadow-orange-glow-strong
                         transition-shadow"
            >
              Ver Cardápio
            </motion.button>
          </Link>

          <Link href="/historia">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-orange-500
                         text-orange-500 font-bold px-8 py-4 rounded-lg
                         hover:bg-orange-500 hover:text-white
                         transition-colors"
            >
              Nossa História
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
```

### Animated Navigation Header

```jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, ShoppingBag } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
                  ${isScrolled
                    ? 'bg-black/90 backdrop-blur-lg border-b border-gray-800'
                    : 'bg-transparent'
                  }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            <span className="text-transparent bg-clip-text
                             bg-gradient-to-r from-orange-500 to-orange-600">
              EXXQUEMA
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-orange-400
                                      transition-colors">
              Início
            </Link>
            <Link href="/cardapio" className="text-gray-300 hover:text-orange-400
                                               transition-colors">
              Cardápio
            </Link>
            <Link href="/historia" className="text-gray-300 hover:text-orange-400
                                               transition-colors">
              História
            </Link>
          </nav>

          {/* Cart */}
          <Link href="/carrinho" className="relative p-2">
            <ShoppingBag className="w-6 h-6 text-gray-300
                                    hover:text-orange-400 transition-colors" />
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white
                             text-xs rounded-full w-5 h-5 flex items-center
                             justify-center">
              3
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-black/95 backdrop-blur-lg border-t
                     border-gray-800"
        >
          <nav className="px-4 py-6 space-y-4">
            <Link href="/" className="block text-gray-300 hover:text-orange-400">
              Início
            </Link>
            <Link href="/cardapio" className="block text-gray-300
                                               hover:text-orange-400">
              Cardápio
            </Link>
            <Link href="/historia" className="block text-gray-300
                                               hover:text-orange-400">
              História
            </Link>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
```

### Grid Layout with Animation

```jsx
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

export default function ProductGrid({ products }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
                 gap-6"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
```

---

## Best Practices

### 1. Use Semantic Colors

```jsx
// Good - Semantic naming
<button className="bg-orange-500">Primary Action</button>
<span className="text-green-400">Success message</span>

// Avoid - Color names without context
<button className="bg-red-500">Submit</button>
```

### 2. Maintain Consistent Spacing

```jsx
// Good - Consistent spacing scale
<div className="p-4 space-y-4">
  <h2 className="mb-2">Title</h2>
  <p className="mb-4">Content</p>
</div>

// Avoid - Random spacing values
<div className="p-3 space-y-5">
  <h2 className="mb-1">Title</h2>
  <p className="mb-7">Content</p>
</div>
```

### 3. Mobile-First Responsive Design

```jsx
// Good - Mobile first
<h1 className="text-3xl md:text-5xl lg:text-7xl">Heading</h1>

// Avoid - Desktop first
<h1 className="text-7xl lg:text-5xl md:text-3xl">Heading</h1>
```

### 4. Optimize Animations

```jsx
// Good - Transform and opacity for GPU acceleration
<motion.div
  whileHover={{ scale: 1.05, opacity: 0.9 }}
  transition={{ duration: 0.2 }}
>
  Content
</motion.div>

// Avoid - Width/height animations (causes reflow)
<motion.div
  whileHover={{ width: '200px', height: '200px' }}
>
  Content
</motion.div>
```

### 5. Accessibility

```jsx
// Good - Proper contrast and focus states
<button className="bg-orange-500 text-white
                   focus:ring-2 focus:ring-orange-500/50
                   focus:outline-none">
  Accessible Button
</button>

// Good - Semantic HTML and ARIA
<button aria-label="Close menu" className="...">
  <X className="w-6 h-6" />
</button>
```

---

## Resources

### Icons
- **Lucide React**: [https://lucide.dev](https://lucide.dev)
- Used throughout the design system for consistent iconography

### Fonts
- **Montserrat**: Primary font family
- Google Fonts: [https://fonts.google.com/specimen/Montserrat](https://fonts.google.com/specimen/Montserrat)

### Documentation
- **Tailwind CSS**: [https://tailwindcss.com](https://tailwindcss.com)
- **Framer Motion**: [https://www.framer.com/motion](https://www.framer.com/motion)
- **Next.js**: [https://nextjs.org](https://nextjs.org)

---

## Changelog

### Version 2.0.0 - Current
- Changed primary color from red (#E30613) to orange (#FF6B35)
- Added secondary orange color (#F7931E)
- Updated all components to use orange color scheme
- Enhanced glass morphism effects
- Improved animation performance
- Added more Framer Motion variants
- Updated scrollbar styling with orange gradient

---

**Built with love for Exxquema Pub & Lounge Bar**
