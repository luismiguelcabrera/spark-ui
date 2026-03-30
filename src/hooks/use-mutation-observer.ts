"use client";

import { useEffect, type RefObject } from "react";

type UseMutationObserverOptions = {
  /** Watch for attribute changes (default: true) */
  attributes?: boolean;
  /** Watch for child list changes (default: true) */
  childList?: boolean;
  /** Watch the entire subtree (default: true) */
  subtree?: boolean;
  /** Watch for character data changes (default: false) */
  characterData?: boolean;
};

/**
 * Observe DOM mutations on a referenced element.
 *
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * useMutationObserver(ref, (mutations) => {
 *   console.log("DOM changed:", mutations);
 * });
 * ```
 *
 * @param ref - Ref to the element to observe
 * @param callback - Callback invoked with mutation records
 * @param options - MutationObserver options (defaults: attributes, childList, subtree all true)
 */
export function useMutationObserver<T extends HTMLElement>(
  ref: RefObject<T | null>,
  callback: MutationCallback,
  options: UseMutationObserverOptions = {},
): void {
  const {
    attributes = true,
    childList = true,
    subtree = true,
    characterData = false,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Guard for SSR
    if (typeof MutationObserver === "undefined") return;

    const observer = new MutationObserver(callback);
    observer.observe(el, { attributes, childList, subtree, characterData });

    return () => observer.disconnect();
  }, [ref, callback, attributes, childList, subtree, characterData]);
}
