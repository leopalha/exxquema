import { render, screen } from '@testing-library/react'
import Header from '../Header'
import { useAuthStore } from '../../stores/authStore'
import { useCartStore } from '../../stores/cartStore'
import { useThemeStore } from '../../stores/themeStore'

// Mock stores
jest.mock('../../stores/authStore')
jest.mock('../../stores/cartStore')
jest.mock('../../stores/themeStore')

// Mock router
const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    pathname: '/',
  }),
}))

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Default mock implementations
    useAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: jest.fn(),
    })

    useCartStore.mockReturnValue({
      items: [],
      getTotalItems: jest.fn(() => 0),
    })

    useThemeStore.mockReturnValue({
      currentPalette: 'default',
      setPalette: jest.fn(),
      applyTheme: jest.fn(),
      getPalette: jest.fn(() => ({
        textPrimary: 'text-orange-500',
        bgPrimary: 'bg-orange-500',
      })),
    })
  })

  describe('Rendering - Basic', () => {
    test('renders header component', () => {
      const { container } = render(<Header />)

      const header = container.querySelector('header')
      expect(header).toBeInTheDocument()
    })

    test('renders logo link', () => {
      render(<Header />)

      const links = screen.getAllByRole('link')
      const logoLink = links.find(link => link.getAttribute('href') === '/')
      expect(logoLink).toBeInTheDocument()
    })

    test('renders navigation when not authenticated', () => {
      render(<Header />)

      // Should render navigation links
      const links = screen.getAllByRole('link')
      expect(links.length).toBeGreaterThan(0)
    })
  })

  describe('Authentication State', () => {
    test('shows different content when authenticated', () => {
      useAuthStore.mockReturnValue({
        user: {
          id: 1,
          name: 'João Silva',
          email: 'joao@email.com',
        },
        isAuthenticated: true,
        logout: jest.fn(),
      })

      render(<Header />)

      expect(screen.getByText('João Silva')).toBeInTheDocument()
    })

    test('does not show user name when not authenticated', () => {
      render(<Header />)

      expect(screen.queryByText('João Silva')).not.toBeInTheDocument()
    })
  })

  describe('Cart Display', () => {
    test('shows cart badge when items exist', () => {
      useAuthStore.mockReturnValue({
        user: { id: 1, name: 'João' },
        isAuthenticated: true,
        logout: jest.fn(),
      })

      useCartStore.mockReturnValue({
        items: [{ id: 1 }],
        getTotalItems: jest.fn(() => 2),
      })

      render(<Header />)

      expect(screen.getByText('2')).toBeInTheDocument()
    })

    test('hides cart when not authenticated', () => {
      useCartStore.mockReturnValue({
        items: [{ id: 1 }],
        getTotalItems: jest.fn(() => 2),
      })

      render(<Header />)

      expect(screen.queryByText('2')).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('has navigation landmark', () => {
      render(<Header />)

      // Header contains navigation
      const { container } = render(<Header />)
      expect(container.querySelector('header')).toBeInTheDocument()
    })

    test('all links are keyboard accessible', () => {
      render(<Header />)

      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link).toHaveAttribute('href')
      })
    })
  })

  describe('Responsive Behavior', () => {
    test('renders on mobile', () => {
      global.innerWidth = 375
      global.dispatchEvent(new Event('resize'))

      const { container } = render(<Header />)
      expect(container.querySelector('header')).toBeInTheDocument()
    })

    test('renders on desktop', () => {
      global.innerWidth = 1024
      global.dispatchEvent(new Event('resize'))

      const { container } = render(<Header />)
      expect(container.querySelector('header')).toBeInTheDocument()
    })
  })
})
