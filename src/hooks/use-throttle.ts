"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Throttle a value. Returns a value that updates at most once per interval.
 *
 * @param value - The value to throttle
 * @param interval - Minimum interval between updates in ms (default: 300)
 */
export function useThrottle<T>(value: T, interval = 300): T {
  const [throttled, setThrottled] = useState(value);
  const lastUpdated = useRef(Date.now()); // eslint-disable-line react-hooks/purity -- Date.now() is intentional for throttle timing

  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastUpdated.current;

    if (elapsed >= interval) {
      setThrottled(value);
      lastUpdated.current = now;
    } else {
      const timer = setTimeout(() => {
        setThrottled(value);
        lastUpdated.current = Date.now();
      }, interval - elapsed);
      return () => clearTimeout(timer);
    }
  }, [value, interval]);

  return throttled;
}
