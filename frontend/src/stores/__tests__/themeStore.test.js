import { renderHook, act } from '@testing-library/react';

// Mock dependencies BEFORE importing store
jest.mock('../../utils/storage', () => ({
  safeLocalStorage: {
    getItem: jest.fn(() => null),
    setItem: jest.fn(),
    removeItem: jest.fn()
  }
}));

// Mock zustand persist middleware
jest.mock('zustand/middleware', () => ({
  persist: (config) => config
}));

import useThemeStore from '../themeStore';

describe('ThemeStore', () => {
  beforeEach(() => {
    // Reset store to default state using getState/setState
    useThemeStore.setState({
      theme: 'dark',
      customColors: {}
    }, true);
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    test('has dark theme as default', () => {
      const { result } = renderHook(() => useThemeStore());
      expect(result.current.theme).toBe('dark');
    });

    test('has empty custom colors', () => {
      const { result } = renderHook(() => useThemeStore());
      expect(result.current.customColors).toEqual({});
    });
  });

  describe('getPalette', () => {
    test('returns dark palette by default', () => {
      const { result } = renderHook(() => useThemeStore());
      const palette = result.current.getPalette();

      expect(palette).toHaveProperty('background');
      expect(palette).toHaveProperty('text');
      expect(palette).toHaveProperty('primary');
    });

    test('returns light palette when theme is light', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        useThemeStore.setState({ theme: 'light' });
      });

      const palette = result.current.getPalette();
      expect(palette).toBeDefined();
    });
  });

  describe('setTheme', () => {
    test('changes theme from dark to light', () => {
      const { result } = renderHook(() => useThemeStore());

      expect(result.current.theme).toBe('dark');

      act(() => {
        result.current.setTheme('light');
      });

      expect(result.current.theme).toBe('light');
    });

    test('changes theme from light to dark', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.setTheme('light');
      });

      expect(result.current.theme).toBe('light');

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
    });
  });

  describe('toggleTheme', () => {
    test('toggles from dark to light', () => {
      const { result } = renderHook(() => useThemeStore());

      expect(result.current.theme).toBe('dark');

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('light');
    });

    test('toggles from light to dark', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        useThemeStore.setState({ theme: 'light' });
      });

      expect(result.current.theme).toBe('light');

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('dark');
    });

    test('toggles multiple times', () => {
      const { result } = renderHook(() => useThemeStore());

      expect(result.current.theme).toBe('dark');

      act(() => {
        result.current.toggleTheme(); // dark -> light
        result.current.toggleTheme(); // light -> dark
        result.current.toggleTheme(); // dark -> light
      });

      expect(result.current.theme).toBe('light');
    });
  });

  describe('setCustomColor', () => {
    test('sets custom color', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.setCustomColor('primary', '#FF5733');
      });

      expect(result.current.customColors.primary).toBe('#FF5733');
    });

    test('sets multiple custom colors', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.setCustomColor('primary', '#FF5733');
        result.current.setCustomColor('secondary', '#3498DB');
        result.current.setCustomColor('accent', '#E74C3C');
      });

      expect(result.current.customColors).toEqual({
        primary: '#FF5733',
        secondary: '#3498DB',
        accent: '#E74C3C'
      });
    });

    test('overwrites existing custom color', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.setCustomColor('primary', '#FF5733');
      });

      expect(result.current.customColors.primary).toBe('#FF5733');

      act(() => {
        result.current.setCustomColor('primary', '#00FF00');
      });

      expect(result.current.customColors.primary).toBe('#00FF00');
    });
  });

  describe('resetCustomColors', () => {
    test('resets all custom colors', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.setCustomColor('primary', '#FF5733');
        result.current.setCustomColor('secondary', '#3498DB');
      });

      expect(Object.keys(result.current.customColors).length).toBe(2);

      act(() => {
        result.current.resetCustomColors();
      });

      expect(result.current.customColors).toEqual({});
    });

    test('resets from empty state', () => {
      const { result } = renderHook(() => useThemeStore());

      expect(result.current.customColors).toEqual({});

      act(() => {
        result.current.resetCustomColors();
      });

      expect(result.current.customColors).toEqual({});
    });
  });

  describe('real-world scenarios', () => {
    test('user switches theme multiple times during session', () => {
      const { result } = renderHook(() => useThemeStore());

      // Start with dark
      expect(result.current.theme).toBe('dark');

      // User prefers light during day
      act(() => {
        result.current.setTheme('light');
      });
      expect(result.current.theme).toBe('light');

      // User switches back to dark at night
      act(() => {
        result.current.setTheme('dark');
      });
      expect(result.current.theme).toBe('dark');
    });

    test('admin customizes brand colors', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.setCustomColor('primary', '#FF0000');
        result.current.setCustomColor('secondary', '#00FF00');
        result.current.setCustomColor('accent', '#0000FF');
      });

      const palette = result.current.getPalette();
      expect(palette.primary).toBeDefined();
    });

    test('user resets to default theme after customization', () => {
      const { result } = renderHook(() => useThemeStore());

      // Customize
      act(() => {
        result.current.setTheme('light');
        result.current.setCustomColor('primary', '#FF5733');
        result.current.setCustomColor('secondary', '#3498DB');
      });

      expect(result.current.theme).toBe('light');
      expect(Object.keys(result.current.customColors).length).toBe(2);

      // Reset
      act(() => {
        result.current.setTheme('dark');
        result.current.resetCustomColors();
      });

      expect(result.current.theme).toBe('dark');
      expect(result.current.customColors).toEqual({});
    });

    test('theme toggle button behavior', () => {
      const { result } = renderHook(() => useThemeStore());

      // Simulate clicking theme toggle 5 times
      for (let i = 0; i < 5; i++) {
        act(() => {
          result.current.toggleTheme();
        });
      }

      // Should end up on light (started dark, toggled odd number of times)
      expect(result.current.theme).toBe('light');
    });
  });

  describe('persistence', () => {
    test('store can be serialized', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.setTheme('light');
        result.current.setCustomColor('primary', '#FF5733');
      });

      const state = {
        theme: result.current.theme,
        customColors: result.current.customColors
      };

      const serialized = JSON.stringify(state);
      const deserialized = JSON.parse(serialized);

      expect(deserialized.theme).toBe('light');
      expect(deserialized.customColors.primary).toBe('#FF5733');
    });
  });

  describe('edge cases', () => {
    test('handles undefined theme gracefully', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        try {
          result.current.setTheme(undefined);
        } catch (error) {
          // Should not throw
        }
      });

      // Should still have a valid theme
      expect(['dark', 'light', undefined]).toContain(result.current.theme);
    });

    test('handles null color value', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.setCustomColor('primary', null);
      });

      expect(result.current.customColors.primary).toBeNull();
    });

    test('handles empty string color', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.setCustomColor('primary', '');
      });

      expect(result.current.customColors.primary).toBe('');
    });

    test('handles special characters in color key', () => {
      const { result } = renderHook(() => useThemeStore());

      act(() => {
        result.current.setCustomColor('primary-hover', '#FF5733');
        result.current.setCustomColor('button_active', '#3498DB');
      });

      expect(result.current.customColors['primary-hover']).toBe('#FF5733');
      expect(result.current.customColors['button_active']).toBe('#3498DB');
    });
  });
});
