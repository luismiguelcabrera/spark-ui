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
    solid:   "bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 focus-visible:ring-primary",
    outline: "border border-primary/30 text-primary hover:bg-primary/5 focus-visible:ring-primary",
    ghost:   "text-primary hover:bg-primary/10 focus-visible:ring-primary",
    soft:    "bg-primary/10 hover:bg-primary/20 text-primary focus-visible:ring-primary",
    link:    "text-primary hover:text-primary-dark focus-visible:ring-primary",
  },
  secondary: {
    solid:   "bg-secondary hover:bg-secondary-light text-white hover:shadow-lg hover:shadow-secondary/20 focus-visible:ring-secondary",
    outline: "border border-secondary/30 text-secondary hover:bg-secondary/5 focus-visible:ring-secondary",
    ghost:   "text-secondary hover:bg-secondary/10 focus-visible:ring-secondary",
    soft:    "bg-secondary/10 hover:bg-secondary/20 text-secondary focus-visible:ring-secondary",
    link:    "text-secondary hover:text-secondary-light focus-visible:ring-secondary",
  },
  destructive: {
    solid:   "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/25 focus-visible:ring-red-600",
    outline: "border border-red-300 text-red-600 hover:bg-red-50 focus-visible:ring-red-600",
    ghost:   "text-red-600 hover:bg-red-50 focus-visible:ring-red-600",
    soft:    "bg-red-50 hover:bg-red-100 text-red-600 focus-visible:ring-red-600",
    link:    "text-red-600 hover:text-red-700 focus-visible:ring-red-600",
  },
  success: {
    solid:   "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/25 focus-visible:ring-green-600",
    outline: "border border-green-300 text-green-600 hover:bg-green-50 focus-visible:ring-green-600",
    ghost:   "text-green-600 hover:bg-green-50 focus-visible:ring-green-600",
    soft:    "bg-green-50 hover:bg-green-100 text-green-600 focus-visible:ring-green-600",
    link:    "text-green-600 hover:text-green-700 focus-visible:ring-green-600",
  },
  warning: {
    solid:   "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/25 focus-visible:ring-amber-500",
    outline: "border border-amber-300 text-amber-600 hover:bg-amber-50 focus-visible:ring-amber-500",
    ghost:   "text-amber-600 hover:bg-amber-50 focus-visible:ring-amber-500",
    soft:    "bg-amber-50 hover:bg-amber-100 text-amber-600 focus-visible:ring-amber-500",
    link:    "text-amber-600 hover:text-amber-700 focus-visible:ring-amber-500",
  },
  accent: {
    solid:   "bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/25 focus-visible:ring-accent",
    outline: "border border-accent/30 text-accent hover:bg-accent/5 focus-visible:ring-accent",
    ghost:   "text-accent hover:bg-accent/10 focus-visible:ring-accent",
    soft:    "bg-accent/10 hover:bg-accent/20 text-accent focus-visible:ring-accent",
    link:    "text-accent hover:text-accent/80 focus-visible:ring-accent",
  },
};

function getColorClasses(variant: string, color: ButtonColor): string {
  return colorMap[color]?.[variant] ?? colorMap.primary.solid;
}

// ── Icon size per button size ───────────────────────────────────────────

type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | "icon";

const iconSizeMap: Record<ButtonSize, "sm" | "md" | "lg"> = {
  xs: "sm",
  sm: "sm",
  md: "sm",
  lg: "md",
  xl: "md",
  icon: "md",
};

// ── CVA (handles shape, size, interactions — NOT color) ──────────────────

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
  {
    variants: {
      variant: {
        solid:   "hover:-translate-y-0.5 active:translate-y-0",
        outline: "bg-white hover:-translate-y-0.5 hover:shadow-md active:translate-y-0",
        ghost:   "bg-transparent hover:-translate-y-0.5 active:translate-y-0",
        soft:    "hover:-translate-y-0.5 active:translate-y-0",
        link:    "bg-transparent underline-offset-4 hover:underline p-0 h-auto shadow-none focus-visible:ring-offset-0",
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
    /** Color palette */
    color?: ButtonColor;
    /** Material Symbols icon name */
    icon?: string;
    /** Custom left icon element */
    leftIcon?: ReactNode;
    /** Custom right icon element */
    rightIcon?: ReactNode;
    /** Placement of the string `icon` prop */
    iconPosition?: "left" | "right";
    /** Show a loading spinner and disable the button */
    loading?: boolean;
    /** Text to display while loading (replaces children) */
    loadingText?: string;
    /** Where the spinner appears when loading */
    loadingPlacement?: "start" | "end";
    /** Render as child element (e.g. <a>, Next.js Link) */
    asChild?: boolean;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "solid",
      color = "primary",
      size = "md",
      rounded,
      fullWidth,
      icon,
      leftIcon,
      rightIcon,
      iconPosition = "left",
      loading = false,
      loadingText,
      loadingPlacement = "start",
      disabled,
      children,
      type = "button",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const resolvedIconSize = iconSizeMap[size ?? "md"];
    const resolvedLeftIcon = leftIcon ?? (icon && iconPosition === "left" ? <Icon name={icon} size={resolvedIconSize} /> : null);
    const resolvedRightIcon = rightIcon ?? (icon && iconPosition === "right" ? <Icon name={icon} size={resolvedIconSize} /> : null);

    const useWhiteSpinner = variant === "solid";
    const spinnerEl = <Spinner size="sm" color={useWhiteSpinner ? "white" : "primary"} />;

    // Dev-mode warning for icon-only buttons missing aria-label
    if (
      typeof globalThis !== "undefined" &&
      !children &&
      !loadingText &&
      !props["aria-label"] &&
      !props["aria-labelledby"]
    ) {
      console.warn(
        "[spark-ui] Button: Icon-only buttons require an `aria-label` or `aria-labelledby` for accessibility."
      );
    }

    const buttonClassName = cn(
      buttonVariants({ variant, size, rounded, fullWidth }),
      getColorClasses(variant ?? "solid", color),
      className,
    );

    // When asChild, delegate rendering to Slot — pass children directly
    if (asChild) {
      return (
        <Slot
          className={buttonClassName}
          ref={ref}
          disabled={isDisabled}
          aria-busy={loading || undefined}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    // Loading content
    let content: ReactNode;
    if (loading) {
      if (loadingText) {
        content = loadingPlacement === "start" ? (
          <>{spinnerEl}<span>{loadingText}</span></>
        ) : (
          <><span>{loadingText}</span>{spinnerEl}</>
        );
      } else {
        content = loadingPlacement === "start" ? (
          <>{spinnerEl}{children}</>
        ) : (
          <>{children}{spinnerEl}</>
        );
      }
    } else {
      content = (
        <>
          {resolvedLeftIcon}
          {children}
          {resolvedRightIcon}
        </>
      );
    }

    return (
      <button
        type={type}
        className={buttonClassName}
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        {...props}
      >
        {content}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
export type { ButtonProps, ButtonColor };
