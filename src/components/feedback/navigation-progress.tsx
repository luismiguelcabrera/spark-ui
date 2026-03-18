"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";

type NavigationProgressColor =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "destructive";

type NavigationProgressProps = {
  /** When true, shows an indeterminate loading animation */
  loading?: boolean;
  /** 0-100 for determinate mode */
  progress?: number;
  /** Color variant */
  color?: NavigationProgressColor;
  /** Bar height in pixels (default 3) */
  height?: number;
  className?: string;
};

const colorMap: Record<NavigationProgressColor, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  success: "bg-green-600",
  warning: "bg-amber-500",
  destructive: "bg-red-600",
};

const NavigationProgress = forwardRef<HTMLDivElement, NavigationProgressProps>(
  (
    { loading = false, progress, color = "primary", height = 3, className },
    ref
  ) => {
    const isDeterminate = progress !== undefined;
    const [completing, setCompleting] = useState(false);
    const [visible, setVisible] = useState(false);
    const prevLoadingRef = useRef(loading);

    // Handle auto-complete animation: loading goes from true to false
    useEffect(() => {
      if (prevLoadingRef.current && !loading && !isDeterminate) {
        // Was loading, now stopped: animate to 100% then fade out
        setCompleting(true);
        const timer = setTimeout(() => {
          setCompleting(false);
          setVisible(false);
        }, 500);
        return () => clearTimeout(timer);
      }

      if (loading) {
        setVisible(true);
        setCompleting(false);
      }

      prevLoadingRef.current = loading;
    }, [loading, isDeterminate]);

    // For determinate mode, always show when progress is set
    useEffect(() => {
      if (isDeterminate) {
        setVisible(true);
      }
    }, [isDeterminate]);

    const clampedProgress = isDeterminate
      ? Math.min(100, Math.max(0, progress))
      : undefined;

    const showBar = visible || loading || isDeterminate;

    if (!showBar) return null;

    const barColor = colorMap[color] || colorMap.primary;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={isDeterminate ? 0 : undefined}
        aria-valuemax={isDeterminate ? 100 : undefined}
        aria-label="Loading progress"
        className={cn(
          "fixed top-0 left-0 right-0 z-50 overflow-hidden",
          completing && "opacity-0 transition-opacity duration-500",
          className
        )}
        style={{ height }}
      >
        {isDeterminate ? (
          // Determinate bar
          <div
            className={cn(barColor, "h-full transition-all duration-300 ease-out")}
            style={{ width: `${clampedProgress}%` }}
          />
        ) : (
          // Indeterminate bar
          <div
            className={cn(barColor, "h-full")}
            style={{
              width: completing ? "100%" : "40%",
              transition: completing
                ? "width 300ms ease-out"
                : undefined,
              animation: completing
                ? undefined
                : "spark-nav-progress 1.5s ease-in-out infinite",
            }}
          />
        )}
        <style>{`
          @keyframes spark-nav-progress {
            0% { transform: translateX(-100%); width: 40%; }
            50% { transform: translateX(100%); width: 60%; }
            100% { transform: translateX(250%); width: 40%; }
          }
          @media (prefers-reduced-motion: reduce) {
            @keyframes spark-nav-progress {
              0%, 100% { transform: translateX(0%); width: 100%; opacity: 0.5; }
              50% { transform: translateX(0%); width: 100%; opacity: 1; }
            }
          }
        `}</style>
      </div>
    );
  }
);

NavigationProgress.displayName = "NavigationProgress";

export { NavigationProgress };
export type { NavigationProgressProps, NavigationProgressColor };
