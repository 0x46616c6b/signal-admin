"use client";

import type { Device } from "@/lib/types";
import { Trash2, Smartphone } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";

interface DeviceListProps {
  devices: Device[];
  isLoading: boolean;
  onRemove: (deviceId: number) => void;
}

export function DeviceList({ devices, isLoading, onRemove }: DeviceListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    );
  }

  if (!devices.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
        No devices found.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {devices.map((device) => (
        <div
          key={device.id}
          className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-gray-100 p-2">
              <Smartphone className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {device.name ?? `Device ${device.id}`}
              </p>
              <div className="flex gap-3 text-xs text-gray-500">
                <span>ID: {device.id}</span>
                {device.createdTimestamp && (
                  <span>
                    Created: {formatTimestamp(device.createdTimestamp)}
                  </span>
                )}
                {device.lastSeenTimestamp && (
                  <span>
                    Last seen: {formatTimestamp(device.lastSeenTimestamp)}
                  </span>
                )}
              </div>
            </div>
          </div>
          {device.id !== 1 && (
            <button
              onClick={() => onRemove(device.id)}
              className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600"
              title="Remove device"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
