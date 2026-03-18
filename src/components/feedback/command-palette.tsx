"use client";

import { forwardRef, useRef, useCallback, type ReactNode, type KeyboardEvent } from "react";
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

const CommandPaletteBase = forwardRef<HTMLDivElement, CommandPaletteProps>(
  (
    {
      groups,
      placeholder = "Type a command or search\u2026",
      className,
      children,
    },
    ref
  ) => {
    const isLegacy = !!groups;
    const listRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        const list = listRef.current;
        if (!list) return;

        const items = Array.from(
          list.querySelectorAll<HTMLElement>('[role="option"]')
        );
        if (items.length === 0) return;

        const current = document.activeElement as HTMLElement;
        const currentIndex = items.indexOf(current);

        if (e.key === "ArrowDown") {
          e.preventDefault();
          const next = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
          items[next]?.focus();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          const prev = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
          items[prev]?.focus();
        } else if (e.key === "Enter" && currentIndex >= 0) {
          e.preventDefault();
          items[currentIndex]?.click();
        }
      },
      []
    );

    return (
      <div
        ref={ref}
        className={cn(s.commandContainer, className)}
        role="combobox"
        aria-expanded="true"
        aria-haspopup="listbox"
        onKeyDown={handleKeyDown}
      >
        <div className="px-4 pt-4 pb-2">
          <SearchInput placeholder={placeholder} aria-autocomplete="list" />
        </div>
        <div
          ref={listRef}
          role="listbox"
          className="max-h-80 overflow-y-auto custom-scrollbar pb-2"
        >
          {isLegacy
            ? groups!.map((group) => (
                <div key={group.label} className={s.commandGroup} role="group" aria-label={group.label}>
                  <p className={s.commandGroupLabel}>{group.label}</p>
                  {group.items.map((item) => (
                    <div
                      key={item.label}
                      role="option"
                      aria-selected={false}
                      tabIndex={-1}
                      className={cn(s.commandItem, "cursor-pointer focus-visible:outline-none focus-visible:bg-slate-100")}
                    >
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
);
CommandPaletteBase.displayName = "CommandPalette";

// ── Compound sub-components ─────────────────────────────

function CommandPaletteGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className={s.commandGroup} role="group" aria-label={label}>
      <p className={s.commandGroupLabel}>{label}</p>
      {children}
    </div>
  );
}
CommandPaletteGroup.displayName = "CommandPaletteGroup";

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
      role="option"
      aria-selected={false}
      tabIndex={-1}
      className={cn(s.commandItem, onClick && "cursor-pointer", "focus-visible:outline-none focus-visible:bg-slate-100")}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {icon && (
        <Icon name={icon} size="sm" className="text-slate-400" />
      )}
      <span>{children}</span>
      {shortcut && <span className={s.commandShortcut}>{shortcut}</span>}
    </div>
  );
}
CommandPaletteItem.displayName = "CommandPaletteItem";

const CommandPalette = Object.assign(CommandPaletteBase, {
  Group: CommandPaletteGroup,
  Item: CommandPaletteItem,
});

export { CommandPalette };
export type { CommandPaletteProps, CommandGroup, CommandItem };
