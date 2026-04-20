"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
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
  const rpcClientRef = useRef(new RpcClient());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const checkConnection = useCallback(async () => {
    setIsChecking(true);
    try {
      const ok = await rpcClientRef.current.healthCheck();
      setIsConnected(ok);
      return ok;
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    checkConnection();
    intervalRef.current = setInterval(checkConnection, 30_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [checkConnection]);

  return (
    <ServerConfigContext.Provider
      value={{
        isConnected,
        isChecking,
        checkConnection,
        rpcClient: rpcClientRef.current,
      }}
    >
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
