import type { JsonRpcResponse } from "./types";

export class RpcTransportError extends Error {
  constructor(
    public status: number,
    public statusText: string,
  ) {
    super(`Transport error: ${status} ${statusText}`);
    this.name = "RpcTransportError";
  }
}

export class RpcError extends Error {
  constructor(
    public code: number,
    public rpcMessage: string,
    public data?: unknown,
  ) {
    super(`RPC error ${code}: ${rpcMessage}`);
    this.name = "RpcError";
  }
}

export class RpcClient {
  async call<T>(
    method: string,
    params?: Record<string, unknown>,
  ): Promise<T> {
    const id = crypto.randomUUID();
    const response = await fetch("/api/rpc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", method, params, id }),
    });

    if (!response.ok) {
      throw new RpcTransportError(response.status, response.statusText);
    }

    const data: JsonRpcResponse<T> = await response.json();

    if (data.error) {
      throw new RpcError(data.error.code, data.error.message, data.error.data);
    }

    return data.result as T;
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch("/api/rpc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "listAccounts",
          id: crypto.randomUUID(),
        }),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
