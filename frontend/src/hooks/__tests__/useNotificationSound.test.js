import { renderHook, act } from '@testing-library/react';
import { useNotificationSound } from '../useNotificationSound';

// Mock AudioContext
class MockAudioContext {
  constructor() {
    this.currentTime = 0;
    this.destination = {};
  }

  createOscillator() {
    return {
      frequency: { value: 0 },
      type: 'sine',
      connect: jest.fn(),
      start: jest.fn(),
      stop: jest.fn()
    };
  }

  createGain() {
    return {
      gain: {
        setValueAtTime: jest.fn(),
        exponentialRampToValueAtTime: jest.fn()
      },
      connect: jest.fn()
    };
  }
}

describe('useNotificationSound Hook', () => {
  let mockAudioContext;

  beforeEach(() => {
    mockAudioContext = new MockAudioContext();
    global.AudioContext = jest.fn(() => mockAudioContext);
    global.webkitAudioContext = jest.fn(() => mockAudioContext);
    console.warn = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('playBeep', () => {
    test('creates audio context and plays sound', () => {
      const { result } = renderHook(() => useNotificationSound());

      act(() => {
        result.current.playBeep();
      });

      expect(global.AudioContext).toHaveBeenCalled();
    });

    test('uses default parameters', () => {
      const { result } = renderHook(() => useNotificationSound());

      act(() => {
        result.current.playBeep();
      });

      const oscillator = mockAudioContext.createOscillator();
      expect(oscillator.type).toBe('sine');
    });

    test('accepts custom frequency', () => {
      const { result } = renderHook(() => useNotificationSound());

      act(() => {
        result.current.playBeep(800, 200, 0.5);
      });

      expect(global.AudioContext).toHaveBeenCalled();
    });

    test('handles audio context creation error', () => {
      global.AudioContext = jest.fn(() => {
        throw new Error('AudioContext not supported');
      });

      const { result } = renderHook(() => useNotificationSound());

      act(() => {
        result.current.playBeep();
      });

      expect(console.warn).toHaveBeenCalledWith('Erro ao reproduzir som:', expect.any(Error));
    });

    test('does not throw when AudioContext is not available', () => {
      delete global.AudioContext;
      delete global.webkitAudioContext;

      const { result } = renderHook(() => useNotificationSound());

      expect(() => {
        act(() => {
          result.current.playBeep();
        });
      }).not.toThrow();
    });
  });

  describe('playAlert', () => {
    test('plays double beep sound', () => {
      const { result } = renderHook(() => useNotificationSound());

      act(() => {
        result.current.playAlert();
      });

      expect(global.AudioContext).toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(250);
      });

      expect(global.AudioContext).toHaveBeenCalledTimes(2);
    });
  });

  describe('playSuccess', () => {
    test('plays ascending tones', () => {
      const { result } = renderHook(() => useNotificationSound());

      act(() => {
        result.current.playSuccess();
      });

      expect(global.AudioContext).toHaveBeenCalledTimes(1);

      act(() => {
        jest.advanceTimersByTime(180);
      });

      expect(global.AudioContext).toHaveBeenCalledTimes(2);

      act(() => {
        jest.advanceTimersByTime(180);
      });

      expect(global.AudioContext).toHaveBeenCalledTimes(3);
    });
  });

  describe('playError', () => {
    test('plays descending tone', () => {
      const { result } = renderHook(() => useNotificationSound());

      act(() => {
        result.current.playError();
      });

      expect(global.AudioContext).toHaveBeenCalledTimes(1);

      act(() => {
        jest.advanceTimersByTime(250);
      });

      expect(global.AudioContext).toHaveBeenCalledTimes(2);
    });
  });

  describe('playNewOrder', () => {
    test('plays new order notification sound', () => {
      const { result } = renderHook(() => useNotificationSound());

      act(() => {
        result.current.playNewOrder();
      });

      expect(global.AudioContext).toHaveBeenCalledTimes(1);

      act(() => {
        jest.advanceTimersByTime(130);
      });

      expect(global.AudioContext).toHaveBeenCalledTimes(2);

      act(() => {
        jest.advanceTimersByTime(130);
      });

      expect(global.AudioContext).toHaveBeenCalledTimes(3);
    });
  });

  describe('playUrgent', () => {
    test('plays urgent sound', () => {
      const { result } = renderHook(() => useNotificationSound());

      act(() => {
        result.current.playUrgent();
      });

      expect(global.AudioContext).toHaveBeenCalledTimes(1);

      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(global.AudioContext).toHaveBeenCalledTimes(2);

      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(global.AudioContext).toHaveBeenCalledTimes(3);
    });
  });

  describe('real-world scenarios', () => {
    test('kitchen receives new order notification', () => {
      const { result } = renderHook(() => useNotificationSound());

      act(() => {
        result.current.playNewOrder();
        jest.runAllTimers();
      });

      expect(global.AudioContext).toHaveBeenCalled();
    });

    test('order delayed - urgent sound', () => {
      const { result } = renderHook(() => useNotificationSound());

      act(() => {
        result.current.playUrgent();
        jest.runAllTimers();
      });

      expect(global.AudioContext).toHaveBeenCalled();
    });

    test('payment success', () => {
      const { result } = renderHook(() => useNotificationSound());

      act(() => {
        result.current.playSuccess();
        jest.runAllTimers();
      });

      expect(global.AudioContext).toHaveBeenCalled();
    });

    test('payment error', () => {
      const { result } = renderHook(() => useNotificationSound());

      act(() => {
        result.current.playError();
        jest.runAllTimers();
      });

      expect(global.AudioContext).toHaveBeenCalled();
    });

    test('general alert', () => {
      const { result } = renderHook(() => useNotificationSound());

      act(() => {
        result.current.playAlert();
        jest.runAllTimers();
      });

      expect(global.AudioContext).toHaveBeenCalled();
    });
  });

  describe('SSR compatibility', () => {
    test('does not throw in SSR environment (no window)', () => {
      const originalWindow = global.window;
      delete global.window;

      const { result } = renderHook(() => useNotificationSound());

      expect(() => {
        act(() => {
          result.current.playBeep();
          result.current.playAlert();
          result.current.playSuccess();
        });
      }).not.toThrow();

      global.window = originalWindow;
    });
  });

  describe('browser compatibility', () => {
    test('uses webkitAudioContext as fallback', () => {
      delete global.AudioContext;
      const mockWebkitContext = new MockAudioContext();
      global.webkitAudioContext = jest.fn(() => mockWebkitContext);

      const { result } = renderHook(() => useNotificationSound());

      act(() => {
        result.current.playBeep();
      });

      expect(global.webkitAudioContext).toHaveBeenCalled();
    });

    test('handles missing audio support gracefully', () => {
      delete global.AudioContext;
      delete global.webkitAudioContext;

      const { result } = renderHook(() => useNotificationSound());

      expect(() => {
        act(() => {
          result.current.playBeep();
          result.current.playAlert();
          result.current.playSuccess();
          result.current.playError();
          result.current.playNewOrder();
          result.current.playUrgent();
        });
      }).not.toThrow();
    });
  });

  describe('custom sound parameters', () => {
    test('plays custom frequency beep', () => {
      const { result } = renderHook(() => useNotificationSound());

      act(() => {
        result.current.playBeep(1000, 500, 0.8);
      });

      expect(global.AudioContext).toHaveBeenCalled();
    });

    test('plays very short beep', () => {
      const { result } = renderHook(() => useNotificationSound());

      act(() => {
        result.current.playBeep(600, 50, 0.2);
      });

      expect(global.AudioContext).toHaveBeenCalled();
    });

    test('plays very long beep', () => {
      const { result } = renderHook(() => useNotificationSound());

      act(() => {
        result.current.playBeep(600, 2000, 0.5);
      });

      expect(global.AudioContext).toHaveBeenCalled();
    });
  });
});
