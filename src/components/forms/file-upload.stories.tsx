import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileUploadZone, FileUploadItem } from "./file-upload";
import type { FileItem } from "./file-upload";

const meta = {
  title: "Forms/FileUpload",
  component: FileUploadZone,
  tags: ["autodocs"],
} satisfies Meta<typeof FileUploadZone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomAccept: Story = {
  args: { accept: "SVG, PNG, WebP up to 5MB" },
};

const sampleFiles: FileItem[] = [
  { name: "document.pdf", size: "2.4 MB", status: "complete", icon: "description" },
  { name: "photo.jpg", size: "1.1 MB", progress: 65, status: "uploading", icon: "image" },
  { name: "corrupted.zip", size: "800 KB", status: "error", icon: "folder_zip" },
];

export const UploadItems: Story = {
  render: (args) => (
    <div className="space-y-3 max-w-md">
      <FileUploadZone {...args} />
      {sampleFiles.map((file) => (
        <FileUploadItem key={file.name} file={file} />
      ))}
    </div>
  ),
};

export const CompletedFile: Story = {
  render: () => (
    <FileUploadItem
      file={{ name: "report-final.pdf", size: "3.2 MB", status: "complete" }}
    />
  ),
};

export const UploadingFile: Story = {
  render: () => (
    <FileUploadItem
      file={{ name: "video.mp4", size: "24 MB", progress: 42, status: "uploading" }}
    />
  ),
};

export const ErrorFile: Story = {
  render: () => (
    <FileUploadItem
      file={{ name: "too-large.zip", size: "150 MB", status: "error" }}
    />
  ),
};
