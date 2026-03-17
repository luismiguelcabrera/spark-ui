import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Slot } from "../../lib/slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";
import { Spinner } from "../feedback/spinner";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25 active:translate-y-0",
        secondary:
          "bg-secondary hover:bg-secondary-light text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-secondary/20 active:translate-y-0",
        destructive:
          "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-600/25 active:translate-y-0",
        success:
          "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-green-600/25 active:translate-y-0",
        warning:
          "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-500/25 active:translate-y-0",
        soft:
          "bg-primary/10 hover:bg-primary/20 text-primary hover:-translate-y-0.5 active:translate-y-0",
        outline:
          "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0",
        ghost:
          "bg-transparent hover:bg-gray-100 text-gray-600 hover:-translate-y-0.5 active:translate-y-0",
        icon: "bg-white hover:bg-gray-50 text-gray-500 hover:text-primary rounded-full border border-gray-200 shadow-sm hover:-translate-y-0.5 hover:shadow-md active:translate-y-0",
        link: "bg-transparent text-primary hover:text-primary-dark underline-offset-4 hover:underline p-0 h-auto shadow-none",
      },
      size: {
        xs: "h-7 px-2.5 text-xs",
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10 p-0",
      },
      rounded: {
        default: "rounded-xl",
        full: "rounded-full",
        lg: "rounded-lg",
        md: "rounded-md",
        none: "rounded-none",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      rounded: "default",
    },
  }
);

const WHITE_SPINNER_VARIANTS = new Set([
  "primary",
  "secondary",
  "destructive",
  "success",
  "warning",
]);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
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
      variant,
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

    const spinnerColor = WHITE_SPINNER_VARIANTS.has(variant ?? "primary") ? "white" : "primary";

    return (
      <Comp
        type={asChild ? undefined : type}
        className={cn(buttonVariants({ variant, size, rounded, fullWidth, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && <Spinner size="sm" color={spinnerColor} />}
        {!loading && resolvedLeftIcon}
        {children}
        {!loading && resolvedRightIcon}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
export type { ButtonProps };
