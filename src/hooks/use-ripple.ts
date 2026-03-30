"use client";

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type RefObject,
  type CSSProperties,
  type FC,
} from "react";
import React from "react";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

type Ripple = {
  id: number;
  x: number;
  y: number;
  size: number;
};

type UseRippleOptions = {
  /** Duration of the ripple animation in ms (default: 600) */
  duration?: number;
  /** Color of the ripple (default: "rgba(255,255,255,0.35)") */
  color?: string;
};

type UseRippleReturn = {
  /** Ref to attach to the target element */
  ref: RefObject<HTMLElement | null>;
  /** Current active ripples */
  ripples: Ripple[];
  /** Component that renders the ripple spans — place inside the target element */
  RippleContainer: FC;
};

let rippleCounter = 0;

/**
 * Create CSS ripple animations on click.
 *
 * ```tsx
 * const { ref, RippleContainer } = useRipple();
 * return <button ref={ref} style={{ position: "relative", overflow: "hidden" }}>
 *   Click me
 *   <RippleContainer />
 * </button>
 * ```
 */
export function useRipple(options: UseRippleOptions = {}): UseRippleReturn {
  const { duration = 600, color = "rgba(255,255,255,0.35)" } = options;
  const ref = useRef<HTMLElement | null>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const reducedMotion = usePrefersReducedMotion();

  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (reducedMotion) return;

      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      const ripple: Ripple = {
        id: ++rippleCounter,
        x,
        y,
        size,
      };

      setRipples((prev) => [...prev, ripple]);
    },
    [reducedMotion],
  );

  // Attach click handler to the ref'd element
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.addEventListener("click", handleClick);
    return () => el.removeEventListener("click", handleClick);
  }, [handleClick]);

  // Auto-remove ripples after animation duration
  useEffect(() => {
    if (ripples.length === 0) return;

    const timer = setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, duration);

    return () => clearTimeout(timer);
  }, [ripples, duration]);

  const RippleContainer: FC = useCallback(() => {
    if (ripples.length === 0) return null;

    return React.createElement(
      React.Fragment,
      null,
      ...ripples.map((ripple) => {
        const style: CSSProperties = {
          position: "absolute",
          left: ripple.x,
          top: ripple.y,
          width: ripple.size,
          height: ripple.size,
          borderRadius: "50%",
          backgroundColor: color,
          transform: "scale(0)",
          animation: `spark-ripple ${duration}ms ease-out forwards`,
          pointerEvents: "none",
        };

        return React.createElement("span", {
          key: ripple.id,
          style,
          "aria-hidden": "true",
        });
      }),
    );
  }, [ripples, color, duration]);

  RippleContainer.displayName = "RippleContainer";

  return { ref, ripples, RippleContainer };
}
