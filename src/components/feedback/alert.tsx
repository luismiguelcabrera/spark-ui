"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";

const alertVariants = cva(
  "flex items-start gap-3 rounded-xl p-4 border",
  {
    variants: {
      variant: {
        info: "bg-blue-50 border-blue-200 text-blue-800",
        success: "bg-green-50 border-green-200 text-green-800",
        warning: "bg-amber-50 border-amber-200 text-amber-800",
        error: "bg-red-50 border-red-200 text-red-800",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

const alertIconMap: Record<string, string> = {
  info: "info",
  success: "check-circle",
  warning: "alert-triangle",
  error: "alert-circle",
};

type AlertVariant = "info" | "success" | "warning" | "error";

type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  /** Visual variant */
  variant?: AlertVariant;
  /** Optional title */
  title?: string;
  /** Description content */
  children?: ReactNode;
  /** Icon name override (defaults based on variant) */
  icon?: string;
  /** Show dismiss close button */
  dismissible?: boolean;
  /** Callback when dismiss button is clicked */
  onDismiss?: () => void;
  /** Additional CSS classes */
  className?: string;
} & VariantProps<typeof alertVariants>;

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = "info",
      title,
      children,
      icon,
      dismissible = false,
      onDismiss,
      className,
      ...props
    },
    ref
  ) => {
    const displayIcon = icon ?? alertIconMap[variant ?? "info"];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {displayIcon && (
          <Icon
            name={displayIcon}
            size="md"
            className="shrink-0 mt-0.5"
          />
        )}
        <div className="flex-1 min-w-0">
          {title && (
            <p className="font-semibold text-sm">{title}</p>
          )}
          {children && (
            <div className={cn("text-sm", title && "mt-1 opacity-80")}>
              {children}
            </div>
          )}
        </div>
        {dismissible && (
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 p-0.5 rounded-md hover:bg-black/10 transition-colors"
            aria-label="Dismiss"
          >
            <Icon name="close" size="sm" />
          </button>
        )}
      </div>
    );
  }
);
Alert.displayName = "Alert";

export { Alert, alertVariants };
export type { AlertProps, AlertVariant };
