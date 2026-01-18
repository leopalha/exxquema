import { render, screen } from '@testing-library/react';
import CashbackDisplay from '../CashbackDisplay';

jest.mock('../../stores/themeStore', () => ({
  useThemeStore: () => ({
    getPalette: () => ({
      primary: '#FF006E',
      secondary: '#00D4FF',
      gradient: 'from-magenta-500 to-cyan-500',
    }),
  }),
}));

describe('CashbackDisplay', () => {
  it('renders cashback amount', () => {
    render(<CashbackDisplay amount={50.00} />);
    expect(screen.getByText(/50/)).toBeInTheDocument();
  });

  it('displays zero cashback', () => {
    render(<CashbackDisplay amount={0} />);
    expect(screen.getByText(/0/)).toBeInTheDocument();
  });

  it('formats large amounts correctly', () => {
    render(<CashbackDisplay amount={1250.50} />);
    expect(screen.getByText(/1250/)).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    const { container } = render(<CashbackDisplay amount={25.00} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('displays currency symbol', () => {
    render(<CashbackDisplay amount={100.00} />);
    expect(screen.getByText(/R\$/)).toBeInTheDocument();
  });

  it('shows decimal places', () => {
    render(<CashbackDisplay amount={99.99} />);
    const text = screen.getByText(/99/);
    expect(text).toBeInTheDocument();
  });
});
