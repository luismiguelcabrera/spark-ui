"use client";

import {
  forwardRef,
  useCallback,
  useRef,
  useState,
} from "react";
import { cn } from "../../lib/utils";
import { useControllable } from "../../hooks/use-controllable";
import { useClipboard } from "../../hooks/use-clipboard";
import { Icon } from "../data-display/icon";
import { CodeInput } from "./code-input";

type JsonInputProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Auto-format JSON on blur (default true) */
  formatOnBlur?: boolean;
  /** Validate JSON syntax on each change (default true) */
  validateOnChange?: boolean;
  /** Custom validator called when JSON is syntactically valid */
  validationSchema?: (json: unknown) => string | null;
  label?: string;
  /** External error (takes precedence over internal validation errors) */
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  minLines?: number;
  maxLines?: number;
  placeholder?: string;
  /** Show format button in toolbar (default true) */
  showFormatButton?: boolean;
  /** Show copy button in toolbar (default true) */
  showCopyButton?: boolean;
  className?: string;
};

const JsonInput = forwardRef<HTMLTextAreaElement, JsonInputProps>(
  (
    {
      value: valueProp,
      defaultValue = "",
      onChange,
      formatOnBlur = true,
      validateOnChange = true,
      validationSchema,
      label,
      error: externalError,
      disabled = false,
      readOnly = false,
      minLines,
      maxLines,
      placeholder = '{\n  "key": "value"\n}',
      showFormatButton = true,
      showCopyButton = true,
      className,
    },
    ref
  ) => {
    const [value, setValue] = useControllable({
      value: valueProp,
      defaultValue,
      onChange,
    });

    const [internalError, setInternalError] = useState<string | null>(null);
    const { copied, copy } = useClipboard(2000);
    const codeInputRef = useRef<HTMLTextAreaElement | null>(null);

    // Merge forwarded ref with internal ref
    const setRefs = useCallback(
      (el: HTMLTextAreaElement | null) => {
        codeInputRef.current = el;
        if (typeof ref === "function") {
          ref(el);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current =
            el;
        }
      },
      [ref]
    );

    // Validate JSON string
    const validate = useCallback(
      (str: string): string | null => {
        if (!str.trim()) return null;
        try {
          const parsed = JSON.parse(str);
          if (validationSchema) {
            return validationSchema(parsed);
          }
          return null;
        } catch (e) {
          return e instanceof Error ? e.message : "Invalid JSON";
        }
      },
      [validationSchema]
    );

    // Handle value changes
    const handleChange = useCallback(
      (newValue: string) => {
        setValue(newValue);
        if (validateOnChange) {
          setInternalError(validate(newValue));
        }
      },
      [setValue, validateOnChange, validate]
    );

    // Format on blur
    const handleBlur = useCallback(() => {
      if (!formatOnBlur || !value.trim()) return;
      try {
        const parsed = JSON.parse(value);
        const formatted = JSON.stringify(parsed, null, 2);
        setValue(formatted);
        setInternalError(null);
        if (validationSchema) {
          const schemaErr = validationSchema(parsed);
          setInternalError(schemaErr);
        }
      } catch {
        // If invalid JSON, just leave it — validation error already shown
      }
    }, [formatOnBlur, value, setValue, validationSchema]);

    // Format button
    const handleFormat = useCallback(() => {
      if (!value.trim()) return;
      try {
        const parsed = JSON.parse(value);
        const formatted = JSON.stringify(parsed, null, 2);
        setValue(formatted);
        setInternalError(null);
      } catch {
        // Can't format invalid JSON
      }
    }, [value, setValue]);

    // Copy button
    const handleCopy = useCallback(() => {
      void copy(value);
    }, [copy, value]);

    // Determine which error to show: external takes precedence
    const displayError = externalError || internalError;

    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        {label && (
          <label className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}

        {/* Toolbar */}
        {(showFormatButton || showCopyButton) && (
          <div className="flex items-center gap-1 mb-1">
            {showFormatButton && (
              <button
                type="button"
                onClick={handleFormat}
                disabled={disabled}
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors",
                  "text-slate-600 hover:text-slate-800 hover:bg-slate-100",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                aria-label="Format JSON"
              >
                <Icon name="code" size="sm" />
                <span>Format</span>
              </button>
            )}
            {showCopyButton && (
              <button
                type="button"
                onClick={handleCopy}
                disabled={disabled}
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors",
                  "text-slate-600 hover:text-slate-800 hover:bg-slate-100",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  copied && "text-green-700"
                )}
                aria-label={copied ? "Copied!" : "Copy to clipboard"}
              >
                <Icon name={copied ? "check" : "copy"} size="sm" />
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            )}
          </div>
        )}

        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div onBlur={handleBlur}>
          <CodeInput
            ref={setRefs}
            value={value}
            onChange={handleChange}
            language="json"
            disabled={disabled}
            readOnly={readOnly}
            minLines={minLines}
            maxLines={maxLines}
            placeholder={placeholder}
            error={displayError || undefined}
          />
        </div>
      </div>
    );
  }
);
JsonInput.displayName = "JsonInput";

export { JsonInput };
export type { JsonInputProps };
