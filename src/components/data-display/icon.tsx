import { cn } from "../../lib/utils";

const sizeMap = {
  sm: "text-[16px]",
  md: "text-[20px]",
  lg: "text-[24px]",
  xl: "text-[32px]",
} as const;

type IconProps = {
  name: string;
  filled?: boolean;
  size?: keyof typeof sizeMap;
  className?: string;
};

function Icon({ name, filled = false, size = "md", className }: IconProps) {
  return (
    <span
      className={cn(
        "material-symbols-outlined select-none leading-none",
        filled && "icon-filled",
        sizeMap[size],
        className
      )}
    >
      {name}
    </span>
  );
}

export { Icon };
export type { IconProps };
