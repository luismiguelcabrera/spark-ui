"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { useIconResolver } from "../../icons/icon-provider";
import { builtInIcons } from "../../icons/registry";
import { animatedSvgRegistry, getDefaultIconAnimation, getHoverIconAnimation, getGroupHoverIconAnimation } from "../../icons/animated-icons";

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
  /** Explicit animation preset. Overrides auto-animation from `animated`. */
  animation?: IconAnimation;
  /** When to trigger the animation. @default "always" for `animation`, "hover" for `animated`. */
  animationTrigger?: IconAnimationTrigger;
  /**
   * Enable per-icon animated SVG variant. Icons with custom animations (bell, heart, star, etc.)
   * render unique SVG part animations. All other icons get a smart default animation based on type.
   * Pure CSS, GPU-accelerated, respects prefers-reduced-motion.
   * @default false
   */
  animated?: boolean;
};

function getAnimationClass(animation?: IconAnimation, trigger?: IconAnimationTrigger): string {
  if (!animation) return "";
  return animationClassMap[trigger ?? "always"][animation] ?? "";
}

/**
 * Icon component with 3-tier resolution + animation system.
 *
 * Resolution: IconProvider → built-in SVGs → Material Symbols font fallback.
 *
 * Animation modes:
 * - `animation="spin"` — explicit generic animation preset
 * - `animated` — per-icon SVG animation (20 custom) or smart default (425 auto)
 * - Both respect `animationTrigger` and `prefers-reduced-motion`
 */
const Icon = forwardRef<SVGSVGElement | HTMLSpanElement, IconProps>(
  ({ name, filled = false, size = "md", animation, animationTrigger, animated = false, className, "aria-hidden": ariaHidden, ...props }, ref) => {
    const pxSize = svgSizeMap[size];

    // Determine animation class
    let animClass = "";
    if (animation) {
      animClass = getAnimationClass(animation, animationTrigger ?? "always");
    }

    // If `animated` is set and no explicit animation, check for per-icon animated SVG
    if (animated && !animation) {
      const trigger = animationTrigger ?? "hover";
      const triggerClass = trigger === "always" ? "spark-anim-active" : "spark-anim-hover";
      const animatedEntry = animatedSvgRegistry[name];

      if (animatedEntry) {
        // Render custom per-part animated SVG
        // eslint-disable-next-line @typescript-eslint/no-unused-vars -- strip HTML-only props
        const { onCopy: _, onCut: _2, onPaste: _3, ...svgSafeProps } = props;
        return (
          <svg
            ref={ref as React.Ref<SVGSVGElement>}
            xmlns="http://www.w3.org/2000/svg"
            width={pxSize}
            height={pxSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("shrink-0", triggerClass, className)}
            aria-hidden={ariaHidden ?? true}
            {...(svgSafeProps as React.SVGAttributes<SVGSVGElement>)}
          >
            {animatedEntry.children}
          </svg>
        );
      }

      // No custom animated SVG — apply smart pattern-based animation
      if (trigger === "hover") {
        animClass = getHoverIconAnimation(name);
      } else if (trigger === "group-hover") {
        animClass = getGroupHoverIconAnimation(name);
      } else {
        animClass = getDefaultIconAnimation(name);
      }
    }

    // Tier 1: Check consumer's custom resolver
    const resolver = useIconResolver();
    if (resolver) {
      const CustomIcon = resolver(name);
      if (CustomIcon) {
        return (
          // eslint-disable-next-line react-hooks/static-components -- dynamic icon resolution from consumer IconProvider
          <CustomIcon
            ref={ref as React.Ref<SVGSVGElement>}
            size={pxSize}
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
          size={pxSize}
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
