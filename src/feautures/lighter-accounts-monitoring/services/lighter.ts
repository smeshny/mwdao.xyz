import type { LighterAccountResponse } from "../types";

const LIGHTER_API_BASE = "https://mainnet.zklighter.elliot.ai/api/v1";
const ETHEREUM_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

export async function fetchLighterAccount(
  l1Address: string,
): Promise<LighterAccountResponse> {
  const url = new URL(`${LIGHTER_API_BASE}/account`);
  url.searchParams.set("by", "l1_address");
  url.searchParams.set("value", l1Address);

  const response = await fetch(url.toString(), {
    headers: {
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch account data: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

export function isValidL1Address(address: string): boolean {
  // Basic Ethereum address validation
  return ETHEREUM_ADDRESS_REGEX.test(address);
}
