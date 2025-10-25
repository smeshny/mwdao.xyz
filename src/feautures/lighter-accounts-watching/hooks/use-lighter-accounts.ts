"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchLighterAccount } from "../services/lighter";
import type { LighterAccountResponse } from "../types";

const FIVE_MINUTES = 5;
const ONE_MINUTE_SECONDS = 60;
const THOUSAND_MS = 1000;
const ONE_MINUTE_MS = ONE_MINUTE_SECONDS * THOUSAND_MS;

export type UseLighterAccountOptions = {
  refetchInterval?: number;
  enabled?: boolean;
};

export function useLighterAccount(
  l1Address: string,
  options: UseLighterAccountOptions = {},
) {
  const { refetchInterval, enabled = true } = options;

  return useQuery<LighterAccountResponse>({
    queryKey: ["lighter-account", l1Address],
    queryFn: () => fetchLighterAccount(l1Address),
    refetchInterval,
    enabled: enabled && l1Address.length > 0,
    staleTime: 30_000, // 30 seconds
    gcTime: FIVE_MINUTES * ONE_MINUTE_MS, // 5 minutes
  });
}
