"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SSEClient } from "@/lib/sse-client";
import { useServerConfig } from "@/contexts/server-config-context";
import { useAccounts } from "@/contexts/account-context";
import type { SignalEnvelope } from "@/lib/types";

const MAX_EVENTS = 500;

export function useSSE() {
  const { serverUrl } = useServerConfig();
  const { selectedAccount } = useAccounts();
  const [events, setEvents] = useState<SignalEnvelope[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<SSEClient | null>(null);

  useEffect(() => {
    if (!serverUrl || !selectedAccount) return;

    const client = new SSEClient();
    clientRef.current = client;

    const unsub = client.subscribe((envelope) => {
      setEvents((prev) => {
        const next = [envelope, ...prev];
        return next.length > MAX_EVENTS ? next.slice(0, MAX_EVENTS) : next;
      });
    });

    client.connect(serverUrl, selectedAccount);

    const checkInterval = setInterval(() => {
      setIsConnected(client.isConnected);
    }, 1000);

    return () => {
      unsub();
      clearInterval(checkInterval);
      client.disconnect();
      clientRef.current = null;
    };
  }, [serverUrl, selectedAccount]);

  const clear = useCallback(() => {
    setEvents([]);
  }, []);

  return { events, isConnected, clear };
}
