import type { Meta, StoryObj } from "@storybook/react-vite";
import { QrCode } from "./qr-code";

// Minimal 21x21 QR code data URL (version 1) — encodes "https://example.com"
// Generated as a tiny valid SVG data URI for story purposes
const SAMPLE_QR_DATA_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 21 21'%3E" +
  "%3Crect width='21' height='21' fill='white'/%3E" +
  "%3Crect x='0' y='0' width='7' height='7' fill='black'/%3E" +
  "%3Crect x='1' y='1' width='5' height='5' fill='white'/%3E" +
  "%3Crect x='2' y='2' width='3' height='3' fill='black'/%3E" +
  "%3Crect x='14' y='0' width='7' height='7' fill='black'/%3E" +
  "%3Crect x='15' y='1' width='5' height='5' fill='white'/%3E" +
  "%3Crect x='16' y='2' width='3' height='3' fill='black'/%3E" +
  "%3Crect x='0' y='14' width='7' height='7' fill='black'/%3E" +
  "%3Crect x='1' y='15' width='5' height='5' fill='white'/%3E" +
  "%3Crect x='2' y='16' width='3' height='3' fill='black'/%3E" +
  "%3Crect x='8' y='0' width='1' height='1' fill='black'/%3E" +
  "%3Crect x='10' y='0' width='1' height='1' fill='black'/%3E" +
  "%3Crect x='8' y='2' width='1' height='1' fill='black'/%3E" +
  "%3Crect x='10' y='2' width='1' height='1' fill='black'/%3E" +
  "%3Crect x='12' y='2' width='1' height='1' fill='black'/%3E" +
  "%3Crect x='8' y='6' width='5' height='1' fill='black'/%3E" +
  "%3Crect x='8' y='8' width='1' height='5' fill='black'/%3E" +
  "%3Crect x='10' y='8' width='1' height='1' fill='black'/%3E" +
  "%3Crect x='12' y='8' width='1' height='1' fill='black'/%3E" +
  "%3C/svg%3E";

const meta = {
  title: "Data Display/QrCode",
  component: QrCode,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "number" },
    alt: { control: "text" },
  },
} satisfies Meta<typeof QrCode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    dataUrl: SAMPLE_QR_DATA_URL,
  },
};

export const Small: Story = {
  args: {
    dataUrl: SAMPLE_QR_DATA_URL,
    size: 100,
  },
};

export const Large: Story = {
  args: {
    dataUrl: SAMPLE_QR_DATA_URL,
    size: 300,
  },
};

export const CustomAlt: Story = {
  args: {
    dataUrl: SAMPLE_QR_DATA_URL,
    alt: "Scan to visit our website",
    size: 200,
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex flex-col items-center gap-3">
      <QrCode {...args} dataUrl={SAMPLE_QR_DATA_URL} size={180} />
      <span className="text-sm text-muted-foreground font-medium">Scan to download the app</span>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-6">
      <div className="flex flex-col items-center gap-2">
        <QrCode {...args} dataUrl={SAMPLE_QR_DATA_URL} size={80} />
        <span className="text-xs text-muted-foreground">80px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <QrCode {...args} dataUrl={SAMPLE_QR_DATA_URL} size={150} />
        <span className="text-xs text-muted-foreground">150px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <QrCode {...args} dataUrl={SAMPLE_QR_DATA_URL} size={200} />
        <span className="text-xs text-muted-foreground">200px</span>
      </div>
    </div>
  ),
};

export const InCard: Story = {
  render: (args) => (
    <div className="rounded-xl border border-muted bg-surface p-6 shadow-sm max-w-xs">
      <h3 className="text-lg font-bold text-navy-text mb-1">Share Link</h3>
      <p className="text-sm text-muted-foreground mb-4">Scan the code below to open in your browser.</p>
      <div className="flex justify-center">
        <QrCode {...args} dataUrl={SAMPLE_QR_DATA_URL} size={160} />
      </div>
      <p className="text-xs text-muted-foreground text-center mt-3">https://example.com</p>
    </div>
  ),
};
