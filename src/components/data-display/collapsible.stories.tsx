import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./collapsible";
import { Icon } from "./icon";

const meta = {
  title: "Data Display/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
  argTypes: {
    defaultOpen: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Collapsible {...args} defaultOpen={false}>
      {({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => (
        <div className="w-80 rounded-xl border border-slate-200 bg-white">
          <CollapsibleTrigger
            onClick={toggle}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 rounded-t-xl"
          >
            <span className="font-medium text-sm text-slate-800">Toggle Section</span>
            <Icon name={isOpen ? "chevron-up" : "chevron-down"} size="sm" className="text-slate-500" />
          </CollapsibleTrigger>
          <CollapsibleContent open={isOpen}>
            <div className="px-4 py-3 text-sm text-slate-600 border-t border-slate-100">
              This content can be expanded or collapsed. It supports both controlled and uncontrolled modes.
            </div>
          </CollapsibleContent>
        </div>
      )}
    </Collapsible>
  ),
};

export const DefaultOpen: Story = {
  render: (args) => (
    <Collapsible {...args} defaultOpen>
      {({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => (
        <div className="w-80 rounded-xl border border-slate-200 bg-white">
          <CollapsibleTrigger
            onClick={toggle}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 rounded-t-xl"
          >
            <span className="font-medium text-sm text-slate-800">Open by Default</span>
            <Icon name={isOpen ? "chevron-up" : "chevron-down"} size="sm" className="text-slate-500" />
          </CollapsibleTrigger>
          <CollapsibleContent open={isOpen}>
            <div className="px-4 py-3 text-sm text-slate-600 border-t border-slate-100">
              This section starts expanded and can be collapsed by clicking the trigger.
            </div>
          </CollapsibleContent>
        </div>
      )}
    </Collapsible>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Collapsible {...args} disabled>
      {({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => (
        <div className="w-80 rounded-xl border border-slate-200 bg-white opacity-50">
          <CollapsibleTrigger
            onClick={toggle}
            className="w-full flex items-center justify-between px-4 py-3 cursor-not-allowed rounded-t-xl"
          >
            <span className="font-medium text-sm text-slate-800">Disabled Section</span>
            <Icon name="chevron-down" size="sm" className="text-slate-500" />
          </CollapsibleTrigger>
          <CollapsibleContent open={isOpen}>
            <div className="px-4 py-3 text-sm text-slate-600 border-t border-slate-100">
              You should not see this content.
            </div>
          </CollapsibleContent>
        </div>
      )}
    </Collapsible>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium"
        >
          {open ? "Close" : "Open"} externally
        </button>
        <Collapsible open={open} onOpenChange={setOpen}>
          {({ isOpen }: { isOpen: boolean }) => (
            <div className="w-80 rounded-xl border border-slate-200 bg-white">
              <div className="px-4 py-3 font-medium text-sm text-slate-800">
                Controlled: {isOpen ? "Open" : "Closed"}
              </div>
              <CollapsibleContent open={isOpen}>
                <div className="px-4 py-3 text-sm text-slate-600 border-t border-slate-100">
                  This collapsible is controlled via external state.
                </div>
              </CollapsibleContent>
            </div>
          )}
        </Collapsible>
      </div>
    );
  },
};

export const MultipleSections: Story = {
  render: (args) => (
    <div className="w-80 space-y-2">
      {["General Settings", "Privacy", "Notifications"].map((section) => (
        <Collapsible key={section} {...args} defaultOpen={false}>
          {({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => (
            <div className="rounded-xl border border-slate-200 bg-white">
              <CollapsibleTrigger
                onClick={toggle}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 rounded-t-xl"
              >
                <span className="font-medium text-sm text-slate-800">{section}</span>
                <Icon name={isOpen ? "chevron-up" : "chevron-down"} size="sm" className="text-slate-500" />
              </CollapsibleTrigger>
              <CollapsibleContent open={isOpen}>
                <div className="px-4 py-3 text-sm text-slate-600 border-t border-slate-100">
                  Content for {section}. Configure your preferences here.
                </div>
              </CollapsibleContent>
            </div>
          )}
        </Collapsible>
      ))}
    </div>
  ),
};
