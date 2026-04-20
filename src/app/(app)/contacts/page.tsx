"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { useRpc, useRpcAction } from "@/hooks/use-rpc";
import type { Contact } from "@/lib/types";
import { ContactList } from "@/components/contacts/contact-list";
import { ContactForm } from "@/components/contacts/contact-form";
import { Plus } from "lucide-react";

export default function ContactsPage() {
  const { data: contacts, isLoading, execute: refresh } = useRpc<Contact[]>(
    "listContacts",
    { allRecipients: false },
  );
  const { execute: rpcAction } = useRpcAction();
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleBlock = async (recipient: string) => {
    try {
      await rpcAction("block", { recipient });
      toast.success("Contact blocked");
      refresh();
    } catch (err) {
      toast.error(`Failed to block: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleUnblock = async (recipient: string) => {
    try {
      await rpcAction("unblock", { recipient });
      toast.success("Contact unblocked");
      refresh();
    } catch (err) {
      toast.error(`Failed to unblock: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleDelete = async (recipient: string) => {
    try {
      await rpcAction("removeContact", { recipient });
      toast.success("Contact removed");
      refresh();
    } catch (err) {
      toast.error(`Failed to remove: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleSave = async (data: {
    recipient: string;
    givenName?: string;
    familyName?: string;
    expiration?: number;
  }) => {
    try {
      await rpcAction("updateContact", data);
      toast.success("Contact saved");
      setShowForm(false);
      setEditingContact(null);
      refresh();
    } catch (err) {
      toast.error(`Failed to save: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <AppShell title="Contacts">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {contacts?.length ?? 0} contacts
          </p>
          <button
            onClick={() => {
              setEditingContact(null);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Contact
          </button>
        </div>

        {showForm && (
          <ContactForm
            contact={editingContact}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingContact(null);
            }}
          />
        )}

        <ContactList
          contacts={contacts ?? []}
          isLoading={isLoading}
          onEdit={(c) => {
            setEditingContact(c);
            setShowForm(true);
          }}
          onBlock={handleBlock}
          onUnblock={handleUnblock}
          onDelete={handleDelete}
        />
      </div>
    </AppShell>
  );
}
