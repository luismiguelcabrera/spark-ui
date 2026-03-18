import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

const sizeMap = {
  sm: "text-[16px]",
  md: "text-[20px]",
  lg: "text-[24px]",
  xl: "text-[32px]",
} as const;

type IconProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  name: string;
  filled?: boolean;
  size?: keyof typeof sizeMap;
};

const Icon = forwardRef<HTMLSpanElement, IconProps>(
  ({ name, filled = false, size = "md", className, "aria-hidden": ariaHidden, ...props }, ref) => {
    return (
      <span
        ref={ref}
        aria-hidden={ariaHidden ?? true}
        className={cn(
          "material-symbols-outlined select-none leading-none",
          filled && "icon-filled",
          sizeMap[size],
          className
        )}
        {...props}
      >
        {name}
      </span>
    );
  }
);
Icon.displayName = "Icon";

export { Icon };
export type { IconProps };
