"use client";

import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useCallback,
  type HTMLAttributes,
} from "react";
import { cn } from "../../lib/utils";
import { Icon } from "./icon";
import { useControllable } from "../../hooks/use-controllable";
import { useLocale } from "../../lib/locale";

type GalleriaImage = {
  src: string;
  alt?: string;
  thumbnail?: string;
  caption?: string;
};

type GalleriaProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  /** Array of images to display */
  images: GalleriaImage[];
  /** Active image index (controlled) */
  value?: number;
  /** Default active index (uncontrolled) */
  defaultValue?: number;
  /** Callback when active image changes */
  onChange?: (index: number) => void;
  /** Show thumbnail strip */
  showThumbnails?: boolean;
  /** Show dot indicators */
  showIndicators?: boolean;
  /** Show image caption */
  showCaption?: boolean;
  /** Show prev/next navigation arrows */
  showNavigation?: boolean;
  /** Enable fullscreen mode */
  fullscreen?: boolean;
  /** Enable autoplay */
  autoplay?: boolean;
  /** Autoplay interval in ms */
  autoplayInterval?: number;
  /** Position of thumbnails */
  thumbnailPosition?: "bottom" | "top" | "left" | "right";
  /** Wrap around at ends */
  circular?: boolean;
};

const Galleria = forwardRef<HTMLDivElement, GalleriaProps>(
  (
    {
      className,
      images,
      value: valueProp,
      defaultValue = 0,
      onChange,
      showThumbnails = true,
      showIndicators = false,
      showCaption = false,
      showNavigation = true,
      fullscreen: fullscreenProp = false,
      autoplay = false,
      autoplayInterval = 3000,
      thumbnailPosition = "bottom",
      circular = false,
      ...props
    },
    ref
  ) => {
    const { t } = useLocale();

    const [activeIndex, setActiveIndex] = useControllable<number>({
      value: valueProp,
      defaultValue,
      onChange,
    });

    const [isFullscreen, setIsFullscreen] = useState(fullscreenProp);
    const [isPaused, setIsPaused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const totalImages = images.length;

    const goTo = useCallback(
      (index: number) => {
        if (totalImages === 0) return;
        if (circular) {
          setActiveIndex(((index % totalImages) + totalImages) % totalImages);
        } else {
          setActiveIndex(Math.max(0, Math.min(index, totalImages - 1)));
        }
      },
      [circular, totalImages, setActiveIndex]
    );

    const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
    const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

    const canGoPrev = circular || activeIndex > 0;
    const canGoNext = circular || activeIndex < totalImages - 1;

    // Autoplay
    useEffect(() => {
      if (!autoplay || isPaused || totalImages <= 1) return;
      const timer = setInterval(goNext, autoplayInterval);
      return () => clearInterval(timer);
    }, [autoplay, isPaused, autoplayInterval, goNext, totalImages]);

    // Sync fullscreen prop
    useEffect(() => {
      setIsFullscreen(fullscreenProp);
    }, [fullscreenProp]);

    // Keyboard navigation
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          goPrev();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          goNext();
        } else if (e.key === "Escape" && isFullscreen) {
          e.preventDefault();
          setIsFullscreen(false);
        } else if (e.key === "f" || e.key === "F") {
          e.preventDefault();
          setIsFullscreen((prev) => !prev);
        }
      };

      const node = containerRef.current;
      if (node) {
        node.addEventListener("keydown", handleKeyDown);
        return () => node.removeEventListener("keydown", handleKeyDown);
      }
    }, [goNext, goPrev, isFullscreen]);

    if (totalImages === 0) {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center justify-center h-64 bg-slate-100 rounded-xl text-slate-600",
            className
          )}
          {...props}
        >
          {t("galleria.noImages", "No images")}
        </div>
      );
    }

    const currentImage = images[activeIndex] ?? images[0];

    const isVerticalThumbnails =
      thumbnailPosition === "left" || thumbnailPosition === "right";

    const renderNavigation = () => {
      if (!showNavigation || totalImages <= 1) return null;
      return (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            disabled={!canGoPrev}
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 z-10",
              "w-10 h-10 rounded-full bg-black/40 text-white",
              "flex items-center justify-center",
              "hover:bg-black/60 transition-colors",
              "focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none",
              "disabled:opacity-30 disabled:cursor-not-allowed"
            )}
            aria-label={t("galleria.previous", "Previous image")}
          >
            <Icon name="chevron_left" size="md" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            disabled={!canGoNext}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 z-10",
              "w-10 h-10 rounded-full bg-black/40 text-white",
              "flex items-center justify-center",
              "hover:bg-black/60 transition-colors",
              "focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none",
              "disabled:opacity-30 disabled:cursor-not-allowed"
            )}
            aria-label={t("galleria.next", "Next image")}
          >
            <Icon name="chevron_right" size="md" />
          </button>
        </>
      );
    };

    const renderIndicators = () => {
      if (!showIndicators || totalImages <= 1) return null;
      return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goTo(idx)}
              className={cn(
                "rounded-full transition-all",
                idx === activeIndex
                  ? "w-6 h-2 bg-white"
                  : "w-2 h-2 bg-white/50 hover:bg-white/70"
              )}
              aria-label={`${t("galleria.goToImage", "Go to image")} ${idx + 1}`}
            />
          ))}
        </div>
      );
    };

    const renderThumbnails = () => {
      if (!showThumbnails || totalImages <= 1) return null;
      return (
        <div
          className={cn(
            "flex gap-2 p-2",
            isVerticalThumbnails
              ? "flex-col overflow-y-auto max-h-full"
              : "flex-row overflow-x-auto"
          )}
          role="tablist"
          aria-label="Image thumbnails"
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={idx === activeIndex}
              aria-label={`${t("galleria.thumbnail", "Thumbnail")}: ${img.alt || `${t("galleria.image", "Image")} ${idx + 1}`}`}
              onClick={() => goTo(idx)}
              className={cn(
                "shrink-0 rounded-lg overflow-hidden transition-all border-2",
                isVerticalThumbnails ? "w-16 h-12" : "w-20 h-14",
                idx === activeIndex
                  ? "border-primary ring-1 ring-primary/30 opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100",
                "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
              )}
            >
              <img
                src={img.thumbnail || img.src}
                alt=""
                role="presentation"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      );
    };

    const renderCaption = () => {
      if (!showCaption || !currentImage.caption) return null;
      return (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-3 z-10">
          <p className="text-white text-sm font-medium">
            {currentImage.caption}
          </p>
        </div>
      );
    };

    const renderMainImage = () => (
      <div
        className="relative flex-1 min-h-0 overflow-hidden bg-slate-900 rounded-lg"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative w-full h-full" aria-live="polite">
          <img
            key={activeIndex}
            src={currentImage.src}
            alt={currentImage.alt || `Image ${activeIndex + 1}`}
            className="w-full h-full object-contain transition-opacity duration-300"
          />
        </div>
        {renderNavigation()}
        {renderIndicators()}
        {renderCaption()}
      </div>
    );

    const galleryContent = (
      <div
        className={cn(
          "flex",
          isVerticalThumbnails ? "flex-row" : "flex-col",
          thumbnailPosition === "top" && "flex-col-reverse",
          thumbnailPosition === "left" && "flex-row-reverse"
        )}
        style={{ height: isFullscreen ? "100%" : undefined }}
      >
        {(thumbnailPosition === "top" || thumbnailPosition === "left") &&
          renderThumbnails()}
        {renderMainImage()}
        {(thumbnailPosition === "bottom" || thumbnailPosition === "right") &&
          renderThumbnails()}
      </div>
    );

    // Fullscreen mode
    if (isFullscreen) {
      return (
        <>
          <div
            ref={ref}
            className={cn(
              "fixed inset-0 z-50 bg-black flex flex-col",
              className
            )}
            tabIndex={0}
            role="dialog"
            aria-label={t("galleria.fullscreen", "Image gallery fullscreen")}
            {...props}
          >
            <div ref={containerRef} className="flex-1 min-h-0 flex flex-col">
              {/* Fullscreen header */}
              <div className="flex items-center justify-between px-4 py-2 bg-black/80 z-20">
                <span className="text-white text-sm">
                  {activeIndex + 1} / {totalImages}
                </span>
                <button
                  type="button"
                  onClick={() => setIsFullscreen(false)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-white flex items-center justify-center",
                    "hover:bg-white/20 transition-colors",
                    "focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                  )}
                  aria-label={t("galleria.exitFullscreen", "Exit fullscreen")}
                >
                  <Icon name="close" size="md" />
                </button>
              </div>
              {galleryContent}
            </div>
          </div>
        </>
      );
    }

    return (
      <div
        ref={ref}
        className={cn("bg-white rounded-xl overflow-hidden", className)}
        tabIndex={0}
        role="region"
        aria-label={t("galleria.gallery", "Image gallery")}
        aria-roledescription="gallery"
        {...props}
      >
        <div ref={containerRef}>{galleryContent}</div>
      </div>
    );
  }
);
Galleria.displayName = "Galleria";

export { Galleria };
export type { GalleriaProps, GalleriaImage };
