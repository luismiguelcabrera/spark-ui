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
import { Spinner } from "./spinner";
import { Overlay } from "./overlay";
import { useIsomorphicId } from "../../hooks/use-isomorphic-id";
import { useFocusTrap } from "../../hooks/use-focus-trap";
import { useLocale } from "../../lib/locale";

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
  /** Custom loading text (defaults to confirm text with spinner) */
  loadingText?: string;
  /** Whether clicking the backdrop closes the dialog */
  closeOnBackdrop?: boolean;
  /** Whether pressing Escape closes the dialog */
  closeOnEscape?: boolean;
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
    "bg-destructive hover:bg-destructive/90 text-white focus-visible:ring-destructive",
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
      confirmText,
      cancelText,
      onConfirm,
      onCancel,
      showCancel = true,
      loading = false,
      loadingText,
      closeOnBackdrop = true,
      closeOnEscape = true,
      className,
    },
    ref,
  ) => {
    const { t } = useLocale();

    const resolvedConfirmText = confirmText ?? t("dialog.confirm", "Confirm");
    const resolvedCancelText = cancelText ?? t("dialog.cancel", "Cancel");

    const titleId = useIsomorphicId("dialog-title");
    const descId = useIsomorphicId("dialog-desc");
    const panelRef = useRef<HTMLDivElement>(null);
    const cancelRef = useRef<HTMLButtonElement>(null);
    const confirmRef = useRef<HTMLButtonElement>(null);

    // Trap focus within the dialog panel
    useFocusTrap(panelRef, open);

    // Focus the appropriate button when dialog opens:
    // - danger variant → focus cancel button (prevent accidental destructive action)
    // - default variant → focus confirm button
    useEffect(() => {
      if (open) {
        const raf = requestAnimationFrame(() => {
          if (variant === "danger" && showCancel) {
            cancelRef.current?.focus();
          } else {
            confirmRef.current?.focus();
          }
        });
        return () => cancelAnimationFrame(raf);
      }
    }, [open, variant, showCancel]);

    const handleDismiss = useCallback(
      (nextOpen: boolean) => {
        if (!nextOpen) {
          onCancel?.();
          onOpenChange(false);
        }
      },
      [onCancel, onOpenChange],
    );

    const handleCancel = () => {
      onCancel?.();
      onOpenChange(false);
    };

    const handleConfirm = () => {
      onConfirm?.();
    };

    // Merge forwarded ref with internal panel ref
    const setRefs = (el: HTMLDivElement | null) => {
      (panelRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
    };

    return (
      <Overlay
        open={open}
        onOpenChange={handleDismiss}
        blur
        closeOnClick={closeOnBackdrop}
        closeOnEscape={closeOnEscape}
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
      >
        <div className="flex items-center justify-center h-full w-full">
          {/* Panel */}
          <div
            ref={setRefs}
            className={cn(
              "relative bg-surface rounded-2xl shadow-float max-w-sm w-full mx-4 p-6",
              className,
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              aria-label={t("dialog.close", "Close dialog")}
              onClick={handleCancel}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
            >
              <Icon name="close" size="sm" />
            </button>

            {/* Title */}
            <h2
              id={titleId}
              className="text-lg font-bold text-slate-900 pr-8"
            >
              {title}
            </h2>

            {/* Description */}
            {description && (
              <p
                id={descId}
                className="text-sm text-slate-600 mt-2"
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
                  ref={cancelRef}
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="h-9 px-4 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-slate-400"
                >
                  {resolvedCancelText}
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
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner size="sm" color="white" />
                    {loadingText ?? resolvedConfirmText}
                  </span>
                ) : (
                  resolvedConfirmText
                )}
              </button>
            </div>
          </div>
        </div>
      </Overlay>
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
