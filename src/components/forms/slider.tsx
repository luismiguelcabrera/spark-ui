"use client";

import { forwardRef, useState, useRef, useCallback, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { useControllable } from "../../hooks/use-controllable";

type SliderProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  /** Current value */
  value?: number;
  /** Default value */
  defaultValue?: number;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Callback when value changes */
  onChange?: (value: number) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Color */
  color?: "primary" | "secondary" | "success" | "warning" | "destructive" | "accent";
  /** Show value tooltip on hover/drag */
  showTooltip?: boolean;
  /** Show min/max labels */
  showLabels?: boolean;
  /** Format value for display */
  formatValue?: (value: number) => string;
  /** aria-label for accessibility */
  "aria-label"?: string;
};

const trackSizeMap = { sm: "h-1", md: "h-2", lg: "h-3" };
const thumbSizeMap = { sm: "w-3.5 h-3.5", md: "w-5 h-5", lg: "w-6 h-6" };

const colorMap: Record<string, { track: string; thumb: string }> = {
  primary: { track: "bg-primary", thumb: "border-primary focus-visible:ring-primary" },
  secondary: { track: "bg-secondary", thumb: "border-secondary focus-visible:ring-secondary" },
  success: { track: "bg-green-600", thumb: "border-green-600 focus-visible:ring-green-600" },
  warning: { track: "bg-amber-500", thumb: "border-amber-500 focus-visible:ring-amber-500" },
  destructive: { track: "bg-red-600", thumb: "border-red-600 focus-visible:ring-red-600" },
  accent: { track: "bg-accent", thumb: "border-accent focus-visible:ring-accent" },
};

const Slider = forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      value: valueProp,
      defaultValue = 0,
      min = 0,
      max = 100,
      step = 1,
      onChange,
      disabled = false,
      size = "md",
      color = "primary",
      showTooltip = false,
      showLabels = false,
      formatValue = (v) => String(v),
      "aria-label": ariaLabel = "Slider",
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useControllable({
      value: valueProp,
      defaultValue,
      onChange,
    });

    const [isDragging, setIsDragging] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);

    const clamp = (val: number) => Math.min(max, Math.max(min, val));
    const snap = (val: number) => Math.round((val - min) / step) * step + min;
    const percent = ((value - min) / (max - min)) * 100;

    const getValueFromPosition = useCallback(
      (clientX: number) => {
        const track = trackRef.current;
        if (!track) return value;
        const rect = track.getBoundingClientRect();
        const ratio = (clientX - rect.left) / rect.width;
        return snap(clamp(min + ratio * (max - min)));
      },
      [min, max, step, value]
    );

    const handlePointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (disabled) return;
        e.preventDefault();
        setIsDragging(true);
        setValue(getValueFromPosition(e.clientX));
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      },
      [disabled, getValueFromPosition, setValue]
    );

    const handlePointerMove = useCallback(
      (e: React.PointerEvent) => {
        if (!isDragging || disabled) return;
        setValue(getValueFromPosition(e.clientX));
      },
      [isDragging, disabled, getValueFromPosition, setValue]
    );

    const handlePointerUp = useCallback(() => {
      setIsDragging(false);
    }, []);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (disabled) return;
        let newValue = value;
        switch (e.key) {
          case "ArrowRight":
          case "ArrowUp":
            newValue = clamp(value + step);
            break;
          case "ArrowLeft":
          case "ArrowDown":
            newValue = clamp(value - step);
            break;
          case "Home":
            newValue = min;
            break;
          case "End":
            newValue = max;
            break;
          case "PageUp":
            newValue = clamp(value + step * 10);
            break;
          case "PageDown":
            newValue = clamp(value - step * 10);
            break;
          default:
            return;
        }
        e.preventDefault();
        setValue(newValue);
      },
      [disabled, value, step, min, max, setValue]
    );

    const colors = colorMap[color];

    return (
      <div ref={ref} className={cn("w-full", disabled && "opacity-50", className)} {...props}>
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
          {/* Filled track */}
          <div
            className={cn("absolute inset-y-0 left-0 rounded-full", colors.track)}
            style={{ width: `${percent}%` }}
          />
          {/* Thumb */}
          <div
            role="slider"
            aria-label={ariaLabel}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-valuetext={formatValue(value)}
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
            style={{ left: `${percent}%` }}
            onKeyDown={handleKeyDown}
          >
            {showTooltip && isDragging && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-slate-900 text-white text-xs font-medium whitespace-nowrap">
                {formatValue(value)}
              </div>
            )}
          </div>
        </div>
        {showLabels && (
          <div className="flex justify-between mt-1">
            <span className="text-xs text-slate-400">{formatValue(min)}</span>
            <span className="text-xs text-slate-400">{formatValue(max)}</span>
          </div>
        )}
      </div>
    );
  }
);
Slider.displayName = "Slider";

export { Slider };
export type { SliderProps };
