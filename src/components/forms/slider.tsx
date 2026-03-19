"use client";

import { forwardRef, useState, useRef, useCallback, useMemo, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { useControllable } from "../../hooks/use-controllable";

type SliderValue = number | [number, number];

type SliderProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> & {
  /** Current value (number for single, [min, max] for range) */
  value?: SliderValue;
  /** Default value */
  defaultValue?: SliderValue;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Callback when value changes */
  onChange?: (value: SliderValue) => void;
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
  /** Enable range mode with two thumbs */
  range?: boolean;
  /** Show tick marks at step intervals */
  ticks?: boolean;
  /** Labels below tick marks */
  tickLabels?: string[];
  /** Show value tooltip on thumb: "always", "hover", or false */
  thumbLabel?: "always" | "hover" | false;
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
      range = false,
      ticks = false,
      tickLabels,
      thumbLabel = false,
      ...props
    },
    ref
  ) => {
    // Normalize default value for range mode
    const normalizedDefault = range
      ? (Array.isArray(defaultValue) ? defaultValue : [min, defaultValue as number])
      : (Array.isArray(defaultValue) ? defaultValue[0] : defaultValue);

    const normalizedValueProp: SliderValue | undefined = valueProp !== undefined
      ? (range
          ? (Array.isArray(valueProp) ? valueProp as [number, number] : [min, valueProp as number] as [number, number])
          : (Array.isArray(valueProp) ? valueProp[0] : valueProp))
      : undefined;

    const [value, setValue] = useControllable<SliderValue>({
      value: normalizedValueProp,
      defaultValue: normalizedDefault as SliderValue,
      onChange,
    });

    const [isDragging, setIsDragging] = useState(false);
    const [activeThumb, setActiveThumb] = useState<0 | 1>(0);
    const [hoveredThumb, setHoveredThumb] = useState<0 | 1 | null>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    const clamp = (val: number) => Math.min(max, Math.max(min, val));
    const snap = (val: number) => Math.round((val - min) / step) * step + min;

    // Extract single or range values
    const isRange = range && Array.isArray(value);
    const singleValue = isRange ? 0 : (value as number);
    const rangeValue = useMemo(
      () => isRange ? (value as [number, number]) : [min, value as number] as [number, number],
      [isRange, value, min]
    );

    const percentOf = (val: number) => ((val - min) / (max - min)) * 100;
    const percent = isRange ? 0 : percentOf(singleValue);

    const getValueFromPosition = useCallback(
      (clientX: number) => {
        const track = trackRef.current;
        if (!track) return min;
        const rect = track.getBoundingClientRect();
        const ratio = (clientX - rect.left) / rect.width;
        return snap(clamp(min + ratio * (max - min)));
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps -- clamp/snap are stable within min/max/step
      [min, max, step]
    );

    const handlePointerDown = useCallback(
      (e: React.PointerEvent) => {
        if (disabled) return;
        e.preventDefault();
        const newVal = getValueFromPosition(e.clientX);
        setIsDragging(true);

        if (isRange) {
          const [lo, hi] = rangeValue;
          // Determine which thumb is closer
          const distLo = Math.abs(newVal - lo);
          const distHi = Math.abs(newVal - hi);
          const thumb = distLo <= distHi ? 0 : 1;
          setActiveThumb(thumb as 0 | 1);
          const updated: [number, number] = thumb === 0
            ? [Math.min(newVal, hi), hi]
            : [lo, Math.max(newVal, lo)];
          setValue(updated);
        } else {
          setActiveThumb(0);
          setValue(newVal);
        }

        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      },
      [disabled, getValueFromPosition, setValue, isRange, rangeValue]
    );

    const handlePointerMove = useCallback(
      (e: React.PointerEvent) => {
        if (!isDragging || disabled) return;
        const newVal = getValueFromPosition(e.clientX);

        if (isRange) {
          const [lo, hi] = rangeValue;
          if (activeThumb === 0) {
            setValue([Math.min(newVal, hi), hi]);
          } else {
            setValue([lo, Math.max(newVal, lo)]);
          }
        } else {
          setValue(newVal);
        }
      },
      [isDragging, disabled, getValueFromPosition, setValue, isRange, rangeValue, activeThumb]
    );

    const handlePointerUp = useCallback(() => {
      setIsDragging(false);
    }, []);

    const makeKeyDownHandler = useCallback(
      (thumbIndex: 0 | 1) => (e: React.KeyboardEvent) => {
        if (disabled) return;

        if (isRange) {
          const [lo, hi] = rangeValue;
          const current = thumbIndex === 0 ? lo : hi;
          let newVal: number;

          switch (e.key) {
            case "ArrowRight":
            case "ArrowUp":
              newVal = clamp(current + step);
              break;
            case "ArrowLeft":
            case "ArrowDown":
              newVal = clamp(current - step);
              break;
            case "Home":
              newVal = min;
              break;
            case "End":
              newVal = max;
              break;
            case "PageUp":
              newVal = clamp(current + step * 10);
              break;
            case "PageDown":
              newVal = clamp(current - step * 10);
              break;
            default:
              return;
          }
          e.preventDefault();
          if (thumbIndex === 0) {
            setValue([Math.min(newVal, hi), hi]);
          } else {
            setValue([lo, Math.max(newVal, lo)]);
          }
        } else {
          const current = singleValue;
          let newVal: number;
          switch (e.key) {
            case "ArrowRight":
            case "ArrowUp":
              newVal = clamp(current + step);
              break;
            case "ArrowLeft":
            case "ArrowDown":
              newVal = clamp(current - step);
              break;
            case "Home":
              newVal = min;
              break;
            case "End":
              newVal = max;
              break;
            case "PageUp":
              newVal = clamp(current + step * 10);
              break;
            case "PageDown":
              newVal = clamp(current - step * 10);
              break;
            default:
              return;
          }
          e.preventDefault();
          setValue(newVal);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps -- clamp is stable within min/max
      [disabled, isRange, rangeValue, singleValue, step, min, max, setValue]
    );

    // Compute tick positions
    const tickPositions: number[] = [];
    if (ticks) {
      for (let v = min; v <= max; v += step) {
        tickPositions.push(v);
      }
      // Ensure max is always included
      if (tickPositions[tickPositions.length - 1] !== max) {
        tickPositions.push(max);
      }
    }

    const colors = colorMap[color];

    const shouldShowThumbLabel = (thumbIdx: 0 | 1) => {
      if (thumbLabel === "always") return true;
      if (thumbLabel === "hover") {
        return isDragging && activeThumb === thumbIdx || hoveredThumb === thumbIdx;
      }
      return false;
    };

    const renderThumb = (thumbValue: number, thumbIdx: 0 | 1, label: string) => {
      const thumbPercent = percentOf(thumbValue);
      const showLegacyTooltip = showTooltip && isDragging && activeThumb === thumbIdx;
      const showNewLabel = shouldShowThumbLabel(thumbIdx);

      return (
        <div
          key={thumbIdx}
          role="slider"
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={thumbValue}
          aria-valuetext={formatValue(thumbValue)}
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
          style={{ left: `${thumbPercent}%` }}
          onKeyDown={makeKeyDownHandler(thumbIdx)}
          onMouseEnter={() => setHoveredThumb(thumbIdx)}
          onMouseLeave={() => setHoveredThumb(null)}
        >
          {(showLegacyTooltip || showNewLabel) && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-slate-900 text-white text-xs font-medium whitespace-nowrap">
              {formatValue(thumbValue)}
            </div>
          )}
        </div>
      );
    };

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
          {isRange ? (
            <div
              className={cn("absolute inset-y-0 rounded-full", colors.track)}
              style={{
                left: `${percentOf(rangeValue[0])}%`,
                width: `${percentOf(rangeValue[1]) - percentOf(rangeValue[0])}%`,
              }}
            />
          ) : (
            <div
              className={cn("absolute inset-y-0 left-0 rounded-full", colors.track)}
              style={{ width: `${percent}%` }}
            />
          )}

          {/* Thumb(s) */}
          {isRange ? (
            <>
              {renderThumb(rangeValue[0], 0, `${ariaLabel} minimum`)}
              {renderThumb(rangeValue[1], 1, `${ariaLabel} maximum`)}
            </>
          ) : (
            renderThumb(singleValue, 0, ariaLabel)
          )}
        </div>

        {/* Tick marks */}
        {ticks && tickPositions.length > 0 && (
          <div className="relative w-full mt-1" aria-hidden="true">
            {tickPositions.map((tickVal, i) => (
              <div
                key={i}
                className="absolute flex flex-col items-center -translate-x-1/2"
                style={{ left: `${percentOf(tickVal)}%` }}
              >
                <div className="w-0.5 h-1.5 bg-slate-400 rounded-full" />
                {tickLabels && tickLabels[i] !== undefined && (
                  <span className="text-[10px] text-slate-600 mt-0.5 whitespace-nowrap">
                    {tickLabels[i]}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {showLabels && (
          <div className={cn("flex justify-between", ticks ? "mt-0.5" : "mt-1")}>
            <span className="text-xs text-slate-600">{formatValue(min)}</span>
            <span className="text-xs text-slate-600">{formatValue(max)}</span>
          </div>
        )}
      </div>
    );
  }
);
Slider.displayName = "Slider";

export { Slider };
export type { SliderProps, SliderValue };
