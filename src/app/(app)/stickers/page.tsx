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
              className="h-16 animate-pulse rounded-lg bg-gray-200"
            />
          ))}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Stickers">
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          {packs?.length ?? 0} sticker packs
        </p>

        {!packs?.length ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            No sticker packs installed.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {packs.map((pack) => (
              <div
                key={pack.packId}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-yellow-50 p-2">
                    <Smile className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {pack.title ?? "Unnamed Pack"}
                    </p>
                    {pack.author && (
                      <p className="text-xs text-gray-500">by {pack.author}</p>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  {pack.installed ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Installed
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      Not installed
                    </span>
                  )}
                  {pack.stickers && (
                    <span className="text-xs text-gray-400">
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
