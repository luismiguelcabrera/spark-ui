"use client";

import { useEffect } from "react";
import type { UseFormReturn } from "./use-form";

// ── Types ──

export type UseFormGuardOptions = {
  /** Custom message for the browser's confirmation dialog.
   * Note: Most modern browsers ignore custom messages and show their own.
   * @default "You have unsaved changes. Are you sure you want to leave?"
   */
  message?: string;
  /** Whether the guard is active. @default true */
  enabled?: boolean;
};

// ── Hook ──

/**
 * useFormGuard — prevents accidental navigation away from a dirty form.
 *
 * Attaches a `beforeunload` event listener when the form has unsaved changes,
 * triggering the browser's native "leave page?" confirmation dialog.
 *
 * SSR-safe: the effect only runs in browser environments.
 *
 * @example
 * ```tsx
 * const form = useForm({ initialValues: { name: "" } });
 * useFormGuard(form);
 *
 * // With options
 * useFormGuard(form, { enabled: !form.isSubmitting });
 * ```
 */
export function useFormGuard<T extends Record<string, unknown>>(
  form: UseFormReturn<T>,
  options?: UseFormGuardOptions,
): void {
  const {
    message = "You have unsaved changes. Are you sure you want to leave?",
    enabled = true,
  } = options ?? {};

  const isDirty = form.dirty;
  const shouldGuard = enabled && isDirty;

  useEffect(() => {
    // SSR safety — no window in server environments
    if (typeof window === "undefined") return;
    if (!shouldGuard) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Deprecated but required for cross-browser support
      e.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldGuard, message]);
}
