import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default:
          "bg-white hover:bg-gray-50 text-gray-500 hover:text-primary border border-gray-200 shadow-sm",
        ghost:
          "bg-transparent hover:bg-gray-100 text-gray-500 hover:text-primary",
        outline:
          "bg-transparent border border-slate-200 text-slate-600 hover:bg-slate-50",
      },
      size: {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof iconButtonVariants> & {
    icon: string;
    iconSize?: "sm" | "md" | "lg";
    filled?: boolean;
  };

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, icon, iconSize, filled, ...props }, ref) => {
    const resolvedIconSize = iconSize ?? (size === "sm" ? "sm" : "md");
    return (
      <button
        className={cn(iconButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <Icon name={icon} size={resolvedIconSize} filled={filled} />
      </button>
    );
  }
);
IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants };
export type { IconButtonProps };
