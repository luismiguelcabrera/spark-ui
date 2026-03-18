"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { Image, type ImageHoverEffect } from "./image";
import { Masonry } from "../layout/masonry";

type ImageGridItem = {
  /** Image source URL */
  src: string;
  /** Alt text */
  alt: string;
  /** Aspect ratio (default: 1 for grid, natural for masonry) */
  aspectRatio?: number;
  /** Column span (grid layout only) */
  span?: 1 | 2;
};

type ImageGridLayout = "grid" | "masonry";

type ImageGridProps = HTMLAttributes<HTMLDivElement> & {
  /** Images to display */
  images: ImageGridItem[];
  /** Layout mode */
  layout?: ImageGridLayout;
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
  /** Hover effect applied to each image */
  hoverEffect?: ImageHoverEffect;
};

const colsMap: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

const radiusMap: Record<string, "none" | "sm" | "md" | "lg" | "xl" | "full"> = {
  none: "none",
  md: "md",
  lg: "lg",
  xl: "xl",
  "2xl": "xl",
};

const gapPxMap: Record<string, number> = {
  "1": 4,
  "2": 8,
  "3": 12,
  "4": 16,
};

const ImageGrid = forwardRef<HTMLDivElement, ImageGridProps>(
  (
    {
      className,
      images,
      layout = "grid",
      cols = 3,
      gap = "2",
      rounded = "xl",
      onImageClick,
      showOverlay = false,
      hoverEffect,
      ...props
    },
    ref
  ) => {
    const imageRadius = radiusMap[rounded];

    const renderItem = (image: ImageGridItem, index: number) => (
      <div
        key={`${image.src}-${index}`}
        className={cn(
          layout === "grid" && image.span === 2 && "col-span-2",
          onImageClick && "cursor-pointer"
        )}
        onClick={() => onImageClick?.(image, index)}
      >
        <Image
          src={image.src}
          alt={image.alt}
          radius={imageRadius}
          objectFit="cover"
          hoverOverlay={showOverlay}
          hoverEffect={hoverEffect}
          aspectRatio={layout === "grid" ? (image.aspectRatio ?? 1) : image.aspectRatio}
          className="w-full"
        />
      </div>
    );

    if (layout === "masonry") {
      return (
        <Masonry
          ref={ref}
          columns={cols}
          gap={gapPxMap[gap]}
          className={className}
          {...props}
        >
          {images.map(renderItem)}
        </Masonry>
      );
    }

    return (
      <div
        ref={ref}
        className={cn("grid", colsMap[cols], `gap-${gap}`, className)}
        {...props}
      >
        {images.map(renderItem)}
      </div>
    );
  }
);
ImageGrid.displayName = "ImageGrid";

export { ImageGrid };
export type { ImageGridProps, ImageGridItem, ImageGridLayout };
