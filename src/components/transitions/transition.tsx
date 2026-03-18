"use client";

import {
  forwardRef,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type TransitionProps = {
  /** Whether the content is visible */
  show: boolean;
  /** CSS class applied during the entire enter phase */
  enter?: string;
  /** CSS class applied at the start of the enter phase (removed after one frame) */
  enterFrom?: string;
  /** CSS class applied at the end of the enter phase */
  enterTo?: string;
  /** CSS class applied during the entire leave phase */
  leave?: string;
  /** CSS class applied at the start of the leave phase (removed after one frame) */
  leaveFrom?: string;
  /** CSS class applied at the end of the leave phase */
  leaveTo?: string;
  /** Transition duration in milliseconds */
  duration?: number;
  /** Remove the element from the DOM when hidden */
  unmountOnExit?: boolean;
  /** Content to wrap */
  children: ReactNode;
  /** Additional class names */
  className?: string;
};

/* -------------------------------------------------------------------------- */
/*  Transition                                                                 */
/* -------------------------------------------------------------------------- */

const Transition = forwardRef<HTMLDivElement, TransitionProps>(
  (
    {
      show,
      enter = "",
      enterFrom = "",
      enterTo = "",
      leave = "",
      leaveFrom = "",
      leaveTo = "",
      duration = 200,
      unmountOnExit = true,
      children,
      className,
    },
    ref,
  ) => {
    // Track whether the element should be in the DOM
    const [mounted, setMounted] = useState(show);
    // Track current transition classes
    const [transitionClasses, setTransitionClasses] = useState("");
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const rafRef = useRef<number | null>(null);

    const cleanup = useCallback(() => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }, []);

    useEffect(() => {
      cleanup();

      if (show) {
        // Mount immediately, then start enter transition
        setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect -- intentional: mount element to begin enter transition
        // Apply enter + enterFrom on same frame as mount
        setTransitionClasses(cn(enter, enterFrom));

        // Next frame: swap enterFrom → enterTo
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = requestAnimationFrame(() => {
            setTransitionClasses(cn(enter, enterTo));
          });
        });

        // After duration, clear transition classes
        timeoutRef.current = setTimeout(() => {
          setTransitionClasses("");
        }, duration);
      } else {
        // Start leave transition
        setTransitionClasses(cn(leave, leaveFrom));

        // Next frame: swap leaveFrom → leaveTo
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = requestAnimationFrame(() => {
            setTransitionClasses(cn(leave, leaveTo));
          });
        });

        // After duration, unmount if needed
        timeoutRef.current = setTimeout(() => {
          setTransitionClasses("");
          if (unmountOnExit) {
            setMounted(false);
          }
        }, duration);
      }

      return cleanup;
    }, [show, enter, enterFrom, enterTo, leave, leaveFrom, leaveTo, duration, unmountOnExit, cleanup]);

    if (!mounted && unmountOnExit) {
      return null;
    }

    return (
      <div ref={ref} className={cn(transitionClasses, className)}>
        {children}
      </div>
    );
  },
);
Transition.displayName = "Transition";

/* -------------------------------------------------------------------------- */
/*  Exports                                                                    */
/* -------------------------------------------------------------------------- */

export { Transition };
export type { TransitionProps };
