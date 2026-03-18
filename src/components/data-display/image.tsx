"use client";

import {
  forwardRef,
  useState,
  useEffect,
  useRef,
  type ImgHTMLAttributes,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Icon } from "./icon";

/* -------------------------------------------------------------------------- */
/*  Variants                                                                   */
/* -------------------------------------------------------------------------- */

const imageVariants = cva("relative overflow-hidden bg-slate-100", {
  variants: {
    radius: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-lg",
      lg: "rounded-xl",
      xl: "rounded-2xl",
      full: "rounded-full",
    },
  },
  defaultVariants: {
    radius: "md",
  },
});

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type ImageObjectFit = "cover" | "contain" | "fill" | "none" | "scale-down";

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "placeholder"> &
  VariantProps<typeof imageVariants> & {
    /** Aspect ratio (width/height). When set, the container maintains this ratio. */
    aspectRatio?: number;
    /** How the image should fit its container */
    objectFit?: ImageObjectFit;
    /** Custom fallback content shown when the image fails to load */
    fallback?: ReactNode;
    /** Icon name for the error fallback (default: "image") */
    fallbackIcon?: string;
    /** Width of the container (CSS value) */
    width?: number | string;
    /** Height of the container (CSS value) */
    height?: number | string;
  };

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

const Image = forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      alt = "",
      aspectRatio,
      objectFit = "cover",
      radius,
      fallback,
      fallbackIcon = "image",
      width,
      height,
      className,
      style,
      onLoad: onLoadProp,
      onError: onErrorProp,
      ...props
    },
    ref,
  ) => {
    const [status, setStatus] = useState<"idle" | "loading" | "loaded" | "error">(
      src ? "loading" : "idle",
    );
    const internalRef = useRef<HTMLImageElement>(null);

    // Reset status when src changes
    useEffect(() => {
      if (!src) {
        setStatus("idle");
        return;
      }
      setStatus("loading");
    }, [src]);

    // Check if image is already cached (complete before onLoad fires)
    useEffect(() => {
      if (!src || status !== "loading") return;
      const raf = requestAnimationFrame(() => {
        const img = internalRef.current;
        if (img?.complete && img.naturalWidth > 0) {
          setStatus("loaded");
        }
      });
      return () => cancelAnimationFrame(raf);
    }, [src, status]);

    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setStatus("loaded");
      onLoadProp?.(e);
    };

    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setStatus("error");
      onErrorProp?.(e);
    };

    const objectFitClass = {
      cover: "object-cover",
      contain: "object-contain",
      fill: "object-fill",
      none: "object-none",
      "scale-down": "object-scale-down",
    }[objectFit];

    const containerStyle: React.CSSProperties = {
      ...style,
      ...(width !== undefined ? { width: typeof width === "number" ? `${width}px` : width } : {}),
      ...(height !== undefined ? { height: typeof height === "number" ? `${height}px` : height } : {}),
      ...(aspectRatio !== undefined ? { aspectRatio: String(aspectRatio) } : {}),
    };

    const showSkeleton = status === "loading";
    const showError = status === "error" || status === "idle";
    const showImage = src && status !== "error" && status !== "idle";

    return (
      <div
        className={cn(imageVariants({ radius }), className)}
        style={containerStyle}
      >
        {/* Skeleton placeholder */}
        {showSkeleton && (
          <div className="absolute inset-0 animate-pulse bg-slate-200" />
        )}

        {/* Error / empty fallback */}
        {showError && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400">
            {fallback ?? (
              <Icon name={fallbackIcon} size="lg" className="text-slate-300" />
            )}
          </div>
        )}

        {/* Actual image */}
        {showImage && (
          <img
            ref={(el) => {
              (internalRef as React.MutableRefObject<HTMLImageElement | null>).current = el;
              if (typeof ref === "function") ref(el);
              else if (ref) (ref as React.MutableRefObject<HTMLImageElement | null>).current = el;
            }}
            src={src}
            alt={alt}
            loading="lazy"
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              "w-full h-full transition-opacity duration-300",
              objectFitClass,
              status === "loaded" ? "opacity-100" : "opacity-0",
            )}
            {...props}
          />
        )}
      </div>
    );
  },
);
Image.displayName = "Image";

export { Image, imageVariants };
export type { ImageProps, ImageObjectFit };
