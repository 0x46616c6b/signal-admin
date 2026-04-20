"use client";

import type { SignalEnvelope } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";
import { MessageSquare, ArrowRight, Heart, Eye, Check } from "lucide-react";

interface MessageItemProps {
  envelope: SignalEnvelope;
}

export function MessageItem({ envelope }: MessageItemProps) {
  const source = envelope.sourceName || envelope.sourceNumber || envelope.sourceUuid || "Unknown";
  const time = formatTimestamp(envelope.timestamp);

  if (envelope.dataMessage) {
    const dm = envelope.dataMessage;

    if (dm.reaction) {
      return (
        <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
          <Heart className="mt-0.5 h-4 w-4 shrink-0 text-pink-500" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium text-gray-700 dark:text-gray-300">{source}</span>
              <span>{time}</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {dm.reaction.isRemove ? "Removed" : "Reacted with"}{" "}
              <span className="text-base">{dm.reaction.emoji}</span>
            </p>
          </div>
        </div>
      );
    }

    if (dm.remoteDelete) {
      return (
        <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
          <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium text-gray-700 dark:text-gray-300">{source}</span>
              <span>{time}</span>
            </div>
            <p className="text-sm italic text-gray-400 dark:text-gray-500">Message deleted</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
        <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="font-medium text-gray-700">{source}</span>
            {dm.groupInfo && (
              <>
                <ArrowRight className="h-3 w-3" />
                <span className="font-mono text-gray-400 dark:text-gray-500">
                  {dm.groupInfo.groupId}
                </span>
              </>
            )}
            <span>{time}</span>
            {dm.viewOnce && (
              <span className="inline-flex items-center gap-0.5 text-orange-500">
                <Eye className="h-3 w-3" />
                View once
              </span>
            )}
          </div>
          {dm.message && (
            <p className="text-sm text-gray-900 whitespace-pre-wrap break-words dark:text-gray-100">
              {dm.message}
            </p>
          )}
          {dm.attachments && dm.attachments.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {dm.attachments.map((att, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                >
                  {att.filename ?? att.contentType}
                  {att.size ? ` (${(att.size / 1024).toFixed(1)}KB)` : ""}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (envelope.syncMessage?.sentMessage) {
    const sm = envelope.syncMessage.sentMessage;
    const dest =
      sm.destinationNumber ?? sm.destinationUuid ?? sm.groupInfo?.groupId ?? "Unknown";
    return (
      <div className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/50">
        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="text-green-600 dark:text-green-400">Sent</span>
            <ArrowRight className="h-3 w-3" />
            <span className="font-medium text-gray-700 dark:text-gray-300">{dest}</span>
            <span>{time}</span>
          </div>
          {sm.message && (
            <p className="text-sm text-gray-700 whitespace-pre-wrap break-words dark:text-gray-300">
              {sm.message}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (envelope.typingMessage) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-2 dark:border-gray-800 dark:bg-gray-900/50">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {source} is {envelope.typingMessage.action === "STARTED" ? "typing..." : "no longer typing"}
        </span>
      </div>
    );
  }

  if (envelope.receiptMessage) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-2 dark:border-gray-800 dark:bg-gray-900/50">
        <Check className="h-3 w-3 text-gray-400" />
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {envelope.receiptMessage.type.toLowerCase()} receipt from {source}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-2">
      <span className="text-xs text-gray-400">
        Event from {source} at {time}
      </span>
    </div>
  );
}
