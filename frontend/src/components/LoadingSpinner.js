import { motion } from 'framer-motion';

const LoadingSpinner = ({
  size = 'medium',
  color = 'orange',
  text = '',
  fullScreen = false
}) => {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-8 h-8 border-3', 
    large: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  const colorClasses = {
    orange: 'border-orange-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-600 border-t-transparent'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xl: 'text-xl'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <motion.div
        className={`
          ${sizeClasses[size]} 
          ${colorClasses[color]} 
          rounded-full 
          animate-spin
        `}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
      {text && (
        <motion.p
          className={`font-medium ${textSizes[size]} ${
            color === 'white' ? 'text-white' :
            color === 'orange' ? 'text-orange-400' : 'text-gray-400'
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="bg-gray-900 rounded-xl p-8 border border-gray-700"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          {spinner}
        </motion.div>
      </motion.div>
    );
  }

  return spinner;
};

// Skeleton loading components
export const SkeletonCard = () => (
  <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 animate-pulse">
    <div className="h-48 bg-gray-700" />
    <div className="p-6">
      <div className="h-6 bg-gray-700 rounded mb-3" />
      <div className="h-4 bg-gray-700 rounded mb-2" />
      <div className="h-4 bg-gray-700 rounded w-3/4 mb-4" />
      <div className="flex justify-between items-center mb-6">
        <div className="h-6 bg-gray-700 rounded w-20" />
        <div className="h-4 bg-gray-700 rounded w-16" />
      </div>
      <div className="flex space-x-4">
        <div className="h-10 bg-gray-700 rounded w-24" />
        <div className="h-10 bg-gray-700 rounded flex-1" />
      </div>
    </div>
  </div>
);

export const SkeletonList = ({ count = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700 animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-700 rounded-lg" />
          <div className="flex-1">
            <div className="h-4 bg-gray-700 rounded mb-2" />
            <div className="h-3 bg-gray-700 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-700 rounded w-1/2" />
          </div>
          <div className="h-8 bg-gray-700 rounded w-16" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 5 }) => (
  <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
    <div className="bg-gray-700 p-4">
      <div className="grid grid-cols-5 gap-4">
        {Array.from({ length: cols }).map((_, index) => (
          <div key={index} className="h-4 bg-gray-600 rounded animate-pulse" />
        ))}
      </div>
    </div>
    <div className="divide-y divide-gray-700">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4">
          <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: cols }).map((_, colIndex) => (
              <div key={colIndex} className="h-4 bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonChart = () => (
  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
    <div className="h-6 bg-gray-700 rounded w-1/3 mb-6 animate-pulse" />
    <div className="h-64 bg-gray-700 rounded animate-pulse mb-4" />
    <div className="flex justify-center space-x-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gray-700 rounded-full animate-pulse" />
          <div className="h-3 bg-gray-700 rounded w-12 animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);

// Skeleton para cards de produto
export const SkeletonProductCard = () => (
  <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-700 animate-pulse">
    <div className="h-40 bg-gray-800" />
    <div className="p-4">
      <div className="h-5 bg-gray-700 rounded mb-2" />
      <div className="h-3 bg-gray-700 rounded w-3/4 mb-3" />
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-700 rounded w-20" />
        <div className="h-8 w-8 bg-gray-700 rounded-full" />
      </div>
    </div>
  </div>
);

// Skeleton para cards de pedido
export const SkeletonOrderCard = () => (
  <div className="bg-gray-900 rounded-xl p-4 border border-gray-700 animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="h-5 bg-gray-700 rounded w-24" />
      <div className="h-6 bg-gray-700 rounded-full w-20" />
    </div>
    <div className="space-y-2 mb-3">
      <div className="h-3 bg-gray-700 rounded" />
      <div className="h-3 bg-gray-700 rounded w-3/4" />
    </div>
    <div className="flex justify-between items-center">
      <div className="h-4 bg-gray-700 rounded w-16" />
      <div className="h-8 bg-gray-700 rounded w-24" />
    </div>
  </div>
);

// Skeleton para página de perfil
export const SkeletonProfile = () => (
  <div className="max-w-2xl mx-auto p-4 animate-pulse">
    <div className="flex items-center gap-4 mb-8">
      <div className="w-20 h-20 bg-gray-700 rounded-full" />
      <div className="flex-1">
        <div className="h-6 bg-gray-700 rounded w-48 mb-2" />
        <div className="h-4 bg-gray-700 rounded w-32" />
      </div>
    </div>
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="h-4 bg-gray-700 rounded w-24 mb-2" />
          <div className="h-10 bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  </div>
);

// Skeleton para dashboard stats
export const SkeletonStats = ({ count = 4 }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-gray-900 rounded-xl p-4 border border-gray-700 animate-pulse">
        <div className="flex items-center justify-between mb-2">
          <div className="h-3 bg-gray-700 rounded w-20" />
          <div className="w-8 h-8 bg-gray-700 rounded" />
        </div>
        <div className="h-8 bg-gray-700 rounded w-24 mb-1" />
        <div className="h-3 bg-gray-700 rounded w-16" />
      </div>
    ))}
  </div>
);

// Skeleton para menu/cardápio
export const SkeletonMenu = () => (
  <div className="space-y-6 animate-pulse">
    {/* Categorias */}
    <div className="flex gap-2 overflow-x-auto pb-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-10 bg-gray-700 rounded-full w-24 flex-shrink-0" />
      ))}
    </div>
    {/* Grid de produtos */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonProductCard key={i} />
      ))}
    </div>
  </div>
);

// Skeleton para formulário
export const SkeletonForm = ({ fields = 4 }) => (
  <div className="space-y-4 animate-pulse">
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i}>
        <div className="h-4 bg-gray-700 rounded w-24 mb-2" />
        <div className="h-10 bg-gray-800 rounded-lg border border-gray-700" />
      </div>
    ))}
    <div className="h-12 bg-gray-700 rounded-lg mt-6" />
  </div>
);

// Componente de loading inline (texto)
export const InlineLoader = ({ text = 'Carregando...' }) => (
  <span className="inline-flex items-center gap-2 text-gray-400">
    <span className="w-4 h-4 border-2 border-gray-600 border-t-gray-400 rounded-full animate-spin" />
    {text}
  </span>
);

// Componente de loading para página inteira
export const PageLoader = ({ text = 'Carregando...' }) => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-gray-700 rounded-full animate-spin mx-auto mb-4"
        style={{ borderTopColor: 'var(--theme-primary)' }}
      />
      <p className="text-gray-400">{text}</p>
    </div>
  </div>
);

export default LoadingSpinner;