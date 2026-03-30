"use client";

import { forwardRef, type ReactNode } from "react";
import { Transition } from "./transition";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type ScaleTransitionProps = {
  /** Whether the content is visible */
  show: boolean;
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
/*  ScaleTransition                                                            */
/* -------------------------------------------------------------------------- */

const ScaleTransition = forwardRef<HTMLDivElement, ScaleTransitionProps>(
  ({ show, duration = 200, unmountOnExit = true, children, className }, ref) => {
    return (
      <Transition
        ref={ref}
        show={show}
        enter="transition-all ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition-all ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
        duration={duration}
        unmountOnExit={unmountOnExit}
        className={className}
      >
        {children}
      </Transition>
    );
  },
);
ScaleTransition.displayName = "ScaleTransition";

/* -------------------------------------------------------------------------- */
/*  Exports                                                                    */
/* -------------------------------------------------------------------------- */

export { ScaleTransition };
export type { ScaleTransitionProps };
