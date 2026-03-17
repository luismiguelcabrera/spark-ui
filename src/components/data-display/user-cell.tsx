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
};

const sizeMap = {
  sm: { avatar: "sm" as const, name: "text-sm", subtitle: "text-xs" },
  md: { avatar: "md" as const, name: "text-sm font-semibold", subtitle: "text-xs" },
  lg: { avatar: "lg" as const, name: "text-base font-semibold", subtitle: "text-sm" },
};

function UserCell({
  avatarSrc,
  avatarInitials,
  name,
  subtitle,
  size = "md",
  className,
}: UserCellProps) {
  const sz = sizeMap[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Avatar
        src={avatarSrc}
        initials={avatarInitials}
        alt={name}
        size={sz.avatar}
      />
      <div className="flex flex-col min-w-0">
        <span className={cn("text-slate-900 truncate", sz.name)}>{name}</span>
        {subtitle && (
          <span className={cn(s.textMuted, "text-slate-500 truncate", sz.subtitle)}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}

export { UserCell };
export type { UserCellProps };
