import { render, screen } from '@testing-library/react';
import DemoModeBanner from '../DemoModeBanner';

describe('DemoModeBanner', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('renders in production mode', () => {
    process.env.NODE_ENV = 'production';
    process.env.NEXT_PUBLIC_DEMO_MODE = undefined;

    const { container } = render(<DemoModeBanner />);
    // Component renders in production to show demo warning
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders when DEMO_MODE is true', () => {
    process.env.NODE_ENV = 'development';
    process.env.NEXT_PUBLIC_DEMO_MODE = 'true';

    const { container } = render(<DemoModeBanner />);
    // Component renders when demo mode is explicitly enabled
    expect(container.firstChild).toBeInTheDocument();
  });
});
