"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { UseFormReturn } from "./use-form";

// ── Types ──

export type UseAutosaveOptions<T> = {
  /** Callback invoked with the current form values when autosave triggers */
  onSave: (values: T) => void | Promise<void>;
  /** Debounce delay in milliseconds before autosave fires. @default 1000 */
  debounce?: number;
  /** Whether autosave is active. @default true */
  enabled?: boolean;
};

export type UseAutosaveReturn = {
  /** Whether a save operation is currently in progress */
  isSaving: boolean;
  /** Timestamp of the last successful save, or null if never saved */
  lastSaved: Date | null;
};

// ── Hook ──

/**
 * useAutosave — debounced autosave for forms with dirty tracking.
 *
 * Watches `form.values` and `form.dirty`. When the form is dirty and enabled,
 * waits for the debounce period, then calls `onSave`. Tracks saving state
 * and the timestamp of the last successful save.
 *
 * SSR-safe: the debounce timer only runs in browser environments.
 *
 * @example
 * ```tsx
 * const form = useForm({ initialValues: { title: "" } });
 * const { isSaving, lastSaved } = useAutosave(form, {
 *   onSave: async (values) => {
 *     await api.saveDraft(values);
 *   },
 *   debounce: 2000,
 * });
 *
 * {isSaving && <span>Saving...</span>}
 * {lastSaved && <span>Last saved: {lastSaved.toLocaleTimeString()}</span>}
 * ```
 */
export function useAutosave<T extends Record<string, unknown>>(
  form: UseFormReturn<T>,
  options: UseAutosaveOptions<T>,
): UseAutosaveReturn {
  const { onSave, debounce = 1000, enabled = true } = options;

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Stable ref for onSave to avoid re-triggering the effect
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  // Ref for the debounce timer
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track whether component is mounted to prevent state updates after unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const executeSave = useCallback(
    async (values: T) => {
      if (!mountedRef.current) return;
      setIsSaving(true);
      try {
        await onSaveRef.current(values);
        if (mountedRef.current) {
          setLastSaved(new Date());
        }
      } catch {
        // Save failed — isSaving is cleared but lastSaved is not updated.
        // Consumer can add error handling in their onSave callback.
      } finally {
        if (mountedRef.current) {
          setIsSaving(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    // SSR safety
    if (typeof window === "undefined") return;
    if (!enabled || !form.dirty) return;

    // Clear any pending timer
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }

    // Set new debounce timer
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      executeSave(form.values);
    }, debounce);

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [form.values, form.dirty, enabled, debounce, executeSave]);

  return { isSaving, lastSaved };
}
