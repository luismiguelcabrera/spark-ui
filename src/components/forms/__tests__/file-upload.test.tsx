import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FileUploadZone, FileUploadItem } from "../file-upload";

describe("FileUploadZone", () => {
  it("renders upload prompt text", () => {
    render(<FileUploadZone />);
    expect(screen.getByText("Drop files here or click to upload")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<FileUploadZone ref={ref} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("has displayName", () => {
    expect(FileUploadZone.displayName).toBe("FileUploadZone");
  });

  it("merges className", () => {
    render(<FileUploadZone className="custom" />);
    expect(screen.getByRole("button")).toHaveClass("custom");
  });

  it("shows default accept text", () => {
    render(<FileUploadZone />);
    expect(screen.getByText("PNG, JPG, PDF up to 10MB")).toBeInTheDocument();
  });

  it("shows custom accept text", () => {
    render(<FileUploadZone accept="SVG only" />);
    expect(screen.getByText("SVG only")).toBeInTheDocument();
  });

  it("has role='button' by default", () => {
    render(<FileUploadZone />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("has aria-label for upload", () => {
    render(<FileUploadZone />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Upload files");
  });

  it("supports custom aria-label", () => {
    render(<FileUploadZone aria-label="Upload photos" />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Upload photos");
  });
});

describe("FileUploadItem", () => {
  it("renders file name and size", () => {
    render(<FileUploadItem file={{ name: "photo.jpg", size: "2.4 MB" }} />);
    expect(screen.getByText("photo.jpg")).toBeInTheDocument();
    expect(screen.getByText("2.4 MB")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = vi.fn();
    render(<FileUploadItem ref={ref} file={{ name: "doc.pdf", size: "1 MB" }} />);
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
  });

  it("has displayName", () => {
    expect(FileUploadItem.displayName).toBe("FileUploadItem");
  });

  it("renders uploading state", () => {
    render(
      <FileUploadItem
        file={{ name: "doc.pdf", size: "1 MB", progress: 50, status: "uploading" }}
      />,
    );
    expect(screen.getByText("doc.pdf")).toBeInTheDocument();
  });

  it("renders complete state", () => {
    render(
      <FileUploadItem
        file={{ name: "doc.pdf", size: "1 MB", status: "complete" }}
      />,
    );
    expect(screen.getByText("doc.pdf")).toBeInTheDocument();
  });
});
