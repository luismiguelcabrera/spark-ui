import { forwardRef, Children, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

type AvatarGroupProps = HTMLAttributes<HTMLDivElement> & {
  /** Maximum visible avatars before showing +N */
  max?: number;
  /** Size of avatars (matches Avatar sizes) */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Overlap amount */
  spacing?: "tight" | "normal" | "loose";
  /** Avatar children */
  children: ReactNode;
};

const spacingMap = {
  tight: "-space-x-3",
  normal: "-space-x-2",
  loose: "-space-x-1",
};

const counterSizeMap = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-sm",
  xl: "w-16 h-16 text-base",
};

const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, max = 4, size = "md", spacing = "normal", children, ...props }, ref) => {
    const childArray = Children.toArray(children);
    const visible = childArray.slice(0, max);
    const excess = childArray.length - max;

    return (
      <div
        ref={ref}
        className={cn("flex items-center", spacingMap[spacing], className)}
        {...props}
      >
        {visible.map((child, i) => (
          <div key={i} className="relative ring-2 ring-white rounded-full">
            {child}
          </div>
        ))}
        {excess > 0 && (
          <div
            className={cn(
              "relative flex items-center justify-center rounded-full bg-slate-200 text-slate-600 font-semibold ring-2 ring-white",
              counterSizeMap[size]
            )}
          >
            +{excess}
          </div>
        )}
      </div>
    );
  }
);
AvatarGroup.displayName = "AvatarGroup";

export { AvatarGroup };
export type { AvatarGroupProps };
