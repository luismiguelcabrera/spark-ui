import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Slot } from "../../lib/slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";
import { Spinner } from "../feedback/spinner";

// ── Color × Variant matrix ──────────────────────────────────────────────

type ButtonColor = "primary" | "secondary" | "destructive" | "success" | "warning" | "accent";

const colorMap: Record<ButtonColor, Record<string, string>> = {
  primary: {
    solid:   "bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25",
    outline: "border border-primary/30 text-primary hover:bg-primary/5",
    ghost:   "text-primary hover:bg-primary/10",
    soft:    "bg-primary/10 hover:bg-primary/20 text-primary",
    link:    "text-primary hover:text-primary-dark",
  },
  secondary: {
    solid:   "bg-secondary hover:bg-secondary-light text-white hover:shadow-lg hover:shadow-secondary/20",
    outline: "border border-secondary/30 text-secondary hover:bg-secondary/5",
    ghost:   "text-secondary hover:bg-secondary/10",
    soft:    "bg-secondary/10 hover:bg-secondary/20 text-secondary",
    link:    "text-secondary hover:text-secondary-light",
  },
  destructive: {
    solid:   "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/25",
    outline: "border border-red-300 text-red-600 hover:bg-red-50",
    ghost:   "text-red-600 hover:bg-red-50",
    soft:    "bg-red-50 hover:bg-red-100 text-red-600",
    link:    "text-red-600 hover:text-red-700",
  },
  success: {
    solid:   "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/25",
    outline: "border border-green-300 text-green-600 hover:bg-green-50",
    ghost:   "text-green-600 hover:bg-green-50",
    soft:    "bg-green-50 hover:bg-green-100 text-green-600",
    link:    "text-green-600 hover:text-green-700",
  },
  warning: {
    solid:   "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/25",
    outline: "border border-amber-300 text-amber-600 hover:bg-amber-50",
    ghost:   "text-amber-600 hover:bg-amber-50",
    soft:    "bg-amber-50 hover:bg-amber-100 text-amber-600",
    link:    "text-amber-600 hover:text-amber-700",
  },
  accent: {
    solid:   "bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/25",
    outline: "border border-accent/30 text-accent hover:bg-accent/5",
    ghost:   "text-accent hover:bg-accent/10",
    soft:    "bg-accent/10 hover:bg-accent/20 text-accent",
    link:    "text-accent hover:text-accent/80",
  },
};

function getColorClasses(variant: string, color: ButtonColor): string {
  return colorMap[color]?.[variant] ?? colorMap.primary.solid;
}

// ── CVA (handles shape, size, interactions — NOT color) ──────────────────

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none",
  {
    variants: {
      variant: {
        solid:   "hover:-translate-y-0.5 active:translate-y-0",
        outline: "bg-white hover:-translate-y-0.5 hover:shadow-md active:translate-y-0",
        ghost:   "bg-transparent hover:-translate-y-0.5 active:translate-y-0",
        soft:    "hover:-translate-y-0.5 active:translate-y-0",
        link:    "bg-transparent underline-offset-4 hover:underline p-0 h-auto shadow-none",
      },
      size: {
        xs:   "h-7 px-2.5 text-xs",
        sm:   "h-9 px-4 text-sm",
        md:   "h-11 px-6 text-sm",
        lg:   "h-12 px-8 text-base",
        xl:   "h-14 px-10 text-lg",
        icon: "h-10 w-10 p-0",
      },
      rounded: {
        default: "rounded-xl",
        full:    "rounded-full",
        lg:      "rounded-lg",
        md:      "rounded-md",
        none:    "rounded-none",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
      rounded: "default",
    },
  }
);

// ── Component ────────────────────────────────────────────────────────────

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    color?: ButtonColor;
    icon?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    iconPosition?: "left" | "right";
    loading?: boolean;
    asChild?: boolean;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "solid",
      color = "primary",
      size,
      rounded,
      fullWidth,
      icon,
      leftIcon,
      rightIcon,
      iconPosition = "left",
      loading = false,
      disabled,
      children,
      type = "button",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const Comp = asChild ? Slot : "button";

    const resolvedLeftIcon = leftIcon ?? (icon && iconPosition === "left" ? <Icon name={icon} size="sm" /> : null);
    const resolvedRightIcon = rightIcon ?? (icon && iconPosition === "right" ? <Icon name={icon} size="sm" /> : null);

    const useWhiteSpinner = variant === "solid";

    return (
      <Comp
        type={asChild ? undefined : type}
        className={cn(
          buttonVariants({ variant, size, rounded, fullWidth }),
          getColorClasses(variant ?? "solid", color),
          className,
        )}
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && <Spinner size="sm" color={useWhiteSpinner ? "white" : "primary"} />}
        {!loading && resolvedLeftIcon}
        {children}
        {!loading && resolvedRightIcon}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
export type { ButtonProps, ButtonColor };
