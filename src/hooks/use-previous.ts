"use client";

import { useRef, useEffect } from "react";

/**
 * Track the previous value of a variable.
 *
 * @param value - The value to track
 * @returns The previous value (undefined on first render)
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  // eslint-disable-next-line react-hooks/refs -- intentional: read ref during render for previous value pattern
  return ref.current;
}
