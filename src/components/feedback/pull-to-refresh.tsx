"use client";

import {
  forwardRef,
  useState,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";

type PullToRefreshState = "idle" | "pulling" | "triggered" | "refreshing";

type PullToRefreshProps = {
  onRefresh: () => Promise<void> | void;
  children: ReactNode;
  disabled?: boolean;
  threshold?: number;
  maxPull?: number;
  pullingContent?: ReactNode;
  refreshingContent?: ReactNode;
  className?: string;
};

const DefaultPullingIndicator = ({
  pullProgress,
  state,
}: {
  pullProgress: number;
  state: PullToRefreshState;
}) => {
  const rotation = Math.min(pullProgress * 180, 180);

  return (
    <div className="flex items-center justify-center">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          "text-primary transition-transform",
          state === "triggered" && "text-primary"
        )}
        style={{ transform: `rotate(${rotation}deg)` }}
        aria-hidden="true"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <polyline points="19 12 12 19 5 12" />
      </svg>
    </div>
  );
};

const DefaultRefreshingIndicator = () => (
  <div className="flex items-center justify-center">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primary animate-spin"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  </div>
);

const PullToRefresh = forwardRef<HTMLDivElement, PullToRefreshProps>(
  (
    {
      onRefresh,
      children,
      disabled = false,
      threshold = 80,
      maxPull = 120,
      pullingContent,
      refreshingContent,
      className,
    },
    ref
  ) => {
    const [state, setState] = useState<PullToRefreshState>("idle");
    const [pullDistance, setPullDistance] = useState(0);
    const startYRef = useRef<number | null>(null);
    const stateRef = useRef<PullToRefreshState>("idle");
    const containerRef = useRef<HTMLDivElement>(null);

    // Keep ref in sync with state for use in event handlers
    const updateState = useCallback((newState: PullToRefreshState) => {
      stateRef.current = newState;
      setState(newState);
    }, []);

    const getScrollTop = useCallback((): number => {
      const el = containerRef.current;
      if (!el) return 0;
      const scrollableChild = el.querySelector("[data-pull-scroll]") || el;
      return (scrollableChild as HTMLElement).scrollTop;
    }, []);

    const applyRubberBand = useCallback(
      (distance: number): number => {
        // Linear until threshold, then decelerates toward maxPull
        if (distance <= threshold) return distance;
        const overshoot = distance - threshold;
        const maxOvershoot = maxPull - threshold;
        const dampened =
          maxOvershoot * (1 - Math.exp(-overshoot / maxOvershoot));
        return threshold + dampened;
      },
      [maxPull, threshold]
    );

    const handleTouchStart = useCallback(
      (e: React.TouchEvent) => {
        if (disabled || stateRef.current === "refreshing") return;
        if (getScrollTop() > 0) return;
        startYRef.current = e.touches[0].clientY;
      },
      [disabled, getScrollTop]
    );

    const handleTouchMove = useCallback(
      (e: React.TouchEvent) => {
        if (disabled || stateRef.current === "refreshing") return;
        if (startYRef.current === null) return;
        if (getScrollTop() > 0) {
          startYRef.current = null;
          setPullDistance(0);
          updateState("idle");
          return;
        }

        const currentY = e.touches[0].clientY;
        const rawDistance = currentY - startYRef.current;

        if (rawDistance <= 0) {
          setPullDistance(0);
          updateState("idle");
          return;
        }

        const distance = applyRubberBand(rawDistance);
        setPullDistance(distance);

        if (distance >= threshold) {
          updateState("triggered");
        } else {
          updateState("pulling");
        }
      },
      [disabled, threshold, getScrollTop, applyRubberBand, updateState]
    );

    const handleTouchEnd = useCallback(async () => {
      if (disabled || stateRef.current === "refreshing") return;

      if (stateRef.current === "triggered") {
        updateState("refreshing");
        setPullDistance(threshold * 0.6);

        try {
          await onRefresh();
        } finally {
          updateState("idle");
          setPullDistance(0);
          startYRef.current = null;
        }
      } else {
        updateState("idle");
        setPullDistance(0);
        startYRef.current = null;
      }
    }, [disabled, threshold, onRefresh, updateState]);

    const pullProgress = Math.min(pullDistance / (threshold * 0.6), 1);

    const statusText =
      state === "pulling"
        ? "Pull to refresh"
        : state === "triggered"
          ? "Release to refresh"
          : state === "refreshing"
            ? "Refreshing..."
            : undefined;

    return (
      <div ref={ref} className={cn("relative overflow-hidden", className)}>
        {/* Pull indicator */}
        <div
          className={cn(
            "absolute top-0 left-0 right-0 flex items-center justify-center overflow-hidden transition-[height]",
            state === "idle" ? "duration-300" : "duration-0"
          )}
          style={{ height: `${pullDistance}px` }}
          aria-hidden="true"
        >
          {state === "refreshing"
            ? refreshingContent || <DefaultRefreshingIndicator />
            : pullingContent || (
                <DefaultPullingIndicator
                  pullProgress={pullProgress}
                  state={state}
                />
              )}
        </div>

        {/* Status announcer for screen readers */}
        <div aria-live="polite" className="sr-only" role="status">
          {statusText}
        </div>

        {/* Content wrapper */}
        <div
          ref={containerRef}
          className={cn(
            "transition-transform",
            state === "idle" ? "duration-300" : "duration-0"
          )}
          style={{ transform: `translateY(${pullDistance}px)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {children}
        </div>
      </div>
    );
  }
);

PullToRefresh.displayName = "PullToRefresh";

export { PullToRefresh };
export type { PullToRefreshProps, PullToRefreshState };
