"use client";

import { useRef, useState, useEffect } from "react";

export type UseMouseReturn<T extends HTMLElement> = {
  /** Ref to attach to the target element */
  ref: React.RefObject<T | null>;
  /** Mouse x position on the page */
  x: number;
  /** Mouse y position on the page */
  y: number;
  /** Mouse x position relative to the referenced element */
  elementX: number;
  /** Mouse y position relative to the referenced element */
  elementY: number;
  /** Width of the referenced element */
  elementWidth: number;
  /** Height of the referenced element */
  elementHeight: number;
};

/**
 * Track mouse position on the page and relative to a referenced element.
 *
 * SSR-safe: coordinates default to 0.
 *
 * ```tsx
 * const { ref, x, y, elementX, elementY } = useMouse<HTMLDivElement>();
 * return <div ref={ref}>Mouse at ({elementX}, {elementY})</div>
 * ```
 */
export function useMouse<T extends HTMLElement>(): UseMouseReturn<T> {
  const ref = useRef<T | null>(null);
  const [state, setState] = useState({
    x: 0,
    y: 0,
    elementX: 0,
    elementY: 0,
    elementWidth: 0,
    elementHeight: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const newState: typeof state = {
        x: event.pageX,
        y: event.pageY,
        elementX: 0,
        elementY: 0,
        elementWidth: 0,
        elementHeight: 0,
      };

      const el = ref.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        newState.elementX = event.clientX - rect.left;
        newState.elementY = event.clientY - rect.top;
        newState.elementWidth = rect.width;
        newState.elementHeight = rect.height;
      }

      setState(newState);
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return { ref, ...state };
}
