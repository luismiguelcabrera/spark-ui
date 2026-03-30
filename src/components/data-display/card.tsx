import { forwardRef, type HTMLAttributes, type ReactNode, type MouseEventHandler } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "./icon";

const cardVariants = cva("transition-all", {
  variants: {
    variant: {
      default: s.cardBase,
      glass: s.cardGlass,
      elevated: s.cardElevated,
      outline: s.cardOutline,
    },
    padding: {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "md",
  },
});

type CardProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants> & {
    title?: string;
    subtitle?: string;
    icon?: string;
    footer?: ReactNode;
    actions?: ReactNode;
    /** Shows a skeleton pulse overlay */
    loading?: boolean;
    /** Elevates shadow on hover with transition */
    hoverable?: boolean;
    /** Adds cursor-pointer and interactive styles */
    clickable?: boolean;
    /** Click handler */
    onClick?: MouseEventHandler<HTMLDivElement>;
  };

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      padding,
      title,
      subtitle,
      icon,
      footer,
      actions,
      loading,
      hoverable,
      clickable,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const interactiveClasses = cn(
      hoverable && "hover:shadow-lg hover:-translate-y-0.5",
      clickable && "cursor-pointer active:scale-[0.99]",
      (hoverable || clickable) &&
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none",
    );

    const loadingOverlay = loading ? (
      <div
        className="absolute inset-0 z-10 rounded-2xl bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 animate-pulse"
        aria-hidden="true"
        data-testid="card-loading-overlay"
      />
    ) : null;

    // Shorthand mode: auto-render header when title is provided
    if (title) {
      return (
        <div
          className={cn(
            cardVariants({ variant, padding, className }),
            interactiveClasses,
            loading && "relative overflow-hidden",
          )}
          ref={ref}
          role={clickable ? "button" : undefined}
          tabIndex={clickable ? 0 : undefined}
          aria-busy={loading || undefined}
          onClick={onClick}
          {...props}
        >
          {loadingOverlay}
          <div className={cn("flex items-center justify-between mb-4", loading && "invisible")}>
            <div className="flex items-center gap-3">
              {icon && (
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon name={icon} size="sm" className="text-primary" />
                </div>
              )}
              <div>
                <h3 className={s.cardTitle}>{title}</h3>
                {subtitle && (
                  <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
                )}
              </div>
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
          <div className={cn(loading && "invisible")}>{children}</div>
          {footer && (
            <div className={cn("mt-4 pt-4 border-t border-slate-100", loading && "invisible")}>
              {footer}
            </div>
          )}
        </div>
      );
    }

    // Default mode: raw card container
    return (
      <div
        className={cn(
          cardVariants({ variant, padding, className }),
          interactiveClasses,
          loading && "relative overflow-hidden",
        )}
        ref={ref}
        role={clickable ? "button" : undefined}
        tabIndex={clickable ? 0 : undefined}
        aria-busy={loading || undefined}
        onClick={onClick}
        {...props}
      >
        {loadingOverlay}
        <div className={cn(loading && "invisible")}>{children}</div>
        {footer && (
          <div className={cn("mt-4 pt-4 border-t border-slate-100", loading && "invisible")}>
            {footer}
          </div>
        )}
      </div>
    );
  }
);
Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      className={cn("flex items-center justify-between mb-4", className)}
      ref={ref}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    className={cn(s.cardTitle, className)}
    ref={ref}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div className={cn(className)} ref={ref} {...props} />
  )
);
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardContent, cardVariants };
export type { CardProps };
