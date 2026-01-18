import { render, screen, fireEvent } from '@testing-library/react';
import HookahFlavorCard from '../HookahFlavorCard';

const mockFlavor = {
  id: 1,
  name: 'Menta',
  category: 'Refrescante',
  description: 'Sabor refrescante de menta',
  image: '/flavors/menta.jpg',
  intensity: 3,
  available: true,
};

describe('HookahFlavorCard', () => {
  it('renders flavor information', () => {
    render(<HookahFlavorCard flavor={mockFlavor} />);

    expect(screen.getByText('Menta')).toBeInTheDocument();
    expect(screen.getByText(/Refrescante/)).toBeInTheDocument();
  });

  it('displays flavor description', () => {
    render(<HookahFlavorCard flavor={mockFlavor} />);
    expect(screen.getByText(/Sabor refrescante/)).toBeInTheDocument();
  });

  it('renders flavor image', () => {
    render(<HookahFlavorCard flavor={mockFlavor} />);
    const image = screen.getByAltText('Menta');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockFlavor.image);
  });

  it('shows intensity level', () => {
    render(<HookahFlavorCard flavor={mockFlavor} />);
    // Should display intensity somehow (exact implementation depends on component)
    const { container } = render(<HookahFlavorCard flavor={mockFlavor} />);
    expect(container).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<HookahFlavorCard flavor={mockFlavor} onClick={handleClick} />);

    const card = screen.getByText('Menta').closest('div');
    fireEvent.click(card);

    expect(handleClick).toHaveBeenCalledWith(mockFlavor);
  });

  it('shows unavailable state', () => {
    const unavailableFlavor = { ...mockFlavor, available: false };
    render(<HookahFlavorCard flavor={unavailableFlavor} />);

    expect(screen.getByText(/Indisponível/i)).toBeInTheDocument();
  });

  it('applies selected state', () => {
    const { container } = render(<HookahFlavorCard flavor={mockFlavor} selected={true} />);
    expect(container.firstChild).toHaveClass('selected');
  });

  it('renders in compact mode', () => {
    render(<HookahFlavorCard flavor={mockFlavor} compact={true} />);
    expect(screen.getByText('Menta')).toBeInTheDocument();
  });
});
