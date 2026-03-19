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

/** Predefined icon animation presets. All CSS-only, GPU-accelerated. */
type IconAnimation =
  | "spin"
  | "pulse"
  | "bounce"
  | "wiggle"
  | "shake"
  | "ping"
  | "tada"
  | "float"
  | "rubber-band"
  | "fade-in"
  | "scale-in"
  | "slide-up"
  | "draw";

/** When the animation should play. */
type IconAnimationTrigger = "always" | "hover" | "group-hover";

const animationClassMap: Record<IconAnimationTrigger, Record<IconAnimation, string>> = {
  always: {
    "spin": "spark-icon-spin",
    "pulse": "spark-icon-pulse",
    "bounce": "spark-icon-bounce",
    "wiggle": "spark-icon-wiggle",
    "shake": "spark-icon-shake",
    "ping": "spark-icon-ping",
    "tada": "spark-icon-tada",
    "float": "spark-icon-float",
    "rubber-band": "spark-icon-rubber-band",
    "fade-in": "spark-icon-fade-in",
    "scale-in": "spark-icon-scale-in",
    "slide-up": "spark-icon-slide-up",
    "draw": "spark-icon-draw",
  },
  hover: {
    "spin": "spark-icon-hover-spin",
    "pulse": "spark-icon-hover-pulse",
    "bounce": "spark-icon-hover-bounce",
    "wiggle": "spark-icon-hover-wiggle",
    "shake": "spark-icon-hover-shake",
    "ping": "spark-icon-hover-pulse",
    "tada": "spark-icon-hover-tada",
    "float": "spark-icon-hover-float",
    "rubber-band": "spark-icon-hover-rubber-band",
    "fade-in": "spark-icon-fade-in",
    "scale-in": "spark-icon-scale-in",
    "slide-up": "spark-icon-slide-up",
    "draw": "spark-icon-draw",
  },
  "group-hover": {
    "spin": "spark-icon-group-hover-spin",
    "pulse": "spark-icon-group-hover-pulse",
    "bounce": "spark-icon-group-hover-bounce",
    "wiggle": "spark-icon-group-hover-wiggle",
    "shake": "spark-icon-group-hover-shake",
    "ping": "spark-icon-group-hover-pulse",
    "tada": "spark-icon-group-hover-tada",
    "float": "spark-icon-group-hover-wiggle",
    "rubber-band": "spark-icon-group-hover-shake",
    "fade-in": "spark-icon-fade-in",
    "scale-in": "spark-icon-scale-in",
    "slide-up": "spark-icon-slide-up",
    "draw": "spark-icon-draw",
  },
};

type IconProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  name: string;
  filled?: boolean;
  size?: IconSize;
  /** Animation preset. CSS-only, GPU-accelerated, respects prefers-reduced-motion. */
  animation?: IconAnimation;
  /** When to trigger the animation. @default "always" */
  animationTrigger?: IconAnimationTrigger;
};

function getAnimationClass(animation?: IconAnimation, trigger?: IconAnimationTrigger): string {
  if (!animation) return "";
  return animationClassMap[trigger ?? "always"][animation] ?? "";
}

/**
 * Icon component with 3-tier resolution:
 * 1. Consumer's IconProvider resolver (custom icon sets)
 * 2. Built-in SVG icons from the registry
 * 3. Material Symbols font fallback
 *
 * Supports CSS-only animations via `animation` + `animationTrigger` props.
 */
const Icon = forwardRef<SVGSVGElement | HTMLSpanElement, IconProps>(
  ({ name, filled = false, size = "md", animation, animationTrigger, className, "aria-hidden": ariaHidden, ...props }, ref) => {
    const animClass = getAnimationClass(animation, animationTrigger);

    // Tier 1: Check consumer's custom resolver
    const resolver = useIconResolver();
    if (resolver) {
      const CustomIcon = resolver(name);
      if (CustomIcon) {
        return (
          // eslint-disable-next-line react-hooks/static-components -- dynamic icon resolution from consumer IconProvider
          <CustomIcon
            ref={ref as React.Ref<SVGSVGElement>}
            size={svgSizeMap[size]}
            className={cn("shrink-0", animClass, className)}
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
          className={cn("shrink-0", animClass, className)}
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
          animClass,
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
export type { IconProps, IconSize, IconAnimation, IconAnimationTrigger };
