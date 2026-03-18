import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { describe, it, expect } from "vitest";
import { Mention } from "../components/forms/mention";
import { RichTextEditor } from "../components/forms/rich-text-editor";

expect.extend(toHaveNoViolations);

describe("Accessibility (axe)", () => {
  it("Mention (default)", async () => {
    const options = [
      { value: "alice", label: "Alice" },
      { value: "bob", label: "Bob" },
    ];
    const { container } = render(
      <Mention options={options} placeholder="Type @ to mention" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Mention (disabled)", async () => {
    const options = [
      { value: "alice", label: "Alice" },
    ];
    const { container } = render(
      <Mention options={options} disabled placeholder="Disabled" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("Mention (multiline)", async () => {
    const options = [
      { value: "alice", label: "Alice" },
    ];
    const { container } = render(
      <Mention options={options} multiline placeholder="Multiline" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("RichTextEditor (default)", async () => {
    const { container } = render(
      <RichTextEditor placeholder="Write something" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("RichTextEditor (disabled)", async () => {
    const { container } = render(
      <RichTextEditor disabled placeholder="Disabled" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("RichTextEditor (readOnly)", async () => {
    const { container } = render(
      <RichTextEditor readOnly defaultValue="<p>Read only</p>" />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("RichTextEditor (custom toolbar)", async () => {
    const { container } = render(
      <RichTextEditor toolbar={["bold", "italic", "separator", "undo", "redo"]} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
