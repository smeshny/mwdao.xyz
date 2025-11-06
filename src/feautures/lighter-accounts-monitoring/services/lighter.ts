import type { LighterAccountResponse } from "../types";

const LIGHTER_API_BASE = "https://mainnet.zklighter.elliot.ai/api/v1";
const ETHEREUM_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

export async function fetchLighterAccount(
  l1Address: string,
  init?: RequestInit,
): Promise<LighterAccountResponse> {
  const url = new URL(`${LIGHTER_API_BASE}/account`);
  url.searchParams.set("by", "l1_address");
  url.searchParams.set("value", l1Address);

  const response = await fetch(url.toString(), {
    headers: {
      accept: "application/json",
    },
    ...init,
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

export type ChainInfo = {
  id: number;
  name: string;
  displayName: string;
};

export const SUPPORTED_CHAINS: ChainInfo[] = [
  { id: 42161, name: "arbitrum", displayName: "Arbitrum" },
  { id: 8453, name: "base", displayName: "Base" },
  { id: 43114, name: "avalanche", displayName: "Avalanche C-Chain" },
  { id: 999, name: "hyperevm", displayName: "HyperEVM" },
  { id: 101, name: "solana", displayName: "Solana" },
];

export type CreateIntentAddressRequest = {
  chain_id: number;
  from_addr: string;
  amount: number;
  is_external_deposit: boolean;
};

export type CreateIntentAddressResponse = {
  intent_address: string;
  chain_id: number;
  from_address: string;
};

export async function createIntentAddress(
  request: CreateIntentAddressRequest,
): Promise<CreateIntentAddressResponse> {
  const url = `${LIGHTER_API_BASE}/createIntentAddress`;

  const formData = new URLSearchParams();
  formData.append("chain_id", request.chain_id.toString());
  formData.append("from_addr", request.from_addr);
  formData.append("amount", request.amount.toString());
  formData.append(
    "is_external_deposit",
    request.is_external_deposit.toString(),
  );

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to create intent address: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

export function getChainById(chainId: number): ChainInfo | undefined {
  return SUPPORTED_CHAINS.find((chain) => chain.id === chainId);
}
