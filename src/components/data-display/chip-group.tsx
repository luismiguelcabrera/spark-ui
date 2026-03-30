"use client";

import {
  forwardRef,
  createContext,
  useContext,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { cn } from "../../lib/utils";
import { useControllable } from "../../hooks/use-controllable";

/* -------------------------------------------------------------------------- */
/*  Context                                                                    */
/* -------------------------------------------------------------------------- */

type ChipGroupContextValue = {
  /** Currently selected value(s) */
  selected: string[];
  /** Whether multiple selection is allowed */
  multiple: boolean;
  /** Toggle a chip value on/off */
  toggle: (value: string) => void;
  /** Color passed from ChipGroup */
  color?: ChipGroupColor;
};

const ChipGroupContext = createContext<ChipGroupContextValue | null>(null);

/**
 * Hook to consume ChipGroup context from within a Chip.
 * Returns `null` when the Chip is not inside a ChipGroup.
 */
function useChipGroup() {
  return useContext(ChipGroupContext);
}

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type ChipGroupColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "destructive";

type ChipGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> & {
  /** Controlled value — single string or array when `multiple` */
  value?: string | string[];
  /** Default value for uncontrolled mode */
  defaultValue?: string | string[];
  /** Callback when selection changes */
  onChange?: (value: string | string[]) => void;
  /** Allow multiple selection */
  multiple?: boolean;
  /** Keep at least one chip selected */
  mandatory?: boolean;
  /** Color applied to child Chips via context */
  color?: ChipGroupColor;
  /** Chip elements */
  children: ReactNode;
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function normalizeValue(val: string | string[] | undefined): string[] {
  if (val === undefined) return [];
  return Array.isArray(val) ? val : [val];
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

const ChipGroup = forwardRef<HTMLDivElement, ChipGroupProps>(
  (
    {
      value: valueProp,
      defaultValue,
      onChange,
      multiple = false,
      mandatory = false,
      color,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const [selected, setSelected] = useControllable<string[]>({
      value: valueProp !== undefined ? normalizeValue(valueProp) : undefined,
      defaultValue: normalizeValue(defaultValue),
      onChange: (next) => {
        onChange?.(multiple ? next : next[0] ?? "");
      },
    });

    const toggle = (chip: string) => {
      const isSelected = selected.includes(chip);

      if (isSelected) {
        // If mandatory and this is the last selected item, do nothing
        if (mandatory && selected.length <= 1) return;

        setSelected(selected.filter((v) => v !== chip));
      } else {
        if (multiple) {
          setSelected([...selected, chip]);
        } else {
          setSelected([chip]);
        }
      }
    };

    return (
      <ChipGroupContext.Provider value={{ selected, multiple, toggle, color }}>
        <div
          ref={ref}
          role="group"
          className={cn("flex flex-wrap gap-2", className)}
          {...props}
        >
          {children}
        </div>
      </ChipGroupContext.Provider>
    );
  },
);
ChipGroup.displayName = "ChipGroup";

export { ChipGroup, useChipGroup };
export type { ChipGroupProps, ChipGroupColor };
