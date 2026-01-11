import { format } from "date-fns";
import { Bot, User } from "lucide-react";

interface Message {
  id: string;
  message_content: string;
  type: "Inbound" | "Outbound";
  status: "Sent" | "Received";
  created_at: string;
}

interface MessageThreadProps {
  messages: Message[];
  contactName: string;
}

export function MessageThread({ messages, contactName }: MessageThreadProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">{contactName}</h3>
        <p className="text-xs text-muted-foreground">Message History</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-sm">No messages yet</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOutbound = msg.type === "Outbound";
            return (
              <div
                key={msg.id}
                className={`flex ${
                  isOutbound ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`
                    max-w-[75%] rounded-2xl px-4 py-2.5 animate-scale-in
                    ${
                      isOutbound
                        ? "bg-primary/20 text-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }
                  `}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {isOutbound ? (
                      <Bot className="h-3 w-3 text-primary" />
                    ) : (
                      <User className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {isOutbound ? "System" : contactName}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">
                    {msg.message_content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 text-right">
                    {format(new Date(msg.created_at), "HH:mm")}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Read-only notice */}
      <div className="p-4 border-t border-border bg-muted/30">
        <p className="text-xs text-muted-foreground text-center">
          🔒 Read-only — Messages are sent via n8n automation
        </p>
      </div>
    </div>
  );
}
