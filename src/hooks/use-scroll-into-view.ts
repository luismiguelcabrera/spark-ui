"use client";

import { useRef, useCallback } from "react";

type UseScrollIntoViewOptions = {
  /** Offset in pixels from the top of the viewport (default: 0) */
  offset?: number;
  /** Scroll animation duration in ms (default: 300) */
  duration?: number;
  /** Custom easing function (default: easeInOutQuad) */
  easing?: (t: number) => number;
};

type UseScrollIntoViewReturn<T extends HTMLElement> = {
  ref: React.RefObject<T | null>;
  scrollIntoView: () => void;
};

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function getScrollStart(): number {
  return window.pageYOffset || document.documentElement.scrollTop;
}

/**
 * Smoothly scroll to an element.
 *
 * Returns a `ref` to attach to the target element and a `scrollIntoView`
 * function that triggers the animated scroll.
 *
 * Respects `prefers-reduced-motion` by scrolling instantly when enabled.
 * SSR-safe: guards `window` and `document` access.
 *
 * @param options - Scroll configuration
 */
export function useScrollIntoView<T extends HTMLElement = HTMLElement>(
  options?: UseScrollIntoViewOptions
): UseScrollIntoViewReturn<T> {
  const {
    offset = 0,
    duration = 300,
    easing = easeInOutQuad,
  } = options ?? {};

  const ref = useRef<T>(null);
  const frameRef = useRef<number>(0);

  const scrollIntoView = useCallback(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;

    // Cancel any ongoing animation
    cancelAnimationFrame(frameRef.current);

    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const targetY =
      el.getBoundingClientRect().top + getScrollStart() - offset;

    if (prefersReducedMotion || duration <= 0) {
      window.scrollTo(0, targetY);
      return;
    }

    const startY = getScrollStart();
    const distance = targetY - startY;
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);

      window.scrollTo(0, startY + distance * easedProgress);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      }
    };

    frameRef.current = requestAnimationFrame(step);
  }, [offset, duration, easing]);

  return { ref, scrollIntoView };
}
