import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { CodeInput } from "../code-input";

describe("CodeInput", () => {
  it("renders a textarea", () => {
    render(<CodeInput />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("textbox").tagName).toBe("TEXTAREA");
  });

  it("shows line numbers by default", () => {
    render(<CodeInput defaultValue="line1\nline2\nline3" />);
    expect(screen.getByTestId("line-numbers")).toBeInTheDocument();
  });

  it("hides line numbers when lineNumbers=false", () => {
    render(<CodeInput lineNumbers={false} />);
    expect(screen.queryByTestId("line-numbers")).not.toBeInTheDocument();
  });

  it("handles typing", async () => {
    const user = userEvent.setup();
    render(<CodeInput placeholder="Type code here" />);
    const textarea = screen.getByPlaceholderText("Type code here");
    await user.type(textarea, "hello");
    expect(textarea).toHaveValue("hello");
  });

  it("Tab inserts spaces", () => {
    render(<CodeInput defaultValue="hello" />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    // Position cursor at end
    fireEvent.focus(textarea);
    textarea.selectionStart = 5;
    textarea.selectionEnd = 5;

    fireEvent.keyDown(textarea, { key: "Tab" });
    // After Tab press, value should contain 2 spaces (default tabSize)
    expect(textarea.value).toContain("  ");
  });

  it("forwards ref", () => {
    const ref = { current: null as HTMLTextAreaElement | null };
    render(<CodeInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("has displayName", () => {
    expect(CodeInput.displayName).toBe("CodeInput");
  });

  it("merges className", () => {
    const { container } = render(<CodeInput className="my-custom" />);
    expect(container.firstChild).toHaveClass("my-custom");
  });

  it("disabled state", () => {
    render(<CodeInput disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("error state shows border and message", () => {
    render(<CodeInput error="Syntax error" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Syntax error");
  });

  it("label renders", () => {
    render(<CodeInput label="My Code" />);
    expect(screen.getByText("My Code")).toBeInTheDocument();
  });

  it("readOnly prevents editing", () => {
    render(<CodeInput readOnly defaultValue="const x = 1;" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("readonly");
  });

  it("applies language data attribute", () => {
    render(<CodeInput language="json" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("data-language", "json");
  });

  it("placeholder shows", () => {
    render(<CodeInput placeholder="Enter code..." />);
    expect(screen.getByPlaceholderText("Enter code...")).toBeInTheDocument();
  });

  it("sets aria-invalid when error present", () => {
    render(<CodeInput error="Error" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("does not set aria-invalid when no error", () => {
    render(<CodeInput />);
    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid");
  });

  it("has aria-label for accessibility", () => {
    render(<CodeInput />);
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "aria-label",
      "Code editor"
    );
  });

  it("uses label as aria-label when provided", () => {
    render(<CodeInput label="SQL Editor" />);
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "aria-label",
      "SQL Editor"
    );
  });

  it("pre element is aria-hidden", () => {
    const { container } = render(<CodeInput defaultValue="code" />);
    const pre = container.querySelector("pre");
    expect(pre).toHaveAttribute("aria-hidden", "true");
  });

  it("renders code element with language class", () => {
    const { container } = render(
      <CodeInput language="javascript" defaultValue="const x = 1;" />
    );
    const code = container.querySelector("code");
    expect(code).toHaveClass("language-javascript");
  });
});
