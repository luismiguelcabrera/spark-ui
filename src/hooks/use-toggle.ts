"use client";

import { useState, useCallback } from "react";

/**
 * Toggle a boolean value.
 *
 * @param initialValue - Starting value (default: false)
 * @returns [value, toggle, setValue]
 */
export function useToggle(
  initialValue = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((prev) => !prev), []);
  return [value, toggle, setValue];
}
