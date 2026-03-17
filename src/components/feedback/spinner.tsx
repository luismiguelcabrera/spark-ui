import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const spinnerVariants = cva(
  "inline-block rounded-full border-current border-t-transparent animate-spin",
  {
    variants: {
      size: {
        xs: "w-3 h-3",
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8",
        xl: "w-12 h-12",
      },
      color: {
        primary: "text-primary",
        secondary: "text-secondary",
        destructive: "text-red-600",
        success: "text-green-700",
        warning: "text-amber-600",
        accent: "text-accent",
        white: "text-white",
        muted: "text-slate-400",
        current: "text-current",
      },
      thickness: {
        thin: "border",
        default: "border-2",
        thick: "border-3",
      },
      speed: {
        normal: "animate-spin",
        fast: "[animation-duration:0.5s]",
      },
    },
    defaultVariants: {
      size: "md",
      color: "primary",
      thickness: "default",
      speed: "normal",
    },
  },
);

type SpinnerProps = {
  /** Custom accessible label (default: "Loading") */
  label?: string;
  /** Render as a centered overlay with backdrop */
  overlay?: boolean;
  className?: string;
} & VariantProps<typeof spinnerVariants>;

function Spinner({
  size,
  color,
  thickness,
  speed,
  label = "Loading",
  overlay = false,
  className,
}: SpinnerProps) {
  const spinner = (
    <span
      className={cn(spinnerVariants({ size, color, thickness, speed, className }))}
      role="status"
      aria-label={label}
    />
  );

  if (overlay) {
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px] rounded-[inherit]">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export { Spinner, spinnerVariants };
export type { SpinnerProps };
