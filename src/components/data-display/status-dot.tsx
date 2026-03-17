import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const statusDotVariants = cva("inline-block rounded-full", {
  variants: {
    color: {
      green: "bg-emerald-500",
      amber: "bg-amber-500",
      red: "bg-red-500",
      blue: "bg-blue-500",
      slate: "bg-slate-400",
    },
    size: {
      sm: "size-1.5",
      md: "size-2.5",
    },
  },
  defaultVariants: {
    color: "green",
    size: "sm",
  },
});

type StatusDotProps = {
  pulse?: boolean;
  className?: string;
} & VariantProps<typeof statusDotVariants>;

function StatusDot({ color, size, pulse, className }: StatusDotProps) {
  if (pulse) {
    return (
      <span className={cn("relative flex", size === "md" ? "h-2.5 w-2.5" : "h-1.5 w-1.5")}>
        <span
          className={cn(
            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
            color === "green" && "bg-emerald-400",
            color === "amber" && "bg-amber-400",
            color === "red" && "bg-red-400",
            color === "blue" && "bg-blue-400",
            color === "slate" && "bg-slate-300"
          )}
        />
        <span className={cn(statusDotVariants({ color, size }), className)} />
      </span>
    );
  }

  return <span className={cn(statusDotVariants({ color, size }), className)} />;
}

export { StatusDot, statusDotVariants };
export type { StatusDotProps };
