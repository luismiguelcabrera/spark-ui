"use client";

import { useRef, useCallback } from "react";

export type UseMorphReturn<T extends HTMLElement> = {
  /** Ref to attach to the element to animate */
  ref: React.RefObject<T | null>;
  /** Call before a state change to capture the current rect, then animate to the new rect */
  trigger: () => void;
};

/**
 * FLIP animation helper. Captures an element's bounding rect before an update,
 * then animates from the old position to the new one.
 *
 * Respects `prefers-reduced-motion`.
 * SSR-safe.
 *
 * ```tsx
 * const { ref, trigger } = useMorph<HTMLDivElement>();
 * const handleClick = () => { trigger(); setState(newState); };
 * return <div ref={ref}>...</div>
 * ```
 */
export function useMorph<T extends HTMLElement>(): UseMorphReturn<T> {
  const ref = useRef<T | null>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const trigger = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    // First: capture current position
    rectRef.current = el.getBoundingClientRect();

    // Schedule the invert+play step after the DOM has updated
    requestAnimationFrame(() => {
      const prev = rectRef.current;
      if (!prev || !ref.current) return;

      // Check prefers-reduced-motion
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      // Last: get the new position
      const next = ref.current.getBoundingClientRect();

      // Invert: calculate the delta
      const dx = prev.left - next.left;
      const dy = prev.top - next.top;
      const sw = prev.width / next.width;
      const sh = prev.height / next.height;

      // Skip if there's no change
      if (dx === 0 && dy === 0 && sw === 1 && sh === 1) return;

      // Play: animate from old to new
      ref.current.animate(
        [
          {
            transform: `translate(${dx}px, ${dy}px) scale(${sw}, ${sh})`,
          },
          {
            transform: "translate(0, 0) scale(1, 1)",
          },
        ],
        {
          duration: 300,
          easing: "ease-in-out",
        },
      );
    });
  }, []);

  return { ref, trigger };
}
