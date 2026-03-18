import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";

const spinnerVariants = cva(s.spinnerBase, {
  variants: {
    size: {
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-8 h-8",
    },
    color: {
      primary: "text-primary",
      white: "text-white",
      muted: "text-slate-400",
    },
  },
  defaultVariants: {
    size: "md",
    color: "primary",
  },
});

type SpinnerProps = {
  className?: string;
} & VariantProps<typeof spinnerVariants>;

const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ size, color, className }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(spinnerVariants({ size, color }), className)}
        role="status"
        aria-label="Loading"
      />
    );
  },
);

Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };
export type { SpinnerProps };
