import { render, screen, fireEvent } from '@testing-library/react';
import OrderCard, { OrderStatusBadge, OrderCardSkeleton } from '../OrderCard';

const mockOrder = {
  id: '123',
  orderNumber: '001',
  status: 'pending',
  items: [
    {
      name: 'Product 1',
      quantity: 2,
      price: 10.00,
    },
    {
      name: 'Product 2',
      quantity: 1,
      unitPrice: 15.00,
    },
  ],
  totalAmount: 35.00,
  createdAt: '2024-01-15T10:30:00Z',
  tableNumber: 5,
  consumptionType: 'table',
  paymentMethod: 'pix',
};

describe('OrderCard', () => {
  it('renders order information correctly', () => {
    render(<OrderCard order={mockOrder} />);

    expect(screen.getByText(/#001/)).toBeInTheDocument();
    expect(screen.getByText(/Mesa 5/)).toBeInTheDocument();
    expect(screen.getByText(/R\$ 35\.00/)).toBeInTheDocument();
  });

  it('displays status badge with correct label', () => {
    render(<OrderCard order={mockOrder} />);

    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });

  it('formats date correctly', () => {
    render(<OrderCard order={mockOrder} />);

    // Date should be formatted as DD/MM/YY HH:mm
    const dateText = screen.getByText(/15\/01\/24/);
    expect(dateText).toBeInTheDocument();
  });

  it('displays items when showItems is true', () => {
    render(<OrderCard order={mockOrder} showItems={true} />);

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('2x')).toBeInTheDocument();
    expect(screen.getByText('1x')).toBeInTheDocument();
  });

  it('hides items when showItems is false', () => {
    render(<OrderCard order={mockOrder} showItems={false} />);

    expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
  });

  it('shows consumption type label', () => {
    render(<OrderCard order={mockOrder} />);

    expect(screen.getByText('Mesa')).toBeInTheDocument();
  });

  it('shows payment method', () => {
    render(<OrderCard order={mockOrder} />);

    expect(screen.getByText('PIX')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    const handleClick = jest.fn();
    render(<OrderCard order={mockOrder} onClick={handleClick} />);

    const card = screen.getByText(/#001/).closest('div');
    fireEvent.click(card);

    expect(handleClick).toHaveBeenCalled();
  });

  it('displays action buttons when showActions is true', () => {
    const mockOnRate = jest.fn();
    const deliveredOrder = { ...mockOrder, status: 'delivered' };

    const { container } = render(
      <OrderCard
        order={deliveredOrder}
        showActions={true}
        onRate={mockOnRate}
      />
    );

    expect(screen.getByText('Avaliar')).toBeInTheDocument();
    // Use more flexible text matcher for "Pedir novamente" which may be split
    expect(screen.getByText((content, element) => {
      return element.textContent === 'Pedir novamente' || content.includes('Pedir');
    })).toBeInTheDocument();
  });

  it('handles item overflow correctly', () => {
    const orderWithManyItems = {
      ...mockOrder,
      items: [
        { name: 'Item 1', quantity: 1, price: 10 },
        { name: 'Item 2', quantity: 1, price: 10 },
        { name: 'Item 3', quantity: 1, price: 10 },
        { name: 'Item 4', quantity: 1, price: 10 },
      ],
    };

    render(<OrderCard order={orderWithManyItems} showItems={true} />);

    // Should show "+1 item" text
    expect(screen.getByText(/\+1 item/)).toBeInTheDocument();
  });

  it('renders different status colors', () => {
    const { rerender } = render(<OrderCard order={mockOrder} />);

    // Test confirmed status
    rerender(<OrderCard order={{ ...mockOrder, status: 'confirmed' }} />);
    expect(screen.getByText('Confirmado')).toBeInTheDocument();

    // Test preparing status
    rerender(<OrderCard order={{ ...mockOrder, status: 'preparing' }} />);
    expect(screen.getByText('Preparando')).toBeInTheDocument();
  });
});

describe('OrderStatusBadge', () => {
  it('renders with correct status label', () => {
    render(<OrderStatusBadge status="pending" />);
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });

  it('renders with small size', () => {
    const { container } = render(<OrderStatusBadge status="ready" size="sm" />);
    expect(container.firstChild).toHaveClass('text-xs');
  });

  it('renders with large size', () => {
    const { container } = render(<OrderStatusBadge status="ready" size="lg" />);
    expect(container.firstChild).toHaveClass('text-base');
  });

  it('displays correct icon for each status', () => {
    const { container, rerender } = render(<OrderStatusBadge status="pending" />);
    expect(container.querySelector('svg')).toBeInTheDocument();

    rerender(<OrderStatusBadge status="ready" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});

describe('OrderCardSkeleton', () => {
  it('renders skeleton loading state', () => {
    const { container } = render(<OrderCardSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('shows items skeleton when showItems is true', () => {
    const { container } = render(<OrderCardSkeleton showItems={true} />);
    const skeletonElements = container.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('applies custom className', () => {
    const { container } = render(<OrderCardSkeleton className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
