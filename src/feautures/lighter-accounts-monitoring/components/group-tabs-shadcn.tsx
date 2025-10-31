"use client";

import React, { useEffect } from "react";

import type { WalletGroup } from "../types";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type GroupTabsProps = {
  groups: WalletGroup[];
  activeGroup: string;
  onGroupChange: (groupName: string) => void;
  onEditGroup?: (group: WalletGroup) => void;
  onDeleteGroup?: (groupId: string) => void;
};

export function GroupTabsWithShadcn({
  groups,
  activeGroup,
  onGroupChange,
  onEditGroup,
  onDeleteGroup,
}: GroupTabsProps) {
  // Show first group by default if no active group
  useEffect(() => {
    if (!activeGroup && groups.length > 0) {
      onGroupChange(groups[0].name);
    }
  }, [activeGroup, groups, onGroupChange]);

  if (groups.length === 0) {
    return (
      <div className="space-y-2">
        <div className="text-muted-foreground py-2 text-center">
          No groups created yet. Create your first group to start watching
          wallets.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tab Navigation and Group Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Tabs value={activeGroup} onValueChange={onGroupChange}>
            <TabsList className="bg-muted/30 rounded-lg p-1">
              {groups.map((group) => (
                <TabsTrigger
                  key={group.id}
                  value={group.name}
                  className="hover:bg-muted/60 text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:border-border rounded-md border border-transparent px-3 py-1.5 text-sm transition-colors data-[state=active]:shadow-sm"
                >
                  {group.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Group Actions */}
        {activeGroup && onEditGroup && onDeleteGroup && (
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
        )}
      </div>
    </div>
  );
}
