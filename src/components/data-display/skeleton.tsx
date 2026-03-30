import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";

type SkeletonType = "text" | "circle" | "card" | "list-item" | "article" | "table";

type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
  /** Predefined skeleton layout */
  type?: SkeletonType;
  /** Disable animation — static gray shapes only */
  boilerplate?: boolean;
};

const baseClasses = (boilerplate: boolean) =>
  boilerplate ? "bg-slate-200 rounded-lg" : s.skeletonBase;

const circleClasses = (boilerplate: boolean) =>
  boilerplate ? "bg-slate-200 rounded-full" : s.skeletonCircle;

/** Renders a text block skeleton (multiple lines) */
function SkeletonTextBlock({ boilerplate = false }: { boilerplate?: boolean }) {
  return (
    <div className="space-y-2">
      <div className={cn(baseClasses(boilerplate), "h-3 w-full")} />
      <div className={cn(baseClasses(boilerplate), "h-3 w-full")} />
      <div className={cn(baseClasses(boilerplate), "h-3 w-2/3")} />
    </div>
  );
}

/** Renders a circle skeleton */
function SkeletonCircleBlock({ boilerplate = false }: { boilerplate?: boolean }) {
  return <div className={cn(circleClasses(boilerplate), "w-12 h-12")} />;
}

/** Renders a card skeleton (image area + text lines) */
function SkeletonCardBlock({ boilerplate = false }: { boilerplate?: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-100 overflow-hidden">
      <div className={cn(baseClasses(boilerplate), "h-40 w-full rounded-none")} />
      <div className="p-4 space-y-3">
        <div className={cn(baseClasses(boilerplate), "h-4 w-3/4")} />
        <div className={cn(baseClasses(boilerplate), "h-3 w-full")} />
        <div className={cn(baseClasses(boilerplate), "h-3 w-1/2")} />
      </div>
    </div>
  );
}

/** Renders a list-item skeleton (avatar + text lines) */
function SkeletonListItemBlock({ boilerplate = false }: { boilerplate?: boolean }) {
  return (
    <div className="flex items-start gap-3 py-3 px-4">
      <div className={cn(circleClasses(boilerplate), "w-10 h-10 shrink-0")} />
      <div className="flex-1 space-y-2">
        <div className={cn(baseClasses(boilerplate), "h-4 w-1/3")} />
        <div className={cn(baseClasses(boilerplate), "h-3 w-2/3")} />
      </div>
    </div>
  );
}

/** Renders an article skeleton (title + paragraph lines) */
function SkeletonArticleBlock({ boilerplate = false }: { boilerplate?: boolean }) {
  return (
    <div className="space-y-4">
      <div className={cn(baseClasses(boilerplate), "h-6 w-2/3")} />
      <div className="space-y-2">
        <div className={cn(baseClasses(boilerplate), "h-3 w-full")} />
        <div className={cn(baseClasses(boilerplate), "h-3 w-full")} />
        <div className={cn(baseClasses(boilerplate), "h-3 w-full")} />
        <div className={cn(baseClasses(boilerplate), "h-3 w-4/5")} />
      </div>
      <div className="space-y-2">
        <div className={cn(baseClasses(boilerplate), "h-3 w-full")} />
        <div className={cn(baseClasses(boilerplate), "h-3 w-full")} />
        <div className={cn(baseClasses(boilerplate), "h-3 w-3/5")} />
      </div>
    </div>
  );
}

/** Renders a table skeleton (header + rows) */
function SkeletonTableBlock({ boilerplate = false }: { boilerplate?: boolean }) {
  return (
    <div className="space-y-2">
      {/* Header row */}
      <div className="flex gap-4">
        <div className={cn(baseClasses(boilerplate), "h-4 flex-1")} />
        <div className={cn(baseClasses(boilerplate), "h-4 flex-1")} />
        <div className={cn(baseClasses(boilerplate), "h-4 flex-1")} />
      </div>
      {/* Data rows */}
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4">
          <div className={cn(baseClasses(boilerplate), "h-3 flex-1")} />
          <div className={cn(baseClasses(boilerplate), "h-3 flex-1")} />
          <div className={cn(baseClasses(boilerplate), "h-3 flex-1")} />
        </div>
      ))}
    </div>
  );
}

const typeRenderers: Record<SkeletonType, (boilerplate: boolean) => JSX.Element> = {
  text: (bp) => <SkeletonTextBlock boilerplate={bp} />,
  circle: (bp) => <SkeletonCircleBlock boilerplate={bp} />,
  card: (bp) => <SkeletonCardBlock boilerplate={bp} />,
  "list-item": (bp) => <SkeletonListItemBlock boilerplate={bp} />,
  article: (bp) => <SkeletonArticleBlock boilerplate={bp} />,
  table: (bp) => <SkeletonTableBlock boilerplate={bp} />,
};

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, type, boilerplate = false, ...props }, ref) => {
    if (type) {
      return (
        <div ref={ref} className={className} {...props}>
          {typeRenderers[type](boilerplate)}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(baseClasses(boilerplate), "h-4 w-full", className)}
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";

function SkeletonText({
  lines = 3,
  className,
  boilerplate = false,
}: {
  lines?: number;
  className?: string;
  boilerplate?: boolean;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            baseClasses(boilerplate),
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
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
  boilerplate?: boolean;
}) {
  const sizeMap = { sm: "w-8 h-8", md: "w-12 h-12", lg: "w-16 h-16" };
  return <div className={cn(circleClasses(boilerplate), sizeMap[size], className)} />;
}

export { Skeleton, SkeletonText, SkeletonCircle };
export type { SkeletonProps, SkeletonType };
