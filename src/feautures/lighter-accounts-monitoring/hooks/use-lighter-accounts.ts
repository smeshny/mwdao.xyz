"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchLighterAccount, isValidL1Address } from "../services/lighter";
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
  const effectiveRefetchInterval = refetchInterval ?? 30_000; // default 30s

  return useQuery<LighterAccountResponse>({
    queryKey: ["lighter-account", l1Address],
    queryFn: ({ signal }) => fetchLighterAccount(l1Address, { signal }),
    refetchInterval: effectiveRefetchInterval,
    refetchIntervalInBackground: true,
    enabled: enabled && isValidL1Address(l1Address),
    staleTime: effectiveRefetchInterval,
    gcTime: FIVE_MINUTES * ONE_MINUTE_MS, // 5 minutes
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: true,
  });
}
