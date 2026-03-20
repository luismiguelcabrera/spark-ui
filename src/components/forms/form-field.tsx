"use client";

/* eslint-disable @typescript-eslint/no-explicit-any -- generic form field requires any for arbitrary field values */

import {
  useId,
  useEffect,
  useRef,
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
  /** Hide the built-in error display. Use render prop or Form.Message for custom error rendering. */
  hideError?: boolean;
  /** Override when this field validates: "change" | "blur" | "submit". Default inherits from form. */
  validateOn?: "change" | "blur" | "submit";
  /** Re-validate this field when any of these sibling fields change (e.g. confirm password). */
  deps?: string[];
  /** Show character counter for string fields with minLength/maxLength rules. */
  showCounter?: boolean;
  /** Show a green check icon when the field is valid and touched. */
  showSuccess?: boolean;
  /** Transform the value before storing (e.g. trim, lowercase). */
  transform?: (value: any) => any;
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
  hideError = false,
  validateOn,
  deps,
  showCounter = false,
  showSuccess = false,
  transform: transformFn,
  children,
  className,
  id: idProp,
  ...inputProps
}: FormFieldProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const { t } = useLocale();
  const prevDepsRef = useRef<any[]>([]);

  // Try to access form context (may be null if standalone)
  let formCtx: ReturnType<typeof useFormContext> | null = null;
  try {
    formCtx = useFormContext();
  } catch {
    // Not inside a Form — standalone mode
  }

  // ── Cross-field deps: re-validate when dep values change ──
  const depValues = deps?.map((d) => formCtx?.form.values[d as any]);
  useEffect(() => {
    if (!formCtx || !name || !deps?.length) return;
    const { form } = formCtx;
    const fieldState = form.getFieldState(name as any);
    // Only re-validate if this field has been touched
    if (!fieldState.touched) return;
    // Check if dep values actually changed
    const prevVals = prevDepsRef.current;
    const changed = depValues?.some((v, i) => v !== prevVals[i]);
    if (changed) {
      form.validate();
    }
    prevDepsRef.current = depValues ?? [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depValues?.join(",")]);

  // ── Context-bound mode ──
  if (formCtx && name) {
    const { form } = formCtx;
    const resolvedRules = resolveRules(rules, label ?? name, t);
    const registered = form.register(name as any, resolvedRules);
    const fieldState = form.getFieldState(name as any);

    // Wrap onChange with transform if provided
    const wrappedOnChange = transformFn
      ? (e: any) => {
          const raw = typeof e === "object" && e?.target ? e.target.value : e;
          const transformed = transformFn(raw);
          registered.onChange(transformed);
        }
      : registered.onChange;

    // Override onBlur/onChange based on validateOn
    const wrappedOnBlur =
      validateOn === "submit"
        ? () => form.setFieldTouched(name as any, true)
        : registered.onBlur;
    const finalOnChange =
      validateOn === "change"
        ? (e: any) => {
            wrappedOnChange(e);
            // Trigger validation after value update
            setTimeout(() => form.validate(), 0);
          }
        : wrappedOnChange;

    const fieldError = errorProp ?? fieldState.error ?? null;
    const errorId = fieldError ? `${id}-error` : undefined;
    const descId = description ? `${id}-desc` : undefined;
    const isRequired = !!rules?.required;

    // Character counter
    const charCount =
      showCounter && typeof registered.value === "string"
        ? registered.value.length
        : null;
    const maxLen =
      rules?.maxLength !== undefined
        ? typeof rules.maxLength === "number"
          ? rules.maxLength
          : rules.maxLength.value
        : null;

    // Success state
    const isSuccess =
      showSuccess && fieldState.touched && !fieldError && fieldState.dirty;

    const fieldContextValue = {
      name,
      id,
      error: fieldError,
      touched: fieldState.touched,
      dirty: fieldState.dirty,
    };

    // Counter + success helper
    const counterEl =
      showCounter && charCount !== null ? (
        <span className="text-xs text-slate-500">
          {charCount}
          {maxLen !== null ? `/${maxLen}` : ""}
        </span>
      ) : null;

    const successEl = isSuccess ? (
      <Icon name="check-circle" size="sm" className="text-green-600" />
    ) : null;

    const footerEl = (counterEl || successEl) ? (
      <div className="flex items-center justify-between">
        {successEl}
        {counterEl}
      </div>
    ) : null;

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
              onChange: finalOnChange,
              onBlur: wrappedOnBlur,
              name: registered.name,
              error: fieldError,
              touched: fieldState.touched,
              dirty: fieldState.dirty,
              id,
            })}
            {!hideError && <FieldError id={errorId}>{fieldError}</FieldError>}
            {description && !fieldError && (
              <FieldDescription id={descId}>{description}</FieldDescription>
            )}
            {footerEl}
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
            onChange: finalOnChange,
            onBlur: wrappedOnBlur,
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
            {!hideError && <FieldError id={errorId}>{fieldError}</FieldError>}
            {description && !fieldError && (
              <FieldDescription id={descId}>{description}</FieldDescription>
            )}
            {footerEl}
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
            error={hideError ? undefined : (fieldError ?? undefined)}
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
