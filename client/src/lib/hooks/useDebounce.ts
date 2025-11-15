/**
 * Custom hook for debouncing values.
 * Useful for search inputs, filters, and other frequently changing values.
 */

import { useEffect, useState } from 'react';

/**
 * Debounce a value by delaying updates until the value has stopped changing
 * for a specified delay period.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 500ms)
 * @returns The debounced value
 *
 * @example
 * ```tsx
 * function SearchComponent() {
 *   const [searchTerm, setSearchTerm] = useState('');
 *   const debouncedSearchTerm = useDebounce(searchTerm, 300);
 *
 *   useEffect(() => {
 *     // This only runs after user stops typing for 300ms
 *     fetchResults(debouncedSearchTerm);
 *   }, [debouncedSearchTerm]);
 *
 *   return <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />;
 * }
 * ```
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up the timeout
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if value changes before delay expires
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Create a debounced callback function.
 *
 * @param callback - The function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 *
 * @example
 * ```tsx
 * function Component() {
 *   const debouncedSave = useDebouncedCallback((value: string) => {
 *     saveToServer(value);
 *   }, 1000);
 *
 *   return <input onChange={e => debouncedSave(e.target.value)} />;
 * }
 * ```
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay = 500
): (...args: Parameters<T>) => void {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      callback(...args);
    }, delay);

    setTimeoutId(newTimeoutId);
  };
}
