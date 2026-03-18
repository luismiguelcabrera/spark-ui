import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(s.skeletonBase, "motion-reduce:animate-none h-4 w-full", className)}
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";

type SkeletonTextProps = HTMLAttributes<HTMLDivElement> & {
  lines?: number;
};

const SkeletonText = forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ lines = 3, className, ...props }, ref) => {
    return (
      <div ref={ref} aria-hidden="true" className={cn("space-y-2", className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              s.skeletonBase,
              "motion-reduce:animate-none h-3",
              i === lines - 1 ? "w-2/3" : "w-full"
            )}
          />
        ))}
      </div>
    );
  }
);
SkeletonText.displayName = "SkeletonText";

type SkeletonCircleProps = HTMLAttributes<HTMLDivElement> & {
  size?: "sm" | "md" | "lg";
};

const SkeletonCircle = forwardRef<HTMLDivElement, SkeletonCircleProps>(
  ({ size = "md", className, ...props }, ref) => {
    const sizeClasses = { sm: "w-8 h-8", md: "w-12 h-12", lg: "w-16 h-16" };
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(s.skeletonCircle, "motion-reduce:animate-none", sizeClasses[size], className)}
        {...props}
      />
    );
  }
);
SkeletonCircle.displayName = "SkeletonCircle";

export { Skeleton, SkeletonText, SkeletonCircle };
export type { SkeletonProps, SkeletonTextProps, SkeletonCircleProps };
