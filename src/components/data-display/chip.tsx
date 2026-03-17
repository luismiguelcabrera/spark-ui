import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Icon } from "./icon";

const chipVariants = cva(
  "inline-flex items-center gap-1 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
  {
    variants: {
      variant: {
        solid: "",
        outline: "border bg-transparent",
        soft: "",
      },
      size: {
        sm: "h-6 px-2 text-xs rounded-md",
        md: "h-7 px-2.5 text-xs rounded-lg",
        lg: "h-8 px-3 text-sm rounded-lg",
      },
      color: {
        default: "",
        primary: "",
        secondary: "",
        success: "",
        warning: "",
        destructive: "",
      },
    },
    defaultVariants: {
      variant: "soft",
      size: "md",
      color: "default",
    },
  }
);

type ChipColor = "default" | "primary" | "secondary" | "success" | "warning" | "destructive";

const colorMap: Record<ChipColor, Record<string, string>> = {
  default: {
    solid: "bg-slate-700 text-white",
    outline: "border-slate-300 text-slate-700",
    soft: "bg-slate-100 text-slate-700",
  },
  primary: {
    solid: "bg-primary text-white",
    outline: "border-primary/30 text-primary",
    soft: "bg-primary/10 text-primary",
  },
  secondary: {
    solid: "bg-secondary text-white",
    outline: "border-secondary/30 text-secondary",
    soft: "bg-secondary/10 text-secondary",
  },
  success: {
    solid: "bg-green-600 text-white",
    outline: "border-green-300 text-green-700",
    soft: "bg-green-100 text-green-700",
  },
  warning: {
    solid: "bg-amber-500 text-amber-950",
    outline: "border-amber-300 text-amber-700",
    soft: "bg-amber-100 text-amber-700",
  },
  destructive: {
    solid: "bg-red-600 text-white",
    outline: "border-red-300 text-red-600",
    soft: "bg-red-100 text-red-600",
  },
};

type ChipProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof chipVariants> & {
    /** Color */
    color?: ChipColor;
    /** Left icon name */
    icon?: string;
    /** Whether the chip is dismissible */
    dismissible?: boolean;
    /** Callback when dismissed */
    onDismiss?: () => void;
    /** Whether the chip is clickable */
    clickable?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Show a dot indicator */
    dot?: boolean;
    /** Dot color override */
    dotColor?: string;
  };

const Chip = forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      className,
      variant = "soft",
      size = "md",
      color = "default",
      icon,
      dismissible,
      onDismiss,
      clickable,
      disabled,
      dot,
      dotColor,
      children,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        chipVariants({ variant, size }),
        colorMap[color][variant ?? "soft"],
        clickable && !disabled && "cursor-pointer hover:opacity-80",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      role={clickable ? "button" : undefined}
      tabIndex={clickable && !disabled ? 0 : undefined}
      {...props}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={dotColor ? { backgroundColor: dotColor } : undefined}
        />
      )}
      {icon && <Icon name={icon} size="sm" />}
      {children}
      {dismissible && !disabled && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss?.();
          }}
          className="ml-0.5 rounded-full hover:bg-black/10 p-0.5 transition-colors"
          aria-label="Remove"
        >
          <Icon name="close" size="sm" />
        </button>
      )}
    </div>
  )
);
Chip.displayName = "Chip";

export { Chip, chipVariants };
export type { ChipProps, ChipColor };
