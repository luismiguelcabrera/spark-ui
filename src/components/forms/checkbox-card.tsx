"use client";

import { forwardRef, useRef, type ReactNode, type KeyboardEvent } from "react";
import { cn } from "../../lib/utils";
import { useControllable } from "../../hooks/use-controllable";
import { Icon } from "../data-display/icon";

type CheckboxCardColor = "primary" | "secondary" | "success";
type CheckboxCardSize = "sm" | "md" | "lg";

type CheckboxCardProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  value?: string;
  icon?: string | ReactNode;
  title: string;
  description?: string;
  disabled?: boolean;
  size?: CheckboxCardSize;
  color?: CheckboxCardColor;
  className?: string;
  children?: ReactNode;
};

const sizeMap: Record<CheckboxCardSize, { card: string; title: string; desc: string; check: string; icon: string }> = {
  sm: {
    card: "p-3 gap-2",
    title: "text-sm font-medium",
    desc: "text-xs",
    check: "w-4 h-4",
    icon: "text-base",
  },
  md: {
    card: "p-4 gap-3",
    title: "text-sm font-semibold",
    desc: "text-xs",
    check: "w-5 h-5",
    icon: "text-xl",
  },
  lg: {
    card: "p-5 gap-3",
    title: "text-base font-semibold",
    desc: "text-sm",
    check: "w-5 h-5",
    icon: "text-2xl",
  },
};

const colorStyles: Record<CheckboxCardColor, { border: string; bg: string; check: string; ring: string }> = {
  primary: {
    border: "border-primary",
    bg: "bg-primary/5",
    check: "bg-primary text-white border-primary",
    ring: "focus-within:ring-primary",
  },
  secondary: {
    border: "border-secondary",
    bg: "bg-secondary/5",
    check: "bg-secondary text-white border-secondary",
    ring: "focus-within:ring-secondary",
  },
  success: {
    border: "border-success",
    bg: "bg-success/10",
    check: "bg-success text-white border-success",
    ring: "focus-within:ring-success",
  },
};

const CheckboxCard = forwardRef<HTMLDivElement, CheckboxCardProps>(
  (
    {
      checked: checkedProp,
      defaultChecked = false,
      onChange,
      value,
      icon,
      title,
      description,
      disabled = false,
      size = "md",
      color = "primary",
      className,
      children,
    },
    ref,
  ) => {
    const [isChecked, setIsChecked] = useControllable({
      value: checkedProp,
      defaultValue: defaultChecked,
      onChange,
    });

    const inputRef = useRef<HTMLInputElement>(null);
    const sizes = sizeMap[size];
    const colors = colorStyles[color];

    const toggle = () => {
      if (disabled) return;
      setIsChecked(!isChecked);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        toggle();
      }
    };

    const renderIcon = () => {
      if (!icon) return null;
      if (typeof icon === "string") {
        return <Icon name={icon} className={cn("text-muted-foreground", sizes.icon)} />;
      }
      return <span className={sizes.icon}>{icon}</span>;
    };

    return (
      <div ref={ref} className={cn("relative", className)}>
        <input
          ref={inputRef}
          type="checkbox"
          checked={isChecked}
          onChange={() => toggle()}
          value={value}
          disabled={disabled}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />
        <div
          role="checkbox"
          aria-checked={isChecked}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : 0}
          onClick={toggle}
          onKeyDown={handleKeyDown}
          className={cn(
            "rounded-xl border-2 transition-all cursor-pointer select-none",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            sizes.card,
            isChecked
              ? cn(colors.border, colors.bg)
              : "border-muted hover:border-muted",
            disabled && "opacity-50 cursor-not-allowed pointer-events-none",
            colors.ring,
          )}
        >
          <div className="flex items-start gap-3">
            {/* Checkbox indicator */}
            <div
              className={cn(
                "rounded flex items-center justify-center shrink-0 border-2 transition-colors",
                sizes.check,
                isChecked ? colors.check : "border-muted bg-surface",
              )}
              aria-hidden="true"
            >
              {isChecked && (
                <svg
                  viewBox="0 0 12 12"
                  fill="none"
                  className="w-3 h-3"
                >
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {renderIcon()}
                <span className={cn(sizes.title, "text-navy-text")}>{title}</span>
              </div>
              {description && (
                <p className={cn(sizes.desc, "text-muted-foreground mt-1")}>{description}</p>
              )}
              {children && <div className="mt-2">{children}</div>}
            </div>
          </div>
        </div>
      </div>
    );
  },
);
CheckboxCard.displayName = "CheckboxCard";

export { CheckboxCard };
export type { CheckboxCardProps, CheckboxCardColor, CheckboxCardSize };
