"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useServerConfig } from "./server-config-context";
import type { Account } from "@/lib/types";

interface AccountContextValue {
  accounts: Account[];
  selectedAccount: string | null;
  setSelectedAccount: (number: string) => void;
  refreshAccounts: () => Promise<void>;
  isLoading: boolean;
  hasLoaded: boolean;
}

const AccountContext = createContext<AccountContextValue | null>(null);

const SELECTED_ACCOUNT_KEY = "signal-admin-selected-account";

export function AccountProvider({ children }: { children: ReactNode }) {
  const { rpcClient, isConnected } = useServerConfig();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccountState] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const refreshAccounts = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await rpcClient.call<Account[]>("listAccounts");
      setAccounts(result ?? []);
      const stored = localStorage.getItem(SELECTED_ACCOUNT_KEY);
      if (result?.length) {
        if (stored && result.some((a) => a.number === stored)) {
          setSelectedAccountState(stored);
        } else {
          setSelectedAccountState(result[0].number);
        }
      }
    } catch {
      setAccounts([]);
    } finally {
      setIsLoading(false);
      setHasLoaded(true);
    }
  }, [rpcClient]);

  useEffect(() => {
    if (isConnected) {
      refreshAccounts();
    }
  }, [isConnected, refreshAccounts]);

  const setSelectedAccount = useCallback((number: string) => {
    localStorage.setItem(SELECTED_ACCOUNT_KEY, number);
    setSelectedAccountState(number);
  }, []);

  return (
    <AccountContext.Provider
      value={{
        accounts,
        selectedAccount,
        setSelectedAccount,
        refreshAccounts,
        isLoading,
        hasLoaded,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccounts() {
  const ctx = useContext(AccountContext);
  if (!ctx)
    throw new Error("useAccounts must be used within AccountProvider");
  return ctx;
}
