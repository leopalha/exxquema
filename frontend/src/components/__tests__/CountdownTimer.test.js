import { render, screen, act, waitFor } from '@testing-library/react';
import CountdownTimer from '../CountdownTimer';

// Mock themeStore to avoid import issues
jest.mock('../../stores/themeStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getPalette: jest.fn(() => ({
      primary: '#FF6B35',
      secondary: '#004E89',
    })),
  })),
}));

jest.useFakeTimers();

describe('CountdownTimer', () => {
  const mockCallback = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
  });

  it('renders countdown timer', () => {
    const startedAt = new Date().toISOString();
    const { container } = render(
      <CountdownTimer
        orderId="123"
        startedAt={startedAt}
        thresholdMinutes={15}
      />
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('displays remaining time', () => {
    const startedAt = new Date(Date.now() - 5 * 60 * 1000).toISOString(); // 5 minutes ago
    render(
      <CountdownTimer
        orderId="123"
        startedAt={startedAt}
        thresholdMinutes={15}
      />
    );

    // Should show some time remaining
    expect(screen.getByText(/\d+:\d+/)).toBeInTheDocument();
  });

  it('calls callback when threshold reached', async () => {
    const startedAt = new Date(Date.now() - 16 * 60 * 1000).toISOString(); // 16 minutes ago
    render(
      <CountdownTimer
        orderId="123"
        startedAt={startedAt}
        thresholdMinutes={15}
        onThresholdReached={mockCallback}
      />
    );

    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledWith("123");
    }, { timeout: 3000 });
  });

  it('updates every second', () => {
    const startedAt = new Date().toISOString();
    const { container } = render(
      <CountdownTimer
        orderId="123"
        startedAt={startedAt}
        thresholdMinutes={15}
      />
    );

    const initialText = container.textContent;

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    const updatedText = container.textContent;
    // Text should have changed after 1 second
    expect(initialText).not.toBe(updatedText);
  });

  it('formats time correctly', () => {
    const startedAt = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    render(
      <CountdownTimer
        orderId="123"
        startedAt={startedAt}
        thresholdMinutes={15}
      />
    );

    // Should display MM:SS format
    const timeText = screen.getByText(/\d{1,2}:\d{2}/);
    expect(timeText).toBeInTheDocument();
  });
});
