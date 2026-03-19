import { forwardRef } from "react";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Icon } from "../data-display/icon";
import { ProgressBar } from "../data-display/progress-bar";

type AudioPlayerProps = {
  currentTime?: string;
  duration?: string;
  progress?: number;
  playing?: boolean;
  showWaveform?: boolean;
  onPlayPause?: () => void;
  className?: string;
  /** Accessible label for the audio player region (use unique labels when multiple players are on the same page) */
  label?: string;
};

const AudioPlayer = forwardRef<HTMLDivElement, AudioPlayerProps>(
  (
    {
      currentTime = "0:00",
      duration = "3:45",
      progress = 0,
      playing = false,
      showWaveform = true,
      onPlayPause,
      className,
      label = "Audio player",
    },
    ref
  ) => {
    // Deterministic waveform bar heights
    const waveformBars = [3, 5, 8, 4, 7, 10, 6, 9, 3, 7, 5, 8, 11, 4, 6, 9, 3, 7, 5, 8, 4, 10, 6, 3, 7, 5, 9, 4, 8, 6];

    return (
      <div
        ref={ref}
        className={cn(s.audioContainer, "px-4 py-3", className)}
        role="region"
        aria-label={label}
      >
        {/* Play button */}
        <button
          type="button"
          aria-label={playing ? "Pause" : "Play"}
          onClick={onPlayPause}
          className={cn(
            s.audioPlayButton,
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          )}
        >
          <Icon name={playing ? "pause" : "play_arrow"} size="md" />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          {showWaveform ? (
            <div className={s.audioWaveform} aria-hidden="true">
              {waveformBars.map((h, i) => {
                const filled = progress > 0 && i / waveformBars.length < progress / 100;
                return (
                  <div
                    key={i}
                    className={cn(
                      "w-1 rounded-full transition-colors",
                      filled ? "bg-primary" : "bg-slate-200"
                    )}
                    style={{ height: `${h * 3}px` }}
                  />
                );
              })}
            </div>
          ) : (
            <ProgressBar value={progress} size="sm" />
          )}

          {/* Time */}
          <div className="flex items-center justify-between">
            <span className={s.audioTime} aria-label="Current time">{currentTime}</span>
            <span className={s.audioTime} aria-label="Duration">{duration}</span>
          </div>
        </div>
      </div>
    );
  }
);
AudioPlayer.displayName = "AudioPlayer";

export { AudioPlayer };
export type { AudioPlayerProps };
