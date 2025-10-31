"use client";

import React, { useState } from "react";

import type { WalletGroup } from "../types";
import {
  addWalletGroup,
  parseAddressEntries,
  updateWalletGroup,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type CreateGroupFormProps = {
  onGroupCreated: (group: WalletGroup) => void;
  onAddWallets: (payload: {
    entries: { address: string; label?: string }[];
    groupName: string;
  }) => void;
  existingGroups: WalletGroup[];
};

export function CreateGroupForm({
  onGroupCreated,
  onAddWallets,
  existingGroups,
}: CreateGroupFormProps) {
  const [groupName, setGroupName] = useState<string>("");
  const [initialBalance, setInitialBalance] = useState<string>("");
  const [addressInput, setAddressInput] = useState<string>("");

  const parsedEntries = parseAddressEntries(addressInput);

  const handleCreateGroup = () => {
    const trimmedName = groupName.trim();
    if (!trimmedName) return;

    // Check if group name already exists
    if (
      existingGroups.some(
        (g) => g.name.toLowerCase() === trimmedName.toLowerCase(),
      )
    ) {
      alert("Group with this name already exists");
      return;
    }

    const newGroup = addWalletGroup(trimmedName);

    // Set initial balance if provided
    if (initialBalance && Number.parseFloat(initialBalance) >= 0) {
      updateWalletGroup(newGroup.id, { initialBalance });
      newGroup.initialBalance = initialBalance;
    }

    // Add wallets if provided
    if (parsedEntries.length > 0) {
      onAddWallets({ entries: parsedEntries, groupName: trimmedName });
    }

    onGroupCreated(newGroup);
    setGroupName("");
    setInitialBalance("");
    setAddressInput("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Group</CardTitle>
        <CardDescription>
          Create a new group and optionally add wallets to it
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="groupName" className="text-sm font-medium">
            Group Name
          </label>
          <Input
            id="groupName"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="initialBalance" className="text-sm font-medium">
            Initial Balance (Optional)
          </label>
          <Input
            id="initialBalance"
            type="number"
            min="0"
            step="0.01"
            value={initialBalance}
            onChange={(e) => {
              const value = e.target.value;
              if (
                value === "" ||
                (!isNaN(Number.parseFloat(value)) &&
                  Number.parseFloat(value) >= 0)
              ) {
                setInitialBalance(value);
              }
            }}
            placeholder="Enter initial balance for this group"
            className="w-full"
          />
          <p className="text-muted-foreground text-xs">
            This will be used to calculate profit/loss for this group
          </p>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-medium">
            Wallet Addresses (Optional)
          </Label>
          <Textarea
            className="min-h-32 font-mono"
            onChange={(e) => setAddressInput(e.target.value)}
            placeholder={`Paste addresses here. Supports multiple formats:

SM1 0x000000000000000000000000000000000000dead
SM2 0x000000000000000000000000000000000000dead
0x000000000000000000000000000000000000dead
SM4 0x000000000000000000000000000000000000dead # This is a comment`}
            value={addressInput}
          />

          <div className="text-muted-foreground text-sm">
            {parsedEntries.length > 0 ? (
              <span>
                Found {parsedEntries.length} valid address
                {parsedEntries.length !== 1 ? "es" : ""}
              </span>
            ) : (
              <span>Optional: Paste addresses to add them to this group</span>
            )}
          </div>
        </div>

        <Button
          onClick={handleCreateGroup}
          disabled={!groupName.trim()}
          className="w-full"
        >
          Create Group
          {parsedEntries.length > 0 &&
            ` & Add ${parsedEntries.length} Address${parsedEntries.length !== 1 ? "es" : ""}`}
        </Button>
      </CardContent>
    </Card>
  );
}
