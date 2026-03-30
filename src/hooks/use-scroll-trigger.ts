"use client";

import { useState, useEffect, useRef } from "react";

export type UseScrollTriggerOptions = {
  /** Scroll threshold in px (default: 100) */
  threshold?: number;
  /** When true, trigger flips immediately; when false (default), hysteresis applies */
  disableHysteresis?: boolean;
  /** Target element to listen on (default: window) */
  target?: HTMLElement;
};

/**
 * Detect when scroll position passes a threshold.
 *
 * Returns `true` when the scroll position exceeds the threshold.
 * With hysteresis enabled (default), the trigger won't flip back to `false`
 * until the user scrolls above the threshold in the opposite direction.
 *
 * SSR-safe.
 *
 * ```tsx
 * const triggered = useScrollTrigger({ threshold: 200 });
 * return <AppBar elevated={triggered} />
 * ```
 */
export function useScrollTrigger(options: UseScrollTriggerOptions = {}): boolean {
  const { threshold = 100, disableHysteresis = false, target } = options;

  const [triggered, setTriggered] = useState(false);
  const prevScrollY = useRef(0);

  useEffect(() => {
    const scrollTarget = target || window;

    const getScrollY = () => {
      if (target) {
        return target.scrollTop;
      }
      return window.scrollY;
    };

    const handleScroll = () => {
      const currentScrollY = getScrollY();

      if (disableHysteresis) {
        setTriggered(currentScrollY > threshold);
      } else {
        // With hysteresis: only trigger when scrolling down past threshold,
        // only untrigger when scrolling up past threshold
        if (currentScrollY > threshold && currentScrollY > prevScrollY.current) {
          setTriggered(true);
        } else if (currentScrollY < threshold) {
          setTriggered(false);
        }
      }

      prevScrollY.current = currentScrollY;
    };

    // Initialize
    handleScroll();

    scrollTarget.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollTarget.removeEventListener("scroll", handleScroll);
  }, [threshold, disableHysteresis, target]);

  return triggered;
}
