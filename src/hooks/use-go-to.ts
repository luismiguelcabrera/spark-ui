"use client";

import { useCallback } from "react";

type GoToOptions = {
  /** Scroll behavior (default: "smooth") */
  behavior?: ScrollBehavior;
  /** Pixel offset subtracted from the final scroll position, useful for fixed headers (default: 0) */
  offset?: number;
};

type UseGoToReturn = {
  /** Scroll to a target: CSS selector string, pixel offset number, or HTMLElement */
  goTo: (target: string | number | HTMLElement, options?: GoToOptions) => void;
};

/**
 * Smooth-scroll to an element or position.
 *
 * ```tsx
 * const { goTo } = useGoTo();
 * goTo("#section-2");           // scroll to element by selector
 * goTo(500);                    // scroll to 500px
 * goTo(elementRef.current);     // scroll to an element
 * goTo("#header", { offset: 64 }); // account for fixed header
 * ```
 */
export function useGoTo(): UseGoToReturn {
  const goTo = useCallback(
    (target: string | number | HTMLElement, options: GoToOptions = {}) => {
      const { behavior = "smooth", offset = 0 } = options;

      let top: number;

      if (typeof target === "number") {
        top = target - offset;
      } else if (typeof target === "string") {
        const el = document.querySelector(target);
        if (!el) {
          if (process.env.NODE_ENV !== "production") {
            console.warn(
              `[spark-ui] useGoTo: Element not found for selector "${target}"`,
            );
          }
          return;
        }
        const rect = el.getBoundingClientRect();
        top = rect.top + window.scrollY - offset;
      } else {
        // HTMLElement
        const rect = target.getBoundingClientRect();
        top = rect.top + window.scrollY - offset;
      }

      window.scrollTo({ top, behavior });
    },
    [],
  );

  return { goTo };
}
