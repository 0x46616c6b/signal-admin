"use client";

import { Menu } from "lucide-react";
import { useAccounts } from "@/contexts/account-context";

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const { accounts, selectedAccount, setSelectedAccount } = useAccounts();

  return (
    <header className="flex h-14 items-center gap-4 border-b border-gray-200 bg-white px-4">
      <button
        onClick={onMenuClick}
        className="rounded p-1 text-gray-400 hover:text-gray-600 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <div className="ml-auto">
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
      </div>
    </header>
  );
}
