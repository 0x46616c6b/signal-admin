import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ServerConfigProvider } from "@/contexts/server-config-context";
import { AccountProvider } from "@/contexts/account-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Signal Admin",
  description: "Admin interface for Signal CLI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full bg-gray-50 text-gray-900 font-sans">
        <ServerConfigProvider>
          <AccountProvider>
            {children}
            <Toaster position="top-right" richColors />
          </AccountProvider>
        </ServerConfigProvider>
      </body>
    </html>
  );
}
