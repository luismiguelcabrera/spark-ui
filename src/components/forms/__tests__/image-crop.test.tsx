import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { ImageCrop } from "../image-crop";
import type { ImageCropRef } from "../image-crop";
import { createRef } from "react";

// ── Mocks ──────────────────────────────────────────────────────────────────

const originalImage = globalThis.Image;

beforeAll(() => {
  // Mock Image so it "loads" immediately
  Object.defineProperty(globalThis, "Image", {
    value: class MockImage {
      width = 400;
      height = 300;
      naturalWidth = 400;
      naturalHeight = 300;
      crossOrigin = "";
      onload: (() => void) | null = null;
      set src(_: string) {
        setTimeout(() => this.onload?.(), 0);
      }
    },
    writable: true,
  });

  // Mock canvas getContext
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    drawImage: vi.fn(),
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(4) })),
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext;
});

afterAll(() => {
  Object.defineProperty(globalThis, "Image", {
    value: originalImage,
    writable: true,
  });
});

const TEST_SRC = "https://picsum.photos/seed/test/800/600";

describe("ImageCrop", () => {
  it("renders image element with src", () => {
    render(<ImageCrop src={TEST_SRC} />);
    const img = screen.getByRole("presentation");
    expect(img).toHaveAttribute("src", TEST_SRC);
  });

  it("renders crop overlay", () => {
    render(<ImageCrop src={TEST_SRC} />);
    const overlay = screen.getByTestId("crop-overlay");
    expect(overlay).toBeInTheDocument();
  });

  it("forwards ref with imperative methods", () => {
    const ref = createRef<ImageCropRef>();
    // We pass the ref as a standard ref — the component exposes imperative handle
    const { container } = render(<ImageCrop src={TEST_SRC} ref={ref as React.Ref<HTMLDivElement>} />);
    // The outer div gets the forwarded ref
    expect(container.firstChild).toBeInstanceOf(HTMLDivElement);
  });

  it("getCropArea returns CropArea object", async () => {
    const ref = createRef<ImageCropRef>();
    render(<ImageCrop src={TEST_SRC} ref={ref as React.Ref<HTMLDivElement>} />);

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    // Access the imperative handle via the ref
    const area = ref.current?.getCropArea();
    expect(area).toBeDefined();
    expect(area).toHaveProperty("x");
    expect(area).toHaveProperty("y");
    expect(area).toHaveProperty("width");
    expect(area).toHaveProperty("height");
    expect(typeof area!.x).toBe("number");
  });

  it("reset restores default crop", async () => {
    const ref = createRef<ImageCropRef>();
    render(<ImageCrop src={TEST_SRC} ref={ref as React.Ref<HTMLDivElement>} />);

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    const initial = ref.current?.getCropArea();
    ref.current?.reset();
    const after = ref.current?.getCropArea();
    // After reset the crop should be at default position
    expect(after).toEqual(initial);
  });

  it("getCroppedCanvas returns canvas or null", async () => {
    const ref = createRef<ImageCropRef>();
    render(<ImageCrop src={TEST_SRC} ref={ref as React.Ref<HTMLDivElement>} />);

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    const canvas = ref.current?.getCroppedCanvas();
    // With mocked Image, the image object is set so it should return a canvas
    expect(canvas === null || canvas instanceof HTMLCanvasElement).toBe(true);
  });

  it("shows zoom slider when zoom=true", () => {
    render(<ImageCrop src={TEST_SRC} zoom={true} />);
    const slider = screen.getByRole("slider");
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute("type", "range");
  });

  it("hides zoom slider when zoom=false", () => {
    render(<ImageCrop src={TEST_SRC} zoom={false} />);
    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
  });

  it("disabled prevents interaction", () => {
    const { container } = render(<ImageCrop src={TEST_SRC} disabled />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("opacity-50");
    expect(root.className).toContain("pointer-events-none");
  });

  it("has displayName", () => {
    expect(ImageCrop.displayName).toBe("ImageCrop");
  });

  it("merges className", () => {
    const { container } = render(<ImageCrop src={TEST_SRC} className="custom-class" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("custom-class");
  });

  it("error state renders error text with role=alert", () => {
    render(<ImageCrop src={TEST_SRC} error="Image too small" />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Image too small");
  });

  it("label renders", () => {
    render(<ImageCrop src={TEST_SRC} label="Profile photo" />);
    expect(screen.getByText("Profile photo")).toBeInTheDocument();
  });

  it("round shape applies rounded-full class", () => {
    render(<ImageCrop src={TEST_SRC} shape="round" />);
    const overlay = screen.getByTestId("crop-overlay");
    expect(overlay.className).toContain("rounded-full");
  });

  it("renders corner drag handles", () => {
    render(<ImageCrop src={TEST_SRC} />);
    expect(screen.getByTestId("handle-top-left")).toBeInTheDocument();
    expect(screen.getByTestId("handle-top-right")).toBeInTheDocument();
    expect(screen.getByTestId("handle-bottom-left")).toBeInTheDocument();
    expect(screen.getByTestId("handle-bottom-right")).toBeInTheDocument();
  });

  it("calls onCrop when crop changes", async () => {
    const onCrop = vi.fn();
    const ref = createRef<ImageCropRef>();
    render(
      <ImageCrop src={TEST_SRC} onCrop={onCrop} ref={ref as React.Ref<HTMLDivElement>} />
    );

    await act(async () => {
      await new Promise((r) => setTimeout(r, 10));
    });

    // onCrop is called on mount with the initial crop
    expect(onCrop).toHaveBeenCalled();
    const area = onCrop.mock.calls[0][0];
    expect(area).toHaveProperty("x");
    expect(area).toHaveProperty("y");
    expect(area).toHaveProperty("width");
    expect(area).toHaveProperty("height");
  });

  it("zoom slider changes zoom level", () => {
    render(<ImageCrop src={TEST_SRC} zoom={true} />);
    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "2" } });
    // The img transform should reflect the zoom
    const img = screen.getByRole("presentation");
    expect(img.style.transform).toContain("scale(2)");
  });
});
