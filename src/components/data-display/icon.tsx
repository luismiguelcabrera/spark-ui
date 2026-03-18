"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { useIconResolver } from "../../icons/icon-provider";
import { builtInIcons } from "../../icons/registry";

const svgSizeMap = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

const fontSizeMap = {
  sm: "text-[16px]",
  md: "text-[20px]",
  lg: "text-[24px]",
  xl: "text-[32px]",
} as const;

type IconSize = keyof typeof svgSizeMap;

type IconProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  name: string;
  filled?: boolean;
  size?: IconSize;
};

/**
 * Icon component with 3-tier resolution:
 * 1. Consumer's IconProvider resolver (custom icon sets)
 * 2. Built-in SVG icons from the registry
 * 3. Material Symbols font fallback
 */
const Icon = forwardRef<SVGSVGElement | HTMLSpanElement, IconProps>(
  ({ name, filled = false, size = "md", className, "aria-hidden": ariaHidden, ...props }, ref) => {
    // Tier 1: Check consumer's custom resolver
    const resolver = useIconResolver();
    if (resolver) {
      const CustomIcon = resolver(name);
      if (CustomIcon) {
        return (
          <CustomIcon
            ref={ref as React.Ref<SVGSVGElement>}
            size={svgSizeMap[size]}
            className={cn("shrink-0", className)}
            aria-hidden={ariaHidden ?? true}
            {...props}
          />
        );
      }
    }

    // Tier 2: Check built-in SVG icon registry
    const BuiltInIcon = builtInIcons[name];
    if (BuiltInIcon) {
      return (
        <BuiltInIcon
          ref={ref as React.Ref<SVGSVGElement>}
          size={svgSizeMap[size]}
          className={cn("shrink-0", className)}
          aria-hidden={ariaHidden ?? true}
          {...props}
        />
      );
    }

    // Tier 3: Material Symbols font fallback
    return (
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        aria-hidden={ariaHidden ?? true}
        className={cn(
          "material-symbols-outlined select-none leading-none",
          filled && "icon-filled",
          fontSizeMap[size],
          className
        )}
        {...props}
      >
        {name}
      </span>
    );
  }
);
Icon.displayName = "Icon";

export { Icon };
export type { IconProps, IconSize };
