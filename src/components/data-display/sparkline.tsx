import { forwardRef, type SVGAttributes } from "react";
import { cn } from "../../lib/utils";

type SparklineProps = Omit<SVGAttributes<SVGSVGElement>, "fill"> & {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  fill?: boolean;
  showDots?: boolean;
  animate?: boolean;
};

const Sparkline = forwardRef<SVGSVGElement, SparklineProps>(
  (
    { className, data, width = 120, height = 32, color = "currentColor", strokeWidth = 2, fill = false, showDots = false, animate = false, ...props },
    ref
  ) => {
    if (data.length < 2) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const padding = strokeWidth;

    const points = data.map((value, i) => ({
      x: padding + (i / (data.length - 1)) * (width - padding * 2),
      y: padding + (1 - (value - min) / range) * (height - padding * 2),
    }));

    const pathD = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(" ");

    const fillD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${height} L ${points[0].x.toFixed(1)} ${height} Z`;

    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className={cn("inline-block", className)}
        role="img"
        aria-label={`Sparkline chart: ${data.join(", ")}`}
        {...props}
      >
        {fill && (
          <path
            d={fillD}
            fill={color}
            opacity={0.1}
          />
        )}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          {...(animate && {
            strokeDasharray: width * 2,
            strokeDashoffset: width * 2,
            style: { animation: "sparkline-draw 1s ease-out forwards" },
          })}
        />
        {showDots && points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={strokeWidth}
            fill={color}
          />
        ))}
        {animate && (
          <style>{`@keyframes sparkline-draw { to { stroke-dashoffset: 0; } }`}</style>
        )}
      </svg>
    );
  }
);
Sparkline.displayName = "Sparkline";

export { Sparkline };
export type { SparklineProps };
