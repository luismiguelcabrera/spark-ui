import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const statusDotVariants = cva("inline-block rounded-full", {
  variants: {
    color: {
      green: "bg-success",
      amber: "bg-warning",
      red: "bg-destructive",
      blue: "bg-primary",
      slate: "bg-muted-foreground/50",
    },
    size: {
      sm: "size-1.5",
      md: "size-2.5",
    },
  },
  defaultVariants: {
    color: "green",
    size: "sm",
  },
});

type StatusDotProps = {
  pulse?: boolean;
  className?: string;
} & VariantProps<typeof statusDotVariants>;

const StatusDot = forwardRef<HTMLSpanElement, StatusDotProps>(
  ({ color, size, pulse, className, ...props }, ref) => {
    if (pulse) {
      return (
        <span
          ref={ref}
          className={cn("relative flex", size === "md" ? "h-2.5 w-2.5" : "h-1.5 w-1.5")}
          role="status"
          {...props}
        >
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 motion-reduce:animate-none",
              color === "green" && "bg-success/70",
              color === "amber" && "bg-warning/70",
              color === "red" && "bg-destructive/70",
              color === "blue" && "bg-primary/70",
              color === "slate" && "bg-muted-foreground/30"
            )}
          />
          <span className={cn(statusDotVariants({ color, size }), className)} />
        </span>
      );
    }

    return (
      <span
        ref={ref}
        className={cn(statusDotVariants({ color, size }), className)}
        role="status"
        {...props}
      />
    );
  }
);
StatusDot.displayName = "StatusDot";

export { StatusDot, statusDotVariants };
export type { StatusDotProps };
