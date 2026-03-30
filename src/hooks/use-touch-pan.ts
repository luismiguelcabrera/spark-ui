"use client";

import { useRef, useState, useEffect, useCallback } from "react";

export type PanDirection = "left" | "right" | "up" | "down" | null;

export type UseTouchPanOptions = {
  /** Minimum distance in px before recognizing as a pan (default: 10) */
  threshold?: number;
};

export type UseTouchPanReturn = {
  /** Ref to attach to the target element */
  ref: React.RefObject<HTMLElement | null>;
  /** Whether a pan gesture is currently active */
  panning: boolean;
  /** Current delta from the start position */
  delta: { x: number; y: number };
  /** Primary pan direction once threshold is met */
  direction: PanDirection;
};

/**
 * Track touch pan gestures on a referenced element.
 *
 * ```tsx
 * const { ref, panning, delta, direction } = useTouchPan({ threshold: 15 });
 * return <div ref={ref}>Pan me</div>
 * ```
 */
export function useTouchPan(options: UseTouchPanOptions = {}): UseTouchPanReturn {
  const { threshold = 10 } = options;

  const ref = useRef<HTMLElement | null>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const recognized = useRef(false);

  const [panning, setPanning] = useState(false);
  const [delta, setDelta] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState<PanDirection>(null);

  const getDirection = useCallback(
    (dx: number, dy: number): PanDirection => {
      if (Math.abs(dx) > Math.abs(dy)) {
        return dx < 0 ? "left" : "right";
      }
      return dy < 0 ? "up" : "down";
    },
    [],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      startPos.current = { x: touch.clientX, y: touch.clientY };
      recognized.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;

      const dx = touch.clientX - startPos.current.x;
      const dy = touch.clientY - startPos.current.y;

      if (!recognized.current) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < threshold) return;
        recognized.current = true;
        setPanning(true);
      }

      setDelta({ x: dx, y: dy });
      setDirection(getDirection(dx, dy));
    };

    const handleTouchEnd = () => {
      if (recognized.current) {
        setPanning(false);
        setDelta({ x: 0, y: 0 });
        setDirection(null);
        recognized.current = false;
      }
    };

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });
    el.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
      el.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [threshold, getDirection]);

  return { ref, panning, delta, direction };
}
