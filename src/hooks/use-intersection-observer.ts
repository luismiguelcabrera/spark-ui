"use client";

import { useState, useEffect, type RefObject } from "react";

type UseIntersectionObserverOptions = {
  /** Element ref to observe */
  ref: RefObject<Element | null>;
  /** IntersectionObserver threshold (default: 0) */
  threshold?: number | number[];
  /** Root margin (default: "0px") */
  rootMargin?: string;
  /** Root element (default: viewport) */
  root?: Element | null;
  /** Only trigger once (default: false) */
  once?: boolean;
  /** Whether observer is active (default: true) */
  enabled?: boolean;
};

/**
 * Observe when an element enters or leaves the viewport.
 *
 * @returns IntersectionObserverEntry or null if not yet observed
 */
export function useIntersectionObserver({
  ref,
  threshold = 0,
  rootMargin = "0px",
  root = null,
  once = false,
  enabled = true,
}: UseIntersectionObserverOptions): IntersectionObserverEntry | null {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const observer = new IntersectionObserver(
      ([observerEntry]) => {
        setEntry(observerEntry);
        if (once && observerEntry.isIntersecting) {
          observer.disconnect();
        }
      },
      { threshold, rootMargin, root }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold, rootMargin, root, once, enabled]);

  return entry;
}
