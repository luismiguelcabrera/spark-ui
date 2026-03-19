import type { Meta, StoryObj } from "@storybook/react-vite";
import { LocaleProvider } from "./locale-provider";
import { useLocale } from "../../lib/locale";

const meta = {
  title: "Layout/LocaleProvider",
  component: LocaleProvider,
  tags: ["autodocs"],
  argTypes: {
    locale: { control: "text" },
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
    <LocaleProvider
      locale="ar"
      rtl
      messages={{
        "common.close": "\u0625\u063A\u0644\u0627\u0642",
        "common.save": "\u062D\u0641\u0638",
      }}
    >
      <LocaleDemo />
    </LocaleProvider>
  ),
};

export const FrenchLocale: Story = {
  render: () => (
    <LocaleProvider
      locale="fr"
      messages={{
        "common.close": "Fermer",
        "common.save": "Enregistrer",
      }}
    >
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
    <LocaleProvider locale="ar" rtl>
      <div className="space-y-4 p-4 bg-white border border-slate-200 rounded-xl">
        <h3 className="text-base font-semibold text-slate-900">RTL Layout Demo</h3>
        <div className="flex gap-3">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex-1">
            <p className="text-sm text-primary">Right-to-left aligned content</p>
          </div>
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 flex-1">
            <p className="text-sm text-accent">Second column</p>
          </div>
        </div>
      </div>
    </LocaleProvider>
  ),
};
