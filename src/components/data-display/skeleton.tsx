import React, { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";

// ── Types ──

type SkeletonAnimation = "pulse" | "wave" | "none";

type SkeletonType =
  | "text"
  | "circle"
  | "card"
  | "list-item"
  | "article"
  | "table"
  | "form"
  | "profile"
  | "comment";

type SkeletonBorderRadius = "none" | "sm" | "md" | "lg" | "full";

type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
  /** Predefined skeleton layout */
  type?: SkeletonType;
  /** Disable animation — static gray shapes only */
  boilerplate?: boolean;
  /** Animation style: pulse (default), wave (shimmer), or none */
  animation?: SkeletonAnimation;
  /** Number of repeated preset items (only applies when `type` is set) */
  count?: number;
  /** Custom width (e.g., "200px", "100%", "3rem") — applies to base skeleton only */
  width?: string;
  /** Custom height (e.g., "40px", "2rem") — applies to base skeleton only */
  height?: string;
  /** Border radius preset — default "md" */
  borderRadius?: SkeletonBorderRadius;
};

// ── Animation helpers ──

const borderRadiusMap: Record<SkeletonBorderRadius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-lg",
  lg: "rounded-xl",
  full: "rounded-full",
};

/**
 * Resolves the effective animation: boilerplate forces "none",
 * otherwise use the explicit prop (default "pulse").
 */
function resolveAnimation(
  animation: SkeletonAnimation | undefined,
  boilerplate: boolean
): SkeletonAnimation {
  if (boilerplate) return "none";
  return animation ?? "pulse";
}

/** Returns base (rectangular) skeleton classes for the given animation */
function baseClasses(anim: SkeletonAnimation, radius: SkeletonBorderRadius = "md"): string {
  const r = borderRadiusMap[radius];
  switch (anim) {
    case "wave":
      return cn(s.skeletonWave, r);
    case "none":
      return cn(s.skeletonStatic, r);
    case "pulse":
    default:
      return cn(s.skeletonBase, r);
  }
}

/** Returns circle skeleton classes for the given animation */
function circleClasses(anim: SkeletonAnimation): string {
  switch (anim) {
    case "wave":
      return s.skeletonWaveCircle;
    case "none":
      return s.skeletonStaticCircle;
    case "pulse":
    default:
      return s.skeletonCircle;
  }
}

// ── Preset type blocks ──

function SkeletonTextBlock({ anim }: { anim: SkeletonAnimation }) {
  return (
    <div className="space-y-2">
      <div className={cn(baseClasses(anim), "h-3 w-full")} />
      <div className={cn(baseClasses(anim), "h-3 w-full")} />
      <div className={cn(baseClasses(anim), "h-3 w-2/3")} />
    </div>
  );
}

function SkeletonCircleBlock({ anim }: { anim: SkeletonAnimation }) {
  return <div className={cn(circleClasses(anim), "w-12 h-12")} />;
}

function SkeletonCardBlock({ anim }: { anim: SkeletonAnimation }) {
  return (
    <div className="rounded-2xl border border-slate-100 overflow-hidden">
      <div className={cn(baseClasses(anim, "none"), "h-40 w-full")} />
      <div className="p-4 space-y-3">
        <div className={cn(baseClasses(anim), "h-4 w-3/4")} />
        <div className={cn(baseClasses(anim), "h-3 w-full")} />
        <div className={cn(baseClasses(anim), "h-3 w-1/2")} />
      </div>
    </div>
  );
}

function SkeletonListItemBlock({ anim }: { anim: SkeletonAnimation }) {
  return (
    <div className="flex items-start gap-3 py-3 px-4">
      <div className={cn(circleClasses(anim), "w-10 h-10 shrink-0")} />
      <div className="flex-1 space-y-2">
        <div className={cn(baseClasses(anim), "h-4 w-1/3")} />
        <div className={cn(baseClasses(anim), "h-3 w-2/3")} />
      </div>
    </div>
  );
}

function SkeletonArticleBlock({ anim }: { anim: SkeletonAnimation }) {
  return (
    <div className="space-y-4">
      <div className={cn(baseClasses(anim), "h-6 w-2/3")} />
      <div className="space-y-2">
        <div className={cn(baseClasses(anim), "h-3 w-full")} />
        <div className={cn(baseClasses(anim), "h-3 w-full")} />
        <div className={cn(baseClasses(anim), "h-3 w-full")} />
        <div className={cn(baseClasses(anim), "h-3 w-4/5")} />
      </div>
      <div className="space-y-2">
        <div className={cn(baseClasses(anim), "h-3 w-full")} />
        <div className={cn(baseClasses(anim), "h-3 w-full")} />
        <div className={cn(baseClasses(anim), "h-3 w-3/5")} />
      </div>
    </div>
  );
}

function SkeletonTableBlock({ anim }: { anim: SkeletonAnimation }) {
  return (
    <div className="space-y-2">
      {/* Header row */}
      <div className="flex gap-4">
        <div className={cn(baseClasses(anim), "h-4 flex-1")} />
        <div className={cn(baseClasses(anim), "h-4 flex-1")} />
        <div className={cn(baseClasses(anim), "h-4 flex-1")} />
      </div>
      {/* Data rows */}
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4">
          <div className={cn(baseClasses(anim), "h-3 flex-1")} />
          <div className={cn(baseClasses(anim), "h-3 flex-1")} />
          <div className={cn(baseClasses(anim), "h-3 flex-1")} />
        </div>
      ))}
    </div>
  );
}

/** Form skeleton: label + input x 3 + button */
function SkeletonFormBlock({ anim }: { anim: SkeletonAnimation }) {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="space-y-2">
          <div className={cn(baseClasses(anim), "h-3 w-24")} />
          <div className={cn(baseClasses(anim), "h-10 w-full")} />
        </div>
      ))}
      <div className={cn(baseClasses(anim), "h-10 w-32 mt-2")} />
    </div>
  );
}

/** Profile skeleton: avatar + name + bio lines */
function SkeletonProfileBlock({ anim }: { anim: SkeletonAnimation }) {
  return (
    <div className="flex flex-col items-center space-y-3">
      <div className={cn(circleClasses(anim), "w-16 h-16")} />
      <div className={cn(baseClasses(anim), "h-4 w-32")} />
      <div className="w-full space-y-2">
        <div className={cn(baseClasses(anim), "h-3 w-full")} />
        <div className={cn(baseClasses(anim), "h-3 w-full")} />
        <div className={cn(baseClasses(anim), "h-3 w-2/3")} />
      </div>
    </div>
  );
}

/** Comment skeleton: avatar + name + text block */
function SkeletonCommentBlock({ anim }: { anim: SkeletonAnimation }) {
  return (
    <div className="flex items-start gap-3">
      <div className={cn(circleClasses(anim), "w-10 h-10 shrink-0")} />
      <div className="flex-1 space-y-2">
        <div className={cn(baseClasses(anim), "h-4 w-28")} />
        <div className={cn(baseClasses(anim), "h-3 w-full")} />
        <div className={cn(baseClasses(anim), "h-3 w-full")} />
        <div className={cn(baseClasses(anim), "h-3 w-3/4")} />
      </div>
    </div>
  );
}

// ── Type renderer map ──

const typeRenderers: Record<SkeletonType, (anim: SkeletonAnimation) => React.JSX.Element> = {
  text: (a) => <SkeletonTextBlock anim={a} />,
  circle: (a) => <SkeletonCircleBlock anim={a} />,
  card: (a) => <SkeletonCardBlock anim={a} />,
  "list-item": (a) => <SkeletonListItemBlock anim={a} />,
  article: (a) => <SkeletonArticleBlock anim={a} />,
  table: (a) => <SkeletonTableBlock anim={a} />,
  form: (a) => <SkeletonFormBlock anim={a} />,
  profile: (a) => <SkeletonProfileBlock anim={a} />,
  comment: (a) => <SkeletonCommentBlock anim={a} />,
};

// ── Main component ──

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      type,
      boilerplate = false,
      animation,
      count = 1,
      width,
      height,
      borderRadius = "md",
      style,
      ...props
    },
    ref
  ) => {
    const anim = resolveAnimation(animation, boilerplate);

    // Typed preset rendering
    if (type) {
      const renderer = typeRenderers[type];
      const items = Array.from({ length: Math.max(1, count) }, (_, i) => (
        <div key={i}>{renderer(anim)}</div>
      ));

      // Single item: no wrapper needed (keep backward compat)
      if (items.length === 1) {
        return (
          <div ref={ref} className={className} style={style} {...props}>
            {renderer(anim)}
          </div>
        );
      }

      // Multiple items: wrap with spacing
      return (
        <div ref={ref} className={cn("space-y-3", className)} style={style} {...props}>
          {items}
        </div>
      );
    }

    // Base skeleton (no type)
    const customStyle: React.CSSProperties = {
      ...style,
      ...(width ? { width } : {}),
      ...(height ? { height } : {}),
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses(anim, borderRadius),
          // Only apply default h-4 w-full when no custom dimensions
          !height && "h-4",
          !width && "w-full",
          className
        )}
        style={Object.keys(customStyle).length > 0 ? customStyle : undefined}
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";

// ── Sub-components ──

function SkeletonText({
  lines = 3,
  className,
  boilerplate = false,
  animation,
}: {
  lines?: number;
  className?: string;
  boilerplate?: boolean;
  animation?: SkeletonAnimation;
}) {
  const anim = resolveAnimation(animation, boilerplate);
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            baseClasses(anim),
            "h-3",
            i === lines - 1 ? "w-2/3" : "w-full"
          )}
        />
      ))}
    </div>
  );
}

function SkeletonCircle({
  size = "md",
  className,
  boilerplate = false,
  animation,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
  boilerplate?: boolean;
  animation?: SkeletonAnimation;
}) {
  const anim = resolveAnimation(animation, boilerplate);
  const sizeMap = { sm: "w-8 h-8", md: "w-12 h-12", lg: "w-16 h-16" };
  return <div className={cn(circleClasses(anim), sizeMap[size], className)} />;
}

// ── Exports ──

export { Skeleton, SkeletonText, SkeletonCircle };
export type {
  SkeletonProps,
  SkeletonType,
  SkeletonAnimation,
  SkeletonBorderRadius,
};
