import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { describe, it, expect } from "vitest";
import { Transfer } from "../components/data-display/transfer";
import { Descriptions } from "../components/data-display/descriptions";
import { Galleria } from "../components/data-display/galleria";

expect.extend(toHaveNoViolations);

describe("Accessibility (axe)", () => {
  it("Transfer (default)", async () => {
    const items = [
      { key: "a", label: "Alpha" },
      { key: "b", label: "Beta" },
      { key: "c", label: "Gamma" },
    ];
    const { container } = render(<Transfer dataSource={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Transfer (with search)", async () => {
    const items = [
      { key: "a", label: "Alpha" },
      { key: "b", label: "Beta" },
    ];
    const { container } = render(<Transfer dataSource={items} searchable />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Transfer (with target keys)", async () => {
    const items = [
      { key: "a", label: "Alpha" },
      { key: "b", label: "Beta" },
    ];
    const { container } = render(
      <Transfer dataSource={items} defaultTargetKeys={["a"]} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Descriptions (default)", async () => {
    const items = [
      { label: "Name", children: "John Doe" },
      { label: "Email", children: "john@example.com" },
    ];
    const { container } = render(<Descriptions items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Descriptions (bordered)", async () => {
    const items = [
      { label: "Name", children: "John Doe" },
      { label: "Email", children: "john@example.com" },
    ];
    const { container } = render(<Descriptions items={items} bordered />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Descriptions (with title)", async () => {
    const items = [
      { label: "Name", children: "John Doe" },
    ];
    const { container } = render(
      <Descriptions items={items} title="User Info" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Galleria (default)", async () => {
    const images = [
      { src: "/img1.jpg", alt: "Image 1" },
      { src: "/img2.jpg", alt: "Image 2" },
    ];
    const { container } = render(<Galleria images={images} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Galleria (with indicators)", async () => {
    const images = [
      { src: "/img1.jpg", alt: "Image 1" },
      { src: "/img2.jpg", alt: "Image 2" },
    ];
    const { container } = render(
      <Galleria images={images} showIndicators showThumbnails={false} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Galleria (empty)", async () => {
    const { container } = render(<Galleria images={[]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
