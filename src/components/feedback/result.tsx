"use client";

import { forwardRef, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";

type ResultStatus = "success" | "error" | "warning" | "info" | "403" | "404" | "500";

type ResultProps = {
  /** Status type determines icon and color scheme */
  status: ResultStatus;
  /** Main title text */
  title: string;
  /** Optional subtitle below the title */
  subtitle?: string;
  /** Custom icon override (replaces default status icon) */
  icon?: ReactNode;
  /** Action buttons or links */
  extra?: ReactNode;
  /** Additional content below the title area */
  children?: ReactNode;
  className?: string;
};

const statusConfig: Record<
  ResultStatus,
  { icon: string; colorClass: string; bgClass: string }
> = {
  success: {
    icon: "check_circle",
    colorClass: "text-success",
    bgClass: "bg-success/10",
  },
  error: {
    icon: "x-circle",
    colorClass: "text-destructive",
    bgClass: "bg-destructive/10",
  },
  warning: {
    icon: "warning",
    colorClass: "text-warning",
    bgClass: "bg-warning/10",
  },
  info: {
    icon: "info",
    colorClass: "text-primary",
    bgClass: "bg-primary/10",
  },
  "403": {
    icon: "lock",
    colorClass: "text-destructive",
    bgClass: "bg-destructive/10",
  },
  "404": {
    icon: "search",
    colorClass: "text-muted-foreground",
    bgClass: "bg-muted/50",
  },
  "500": {
    icon: "server",
    colorClass: "text-destructive",
    bgClass: "bg-destructive/10",
  },
};

const Result = forwardRef<HTMLDivElement, ResultProps>(
  ({ status, title, subtitle, icon, extra, children, className }, ref) => {
    const config = statusConfig[status];

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center text-center px-6 py-12",
          className
        )}
        role="status"
      >
        {/* Icon */}
        <div
          className={cn(
            "flex items-center justify-center w-16 h-16 rounded-full mb-6",
            config.bgClass
          )}
        >
          {icon ? (
            <span className={cn("text-3xl", config.colorClass)}>{icon}</span>
          ) : (
            <Icon name={config.icon} size="xl" className={config.colorClass} />
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-navy-text mb-2">{title}</h2>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-sm text-muted-foreground max-w-md mb-6">{subtitle}</p>
        )}

        {/* Extra (action buttons) */}
        {extra && (
          <div className="flex items-center justify-center gap-3 mt-4">
            {extra}
          </div>
        )}

        {/* Children (additional content) */}
        {children && <div className="mt-6 w-full max-w-md">{children}</div>}
      </div>
    );
  }
);

Result.displayName = "Result";

export { Result };
export type { ResultProps, ResultStatus };
