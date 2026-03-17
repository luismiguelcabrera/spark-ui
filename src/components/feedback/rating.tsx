import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";

type RatingProps = {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeMap = {
  sm: "sm" as const,
  md: "md" as const,
  lg: "lg" as const,
};

function Rating({
  value,
  max = 5,
  size = "md",
  className,
}: RatingProps) {
  const clamped = Math.min(max, Math.max(0, value));

  return (
    <div
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={`${clamped} out of ${max} stars`}
    >
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(clamped);
        const half = !filled && i < clamped;

        return (
          <Icon
            key={i}
            name={half ? "star_half" : "star"}
            filled={filled || half}
            size={sizeMap[size]}
            className={cn(
              s.ratingStar,
              filled || half ? s.ratingStarActive : s.ratingStarInactive
            )}
          />
        );
      })}
    </div>
  );
}

export { Rating };
export type { RatingProps };
