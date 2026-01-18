import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ProductCard from '../ProductCard'
import { useCartStore } from '../../stores/cartStore'
import { useAuthStore } from '../../stores/authStore'
import { useThemeStore } from '../../stores/themeStore'
import { toast } from 'react-hot-toast'

// Mock stores
jest.mock('../../stores/cartStore')
jest.mock('../../stores/authStore')
jest.mock('../../stores/themeStore')
jest.mock('react-hot-toast')

// Mock product data
const mockProduct = {
  id: 1,
  name: 'Hambúrguer Artesanal',
  description: 'Delicioso hambúrguer com queijo e bacon',
  price: 35.90,
  image: '/images/hamburguer.jpg',
  category: 'Food',
  discount: 0,
  isActive: true,
}

const mockNarguileProduct = {
  id: 2,
  name: 'Narguile Premium',
  description: 'Narguile com essência de frutas',
  price: 50.00,
  image: '/images/narguile.jpg',
  category: 'Narguile',
  tipo: 'narguile',
  discount: 0,
  isActive: true,
}

describe('ProductCard Component', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()

    // Setup default mock implementations
    useCartStore.mockReturnValue({
      addItem: jest.fn(),
    })

    useAuthStore.mockReturnValue({
      isAuthenticated: true,
    })

    useThemeStore.mockReturnValue({
      getPalette: jest.fn(() => ({
        textPrimary: 'text-orange-500',
        bgPrimary: 'bg-orange-500',
      })),
    })

    toast.success = jest.fn()
    toast.error = jest.fn()
  })

  describe('Rendering', () => {
    test('renders product information correctly', () => {
      render(<ProductCard product={mockProduct} />)

      expect(screen.getByText('Hambúrguer Artesanal')).toBeInTheDocument()
      expect(screen.getByText('Delicioso hambúrguer com queijo e bacon')).toBeInTheDocument()
      expect(screen.getByText(/R\$\s+35.90/)).toBeInTheDocument()
    })

    test('renders product image with correct alt text', () => {
      render(<ProductCard product={mockProduct} />)

      const image = screen.getByAltText('Hambúrguer Artesanal')
      expect(image).toBeInTheDocument()
    })

    test('renders compact variant correctly', () => {
      render(<ProductCard product={mockProduct} variant="compact" />)

      expect(screen.getByText('Hambúrguer Artesanal')).toBeInTheDocument()
      // Compact variant has truncated description
      expect(screen.getByText('Delicioso hambúrguer com queijo e bacon')).toBeInTheDocument()
    })

    test('shows discount price when discount exists', () => {
      const productWithDiscount = {
        ...mockProduct,
        discount: 20, // 20% off
      }

      render(<ProductCard product={productWithDiscount} />)

      // Original price should be crossed out
      expect(screen.getByText(/R\$\s+35.90/)).toBeInTheDocument()
      // Discounted price (35.90 * 0.8 = 28.72)
      expect(screen.getByText(/R\$\s+28.72/)).toBeInTheDocument()
    })

    test('shows fallback image when image fails to load', () => {
      render(<ProductCard product={mockProduct} />)

      const image = screen.getByAltText('Hambúrguer Artesanal')
      fireEvent.error(image)

      // Should show "Sem foto" fallback
      expect(screen.getByText('Sem foto')).toBeInTheDocument()
    })
  })

  describe('Authentication', () => {
    test('shows error toast when user is not authenticated', async () => {
      useAuthStore.mockReturnValue({
        isAuthenticated: false,
      })

      render(<ProductCard product={mockProduct} />)

      const addButton = screen.getByLabelText(`Adicionar ${mockProduct.name} ao carrinho`)
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Faca login para adicionar produtos ao carrinho')
      })
    })

    test('allows adding to cart when authenticated', async () => {
      const mockAddItem = jest.fn()
      useCartStore.mockReturnValue({
        addItem: mockAddItem,
      })

      render(<ProductCard product={mockProduct} />)

      const addButton = screen.getByLabelText(`Adicionar ${mockProduct.name} ao carrinho`)
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(mockAddItem).toHaveBeenCalledWith(mockProduct, 1)
        expect(toast.success).toHaveBeenCalledWith('Hambúrguer Artesanal adicionado ao carrinho!')
      })
    })
  })

  describe('Quantity Controls', () => {
    test('increments quantity when plus button clicked', () => {
      render(<ProductCard product={mockProduct} />)

      const plusButton = screen.getByLabelText('Aumentar quantidade')
      fireEvent.click(plusButton)

      expect(screen.getByLabelText(/Quantidade: 2/)).toBeInTheDocument()
    })

    test('decrements quantity when minus button clicked', () => {
      render(<ProductCard product={mockProduct} />)

      const plusButton = screen.getByLabelText('Aumentar quantidade')
      const minusButton = screen.getByLabelText('Diminuir quantidade')

      // Increase to 3
      fireEvent.click(plusButton)
      fireEvent.click(plusButton)

      expect(screen.getByLabelText(/Quantidade: 3/)).toBeInTheDocument()

      // Decrease to 2
      fireEvent.click(minusButton)

      expect(screen.getByLabelText(/Quantidade: 2/)).toBeInTheDocument()
    })

    test('does not decrement quantity below 1', () => {
      render(<ProductCard product={mockProduct} />)

      const minusButton = screen.getByLabelText('Diminuir quantidade')

      // Try to decrease below 1
      fireEvent.click(minusButton)
      fireEvent.click(minusButton)

      // Should stay at 1
      expect(screen.getByLabelText(/Quantidade: 1/)).toBeInTheDocument()
    })

    test('adds correct quantity to cart', async () => {
      const mockAddItem = jest.fn()
      useCartStore.mockReturnValue({
        addItem: mockAddItem,
      })

      render(<ProductCard product={mockProduct} />)

      // Increase quantity to 3
      const plusButton = screen.getByLabelText('Aumentar quantidade')
      fireEvent.click(plusButton)
      fireEvent.click(plusButton)

      // Add to cart
      const addButton = screen.getByLabelText(`Adicionar ${mockProduct.name} ao carrinho`)
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(mockAddItem).toHaveBeenCalledWith(mockProduct, 3)
      })
    })

    test('resets quantity to 1 after successful add to cart', async () => {
      const mockAddItem = jest.fn()
      useCartStore.mockReturnValue({
        addItem: mockAddItem,
      })

      render(<ProductCard product={mockProduct} />)

      // Increase quantity to 3
      const plusButton = screen.getByLabelText('Aumentar quantidade')
      fireEvent.click(plusButton)
      fireEvent.click(plusButton)

      expect(screen.getByLabelText(/Quantidade: 3/)).toBeInTheDocument()

      // Add to cart
      const addButton = screen.getByLabelText(`Adicionar ${mockProduct.name} ao carrinho`)
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(screen.getByLabelText(/Quantidade: 1/)).toBeInTheDocument()
      })
    })
  })

  describe('Narguile Products', () => {
    test('calls onNarguileClick for narguile products', async () => {
      const mockOnNarguileClick = jest.fn()

      render(
        <ProductCard
          product={mockNarguileProduct}
          onNarguileClick={mockOnNarguileClick}
        />
      )

      const addButton = screen.getByLabelText(`Personalizar ${mockNarguileProduct.name}`)
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(mockOnNarguileClick).toHaveBeenCalledWith(mockNarguileProduct)
      })
    })

    test('shows "Personalizar" text for narguile products', () => {
      render(<ProductCard product={mockNarguileProduct} />)

      expect(screen.getByText(/Personalizar/)).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    test('shows error toast when add to cart fails', async () => {
      const mockAddItem = jest.fn().mockRejectedValue(new Error('Erro ao adicionar'))
      useCartStore.mockReturnValue({
        addItem: mockAddItem,
      })

      render(<ProductCard product={mockProduct} />)

      const addButton = screen.getByLabelText(`Adicionar ${mockProduct.name} ao carrinho`)
      fireEvent.click(addButton)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Erro ao adicionar')
      })
    })

    test('disables add button while adding to cart', async () => {
      const mockAddItem = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)))
      useCartStore.mockReturnValue({
        addItem: mockAddItem,
      })

      render(<ProductCard product={mockProduct} />)

      const addButton = screen.getByLabelText(`Adicionar ${mockProduct.name} ao carrinho`)
      fireEvent.click(addButton)

      // Button should be disabled immediately
      expect(addButton).toBeDisabled()

      await waitFor(() => {
        expect(addButton).not.toBeDisabled()
      })
    })
  })

  describe('Actions Visibility', () => {
    test('hides actions when showActions is false', () => {
      render(<ProductCard product={mockProduct} showActions={false} />)

      // Should not show add to cart button
      expect(screen.queryByLabelText(`Adicionar ${mockProduct.name} ao carrinho`)).not.toBeInTheDocument()
    })

    test('shows actions by default', () => {
      render(<ProductCard product={mockProduct} />)

      // Should show add to cart button
      expect(screen.getByLabelText(`Adicionar ${mockProduct.name} ao carrinho`)).toBeInTheDocument()
    })
  })

  describe('ARIA Labels', () => {
    test('has correct ARIA labels for quantity controls', () => {
      render(<ProductCard product={mockProduct} />)

      expect(screen.getByLabelText('Diminuir quantidade')).toBeInTheDocument()
      expect(screen.getByLabelText('Aumentar quantidade')).toBeInTheDocument()
      expect(screen.getByLabelText(/Quantidade: 1/)).toBeInTheDocument()
    })

    test('has correct ARIA label for add to cart button', () => {
      render(<ProductCard product={mockProduct} />)

      expect(screen.getByLabelText(`Adicionar ${mockProduct.name} ao carrinho`)).toBeInTheDocument()
    })

    test('has correct ARIA label for narguile customization button', () => {
      render(<ProductCard product={mockNarguileProduct} />)

      expect(screen.getByLabelText(`Personalizar ${mockNarguileProduct.name}`)).toBeInTheDocument()
    })
  })
})
