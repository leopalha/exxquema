import { render, screen } from '@testing-library/react';
import FlameLogo from '../Logo';

describe('FlameLogo', () => {
  it('renders default logo with text', () => {
    render(<FlameLogo />);
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(1);
  });

  it('renders logo with custom size', () => {
    render(<FlameLogo size={60} />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('width', '60');
    expect(image).toHaveAttribute('height', '60');
  });

  it('renders compact version without width issues', () => {
    render(<FlameLogo compact={true} />);
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
  });

  it('renders badge version (only icon)', () => {
    render(<FlameLogo badge={true} />);
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
  });

  it('renders supreme version (large icon)', () => {
    render(<FlameLogo supreme={true} />);
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
  });

  it('renders gradient version', () => {
    const { container } = render(<FlameLogo gradient={true} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('hides text when showText is false', () => {
    const { container } = render(<FlameLogo showText={false} />);
    // Should only have the icon image, no text element
    expect(container.querySelector('img')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<FlameLogo className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
