"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ConnectionStatus } from "@/components/connection-status";
import { LinkDeviceFlow } from "./link-device-flow";
import { RegisterFlow } from "./register-flow";

type Tab = "link" | "register";

export function SetupScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("link");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-950">
      <div className="w-full max-w-lg">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Signal Admin
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Set up your first account to get started.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setActiveTab("link")}
              className={cn(
                "flex-1 px-4 py-2.5 text-sm font-medium transition-colors",
                activeTab === "link"
                  ? "border-b-2 border-blue-600 text-blue-700 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
              )}
            >
              Link as Secondary Device
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("register")}
              className={cn(
                "flex-1 px-4 py-2.5 text-sm font-medium transition-colors",
                activeTab === "register"
                  ? "border-b-2 border-blue-600 text-blue-700 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
              )}
            >
              Register via Phone Number
            </button>
          </div>

          <div className="p-6">
            {activeTab === "link" ? <LinkDeviceFlow /> : <RegisterFlow />}
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <ConnectionStatus />
        </div>
      </div>
    </div>
  );
}
