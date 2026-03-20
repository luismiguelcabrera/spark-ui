"use client";

import { type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";
import { useDropdownContext } from "./dropdown-context";

export type DropdownMenuItemProps = {
  icon?: string;
  danger?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
};

export function DropdownMenuItem({
  icon,
  danger,
  onClick,
  children,
  className,
}: DropdownMenuItemProps) {
  const ctx = useDropdownContext();

  return (
    <button
      type="button"
      role="menuitem"
      tabIndex={-1}
      onClick={() => {
        onClick?.();
        ctx?.close();
      }}
      className={cn(
        s.dropdownItem,
        danger && s.dropdownItemDanger,
        "focus-visible:outline-none focus-visible:bg-slate-100",
        className,
      )}
    >
      {icon && <Icon name={icon} size="sm" />}
      <span>{children}</span>
    </button>
  );
}
DropdownMenuItem.displayName = "DropdownMenuItem";
