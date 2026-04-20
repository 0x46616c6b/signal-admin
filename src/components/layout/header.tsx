"use client";

import { Menu, UserCircle } from "lucide-react";
import { useAccounts } from "@/contexts/account-context";
import { ThemeToggle } from "@/components/theme-toggle";

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const { accounts, selectedAccount, setSelectedAccount } = useAccounts();

  return (
    <header className="flex h-14 items-center gap-4 border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-900">
      <button
        onClick={onMenuClick}
        className="rounded p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        {selectedAccount && (
          <div className="flex items-center gap-1.5">
            <UserCircle className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            {accounts.length > 1 ? (
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >
                {accounts.map((a) => (
                  <option key={a.number} value={a.number}>
                    {a.number}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {selectedAccount}
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
