import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';
import { User, Plus } from 'lucide-react';

describe('Button', () => {
  it('renders button with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders primary variant by default', () => {
    render(<Button>Primary</Button>);
    const button = screen.getByText('Primary');
    expect(button).toHaveClass('bg-gradient-flame');
  });

  it('renders secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByText('Secondary');
    expect(button).toHaveClass('bg-transparent');
  });

  it('renders ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByText('Ghost');
    expect(button).toHaveClass('bg-transparent');
  });

  it('renders danger variant', () => {
    render(<Button variant="danger">Delete</Button>);
    const button = screen.getByText('Delete');
    expect(button).toHaveClass('bg-error-500');
  });

  it('renders success variant', () => {
    render(<Button variant="success">Success</Button>);
    const button = screen.getByText('Success');
    expect(button).toHaveClass('bg-success-500');
  });

  it('renders small size', () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByText('Small');
    expect(button).toHaveClass('px-3');
  });

  it('renders large size', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByText('Large');
    expect(button).toHaveClass('px-8');
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('disables button when loading', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByText('Carregando...');
    expect(button).toBeDisabled();
  });

  it('renders with full width', () => {
    render(<Button fullWidth>Full Width</Button>);
    const button = screen.getByText('Full Width');
    expect(button).toHaveClass('w-full');
  });

  it('renders left icon', () => {
    render(<Button leftIcon={<User data-testid="user-icon" />}>With Icon</Button>);
    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
  });

  it('renders right icon', () => {
    render(<Button rightIcon={<Plus data-testid="plus-icon" />}>With Icon</Button>);
    expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
  });

  it('renders both left and right icons', () => {
    render(
      <Button
        leftIcon={<User data-testid="user-icon" />}
        rightIcon={<Plus data-testid="plus-icon" />}
      >
        Both Icons
      </Button>
    );
    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByText('Custom');
    expect(button).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Button ref={ref}>Button</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('supports different button types', () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByText('Submit');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);

    fireEvent.click(screen.getByText('Disabled'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
