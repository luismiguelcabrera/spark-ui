"use client";

import {
  forwardRef,
  useState,
  useCallback,
  useMemo,
  useRef,
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
type AudioVariant = "minimal" | "standard" | "card";
type AudioSize = "sm" | "md" | "lg";
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
  /**
   * Player layout variant.
   * @default "standard"
   */
  variant?: AudioVariant;
  /**
   * Player size.
   * @default "md"
   */
  size?: AudioSize;
  /**
   * Accent color for controls.
   * @default "primary"
   */
  color?: AudioColor;
  /** Track title (shown in card variant, used in aria-label). */
  title?: string;
  /** Artist name (shown in card variant). */
  artist?: string;
  /** Album artwork URL (shown in card variant). */
  artwork?: string;
  /** Additional class names. */
  className?: string;
  /**
   * Title for embedded iframes (accessibility).
   * @default "Audio player"
   */
  iframeTitle?: string;
  /** Auto-play on load. */
  autoPlay?: boolean;
  /** Loop playback. */
  loop?: boolean;
  /** Start muted. */
  muted?: boolean;
  /**
   * Preload behavior.
   * @default "metadata"
   */
  preload?: "none" | "metadata" | "auto";
  /** Callback when playback starts. */
  onPlay?: () => void;
  /** Callback when playback pauses. */
  onPause?: () => void;
  /** Callback when playback ends. */
  onEnded?: () => void;
  /** Callback on time update with current time in seconds. */
  onTimeUpdate?: (currentTime: number) => void;
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

function getSoundCloudEmbedUrl(src: string, visual: boolean): string {
  const params = new URLSearchParams({
    url: src,
    color: "4f46e5",
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
  warning: "bg-amber-500",
  destructive: "bg-red-500",
};

const buttonColorMap: Record<AudioColor, string> = {
  primary: "text-primary",
  secondary: "text-slate-600 dark:text-slate-400",
  accent: "text-amber-600",
  success: "text-emerald-600",
  warning: "text-amber-600",
  destructive: "text-red-600",
};

const focusColorMap: Record<AudioColor, string> = {
  primary: "focus-visible:ring-primary",
  secondary: "focus-visible:ring-slate-500",
  accent: "focus-visible:ring-amber-500",
  success: "focus-visible:ring-emerald-500",
  warning: "focus-visible:ring-amber-500",
  destructive: "focus-visible:ring-red-500",
};

/* -------------------------------------------------------------------------- */
/*  Size maps                                                                  */
/* -------------------------------------------------------------------------- */

const sizeMap = {
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
  },
};

const embedHeightMap = {
  soundcloud: { sm: 80, md: 166, lg: 300 },
  spotify: { sm: 80, md: 152, lg: 352 },
};

/* -------------------------------------------------------------------------- */
/*  Inline SVG icons                                                           */
/* -------------------------------------------------------------------------- */

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
    </svg>
  );
}

function VolumeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
}

function VolumeMuteIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
    </svg>
  );
}

function MusicNoteIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
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
}: {
  current: number;
  total: number;
  height: string;
  color: string;
  onSeek: (fraction: number) => void;
  label: string;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const progress = total > 0 ? (current / total) * 100 : 0;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const bar = barRef.current;
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      const fraction = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width),
      );
      onSeek(fraction);
    },
    [onSeek],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
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
    [current, total, onSeek],
  );

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
      onKeyDown={handleKeyDown}
    >
      <div
        className={cn(
          "absolute inset-y-0 left-0 rounded-full motion-safe:transition-[width] motion-safe:duration-100",
          color,
        )}
        style={{ width: `${progress}%` }}
      />
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
  onChange,
}: {
  volume: number;
  width: string;
  height: string;
  color: string;
  onChange: (value: number) => void;
}) {
  const barRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const bar = barRef.current;
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      const fraction = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width),
      );
      onChange(fraction);
    },
    [onChange],
  );

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
        "relative cursor-pointer rounded-full bg-slate-200 dark:bg-slate-700",
        width,
        height,
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div
        className={cn(
          "absolute inset-y-0 left-0 rounded-full motion-safe:transition-[width] motion-safe:duration-100",
          color,
        )}
        style={{ width: `${volume * 100}%` }}
      />
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
      onPlay,
      onPause,
      onEnded,
      onTimeUpdate,
    },
    ref,
  ) => {
    const provider = useMemo(() => detectAudioProvider(src), [src]);
    const audioRef = useRef<HTMLAudioElement>(null);
    const s = sizeMap[size];

    /* -- State ------------------------------------------------------------ */
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(initialMuted);

    /* -- Merge refs ------------------------------------------------------- */
    const setRefs = useCallback(
      (el: HTMLAudioElement | null) => {
        (audioRef as React.MutableRefObject<HTMLAudioElement | null>).current =
          el;
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
    }, []);

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

    /* -- Controls --------------------------------------------------------- */
    const togglePlay = useCallback(() => {
      const audio = audioRef.current;
      if (!audio) return;
      if (audio.paused) {
        audio.play();
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

    /* -- SoundCloud embed ------------------------------------------------- */
    if (provider === "soundcloud") {
      const visual = size === "lg";
      const embedUrl = getSoundCloudEmbedUrl(src, visual);
      const height = embedHeightMap.soundcloud[size];

      return (
        <div className={cn(audioVariants({ rounded }), className)}>
          <iframe
            src={embedUrl}
            title={iframeTitle}
            width="100%"
            height={height}
            allow="autoplay"
            className="border-0"
          />
        </div>
      );
    }

    /* -- Spotify embed ---------------------------------------------------- */
    if (provider === "spotify") {
      const spotifyPath = extractSpotifyPath(src);

      if (!spotifyPath) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            `[Audio] Could not extract Spotify path from URL: ${src}`,
          );
        }
        return (
          <div className={cn(audioVariants({ rounded }), className)} />
        );
      }

      const embedUrl = getSpotifyEmbedUrl(spotifyPath);
      const height = embedHeightMap.spotify[size];

      return (
        <div className={cn(audioVariants({ rounded }), className)}>
          <iframe
            src={embedUrl}
            title={iframeTitle}
            width="100%"
            height={height}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            className="border-0"
          />
        </div>
      );
    }

    /* -- Shared native UI pieces ------------------------------------------ */
    const regionLabel = trackTitle
      ? `Audio player: ${trackTitle}`
      : "Audio player";

    const audioElement = (
      <audio
        ref={setRefs}
        src={src}
        autoPlay={autoPlay}
        loop={loop}
        muted={initialMuted}
        preload={preload}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onPlay={handlePlayEvent}
        onPause={handlePauseEvent}
      />
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
        {isPlaying ? (
          <PauseIcon className={s.playIcon} />
        ) : (
          <PlayIcon className={cn(s.playIcon, "ml-0.5")} />
        )}
      </button>
    );

    const seekBar = (
      <SeekBar
        current={currentTime}
        total={duration}
        height={s.progressHeight}
        color={progressColorMap[color]}
        onSeek={handleSeek}
        label="Seek"
      />
    );

    const timeDisplay = (
      <span
        className={cn(
          "tabular-nums text-slate-500 dark:text-slate-400 shrink-0 select-none",
          s.timeText,
        )}
      >
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
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
            "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
          )}
        >
          {isMuted ? (
            <VolumeMuteIcon className={s.controlIcon} />
          ) : (
            <VolumeIcon className={s.controlIcon} />
          )}
        </button>
        <VolumeSlider
          volume={isMuted ? 0 : volume}
          width={s.volumeWidth}
          height={s.progressHeight}
          color={progressColorMap[color]}
          onChange={handleVolumeChange}
        />
      </div>
    );

    const containerClasses = cn(
      audioVariants({ rounded }),
      "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700",
      s.padding,
      className,
    );

    /* -- Minimal variant -------------------------------------------------- */
    if (variant === "minimal") {
      return (
        <div
          className={cn(containerClasses, "flex items-center", s.gap)}
          role="region"
          aria-label={regionLabel}
        >
          {audioElement}
          {playPauseButton}
          {seekBar}
          <span
            className={cn(
              "tabular-nums text-slate-500 dark:text-slate-400 shrink-0 select-none",
              s.timeText,
            )}
          >
            {formatTime(currentTime)}
          </span>
        </div>
      );
    }

    /* -- Card variant ----------------------------------------------------- */
    if (variant === "card") {
      return (
        <div
          className={containerClasses}
          role="region"
          aria-label={regionLabel}
        >
          {audioElement}
          <div className={cn("flex", s.cardGap)}>
            {/* Artwork */}
            <div
              className={cn(
                "shrink-0 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center",
                s.artworkSize,
              )}
            >
              {artwork ? (
                <img
                  src={artwork}
                  alt={
                    trackTitle
                      ? `${trackTitle} artwork`
                      : "Album artwork"
                  }
                  className="w-full h-full object-cover"
                />
              ) : (
                <MusicNoteIcon className="w-6 h-6 text-slate-400 dark:text-slate-500" />
              )}
            </div>

            {/* Info + controls */}
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
              {(trackTitle || artist) && (
                <div className="min-w-0">
                  {trackTitle && (
                    <p
                      className={cn(
                        "font-medium text-slate-900 dark:text-slate-100 truncate",
                        s.text,
                      )}
                    >
                      {trackTitle}
                    </p>
                  )}
                  {artist && (
                    <p
                      className={cn(
                        "text-slate-500 dark:text-slate-400 truncate",
                        s.timeText,
                      )}
                    >
                      {artist}
                    </p>
                  )}
                </div>
              )}

              <div className={cn("flex items-center", s.gap)}>
                {playPauseButton}
                {seekBar}
                {timeDisplay}
              </div>

              <div className="flex items-center">{volumeControls}</div>
            </div>
          </div>
        </div>
      );
    }

    /* -- Standard variant (default) --------------------------------------- */
    return (
      <div
        className={containerClasses}
        role="region"
        aria-label={regionLabel}
      >
        {audioElement}
        <div className={cn("flex items-center", s.gap)}>
          {playPauseButton}
          {seekBar}
          {timeDisplay}
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
};
export type {
  AudioProps,
  AudioProvider,
  AudioVariant,
  AudioSize,
  AudioColor,
  AudioRounded,
};
