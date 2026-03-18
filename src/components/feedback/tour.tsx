"use client";

import {
  useEffect,
  useCallback,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";
import { useControllable } from "../../hooks/use-controllable";

type TourPlacement = "top" | "bottom" | "left" | "right";

type TourStep = {
  /** CSS selector for the element to highlight */
  target?: string;
  /** Step title */
  title: string;
  /** Step description */
  description?: string;
  /** Tooltip placement relative to target */
  placement?: TourPlacement;
  /** Optional cover image or illustration */
  cover?: ReactNode;
};

type TourProps = {
  /** Array of tour steps */
  steps: TourStep[];
  /** Controlled open state */
  open?: boolean;
  /** Default open state */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Controlled current step index */
  current?: number;
  /** Default current step index */
  defaultCurrent?: number;
  /** Callback when current step changes */
  onCurrentChange?: (current: number) => void;
  /** Callback when tour finishes (user clicks Finish on last step) */
  onFinish?: () => void;
  /** Callback when tour is closed (via close button or Escape) */
  onClose?: () => void;
  /** Show mask overlay dimming the background (default true) */
  mask?: boolean;
  /** Show arrow pointing to target element (default true) */
  arrow?: boolean;
  /** Show close button (default true) */
  closable?: boolean;
  className?: string;
};

type PopoverPosition = {
  top: number;
  left: number;
  arrowTop?: number;
  arrowLeft?: number;
  arrowRotation?: string;
};

const POPOVER_OFFSET = 16;
const ARROW_SIZE = 8;

function getPopoverPosition(
  targetRect: DOMRect,
  popoverRect: { width: number; height: number },
  placement: TourPlacement
): PopoverPosition {
  const scrollX =
    typeof window !== "undefined" ? window.scrollX || window.pageXOffset : 0;
  const scrollY =
    typeof window !== "undefined" ? window.scrollY || window.pageYOffset : 0;

  const tCenterX = targetRect.left + scrollX + targetRect.width / 2;
  const tCenterY = targetRect.top + scrollY + targetRect.height / 2;

  let top = 0;
  let left = 0;
  let arrowTop: number | undefined;
  let arrowLeft: number | undefined;
  let arrowRotation = "0deg";

  switch (placement) {
    case "top":
      top = targetRect.top + scrollY - popoverRect.height - POPOVER_OFFSET;
      left = tCenterX - popoverRect.width / 2;
      arrowLeft = popoverRect.width / 2 - ARROW_SIZE;
      arrowTop = popoverRect.height - 1;
      arrowRotation = "180deg";
      break;
    case "bottom":
      top = targetRect.bottom + scrollY + POPOVER_OFFSET;
      left = tCenterX - popoverRect.width / 2;
      arrowLeft = popoverRect.width / 2 - ARROW_SIZE;
      arrowTop = -ARROW_SIZE;
      arrowRotation = "0deg";
      break;
    case "left":
      top = tCenterY - popoverRect.height / 2;
      left = targetRect.left + scrollX - popoverRect.width - POPOVER_OFFSET;
      arrowLeft = popoverRect.width - 1;
      arrowTop = popoverRect.height / 2 - ARROW_SIZE;
      arrowRotation = "90deg";
      break;
    case "right":
      top = tCenterY - popoverRect.height / 2;
      left = targetRect.right + scrollX + POPOVER_OFFSET;
      arrowLeft = -ARROW_SIZE;
      arrowTop = popoverRect.height / 2 - ARROW_SIZE;
      arrowRotation = "-90deg";
      break;
  }

  return { top, left, arrowTop, arrowLeft, arrowRotation };
}

function Tour({
  steps,
  open,
  defaultOpen,
  onOpenChange,
  current,
  defaultCurrent,
  onCurrentChange,
  onFinish,
  onClose,
  mask = true,
  arrow = true,
  closable = true,
  className,
}: TourProps) {
  const [isOpen, setIsOpen] = useControllable({
    value: open,
    defaultValue: defaultOpen ?? false,
    onChange: onOpenChange,
  });

  const [currentStep, setCurrentStep] = useControllable({
    value: current,
    defaultValue: defaultCurrent ?? 0,
    onChange: onCurrentChange,
  });

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverSize, setPopoverSize] = useState({ width: 360, height: 200 });

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  // Find and measure target element
  const updateTargetRect = useCallback(() => {
    if (typeof document === "undefined" || !step?.target) {
      setTargetRect(null);
      return;
    }

    const el = document.querySelector(step.target);
    if (el) {
      setTargetRect(el.getBoundingClientRect());
    } else {
      setTargetRect(null);
    }
  }, [step?.target]);

  // Measure popover
  useEffect(() => {
    if (!isOpen || !popoverRef.current) return;
    const rect = popoverRef.current.getBoundingClientRect();
    setPopoverSize({ width: rect.width, height: rect.height });
  }, [isOpen, currentStep]);

  // Update target rect on mount, step change, resize, and scroll
  useEffect(() => {
    if (!isOpen) return;
    updateTargetRect();

    const handleUpdate = () => updateTargetRect();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleUpdate);
      window.addEventListener("scroll", handleUpdate, true);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleUpdate);
        window.removeEventListener("scroll", handleUpdate, true);
      }
    };
  }, [isOpen, currentStep, updateTargetRect]);

  // Scroll target into view
  useEffect(() => {
    if (!isOpen || typeof document === "undefined" || !step?.target) return;
    const el = document.querySelector(step.target);
    if (el) {
      if (typeof el.scrollIntoView === "function") {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      // Update rect after scroll
      const timer = setTimeout(updateTargetRect, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, step?.target, updateTargetRect]);

  // Close handler
  const handleClose = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [setIsOpen, onClose]);

  // Next step
  const handleNext = useCallback(() => {
    if (isLastStep) {
      setIsOpen(false);
      onFinish?.();
    } else {
      setCurrentStep(currentStep + 1);
    }
  }, [isLastStep, currentStep, setCurrentStep, setIsOpen, onFinish]);

  // Previous step
  const handlePrev = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  }, [isFirstStep, currentStep, setCurrentStep]);

  // Keyboard handler
  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, handleClose]);

  if (!isOpen || !step) return null;

  const placement = step.placement ?? "bottom";
  const hasTarget = !!step.target && !!targetRect;

  // Calculate popover position
  let popoverStyle: React.CSSProperties;
  let arrowStyle: React.CSSProperties | undefined;

  if (hasTarget && targetRect) {
    const pos = getPopoverPosition(targetRect, popoverSize, placement);
    popoverStyle = {
      position: "absolute",
      top: pos.top,
      left: pos.left,
      zIndex: 52,
    };
    if (arrow && pos.arrowTop !== undefined && pos.arrowLeft !== undefined) {
      arrowStyle = {
        position: "absolute",
        top: pos.arrowTop,
        left: pos.arrowLeft,
        width: 0,
        height: 0,
        borderLeft: `${ARROW_SIZE}px solid transparent`,
        borderRight: `${ARROW_SIZE}px solid transparent`,
        borderBottom: `${ARROW_SIZE}px solid white`,
        transform: `rotate(${pos.arrowRotation})`,
        zIndex: 1,
      };
    }
  } else {
    // Centered modal style
    popoverStyle = {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 52,
    };
  }

  // Mask cutout style for target highlight
  const maskCutoutStyle: React.CSSProperties | undefined =
    hasTarget && mask && targetRect
      ? {
          position: "fixed",
          top: targetRect.top - 4,
          left: targetRect.left - 4,
          width: targetRect.width + 8,
          height: targetRect.height + 8,
          borderRadius: 4,
          boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
          zIndex: 51,
          pointerEvents: "none" as const,
        }
      : undefined;

  return (
    <>
      {/* Mask overlay */}
      {mask && !hasTarget && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={closable ? handleClose : undefined}
          aria-hidden="true"
        />
      )}

      {/* Mask cutout around target */}
      {maskCutoutStyle && <div style={maskCutoutStyle} data-testid="tour-mask" />}

      {/* Popover */}
      <div
        ref={popoverRef}
        role="dialog"
        aria-label={`Tour step ${currentStep + 1} of ${steps.length}: ${step.title}`}
        aria-modal="true"
        className={cn(
          "w-[360px] max-w-[90vw] bg-white rounded-xl shadow-xl border border-slate-200",
          className
        )}
        style={popoverStyle}
      >
        {/* Arrow */}
        {arrow && hasTarget && arrowStyle && (
          <div style={arrowStyle} data-testid="tour-arrow" />
        )}

        {/* Close button */}
        {closable && (
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label="Close tour"
          >
            <Icon name="close" size="sm" />
          </button>
        )}

        {/* Content */}
        <div className="p-5">
          {/* Cover image */}
          {step.cover && (
            <div className="mb-4 rounded-lg overflow-hidden">{step.cover}</div>
          )}

          {/* Title */}
          <h3 className="text-base font-semibold text-slate-900 pr-6">
            {step.title}
          </h3>

          {/* Description */}
          {step.description && (
            <p className="mt-1 text-sm text-slate-500">{step.description}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
          {/* Step indicator */}
          <span className="text-xs text-slate-400">
            {currentStep + 1} of {steps.length}
          </span>

          {/* Navigation buttons */}
          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Previous
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              className="px-3 py-1.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {isLastStep ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

Tour.displayName = "Tour";

export { Tour };
export type { TourProps, TourStep, TourPlacement };
