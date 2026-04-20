"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useServerConfig } from "@/contexts/server-config-context";
import { CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { serverUrl, setServerUrl, clearServerUrl, isConnected, checkConnection } =
    useServerConfig();
  const [url, setUrl] = useState(serverUrl ?? "");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);
  const router = useRouter();

  const handleTest = async () => {
    if (!url.trim()) return;
    setTesting(true);
    setTestResult(null);
    setServerUrl(url.trim());
    await new Promise((r) => setTimeout(r, 100));
    const ok = await checkConnection();
    setTestResult(ok);
    setTesting(false);
  };

  const handleSave = async () => {
    if (!url.trim()) return;
    setServerUrl(url.trim());
    await checkConnection();
    router.push("/dashboard");
  };

  const handleDisconnect = () => {
    clearServerUrl();
    setUrl("");
    setTestResult(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6">
        {serverUrl && (
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        )}

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">
            Signal CLI Server
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Enter the URL of your signal-cli daemon HTTP endpoint.
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="server-url"
                className="block text-sm font-medium text-gray-700"
              >
                Server URL
              </label>
              <input
                id="server-url"
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setTestResult(null);
                }}
                placeholder="http://user:pass@localhost:8080"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                onKeyDown={(e) => e.key === "Enter" && handleTest()}
              />
              <p className="mt-1 text-xs text-gray-500">
                Base URL without path. Basic Auth supported:{" "}
                <code className="rounded bg-gray-100 px-1">http://user:pass@host:port</code>
              </p>
            </div>

            {testResult !== null && (
              <div
                className={`flex items-center gap-2 rounded-md p-3 text-sm ${
                  testResult
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {testResult ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Connection successful
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    Connection failed. Check the URL and make sure signal-cli is
                    running.
                  </>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleTest}
                disabled={!url.trim() || testing}
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
              >
                {testing && <Loader2 className="h-4 w-4 animate-spin" />}
                Test Connection
              </button>
              <button
                onClick={handleSave}
                disabled={!url.trim()}
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
              >
                Save & Connect
              </button>
            </div>

            {serverUrl && (
              <button
                onClick={handleDisconnect}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Disconnect & Clear URL
              </button>
            )}
          </div>
        </div>

        {isConnected && (
          <p className="text-center text-sm text-green-600">
            Currently connected to {serverUrl}
          </p>
        )}
      </div>
    </div>
  );
}
