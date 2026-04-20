"use client";

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useServerConfig } from "@/contexts/server-config-context";
import { useAccounts } from "@/contexts/account-context";
import { SetupScreen } from "./setup-screen";

export function SetupGuard({ children }: { children: ReactNode }) {
  const { isConnected } = useServerConfig();
  const { accounts, hasLoaded } = useAccounts();

  if (!isConnected) {
    return <>{children}</>;
  }

  if (!hasLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (accounts.length === 0) {
    return <SetupScreen />;
  }

  return <>{children}</>;
}
