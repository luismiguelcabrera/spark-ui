"use client";

import {
  forwardRef,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type DialogVariant = "default" | "danger";

type DialogProps = {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Dialog title */
  title: string;
  /** Dialog description/body text */
  description?: string;
  /** Custom body content (rendered below description) */
  children?: ReactNode;
  /** Visual variant */
  variant?: DialogVariant;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Called when user confirms */
  onConfirm?: () => void;
  /** Called when user cancels */
  onCancel?: () => void;
  /** Whether to show the cancel button (false for alert-style dialogs) */
  showCancel?: boolean;
  /** Whether confirm action is loading */
  loading?: boolean;
  /** Whether clicking the backdrop closes the dialog */
  closeOnBackdrop?: boolean;
  /** Additional class names for the dialog panel */
  className?: string;
};

/* -------------------------------------------------------------------------- */
/*  Variant styles                                                             */
/* -------------------------------------------------------------------------- */

const confirmStyles: Record<DialogVariant, string> = {
  default:
    "bg-primary hover:bg-primary/90 text-white focus-visible:ring-primary",
  danger:
    "bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-600",
};

/* -------------------------------------------------------------------------- */
/*  Dialog component                                                           */
/* -------------------------------------------------------------------------- */

const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      open,
      onOpenChange,
      title,
      description,
      children,
      variant = "default",
      confirmText = "Confirm",
      cancelText = "Cancel",
      onConfirm,
      onCancel,
      showCancel = true,
      loading = false,
      closeOnBackdrop = true,
      className,
    },
    ref,
  ) => {
    const confirmRef = useRef<HTMLButtonElement>(null);

    // Focus the confirm button when dialog opens
    useEffect(() => {
      if (open) {
        // Delay to allow DOM to render
        const raf = requestAnimationFrame(() => {
          confirmRef.current?.focus();
        });
        return () => cancelAnimationFrame(raf);
      }
    }, [open]);

    // Escape key
    useEffect(() => {
      if (!open) return;
      const handler = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onCancel?.();
          onOpenChange(false);
        }
      };
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }, [open, onCancel, onOpenChange]);

    if (!open) return null;

    const handleBackdropClick = () => {
      if (closeOnBackdrop) {
        onCancel?.();
        onOpenChange(false);
      }
    };

    const handleCancel = () => {
      onCancel?.();
      onOpenChange(false);
    };

    const handleConfirm = () => {
      onConfirm?.();
    };

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby={description ? "dialog-description" : undefined}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />

        {/* Panel */}
        <div
          ref={ref}
          className={cn(
            "relative bg-white rounded-2xl shadow-float max-w-sm w-full mx-4 p-6",
            className,
          )}
        >
          {/* Close button */}
          <button
            type="button"
            aria-label="Close dialog"
            onClick={handleCancel}
            className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100 transition-colors text-slate-400"
          >
            <Icon name="close" size="sm" />
          </button>

          {/* Title */}
          <h2
            id="dialog-title"
            className="text-lg font-bold text-slate-900 pr-8"
          >
            {title}
          </h2>

          {/* Description */}
          {description && (
            <p
              id="dialog-description"
              className="text-sm text-slate-500 mt-2"
            >
              {description}
            </p>
          )}

          {/* Custom content */}
          {children && <div className="mt-4">{children}</div>}

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            {showCancel && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="h-9 px-4 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-slate-400"
              >
                {cancelText}
              </button>
            )}
            <button
              ref={confirmRef}
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className={cn(
                "h-9 px-4 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-offset-1",
                confirmStyles[variant],
              )}
            >
              {loading ? "Loading..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    );
  },
);
Dialog.displayName = "Dialog";

/* -------------------------------------------------------------------------- */
/*  useDialog — imperative/promise-based API                                   */
/* -------------------------------------------------------------------------- */

type UseDialogOptions = Omit<
  DialogProps,
  "open" | "onOpenChange" | "onConfirm" | "onCancel"
>;

type UseDialogReturn = {
  /** Open the dialog and return a promise that resolves to true (confirm) or false (cancel) */
  confirm: (options?: Partial<UseDialogOptions>) => Promise<boolean>;
  /** The Dialog element to render in your JSX */
  DialogElement: ReactNode;
};

function useDialog(defaults?: Partial<UseDialogOptions>): UseDialogReturn {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Partial<UseDialogOptions>>({});
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback(
    (opts?: Partial<UseDialogOptions>): Promise<boolean> => {
      setOptions({ ...defaults, ...opts });
      setOpen(true);
      return new Promise<boolean>((resolve) => {
        resolverRef.current = resolve;
      });
    },
    [defaults],
  );

  const handleConfirm = useCallback(() => {
    resolverRef.current?.(true);
    resolverRef.current = null;
    setOpen(false);
  }, []);

  const handleCancel = useCallback(() => {
    resolverRef.current?.(false);
    resolverRef.current = null;
    setOpen(false);
  }, []);

  const merged: UseDialogOptions = {
    title: "Confirm",
    ...defaults,
    ...options,
  };

  const DialogElement = (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) handleCancel();
      }}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      {...merged}
    />
  );

  return { confirm, DialogElement };
}

/* -------------------------------------------------------------------------- */
/*  Exports                                                                    */
/* -------------------------------------------------------------------------- */

export { Dialog, useDialog };
export type { DialogProps, DialogVariant, UseDialogOptions, UseDialogReturn };
