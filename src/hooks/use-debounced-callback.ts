"use client";

import { useRef, useCallback, useEffect } from "react";

type DebouncedFunction<T extends (...args: never[]) => unknown> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
  isPending: () => boolean;
};

/**
 * Returns a debounced version of a callback function.
 *
 * The debounced function delays invocation until `delay` ms have elapsed
 * since the last call. Provides `cancel()`, `flush()`, and `isPending()` methods.
 *
 * @param callback - The function to debounce
 * @param delay - Delay in milliseconds
 */
export function useDebouncedCallback<T extends (...args: never[]) => unknown>(
  callback: T,
  delay: number
): DebouncedFunction<T> {
  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingArgsRef = useRef<Parameters<T> | null>(null);

  // Keep callback ref current without restarting debounce
  useEffect(() => {
    callbackRef.current = callback;
  });

  const cancel = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    pendingArgsRef.current = null;
  }, []);

  const flush = useCallback(() => {
    if (timerRef.current !== null && pendingArgsRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      const args = pendingArgsRef.current;
      pendingArgsRef.current = null;
      callbackRef.current(...args);
    }
  }, []);

  const isPending = useCallback(() => {
    return timerRef.current !== null;
  }, []);

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
      pendingArgsRef.current = args;
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        pendingArgsRef.current = null;
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const result = useCallback(
    (...args: Parameters<T>) => debounced(...args),
    [debounced]
  ) as DebouncedFunction<T>;

  // Attach methods to the function
  // eslint-disable-next-line react-hooks/refs -- Object.assign on memoized function
  return Object.assign(result, { cancel, flush, isPending });
}
