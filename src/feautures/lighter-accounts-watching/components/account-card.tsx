"use client";

import type { LighterAccount } from "../types";
import { PositionCard } from "./position-card";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ADDRESS_PREFIX_LENGTH = 6;
const ADDRESS_SUFFIX_LENGTH = 4;

type AccountCardProps = {
  account: LighterAccount;
  lastUpdated?: Date;
};

export function AccountCard({ account, lastUpdated }: AccountCardProps) {
  const isActive = account.status === 1;
  const activePositions = account.positions.filter(
    (position) =>
      Number.parseFloat(position.position) !== 0 ||
      Number.parseFloat(position.unrealized_pnl) !== 0,
  );

  return (
    <Card>
      {/* Header */}
      <CardHeader className="bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <CardTitle>Account #{account.account_index}</CardTitle>
              <span
                className={`rounded px-2 py-1 text-xs font-medium ${
                  isActive
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-muted-foreground font-mono text-sm">
              {account.l1_address.slice(0, ADDRESS_PREFIX_LENGTH)}...
              {account.l1_address.slice(-ADDRESS_SUFFIX_LENGTH)}
            </p>
          </div>
          {lastUpdated && (
            <div className="text-right">
              <p className="text-muted-foreground text-xs">Last Updated</p>
              <p className="text-muted-foreground text-xs">
                {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>
      </CardHeader>

      {/* Account Stats */}
      <CardContent className="border-b">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Collateral</p>
            <p className="text-lg font-semibold">
              ${Number.parseFloat(account.collateral).toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Available Balance</p>
            <p className="text-lg font-semibold text-green-600">
              ${Number.parseFloat(account.available_balance).toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Total Asset Value</p>
            <p className="text-lg font-semibold">
              ${Number.parseFloat(account.total_asset_value).toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Open Orders</p>
            <p className="text-lg font-semibold text-blue-600">
              {account.pending_order_count}
            </p>
          </div>
        </div>
      </CardContent>

      {/* Positions */}
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Positions</CardTitle>
          <span className="text-muted-foreground text-sm">
            {activePositions.length} active position
            {activePositions.length !== 1 ? "s" : ""}
          </span>
        </div>

        {activePositions.length > 0 ? (
          <div className="space-y-3">
            {activePositions.map((position) => (
              <PositionCard key={position.market_id} position={position} />
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground py-8 text-center">
            <p>Positions 0</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
