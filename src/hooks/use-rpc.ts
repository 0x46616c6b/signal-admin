"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerConfig } from "@/contexts/server-config-context";
import { useAccounts } from "@/contexts/account-context";

export function useRpc<T>(
  method: string,
  params?: Record<string, unknown>,
  { autoFetch = true }: { autoFetch?: boolean } = {},
) {
  const { rpcClient } = useServerConfig();
  const { selectedAccount } = useAccounts();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const serializedParams = useMemo(
    () => JSON.stringify(params),
    [params],
  );

  const execute = useCallback(
    async (overrideParams?: Record<string, unknown>) => {
      setIsLoading(true);
      setError(null);
      try {
        const mergedParams: Record<string, unknown> = {
          ...(selectedAccount ? { account: selectedAccount } : {}),
          ...params,
          ...overrideParams,
        };
        const result = await rpcClient.call<T>(method, mergedParams);
        setData(result);
        return result;
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rpcClient, selectedAccount, method, serializedParams],
  );

  useEffect(() => {
    if (!autoFetch || !selectedAccount) return;
    let active = true;

    const fetch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const mergedParams: Record<string, unknown> = {
          ...(selectedAccount ? { account: selectedAccount } : {}),
          ...params,
        };
        const result = await rpcClient.call<T>(method, mergedParams);
        if (active) setData(result);
      } catch (err) {
        if (active) {
          const e = err instanceof Error ? err : new Error(String(err));
          setError(e);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetch();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch, selectedAccount, rpcClient, method, serializedParams]);

  return { data, error, isLoading, execute, setData };
}

export function useRpcAction<T>() {
  const { rpcClient } = useServerConfig();
  const { selectedAccount } = useAccounts();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (method: string, params?: Record<string, unknown>) => {
      setIsLoading(true);
      setError(null);
      try {
        const mergedParams: Record<string, unknown> = {
          ...(selectedAccount ? { account: selectedAccount } : {}),
          ...params,
        };
        const result = await rpcClient.call<T>(method, mergedParams);
        return result;
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [rpcClient, selectedAccount],
  );

  return { execute, isLoading, error };
}
