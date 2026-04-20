"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  UsersRound,
  Smartphone,
  UserCircle,
  Shield,
  Smile,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ConnectionStatus } from "@/components/connection-status";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/groups", label: "Groups", icon: UsersRound },
  { href: "/devices", label: "Devices", icon: Smartphone },
  { href: "/profile", label: "Profile", icon: UserCircle },
  { href: "/identities", label: "Identities", icon: Shield },
  { href: "/stickers", label: "Stickers", icon: Smile },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-gray-200 bg-white transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-gray-200 px-4">
          <h1 className="text-lg font-semibold text-gray-900">Signal Admin</h1>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:text-gray-600 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100",
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-gray-200 p-3">
          <ConnectionStatus />
        </div>
      </aside>
    </>
  );
}
