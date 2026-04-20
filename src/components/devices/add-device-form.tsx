"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface AddDeviceFormProps {
  onAdd: (uri: string) => void;
  onCancel: () => void;
}

export function AddDeviceForm({ onAdd, onCancel }: AddDeviceFormProps) {
  const [uri, setUri] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uri.trim()) return;
    onAdd(uri.trim());
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Link Device</h3>
        <button
          onClick={onCancel}
          className="rounded p-1 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700">
            Device Link URI
          </label>
          <input
            type="text"
            value={uri}
            onChange={(e) => setUri(e.target.value)}
            placeholder="sgnl://linkdevice?uuid=..."
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Scan the QR code from the new device and paste the link URI here.
          </p>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!uri.trim()}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Link
          </button>
        </div>
      </form>
    </div>
  );
}
