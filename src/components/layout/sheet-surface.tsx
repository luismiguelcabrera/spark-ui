import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const sheetSurfaceVariants = cva("bg-surface", {
  variants: {
    elevation: {
      0: "shadow-none",
      1: "shadow-sm",
      2: "shadow",
      3: "shadow-md",
      4: "shadow-lg",
      5: "shadow-xl",
    },
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
    },
  },
  defaultVariants: {
    elevation: 1,
    rounded: "lg",
  },
});

type SheetSurfaceProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof sheetSurfaceVariants> & {
    /** Whether to show a border */
    bordered?: boolean;
    /** Background color class (overrides default bg-surface) */
    color?: string;
  };

/**
 * Generic surface/paper element — a styled container with elevation, rounding, and optional border.
 */
const SheetSurface = forwardRef<HTMLDivElement, SheetSurfaceProps>(
  ({ className, elevation, rounded, bordered, color, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        sheetSurfaceVariants({ elevation, rounded }),
        bordered && "border border-muted",
        color,
        className
      )}
      {...props}
    />
  )
);
SheetSurface.displayName = "SheetSurface";

export { SheetSurface, sheetSurfaceVariants };
export type { SheetSurfaceProps };
