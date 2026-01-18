import { render, screen } from '@testing-library/react';
import DemoModeBanner from '../DemoModeBanner';

describe('DemoModeBanner', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('renders in development mode', () => {
    process.env.NODE_ENV = 'development';
    render(<DemoModeBanner />);

    // Component should render
    const { container } = render(<DemoModeBanner />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('does not render in production', () => {
    process.env.NODE_ENV = 'production';
    const { container } = render(<DemoModeBanner />);

    // Should not render anything
    expect(container.firstChild).toBeNull();
  });
});
