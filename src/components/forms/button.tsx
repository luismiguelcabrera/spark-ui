import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";
import { Spinner } from "../feedback/spinner";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:hover:translate-y-0 disabled:hover:shadow-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary hover:bg-primary-dark text-white rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25 active:translate-y-0",
        secondary:
          "bg-secondary hover:bg-secondary-light text-white rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-secondary/20 active:translate-y-0",
        outline:
          "bg-surface border border-muted text-muted-foreground hover:bg-muted/50 hover:border-muted hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 rounded-xl",
        ghost:
          "bg-transparent hover:bg-muted text-muted-foreground rounded-xl hover:-translate-y-0.5 active:translate-y-0",
        icon: "bg-surface hover:bg-muted/50 text-muted-foreground hover:text-primary rounded-full border border-muted shadow-sm hover:-translate-y-0.5 hover:shadow-md active:translate-y-0",
        link: "bg-transparent text-primary hover:text-primary-dark underline-offset-4 hover:underline p-0 h-auto shadow-none",
      },
      size: {
        sm: "h-9 px-4 text-sm rounded-lg",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    icon?: string;
    iconPosition?: "left" | "right";
    loading?: boolean;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      icon,
      iconPosition = "left",
      loading = false,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        type={type}
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && <Spinner size="sm" color={variant === "primary" || variant === "secondary" ? "white" : "primary"} />}
        {!loading && icon && iconPosition === "left" && (
          <Icon name={icon} size="sm" />
        )}
        {children}
        {!loading && icon && iconPosition === "right" && (
          <Icon name={icon} size="sm" />
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
export type { ButtonProps };
