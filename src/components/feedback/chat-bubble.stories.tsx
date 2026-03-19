import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChatBubble } from "./chat-bubble";

const meta = {
  title: "Feedback/ChatBubble",
  component: ChatBubble,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["sent", "received"] },
    message: { control: "text" },
    timestamp: { control: "text" },
    avatar: { control: "text" },
    initials: { control: "text" },
  },
} satisfies Meta<typeof ChatBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: "Hey, how are you doing?",
    variant: "received",
    timestamp: "10:30 AM",
  },
};

export const Sent: Story = {
  args: {
    message: "I'm doing great, thanks for asking!",
    variant: "sent",
    timestamp: "10:31 AM",
  },
};

export const Received: Story = {
  args: {
    message: "That's wonderful to hear. Want to grab lunch?",
    variant: "received",
    timestamp: "10:32 AM",
  },
};

export const WithInitials: Story = {
  args: {
    message: "Sure, let me check my calendar.",
    variant: "received",
    initials: "JD",
    timestamp: "10:33 AM",
  },
};

export const WithAvatar: Story = {
  args: {
    message: "Sounds like a plan!",
    variant: "sent",
    avatar: "https://i.pravatar.cc/40?img=12",
    timestamp: "10:34 AM",
  },
};

export const LongMessage: Story = {
  args: {
    message:
      "This is a much longer message that demonstrates how the chat bubble handles wrapping text. It should stay within its max-width boundary and wrap naturally without breaking the layout.",
    variant: "received",
    timestamp: "10:35 AM",
    initials: "AB",
  },
};

export const NoTimestamp: Story = {
  args: {
    message: "Quick reply without a timestamp",
    variant: "sent",
  },
};

export const Conversation: Story = {
  args: { message: "" },
  render: (args) => (
    <div className="flex flex-col gap-3 max-w-lg">
      <ChatBubble
        {...args}
        message="Hey! Are you coming to the meeting today?"
        variant="received"
        initials="SM"
        timestamp="9:00 AM"
      />
      <ChatBubble
        {...args}
        message="Yes, I'll be there in 5 minutes."
        variant="sent"
        timestamp="9:01 AM"
      />
      <ChatBubble
        {...args}
        message="Great! We're in conference room B."
        variant="received"
        initials="SM"
        timestamp="9:01 AM"
      />
      <ChatBubble
        {...args}
        message="On my way now."
        variant="sent"
        timestamp="9:02 AM"
      />
      <ChatBubble
        {...args}
        message="See you soon!"
        variant="received"
        initials="SM"
        timestamp="9:02 AM"
      />
    </div>
  ),
};
