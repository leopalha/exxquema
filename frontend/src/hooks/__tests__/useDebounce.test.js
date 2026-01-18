import { renderHook, act, waitFor } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  test('debounces value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // Change value
    rerender({ value: 'changed', delay: 500 });

    // Value should not change immediately
    expect(result.current).toBe('initial');

    // Fast-forward time by 500ms
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Value should now be updated
    expect(result.current).toBe('changed');
  });

  test('cancels previous timeout on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // Rapid changes
    rerender({ value: 'change1', delay: 500 });
    act(() => jest.advanceTimersByTime(200));

    rerender({ value: 'change2', delay: 500 });
    act(() => jest.advanceTimersByTime(200));

    rerender({ value: 'change3', delay: 500 });
    act(() => jest.advanceTimersByTime(200));

    // Total time: 600ms, but only last change should take effect
    expect(result.current).toBe('initial');

    act(() => jest.advanceTimersByTime(300)); // Complete the 500ms from last change

    expect(result.current).toBe('change3');
  });

  test('handles different delay values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 1000 } }
    );

    rerender({ value: 'changed', delay: 1000 });

    act(() => jest.advanceTimersByTime(500));
    expect(result.current).toBe('initial');

    act(() => jest.advanceTimersByTime(500));
    expect(result.current).toBe('changed');
  });

  test('handles zero delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 0 } }
    );

    rerender({ value: 'changed', delay: 0 });

    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(result.current).toBe('changed');
  });

  test('works with numbers', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 0, delay: 300 } }
    );

    expect(result.current).toBe(0);

    rerender({ value: 100, delay: 300 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe(100);
  });

  test('works with objects', () => {
    const obj1 = { name: 'Test', count: 1 };
    const obj2 = { name: 'Updated', count: 2 };

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: obj1, delay: 300 } }
    );

    expect(result.current).toEqual(obj1);

    rerender({ value: obj2, delay: 300 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toEqual(obj2);
  });

  test('works with arrays', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [4, 5, 6];

    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: arr1, delay: 300 } }
    );

    expect(result.current).toEqual(arr1);

    rerender({ value: arr2, delay: 300 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toEqual(arr2);
  });

  test('handles empty string', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    rerender({ value: '', delay: 300 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('');
  });

  test('handles null and undefined', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    rerender({ value: null, delay: 300 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBeNull();

    rerender({ value: undefined, delay: 300 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBeUndefined();
  });

  test('handles delay change', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    rerender({ value: 'changed', delay: 300 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('changed');
  });

  test('cleans up timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    const { unmount } = renderHook(() => useDebounce('test', 500));

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });

  describe('real-world scenarios', () => {
    test('search input debouncing', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: '' } }
      );

      // User types: "h", "he", "hel", "hell", "hello"
      const searchTerms = ['h', 'he', 'hel', 'hell', 'hello'];

      searchTerms.forEach(term => {
        rerender({ value: term });
        act(() => jest.advanceTimersByTime(100));
      });

      // Only last term should be debounced after full delay
      act(() => jest.advanceTimersByTime(300));

      expect(result.current).toBe('hello');
    });

    test('filter value debouncing', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 500),
        { initialProps: { value: { category: 'all', minPrice: 0, maxPrice: 1000 } } }
      );

      const filter1 = { category: 'drinks', minPrice: 0, maxPrice: 1000 };
      const filter2 = { category: 'drinks', minPrice: 50, maxPrice: 1000 };
      const filter3 = { category: 'drinks', minPrice: 50, maxPrice: 500 };

      rerender({ value: filter1 });
      act(() => jest.advanceTimersByTime(200));

      rerender({ value: filter2 });
      act(() => jest.advanceTimersByTime(200));

      rerender({ value: filter3 });
      act(() => jest.advanceTimersByTime(500));

      expect(result.current).toEqual(filter3);
    });

    test('autocomplete suggestions', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: '' } }
      );

      // Simulate user typing slowly
      rerender({ value: 'ca' });
      act(() => jest.advanceTimersByTime(150));

      rerender({ value: 'caf' });
      act(() => jest.advanceTimersByTime(150));

      rerender({ value: 'cafe' });
      act(() => jest.advanceTimersByTime(300));

      expect(result.current).toBe('cafe');
    });
  });
});
