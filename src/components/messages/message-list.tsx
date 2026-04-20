"use client";

import type { SignalEnvelope } from "@/lib/types";
import { MessageItem } from "./message-item";

interface MessageListProps {
  events: SignalEnvelope[];
}

export function MessageList({ events }: MessageListProps) {
  if (!events.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
        No events received yet. Messages will appear here in real-time.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {events.map((event, idx) => (
        <MessageItem key={`${event.timestamp}-${idx}`} envelope={event} />
      ))}
    </div>
  );
}
