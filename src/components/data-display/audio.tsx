"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/* -------------------------------------------------------------------------- */
/*  Variants                                                                   */
/* -------------------------------------------------------------------------- */

const audioVariants = cva("overflow-hidden", {
  variants: {
    rounded: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-lg",
      lg: "rounded-xl",
      xl: "rounded-2xl",
    },
  },
  defaultVariants: {
    rounded: "md",
  },
});

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type AudioProvider = "native" | "soundcloud" | "spotify";
type AudioVariant = "minimal" | "standard" | "card" | "waveform";
type AudioSize = "xs" | "sm" | "md" | "lg" | "xl";
type AudioColor =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "destructive";
type AudioRounded = "none" | "sm" | "md" | "lg" | "xl";

type AudioProps = VariantProps<typeof audioVariants> & {
  /** Audio source URL — supports direct files, SoundCloud, and Spotify URLs. */
  src: string;
  /** Player layout variant. @default "standard" */
  variant?: AudioVariant;
  /** Player size. @default "md" */
  size?: AudioSize;
  /** Accent color for controls. @default "primary" */
  color?: AudioColor;
  /** Track title (shown in card/waveform variants, used in aria-label). */
  title?: string;
  /** Artist name (shown in card/waveform variants). */
  artist?: string;
  /** Album artwork URL (shown in card variant). */
  artwork?: string;
  /** Additional class names. */
  className?: string;
  /** Title for embedded iframes (accessibility). @default "Audio player" */
  iframeTitle?: string;
  /** Auto-play on load. */
  autoPlay?: boolean;
  /** Loop playback. */
  loop?: boolean;
  /** Start muted. */
  muted?: boolean;
  /** Preload behavior. @default "metadata" */
  preload?: "none" | "metadata" | "auto";
  /** CORS setting for the audio element. */
  crossOrigin?: "anonymous" | "use-credentials";
  /** Show skip forward / backward buttons. @default false */
  showSkipButtons?: boolean;
  /** Skip interval in seconds. @default 10 */
  skipInterval?: number;
  /** Show playback rate button. @default false */
  showPlaybackRate?: boolean;
  /** Initial playback rate. @default 1 */
  defaultPlaybackRate?: number;
  /**
   * Analyze audio with Web Audio API for real waveform bars.
   * Requires CORS-accessible audio. Falls back to generated bars on failure.
   * @default false
   */
  analyzeWaveform?: boolean;
  /** Callback when playback starts. */
  onPlay?: () => void;
  /** Callback when playback pauses. */
  onPause?: () => void;
  /** Callback when playback ends. */
  onEnded?: () => void;
  /** Callback on time update with current time in seconds. */
  onTimeUpdate?: (currentTime: number) => void;
  /** Callback when the audio source fails to load. */
  onError?: () => void;
  /** Callback when playback rate changes, with new rate value. */
  onRateChange?: (rate: number) => void;
  /** Callback when user clicks retry after an error. */
  onRetry?: () => void;
};

/* -------------------------------------------------------------------------- */
/*  URL parsing helpers                                                        */
/* -------------------------------------------------------------------------- */

function detectAudioProvider(src: string): AudioProvider {
  if (/soundcloud\.com/.test(src)) return "soundcloud";
  if (/open\.spotify\.com/.test(src)) return "spotify";
  return "native";
}

function extractSpotifyPath(src: string): string | null {
  const match = src.match(
    /open\.spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/,
  );
  return match ? `${match[1]}/${match[2]}` : null;
}

function getSpotifyEmbedUrl(path: string): string {
  return `https://open.spotify.com/embed/${path}`;
}

function getSoundCloudEmbedUrl(
  src: string,
  visual: boolean,
  colorHex = "4f46e5",
): string {
  const params = new URLSearchParams({
    url: src,
    color: colorHex,
    auto_play: "false",
    hide_related: "true",
    show_comments: "false",
    show_user: "true",
    show_reposts: "false",
    show_teaser: "false",
    visual: visual ? "true" : "false",
  });
  return `https://w.soundcloud.com/player/?${params.toString()}`;
}

/* -------------------------------------------------------------------------- */
/*  Formatting                                                                 */
/* -------------------------------------------------------------------------- */

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/* -------------------------------------------------------------------------- */
/*  Color maps                                                                 */
/* -------------------------------------------------------------------------- */

const progressColorMap: Record<AudioColor, string> = {
  primary: "bg-primary",
  secondary: "bg-slate-600 dark:bg-slate-400",
  accent: "bg-amber-500",
  success: "bg-emerald-500",
  warning: "bg-orange-500",
  destructive: "bg-red-500",
};

const buttonColorMap: Record<AudioColor, string> = {
  primary: "text-primary",
  secondary: "text-slate-600 dark:text-slate-500",
  accent: "text-amber-600",
  success: "text-emerald-600",
  warning: "text-orange-600",
  destructive: "text-red-600",
};

const focusColorMap: Record<AudioColor, string> = {
  primary: "focus-visible:ring-primary",
  secondary: "focus-visible:ring-slate-500",
  accent: "focus-visible:ring-amber-500",
  success: "focus-visible:ring-emerald-500",
  warning: "focus-visible:ring-orange-500",
  destructive: "focus-visible:ring-red-500",
};

const thumbBorderColorMap: Record<AudioColor, string> = {
  primary: "border-primary",
  secondary: "border-slate-600 dark:border-slate-400",
  accent: "border-amber-500",
  success: "border-emerald-500",
  warning: "border-orange-500",
  destructive: "border-red-500",
};

const soundcloudColorHexMap: Record<AudioColor, string> = {
  primary: "4f46e5",
  secondary: "475569",
  accent: "f59e0b",
  success: "10b981",
  warning: "f97316",
  destructive: "ef4444",
};

/* -------------------------------------------------------------------------- */
/*  Size maps                                                                  */
/* -------------------------------------------------------------------------- */

const sizeMap = {
  xs: {
    padding: "px-2 py-1.5",
    gap: "gap-1.5",
    text: "text-[10px]",
    timeText: "text-[9px]",
    iconButton: "w-6 h-6",
    playIcon: "w-2.5 h-2.5",
    controlIcon: "w-3 h-3",
    progressHeight: "h-1",
    volumeWidth: "w-12",
    artworkSize: "w-10 h-10",
    cardGap: "gap-2",
    thumbSize: "w-2.5 h-2.5",
    cardDirection: "flex-col" as const,
  },
  sm: {
    padding: "px-3 py-2",
    gap: "gap-2",
    text: "text-xs",
    timeText: "text-[10px]",
    iconButton: "w-7 h-7",
    playIcon: "w-3 h-3",
    controlIcon: "w-3.5 h-3.5",
    progressHeight: "h-1",
    volumeWidth: "w-16",
    artworkSize: "w-12 h-12",
    cardGap: "gap-3",
    thumbSize: "w-3 h-3",
    cardDirection: "flex-col" as const,
  },
  md: {
    padding: "px-4 py-3",
    gap: "gap-3",
    text: "text-sm",
    timeText: "text-xs",
    iconButton: "w-9 h-9",
    playIcon: "w-3.5 h-3.5",
    controlIcon: "w-4 h-4",
    progressHeight: "h-1.5",
    volumeWidth: "w-20",
    artworkSize: "w-16 h-16",
    cardGap: "gap-4",
    thumbSize: "w-3.5 h-3.5",
    cardDirection: "" as const,
  },
  lg: {
    padding: "px-5 py-4",
    gap: "gap-4",
    text: "text-base",
    timeText: "text-sm",
    iconButton: "w-11 h-11",
    playIcon: "w-4 h-4",
    controlIcon: "w-5 h-5",
    progressHeight: "h-2",
    volumeWidth: "w-24",
    artworkSize: "w-20 h-20",
    cardGap: "gap-5",
    thumbSize: "w-4 h-4",
    cardDirection: "" as const,
  },
  xl: {
    padding: "px-6 py-5",
    gap: "gap-5",
    text: "text-lg",
    timeText: "text-base",
    iconButton: "w-14 h-14",
    playIcon: "w-5 h-5",
    controlIcon: "w-6 h-6",
    progressHeight: "h-2.5",
    volumeWidth: "w-28",
    artworkSize: "w-24 h-24",
    cardGap: "gap-6",
    thumbSize: "w-5 h-5",
    cardDirection: "" as const,
  },
};

const embedHeightMap = {
  soundcloud: { xs: 80, sm: 80, md: 166, lg: 300, xl: 300 },
  spotify: { xs: 80, sm: 80, md: 152, lg: 352, xl: 352 },
};

/* -------------------------------------------------------------------------- */
/*  Waveform variant utilities                                                 */
/* -------------------------------------------------------------------------- */

const gradientMap: Record<AudioColor, string> = {
  primary: "from-indigo-600 via-violet-600 to-purple-700",
  secondary: "from-slate-700 via-slate-600 to-slate-800",
  accent: "from-amber-500 via-orange-500 to-red-500",
  success: "from-emerald-600 via-teal-500 to-cyan-600",
  warning: "from-orange-500 via-amber-400 to-yellow-500",
  destructive: "from-red-600 via-rose-500 to-pink-600",
};

const waveformHeightMap = { xs: "h-6", sm: "h-8", md: "h-12", lg: "h-16", xl: "h-20" };
const barCountMap = { xs: 30, sm: 40, md: 60, lg: 80, xl: 100 };

function generateWaveformBars(seed: string, count: number): number[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  }
  const bars: number[] = [];
  for (let i = 0; i < count; i++) {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    bars.push(0.15 + ((h % 1000) / 1000) * 0.85);
  }
  return bars;
}

/* -------------------------------------------------------------------------- */
/*  Playback rates                                                             */
/* -------------------------------------------------------------------------- */

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

/* -------------------------------------------------------------------------- */
/*  Waveform analysis hook                                                     */
/* -------------------------------------------------------------------------- */

function useWaveformAnalysis(
  src: string,
  barCount: number,
  enabled: boolean,
): number[] | null {
  const [bars, setBars] = useState<number[] | null>(null);
  const cacheRef = useRef<Map<string, number[]>>(new Map());

  useEffect(() => {
    if (!enabled) {
      setBars(null);
      return;
    }

    const cacheKey = `${src}:${barCount}`;
    const cached = cacheRef.current.get(cacheKey);
    if (cached) {
      setBars(cached);
      return;
    }

    const AC =
      typeof window !== "undefined"
        ? window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
        : null;
    if (!AC) return;

    let cancelled = false;

    (async () => {
      try {
        const response = await fetch(src);
        if (cancelled) return;
        const arrayBuffer = await response.arrayBuffer();
        if (cancelled) return;

        const ctx = new AC();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        ctx.close();
        if (cancelled) return;

        const channelData = audioBuffer.getChannelData(0);
        const samplesPerBar = Math.floor(channelData.length / barCount);
        const result: number[] = [];

        for (let i = 0; i < barCount; i++) {
          let sum = 0;
          const start = i * samplesPerBar;
          const end = Math.min(start + samplesPerBar, channelData.length);
          for (let j = start; j < end; j++) {
            sum += Math.abs(channelData[j]);
          }
          result.push(sum / (end - start));
        }

        const maxAmplitude = Math.max(...result);
        const normalized = result.map(
          (v) => 0.15 + (maxAmplitude > 0 ? v / maxAmplitude : 0) * 0.85,
        );

        if (!cancelled) {
          cacheRef.current.set(cacheKey, normalized);
          setBars(normalized);
        }
      } catch {
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            `[Audio] Waveform analysis failed for "${src}". Ensure the audio file is CORS-accessible.`,
          );
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [src, barCount, enabled]);

  return bars;
}

/* -------------------------------------------------------------------------- */
/*  Inline SVG icons                                                           */
/* -------------------------------------------------------------------------- */

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
    </svg>
  );
}

function VolumeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
}

function VolumeMuteIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
    </svg>
  );
}

function MusicNoteIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
  );
}

function ErrorIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>
  );
}

function RetryIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
    </svg>
  );
}

function SkipBackIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
    </svg>
  );
}

function SkipForwardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
    </svg>
  );
}

function LoadingIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className} aria-hidden="true">
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Seek bar                                                                   */
/* -------------------------------------------------------------------------- */

function SeekBar({
  current,
  total,
  height,
  color,
  onSeek,
  label,
  buffered = 0,
  thumbSize,
  thumbColor,
  onTogglePlay,
}: {
  current: number;
  total: number;
  height: string;
  color: string;
  onSeek: (fraction: number) => void;
  label: string;
  buffered?: number;
  thumbSize?: string;
  thumbColor?: string;
  onTogglePlay?: () => void;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverFraction, setHoverFraction] = useState<number | null>(null);
  const progress = total > 0 ? (current / total) * 100 : 0;
  const bufferedPercent = total > 0 ? Math.min(100, (buffered / total) * 100) : 0;

  const getFraction = useCallback((clientX: number) => {
    const bar = barRef.current;
    if (!bar) return 0;
    const rect = bar.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onSeek(getFraction(e.clientX));
    },
    [onSeek, getFraction],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const bar = barRef.current;
      if (!bar) return;
      bar.setPointerCapture(e.pointerId);
      draggingRef.current = true;
      setIsDragging(true);
      onSeek(getFraction(e.clientX));
    },
    [onSeek, getFraction],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      onSeek(getFraction(e.clientX));
    },
    [onSeek, getFraction],
  );

  const handlePointerUp = useCallback(() => {
    draggingRef.current = false;
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const bar = barRef.current;
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      setHoverFraction(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    setHoverFraction(null);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        onTogglePlay?.();
        return;
      }
      if (total <= 0) return;
      const step = 5;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        onSeek(Math.min(1, (current + step) / total));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onSeek(Math.max(0, (current - step) / total));
      } else if (e.key === "Home") {
        e.preventDefault();
        onSeek(0);
      } else if (e.key === "End") {
        e.preventDefault();
        onSeek(1);
      }
    },
    [current, total, onSeek, onTogglePlay],
  );

  const showThumb = hoverFraction !== null || isDragging;

  return (
    <div
      ref={barRef}
      role="slider"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={Math.floor(total)}
      aria-valuenow={Math.floor(current)}
      aria-valuetext={`${formatTime(current)} of ${formatTime(total)}`}
      tabIndex={0}
      className={cn(
        "relative flex-1 cursor-pointer rounded-full bg-slate-200 dark:bg-slate-700",
        height,
      )}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
    >
      {bufferedPercent > 0 && (
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-slate-300 dark:bg-slate-600"
          style={{ width: `${bufferedPercent}%` }}
        />
      )}
      <div
        className={cn(
          "absolute inset-y-0 left-0 rounded-full motion-safe:transition-[width] motion-safe:duration-100",
          color,
        )}
        style={{ width: `${progress}%` }}
      />
      {thumbSize && (
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white border-2 shadow-sm pointer-events-none",
            "motion-safe:transition-opacity",
            showThumb ? "opacity-100" : "opacity-0",
            thumbColor,
            thumbSize,
          )}
          style={{ left: `${progress}%` }}
        />
      )}
      {hoverFraction !== null && total > 0 && (
        <div
          className="absolute -top-8 -translate-x-1/2 px-1.5 py-0.5 rounded bg-slate-800 text-white text-[10px] pointer-events-none whitespace-nowrap z-10"
          style={{ left: `${hoverFraction * 100}%` }}
        >
          {formatTime(hoverFraction * total)}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Waveform seek bar                                                          */
/* -------------------------------------------------------------------------- */

function WaveformSeekBar({
  bars,
  current,
  total,
  height,
  activeColor,
  inactiveColor,
  onSeek,
  onTogglePlay,
}: {
  bars: number[];
  current: number;
  total: number;
  height: string;
  activeColor: string;
  inactiveColor: string;
  onSeek: (fraction: number) => void;
  onTogglePlay?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [hoverFraction, setHoverFraction] = useState<number | null>(null);
  const progress = total > 0 ? current / total : 0;
  const activeIndex = Math.floor(progress * bars.length);

  const getFraction = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onSeek(getFraction(e.clientX));
    },
    [onSeek, getFraction],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = containerRef.current;
      if (!el) return;
      el.setPointerCapture(e.pointerId);
      draggingRef.current = true;
      onSeek(getFraction(e.clientX));
    },
    [onSeek, getFraction],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      onSeek(getFraction(e.clientX));
    },
    [onSeek, getFraction],
  );

  const handlePointerUp = useCallback(() => {
    draggingRef.current = false;
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setHoverFraction(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    setHoverFraction(null);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        onTogglePlay?.();
        return;
      }
      if (total <= 0) return;
      const step = 5;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        onSeek(Math.min(1, (current + step) / total));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onSeek(Math.max(0, (current - step) / total));
      } else if (e.key === "Home") {
        e.preventDefault();
        onSeek(0);
      } else if (e.key === "End") {
        e.preventDefault();
        onSeek(1);
      }
    },
    [current, total, onSeek, onTogglePlay],
  );

  return (
    <div
      ref={containerRef}
      role="slider"
      aria-label="Seek"
      aria-valuemin={0}
      aria-valuemax={Math.floor(total)}
      aria-valuenow={Math.floor(current)}
      aria-valuetext={`${formatTime(current)} of ${formatTime(total)}`}
      tabIndex={0}
      className={cn("relative flex items-end gap-[2px] cursor-pointer", height)}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
    >
      {bars.map((h, i) => (
        <div
          key={i}
          className={cn(
            "flex-1 rounded-full min-w-[2px]",
            i <= activeIndex ? activeColor : inactiveColor,
          )}
          style={{ height: `${h * 100}%` }}
        />
      ))}
      {hoverFraction !== null && total > 0 && (
        <div
          className="absolute -top-8 -translate-x-1/2 px-1.5 py-0.5 rounded bg-slate-800/90 text-white text-[10px] pointer-events-none whitespace-nowrap z-10"
          style={{ left: `${hoverFraction * 100}%` }}
        >
          {formatTime(hoverFraction * total)}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Volume slider                                                              */
/* -------------------------------------------------------------------------- */

function VolumeSlider({
  volume,
  width,
  height,
  color,
  trackColor,
  onChange,
  thumbSize,
  thumbColor,
}: {
  volume: number;
  width: string;
  height: string;
  color: string;
  trackColor?: string;
  onChange: (value: number) => void;
  thumbSize?: string;
  thumbColor?: string;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getFraction = useCallback((clientX: number) => {
    const bar = barRef.current;
    if (!bar) return 0;
    const rect = bar.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onChange(getFraction(e.clientX));
    },
    [onChange, getFraction],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const bar = barRef.current;
      if (!bar) return;
      bar.setPointerCapture(e.pointerId);
      draggingRef.current = true;
      setIsDragging(true);
      onChange(getFraction(e.clientX));
    },
    [onChange, getFraction],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      onChange(getFraction(e.clientX));
    },
    [onChange, getFraction],
  );

  const handlePointerUp = useCallback(() => {
    draggingRef.current = false;
    setIsDragging(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const step = 0.1;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        onChange(Math.min(1, volume + step));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        onChange(Math.max(0, volume - step));
      } else if (e.key === "Home") {
        e.preventDefault();
        onChange(0);
      } else if (e.key === "End") {
        e.preventDefault();
        onChange(1);
      }
    },
    [volume, onChange],
  );

  const showThumb = isHovered || isDragging;

  return (
    <div
      ref={barRef}
      role="slider"
      aria-label="Volume"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(volume * 100)}
      tabIndex={0}
      className={cn(
        "relative cursor-pointer rounded-full",
        trackColor || "bg-slate-200 dark:bg-slate-700",
        width,
        height,
      )}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
    >
      <div
        className={cn(
          "absolute inset-y-0 left-0 rounded-full motion-safe:transition-[width] motion-safe:duration-100",
          color,
        )}
        style={{ width: `${volume * 100}%` }}
      />
      {thumbSize && (
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white border-2 shadow-sm pointer-events-none",
            "motion-safe:transition-opacity",
            showThumb ? "opacity-100" : "opacity-0",
            thumbColor,
            thumbSize,
          )}
          style={{ left: `${volume * 100}%` }}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

const Audio = forwardRef<HTMLAudioElement, AudioProps>(
  (
    {
      src,
      variant = "standard",
      size = "md",
      color = "primary",
      rounded,
      title: trackTitle,
      artist,
      artwork,
      className,
      iframeTitle = "Audio player",
      autoPlay = false,
      loop = false,
      muted: initialMuted = false,
      preload = "metadata",
      crossOrigin,
      showSkipButtons = false,
      skipInterval = 10,
      showPlaybackRate = false,
      defaultPlaybackRate = 1,
      analyzeWaveform = false,
      onPlay,
      onPause,
      onEnded,
      onTimeUpdate,
      onError: onErrorProp,
      onRateChange,
      onRetry: onRetryProp,
    },
    ref,
  ) => {
    const provider = useMemo(() => detectAudioProvider(src), [src]);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const s = sizeMap[size];

    /* -- State ------------------------------------------------------------ */
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(initialMuted);
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [bufferedEnd, setBufferedEnd] = useState(0);
    const [rate, setRate] = useState(defaultPlaybackRate);
    const [showRemaining, setShowRemaining] = useState(false);

    /* -- Waveform analysis (unconditional hook call) ---------------------- */
    const barCount = barCountMap[size];
    const analyzedBars = useWaveformAnalysis(
      src,
      barCount,
      variant === "waveform" && analyzeWaveform,
    );

    /* -- Reset state on src change ---------------------------------------- */
    useEffect(() => {
      setHasError(false);
      setIsLoading(false);
      setBufferedEnd(0);
      setCurrentTime(0);
      setDuration(0);
    }, [src]);

    /* -- Merge refs ------------------------------------------------------- */
    const setRefs = useCallback(
      (el: HTMLAudioElement | null) => {
        audioRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref)
          (ref as React.MutableRefObject<HTMLAudioElement | null>).current = el;
      },
      [ref],
    );

    /* -- Audio event handlers --------------------------------------------- */
    const handleTimeUpdate = useCallback(() => {
      const audio = audioRef.current;
      if (!audio) return;
      setCurrentTime(audio.currentTime);
      onTimeUpdate?.(audio.currentTime);
    }, [onTimeUpdate]);

    const handleLoadedMetadata = useCallback(() => {
      const audio = audioRef.current;
      if (!audio) return;
      setDuration(audio.duration);
      setHasError(false);
      if (rate !== 1) audio.playbackRate = rate;
    }, [rate]);

    const handleEnded = useCallback(() => {
      setIsPlaying(false);
      onEnded?.();
    }, [onEnded]);

    const handlePlayEvent = useCallback(() => {
      setIsPlaying(true);
      onPlay?.();
    }, [onPlay]);

    const handlePauseEvent = useCallback(() => {
      setIsPlaying(false);
      onPause?.();
    }, [onPause]);

    const handleError = useCallback(() => {
      setHasError(true);
      setIsLoading(false);
      onErrorProp?.();
    }, [onErrorProp]);

    const handleWaiting = useCallback(() => setIsLoading(true), []);
    const handleCanPlay = useCallback(() => setIsLoading(false), []);
    const handlePlaying = useCallback(() => setIsLoading(false), []);

    const handleProgress = useCallback(() => {
      const audio = audioRef.current;
      if (!audio || audio.buffered.length === 0) return;
      setBufferedEnd(audio.buffered.end(audio.buffered.length - 1));
    }, []);

    /* -- Controls --------------------------------------------------------- */
    const togglePlay = useCallback(() => {
      const audio = audioRef.current;
      if (!audio) return;
      if (audio.paused) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    }, []);

    const handleSeek = useCallback((fraction: number) => {
      const audio = audioRef.current;
      if (!audio || !isFinite(audio.duration)) return;
      audio.currentTime = fraction * audio.duration;
    }, []);

    const handleVolumeChange = useCallback(
      (value: number) => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = value;
        setVolume(value);
        if (value > 0 && isMuted) {
          audio.muted = false;
          setIsMuted(false);
        }
      },
      [isMuted],
    );

    const toggleMute = useCallback(() => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.muted = !audio.muted;
      setIsMuted(!isMuted);
    }, [isMuted]);

    const skipForward = useCallback(() => {
      const audio = audioRef.current;
      if (!audio || !isFinite(audio.duration)) return;
      audio.currentTime = Math.min(audio.duration, audio.currentTime + skipInterval);
    }, [skipInterval]);

    const skipBackward = useCallback(() => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.currentTime = Math.max(0, audio.currentTime - skipInterval);
    }, [skipInterval]);

    const cyclePlaybackRate = useCallback(() => {
      const audio = audioRef.current;
      if (!audio) return;
      const idx = PLAYBACK_RATES.indexOf(rate);
      const nextRate = PLAYBACK_RATES[(idx + 1) % PLAYBACK_RATES.length];
      audio.playbackRate = nextRate;
      setRate(nextRate);
      onRateChange?.(nextRate);
    }, [rate, onRateChange]);

    const handleRetry = useCallback(() => {
      setHasError(false);
      setIsLoading(true);
      const audio = audioRef.current;
      if (audio) audio.load();
      onRetryProp?.();
    }, [onRetryProp]);

    const toggleTimeDisplay = useCallback(() => {
      setShowRemaining((r) => !r);
    }, []);

    /* -- SoundCloud embed ------------------------------------------------- */
    if (provider === "soundcloud") {
      const visual = size === "lg" || size === "xl";
      const embedUrl = getSoundCloudEmbedUrl(src, visual, soundcloudColorHexMap[color]);
      const height = embedHeightMap.soundcloud[size];
      return (
        <div className={cn(audioVariants({ rounded }), className)}>
          <iframe src={embedUrl} title={iframeTitle} width="100%" height={height} allow="autoplay" className="border-0" />
        </div>
      );
    }

    /* -- Spotify embed ---------------------------------------------------- */
    if (provider === "spotify") {
      const spotifyPath = extractSpotifyPath(src);
      if (!spotifyPath) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`[Audio] Could not extract Spotify path from URL: ${src}`);
        }
        return <div className={cn(audioVariants({ rounded }), className)} />;
      }
      const embedUrl = getSpotifyEmbedUrl(spotifyPath);
      const height = embedHeightMap.spotify[size];
      return (
        <div className={cn(audioVariants({ rounded }), className)}>
          <iframe src={embedUrl} title={iframeTitle} width="100%" height={height} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" className="border-0" />
        </div>
      );
    }

    /* -- Shared native UI pieces ------------------------------------------ */
    const regionLabel = trackTitle ? `Audio player: ${trackTitle}` : "Audio player";

    const audioElement = (
      <audio
        ref={setRefs}
        src={src}
        autoPlay={autoPlay}
        loop={loop}
        muted={initialMuted}
        preload={preload}
        crossOrigin={crossOrigin}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={handlePlayEvent}
        onPause={handlePauseEvent}
        onError={handleError}
        onWaiting={handleWaiting}
        onCanPlay={handleCanPlay}
        onPlaying={handlePlaying}
        onProgress={handleProgress}
      />
    );

    const playIcon = isLoading ? (
      <LoadingIcon className={cn(s.playIcon, "animate-spin")} />
    ) : isPlaying ? (
      <PauseIcon className={s.playIcon} />
    ) : (
      <PlayIcon className={cn(s.playIcon, "ml-0.5")} />
    );

    const playPauseButton = (
      <button
        type="button"
        aria-label={isPlaying ? "Pause" : "Play"}
        onClick={togglePlay}
        className={cn(
          "inline-flex items-center justify-center rounded-full shrink-0",
          "motion-safe:transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          focusColorMap[color],
          buttonColorMap[color],
          s.iconButton,
          "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700",
        )}
      >
        {playIcon}
      </button>
    );

    const skipBackButton = showSkipButtons ? (
      <button
        type="button"
        aria-label={`Skip back ${skipInterval} seconds`}
        onClick={skipBackward}
        className={cn(
          "inline-flex items-center justify-center rounded-full shrink-0 p-0.5",
          "motion-safe:transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          focusColorMap[color],
          buttonColorMap[color],
        )}
      >
        <SkipBackIcon className={s.controlIcon} />
      </button>
    ) : null;

    const skipForwardButton = showSkipButtons ? (
      <button
        type="button"
        aria-label={`Skip forward ${skipInterval} seconds`}
        onClick={skipForward}
        className={cn(
          "inline-flex items-center justify-center rounded-full shrink-0 p-0.5",
          "motion-safe:transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          focusColorMap[color],
          buttonColorMap[color],
        )}
      >
        <SkipForwardIcon className={s.controlIcon} />
      </button>
    ) : null;

    const playbackRateButton = showPlaybackRate ? (
      <button
        type="button"
        aria-label={`Playback speed ${rate}x`}
        onClick={cyclePlaybackRate}
        className={cn(
          "inline-flex items-center justify-center rounded shrink-0 px-1.5 font-mono tabular-nums",
          "motion-safe:transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          focusColorMap[color],
          "text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200",
          "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700",
          s.timeText,
        )}
      >
        {rate}x
      </button>
    ) : null;

    const seekBar = (
      <SeekBar
        current={currentTime}
        total={duration}
        height={s.progressHeight}
        color={progressColorMap[color]}
        onSeek={handleSeek}
        label="Seek"
        buffered={bufferedEnd}
        thumbSize={s.thumbSize}
        thumbColor={thumbBorderColorMap[color]}
        onTogglePlay={togglePlay}
      />
    );

    const remainingTime = Math.max(0, duration - currentTime);
    const timeDisplay = (
      <button
        type="button"
        aria-label={showRemaining ? "Show elapsed time" : "Show remaining time"}
        onClick={toggleTimeDisplay}
        className={cn(
          "tabular-nums shrink-0 select-none cursor-pointer rounded",
          "hover:text-slate-800 dark:hover:text-slate-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          focusColorMap[color],
          "text-slate-600 dark:text-slate-400",
          s.timeText,
        )}
      >
        {showRemaining
          ? `-${formatTime(remainingTime)} / ${formatTime(duration)}`
          : `${formatTime(currentTime)} / ${formatTime(duration)}`}
      </button>
    );

    const volumeControls = (
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          aria-label={isMuted ? "Unmute" : "Mute"}
          onClick={toggleMute}
          className={cn(
            "inline-flex items-center justify-center rounded-full p-1",
            "motion-safe:transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            focusColorMap[color],
            "text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200",
          )}
        >
          {isMuted ? <VolumeMuteIcon className={s.controlIcon} /> : <VolumeIcon className={s.controlIcon} />}
        </button>
        <VolumeSlider
          volume={isMuted ? 0 : volume}
          width={s.volumeWidth}
          height={s.progressHeight}
          color={progressColorMap[color]}
          onChange={handleVolumeChange}
          thumbSize={s.thumbSize}
          thumbColor={thumbBorderColorMap[color]}
        />
      </div>
    );

    const containerClasses = cn(
      audioVariants({ rounded }),
      "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700",
      s.padding,
      className,
    );

    /* -- Error state ------------------------------------------------------ */
    if (hasError) {
      const isWaveform = variant === "waveform";
      const errorContainer = isWaveform
        ? cn(audioVariants({ rounded }), "bg-gradient-to-br", gradientMap[color], s.padding, className)
        : containerClasses;
      const errorIconStyle = isWaveform ? "text-white/80 bg-white/20" : "text-red-500 bg-red-50 dark:bg-red-950";
      const errorTextStyle = isWaveform ? "text-white/70" : "text-slate-500 dark:text-slate-400";
      const retryBtnStyle = isWaveform
        ? "text-white/90 bg-white/20 hover:bg-white/30"
        : "text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700";

      return (
        <div className={errorContainer} role="region" aria-label={regionLabel}>
          {audioElement}
          <div className={cn("flex items-center", s.gap)}>
            <div className={cn("inline-flex items-center justify-center rounded-full shrink-0", errorIconStyle, s.iconButton)}>
              <ErrorIcon className={s.controlIcon} />
            </div>
            <span className={cn(errorTextStyle, s.text)}>Unable to load audio</span>
            <button
              type="button"
              aria-label="Retry"
              onClick={handleRetry}
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 shrink-0",
                "motion-safe:transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                focusColorMap[color],
                retryBtnStyle,
                s.timeText,
              )}
            >
              <RetryIcon className={s.controlIcon} />
              Retry
            </button>
          </div>
        </div>
      );
    }

    /* -- Minimal variant -------------------------------------------------- */
    if (variant === "minimal") {
      return (
        <div
          className={cn(containerClasses, "flex items-center", s.gap)}
          role="region"
          aria-label={regionLabel}
          aria-busy={isLoading || undefined}
        >
          {audioElement}
          {playPauseButton}
          {seekBar}
          <button
            type="button"
            aria-label={showRemaining ? "Show elapsed time" : "Show remaining time"}
            onClick={toggleTimeDisplay}
            className={cn(
              "tabular-nums shrink-0 select-none cursor-pointer rounded",
              "hover:text-slate-800 dark:hover:text-slate-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              focusColorMap[color],
              "text-slate-600 dark:text-slate-400",
              s.timeText,
            )}
          >
            {showRemaining ? `-${formatTime(remainingTime)}` : formatTime(currentTime)}
          </button>
        </div>
      );
    }

    /* -- Card variant ----------------------------------------------------- */
    if (variant === "card") {
      const isStacked = size === "xs" || size === "sm";

      return (
        <div className={containerClasses} role="region" aria-label={regionLabel} aria-busy={isLoading || undefined}>
          {audioElement}
          <div className={cn("flex", s.cardGap, s.cardDirection)}>
            {/* Artwork */}
            <div
              className={cn(
                "shrink-0 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center",
                isStacked ? "w-full h-32" : s.artworkSize,
              )}
            >
              {artwork ? (
                <img
                  src={artwork}
                  alt={trackTitle ? `${trackTitle} artwork` : "Album artwork"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <MusicNoteIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              )}
            </div>

            {/* Info + controls */}
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
              {(trackTitle || artist) && (
                <div className="min-w-0">
                  {trackTitle && (
                    <p className={cn("font-medium text-slate-900 dark:text-slate-100 truncate", s.text)}>
                      {trackTitle}
                    </p>
                  )}
                  {artist && (
                    <p className={cn("text-slate-600 dark:text-slate-400 truncate", s.timeText)}>
                      {artist}
                    </p>
                  )}
                </div>
              )}
              <div className={cn("flex items-center", s.gap)}>
                {skipBackButton}
                {playPauseButton}
                {skipForwardButton}
                {seekBar}
                {timeDisplay}
              </div>
              <div className="flex items-center gap-2">
                {playbackRateButton}
                {volumeControls}
              </div>
            </div>
          </div>
        </div>
      );
    }

    /* -- Waveform variant ------------------------------------------------- */
    if (variant === "waveform") {
      const bars = analyzedBars ?? generateWaveformBars(src, barCount);

      const wfPlayIcon = isLoading ? (
        <LoadingIcon className={cn(s.playIcon, "animate-spin")} />
      ) : isPlaying ? (
        <PauseIcon className={s.playIcon} />
      ) : (
        <PlayIcon className={cn(s.playIcon, "ml-0.5")} />
      );

      const wfBtnBase = cn(
        "inline-flex items-center justify-center rounded-full shrink-0",
        "motion-safe:transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white",
      );

      return (
        <div
          className={cn(audioVariants({ rounded }), "bg-gradient-to-br", gradientMap[color], s.padding, className)}
          role="region"
          aria-label={regionLabel}
          aria-busy={isLoading || undefined}
        >
          {audioElement}

          {(trackTitle || artist) && (
            <div className="mb-3">
              {trackTitle && <p className={cn("font-medium text-white truncate", s.text)}>{trackTitle}</p>}
              {artist && <p className={cn("text-white/70 truncate", s.timeText)}>{artist}</p>}
            </div>
          )}

          <WaveformSeekBar
            bars={bars}
            current={currentTime}
            total={duration}
            height={waveformHeightMap[size]}
            activeColor="bg-white/90"
            inactiveColor="bg-white/25"
            onSeek={handleSeek}
            onTogglePlay={togglePlay}
          />

          <div className={cn("flex items-center justify-between mt-3", s.gap)}>
            <div className="flex items-center gap-2">
              {showSkipButtons && (
                <button type="button" aria-label={`Skip back ${skipInterval} seconds`} onClick={skipBackward} className={cn(wfBtnBase, "p-0.5 text-white/70 hover:text-white")}>
                  <SkipBackIcon className={s.controlIcon} />
                </button>
              )}
              <button type="button" aria-label={isPlaying ? "Pause" : "Play"} onClick={togglePlay} className={cn(wfBtnBase, "text-white bg-white/20 hover:bg-white/30", s.iconButton)}>
                {wfPlayIcon}
              </button>
              {showSkipButtons && (
                <button type="button" aria-label={`Skip forward ${skipInterval} seconds`} onClick={skipForward} className={cn(wfBtnBase, "p-0.5 text-white/70 hover:text-white")}>
                  <SkipForwardIcon className={s.controlIcon} />
                </button>
              )}
              <button
                type="button"
                aria-label={showRemaining ? "Show elapsed time" : "Show remaining time"}
                onClick={toggleTimeDisplay}
                className={cn(
                  "tabular-nums shrink-0 select-none cursor-pointer rounded",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white",
                  "text-white/80 hover:text-white",
                  s.timeText,
                )}
              >
                {showRemaining
                  ? `-${formatTime(remainingTime)} / ${formatTime(duration)}`
                  : `${formatTime(currentTime)} / ${formatTime(duration)}`}
              </button>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {showPlaybackRate && (
                <button
                  type="button"
                  aria-label={`Playback speed ${rate}x`}
                  onClick={cyclePlaybackRate}
                  className={cn(
                    "inline-flex items-center justify-center rounded shrink-0 px-1.5 font-mono tabular-nums",
                    "motion-safe:transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white",
                    "text-white/70 hover:text-white bg-white/10 hover:bg-white/20",
                    s.timeText,
                  )}
                >
                  {rate}x
                </button>
              )}
              <button
                type="button"
                aria-label={isMuted ? "Unmute" : "Mute"}
                onClick={toggleMute}
                className={cn(
                  "inline-flex items-center justify-center rounded-full p-1",
                  "motion-safe:transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white",
                  "text-white/70 hover:text-white",
                )}
              >
                {isMuted ? <VolumeMuteIcon className={s.controlIcon} /> : <VolumeIcon className={s.controlIcon} />}
              </button>
              <VolumeSlider
                volume={isMuted ? 0 : volume}
                width={s.volumeWidth}
                height={s.progressHeight}
                color="bg-white/80"
                trackColor="bg-white/20"
                onChange={handleVolumeChange}
                thumbSize={s.thumbSize}
                thumbColor="border-white/80"
              />
            </div>
          </div>
        </div>
      );
    }

    /* -- Standard variant (default) --------------------------------------- */
    return (
      <div className={containerClasses} role="region" aria-label={regionLabel} aria-busy={isLoading || undefined}>
        {audioElement}
        <div className={cn("flex items-center", s.gap)}>
          {skipBackButton}
          {playPauseButton}
          {skipForwardButton}
          {seekBar}
          {timeDisplay}
          {playbackRateButton}
          {volumeControls}
        </div>
      </div>
    );
  },
);
Audio.displayName = "Audio";

export {
  Audio,
  audioVariants,
  detectAudioProvider,
  extractSpotifyPath,
  getSoundCloudEmbedUrl,
  getSpotifyEmbedUrl,
  formatTime,
  generateWaveformBars,
  PLAYBACK_RATES,
};
export type {
  AudioProps,
  AudioProvider,
  AudioVariant,
  AudioSize,
  AudioColor,
  AudioRounded,
};
