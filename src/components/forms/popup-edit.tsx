"use client";

import { forwardRef, useState, useRef, useEffect, useCallback, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { useClickOutside } from "../../hooks/use-click-outside";
import { useLocale } from "../../lib/locale";

type PopupEditMode = "input" | "textarea";

type PopupEditProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Current display value */
  value: string;
  /** Called when user saves the edit */
  onSave: (value: string) => void;
  /** Called when user cancels the edit */
  onCancel?: () => void;
  /** Edit input type */
  mode?: PopupEditMode;
  /** Placeholder for the input */
  placeholder?: string;
  /** Additional class names */
  className?: string;
  /** The display content (clicked to open edit popover) */
  children: React.ReactNode;
  /** Whether editing is disabled */
  disabled?: boolean;
};

const PopupEdit = forwardRef<HTMLDivElement, PopupEditProps>(
  (
    {
      value,
      onSave,
      onCancel,
      mode = "input",
      placeholder,
      className,
      children,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const { t } = useLocale();
    const [editing, setEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);
    const popoverRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    // Sync edit value when value prop changes while not editing
    useEffect(() => {
      if (!editing) {
        setEditValue(value); // eslint-disable-line react-hooks/set-state-in-effect -- intentional: sync edit value with prop when not actively editing
      }
    }, [value, editing]);

    // Focus the input when editing starts
    useEffect(() => {
      if (editing && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, [editing]);

    const handleOpen = () => {
      if (disabled) return;
      setEditValue(value);
      setEditing(true);
    };

    const handleSave = useCallback(() => {
      onSave(editValue);
      setEditing(false);
    }, [editValue, onSave]);

    const handleCancel = useCallback(() => {
      setEditValue(value);
      setEditing(false);
      onCancel?.();
    }, [value, onCancel]);

    useClickOutside(popoverRef, handleCancel, editing);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      }
      if (e.key === "Enter" && mode === "input") {
        e.preventDefault();
        handleSave();
      }
    };

    const inputClassName = cn(
      "w-full px-3 py-2 text-sm border border-muted rounded-lg bg-surface",
      "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
      "placeholder:text-muted-foreground transition-colors"
    );

    return (
      <div
        ref={ref}
        className={cn("relative inline-block", className)}
        {...props}
      >
        {/* Display content — clicked to open */}
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled || undefined}
          aria-label={t("popupedit.clickToEdit", "Click to edit")}
          onClick={handleOpen}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !disabled) {
              e.preventDefault();
              handleOpen();
            }
          }}
          className={cn(
            "cursor-pointer rounded-md transition-colors",
            !disabled && "hover:bg-muted/50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {children}
        </div>

        {/* Edit popover */}
        {editing && (
          <div
            ref={popoverRef}
            role="dialog"
            aria-label={t("popupedit.editValue", "Edit value")}
            className={cn(
              "absolute z-50 top-full left-0 mt-1 p-3 bg-surface border border-muted rounded-xl shadow-lg",
              "min-w-[240px]"
            )}
          >
            {mode === "input" ? (
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={inputClassName}
              />
            ) : (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={3}
                className={cn(inputClassName, "resize-y")}
              />
            )}
            <div className="flex items-center justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={handleCancel}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-lg border border-muted text-muted-foreground",
                  "hover:bg-muted/50 transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary"
                )}
              >
                {t("common.cancel", "Cancel")}
              </button>
              <button
                type="button"
                onClick={handleSave}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-white",
                  "hover:bg-primary/90 transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary"
                )}
              >
                {t("common.save", "Save")}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);
PopupEdit.displayName = "PopupEdit";

export { PopupEdit };
export type { PopupEditProps, PopupEditMode };
