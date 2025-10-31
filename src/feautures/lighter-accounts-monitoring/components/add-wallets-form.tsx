"use client";

import React, { useState } from "react";

import type { WalletGroup } from "../types";
import { parseAddressEntries } from "../utils/storage";

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

type AddWalletsFormProps = {
  onAddWallets: (payload: {
    entries: { address: string; label?: string }[];
    groupName: string;
  }) => void;
  existingGroups: WalletGroup[];
  onCreateGroup: (groupName: string) => void;
};

export function AddWalletsForm({
  onAddWallets,
  existingGroups,
  onCreateGroup,
}: AddWalletsFormProps) {
  const [addressInput, setAddressInput] = useState<string>("");
  const [selectedGroupName, setSelectedGroupName] = useState<string>("");
  const [newGroupName, setNewGroupName] = useState<string>("");

  const parsedEntries = parseAddressEntries(addressInput);
  const isCreatingNew = selectedGroupName === "__create__";
  const effectiveGroupName = isCreatingNew
    ? newGroupName.trim()
    : selectedGroupName;
  const isValid =
    parsedEntries.length > 0 &&
    effectiveGroupName &&
    effectiveGroupName.trim().length > 0;

  const handleAddWallets = () => {
    if (!isValid) return;

    const groupName = effectiveGroupName.trim();

    if (isCreatingNew && newGroupName.trim()) {
      onCreateGroup(newGroupName.trim());
    }

    onAddWallets({ entries: parsedEntries, groupName });

    setAddressInput("");
    setNewGroupName("");
    setSelectedGroupName("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Wallet Addresses</CardTitle>
        <CardDescription>
          Add wallet addresses to a group for monitoring their accounts and
          positions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Group Selection (compact with inline create) */}
        <div className="space-y-2">
          <Label className="text-base font-medium">Group</Label>
          <div className="flex gap-2">
            <select
              value={selectedGroupName}
              onChange={(e) => setSelectedGroupName(e.target.value)}
              className="border-input bg-background ring-offset-background focus:ring-ring w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
            >
              <option value="">Select group...</option>
              {existingGroups.map((group) => (
                <option key={group.id} value={group.name}>
                  {group.name}
                </option>
              ))}
              <option value="__create__">+ Create new group…</option>
            </select>

            {isCreatingNew && (
              <Input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="New group name"
                className="w-1/2"
              />
            )}
          </div>
        </div>

        {/* Address Input */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Wallet Addresses</Label>
          <Textarea
            className="min-h-32 font-mono"
            onChange={(e) => setAddressInput(e.target.value)}
            placeholder={`Paste addresses here. Supports multiple formats:

SM1 0x000000000000000000000000000000000000dead
SM2 0x000000000000000000000000000000000000dead
0xCCc054C3FF50C3F132bD4dE74C2F7291ae88e0F9
SM4 0x000000000000000000000000000000000000dead # This is a comment`}
            value={addressInput}
          />

          <div className="flex items-center justify-between pt-2">
            <div className="text-muted-foreground text-sm">
              {parsedEntries.length > 0 ? (
                <span>
                  Found {parsedEntries.length} valid address
                  {parsedEntries.length !== 1 ? "es" : ""}
                </span>
              ) : (
                <span>Paste addresses using format above</span>
              )}
            </div>

            <Button
              disabled={!isValid}
              onClick={handleAddWallets}
              type="button"
              size="lg"
            >
              Add {parsedEntries.length} Address
              {parsedEntries.length !== 1 ? "es" : ""}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
