"use client";

import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { useRpc, useRpcAction } from "@/hooks/use-rpc";
import type { Identity } from "@/lib/types";
import { Shield, ShieldCheck, ShieldAlert } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";

export default function IdentitiesPage() {
  const { data: identities, isLoading, execute: refresh } = useRpc<Identity[]>(
    "listIdentities",
  );
  const { execute: rpcAction } = useRpcAction();

  const handleTrust = async (recipient: string) => {
    try {
      await rpcAction("trust", {
        recipient,
        trustAllKnownKeys: true,
      });
      toast.success("Identity trusted");
      refresh();
    } catch (err) {
      toast.error(
        `Failed to trust: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  if (isLoading) {
    return (
      <AppShell title="Identities">
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
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
    <AppShell title="Identities">
      <div className="space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {identities?.length ?? 0} identities
        </p>

        {!identities?.length ? (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
            No identities found.
          </div>
        ) : (
          <div className="space-y-2">
            {identities.map((identity) => {
              const id = identity.number ?? identity.uuid ?? "";
              const isTrusted = identity.trustLevel === "TRUSTED_VERIFIED";
              const isUntrusted = identity.trustLevel === "UNTRUSTED";

              return (
                <div
                  key={id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-md bg-gray-100 p-2 dark:bg-gray-800">
                      {isTrusted ? (
                        <ShieldCheck className="h-5 w-5 text-green-600" />
                      ) : isUntrusted ? (
                        <ShieldAlert className="h-5 w-5 text-red-500" />
                      ) : (
                        <Shield className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {identity.number ?? identity.uuid ?? "Unknown"}
                      </p>
                      <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          Trust:{" "}
                          <span
                            className={
                              isTrusted
                                ? "text-green-600 dark:text-green-400"
                                : isUntrusted
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-gray-500 dark:text-gray-400"
                            }
                          >
                            {identity.trustLevel ?? "Unknown"}
                          </span>
                        </span>
                        {identity.addedTimestamp && (
                          <span>
                            Added: {formatTimestamp(identity.addedTimestamp)}
                          </span>
                        )}
                      </div>
                      {identity.safetyNumber && (
                        <p className="mt-1 font-mono text-xs text-gray-400 break-all dark:text-gray-500">
                          {identity.safetyNumber}
                        </p>
                      )}
                    </div>
                  </div>
                  {!isTrusted && (
                    <button
                      onClick={() =>
                        handleTrust(id)
                      }
                      className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      Trust
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
