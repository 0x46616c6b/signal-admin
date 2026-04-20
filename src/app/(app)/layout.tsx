"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useServerConfig } from "@/contexts/server-config-context";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { serverUrl } = useServerConfig();
  const router = useRouter();

  useEffect(() => {
    if (!serverUrl) {
      router.replace("/settings");
    }
  }, [serverUrl, router]);

  if (!serverUrl) return null;

  return <>{children}</>;
}
