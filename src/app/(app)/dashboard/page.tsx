"use client";

import { AppShell } from "@/components/layout/app-shell";
import { useAccounts } from "@/contexts/account-context";
import { useServerConfig } from "@/contexts/server-config-context";
import { useRpc } from "@/hooks/use-rpc";
import type { Contact, Group, Device } from "@/lib/types";
import {
  Users,
  UsersRound,
  Smartphone,
  CheckCircle,
  XCircle,
} from "lucide-react";

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <div className="rounded-md bg-blue-50 p-2 dark:bg-blue-900/30">
          <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { isConnected } = useServerConfig();
  const { accounts, selectedAccount } = useAccounts();
  const { data: contacts } = useRpc<Contact[]>("listContacts", {
    allRecipients: false,
  });
  const { data: groups } = useRpc<Group[]>("listGroups");
  const { data: devices } = useRpc<Device[]>("listDevices");

  return (
    <AppShell title="Dashboard">
      <div className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Connection</h3>
          <div className="mt-2 flex items-center gap-2">
            {isConnected ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm text-green-700 dark:text-green-400">Connected</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-500" />
                <span className="text-sm text-red-700 dark:text-red-400">Disconnected</span>
              </>
            )}
          </div>
          {selectedAccount && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Account: <span className="font-mono">{selectedAccount}</span>
              {accounts.length > 1 && (
                <span className="ml-1 text-gray-400 dark:text-gray-500">
                  ({accounts.length} accounts)
                </span>
              )}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Contacts"
            value={contacts?.length ?? "-"}
            icon={Users}
          />
          <StatCard
            label="Groups"
            value={groups?.length ?? "-"}
            icon={UsersRound}
          />
          <StatCard
            label="Devices"
            value={devices?.length ?? "-"}
            icon={Smartphone}
          />
        </div>
      </div>
    </AppShell>
  );
}
