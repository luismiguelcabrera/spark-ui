import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 font-bold uppercase tracking-wider rounded-full border",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-700 border-gray-200",
        primary: "bg-primary/10 text-primary border-primary/20",
        success: "bg-green-50 text-green-700 border-green-100",
        warning: "bg-amber-50 text-amber-700 border-amber-100",
        danger: "bg-red-50 text-red-700 border-red-100",
        info: "bg-blue-50 text-blue-700 border-blue-100",
        accent: "bg-accent/10 text-accent border-accent/20",
        mint: "bg-mint/10 text-mint border-mint/20",
        purple: "bg-purple-50 text-purple-700 border-purple-100",
        indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
        live: "bg-primary text-white border-primary shadow-lg shadow-primary/30 animate-pulse",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
export type { BadgeProps };
