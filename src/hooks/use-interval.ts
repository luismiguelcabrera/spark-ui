"use client";

import { useEffect, useRef } from "react";

/**
 * Declarative setInterval hook.
 *
 * The callback ref stays current without restarting the interval.
 * Pass `null` as the delay to pause the interval.
 *
 * @param callback - Function to call on each interval tick
 * @param delay - Interval in milliseconds, or `null` to pause
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const callbackRef = useRef(callback);

  // Keep callback ref current without restarting the interval
  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => callbackRef.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
