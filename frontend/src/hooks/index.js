import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';
import { toast } from 'react-hot-toast';

// Hook for API calls with loading and error states
export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const {
    immediate = true,
    onSuccess,
    onError,
    transform,
    dependencies = [],
  } = options;

  const execute = useCallback(async (customUrl, customOptions = {}) => {
    const requestUrl = customUrl || url;
    if (!requestUrl) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(requestUrl, {
        ...customOptions,
        signal: abortControllerRef.current.signal,
      });

      if (response.data.success) {
        const result = transform ? transform(response.data.data) : response.data.data;
        setData(result);
        onSuccess?.(result);
      } else {
        throw new Error(response.data.message || 'Erro na requisição');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
        onError?.(err);
      }
    } finally {
      setLoading(false);
    }
  }, [url, transform, onSuccess, onError]);

  const refetch = useCallback(() => execute(), [execute]);

  useEffect(() => {
    if (immediate && url) {
      execute();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [immediate, ...dependencies]);

  return { data, loading, error, execute, refetch };
};

// Hook for form handling with validation
export const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const setFieldTouched = (name, isTouched = true) => {
    setTouched(prev => ({ ...prev, [name]: isTouched }));
  };

  const validate = useCallback(() => {
    const newErrors = {};

    Object.keys(validationRules).forEach(field => {
      const rules = validationRules[field];
      const value = values[field];

      if (rules.required && (!value || value.toString().trim() === '')) {
        newErrors[field] = rules.required === true ? 'Campo obrigatório' : rules.required;
        return;
      }

      if (value && rules.minLength && value.length < rules.minLength) {
        newErrors[field] = `Mínimo de ${rules.minLength} caracteres`;
        return;
      }

      if (value && rules.maxLength && value.length > rules.maxLength) {
        newErrors[field] = `Máximo de ${rules.maxLength} caracteres`;
        return;
      }

      if (value && rules.pattern && !rules.pattern.test(value)) {
        newErrors[field] = rules.patternMessage || 'Formato inválido';
        return;
      }

      if (value && rules.min && parseFloat(value) < rules.min) {
        newErrors[field] = `Valor mínimo: ${rules.min}`;
        return;
      }

      if (value && rules.max && parseFloat(value) > rules.max) {
        newErrors[field] = `Valor máximo: ${rules.max}`;
        return;
      }

      if (rules.custom) {
        const customError = rules.custom(value, values);
        if (customError) {
          newErrors[field] = customError;
          return;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationRules]);

  const handleSubmit = async (onSubmit) => {
    setIsSubmitting(true);
    
    // Mark all fields as touched
    const touchedFields = {};
    Object.keys(validationRules).forEach(field => {
      touchedFields[field] = true;
    });
    setTouched(touchedFields);

    const isValid = validate();

    if (isValid) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    } else {
      toast.error('Por favor, corrija os erros no formulário');
    }

    setIsSubmitting(false);
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  const isFieldInvalid = (field) => {
    return touched[field] && errors[field];
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setFieldTouched,
    validate,
    handleSubmit,
    reset,
    isFieldInvalid,
  };
};

// Hook for debounced value
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook for local storage
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};

// Hook for window size
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      handleResize();

      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return windowSize;
};

// Hook for media queries
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query);
      
      if (media.matches !== matches) {
        setMatches(media.matches);
      }

      const listener = () => setMatches(media.matches);
      media.addEventListener('change', listener);

      return () => media.removeEventListener('change', listener);
    }
  }, [matches, query]);

  return matches;
};

// Hook for online/offline status
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);

      const handleOnline = () => {
        setIsOnline(true);
        toast.success('Conexão restaurada!');
      };

      const handleOffline = () => {
        setIsOnline(false);
        toast.error('Sem conexão com a internet');
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  return isOnline;
};

// Hook for intersection observer (infinite scroll, lazy loading)
export const useIntersectionObserver = (options = {}) => {
  const [entry, setEntry] = useState(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setEntry(entry);
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options.threshold, options.root, options.rootMargin]);

  return { elementRef, entry, isIntersecting };
};

// Hook for previous value
export const usePrevious = (value) => {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
};

// Hook for async operation with loading state
export const useAsync = (asyncFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await asyncFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  return { data, loading, error, execute };
};

// Hook for countdown timer
export const useCountdown = (initialTime) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const start = () => {
    if (!isRunning && time > 0) {
      setIsRunning(true);
    }
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = (newTime = initialTime) => {
    setIsRunning(false);
    setTime(newTime);
  };

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, time]);

  return { time, isRunning, start, pause, reset };
};

// Hook for clipboard operations
export const useClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopied(true);
      toast.success('Copiado para a área de transferência!');

      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.error('Erro ao copiar');
      return false;
    }
  };

  return { copied, copyToClipboard };
};

// PWA Hook
export { default as usePWA } from './usePWA';

// Mock Data Hooks
export {
  useMockData,
  useMockProducts,
  useMockCategories,
  useMockUsers,
  useMockTables,
  useMockOrders,
  useMockCRUD
} from './useMockData';

export default {
  useApi,
  useForm,
  useDebounce,
  useLocalStorage,
  useWindowSize,
  useMediaQuery,
  useOnlineStatus,
  useIntersectionObserver,
  usePrevious,
  useAsync,
  useCountdown,
  useClipboard,
};
