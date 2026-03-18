import { forwardRef, useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

// ── Types ───────────────────────────────────────────────────────────────

type SemiCircleProgressProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Progress value from 0 to 100 */
  value: number;
  /** Diameter of the full circle in px */
  size?: number;
  /** Stroke width in px */
  thickness?: number;
  /** Color class for the progress arc */
  color?: string;
  /** Content rendered in the center */
  label?: ReactNode;
  /** Show the numeric value in the center */
  showValue?: boolean;
};

// ── Component ───────────────────────────────────────────────────────────

const SemiCircleProgress = forwardRef<HTMLDivElement, SemiCircleProgressProps>(
  (
    {
      value,
      size = 200,
      thickness = 12,
      color = "text-primary",
      label,
      showValue = true,
      className,
      ...props
    },
    ref,
  ) => {
    const clampedValue = Math.min(100, Math.max(0, value));
    const radius = (size - thickness) / 2;
    // Semi-circle arc length = half the full circumference
    const semiCircumference = Math.PI * radius;
    const center = size / 2;
    const height = center + thickness / 2;

    // Animation: start from 0, animate to real values
    const [animated, setAnimated] = useState(false);
    const frameRef = useRef<number>();

    useEffect(() => {
      frameRef.current = requestAnimationFrame(() => {
        setAnimated(true);
      });
      return () => {
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
      };
    }, []);

    const progressLength = animated
      ? (clampedValue / 100) * semiCircumference
      : 0;

    // Arc path: semi-circle from left to right (180 degrees)
    // We use a path instead of circle for cleaner semi-circle rendering
    const arcPath = `M ${thickness / 2} ${center} A ${radius} ${radius} 0 0 1 ${size - thickness / 2} ${center}`;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress: ${clampedValue}%`}
        className={cn("relative inline-flex flex-col items-center", className)}
        style={{ width: size, height }}
        {...props}
      >
        <svg
          width={size}
          height={height}
          viewBox={`0 0 ${size} ${height}`}
          aria-hidden="true"
        >
          {/* Background arc */}
          <path
            d={arcPath}
            fill="none"
            stroke="currentColor"
            strokeWidth={thickness}
            strokeLinecap="round"
            className="text-gray-100"
          />

          {/* Progress arc */}
          <path
            d={arcPath}
            fill="none"
            stroke="currentColor"
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={`${semiCircumference}`}
            strokeDashoffset={semiCircumference - progressLength}
            className={cn(
              color,
              "transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none",
            )}
          />
        </svg>

        {/* Center content */}
        <div
          className="absolute flex flex-col items-center"
          style={{ bottom: 0, left: 0, right: 0 }}
        >
          {showValue && (
            <span className="text-2xl font-bold text-gray-900">
              {clampedValue}%
            </span>
          )}
          {label && (
            <span className="text-sm text-gray-500">{label}</span>
          )}
        </div>
      </div>
    );
  },
);
SemiCircleProgress.displayName = "SemiCircleProgress";

export { SemiCircleProgress };
export type { SemiCircleProgressProps };
