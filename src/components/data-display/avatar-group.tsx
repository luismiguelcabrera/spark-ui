import {
  forwardRef,
  Children,
  isValidElement,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";
import { AvatarGroupContext, type AvatarSize, type AvatarShape } from "./avatar";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type AvatarGroupBorderColor = "white" | "gray" | "dark" | "none";

type AvatarGroupProps = HTMLAttributes<HTMLDivElement> & {
  /** Maximum visible avatars before showing +N */
  max?: number;
  /** Size propagated to child Avatars via context */
  size?: AvatarSize;
  /** Shape propagated to child Avatars via context */
  shape?: AvatarShape;
  /** Overlap amount */
  spacing?: "tight" | "normal" | "loose";
  /** Ring color for overlap borders */
  borderColor?: AvatarGroupBorderColor;
  /** Custom render for the +N overflow counter */
  renderExcess?: (count: number, hiddenChildren: ReactNode[]) => ReactNode;
  /** Called when the +N counter is clicked */
  onExcessClick?: () => void;
  /** Reverse stacking order — first avatar on top */
  reversed?: boolean;
  children: ReactNode;
};

// ---------------------------------------------------------------------------
// Maps
// ---------------------------------------------------------------------------
const borderColorMap: Record<AvatarGroupBorderColor, string> = {
  white: "ring-2 ring-white",
  gray: "ring-2 ring-gray-100",
  dark: "ring-2 ring-gray-900",
  none: "",
};

const statusRingMap: Record<AvatarGroupBorderColor, string> = {
  white: "ring-white",
  gray: "ring-gray-100",
  dark: "ring-gray-900",
  none: "ring-white",
};

const shapeClassMap: Record<AvatarShape, string> = {
  circle: "rounded-full",
  square: "rounded-none",
  rounded: "rounded-lg",
};

const spacingMatrix: Record<AvatarSize, Record<string, string>> = {
  xs: { tight: "-space-x-2", normal: "-space-x-1.5", loose: "-space-x-1" },
  sm: { tight: "-space-x-2.5", normal: "-space-x-2", loose: "-space-x-1" },
  md: { tight: "-space-x-3", normal: "-space-x-2", loose: "-space-x-1" },
  lg: { tight: "-space-x-4", normal: "-space-x-3", loose: "-space-x-1.5" },
  xl: { tight: "-space-x-5", normal: "-space-x-4", loose: "-space-x-2" },
};

const counterSizeMap: Record<AvatarSize, string> = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-sm",
  xl: "w-16 h-16 text-base",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      className,
      max = 4,
      size = "md",
      shape = "circle",
      spacing = "normal",
      borderColor = "white",
      renderExcess,
      onExcessClick,
      reversed = false,
      children,
      ...props
    },
    ref
  ) => {
    const childArray = Children.toArray(children);
    const visible = childArray.slice(0, max);
    const hidden = childArray.slice(max);
    const excess = hidden.length;

    const borderClass = borderColorMap[borderColor];
    const shapeClass = shapeClassMap[shape];
    const spacingClass = spacingMatrix[size][spacing];

    return (
      <AvatarGroupContext.Provider
        value={{ size, shape, statusRingClass: statusRingMap[borderColor] }}
      >
        <div
          ref={ref}
          role="group"
          aria-label={
            props["aria-label"] ??
            `Group of ${childArray.length} avatars`
          }
          className={cn("flex items-center", spacingClass, className)}
          {...props}
        >
          {visible.map((child, i) => {
            const key =
              isValidElement(child) && child.key != null
                ? child.key
                : i;

            return (
              <div
                key={key}
                className={cn("relative", shapeClass, borderClass)}
                style={
                  reversed
                    ? { zIndex: visible.length - i }
                    : undefined
                }
              >
                {child}
              </div>
            );
          })}

          {excess > 0 &&
            (renderExcess ? (
              renderExcess(excess, hidden)
            ) : (
              <div
                role={onExcessClick ? "button" : undefined}
                tabIndex={onExcessClick ? 0 : undefined}
                aria-label={`${excess} more`}
                onClick={onExcessClick}
                onKeyDown={
                  onExcessClick
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onExcessClick();
                        }
                      }
                    : undefined
                }
                className={cn(
                  "relative flex items-center justify-center font-semibold bg-slate-200 text-slate-600",
                  shapeClass,
                  borderClass,
                  counterSizeMap[size],
                  onExcessClick &&
                    "cursor-pointer hover:bg-slate-300 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                )}
              >
                +{excess}
              </div>
            ))}
        </div>
      </AvatarGroupContext.Provider>
    );
  }
);
AvatarGroup.displayName = "AvatarGroup";

export { AvatarGroup };
export type { AvatarGroupProps, AvatarGroupBorderColor };
