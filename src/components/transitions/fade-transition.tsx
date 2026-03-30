"use client";

import { forwardRef, type ReactNode } from "react";
import { Transition } from "./transition";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type FadeTransitionProps = {
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
/*  FadeTransition                                                             */
/* -------------------------------------------------------------------------- */

const FadeTransition = forwardRef<HTMLDivElement, FadeTransitionProps>(
  ({ show, duration = 200, unmountOnExit = true, children, className }, ref) => {
    return (
      <Transition
        ref={ref}
        show={show}
        enter="transition-opacity ease-out"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-in"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        duration={duration}
        unmountOnExit={unmountOnExit}
        className={className}
      >
        {children}
      </Transition>
    );
  },
);
FadeTransition.displayName = "FadeTransition";

/* -------------------------------------------------------------------------- */
/*  Exports                                                                    */
/* -------------------------------------------------------------------------- */

export { FadeTransition };
export type { FadeTransitionProps };
