"use client";

import { useRef, useCallback, useEffect } from "react";

/**
 * Returns a stable function reference that always calls the latest version of `callback`.
 *
 * Useful for passing callbacks to effects or memoized children without listing
 * the callback in dependency arrays.
 *
 * ```tsx
 * const handleChange = useEventCallback((value: string) => {
 *   // always has access to latest props/state
 * });
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useEventCallback<T extends (...args: any[]) => any>(
  callback: T,
): T {
  const callbackRef = useRef<T>(callback);

  // Update the ref on every render so it always points to the latest closure
  useEffect(() => {
    callbackRef.current = callback;
  });

  // Return a stable function that delegates to the ref
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stableCallback = useCallback((...args: any[]) => callbackRef.current(...args), []) as unknown as T;

  return stableCallback;
}
