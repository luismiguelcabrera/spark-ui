"use client";

import { forwardRef, useRef, useCallback, useEffect, type KeyboardEvent } from "react";
import { cn } from "../../lib/utils";
import { useControllable } from "../../hooks/use-controllable";

type KnobColor = "primary" | "secondary" | "success" | "warning" | "destructive";

type KnobProps = {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: number;
  color?: KnobColor;
  showValue?: boolean;
  label?: string;
  disabled?: boolean;
  className?: string;
};

const colorMap: Record<KnobColor, { arc: string; text: string; ring: string }> = {
  primary: {
    arc: "stroke-primary",
    text: "text-primary",
    ring: "focus-visible:ring-primary",
  },
  secondary: {
    arc: "stroke-secondary",
    text: "text-secondary",
    ring: "focus-visible:ring-secondary",
  },
  success: {
    arc: "stroke-green-500",
    text: "text-green-600",
    ring: "focus-visible:ring-green-500",
  },
  warning: {
    arc: "stroke-amber-500",
    text: "text-amber-700",
    ring: "focus-visible:ring-amber-500",
  },
  destructive: {
    arc: "stroke-red-500",
    text: "text-red-600",
    ring: "focus-visible:ring-red-500",
  },
};

// Start angle at 135 degrees (bottom-left), sweep 270 degrees clockwise
const START_ANGLE = 135;
const SWEEP_ANGLE = 270;

function angleToValue(angleDeg: number, min: number, max: number): number {
  // Normalize angle relative to start
  let relative = angleDeg - START_ANGLE;
  if (relative < 0) relative += 360;
  if (relative > SWEEP_ANGLE) {
    // Snap to nearest end
    relative = relative > SWEEP_ANGLE + (360 - SWEEP_ANGLE) / 2 ? 0 : SWEEP_ANGLE;
  }
  const ratio = relative / SWEEP_ANGLE;
  return min + ratio * (max - min);
}

function valueToAngle(value: number, min: number, max: number): number {
  const ratio = (value - min) / (max - min);
  return START_ANGLE + ratio * SWEEP_ANGLE;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const sweep = endAngle - startAngle;
  const largeArc = sweep > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

function clampAndStep(value: number, min: number, max: number, step: number): number {
  const stepped = Math.round(value / step) * step;
  return Math.min(max, Math.max(min, stepped));
}

const Knob = forwardRef<HTMLDivElement, KnobProps>(
  (
    {
      value: valueProp,
      defaultValue,
      onChange,
      min = 0,
      max = 100,
      step = 1,
      size = 100,
      color = "primary",
      showValue = true,
      label,
      disabled = false,
      className,
    },
    ref,
  ) => {
    const [current, setCurrent] = useControllable({
      value: valueProp,
      defaultValue: defaultValue ?? min,
      onChange,
    });

    const svgRef = useRef<SVGSVGElement>(null);
    const draggingRef = useRef(false);

    const cx = size / 2;
    const cy = size / 2;
    const strokeWidth = Math.max(6, size * 0.08);
    const r = (size - strokeWidth) / 2 - 2;

    const endAngle = valueToAngle(current, min, max);
    const bgArcPath = describeArc(cx, cy, r, START_ANGLE, START_ANGLE + SWEEP_ANGLE);
    const valueArcPath =
      current > min
        ? describeArc(cx, cy, r, START_ANGLE, endAngle)
        : "";

    const getAngleFromEvent = useCallback(
      (clientX: number, clientY: number) => {
        const svg = svgRef.current;
        if (!svg) return null;
        const rect = svg.getBoundingClientRect();
        const svgCx = rect.left + rect.width / 2;
        const svgCy = rect.top + rect.height / 2;
        const dx = clientX - svgCx;
        const dy = clientY - svgCy;
        let angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        if (angle < 0) angle += 360;
        return angle;
      },
      [],
    );

    const updateFromAngle = useCallback(
      (angle: number) => {
        const raw = angleToValue(angle, min, max);
        const clamped = clampAndStep(raw, min, max, step);
        setCurrent(clamped);
      },
      [min, max, step, setCurrent],
    );

    // Mouse handling
    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        if (disabled) return;
        e.preventDefault();
        draggingRef.current = true;
        const angle = getAngleFromEvent(e.clientX, e.clientY);
        if (angle !== null) updateFromAngle(angle);
      },
      [disabled, getAngleFromEvent, updateFromAngle],
    );

    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (!draggingRef.current) return;
        const angle = getAngleFromEvent(e.clientX, e.clientY);
        if (angle !== null) updateFromAngle(angle);
      };
      const handleMouseUp = () => {
        draggingRef.current = false;
      };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [getAngleFromEvent, updateFromAngle]);

    // Touch handling
    const handleTouchStart = useCallback(
      (e: React.TouchEvent) => {
        if (disabled) return;
        draggingRef.current = true;
        const touch = e.touches[0];
        const angle = getAngleFromEvent(touch.clientX, touch.clientY);
        if (angle !== null) updateFromAngle(angle);
      },
      [disabled, getAngleFromEvent, updateFromAngle],
    );

    useEffect(() => {
      const handleTouchMove = (e: TouchEvent) => {
        if (!draggingRef.current) return;
        const touch = e.touches[0];
        const angle = getAngleFromEvent(touch.clientX, touch.clientY);
        if (angle !== null) updateFromAngle(angle);
      };
      const handleTouchEnd = () => {
        draggingRef.current = false;
      };
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
      return () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }, [getAngleFromEvent, updateFromAngle]);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (disabled) return;
        let next: number;
        switch (e.key) {
          case "ArrowUp":
          case "ArrowRight":
            e.preventDefault();
            next = Math.min(max, current + step);
            break;
          case "ArrowDown":
          case "ArrowLeft":
            e.preventDefault();
            next = Math.max(min, current - step);
            break;
          case "Home":
            e.preventDefault();
            next = min;
            break;
          case "End":
            e.preventDefault();
            next = max;
            break;
          default:
            return;
        }
        setCurrent(next);
      },
      [disabled, current, min, max, step, setCurrent],
    );

    const colors = colorMap[color];

    // Thumb position on the arc
    const thumbPos = polarToCartesian(cx, cy, r, endAngle - 90 + 90);
    const thumbRadius = Math.max(4, strokeWidth * 0.6);

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex flex-col items-center gap-1",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        {label && (
          <span className="text-xs font-medium text-slate-600" id={`knob-label-${label}`}>
            {label}
          </span>
        )}
        <svg
          ref={svgRef}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className={cn(
            "outline-none rounded-full",
            "focus-visible:ring-2 focus-visible:ring-offset-2",
            colors.ring,
            !disabled && "cursor-pointer",
          )}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuenow={current}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-label={label}
          aria-disabled={disabled || undefined}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onKeyDown={handleKeyDown}
        >
          {/* Background track */}
          <path
            d={bgArcPath}
            fill="none"
            className="stroke-slate-200"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Value arc */}
          {valueArcPath && (
            <path
              d={valueArcPath}
              fill="none"
              className={colors.arc}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          )}
          {/* Thumb indicator */}
          <circle
            cx={thumbPos.x}
            cy={thumbPos.y}
            r={thumbRadius}
            className={cn("fill-white stroke-slate-300")}
            strokeWidth={1.5}
          />
          {/* Center value */}
          {showValue && (
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="central"
              className={cn("fill-current font-bold", colors.text)}
              fontSize={Math.max(12, size * 0.18)}
            >
              {current}
            </text>
          )}
        </svg>
      </div>
    );
  },
);
Knob.displayName = "Knob";

export { Knob };
export type { KnobProps, KnobColor };
