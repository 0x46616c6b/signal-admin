import type { ReactNode } from "react";
import { SetupGuard } from "@/components/setup/setup-guard";

export default function AppLayout({ children }: { children: ReactNode }) {
  return <SetupGuard>{children}</SetupGuard>;
}
