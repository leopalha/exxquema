import { render } from '@testing-library/react';
import GoogleLoginButton from '../GoogleLoginButton';

// Mock Google Identity Services
const mockInitialize = jest.fn();
const mockRenderButton = jest.fn();

describe('GoogleLoginButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock window.google completely
    Object.defineProperty(window, 'google', {
      writable: true,
      configurable: true,
      value: {
        accounts: {
          id: {
            initialize: mockInitialize,
            renderButton: mockRenderButton,
            prompt: jest.fn(),
          },
        },
      },
    });
  });

  afterEach(() => {
    delete window.google;
  });

  it('renders google login button container', () => {
    const { container } = render(<GoogleLoginButton />);
    // Component renders a div container for the Google button
    expect(container.firstChild).toBeInTheDocument();
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('renders without crashing when Google SDK available', () => {
    expect(() => {
      render(<GoogleLoginButton />);
    }).not.toThrow();
  });

  it('renders without crashing when Google SDK missing', () => {
    delete window.google;

    expect(() => {
      render(<GoogleLoginButton />);
    }).not.toThrow();
  });

  it('accepts text prop', () => {
    const { container } = render(<GoogleLoginButton text="signup_with" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('accepts size prop', () => {
    const { container } = render(<GoogleLoginButton size="large" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('accepts theme prop', () => {
    const { container } = render(<GoogleLoginButton theme="filled_blue" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('accepts shape prop', () => {
    const { container } = render(<GoogleLoginButton shape="pill" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('accepts onSuccess callback prop', () => {
    const handleSuccess = jest.fn();
    const { container } = render(<GoogleLoginButton onSuccess={handleSuccess} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders multiple instances independently', () => {
    const { container: container1 } = render(<GoogleLoginButton />);
    const { container: container2 } = render(<GoogleLoginButton text="signup_with" />);

    expect(container1.firstChild).toBeInTheDocument();
    expect(container2.firstChild).toBeInTheDocument();
  });

  it('renders with all props combined', () => {
    const handleSuccess = jest.fn();
    const { container } = render(
      <GoogleLoginButton
        text="signup_with"
        size="large"
        theme="filled_black"
        shape="pill"
        onSuccess={handleSuccess}
      />
    );

    expect(container.firstChild).toBeInTheDocument();
  });
});
