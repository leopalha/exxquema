import { safeLocalStorage } from '../storage';

describe('Storage Utils', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear console warnings
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    console.warn.mockRestore();
  });

  describe('safeLocalStorage.getItem', () => {
    test('retrieves item from localStorage', () => {
      localStorage.setItem('testKey', 'testValue');
      expect(safeLocalStorage.getItem('testKey')).toBe('testValue');
    });

    test('returns null for non-existent item', () => {
      expect(safeLocalStorage.getItem('nonExistent')).toBeNull();
    });

    test('handles localStorage errors gracefully', () => {
      // Mock localStorage.getItem to throw error
      const originalGetItem = Storage.prototype.getItem;
      Storage.prototype.getItem = jest.fn(() => {
        throw new Error('Storage error');
      });

      const result = safeLocalStorage.getItem('testKey');
      expect(result).toBeNull();
      expect(console.warn).toHaveBeenCalledWith('localStorage.getItem error:', expect.any(Error));

      // Restore original
      Storage.prototype.getItem = originalGetItem;
    });

    test('returns null in SSR environment (window undefined)', () => {
      // Simulate SSR by temporarily removing window
      const originalWindow = global.window;
      delete global.window;

      const result = safeLocalStorage.getItem('testKey');
      expect(result).toBeNull();

      // Restore window
      global.window = originalWindow;
    });
  });

  describe('safeLocalStorage.setItem', () => {
    test('sets item in localStorage', () => {
      safeLocalStorage.setItem('testKey', 'testValue');
      expect(localStorage.getItem('testKey')).toBe('testValue');
    });

    test('overwrites existing item', () => {
      localStorage.setItem('testKey', 'oldValue');
      safeLocalStorage.setItem('testKey', 'newValue');
      expect(localStorage.getItem('testKey')).toBe('newValue');
    });

    test('handles localStorage errors gracefully', () => {
      // Mock localStorage.setItem to throw error
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error('Storage full');
      });

      safeLocalStorage.setItem('testKey', 'testValue');
      expect(console.warn).toHaveBeenCalledWith('localStorage.setItem error:', expect.any(Error));

      // Restore original
      Storage.prototype.setItem = originalSetItem;
    });

    test('does nothing in SSR environment', () => {
      const originalWindow = global.window;
      delete global.window;

      safeLocalStorage.setItem('testKey', 'testValue');
      // Should not throw error

      global.window = originalWindow;
    });

    test('handles quota exceeded error', () => {
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = jest.fn(() => {
        const error = new Error('QuotaExceededError');
        error.name = 'QuotaExceededError';
        throw error;
      });

      safeLocalStorage.setItem('testKey', 'x'.repeat(10000000));
      expect(console.warn).toHaveBeenCalled();

      Storage.prototype.setItem = originalSetItem;
    });
  });

  describe('safeLocalStorage.removeItem', () => {
    test('removes item from localStorage', () => {
      localStorage.setItem('testKey', 'testValue');
      safeLocalStorage.removeItem('testKey');
      expect(localStorage.getItem('testKey')).toBeNull();
    });

    test('handles removing non-existent item', () => {
      safeLocalStorage.removeItem('nonExistent');
      // Should not throw error
    });

    test('handles localStorage errors gracefully', () => {
      const originalRemoveItem = Storage.prototype.removeItem;
      Storage.prototype.removeItem = jest.fn(() => {
        throw new Error('Storage error');
      });

      safeLocalStorage.removeItem('testKey');
      expect(console.warn).toHaveBeenCalledWith('localStorage.removeItem error:', expect.any(Error));

      Storage.prototype.removeItem = originalRemoveItem;
    });

    test('does nothing in SSR environment', () => {
      const originalWindow = global.window;
      delete global.window;

      safeLocalStorage.removeItem('testKey');
      // Should not throw error

      global.window = originalWindow;
    });
  });

  describe('safeLocalStorage.clear', () => {
    test('clears all localStorage items', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      localStorage.setItem('key3', 'value3');

      safeLocalStorage.clear();

      expect(localStorage.getItem('key1')).toBeNull();
      expect(localStorage.getItem('key2')).toBeNull();
      expect(localStorage.getItem('key3')).toBeNull();
      expect(localStorage.length).toBe(0);
    });

    test('handles localStorage errors gracefully', () => {
      const originalClear = Storage.prototype.clear;
      Storage.prototype.clear = jest.fn(() => {
        throw new Error('Storage error');
      });

      safeLocalStorage.clear();
      expect(console.warn).toHaveBeenCalledWith('localStorage.clear error:', expect.any(Error));

      Storage.prototype.clear = originalClear;
    });

    test('does nothing in SSR environment', () => {
      const originalWindow = global.window;
      delete global.window;

      safeLocalStorage.clear();
      // Should not throw error

      global.window = originalWindow;
    });
  });

  describe('SSR compatibility', () => {
    test('all methods are safe in SSR environment', () => {
      const originalWindow = global.window;
      delete global.window;

      expect(() => {
        safeLocalStorage.getItem('test');
        safeLocalStorage.setItem('test', 'value');
        safeLocalStorage.removeItem('test');
        safeLocalStorage.clear();
      }).not.toThrow();

      global.window = originalWindow;
    });
  });

  describe('real-world scenarios', () => {
    test('handles auth token storage', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      safeLocalStorage.setItem('token', token);
      expect(safeLocalStorage.getItem('token')).toBe(token);
      safeLocalStorage.removeItem('token');
      expect(safeLocalStorage.getItem('token')).toBeNull();
    });

    test('handles user data storage', () => {
      const userData = JSON.stringify({ id: 1, name: 'Test User' });
      safeLocalStorage.setItem('user', userData);
      expect(safeLocalStorage.getItem('user')).toBe(userData);
    });

    test('handles theme preference storage', () => {
      safeLocalStorage.setItem('theme', 'dark');
      expect(safeLocalStorage.getItem('theme')).toBe('dark');
      safeLocalStorage.setItem('theme', 'light');
      expect(safeLocalStorage.getItem('theme')).toBe('light');
    });
  });
});
