import type { WatchedAccount, WalletGroup } from "../types";

const WATCHED_ADDRESSES_KEY = "lighter-watched-addresses";
const WATCHED_ACCOUNTS_KEY = "lighter-watched-accounts";
const WALLET_GROUPS_KEY = "lighter-wallet-groups";
const WHITESPACE_REGEX = /\s+/;
const ETHEREUM_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

// Enhanced storage for watched accounts with groups
export function saveWatchedAccounts(accounts: WatchedAccount[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(WATCHED_ACCOUNTS_KEY, JSON.stringify(accounts));
  }
}

export function loadWatchedAccounts(): WatchedAccount[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(WATCHED_ACCOUNTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Legacy functions for backward compatibility
export function saveWatchedAddresses(addresses: string[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(WATCHED_ADDRESSES_KEY, JSON.stringify(addresses));
  }
}

export function loadWatchedAddresses(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(WATCHED_ADDRESSES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Parse address list with group support
export function parseAddressList(input: string): string[] {
  const lines = input.split("\n");
  const addresses: string[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Skip empty lines and comments
    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    // Handle different formats
    // Format 1: Wallet1 0x...
    // Format 2: 0x... (just the address)
    // Format 3: Wallet1 0x... # comment
    const parts = trimmedLine.split(WHITESPACE_REGEX);
    const address = parts.find((part) => part.startsWith("0x"));

    if (address) {
      // Extract just the hex part (remove any trailing comments)
      const hexAddress = address.split("#")[0].trim();
      if (ETHEREUM_ADDRESS_REGEX.test(hexAddress)) {
        addresses.push(hexAddress);
      }
    }
  }

  return [...new Set(addresses)]; // Remove duplicates
}

// Parse address list and capture optional user labels (e.g., "Wallet1 0x...")
export function parseAddressEntries(
  input: string,
): { address: string; label?: string }[] {
  const lines = input.split("\n");
  const entries: { address: string; label?: string }[] = [];

  for (const raw of lines) {
    const line = raw.split("#")[0].trim(); // strip comments
    if (!line) continue;
    const parts = line.split(WHITESPACE_REGEX).filter(Boolean);
    if (parts.length === 0) continue;
    // Find address token
    const addrIdx = parts.findIndex((p) => p.startsWith("0x"));
    if (addrIdx === -1) continue;
    const address = parts[addrIdx];
    if (!ETHEREUM_ADDRESS_REGEX.test(address)) continue;
    const label = addrIdx > 0 ? parts.slice(0, addrIdx).join(" ") : undefined;
    entries.push({ address, label });
  }

  // de-duplicate by address, keeping first label encountered
  const seen = new Set<string>();
  const deduped: { address: string; label?: string }[] = [];
  for (const e of entries) {
    if (!seen.has(e.address)) {
      seen.add(e.address);
      deduped.push(e);
    }
  }
  return deduped;
}

// Parse address list with group extraction
export function parseAddressListWithGroups(input: string): {
  addresses: string[];
  groupName: string;
} {
  const lines = input.split("\n");
  const addresses: string[] = [];
  let groupName = "";

  // Extract group name from first line if it doesn't contain an address
  const firstLine = lines[0]?.trim();
  if (
    firstLine &&
    !firstLine.includes("0x") &&
    !firstLine.startsWith("#") &&
    firstLine.length > 0
  ) {
    groupName = firstLine;
  }

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Skip empty lines, comments, and group name line
    if (
      !trimmedLine ||
      trimmedLine.startsWith("#") ||
      trimmedLine === groupName
    ) {
      continue;
    }

    // Handle different formats
    // Format 1: Wallet1 0x...
    // Format 2: 0x... (just the address)
    // Format 3: Wallet1 0x... # comment
    const parts = trimmedLine.split(WHITESPACE_REGEX);
    const address = parts.find((part) => part.startsWith("0x"));

    if (address) {
      // Extract just the hex part (remove any trailing comments)
      const hexAddress = address.split("#")[0].trim();
      if (ETHEREUM_ADDRESS_REGEX.test(hexAddress)) {
        addresses.push(hexAddress);
      }
    }
  }

  return {
    addresses: [...new Set(addresses)], // Remove duplicates
    groupName: groupName.trim() || "Default Group",
  };
}

// Wallet groups management
export function saveWalletGroups(groups: WalletGroup[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(WALLET_GROUPS_KEY, JSON.stringify(groups));
  }
}

export function loadWalletGroups(): WalletGroup[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(WALLET_GROUPS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addWalletGroup(name: string): WalletGroup {
  const groups = loadWalletGroups();
  const newGroup: WalletGroup = {
    id: crypto.randomUUID(),
    name: name.trim(),
    createdAt: new Date(),
  };

  groups.push(newGroup);
  saveWalletGroups(groups);
  return newGroup;
}

export function updateWalletGroup(
  id: string,
  updates: Partial<WalletGroup>,
): void {
  const groups = loadWalletGroups();
  const index = groups.findIndex((g) => g.id === id);
  if (index !== -1) {
    groups[index] = { ...groups[index], ...updates };
    saveWalletGroups(groups);
  }
}

export function deleteWalletGroup(id: string): void {
  const groups = loadWalletGroups();
  const filteredGroups = groups.filter((g) => g.id !== id);
  saveWalletGroups(filteredGroups);

  // Also remove group from watched accounts
  const accounts = loadWatchedAccounts();
  const updatedAccounts = accounts.map((account) =>
    account.groupName === groups.find((g) => g.id === id)?.name
      ? { ...account, groupName: undefined }
      : account,
  );
  saveWatchedAccounts(updatedAccounts);
}
