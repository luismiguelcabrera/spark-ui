"use client";

/* eslint-disable @typescript-eslint/no-explicit-any -- generic form component requires any */

import { useState, useCallback, useRef, type ComponentProps, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { FormContext } from "./form-context";
import type { UseFormReturn } from "../../hooks/use-form";
import { FormField } from "./form-field";
import { FormSubmit } from "./form-submit";
import { FormError } from "./form-error";
import { FormMessage } from "./form-message";
import { FormSteps } from "./form-steps";
import { FormStep } from "./form-step";
import { FormWatch } from "./form-watch";
import { FormIf } from "./form-if";
import { FormReset } from "./form-reset";
import { FormDebug } from "./form-debug";
import { FormFieldArray } from "./form-field-array";

// ── Types ──

type SubmitResult = {
  fieldErrors?: Record<string, string>;
  formError?: string;
} | void;

type FormProps<T extends Record<string, any> = Record<string, any>> = Omit<
  ComponentProps<"form">,
  "onSubmit"
> & {
  form: UseFormReturn<T>;
  onSubmit?: (values: T) => SubmitResult | Promise<SubmitResult>;
  action?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  /** Scroll to and focus the first invalid field on submit failure. */
  focusFirstError?: boolean;
  children?: ReactNode;
  className?: string;
};

// ── Component ──

function FormRoot<T extends Record<string, any>>({
  form,
  onSubmit,
  action,
  onSuccess,
  onError,
  focusFirstError = false,
  children,
  className,
  ...props
}: FormProps<T>) {
  const [formError, setFormError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const focusField = useCallback(
    (fieldName: string) => {
      if (!focusFirstError || typeof document === "undefined") return;
      // Try by name attribute, then by ID
      const el =
        formRef.current?.querySelector<HTMLElement>(`[name="${fieldName}"]`) ??
        formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(fieldName)}`);
      if (el) {
        el.scrollIntoView?.({ behavior: "smooth", block: "center" });
        el.focus();
      }
    },
    [focusFirstError],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFormError(null);

      // Mark all fields as touched
      for (const key of Object.keys(form.values)) {
        form.setFieldTouched(key as keyof T, true);
      }

      // Validate
      const errors = form.validate();
      if (Object.keys(errors).length > 0) {
        const firstErrorField = Object.keys(errors)[0];
        focusField(firstErrorField);
        return;
      }

      // Get values with transforms applied
      const submitValues = form.getTransformedValues();

      // action-based submit (built-in fetch)
      if (action) {
        try {
          const res = await fetch(action, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(submitValues),
          });
          const data = await res.json().catch(() => null);

          if (res.ok) {
            onSuccess?.(data);
          } else {
            if (data?.fieldErrors) {
              for (const [field, msg] of Object.entries(data.fieldErrors)) {
                form.setFieldError(field as keyof T, msg as string);
              }
              const first = Object.keys(data.fieldErrors)[0];
              if (first) focusField(first);
            }
            if (data?.formError) {
              setFormError(data.formError);
            }
            onError?.(data);
          }
        } catch (err) {
          onError?.(err);
        }
        return;
      }

      // callback-based submit
      if (onSubmit) {
        try {
          const result = await onSubmit(submitValues);
          if (result) {
            if (result.fieldErrors) {
              for (const [field, msg] of Object.entries(result.fieldErrors)) {
                form.setFieldError(field as keyof T, msg as string);
              }
              const first = Object.keys(result.fieldErrors)[0];
              if (first) focusField(first);
            }
            if (result.formError) {
              setFormError(result.formError);
            }
          }
        } catch (err) {
          if (err instanceof Error) {
            setFormError(err.message);
          }
        }
      }
    },
    [form, onSubmit, action, onSuccess, onError, focusField],
  );

  return (
    <FormContext.Provider value={{ form: form as any, formError, setFormError }}>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        className={cn(className)}
        {...props}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}
FormRoot.displayName = "Form";

// ── Compound export ──

const Form = Object.assign(FormRoot, {
  Field: FormField,
  FieldArray: FormFieldArray,
  Submit: FormSubmit,
  Reset: FormReset,
  Error: FormError,
  Message: FormMessage,
  Watch: FormWatch,
  If: FormIf,
  Steps: FormSteps,
  Step: FormStep,
  Debug: FormDebug,
});

export { Form };
export type { FormProps, SubmitResult };
