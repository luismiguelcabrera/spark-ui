"use client";

import {
  forwardRef,
  useState,
  useRef,
  useCallback,
  useEffect,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";
import { Icon } from "./icon";

type CarouselProps = HTMLAttributes<HTMLDivElement> & {
  /** Carousel items */
  children: ReactNode;
  /** Number of visible items */
  slidesPerView?: number;
  /** Gap between slides (Tailwind spacing) */
  gap?: number;
  /** Show navigation arrows */
  showArrows?: boolean;
  /** Show dot indicators */
  showDots?: boolean;
  /** Auto-play interval in ms (0 to disable) */
  autoPlay?: number;
  /** Loop back to start */
  loop?: boolean;
  /** Pause autoplay on hover */
  pauseOnHover?: boolean;
  /** Alignment */
  align?: "start" | "center" | "end";
};

const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      className,
      children,
      slidesPerView = 1,
      gap = 16,
      showArrows = true,
      showDots = true,
      autoPlay = 0,
      loop = false,
      pauseOnHover = true,
      align = "start",
      ...props
    },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);

    const slides = Array.isArray(children) ? children : [children];
    const totalSlides = slides.length;
    const maxIndex = Math.max(0, totalSlides - slidesPerView);

    const goTo = useCallback(
      (index: number) => {
        if (loop) {
          setCurrentIndex(((index % totalSlides) + totalSlides) % totalSlides);
        } else {
          setCurrentIndex(Math.min(Math.max(0, index), maxIndex));
        }
      },
      [loop, totalSlides, maxIndex]
    );

    const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
    const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

    // Autoplay
    useEffect(() => {
      if (autoPlay <= 0 || isPaused) return;
      const timer = setInterval(goNext, autoPlay);
      return () => clearInterval(timer);
    }, [autoPlay, isPaused, goNext]);

    const canGoPrev = loop || currentIndex > 0;
    const canGoNext = loop || currentIndex < maxIndex;

    return (
      <div
        ref={ref}
        className={cn("relative group", className)}
        onMouseEnter={pauseOnHover ? () => setIsPaused(true) : undefined}
        onMouseLeave={pauseOnHover ? () => setIsPaused(false) : undefined}
        role="region"
        aria-roledescription="carousel"
        aria-label="Carousel"
        {...props}
      >
        {/* Track */}
        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex transition-transform duration-300 ease-out"
            style={{
              gap: `${gap}px`,
              transform: `translateX(-${currentIndex * (100 / slidesPerView + (gap * 100) / (trackRef.current?.clientWidth ?? 1000))}%)`,
            }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                className="shrink-0"
                style={{ width: `calc((100% - ${gap * (slidesPerView - 1)}px) / ${slidesPerView})` }}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${index + 1} of ${totalSlides}`}
              >
                {slide}
              </div>
            ))}
          </div>
        </div>

        {/* Arrows */}
        {showArrows && totalSlides > slidesPerView && (
          <>
            <button
              type="button"
              onClick={goPrev}
              disabled={!canGoPrev}
              className={cn(
                "absolute left-2 top-1/2 -translate-y-1/2 z-10",
                "w-9 h-9 rounded-full bg-white/90 border border-slate-200 shadow-sm",
                "flex items-center justify-center text-slate-600",
                "hover:bg-white hover:shadow-md transition-all",
                "disabled:opacity-0 disabled:pointer-events-none",
                "opacity-0 group-hover:opacity-100"
              )}
              aria-label="Previous slide"
            >
              <Icon name="chevron-left" size="sm" />
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!canGoNext}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 z-10",
                "w-9 h-9 rounded-full bg-white/90 border border-slate-200 shadow-sm",
                "flex items-center justify-center text-slate-600",
                "hover:bg-white hover:shadow-md transition-all",
                "disabled:opacity-0 disabled:pointer-events-none",
                "opacity-0 group-hover:opacity-100"
              )}
              aria-label="Next slide"
            >
              <Icon name="chevron-right" size="sm" />
            </button>
          </>
        )}

        {/* Dots */}
        {showDots && totalSlides > slidesPerView && (
          <div className="flex items-center justify-center gap-1.5 mt-4" role="tablist">
            {Array.from({ length: maxIndex + 1 }, (_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === currentIndex}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={cn(
                  "rounded-full transition-all",
                  i === currentIndex
                    ? "w-6 h-2 bg-primary"
                    : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                )}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);
Carousel.displayName = "Carousel";

export { Carousel };
export type { CarouselProps };
