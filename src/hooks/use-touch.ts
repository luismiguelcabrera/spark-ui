"use client";

import { useRef, useEffect, useCallback } from "react";

type UseTouchOptions = {
  /** Called when user swipes left */
  onSwipeLeft?: () => void;
  /** Called when user swipes right */
  onSwipeRight?: () => void;
  /** Called when user swipes up */
  onSwipeUp?: () => void;
  /** Called when user swipes down */
  onSwipeDown?: () => void;
  /** Minimum distance in px to qualify as a swipe (default: 50) */
  threshold?: number;
};

type UseTouchReturn = {
  /** Ref to attach to the target element */
  ref: React.RefObject<HTMLElement | null>;
};

/**
 * Detect swipe gestures on a referenced element.
 *
 * ```tsx
 * const { ref } = useTouch({
 *   onSwipeLeft: () => console.log("swiped left"),
 *   onSwipeRight: () => console.log("swiped right"),
 * });
 * return <div ref={ref}>Swipe me</div>
 * ```
 */
export function useTouch(options: UseTouchOptions = {}): UseTouchReturn {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
  } = options;

  const ref = useRef<HTMLElement | null>(null);
  const startX = useRef(0);
  const startY = useRef(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    startX.current = touch.clientX;
    startY.current = touch.clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      if (!touch) return;

      const deltaX = touch.clientX - startX.current;
      const deltaY = touch.clientY - startY.current;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Determine primary axis
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (absDeltaX >= threshold) {
          if (deltaX < 0) {
            onSwipeLeft?.();
          } else {
            onSwipeRight?.();
          }
        }
      } else {
        // Vertical swipe
        if (absDeltaY >= threshold) {
          if (deltaY < 0) {
            onSwipeUp?.();
          } else {
            onSwipeDown?.();
          }
        }
      }
    },
    [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);

  return { ref };
}
