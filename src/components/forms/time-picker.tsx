"use client";

import { forwardRef, useState, useRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../data-display/icon";
import { useControllable } from "../../hooks/use-controllable";
import { useClickOutside } from "../../hooks/use-click-outside";

type TimePickerProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  /** Current time value (HH:mm format) */
  value?: string;
  /** Default time */
  defaultValue?: string;
  /** Callback when time changes */
  onChange?: (time: string) => void;
  /** 12 or 24 hour format */
  format?: "12" | "24";
  /** Minute step interval */
  minuteStep?: number;
  /** Label */
  label?: string;
  /** Error message */
  error?: string;
  /** Placeholder */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
};

const pad = (n: number) => String(n).padStart(2, "0");

const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(
  (
    {
      className,
      value: valueProp,
      defaultValue = "",
      onChange,
      format = "24",
      minuteStep = 15,
      label,
      error,
      placeholder = "Select time",
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [time, setTime] = useControllable({
      value: valueProp,
      defaultValue,
      onChange,
    });

    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useClickOutside(containerRef, () => setOpen(false), open);

    const hours = format === "12"
      ? Array.from({ length: 12 }, (_, i) => i + 1)
      : Array.from({ length: 24 }, (_, i) => i);

    const minutes = Array.from(
      { length: Math.ceil(60 / minuteStep) },
      (_, i) => i * minuteStep
    );

    const parseTime = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return { hour: h || 0, minute: m || 0 };
    };

    const currentTime = time ? parseTime(time) : null;

    const selectHour = (h: number) => {
      const m = currentTime?.minute ?? 0;
      setTime(`${pad(h)}:${pad(m)}`);
    };

    const selectMinute = (m: number) => {
      const h = currentTime?.hour ?? (format === "12" ? 12 : 0);
      setTime(`${pad(h)}:${pad(m)}`);
    };

    const displayValue = time
      ? format === "12"
        ? (() => {
            const { hour, minute } = parseTime(time);
            const h12 = hour % 12 || 12;
            const ampm = hour < 12 ? "AM" : "PM";
            return `${h12}:${pad(minute)} ${ampm}`;
          })()
        : time
      : "";

    return (
      <div ref={containerRef} className={cn("relative", className)}>
        {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(!open)}
          className={cn(
            "flex items-center gap-2 w-full h-10 px-3 bg-slate-50 border rounded-xl text-sm transition-colors text-left",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error ? "border-red-300" : "border-slate-200"
          )}
        >
          <Icon name="clock" size="sm" className="text-slate-500 shrink-0" />
          <span className={cn("flex-1", !displayValue && "text-slate-600")}>
            {displayValue || placeholder}
          </span>
          <Icon name="chevron-down" size="sm" className="text-slate-500 shrink-0" />
        </button>
        {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}

        {open && (
          <div
            ref={ref}
            className="absolute z-50 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-float p-3 w-[240px]"
            {...props}
          >
            <div className="flex gap-2">
              {/* Hours */}
              <div className="flex-1">
                <div className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider text-center mb-1">
                  Hour
                </div>
                <div className="max-h-48 overflow-y-auto space-y-0.5 pr-1 custom-scrollbar">
                  {hours.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => selectHour(h)}
                      className={cn(
                        "w-full py-1.5 rounded-lg text-sm font-medium transition-colors text-center",
                        currentTime?.hour === h
                          ? "bg-primary text-white"
                          : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {pad(h)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-px bg-slate-200" />

              {/* Minutes */}
              <div className="flex-1">
                <div className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider text-center mb-1">
                  Min
                </div>
                <div className="max-h-48 overflow-y-auto space-y-0.5 pr-1 custom-scrollbar">
                  {minutes.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => selectMinute(m)}
                      className={cn(
                        "w-full py-1.5 rounded-lg text-sm font-medium transition-colors text-center",
                        currentTime?.minute === m
                          ? "bg-primary text-white"
                          : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {pad(m)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);
TimePicker.displayName = "TimePicker";

export { TimePicker };
export type { TimePickerProps };
