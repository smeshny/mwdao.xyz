"use client";

import React, { useCallback, useEffect, useState } from "react";

import { AccountCard } from "./account-card";
import { AddWalletsForm } from "./add-wallets-form";
import { CreateGroupForm } from "./create-group-form";
import { EditGroupDialogShadcn } from "./edit-group-dialog-shadcn";
import { GroupTabsWithShadcn } from "./group-tabs-shadcn";
import { useLighterAccount } from "../hooks/use-lighter-accounts";
import type { WatchedAccount, WalletGroup } from "../types";
import {
  loadWatchedAddresses,
  loadWatchedAccounts,
  saveWatchedAccounts,
  loadWalletGroups,
  saveWalletGroups,
  addWalletGroup,
  updateWalletGroup,
  deleteWalletGroup,
} from "../utils/storage";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const REFRESH_INTERVAL_MS = 30_000; // 30 seconds
const ADDRESS_PREFIX_DISPLAY_LENGTH = 6;
const ADDRESS_SUFFIX_DISPLAY_LENGTH = 4;

export function LighterAccountsWatching() {
  const [watchedAccounts, setWatchedAccounts] = useState<WatchedAccount[]>([]);
  const [walletGroups, setWalletGroups] = useState<WalletGroup[]>([]);
  const [activeGroup, setActiveGroup] = useState<string>("");
  const [editingGroup, setEditingGroup] = useState<WalletGroup | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load data from localStorage on mount
  useEffect(() => {
    if (!isMounted) return;

    // Load watched accounts
    const savedAccounts = loadWatchedAccounts();

    // Migrate old addresses format to new format if needed
    const oldAddresses = loadWatchedAddresses();
    if (oldAddresses.length > 0 && savedAccounts.length === 0) {
      const migratedAccounts: WatchedAccount[] = oldAddresses.map(
        (address) => ({
          l1_address: address,
          groupName: undefined,
        }),
      );
      setWatchedAccounts(migratedAccounts);
      saveWatchedAccounts(migratedAccounts);
    } else {
      setWatchedAccounts(savedAccounts);
    }

    // Load wallet groups
    const savedGroups = loadWalletGroups();
    setWalletGroups(savedGroups);
  }, [isMounted]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (isMounted) {
      saveWatchedAccounts(watchedAccounts);
    }
  }, [watchedAccounts, isMounted]);

  useEffect(() => {
    if (isMounted) {
      saveWalletGroups(walletGroups);
    }
  }, [walletGroups, isMounted]);

  const handleAddWallets = ({
    addresses,
    groupName,
  }: {
    addresses: string[];
    groupName: string;
  }) => {
    const newAccounts: WatchedAccount[] = addresses
      .filter((addr) => !watchedAccounts.some((acc) => acc.l1_address === addr))
      .map((address) => ({
        l1_address: address,
        groupName,
      }));

    setWatchedAccounts((prev) => [...prev, ...newAccounts]);
  };

  const handleCreateGroup = (groupName: string) => {
    const newGroup = addWalletGroup(groupName);
    setWalletGroups((prev) => [...prev, newGroup]);
  };

  const handleGroupCreated = (newGroup: WalletGroup) => {
    setWalletGroups((prev) => [...prev, newGroup]);
    setActiveGroup(newGroup.name);
  };

  const handleEditGroup = (group: WalletGroup) => {
    setEditingGroup(group);
    setIsEditDialogOpen(true);
  };

  const handleSaveGroup = (
    groupId: string,
    updates: { name: string; initialBalance?: string },
  ) => {
    updateWalletGroup(groupId, updates);
    setWalletGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, ...updates } : g)),
    );

    // Update accounts that reference this group by name
    if (updates.name) {
      const oldGroup = walletGroups.find((g) => g.id === groupId);
      if (oldGroup && oldGroup.name !== updates.name) {
        setWatchedAccounts((prev) =>
          prev.map((acc) =>
            acc.groupName === oldGroup.name
              ? { ...acc, groupName: updates.name }
              : acc,
          ),
        );
      }
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    const groupToDelete = walletGroups.find((g) => g.id === groupId);
    if (!groupToDelete) return;

    deleteWalletGroup(groupId);
    setWalletGroups((prev) => prev.filter((g) => g.id !== groupId));

    // Clear active group if it was deleted
    if (activeGroup === groupToDelete.name) {
      setActiveGroup("");
    }
  };

  const handleRemoveAddress = (addressToRemove: string) => {
    setWatchedAccounts((prev) =>
      prev.filter((acc) => acc.l1_address !== addressToRemove),
    );
  };

  // Filter accounts by active group
  const filteredAccounts = activeGroup
    ? watchedAccounts.filter((acc) => acc.groupName === activeGroup)
    : [];

  const filteredAddresses = filteredAccounts.map((acc) => acc.l1_address);

  // Show loading state during hydration to prevent mismatch
  if (!isMounted) {
    return (
      <div className="container mx-auto space-y-8 px-4 lg:px-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Lighter Accounts Watching
          </h1>
          <p className="text-muted-foreground">
            Monitor Lighter accounts and their positions in real-time
          </p>
        </div>

        {/* Loading skeleton */}
        <div className="animate-pulse">
          <Card>
            <CardHeader>
              <div className="bg-muted h-6 w-32 rounded"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted h-32 w-full rounded"></div>
              <div className="flex justify-between">
                <div className="bg-muted h-4 w-48 rounded"></div>
                <div className="bg-muted h-10 w-32 rounded"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-10 px-4 lg:px-6">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Lighter Accounts Watching
        </h1>
        <p className="text-muted-foreground max-w-3xl text-lg">
          Monitor Lighter accounts and their positions in real-time with group
          organization
        </p>
      </div>

      {/* Group Tabs */}
      <GroupTabsWithShadcn
        groups={walletGroups}
        activeGroup={activeGroup}
        onGroupChange={setActiveGroup}
        onEditGroup={handleEditGroup}
        onDeleteGroup={handleDeleteGroup}
      />

      {/* Stats Summary - Moved to top */}
      {filteredAddresses.length > 0 && activeGroup && (
        <RealtimeStatsSummary
          watchedAddresses={filteredAddresses}
          activeGroup={activeGroup}
          walletGroups={walletGroups}
        />
      )}

      {/* Balance Summary Table */}
      {filteredAddresses.length > 0 && (
        <BalanceSummary
          addresses={filteredAddresses}
          onRemoveAddress={handleRemoveAddress}
        />
      )}

      {/* Create Group Form - only show if there are groups or no wallets */}
      {walletGroups.length === 0 && (
        <CreateGroupForm
          onGroupCreated={handleGroupCreated}
          existingGroups={walletGroups}
        />
      )}

      {/* Add Wallets Form */}
      {walletGroups.length > 0 && (
        <AddWalletsForm
          onAddWallets={handleAddWallets}
          existingGroups={walletGroups}
          onCreateGroup={handleCreateGroup}
        />
      )}

      {/* Empty State */}
      {filteredAddresses.length === 0 && (
        <Card>
          <CardContent className="py-16">
            <div className="space-y-4 text-center">
              <h3 className="text-muted-foreground text-xl font-medium">
                {activeGroup
                  ? `No wallets in "${activeGroup}" group`
                  : "No accounts being watched"}
              </h3>
              <p className="text-muted-foreground">
                {activeGroup
                  ? "Add wallets to this group using the form above"
                  : "Create groups and add wallet addresses to start monitoring"}
              </p>
              <div className="mx-auto max-w-md text-left">
                <h4 className="mb-2 text-sm font-medium">Example format:</h4>
                <pre className="bg-muted text-muted-foreground overflow-x-auto rounded-lg border p-3 text-xs">
                  {`SM1 0x042ffe02F6565dAD4c359D335765356B705aB50A
SM2 0x6446E6FF8564b700059D80F921BEc949235cFc38
SM3 0xCCc054C3FF50C3F132bD4dE74C2F7291ae88e0F9
SM4 0x0b5Aa2aa22e3F0a0930a04Fb0a84B589139DD06d`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Group Dialog */}
      <EditGroupDialogShadcn
        group={editingGroup}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingGroup(null);
        }}
        onSave={handleSaveGroup}
      />
    </div>
  );
}

// Real-time stats component that aggregates data from all accounts
type RealtimeStatsSummaryProps = {
  watchedAddresses: string[];
  activeGroup: string;
  walletGroups: WalletGroup[];
};

function RealtimeStatsSummary({
  watchedAddresses,
  activeGroup,
  walletGroups,
}: RealtimeStatsSummaryProps) {
  const [totalStats, setTotalStats] = useState({
    totalCollateral: 0,
    totalPositions: 0,
    totalOrders: 0,
    totalAssetValue: 0,
  });

  // Initialize with value from group or default to "10000"
  const getInitialBalance = useCallback(() => {
    // Always use the active group's initial balance if set
    if (activeGroup && walletGroups.length > 0) {
      const activeGroupData = walletGroups.find((g) => g.name === activeGroup);
      if (activeGroupData?.initialBalance) {
        const numValue = Number.parseFloat(activeGroupData.initialBalance);
        if (!isNaN(numValue) && numValue >= 0) {
          return activeGroupData.initialBalance;
        }
      }
      // If group exists but no initial balance set, return default
      return "10000";
    }

    // No active group - return default
    return "10000";
  }, [activeGroup, walletGroups]);

  const [initialBalance, setInitialBalance] =
    useState<string>(getInitialBalance);

  // Update initial balance when active group changes
  useEffect(() => {
    setInitialBalance(getInitialBalance());
  }, [getInitialBalance]);

  // Save initial balance to group whenever it changes
  useEffect(() => {
    if (initialBalance && Number.parseFloat(initialBalance) >= 0) {
      // Always save to the active group
      if (activeGroup && walletGroups.length > 0) {
        const activeGroupData = walletGroups.find(
          (g) => g.name === activeGroup,
        );
        if (activeGroupData) {
          updateWalletGroup(activeGroupData.id, { initialBalance });
        }
      }
    }
  }, [initialBalance, activeGroup, walletGroups]);

  // Validate and parse initial balance
  const initialBalanceNum = Number.parseFloat(initialBalance) || 0;
  const profitLoss = totalStats.totalAssetValue - initialBalanceNum; // Positive = profit, Negative = loss

  // Fetch data for all addresses and calculate totals
  useEffect(() => {
    if (watchedAddresses.length === 0) return;

    const fetchAllAccountData = async () => {
      try {
        // We'll use the service directly for batch fetching
        const { fetchLighterAccount } = await import("../services/lighter");

        const results = await Promise.allSettled(
          watchedAddresses.map((address) => fetchLighterAccount(address)),
        );

        let totalCollateral = 0;
        let totalPositions = 0;
        let totalOrders = 0;
        let totalAssetValue = 0;

        results.forEach((result) => {
          if (result.status === "fulfilled" && result.value?.accounts?.length) {
            const account = result.value.accounts[0];
            totalCollateral += Number.parseFloat(account.collateral || "0");
            totalAssetValue += Number.parseFloat(
              account.total_asset_value || "0",
            );

            const activePositions = account.positions.filter(
              (position) =>
                Number.parseFloat(position.position) !== 0 ||
                Number.parseFloat(position.unrealized_pnl) !== 0,
            );
            totalPositions += activePositions.length;
            totalOrders += account.pending_order_count || 0;
          }
        });

        setTotalStats({
          totalCollateral,
          totalPositions,
          totalOrders,
          totalAssetValue,
        });
      } catch {
        // Error fetching account stats - silently continue
      }
    };

    fetchAllAccountData();
    const interval = setInterval(fetchAllAccountData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [watchedAddresses]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Watched Accounts
          </CardTitle>
          <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
            <svg
              className="h-4 w-4 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>User Icon</title>
              <path
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{watchedAddresses.length}</div>
          <p className="text-muted-foreground text-xs">
            Accounts being monitored
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
          <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
            <svg
              className="h-4 w-4 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Dollar Icon</title>
              <path
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            ${totalStats.totalAssetValue.toLocaleString()}
          </div>
          <p className="text-muted-foreground text-xs">
            Total asset value across all accounts
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Positions
          </CardTitle>
          <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
            <svg
              className="h-4 w-4 text-purple-600 dark:text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Chart Icon</title>
              <path
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {totalStats.totalPositions}
          </div>
          <p className="text-muted-foreground text-xs">
            Active positions ({totalStats.totalOrders} orders)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Initial Balance</CardTitle>
          <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
            <svg
              className="h-4 w-4 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Wallet Icon</title>
              <path
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={initialBalance}
              onChange={(e) => {
                const value = e.target.value;
                // Only allow positive numbers and empty string
                if (
                  value === "" ||
                  (!isNaN(Number.parseFloat(value)) &&
                    Number.parseFloat(value) >= 0)
                ) {
                  setInitialBalance(value);
                }
              }}
              className="text-lg font-semibold"
              placeholder="Enter initial balance"
            />
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Burned:</span>
              <span
                className={`font-medium ${profitLoss >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {profitLoss >= 0 ? "+" : "-"}$
                {Math.abs(profitLoss).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Account Row Data Component for Table
type AccountRowDataProps = {
  address: string;
  index: number;
  isExpanded: boolean;
  onToggleExpanded: (address: string) => void;
  onRemoveAddress: (address: string) => void;
  registerRefetch: (address: string, refetch: () => void) => void;
};

function AccountRowData({
  address,
  index,
  isExpanded,
  onToggleExpanded,
  onRemoveAddress,
  registerRefetch,
}: AccountRowDataProps) {
  const { data, isLoading, error, refetch } = useLighterAccount(address, {
    refetchInterval: REFRESH_INTERVAL_MS,
  });

  // Register the refetch function with parent
  React.useEffect(() => {
    registerRefetch(address, refetch);
  }, [address, refetch, registerRefetch]);

  if (isLoading) {
    return (
      <tr className="hover:bg-muted/20 border-b transition-colors">
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveAddress(address)}
              type="button"
              className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Remove Icon</title>
                <path
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </Button>
            <span className="text-muted-foreground font-mono text-sm font-medium">
              #{index + 1}
            </span>
            <span className="font-mono text-sm">
              {address.slice(0, ADDRESS_PREFIX_DISPLAY_LENGTH)}...
              {address.slice(-ADDRESS_SUFFIX_DISPLAY_LENGTH)}
            </span>
          </div>
        </td>
        <td className="px-4 py-3 text-right font-mono text-sm">Loading...</td>
        <td className="px-4 py-3 text-right font-mono text-sm">Loading...</td>
        <td className="px-4 py-3 text-right font-mono text-sm">Loading...</td>
        <td className="px-4 py-3">
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleExpanded(address)}
              type="button"
              disabled={true}
            >
              Loading...
            </Button>
          </div>
        </td>
      </tr>
    );
  }

  if (error || !data?.accounts?.length) {
    return (
      <tr className="hover:bg-muted/20 border-b transition-colors">
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveAddress(address)}
              type="button"
              className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Remove Icon</title>
                <path
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </Button>
            <span className="text-muted-foreground font-mono text-sm font-medium">
              #{index + 1}
            </span>
            <span className="font-mono text-sm">
              {address.slice(0, ADDRESS_PREFIX_DISPLAY_LENGTH)}...
              {address.slice(-ADDRESS_SUFFIX_DISPLAY_LENGTH)}
            </span>
          </div>
        </td>
        <td className="px-4 py-3 text-right font-mono text-sm text-red-600">
          Error
        </td>
        <td className="px-4 py-3 text-right font-mono text-sm text-red-600">
          Error
        </td>
        <td className="px-4 py-3 text-right font-mono text-sm text-red-600">
          Error
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center justify-center gap-2"></div>
        </td>
      </tr>
    );
  }

  const account = data.accounts[0];
  const activePositions = account.positions.filter(
    (position) =>
      Number.parseFloat(position.position) !== 0 ||
      Number.parseFloat(position.unrealized_pnl) !== 0,
  );
  const hasActiveContent =
    activePositions.length > 0 || account.pending_order_count > 0;
  const totalActiveItems = activePositions.length + account.pending_order_count;

  return (
    <React.Fragment key={address}>
      <tr className="hover:bg-muted/20 border-b transition-colors">
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveAddress(address)}
              type="button"
              className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Remove Icon</title>
                <path
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </Button>
            <span className="text-muted-foreground font-mono text-sm font-medium">
              #{index + 1}
            </span>
            <span className="font-mono text-sm">
              {address.slice(0, ADDRESS_PREFIX_DISPLAY_LENGTH)}...
              {address.slice(-ADDRESS_SUFFIX_DISPLAY_LENGTH)}
            </span>
          </div>
        </td>
        <td className="px-4 py-3 text-right font-mono text-sm">
          ${Number.parseFloat(account.collateral || "0").toLocaleString()}
        </td>
        <td className="px-4 py-3 text-right font-mono text-sm text-green-600">
          $
          {Number.parseFloat(account.available_balance || "0").toLocaleString()}
        </td>
        <td className="px-4 py-3 text-right font-mono text-sm">
          $
          {Number.parseFloat(account.total_asset_value || "0").toLocaleString()}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center justify-center gap-2">
            {hasActiveContent && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleExpanded(address)}
                type="button"
              >
                {isExpanded ? "Hide" : "Positions"} ({totalActiveItems})
              </Button>
            )}
          </div>
        </td>
      </tr>

      {/* Expandable row for positions - only show if there are active positions or orders */}
      {isExpanded && hasActiveContent && (
        <tr className="bg-muted/10">
          <td colSpan={5} className="px-6 py-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">Account Details</h4>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground text-sm">
                  {activePositions.length} position
                  {activePositions.length !== 1 ? "s" : ""},{" "}
                  {account.pending_order_count} order
                  {account.pending_order_count !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="bg-background rounded-lg border p-6">
                <AccountCard account={account} lastUpdated={new Date()} />
              </div>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
}

// Balance Summary Table Component
type BalanceSummaryProps = {
  addresses: string[];
  onRemoveAddress: (address: string) => void;
};

function BalanceSummary({ addresses, onRemoveAddress }: BalanceSummaryProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Store refetch functions for all accounts
  const [refetchFunctions, setRefetchFunctions] = useState<
    Map<string, () => void>
  >(new Map());

  const toggleExpanded = (address: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(address)) {
      newExpanded.delete(address);
    } else {
      newExpanded.add(address);
    }
    setExpandedRows(newExpanded);
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    setLastUpdated(new Date());

    // Call all stored refetch functions
    const promises = Array.from(refetchFunctions.values()).map((refetch) =>
      refetch(),
    );
    try {
      await Promise.allSettled(promises);
    } catch {
      // Ignore individual fetch errors during refresh
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);

    // Show timestamp with relative time
    const timestamp = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    if (diffSecs < 60) return `${timestamp} (${diffSecs}s ago)`;
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${timestamp} (${diffMins}m ago)`;
    const diffHours = Math.floor(diffMins / 60);
    return `${timestamp} (${diffHours}h ago)`;
  };

  // Register refetch function from AccountRowData
  const registerRefetch = useCallback(
    (address: string, refetch: () => void) => {
      setRefetchFunctions((prev) => new Map(prev).set(address, refetch));
    },
    [],
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span>Balance Overview</span>
              <span className="text-muted-foreground text-sm font-normal">
                {addresses.length} account{addresses.length !== 1 ? "s" : ""}
              </span>
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2">
              <span>Summary of all monitored accounts and their balances</span>
              <span className="text-muted-foreground text-xs">•</span>
              <span className="text-muted-foreground text-xs">
                Last updated: {formatLastUpdated(lastUpdated)}
              </span>
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <svg
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Refresh Icon</title>
              <path
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30 border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Account
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    Collateral
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    Available
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    Asset Value
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {addresses.map((address, index) => {
                  const isExpanded = expandedRows.has(address);
                  return (
                    <AccountRowData
                      key={address}
                      address={address}
                      index={index}
                      isExpanded={isExpanded}
                      onToggleExpanded={toggleExpanded}
                      onRemoveAddress={onRemoveAddress}
                      registerRefetch={registerRefetch}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
