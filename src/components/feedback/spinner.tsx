import { cn } from "../../lib/utils";

// ── Shared types & maps ─────────────────────────────────────────────────

type SpinnerType =
  | "spin" | "ring" | "dots" | "bounce" | "pulse" | "bars"
  | "orbit" | "ripple" | "wave" | "grid"
  | "circle-fade" | "dual-ring" | "ping" | "square"
  | "chase" | "typing";

type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
type SpinnerColor =
  | "primary" | "secondary" | "destructive" | "success"
  | "warning" | "accent" | "white" | "muted" | "current";
type SpinnerSpeed = "slowest" | "slow" | "normal" | "fast" | "fastest";

const colorClass: Record<SpinnerColor, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  destructive: "text-red-600",
  success: "text-green-700",
  warning: "text-amber-600",
  accent: "text-accent",
  white: "text-white",
  muted: "text-slate-400",
  current: "text-current",
};

const sizeMap: Record<SpinnerSize, number> = {
  xs: 12, sm: 16, md: 24, lg: 32, xl: 48,
};

const dotSizeMap: Record<SpinnerSize, string> = {
  xs: "w-1 h-1", sm: "w-1.5 h-1.5", md: "w-2 h-2", lg: "w-2.5 h-2.5", xl: "w-3.5 h-3.5",
};

const dotGapMap: Record<SpinnerSize, string> = {
  xs: "gap-0.5", sm: "gap-1", md: "gap-1.5", lg: "gap-2", xl: "gap-2.5",
};

const thicknessClass: Record<string, string> = {
  thin: "border", default: "border-2", thick: "border-3",
};

const barWidthMap: Record<SpinnerSize, string> = {
  xs: "w-0.5", sm: "w-0.5", md: "w-1", lg: "w-1", xl: "w-1.5",
};

const speedMultiplier: Record<SpinnerSpeed, number> = {
  slowest: 2.5, slow: 1.5, normal: 1, fast: 0.6, fastest: 0.35,
};

type VariantProps = {
  size: SpinnerSize;
  color: SpinnerColor;
  thickness?: string;
  speed?: SpinnerSpeed;
  className?: string;
};

function dur(speed: SpinnerSpeed | undefined, baseSec: number): string {
  const mult = speedMultiplier[speed ?? "normal"];
  return `${(baseSec * mult).toFixed(2)}s`;
}

// ── 1. Spin (classic ring) ──────────────────────────────────────────────

function SpinVariant({ size, color, thickness = "default", speed, className }: VariantProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-full border-current border-t-transparent",
        thicknessClass[thickness] ?? thicknessClass.default,
        colorClass[color], className,
      )}
      style={{ width: sizeMap[size], height: sizeMap[size], animation: `spin ${dur(speed, 1)} linear infinite` }}
    />
  );
}

// ── 2. Ring (with track) ────────────────────────────────────────────────

function RingVariant({ size, color, thickness = "default", speed, className }: VariantProps) {
  return (
    <span className={cn("inline-block relative", colorClass[color], className)} style={{ width: sizeMap[size], height: sizeMap[size] }}>
      <span className={cn("absolute inset-0 rounded-full border-current opacity-20", thicknessClass[thickness] ?? thicknessClass.default)} />
      <span className={cn(
        "absolute inset-0 rounded-full border-current border-t-transparent border-l-transparent border-r-transparent",
        thicknessClass[thickness] ?? thicknessClass.default,
      )} style={{ animation: `spin ${dur(speed, 1)} linear infinite` }} />
    </span>
  );
}

// ── 3. Dual Ring ────────────────────────────────────────────────────────

function DualRingVariant({ size, color, thickness = "default", speed, className }: VariantProps) {
  const d = dur(speed, 1);
  return (
    <span className={cn("inline-block relative", colorClass[color], className)} style={{ width: sizeMap[size], height: sizeMap[size] }}>
      <span className={cn(
        "absolute inset-0 rounded-full border-current border-t-transparent",
        thicknessClass[thickness] ?? thicknessClass.default,
      )} style={{ animation: `spin ${d} linear infinite` }} />
      <span
        className={cn(
          "absolute rounded-full border-current border-b-transparent opacity-60",
          thicknessClass[thickness] ?? thicknessClass.default,
        )}
        style={{ inset: "25%", animation: `spin ${d} linear infinite reverse` }}
      />
    </span>
  );
}

// ── 4. Dots (3 pulsing) ─────────────────────────────────────────────────

function DotsVariant({ size, color, speed, className }: VariantProps) {
  const d = dur(speed, 1.4);
  return (
    <span className={cn("inline-flex items-center", dotGapMap[size], colorClass[color], className)}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={cn("rounded-full bg-current", dotSizeMap[size])}
          style={{ animation: `spark-dots ${d} ease-in-out infinite`, animationDelay: `${i * 0.16}s` }} />
      ))}
    </span>
  );
}

// ── 5. Bounce (3 bouncing) ──────────────────────────────────────────────

function BounceVariant({ size, color, speed, className }: VariantProps) {
  const d = dur(speed, 1.4);
  return (
    <span className={cn("inline-flex items-end", dotGapMap[size], colorClass[color], className)} style={{ height: sizeMap[size] }}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={cn("rounded-full bg-current", dotSizeMap[size])}
          style={{ animation: `spark-bounce ${d} ease-in-out infinite`, animationDelay: `${i * 0.16}s` }} />
      ))}
    </span>
  );
}

// ── 6. Typing (chat-style indicator) ────────────────────────────────────

function TypingVariant({ size, color, speed, className }: VariantProps) {
  const d = dur(speed, 1.4);
  return (
    <span className={cn("inline-flex items-center", dotGapMap[size], colorClass[color], className)}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={cn("rounded-full bg-current", dotSizeMap[size])}
          style={{ animation: `spark-typing ${d} ease-in-out infinite`, animationDelay: `${i * 0.2}s` }} />
      ))}
    </span>
  );
}

// ── 7. Pulse (single pulsing circle) ────────────────────────────────────

function PulseVariant({ size, color, speed, className }: VariantProps) {
  return (
    <span className={cn("inline-block rounded-full bg-current", colorClass[color], className)}
      style={{ width: sizeMap[size], height: sizeMap[size], animation: `spark-pulse ${dur(speed, 1.5)} cubic-bezier(0.4, 0, 0.6, 1) infinite` }} />
  );
}

// ── 8. Ping (expanding ring) ────────────────────────────────────────────

function PingVariant({ size, color, speed, className }: VariantProps) {
  const s = sizeMap[size];
  const d = dur(speed, 1);
  return (
    <span className={cn("inline-block relative", colorClass[color], className)} style={{ width: s, height: s }}>
      <span className="absolute inset-0 rounded-full bg-current opacity-75"
        style={{ animation: `spark-ping ${d} cubic-bezier(0, 0, 0.2, 1) infinite` }} />
      <span className="absolute rounded-full bg-current"
        style={{ inset: "25%" }} />
    </span>
  );
}

// ── 9. Ripple (expanding concentric rings) ──────────────────────────────

function RippleVariant({ size, color, thickness = "default", speed, className }: VariantProps) {
  const d = dur(speed, 1.5);
  const s = sizeMap[size];
  return (
    <span className={cn("inline-block relative", colorClass[color], className)} style={{ width: s, height: s }}>
      {[0, 1].map((i) => (
        <span key={i} className={cn("absolute inset-0 rounded-full border-current", thicknessClass[thickness] ?? thicknessClass.default)}
          style={{ animation: `spark-ripple ${d} cubic-bezier(0, 0.2, 0.8, 1) infinite`, animationDelay: `${i * 0.5}s` }} />
      ))}
    </span>
  );
}

// ── 10. Bars (4 scaling bars) ───────────────────────────────────────────

function BarsVariant({ size, color, speed, className }: VariantProps) {
  const d = dur(speed, 1.2);
  return (
    <span className={cn("inline-flex items-center gap-[2px]", colorClass[color], className)} style={{ height: sizeMap[size] }}>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className={cn("bg-current rounded-full h-full", barWidthMap[size])}
          style={{ animation: `spark-bars ${d} ease-in-out infinite`, animationDelay: `${i * 0.1}s` }} />
      ))}
    </span>
  );
}

// ── 11. Wave (5 bars, wave pattern) ─────────────────────────────────────

function WaveVariant({ size, color, speed, className }: VariantProps) {
  const d = dur(speed, 1.2);
  return (
    <span className={cn("inline-flex items-center gap-[1px]", colorClass[color], className)} style={{ height: sizeMap[size] }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className={cn("bg-current rounded-full h-full", barWidthMap[size])}
          style={{ animation: `spark-wave ${d} ease-in-out infinite`, animationDelay: `${i * 0.1}s` }} />
      ))}
    </span>
  );
}

// ── 12. Grid (3×3 pulsing grid) ─────────────────────────────────────────

function GridVariant({ size, color, speed, className }: VariantProps) {
  const d = dur(speed, 1.3);
  const s = sizeMap[size];
  const cellSize = Math.max(2, Math.floor(s / 4));
  const gap = Math.max(1, Math.floor(s / 12));
  return (
    <span className={cn("inline-grid", colorClass[color], className)}
      style={{ gridTemplateColumns: `repeat(3, ${cellSize}px)`, gap, width: s, height: s }}>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <span key={i} className="bg-current rounded-sm"
          style={{ animation: `spark-grid ${d} ease-in-out infinite`, animationDelay: `${(i % 3 + Math.floor(i / 3)) * 0.1}s` }} />
      ))}
    </span>
  );
}

// ── 13. Circle Fade (8 dots in a ring, fading sequentially) ─────────────

function CircleFadeVariant({ size, color, speed, className }: VariantProps) {
  const d = dur(speed, 1.2);
  const s = sizeMap[size];
  const count = 8;
  const dotR = Math.max(1.5, s / 10);
  const orbitR = s / 2 - dotR;
  return (
    <span className={cn("inline-block relative", colorClass[color], className)} style={{ width: s, height: s }}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
        const x = s / 2 + orbitR * Math.cos(angle) - dotR;
        const y = s / 2 + orbitR * Math.sin(angle) - dotR;
        return (
          <span key={i} className="absolute rounded-full bg-current"
            style={{
              width: dotR * 2, height: dotR * 2, left: x, top: y,
              animation: `spark-circle-fade ${d} ease-in-out infinite`,
              animationDelay: `${(i / count * parseFloat(d)).toFixed(2)}s`,
            }} />
        );
      })}
    </span>
  );
}

// ── 14. Chase (dots chasing around a circle) ────────────────────────────

function ChaseVariant({ size, color, speed, className }: VariantProps) {
  const d = dur(speed, 2.5);
  const s = sizeMap[size];
  const count = 6;
  const dotR = Math.max(1.5, s / 10);
  return (
    <span className={cn("inline-block relative", colorClass[color], className)}
      style={{ width: s, height: s, animation: `spin ${d} linear infinite` }}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
        const orbitR = s / 2 - dotR;
        const x = s / 2 + orbitR * Math.cos(angle) - dotR;
        const y = s / 2 + orbitR * Math.sin(angle) - dotR;
        return (
          <span key={i} className="absolute rounded-full bg-current"
            style={{
              width: dotR * 2, height: dotR * 2, left: x, top: y,
              animation: `spark-chase-dot ${d} ease-in-out infinite`,
              animationDelay: `${(i * 0.15).toFixed(2)}s`,
            }} />
        );
      })}
    </span>
  );
}

// ── 15. Orbit (2 dots orbiting) ─────────────────────────────────────────

function OrbitVariant({ size, color, speed, className }: VariantProps) {
  const d = dur(speed, 1.2);
  const s = sizeMap[size];
  const dotR = Math.max(2, s / 8);
  return (
    <span className={cn("inline-block relative", colorClass[color], className)}
      style={{ width: s, height: s, animation: `spin ${d} linear infinite` }}>
      <span className="absolute rounded-full bg-current"
        style={{ width: dotR * 2, height: dotR * 2, top: 0, left: s / 2 - dotR }} />
      <span className="absolute rounded-full bg-current"
        style={{ width: dotR * 2, height: dotR * 2, bottom: 0, left: s / 2 - dotR }} />
    </span>
  );
}

// ── 16. Square (rotating square) ────────────────────────────────────────

function SquareVariant({ size, color, speed, className }: VariantProps) {
  const s = sizeMap[size] * 0.65;
  return (
    <span className={cn("inline-block bg-current rounded-sm", colorClass[color], className)}
      style={{ width: s, height: s, animation: `spark-square ${dur(speed, 1.2)} ease-in-out infinite` }} />
  );
}

// ── Main component ──────────────────────────────────────────────────────

type SpinnerProps = {
  /** Spinner style */
  type?: SpinnerType;
  /** Size */
  size?: SpinnerSize;
  /** Color */
  color?: SpinnerColor;
  /** Border thickness (spin, ring, dual-ring, ripple) */
  thickness?: "thin" | "default" | "thick";
  /** Animation speed */
  speed?: SpinnerSpeed;
  /** Custom accessible label */
  label?: string;
  /** Render as a centered overlay with backdrop */
  overlay?: boolean;
  className?: string;
};

const VARIANTS: Record<SpinnerType, (props: VariantProps) => React.ReactNode> = {
  spin: SpinVariant,
  ring: RingVariant,
  "dual-ring": DualRingVariant,
  dots: DotsVariant,
  bounce: BounceVariant,
  typing: TypingVariant,
  pulse: PulseVariant,
  ping: PingVariant,
  ripple: RippleVariant,
  bars: BarsVariant,
  wave: WaveVariant,
  grid: GridVariant,
  "circle-fade": CircleFadeVariant,
  chase: ChaseVariant,
  orbit: OrbitVariant,
  square: SquareVariant,
};

function Spinner({
  type = "spin",
  size = "md",
  color = "primary",
  thickness = "default",
  speed = "normal",
  label = "Loading",
  overlay = false,
  className,
}: SpinnerProps) {
  const Variant = VARIANTS[type] ?? VARIANTS.spin;
  const content = <Variant size={size} color={color} thickness={thickness} speed={speed} className={className} />;

  const spinner = (
    <span role="status" aria-label={label} className="inline-flex">
      {content}
    </span>
  );

  if (overlay) {
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-[1px] rounded-[inherit]">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export { Spinner };
export type { SpinnerProps, SpinnerType, SpinnerSize, SpinnerColor, SpinnerSpeed };
