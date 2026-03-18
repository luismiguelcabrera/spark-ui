import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { describe, it, expect } from "vitest";
import { MegaMenu, type MegaMenuSection } from "../components/navigation/mega-menu";
import { TableOfContents, type TocItem } from "../components/navigation/table-of-contents";

expect.extend(toHaveNoViolations);

const megaMenuSections: MegaMenuSection[] = [
  {
    label: "Products",
    columns: [
      {
        title: "Software",
        items: [
          { label: "Analytics", href: "/analytics" },
          { label: "Automation", href: "/automation" },
        ],
      },
    ],
  },
  {
    label: "Solutions",
    columns: [
      {
        items: [
          { label: "Enterprise", href: "/enterprise" },
        ],
      },
    ],
  },
];

const tocItems: TocItem[] = [
  { id: "intro", label: "Introduction" },
  {
    id: "getting-started",
    label: "Getting Started",
    children: [
      { id: "install", label: "Installation", level: 1 },
      { id: "setup", label: "Setup", level: 1 },
    ],
  },
  { id: "api", label: "API Reference" },
];

describe("Accessibility (axe)", () => {
  it("MegaMenu (closed)", async () => {
    const { container } = render(<MegaMenu sections={megaMenuSections} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("TableOfContents (default variant)", async () => {
    const { container } = render(
      <TableOfContents items={tocItems} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("TableOfContents (with active item)", async () => {
    const { container } = render(
      <TableOfContents items={tocItems} activeId="getting-started" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("TableOfContents (minimal variant)", async () => {
    const { container } = render(
      <TableOfContents items={tocItems} variant="minimal" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("TableOfContents (bordered variant)", async () => {
    const { container } = render(
      <TableOfContents items={tocItems} variant="bordered" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
