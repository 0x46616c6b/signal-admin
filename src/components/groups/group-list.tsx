"use client";

import type { Group } from "@/lib/types";
import { Pencil, LogOut, Users } from "lucide-react";

interface GroupListProps {
  groups: Group[];
  isLoading: boolean;
  onEdit: (group: Group) => void;
  onQuit: (groupId: string) => void;
}

export function GroupList({ groups, isLoading, onEdit, onQuit }: GroupListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    );
  }

  if (!groups.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
        No groups found.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {groups.map((group) => (
        <div
          key={group.id}
          className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {group.name || "Unnamed Group"}
              </h3>
              {group.isAdmin && (
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                  Admin
                </span>
              )}
              {group.isBlocked && (
                <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                  Blocked
                </span>
              )}
            </div>
            {group.description && (
              <p className="mt-0.5 text-xs text-gray-500 truncate">
                {group.description}
              </p>
            )}
            <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
              <Users className="h-3 w-3" />
              {group.members?.length ?? 0} members
            </div>
          </div>
          <div className="flex items-center gap-1 ml-4">
            <button
              onClick={() => onEdit(group)}
              className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </button>
            {group.isMember && (
              <button
                onClick={() => onQuit(group.id)}
                className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                title="Leave group"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
