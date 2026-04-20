export interface Account {
  number: string;
  uuid: string;
  deviceId?: number;
  registered?: boolean;
}

export interface Contact {
  number?: string;
  uuid?: string;
  name?: string;
  givenName?: string;
  familyName?: string;
  nickGivenName?: string;
  nickFamilyName?: string;
  note?: string;
  color?: string;
  blocked?: boolean;
  messageExpirationTime?: number;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  isMember: boolean;
  isAdmin: boolean;
  isBlocked: boolean;
  members: GroupMember[];
  pendingMembers?: GroupMember[];
  requestingMembers?: GroupMember[];
  admins: string[];
  messageExpirationTime?: number;
  groupInviteLink?: string;
  permissionAddMember?: string;
  permissionEditDetails?: string;
  permissionSendMessages?: string;
}

export interface GroupMember {
  uuid: string;
  number?: string;
}

export interface Device {
  id: number;
  name?: string;
  createdTimestamp?: number;
  lastSeenTimestamp?: number;
}

export interface Identity {
  number?: string;
  uuid?: string;
  fingerprint?: string;
  safetyNumber?: string;
  trustLevel?: string;
  addedTimestamp?: number;
}

export interface StickerPack {
  packId: string;
  url?: string;
  installed?: boolean;
  title?: string;
  author?: string;
  stickers?: Sticker[];
}

export interface Sticker {
  id: number;
  description?: string;
  emoji?: string;
}

export interface SignalEnvelope {
  source?: string;
  sourceNumber?: string;
  sourceUuid?: string;
  sourceName?: string;
  sourceDevice?: number;
  timestamp: number;
  dataMessage?: DataMessage;
  syncMessage?: SyncMessage;
  typingMessage?: TypingMessage;
  receiptMessage?: ReceiptMessage;
  callMessage?: unknown;
}

export interface DataMessage {
  timestamp: number;
  message?: string;
  expiresInSeconds?: number;
  viewOnce?: boolean;
  reaction?: Reaction;
  quote?: Quote;
  mentions?: Mention[];
  attachments?: Attachment[];
  groupInfo?: { groupId: string; type?: string };
  remoteDelete?: { timestamp: number };
}

export interface SyncMessage {
  sentMessage?: DataMessage & {
    destination?: string;
    destinationNumber?: string;
    destinationUuid?: string;
  };
}

export interface TypingMessage {
  action: "STARTED" | "STOPPED";
  timestamp: number;
  groupId?: string;
}

export interface ReceiptMessage {
  type: "DELIVERY" | "READ";
  timestamps: number[];
}

export interface Reaction {
  emoji: string;
  targetAuthor: string;
  targetTimestamp: number;
  isRemove?: boolean;
}

export interface Quote {
  id: number;
  author: string;
  text?: string;
  mentions?: Mention[];
}

export interface Mention {
  start: number;
  length: number;
  uuid: string;
  number?: string;
}

export interface Attachment {
  contentType: string;
  filename?: string;
  id?: string;
  size?: number;
}

export interface SendResult {
  timestamp: number;
  results: Array<{
    recipientAddress: { uuid?: string; number?: string };
    type: string;
    success?: boolean;
  }>;
}

export interface Profile {
  givenName?: string;
  familyName?: string;
  about?: string;
  aboutEmoji?: string;
}

export interface JsonRpcRequest {
  jsonrpc: "2.0";
  method: string;
  params?: Record<string, unknown>;
  id: string;
}

export interface JsonRpcResponse<T = unknown> {
  jsonrpc: "2.0";
  result?: T;
  error?: { code: number; message: string; data?: unknown };
  id: string;
}
