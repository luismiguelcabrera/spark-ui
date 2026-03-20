import type { Meta, StoryObj } from "@storybook/react-vite";
import { Audio } from "./audio";

const meta = {
  title: "Data Display/Audio",
  component: Audio,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["minimal", "standard", "card", "waveform"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    color: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "accent",
        "success",
        "warning",
        "destructive",
      ],
    },
    rounded: {
      control: "select",
      options: ["none", "sm", "md", "lg", "xl"],
    },
    autoPlay: { control: "boolean" },
    loop: { control: "boolean" },
    muted: { control: "boolean" },
  },
} satisfies Meta<typeof Audio>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample sources
const nativeSrc =
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
const soundcloudSrc = "https://soundcloud.com/majorlazer/cold-water";
const spotifyTrackSrc =
  "https://open.spotify.com/track/6rqhFgbbKwnb9MLmUQDhG6";
const spotifyAlbumSrc =
  "https://open.spotify.com/album/4aawyAB9vmqN3uQ7FjRGTy";
const spotifyPlaylistSrc =
  "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M";

// Inline SVG data URI for sample artwork
const sampleArtwork = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#ec4899"/></linearGradient></defs><rect width="200" height="200" fill="url(#g)"/><text x="100" y="100" text-anchor="middle" dominant-baseline="central" font-family="system-ui,sans-serif" font-size="40" fill="white">♪</text></svg>',
)}`;

/* -------------------------------------------------------------------------- */
/*  Standard variant (default)                                                 */
/* -------------------------------------------------------------------------- */

export const Default: Story = {
  args: {
    src: nativeSrc,
  },
};

/* -------------------------------------------------------------------------- */
/*  Minimal variant                                                            */
/* -------------------------------------------------------------------------- */

export const Minimal: Story = {
  args: {
    src: nativeSrc,
    variant: "minimal",
  },
};

export const MinimalSmall: Story = {
  name: "Minimal (small)",
  args: {
    src: nativeSrc,
    variant: "minimal",
    size: "sm",
  },
};

/* -------------------------------------------------------------------------- */
/*  Card variant                                                               */
/* -------------------------------------------------------------------------- */

export const Card: Story = {
  args: {
    src: nativeSrc,
    variant: "card",
    title: "SoundHelix Song 1",
    artist: "T. Schürger",
    artwork: sampleArtwork,
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
};

export const CardNoArtwork: Story = {
  name: "Card (no artwork)",
  args: {
    src: nativeSrc,
    variant: "card",
    title: "Unknown Track",
    artist: "Unknown Artist",
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
};

export const CardLarge: Story = {
  name: "Card (large)",
  args: {
    src: nativeSrc,
    variant: "card",
    title: "SoundHelix Song 1",
    artist: "T. Schürger",
    artwork: sampleArtwork,
    size: "lg",
  },
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
};

/* -------------------------------------------------------------------------- */
/*  Waveform variant                                                           */
/* -------------------------------------------------------------------------- */

export const Waveform: Story = {
  args: {
    src: nativeSrc,
    variant: "waveform",
    title: "SoundHelix Song 1",
    artist: "T. Schürger",
  },
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
};

export const WaveformLarge: Story = {
  name: "Waveform (large)",
  args: {
    src: nativeSrc,
    variant: "waveform",
    title: "SoundHelix Song 1",
    artist: "T. Schürger",
    size: "lg",
    rounded: "xl",
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
};

export const WaveformColors: Story = {
  name: "Waveform (all colors)",
  render: (args) => (
    <div className="flex flex-col gap-4 max-w-lg">
      {(
        [
          "primary",
          "secondary",
          "accent",
          "success",
          "warning",
          "destructive",
        ] as const
      ).map((c) => (
        <Audio
          key={c}
          {...args}
          src={`${nativeSrc}#${c}`}
          variant="waveform"
          color={c}
          title={`${c.charAt(0).toUpperCase() + c.slice(1)} Theme`}
          artist="Color Demo"
        />
      ))}
    </div>
  ),
};

export const WaveformMinimal: Story = {
  name: "Waveform (no title)",
  args: {
    src: nativeSrc,
    variant: "waveform",
    color: "accent",
  },
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
};

/* -------------------------------------------------------------------------- */
/*  SoundCloud                                                                 */
/* -------------------------------------------------------------------------- */

export const SoundCloud: Story = {
  name: "SoundCloud",
  args: {
    src: soundcloudSrc,
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
};

export const SoundCloudLarge: Story = {
  name: "SoundCloud (large / visual)",
  args: {
    src: soundcloudSrc,
    size: "lg",
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
};

/* -------------------------------------------------------------------------- */
/*  Spotify                                                                    */
/* -------------------------------------------------------------------------- */

export const SpotifyTrack: Story = {
  args: {
    src: spotifyTrackSrc,
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
};

export const SpotifyAlbum: Story = {
  args: {
    src: spotifyAlbumSrc,
    size: "lg",
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
};

export const SpotifyPlaylist: Story = {
  args: {
    src: spotifyPlaylistSrc,
    size: "lg",
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
};

/* -------------------------------------------------------------------------- */
/*  Sizes                                                                      */
/* -------------------------------------------------------------------------- */

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
          Extra Small
        </p>
        <Audio {...args} src={nativeSrc} size="xs" title="Extra small size" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
          Small
        </p>
        <Audio {...args} src={nativeSrc} size="sm" title="Small size" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
          Medium (default)
        </p>
        <Audio {...args} src={nativeSrc} size="md" title="Medium size" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
          Large
        </p>
        <Audio {...args} src={nativeSrc} size="lg" title="Large size" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
          Extra Large
        </p>
        <Audio {...args} src={nativeSrc} size="xl" title="Extra large size" />
      </div>
    </div>
  ),
};

/* -------------------------------------------------------------------------- */
/*  Colors                                                                     */
/* -------------------------------------------------------------------------- */

export const Colors: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4 max-w-lg">
      {(
        [
          "primary",
          "secondary",
          "accent",
          "success",
          "warning",
          "destructive",
        ] as const
      ).map((c) => (
        <div key={c}>
          <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
            {c}
          </p>
          <Audio {...args} src={nativeSrc} color={c} title={`${c} color`} />
        </div>
      ))}
    </div>
  ),
};

/* -------------------------------------------------------------------------- */
/*  Rounded                                                                    */
/* -------------------------------------------------------------------------- */

export const Rounded: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4 max-w-lg">
      {(["none", "sm", "md", "lg", "xl"] as const).map((r) => (
        <div key={r}>
          <p className="text-xs font-semibold text-slate-500 uppercase mb-1">
            rounded={r}
          </p>
          <Audio {...args} src={nativeSrc} rounded={r} title={`Rounded ${r}`} />
        </div>
      ))}
    </div>
  ),
};

/* -------------------------------------------------------------------------- */
/*  Gallery                                                                    */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*  Features                                                                   */
/* -------------------------------------------------------------------------- */

export const WithSkipButtons: Story = {
  name: "With skip buttons",
  args: {
    src: nativeSrc,
    showSkipButtons: true,
    title: "Podcast Episode",
  },
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
};

export const WithPlaybackRate: Story = {
  name: "With playback rate",
  args: {
    src: nativeSrc,
    showPlaybackRate: true,
    title: "Audiobook Chapter",
  },
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
};

export const FullFeatured: Story = {
  name: "Full featured (podcast)",
  args: {
    src: nativeSrc,
    variant: "card",
    showSkipButtons: true,
    showPlaybackRate: true,
    title: "The Future of AI",
    artist: "Tech Talks Podcast",
    artwork: sampleArtwork,
    size: "lg",
  },
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
};

export const WaveformFullFeatured: Story = {
  name: "Waveform (full featured)",
  args: {
    src: nativeSrc,
    variant: "waveform",
    showSkipButtons: true,
    showPlaybackRate: true,
    title: "Deep Focus Mix",
    artist: "Lo-Fi Beats",
    color: "accent",
  },
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
};

/* -------------------------------------------------------------------------- */
/*  Real-world use cases                                                       */
/* -------------------------------------------------------------------------- */

export const PodcastPlayer: Story = {
  name: "Podcast Player",
  args: {
    src: nativeSrc,
    variant: "card",
    showSkipButtons: true,
    skipInterval: 30,
    showPlaybackRate: true,
    title: "Episode 42: The State of Web Development",
    artist: "Dev Conversations",
    artwork: sampleArtwork,
    size: "lg",
  },
  decorators: [(Story) => <div className="max-w-lg"><Story /></div>],
};

export const MusicPlayer: Story = {
  name: "Music Player",
  args: {
    src: nativeSrc,
    variant: "card",
    title: "Midnight City",
    artist: "M83",
    artwork: sampleArtwork,
    color: "accent",
    rounded: "xl",
  },
  decorators: [(Story) => <div className="max-w-sm"><Story /></div>],
};

export const AudiobookPlayer: Story = {
  name: "Audiobook Player",
  args: {
    src: nativeSrc,
    showSkipButtons: true,
    skipInterval: 15,
    showPlaybackRate: true,
    defaultPlaybackRate: 1.25,
    title: "Chapter 7: The Journey Begins",
  },
  decorators: [(Story) => <div className="max-w-lg"><Story /></div>],
};

export const VoiceMemo: Story = {
  name: "Voice Memo",
  args: {
    src: nativeSrc,
    variant: "minimal",
    size: "sm",
    color: "success",
  },
  decorators: [(Story) => <div className="max-w-xs"><Story /></div>],
};

export const DJMix: Story = {
  name: "DJ Mix",
  args: {
    src: nativeSrc,
    variant: "waveform",
    title: "Summer Vibes Mix 2025",
    artist: "DJ Spark",
    color: "accent",
    size: "lg",
    rounded: "xl",
    showSkipButtons: true,
    showPlaybackRate: true,
  },
  decorators: [(Story) => <div className="max-w-xl"><Story /></div>],
};

export const Playlist: Story = {
  name: "Playlist",
  render: (args) => (
    <div className="flex flex-col gap-2 max-w-lg">
      {["Morning Breeze", "City Lights", "Ocean Waves"].map((t, i) => (
        <Audio key={i} {...args} src={`${nativeSrc}#${i}`} variant="minimal" title={t} />
      ))}
    </div>
  ),
};

export const WaveformAnalyzed: Story = {
  name: "Waveform (real analysis)",
  args: {
    src: nativeSrc,
    variant: "waveform",
    analyzeWaveform: true,
    crossOrigin: "anonymous",
    title: "Real Waveform",
    artist: "Analyzed Audio",
    color: "primary",
  },
  decorators: [(Story) => <div className="max-w-lg"><Story /></div>],
};

/* -------------------------------------------------------------------------- */
/*  Gallery                                                                    */
/* -------------------------------------------------------------------------- */

export const Gallery: Story = {
  render: (args) => (
    <div className="flex flex-col gap-8 max-w-xl">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
          Minimal
        </p>
        <Audio {...args} src={nativeSrc} variant="minimal" title="Minimal variant" />
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
          Standard (default)
        </p>
        <Audio {...args} src={nativeSrc} variant="standard" title="Standard variant" />
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
          Card
        </p>
        <Audio
          {...args}
          src={nativeSrc}
          variant="card"
          title="SoundHelix Song 1"
          artist="T. Schürger"
          artwork={sampleArtwork}
        />
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
          Waveform
        </p>
        <Audio
          {...args}
          src={nativeSrc}
          variant="waveform"
          title="SoundHelix Song 1 (Waveform)"
          artist="T. Schürger"
          color="accent"
        />
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
          SoundCloud Embed
        </p>
        <Audio {...args} src={soundcloudSrc} />
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
          Spotify Track Embed
        </p>
        <Audio {...args} src={spotifyTrackSrc} />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
            Success Color
          </p>
          <Audio src={nativeSrc} variant="minimal" color="success" title="Success color" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
            Destructive Color
          </p>
          <Audio src={nativeSrc} variant="minimal" color="destructive" title="Destructive color" />
        </div>
      </div>
    </div>
  ),
};
