"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

type MarqueeProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  direction?: "left" | "right" | "up" | "down";
  speed?: "slow" | "normal" | "fast";
  pauseOnHover?: boolean;
  gap?: number;
  repeat?: number;
};

const speedMap = {
  slow: "60s",
  normal: "30s",
  fast: "15s",
};

const Marquee = forwardRef<HTMLDivElement, MarqueeProps>(
  (
    { className, children, direction = "left", speed = "normal", pauseOnHover = true, gap = 16, repeat = 4, ...props },
    ref
  ) => {
    const isHorizontal = direction === "left" || direction === "right";
    const animationName = isHorizontal ? "marquee-x" : "marquee-y";
    const reverse = direction === "right" || direction === "down";

    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden",
          pauseOnHover && "[&:hover_[data-marquee-track]]:pause",
          className
        )}
        {...props}
      >
        <div
          data-marquee-track=""
          className={cn("flex", !isHorizontal && "flex-col")}
          style={{
            gap: `${gap}px`,
            animationName,
            animationDuration: speedMap[speed],
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDirection: reverse ? "reverse" : "normal",
            animationPlayState: "running",
          }}
        >
          {Array.from({ length: repeat }, (_, i) => (
            <div
              key={i}
              className={cn("flex shrink-0", !isHorizontal && "flex-col")}
              style={{ gap: `${gap}px` }}
              aria-hidden={i > 0}
            >
              {children}
            </div>
          ))}
        </div>
        <style>{`
          @keyframes marquee-x { from { transform: translateX(0); } to { transform: translateX(calc(-100% / ${repeat} - ${gap}px)); } }
          @keyframes marquee-y { from { transform: translateY(0); } to { transform: translateY(calc(-100% / ${repeat} - ${gap}px)); } }
          [data-marquee-track] { will-change: transform; }
          .pause, [data-marquee-track]:is(.pause) { animation-play-state: paused !important; }
        `}</style>
      </div>
    );
  }
);
Marquee.displayName = "Marquee";

export { Marquee };
export type { MarqueeProps };
