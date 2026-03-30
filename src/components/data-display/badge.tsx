import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BadgeColor =
  | "default"
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info";

type BadgeVariant =
  | "elevated"
  | "flat"
  | "tonal"
  | "outlined"
  | "text"
  | "plain";

type BadgeSize = "xs" | "sm" | "md" | "lg" | "xl";

// ---------------------------------------------------------------------------
// Color × Variant matrix (WCAG AA compliant in both light & dark)
// ---------------------------------------------------------------------------

const colorMap: Record<BadgeColor, Record<BadgeVariant, string>> = {
  default: {
    elevated: "bg-muted text-muted-foreground shadow-md",
    flat: "bg-muted text-muted-foreground",
    tonal: "bg-muted/50 text-muted-foreground",
    outlined: "border border-muted-foreground/30 text-muted-foreground",
    text: "text-muted-foreground",
    plain: "text-muted-foreground hover:text-navy-text",
  },
  primary: {
    elevated: "bg-primary-dark text-white shadow-md shadow-primary/25",
    flat: "bg-primary-dark text-white",
    tonal: "bg-primary/15 text-primary-text",
    outlined: "border border-primary text-primary-text",
    text: "text-primary-text",
    plain: "text-muted-foreground hover:text-primary-text",
  },
  secondary: {
    elevated:
      "bg-secondary text-on-secondary shadow-md shadow-secondary/10",
    flat: "bg-secondary text-on-secondary",
    tonal: "bg-secondary/10 text-navy-text",
    outlined: "border border-secondary/40 text-navy-text",
    text: "text-navy-text",
    plain: "text-muted-foreground hover:text-navy-text",
  },
  accent: {
    elevated: "bg-accent text-on-bright shadow-md shadow-accent/25",
    flat: "bg-accent text-on-bright",
    tonal: "bg-accent/15 text-accent-text",
    outlined: "border border-accent text-accent-text",
    text: "text-accent-text",
    plain: "text-muted-foreground hover:text-accent-text",
  },
  success: {
    elevated: "bg-success text-on-bright shadow-md shadow-success/25",
    flat: "bg-success text-on-bright",
    tonal: "bg-success/15 text-success-text",
    outlined: "border border-success text-success-text",
    text: "text-success-text",
    plain: "text-muted-foreground hover:text-success-text",
  },
  warning: {
    elevated: "bg-warning text-on-bright shadow-md shadow-warning/25",
    flat: "bg-warning text-on-bright",
    tonal: "bg-warning/15 text-warning-text",
    outlined: "border border-warning text-warning-text",
    text: "text-warning-text",
    plain: "text-muted-foreground hover:text-warning-text",
  },
  danger: {
    elevated: "bg-destructive text-on-bright shadow-md shadow-destructive/25",
    flat: "bg-destructive text-on-bright",
    tonal: "bg-destructive/15 text-destructive-text",
    outlined: "border border-destructive text-destructive-text",
    text: "text-destructive-text",
    plain: "text-muted-foreground hover:text-destructive-text",
  },
  info: {
    elevated: "bg-primary-dark text-white shadow-md shadow-primary/25",
    flat: "bg-primary-dark text-white",
    tonal: "bg-primary/15 text-primary-text",
    outlined: "border border-primary text-primary-text",
    text: "text-primary-text",
    plain: "text-muted-foreground hover:text-primary-text",
  },
};

// ---------------------------------------------------------------------------
// Size map
// ---------------------------------------------------------------------------

const sizeClasses: Record<BadgeSize, string> = {
  xs: "px-1.5 py-0 text-[9px]",
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm",
  xl: "px-4 py-2 text-base",
};

// ---------------------------------------------------------------------------
// Floating dot helpers (standalone dots use StatusDot component)
// ---------------------------------------------------------------------------

const floatingDotColorMap: Record<BadgeColor, string> = {
  default: "bg-muted-foreground",
  primary: "bg-primary",
  secondary: "bg-secondary",
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  info: "bg-primary",
};

const floatingDotSizeMap: Record<BadgeSize, string> = {
  xs: "size-1.5",
  sm: "size-2",
  md: "size-2.5",
  lg: "size-3",
  xl: "size-3.5",
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  /** Color palette */
  color?: BadgeColor;
  /** Visual style variant */
  variant?: BadgeVariant;
  /** Size */
  size?: BadgeSize;
  /** Add a ring border (useful when overlapping other elements) */
  bordered?: boolean;
  /** Position badge as floating indicator over children */
  floating?: boolean;
  /** Show a dot instead of text content (only in floating mode) */
  dot?: boolean;
  /** Content to display (used with floating) */
  content?: ReactNode;
  /** Cap numeric content at this value (shows "N+" when exceeded) */
  max?: number;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resolveContent(
  children: ReactNode,
  content: ReactNode,
  max?: number,
): ReactNode {
  const raw = content ?? children;
  if (max != null && typeof raw === "string") {
    const num = Number(raw);
    if (!Number.isNaN(num) && num > max) return `${max}+`;
  }
  return raw;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      color = "default",
      variant = "tonal",
      size = "md",
      dot,
      bordered,
      floating,
      content,
      max,
      children,
      ...props
    },
    ref,
  ) => {
    const ringClass = bordered ? "ring-2 ring-surface" : "";

    // Floating mode: wrap children with an absolutely positioned badge or dot
    if (floating) {
      const badgeContent = dot ? null : resolveContent(null, content, max);
      return (
        <span ref={ref} className={cn("relative inline-flex", className)}>
          {children}
          {dot ? (
            <span
              className={cn(
                "absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 rounded-full",
                floatingDotColorMap[color],
                floatingDotSizeMap[size],
                ringClass,
              )}
            />
          ) : (
            <span
              className={cn(
                "inline-flex items-center gap-1 font-bold uppercase tracking-wider rounded-full",
                "absolute top-0 right-0 translate-x-1/3 -translate-y-1/3",
                colorMap[color][variant],
                sizeClasses[size],
                ringClass,
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
          "inline-flex items-center gap-1 font-bold uppercase tracking-wider rounded-full",
          colorMap[color][variant],
          sizeClasses[size],
          ringClass,
          className,
        )}
        {...props}
      >
        {displayed}
      </span>
    );
  },
);
Badge.displayName = "Badge";

export { Badge, colorMap as badgeColorMap };
export type { BadgeProps, BadgeColor, BadgeVariant, BadgeSize };
