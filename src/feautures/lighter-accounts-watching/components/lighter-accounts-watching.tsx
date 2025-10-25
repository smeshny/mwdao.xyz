"use client";

import { useEffect, useState } from "react";

import { AccountCard } from "./account-card";
import { StatsSummary } from "./stats-summary";
import { useLighterAccount } from "../hooks/use-lighter-accounts";
import {
  loadWatchedAddresses,
  parseAddressList,
  saveWatchedAddresses,
} from "../utils/storage";

const REFRESH_INTERVAL_MS = 30_000; // 30 seconds
const ADDRESS_PREFIX_DISPLAY_LENGTH = 10;
const ADDRESS_SUFFIX_DISPLAY_LENGTH = 8;

export function LighterAccountsWatching() {
  const [addressInput, setAddressInput] = useState<string>("");
  const [watchedAddresses, setWatchedAddresses] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load watched addresses from localStorage on mount
  useEffect(() => {
    if (!isMounted) return;
    const saved = loadWatchedAddresses();
    setWatchedAddresses(saved);
  }, [isMounted]);

  // Save to localStorage whenever watched addresses change
  useEffect(() => {
    saveWatchedAddresses(watchedAddresses);
  }, [watchedAddresses]);

  const handleAddMultipleAddresses = () => {
    const parsedAddresses = parseAddressList(addressInput);
    if (parsedAddresses.length > 0) {
      const newAddresses = parsedAddresses.filter(
        (addr) => !watchedAddresses.includes(addr),
      );
      setWatchedAddresses((prev) => [...prev, ...newAddresses]);
      setAddressInput("");
    }
  };

  // Calculate how many new addresses would be added (only after mount)
  const parsedAddresses = parseAddressList(addressInput);
  const newAddressesCount = isMounted
    ? parsedAddresses.filter((addr) => !watchedAddresses.includes(addr)).length
    : 0;

  const handleRemoveAddress = (addressToRemove: string) => {
    setWatchedAddresses((prev) =>
      prev.filter((addr) => addr !== addressToRemove),
    );
  };

  const handleClearAll = () => {
    setWatchedAddresses([]);
  };

  // Show loading state during hydration to prevent mismatch
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="mx-auto max-w-7xl p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">
              Lighter Accounts Watching
            </h1>
            <p className="text-gray-400">
              Monitor Lighter accounts and their positions in real-time
            </p>
          </div>

          {/* Loading skeleton */}
          <div className="animate-pulse">
            <div className="mb-8 rounded-lg border border-gray-700 bg-gray-900 p-6">
              <div className="mb-4 h-6 w-32 rounded bg-gray-700"></div>
              <div className="h-32 w-full rounded-lg bg-gray-800"></div>
              <div className="mt-4 flex justify-between">
                <div className="h-4 w-48 rounded bg-gray-700"></div>
                <div className="h-10 w-32 rounded bg-gray-700"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-7xl p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Lighter Accounts Watching</h1>
          <p className="text-gray-400">
            Monitor Lighter accounts and their positions in real-time
          </p>
        </div>

        {/* Add Address Form */}
        <div className="mb-8 rounded-lg border border-gray-700 bg-gray-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">Add Account Addresses</h2>
          <textarea
            className="h-32 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 font-mono text-sm text-white placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            onChange={(e) => setAddressInput(e.target.value)}
            placeholder={`Paste addresses here. Supports multiple formats:
SM1 0x042ffe02F6565dAD4c359D335765356B705aB50A
SM2 0x6446E6FF8564b700059D80F921BEc949235cFc38
0xCCc054C3FF50C3F132bD4dE74C2F7291ae88e0F9
SM4 0x0b5Aa2aa22e3F0a0930a04Fb0a84B589139DD06d # This is a comment`}
            value={addressInput}
          />
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              {parsedAddresses.length > 0 ? (
                <span>
                  Found {parsedAddresses.length} valid address
                  {parsedAddresses.length !== 1 ? "es" : ""}
                  {newAddressesCount > 0 && (
                    <span className="text-green-400">
                      {" "}
                      ({newAddressesCount} new)
                    </span>
                  )}
                </span>
              ) : (
                <span>Paste addresses using format above</span>
              )}
            </div>
            <button
              className="rounded-lg bg-blue-600 px-6 py-2 font-medium transition-colors hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500"
              disabled={parsedAddresses.length === 0}
              onClick={handleAddMultipleAddresses}
              type="button"
            >
              Add {newAddressesCount > 0 ? `${newAddressesCount} ` : ""}Address
              {newAddressesCount !== 1 ? "es" : ""}
            </button>
          </div>
        </div>

        {/* Watched Addresses */}
        {watchedAddresses.length > 0 && (
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Watching {watchedAddresses.length} Account
                {watchedAddresses.length !== 1 ? "s" : ""}
              </h2>
              <button
                className="text-sm font-medium text-red-400 transition-colors hover:text-red-300"
                onClick={handleClearAll}
                type="button"
              >
                Clear All
              </button>
            </div>
            <div className="grid max-h-64 gap-3 overflow-y-auto">
              {watchedAddresses.map((address, index) => (
                <div
                  className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800 px-4 py-3"
                  key={address}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-gray-500">
                      #{index + 1}
                    </span>
                    <span className="font-mono text-gray-300">
                      {address.slice(0, ADDRESS_PREFIX_DISPLAY_LENGTH)}...
                      {address.slice(-ADDRESS_SUFFIX_DISPLAY_LENGTH)}
                    </span>
                  </div>
                  <button
                    className="text-sm font-medium text-red-400 transition-colors hover:text-red-300"
                    onClick={() => handleRemoveAddress(address)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Summary */}
        {watchedAddresses.length > 0 && (
          <SimpleStatsSummary watchedAddresses={watchedAddresses} />
        )}

        {/* Account Cards */}
        <div className="space-y-6">
          {watchedAddresses.map((address) => (
            <AccountContainer address={address} key={address} />
          ))}
        </div>

        {/* Empty State */}
        {watchedAddresses.length === 0 && (
          <div className="py-16 text-center">
            <h3 className="mb-2 text-xl font-medium text-gray-400">
              No accounts being watched
            </h3>
            <p className="mb-6 text-gray-500">
              Paste Lighter L1 addresses above to start monitoring
            </p>
            <div className="mx-auto max-w-md text-left">
              <h4 className="mb-2 text-sm font-medium text-gray-300">
                Example format:
              </h4>
              <pre className="overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-3 text-xs text-gray-400">
                {`SM1 0x042ffe02F6565dAD4c359D335765356B705aB50A
SM2 0x6446E6FF8564b700059D80F921BEc949235cFc38
SM3 0xCCc054C3FF50C3F132bD4dE74C2F7291ae88e0F9
SM4 0x0b5Aa2aa22e3F0a0930a04Fb0a84B589139DD06d`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple stats component without hooks violation
type SimpleStatsSummaryProps = {
  watchedAddresses: string[];
};

function SimpleStatsSummary({ watchedAddresses }: SimpleStatsSummaryProps) {
  return (
    <StatsSummary
      addresses={watchedAddresses}
      totalCollateral={0}
      totalPositions={0}
    />
  );
}

type AccountContainerProps = {
  address: string;
};

function AccountContainer({ address }: AccountContainerProps) {
  const { data, isLoading, error, refetch } = useLighterAccount(address, {
    refetchInterval: REFRESH_INTERVAL_MS, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-700 bg-gray-900 p-8">
        <div className="text-center text-gray-400">
          <p>Loading account data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-700 bg-gray-900 p-8">
        <div className="text-center">
          <p className="mb-2 text-red-400">Error loading account data</p>
          <p className="mb-4 text-sm text-gray-400">
            {(error as Error).message}
          </p>
          <button
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-red-700"
            onClick={() => refetch()}
            type="button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data?.accounts?.length) {
    return (
      <div className="rounded-xl border border-gray-700 bg-gray-900 p-8">
        <div className="text-center text-gray-400">
          <p>No account found for address</p>
          <p className="mt-2 font-mono text-sm text-gray-500">
            {address.slice(0, ADDRESS_PREFIX_DISPLAY_LENGTH)}...
            {address.slice(-ADDRESS_SUFFIX_DISPLAY_LENGTH)}
          </p>
        </div>
      </div>
    );
  }

  return <AccountCard account={data.accounts[0]} lastUpdated={new Date()} />;
}
