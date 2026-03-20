"use client";

import {
  forwardRef,
  useState,
  useRef,
  useCallback,
  useEffect,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";

type InlineEditProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  /** Current value (controlled) */
  value: string;
  /** Called when user confirms the edit */
  onSave: (value: string) => void;
  /** Called when user cancels the edit */
  onCancel?: () => void;
  /** Render an input or textarea */
  mode?: "input" | "textarea";
  /** Placeholder shown when value is empty */
  placeholder?: string;
  /** Whether editing is disabled */
  disabled?: boolean;
  /** Start in edit mode on mount */
  startWithEditView?: boolean;
  /** Save on blur (default true) */
  submitOnBlur?: boolean;
  /** Select all text when entering edit mode (default true) */
  selectAllOnFocus?: boolean;
  /** Custom display renderer */
  renderDisplay?: (value: string) => ReactNode;
};

const InlineEdit = forwardRef<HTMLDivElement, InlineEditProps>(
  (
    {
      className,
      value,
      onSave,
      onCancel,
      mode = "input",
      placeholder = "Click to edit",
      disabled = false,
      startWithEditView = false,
      submitOnBlur = true,
      selectAllOnFocus = true,
      renderDisplay,
      ...props
    },
    ref
  ) => {
    const [editing, setEditing] = useState(startWithEditView);
    const [draft, setDraft] = useState(value);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    // Sync draft when value prop changes while not editing
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

    const save = useCallback(() => {
      onSave(draft);
      setEditing(false);
    }, [draft, onSave]);

    const cancel = useCallback(() => {
      setDraft(value);
      setEditing(false);
      onCancel?.();
    }, [value, onCancel]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (mode === "input" && e.key === "Enter") {
          e.preventDefault();
          save();
        } else if (mode === "textarea" && e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          save();
        } else if (e.key === "Escape") {
          e.preventDefault();
          cancel();
        }
      },
      [mode, save, cancel]
    );

    const handleBlur = useCallback(() => {
      if (submitOnBlur) {
        save();
      } else {
        cancel();
      }
    }, [submitOnBlur, save, cancel]);

    // Focus (and optionally select) input when entering edit mode
    useEffect(() => {
      if (editing) {
        const timer = setTimeout(() => {
          const el = inputRef.current;
          if (el) {
            el.focus();
            if (selectAllOnFocus && el instanceof HTMLInputElement) {
              el.select();
            } else if (selectAllOnFocus && el instanceof HTMLTextAreaElement) {
              el.select();
            }
          }
        }, 0);
        return () => clearTimeout(timer);
      }
    }, [editing, selectAllOnFocus]);

    // Display mode
    if (!editing) {
      return (
        <div
          ref={ref}
          className={cn(
            "inline-flex items-center gap-2 group rounded-lg px-2 py-1 -mx-2 -my-1 transition-colors",
            !disabled && "cursor-pointer hover:bg-muted",
            disabled && "cursor-not-allowed opacity-50",
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
          aria-label={`Edit: ${value || placeholder}`}
          {...props}
        >
          {renderDisplay ? (
            renderDisplay(value)
          ) : (
            <span className={cn("text-sm", value ? "text-navy-text" : "text-muted-foreground")}>
              {value || placeholder}
            </span>
          )}
          <Icon
            name="pencil"
            size="sm"
            className="opacity-0 group-hover:opacity-100 text-muted-foreground transition-opacity"
            aria-hidden="true"
          />
        </div>
      );
    }

    // Edit mode
    const inputClasses = cn(
      "bg-transparent outline-none text-sm text-navy-text w-full",
      "border-b-2 border-primary focus:ring-0"
    );

    if (mode === "textarea") {
      return (
        <div ref={ref} className={cn("w-full", className)} {...props}>
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={cn(inputClasses, "resize-y min-h-[60px]")}
            aria-label="Edit value"
          />
        </div>
      );
    }

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={inputClasses}
          aria-label="Edit value"
        />
      </div>
    );
  }
);
InlineEdit.displayName = "InlineEdit";

export { InlineEdit };
export type { InlineEditProps };
