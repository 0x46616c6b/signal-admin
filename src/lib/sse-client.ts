import type { SignalEnvelope } from "./types";

export type SSEListener = (envelope: SignalEnvelope) => void;

export class SSEClient {
  private eventSource: EventSource | null = null;
  private listeners = new Set<SSEListener>();
  private _isConnected = false;

  get isConnected() {
    return this._isConnected;
  }

  connect(account?: string) {
    this.disconnect();

    const params = new URLSearchParams();
    if (account) params.set("account", account);

    const qs = params.toString();
    this.eventSource = new EventSource(`/api/events${qs ? `?${qs}` : ""}`);

    this.eventSource.onopen = () => {
      this._isConnected = true;
    };

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const envelope: SignalEnvelope = data.params?.envelope ?? data.params ?? data;
        this.listeners.forEach((fn) => fn(envelope));
      } catch {
        // skip malformed events
      }
    };

    this.eventSource.onerror = () => {
      this._isConnected = false;
    };
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this._isConnected = false;
    }
  }

  subscribe(listener: SSEListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}
