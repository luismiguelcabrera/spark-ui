"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { cva, type VariantProps } from "class-variance-authority";
import { Icon } from "./icon";

const avatarVariants = cva(
  "relative inline-flex items-center justify-center rounded-full bg-gray-200 overflow-hidden shrink-0",
  {
    variants: {
      size: {
        xs: "w-6 h-6 text-[10px]",
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-12 h-12 text-base",
        xl: "w-16 h-16 text-lg",
      },
      ring: {
        none: "",
        white: "ring-2 ring-white",
        primary: "ring-2 ring-primary",
      },
    },
    defaultVariants: {
      size: "md",
      ring: "none",
    },
  }
);

type AvatarDensity = "default" | "comfortable" | "compact";

/** Density adjustment classes per size */
const densityMap: Record<AvatarDensity, Record<string, string>> = {
  default: {
    xs: "",
    sm: "",
    md: "",
    lg: "",
    xl: "",
  },
  comfortable: {
    xs: "w-7 h-7",
    sm: "w-9 h-9",
    md: "w-11 h-11",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
  },
  compact: {
    xs: "w-5 h-5",
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
    xl: "w-12 h-12",
  },
};

/** Icon size map per avatar size */
const iconSizeMap = {
  xs: "xs" as const,
  sm: "sm" as const,
  md: "sm" as const,
  lg: "md" as const,
  xl: "lg" as const,
};

type AvatarProps = {
  src?: string;
  alt?: string;
  initials?: string;
  className?: string;
  /** Render an Icon component instead of image/initials */
  icon?: string;
  /** Adjusts sizing density */
  density?: AvatarDensity;
} & VariantProps<typeof avatarVariants>;

function Avatar({
  src,
  alt = "",
  initials,
  size = "md",
  ring,
  className,
  icon,
  density = "default",
}: AvatarProps) {
  const [imgState, setImgState] = useState<{
    src: string | undefined;
    status: "loading" | "loaded" | "error";
  }>({ src, status: "loading" });
  const imgRef = useRef<HTMLImageElement>(null);

  // React-recommended pattern: reset state when prop changes
  if (imgState.src !== src) {
    setImgState({ src, status: "loading" });
  }

  useEffect(() => {
    if (!src) return;
    const raf = requestAnimationFrame(() => {
      const img = imgRef.current;
      if (img?.complete) {
        setImgState({ src, status: img.naturalWidth > 0 ? "loaded" : "error" });
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [src]);

  const imgLoaded = imgState.status === "loaded";
  const imgError = imgState.status === "error";

  const fallbackText = initials ?? (alt ? alt.charAt(0).toUpperCase() : "?");
  const sizeKey = size ?? "md";
  const densityClass = densityMap[density]?.[sizeKey] ?? "";

  return (
    <div
      className={cn(
        avatarVariants({ size, ring }),
        densityClass,
        className,
      )}
      data-testid="avatar-root"
    >
      {/* Skeleton — shown while image is fetching */}
      {src && !imgLoaded && !imgError && (
        <span className="absolute inset-0 animate-pulse bg-gray-300" />
      )}

      {/* Icon mode — shown when icon prop is provided and no src */}
      {icon && !src && (
        <Icon
          name={icon}
          size={iconSizeMap[sizeKey]}
          className="text-gray-500"
        />
      )}

      {/* Fallback initials — shown when there is no src/icon or the image errored */}
      {(!src || imgError) && !icon && (
        <span className={cn("font-bold text-gray-500", s.textMuted)}>
          {fallbackText}
        </span>
      )}

      {/* Image — fades in once loaded */}
      {src && !imgError && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
            imgLoaded ? "opacity-100" : "opacity-0",
          )}
          onLoad={() => setImgState({ src, status: "loaded" })}
          onError={() => setImgState({ src, status: "error" })}
        />
      )}
    </div>
  );
}

export { Avatar, avatarVariants };
export type { AvatarProps, AvatarDensity };
