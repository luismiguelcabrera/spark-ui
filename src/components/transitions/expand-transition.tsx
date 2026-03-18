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

type ExpandTransitionProps = {
  /** Whether the content is expanded */
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
/*  ExpandTransition                                                           */
/* -------------------------------------------------------------------------- */

const ExpandTransition = forwardRef<HTMLDivElement, ExpandTransitionProps>(
  ({ show, duration = 200, unmountOnExit = true, children, className }, ref) => {
    const [mounted, setMounted] = useState(show);
    const [style, setStyle] = useState<React.CSSProperties>(
      show ? {} : { height: 0, overflow: "hidden", opacity: 0 },
    );
    const contentRef = useRef<HTMLDivElement>(null);
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
        // Mount immediately
        setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect -- intentional: mount element to begin expand animation

        // Start collapsed
        setStyle({
          height: 0,
          overflow: "hidden",
          opacity: 0,
          transition: `height ${duration}ms ease-out, opacity ${duration}ms ease-out`,
        });

        // Next frame: expand to measured height
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = requestAnimationFrame(() => {
            const scrollHeight = contentRef.current?.scrollHeight ?? 0;
            setStyle({
              height: scrollHeight,
              overflow: "hidden",
              opacity: 1,
              transition: `height ${duration}ms ease-out, opacity ${duration}ms ease-out`,
            });
          });
        });

        // After duration, switch to auto height
        timeoutRef.current = setTimeout(() => {
          setStyle({});
        }, duration);
      } else {
        // Start with current height
        const scrollHeight = contentRef.current?.scrollHeight ?? 0;
        setStyle({
          height: scrollHeight,
          overflow: "hidden",
          opacity: 1,
          transition: `height ${duration}ms ease-in, opacity ${duration}ms ease-in`,
        });

        // Next frame: collapse to 0
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = requestAnimationFrame(() => {
            setStyle({
              height: 0,
              overflow: "hidden",
              opacity: 0,
              transition: `height ${duration}ms ease-in, opacity ${duration}ms ease-in`,
            });
          });
        });

        // After duration, unmount
        timeoutRef.current = setTimeout(() => {
          setStyle({ height: 0, overflow: "hidden", opacity: 0 });
          if (unmountOnExit) {
            setMounted(false);
          }
        }, duration);
      }

      return cleanup;
    }, [show, duration, unmountOnExit, cleanup]);

    if (!mounted && unmountOnExit) {
      return null;
    }

    return (
      <div ref={ref} style={style} className={cn(className)}>
        <div ref={contentRef}>{children}</div>
      </div>
    );
  },
);
ExpandTransition.displayName = "ExpandTransition";

/* -------------------------------------------------------------------------- */
/*  Exports                                                                    */
/* -------------------------------------------------------------------------- */

export { ExpandTransition };
export type { ExpandTransitionProps };
