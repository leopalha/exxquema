// Wrapper seguro para localStorage que funciona em SSR e mobile

export const safeLocalStorage = {
  getItem: (key) => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('localStorage.getItem error:', error);
      return null;
    }
  },

  setItem: (key, value) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('localStorage.setItem error:', error);
    }
  },

  removeItem: (key) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('localStorage.removeItem error:', error);
    }
  },

  clear: () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('localStorage.clear error:', error);
    }
  }
};

export default safeLocalStorage;
