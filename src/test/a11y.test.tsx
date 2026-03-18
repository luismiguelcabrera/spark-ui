import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { describe, it, expect } from "vitest";
import { Cascader } from "../components/forms/cascader";
import { TreeSelect } from "../components/forms/tree-select";
import { SplitButton } from "../components/forms/split-button";

expect.extend(toHaveNoViolations);

const cascaderOptions = [
  {
    label: "United States",
    value: "us",
    children: [
      {
        label: "California",
        value: "ca",
        children: [
          { label: "Los Angeles", value: "la" },
        ],
      },
    ],
  },
  { label: "Canada", value: "ca-country" },
];

const treeData = [
  {
    label: "Documents",
    value: "docs",
    children: [
      { label: "README.md", value: "readme" },
      { label: "Notes.txt", value: "notes" },
    ],
  },
  { label: "photo.png", value: "photo" },
];

const splitActions = [
  { label: "Save as Draft", value: "draft" },
  { label: "Save and Publish", value: "publish" },
];

describe("Accessibility (axe)", () => {
  it("Cascader (default)", async () => {
    const { container } = render(
      <Cascader options={cascaderOptions} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Cascader (with value)", async () => {
    const { container } = render(
      <Cascader options={cascaderOptions} value={["us", "ca", "la"]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Cascader (disabled)", async () => {
    const { container } = render(
      <Cascader options={cascaderOptions} disabled />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("TreeSelect (default)", async () => {
    const { container } = render(
      <TreeSelect data={treeData} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("TreeSelect (with value)", async () => {
    const { container } = render(
      <TreeSelect data={treeData} value="readme" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("TreeSelect (multiple with values)", async () => {
    const { container } = render(
      <TreeSelect data={treeData} multiple value={["readme", "photo"]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("TreeSelect (disabled)", async () => {
    const { container } = render(
      <TreeSelect data={treeData} disabled />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("SplitButton (default)", async () => {
    const { container } = render(
      <SplitButton actions={splitActions}>Save</SplitButton>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("SplitButton (disabled)", async () => {
    const { container } = render(
      <SplitButton actions={splitActions} disabled>Save</SplitButton>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("SplitButton (loading)", async () => {
    const { container } = render(
      <SplitButton actions={splitActions} loading>Save</SplitButton>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("SplitButton (outline variant)", async () => {
    const { container } = render(
      <SplitButton actions={splitActions} variant="outline">Save</SplitButton>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("SplitButton (destructive color)", async () => {
    const { container } = render(
      <SplitButton actions={splitActions} color="destructive">Delete</SplitButton>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
