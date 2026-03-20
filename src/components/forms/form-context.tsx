"use client";

/* eslint-disable @typescript-eslint/no-explicit-any -- generic form context requires any */

import { createContext, useContext } from "react";
import type { UseFormReturn } from "../../hooks/use-form";

// ── Form-level context ──

type FormContextValue<T extends Record<string, any> = Record<string, any>> = {
  form: UseFormReturn<T>;
  formError: string | null;
  setFormError: (error: string | null) => void;
};

const FormContext = createContext<FormContextValue | null>(null);

/**
 * Access the form context. Throws if used outside `<Form>`.
 */
function useFormContext<
  T extends Record<string, any> = Record<string, any>,
>(): FormContextValue<T> {
  const ctx = useContext(FormContext);
  if (!ctx) {
    throw new Error("useFormContext must be used within a <Form> provider");
  }
  return ctx as unknown as FormContextValue<T>;
}

/**
 * Access the form context safely — returns `null` if not inside `<Form>`.
 * Preferred over try/catch around `useFormContext()`.
 */
function useFormContextSafe<
  T extends Record<string, any> = Record<string, any>,
>(): FormContextValue<T> | null {
  const ctx = useContext(FormContext);
  return ctx as FormContextValue<T> | null;
}

// ── Field-level context ──

type FormFieldContextValue = {
  name: string;
  id: string;
  error: string | null;
  touched: boolean;
  dirty: boolean;
  value: any;
  onChange: (value: any) => void;
  onBlur: () => void;
};

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

/**
 * Access the current field context — returns `null` if not inside `<Form.Field>`.
 */
function useFormFieldContext(): FormFieldContextValue | null {
  return useContext(FormFieldContext);
}

/**
 * Hook for custom components to consume form field binding via context.
 * Alternative to cloneElement auto-binding — works with any component structure.
 *
 * @example
 * ```tsx
 * function MyCustomInput() {
 *   const field = useFormField();
 *   if (!field) return <input />;
 *   return <input value={field.value} onChange={field.onChange} />;
 * }
 * ```
 */
function useFormField(): FormFieldContextValue | null {
  return useContext(FormFieldContext);
}

export {
  FormContext,
  useFormContext,
  useFormContextSafe,
  FormFieldContext,
  useFormFieldContext,
  useFormField,
};
export type { FormContextValue, FormFieldContextValue };
