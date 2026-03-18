"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { usePrefersReducedMotion } from "../../hooks/use-prefers-reduced-motion";

type BurgerSize = "xs" | "sm" | "md" | "lg" | "xl";

type BurgerProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> & {
  /** Whether the menu is open (shows X when open, hamburger when closed) */
  opened: boolean;
  /** Toggle callback */
  onToggle?: () => void;
  /** Size of the burger icon */
  size?: BurgerSize;
  /** Line color (default "currentColor") */
  color?: string;
  /** Animation duration in ms (default 300) */
  transitionDuration?: number;
  /** Additional class names */
  className?: string;
};

const sizeMap: Record<BurgerSize, { button: number; bar: { width: number; height: number; gap: number } }> = {
  xs: { button: 24, bar: { width: 14, height: 2, gap: 3 } },
  sm: { button: 30, bar: { width: 18, height: 2, gap: 3 } },
  md: { button: 36, bar: { width: 22, height: 2, gap: 4 } },
  lg: { button: 42, bar: { width: 28, height: 3, gap: 5 } },
  xl: { button: 48, bar: { width: 34, height: 3, gap: 6 } },
};

const Burger = forwardRef<HTMLButtonElement, BurgerProps>(
  (
    {
      opened,
      onToggle,
      size = "md",
      color = "currentColor",
      transitionDuration = 300,
      className,
      disabled,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const duration = prefersReducedMotion ? 0 : transitionDuration;
    const { button: buttonSize, bar } = sizeMap[size];

    // The total height of the 3 bars + 2 gaps
    const totalHeight = bar.height * 3 + bar.gap * 2;
    // Offset from center to the outer bars
    const offset = bar.height + bar.gap;

    const barBase: React.CSSProperties = {
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
      width: bar.width,
      height: bar.height,
      backgroundColor: color,
      borderRadius: bar.height,
      transitionProperty: "transform, opacity",
      transitionDuration: `${duration}ms`,
      transitionTimingFunction: "ease",
    };

    // Center Y position
    const centerY = (buttonSize - totalHeight) / 2 + bar.height + bar.gap;

    return (
      <button
        ref={ref}
        type="button"
        aria-label={ariaLabel ?? "Toggle navigation"}
        aria-expanded={opened}
        disabled={disabled}
        onClick={onToggle}
        className={cn(
          "relative inline-flex items-center justify-center rounded-md bg-transparent border-none cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          "hover:bg-black/5 transition-colors",
          className
        )}
        style={{ width: buttonSize, height: buttonSize }}
        {...props}
      >
        {/* Top bar */}
        <span
          data-testid="burger-bar-top"
          style={{
            ...barBase,
            top: centerY - offset,
            ...(opened
              ? { transform: `translateX(-50%) translateY(${offset}px) rotate(45deg)` }
              : { transform: "translateX(-50%) translateY(0) rotate(0)" }),
          }}
        />
        {/* Middle bar */}
        <span
          data-testid="burger-bar-middle"
          style={{
            ...barBase,
            top: centerY,
            opacity: opened ? 0 : 1,
          }}
        />
        {/* Bottom bar */}
        <span
          data-testid="burger-bar-bottom"
          style={{
            ...barBase,
            top: centerY + offset,
            ...(opened
              ? { transform: `translateX(-50%) translateY(${-offset}px) rotate(-45deg)` }
              : { transform: "translateX(-50%) translateY(0) rotate(0)" }),
          }}
        />
      </button>
    );
  }
);
Burger.displayName = "Burger";

export { Burger };
export type { BurgerProps, BurgerSize };
