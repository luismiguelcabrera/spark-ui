"use client";

import { useState, useEffect, type RefObject } from "react";

export type UseResizeObserverReturn = {
  width: number;
  height: number;
};

/**
 * Observe element size changes via ResizeObserver.
 *
 * @param ref - Ref to the element to observe
 * @returns { width, height } of the observed element
 */
export function useResizeObserver<T extends HTMLElement>(
  ref: RefObject<T | null>,
): UseResizeObserverReturn {
  const [size, setSize] = useState<UseResizeObserverReturn>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // SSR guard
    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, [ref]);

  return size;
}
