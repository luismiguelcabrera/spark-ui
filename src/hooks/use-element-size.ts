"use client";

import { useRef, type RefObject } from "react";
import { useResizeObserver } from "./use-resize-observer";

export type UseElementSizeReturn<T extends HTMLElement> = {
  ref: RefObject<T | null>;
  width: number;
  height: number;
};

/**
 * Returns element dimensions. Convenience wrapper around useResizeObserver
 * that creates its own ref internally.
 *
 * @returns { ref, width, height }
 */
export function useElementSize<
  T extends HTMLElement = HTMLDivElement,
>(): UseElementSizeReturn<T> {
  const ref = useRef<T | null>(null);
  const { width, height } = useResizeObserver(ref);

  return { ref, width, height };
}
