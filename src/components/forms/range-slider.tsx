"use client";

import { forwardRef, useState, useRef, useCallback, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { useControllable } from "../../hooks/use-controllable";

type RangeSliderColor = "primary" | "secondary" | "accent" | "success";
type RangeSliderSize = "sm" | "md" | "lg";

type RangeSliderProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> & {
  /** Current value [min, max] */
  value?: [number, number];
  /** Default value [min, max] */
  defaultValue?: [number, number];
  /** Callback when value changes */
  onChange?: (value: [number, number]) => void;
  /** Minimum bound */
  min?: number;
  /** Maximum bound */
  max?: number;
  /** Step increment */
  step?: number;
  /** Color */
  color?: RangeSliderColor;
  /** Size variant */
  size?: RangeSliderSize;
  /** Disabled state */
  disabled?: boolean;
  /** Show value tooltips on drag */
  showTooltip?: boolean;
  /** Accessible label */
  label?: string;
};

const trackSizeMap: Record<RangeSliderSize, string> = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

const thumbSizeMap: Record<RangeSliderSize, string> = {
  sm: "w-3.5 h-3.5",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

const colorMap: Record<RangeSliderColor, { track: string; thumb: string }> = {
  primary: {
    track: "bg-primary",
    thumb: "border-primary focus-visible:ring-primary",
  },
  secondary: {
    track: "bg-secondary",
    thumb: "border-secondary focus-visible:ring-secondary",
  },
  accent: {
    track: "bg-accent",
    thumb: "border-accent focus-visible:ring-accent",
  },
  success: {
    track: "bg-green-600",
    thumb: "border-green-600 focus-visible:ring-green-600",
  },
};

const RangeSlider = forwardRef<HTMLDivElement, RangeSliderProps>(
  (
    {
      className,
      value: valueProp,
      defaultValue = [25, 75],
      min = 0,
      max = 100,
      step = 1,
      onChange,
      color = "primary",
      size = "md",
      disabled = false,
      showTooltip = false,
      label = "Range",
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useControllable<[number, number]>({
      value: valueProp,
      defaultValue,
      onChange,
    });

    const [draggingThumb, setDraggingThumb] = useState<0 | 1 | null>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    const clamp = (val: number) => Math.min(max, Math.max(min, val));
    const snap = (val: number) => Math.round((val - min) / step) * step + min;

    const toPercent = (val: number) => ((val - min) / (max - min)) * 100;

    const getValueFromPosition = useCallback(
      (clientX: number) => {
        const track = trackRef.current;
        if (!track) return min;
        const rect = track.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        return snap(clamp(min + ratio * (max - min)));
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [min, max, step]
    );

    const updateValue = useCallback(
      (thumbIndex: 0 | 1, newVal: number) => {
        const next: [number, number] = [...value] as [number, number];
        next[thumbIndex] = newVal;
        // Ensure min thumb doesn't exceed max thumb and vice versa
        if (thumbIndex === 0 && next[0] > next[1]) {
          next[0] = next[1];
        } else if (thumbIndex === 1 && next[1] < next[0]) {
          next[1] = next[0];
        }
        setValue(next);
      },
      [value, setValue]
    );

    const handlePointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (disabled) return;
        e.preventDefault();
        const newVal = getValueFromPosition(e.clientX);
        // Determine which thumb is closer
        const distToMin = Math.abs(newVal - value[0]);
        const distToMax = Math.abs(newVal - value[1]);
        const thumb: 0 | 1 = distToMin <= distToMax ? 0 : 1;
        setDraggingThumb(thumb);
        updateValue(thumb, newVal);
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      },
      [disabled, getValueFromPosition, value, updateValue]
    );

    const handlePointerMove = useCallback(
      (e: React.PointerEvent) => {
        if (draggingThumb === null || disabled) return;
        const newVal = getValueFromPosition(e.clientX);
        updateValue(draggingThumb, newVal);
      },
      [draggingThumb, disabled, getValueFromPosition, updateValue]
    );

    const handlePointerUp = useCallback(() => {
      setDraggingThumb(null);
    }, []);

    const handleKeyDown = useCallback(
      (thumbIndex: 0 | 1) => (e: React.KeyboardEvent) => {
        if (disabled) return;
        let newVal: number;
        switch (e.key) {
          case "ArrowRight":
          case "ArrowUp":
            newVal = clamp(value[thumbIndex] + step);
            break;
          case "ArrowLeft":
          case "ArrowDown":
            newVal = clamp(value[thumbIndex] - step);
            break;
          case "Home":
            newVal = min;
            break;
          case "End":
            newVal = max;
            break;
          case "PageUp":
            newVal = clamp(value[thumbIndex] + step * 10);
            break;
          case "PageDown":
            newVal = clamp(value[thumbIndex] - step * 10);
            break;
          default:
            return;
        }
        e.preventDefault();
        updateValue(thumbIndex, newVal);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [disabled, value, step, min, max, updateValue]
    );

    const colors = colorMap[color];
    const lowPercent = toPercent(value[0]);
    const highPercent = toPercent(value[1]);

    return (
      <div
        ref={ref}
        className={cn("w-full", disabled && "opacity-50", className)}
        {...props}
      >
        <div
          ref={trackRef}
          className={cn(
            "relative w-full rounded-full bg-slate-200 cursor-pointer",
            trackSizeMap[size],
            disabled && "cursor-not-allowed"
          )}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Filled track between thumbs */}
          <div
            className={cn("absolute inset-y-0 rounded-full", colors.track)}
            style={{ left: `${lowPercent}%`, right: `${100 - highPercent}%` }}
          />

          {/* Min thumb */}
          <div
            role="slider"
            aria-label={`${label} minimum`}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value[0]}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white border-2 shadow-sm transition-shadow",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              "hover:shadow-md",
              thumbSizeMap[size],
              colors.thumb,
              disabled && "pointer-events-none"
            )}
            style={{ left: `${lowPercent}%` }}
            onKeyDown={handleKeyDown(0)}
          >
            {showTooltip && draggingThumb === 0 && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-slate-900 text-white text-xs font-medium whitespace-nowrap">
                {value[0]}
              </div>
            )}
          </div>

          {/* Max thumb */}
          <div
            role="slider"
            aria-label={`${label} maximum`}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value[1]}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white border-2 shadow-sm transition-shadow",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              "hover:shadow-md",
              thumbSizeMap[size],
              colors.thumb,
              disabled && "pointer-events-none"
            )}
            style={{ left: `${highPercent}%` }}
            onKeyDown={handleKeyDown(1)}
          >
            {showTooltip && draggingThumb === 1 && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-slate-900 text-white text-xs font-medium whitespace-nowrap">
                {value[1]}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);
RangeSlider.displayName = "RangeSlider";

export { RangeSlider };
export type { RangeSliderProps, RangeSliderColor, RangeSliderSize };
