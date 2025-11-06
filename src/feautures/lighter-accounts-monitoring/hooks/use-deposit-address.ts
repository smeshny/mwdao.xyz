import { useMutation, useQuery } from "@tanstack/react-query";

import {
  createIntentAddress,
  getChainById,
  isValidL1Address,
  type CreateIntentAddressRequest,
  type CreateIntentAddressResponse,
} from "../services/lighter";

interface UseDepositAddressOptions {
  onSuccess?: (data: CreateIntentAddressResponse) => void;
  onError?: (error: Error) => void;
}

export function useDepositAddress({
  onSuccess,
  onError,
}: UseDepositAddressOptions = {}) {
  return useMutation({
    mutationFn: (request: CreateIntentAddressRequest) =>
      createIntentAddress(request),
    onSuccess,
    onError,
  });
}

export function useChainInfo(chainId: number) {
  return useQuery({
    queryKey: ["chain-info", chainId],
    queryFn: () => getChainById(chainId),
    enabled: false, // This is a simple lookup, not a fetch operation
  });
}

export function validateDepositAddressInput(
  address: string,
  chainId: number,
): {
  isValid: boolean;
  error?: string;
} {
  if (!address.trim()) {
    return { isValid: false, error: "Address is required" };
  }

  if (!isValidL1Address(address)) {
    return { isValid: false, error: "Invalid Ethereum address format" };
  }

  if (!chainId) {
    return { isValid: false, error: "Please select a chain" };
  }

  return { isValid: true };
}
