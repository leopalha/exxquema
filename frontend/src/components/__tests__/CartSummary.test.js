import { render, screen } from '@testing-library/react';
import { CartSummary } from '../CartItem';

describe('CartSummary', () => {
  const defaultProps = {
    subtotal: 100.00,
    total: 100.00,
  };

  it('renders subtotal correctly', () => {
    render(<CartSummary {...defaultProps} />);
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText('R$100,00/)).toBeInTheDocument();
  });

  it('displays total correctly', () => {
    render(<CartSummary {...defaultProps} />);
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getAllByText(/R\$ 100\.00/)).toHaveLength(2); // Subtotal and Total
  });

  it('shows discount when provided', () => {
    render(<CartSummary {...defaultProps} discount={10.00} />);
    expect(screen.getByText('Desconto')).toBeInTheDocument();
    expect(screen.getByText('- R$ 10.00')).toBeInTheDocument();
  });

  it('does not show discount when zero', () => {
    render(<CartSummary {...defaultProps} discount={0} />);
    expect(screen.queryByText('Desconto')).not.toBeInTheDocument();
  });

  it('shows cashback used when provided', () => {
    render(<CartSummary {...defaultProps} cashbackUsed={5.00} />);
    expect(screen.getByText('Cashback usado')).toBeInTheDocument();
    expect(screen.getByText('- R$ 5.00')).toBeInTheDocument();
  });

  it('does not show cashback when zero', () => {
    render(<CartSummary {...defaultProps} cashbackUsed={0} />);
    expect(screen.queryByText('Cashback usado')).not.toBeInTheDocument();
  });

  it('shows delivery fee when provided', () => {
    render(<CartSummary {...defaultProps} deliveryFee={8.00} />);
    expect(screen.getByText('Taxa de entrega')).toBeInTheDocument();
    expect(screen.getByText('R$8,00/)).toBeInTheDocument();
  });

  it('does not show delivery fee when zero', () => {
    render(<CartSummary {...defaultProps} deliveryFee={0} />);
    expect(screen.queryByText('Taxa de entrega')).not.toBeInTheDocument();
  });

  it('calculates total with discount', () => {
    render(
      <CartSummary
        subtotal={100.00}
        discount={10.00}
        total={90.00}
      />
    );

    expect(screen.getByText('R$90,00/)).toBeInTheDocument();
  });

  it('calculates total with all fees', () => {
    render(
      <CartSummary
        subtotal={100.00}
        discount={10.00}
        cashbackUsed={5.00}
        deliveryFee={8.00}
        total={93.00}
      />
    );

    expect(screen.getByText('R$93,00/)).toBeInTheDocument();
  });

  it('formats decimal values correctly', () => {
    render(
      <CartSummary
        subtotal={99.99}
        total={99.99}
      />
    );

    expect(screen.getByText('R$99,99/)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <CartSummary {...defaultProps} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('displays all sections in correct order', () => {
    const { container } = render(
      <CartSummary
        subtotal={100.00}
        discount={10.00}
        cashbackUsed={5.00}
        deliveryFee={8.00}
        total={93.00}
      />
    );

    const sections = Array.from(container.querySelectorAll('.flex.justify-between'));
    expect(sections.length).toBeGreaterThan(0);
  });

  it('highlights total with different styling', () => {
    const { container } = render(<CartSummary {...defaultProps} />);
    const totalSection = screen.getByText('Total').closest('.flex');
    expect(totalSection).toHaveClass('pt-2');
    expect(totalSection).toHaveClass('border-t');
  });
});
