"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { cva, type VariantProps } from "class-variance-authority";

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

type AvatarProps = {
  src?: string;
  alt?: string;
  initials?: string;
  className?: string;
} & VariantProps<typeof avatarVariants>;

function Avatar({
  src,
  alt = "",
  initials,
  size,
  ring,
  className,
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

  return (
    <div className={cn(avatarVariants({ size, ring, className }))}>
      {/* Skeleton — shown while image is fetching */}
      {src && !imgLoaded && !imgError && (
        <span className="absolute inset-0 animate-pulse bg-gray-300" />
      )}

      {/* Fallback initials — shown when there is no src or the image errored */}
      {(!src || imgError) && (
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
export type { AvatarProps };
