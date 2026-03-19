"use client";

import { forwardRef, useState, useEffect, useRef, type ReactNode } from "react";
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
      density: {
        default: "",
        comfortable: "p-1",
        compact: "p-0.5",
      },
    },
    defaultVariants: {
      size: "md",
      ring: "none",
      density: "default",
    },
  }
);

type AvatarProps = {
  src?: string;
  alt?: string;
  initials?: string;
  icon?: string | ReactNode;
  className?: string;
} & VariantProps<typeof avatarVariants>;

const iconSizeMap = {
  xs: "sm",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
} as const;

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt = "", initials, icon, size, ring, density, className }, ref) => {
    const [imgLoaded, setImgLoaded] = useState(false);
    const [imgError, setImgError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
      setImgLoaded(false); // eslint-disable-line react-hooks/set-state-in-effect -- intentional: reset image state when src changes
      setImgError(false);
      if (!src) return;
      // SSR guard: requestAnimationFrame is not available on the server
      if (typeof window === "undefined") return;
      // If the browser already has the image cached, onLoad fires synchronously
      // before React attaches the handler. Check img.complete after the next frame.
      const raf = requestAnimationFrame(() => {
        const img = imgRef.current;
        if (img?.complete) {
          if (img.naturalWidth > 0) setImgLoaded(true);
          else setImgError(true);
        }
      });
      return () => cancelAnimationFrame(raf);
    }, [src]);

    const fallbackText = initials ?? (alt ? alt.charAt(0).toUpperCase() : "?");
    const showFallback = !src || imgError;

    const iconContent = icon
      ? typeof icon === "string"
        ? <Icon name={icon} size={iconSizeMap[size ?? "md"]} className="text-gray-500" />
        : icon
      : null;

    return (
      <div
        ref={ref}
        role="img"
        aria-label={alt || initials || "Avatar"}
        className={cn(avatarVariants({ size, ring, density }), className)}
      >
        {/* Skeleton — shown while image is fetching */}
        {src && !imgLoaded && !imgError && (
          <span className="absolute inset-0 animate-pulse bg-gray-300 motion-reduce:animate-none" />
        )}

        {/* Fallback: icon > initials > first letter of alt > "?" */}
        {showFallback && (
          iconContent ?? (
            <span aria-hidden="true" className="font-bold text-gray-600">
              {fallbackText}
            </span>
          )
        )}

        {/* Image — fades in once loaded */}
        {src && !imgError && (
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-300 motion-reduce:transition-none",
              imgLoaded ? "opacity-100" : "opacity-0",
            )}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar, avatarVariants };
export type { AvatarProps };
