import { render, screen } from '@testing-library/react';
import Spinner, { LoadingOverlay } from '../Spinner';

describe('Spinner', () => {
  it('renders spinner', () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders flame variant by default', () => {
    const { container } = render(<Spinner />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('renders simple variant', () => {
    const { container } = render(<Spinner variant="simple" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Spinner label="Loading data..." />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('renders extra small size', () => {
    const { container } = render(<Spinner size="xs" />);
    const spinner = container.querySelector('.w-4');
    expect(spinner).toBeInTheDocument();
  });

  it('renders small size', () => {
    const { container } = render(<Spinner size="sm" />);
    const spinner = container.querySelector('.w-6');
    expect(spinner).toBeInTheDocument();
  });

  it('renders medium size by default', () => {
    const { container } = render(<Spinner />);
    const spinner = container.querySelector('.w-8');
    expect(spinner).toBeInTheDocument();
  });

  it('renders large size', () => {
    const { container } = render(<Spinner size="lg" />);
    const spinner = container.querySelector('.w-12');
    expect(spinner).toBeInTheDocument();
  });

  it('renders extra large size', () => {
    const { container } = render(<Spinner size="xl" />);
    const spinner = container.querySelector('.w-16');
    expect(spinner).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Spinner className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders flame variant with two rings', () => {
    const { container } = render(<Spinner variant="flame" />);
    const spinners = container.querySelectorAll('.animate-spin');
    expect(spinners.length).toBe(2);
  });
});

describe('LoadingOverlay', () => {
  it('renders overlay', () => {
    render(<LoadingOverlay />);
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<LoadingOverlay label="Processing..." />);
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('has fixed positioning', () => {
    const { container } = render(<LoadingOverlay />);
    const overlay = container.firstChild;
    expect(overlay).toHaveClass('fixed');
  });

  it('has backdrop blur', () => {
    const { container } = render(<LoadingOverlay />);
    const overlay = container.firstChild;
    expect(overlay).toHaveClass('backdrop-blur-sm');
  });

  it('renders spinner inside overlay', () => {
    const { container } = render(<LoadingOverlay />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});
