import { forwardRef, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";

const toastVariants = cva(s.toastBase, {
  variants: {
    variant: {
      success: "bg-green-50 border-green-200 text-green-800",
      error: "bg-red-50 border-red-200 text-red-800",
      warning: "bg-amber-50 border-amber-200 text-amber-900",
      info: "bg-blue-50 border-blue-200 text-blue-800",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

const toastIconMap = {
  success: "check_circle",
  error: "error",
  warning: "warning",
  info: "info",
} as const;

type ToastProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
} & VariantProps<typeof toastVariants>;

const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ title, description, actions, variant = "info", className }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        aria-live="polite"
        className={cn(toastVariants({ variant }), className)}
      >
        <Icon
          name={toastIconMap[variant ?? "info"]}
          size="md"
          className="mt-0.5 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">{title}</p>
          {description && (
            <p className="text-sm mt-1">{description}</p>
          )}
        </div>
        {actions && (
          <div className="shrink-0 flex items-center gap-2">{actions}</div>
        )}
      </div>
    );
  },
);

Toast.displayName = "Toast";

export { Toast, toastVariants };
export type { ToastProps };
