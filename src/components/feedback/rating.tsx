"use client";

import { forwardRef, useState, useCallback, useRef } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";
import { useControllable } from "../../hooks/use-controllable";

type RatingColor = "amber" | "red" | "pink" | "purple" | "blue" | "green";

type RatingProps = {
  /** Current value */
  value?: number;
  /** Default value for uncontrolled mode */
  defaultValue?: number;
  /** Called when value changes (interactive mode) */
  onChange?: (value: number) => void;
  /** Maximum number of stars */
  max?: number;
  /** Size */
  size?: "sm" | "md" | "lg";
  /** Display only (default true for backward compat) */
  readOnly?: boolean;
  /** Allow half-star selection */
  allowHalf?: boolean;
  /** Allow clicking current value to clear to 0 */
  allowClear?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Color for active stars */
  color?: RatingColor;
  className?: string;
};

const sizeMap = {
  sm: "sm" as const,
  md: "md" as const,
  lg: "lg" as const,
};

const colorMap: Record<RatingColor, string> = {
  amber: "text-warning",
  red: "text-destructive",
  pink: "text-pink-500 dark:text-pink-400",
  purple: "text-accent",
  blue: "text-primary",
  green: "text-success",
};

const Rating = forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      max = 5,
      size = "md",
      readOnly = true,
      allowHalf = false,
      allowClear = false,
      disabled = false,
      color = "amber",
      className,
    },
    ref,
  ) => {
    const isInteractive = !readOnly;

    // For read-only mode, use value directly (backward compat)
    // For interactive mode, use controllable hook
    const [current, setCurrent] = useControllable<number>({
      value,
      defaultValue: defaultValue ?? (value !== undefined ? value : 0),
      onChange,
    });

    const [hoverValue, setHoverValue] = useState<number | null>(null);
    const starRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const displayValue = isInteractive
      ? (hoverValue ?? current)
      : Math.min(max, Math.max(0, value ?? defaultValue ?? 0));

    const activeColorClass = colorMap[color];

    const handleStarClick = useCallback(
      (starValue: number) => {
        if (disabled || !isInteractive) return;
        if (allowClear && starValue === current) {
          setCurrent(0);
        } else {
          setCurrent(starValue);
        }
      },
      [disabled, isInteractive, allowClear, current, setCurrent],
    );

    const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLDivElement>, index: number) => {
        if (disabled || !isInteractive) return;
        if (allowHalf) {
          const target = e.currentTarget;
          const rect = target.getBoundingClientRect();
          const offsetX = e.clientX - rect.left;
          const isLeftHalf = offsetX < rect.width / 2;
          setHoverValue(isLeftHalf ? index + 0.5 : index + 1);
        } else {
          setHoverValue(index + 1);
        }
      },
      [disabled, isInteractive, allowHalf],
    );

    const handleContainerMouseLeave = useCallback(() => {
      if (!isInteractive) return;
      setHoverValue(null);
    }, [isInteractive]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (disabled || !isInteractive) return;
        const step = allowHalf ? 0.5 : 1;
        let newValue: number | null = null;

        switch (e.key) {
          case "ArrowRight":
          case "ArrowUp":
            e.preventDefault();
            newValue = Math.min(current + step, max);
            break;
          case "ArrowLeft":
          case "ArrowDown":
            e.preventDefault();
            newValue = Math.max(current - step, 0);
            break;
          case "Home":
            e.preventDefault();
            newValue = 0;
            break;
          case "End":
            e.preventDefault();
            newValue = max;
            break;
        }

        if (newValue !== null) {
          setCurrent(newValue);
          // Move focus to the appropriate star
          const focusIndex = Math.ceil(newValue) - 1;
          if (focusIndex >= 0 && focusIndex < max) {
            starRefs.current[focusIndex]?.focus();
          } else if (newValue === 0 && starRefs.current[0]) {
            starRefs.current[0]?.focus();
          }
        }
      },
      [disabled, isInteractive, allowHalf, current, max, setCurrent],
    );

    const renderStarIcon = (index: number, displayVal: number) => {
      const filled = index < Math.floor(displayVal);
      const half = !filled && index < displayVal;

      return (
        <Icon
          name={half ? "star_half" : "star"}
          filled={filled || half}
          size={sizeMap[size]}
          className={cn(
            s.ratingStar,
            "transition-transform duration-150",
            !isInteractive && "hover:scale-125",
            filled || half ? activeColorClass : s.ratingStarInactive,
          )}
        />
      );
    };

    // Read-only mode: backward compatible
    if (!isInteractive) {
      const clamped = displayValue;
      return (
        <div
          ref={ref}
          className={cn("inline-flex items-center gap-0.5", className)}
          role="img"
          aria-label={`${clamped} out of ${max} stars`}
        >
          {Array.from({ length: max }).map((_, i) => {
            const filled = i < Math.floor(clamped);
            const half = !filled && i < clamped;

            return (
              <Icon
                key={i}
                name={half ? "star_half" : "star"}
                filled={filled || half}
                size={sizeMap[size]}
                className={cn(
                  s.ratingStar,
                  "transition-transform duration-150 hover:scale-125",
                  filled || half ? activeColorClass : s.ratingStarInactive,
                )}
              />
            );
          })}
        </div>
      );
    }

    // Interactive mode
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-0.5",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className,
        )}
        role="radiogroup"
        aria-label="Rating"
        onMouseLeave={handleContainerMouseLeave}
        onKeyDown={handleKeyDown}
      >
        {Array.from({ length: max }).map((_, i) => {
          const starValue = i + 1;
          const isChecked =
            starValue === current ||
            (allowHalf && i + 0.5 === current);

          return (
            <div
              key={i}
              className="relative inline-flex"
              onMouseMove={(e) => handleMouseMove(e, i)}
            >
              <button
                ref={(el) => {
                  starRefs.current[i] = el;
                }}
                type="button"
                role="radio"
                aria-checked={isChecked}
                aria-label={`${starValue} star${starValue !== 1 ? "s" : ""}`}
                tabIndex={i === 0 ? 0 : -1}
                disabled={disabled}
                className={cn(
                  "inline-flex items-center justify-center cursor-pointer bg-transparent border-none p-0",
                  "transition-transform duration-150 hover:scale-125",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded-sm",
                )}
                onClick={() => {
                  if (allowHalf && hoverValue !== null) {
                    handleStarClick(hoverValue);
                  } else {
                    handleStarClick(starValue);
                  }
                }}
              >
                {renderStarIcon(i, displayValue)}
              </button>
            </div>
          );
        })}
      </div>
    );
  },
);

Rating.displayName = "Rating";

export { Rating };
export type { RatingProps, RatingColor };
