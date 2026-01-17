import { render, screen } from '@testing-library/react'
import FlameLogo from '../FlameLogo'

describe('FlameLogo Component', () => {
  describe('Rendering', () => {
    test('renders logo correctly', () => {
      const { container } = render(<FlameLogo />)

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    test('applies default size', () => {
      const { container } = render(<FlameLogo />)

      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('width', '48')
      expect(svg).toHaveAttribute('height', '48')
    })

    test('applies custom size', () => {
      const { container } = render(<FlameLogo size={64} />)

      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('width', '64')
      expect(svg).toHaveAttribute('height', '64')
    })

    test('applies custom className', () => {
      const { container } = render(<FlameLogo className="custom-logo" />)

      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('custom-logo')
    })

    test('renders compact variant', () => {
      const { container } = render(<FlameLogo compact={true} />)

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    test('renders full variant (default)', () => {
      const { container } = render(<FlameLogo compact={false} />)

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Color Variants', () => {
    test('renders with default color', () => {
      const { container } = render(<FlameLogo />)

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    test('renders with custom color', () => {
      const { container } = render(<FlameLogo color="#FF5500" />)

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    test('renders with white color', () => {
      const { container } = render(<FlameLogo color="#FFFFFF" />)

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Animations', () => {
    test('renders with animation by default', () => {
      const { container } = render(<FlameLogo />)

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    test('renders without animation when specified', () => {
      const { container } = render(<FlameLogo animated={false} />)

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('has accessible title', () => {
      const { container } = render(<FlameLogo />)

      const title = container.querySelector('title')
      expect(title).toHaveTextContent('FLAME Lounge')
    })

    test('has role="img"', () => {
      const { container } = render(<FlameLogo />)

      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('role', 'img')
    })

    test('has aria-label', () => {
      const { container } = render(<FlameLogo />)

      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('aria-label')
    })
  })

  describe('Responsive', () => {
    test('renders at different sizes', () => {
      const sizes = [24, 32, 48, 64, 96, 128]

      sizes.forEach(size => {
        const { container } = render(<FlameLogo size={size} />)
        const svg = container.querySelector('svg')

        expect(svg).toHaveAttribute('width', size.toString())
        expect(svg).toHaveAttribute('height', size.toString())
      })
    })
  })

  describe('Props Combination', () => {
    test('renders with multiple props', () => {
      const { container } = render(
        <FlameLogo
          size={72}
          color="#FF5500"
          compact={true}
          animated={false}
          className="custom-class"
        />
      )

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveAttribute('width', '72')
      expect(svg).toHaveClass('custom-class')
    })
  })
})
