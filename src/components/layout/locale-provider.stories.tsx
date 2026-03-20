import type { Meta, StoryObj } from "@storybook/react-vite";
import { LocaleProvider } from "./locale-provider";
import { useLocale } from "../../lib/locale";
import { en } from "../../locales/en";
import { es } from "../../locales/es";
import { fr } from "../../locales/fr";
import { de } from "../../locales/de";
import { pt } from "../../locales/pt";
import { ar } from "../../locales/ar";
import { zh } from "../../locales/zh";
import { ja } from "../../locales/ja";
import { Calendar } from "../data-display/calendar";
import { Pagination } from "../navigation/pagination";
import { Tour } from "../feedback/tour";
import type { LocaleMessages } from "../../lib/default-messages";

const localePacks: Record<string, { messages: LocaleMessages; rtl: boolean; label: string }> = {
  en: { messages: en, rtl: false, label: "English" },
  es: { messages: es, rtl: false, label: "Espa\u00f1ol" },
  fr: { messages: fr, rtl: false, label: "Fran\u00e7ais" },
  de: { messages: de, rtl: false, label: "Deutsch" },
  pt: { messages: pt, rtl: false, label: "Portugu\u00eas" },
  ar: { messages: ar, rtl: true, label: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629" },
  zh: { messages: zh, rtl: false, label: "\u4E2D\u6587" },
  ja: { messages: ja, rtl: false, label: "\u65E5\u672C\u8A9E" },
};

const meta = {
  title: "Layout/LocaleProvider",
  component: LocaleProvider,
  tags: ["autodocs"],
  argTypes: {
    locale: {
      control: "select",
      options: Object.keys(localePacks),
      mapping: Object.fromEntries(Object.keys(localePacks).map((k) => [k, k])),
      description: "Select a language to preview",
    },
    rtl: { control: "boolean" },
  },
} satisfies Meta<typeof LocaleProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

function LocaleDemo() {
  const { locale, t, isRtl, dir } = useLocale();
  return (
    <div className="space-y-3 p-4 bg-white border border-slate-200 rounded-xl">
      <div className="text-sm text-slate-600">
        <strong>Locale:</strong> {locale}
      </div>
      <div className="text-sm text-slate-600">
        <strong>Direction:</strong> {dir}
      </div>
      <div className="text-sm text-slate-600">
        <strong>RTL:</strong> {isRtl ? "Yes" : "No"}
      </div>
      <div className="text-sm text-slate-600">
        <strong>t(&quot;common.close&quot;):</strong> {t("common.close", "Close")}
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <LocaleProvider>
      <LocaleDemo />
    </LocaleProvider>
  ),
};

export const ArabicRTL: Story = {
  render: () => (
    <LocaleProvider locale="ar" rtl messages={ar}>
      <LocaleDemo />
    </LocaleProvider>
  ),
};

export const FrenchLocale: Story = {
  render: () => (
    <LocaleProvider locale="fr" messages={fr}>
      <LocaleDemo />
    </LocaleProvider>
  ),
};

export const CustomMessages: Story = {
  render: () => {
    function CustomDemo() {
      const { t } = useLocale();
      return (
        <div className="space-y-2 p-4 bg-white border border-slate-200 rounded-xl">
          <p className="text-sm text-slate-600">
            <strong>Greeting:</strong> {t("greeting", "Hello!")}
          </p>
          <p className="text-sm text-slate-600">
            <strong>Farewell:</strong> {t("farewell", "Goodbye!")}
          </p>
          <p className="text-sm text-slate-600">
            <strong>Missing key:</strong> {t("missing.key")}
          </p>
        </div>
      );
    }

    return (
      <LocaleProvider
        locale="en"
        messages={{
          greeting: "Welcome to Spark UI!",
          farewell: "See you later!",
        }}
      >
        <CustomDemo />
      </LocaleProvider>
    );
  },
};

export const RTLLayout: Story = {
  render: () => (
    <LocaleProvider locale="ar" rtl messages={ar}>
      <div className="space-y-4 p-4 bg-white border border-slate-200 rounded-xl">
        <h3 className="text-base font-semibold text-slate-900">RTL Layout Demo</h3>
        <div className="flex gap-3">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex-1">
            <p className="text-sm text-primary">Right-to-left aligned content</p>
          </div>
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 flex-1">
            <p className="text-sm text-amber-800">Second column</p>
          </div>
        </div>
      </div>
    </LocaleProvider>
  ),
};

/**
 * Interactive locale switcher — use the **locale** control in the panel
 * below to switch between all 8 supported languages live.
 */
export const LocaleSwitcher: Story = {
  args: {
    locale: "en",
  },
  argTypes: {
    locale: {
      control: "select",
      options: Object.keys(localePacks),
      description: "Pick a language",
    },
  },
  render: (args) => {
    const key = (args.locale as string) || "en";
    const pack = localePacks[key] ?? localePacks.en;

    return (
      <LocaleProvider locale={key} rtl={pack.rtl} messages={pack.messages}>
        <div className="space-y-6 max-w-md">
          <div className="flex flex-wrap gap-2 text-xs text-slate-600">
            {Object.entries(localePacks).map(([code, p]) => (
              <span
                key={code}
                className={code === key ? "font-bold text-primary" : ""}
              >
                {p.label}
              </span>
            ))}
          </div>

          <LocaleDemo />

          <Calendar showTodayButton showSelectedLabel />

          <Pagination total={120} pageSize={10} />
        </div>
      </LocaleProvider>
    );
  },
};

/** Calendar + Pagination in Spanish */
export const SpanishCalendar: Story = {
  render: () => (
    <LocaleProvider locale="es" messages={es}>
      <div className="space-y-6 max-w-sm">
        <Calendar showTodayButton showSelectedLabel />
        <Pagination total={120} pageSize={10} />
      </div>
    </LocaleProvider>
  ),
};

/** Calendar in Arabic (RTL) */
export const ArabicCalendar: Story = {
  render: () => (
    <LocaleProvider locale="ar" rtl messages={ar}>
      <div className="space-y-6 max-w-sm">
        <Calendar showTodayButton showSelectedLabel />
        <Pagination total={120} pageSize={10} />
      </div>
    </LocaleProvider>
  ),
};

/** Calendar in Japanese */
export const JapaneseCalendar: Story = {
  render: () => (
    <LocaleProvider locale="ja" messages={ja}>
      <div className="space-y-6 max-w-sm">
        <Calendar showTodayButton showSelectedLabel />
        <Pagination total={120} pageSize={10} />
      </div>
    </LocaleProvider>
  ),
};
