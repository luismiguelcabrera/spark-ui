import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  Audio,
  detectAudioProvider,
  extractSpotifyPath,
  getSoundCloudEmbedUrl,
  getSpotifyEmbedUrl,
  formatTime,
  generateWaveformBars,
} from "../audio";

/* -------------------------------------------------------------------------- */
/*  Mock HTMLMediaElement                                                       */
/* -------------------------------------------------------------------------- */

beforeEach(() => {
  // jsdom does not implement play/pause
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(() =>
    Promise.resolve(),
  );
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(
    () => undefined,
  );
});

/* -------------------------------------------------------------------------- */
/*  URL parsing helpers                                                        */
/* -------------------------------------------------------------------------- */

describe("detectAudioProvider", () => {
  it.each([
    ["https://soundcloud.com/artist/track-name", "soundcloud"],
    ["https://open.spotify.com/track/6rqhFgbbKwnb9MLmUQDhG6", "spotify"],
    ["https://open.spotify.com/album/4aawyAB9vmqN3uQ7FjRGTy", "spotify"],
    ["https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M", "spotify"],
    ["https://open.spotify.com/episode/abc123def456", "spotify"],
    ["/audio.mp3", "native"],
    ["https://example.com/song.wav", "native"],
    ["https://cdn.example.com/podcast.ogg", "native"],
  ])("detects %s as %s", (url, expected) => {
    expect(detectAudioProvider(url)).toBe(expected);
  });
});

describe("extractSpotifyPath", () => {
  it.each([
    [
      "https://open.spotify.com/track/6rqhFgbbKwnb9MLmUQDhG6",
      "track/6rqhFgbbKwnb9MLmUQDhG6",
    ],
    [
      "https://open.spotify.com/album/4aawyAB9vmqN3uQ7FjRGTy",
      "album/4aawyAB9vmqN3uQ7FjRGTy",
    ],
    [
      "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M",
      "playlist/37i9dQZF1DXcBWIGoYBM5M",
    ],
    [
      "https://open.spotify.com/episode/abc123def456",
      "episode/abc123def456",
    ],
    [
      "https://open.spotify.com/show/xyz789abc123",
      "show/xyz789abc123",
    ],
  ])("extracts path from %s", (url, expected) => {
    expect(extractSpotifyPath(url)).toBe(expected);
  });

  it("returns null for invalid URL", () => {
    expect(extractSpotifyPath("https://spotify.com/invalid")).toBeNull();
  });
});

describe("getSoundCloudEmbedUrl", () => {
  it("generates embed URL with encoded source", () => {
    const url = getSoundCloudEmbedUrl(
      "https://soundcloud.com/artist/track",
      false,
    );
    expect(url).toContain("w.soundcloud.com/player");
    expect(url).toContain(
      encodeURIComponent("https://soundcloud.com/artist/track"),
    );
    expect(url).toContain("visual=false");
  });

  it("sets visual=true when requested", () => {
    const url = getSoundCloudEmbedUrl(
      "https://soundcloud.com/artist/track",
      true,
    );
    expect(url).toContain("visual=true");
  });
});

describe("getSpotifyEmbedUrl", () => {
  it("generates embed URL from path", () => {
    expect(getSpotifyEmbedUrl("track/abc123")).toBe(
      "https://open.spotify.com/embed/track/abc123",
    );
  });
});

describe("formatTime", () => {
  it.each([
    [0, "0:00"],
    [5, "0:05"],
    [65, "1:05"],
    [600, "10:00"],
    [3661, "61:01"],
    [-1, "0:00"],
    [NaN, "0:00"],
    [Infinity, "0:00"],
  ])("formats %s as %s", (input, expected) => {
    expect(formatTime(input)).toBe(expected);
  });
});

/* -------------------------------------------------------------------------- */
/*  Native audio — rendering                                                   */
/* -------------------------------------------------------------------------- */

describe("Audio (native)", () => {
  it("renders a hidden audio element", () => {
    const { container } = render(<Audio src="/test.mp3" />);
    const audio = container.querySelector("audio");
    expect(audio).toBeInTheDocument();
    expect(audio).toHaveAttribute("src", "/test.mp3");
  });

  it("forwards ref to audio element", () => {
    const ref = { current: null as HTMLAudioElement | null };
    render(<Audio ref={ref} src="/test.mp3" />);
    expect(ref.current).toBeInstanceOf(HTMLAudioElement);
  });

  it("forwards function ref", () => {
    let element: HTMLAudioElement | null = null;
    render(
      <Audio
        ref={(el) => {
          element = el;
        }}
        src="/test.mp3"
      />,
    );
    expect(element).toBeInstanceOf(HTMLAudioElement);
  });

  it("passes autoPlay, loop, muted, preload to audio element", () => {
    const { container } = render(
      <Audio src="/test.mp3" autoPlay loop muted preload="auto" />,
    );
    const audio = container.querySelector("audio") as HTMLAudioElement;
    expect(audio).toHaveAttribute("autoplay");
    expect(audio.loop).toBe(true);
    expect(audio.muted).toBe(true);
    expect(audio).toHaveAttribute("preload", "auto");
  });

  it("defaults preload to metadata", () => {
    const { container } = render(<Audio src="/test.mp3" />);
    const audio = container.querySelector("audio");
    expect(audio).toHaveAttribute("preload", "metadata");
  });

  it("renders region with default aria-label", () => {
    render(<Audio src="/test.mp3" />);
    expect(
      screen.getByRole("region", { name: "Audio player" }),
    ).toBeInTheDocument();
  });

  it("includes track title in aria-label", () => {
    render(<Audio src="/test.mp3" title="My Song" />);
    expect(
      screen.getByRole("region", { name: "Audio player: My Song" }),
    ).toBeInTheDocument();
  });

  it("merges className", () => {
    const { container } = render(
      <Audio src="/test.mp3" className="custom-audio" />,
    );
    expect(container.firstChild).toHaveClass("custom-audio");
  });

  it.each(["none", "sm", "md", "lg", "xl"] as const)(
    "applies rounded=%s",
    (r) => {
      const roundedClass = {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-lg",
        lg: "rounded-xl",
        xl: "rounded-2xl",
      }[r];
      const { container } = render(<Audio src="/test.mp3" rounded={r} />);
      expect(container.firstChild).toHaveClass(roundedClass);
    },
  );

  it("applies default rounded (md)", () => {
    const { container } = render(<Audio src="/test.mp3" />);
    expect(container.firstChild).toHaveClass("rounded-lg");
  });

  it("has border and background on container", () => {
    const { container } = render(<Audio src="/test.mp3" />);
    expect(container.firstChild).toHaveClass("bg-surface", "border");
  });
});

/* -------------------------------------------------------------------------- */
/*  Variants                                                                   */
/* -------------------------------------------------------------------------- */

describe("Audio variants", () => {
  it("standard variant shows play, seek, time, and volume", () => {
    render(<Audio src="/test.mp3" variant="standard" />);
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Seek" })).toBeInTheDocument();
    expect(
      screen.getByRole("slider", { name: "Volume" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mute" })).toBeInTheDocument();
  });

  it("minimal variant shows play, seek, and time but no volume", () => {
    render(<Audio src="/test.mp3" variant="minimal" />);
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Seek" })).toBeInTheDocument();
    expect(
      screen.queryByRole("slider", { name: "Volume" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Mute" }),
    ).not.toBeInTheDocument();
  });

  it("card variant shows artwork placeholder when no artwork provided", () => {
    const { container } = render(
      <Audio src="/test.mp3" variant="card" title="Song" artist="Artist" />,
    );
    // Music note SVG icon is rendered as placeholder
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(0);
  });

  it("card variant shows artwork image", () => {
    const { container } = render(
      <Audio
        src="/test.mp3"
        variant="card"
        title="Song"
        artist="Artist"
        artwork="/cover.jpg"
      />,
    );
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", "/cover.jpg");
    expect(img).toHaveAttribute("alt", "Song artwork");
  });

  it("card variant shows title and artist", () => {
    render(
      <Audio
        src="/test.mp3"
        variant="card"
        title="My Song"
        artist="The Artist"
      />,
    );
    expect(screen.getByText("My Song")).toBeInTheDocument();
    expect(screen.getByText("The Artist")).toBeInTheDocument();
  });

  it("card variant has volume controls", () => {
    render(<Audio src="/test.mp3" variant="card" />);
    expect(
      screen.getByRole("slider", { name: "Volume" }),
    ).toBeInTheDocument();
  });
});

/* -------------------------------------------------------------------------- */
/*  Play / Pause                                                               */
/* -------------------------------------------------------------------------- */

describe("Audio play/pause", () => {
  it("calls play on the audio element when Play button is clicked", () => {
    render(<Audio src="/test.mp3" />);
    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
  });

  it("switches to Pause button when audio plays", () => {
    const { container } = render(<Audio src="/test.mp3" />);
    const audio = container.querySelector("audio")!;
    fireEvent.play(audio);
    expect(
      screen.getByRole("button", { name: "Pause" }),
    ).toBeInTheDocument();
  });

  it("calls pause on the audio element when Pause button is clicked", () => {
    const { container } = render(<Audio src="/test.mp3" />);
    const audio = container.querySelector("audio")!;
    // jsdom doesn't update `paused` on events, so mock it
    Object.defineProperty(audio, "paused", { value: false, writable: true });
    fireEvent.play(audio);
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });

  it("switches back to Play button when audio pauses", () => {
    const { container } = render(<Audio src="/test.mp3" />);
    const audio = container.querySelector("audio")!;
    fireEvent.play(audio);
    fireEvent.pause(audio);
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  });

  it("fires onPlay callback", () => {
    const onPlay = vi.fn();
    const { container } = render(<Audio src="/test.mp3" onPlay={onPlay} />);
    const audio = container.querySelector("audio")!;
    fireEvent.play(audio);
    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  it("fires onPause callback", () => {
    const onPause = vi.fn();
    const { container } = render(<Audio src="/test.mp3" onPause={onPause} />);
    const audio = container.querySelector("audio")!;
    fireEvent.pause(audio);
    expect(onPause).toHaveBeenCalledTimes(1);
  });

  it("fires onEnded callback and resets to Play", () => {
    const onEnded = vi.fn();
    const { container } = render(<Audio src="/test.mp3" onEnded={onEnded} />);
    const audio = container.querySelector("audio")!;
    fireEvent.play(audio);
    fireEvent.ended(audio);
    expect(onEnded).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  });
});

/* -------------------------------------------------------------------------- */
/*  Seek bar                                                                   */
/* -------------------------------------------------------------------------- */

describe("Audio seek bar", () => {
  it("renders a seek slider with correct ARIA", () => {
    render(<Audio src="/test.mp3" />);
    const slider = screen.getByRole("slider", { name: "Seek" });
    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuenow", "0");
    expect(slider).toHaveAttribute("aria-valuetext", "0:00 of 0:00");
  });

  it("updates time display on timeupdate event", () => {
    const onTimeUpdate = vi.fn();
    const { container } = render(
      <Audio src="/test.mp3" onTimeUpdate={onTimeUpdate} />,
    );
    const audio = container.querySelector("audio") as HTMLAudioElement;

    // Simulate loaded metadata with 120s duration
    Object.defineProperty(audio, "duration", { value: 120, writable: true });
    fireEvent.loadedMetadata(audio);

    // Simulate time update at 65s
    Object.defineProperty(audio, "currentTime", {
      value: 65,
      writable: true,
    });
    fireEvent.timeUpdate(audio);

    expect(onTimeUpdate).toHaveBeenCalledWith(65);
  });

  it("seeks on click", () => {
    const { container } = render(<Audio src="/test.mp3" />);
    const audio = container.querySelector("audio") as HTMLAudioElement;

    Object.defineProperty(audio, "duration", { value: 100, writable: true });
    Object.defineProperty(audio, "currentTime", {
      value: 0,
      writable: true,
      configurable: true,
    });
    fireEvent.loadedMetadata(audio);

    const seekBar = screen.getByRole("slider", { name: "Seek" });
    // Mock getBoundingClientRect
    vi.spyOn(seekBar, "getBoundingClientRect").mockReturnValue({
      left: 0,
      right: 200,
      width: 200,
      top: 0,
      bottom: 10,
      height: 10,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    fireEvent.click(seekBar, { clientX: 100 });
    // Audio currentTime should be set to 50% of 100s = 50s
    expect(audio.currentTime).toBe(50);
  });

  it("seeks with ArrowRight key", () => {
    const { container } = render(<Audio src="/test.mp3" />);
    const audio = container.querySelector("audio") as HTMLAudioElement;

    Object.defineProperty(audio, "duration", { value: 100, writable: true });
    Object.defineProperty(audio, "currentTime", {
      value: 0,
      writable: true,
      configurable: true,
    });
    fireEvent.loadedMetadata(audio);

    const seekBar = screen.getByRole("slider", { name: "Seek" });
    fireEvent.keyDown(seekBar, { key: "ArrowRight" });
    // Should seek forward 5 seconds → fraction = 5/100 = 0.05
    expect(audio.currentTime).toBe(5);
  });

  it("seeks with ArrowLeft key", () => {
    const { container } = render(<Audio src="/test.mp3" />);
    const audio = container.querySelector("audio") as HTMLAudioElement;

    Object.defineProperty(audio, "duration", { value: 100, writable: true });
    Object.defineProperty(audio, "currentTime", {
      value: 50,
      writable: true,
      configurable: true,
    });
    fireEvent.loadedMetadata(audio);
    fireEvent.timeUpdate(audio);

    const seekBar = screen.getByRole("slider", { name: "Seek" });
    fireEvent.keyDown(seekBar, { key: "ArrowLeft" });
    expect(audio.currentTime).toBe(45);
  });
});

/* -------------------------------------------------------------------------- */
/*  Volume controls                                                            */
/* -------------------------------------------------------------------------- */

describe("Audio volume", () => {
  it("renders volume slider with correct ARIA", () => {
    render(<Audio src="/test.mp3" />);
    const slider = screen.getByRole("slider", { name: "Volume" });
    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "100");
    expect(slider).toHaveAttribute("aria-valuenow", "100");
  });

  it("mute button toggles muted state", () => {
    render(<Audio src="/test.mp3" />);
    const muteBtn = screen.getByRole("button", { name: "Mute" });
    fireEvent.click(muteBtn);
    expect(
      screen.getByRole("button", { name: "Unmute" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Unmute" }));
    expect(screen.getByRole("button", { name: "Mute" })).toBeInTheDocument();
  });

  it("volume slider shows 0 when muted", () => {
    render(<Audio src="/test.mp3" />);
    fireEvent.click(screen.getByRole("button", { name: "Mute" }));
    expect(screen.getByRole("slider", { name: "Volume" })).toHaveAttribute(
      "aria-valuenow",
      "0",
    );
  });

  it("starts muted when muted prop is true", () => {
    render(<Audio src="/test.mp3" muted />);
    expect(
      screen.getByRole("button", { name: "Unmute" }),
    ).toBeInTheDocument();
  });

  it("adjusts volume on click", () => {
    const { container } = render(<Audio src="/test.mp3" />);
    const audio = container.querySelector("audio") as HTMLAudioElement;
    const volumeSlider = screen.getByRole("slider", { name: "Volume" });

    vi.spyOn(volumeSlider, "getBoundingClientRect").mockReturnValue({
      left: 0,
      right: 100,
      width: 100,
      top: 0,
      bottom: 10,
      height: 10,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    fireEvent.click(volumeSlider, { clientX: 50 });
    expect(audio.volume).toBe(0.5);
  });

  it("adjusts volume with ArrowRight key", () => {
    const { container } = render(<Audio src="/test.mp3" />);
    const audio = container.querySelector("audio") as HTMLAudioElement;
    const volumeSlider = screen.getByRole("slider", { name: "Volume" });

    // Volume starts at 1, pressing ArrowDown should decrease by 0.1
    fireEvent.keyDown(volumeSlider, { key: "ArrowDown" });
    expect(audio.volume).toBeCloseTo(0.9, 1);
  });
});

/* -------------------------------------------------------------------------- */
/*  Sizes                                                                      */
/* -------------------------------------------------------------------------- */

describe("Audio sizes", () => {
  it.each(["xs", "sm", "md", "lg", "xl"] as const)("renders at size=%s", (s) => {
    render(<Audio src="/test.mp3" size={s} />);
    expect(
      screen.getByRole("region", { name: "Audio player" }),
    ).toBeInTheDocument();
  });
});

/* -------------------------------------------------------------------------- */
/*  Colors                                                                     */
/* -------------------------------------------------------------------------- */

describe("Audio colors", () => {
  it.each([
    "primary",
    "secondary",
    "accent",
    "success",
    "warning",
    "destructive",
  ] as const)("renders with color=%s", (c) => {
    render(<Audio src="/test.mp3" color={c} />);
    expect(
      screen.getByRole("region", { name: "Audio player" }),
    ).toBeInTheDocument();
  });
});

/* -------------------------------------------------------------------------- */
/*  SoundCloud embed                                                           */
/* -------------------------------------------------------------------------- */

describe("Audio (SoundCloud)", () => {
  const scUrl = "https://soundcloud.com/artist/track-name";

  it("renders an iframe for SoundCloud", () => {
    render(<Audio src={scUrl} />);
    const iframe = screen.getByTitle("Audio player");
    expect(iframe).toBeInTheDocument();
    expect(iframe.tagName).toBe("IFRAME");
  });

  it("iframe src contains soundcloud player URL", () => {
    render(<Audio src={scUrl} />);
    const iframe = screen.getByTitle("Audio player") as HTMLIFrameElement;
    expect(iframe.src).toContain("w.soundcloud.com/player");
  });

  it("encodes the source URL in the embed", () => {
    render(<Audio src={scUrl} />);
    const iframe = screen.getByTitle("Audio player") as HTMLIFrameElement;
    expect(iframe.src).toContain(encodeURIComponent(scUrl));
  });

  it("uses custom iframeTitle", () => {
    render(<Audio src={scUrl} iframeTitle="My SC player" />);
    expect(screen.getByTitle("My SC player")).toBeInTheDocument();
  });

  it("applies rounded and className", () => {
    const { container } = render(
      <Audio src={scUrl} rounded="xl" className="my-sc" />,
    );
    expect(container.firstChild).toHaveClass("rounded-2xl", "my-sc");
  });

  it.each(["xs", "sm", "md", "lg", "xl"] as const)("adjusts height for size=%s", (s) => {
    const heights = { xs: "80", sm: "80", md: "166", lg: "300", xl: "300" };
    render(<Audio src={scUrl} size={s} />);
    const iframe = screen.getByTitle("Audio player") as HTMLIFrameElement;
    expect(iframe).toHaveAttribute("height", heights[s]);
  });

  it("uses visual mode for lg size", () => {
    render(<Audio src={scUrl} size="lg" />);
    const iframe = screen.getByTitle("Audio player") as HTMLIFrameElement;
    expect(iframe.src).toContain("visual=true");
  });
});

/* -------------------------------------------------------------------------- */
/*  Spotify embed                                                              */
/* -------------------------------------------------------------------------- */

describe("Audio (Spotify)", () => {
  const spotifyTrack =
    "https://open.spotify.com/track/6rqhFgbbKwnb9MLmUQDhG6";

  it("renders an iframe for Spotify track", () => {
    render(<Audio src={spotifyTrack} />);
    const iframe = screen.getByTitle("Audio player");
    expect(iframe).toBeInTheDocument();
    expect(iframe.tagName).toBe("IFRAME");
  });

  it("iframe src contains Spotify embed URL", () => {
    render(<Audio src={spotifyTrack} />);
    const iframe = screen.getByTitle("Audio player") as HTMLIFrameElement;
    expect(iframe.src).toContain("open.spotify.com/embed/track");
    expect(iframe.src).toContain("6rqhFgbbKwnb9MLmUQDhG6");
  });

  it("uses custom iframeTitle", () => {
    render(<Audio src={spotifyTrack} iframeTitle="Spotify" />);
    expect(screen.getByTitle("Spotify")).toBeInTheDocument();
  });

  it("applies rounded and className", () => {
    const { container } = render(
      <Audio src={spotifyTrack} rounded="lg" className="my-spotify" />,
    );
    expect(container.firstChild).toHaveClass("rounded-xl", "my-spotify");
  });

  it.each(["xs", "sm", "md", "lg", "xl"] as const)("adjusts height for size=%s", (s) => {
    const heights = { xs: "80", sm: "80", md: "152", lg: "352", xl: "352" };
    render(<Audio src={spotifyTrack} size={s} />);
    const iframe = screen.getByTitle("Audio player") as HTMLIFrameElement;
    expect(iframe).toHaveAttribute("height", heights[s]);
  });

  it("handles Spotify album URL", () => {
    render(
      <Audio src="https://open.spotify.com/album/4aawyAB9vmqN3uQ7FjRGTy" />,
    );
    const iframe = screen.getByTitle("Audio player") as HTMLIFrameElement;
    expect(iframe.src).toContain("open.spotify.com/embed/album");
  });

  it("handles Spotify playlist URL", () => {
    render(
      <Audio src="https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M" />,
    );
    const iframe = screen.getByTitle("Audio player") as HTMLIFrameElement;
    expect(iframe.src).toContain("open.spotify.com/embed/playlist");
  });

  it("warns in dev when Spotify path cannot be extracted", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Audio src="https://open.spotify.com/invalid" />);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Could not extract Spotify path"),
    );
    warnSpy.mockRestore();
  });
});

/* -------------------------------------------------------------------------- */
/*  generateWaveformBars                                                       */
/* -------------------------------------------------------------------------- */

describe("generateWaveformBars", () => {
  it("generates the requested number of bars", () => {
    const bars = generateWaveformBars("test.mp3", 60);
    expect(bars).toHaveLength(60);
  });

  it("generates bars in the 0.15–1.0 range", () => {
    const bars = generateWaveformBars("test.mp3", 100);
    bars.forEach((h) => {
      expect(h).toBeGreaterThanOrEqual(0.15);
      expect(h).toBeLessThanOrEqual(1);
    });
  });

  it("is deterministic (same seed → same bars)", () => {
    const a = generateWaveformBars("seed", 40);
    const b = generateWaveformBars("seed", 40);
    expect(a).toEqual(b);
  });

  it("different seeds produce different bars", () => {
    const a = generateWaveformBars("song-a.mp3", 40);
    const b = generateWaveformBars("song-b.mp3", 40);
    expect(a).not.toEqual(b);
  });
});

/* -------------------------------------------------------------------------- */
/*  Waveform variant                                                           */
/* -------------------------------------------------------------------------- */

describe("Audio (waveform variant)", () => {
  it("renders with gradient background", () => {
    const { container } = render(
      <Audio src="/test.mp3" variant="waveform" />,
    );
    expect(container.firstChild).toHaveClass("bg-gradient-to-br");
  });

  it("renders waveform bars as the seek slider", () => {
    render(<Audio src="/test.mp3" variant="waveform" />);
    const seekBar = screen.getByRole("slider", { name: "Seek" });
    expect(seekBar).toBeInTheDocument();
    // Bars are children of the seek bar
    expect(seekBar.children.length).toBeGreaterThan(0);
  });

  it("shows play/pause, volume, mute, and seek controls", () => {
    render(<Audio src="/test.mp3" variant="waveform" />);
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mute" })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Seek" })).toBeInTheDocument();
    expect(
      screen.getByRole("slider", { name: "Volume" }),
    ).toBeInTheDocument();
  });

  it("displays title and artist when provided", () => {
    render(
      <Audio
        src="/test.mp3"
        variant="waveform"
        title="Dreaming"
        artist="Synth Wave"
      />,
    );
    expect(screen.getByText("Dreaming")).toBeInTheDocument();
    expect(screen.getByText("Synth Wave")).toBeInTheDocument();
  });

  it("includes title in region aria-label", () => {
    render(
      <Audio src="/test.mp3" variant="waveform" title="Dreaming" />,
    );
    expect(
      screen.getByRole("region", { name: "Audio player: Dreaming" }),
    ).toBeInTheDocument();
  });

  it("applies rounded and className", () => {
    const { container } = render(
      <Audio
        src="/test.mp3"
        variant="waveform"
        rounded="xl"
        className="my-wave"
      />,
    );
    expect(container.firstChild).toHaveClass("rounded-2xl", "my-wave");
  });

  it.each(["primary", "accent", "destructive"] as const)(
    "applies gradient for color=%s",
    (c) => {
      const { container } = render(
        <Audio src="/test.mp3" variant="waveform" color={c} />,
      );
      expect(container.firstChild).toHaveClass("bg-gradient-to-br");
    },
  );

  it.each(["xs", "sm", "md", "lg", "xl"] as const)(
    "renders at size=%s with different bar counts",
    (s) => {
      render(<Audio src="/test.mp3" variant="waveform" size={s} />);
      const seekBar = screen.getByRole("slider", { name: "Seek" });
      const counts = { xs: 30, sm: 40, md: 60, lg: 80, xl: 100 };
      expect(seekBar.children.length).toBe(counts[s]);
    },
  );

  it("seeks on waveform click", () => {
    const { container } = render(
      <Audio src="/test.mp3" variant="waveform" />,
    );
    const audio = container.querySelector("audio") as HTMLAudioElement;
    Object.defineProperty(audio, "duration", { value: 100, writable: true });
    Object.defineProperty(audio, "currentTime", {
      value: 0,
      writable: true,
      configurable: true,
    });
    fireEvent.loadedMetadata(audio);

    const seekBar = screen.getByRole("slider", { name: "Seek" });
    vi.spyOn(seekBar, "getBoundingClientRect").mockReturnValue({
      left: 0,
      right: 200,
      width: 200,
      top: 0,
      bottom: 48,
      height: 48,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    fireEvent.click(seekBar, { clientX: 100 });
    expect(audio.currentTime).toBe(50);
  });
});

/* -------------------------------------------------------------------------- */
/*  Error state                                                                */
/* -------------------------------------------------------------------------- */

describe("Audio error state", () => {
  it("shows error message when audio fails to load", () => {
    const { container } = render(<Audio src="/nonexistent.mp3" />);
    const audio = container.querySelector("audio")!;
    fireEvent.error(audio);
    expect(screen.getByText("Unable to load audio")).toBeInTheDocument();
  });

  it("fires onError callback", () => {
    const onError = vi.fn();
    const { container } = render(
      <Audio src="/bad.mp3" onError={onError} />,
    );
    const audio = container.querySelector("audio")!;
    fireEvent.error(audio);
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it("hides play controls in error state", () => {
    const { container } = render(<Audio src="/bad.mp3" />);
    const audio = container.querySelector("audio")!;
    fireEvent.error(audio);
    expect(
      screen.queryByRole("button", { name: "Play" }),
    ).not.toBeInTheDocument();
  });

  it("still renders audio element in error state for ref forwarding", () => {
    const { container } = render(<Audio src="/bad.mp3" />);
    const audio = container.querySelector("audio")!;
    fireEvent.error(audio);
    expect(container.querySelector("audio")).toBeInTheDocument();
  });

  it("shows error in all native variants", () => {
    for (const variant of [
      "standard",
      "minimal",
      "card",
      "waveform",
    ] as const) {
      const { container, unmount } = render(
        <Audio src="/bad.mp3" variant={variant} />,
      );
      const audio = container.querySelector("audio")!;
      fireEvent.error(audio);
      expect(screen.getByText("Unable to load audio")).toBeInTheDocument();
      unmount();
    }
  });

  it("uses gradient background for waveform error state", () => {
    const { container } = render(
      <Audio src="/bad.mp3" variant="waveform" />,
    );
    const audio = container.querySelector("audio")!;
    fireEvent.error(audio);
    expect(container.firstChild).toHaveClass("bg-gradient-to-br");
    expect(screen.getByText("Unable to load audio")).toBeInTheDocument();
  });
});

/* -------------------------------------------------------------------------- */
/*  Loading state                                                              */
/* -------------------------------------------------------------------------- */

describe("Audio loading state", () => {
  it("shows spinner when audio is buffering", () => {
    const { container } = render(<Audio src="/test.mp3" />);
    const audio = container.querySelector("audio")!;
    fireEvent.waiting(audio);
    const playBtn = screen.getByRole("button", { name: "Play" });
    expect(playBtn.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("hides spinner on canplay", () => {
    const { container } = render(<Audio src="/test.mp3" />);
    const audio = container.querySelector("audio")!;
    fireEvent.waiting(audio);
    fireEvent.canPlay(audio);
    const playBtn = screen.getByRole("button", { name: "Play" });
    expect(playBtn.querySelector(".animate-spin")).not.toBeInTheDocument();
  });

  it("sets aria-busy on region when loading", () => {
    const { container } = render(<Audio src="/test.mp3" />);
    const audio = container.querySelector("audio")!;
    fireEvent.waiting(audio);
    expect(
      screen.getByRole("region", { name: "Audio player" }),
    ).toHaveAttribute("aria-busy", "true");
  });
});

/* -------------------------------------------------------------------------- */
/*  Skip buttons                                                               */
/* -------------------------------------------------------------------------- */

describe("Audio skip buttons", () => {
  it("does not show skip buttons by default", () => {
    render(<Audio src="/test.mp3" />);
    expect(
      screen.queryByRole("button", { name: /Skip/ }),
    ).not.toBeInTheDocument();
  });

  it("shows skip buttons when enabled", () => {
    render(<Audio src="/test.mp3" showSkipButtons />);
    expect(
      screen.getByRole("button", { name: "Skip back 10 seconds" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Skip forward 10 seconds" }),
    ).toBeInTheDocument();
  });

  it("uses custom skip interval", () => {
    render(<Audio src="/test.mp3" showSkipButtons skipInterval={30} />);
    expect(
      screen.getByRole("button", { name: "Skip back 30 seconds" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Skip forward 30 seconds" }),
    ).toBeInTheDocument();
  });

  it("skips forward by the interval", () => {
    const { container } = render(
      <Audio src="/test.mp3" showSkipButtons skipInterval={10} />,
    );
    const audio = container.querySelector("audio") as HTMLAudioElement;
    Object.defineProperty(audio, "duration", { value: 100, writable: true });
    Object.defineProperty(audio, "currentTime", {
      value: 20,
      writable: true,
      configurable: true,
    });
    fireEvent.loadedMetadata(audio);

    fireEvent.click(
      screen.getByRole("button", { name: "Skip forward 10 seconds" }),
    );
    expect(audio.currentTime).toBe(30);
  });

  it("skips backward by the interval", () => {
    const { container } = render(
      <Audio src="/test.mp3" showSkipButtons skipInterval={10} />,
    );
    const audio = container.querySelector("audio") as HTMLAudioElement;
    Object.defineProperty(audio, "duration", { value: 100, writable: true });
    Object.defineProperty(audio, "currentTime", {
      value: 20,
      writable: true,
      configurable: true,
    });
    fireEvent.loadedMetadata(audio);

    fireEvent.click(
      screen.getByRole("button", { name: "Skip back 10 seconds" }),
    );
    expect(audio.currentTime).toBe(10);
  });

  it("clamps skip forward to duration", () => {
    const { container } = render(
      <Audio src="/test.mp3" showSkipButtons skipInterval={10} />,
    );
    const audio = container.querySelector("audio") as HTMLAudioElement;
    Object.defineProperty(audio, "duration", { value: 25, writable: true });
    Object.defineProperty(audio, "currentTime", {
      value: 20,
      writable: true,
      configurable: true,
    });
    fireEvent.loadedMetadata(audio);

    fireEvent.click(
      screen.getByRole("button", { name: "Skip forward 10 seconds" }),
    );
    expect(audio.currentTime).toBe(25);
  });

  it("clamps skip backward to zero", () => {
    const { container } = render(
      <Audio src="/test.mp3" showSkipButtons skipInterval={10} />,
    );
    const audio = container.querySelector("audio") as HTMLAudioElement;
    Object.defineProperty(audio, "duration", { value: 100, writable: true });
    Object.defineProperty(audio, "currentTime", {
      value: 5,
      writable: true,
      configurable: true,
    });
    fireEvent.loadedMetadata(audio);

    fireEvent.click(
      screen.getByRole("button", { name: "Skip back 10 seconds" }),
    );
    expect(audio.currentTime).toBe(0);
  });

  it("shows skip buttons in waveform variant", () => {
    render(<Audio src="/test.mp3" variant="waveform" showSkipButtons />);
    expect(
      screen.getByRole("button", { name: "Skip back 10 seconds" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Skip forward 10 seconds" }),
    ).toBeInTheDocument();
  });
});

/* -------------------------------------------------------------------------- */
/*  Playback rate                                                              */
/* -------------------------------------------------------------------------- */

describe("Audio playback rate", () => {
  it("does not show rate button by default", () => {
    render(<Audio src="/test.mp3" />);
    expect(
      screen.queryByRole("button", { name: /Playback speed/ }),
    ).not.toBeInTheDocument();
  });

  it("shows rate button when enabled", () => {
    render(<Audio src="/test.mp3" showPlaybackRate />);
    expect(
      screen.getByRole("button", { name: "Playback speed 1x" }),
    ).toBeInTheDocument();
  });

  it("cycles through playback rates", () => {
    const { container } = render(<Audio src="/test.mp3" showPlaybackRate />);
    const audio = container.querySelector("audio") as HTMLAudioElement;

    fireEvent.click(
      screen.getByRole("button", { name: "Playback speed 1x" }),
    );
    expect(audio.playbackRate).toBe(1.25);
    expect(
      screen.getByRole("button", { name: "Playback speed 1.25x" }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Playback speed 1.25x" }),
    );
    expect(audio.playbackRate).toBe(1.5);

    fireEvent.click(
      screen.getByRole("button", { name: "Playback speed 1.5x" }),
    );
    expect(audio.playbackRate).toBe(2);

    fireEvent.click(
      screen.getByRole("button", { name: "Playback speed 2x" }),
    );
    expect(audio.playbackRate).toBe(0.5);
  });

  it("respects defaultPlaybackRate", () => {
    render(
      <Audio src="/test.mp3" showPlaybackRate defaultPlaybackRate={1.5} />,
    );
    expect(
      screen.getByRole("button", { name: "Playback speed 1.5x" }),
    ).toBeInTheDocument();
  });

  it("shows rate button in waveform variant", () => {
    render(
      <Audio src="/test.mp3" variant="waveform" showPlaybackRate />,
    );
    expect(
      screen.getByRole("button", { name: "Playback speed 1x" }),
    ).toBeInTheDocument();
  });
});

/* -------------------------------------------------------------------------- */
/*  crossOrigin                                                                */
/* -------------------------------------------------------------------------- */

describe("Audio crossOrigin", () => {
  it("passes crossOrigin to audio element", () => {
    const { container } = render(
      <Audio src="/test.mp3" crossOrigin="anonymous" />,
    );
    const audio = container.querySelector("audio");
    expect(audio).toHaveAttribute("crossorigin", "anonymous");
  });
});

/* -------------------------------------------------------------------------- */
/*  Seek bar thumb                                                             */
/* -------------------------------------------------------------------------- */

describe("Audio seek bar thumb", () => {
  it("renders a thumb element in the seek bar", () => {
    render(<Audio src="/test.mp3" />);
    const seekBar = screen.getByRole("slider", { name: "Seek" });
    const thumb = seekBar.querySelector(".border-2");
    expect(thumb).toBeInTheDocument();
  });

  it("renders a thumb element in the volume slider", () => {
    render(<Audio src="/test.mp3" />);
    const volumeBar = screen.getByRole("slider", { name: "Volume" });
    const thumb = volumeBar.querySelector(".border-2");
    expect(thumb).toBeInTheDocument();
  });
});

/* -------------------------------------------------------------------------- */
/*  Space key on seek bar                                                      */
/* -------------------------------------------------------------------------- */

describe("Audio keyboard shortcuts", () => {
  it("Space on seek bar toggles play", () => {
    render(<Audio src="/test.mp3" />);
    const seekBar = screen.getByRole("slider", { name: "Seek" });
    fireEvent.keyDown(seekBar, { key: " " });
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
  });
});

/* -------------------------------------------------------------------------- */
/*  Responsive card                                                            */
/* -------------------------------------------------------------------------- */

describe("Audio responsive card", () => {
  it("stacks vertically at xs size", () => {
    const { container } = render(
      <Audio src="/test.mp3" variant="card" size="xs" title="Song" />,
    );
    const region = screen.getByRole("region");
    const flexCol = region.querySelector(".flex-col");
    expect(flexCol).toBeInTheDocument();
  });

  it("uses horizontal layout at md size", () => {
    const { container } = render(
      <Audio src="/test.mp3" variant="card" size="md" title="Song" />,
    );
    // The card's outer flex container (direct child of region after <audio>)
    // should not have flex-col at md — the artwork and controls sit side by side
    const region = screen.getByRole("region");
    const cardFlex = region.querySelector(":scope > div:nth-child(2)");
    expect(cardFlex).not.toHaveClass("flex-col");
  });
});

/* -------------------------------------------------------------------------- */
/*  Error retry                                                                */
/* -------------------------------------------------------------------------- */

describe("Audio error retry", () => {
  it("shows retry button in error state", () => {
    const { container } = render(<Audio src="/bad.mp3" />);
    fireEvent.error(container.querySelector("audio")!);
    expect(
      screen.getByRole("button", { name: "Retry" }),
    ).toBeInTheDocument();
  });

  it("clicking retry clears error and reloads", () => {
    const onRetry = vi.fn();
    const { container } = render(
      <Audio src="/bad.mp3" onRetry={onRetry} />,
    );
    const audio = container.querySelector("audio") as HTMLAudioElement;
    const loadSpy = vi.spyOn(audio, "load").mockImplementation(() => {});
    fireEvent.error(audio);
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(loadSpy).toHaveBeenCalled();
    expect(
      screen.queryByText("Unable to load audio"),
    ).not.toBeInTheDocument();
  });
});

/* -------------------------------------------------------------------------- */
/*  onRateChange                                                               */
/* -------------------------------------------------------------------------- */

describe("Audio onRateChange", () => {
  it("fires onRateChange with new rate", () => {
    const onRateChange = vi.fn();
    render(
      <Audio src="/test.mp3" showPlaybackRate onRateChange={onRateChange} />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Playback speed 1x" }),
    );
    expect(onRateChange).toHaveBeenCalledWith(1.25);
  });
});

/* -------------------------------------------------------------------------- */
/*  Time display toggle                                                        */
/* -------------------------------------------------------------------------- */

describe("Audio time toggle", () => {
  it("toggles between elapsed and remaining time", () => {
    const { container } = render(<Audio src="/test.mp3" />);
    const audio = container.querySelector("audio") as HTMLAudioElement;
    Object.defineProperty(audio, "duration", { value: 120, writable: true });
    Object.defineProperty(audio, "currentTime", {
      value: 30,
      writable: true,
    });
    fireEvent.loadedMetadata(audio);
    fireEvent.timeUpdate(audio);

    const timeBtn = screen.getByRole("button", {
      name: "Show remaining time",
    });
    expect(timeBtn).toHaveTextContent("0:30 / 2:00");

    fireEvent.click(timeBtn);
    expect(
      screen.getByRole("button", { name: "Show elapsed time" }),
    ).toHaveTextContent("-1:30 / 2:00");

    fireEvent.click(
      screen.getByRole("button", { name: "Show elapsed time" }),
    );
    expect(
      screen.getByRole("button", { name: "Show remaining time" }),
    ).toHaveTextContent("0:30 / 2:00");
  });
});

/* -------------------------------------------------------------------------- */
/*  Waveform analysis fallback                                                 */
/* -------------------------------------------------------------------------- */

describe("Audio waveform analysis", () => {
  it("uses generated bars when analyzeWaveform is false", () => {
    render(<Audio src="/test.mp3" variant="waveform" />);
    const seekBar = screen.getByRole("slider", { name: "Seek" });
    // children = bars only (tooltip not rendered without hover)
    expect(seekBar.children.length).toBe(60);
  });

  it("falls back to generated bars when AudioContext is unavailable", () => {
    render(<Audio src="/test.mp3" variant="waveform" analyzeWaveform />);
    const seekBar = screen.getByRole("slider", { name: "Seek" });
    expect(seekBar.children.length).toBe(60);
  });
});
