import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { AudioPlayer } from "../audio-player";

describe("AudioPlayer", () => {
  it("renders without error", () => {
    render(<AudioPlayer />);
    expect(screen.getByRole("region", { name: "Audio player" })).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<AudioPlayer ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("has displayName", () => {
    expect(AudioPlayer.displayName).toBe("AudioPlayer");
  });

  it("merges className", () => {
    render(<AudioPlayer className="custom-class" />);
    expect(screen.getByRole("region")).toHaveClass("custom-class");
  });

  it("shows Play button when not playing", () => {
    render(<AudioPlayer playing={false} />);
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  });

  it("shows Pause button when playing", () => {
    render(<AudioPlayer playing />);
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
  });

  it("calls onPlayPause when play button is clicked", async () => {
    const user = userEvent.setup();
    const onPlayPause = vi.fn();
    render(<AudioPlayer onPlayPause={onPlayPause} />);
    await user.click(screen.getByRole("button", { name: "Play" }));
    expect(onPlayPause).toHaveBeenCalledTimes(1);
  });

  it("displays current time and duration", () => {
    render(<AudioPlayer currentTime="1:23" duration="4:56" />);
    expect(screen.getByText("1:23")).toBeInTheDocument();
    expect(screen.getByText("4:56")).toBeInTheDocument();
  });

  it("renders waveform by default", () => {
    render(<AudioPlayer progress={50} />);
    // Waveform container is aria-hidden
    const region = screen.getByRole("region");
    expect(region.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it("renders progress bar when showWaveform is false", () => {
    render(<AudioPlayer showWaveform={false} progress={50} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
