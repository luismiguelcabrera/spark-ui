import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

const sizeMap = {
  sm: "w-6 h-6",
  md: "w-10 h-10",
  lg: "w-16 h-16",
} as const;

const radiusMap = {
  sm: "rounded",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
} as const;

type ColorSwatchProps = Omit<HTMLAttributes<HTMLDivElement>, "color"> & {
  /** CSS color value (hex, rgb, hsl, named color, or Tailwind class) */
  color: string;
  /** Swatch size — preset or custom number in px */
  size?: "sm" | "md" | "lg" | number;
  /** Show a shadow beneath the swatch */
  withShadow?: boolean;
  /** Border radius preset */
  radius?: "sm" | "md" | "lg" | "full";
};

const ColorSwatch = forwardRef<HTMLDivElement, ColorSwatchProps>(
  (
    {
      color,
      size = "md",
      withShadow = false,
      radius = "md",
      className,
      style,
      ...props
    },
    ref
  ) => {
    // If the color looks like a CSS value, apply via inline style.
    // If it looks like a Tailwind class, apply as className.
    const isCssColor =
      color.startsWith("#") ||
      color.startsWith("rgb") ||
      color.startsWith("hsl") ||
      color.match(/^[a-z]+$/i); // named colors like "red", "blue"

    const sizeClass = typeof size === "string" ? sizeMap[size] : undefined;
    const sizeStyle =
      typeof size === "number"
        ? { width: `${size}px`, height: `${size}px` }
        : undefined;

    return (
      <div
        ref={ref}
        role="img"
        aria-label={`Color swatch: ${color}`}
        className={cn(
          "inline-block border border-muted shrink-0",
          sizeClass,
          radiusMap[radius],
          withShadow && "shadow-md",
          !isCssColor && color,
          className
        )}
        style={{
          ...(isCssColor ? { backgroundColor: color } : undefined),
          ...sizeStyle,
          ...style,
        }}
        {...props}
      />
    );
  }
);
ColorSwatch.displayName = "ColorSwatch";

export { ColorSwatch };
export type { ColorSwatchProps };
