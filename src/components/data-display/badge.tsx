import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 font-bold uppercase tracking-wider rounded-full border",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-700 border-gray-200",
        primary: "bg-primary/10 text-primary border-primary/20",
        success: "bg-green-50 text-green-700 border-green-100",
        warning: "bg-amber-50 text-amber-700 border-amber-100",
        danger: "bg-red-50 text-red-700 border-red-100",
        info: "bg-blue-50 text-blue-700 border-blue-100",
        accent: "bg-accent/10 text-accent border-accent/20",
        mint: "bg-mint/10 text-mint border-mint/20",
        purple: "bg-purple-50 text-purple-700 border-purple-100",
        indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
        live: "bg-primary text-white border-primary shadow-lg shadow-primary/30 animate-pulse",
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

/** Dot-only size classes (no text padding, just a circle) */
const dotSizeMap = {
  sm: "w-2 h-2",
  md: "w-2.5 h-2.5",
  lg: "w-3 h-3",
} as const;

/** Variant to dot background color */
const dotColorMap: Record<string, string> = {
  default: "bg-gray-500",
  primary: "bg-primary",
  success: "bg-green-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-blue-500",
  accent: "bg-accent",
  mint: "bg-mint",
  purple: "bg-purple-500",
  indigo: "bg-indigo-500",
  live: "bg-primary",
};

type BadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, "content"> &
  VariantProps<typeof badgeVariants> & {
    /** Render as a small colored dot with no content */
    dot?: boolean;
    /** When badge content is a number greater than max, display "max+" */
    max?: number;
    /** Position badge absolutely over its children (top-right corner).
     *  When floating, use `content` for the badge text and `children` for the wrapped element. */
    floating?: boolean;
    /** Badge content when in floating mode */
    content?: ReactNode;
    /** Add a white ring border around the badge */
    bordered?: boolean;
    /** Children: badge text in normal mode, or wrapped element in floating mode */
    children?: ReactNode;
  };

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      dot,
      max,
      floating,
      bordered,
      content,
      children,
      ...props
    },
    ref,
  ) => {
    // In floating mode, content is badge text; children is the wrapped element.
    // In normal mode, children is badge text.
    const rawBadgeText = floating ? content : children;

    // Resolve displayed content (apply max logic)
    let displayContent: ReactNode = rawBadgeText;
    if (max != null && typeof rawBadgeText === "number") {
      displayContent = rawBadgeText > max ? `${max}+` : rawBadgeText;
    } else if (max != null && typeof rawBadgeText === "string") {
      const num = Number(rawBadgeText);
      if (!isNaN(num) && num > max) {
        displayContent = `${max}+`;
      }
    }

    // Dot mode: renders a small colored dot
    if (dot && !floating) {
      return (
        <span
          ref={ref}
          className={cn(
            "inline-block rounded-full border-0",
            dotSizeMap[size ?? "md"],
            dotColorMap[variant ?? "default"] ?? "bg-gray-500",
            bordered && "ring-2 ring-white",
            className,
          )}
          data-testid="badge-dot"
          {...props}
        />
      );
    }

    // Floating mode: badge positioned over children
    if (floating) {
      const indicator = dot ? (
        <span
          className={cn(
            "inline-block rounded-full border-0",
            dotSizeMap[size ?? "md"],
            dotColorMap[variant ?? "default"] ?? "bg-gray-500",
            bordered && "ring-2 ring-white",
          )}
          data-testid="badge-dot"
        />
      ) : (
        <span
          className={cn(
            badgeVariants({ variant, size }),
            bordered && "ring-2 ring-white",
          )}
        >
          {displayContent}
        </span>
      );

      return (
        <span
          ref={ref}
          className={cn("relative inline-flex", className)}
          {...props}
        >
          {children}
          <span className="absolute -top-1 -right-1 z-10">{indicator}</span>
        </span>
      );
    }

    // Normal (inline) badge
    return (
      <span
        ref={ref}
        className={cn(
          badgeVariants({ variant, size }),
          bordered && "ring-2 ring-white",
          className,
        )}
        {...props}
      >
        {displayContent}
      </span>
    );
  },
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
export type { BadgeProps };
