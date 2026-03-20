"use client";

import type { UseFormReturn } from "./use-form";

// ── Types ──

export type UseWatchReturn<T, K> = K extends undefined
  ? T
  : K extends keyof T
    ? T[K]
    : K extends (keyof T)[]
      ? { [I in keyof K]: K[I] extends keyof T ? T[K[I]] : never }
      : never;

// ── Hook ──

/**
 * useWatch — reactively reads specific field values from a form.
 *
 * Returns the full form values when called without a field name,
 * a single field value when called with a field name,
 * or an array of values when called with an array of field names.
 *
 * @example
 * ```tsx
 * const form = useForm({ initialValues: { email: "", password: "" } });
 *
 * // Watch all values
 * const values = useWatch(form);
 *
 * // Watch a single field
 * const email = useWatch(form, "email");
 *
 * // Watch multiple fields
 * const [email, password] = useWatch(form, ["email", "password"]);
 * ```
 */
export function useWatch<T extends Record<string, unknown>>(
  form: UseFormReturn<T>,
): T;
export function useWatch<T extends Record<string, unknown>>(
  form: UseFormReturn<T>,
  name: keyof T,
): T[keyof T];
export function useWatch<T extends Record<string, unknown>>(
  form: UseFormReturn<T>,
  names: (keyof T)[],
): T[keyof T][];
export function useWatch<T extends Record<string, unknown>>(
  form: UseFormReturn<T>,
  nameOrNames?: keyof T | (keyof T)[],
): T | T[keyof T] | T[keyof T][] {
  // No field name — return all values
  if (nameOrNames === undefined) {
    return form.values;
  }

  // Array of field names — return array of values
  if (Array.isArray(nameOrNames)) {
    return nameOrNames.map((n) => form.values[n]);
  }

  // Single field name — return single value
  return form.values[nameOrNames];
}
