"use client";

import type { LighterAccount } from "../types";
import { PositionCard } from "./position-card";

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
    <div className="space-y-4">
      {/* Account Header - More Compact */}
      <div className="bg-muted/20 flex items-center justify-between rounded-lg border p-4">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">
                Account #{account.account_index}
              </h3>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  isActive
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
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
        </div>
        {lastUpdated && (
          <div className="text-right">
            <p className="text-muted-foreground text-xs">Updated</p>
            <p className="text-muted-foreground text-xs font-medium">
              {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        )}
      </div>

      {/* Account Stats - Compact Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="bg-card rounded-lg border p-3 text-center">
          <p className="text-muted-foreground mb-1 text-xs font-medium">
            Collateral
          </p>
          <p className="text-sm font-semibold">
            ${Number.parseFloat(account.collateral || "0").toLocaleString()}
          </p>
        </div>
        <div className="bg-card rounded-lg border p-3 text-center">
          <p className="text-muted-foreground mb-1 text-xs font-medium">
            Available
          </p>
          <p className="text-sm font-semibold text-green-600">
            $
            {Number.parseFloat(
              account.available_balance || "0",
            ).toLocaleString()}
          </p>
        </div>
        <div className="bg-card rounded-lg border p-3 text-center">
          <p className="text-muted-foreground mb-1 text-xs font-medium">
            Asset Value
          </p>
          <p className="text-sm font-semibold">
            $
            {Number.parseFloat(
              account.total_asset_value || "0",
            ).toLocaleString()}
          </p>
        </div>
        <div className="bg-card rounded-lg border p-3 text-center">
          <p className="text-muted-foreground mb-1 text-xs font-medium">
            Orders
          </p>
          <p className="text-sm font-semibold text-blue-600">
            {account.pending_order_count}
          </p>
        </div>
      </div>

      {/* Positions Section - More Compact */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h4 className="font-medium">Positions</h4>
          <span className="text-muted-foreground bg-muted rounded-full px-2 py-1 text-xs">
            {activePositions.length}
          </span>
        </div>

        {activePositions.length > 0 ? (
          <div className="space-y-2">
            {activePositions.map((position) => (
              <div
                key={position.market_id}
                className="bg-card/50 rounded-lg border p-3"
              >
                <PositionCard position={position} compact={true} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground bg-muted/10 rounded-lg border border-dashed py-6 text-center">
            <p className="text-sm">No active positions</p>
          </div>
        )}
      </div>
    </div>
  );
}
