"use client";

import { forwardRef, type ReactNode } from "react";
import { Transition } from "./transition";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type DialogTransitionProps = {
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
/*  DialogTransition                                                           */
/* -------------------------------------------------------------------------- */

const DialogTransition = forwardRef<HTMLDivElement, DialogTransitionProps>(
  ({ show, duration = 200, unmountOnExit = true, children, className }, ref) => {
    return (
      <Transition
        ref={ref}
        show={show}
        enter="transition-all ease-out"
        enterFrom="opacity-0 scale-95 translate-y-2.5"
        enterTo="opacity-100 scale-100 translate-y-0"
        leave="transition-all ease-in"
        leaveFrom="opacity-100 scale-100 translate-y-0"
        leaveTo="opacity-0 scale-95 translate-y-2.5"
        duration={duration}
        unmountOnExit={unmountOnExit}
        className={className}
      >
        {children}
      </Transition>
    );
  },
);
DialogTransition.displayName = "DialogTransition";

/* -------------------------------------------------------------------------- */
/*  Exports                                                                    */
/* -------------------------------------------------------------------------- */

export { DialogTransition };
export type { DialogTransitionProps };
