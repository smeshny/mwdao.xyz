"use client";

import React, { useState, useEffect } from "react";

import type { WalletGroup } from "../types";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type EditGroupDialogProps = {
  group: WalletGroup | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    groupId: string,
    updates: { name: string; initialBalance?: string },
  ) => void;
};

export function EditGroupDialog({
  group,
  isOpen,
  onClose,
  onSave,
}: EditGroupDialogProps) {
  const [name, setName] = useState<string>("");
  const [initialBalance, setInitialBalance] = useState<string>("");

  useEffect(() => {
    if (group) {
      setName(group.name);
      setInitialBalance(group.initialBalance || "");
    }
  }, [group]);

  const handleSave = () => {
    if (!group || !name.trim()) return;

    onSave(group.id, {
      name: name.trim(),
      initialBalance: initialBalance || undefined,
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Group</DialogTitle>
          <DialogDescription>
            Modify group settings and initial balance
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Group Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter group name"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="initialBalance">Initial Balance (Optional)</Label>
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
