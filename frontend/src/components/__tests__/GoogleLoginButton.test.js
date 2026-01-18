import { render, screen, fireEvent } from '@testing-library/react';
import GoogleLoginButton from '../GoogleLoginButton';

describe('GoogleLoginButton', () => {
  it('renders google login button', () => {
    render(<GoogleLoginButton />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('displays google icon', () => {
    const { container } = render(<GoogleLoginButton />);
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('shows login text by default', () => {
    render(<GoogleLoginButton />);
    expect(screen.getByText(/Continuar com Google/i)).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<GoogleLoginButton onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('can be disabled', () => {
    render(<GoogleLoginButton disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows loading state', () => {
    render(<GoogleLoginButton loading />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<GoogleLoginButton className="custom-class" />);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('renders with full width', () => {
    render(<GoogleLoginButton fullWidth />);
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });
});
