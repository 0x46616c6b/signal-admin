"use client";

import { type ReactNode } from "react";
import { Toaster } from "sonner";
import { ThemeProvider, useTheme } from "@/contexts/theme-context";
import { ServerConfigProvider } from "@/contexts/server-config-context";
import { AccountProvider } from "@/contexts/account-context";

function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  return <Toaster position="top-right" richColors theme={resolvedTheme} />;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ServerConfigProvider>
        <AccountProvider>
          {children}
          <ThemedToaster />
        </AccountProvider>
      </ServerConfigProvider>
    </ThemeProvider>
  );
}
