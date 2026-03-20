"use client";

/* eslint-disable @typescript-eslint/no-explicit-any -- generic form component requires any */

import { useState, useCallback, type ComponentProps, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { FormContext } from "./form-context";
import type { UseFormReturn } from "../../hooks/use-form";
import { FormField } from "./form-field";
import { FormSubmit } from "./form-submit";
import { FormError } from "./form-error";
import { FormMessage } from "./form-message";
import { FormSteps } from "./form-steps";
import { FormStep } from "./form-step";

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
  children,
  className,
  ...props
}: FormProps<T>) {
  const [formError, setFormError] = useState<string | null>(null);

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
      if (Object.keys(errors).length > 0) return;

      // action-based submit (built-in fetch)
      if (action) {
        try {
          const res = await fetch(action, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form.values),
          });
          const data = await res.json().catch(() => null);

          if (res.ok) {
            onSuccess?.(data);
          } else {
            // Try to apply field errors from response
            if (data?.fieldErrors) {
              for (const [field, msg] of Object.entries(data.fieldErrors)) {
                form.setFieldError(field as keyof T, msg as string);
              }
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
          const result = await onSubmit(form.values);
          if (result) {
            if (result.fieldErrors) {
              for (const [field, msg] of Object.entries(result.fieldErrors)) {
                form.setFieldError(field as keyof T, msg as string);
              }
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
    [form, onSubmit, action, onSuccess, onError],
  );

  return (
    <FormContext.Provider value={{ form: form as any, formError, setFormError }}>
      <form
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
  Submit: FormSubmit,
  Error: FormError,
  Message: FormMessage,
  Steps: FormSteps,
  Step: FormStep,
});

export { Form };
export type { FormProps, SubmitResult };
