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
  className?: string;
};

function AudioPlayer({
  currentTime = "0:00",
  duration = "3:45",
  progress = 0,
  playing = false,
  showWaveform = true,
  className,
}: AudioPlayerProps) {
  // Deterministic waveform bar heights
  const waveformBars = [3, 5, 8, 4, 7, 10, 6, 9, 3, 7, 5, 8, 11, 4, 6, 9, 3, 7, 5, 8, 4, 10, 6, 3, 7, 5, 9, 4, 8, 6];

  return (
    <div className={cn(s.audioContainer, "px-4 py-3", className)}>
      {/* Play button */}
      <button className={s.audioPlayButton}>
        <Icon name={playing ? "pause" : "play_arrow"} size="md" />
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        {showWaveform ? (
          <div className={s.audioWaveform}>
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
          <span className={s.audioTime}>{currentTime}</span>
          <span className={s.audioTime}>{duration}</span>
        </div>
      </div>
    </div>
  );
}

export { AudioPlayer };
export type { AudioPlayerProps };
