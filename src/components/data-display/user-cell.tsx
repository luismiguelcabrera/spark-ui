import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Avatar } from "./avatar";

type UserCellProps = {
  avatarSrc?: string;
  avatarInitials?: string;
  name: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "children">;

const sizeMap = {
  sm: { avatar: "sm" as const, name: "text-sm", subtitle: "text-xs" },
  md: { avatar: "md" as const, name: "text-sm font-semibold", subtitle: "text-xs" },
  lg: { avatar: "lg" as const, name: "text-base font-semibold", subtitle: "text-sm" },
};

const UserCell = forwardRef<HTMLDivElement, UserCellProps>(
  (
    {
      avatarSrc,
      avatarInitials,
      name,
      subtitle,
      size = "md",
      className,
      ...props
    },
    ref
  ) => {
    const sz = sizeMap[size];

    return (
      <div ref={ref} className={cn("flex items-center gap-3", className)} {...props}>
        <Avatar
          src={avatarSrc}
          initials={avatarInitials}
          alt={name}
          size={sz.avatar}
        />
        <div className="flex flex-col min-w-0">
          <span className={cn("text-navy-text truncate", sz.name)}>{name}</span>
          {subtitle && (
            <span className={cn(s.textMuted, "text-muted-foreground truncate", sz.subtitle)}>
              {subtitle}
            </span>
          )}
        </div>
      </div>
    );
  }
);
UserCell.displayName = "UserCell";

export { UserCell };
export type { UserCellProps };
