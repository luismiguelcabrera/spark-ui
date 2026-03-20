"use client";

import { createContext, useContext } from "react";
import type { UseFormReturn } from "../../hooks/use-form";

/* eslint-disable @typescript-eslint/no-explicit-any -- generic form context requires any */

// ── Form-level context ──

type FormContextValue<T extends Record<string, any> = Record<string, any>> = {
  form: UseFormReturn<T>;
  formError: string | null;
  setFormError: (error: string | null) => void;
};

const FormContext = createContext<FormContextValue | null>(null);

function useFormContext<
  T extends Record<string, any> = Record<string, any>,
>(): FormContextValue<T> {
  const ctx = useContext(FormContext);
  if (!ctx) {
    throw new Error("useFormContext must be used within a <Form> provider");
  }
  return ctx as unknown as FormContextValue<T>;
}

// ── Field-level context ──

type FormFieldContextValue = {
  name: string;
  id: string;
  error: string | null;
  touched: boolean;
  dirty: boolean;
};

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

function useFormFieldContext(): FormFieldContextValue | null {
  return useContext(FormFieldContext);
}

export { FormContext, useFormContext, FormFieldContext, useFormFieldContext };
export type { FormContextValue, FormFieldContextValue };
