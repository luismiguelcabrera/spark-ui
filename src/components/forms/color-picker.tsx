"use client";

import { forwardRef, useRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { useControllable } from "../../hooks/use-controllable";

type ColorPickerProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  /** Current color value (hex) */
  value?: string;
  /** Default color */
  defaultValue?: string;
  /** Callback when color changes */
  onChange?: (color: string) => void;
  /** Preset colors to show */
  presets?: string[];
  /** Label */
  label?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Disabled state */
  disabled?: boolean;
  /** Show text input */
  showInput?: boolean;
  /** Allowed formats */
  format?: "hex" | "rgb" | "hsl";
};

const defaultPresets = [
  "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e",
  "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1",
  "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e", "#64748b",
  "#000000", "#ffffff",
];

const swatchSizeMap = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
};

const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(
  (
    {
      className,
      value: valueProp,
      defaultValue = "#4f46e5",
      onChange,
      presets = defaultPresets,
      label,
      size = "md",
      disabled = false,
      showInput = true,
      ...props
    },
    ref
  ) => {
    const [color, setColor] = useControllable({
      value: valueProp,
      defaultValue,
      onChange,
    });

    const inputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (/^#[0-9a-fA-F]{0,6}$/.test(val) || val === "") {
        setColor(val);
      }
    };

    return (
      <div ref={ref} className={cn("flex flex-col gap-3", disabled && "pointer-events-none", className)} {...props}>
        {label && (
          <label className="text-sm font-medium text-slate-700">{label}</label>
        )}

        {/* Color preview + native picker */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={cn(
                "rounded-xl border-2 border-slate-200 cursor-pointer overflow-hidden shadow-sm",
                swatchSizeMap[size]
              )}
              style={{ backgroundColor: color }}
              onClick={() => inputRef.current?.click()}
            />
            <input
              ref={inputRef}
              type="color"
              value={color.length === 7 ? color : "#000000"}
              onChange={(e) => setColor(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              disabled={disabled}
              aria-label="Choose color"
            />
          </div>
          {showInput && (
            <input
              type="text"
              value={color}
              onChange={handleInputChange}
              placeholder="#000000"
              maxLength={7}
              disabled={disabled}
              className={cn(
                "w-24 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
                "disabled:cursor-not-allowed"
              )}
            />
          )}
        </div>

        {/* Preset swatches */}
        {presets.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setColor(preset)}
                disabled={disabled}
                className={cn(
                  "w-6 h-6 rounded-lg border-2 transition-all hover:scale-110",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                  color === preset ? "border-slate-400 ring-2 ring-slate-300 ring-offset-1" : "border-transparent"
                )}
                style={{ backgroundColor: preset }}
                aria-label={`Select color ${preset}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);
ColorPicker.displayName = "ColorPicker";

export { ColorPicker };
export type { ColorPickerProps };
