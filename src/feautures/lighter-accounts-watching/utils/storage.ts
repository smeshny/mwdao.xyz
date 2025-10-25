const WATCHED_ADDRESSES_KEY = "lighter-watched-addresses";
const WHITESPACE_REGEX = /\s+/;
const ETHEREUM_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

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
    // Format 1: SM1 0x...
    // Format 2: 0x... (just the address)
    // Format 3: SM1 0x... # comment
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
