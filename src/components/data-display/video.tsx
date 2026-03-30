"use client";

import { forwardRef, type VideoHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------- */
/*  Variants                                                                   */
/* -------------------------------------------------------------------------- */

const videoVariants = cva("overflow-hidden bg-black", {
  variants: {
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-lg",
      lg: "rounded-xl",
      xl: "rounded-2xl",
    },
  },
  defaultVariants: {
    rounded: "md",
  },
});

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type VideoRounded = "none" | "sm" | "md" | "lg" | "xl";

type VideoProps = Omit<VideoHTMLAttributes<HTMLVideoElement>, "width" | "height"> &
  VariantProps<typeof videoVariants> & {
    /** Aspect ratio (width / height). Default is 16/9. */
    aspectRatio?: number;
    /** Poster image URL */
    poster?: string;
    /** Width of the container (CSS value) */
    width?: number | string;
    /** Height of the container (CSS value) */
    height?: number | string;
  };

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

const Video = forwardRef<HTMLVideoElement, VideoProps>(
  (
    {
      className,
      rounded,
      aspectRatio = 16 / 9,
      poster,
      width,
      height,
      style,
      ...props
    },
    ref,
  ) => {
    const containerStyle: React.CSSProperties = {
      ...style,
      ...(width !== undefined
        ? { width: typeof width === "number" ? `${width}px` : width }
        : {}),
      ...(height !== undefined
        ? { height: typeof height === "number" ? `${height}px` : height }
        : {}),
      ...(aspectRatio !== undefined ? { aspectRatio: String(aspectRatio) } : {}),
    };

    return (
      <div
        className={cn(videoVariants({ rounded }), className)}
        style={containerStyle}
      >
        <video
          ref={ref}
          controls
          poster={poster}
          className="w-full h-full object-contain"
          {...props}
        />
      </div>
    );
  },
);
Video.displayName = "Video";

export { Video, videoVariants };
export type { VideoProps, VideoRounded };
