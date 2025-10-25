"use client";

import React, { useState } from "react";

import type { WalletGroup } from "../types";
import { addWalletGroup, updateWalletGroup } from "../utils/storage";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type CreateGroupFormProps = {
  onGroupCreated: (group: WalletGroup) => void;
  existingGroups: WalletGroup[];
};

export function CreateGroupForm({
  onGroupCreated,
  existingGroups,
}: CreateGroupFormProps) {
  const [groupName, setGroupName] = useState<string>("");
  const [initialBalance, setInitialBalance] = useState<string>("");

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

    onGroupCreated(newGroup);
    setGroupName("");
    setInitialBalance("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Group</CardTitle>
        <CardDescription>
          Create a new group to organize your wallets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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

        <Button
          onClick={handleCreateGroup}
          disabled={!groupName.trim()}
          className="w-full"
        >
          Create Group
        </Button>
      </CardContent>
    </Card>
  );
}
