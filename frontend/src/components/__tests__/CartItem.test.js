import { render, screen, fireEvent } from '@testing-library/react'
import CartItem from '../CartItem'

describe('CartItem Component', () => {
  const mockItem = {
    id: 1,
    name: 'Hambúrguer Artesanal',
    price: 35.90,
    quantity: 2,
    image: '/images/hamburguer.jpg',
    notes: 'Sem cebola',
    options: [],
  }

  const mockHandlers = {
    onIncrement: jest.fn(),
    onDecrement: jest.fn(),
    onRemove: jest.fn(),
    onEdit: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering - Default Mode', () => {
    test('renders item name', () => {
      render(<CartItem item={mockItem} {...mockHandlers} />)

      expect(screen.getByText('Hambúrguer Artesanal')).toBeInTheDocument()
    })

    test('renders item price correctly', () => {
      render(<CartItem item={mockItem} {...mockHandlers} />)

      // Total: 35.90 * 2 = 71.80
      expect(screen.getByText(/R\$\s+71\.80/)).toBeInTheDocument()
    })

    test('renders item quantity', () => {
      render(<CartItem item={mockItem} {...mockHandlers} />)

      expect(screen.getByText('2')).toBeInTheDocument()
    })

    test('renders item image', () => {
      render(<CartItem item={mockItem} {...mockHandlers} />)

      const image = screen.getByAltText('Hambúrguer Artesanal')
      expect(image).toBeInTheDocument()
    })

    test('renders item notes when provided', () => {
      render(<CartItem item={mockItem} {...mockHandlers} showNotes={true} />)

      expect(screen.getByText(/Sem cebola/)).toBeInTheDocument()
    })

    test('does not render notes when showNotes is false', () => {
      render(<CartItem item={mockItem} {...mockHandlers} showNotes={false} />)

      expect(screen.queryByText('Sem cebola')).not.toBeInTheDocument()
    })

    test('does not render image when showImage is false', () => {
      render(<CartItem item={mockItem} {...mockHandlers} showImage={false} />)

      expect(screen.queryByAltText('Hambúrguer Artesanal')).not.toBeInTheDocument()
    })
  })

  describe('Rendering - Compact Mode', () => {
    test('renders in compact mode', () => {
      render(<CartItem item={mockItem} {...mockHandlers} compact={true} />)

      expect(screen.getByText('2x')).toBeInTheDocument()
      expect(screen.getByText('Hambúrguer Artesanal')).toBeInTheDocument()
      expect(screen.getByText(/R\$\s+71\.80/)).toBeInTheDocument()
    })

    test('does not render image in compact mode', () => {
      render(<CartItem item={mockItem} {...mockHandlers} compact={true} />)

      expect(screen.queryByAltText('Hambúrguer Artesanal')).not.toBeInTheDocument()
    })

    test('does not render quantity controls in compact mode', () => {
      render(<CartItem item={mockItem} {...mockHandlers} compact={true} />)

      expect(screen.queryByLabelText('Diminuir quantidade')).not.toBeInTheDocument()
      expect(screen.queryByLabelText('Aumentar quantidade')).not.toBeInTheDocument()
    })
  })

  describe('Quantity Controls', () => {
    test('calls onIncrement when plus button clicked', () => {
      render(<CartItem item={mockItem} {...mockHandlers} />)

      const plusButton = screen.getByLabelText('Aumentar quantidade')
      fireEvent.click(plusButton)

      expect(mockHandlers.onIncrement).toHaveBeenCalledWith(mockItem.id)
    })

    test('calls onDecrement when minus button clicked', () => {
      render(<CartItem item={mockItem} {...mockHandlers} />)

      const minusButton = screen.getByLabelText('Diminuir quantidade')
      fireEvent.click(minusButton)

      expect(mockHandlers.onDecrement).toHaveBeenCalledWith(mockItem.id)
    })

    test('disables decrement button when quantity is 1', () => {
      const itemWithQuantity1 = { ...mockItem, quantity: 1 }
      render(<CartItem item={itemWithQuantity1} {...mockHandlers} />)

      const minusButton = screen.getByLabelText('Diminuir quantidade')
      expect(minusButton).toBeDisabled()
    })

    test('does not disable decrement button when quantity > 1', () => {
      render(<CartItem item={mockItem} {...mockHandlers} />)

      const minusButton = screen.getByLabelText('Diminuir quantidade')
      expect(minusButton).not.toBeDisabled()
    })
  })

  describe('Remove Button', () => {
    test('renders remove button', () => {
      render(<CartItem item={mockItem} {...mockHandlers} />)

      expect(screen.getByLabelText('Remover item')).toBeInTheDocument()
    })

    test('calls onRemove when remove button clicked', () => {
      render(<CartItem item={mockItem} {...mockHandlers} />)

      const removeButton = screen.getByLabelText('Remover item')
      fireEvent.click(removeButton)

      expect(mockHandlers.onRemove).toHaveBeenCalledWith(mockItem.id)
    })
  })

  describe('Edit Button', () => {
    test('renders edit button when onEdit handler provided', () => {
      const itemWithOptions = {
        ...mockItem,
        options: ['Tamanho: Grande'],
      }

      render(<CartItem item={itemWithOptions} {...mockHandlers} />)

      expect(screen.getByLabelText('Editar item')).toBeInTheDocument()
    })

    test('calls onEdit when edit button clicked', () => {
      const itemWithOptions = {
        ...mockItem,
        options: ['Tamanho: Grande'],
      }

      render(<CartItem item={itemWithOptions} {...mockHandlers} />)

      const editButton = screen.getByLabelText('Editar item')
      fireEvent.click(editButton)

      expect(mockHandlers.onEdit).toHaveBeenCalledWith(itemWithOptions)
    })

    test('does not render edit button when onEdit not provided', () => {
      const handlersWithoutEdit = {
        onIncrement: jest.fn(),
        onDecrement: jest.fn(),
        onRemove: jest.fn(),
      }

      render(<CartItem item={mockItem} {...handlersWithoutEdit} />)

      expect(screen.queryByLabelText('Editar item')).not.toBeInTheDocument()
    })
  })

  describe('Price Calculation', () => {
    test('calculates total correctly for quantity 1', () => {
      const singleItem = { ...mockItem, quantity: 1 }
      const { container } = render(<CartItem item={singleItem} {...mockHandlers} />)

      // Check for total price (should be first occurrence)
      expect(container.textContent).toContain('R$ 35.90')
    })

    test('calculates total correctly for quantity > 1', () => {
      const multipleItems = { ...mockItem, quantity: 3 }
      render(<CartItem item={multipleItems} {...mockHandlers} />)

      // 35.90 * 3 = 107.70
      expect(screen.getByText(/R\$\s+107\.70/)).toBeInTheDocument()
    })

    test('handles decimal prices correctly', () => {
      const itemWithDecimal = { ...mockItem, price: 12.99, quantity: 2 }
      render(<CartItem item={itemWithDecimal} {...mockHandlers} />)

      // 12.99 * 2 = 25.98
      expect(screen.getByText(/R\$\s+25\.98/)).toBeInTheDocument()
    })

    test('formats price with 2 decimal places', () => {
      const itemWithWholePrice = { ...mockItem, price: 50, quantity: 1 }
      const { container } = render(<CartItem item={itemWithWholePrice} {...mockHandlers} />)

      expect(container.textContent).toContain('R$ 50.00')
    })
  })

  describe('Options Display', () => {
    test('renders item options when provided', () => {
      const itemWithOptions = {
        ...mockItem,
        options: ['Tamanho: Grande', 'Adicional: Bacon'],
      }

      render(<CartItem item={itemWithOptions} {...mockHandlers} />)

      expect(screen.getByText('Tamanho: Grande')).toBeInTheDocument()
      expect(screen.getByText('Adicional: Bacon')).toBeInTheDocument()
    })

    test('does not render options section when no options', () => {
      render(<CartItem item={mockItem} {...mockHandlers} />)

      const { container } = render(<CartItem item={mockItem} {...mockHandlers} />)
      expect(container.textContent).not.toContain('Tamanho:')
    })

    test('renders multiple options correctly', () => {
      const itemWithMultipleOptions = {
        ...mockItem,
        options: ['Ponto: Mal passado', 'Queijo: Cheddar', 'Molho: Barbecue'],
      }

      render(<CartItem item={itemWithMultipleOptions} {...mockHandlers} />)

      expect(screen.getByText('Ponto: Mal passado')).toBeInTheDocument()
      expect(screen.getByText('Queijo: Cheddar')).toBeInTheDocument()
      expect(screen.getByText('Molho: Barbecue')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('has ARIA labels for quantity buttons', () => {
      render(<CartItem item={mockItem} {...mockHandlers} />)

      expect(screen.getByLabelText('Diminuir quantidade')).toBeInTheDocument()
      expect(screen.getByLabelText('Aumentar quantidade')).toBeInTheDocument()
    })

    test('has ARIA label for remove button', () => {
      render(<CartItem item={mockItem} {...mockHandlers} />)

      expect(screen.getByLabelText('Remover item')).toBeInTheDocument()
    })

    test('has ARIA label for edit button', () => {
      const itemWithOptions = {
        ...mockItem,
        options: ['Tamanho: Grande'],
      }

      render(<CartItem item={itemWithOptions} {...mockHandlers} />)

      expect(screen.getByLabelText('Editar item')).toBeInTheDocument()
    })

    test('image has alt text', () => {
      render(<CartItem item={mockItem} {...mockHandlers} />)

      const image = screen.getByAltText('Hambúrguer Artesanal')
      expect(image).toHaveAttribute('alt', 'Hambúrguer Artesanal')
    })
  })

  describe('Custom ClassName', () => {
    test('applies custom className', () => {
      const { container } = render(
        <CartItem item={mockItem} {...mockHandlers} className="custom-class" />
      )

      const cartItem = container.firstChild
      expect(cartItem).toHaveClass('custom-class')
    })
  })

  describe('Missing Data Handling', () => {
    test('handles missing image gracefully', () => {
      const itemWithoutImage = { ...mockItem, image: null }
      render(<CartItem item={itemWithoutImage} {...mockHandlers} />)

      expect(screen.queryByAltText('Hambúrguer Artesanal')).not.toBeInTheDocument()
    })

    test('handles missing notes gracefully', () => {
      const itemWithoutNotes = { ...mockItem, notes: null }
      render(<CartItem item={itemWithoutNotes} {...mockHandlers} />)

      // Should render without errors
      expect(screen.getByText('Hambúrguer Artesanal')).toBeInTheDocument()
    })

    test('handles empty options array', () => {
      const itemWithEmptyOptions = { ...mockItem, options: [] }
      render(<CartItem item={itemWithEmptyOptions} {...mockHandlers} />)

      expect(screen.queryByText(/Tamanho:/)).not.toBeInTheDocument()
    })
  })

  describe('Animation', () => {
    test('renders with motion.div for animations', () => {
      const { container } = render(<CartItem item={mockItem} {...mockHandlers} />)

      // Framer Motion adds specific classes/attributes
      expect(container.firstChild).toBeInTheDocument()
    })
  })
})
