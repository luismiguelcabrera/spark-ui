"use client";

import { useEffect, type RefObject } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Trap keyboard focus within a container element.
 * Focus cycles between the first and last focusable elements on Tab/Shift+Tab.
 *
 * @param ref - Ref to the container element
 * @param enabled - Whether the trap is active (default: true)
 */
export function useFocusTrap<T extends HTMLElement>(
  ref: RefObject<T | null>,
  enabled = true
): void {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const focusable = el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    el.addEventListener("keydown", handleKeyDown);

    // Auto-focus first focusable element
    const focusable = el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    if (focusable.length > 0) {
      focusable[0].focus();
    }

    return () => el.removeEventListener("keydown", handleKeyDown);
  }, [ref, enabled]);
}
