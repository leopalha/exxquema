/**
 * Input Component - FLAME Lounge Bar
 * Componentes de input reutilizáveis seguindo o design system
 */

import { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle, Check, Search } from 'lucide-react';

/**
 * Componente Input base
 */
const Input = forwardRef(({
  label,
  error,
  success,
  hint,
  leftIcon,
  rightIcon,
  className = '',
  inputClassName = '',
  disabled = false,
  required = false,
  fullWidth = true,
  size = 'md',
  ...props
}, ref) => {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const baseInputClasses = `
    w-full bg-gray-800 border rounded-lg text-white placeholder-gray-500
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-0
    disabled:opacity-50 disabled:cursor-not-allowed
    ${sizes[size]}
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon || error || success ? 'pr-10' : ''}
    ${error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
      : success
        ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
        : 'border-gray-700 focus:border-[var(--theme-primary)] focus:ring-[var(--theme-primary)]/20'
    }
    ${inputClassName}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input container */}
      <div className="relative">
        {/* Left icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          disabled={disabled}
          className={baseInputClasses}
          {...props}
        />

        {/* Right icon / Status icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {error ? (
            <AlertCircle className="w-5 h-5 text-red-500" />
          ) : success ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : rightIcon ? (
            <span className="text-gray-400">{rightIcon}</span>
          ) : null}
        </div>
      </div>

      {/* Error / Hint message */}
      {(error || hint) && (
        <p className={`mt-1.5 text-sm ${error ? 'text-red-400' : 'text-gray-500'}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

/**
 * Componente PasswordInput - Input de senha com toggle de visibilidade
 */
export const PasswordInput = forwardRef(({
  label = 'Senha',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      ref={ref}
      type={showPassword ? 'text' : 'password'}
      label={label}
      rightIcon={
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      }
      {...props}
    />
  );
});

PasswordInput.displayName = 'PasswordInput';

/**
 * Componente SearchInput - Input de busca
 */
export const SearchInput = forwardRef(({
  placeholder = 'Buscar...',
  onClear,
  value,
  ...props
}, ref) => {
  return (
    <Input
      ref={ref}
      type="search"
      placeholder={placeholder}
      value={value}
      leftIcon={<Search className="w-4 h-4" />}
      rightIcon={value && onClear ? (
        <button
          type="button"
          onClick={onClear}
          className="text-gray-400 hover:text-white transition-colors"
        >
          &times;
        </button>
      ) : null}
      {...props}
    />
  );
});

SearchInput.displayName = 'SearchInput';

/**
 * Componente TextArea - Área de texto
 */
export const TextArea = forwardRef(({
  label,
  error,
  hint,
  rows = 4,
  className = '',
  disabled = false,
  required = false,
  fullWidth = true,
  ...props
}, ref) => {
  const baseClasses = `
    w-full bg-gray-800 border rounded-lg text-white placeholder-gray-500
    px-4 py-3 text-sm
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-0
    disabled:opacity-50 disabled:cursor-not-allowed
    resize-none
    ${error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
      : 'border-gray-700 focus:border-[var(--theme-primary)] focus:ring-[var(--theme-primary)]/20'
    }
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        rows={rows}
        disabled={disabled}
        className={baseClasses}
        {...props}
      />

      {(error || hint) && (
        <p className={`mt-1.5 text-sm ${error ? 'text-red-400' : 'text-gray-500'}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

/**
 * Componente Select - Select dropdown
 */
export const Select = forwardRef(({
  label,
  error,
  hint,
  options = [],
  placeholder = 'Selecione...',
  className = '',
  disabled = false,
  required = false,
  fullWidth = true,
  ...props
}, ref) => {
  const baseClasses = `
    w-full bg-gray-800 border rounded-lg text-white
    px-4 py-2 text-sm
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-0
    disabled:opacity-50 disabled:cursor-not-allowed
    appearance-none cursor-pointer
    ${error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
      : 'border-gray-700 focus:border-[var(--theme-primary)] focus:ring-[var(--theme-primary)]/20'
    }
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          disabled={disabled}
          className={baseClasses}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Chevron icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {(error || hint) && (
        <p className={`mt-1.5 text-sm ${error ? 'text-red-400' : 'text-gray-500'}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

/**
 * Componente Checkbox
 */
export const Checkbox = forwardRef(({
  label,
  error,
  className = '',
  disabled = false,
  ...props
}, ref) => {
  return (
    <label className={`flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <input
        ref={ref}
        type="checkbox"
        disabled={disabled}
        className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-[var(--theme-primary)] focus:ring-[var(--theme-primary)] focus:ring-offset-0 cursor-pointer disabled:cursor-not-allowed"
        {...props}
      />
      {label && <span className="text-sm text-gray-300">{label}</span>}
      {error && <span className="text-sm text-red-400 ml-auto">{error}</span>}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

/**
 * Componente Toggle/Switch
 */
export const Toggle = forwardRef(({
  label,
  description,
  className = '',
  disabled = false,
  checked = false,
  onChange,
  ...props
}, ref) => {
  return (
    <label className={`flex items-center justify-between cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div>
        {label && <span className="text-sm font-medium text-white">{label}</span>}
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
      <div className="relative">
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />
        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-[var(--theme-primary)] transition-colors" />
        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
      </div>
    </label>
  );
});

Toggle.displayName = 'Toggle';

export default Input;
