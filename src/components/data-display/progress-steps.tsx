"use client";

import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Icon } from "./icon";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type ProgressStep = {
  label: string;
  /** Optional description shown below the label */
  description?: string;
  /** Position along the bar (0–100). Auto-distributed if omitted. */
  value?: number;
};

type ProgressStepsColor =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "destructive"
  | "accent";

type ProgressStepsVariant = "solid" | "outline" | "soft";

/* -------------------------------------------------------------------------- */
/*  Variants                                                                   */
/* -------------------------------------------------------------------------- */

const progressStepsVariants = cva("relative w-full", {
  variants: {
    size: {
      xs: "",
      sm: "",
      md: "",
      lg: "",
      xl: "",
    },
    orientation: {
      horizontal: "",
      vertical: "flex flex-col",
    },
  },
  defaultVariants: {
    size: "md",
    orientation: "horizontal",
  },
});

const trackSizeMap = {
  xs: "h-0.5",
  sm: "h-1",
  md: "h-1.5",
  lg: "h-2",
  xl: "h-2.5",
};

const dotSizeMap = {
  xs: "w-2.5 h-2.5",
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
  xl: "w-6 h-6",
};

const checkIconSize: Record<string, "xs" | "sm"> = {
  xs: "xs",
  sm: "xs",
  md: "xs",
  lg: "sm",
  xl: "sm",
};

const labelSizeMap = {
  xs: "text-[9px]",
  sm: "text-[10px]",
  md: "text-[11px]",
  lg: "text-xs",
  xl: "text-sm",
};

const descSizeMap = {
  xs: "text-[8px]",
  sm: "text-[9px]",
  md: "text-[10px]",
  lg: "text-[11px]",
  xl: "text-xs",
};

/** Half-dot pixel width — used to inset the continuous track so it runs center-to-center. */
const dotHalfPx: Record<string, number> = {
  xs: 5,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
};

const verticalTrackWidthMap = {
  xs: "w-0.5",
  sm: "w-1",
  md: "w-1.5",
  lg: "w-2",
  xl: "w-2.5",
};

const verticalGapMap = {
  xs: "min-h-6",
  sm: "min-h-8",
  md: "min-h-10",
  lg: "min-h-12",
  xl: "min-h-14",
};

/* -------------------------------------------------------------------------- */
/*  Color × Variant maps                                                       */
/* -------------------------------------------------------------------------- */

type ColorConfig = {
  bar: string;
  dot: string;
  dotBorder: string;
  trackBg: string;
  inactiveDot: string;
  completedLabel: string;
  inactiveLabel: string;
};

/** Shared inactive tokens (concrete slate colors that exist in the project). */
const TRACK_BG = "bg-slate-200";
const INACTIVE_DOT_SOLID = "bg-slate-300 ring-2 ring-slate-200/50";
const INACTIVE_DOT_OUTLINE = "bg-transparent border-2 border-slate-300";
const INACTIVE_DOT_SOFT = "bg-slate-200";
const LABEL_COMPLETE = "text-slate-700";
const LABEL_INACTIVE = "text-slate-400";

const colorVariantMap: Record<
  ProgressStepsColor,
  Record<ProgressStepsVariant, ColorConfig>
> = {
  primary: {
    solid: {
      bar: "bg-primary",
      dot: "bg-primary text-white",
      dotBorder: "ring-primary/20",
      trackBg: TRACK_BG,
      inactiveDot: INACTIVE_DOT_SOLID,
      completedLabel: LABEL_COMPLETE,
      inactiveLabel: LABEL_INACTIVE,
    },
    outline: {
      bar: "bg-primary",
      dot: "bg-transparent border-2 border-primary text-primary",
      dotBorder: "ring-primary/10",
      trackBg: TRACK_BG,
      inactiveDot: INACTIVE_DOT_OUTLINE,
      completedLabel: LABEL_COMPLETE,
      inactiveLabel: LABEL_INACTIVE,
    },
    soft: {
      bar: "bg-primary",
      dot: "bg-primary/15 text-primary",
      dotBorder: "ring-primary/10",
      trackBg: "bg-primary/10",
      inactiveDot: INACTIVE_DOT_SOFT,
      completedLabel: LABEL_COMPLETE,
      inactiveLabel: LABEL_INACTIVE,
    },
  },
  secondary: {
    solid: {
      bar: "bg-secondary",
      dot: "bg-secondary text-white",
      dotBorder: "ring-secondary/20",
      trackBg: TRACK_BG,
      inactiveDot: INACTIVE_DOT_SOLID,
      completedLabel: LABEL_COMPLETE,
      inactiveLabel: LABEL_INACTIVE,
    },
    outline: {
      bar: "bg-secondary",
      dot: "bg-transparent border-2 border-secondary text-secondary",
      dotBorder: "ring-secondary/10",
      trackBg: TRACK_BG,
      inactiveDot: INACTIVE_DOT_OUTLINE,
      completedLabel: LABEL_COMPLETE,
      inactiveLabel: LABEL_INACTIVE,
    },
    soft: {
      bar: "bg-secondary",
      dot: "bg-secondary/15 text-secondary",
      dotBorder: "ring-secondary/10",
      trackBg: "bg-secondary/10",
      inactiveDot: INACTIVE_DOT_SOFT,
      completedLabel: LABEL_COMPLETE,
      inactiveLabel: LABEL_INACTIVE,
    },
  },
  success: {
    solid: {
      bar: "bg-green-500",
      dot: "bg-green-500 text-white",
      dotBorder: "ring-green-500/20",
      trackBg: TRACK_BG,
      inactiveDot: INACTIVE_DOT_SOLID,
      completedLabel: LABEL_COMPLETE,
      inactiveLabel: LABEL_INACTIVE,
    },
    outline: {
      bar: "bg-green-500",
      dot: "bg-transparent border-2 border-green-500 text-green-600",
      dotBorder: "ring-green-500/10",
      trackBg: TRACK_BG,
      inactiveDot: INACTIVE_DOT_OUTLINE,
      completedLabel: LABEL_COMPLETE,
      inactiveLabel: LABEL_INACTIVE,
    },
    soft: {
      bar: "bg-green-500",
      dot: "bg-green-500/15 text-green-600",
      dotBorder: "ring-green-500/10",
      trackBg: "bg-green-500/10",
      inactiveDot: INACTIVE_DOT_SOFT,
      completedLabel: LABEL_COMPLETE,
      inactiveLabel: LABEL_INACTIVE,
    },
  },
  warning: {
    solid: {
      bar: "bg-amber-500",
      dot: "bg-amber-500 text-amber-950",
      dotBorder: "ring-amber-500/20",
      trackBg: TRACK_BG,
      inactiveDot: INACTIVE_DOT_SOLID,
      completedLabel: LABEL_COMPLETE,
      inactiveLabel: LABEL_INACTIVE,
    },
    outline: {
      bar: "bg-amber-500",
      dot: "bg-transparent border-2 border-amber-500 text-amber-600",
      dotBorder: "ring-amber-500/10",
      trackBg: TRACK_BG,
      inactiveDot: INACTIVE_DOT_OUTLINE,
      completedLabel: LABEL_COMPLETE,
      inactiveLabel: LABEL_INACTIVE,
    },
    soft: {
      bar: "bg-amber-500",
      dot: "bg-amber-500/15 text-amber-600",
      dotBorder: "ring-amber-500/10",
      trackBg: "bg-amber-500/10",
      inactiveDot: INACTIVE_DOT_SOFT,
      completedLabel: LABEL_COMPLETE,
      inactiveLabel: LABEL_INACTIVE,
    },
  },
  destructive: {
    solid: {
      bar: "bg-red-500",
      dot: "bg-red-500 text-white",
      dotBorder: "ring-red-500/20",
      trackBg: TRACK_BG,
      inactiveDot: INACTIVE_DOT_SOLID,
      completedLabel: LABEL_COMPLETE,
      inactiveLabel: LABEL_INACTIVE,
    },
    outline: {
      bar: "bg-red-500",
      dot: "bg-transparent border-2 border-red-500 text-red-600",
      dotBorder: "ring-red-500/10",
      trackBg: TRACK_BG,
      inactiveDot: INACTIVE_DOT_OUTLINE,
      completedLabel: LABEL_COMPLETE,
      inactiveLabel: LABEL_INACTIVE,
    },
    soft: {
      bar: "bg-red-500",
      dot: "bg-red-500/15 text-red-600",
      dotBorder: "ring-red-500/10",
      trackBg: "bg-red-500/10",
      inactiveDot: INACTIVE_DOT_SOFT,
      completedLabel: LABEL_COMPLETE,
      inactiveLabel: LABEL_INACTIVE,
    },
  },
  accent: {
    solid: {
      bar: "bg-accent",
      dot: "bg-accent text-white",
      dotBorder: "ring-accent/20",
      trackBg: TRACK_BG,
      inactiveDot: INACTIVE_DOT_SOLID,
      completedLabel: LABEL_COMPLETE,
      inactiveLabel: LABEL_INACTIVE,
    },
    outline: {
      bar: "bg-accent",
      dot: "bg-transparent border-2 border-accent text-accent",
      dotBorder: "ring-accent/10",
      trackBg: TRACK_BG,
      inactiveDot: INACTIVE_DOT_OUTLINE,
      completedLabel: LABEL_COMPLETE,
      inactiveLabel: LABEL_INACTIVE,
    },
    soft: {
      bar: "bg-accent",
      dot: "bg-accent/15 text-accent",
      dotBorder: "ring-accent/10",
      trackBg: "bg-accent/10",
      inactiveDot: INACTIVE_DOT_SOFT,
      completedLabel: LABEL_COMPLETE,
      inactiveLabel: LABEL_INACTIVE,
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Props                                                                      */
/* -------------------------------------------------------------------------- */

type ProgressStepsProps = VariantProps<typeof progressStepsVariants> & {
  /** Step definitions */
  steps: ProgressStep[];
  /** Current progress value (0–100) */
  value: number;
  /** Color scheme */
  color?: ProgressStepsColor;
  /** Visual variant */
  variant?: ProgressStepsVariant;
  /** Show check icon on completed steps */
  showCheck?: boolean;
  /** Additional class names */
  className?: string;
};

/* -------------------------------------------------------------------------- */
/*  Horizontal layout                                                          */
/* -------------------------------------------------------------------------- */

function HorizontalProgressSteps({
  steps,
  clamped,
  positions,
  size,
  colors,
  showCheck,
}: {
  steps: ProgressStep[];
  clamped: number;
  positions: number[];
  size: NonNullable<ProgressStepsProps["size"]>;
  colors: ColorConfig;
  showCheck: boolean;
}) {
  /**
   * Map clamped value (0–100) to a visual fill percentage along the track.
   * When steps have custom positions, the visual dot spacing is even but the
   * value thresholds aren't — so we interpolate between visual segments.
   */
  const visualFill = (() => {
    const n = steps.length;
    if (n <= 1) return clamped;
    if (clamped <= positions[0]) return 0;
    if (clamped >= positions[n - 1]) return 100;

    for (let i = 0; i < n - 1; i++) {
      if (clamped >= positions[i] && clamped < positions[i + 1]) {
        const segProg =
          (clamped - positions[i]) / (positions[i + 1] - positions[i]);
        const vStart = (i / (n - 1)) * 100;
        const vEnd = ((i + 1) / (n - 1)) * 100;
        return vStart + segProg * (vEnd - vStart);
      }
    }
    return clamped;
  })();

  const half = dotHalfPx[size] ?? 8;

  return (
    <div className="flex flex-col">
      {/* Dots row — relative so the continuous track sits behind */}
      <div className="relative flex items-center justify-between">
        {/* Continuous track (center of first dot → center of last dot) */}
        <div
          className={cn(
            "absolute rounded-full",
            colors.trackBg,
            trackSizeMap[size],
          )}
          style={{ left: half, right: half }}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              colors.bar,
            )}
            style={{ width: `${visualFill}%` }}
          />
        </div>

        {/* Dots on top */}
        {steps.map((step, i) => {
          const pos = positions[i];
          const isComplete = clamped >= pos;
          const isCurrent =
            i < steps.length - 1
              ? clamped >= pos && clamped < positions[i + 1]
              : clamped >= pos;

          return (
            <div
              key={step.label}
              className="relative z-10 flex flex-col items-center"
            >
              <div
                className={cn(
                  "rounded-full flex items-center justify-center shrink-0",
                  dotSizeMap[size],
                  isComplete
                    ? cn(colors.dot, "ring-2", colors.dotBorder)
                    : colors.inactiveDot,
                  isCurrent && "ring-4",
                )}
              >
                {showCheck && isComplete && (
                  <Icon name="check" size={checkIconSize[size]} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Labels row */}
      <div className="flex justify-between mt-2">
        {steps.map((step, i) => {
          const pos = positions[i];
          const isComplete = clamped >= pos;
          const isFirst = i === 0;
          const isLast = i === steps.length - 1;

          return (
            <div
              key={step.label}
              className={cn(
                "text-center",
                isFirst && "text-left",
                isLast && "text-right",
              )}
            >
              <p
                className={cn(
                  "font-medium",
                  labelSizeMap[size],
                  isComplete ? colors.completedLabel : colors.inactiveLabel,
                )}
              >
                {step.label}
              </p>
              {step.description && (
                <p
                  className={cn(
                    "mt-0.5",
                    descSizeMap[size],
                    colors.inactiveLabel,
                  )}
                >
                  {step.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Vertical layout                                                            */
/* -------------------------------------------------------------------------- */

function VerticalProgressSteps({
  steps,
  clamped,
  positions,
  size,
  colors,
  showCheck,
}: {
  steps: ProgressStep[];
  clamped: number;
  positions: number[];
  size: NonNullable<ProgressStepsProps["size"]>;
  colors: ColorConfig;
  showCheck: boolean;
}) {
  return (
    <div className="flex flex-col">
      {steps.map((step, i) => {
        const pos = positions[i];
        const isComplete = clamped >= pos;
        const isCurrent =
          i < steps.length - 1
            ? clamped >= pos && clamped < positions[i + 1]
            : clamped >= pos;
        const isLast = i === steps.length - 1;

        return (
          <div key={step.label} className="flex gap-3">
            {/* Dot + track column */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "rounded-full flex items-center justify-center shrink-0",
                  dotSizeMap[size],
                  isComplete
                    ? cn(colors.dot, "ring-2", colors.dotBorder)
                    : colors.inactiveDot,
                  isCurrent && "ring-4",
                )}
              >
                {showCheck && isComplete && (
                  <Icon name="check" size={checkIconSize[size]} />
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "flex-1 rounded-full",
                    verticalTrackWidthMap[size],
                    verticalGapMap[size],
                    isComplete ? colors.bar : colors.trackBg,
                  )}
                />
              )}
            </div>

            {/* Label column */}
            <div className={cn("pb-4", isLast && "pb-0")}>
              <p
                className={cn(
                  "font-medium leading-tight",
                  labelSizeMap[size],
                  isComplete ? colors.completedLabel : colors.inactiveLabel,
                )}
              >
                {step.label}
              </p>
              {step.description && (
                <p
                  className={cn(
                    "mt-0.5",
                    descSizeMap[size],
                    colors.inactiveLabel,
                  )}
                >
                  {step.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

const ProgressSteps = forwardRef<HTMLDivElement, ProgressStepsProps>(
  (
    {
      steps,
      value,
      size = "md",
      orientation = "horizontal",
      color = "primary",
      variant = "solid",
      showCheck = true,
      className,
    },
    ref,
  ) => {
    const clamped = Math.min(100, Math.max(0, value));
    const colors = colorVariantMap[color][variant];

    // Distribute step positions evenly if not explicitly set
    const positions = steps.map((step, i) =>
      step.value !== undefined
        ? step.value
        : steps.length === 1
          ? 50
          : (i / (steps.length - 1)) * 100,
    );

    const isVertical = orientation === "vertical";

    return (
      <div
        ref={ref}
        className={cn(progressStepsVariants({ size, orientation }), className)}
        role="progressbar"
        aria-label="Progress"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {isVertical ? (
          <VerticalProgressSteps
            steps={steps}
            clamped={clamped}
            positions={positions}
            size={size ?? "md"}
            colors={colors}
            showCheck={showCheck}
          />
        ) : (
          <HorizontalProgressSteps
            steps={steps}
            clamped={clamped}
            positions={positions}
            size={size ?? "md"}
            colors={colors}
            showCheck={showCheck}
          />
        )}
      </div>
    );
  },
);
ProgressSteps.displayName = "ProgressSteps";

export { ProgressSteps, progressStepsVariants };
export type {
  ProgressStepsProps,
  ProgressStep,
  ProgressStepsColor,
  ProgressStepsVariant,
};
