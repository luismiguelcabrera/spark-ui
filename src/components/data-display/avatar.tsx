"use client";

import {
  forwardRef,
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Icon } from "./icon";

// ---------------------------------------------------------------------------
// Context — AvatarGroup propagates size & shape to children
// ---------------------------------------------------------------------------
type AvatarGroupContextValue = {
  size?: AvatarSize;
  shape?: AvatarShape;
  statusRingClass?: string;
};
export const AvatarGroupContext = createContext<AvatarGroupContextValue | null>(
  null
);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
type AvatarColor =
  | "default"
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info";
type AvatarVariant = "elevated" | "flat" | "tonal" | "outlined";
type AvatarShape = "circle" | "square" | "rounded";
type AvatarStatus = "online" | "offline" | "busy" | "away";

// ---------------------------------------------------------------------------
// CVA variants
// ---------------------------------------------------------------------------
const avatarVariants = cva(
  "relative inline-flex items-center justify-center overflow-hidden shrink-0",
  {
    variants: {
      size: {
        xs: "w-6 h-6 text-[10px]",
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-12 h-12 text-base",
        xl: "w-16 h-16 text-lg",
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-none",
        rounded: "rounded-lg",
      },
      ring: {
        none: "",
        white: "ring-2 ring-white",
        primary: "ring-2 ring-primary",
      },
    },
    defaultVariants: {
      size: "md",
      shape: "circle",
      ring: "none",
    },
  }
);

// ---------------------------------------------------------------------------
// Color × Variant matrix (WCAG AA compliant in both light & dark)
// ---------------------------------------------------------------------------
const colorMap: Record<AvatarColor, Record<AvatarVariant, string>> = {
  default: {
    elevated: "bg-muted text-muted-foreground shadow-md",
    flat: "bg-muted text-muted-foreground",
    tonal: "bg-muted/50 text-muted-foreground",
    outlined: "border-2 border-muted-foreground/30 text-muted-foreground",
  },
  primary: {
    elevated: "bg-primary-dark text-white shadow-md shadow-primary/25",
    flat: "bg-primary-dark text-white",
    tonal: "bg-primary/15 text-primary-text",
    outlined: "border-2 border-primary text-primary-text",
  },
  secondary: {
    elevated: "bg-secondary text-on-secondary shadow-md shadow-secondary/10",
    flat: "bg-secondary text-on-secondary",
    tonal: "bg-secondary/10 text-navy-text",
    outlined: "border-2 border-secondary/40 text-navy-text",
  },
  accent: {
    elevated: "bg-accent text-on-bright shadow-md shadow-accent/25",
    flat: "bg-accent text-on-bright",
    tonal: "bg-accent/15 text-accent-text",
    outlined: "border-2 border-accent text-accent-text",
  },
  success: {
    elevated: "bg-success text-on-bright shadow-md shadow-success/25",
    flat: "bg-success text-on-bright",
    tonal: "bg-success/15 text-success-text",
    outlined: "border-2 border-success text-success-text",
  },
  warning: {
    elevated: "bg-warning text-on-bright shadow-md shadow-warning/25",
    flat: "bg-warning text-on-bright",
    tonal: "bg-warning/15 text-warning-text",
    outlined: "border-2 border-warning text-warning-text",
  },
  danger: {
    elevated: "bg-destructive text-on-bright shadow-md shadow-destructive/25",
    flat: "bg-destructive text-on-bright",
    tonal: "bg-destructive/15 text-destructive-text",
    outlined: "border-2 border-destructive text-destructive-text",
  },
  info: {
    elevated: "bg-primary-dark text-white shadow-md shadow-primary/25",
    flat: "bg-primary-dark text-white",
    tonal: "bg-primary/15 text-primary-text",
    outlined: "border-2 border-primary text-primary-text",
  },
};

const statusColorMap: Record<AvatarStatus, string> = {
  online: "bg-success",
  offline: "bg-muted-foreground",
  busy: "bg-destructive",
  away: "bg-warning",
};

const statusSizeMap: Record<AvatarSize, string> = {
  xs: "w-1.5 h-1.5",
  sm: "w-2 h-2",
  md: "w-2.5 h-2.5",
  lg: "w-3 h-3",
  xl: "w-4 h-4",
};

const statusPositionMap: Record<AvatarShape, string> = {
  circle: "bottom-0 right-0",
  square: "-bottom-0.5 -right-0.5",
  rounded: "bottom-0 right-0",
};

const iconSizeMap = {
  xs: "sm",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
} as const;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
type AvatarProps = {
  /** Image URL */
  src?: string;
  /** Responsive image sources */
  srcSet?: string;
  /** Responsive image sizes */
  sizes?: string;
  /** Alt text for the image & aria-label fallback */
  alt?: string;
  /** Initials to show when there is no image */
  initials?: string;
  /** Fallback icon — name string resolved via Icon, or a ReactNode */
  icon?: string | ReactNode;
  /** Custom fallback content — overrides initials/icon when no image */
  fallback?: ReactNode;
  /** Color palette */
  color?: AvatarColor;
  /** Visual style variant */
  variant?: AvatarVariant;
  /** Shape of the avatar */
  shape?: AvatarShape;
  /** Online/offline status indicator dot */
  status?: AvatarStatus;
  /** Called when image loading status changes */
  onLoadingStatusChange?: (status: "loading" | "loaded" | "error") => void;
  className?: string;
} & Omit<VariantProps<typeof avatarVariants>, "shape">;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      srcSet,
      sizes,
      alt = "",
      initials,
      icon,
      fallback,
      color = "default",
      variant = "tonal",
      shape: shapeProp,
      status,
      size: sizeProp,
      ring,
      onLoadingStatusChange,
      className,
    },
    ref
  ) => {
    const groupCtx = useContext(AvatarGroupContext);
    const size = sizeProp ?? groupCtx?.size ?? "md";
    const shape = shapeProp ?? groupCtx?.shape ?? "circle";
    const statusRingClass = groupCtx?.statusRingClass ?? "ring-surface";

    const [imgLoaded, setImgLoaded] = useState(false);
    const [imgError, setImgError] = useState(false);

    // Keep latest callback in a ref so handlers never go stale
    const onStatusRef = useRef(onLoadingStatusChange);
    onStatusRef.current = onLoadingStatusChange;

    useEffect(() => {
      setImgLoaded(false); // eslint-disable-line react-hooks/set-state-in-effect -- reset on src change
      setImgError(false);
      if (src) onStatusRef.current?.("loading");
    }, [src]);

    const showFallback = !src || imgError;

    return (
      <div
        ref={ref}
        role="img"
        aria-label={alt || initials || "Avatar"}
        className={cn(
          avatarVariants({ size, shape, ring }),
          colorMap[color][variant],
          className
        )}
      >
        {/* Skeleton — shown while image is fetching */}
        {src && !imgLoaded && !imgError && (
          <span className="absolute inset-0 animate-pulse bg-muted motion-reduce:animate-none" />
        )}

        {/* Fallback: custom > icon > initials > first letter of alt > "?" */}
        {showFallback &&
          (fallback ??
            (icon ? (
              typeof icon === "string" ? (
                <Icon name={icon} size={iconSizeMap[size]} className="text-current" />
              ) : (
                icon
              )
            ) : (
              <span aria-hidden="true" className="font-bold">
                {initials ?? (alt ? alt.charAt(0).toUpperCase() : "?")}
              </span>
            )))}

        {/* Image — key={src} forces remount so cached images are detected */}
        {src && !imgError && (
          <img
            key={src}
            src={src}
            srcSet={srcSet}
            sizes={sizes}
            alt={alt}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-300 motion-reduce:transition-none",
              imgLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => {
              setImgLoaded(true);
              onStatusRef.current?.("loaded");
            }}
            onError={() => {
              setImgError(true);
              onStatusRef.current?.("error");
            }}
          />
        )}

        {/* Status indicator */}
        {status && (
          <span
            aria-label={status}
            className={cn(
              "absolute block rounded-full ring-2",
              statusRingClass,
              statusColorMap[status],
              statusSizeMap[size],
              statusPositionMap[shape]
            )}
          />
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar, avatarVariants, colorMap as avatarColorMap };
export type {
  AvatarProps,
  AvatarSize,
  AvatarColor,
  AvatarVariant,
  AvatarShape,
  AvatarStatus,
};
