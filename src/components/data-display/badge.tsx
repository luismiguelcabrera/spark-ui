import { forwardRef, type HTMLAttributes } from "react";
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

type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
export type { BadgeProps };
