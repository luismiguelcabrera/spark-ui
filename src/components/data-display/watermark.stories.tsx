import type { Meta, StoryObj } from "@storybook/react-vite";
import { Watermark } from "./watermark";

const meta = {
  title: "Data Display/Watermark",
  component: Watermark,
  tags: ["autodocs"],
  argTypes: {
    text: { control: "text" },
    fontSize: { control: { type: "range", min: 10, max: 30, step: 1 } },
    opacity: { control: { type: "range", min: 0.01, max: 0.2, step: 0.01 } },
    rotate: { control: { type: "range", min: -90, max: 0, step: 1 } },
    gap: { control: { type: "range", min: 50, max: 200, step: 10 } },
    color: { control: "color" },
  },
} satisfies Meta<typeof Watermark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "CONFIDENTIAL",
    children: (
      <div className="p-8 bg-white border rounded-lg min-h-[300px]">
        <h3 className="text-lg font-semibold mb-2">Secret Document</h3>
        <p className="text-gray-600">
          This document contains sensitive information and should not be shared
          outside the organization. All recipients must comply with the data
          protection policies.
        </p>
      </div>
    ),
  },
};

export const Draft: Story = {
  args: {
    text: "DRAFT",
    opacity: 0.08,
    fontSize: 20,
    children: (
      <div className="p-8 bg-white border rounded-lg min-h-[300px]">
        <h3 className="text-lg font-semibold mb-2">Project Proposal</h3>
        <p className="text-gray-600 mb-4">
          This is a preliminary draft of the project proposal. Content is
          subject to change pending review.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Phase 1: Discovery (2 weeks)</li>
          <li>Phase 2: Development (6 weeks)</li>
          <li>Phase 3: Testing (2 weeks)</li>
          <li>Phase 4: Launch (1 week)</li>
        </ul>
      </div>
    ),
  },
};

export const CustomColor: Story = {
  args: {
    text: "SAMPLE",
    color: "#ff0000",
    opacity: 0.06,
    children: (
      <div className="p-8 bg-white border rounded-lg min-h-[250px]">
        <p className="text-gray-600">Red watermark on white background.</p>
      </div>
    ),
  },
};

export const DensePattern: Story = {
  args: {
    text: "DO NOT COPY",
    gap: 60,
    fontSize: 12,
    opacity: 0.04,
    children: (
      <div className="p-8 bg-white border rounded-lg min-h-[250px]">
        <p className="text-gray-600">Dense watermark pattern with smaller gap and font size.</p>
      </div>
    ),
  },
};

export const SparsePattern: Story = {
  args: {
    text: "PREVIEW",
    gap: 180,
    fontSize: 22,
    opacity: 0.06,
    children: (
      <div className="p-8 bg-white border rounded-lg min-h-[250px]">
        <p className="text-gray-600">Sparse watermark pattern with larger gap.</p>
      </div>
    ),
  },
};

export const CustomRotation: Story = {
  args: {
    text: "WATERMARK",
    rotate: -45,
    children: (
      <div className="p-8 bg-white border rounded-lg min-h-[250px]">
        <p className="text-gray-600">Watermark with a steeper rotation angle (-45 degrees).</p>
      </div>
    ),
  },
};

export const WithImage: Story = {
  args: {
    text: "PROTECTED",
    opacity: 0.08,
    children: (
      <div className="p-4 bg-white border rounded-lg">
        <div className="w-full h-[200px] bg-gradient-to-br from-blue-100 to-purple-100 rounded flex items-center justify-center text-gray-400">
          Image placeholder
        </div>
      </div>
    ),
  },
};

export const Gallery: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 gap-4">
      <Watermark {...args} text="CONFIDENTIAL">
        <div className="p-6 bg-white border rounded-lg min-h-[150px]">
          <p className="text-sm text-gray-600">Confidential</p>
        </div>
      </Watermark>
      <Watermark {...args} text="DRAFT" opacity={0.08}>
        <div className="p-6 bg-white border rounded-lg min-h-[150px]">
          <p className="text-sm text-gray-600">Draft</p>
        </div>
      </Watermark>
      <Watermark {...args} text="SAMPLE" color="#ff0000" opacity={0.06}>
        <div className="p-6 bg-white border rounded-lg min-h-[150px]">
          <p className="text-sm text-gray-600">Sample (red)</p>
        </div>
      </Watermark>
      <Watermark {...args} text="PREVIEW" gap={60} fontSize={12}>
        <div className="p-6 bg-white border rounded-lg min-h-[150px]">
          <p className="text-sm text-gray-600">Dense pattern</p>
        </div>
      </Watermark>
    </div>
  ),
};
