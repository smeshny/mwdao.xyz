"use client";

import React, { useState, useCallback } from "react";

import { toast } from "sonner";

import {
  useDepositAddress,
  validateDepositAddressInput,
} from "../hooks/use-deposit-address";
import { SUPPORTED_CHAINS } from "../services/lighter";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DepositAddressData {
  intentAddress: string;
  chainId: number;
  chainName: string;
  fromAddress: string;
  contractAddress: string;
}

export function DepositAddressGenerator() {
  const [address, setAddress] = useState("");
  const [selectedChainId, setSelectedChainId] = useState<number>(42161); // Default to Arbitrum
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [generatedAddress, setGeneratedAddress] =
    useState<DepositAddressData | null>(null);

  const depositMutation = useDepositAddress({
    onSuccess: (data) => {
      const chainInfo = SUPPORTED_CHAINS.find(
        (chain) => chain.id === data.chain_id,
      );
      const chainName =
        chainInfo?.displayName ||
        SUPPORTED_CHAINS.find((chain) => chain.id === selectedChainId)
          ?.displayName ||
        `Unknown Chain (${data.chain_id})`;

      const result: DepositAddressData = {
        intentAddress: data.intent_address,
        chainId: data.chain_id,
        chainName,
        fromAddress: data.from_address,
        contractAddress: "0x3B4D794a66304F130a4Db8F2551B0070dfCf5ca7",
      };
      setGeneratedAddress(result);
      setIsDialogOpen(true);
      toast.success("Deposit address generated successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to generate deposit address: ${error.message}`);
    },
  });

  const handleGenerateAddress = useCallback(() => {
    const validation = validateDepositAddressInput(address, selectedChainId);

    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    const request = {
      chain_id: selectedChainId,
      from_addr: address,
      amount: 0,
      is_external_deposit: true,
    };

    depositMutation.mutate(request);
  }, [address, selectedChainId, depositMutation]);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const isValid = validateDepositAddressInput(address, selectedChainId).isValid;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Deposit Icon</title>
            <path
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          Generate Deposit Address
        </CardTitle>
        <CardDescription>
          Get a unique deposit address for your Lighter account. Based on the
          official{" "}
          <a
            href="https://lighterxyz.notion.site/lighter-api-overview-faq"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Lighter API FAQ
          </a>
          .
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="l1-address">Your L1 Address</Label>
            <Input
              id="l1-address"
              type="text"
              placeholder="0x..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chain-select">Select Chain</Label>
            <Select
              value={selectedChainId.toString()}
              onValueChange={(value) => setSelectedChainId(Number(value))}
            >
              <SelectTrigger id="chain-select">
                <SelectValue placeholder="Select a chain" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_CHAINS.map((chain) => (
                  <SelectItem key={chain.id} value={chain.id.toString()}>
                    {chain.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleGenerateAddress}
          disabled={!isValid || depositMutation.isPending}
          className="w-full"
        >
          {depositMutation.isPending ? (
            <>
              <svg
                className="mr-2 h-4 w-4 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Spinner</title>
                <path
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              Generating...
            </>
          ) : (
            "Generate Deposit Address"
          )}
        </Button>

        <Alert>
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Info Icon</title>
            <path
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
          <AlertDescription>
            <strong>Safety Note:</strong> Test with small amounts first. Your
            intent address is unique to your account (except for Solana, which
            generates a different address).
          </AlertDescription>
        </Alert>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Deposit Address Generated</DialogTitle>
            <DialogDescription>
              Your unique deposit address has been created. Use this address to
              deposit funds to your Lighter account.
            </DialogDescription>
          </DialogHeader>

          {generatedAddress && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Chain</Label>
                <div className="bg-muted rounded-md p-3">
                  <span className="text-sm">{generatedAddress.chainName}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Your Deposit Address
                </Label>
                <div className="bg-muted rounded-md p-3">
                  <code className="font-mono text-xs break-all">
                    {generatedAddress.intentAddress}
                  </code>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(
                      generatedAddress.intentAddress,
                      "Deposit address",
                    )
                  }
                  className="w-full"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <title>Copy Icon</title>
                    <path
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                  Copy Address
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">From Address</Label>
                <div className="bg-muted rounded-md p-3">
                  <code className="font-mono text-xs break-all">
                    {generatedAddress.fromAddress}
                  </code>
                </div>
              </div>

              <Alert>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>Warning Icon</title>
                  <path
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L5.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                <AlertDescription>
                  <strong>Important:</strong> Only send funds that match the
                  selected chain. Double-check the address before sending.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() =>
                    copyToClipboard(
                      generatedAddress.intentAddress,
                      "Deposit address",
                    )
                  }
                  className="flex-1"
                >
                  Copy Address
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
