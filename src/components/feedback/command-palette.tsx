import { type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";
import { SearchInput } from "../forms/search-input";

// ── Legacy types ─────────────────────────────────────────

type CommandItem = {
  label: string;
  icon?: string;
  shortcut?: string;
};

type CommandGroup = {
  label: string;
  items: readonly CommandItem[];
};

// ── Main component ───────────────────────────────────────

type CommandPaletteProps = {
  groups?: CommandGroup[];
  placeholder?: string;
  className?: string;
  children?: ReactNode;
};

function CommandPalette({
  groups,
  placeholder = "Type a command or search\u2026",
  className,
  children,
}: CommandPaletteProps) {
  const isLegacy = !!groups;

  return (
    <div className={cn(s.commandContainer, className)}>
      <div className="px-4 pt-4 pb-2">
        <SearchInput placeholder={placeholder} />
      </div>
      <div className="max-h-80 overflow-y-auto custom-scrollbar pb-2">
        {isLegacy
          ? groups!.map((group) => (
              <div key={group.label} className={s.commandGroup}>
                <p className={s.commandGroupLabel}>{group.label}</p>
                {group.items.map((item) => (
                  <div key={item.label} className={s.commandItem}>
                    {item.icon && (
                      <Icon
                        name={item.icon}
                        size="sm"
                        className="text-slate-400"
                      />
                    )}
                    <span>{item.label}</span>
                    {item.shortcut && (
                      <span className={s.commandShortcut}>
                        {item.shortcut}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ))
          : children}
      </div>
    </div>
  );
}

// ── Compound sub-components ─────────────────────────────

function CommandPaletteGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className={s.commandGroup}>
      <p className={s.commandGroupLabel}>{label}</p>
      {children}
    </div>
  );
}

function CommandPaletteItem({
  icon,
  shortcut,
  onClick,
  children,
}: {
  icon?: string;
  shortcut?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(s.commandItem, onClick && "cursor-pointer")}
      onClick={onClick}
    >
      {icon && (
        <Icon name={icon} size="sm" className="text-slate-400" />
      )}
      <span>{children}</span>
      {shortcut && <span className={s.commandShortcut}>{shortcut}</span>}
    </div>
  );
}

CommandPalette.Group = CommandPaletteGroup;
CommandPalette.Item = CommandPaletteItem;

export { CommandPalette };
export type { CommandPaletteProps, CommandGroup, CommandItem };
