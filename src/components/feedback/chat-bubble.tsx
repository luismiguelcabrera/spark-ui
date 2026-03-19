import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { s } from "../../lib/styles";
import { Avatar } from "../data-display/avatar";

const chatBubbleVariants = cva("max-w-[75%] px-4 py-2.5 text-sm", {
  variants: {
    variant: {
      sent: s.chatBubbleSent,
      received: s.chatBubbleReceived,
    },
  },
  defaultVariants: {
    variant: "received",
  },
});

type ChatBubbleProps = {
  message: string;
  avatar?: string;
  /** Accessible label for the avatar image */
  avatarAlt?: string;
  initials?: string;
  timestamp?: string;
  className?: string;
} & VariantProps<typeof chatBubbleVariants>;

const ChatBubble = forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ message, avatar, avatarAlt, initials, timestamp, variant = "received", className }, ref) => {
    const isSent = variant === "sent";

    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-2",
          isSent ? "flex-row-reverse" : "flex-row",
          className
        )}
      >
        {(avatar || initials) && (
          <Avatar src={avatar} alt={avatarAlt ?? (avatar ? "User" : undefined)} initials={initials} size="sm" className="shrink-0" />
        )}
        <div className={cn("flex flex-col", isSent ? "items-end" : "items-start")}>
          <div className={cn(chatBubbleVariants({ variant }))}>
            {message}
          </div>
          {timestamp && (
            <span className="text-[11px] text-slate-600 mt-1" aria-label={`Sent at ${timestamp}`}>
              {timestamp}
            </span>
          )}
        </div>
      </div>
    );
  }
);
ChatBubble.displayName = "ChatBubble";

export { ChatBubble, chatBubbleVariants };
export type { ChatBubbleProps };
