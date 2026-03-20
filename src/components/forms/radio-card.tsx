"use client";

import { forwardRef, useRef, useCallback, type ReactNode, type KeyboardEvent } from "react";
import { cn } from "../../lib/utils";
import { useControllable } from "../../hooks/use-controllable";
import { Icon } from "../data-display/icon";

type RadioCardColor = "primary" | "secondary" | "success";
type RadioCardSize = "sm" | "md" | "lg";

type RadioCardOption = {
  value: string;
  title: string;
  description?: string;
  icon?: string | ReactNode;
  disabled?: boolean;
};

type RadioCardGroupProps = {
  options: RadioCardOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  orientation?: "horizontal" | "vertical";
  size?: RadioCardSize;
  color?: RadioCardColor;
  disabled?: boolean;
  className?: string;
};

const sizeMap: Record<RadioCardSize, { card: string; title: string; desc: string; radio: string; dot: string; icon: string }> = {
  sm: {
    card: "p-3 gap-2",
    title: "text-sm font-medium",
    desc: "text-xs",
    radio: "w-4 h-4",
    dot: "w-2 h-2",
    icon: "text-base",
  },
  md: {
    card: "p-4 gap-3",
    title: "text-sm font-semibold",
    desc: "text-xs",
    radio: "w-5 h-5",
    dot: "w-2.5 h-2.5",
    icon: "text-xl",
  },
  lg: {
    card: "p-5 gap-3",
    title: "text-base font-semibold",
    desc: "text-sm",
    radio: "w-5 h-5",
    dot: "w-2.5 h-2.5",
    icon: "text-2xl",
  },
};

const colorStyles: Record<RadioCardColor, { border: string; bg: string; radioBorder: string; dot: string; ring: string }> = {
  primary: {
    border: "border-primary",
    bg: "bg-primary/5",
    radioBorder: "border-primary",
    dot: "bg-primary",
    ring: "focus-visible:ring-primary",
  },
  secondary: {
    border: "border-secondary",
    bg: "bg-secondary/5",
    radioBorder: "border-secondary",
    dot: "bg-secondary",
    ring: "focus-visible:ring-secondary",
  },
  success: {
    border: "border-success",
    bg: "bg-success/10",
    radioBorder: "border-success",
    dot: "bg-success",
    ring: "focus-visible:ring-success",
  },
};

const RadioCardGroup = forwardRef<HTMLDivElement, RadioCardGroupProps>(
  (
    {
      options,
      value: valueProp,
      defaultValue,
      onChange,
      name,
      orientation = "horizontal",
      size = "md",
      color = "primary",
      disabled: groupDisabled = false,
      className,
    },
    ref,
  ) => {
    const [current, setCurrent] = useControllable({
      value: valueProp,
      defaultValue: defaultValue ?? "",
      onChange,
    });

    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    const sizes = sizeMap[size];
    const colors = colorStyles[color];

    const enabledOptions = options.filter(
      (opt) => !opt.disabled && !groupDisabled,
    );

    const selectOption = useCallback(
      (optValue: string) => {
        const opt = options.find((o) => o.value === optValue);
        if (opt?.disabled || groupDisabled) return;
        setCurrent(optValue);
      },
      [options, groupDisabled, setCurrent],
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent, index: number) => {
        const enabledIndices = options
          .map((opt, i) => (!opt.disabled && !groupDisabled ? i : -1))
          .filter((i) => i !== -1);

        if (enabledIndices.length === 0) return;

        const currentEnabledIdx = enabledIndices.indexOf(index);
        let nextIndex: number;

        switch (e.key) {
          case "ArrowDown":
          case "ArrowRight": {
            e.preventDefault();
            const next =
              currentEnabledIdx === -1
                ? 0
                : (currentEnabledIdx + 1) % enabledIndices.length;
            nextIndex = enabledIndices[next];
            break;
          }
          case "ArrowUp":
          case "ArrowLeft": {
            e.preventDefault();
            const prev =
              currentEnabledIdx === -1
                ? enabledIndices.length - 1
                : (currentEnabledIdx - 1 + enabledIndices.length) %
                  enabledIndices.length;
            nextIndex = enabledIndices[prev];
            break;
          }
          case " ":
          case "Enter":
            e.preventDefault();
            selectOption(options[index].value);
            return;
          default:
            return;
        }

        if (nextIndex >= 0) {
          selectOption(options[nextIndex].value);
          cardRefs.current[nextIndex]?.focus();
        }
      },
      [options, groupDisabled, selectOption],
    );

    const renderIcon = (icon: string | ReactNode | undefined) => {
      if (!icon) return null;
      if (typeof icon === "string") {
        return <Icon name={icon} className={cn("text-muted-foreground", sizes.icon)} />;
      }
      return <span className={sizes.icon}>{icon}</span>;
    };

    return (
      <div
        ref={ref}
        role="radiogroup"
        className={cn(
          "flex",
          orientation === "vertical" ? "flex-col gap-3" : "flex-row flex-wrap gap-3",
          className,
        )}
      >
        {options.map((opt, index) => {
          const selected = opt.value === current;
          const isDisabled = opt.disabled || groupDisabled;
          const isInTabOrder =
            !isDisabled &&
            (current
              ? selected
              : enabledOptions.length > 0 &&
                enabledOptions[0].value === opt.value);

          return (
            <div key={opt.value} className="relative flex-1 min-w-0">
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={selected}
                onChange={() => selectOption(opt.value)}
                disabled={isDisabled}
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
              />
              <div
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                role="radio"
                aria-checked={selected}
                aria-disabled={isDisabled || undefined}
                tabIndex={isInTabOrder ? 0 : -1}
                onClick={() => selectOption(opt.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={cn(
                  "rounded-xl border-2 transition-all cursor-pointer select-none",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                  sizes.card,
                  selected
                    ? cn(colors.border, colors.bg)
                    : "border-muted hover:border-muted",
                  isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
                  colors.ring,
                )}
              >
              <div className="flex items-start gap-3">
                {/* Radio indicator */}
                <div
                  className={cn(
                    "rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                    sizes.radio,
                    selected ? colors.radioBorder : "border-muted",
                  )}
                >
                  {selected && (
                    <div
                      className={cn("rounded-full", sizes.dot, colors.dot)}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {renderIcon(opt.icon)}
                    <span className={cn(sizes.title, "text-navy-text")}>
                      {opt.title}
                    </span>
                  </div>
                  {opt.description && (
                    <p className={cn(sizes.desc, "text-muted-foreground mt-1")}>
                      {opt.description}
                    </p>
                  )}
                </div>
              </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  },
);
RadioCardGroup.displayName = "RadioCardGroup";

export { RadioCardGroup };
export type { RadioCardGroupProps, RadioCardOption, RadioCardColor, RadioCardSize };
