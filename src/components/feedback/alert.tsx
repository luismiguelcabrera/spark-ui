"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";

type AlertColor = "info" | "success" | "warning" | "error";
type AlertFillVariant = "flat" | "tonal" | "outlined";
type AlertBorderSide = "top" | "bottom" | "start" | "end";

/** Color styles per fill variant */
const colorStyles: Record<AlertColor, Record<AlertFillVariant, string>> = {
  info: {
    flat: "bg-blue-50 border-blue-200 text-blue-800",
    tonal: "bg-blue-100 border-blue-300 text-blue-900",
    outlined: "bg-transparent border-blue-400 text-blue-700",
  },
  success: {
    flat: "bg-green-50 border-green-200 text-green-800",
    tonal: "bg-green-100 border-green-300 text-green-900",
    outlined: "bg-transparent border-green-400 text-green-700",
  },
  warning: {
    flat: "bg-amber-50 border-amber-200 text-amber-800",
    tonal: "bg-amber-100 border-amber-300 text-amber-900",
    outlined: "bg-transparent border-amber-400 text-amber-800",
  },
  error: {
    flat: "bg-red-50 border-red-200 text-red-800",
    tonal: "bg-red-100 border-red-300 text-red-900",
    outlined: "bg-transparent border-red-400 text-red-700",
  },
};

/** Thick colored border per color */
const borderColorMap: Record<AlertColor, string> = {
  info: "border-blue-500",
  success: "border-green-500",
  warning: "border-amber-500",
  error: "border-red-500",
};

/** Border side → CSS classes (thick on one side, normal on others) */
const borderSideMap: Record<AlertBorderSide, string> = {
  top: "border-t-4",
  bottom: "border-b-4",
  start: "border-l-4",
  end: "border-r-4",
};

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
  /** Visual variant (color) — "info" | "success" | "warning" | "error" */
  variant?: AlertVariant;
  /** Fill style — "flat" (default) | "tonal" | "outlined" */
  fill?: AlertFillVariant;
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
  /** Show a thick colored border on one side */
  border?: AlertBorderSide;
  /** Larger icon and bolder styling */
  prominent?: boolean;
  /** Additional CSS classes */
  className?: string;
} & VariantProps<typeof alertVariants>;

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = "info",
      fill = "flat",
      title,
      children,
      icon,
      dismissible = false,
      onDismiss,
      border,
      prominent = false,
      className,
      ...props
    },
    ref
  ) => {
    const displayIcon = icon ?? alertIconMap[variant ?? "info"];
    const color = (variant ?? "info") as AlertColor;

    // Compute fill-based color classes
    const fillClasses = colorStyles[color][fill];

    // Border side classes
    const borderClasses = border
      ? cn(borderSideMap[border], borderColorMap[color])
      : "";

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "flex items-start gap-3 rounded-xl border",
          prominent ? "p-5" : "p-4",
          fillClasses,
          borderClasses,
          className
        )}
        {...props}
      >
        {displayIcon && (
          <Icon
            name={displayIcon}
            size={prominent ? "lg" : "md"}
            className={cn("shrink-0", prominent ? "mt-0" : "mt-0.5")}
          />
        )}
        <div className="flex-1 min-w-0">
          {title && (
            <p className={cn("font-semibold", prominent ? "text-base" : "text-sm")}>{title}</p>
          )}
          {children && (
            <div className={cn(prominent ? "text-sm" : "text-sm", title && "mt-1 opacity-80")}>
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
export type { AlertProps, AlertVariant, AlertFillVariant, AlertBorderSide };
