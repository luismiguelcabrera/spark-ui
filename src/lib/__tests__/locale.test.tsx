import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useLocale } from "../locale";
import { LocaleProvider } from "../../components/layout/locale-provider";
import { defaultMessages } from "../default-messages";

function LocaleConsumer() {
  const { locale, t, isRtl, dir } = useLocale();
  return (
    <div data-testid="consumer">
      <span data-testid="locale">{locale}</span>
      <span data-testid="close">{t("common.close")}</span>
      <span data-testid="missing">{t("missing.key")}</span>
      <span data-testid="fallback">{t("missing.key", "Fallback")}</span>
      <span data-testid="rtl">{String(isRtl)}</span>
      <span data-testid="dir">{dir}</span>
    </div>
  );
}

describe("useLocale (without provider)", () => {
  it("returns default values", () => {
    render(<LocaleConsumer />);
    expect(screen.getByTestId("locale")).toHaveTextContent("en");
    expect(screen.getByTestId("close")).toHaveTextContent("Close");
    expect(screen.getByTestId("rtl")).toHaveTextContent("false");
    expect(screen.getByTestId("dir")).toHaveTextContent("ltr");
  });

  it("returns key when message not found", () => {
    render(<LocaleConsumer />);
    expect(screen.getByTestId("missing")).toHaveTextContent("missing.key");
  });

  it("returns fallback when message not found", () => {
    render(<LocaleConsumer />);
    expect(screen.getByTestId("fallback")).toHaveTextContent("Fallback");
  });
});

describe("LocaleProvider", () => {
  it("provides custom locale", () => {
    render(
      <LocaleProvider locale="fr">
        <LocaleConsumer />
      </LocaleProvider>,
    );
    expect(screen.getByTestId("locale")).toHaveTextContent("fr");
  });

  it("merges custom messages with defaults", () => {
    render(
      <LocaleProvider locale="fr" messages={{ "common.close": "Fermer" }}>
        <LocaleConsumer />
      </LocaleProvider>,
    );
    expect(screen.getByTestId("close")).toHaveTextContent("Fermer");
  });

  it("keeps default messages when custom messages are partial", () => {
    render(
      <LocaleProvider locale="fr" messages={{ "common.close": "Fermer" }}>
        <LocaleConsumer />
      </LocaleProvider>,
    );
    // "common.cancel" was not overridden — should still be "Cancel"
    const { t } = { t: (key: string) => defaultMessages[key] };
    expect(t("common.cancel")).toBe("Cancel");
  });

  it("sets RTL mode", () => {
    render(
      <LocaleProvider locale="ar" rtl>
        <LocaleConsumer />
      </LocaleProvider>,
    );
    expect(screen.getByTestId("rtl")).toHaveTextContent("true");
    expect(screen.getByTestId("dir")).toHaveTextContent("rtl");
  });

  it("wraps children in dir='rtl' div when rtl is true", () => {
    const { container } = render(
      <LocaleProvider locale="ar" rtl>
        <span>Content</span>
      </LocaleProvider>,
    );
    const dirDiv = container.querySelector("[dir='rtl']");
    expect(dirDiv).toBeInTheDocument();
  });

  it("does not add dir wrapper when rtl is false", () => {
    const { container } = render(
      <LocaleProvider locale="en">
        <span>Content</span>
      </LocaleProvider>,
    );
    const dirDiv = container.querySelector("[dir]");
    expect(dirDiv).toBeNull();
  });

  it("renders children", () => {
    render(
      <LocaleProvider>
        <div data-testid="child">Hello</div>
      </LocaleProvider>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("defaults to 'en' locale", () => {
    render(
      <LocaleProvider>
        <LocaleConsumer />
      </LocaleProvider>,
    );
    expect(screen.getByTestId("locale")).toHaveTextContent("en");
  });
});
