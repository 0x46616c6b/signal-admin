"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { useAccounts } from "@/contexts/account-context";
import { useServerConfig } from "@/contexts/server-config-context";
import { AccountList } from "@/components/accounts/account-list";
import { AddAccountForm } from "@/components/accounts/add-account-form";
import { ConfirmModal } from "@/components/ui/confirm-modal";

export default function AccountsPage() {
  const {
    accounts,
    selectedAccount,
    setSelectedAccount,
    refreshAccounts,
    isLoading,
  } = useAccounts();
  const { rpcClient } = useServerConfig();
  const [showForm, setShowForm] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleDelete = async () => {
    if (!accountToDelete) return;

    setIsRemoving(true);
    try {
      await rpcClient.call("deleteLocalAccountData", {
        account: accountToDelete,
        ignoreRegistered: true,
      });
      setAccountToDelete(null);
      toast.success("Account removed");
      await refreshAccounts();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to remove account",
      );
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <AppShell title="Accounts">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {accounts.length} {accounts.length === 1 ? "account" : "accounts"}
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Account
          </button>
        </div>

        {showForm && <AddAccountForm onCancel={() => setShowForm(false)} />}

        <AccountList
          accounts={accounts}
          isLoading={isLoading}
          selectedAccount={selectedAccount}
          onSelect={setSelectedAccount}
          onDelete={setAccountToDelete}
        />
      </div>

      <ConfirmModal
        open={accountToDelete !== null}
        onClose={() => setAccountToDelete(null)}
        onConfirm={handleDelete}
        title="Remove Account"
        description={`This will delete all local data for ${accountToDelete}. The account itself remains active on Signal — only the local connection from this signal-cli instance is removed. You will need to link or register again to use this account.`}
        confirmLabel="Remove Account"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={isRemoving}
      />
    </AppShell>
  );
}
