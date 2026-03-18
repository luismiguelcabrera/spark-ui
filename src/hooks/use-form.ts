"use client";
/* eslint-disable @typescript-eslint/no-explicit-any -- generic form hook requires any for arbitrary field values */

import { useState, useCallback, useRef } from "react";

// ── Types ──

export type ValidationRule<T = any> = {
  required?: string | boolean;
  min?: { value: number; message: string };
  max?: { value: number; message: string };
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  validate?: (value: T) => string | true | Promise<string | true>;
};

export type FieldState = {
  value: any;
  error: string | null;
  touched: boolean;
  dirty: boolean;
};

export type UseFormConfig<T extends Record<string, any>> = {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit?: (values: T) => void | Promise<void>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
};

export type UseFormReturn<T extends Record<string, any>> = {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  dirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;

  getFieldProps: (name: keyof T) => {
    value: T[keyof T];
    onChange: (e: any) => void;
    onBlur: () => void;
    name: string;
  };
  getFieldState: (name: keyof T) => FieldState;

  setFieldValue: (name: keyof T, value: any) => void;
  setFieldError: (name: keyof T, error: string | null) => void;
  setFieldTouched: (name: keyof T, touched?: boolean) => void;
  setValues: (values: Partial<T>) => void;
  setErrors: (errors: Partial<Record<keyof T, string>>) => void;
  reset: (values?: T) => void;
  validate: () => Partial<Record<keyof T, string>>;
  handleSubmit: (e?: React.FormEvent) => void | Promise<void>;

  register: (
    name: keyof T,
    rules?: ValidationRule<any>,
  ) => {
    value: T[keyof T];
    onChange: (e: any) => void;
    onBlur: () => void;
    name: string;
  };
};

// ── Helpers ──

function extractValue(e: any): any {
  if (
    e !== null &&
    typeof e === "object" &&
    "target" in e &&
    e.target !== undefined
  ) {
    const target = e.target as HTMLInputElement;
    if (target.type === "checkbox") return target.checked;
    return target.value;
  }
  return e;
}

function validateField(value: any, rules?: ValidationRule): string | null {
  if (!rules) return null;

  // required
  if (rules.required) {
    const isEmpty =
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0);
    if (isEmpty) {
      return typeof rules.required === "string"
        ? rules.required
        : "This field is required";
    }
  }

  // min
  if (rules.min !== undefined && typeof value === "number") {
    if (value < rules.min.value) return rules.min.message;
  }

  // max
  if (rules.max !== undefined && typeof value === "number") {
    if (value > rules.max.value) return rules.max.message;
  }

  // minLength
  if (rules.minLength !== undefined && typeof value === "string") {
    if (value.length < rules.minLength.value) return rules.minLength.message;
  }

  // maxLength
  if (rules.maxLength !== undefined && typeof value === "string") {
    if (value.length > rules.maxLength.value) return rules.maxLength.message;
  }

  // pattern
  if (rules.pattern !== undefined && typeof value === "string") {
    if (!rules.pattern.value.test(value)) return rules.pattern.message;
  }

  return null;
}

async function validateFieldAsync(
  value: any,
  rules?: ValidationRule,
): Promise<string | null> {
  // Run sync validations first
  const syncError = validateField(value, rules);
  if (syncError) return syncError;

  // Run async validate
  if (rules?.validate) {
    const result = await rules.validate(value);
    if (result !== true) return result;
  }

  return null;
}

// ── Hook ──

export function useForm<T extends Record<string, any>>(
  config: UseFormConfig<T>,
): UseFormReturn<T> {
  const {
    initialValues,
    validate: formValidate,
    onSubmit,
    validateOnChange = false,
    validateOnBlur = true,
  } = config;

  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrorsState] = useState<Partial<Record<keyof T, string>>>(
    {},
  );
  const [touched, setTouchedState] = useState<
    Partial<Record<keyof T, boolean>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValuesRef = useRef<T>(initialValues);
  const rulesRef = useRef<Partial<Record<keyof T, ValidationRule>>>({});

  // Derived state
  const dirty = Object.keys(values).some(
    (key) =>
      values[key as keyof T] !==
      initialValuesRef.current[key as keyof T],
  );

  const isValid = Object.keys(errors).every(
    (key) => !errors[key as keyof T],
  );

  // ── Validate a single field (sync only, for internal use) ──
  const validateSingleField = useCallback(
    (name: keyof T, val: any): string | null => {
      const fieldRules = rulesRef.current[name];
      const syncError = validateField(val, fieldRules);
      if (syncError) return syncError;

      // Check custom sync validate (non-Promise result)
      if (fieldRules?.validate) {
        const result = fieldRules.validate(val);
        if (typeof result === "string") return result;
        // If it's a Promise we skip it in sync context
      }

      return null;
    },
    [],
  );

  // ── Validate all fields ──
  const validate = useCallback((): Partial<Record<keyof T, string>> => {
    const newErrors: Partial<Record<keyof T, string>> = {};

    // Field-level validation
    for (const key of Object.keys(values) as (keyof T)[]) {
      const fieldRules = rulesRef.current[key];
      const error = validateField(values[key], fieldRules);
      if (error) {
        newErrors[key] = error;
      } else if (fieldRules?.validate) {
        const result = fieldRules.validate(values[key]);
        if (typeof result === "string") {
          newErrors[key] = result;
        }
      }
    }

    // Form-level validation
    if (formValidate) {
      const formErrors = formValidate(values);
      for (const [key, msg] of Object.entries(formErrors)) {
        if (msg) {
          newErrors[key as keyof T] = msg as string;
        }
      }
    }

    setErrorsState(newErrors);
    return newErrors;
  }, [values, formValidate]);

  // ── Set field value ──
  const setFieldValue = useCallback(
    (name: keyof T, value: any) => {
      setValuesState((prev) => ({ ...prev, [name]: value }));
      if (validateOnChange) {
        const error = validateField(value, rulesRef.current[name]);
        setErrorsState((prev) => {
          const next = { ...prev };
          if (error) {
            next[name] = error;
          } else {
            delete next[name];
          }
          return next;
        });
      }
    },
    [validateOnChange],
  );

  // ── Set field error ──
  const setFieldError = useCallback(
    (name: keyof T, error: string | null) => {
      setErrorsState((prev) => {
        const next = { ...prev };
        if (error) {
          next[name] = error;
        } else {
          delete next[name];
        }
        return next;
      });
    },
    [],
  );

  // ── Set field touched ──
  const setFieldTouched = useCallback(
    (name: keyof T, isTouched = true) => {
      setTouchedState((prev) => ({ ...prev, [name]: isTouched }));
    },
    [],
  );

  // ── Set multiple values ──
  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState((prev) => ({ ...prev, ...newValues }));
  }, []);

  // ── Set multiple errors ──
  const setErrors = useCallback(
    (newErrors: Partial<Record<keyof T, string>>) => {
      setErrorsState((prev) => ({ ...prev, ...newErrors }));
    },
    [],
  );

  // ── Reset ──
  const reset = useCallback(
    (newInitial?: T) => {
      const resetTo = newInitial ?? initialValuesRef.current;
      if (newInitial) {
        initialValuesRef.current = newInitial;
      }
      setValuesState(resetTo);
      setErrorsState({});
      setTouchedState({});
    },
    [],
  );

  // ── Handle submit ──
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      // Mark all fields as touched
      const allTouched: Partial<Record<keyof T, boolean>> = {};
      for (const key of Object.keys(values) as (keyof T)[]) {
        allTouched[key] = true;
      }
      setTouchedState(allTouched);

      // Run all validation (including async)
      const newErrors: Partial<Record<keyof T, string>> = {};

      // Field-level validation (sync + async)
      const fieldKeys = Object.keys(values) as (keyof T)[];
      const asyncResults = await Promise.all(
        fieldKeys.map((key) =>
          validateFieldAsync(values[key], rulesRef.current[key]),
        ),
      );
      fieldKeys.forEach((key, i) => {
        if (asyncResults[i]) {
          newErrors[key] = asyncResults[i]!;
        }
      });

      // Form-level validation
      if (formValidate) {
        const formErrors = formValidate(values);
        for (const [key, msg] of Object.entries(formErrors)) {
          if (msg) {
            newErrors[key as keyof T] = msg as string;
          }
        }
      }

      setErrorsState(newErrors);

      const hasErrors = Object.keys(newErrors).length > 0;
      if (hasErrors || !onSubmit) return;

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, formValidate, onSubmit],
  );

  // ── onChange handler ──
  const createOnChange = useCallback(
    (name: keyof T) => (e: any) => {
      const val = extractValue(e);
      setFieldValue(name, val);
    },
    [setFieldValue],
  );

  // ── onBlur handler ──
  const createOnBlur = useCallback(
    (name: keyof T) => () => {
      setFieldTouched(name, true);
      if (validateOnBlur) {
        // Run sync validation for the field
        setValuesState((currentValues) => {
          const error = validateField(
            currentValues[name],
            rulesRef.current[name],
          );
          setErrorsState((prev) => {
            const next = { ...prev };
            if (error) {
              next[name] = error;
            } else if (rulesRef.current[name]?.validate) {
              const result = rulesRef.current[name]!.validate!(
                currentValues[name],
              );
              if (typeof result === "string") {
                next[name] = result;
              } else if (result === true) {
                delete next[name];
              }
              // For promise: fire and forget
              if (result && typeof result === "object" && "then" in result) {
                (result as Promise<string | true>).then((asyncResult) => {
                  setErrorsState((p) => {
                    const n = { ...p };
                    if (typeof asyncResult === "string") {
                      n[name] = asyncResult;
                    } else {
                      delete n[name];
                    }
                    return n;
                  });
                });
              }
            } else {
              delete next[name];
            }
            return next;
          });
          return currentValues;
        });
      }
    },
    [validateOnBlur, setFieldTouched],
  );

  // ── getFieldProps ──
  const getFieldProps = useCallback(
    (name: keyof T) => ({
      value: values[name],
      onChange: createOnChange(name),
      onBlur: createOnBlur(name),
      name: name as string,
    }),
    [values, createOnChange, createOnBlur],
  );

  // ── getFieldState ──
  const getFieldState = useCallback(
    (name: keyof T): FieldState => ({
      value: values[name],
      error: errors[name] ?? null,
      touched: touched[name] ?? false,
      dirty: values[name] !== initialValuesRef.current[name],
    }),
    [values, errors, touched],
  );

  // ── register ──
  const register = useCallback(
    (name: keyof T, rules?: ValidationRule) => {
      if (rules) {
        rulesRef.current[name] = rules;
      }
      return {
        value: values[name],
        onChange: createOnChange(name),
        onBlur: createOnBlur(name),
        name: name as string,
      };
    },
    [values, createOnChange, createOnBlur],
  );

  return {
    values,
    errors,
    touched,
    dirty,
    isValid,
    isSubmitting,
    getFieldProps,
    getFieldState,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setValues,
    setErrors,
    reset,
    validate,
    handleSubmit,
    register,
  };
}
