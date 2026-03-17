import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";

type SkeletonProps = {
  className?: string;
};

function Skeleton({ className }: SkeletonProps) {
  return <div className={cn(s.skeletonBase, "h-4 w-full", className)} />;
}

function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            s.skeletonBase,
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
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeMap = { sm: "w-8 h-8", md: "w-12 h-12", lg: "w-16 h-16" };
  return <div className={cn(s.skeletonCircle, sizeMap[size], className)} />;
}

export { Skeleton, SkeletonText, SkeletonCircle };
export type { SkeletonProps };
