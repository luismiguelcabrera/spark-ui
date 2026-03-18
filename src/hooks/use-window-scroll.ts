"use client";

import { useState, useEffect, useCallback } from "react";

type ScrollPosition = {
  x: number;
  y: number;
};

type UseWindowScrollReturn = {
  /** Current scroll position */
  x: number;
  y: number;
  /** Scroll to a specific position */
  scrollTo: (options: ScrollToOptions) => void;
  /** Scroll to the top of the page */
  scrollToTop: (behavior?: ScrollBehavior) => void;
  /** Scroll to the bottom of the page */
  scrollToBottom: (behavior?: ScrollBehavior) => void;
};

/**
 * Track the window scroll position and provide scroll utilities.
 *
 * ```tsx
 * const { x, y, scrollToTop } = useWindowScroll();
 * ```
 */
export function useWindowScroll(): UseWindowScrollReturn {
  const [position, setPosition] = useState<ScrollPosition>({
    x: typeof window !== "undefined" ? window.scrollX : 0,
    y: typeof window !== "undefined" ? window.scrollY : 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      setPosition({ x: window.scrollX, y: window.scrollY });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = useCallback((options: ScrollToOptions) => {
    window.scrollTo(options);
  }, []);

  const scrollToTop = useCallback((behavior: ScrollBehavior = "smooth") => {
    window.scrollTo({ top: 0, left: 0, behavior });
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      left: 0,
      behavior,
    });
  }, []);

  return {
    x: position.x,
    y: position.y,
    scrollTo,
    scrollToTop,
    scrollToBottom,
  };
}
