import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AudioPlayer } from "./audio-player";

const meta = {
  title: "Feedback/AudioPlayer",
  component: AudioPlayer,
  tags: ["autodocs"],
  argTypes: {
    playing: { control: "boolean" },
    progress: { control: { type: "range", min: 0, max: 100, step: 1 } },
    showWaveform: { control: "boolean" },
    currentTime: { control: "text" },
    duration: { control: "text" },
  },
} satisfies Meta<typeof AudioPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentTime: "0:00",
    duration: "3:45",
    progress: 0,
    playing: false,
    showWaveform: true,
  },
};

export const Playing: Story = {
  args: {
    currentTime: "1:23",
    duration: "3:45",
    progress: 37,
    playing: true,
    showWaveform: true,
  },
};

export const HalfPlayed: Story = {
  args: {
    currentTime: "1:52",
    duration: "3:45",
    progress: 50,
    playing: false,
    showWaveform: true,
  },
};

export const AlmostDone: Story = {
  args: {
    currentTime: "3:30",
    duration: "3:45",
    progress: 93,
    playing: true,
    showWaveform: true,
  },
};

export const WithProgressBar: Story = {
  args: {
    currentTime: "1:00",
    duration: "4:30",
    progress: 22,
    playing: false,
    showWaveform: false,
  },
};

export const ProgressBarPlaying: Story = {
  args: {
    currentTime: "2:15",
    duration: "4:30",
    progress: 50,
    playing: true,
    showWaveform: false,
  },
};

export const Interactive: Story = {
  args: {
    duration: "3:45",
    showWaveform: true,
  },
  render: (args) => {
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    return (
      <div className="max-w-sm">
        <AudioPlayer
          {...args}
          playing={playing}
          progress={progress}
          currentTime={`${Math.floor(progress * 2.25 / 100)}:${String(Math.floor((progress * 2.25) % 60)).padStart(2, "0")}`}
          onPlayPause={() => setPlaying(!playing)}
        />
        <div className="mt-4">
          <label htmlFor="progress-sim" className="text-xs text-slate-500 block mb-1">
            Simulate progress
          </label>
          <input
            id="progress-sim"
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    );
  },
};

export const Gallery: Story = {
  args: {},
  render: (args) => (
    <div className="space-y-4 max-w-sm">
      <AudioPlayer {...args} label="Audio player 1" currentTime="0:00" duration="2:30" progress={0} showWaveform />
      <AudioPlayer {...args} label="Audio player 2" currentTime="1:15" duration="2:30" progress={50} playing showWaveform />
      <AudioPlayer {...args} label="Audio player 3" currentTime="0:45" duration="3:00" progress={25} showWaveform={false} />
      <AudioPlayer {...args} label="Audio player 4" currentTime="2:30" duration="2:30" progress={100} showWaveform />
    </div>
  ),
};
