"use client";

import type { LighterAccount } from "../types";
import { PositionCard } from "./position-card";

const ADDRESS_PREFIX_LENGTH = 8;
const ADDRESS_SUFFIX_LENGTH = 8;

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
    <div className="overflow-hidden rounded-xl border border-gray-700 bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-1 flex items-center gap-3">
              <h2 className="text-lg font-semibold text-white">
                Account #{account.account_index}
              </h2>
              <span
                className={`rounded px-2 py-1 text-xs font-medium ${
                  isActive
                    ? "bg-green-900/50 text-green-400"
                    : "bg-red-900/50 text-red-400"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="font-mono text-sm text-gray-400">
              {account.l1_address.slice(0, ADDRESS_PREFIX_LENGTH)}...
              {account.l1_address.slice(-ADDRESS_SUFFIX_LENGTH)}
            </p>
          </div>
          {lastUpdated && (
            <div className="text-right">
              <p className="text-xs text-gray-400">Last Updated</p>
              <p className="text-xs text-gray-500">
                {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Account Stats */}
      <div className="border-b border-gray-800 p-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <p className="mb-1 text-xs text-gray-400">Collateral</p>
            <p className="text-lg font-semibold text-white">
              ${Number.parseFloat(account.collateral).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs text-gray-400">Available Balance</p>
            <p className="text-lg font-semibold text-green-400">
              ${Number.parseFloat(account.available_balance).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs text-gray-400">Total Asset Value</p>
            <p className="text-lg font-semibold text-white">
              ${Number.parseFloat(account.total_asset_value).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs text-gray-400">Open Orders</p>
            <p className="text-lg font-semibold text-blue-400">
              {account.pending_order_count}
            </p>
          </div>
        </div>
      </div>

      {/* Positions */}
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Positions</h3>
          <span className="text-sm text-gray-400">
            {activePositions.length} active position
            {activePositions.length !== 1 ? "s" : ""}
          </span>
        </div>

        {activePositions.length > 0 ? (
          <div className="grid gap-3">
            {activePositions.map((position) => (
              <PositionCard key={position.market_id} position={position} />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            <p>No active positions</p>
          </div>
        )}
      </div>
    </div>
  );
}
