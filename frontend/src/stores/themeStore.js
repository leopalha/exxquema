import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Paletas de cores disponíveis
export const COLOR_PALETTES = {
  flame: {
    id: 'flame',
    name: 'FLAME Original',
    description: 'Magenta e Cyan',
    primary: '#FF006E',
    secondary: '#00D4FF',
    accent: '#B266FF',
    // Classes Tailwind
    bgPrimary: 'bg-magenta-500',
    bgSecondary: 'bg-cyan-500',
    bgAccent: 'bg-purple-500',
    textPrimary: 'text-magenta-500',
    textSecondary: 'text-cyan-400',
    gradient: 'from-magenta-500 to-cyan-500',
    gradientVia: 'from-magenta-500 via-purple-500 to-cyan-400',
    gradientHover: 'from-magenta-600 to-cyan-600',
    textGradient: 'from-magenta-400 via-purple-500 to-cyan-400',
    glow: 'shadow-magenta-500/50',
    border: 'border-magenta-500',
    preview: ['#FF006E', '#B266FF', '#00D4FF']
  },
  inferno: {
    id: 'inferno',
    name: 'Inferno',
    description: 'Vermelho e Roxo',
    primary: '#DC2626',
    secondary: '#9333EA',
    accent: '#7C3AED',
    // Classes Tailwind
    bgPrimary: 'bg-red-600',
    bgSecondary: 'bg-purple-600',
    bgAccent: 'bg-violet-600',
    textPrimary: 'text-red-500',
    textSecondary: 'text-purple-400',
    gradient: 'from-red-600 to-purple-600',
    gradientVia: 'from-red-500 via-violet-500 to-purple-500',
    gradientHover: 'from-red-700 to-purple-700',
    textGradient: 'from-red-400 via-purple-500 to-violet-400',
    glow: 'shadow-red-500/50',
    border: 'border-red-500',
    preview: ['#DC2626', '#7C3AED', '#9333EA']
  },
  solar: {
    id: 'solar',
    name: 'Passion',
    description: 'Vinho Escuro, Vermelho Fogo e Deep Pink',
    primary: '#5C1A33',
    secondary: '#FF1493',
    accent: '#FF4500',
    // Classes Tailwind
    bgPrimary: 'bg-red-900',
    bgSecondary: 'bg-pink-600',
    bgAccent: 'bg-orange-600',
    textPrimary: 'text-red-700',
    textSecondary: 'text-pink-400',
    gradient: 'from-red-900 to-pink-600',
    gradientVia: 'from-red-900 via-orange-600 to-pink-500',
    gradientHover: 'from-red-800 to-pink-700',
    textGradient: 'from-red-800 via-orange-600 to-pink-400',
    glow: 'shadow-red-800/50',
    border: 'border-red-700',
    preview: ['#5C1A33', '#FF4500', '#FF1493']
  },
  midnight: {
    id: 'midnight',
    name: 'Neon',
    description: 'Ciberpunk Vibrante - Roxo e Verde Neon',
    primary: '#2d1b4e',
    secondary: '#00FF41',
    accent: '#FF00FF',
    // Classes Tailwind
    bgPrimary: 'bg-purple-950',
    bgSecondary: 'bg-green-400',
    bgAccent: 'bg-fuchsia-500',
    textPrimary: 'text-purple-950',
    textSecondary: 'text-green-300',
    gradient: 'from-purple-950 to-green-400',
    gradientVia: 'from-purple-950 via-fuchsia-500 to-green-400',
    gradientHover: 'from-purple-900 to-green-400',
    textGradient: 'from-fuchsia-400 via-purple-500 to-green-400',
    glow: 'shadow-fuchsia-500/60',
    border: 'border-fuchsia-500',
    preview: ['#2d1b4e', '#FF00FF', '#00FF41']
  },
  twilight: {
    id: 'twilight',
    name: 'Twilight',
    description: 'Crepúsculo Sofisticado - Roxo e Lavanda',
    primary: '#2D1B4E',
    secondary: '#E9D5FF',
    accent: '#A78BFA',
    // Classes Tailwind
    bgPrimary: 'bg-purple-950',
    bgSecondary: 'bg-purple-100',
    bgAccent: 'bg-purple-400',
    textPrimary: 'text-purple-900',
    textSecondary: 'text-purple-200',
    gradient: 'from-purple-950 to-purple-300',
    gradientVia: 'from-purple-950 via-purple-400 to-purple-200',
    gradientHover: 'from-purple-900 to-purple-300',
    textGradient: 'from-purple-400 via-purple-300 to-purple-200',
    glow: 'shadow-purple-600/50',
    border: 'border-purple-600',
    preview: ['#2D1B4E', '#A78BFA', '#E9D5FF']
  },
  amber: {
    id: 'amber',
    name: 'Amber',
    description: 'Dourado, Âmbar e Laranja Quente',
    primary: '#D97706',
    secondary: '#FCA5A5',
    accent: '#F59E0B',
    // Classes Tailwind
    bgPrimary: 'bg-amber-600',
    bgSecondary: 'bg-rose-300',
    bgAccent: 'bg-amber-400',
    textPrimary: 'text-amber-600',
    textSecondary: 'text-rose-300',
    gradient: 'from-amber-600 to-rose-300',
    gradientVia: 'from-amber-600 via-amber-400 to-rose-300',
    gradientHover: 'from-amber-700 to-rose-300',
    textGradient: 'from-amber-600 via-amber-400 to-rose-200',
    glow: 'shadow-amber-600/50',
    border: 'border-amber-600',
    preview: ['#D97706', '#F59E0B', '#FCA5A5']
  }
};

const useThemeStore = create(
  persist(
    (set, get) => ({
      // Estado
      currentPalette: 'flame',

      // Getters
      getPalette: () => {
        return COLOR_PALETTES[get().currentPalette] || COLOR_PALETTES.flame;
      },

      getPaletteById: (id) => {
        return COLOR_PALETTES[id] || COLOR_PALETTES.flame;
      },

      getAllPalettes: () => {
        return Object.values(COLOR_PALETTES);
      },

      // Retorna classes Tailwind para gradiente
      getGradientClasses: () => {
        const palette = get().getPalette();
        return `bg-gradient-to-r ${palette.gradient}`;
      },

      getGradientViaClasses: () => {
        const palette = get().getPalette();
        return `bg-gradient-to-r ${palette.gradientVia}`;
      },

      getTextGradientClasses: () => {
        const palette = get().getPalette();
        return `bg-gradient-to-r ${palette.textGradient} bg-clip-text text-transparent`;
      },

      // Actions
      setPalette: (paletteId) => {
        if (COLOR_PALETTES[paletteId]) {
          set({ currentPalette: paletteId });

          // Atualizar variáveis CSS no documento
          if (typeof document !== 'undefined') {
            const palette = COLOR_PALETTES[paletteId];
            const root = document.documentElement;

            root.style.setProperty('--theme-primary', palette.primary);
            root.style.setProperty('--theme-secondary', palette.secondary);
            root.style.setProperty('--theme-accent', palette.accent);
          }
        }
      },

      // Aplicar tema ao carregar
      applyTheme: () => {
        const palette = get().getPalette();
        if (typeof document !== 'undefined') {
          const root = document.documentElement;
          root.style.setProperty('--theme-primary', palette.primary);
          root.style.setProperty('--theme-secondary', palette.secondary);
          root.style.setProperty('--theme-accent', palette.accent);
        }
      }
    }),
    {
      name: 'flame-theme-storage',
      partialize: (state) => ({
        currentPalette: state.currentPalette
      })
    }
  )
);

export { useThemeStore };
export default useThemeStore;
