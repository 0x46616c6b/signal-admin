"use client";

import { useServerConfig } from "@/contexts/server-config-context";
import { cn } from "@/lib/utils";

export function ConnectionStatus() {
  const { isConnected, isChecking } = useServerConfig();

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-500">
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          isChecking
            ? "animate-pulse bg-yellow-400"
            : isConnected
              ? "bg-green-500"
              : "bg-red-500",
        )}
      />
      {isChecking ? "Checking..." : isConnected ? "Connected" : "Disconnected"}
    </div>
  );
}
