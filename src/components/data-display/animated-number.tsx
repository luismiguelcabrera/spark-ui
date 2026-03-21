"use client";

import { forwardRef, useState, useEffect, useRef, useCallback, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { Slot } from "../../lib/slot";
import { usePrefersReducedMotion } from "../../hooks/use-prefers-reduced-motion";

// ---------------------------------------------------------------------------
// Easing functions
// ---------------------------------------------------------------------------

const easingFunctions = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t * t,
  easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOut: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
} as const;

type EasingPreset = keyof typeof easingFunctions;
type EasingFunction = (t: number) => number;

// ---------------------------------------------------------------------------
// Trend
// ---------------------------------------------------------------------------

type Trend = "up" | "down" | "neutral";

const trendClasses: Record<Trend, string> = {
  up: "text-success",
  down: "text-destructive",
  neutral: "",
};

const trendPrefixes: Record<Trend, string> = {
  up: "\u25B2\u00A0",  // ▲ + nbsp
  down: "\u25BC\u00A0", // ▼ + nbsp
  neutral: "",
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

type AnimatedNumberProps = HTMLAttributes<HTMLSpanElement> & {
  /** Target value to animate to */
  value: number;
  /** Starting value for the initial animation (defaults to `value` — no initial animation) */
  from?: number;
  /** Animation duration in ms */
  duration?: number;
  /** Delay before animation starts in ms */
  delay?: number;
  /** Custom formatter — receives the current numeric value, returns the display string */
  formatValue?: (value: number) => string;
  /** Number of decimal places (ignored when `formatValue` is provided) */
  decimals?: number;
  /** Text rendered before the number */
  prefix?: string;
  /** Text rendered after the number */
  suffix?: string;
  /** Easing preset name or custom `(t: number) => number` function */
  easing?: EasingPreset | EasingFunction;
  /** Locale string for built-in `toLocaleString` formatting (e.g. `"en-US"`) */
  locale?: string;
  /** Compact notation — shows 1.2K, 3.4M, etc. Requires `locale` to be set. */
  notation?: "standard" | "compact";
  /** Called when the animation completes */
  onComplete?: () => void;
  /** Announce value changes to screen readers via `aria-live` (`"off"` disables) */
  announce?: "polite" | "assertive" | "off";
  /** Show a trend indicator with color. `"auto"` derives from value direction. */
  trend?: Trend | "auto";
  /** Whether to show the trend arrow icon */
  showTrendIcon?: boolean;
  /** Render as child element via Slot (polymorphism) */
  asChild?: boolean;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const AnimatedNumber = forwardRef<HTMLSpanElement, AnimatedNumberProps>(
  (
    {
      className,
      value,
      from,
      duration = 1000,
      delay = 0,
      formatValue,
      decimals = 0,
      prefix = "",
      suffix = "",
      easing = "easeOut",
      locale,
      notation = "standard",
      onComplete,
      announce = "polite",
      trend,
      showTrendIcon = false,
      asChild = false,
      children,
      ...props
    },
    ref,
  ) => {
    const reducedMotion = usePrefersReducedMotion();
    const mountedFrom = useRef(from);
    const [displayValue, setDisplayValue] = useState(mountedFrom.current ?? value);
    const displayRef = useRef(mountedFrom.current ?? value);
    const rafRef = useRef<number>(0);
    const delayRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    const easeFn = useCallback(
      () => (typeof easing === "function" ? easing : easingFunctions[easing]),
      [easing],
    );

    useEffect(() => {
      // Always animate from the current display value to avoid jumps on interruption
      const start = displayRef.current;
      const end = value;
      const diff = end - start;

      if (diff === 0) return;

      // Respect prefers-reduced-motion: snap immediately
      if (reducedMotion) {
        setDisplayValue(end);
        displayRef.current = end;
        onCompleteRef.current?.();
        return;
      }

      const startAnimation = () => {
        const startTime = performance.now();
        const ease = easeFn();

        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = ease(progress);
          const current = start + diff * eased;
          setDisplayValue(current);
          displayRef.current = current;

          if (progress < 1) {
            rafRef.current = requestAnimationFrame(animate);
          } else {
            displayRef.current = end;
            onCompleteRef.current?.();
          }
        };

        rafRef.current = requestAnimationFrame(animate);
      };

      if (delay > 0) {
        delayRef.current = setTimeout(startAnimation, delay);
      } else {
        startAnimation();
      }

      return () => {
        cancelAnimationFrame(rafRef.current);
        if (delayRef.current) clearTimeout(delayRef.current);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, duration, delay, reducedMotion, easeFn]);

    // --- Formatting ---
    const formatted = formatValue
      ? formatValue(displayValue)
      : locale
        ? displayValue.toLocaleString(locale, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
            ...(notation === "compact" && { notation: "compact" }),
          })
        : displayValue.toFixed(decimals);

    // --- Dev warnings ---
    if (process.env.NODE_ENV !== "production") {
      if (notation === "compact" && !locale) {
        // eslint-disable-next-line no-console
        console.warn(
          "AnimatedNumber: `notation=\"compact\"` requires `locale` to be set (e.g. locale=\"en-US\"). Falling back to fixed decimal formatting.",
        );
      }
    }

    // --- Trend ---
    // When trend="auto" without `from`, compare against the initial value (neutral by default)
    const trendBaseline = mountedFrom.current ?? value;
    const resolvedTrend: Trend | undefined =
      trend === "auto"
        ? value > trendBaseline ? "up" : value < trendBaseline ? "down" : "neutral"
        : trend;

    const trendClass = resolvedTrend ? trendClasses[resolvedTrend] : "";
    const trendIcon = showTrendIcon && resolvedTrend && resolvedTrend !== "neutral"
      ? trendPrefixes[resolvedTrend]
      : "";

    const Comp = asChild ? Slot : "span";

    return (
      <Comp
        ref={ref as never}
        className={cn("tabular-nums text-navy-text", trendClass, className)}
        {...(announce !== "off" && { "aria-live": announce, "aria-atomic": true })}
        {...props}
      >
        {trendIcon}
        {prefix}
        {formatted}
        {suffix}
        {asChild ? children : null}
      </Comp>
    );
  },
);
AnimatedNumber.displayName = "AnimatedNumber";

export { AnimatedNumber, easingFunctions };
export type { AnimatedNumberProps, EasingPreset, EasingFunction, Trend as AnimatedNumberTrend };
