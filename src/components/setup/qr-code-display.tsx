"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check } from "lucide-react";

interface QrCodeDisplayProps {
  uri: string;
}

export function QrCodeDisplay({ uri }: QrCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(uri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <QRCodeSVG value={uri} size={256} level="M" />
      </div>
      <div className="flex w-full items-center gap-2">
        <code className="flex-1 truncate rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-600">
          {uri}
        </code>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-md border border-gray-300 p-1.5 text-gray-500 hover:bg-gray-50"
          title="Copy URI"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
