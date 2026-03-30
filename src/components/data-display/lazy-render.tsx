"use client";

import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type LazyRenderProps = {
  /** Content to render once visible */
  children: ReactNode;
  /** Placeholder shown before the content enters the viewport */
  placeholder?: ReactNode;
  /** IntersectionObserver rootMargin (e.g., "200px 0px") */
  rootMargin?: string;
  /** IntersectionObserver threshold (0–1) */
  threshold?: number;
  /** Stop observing after first intersection (default true) */
  once?: boolean;
  /** Additional class name */
  className?: string;
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

const LazyRender = forwardRef<HTMLDivElement, LazyRenderProps>(
  (
    {
      children,
      placeholder,
      rootMargin = "0px",
      threshold = 0,
      once = true,
      className,
    },
    ref,
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const el = sentinelRef.current;
      if (!el) return;

      // If already visible and once mode, don't re-observe
      if (isVisible && once) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(el);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        },
        { rootMargin, threshold },
      );

      observer.observe(el);

      return () => {
        observer.disconnect();
      };
    }, [rootMargin, threshold, once, isVisible]);

    return (
      <div
        ref={(el) => {
          sentinelRef.current = el;
          if (typeof ref === "function") ref(el);
          else if (ref)
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }}
        className={cn(className)}
      >
        {isVisible ? children : (placeholder ?? null)}
      </div>
    );
  },
);
LazyRender.displayName = "LazyRender";

export { LazyRender };
export type { LazyRenderProps };
