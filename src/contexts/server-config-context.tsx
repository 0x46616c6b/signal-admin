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
  serverUrl: string | null;
  setServerUrl: (url: string) => void;
  clearServerUrl: () => void;
  isConnected: boolean;
  isChecking: boolean;
  checkConnection: () => Promise<boolean>;
  rpcClient: RpcClient | null;
}

const ServerConfigContext = createContext<ServerConfigContextValue | null>(null);

const STORAGE_KEY = "signal-admin-server-url";

export function ServerConfigProvider({ children }: { children: ReactNode }) {
  const [serverUrl, setServerUrlState] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const rpcClientRef = useRef<RpcClient | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setServerUrlState(stored);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (serverUrl) {
      rpcClientRef.current = new RpcClient(serverUrl);
    } else {
      rpcClientRef.current = null;
      setIsConnected(false);
    }
  }, [serverUrl]);

  const checkConnection = useCallback(async () => {
    if (!rpcClientRef.current) return false;
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
    if (!serverUrl) return;
    checkConnection();
    intervalRef.current = setInterval(checkConnection, 30_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [serverUrl, checkConnection]);

  const setServerUrl = useCallback((url: string) => {
    const normalized = url.replace(/\/+$/, "");
    localStorage.setItem(STORAGE_KEY, normalized);
    setServerUrlState(normalized);
  }, []);

  const clearServerUrl = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setServerUrlState(null);
    setIsConnected(false);
  }, []);

  if (!hydrated) return null;

  return (
    <ServerConfigContext.Provider
      value={{
        serverUrl,
        setServerUrl,
        clearServerUrl,
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
