import { render, screen, fireEvent } from '@testing-library/react';
import Input, { Textarea } from '../Input';
import { User, Mail } from 'lucide-react';

describe('Input', () => {
  it('renders input correctly', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Input label="Username" />);
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('renders with helper text', () => {
    render(<Input helperText="Please enter your name" />);
    expect(screen.getByText('Please enter your name')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('handles input changes', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('renders left icon', () => {
    render(<Input leftIcon={<User data-testid="user-icon" />} />);
    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
  });

  it('renders right icon', () => {
    render(<Input rightIcon={<Mail data-testid="mail-icon" />} />);
    expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
  });

  it('disables input when disabled prop is true', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('supports different input types', () => {
    const { rerender } = render(<Input type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" />);
    const input = screen.getByPlaceholderText('') || document.querySelector('input[type="password"]');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('applies full width by default', () => {
    const { container } = render(<Input />);
    expect(container.firstChild).toHaveClass('w-full');
  });

  it('can disable full width', () => {
    const { container } = render(<Input fullWidth={false} />);
    expect(container.firstChild).not.toHaveClass('w-full');
  });

  it('applies custom className', () => {
    render(<Input className="custom-class" />);
    const container = screen.getByRole('textbox').closest('div').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('handles focus and blur events', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');

    fireEvent.focus(input);
    fireEvent.blur(input);

    // Input should still be in document after focus/blur
    expect(input).toBeInTheDocument();
  });

  it('shows error styles when error prop is provided', () => {
    const { container } = render(<Input error="Error message" />);
    const wrapper = container.querySelector('div > div');
    expect(wrapper.className).toContain('border-error-500');
  });

  it('shows success styles when success prop is provided', () => {
    const { container } = render(<Input success helperText="Success!" />);
    const wrapper = container.querySelector('div > div');
    expect(wrapper.className).toContain('border-success-500');
  });
});

describe('Textarea', () => {
  it('renders textarea correctly', () => {
    render(<Textarea placeholder="Enter description" />);
    expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Textarea label="Description" />);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('renders with helper text', () => {
    render(<Textarea helperText="Maximum 500 characters" />);
    expect(screen.getByText('Maximum 500 characters')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<Textarea error="Description is required" />);
    expect(screen.getByText('Description is required')).toBeInTheDocument();
  });

  it('handles textarea changes', () => {
    const handleChange = jest.fn();
    render(<Textarea onChange={handleChange} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'test description' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('disables textarea when disabled prop is true', () => {
    render(<Textarea disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('supports custom rows', () => {
    render(<Textarea rows={10} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '10');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Textarea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('applies custom className', () => {
    render(<Textarea className="custom-class" />);
    const container = screen.getByRole('textbox').parentElement;
    expect(container).toHaveClass('custom-class');
  });
});
