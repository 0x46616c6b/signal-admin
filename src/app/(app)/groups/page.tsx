"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { useRpc, useRpcAction } from "@/hooks/use-rpc";
import type { Group } from "@/lib/types";
import { GroupList } from "@/components/groups/group-list";
import { GroupForm } from "@/components/groups/group-form";
import { Plus } from "lucide-react";

export default function GroupsPage() {
  const {
    data: groups,
    isLoading,
    execute: refresh,
  } = useRpc<Group[]>("listGroups");
  const { execute: rpcAction } = useRpcAction();
  const [showForm, setShowForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [joinUri, setJoinUri] = useState("");

  const handleCreate = async (data: {
    name: string;
    members: string[];
    description?: string;
  }) => {
    try {
      await rpcAction("createGroup", data);
      toast.success("Group created");
      setShowForm(false);
      refresh();
    } catch (err) {
      toast.error(
        `Failed to create group: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  const handleUpdate = async (
    groupId: string,
    data: {
      name?: string;
      description?: string;
      members?: string[];
      removeMembers?: string[];
      admins?: string[];
      removeAdmins?: string[];
    },
  ) => {
    try {
      await rpcAction("updateGroup", { groupId, ...data });
      toast.success("Group updated");
      setEditingGroup(null);
      setShowForm(false);
      refresh();
    } catch (err) {
      toast.error(
        `Failed to update group: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  const handleQuit = async (groupId: string) => {
    try {
      await rpcAction("quitGroup", { groupId });
      toast.success("Left group");
      refresh();
    } catch (err) {
      toast.error(
        `Failed to leave group: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  const handleJoin = async () => {
    if (!joinUri.trim()) return;
    try {
      await rpcAction("joinGroup", { inviteURI: joinUri.trim() });
      toast.success("Joined group");
      setJoinUri("");
      refresh();
    } catch (err) {
      toast.error(
        `Failed to join group: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  return (
    <AppShell title="Groups">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {groups?.length ?? 0} groups
          </p>
          <div className="flex gap-2">
            <div className="flex gap-1">
              <input
                type="text"
                value={joinUri}
                onChange={(e) => setJoinUri(e.target.value)}
                placeholder="Invite link..."
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              />
              <button
                onClick={handleJoin}
                disabled={!joinUri.trim()}
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Join
              </button>
            </div>
            <button
              onClick={() => {
                setEditingGroup(null);
                setShowForm(true);
              }}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Create Group
            </button>
          </div>
        </div>

        {showForm && (
          <GroupForm
            group={editingGroup}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            onCancel={() => {
              setShowForm(false);
              setEditingGroup(null);
            }}
          />
        )}

        <GroupList
          groups={groups ?? []}
          isLoading={isLoading}
          onEdit={(g) => {
            setEditingGroup(g);
            setShowForm(true);
          }}
          onQuit={handleQuit}
        />
      </div>
    </AppShell>
  );
}
