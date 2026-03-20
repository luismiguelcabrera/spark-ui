"use client";

/* eslint-disable @typescript-eslint/no-explicit-any -- generic form field requires any for arbitrary field values */

import {
  useId,
  isValidElement,
  cloneElement,
  type InputHTMLAttributes,
  type ReactNode,
  type ReactElement,
} from "react";
import { cn } from "../../lib/utils";
import { useLocale } from "../../lib/locale";
import { Label } from "./label";
import { Input } from "./input";
import { Icon } from "../data-display/icon";
import { FieldLabel } from "./field-label";
import { FieldError } from "./field-error";
import { FieldDescription } from "./field-description";
import { FormFieldContext, useFormContext } from "./form-context";
import type { ValidationRule } from "../../hooks/use-form";

// ── Shorthand rules type ──

type FormRules = {
  required?: boolean | string;
  min?: number | { value: number; message: string };
  max?: number | { value: number; message: string };
  minLength?: number | { value: number; message: string };
  maxLength?: number | { value: number; message: string };
  pattern?: RegExp | { value: RegExp; message: string };
  validate?: (value: any) => string | true | Promise<string | true>;
};

// ── Render prop field info ──

type FieldRenderProps = {
  value: any;
  onChange: (value: any) => void;
  onBlur: () => void;
  name: string;
  error: string | null;
  touched: boolean;
  dirty: boolean;
  id: string;
};

// ── Props ──

type FormFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "children"> & {
  name?: string;
  label?: string;
  description?: string;
  rules?: FormRules;
  icon?: string;
  iconPosition?: "left" | "right";
  error?: string;
  hint?: string;
  children?: ReactNode | ((field: FieldRenderProps) => ReactNode);
  className?: string;
};

// ── Resolve shorthand rules to full ValidationRule ──

function resolveRules(
  rules: FormRules | undefined,
  label: string,
  t: (key: string, fallback?: string) => string,
): ValidationRule | undefined {
  if (!rules) return undefined;

  const resolved: ValidationRule = {};

  // required
  if (rules.required) {
    resolved.required =
      typeof rules.required === "string"
        ? rules.required
        : t("form.required", "{label} is required").replace("{label}", label);
  }

  // min
  if (rules.min !== undefined) {
    if (typeof rules.min === "number") {
      resolved.min = {
        value: rules.min,
        message: t("form.min", "Must be at least {0}").replace(
          "{0}",
          String(rules.min),
        ),
      };
    } else {
      resolved.min = rules.min;
    }
  }

  // max
  if (rules.max !== undefined) {
    if (typeof rules.max === "number") {
      resolved.max = {
        value: rules.max,
        message: t("form.max", "Must be at most {0}").replace(
          "{0}",
          String(rules.max),
        ),
      };
    } else {
      resolved.max = rules.max;
    }
  }

  // minLength
  if (rules.minLength !== undefined) {
    if (typeof rules.minLength === "number") {
      resolved.minLength = {
        value: rules.minLength,
        message: t("form.minLength", "Must be at least {0} characters").replace(
          "{0}",
          String(rules.minLength),
        ),
      };
    } else {
      resolved.minLength = rules.minLength;
    }
  }

  // maxLength
  if (rules.maxLength !== undefined) {
    if (typeof rules.maxLength === "number") {
      resolved.maxLength = {
        value: rules.maxLength,
        message: t("form.maxLength", "Must be at most {0} characters").replace(
          "{0}",
          String(rules.maxLength),
        ),
      };
    } else {
      resolved.maxLength = rules.maxLength;
    }
  }

  // pattern
  if (rules.pattern !== undefined) {
    if (rules.pattern instanceof RegExp) {
      resolved.pattern = {
        value: rules.pattern,
        message: t("form.pattern", "{label} is invalid").replace("{label}", label),
      };
    } else {
      resolved.pattern = rules.pattern;
    }
  }

  // validate
  if (rules.validate) {
    resolved.validate = rules.validate;
  }

  return resolved;
}

// ── Component ──

function FormField({
  name,
  label,
  description,
  rules,
  icon,
  iconPosition = "right",
  error: errorProp,
  hint,
  children,
  className,
  id: idProp,
  ...inputProps
}: FormFieldProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const { t } = useLocale();

  // Try to access form context (may be null if standalone)
  let formCtx: ReturnType<typeof useFormContext> | null = null;
  try {
    formCtx = useFormContext();
  } catch {
    // Not inside a Form — standalone mode
  }

  // ── Context-bound mode ──
  if (formCtx && name) {
    const { form } = formCtx;
    const resolvedRules = resolveRules(rules, label ?? name, t);
    const registered = form.register(name as any, resolvedRules);
    const fieldState = form.getFieldState(name as any);

    const fieldError = errorProp ?? fieldState.error ?? null;
    const errorId = fieldError ? `${id}-error` : undefined;
    const descId = description ? `${id}-desc` : undefined;
    const isRequired = !!rules?.required;

    const fieldContextValue = {
      name,
      id,
      error: fieldError,
      touched: fieldState.touched,
      dirty: fieldState.dirty,
    };

    // Render prop
    if (typeof children === "function") {
      return (
        <FormFieldContext.Provider value={fieldContextValue}>
          <div className={cn("flex flex-col gap-1.5", className)}>
            {label && (
              <FieldLabel htmlFor={id} required={isRequired}>
                {label}
              </FieldLabel>
            )}
            {children({
              value: registered.value,
              onChange: registered.onChange,
              onBlur: registered.onBlur,
              name: registered.name,
              error: fieldError,
              touched: fieldState.touched,
              dirty: fieldState.dirty,
              id,
            })}
            <FieldError id={errorId}>{fieldError}</FieldError>
            {description && !fieldError && (
              <FieldDescription id={descId}>{description}</FieldDescription>
            )}
          </div>
        </FormFieldContext.Provider>
      );
    }

    // ReactNode children — cloneElement to inject props
    if (children) {
      const child = isValidElement(children) ? children : null;
      const injectedChild = child
        ? cloneElement(child as ReactElement<any>, {
            id,
            value: registered.value,
            onChange: registered.onChange,
            onBlur: registered.onBlur,
            name: registered.name,
            "aria-invalid": fieldError ? true : undefined,
            "aria-describedby":
              [errorId, descId].filter(Boolean).join(" ") || undefined,
          })
        : children;

      return (
        <FormFieldContext.Provider value={fieldContextValue}>
          <div className={cn("flex flex-col gap-1.5", className)}>
            {label && (
              <FieldLabel htmlFor={id} required={isRequired}>
                {label}
              </FieldLabel>
            )}
            <div className="relative group">
              {icon && iconPosition === "left" && (
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                  <Icon
                    name={icon}
                    size="md"
                    className={cn(
                      "text-slate-500 group-focus-within:text-primary transition-colors",
                      fieldError && "text-red-400",
                    )}
                  />
                </div>
              )}
              {injectedChild}
              {icon && iconPosition === "right" && (
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none z-10">
                  <Icon
                    name={icon}
                    size="md"
                    className={cn(
                      "text-slate-500 group-focus-within:text-primary transition-colors",
                      fieldError && "text-red-400",
                    )}
                  />
                </div>
              )}
            </div>
            <FieldError id={errorId}>{fieldError}</FieldError>
            {description && !fieldError && (
              <FieldDescription id={descId}>{description}</FieldDescription>
            )}
          </div>
        </FormFieldContext.Provider>
      );
    }

    // No children — render a default Input
    return (
      <FormFieldContext.Provider value={fieldContextValue}>
        <div className={cn("flex flex-col gap-1.5", className)}>
          <Input
            id={id}
            label={label}
            icon={icon}
            iconPosition={iconPosition}
            error={fieldError ?? undefined}
            hint={description ?? hint}
            aria-invalid={fieldError ? true : undefined}
            aria-describedby={errorId ?? descId}
            {...registered}
            {...inputProps}
          />
        </div>
      </FormFieldContext.Provider>
    );
  }

  // ── Standalone mode (backward compatible) ──

  const error = errorProp;
  const errorId = error ? `${id}-error` : undefined;
  const hintId = hint && !error ? `${id}-hint` : undefined;

  if (children && typeof children !== "function") {
    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        {label && <Label htmlFor={id}>{label}</Label>}
        <div className="relative group">
          {icon && iconPosition === "left" && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
              <Icon
                name={icon}
                size="md"
                className={cn(
                  "text-slate-500 group-focus-within:text-primary transition-colors",
                  error && "text-red-400",
                )}
              />
            </div>
          )}
          {children}
          {icon && iconPosition === "right" && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none z-10">
              <Icon
                name={icon}
                size="md"
                className={cn(
                  "text-slate-500 group-focus-within:text-primary transition-colors",
                  error && "text-red-400",
                )}
              />
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="text-xs text-red-600 font-medium" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="text-xs text-slate-600">
            {hint}
          </p>
        )}
      </div>
    );
  }

  // Default: render Input with pass-through props
  return (
    <div className={className}>
      <Input
        id={id}
        label={label}
        icon={icon}
        iconPosition={iconPosition}
        error={error}
        hint={hint}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId ?? hintId}
        {...inputProps}
      />
    </div>
  );
}
FormField.displayName = "FormField";

export { FormField };
export type { FormFieldProps, FormRules, FieldRenderProps };
