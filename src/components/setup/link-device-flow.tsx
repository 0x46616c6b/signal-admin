"use client";

import { useState } from "react";
import { Loader2, CheckCircle, Link, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { useServerConfig } from "@/contexts/server-config-context";
import { useAccounts } from "@/contexts/account-context";
import type { StartLinkResult } from "@/lib/types";
import { QrCodeDisplay } from "./qr-code-display";

type Step = "start" | "scanning" | "finishing" | "done";

export function LinkDeviceFlow() {
  const { rpcClient } = useServerConfig();
  const { refreshAccounts } = useAccounts();
  const [step, setStep] = useState<Step>("start");
  const [deviceLinkUri, setDeviceLinkUri] = useState<string | null>(null);
  const [deviceName, setDeviceName] = useState("signal-admin");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartLink = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const result =
        await rpcClient.call<StartLinkResult>("startLink");
      setDeviceLinkUri(result.deviceLinkUri);
      setStep("scanning");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to start linking";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinishLink = async () => {
    setError(null);
    setIsLoading(true);
    setStep("finishing");
    try {
      await rpcClient.call("finishLink", {
        deviceLinkUri,
        deviceName: deviceName.trim() || "signal-admin",
      });
      setStep("done");
      toast.success("Device linked successfully!");
      await refreshAccounts();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to complete linking";
      setError(message);
      toast.error(message);
      setStep("scanning");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setStep("start");
    setDeviceLinkUri(null);
    setError(null);
  };

  if (step === "done") {
    return (
      <div className="flex flex-col items-center gap-3 py-6">
        <CheckCircle className="h-12 w-12 text-green-500" />
        <p className="text-sm font-medium text-gray-900">
          Device linked successfully!
        </p>
        <p className="text-xs text-gray-500">Loading your account...</p>
      </div>
    );
  }

  if (step === "scanning" || step === "finishing") {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-700">
            Scan this QR code with your Signal app:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-xs text-gray-500">
            <li>Open Signal on your phone</li>
            <li>
              Go to <strong>Settings</strong> &rarr;{" "}
              <strong>Linked Devices</strong>
            </li>
            <li>
              Tap <strong>&ldquo;+&rdquo;</strong> or{" "}
              <strong>&ldquo;Link New Device&rdquo;</strong>
            </li>
            <li>Scan the QR code below</li>
          </ol>
        </div>

        {deviceLinkUri && <QrCodeDisplay uri={deviceLinkUri} />}

        <div>
          <label className="block text-xs font-medium text-gray-700">
            Device Name
          </label>
          <input
            type="text"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            placeholder="signal-admin"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={handleRetry}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Start Over
          </button>
          <button
            type="button"
            onClick={handleFinishLink}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Smartphone className="h-4 w-4" />
            )}
            Complete Linking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-700">
        Link signal-cli as a secondary device to your existing Signal account.
        Your phone will remain the primary device.
      </p>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleStartLink}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Link className="h-4 w-4" />
          )}
          Start Linking
        </button>
      </div>
    </div>
  );
}
