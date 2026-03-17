"use client";

import { forwardRef, useState, useEffect, useRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type AnimatedNumberProps = HTMLAttributes<HTMLSpanElement> & {
  value: number;
  duration?: number;
  formatValue?: (value: number) => string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
};

const AnimatedNumber = forwardRef<HTMLSpanElement, AnimatedNumberProps>(
  ({ className, value, duration = 1000, formatValue, decimals = 0, prefix = "", suffix = "", ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(value);
    const prevValue = useRef(value);
    const rafRef = useRef<number>(0);

    useEffect(() => {
      const start = prevValue.current;
      const end = value;
      const diff = end - start;
      if (diff === 0) return;

      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const current = start + diff * eased;
        setDisplayValue(current);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          prevValue.current = end;
        }
      };

      rafRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(rafRef.current);
    }, [value, duration]);

    const formatted = formatValue
      ? formatValue(displayValue)
      : displayValue.toFixed(decimals);

    return (
      <span ref={ref} className={cn("tabular-nums", className)} {...props}>
        {prefix}{formatted}{suffix}
      </span>
    );
  }
);
AnimatedNumber.displayName = "AnimatedNumber";

export { AnimatedNumber };
export type { AnimatedNumberProps };
