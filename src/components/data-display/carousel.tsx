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
import { usePrefersReducedMotion } from "../../hooks/use-prefers-reduced-motion";
import { useLocale } from "../../lib/locale";

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
  /** Enable autoplay (alternative boolean API) */
  autoplay?: boolean;
  /** Autoplay interval in ms (used with boolean autoplay prop) */
  interval?: number;
  /** Loop back to start */
  loop?: boolean;
  /** Alias for loop — continuously cycle slides */
  continuous?: boolean;
  /** Pause autoplay on hover */
  pauseOnHover?: boolean;
  /** Alignment */
  align?: "start" | "center" | "end";
  /** Show progress indicator (bar below carousel) */
  progress?: boolean;
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
      autoplay,
      interval = 5000,
      loop = false,
      continuous,
      pauseOnHover = true,
      align: _align = "start",
      progress = false,
      ...props
    },
    ref
  ) => {
    const { t } = useLocale();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);
    const touchStartRef = useRef<number | null>(null);
    const touchDeltaRef = useRef<number>(0);
    const reducedMotion = usePrefersReducedMotion();

    const slides = Array.isArray(children) ? children : [children];
    const totalSlides = slides.length;
    const maxIndex = Math.max(0, totalSlides - slidesPerView);

    // Resolve loop: `continuous` prop takes precedence, then `loop`
    const shouldLoop = continuous ?? loop;

    // Resolve autoplay: `autoplay` boolean prop takes precedence over numeric `autoPlay`
    const resolvedAutoPlayInterval = autoplay
      ? interval
      : autoPlay;

    const goTo = useCallback(
      (index: number) => {
        if (shouldLoop) {
          setCurrentIndex(((index % totalSlides) + totalSlides) % totalSlides);
        } else {
          setCurrentIndex(Math.min(Math.max(0, index), maxIndex));
        }
      },
      [shouldLoop, totalSlides, maxIndex]
    );

    const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
    const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

    // Autoplay — disabled when user prefers reduced motion
    useEffect(() => {
      if (resolvedAutoPlayInterval <= 0 || isPaused || reducedMotion) return;
      const timer = setInterval(goNext, resolvedAutoPlayInterval);
      return () => clearInterval(timer);
    }, [resolvedAutoPlayInterval, isPaused, goNext, reducedMotion]);

    // Touch support
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
      touchStartRef.current = e.touches[0].clientX;
      touchDeltaRef.current = 0;
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
      if (touchStartRef.current === null) return;
      touchDeltaRef.current = e.touches[0].clientX - touchStartRef.current;
    }, []);

    const handleTouchEnd = useCallback(() => {
      const delta = touchDeltaRef.current;
      const threshold = 50;
      if (Math.abs(delta) > threshold) {
        if (delta < 0) {
          goNext();
        } else {
          goPrev();
        }
      }
      touchStartRef.current = null;
      touchDeltaRef.current = 0;
    }, [goNext, goPrev]);

    const canGoPrev = shouldLoop || currentIndex > 0;
    const canGoNext = shouldLoop || currentIndex < maxIndex;

    const progressPercent = totalSlides > 1 ? ((currentIndex + 1) / (maxIndex + 1)) * 100 : 100;

    return (
      <div
        ref={ref}
        className={cn("relative group", className)}
        onMouseEnter={pauseOnHover ? () => setIsPaused(true) : undefined}
        onMouseLeave={pauseOnHover ? () => setIsPaused(false) : undefined}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="region"
        aria-roledescription="carousel"
        aria-label={t("carousel.carousel", "Carousel")}
        {...props}
      >
        {/* Track */}
        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className={cn(
              "flex transition-transform duration-300 ease-out",
              reducedMotion && "transition-none"
            )}
            style={{
              gap: `${gap}px`,
              // eslint-disable-next-line react-hooks/refs -- intentional: read track width for slide offset calculation
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
                "w-9 h-9 rounded-full bg-surface/90 border border-muted shadow-sm",
                "flex items-center justify-center text-muted-foreground",
                "hover:bg-surface hover:shadow-md transition-all",
                "disabled:opacity-0 disabled:pointer-events-none",
                "opacity-0 group-hover:opacity-100"
              )}
              aria-label={t("carousel.previous", "Previous slide")}
            >
              <Icon name="chevron-left" size="sm" />
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!canGoNext}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 z-10",
                "w-9 h-9 rounded-full bg-surface/90 border border-muted shadow-sm",
                "flex items-center justify-center text-muted-foreground",
                "hover:bg-surface hover:shadow-md transition-all",
                "disabled:opacity-0 disabled:pointer-events-none",
                "opacity-0 group-hover:opacity-100"
              )}
              aria-label={t("carousel.next", "Next slide")}
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
                aria-label={`${t("carousel.goToSlide", "Go to slide")} ${i + 1}`}
                onClick={() => goTo(i)}
                className={cn(
                  "rounded-full transition-all",
                  i === currentIndex
                    ? "w-6 h-2 bg-primary"
                    : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
              />
            ))}
          </div>
        )}

        {/* Progress bar */}
        {progress && totalSlides > slidesPerView && (
          <div
            className="mt-4 h-1 w-full rounded-full bg-muted overflow-hidden"
            role="progressbar"
            aria-valuenow={Math.round(progressPercent)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t("carousel.progress", "Carousel progress")}
          >
            <div
              className={cn(
                "h-full bg-primary rounded-full transition-all duration-300",
                reducedMotion && "transition-none"
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>
    );
  }
);
Carousel.displayName = "Carousel";

export { Carousel };
export type { CarouselProps };
