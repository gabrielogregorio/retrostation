import { useState, useEffect } from 'react';

const DEBOUNCING_IN_MS = 400;

export const useDebounce = (value: string, delay = DEBOUNCING_IN_MS) => {
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    setIsLoading(true);
    const handler = setTimeout(() => {
      setIsLoading(false);
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return { debouncedValue, isLoading };
};
