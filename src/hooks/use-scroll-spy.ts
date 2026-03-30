"use client";

import { useState, useEffect, useRef, useMemo } from "react";

type UseScrollSpyOptions = {
  /** Offset in pixels from the top to determine active section (default: 0) */
  offset?: number;
  /** Root margin for IntersectionObserver (default: "0px 0px -80% 0px") */
  rootMargin?: string;
};

/**
 * Tracks which section is currently visible in the viewport.
 *
 * Uses IntersectionObserver to monitor the visibility of elements
 * identified by the provided `ids`. Returns the id of the currently
 * active (most recently intersecting) section.
 *
 * SSR-safe: guards IntersectionObserver access.
 *
 * @param ids - Array of element ids to observe
 * @param options - Configuration options
 * @returns The id of the currently active section, or `null` if none
 */
export function useScrollSpy(
  ids: string[],
  options?: UseScrollSpyOptions
): string | null {
  const { offset = 0, rootMargin } = options ?? {};
  const [activeId, setActiveId] = useState<string | null>(null);
  const intersectingRef = useRef(new Map<string, boolean>());

  const resolvedRootMargin =
    rootMargin ?? `${-offset}px 0px -80% 0px`;

  // Stabilize ids so the effect doesn't re-run on every render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableIds = useMemo(() => ids, [ids.join(",")]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      return;
    }

    const elements = stableIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    // Reset intersecting map
    intersectingRef.current = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          intersectingRef.current.set(entry.target.id, entry.isIntersecting);
        }

        // Find the first intersecting element in the original order
        const firstActive = stableIds.find(
          (id) => intersectingRef.current.get(id) === true
        );
        setActiveId(firstActive ?? null);
      },
      {
        rootMargin: resolvedRootMargin,
      }
    );

    for (const el of elements) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [stableIds, resolvedRootMargin]);

  return activeId;
}
