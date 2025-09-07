import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook that mimics the @github/spark useKV hook functionality
 * Uses localStorage for persistence
 */
export function useKV<T>(key: string, defaultValue: T): [T, (value: T | ((current: T) => T)) => void, () => void] {
  // Initialize state from localStorage or use default value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') {
        return defaultValue;
      }
      const item = window.localStorage.getItem(`spark-kv:${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  // Update localStorage whenever the value changes
  const setValue = useCallback((value: T | ((current: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(`spark-kv:${key}`, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Delete the key from storage
  const deleteValue = useCallback(() => {
    try {
      setStoredValue(defaultValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(`spark-kv:${key}`);
      }
    } catch (error) {
      console.warn(`Error deleting localStorage key "${key}":`, error);
    }
  }, [key, defaultValue]);

  // Listen for localStorage changes from other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `spark-kv:${key}`) {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : defaultValue;
          setStoredValue(newValue);
        } catch (error) {
          console.warn(`Error parsing storage change for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, defaultValue]);

  return [storedValue, setValue, deleteValue];
}