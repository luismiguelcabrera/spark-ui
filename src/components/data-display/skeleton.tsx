import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";

type SkeletonProps = {
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "children">;

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-busy="true"
        aria-label="Loading"
        className={cn(s.skeletonBase, "h-4 w-full motion-reduce:animate-none", className)}
        {...props}
      />
    );
  }
);
Skeleton.displayName = "Skeleton";

type SkeletonTextProps = {
  lines?: number;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "children">;

const SkeletonText = forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ lines = 3, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-busy="true"
        aria-label="Loading text"
        className={cn("space-y-2", className)}
        {...props}
      >
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              s.skeletonBase,
              "h-3 motion-reduce:animate-none",
              i === lines - 1 ? "w-2/3" : "w-full"
            )}
          />
        ))}
      </div>
    );
  }
);
SkeletonText.displayName = "SkeletonText";

type SkeletonCircleProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "children">;

const SkeletonCircle = forwardRef<HTMLDivElement, SkeletonCircleProps>(
  ({ size = "md", className, ...props }, ref) => {
    const sizeMap = { sm: "w-8 h-8", md: "w-12 h-12", lg: "w-16 h-16" };
    return (
      <div
        ref={ref}
        role="status"
        aria-busy="true"
        aria-label="Loading"
        className={cn(s.skeletonCircle, sizeMap[size], "motion-reduce:animate-none", className)}
        {...props}
      />
    );
  }
);
SkeletonCircle.displayName = "SkeletonCircle";

export { Skeleton, SkeletonText, SkeletonCircle };
export type { SkeletonProps, SkeletonTextProps, SkeletonCircleProps };
