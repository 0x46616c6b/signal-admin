"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { useRpc, useRpcAction } from "@/hooks/use-rpc";
import type { Device } from "@/lib/types";
import { DeviceList } from "@/components/devices/device-list";
import { AddDeviceForm } from "@/components/devices/add-device-form";
import { Plus } from "lucide-react";

export default function DevicesPage() {
  const {
    data: devices,
    isLoading,
    execute: refresh,
  } = useRpc<Device[]>("listDevices");
  const { execute: rpcAction } = useRpcAction();
  const [showForm, setShowForm] = useState(false);

  const handleAdd = async (uri: string) => {
    try {
      await rpcAction("addDevice", { uri });
      toast.success("Device linked");
      setShowForm(false);
      refresh();
    } catch (err) {
      toast.error(
        `Failed to link device: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  const handleRemove = async (deviceId: number) => {
    try {
      await rpcAction("removeDevice", { deviceId });
      toast.success("Device removed");
      refresh();
    } catch (err) {
      toast.error(
        `Failed to remove device: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  };

  return (
    <AppShell title="Devices">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {devices?.length ?? 0} devices
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Link Device
          </button>
        </div>

        {showForm && (
          <AddDeviceForm
            onAdd={handleAdd}
            onCancel={() => setShowForm(false)}
          />
        )}

        <DeviceList
          devices={devices ?? []}
          isLoading={isLoading}
          onRemove={handleRemove}
        />
      </div>
    </AppShell>
  );
}
