"use client";

import { forwardRef, useRef, useEffect, useState } from "react";
import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type ParallaxProps = {
  /** Image source URL */
  src: string;
  /** Alt text for the image */
  alt?: string;
  /** Height of the visible container in pixels */
  height: number;
  /** Scale factor — how much larger the image is than the container (default 1.5) */
  scale?: number;
  /** Additional class name */
  className?: string;
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

const Parallax = forwardRef<HTMLDivElement, ParallaxProps>(
  ({ src, alt = "", height, scale = 1.5, className }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [offset, setOffset] = useState(0);
    const rafRef = useRef<number>(0);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      // Check prefers-reduced-motion
      if (typeof window.matchMedia === "function") {
        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (motionQuery.matches) return;
      }

      const handleScroll = () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);

        rafRef.current = requestAnimationFrame(() => {
          const rect = container.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          // Calculate how far through the viewport the element has scrolled
          // 0 = element just entered bottom, 1 = element just left top
          const progress =
            (windowHeight - rect.top) / (windowHeight + rect.height);
          const clampedProgress = Math.max(0, Math.min(1, progress));

          // The extra height that can move
          const extraHeight = height * (scale - 1);
          setOffset(-extraHeight * clampedProgress);
        });
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      // Initial calculation
      handleScroll();

      return () => {
        window.removeEventListener("scroll", handleScroll);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }, [height, scale]);

    return (
      <div
        ref={(el) => {
          containerRef.current = el;
          if (typeof ref === "function") ref(el);
          else if (ref)
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }}
        className={cn("relative overflow-hidden", className)}
        style={{ height: `${height}px` }}
      >
        <img
          src={src}
          alt={alt}
          aria-hidden={!alt || undefined}
          className="absolute left-0 w-full object-cover"
          style={{
            height: `${height * scale}px`,
            top: `${offset}px`,
            willChange: "transform",
          }}
        />
      </div>
    );
  },
);
Parallax.displayName = "Parallax";

export { Parallax };
export type { ParallaxProps };
