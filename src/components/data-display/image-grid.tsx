"use client";

import { forwardRef, useState, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type ImageGridItem = {
  /** Image source URL */
  src: string;
  /** Alt text */
  alt: string;
  /** Aspect ratio (default: 1) */
  aspectRatio?: number;
  /** Column span (for masonry-like layouts) */
  span?: 1 | 2;
};

type ImageGridProps = HTMLAttributes<HTMLDivElement> & {
  /** Images to display */
  images: ImageGridItem[];
  /** Number of columns */
  cols?: 2 | 3 | 4 | 5 | 6;
  /** Gap between images */
  gap?: "1" | "2" | "3" | "4";
  /** Border radius */
  rounded?: "none" | "md" | "lg" | "xl" | "2xl";
  /** Click handler for individual images */
  onImageClick?: (image: ImageGridItem, index: number) => void;
  /** Show overlay on hover */
  showOverlay?: boolean;
};

const colsMap: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

const roundedMap = {
  none: "rounded-none",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
};

const ImageGrid = forwardRef<HTMLDivElement, ImageGridProps>(
  (
    {
      className,
      images,
      cols = 3,
      gap = "2",
      rounded = "xl",
      onImageClick,
      showOverlay = false,
      ...props
    },
    ref
  ) => {
    const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

    return (
      <div
        ref={ref}
        className={cn("grid", colsMap[cols], `gap-${gap}`, className)}
        {...props}
      >
        {images.map((image, index) => {
          if (failedImages.has(index)) return null;

          return (
            <div
              key={`${image.src}-${index}`}
              className={cn(
                "relative overflow-hidden group",
                roundedMap[rounded],
                image.span === 2 && "col-span-2",
                onImageClick && "cursor-pointer"
              )}
              style={{ aspectRatio: image.aspectRatio ?? 1 }}
              onClick={() => onImageClick?.(image, index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => setFailedImages((prev) => new Set(prev).add(index))}
              />
              {showOverlay && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              )}
            </div>
          );
        })}
      </div>
    );
  }
);
ImageGrid.displayName = "ImageGrid";

export { ImageGrid };
export type { ImageGridProps, ImageGridItem };
