"use client";

import React from "react";

import type { WalletGroup } from "../types";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type GroupTabsProps = {
  groups: WalletGroup[];
  activeGroup: string;
  onGroupChange: (groupName: string | null) => void;
  onEditGroup?: (group: WalletGroup) => void;
  onDeleteGroup?: (groupId: string) => void;
};

export function GroupTabs({
  groups,
  activeGroup,
  onGroupChange,
  onEditGroup,
  onDeleteGroup,
}: GroupTabsProps) {
  // Show first group by default if no active group
  React.useEffect(() => {
    if (!activeGroup && groups.length > 0) {
      onGroupChange(groups[0].name);
    }
  }, [activeGroup, groups, onGroupChange]);

  if (groups.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-muted-foreground py-8 text-center">
          No groups created yet. Create your first group to start organizing
          wallets.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b">
        {groups.map((group) => {
          const isActive = activeGroup === group.name;

          return (
            <Button
              key={group.id}
              variant={isActive ? "default" : "ghost"}
              onClick={() => onGroupChange(group.name)}
              className={cn(
                "rounded-t-lg rounded-b-none border-b-2 transition-colors",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "hover:border-muted-foreground/30 border-transparent",
              )}
            >
              {group.name}
            </Button>
          );
        })}
      </div>

      {/* Group Actions */}
      {activeGroup && onEditGroup && onDeleteGroup && (
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            Showing wallets for group:{" "}
            <span className="font-medium">{activeGroup}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const group = groups.find((g) => g.name === activeGroup);
                if (group) onEditGroup(group);
              }}
            >
              Edit Group
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const group = groups.find((g) => g.name === activeGroup);
                if (group) onDeleteGroup(group.id);
              }}
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              Delete Group
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
