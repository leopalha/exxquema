import { render, screen, fireEvent } from '@testing-library/react';
import PWAInstallBanner from '../PWAInstallBanner';

describe('PWAInstallBanner', () => {
  let deferredPrompt;

  beforeEach(() => {
    // Mock localStorage
    Storage.prototype.getItem = jest.fn();
    Storage.prototype.setItem = jest.fn();

    // Reset deferred prompt
    deferredPrompt = {
      prompt: jest.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted' }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('does not render if dismissed before', () => {
    Storage.prototype.getItem = jest.fn(() => 'true');

    const { container } = render(<PWAInstallBanner />);
    expect(container.firstChild).toBeNull();
  });

  it('renders install prompt when available', () => {
    Storage.prototype.getItem = jest.fn(() => null);

    // Simulate beforeinstallprompt event
    const event = new Event('beforeinstallprompt');
    event.prompt = jest.fn();
    event.userChoice = Promise.resolve({ outcome: 'accepted' });

    window.dispatchEvent(event);

    const { container } = render(<PWAInstallBanner />);
    expect(container).toBeInTheDocument();
  });

  it('has proper styling', () => {
    const { container } = render(<PWAInstallBanner />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
