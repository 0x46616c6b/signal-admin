"use client";

import { useState } from "react";
import type { Group } from "@/lib/types";
import { X } from "lucide-react";

interface GroupFormProps {
  group: Group | null;
  onCreate: (data: {
    name: string;
    members: string[];
    description?: string;
  }) => void;
  onUpdate: (
    groupId: string,
    data: {
      name?: string;
      description?: string;
      members?: string[];
      removeMembers?: string[];
    },
  ) => void;
  onCancel: () => void;
}

export function GroupForm({ group, onCreate, onUpdate, onCancel }: GroupFormProps) {
  const [name, setName] = useState(group?.name ?? "");
  const [description, setDescription] = useState(group?.description ?? "");
  const [membersInput, setMembersInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (group) {
      const updates: Record<string, unknown> = {};
      if (name.trim() && name !== group.name) updates.name = name.trim();
      if (description !== (group.description ?? ""))
        updates.description = description.trim();
      if (membersInput.trim()) {
        updates.members = membersInput
          .split(",")
          .map((m) => m.trim())
          .filter(Boolean);
      }
      onUpdate(group.id, updates);
    } else {
      if (!name.trim()) return;
      const members = membersInput
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean);
      onCreate({
        name: name.trim(),
        members,
        ...(description.trim() ? { description: description.trim() } : {}),
      });
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">
          {group ? "Edit Group" : "Create Group"}
        </h3>
        <button
          onClick={onCancel}
          className="rounded p-1 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700">
            Group Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Group"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Group description (optional)"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700">
            {group ? "Add Members" : "Members"} (comma-separated phone numbers)
          </label>
          <input
            type="text"
            value={membersInput}
            onChange={(e) => setMembersInput(e.target.value)}
            placeholder="+49123456789, +49987654321"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {group && group.members?.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-700 mb-1">
              Current Members ({group.members.length})
            </p>
            <div className="flex flex-wrap gap-1">
              {group.members.map((m) => (
                <span
                  key={m.uuid}
                  className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                >
                  {m.number ?? m.uuid}
                </span>
              ))}
            </div>
          </div>
        )}
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
            disabled={!name.trim()}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {group ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
