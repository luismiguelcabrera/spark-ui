"use client";

import { useEffect, useRef, type DependencyList, type EffectCallback } from "react";

/**
 * Like `useEffect`, but skips the effect on the initial mount.
 * Only runs the effect when dependencies change after the first render.
 *
 * ```tsx
 * useUpdateEffect(() => {
 *   console.log("value changed:", value);
 * }, [value]);
 * ```
 */
export function useUpdateEffect(effect: EffectCallback, deps: DependencyList): void {
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
