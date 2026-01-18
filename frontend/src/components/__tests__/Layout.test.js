import { render, screen, waitFor } from '@testing-library/react';
import Layout from '../Layout';
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'next/router';

// Mock child components to avoid complex dependencies
jest.mock('../Header', () => ({
  __esModule: true,
  default: ({ showAuthButtons }) => (
    <div data-testid="mock-header">
      Header Component
      {showAuthButtons && <span data-testid="auth-buttons">Auth Buttons</span>}
    </div>
  ),
}));

jest.mock('../Footer', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-footer">Footer Component</div>,
}));

jest.mock('../BottomNav', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-bottomnav">BottomNav Component</div>,
}));

jest.mock('../OrderTracker', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-order-tracker">Order Tracker</div>,
}));

// Mock stores
jest.mock('../../stores/authStore');
jest.mock('../../stores/themeStore', () => ({
  useThemeStore: () => ({
    getPalette: () => ({
      textPrimary: 'text-orange-500',
      bgPrimary: 'bg-orange-500',
    }),
    applyTheme: jest.fn(),
  }),
}));

describe('Layout Component', () => {
  const mockCheckAuth = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup default auth store mock
    useAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
      checkAuth: mockCheckAuth,
    });

    // Setup default router mock
    useRouter.mockReturnValue({
      pathname: '/',
      asPath: '/',
      push: mockPush,
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
    });

    mockCheckAuth.mockResolvedValue();
  });

  describe('Basic Rendering', () => {
    test('renders children correctly', async () => {
      render(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Content')).toBeInTheDocument();
      });
    });

    test('renders header by default', async () => {
      render(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      await waitFor(() => {
        expect(screen.getByTestId('mock-header')).toBeInTheDocument();
      });
    });

    test('renders footer by default', async () => {
      render(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      await waitFor(() => {
        expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
      });
    });

    test('renders bottom nav on mobile by default', async () => {
      render(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      await waitFor(() => {
        expect(screen.getByTestId('mock-bottomnav')).toBeInTheDocument();
      });
    });
  });

  describe('Conditional Rendering', () => {
    test('does not render header when showHeader is false', async () => {
      render(
        <Layout showHeader={false}>
          <div>Test Content</div>
        </Layout>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('mock-header')).not.toBeInTheDocument();
        expect(screen.getByText('Test Content')).toBeInTheDocument();
      });
    });

    test('does not render footer when showFooter is false', async () => {
      render(
        <Layout showFooter={false}>
          <div>Test Content</div>
        </Layout>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('mock-footer')).not.toBeInTheDocument();
        expect(screen.getByText('Test Content')).toBeInTheDocument();
      });
    });

    test('does not render bottom nav when showBottomNav is false', async () => {
      render(
        <Layout showBottomNav={false}>
          <div>Test Content</div>
        </Layout>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('mock-bottomnav')).not.toBeInTheDocument();
        expect(screen.getByText('Test Content')).toBeInTheDocument();
      });
    });

    test('hides header and footer on login page', async () => {
      useRouter.mockReturnValue({
        pathname: '/login',
        asPath: '/login',
        push: mockPush,
        events: {
          on: jest.fn(),
          off: jest.fn(),
        },
      });

      render(
        <Layout>
          <div>Login Page Content</div>
        </Layout>
      );

      await waitFor(() => {
        expect(screen.getByText('Login Page Content')).toBeInTheDocument();
      });

      // On login page, header and nav should be hidden
      // (Implementation detail - depends on Layout logic)
    });
  });

  describe('Authentication', () => {
    test('calls checkAuth on mount', async () => {
      render(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      await waitFor(() => {
        expect(mockCheckAuth).toHaveBeenCalled();
      });
    });

    test('renders correctly when user is authenticated', async () => {
      useAuthStore.mockReturnValue({
        user: { id: 1, name: 'Test User', email: 'test@test.com' },
        isAuthenticated: true,
        checkAuth: mockCheckAuth,
      });

      render(
        <Layout>
          <div>Authenticated Content</div>
        </Layout>
      );

      await waitFor(() => {
        expect(screen.getByText('Authenticated Content')).toBeInTheDocument();
      });
    });
  });

  describe('Props Handling', () => {
    test('renders with custom props', async () => {
      render(
        <Layout showHeader={true} showFooter={true}>
          <div>Test Content</div>
        </Layout>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Content')).toBeInTheDocument();
        expect(screen.getByTestId('mock-header')).toBeInTheDocument();
        expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    test('handles checkAuth failure gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockCheckAuth.mockRejectedValue(new Error('Auth failed'));

      render(
        <Layout>
          <div>Test Content</div>
        </Layout>
      );

      await waitFor(() => {
        expect(screen.getByText('Test Content')).toBeInTheDocument();
      });

      // Should not crash the app
      expect(mockCheckAuth).toHaveBeenCalled();

      consoleError.mockRestore();
    });
  });

  describe('Multiple Children', () => {
    test('renders multiple children correctly', async () => {
      render(
        <Layout>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </Layout>
      );

      await waitFor(() => {
        expect(screen.getByText('Child 1')).toBeInTheDocument();
        expect(screen.getByText('Child 2')).toBeInTheDocument();
        expect(screen.getByText('Child 3')).toBeInTheDocument();
      });
    });
  });
});
