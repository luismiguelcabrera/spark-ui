"use client";

import { useState, useEffect, useRef } from "react";

export type UseHeadroomOptions = {
  /** Scroll position in px at which the element becomes fixed (default: 0) */
  fixedAt?: number;
};

/**
 * Show/hide an element based on scroll direction, commonly used for headers.
 *
 * Returns `true` when the element should be pinned (visible):
 * - User is at the top of the page (scroll <= fixedAt)
 * - User is scrolling up
 *
 * Returns `false` when scrolling down past the fixedAt threshold.
 *
 * SSR-safe.
 *
 * ```tsx
 * const pinned = useHeadroom({ fixedAt: 100 });
 * return <header style={{ position: 'fixed', transform: pinned ? 'none' : 'translateY(-100%)' }} />
 * ```
 */
export function useHeadroom(options: UseHeadroomOptions = {}): boolean {
  const { fixedAt = 0 } = options;

  const [pinned, setPinned] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= fixedAt) {
        // At the top: always show
        setPinned(true);
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up: show
        setPinned(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down: hide
        setPinned(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fixedAt]);

  return pinned;
}
