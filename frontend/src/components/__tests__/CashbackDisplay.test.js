import { render, screen } from '@testing-library/react';
import CashbackDisplay from '../CashbackDisplay';

// Mock cashbackStore with different balances for each test
const mockUseCashbackStore = jest.fn();

jest.mock('../../stores/cashbackStore', () => ({
  __esModule: true,
  default: () => mockUseCashbackStore(),
}));

// Mock themeStore
jest.mock('../../stores/themeStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getPalette: jest.fn(() => ({
      primary: '#FF006E',
      secondary: '#00D4FF',
      gradient: 'from-magenta-500 to-cyan-500',
    })),
  })),
}));

describe('CashbackDisplay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders cashback balance from store', () => {
    mockUseCashbackStore.mockReturnValue({
      balance: 50.00,
      tier: 'bronze',
      tierBenefits: null,
      nextTierInfo: null,
      loading: false,
      fetchBalance: jest.fn(),
    });

    const { container } = render(<CashbackDisplay />);
    expect(container).toBeInTheDocument();
    expect(screen.getByText(/50/)).toBeInTheDocument();
  });

  it('displays zero cashback', () => {
    mockUseCashbackStore.mockReturnValue({
      balance: 0,
      tier: 'bronze',
      tierBenefits: null,
      nextTierInfo: null,
      loading: false,
      fetchBalance: jest.fn(),
    });

    render(<CashbackDisplay />);
    expect(screen.getByText(/0/)).toBeInTheDocument();
  });

  it('formats large amounts correctly', () => {
    mockUseCashbackStore.mockReturnValue({
      balance: 1250.50,
      tier: 'gold',
      tierBenefits: null,
      nextTierInfo: null,
      loading: false,
      fetchBalance: jest.fn(),
    });

    render(<CashbackDisplay />);
    expect(screen.getByText(/1\.?250/)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseCashbackStore.mockReturnValue({
      balance: 0,
      tier: 'bronze',
      tierBenefits: null,
      nextTierInfo: null,
      loading: true,
      fetchBalance: jest.fn(),
    });

    const { container } = render(<CashbackDisplay />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders in compact mode', () => {
    mockUseCashbackStore.mockReturnValue({
      balance: 100,
      tier: 'silver',
      tierBenefits: null,
      nextTierInfo: null,
      loading: false,
      fetchBalance: jest.fn(),
    });

    const { container } = render(<CashbackDisplay compact={true} />);
    expect(container).toBeInTheDocument();
  });

  it('displays tier information', () => {
    mockUseCashbackStore.mockReturnValue({
      balance: 200,
      tier: 'gold',
      tierBenefits: { cashbackPercent: 4.5 },
      nextTierInfo: null,
      loading: false,
      fetchBalance: jest.fn(),
    });

    render(<CashbackDisplay />);
    // Gold tier should be displayed
    expect(screen.getByText(/Ouro/)).toBeInTheDocument();
  });

  it('calls fetchBalance on mount', () => {
    const mockFetchBalance = jest.fn();
    mockUseCashbackStore.mockReturnValue({
      balance: 100,
      tier: 'bronze',
      tierBenefits: null,
      nextTierInfo: null,
      loading: false,
      fetchBalance: mockFetchBalance,
    });

    render(<CashbackDisplay />);
    expect(mockFetchBalance).toHaveBeenCalled();
  });

  it('renders without showProgress prop', () => {
    mockUseCashbackStore.mockReturnValue({
      balance: 100,
      tier: 'bronze',
      tierBenefits: null,
      nextTierInfo: null,
      loading: false,
      fetchBalance: jest.fn(),
    });

    const { container } = render(<CashbackDisplay showProgress={false} />);
    expect(container).toBeInTheDocument();
  });
});
