"use client";

import type { Account } from "@/lib/types";
import { Trash2, UserCircle, CheckCircle } from "lucide-react";

interface AccountListProps {
  accounts: Account[];
  isLoading: boolean;
  selectedAccount: string | null;
  onSelect: (number: string) => void;
  onDelete: (number: string) => void;
}

export function AccountList({
  accounts,
  isLoading,
  selectedAccount,
  onSelect,
  onDelete,
}: AccountListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-14 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
          />
        ))}
      </div>
    );
  }

  if (!accounts.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
        No accounts found.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {accounts.map((account) => {
        const isSelected = selectedAccount === account.number;
        return (
          <div
            key={account.number}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-gray-100 p-2 dark:bg-gray-800">
                <UserCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {account.number}
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                  {account.uuid && (
                    <span title={account.uuid}>
                      UUID: {account.uuid.slice(0, 8)}&hellip;
                    </span>
                  )}
                  {account.deviceId != null && (
                    <span>Device: {account.deviceId}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {account.registered && (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Registered
                  </span>
                )}
                {isSelected && (
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    Selected
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {!isSelected && (
                <button
                  onClick={() => onSelect(account.number)}
                  className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-500 dark:hover:bg-gray-800"
                  title="Select account"
                >
                  <CheckCircle className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => onDelete(account.number)}
                className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:text-gray-500 dark:hover:bg-gray-800"
                title="Remove account"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
