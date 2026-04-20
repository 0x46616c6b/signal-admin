"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LinkDeviceFlow } from "@/components/setup/link-device-flow";
import { RegisterFlow } from "@/components/setup/register-flow";

type Tab = "link" | "register";

interface AddAccountFormProps {
  onCancel: () => void;
}

export function AddAccountForm({ onCancel }: AddAccountFormProps) {
  const [activeTab, setActiveTab] = useState<Tab>("link");

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Add Account
        </h3>
        <button
          onClick={onCancel}
          className="rounded p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

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

      <div className="pt-4">
        {activeTab === "link" ? <LinkDeviceFlow /> : <RegisterFlow />}
      </div>
    </div>
  );
}
