"use client";

type LegendEntry = {
  name: string;
  color: string;
};

type ChartLegendProps = {
  entries: LegendEntry[];
  position?: "top" | "bottom" | "left" | "right";
  onToggle?: (name: string) => void;
  hiddenSeries?: Set<string>;
};

/**
 * HTML-based chart legend rendered as a flex container.
 * Supports click-to-toggle series visibility.
 */
export function ChartLegend({
  entries,
  position = "bottom",
  onToggle,
  hiddenSeries,
}: ChartLegendProps) {
  if (entries.length === 0) return null;

  const isVertical = position === "left" || position === "right";

  return (
    <div
      className={`flex ${isVertical ? "flex-col" : "flex-row flex-wrap"} items-center justify-center gap-x-4 gap-y-1 py-2`}
      data-testid="chart-legend"
    >
      {entries.map((entry) => {
        const hidden = hiddenSeries?.has(entry.name);
        return (
          <button
            key={entry.name}
            type="button"
            className={`flex items-center gap-1.5 text-xs transition-opacity ${hidden ? "opacity-40" : "opacity-100"} ${onToggle ? "cursor-pointer hover:opacity-70" : "cursor-default"}`}
            onClick={() => onToggle?.(entry.name)}
            tabIndex={onToggle ? 0 : -1}
            aria-label={`${hidden ? "Show" : "Hide"} ${entry.name}`}
          >
            <span
              className="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: hidden ? "#d1d5db" : entry.color }}
            />
            <span className="text-gray-600">{entry.name}</span>
          </button>
        );
      })}
    </div>
  );
}
