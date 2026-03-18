import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const statusDotVariants = cva("inline-block rounded-full", {
  variants: {
    color: {
      green: "bg-emerald-500",
      amber: "bg-amber-500",
      red: "bg-red-500",
      blue: "bg-blue-500",
      slate: "bg-slate-400",
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

type StatusDotProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> &
  VariantProps<typeof statusDotVariants> & {
    pulse?: boolean;
  };

const StatusDot = forwardRef<HTMLSpanElement, StatusDotProps>(
  ({ color, size, pulse, className, ...props }, ref) => {
    if (pulse) {
      return (
        <span
          ref={ref}
          role="status"
          className={cn("relative flex", size === "md" ? "h-2.5 w-2.5" : "h-1.5 w-1.5")}
          {...props}
        >
          <span
            className={cn(
              "animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full opacity-75",
              color === "green" && "bg-emerald-400",
              color === "amber" && "bg-amber-400",
              color === "red" && "bg-red-400",
              color === "blue" && "bg-blue-400",
              color === "slate" && "bg-slate-300"
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
        {...props}
      />
    );
  }
);
StatusDot.displayName = "StatusDot";

export { StatusDot, statusDotVariants };
export type { StatusDotProps };
