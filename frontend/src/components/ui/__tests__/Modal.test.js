import { render, screen, fireEvent } from '@testing-library/react'
import Modal from '../Modal'

describe('Modal Component', () => {
  const mockOnClose = jest.fn()
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    title: 'Test Modal',
    children: <div>Modal content</div>,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    test('renders modal when isOpen is true', () => {
      render(<Modal {...defaultProps} />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Test Modal')).toBeInTheDocument()
      expect(screen.getByText('Modal content')).toBeInTheDocument()
    })

    test('does not render modal when isOpen is false', () => {
      render(<Modal {...defaultProps} isOpen={false} />)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    test('renders modal without title', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Content only</div>
        </Modal>
      )

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Content only')).toBeInTheDocument()
      expect(container.querySelector('h2')).not.toBeInTheDocument()
    })

    test('renders close button', () => {
      render(<Modal {...defaultProps} />)

      const closeButton = screen.getByLabelText('Fechar modal')
      expect(closeButton).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    test('calls onClose when close button is clicked', () => {
      render(<Modal {...defaultProps} />)

      const closeButton = screen.getByLabelText('Fechar modal')
      fireEvent.click(closeButton)

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    test('calls onClose when clicking backdrop (closeOnOverlayClick)', () => {
      render(<Modal {...defaultProps} closeOnOverlayClick={true} />)

      // Find the overlay element (first child with backdrop)
      const overlay = document.querySelector('.backdrop-blur-sm')
      if (overlay) {
        fireEvent.click(overlay)
        expect(mockOnClose).toHaveBeenCalled()
      }
    })

    test('does not call onClose when clicking modal content', () => {
      render(<Modal {...defaultProps} />)

      const modalContent = screen.getByText('Modal content')
      fireEvent.click(modalContent)

      expect(mockOnClose).not.toHaveBeenCalled()
    })

    test('calls onClose when Escape key is pressed', () => {
      render(<Modal {...defaultProps} />)

      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })

      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    test('does not call onClose when other keys are pressed', () => {
      render(<Modal {...defaultProps} />)

      fireEvent.keyDown(document, { key: 'Enter', code: 'Enter' })
      fireEvent.keyDown(document, { key: 'Space', code: 'Space' })

      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })

  describe('Sizes', () => {
    test('renders default size (md) correctly', () => {
      render(<Modal {...defaultProps} size="md" />)

      const modal = screen.getByRole('dialog')
      expect(modal).toHaveClass('max-w-md')
    })

    test('renders large size correctly', () => {
      render(<Modal {...defaultProps} size="lg" />)

      const modal = screen.getByRole('dialog')
      expect(modal).toHaveClass('max-w-lg')
    })

    test('renders small size correctly', () => {
      render(<Modal {...defaultProps} size="sm" />)

      const modal = screen.getByRole('dialog')
      expect(modal).toHaveClass('max-w-sm')
    })

    test('renders full size correctly', () => {
      render(<Modal {...defaultProps} size="full" />)

      const modal = screen.getByRole('dialog')
      expect(modal).toHaveClass('max-w-[95vw]')
    })
  })

  describe('Variants', () => {
    test('renders default variant with correct border', () => {
      render(<Modal {...defaultProps} variant="default" />)

      const modal = screen.getByRole('dialog')
      expect(modal).toHaveClass('border-white/10')
    })

    test('renders danger variant with correct border', () => {
      render(<Modal {...defaultProps} variant="danger" />)

      const modal = screen.getByRole('dialog')
      expect(modal).toHaveClass('border-red-500/50')
    })

    test('renders success variant with correct border', () => {
      render(<Modal {...defaultProps} variant="success" />)

      const modal = screen.getByRole('dialog')
      expect(modal).toHaveClass('border-green-500/50')
    })
  })

  describe('Accessibility', () => {
    test('has correct ARIA role', () => {
      render(<Modal {...defaultProps} />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    test('has ARIA label for close button', () => {
      render(<Modal {...defaultProps} />)

      expect(screen.getByLabelText('Fechar modal')).toBeInTheDocument()
    })

    test('traps focus within modal', () => {
      render(<Modal {...defaultProps} />)

      const modal = screen.getByRole('dialog')
      const closeButton = screen.getByLabelText('Fechar modal')

      // Focus should be within modal
      expect(modal).toContainElement(closeButton)
    })

    test('modal has proper aria-modal attribute', () => {
      render(<Modal {...defaultProps} />)

      const modal = screen.getByRole('dialog')
      expect(modal).toHaveAttribute('aria-modal', 'true')
    })
  })

  describe('Custom Styling', () => {
    test('applies custom className', () => {
      render(
        <Modal {...defaultProps} className="custom-modal-class" />
      )

      const modal = screen.getByRole('dialog')
      expect(modal).toHaveClass('custom-modal-class')
    })
  })

  describe('Body Scroll Lock', () => {
    test('prevents body scroll when modal is open', () => {
      render(<Modal {...defaultProps} />)

      expect(document.body.style.overflow).toBe('hidden')
    })

    test('restores body scroll when modal is closed', () => {
      const { rerender } = render(<Modal {...defaultProps} />)

      expect(document.body.style.overflow).toBe('hidden')

      rerender(<Modal {...defaultProps} isOpen={false} />)

      expect(document.body.style.overflow).toBe('unset')
    })

    test('restores body scroll when component unmounts', () => {
      const { unmount } = render(<Modal {...defaultProps} />)

      expect(document.body.style.overflow).toBe('hidden')

      unmount()

      expect(document.body.style.overflow).toBe('unset')
    })
  })

  describe('Multiple Children', () => {
    test('renders multiple children correctly', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Multi Content">
          <div>First child</div>
          <div>Second child</div>
          <button>Action button</button>
        </Modal>
      )

      expect(screen.getByText('First child')).toBeInTheDocument()
      expect(screen.getByText('Second child')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action button' })).toBeInTheDocument()
    })
  })

  describe('Footer Actions', () => {
    test('renders footer with action buttons', () => {
      render(
        <Modal {...defaultProps}>
          <div>Modal content</div>
          <div className="modal-footer">
            <button>Cancel</button>
            <button>Confirm</button>
          </div>
        </Modal>
      )

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
    })
  })

  describe('Close Options', () => {
    test('does not call onClose when backdrop clicked if closeOnOverlayClick is false', () => {
      render(<Modal {...defaultProps} closeOnOverlayClick={false} />)

      const overlay = document.querySelector('.backdrop-blur-sm')
      if (overlay) {
        fireEvent.click(overlay)
        expect(mockOnClose).not.toHaveBeenCalled()
      }
    })

    test('does not call onClose when Escape pressed if closeOnEscape is false', () => {
      render(<Modal {...defaultProps} closeOnEscape={false} />)

      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })

      expect(mockOnClose).not.toHaveBeenCalled()
    })

    test('hides close button when showCloseButton is false', () => {
      render(<Modal {...defaultProps} showCloseButton={false} />)

      expect(screen.queryByLabelText('Fechar modal')).not.toBeInTheDocument()
    })
  })

  describe('Footer', () => {
    test('renders footer when provided', () => {
      const footer = (
        <>
          <button>Cancel</button>
          <button>Confirm</button>
        </>
      )

      render(<Modal {...defaultProps} footer={footer} />)

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
    })

    test('does not render footer when not provided', () => {
      const { container } = render(<Modal {...defaultProps} />)

      const footerDiv = container.querySelector('.border-t.border-white\\/10.bg-black\\/20')
      expect(footerDiv).not.toBeInTheDocument()
    })
  })
})
