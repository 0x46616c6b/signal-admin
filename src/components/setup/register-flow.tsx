"use client";

import { useState } from "react";
import { Loader2, CheckCircle, ArrowLeft, ExternalLink } from "lucide-react";

import { toast } from "sonner";
import { useServerConfig } from "@/contexts/server-config-context";
import { useAccounts } from "@/contexts/account-context";

type Step = "phone" | "captcha" | "verify" | "done";

const CAPTCHA_URL = "/api/captcha/registration/generate.html";

function isValidE164(phone: string): boolean {
  return /^\+[1-9]\d{6,14}$/.test(phone);
}

function extractCaptchaToken(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(/signalcaptcha:\/\/(.+)/);
  return match ? match[1] : trimmed;
}

export function RegisterFlow() {
  const { rpcClient } = useServerConfig();
  const { refreshAccounts } = useAccounts();
  const [step, setStep] = useState<Step>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const callRegister = async (captcha?: string) => {
    const params: Record<string, unknown> = { account: phoneNumber };
    if (captcha) {
      params.captcha = captcha;
    }
    await rpcClient.call("register", params);
  };

  const handleRegister = async () => {
    if (!isValidE164(phoneNumber)) {
      setError(
        "Enter a valid phone number in E.164 format (e.g. +491234567890)",
      );
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await callRegister();
      setStep("verify");
      toast.success("Verification code sent!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to register";
      if (message.toLowerCase().includes("captcha")) {
        setStep("captcha");
      } else {
        setError(message);
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaptchaSubmit = async () => {
    const token = extractCaptchaToken(captchaToken);
    if (!token) {
      setError("Please paste the captcha token or link.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await callRegister(token);
      setStep("verify");
      toast.success("Verification code sent!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to register";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode.trim()) return;
    setError(null);
    setIsLoading(true);
    try {
      await rpcClient.call("verify", {
        account: phoneNumber,
        verificationCode: verificationCode.trim(),
      });
      setStep("done");
      toast.success("Account registered successfully!");
      await refreshAccounts();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Verification failed";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await callRegister();
      toast.success("Verification code resent!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to resend code";
      if (message.toLowerCase().includes("captcha")) {
        setStep("captcha");
        setCaptchaToken("");
      } else {
        setError(message);
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "done") {
    return (
      <div className="flex flex-col items-center gap-3 py-6">
        <CheckCircle className="h-12 w-12 text-green-500" />
        <p className="text-sm font-medium text-gray-900">
          Account registered successfully!
        </p>
        <p className="text-xs text-gray-500">Loading your account...</p>
      </div>
    );
  }

  if (step === "verify") {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          A verification code has been sent to{" "}
          <strong>{phoneNumber}</strong>.
        </p>

        <div>
          <label className="block text-xs font-medium text-gray-700">
            Verification Code
          </label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="123456"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoFocus
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-2 justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setVerificationCode("");
                setError(null);
              }}
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={isLoading}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Resend Code
            </button>
          </div>
          <button
            type="button"
            onClick={handleVerify}
            disabled={isLoading || !verificationCode.trim()}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Verify
          </button>
        </div>
      </div>
    );
  }

  if (step === "captcha") {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          Signal requires a captcha before sending the verification code.
        </p>

        <ol className="list-decimal list-inside space-y-1.5 text-xs text-gray-600">
          <li>
            Open the captcha page:{" "}
            <a
              href={CAPTCHA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:underline"
            >
              signalcaptchas.org
              <ExternalLink className="h-3 w-3" />
            </a>
          </li>
          <li>Solve the captcha</li>
          <li>
            Right-click the <strong>&ldquo;Open Signal&rdquo;</strong> link and
            copy the link address
          </li>
          <li>Paste it below</li>
        </ol>

        <div>
          <label className="block text-xs font-medium text-gray-700">
            Captcha Token
          </label>
          <input
            type="text"
            value={captchaToken}
            onChange={(e) => setCaptchaToken(e.target.value)}
            placeholder="signalcaptcha://03AG... or just the token"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoFocus
          />
          <p className="mt-1 text-xs text-gray-500">
            Paste the full <code>signalcaptcha://</code> link or just the token.
          </p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-2 justify-between">
          <button
            type="button"
            onClick={() => {
              setStep("phone");
              setCaptchaToken("");
              setError(null);
            }}
            className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
          <button
            type="button"
            onClick={handleCaptchaSubmit}
            disabled={isLoading || !captchaToken.trim()}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Submit & Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-700">
        Register a new Signal account with a phone number. signal-cli will
        become the primary device for this number.
      </p>

      <div>
        <label className="block text-xs font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+491234567890"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          autoFocus
        />
        <p className="mt-1 text-xs text-gray-500">
          Enter your phone number in international format (E.164).
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleRegister}
          disabled={isLoading || !phoneNumber.trim()}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          Register
        </button>
      </div>
    </div>
  );
}
