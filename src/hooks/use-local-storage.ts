"use client";

import { useState, useCallback } from "react";

/**
 * Persist state in localStorage with automatic JSON serialization.
 *
 * @param key - localStorage key
 * @param initialValue - Default value when no stored value exists
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          console.warn(`[spark-ui] useLocalStorage: Failed to set "${key}"`);
        }
        return next;
      });
    },
    [key]
  );

  const remove = useCallback(() => {
    setStoredValue(initialValue);
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore
    }
  }, [key, initialValue]);

  return [storedValue, setValue, remove];
}
