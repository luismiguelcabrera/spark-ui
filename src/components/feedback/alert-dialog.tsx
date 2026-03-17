"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";

type AlertDialogProps = HTMLAttributes<HTMLDivElement> & {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Dialog title */
  title: string;
  /** Dialog description */
  description?: string;
  /** Icon name to display */
  icon?: string;
  /** Type/severity */
  type?: "info" | "warning" | "danger" | "success";
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Callback when confirmed */
  onConfirm?: () => void;
  /** Callback when cancelled */
  onCancel?: () => void;
  /** Whether confirm action is loading */
  loading?: boolean;
  /** Custom footer content */
  footer?: ReactNode;
};

const typeStyles: Record<string, { icon: string; iconBg: string; iconColor: string; confirmBg: string }> = {
  info: {
    icon: "info",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    confirmBg: "bg-primary hover:bg-primary-dark text-white",
  },
  warning: {
    icon: "alert-triangle",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    confirmBg: "bg-amber-500 hover:bg-amber-600 text-amber-950",
  },
  danger: {
    icon: "alert-circle",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    confirmBg: "bg-red-600 hover:bg-red-700 text-white",
  },
  success: {
    icon: "check-circle",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    confirmBg: "bg-green-600 hover:bg-green-700 text-white",
  },
};

const AlertDialog = forwardRef<HTMLDivElement, AlertDialogProps>(
  (
    {
      className,
      open,
      onOpenChange,
      title,
      description,
      icon,
      type = "info",
      confirmText = "Confirm",
      cancelText = "Cancel",
      onConfirm,
      onCancel,
      loading = false,
      footer,
      children,
      ...props
    },
    ref
  ) => {
    if (!open) return null;

    const styles = typeStyles[type];

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
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="alert-dialog-title"
        aria-describedby={description ? "alert-dialog-description" : undefined}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={handleCancel}
        />
        {/* Content */}
        <div
          ref={ref}
          className={cn(
            "relative bg-white rounded-2xl shadow-float max-w-md w-full mx-4 p-6",
            "animate-in fade-in zoom-in-95",
            className
          )}
          {...props}
        >
          <div className="flex flex-col items-center text-center">
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-4", styles.iconBg)}>
              <Icon name={icon ?? styles.icon} size="lg" className={styles.iconColor} />
            </div>
            <h2 id="alert-dialog-title" className="text-lg font-bold text-secondary mb-2">
              {title}
            </h2>
            {description && (
              <p id="alert-dialog-description" className="text-sm text-slate-500 mb-6">
                {description}
              </p>
            )}
            {children && <div className="mb-6 w-full">{children}</div>}
          </div>
          {footer ?? (
            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 h-10 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className={cn(
                  "flex-1 h-10 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50",
                  styles.confirmBg
                )}
              >
                {loading ? "Loading..." : confirmText}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);
AlertDialog.displayName = "AlertDialog";

export { AlertDialog };
export type { AlertDialogProps };
