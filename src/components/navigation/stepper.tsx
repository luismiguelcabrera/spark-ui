import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";

const stepperVariants = cva("flex", {
  variants: {
    orientation: {
      horizontal: "flex-row items-start",
      vertical: "flex-col",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

type StepItem = {
  label: string;
  description?: string;
};

type StepState = "complete" | "active" | "upcoming";

type StepperProps = {
  steps: StepItem[];
  activeStep: number;
  className?: string;
} & VariantProps<typeof stepperVariants>;

const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  ({ steps, activeStep, orientation = "horizontal", className }, ref) => {
    const getState = (index: number): StepState => {
      if (index < activeStep) return "complete";
      if (index === activeStep) return "active";
      return "upcoming";
    };

    const isHorizontal = orientation === "horizontal";

    return (
      <div
        ref={ref}
        role="list"
        aria-label="Progress"
        className={cn(stepperVariants({ orientation }), className)}
      >
        {steps.map((step, i) => {
          const state = getState(i);
          const isLast = i === steps.length - 1;

          return (
            <div
              key={step.label}
              role="listitem"
              aria-current={state === "active" ? "step" : undefined}
              className={cn(
                "flex",
                isHorizontal
                  ? "flex-1 flex-col items-center"
                  : "flex-row gap-3",
              )}
            >
              <div
                className={cn(
                  "flex items-center",
                  isHorizontal ? "w-full" : "flex-col",
                )}
              >
                {/* Step circle */}
                <div
                  aria-hidden="true"
                  className={cn(
                    s.stepperCircle,
                    state === "complete" && s.stepperCircleComplete,
                    state === "active" && s.stepperCircleActive,
                    state === "upcoming" && s.stepperCircleUpcoming,
                  )}
                >
                  {state === "complete" ? (
                    <Icon name="check" size="sm" />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>

                {/* Connector */}
                {!isLast && (
                  <div
                    aria-hidden="true"
                    className={cn(
                      s.stepperConnector,
                      "transition-colors duration-300",
                      isHorizontal ? "mx-2" : "w-0.5 h-8 mx-auto my-1",
                      state === "complete"
                        ? s.stepperConnectorComplete
                        : s.stepperConnectorIncomplete,
                    )}
                  />
                )}
              </div>

              {/* Label */}
              <div className={cn(isHorizontal ? "text-center" : "pb-8")}>
                <p
                  className={cn(
                    s.stepperLabel,
                    state === "active"
                      ? "text-primary"
                      : state === "complete"
                        ? "text-secondary"
                        : "text-muted-foreground",
                  )}
                >
                  {step.label}
                  <span className="sr-only">
                    {state === "complete"
                      ? " (completed)"
                      : state === "active"
                        ? " (current)"
                        : " (upcoming)"}
                  </span>
                </p>
                {step.description && (
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  },
);

Stepper.displayName = "Stepper";

export { Stepper, stepperVariants };
export type { StepperProps, StepItem };
