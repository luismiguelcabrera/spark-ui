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

type ProgressStepsColor = "primary" | "success" | "warning" | "accent";

/* -------------------------------------------------------------------------- */
/*  Variants                                                                   */
/* -------------------------------------------------------------------------- */

const progressStepsVariants = cva("relative w-full", {
  variants: {
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const trackSizeMap = {
  sm: "h-1",
  md: "h-1.5",
  lg: "h-2",
};

const dotSizeMap = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

const checkIconSize: Record<string, "xs" | "sm"> = {
  sm: "xs",
  md: "xs",
  lg: "sm",
};

const colorMap: Record<ProgressStepsColor, { bar: string; dot: string; dotBorder: string }> = {
  primary: { bar: "bg-primary", dot: "bg-primary", dotBorder: "ring-primary/20" },
  success: { bar: "bg-green-500", dot: "bg-green-500", dotBorder: "ring-green-500/20" },
  warning: { bar: "bg-amber-500", dot: "bg-amber-500", dotBorder: "ring-amber-500/20" },
  accent: { bar: "bg-accent", dot: "bg-accent", dotBorder: "ring-accent/20" },
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
  /** Show check icon on completed steps */
  showCheck?: boolean;
  /** Additional class names */
  className?: string;
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

const ProgressSteps = forwardRef<HTMLDivElement, ProgressStepsProps>(
  (
    {
      steps,
      value,
      size = "md",
      color = "primary",
      showCheck = true,
      className,
    },
    ref,
  ) => {
    const clamped = Math.min(100, Math.max(0, value));
    const colors = colorMap[color];

    // Distribute step positions evenly if not explicitly set
    const positions = steps.map((step, i) =>
      step.value !== undefined
        ? step.value
        : steps.length === 1
          ? 50
          : (i / (steps.length - 1)) * 100,
    );

    return (
      <div
        ref={ref}
        className={cn(progressStepsVariants({ size }), className)}
        role="progressbar"
        aria-label="Progress"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* Track */}
        <div
          className={cn(
            "w-full rounded-full bg-slate-200",
            trackSizeMap[size ?? "md"],
          )}
        >
          {/* Filled bar */}
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              colors.bar,
            )}
            style={{ width: `${clamped}%` }}
          />
        </div>

        {/* Step markers */}
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
              className="absolute flex flex-col items-center"
              style={{
                left: `${pos}%`,
                top: 0,
                transform: "translateX(-50%)",
              }}
            >
              {/* Dot */}
              <div
                className={cn(
                  "rounded-full flex items-center justify-center -mt-px",
                  dotSizeMap[size ?? "md"],
                  isComplete
                    ? cn(colors.dot, "text-white ring-2", colors.dotBorder)
                    : "bg-slate-300 ring-2 ring-slate-200/50",
                  isCurrent && "ring-4",
                )}
                style={{
                  marginTop: size === "sm" ? "-2px" : size === "lg" ? "-3px" : "-2.5px",
                }}
              >
                {showCheck && isComplete && (
                  <Icon
                    name="check"
                    size={checkIconSize[size ?? "md"]}
                  />
                )}
              </div>

              {/* Label */}
              <p
                className={cn(
                  "mt-2 text-center whitespace-nowrap font-medium",
                  size === "sm" ? "text-[10px]" : size === "lg" ? "text-xs" : "text-[11px]",
                  isComplete ? "text-slate-700" : "text-slate-400",
                )}
              >
                {step.label}
              </p>

              {/* Description */}
              {step.description && (
                <p
                  className={cn(
                    "text-center whitespace-nowrap",
                    size === "sm" ? "text-[9px]" : "text-[10px]",
                    "text-slate-400 mt-0.5",
                  )}
                >
                  {step.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  },
);
ProgressSteps.displayName = "ProgressSteps";

export { ProgressSteps, progressStepsVariants };
export type { ProgressStepsProps, ProgressStep, ProgressStepsColor };
