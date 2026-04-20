"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { useSSE } from "@/hooks/use-sse";
import { useRpcAction } from "@/hooks/use-rpc";
import { MessageList } from "@/components/messages/message-list";
import { SendForm } from "@/components/messages/send-form";
import { Radio, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const { events, isConnected, clear } = useSSE();
  const { execute: rpcAction } = useRpcAction();
  const [showSendForm, setShowSendForm] = useState(false);

  const handleSend = async (data: {
    recipients: string[];
    groupIds: string[];
    message: string;
  }) => {
    try {
      await rpcAction("send", data);
      toast.success("Message sent");
      setShowSendForm(false);
    } catch (err) {
      toast.error(
        `Failed to send: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  return (
    <AppShell title="Messages">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Radio
                className={cn(
                  "h-4 w-4",
                  isConnected ? "text-green-500" : "text-red-500",
                )}
              />
              {isConnected ? "Listening for events" : "SSE disconnected"}
            </div>
            <span className="text-xs text-gray-400">
              {events.length} events
            </span>
          </div>
          <div className="flex gap-2">
            {events.length > 0 && (
              <button
                onClick={clear}
                className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Trash2 className="h-3 w-3" />
                Clear
              </button>
            )}
            <button
              onClick={() => setShowSendForm(!showSendForm)}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              {showSendForm ? "Close" : "Send Message"}
            </button>
          </div>
        </div>

        {showSendForm && (
          <SendForm
            onSend={handleSend}
            onCancel={() => setShowSendForm(false)}
          />
        )}

        <MessageList events={events} />
      </div>
    </AppShell>
  );
}
