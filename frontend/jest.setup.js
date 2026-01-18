// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Import centralized store mocks
import {
  mockAuthStore,
  mockCartStore,
  mockThemeStore,
  mockProductStore,
  mockOrderStore,
  mockNotificationStore,
  mockCashbackStore,
} from './src/__mocks__/stores'

// Mock Zustand Stores
jest.mock('./src/stores/authStore', () => ({
  useAuthStore: jest.fn(() => mockAuthStore),
}))

jest.mock('./src/stores/cartStore', () => ({
  useCartStore: jest.fn(() => mockCartStore),
  PAYMENT_METHODS: [
    { id: 'pix', nome: 'PIX', icon: 'qr-code', descricao: 'Pagamento instantâneo' },
    { id: 'credit', nome: 'Cartão de Crédito', icon: 'credit-card', descricao: 'Até 12x sem juros' },
    { id: 'debit', nome: 'Cartão de Débito', icon: 'credit-card', descricao: 'Débito na hora' },
    { id: 'cash', nome: 'Dinheiro', icon: 'banknotes', descricao: 'Pagamento na entrega' },
  ],
}))

jest.mock('./src/stores/themeStore', () => ({
  useThemeStore: jest.fn(() => mockThemeStore),
}))

jest.mock('./src/stores/productStore', () => ({
  useProductStore: jest.fn(() => mockProductStore),
}))

jest.mock('./src/stores/orderStore', () => ({
  useOrderStore: jest.fn(() => mockOrderStore),
}))

jest.mock('./src/stores/notificationStore', () => ({
  useNotificationStore: jest.fn(() => mockNotificationStore),
}))

jest.mock('./src/stores/cashbackStore', () => ({
  useCashbackStore: jest.fn(() => mockCashbackStore),
}))

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    isPreview: false,
  })),
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock Framer Motion with Proxy for all HTML elements
jest.mock('framer-motion', () => {
  const React = require('react');

  // Create a proxy that returns a component for any HTML element
  const motionProxy = new Proxy({}, {
    get: (target, prop) => {
      if (typeof prop === 'string') {
        return ({ children, ...props }) => {
          // Remove framer-motion specific props to avoid warnings
          const {
            initial, animate, exit, transition, variants,
            whileHover, whileTap, whileFocus, whileDrag, whileInView,
            viewport, layout, layoutId, layoutDependency,
            // Remove Next.js Image props that shouldn't be on motion elements
            priority, fill, quality, placeholder, blurDataURL,
            ...restProps
          } = props;
          return React.createElement(prop, restProps, children);
        };
      }
      return undefined;
    }
  });

  return {
    motion: motionProxy,
    AnimatePresence: ({ children }) => children,
    useAnimation: () => ({
      start: jest.fn(),
      stop: jest.fn(),
      set: jest.fn(),
    }),
    useMotionValue: (initialValue) => ({
      get: () => initialValue,
      set: jest.fn(),
      onChange: jest.fn(),
    }),
    useTransform: () => ({
      get: () => 0,
      set: jest.fn(),
    }),
    useSpring: (value) => value,
    useScroll: () => ({
      scrollX: { get: () => 0 },
      scrollY: { get: () => 0 },
      scrollXProgress: { get: () => 0 },
      scrollYProgress: { get: () => 0 },
    }),
    useInView: () => true,
    useDragControls: () => ({
      start: jest.fn(),
    }),
  };
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}

// Suppress console errors in tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
        args[0].includes('Not implemented: HTMLFormElement.prototype.submit') ||
        args[0].includes('Warning: Received `true` for a non-boolean attribute') ||
        args[0].includes('non-boolean attribute `priority`') ||
        args[0].includes('non-boolean attribute `fill`') ||
        args[0].includes('non-boolean attribute `layout`'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
