import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Icon } from "./icon";
import { useLocale } from "../../lib/locale";

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
    solid: "bg-green-700 text-white",
    outline: "border-green-300 text-green-800",
    soft: "bg-green-100 text-green-800",
  },
  warning: {
    solid: "bg-amber-500 text-amber-950",
    outline: "border-amber-300 text-amber-900",
    soft: "bg-amber-100 text-amber-900",
  },
  destructive: {
    solid: "bg-red-600 text-white",
    outline: "border-red-300 text-red-700",
    soft: "bg-red-100 text-red-700",
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
    /** Show checkmark icon when selected (filter chip mode) */
    filter?: boolean;
    /** Whether the chip is in selected state (used with filter) */
    selected?: boolean;
    /** Use squared corners instead of pill shape */
    label?: boolean;
    /** Show X close button */
    closable?: boolean;
    /** Callback when close button is clicked */
    onClose?: () => void;
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
      filter,
      selected,
      label,
      closable,
      onClose,
      children,
      ...props
    },
    ref
  ) => {
    const { t } = useLocale();

    return (
      <div
        ref={ref}
        className={cn(
          chipVariants({ variant, size }),
          colorMap[color][variant ?? "soft"],
          clickable && !disabled && "cursor-pointer hover:opacity-80",
          disabled && "cursor-not-allowed",
          label && "!rounded-sm",
          selected && "ring-2 ring-primary ring-offset-1",
          className
        )}
        role={clickable ? "button" : undefined}
        tabIndex={clickable && !disabled ? 0 : undefined}
        aria-pressed={clickable && selected != null ? selected : undefined}
        {...props}
      >
        {filter && selected && (
          <span data-testid="chip-filter-check">
            <Icon name="check" size="sm" />
          </span>
        )}
        {dot && (
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={dotColor ? { backgroundColor: dotColor } : undefined}
          />
        )}
        {icon && !filter && <Icon name={icon} size="sm" />}
        {icon && filter && !selected && <Icon name={icon} size="sm" />}
        {children}
        {dismissible && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss?.();
            }}
            className="ml-0.5 rounded-full hover:bg-black/10 p-0.5 transition-colors"
            aria-label={t("chip.remove", "Remove")}
          >
            <Icon name="close" size="sm" />
          </button>
        )}
        {closable && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            className="ml-0.5 rounded-full hover:bg-black/10 p-0.5 transition-colors"
            aria-label={t("chip.close", "Close")}
            data-testid="chip-close-button"
          >
            <Icon name="close" size="sm" />
          </button>
        )}
      </div>
    );
  }
);
Chip.displayName = "Chip";

export { Chip, chipVariants };
export type { ChipProps, ChipColor };
