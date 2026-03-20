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

const imageVariants = cva("relative overflow-hidden bg-muted", {
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

type ImageHoverEffect = "zoom" | "shine" | "grayscale" | "blur" | "kenburns";

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
    /** Show a darkening overlay on hover */
    hoverOverlay?: boolean;
    /** Hover effect to apply */
    hoverEffect?: ImageHoverEffect;
  };

/* -------------------------------------------------------------------------- */
/*  Hover effect classes                                                       */
/* -------------------------------------------------------------------------- */

/** Classes applied to the <img> element per hover effect */
const imgEffectClasses: Record<ImageHoverEffect, string> = {
  zoom: "transition-transform duration-300 group-hover:scale-110",
  shine: "",
  grayscale: "grayscale transition-all duration-500 group-hover:grayscale-0",
  blur: "transition-all duration-300 group-hover:blur-sm",
  kenburns: "transition-transform duration-[3s] ease-out group-hover:scale-[1.15] group-hover:translate-x-[2%] group-hover:-translate-y-[1%]",
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
      hoverOverlay = false,
      hoverEffect,
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
        setStatus("idle"); // eslint-disable-line react-hooks/set-state-in-effect -- intentional: reset status when src changes
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

    const needsGroup = hoverOverlay || !!hoverEffect;
    const showSkeleton = status === "loading";
    const showError = status === "error" || status === "idle";
    const showImage = src && status !== "error" && status !== "idle";

    return (
      <div
        className={cn(imageVariants({ radius }), needsGroup && "group", className)}
        style={containerStyle}
      >
        {/* Skeleton placeholder */}
        {showSkeleton && (
          <div className="absolute inset-0 animate-pulse bg-muted" />
        )}

        {/* Error / empty fallback */}
        {showError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
            {fallback ?? (
              <Icon name={fallbackIcon} size="lg" className="text-muted-foreground" />
            )}
          </div>
        )}

        {/* Hover overlay */}
        {hoverOverlay && (
          <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/20 transition-colors" />
        )}

        {/* Shine sweep overlay */}
        {hoverEffect === "shine" && (
          <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
            <div
              className={cn(
                "absolute inset-y-0 w-1/2",
                "bg-gradient-to-r from-transparent via-white/40 to-transparent",
                "-translate-x-full skew-x-[-20deg]",
                "group-hover:animate-[spark-shine_0.8s_ease-in-out]",
              )}
            />
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
              hoverEffect && imgEffectClasses[hoverEffect],
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
export type { ImageProps, ImageObjectFit, ImageHoverEffect };
