import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { QrCode } from "../qr-code";

describe("QrCode", () => {
  const dataUrl = "data:image/png;base64,abc123";

  it("renders an image with the dataUrl", () => {
    render(<QrCode dataUrl={dataUrl} />);
    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", dataUrl);
  });

  it("renders with default alt text", () => {
    render(<QrCode dataUrl={dataUrl} />);
    expect(screen.getByAltText("QR Code")).toBeInTheDocument();
  });

  it("renders with custom alt text", () => {
    render(<QrCode dataUrl={dataUrl} alt="Scan me" />);
    expect(screen.getByAltText("Scan me")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<QrCode ref={ref} dataUrl={dataUrl} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has correct displayName", () => {
    expect(QrCode.displayName).toBe("QrCode");
  });

  it("merges custom className", () => {
    const { container } = render(<QrCode dataUrl={dataUrl} className="custom-class" />);
    expect(container.firstElementChild!.className).toContain("custom-class");
  });

  it("applies custom size to the image", () => {
    render(<QrCode dataUrl={dataUrl} size={150} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("width", "150");
    expect(img).toHaveAttribute("height", "150");
  });

  it("applies default size of 200", () => {
    render(<QrCode dataUrl={dataUrl} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("width", "200");
    expect(img).toHaveAttribute("height", "200");
  });
});
