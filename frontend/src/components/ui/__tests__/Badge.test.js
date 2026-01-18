import { render, screen } from '@testing-library/react';
import Badge from '../Badge';

describe('Badge', () => {
  it('renders children correctly', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders flame variant by default', () => {
    const { container } = render(<Badge>Flame</Badge>);
    expect(container.firstChild).toHaveClass('bg-gradient-flame');
  });

  it('renders magenta variant', () => {
    const { container } = render(<Badge variant="magenta">Magenta</Badge>);
    expect(container.firstChild).toHaveClass('bg-magenta-500');
  });

  it('renders cyan variant', () => {
    const { container } = render(<Badge variant="cyan">Cyan</Badge>);
    expect(container.firstChild).toHaveClass('bg-cyan-500');
  });

  it('renders success variant', () => {
    const { container } = render(<Badge variant="success">Success</Badge>);
    expect(container.firstChild).toHaveClass('bg-success-500');
  });

  it('renders warning variant', () => {
    const { container } = render(<Badge variant="warning">Warning</Badge>);
    expect(container.firstChild).toHaveClass('bg-warning-500');
  });

  it('renders error variant', () => {
    const { container } = render(<Badge variant="error">Error</Badge>);
    expect(container.firstChild).toHaveClass('bg-error-500');
  });

  it('renders info variant', () => {
    const { container } = render(<Badge variant="info">Info</Badge>);
    expect(container.firstChild).toHaveClass('bg-info-500');
  });

  it('renders outline variant', () => {
    const { container } = render(<Badge variant="outline">Outline</Badge>);
    expect(container.firstChild).toHaveClass('bg-transparent');
    expect(container.firstChild).toHaveClass('border');
  });

  it('renders neutral variant', () => {
    const { container } = render(<Badge variant="neutral">Neutral</Badge>);
    expect(container.firstChild).toHaveClass('bg-neutral-300');
  });

  it('renders small size', () => {
    const { container } = render(<Badge size="sm">Small</Badge>);
    expect(container.firstChild).toHaveClass('px-2');
    expect(container.firstChild).toHaveClass('text-xs');
  });

  it('renders medium size by default', () => {
    const { container } = render(<Badge>Medium</Badge>);
    expect(container.firstChild).toHaveClass('px-2.5');
    expect(container.firstChild).toHaveClass('text-xs');
  });

  it('renders large size', () => {
    const { container } = render(<Badge size="lg">Large</Badge>);
    expect(container.firstChild).toHaveClass('px-3');
    expect(container.firstChild).toHaveClass('text-sm');
  });

  it('renders as dot when dot prop is true', () => {
    const { container } = render(<Badge dot variant="success" />);
    expect(container.firstChild).toHaveClass('rounded-full');
    expect(container.firstChild).toHaveClass('w-2.5');
  });

  it('renders dot with different sizes', () => {
    const { container, rerender } = render(<Badge dot size="sm" />);
    expect(container.firstChild).toHaveClass('w-2');

    rerender(<Badge dot size="lg" />);
    expect(container.firstChild).toHaveClass('w-3');
  });

  it('applies custom className', () => {
    const { container } = render(<Badge className="custom-class">Custom</Badge>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has rounded-full class', () => {
    const { container } = render(<Badge>Rounded</Badge>);
    expect(container.firstChild).toHaveClass('rounded-full');
  });

  it('has transition class for animations', () => {
    const { container } = render(<Badge>Animated</Badge>);
    expect(container.firstChild).toHaveClass('transition-all');
  });
});
