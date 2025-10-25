"use client";

import React, { useState } from "react";

import type { WalletGroup } from "../types";
import { parseAddressListWithGroups } from "../utils/storage";

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
  onAddWallets: (wallets: { addresses: string[]; groupName: string }) => void;
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
  const [useNewGroup, setUseNewGroup] = useState<boolean>(false);

  const parsedAddresses = parseAddressListWithGroups(addressInput);
  const isValid =
    parsedAddresses.addresses.length > 0 &&
    (useNewGroup ? newGroupName.trim() : selectedGroupName);

  const handleAddWallets = () => {
    if (!isValid) return;

    const groupName = useNewGroup ? newGroupName.trim() : selectedGroupName;

    if (useNewGroup && newGroupName.trim()) {
      onCreateGroup(newGroupName.trim());
    }

    onAddWallets({
      addresses: parsedAddresses.addresses,
      groupName,
    });

    setAddressInput("");
    setNewGroupName("");
    setUseNewGroup(false);
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
        {/* Group Selection */}
        <div className="space-y-4">
          <Label className="text-base font-medium">
            Select or Create Group
          </Label>

          {!useNewGroup ? (
            <div className="space-y-3">
              <select
                value={selectedGroupName}
                onChange={(e) => setSelectedGroupName(e.target.value)}
                className="border-input bg-background ring-offset-background focus:ring-ring w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
              >
                <option value="">Select existing group...</option>
                {existingGroups.map((group) => (
                  <option key={group.id} value={group.name}>
                    {group.name}
                  </option>
                ))}
              </select>

              <Button
                variant="outline"
                onClick={() => setUseNewGroup(true)}
                type="button"
                className="w-full"
              >
                + Create New Group
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Enter new group name..."
                className="w-full"
              />

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setUseNewGroup(false);
                    setNewGroupName("");
                  }}
                  type="button"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddWallets}
                  disabled={!isValid}
                  type="button"
                  className="flex-1"
                >
                  Create & Add
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Address Input */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Wallet Addresses</Label>
          <Textarea
            className="min-h-32 font-mono"
            onChange={(e) => setAddressInput(e.target.value)}
            placeholder={`Paste addresses here. Supports multiple formats:

SM1 0x042ffe02F6565dAD4c359D335765356B705aB50A
SM2 0x6446E6FF8564b700059D80F921BEc949235cFc38
0xCCc054C3FF50C3F132bD4dE74C2F7291ae88e0F9
SM4 0x0b5Aa2aa22e3F0a0930a04Fb0a84B589139DD06d # This is a comment`}
            value={addressInput}
          />

          <div className="flex items-center justify-between pt-2">
            <div className="text-muted-foreground text-sm">
              {parsedAddresses.addresses.length > 0 ? (
                <span>
                  Found {parsedAddresses.addresses.length} valid address
                  {parsedAddresses.addresses.length !== 1 ? "es" : ""}
                </span>
              ) : (
                <span>Paste addresses using format above</span>
              )}
            </div>

            {!useNewGroup && (
              <Button
                disabled={!isValid}
                onClick={handleAddWallets}
                type="button"
                size="lg"
              >
                Add {parsedAddresses.addresses.length} Address
                {parsedAddresses.addresses.length !== 1 ? "es" : ""}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
