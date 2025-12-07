/**
 * Button Component - FLAME Lounge Bar
 * Componente de botão reutilizável seguindo o design system
 */

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Variantes de estilo do botão
 */
const variants = {
  // Botão principal (magenta)
  primary: {
    base: 'text-white',
    style: { background: 'var(--theme-primary)' },
    hover: 'hover:opacity-90',
    disabled: 'disabled:opacity-50'
  },
  // Botão secundário (outline)
  secondary: {
    base: 'bg-transparent border-2 text-white',
    style: { borderColor: 'var(--theme-primary)', color: 'var(--theme-primary)' },
    hover: 'hover:bg-[var(--theme-primary)]/10',
    disabled: 'disabled:opacity-50'
  },
  // Botão accent (roxo)
  accent: {
    base: 'text-white',
    style: { background: 'var(--theme-accent)' },
    hover: 'hover:opacity-90',
    disabled: 'disabled:opacity-50'
  },
  // Botão ghost (transparente)
  ghost: {
    base: 'bg-transparent text-gray-300',
    style: {},
    hover: 'hover:bg-gray-800 hover:text-white',
    disabled: 'disabled:opacity-50'
  },
  // Botão danger (vermelho)
  danger: {
    base: 'bg-red-600 text-white',
    style: {},
    hover: 'hover:bg-red-700',
    disabled: 'disabled:opacity-50 disabled:bg-red-600/50'
  },
  // Botão success (verde)
  success: {
    base: 'bg-green-600 text-white',
    style: {},
    hover: 'hover:bg-green-700',
    disabled: 'disabled:opacity-50 disabled:bg-green-600/50'
  },
  // Botão outline neutro
  outline: {
    base: 'bg-transparent border border-gray-600 text-gray-300',
    style: {},
    hover: 'hover:bg-gray-800 hover:border-gray-500 hover:text-white',
    disabled: 'disabled:opacity-50'
  },
  // Botão dark (cinza escuro)
  dark: {
    base: 'bg-gray-800 text-white border border-gray-700',
    style: {},
    hover: 'hover:bg-gray-700',
    disabled: 'disabled:opacity-50'
  }
};

/**
 * Tamanhos do botão
 */
const sizes = {
  xs: 'px-2.5 py-1 text-xs rounded-md',
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-5 py-2.5 text-base rounded-xl',
  xl: 'px-6 py-3 text-lg rounded-xl'
};

/**
 * Componente Button
 *
 * @param {Object} props
 * @param {'primary'|'secondary'|'accent'|'ghost'|'danger'|'success'|'outline'|'dark'} props.variant - Variante visual
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} props.size - Tamanho do botão
 * @param {boolean} props.loading - Estado de carregamento
 * @param {boolean} props.disabled - Estado desabilitado
 * @param {boolean} props.fullWidth - Largura total
 * @param {React.ReactNode} props.leftIcon - Ícone à esquerda
 * @param {React.ReactNode} props.rightIcon - Ícone à direita
 * @param {string} props.className - Classes adicionais
 * @param {React.ReactNode} props.children - Conteúdo do botão
 */
const Button = forwardRef(({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  children,
  onClick,
  type = 'button',
  ...props
}, ref) => {
  const variantStyles = variants[variant] || variants.primary;
  const sizeStyles = sizes[size] || sizes.md;

  const isDisabled = disabled || loading;

  const baseClasses = `
    inline-flex items-center justify-center
    font-medium
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black
    ${variantStyles.base}
    ${variantStyles.hover}
    ${variantStyles.disabled}
    ${sizeStyles}
    ${fullWidth ? 'w-full' : ''}
    ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Variantes de animação
  const motionProps = !isDisabled ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.1 }
  } : {};

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={baseClasses}
      style={variantStyles.style}
      {...motionProps}
      {...props}
    >
      {/* Loading spinner */}
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}

      {/* Left icon */}
      {!loading && leftIcon && (
        <span className="mr-2 flex items-center">{leftIcon}</span>
      )}

      {/* Content */}
      <span>{children}</span>

      {/* Right icon */}
      {rightIcon && (
        <span className="ml-2 flex items-center">{rightIcon}</span>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

/**
 * Componente IconButton - Botão apenas com ícone
 */
export const IconButton = forwardRef(({
  variant = 'ghost',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  className = '',
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  const variantStyles = variants[variant] || variants.ghost;

  const iconSizes = {
    xs: 'p-1',
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
    xl: 'p-3'
  };

  const isDisabled = disabled || loading;

  const baseClasses = `
    inline-flex items-center justify-center
    rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black
    ${variantStyles.base}
    ${variantStyles.hover}
    ${variantStyles.disabled}
    ${iconSizes[size] || iconSizes.md}
    ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const motionProps = !isDisabled ? {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { duration: 0.1 }
  } : {};

  return (
    <motion.button
      ref={ref}
      type="button"
      disabled={isDisabled}
      className={baseClasses}
      style={variantStyles.style}
      aria-label={ariaLabel}
      {...motionProps}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        icon
      )}
    </motion.button>
  );
});

IconButton.displayName = 'IconButton';

/**
 * Componente ButtonGroup - Grupo de botões
 */
export const ButtonGroup = ({ children, className = '' }) => (
  <div className={`inline-flex rounded-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

export default Button;
