import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 font-bold uppercase tracking-wider rounded-full border",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground border-muted",
        primary: "bg-primary/10 text-primary border-primary/20",
        success: "bg-success/10 text-success border-success/20",
        warning: "bg-warning/10 text-warning border-warning/20",
        danger: "bg-destructive/10 text-destructive border-destructive/20",
        info: "bg-primary/10 text-primary border-primary/20",
        accent: "bg-accent/10 text-accent border-accent/20",
        mint: "bg-mint/10 text-mint border-mint/20",
        purple: "bg-purple-50 text-purple-800 border-purple-100 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
        indigo: "bg-primary/10 text-primary border-primary/20",
        live: "bg-primary text-white border-primary shadow-lg shadow-primary/30 animate-pulse motion-reduce:animate-none",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

/** Solid background colors for dot mode (no text, just a colored circle) */
const dotColorMap: Record<string, string> = {
  default: "bg-muted-foreground",
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  info: "bg-primary",
  accent: "bg-accent",
  mint: "bg-mint",
  purple: "bg-purple-500",
  indigo: "bg-primary",
  live: "bg-primary animate-pulse motion-reduce:animate-none",
};

const dotSizeMap: Record<string, string> = {
  sm: "size-2",
  md: "size-2.5",
  lg: "size-3",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants> & {
    /** Render as a small dot indicator with no text */
    dot?: boolean;
    /** Add a white border ring (useful when overlapping other elements) */
    bordered?: boolean;
    /** Position badge as floating indicator over children */
    floating?: boolean;
    /** Content to display (used with floating) */
    content?: ReactNode;
    /** Cap numeric content at this value (shows "N+" when exceeded) */
    max?: number;
  };

function resolveContent(
  children: ReactNode,
  content: ReactNode,
  max?: number
): ReactNode {
  const raw = content ?? children;
  if (max != null && typeof raw === "string") {
    const num = Number(raw);
    if (!Number.isNaN(num) && num > max) return `${max}+`;
  }
  return raw;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      dot,
      bordered,
      floating,
      content,
      max,
      children,
      ...props
    },
    ref
  ) => {
    const resolvedSize = size ?? "md";
    const resolvedVariant = variant ?? "default";

    // Dot mode: small solid circle
    if (dot && !floating) {
      return (
        <span
          ref={ref}
          className={cn(
            "inline-block rounded-full border-0",
            dotColorMap[resolvedVariant],
            dotSizeMap[resolvedSize],
            bordered && "ring-2 ring-surface",
            className
          )}
          {...props}
        />
      );
    }

    // Floating mode: wrap children with an absolutely positioned badge
    if (floating) {
      const badgeContent = dot ? null : resolveContent(null, content, max);
      return (
        <span ref={ref} className={cn("relative inline-flex", className)}>
          {children}
          {dot ? (
            <span
              className={cn(
                "absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 rounded-full border-0",
                dotColorMap[resolvedVariant],
                dotSizeMap[resolvedSize],
                bordered && "ring-2 ring-surface"
              )}
            />
          ) : (
            <span
              className={cn(
                badgeVariants({ variant, size }),
                "absolute top-0 right-0 translate-x-1/3 -translate-y-1/3",
                bordered && "ring-2 ring-surface"
              )}
            >
              {badgeContent}
            </span>
          )}
        </span>
      );
    }

    // Standard badge
    const displayed = resolveContent(children, content, max);
    return (
      <span
        ref={ref}
        className={cn(
          badgeVariants({ variant, size }),
          bordered && "ring-2 ring-surface",
          className
        )}
        {...props}
      >
        {displayed}
      </span>
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
export type { BadgeProps };
