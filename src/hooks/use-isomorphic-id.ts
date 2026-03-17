"use client";

import { useId } from "react";

/**
 * Generate a stable unique ID that works with SSR.
 * Wraps React's useId with an optional prefix.
 *
 * @param prefix - Optional prefix for the generated ID
 */
export function useIsomorphicId(prefix?: string): string {
  const id = useId();
  return prefix ? `${prefix}-${id}` : id;
}
