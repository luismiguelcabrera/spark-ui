import { type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const alertBannerVariants = cva(
  "flex items-start gap-3 rounded-xl p-4 border",
  {
    variants: {
      variant: {
        warning:
          "bg-amber-50 border-amber-200 text-amber-800",
        info: "bg-blue-50 border-blue-200 text-blue-800",
        success:
          "bg-green-50 border-green-200 text-green-800",
        danger: "bg-red-50 border-red-200 text-red-800",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

const alertIconMap = {
  warning: "warning",
  info: "info",
  success: "check_circle",
  danger: "error",
} as const;

type AlertBannerProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
} & VariantProps<typeof alertBannerVariants>;

function AlertBanner({
  title,
  description,
  actions,
  variant = "info",
  className,
}: AlertBannerProps) {
  return (
    <div
      className={cn(alertBannerVariants({ variant, className }))}
      role="alert"
    >
      <span className="material-symbols-outlined text-[20px] mt-0.5 shrink-0">
        {alertIconMap[variant ?? "info"]}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{title}</p>
        {description && (
          <p className="text-sm mt-1 opacity-80">{description}</p>
        )}
      </div>
      {actions && <div className="shrink-0 flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export { AlertBanner, alertBannerVariants };
export type { AlertBannerProps };
