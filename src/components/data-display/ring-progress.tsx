import { forwardRef, useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

// ── Types ───────────────────────────────────────────────────────────────

type RingProgressSection = {
  value: number;
  color?: string;
  tooltip?: string;
};

type RingProgressProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Sections of the ring, each with a value (percentage) */
  sections: RingProgressSection[];
  /** Diameter of the ring in px */
  size?: number;
  /** Stroke width in px */
  thickness?: number;
  /** Round the ends of each segment */
  roundCaps?: boolean;
  /** Content rendered in the center of the ring */
  label?: ReactNode;
};

// ── Helpers ─────────────────────────────────────────────────────────────

const DEFAULT_COLORS = [
  "text-primary",
  "text-emerald-500",
  "text-amber-500",
  "text-red-500",
  "text-purple-500",
  "text-cyan-500",
];

// ── Component ───────────────────────────────────────────────────────────

const RingProgress = forwardRef<HTMLDivElement, RingProgressProps>(
  (
    {
      sections,
      size = 120,
      thickness = 12,
      roundCaps = false,
      label,
      className,
      ...props
    },
    ref,
  ) => {
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    // Total value clamped to 100
    const total = Math.min(
      sections.reduce((sum, s) => sum + Math.max(0, s.value), 0),
      100,
    );

    // Animation: start from 0, animate to real values
    const [animated, setAnimated] = useState(false);
    const frameRef = useRef<number | undefined>(undefined);

    useEffect(() => {
      // Use rAF so the initial render paints with 0 values, then the transition kicks in
      frameRef.current = requestAnimationFrame(() => {
        setAnimated(true);
      });
      return () => {
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
      };
    }, []);

    let accumulatedOffset = 0;

    return (
      <div
        ref={ref}
        className={cn("relative inline-flex items-center justify-center", className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={`Ring progress: ${total}% filled`}
        >
          {/* Background ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={thickness}
            className="text-gray-100"
          />

          {/* Sections */}
          {sections.map((section, index) => {
            const value = Math.max(0, section.value);
            const sectionLength = animated ? (value / 100) * circumference : 0;
            const dashArray = `${sectionLength} ${circumference - sectionLength}`;
            const offset = -(accumulatedOffset / 100) * circumference;
            accumulatedOffset += value; // eslint-disable-line react-hooks/immutability -- intentional: accumulator for section offset positioning in render

            return (
              <circle
                key={index}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={thickness}
                strokeDasharray={dashArray}
                strokeDashoffset={offset}
                strokeLinecap={roundCaps ? "round" : "butt"}
                className={cn(
                  section.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
                  "origin-center -rotate-90 transition-[stroke-dasharray] duration-700 ease-out motion-reduce:transition-none",
                )}
                style={{ transformOrigin: `${center}px ${center}px` }}
              >
                {section.tooltip && <title>{section.tooltip}</title>}
              </circle>
            );
          })}
        </svg>

        {/* Center label */}
        {label && (
          <div className="absolute inset-0 flex items-center justify-center">
            {label}
          </div>
        )}
      </div>
    );
  },
);
RingProgress.displayName = "RingProgress";

export { RingProgress };
export type { RingProgressProps, RingProgressSection };
