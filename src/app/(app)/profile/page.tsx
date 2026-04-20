"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { useRpcAction } from "@/hooks/use-rpc";
import { useAccounts } from "@/contexts/account-context";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { selectedAccount } = useAccounts();
  const { execute: rpcAction, isLoading } = useRpcAction();

  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [about, setAbout] = useState("");
  const [aboutEmoji, setAboutEmoji] = useState("");

  useEffect(() => {
    setGivenName("");
    setFamilyName("");
    setAbout("");
    setAboutEmoji("");
  }, [selectedAccount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await rpcAction("updateProfile", {
        ...(givenName.trim() ? { givenName: givenName.trim() } : {}),
        ...(familyName.trim() ? { familyName: familyName.trim() } : {}),
        ...(about.trim() ? { about: about.trim() } : {}),
        ...(aboutEmoji.trim() ? { aboutEmoji: aboutEmoji.trim() } : {}),
      });
      toast.success("Profile updated");
    } catch (err) {
      toast.error(
        `Failed to update profile: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  return (
    <AppShell title="Profile">
      <div className="max-w-lg">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Update Profile
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  value={givenName}
                  onChange={(e) => setGivenName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">
                About
              </label>
              <input
                type="text"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Status message"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">
                About Emoji
              </label>
              <input
                type="text"
                value={aboutEmoji}
                onChange={(e) => setAboutEmoji(e.target.value)}
                placeholder="e.g. 👋"
                className="mt-1 block w-32 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
