import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadarChart } from "./radar-chart";

// ─── Sample Data ─────────────────────────────────────────────────────────────

const skillData = [
  { skill: "Design", Alice: 80 },
  { skill: "Frontend", Alice: 90 },
  { skill: "Backend", Alice: 70 },
  { skill: "DevOps", Alice: 60 },
  { skill: "Testing", Alice: 85 },
];

const comparisonData = [
  { skill: "Design", Alice: 80, Bob: 65 },
  { skill: "Frontend", Alice: 90, Bob: 75 },
  { skill: "Backend", Alice: 70, Bob: 90 },
  { skill: "DevOps", Alice: 60, Bob: 85 },
  { skill: "Testing", Alice: 85, Bob: 70 },
];

const sixAxisData = [
  { attribute: "Speed", Player: 85 },
  { attribute: "Power", Player: 70 },
  { attribute: "Technique", Player: 90 },
  { attribute: "Stamina", Player: 75 },
  { attribute: "Defense", Player: 60 },
  { attribute: "Agility", Player: 80 },
];

const teamComparisonData = [
  { attribute: "Speed", "Team A": 85, "Team B": 70, "Team C": 75 },
  { attribute: "Power", "Team A": 70, "Team B": 80, "Team C": 65 },
  { attribute: "Technique", "Team A": 90, "Team B": 75, "Team C": 85 },
  { attribute: "Stamina", "Team A": 75, "Team B": 90, "Team C": 70 },
  { attribute: "Defense", "Team A": 60, "Team B": 85, "Team C": 80 },
  { attribute: "Agility", "Team A": 80, "Team B": 65, "Team C": 90 },
];

// ─── Meta ────────────────────────────────────────────────────────────────────

const meta = {
  title: "Data Display/Charts/RadarChart",
  component: RadarChart,
  tags: ["autodocs"],
  argTypes: {
    size: { control: { type: "range", min: 200, max: 500, step: 20 } },
    showGrid: { control: "boolean" },
    showLabels: { control: "boolean" },
    showDots: { control: "boolean" },
    showLegend: { control: "boolean" },
    legendPosition: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    fillOpacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    animate: { control: "boolean" },
  },
} satisfies Meta<typeof RadarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stories ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    data: skillData,
    index: "skill",
    categories: ["Alice"],
    colors: ["indigo"],
  },
};

export const MultiSeries: Story = {
  args: {
    data: comparisonData,
    index: "skill",
    categories: ["Alice", "Bob"],
    colors: ["indigo", "amber"],
    size: 350,
    fillOpacity: 0.15,
    showLegend: true,
  },
};

export const ThreeSeries: Story = {
  name: "Three Series Comparison",
  args: {
    data: teamComparisonData,
    index: "attribute",
    categories: ["Team A", "Team B", "Team C"],
    colors: ["indigo", "emerald", "rose"],
    size: 380,
    fillOpacity: 0.12,
    showLegend: true,
  },
};

export const CustomColor: Story = {
  args: {
    data: skillData,
    index: "skill",
    categories: ["Alice"],
    colors: ["emerald"],
    fillOpacity: 0.3,
  },
};

export const SixAxes: Story = {
  args: {
    data: sixAxisData,
    index: "attribute",
    categories: ["Player"],
    colors: ["red"],
    fillOpacity: 0.25,
    size: 350,
  },
};

export const NoDots: Story = {
  args: {
    data: skillData,
    index: "skill",
    categories: ["Alice"],
    showDots: false,
    fillOpacity: 0.3,
    colors: ["violet"],
  },
};

export const NoGrid: Story = {
  args: {
    data: skillData,
    index: "skill",
    categories: ["Alice"],
    showGrid: false,
    fillOpacity: 0.2,
    colors: ["indigo"],
  },
};

export const NoLabels: Story = {
  args: {
    data: skillData,
    index: "skill",
    categories: ["Alice"],
    showLabels: false,
    size: 250,
    colors: ["indigo"],
  },
};

export const HighFillOpacity: Story = {
  args: {
    data: skillData,
    index: "skill",
    categories: ["Alice"],
    fillOpacity: 0.5,
    colors: ["pink"],
  },
};

export const LargeChart: Story = {
  args: {
    data: sixAxisData,
    index: "attribute",
    categories: ["Player"],
    size: 450,
    fillOpacity: 0.2,
    colors: ["teal"],
  },
};

export const WithLegendRight: Story = {
  name: "Legend on Right",
  args: {
    data: comparisonData,
    index: "skill",
    categories: ["Alice", "Bob"],
    colors: ["indigo", "amber"],
    showLegend: true,
    legendPosition: "right",
    fillOpacity: 0.15,
    size: 300,
  },
};

export const WithValueFormatter: Story = {
  args: {
    data: comparisonData,
    index: "skill",
    categories: ["Alice", "Bob"],
    colors: ["indigo", "emerald"],
    showLegend: true,
    valueFormatter: (v: number) => `${v}%`,
  },
};
