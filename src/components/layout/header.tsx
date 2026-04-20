"use client";

import { useState } from "react";
import { Menu, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAccounts } from "@/contexts/account-context";
import { useServerConfig } from "@/contexts/server-config-context";
import { ConfirmModal } from "@/components/ui/confirm-modal";

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const { accounts, selectedAccount, setSelectedAccount, refreshAccounts } =
    useAccounts();
  const { rpcClient } = useServerConfig();
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemoveAccount = async () => {
    if (!selectedAccount) return;

    setIsRemoving(true);
    try {
      await rpcClient.call("deleteLocalAccountData", {
        account: selectedAccount,
        ignoreRegistered: true,
      });
      setShowRemoveModal(false);
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
    <>
      <header className="flex h-14 items-center gap-4 border-b border-gray-200 bg-white px-4">
        <button
          onClick={onMenuClick}
          className="rounded p-1 text-gray-400 hover:text-gray-600 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <div className="ml-auto flex items-center gap-2">
          {accounts.length > 1 && (
            <select
              value={selectedAccount ?? ""}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {accounts.map((a) => (
                <option key={a.number} value={a.number}>
                  {a.number}
                </option>
              ))}
            </select>
          )}
          {accounts.length === 1 && (
            <span className="text-sm text-gray-500">{accounts[0].number}</span>
          )}
          {selectedAccount && (
            <button
              onClick={() => setShowRemoveModal(true)}
              className="rounded p-1 text-gray-400 hover:text-red-600"
              title="Remove account"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>

      <ConfirmModal
        open={showRemoveModal}
        onClose={() => setShowRemoveModal(false)}
        onConfirm={handleRemoveAccount}
        title="Remove Account"
        description={`This will delete all local data for ${selectedAccount}. The account itself remains active on Signal — only the local connection from this signal-cli instance is removed. You will need to link or register again to use this account.`}
        confirmLabel="Remove Account"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={isRemoving}
      />
    </>
  );
}
