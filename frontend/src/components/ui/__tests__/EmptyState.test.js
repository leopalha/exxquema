import { render, screen, fireEvent } from '@testing-library/react';
import EmptyState, { EmptyStateInline } from '../EmptyState';
import { ShoppingCart } from 'lucide-react';

describe('EmptyState', () => {
  it('renders default empty state', () => {
    render(<EmptyState />);
    expect(screen.getByText('Nenhum dado encontrado')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<EmptyState title="Custom Title" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('renders with custom description', () => {
    render(<EmptyState description="Custom description text" />);
    expect(screen.getByText('Custom description text')).toBeInTheDocument();
  });

  it('renders cart preset', () => {
    render(<EmptyState type="cart" />);
    expect(screen.getByText('Carrinho vazio')).toBeInTheDocument();
    expect(screen.getByText(/Adicione itens do cardápio/)).toBeInTheDocument();
  });

  it('renders orders preset', () => {
    render(<EmptyState type="orders" />);
    expect(screen.getByText('Nenhum pedido')).toBeInTheDocument();
  });

  it('renders products preset', () => {
    render(<EmptyState type="products" />);
    expect(screen.getByText('Nenhum produto')).toBeInTheDocument();
  });

  it('renders reservations preset', () => {
    render(<EmptyState type="reservations" />);
    expect(screen.getByText('Nenhuma reserva')).toBeInTheDocument();
  });

  it('renders customers preset', () => {
    render(<EmptyState type="customers" />);
    expect(screen.getByText('Nenhum cliente')).toBeInTheDocument();
  });

  it('renders search preset', () => {
    render(<EmptyState type="search" />);
    expect(screen.getByText('Nenhum resultado')).toBeInTheDocument();
  });

  it('renders reports preset', () => {
    render(<EmptyState type="reports" />);
    expect(screen.getByText('Nenhum relatório')).toBeInTheDocument();
  });

  it('renders error preset', () => {
    render(<EmptyState type="error" />);
    expect(screen.getByText('Erro ao carregar')).toBeInTheDocument();
  });

  it('renders custom icon', () => {
    render(<EmptyState icon={ShoppingCart} />);
    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('renders action button', () => {
    render(<EmptyState action="Click Here" />);
    expect(screen.getByText('Click Here')).toBeInTheDocument();
  });

  it('calls onAction when button clicked', () => {
    const handleAction = jest.fn();
    render(<EmptyState onAction={handleAction} actionLabel="Add Item" />);

    fireEvent.click(screen.getByText('Add Item'));
    expect(handleAction).toHaveBeenCalled();
  });

  it('renders small size', () => {
    const { container } = render(<EmptyState size="sm" />);
    expect(container.querySelector('.py-8')).toBeInTheDocument();
  });

  it('renders medium size by default', () => {
    const { container } = render(<EmptyState />);
    expect(container.querySelector('.py-12')).toBeInTheDocument();
  });

  it('renders large size', () => {
    const { container } = render(<EmptyState size="lg" />);
    expect(container.querySelector('.py-16')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<EmptyState className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders icon with gradient background', () => {
    const { container } = render(<EmptyState />);
    const iconContainer = container.querySelector('.bg-gradient-to-br');
    expect(iconContainer).toBeInTheDocument();
  });
});

describe('EmptyStateInline', () => {
  it('renders inline empty state', () => {
    render(<EmptyStateInline />);
    expect(screen.getByText('Nenhum dado encontrado')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<EmptyStateInline message="No items available" />);
    expect(screen.getByText('No items available')).toBeInTheDocument();
  });

  it('renders with custom icon', () => {
    render(<EmptyStateInline icon={ShoppingCart} />);
    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<EmptyStateInline className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has inline flex layout', () => {
    const { container } = render(<EmptyStateInline />);
    expect(container.firstChild).toHaveClass('flex');
    expect(container.firstChild).toHaveClass('items-center');
  });
});
