import { forwardRef, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";

const toastVariants = cva(s.toastBase, {
  variants: {
    variant: {
      success: "bg-success/10 border-success/20 text-success",
      error: "bg-destructive/10 border-destructive/20 text-destructive",
      warning: "bg-warning/10 border-warning/20 text-warning",
      info: "bg-primary/10 border-primary/20 text-primary",
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
