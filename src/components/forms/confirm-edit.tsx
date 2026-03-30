"use client";

import { forwardRef, useState, useRef, useCallback, useEffect, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

type ConfirmEditProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  /** Current value */
  value: string;
  /** Callback when value is confirmed */
  onChange?: (value: string) => void;
  /** How to render the display (view) mode */
  renderDisplay?: (value: string) => ReactNode;
  /** How to render the input (edit) mode — receives value, onChange, and a ref to focus */
  renderInput?: (props: {
    value: string;
    onChange: (value: string) => void;
    ref: React.Ref<HTMLInputElement>;
  }) => ReactNode;
  /** Text for the confirm button */
  confirmText?: string;
  /** Text for the cancel button */
  cancelText?: string;
  /** Whether editing is disabled */
  disabled?: boolean;
};

const ConfirmEdit = forwardRef<HTMLDivElement, ConfirmEditProps>(
  (
    {
      className,
      value,
      onChange,
      renderDisplay,
      renderInput,
      confirmText = "Save",
      cancelText = "Cancel",
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);

    // Sync draft when external value changes while not editing
    useEffect(() => {
      if (!editing) {
        setDraft(value);
      }
    }, [value, editing]);

    const startEditing = useCallback(() => {
      if (disabled) return;
      setDraft(value);
      setEditing(true);
    }, [disabled, value]);

    const confirmEdit = useCallback(() => {
      onChange?.(draft);
      setEditing(false);
    }, [draft, onChange]);

    const cancelEdit = useCallback(() => {
      setDraft(value);
      setEditing(false);
    }, [value]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
          e.preventDefault();
          confirmEdit();
        } else if (e.key === "Escape") {
          e.preventDefault();
          cancelEdit();
        }
      },
      [confirmEdit, cancelEdit]
    );

    // Focus input when entering edit mode
    useEffect(() => {
      if (editing) {
        // Use a microtask to wait for the render
        const timer = setTimeout(() => inputRef.current?.focus(), 0);
        return () => clearTimeout(timer);
      }
    }, [editing]);

    if (!editing) {
      return (
        <div
          ref={ref}
          className={cn(
            "inline-flex items-center gap-2 group",
            !disabled && "cursor-pointer",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          onClick={startEditing}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              startEditing();
            }
          }}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label={`Edit value: ${value}`}
          {...props}
        >
          {renderDisplay ? (
            renderDisplay(value)
          ) : (
            <span className="text-sm text-slate-700">{value}</span>
          )}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center gap-2", className)}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {renderInput ? (
          renderInput({
            value: draft,
            onChange: setDraft,
            ref: inputRef,
          })
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            aria-label="Edit value"
            className={cn(
              "px-3 h-9 bg-slate-50 border border-slate-200 rounded-xl text-sm",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
              "placeholder:text-slate-400 transition-colors"
            )}
          />
        )}
        <button
          type="button"
          onClick={confirmEdit}
          className={cn(
            "inline-flex items-center justify-center h-9 px-3 text-sm font-medium rounded-xl",
            "bg-primary text-white hover:bg-primary-dark transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
          )}
        >
          {confirmText}
        </button>
        <button
          type="button"
          onClick={cancelEdit}
          className={cn(
            "inline-flex items-center justify-center h-9 px-3 text-sm font-medium rounded-xl",
            "border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
          )}
        >
          {cancelText}
        </button>
      </div>
    );
  }
);
ConfirmEdit.displayName = "ConfirmEdit";

export { ConfirmEdit };
export type { ConfirmEditProps };
