"use client";

import { AppShell } from "@/components/layout/app-shell";
import { useRpc } from "@/hooks/use-rpc";
import type { StickerPack } from "@/lib/types";
import { Smile } from "lucide-react";

export default function StickersPage() {
  const { data: packs, isLoading } = useRpc<StickerPack[]>("listStickerPacks");

  if (isLoading) {
    return (
      <AppShell title="Stickers">
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
            />
          ))}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Stickers">
      <div className="space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {packs?.length ?? 0} sticker packs
        </p>

        {!packs?.length ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
            No sticker packs installed.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {packs.map((pack) => (
              <div
                key={pack.packId}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-yellow-50 p-2 dark:bg-yellow-900/30">
                    <Smile className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {pack.title ?? "Unnamed Pack"}
                    </p>
                    {pack.author && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">by {pack.author}</p>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  {pack.installed ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Installed
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                      Not installed
                    </span>
                  )}
                  {pack.stickers && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {pack.stickers.length} stickers
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
