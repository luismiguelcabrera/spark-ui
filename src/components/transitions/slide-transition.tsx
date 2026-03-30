"use client";

import { forwardRef, type ReactNode } from "react";
import { Transition } from "./transition";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type SlideDirection = "up" | "down" | "left" | "right";

type SlideTransitionProps = {
  /** Whether the content is visible */
  show: boolean;
  /** Direction from which the element slides in */
  direction?: SlideDirection;
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
/*  Direction → class maps                                                     */
/* -------------------------------------------------------------------------- */

const slideFromClasses: Record<SlideDirection, string> = {
  up: "translate-y-4 opacity-0",
  down: "-translate-y-4 opacity-0",
  left: "translate-x-4 opacity-0",
  right: "-translate-x-4 opacity-0",
};

const slideToClasses = "translate-x-0 translate-y-0 opacity-100";

/* -------------------------------------------------------------------------- */
/*  SlideTransition                                                            */
/* -------------------------------------------------------------------------- */

const SlideTransition = forwardRef<HTMLDivElement, SlideTransitionProps>(
  (
    {
      show,
      direction = "up",
      duration = 200,
      unmountOnExit = true,
      children,
      className,
    },
    ref,
  ) => {
    return (
      <Transition
        ref={ref}
        show={show}
        enter="transition-all ease-out"
        enterFrom={slideFromClasses[direction]}
        enterTo={slideToClasses}
        leave="transition-all ease-in"
        leaveFrom={slideToClasses}
        leaveTo={slideFromClasses[direction]}
        duration={duration}
        unmountOnExit={unmountOnExit}
        className={className}
      >
        {children}
      </Transition>
    );
  },
);
SlideTransition.displayName = "SlideTransition";

/* -------------------------------------------------------------------------- */
/*  Exports                                                                    */
/* -------------------------------------------------------------------------- */

export { SlideTransition };
export type { SlideTransitionProps, SlideDirection };
