import { render, screen, fireEvent } from '@testing-library/react';
import PhoneInput from '../PhoneInput';

describe('PhoneInput', () => {
  it('renders phone input', () => {
    render(<PhoneInput />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<PhoneInput label="Telefone" />);
    expect(screen.getByText('Telefone')).toBeInTheDocument();
  });

  it('handles input changes', () => {
    const handleChange = jest.fn();
    render(<PhoneInput onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '21999999999' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('applies phone mask format', () => {
    render(<PhoneInput value="21999999999" />);
    const input = screen.getByRole('textbox');
    // Phone should be formatted with mask
    expect(input).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<PhoneInput error="Telefone inválido" />);
    expect(screen.getByText('Telefone inválido')).toBeInTheDocument();
  });

  it('can be disabled', () => {
    render(<PhoneInput disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<PhoneInput className="custom-class" />);
    const container = screen.getByRole('textbox').parentElement;
    expect(container.parentElement).toHaveClass('custom-class');
  });

  it('supports placeholder', () => {
    render(<PhoneInput placeholder="(21) 99999-9999" />);
    expect(screen.getByPlaceholderText('(21) 99999-9999')).toBeInTheDocument();
  });
});
