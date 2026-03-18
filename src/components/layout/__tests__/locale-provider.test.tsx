import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LocaleProvider } from "../locale-provider";
import { useLocale } from "../../../lib/locale";

function TestConsumer() {
  const { locale, t, isRtl, dir } = useLocale();
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="dir">{dir}</span>
      <span data-testid="is-rtl">{String(isRtl)}</span>
      <span data-testid="close-text">{t("common.close")}</span>
      <span data-testid="custom-key">{t("custom.key", "fallback")}</span>
    </div>
  );
}

describe("LocaleProvider", () => {
  it("renders children", () => {
    render(
      <LocaleProvider>
        <div>App content</div>
      </LocaleProvider>,
    );
    expect(screen.getByText("App content")).toBeInTheDocument();
  });

  it("has displayName", () => {
    expect(LocaleProvider.displayName).toBe("LocaleProvider");
  });

  it("provides default locale as en", () => {
    render(
      <LocaleProvider>
        <TestConsumer />
      </LocaleProvider>,
    );
    expect(screen.getByTestId("locale")).toHaveTextContent("en");
  });

  it("provides custom locale", () => {
    render(
      <LocaleProvider locale="fr">
        <TestConsumer />
      </LocaleProvider>,
    );
    expect(screen.getByTestId("locale")).toHaveTextContent("fr");
  });

  it("provides ltr direction by default", () => {
    render(
      <LocaleProvider>
        <TestConsumer />
      </LocaleProvider>,
    );
    expect(screen.getByTestId("dir")).toHaveTextContent("ltr");
    expect(screen.getByTestId("is-rtl")).toHaveTextContent("false");
  });

  it("provides rtl direction when rtl is true", () => {
    render(
      <LocaleProvider rtl>
        <TestConsumer />
      </LocaleProvider>,
    );
    expect(screen.getByTestId("dir")).toHaveTextContent("rtl");
    expect(screen.getByTestId("is-rtl")).toHaveTextContent("true");
  });

  it("wraps in a dir=rtl div when rtl is true", () => {
    const { container } = render(
      <LocaleProvider rtl>
        <div>RTL content</div>
      </LocaleProvider>,
    );
    const rtlDiv = container.querySelector("[dir='rtl']");
    expect(rtlDiv).toBeInTheDocument();
  });

  it("does not wrap in dir div when ltr", () => {
    const { container } = render(
      <LocaleProvider>
        <div>LTR content</div>
      </LocaleProvider>,
    );
    expect(container.querySelector("[dir='rtl']")).not.toBeInTheDocument();
  });

  it("provides default messages (t function)", () => {
    render(
      <LocaleProvider>
        <TestConsumer />
      </LocaleProvider>,
    );
    expect(screen.getByTestId("close-text")).toHaveTextContent("Close");
  });

  it("merges custom messages with defaults", () => {
    const messages = { "custom.key": "Custom Value" };
    render(
      <LocaleProvider messages={messages}>
        <TestConsumer />
      </LocaleProvider>,
    );
    // Default message still works
    expect(screen.getByTestId("close-text")).toHaveTextContent("Close");
    // Custom message works
    expect(screen.getByTestId("custom-key")).toHaveTextContent("Custom Value");
  });

  it("custom messages override defaults", () => {
    const messages = { "common.close": "Fermer" };
    render(
      <LocaleProvider messages={messages}>
        <TestConsumer />
      </LocaleProvider>,
    );
    expect(screen.getByTestId("close-text")).toHaveTextContent("Fermer");
  });

  it("t function returns fallback for missing keys", () => {
    render(
      <LocaleProvider>
        <TestConsumer />
      </LocaleProvider>,
    );
    expect(screen.getByTestId("custom-key")).toHaveTextContent("fallback");
  });
});
