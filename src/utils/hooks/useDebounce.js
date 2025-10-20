import { useState, useEffect } from 'react';

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    console.log('useDebounce: Setting timeout for value:', value, 'delay:', delay);
    const handler = setTimeout(() => {
      console.log('useDebounce: Timeout executed, setting debouncedValue to:', value);
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  console.log('useDebounce: Current debouncedValue:', debouncedValue);
  return debouncedValue;
};
