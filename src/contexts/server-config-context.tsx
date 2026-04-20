"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { RpcClient } from "@/lib/rpc-client";

interface ServerConfigContextValue {
  isConnected: boolean;
  isChecking: boolean;
  checkConnection: () => Promise<boolean>;
  rpcClient: RpcClient;
}

const ServerConfigContext = createContext<ServerConfigContextValue | null>(null);

export function ServerConfigProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const rpcClient = useMemo(() => new RpcClient(), []);

  const checkConnection = useCallback(async () => {
    setIsChecking(true);
    try {
      const ok = await rpcClient.healthCheck();
      setIsConnected(ok);
      return ok;
    } finally {
      setIsChecking(false);
    }
  }, [rpcClient]);

  useEffect(() => {
    let active = true;

    const check = async () => {
      if (active) setIsChecking(true);
      try {
        const ok = await rpcClient.healthCheck();
        if (active) setIsConnected(ok);
      } finally {
        if (active) setIsChecking(false);
      }
    };

    check();
    const id = setInterval(check, 30_000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [rpcClient]);

  const value = useMemo(
    () => ({ isConnected, isChecking, checkConnection, rpcClient }),
    [isConnected, isChecking, checkConnection, rpcClient],
  );

  return (
    <ServerConfigContext.Provider value={value}>
      {children}
    </ServerConfigContext.Provider>
  );
}

export function useServerConfig() {
  const ctx = useContext(ServerConfigContext);
  if (!ctx)
    throw new Error("useServerConfig must be used within ServerConfigProvider");
  return ctx;
}
