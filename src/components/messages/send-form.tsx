"use client";

import { useState } from "react";
import { X, Send } from "lucide-react";

interface SendFormProps {
  onSend: (data: {
    recipients: string[];
    groupIds: string[];
    message: string;
  }) => void;
  onCancel: () => void;
}

export function SendForm({ onSend, onCancel }: SendFormProps) {
  const [recipientType, setRecipientType] = useState<"individual" | "group">(
    "individual",
  );
  const [recipients, setRecipients] = useState("");
  const [groupId, setGroupId] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (recipientType === "individual") {
      const recipientList = recipients
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean);
      if (!recipientList.length) return;
      onSend({ recipients: recipientList, groupIds: [], message: message.trim() });
    } else {
      if (!groupId.trim()) return;
      onSend({ recipients: [], groupIds: [groupId.trim()], message: message.trim() });
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Send Message</h3>
        <button
          onClick={onCancel}
          className="rounded p-1 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setRecipientType("individual")}
            className={`rounded-md px-3 py-1 text-xs font-medium ${
              recipientType === "individual"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Individual
          </button>
          <button
            type="button"
            onClick={() => setRecipientType("group")}
            className={`rounded-md px-3 py-1 text-xs font-medium ${
              recipientType === "group"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Group
          </button>
        </div>

        {recipientType === "individual" ? (
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Recipients (comma-separated)
            </label>
            <input
              type="text"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="+49123456789, +49987654321"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        ) : (
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Group ID
            </label>
            <input
              type="text"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              placeholder="Group ID (base64)"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-700">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Type your message..."
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!message.trim()}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Send className="h-3 w-3" />
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
