"use client";

import type { LighterPosition } from "../types";

type PositionCardProps = {
  position: LighterPosition;
};

export function PositionCard({ position }: PositionCardProps) {
  const hasPosition = Number.parseFloat(position.position) !== 0;
  const hasUnrealizedPnL = Number.parseFloat(position.unrealized_pnl) !== 0;

  if (!(hasPosition || hasUnrealizedPnL)) {
    return null;
  }

  const positionType = position.sign === 1 ? "Long" : "Short";
  const positionTypeColor =
    position.sign === 1 ? "text-green-400" : "text-red-400";
  const pnlColor =
    Number.parseFloat(position.unrealized_pnl) >= 0
      ? "text-green-400"
      : "text-red-400";

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-white">{position.symbol}</h3>
          {hasPosition && (
            <span
              className={`rounded px-2 py-1 text-xs font-medium ${positionTypeColor} bg-gray-700`}
            >
              {positionType}
            </span>
          )}
        </div>
        {Number.parseFloat(position.liquidation_price) > 0 && (
          <div className="text-right">
            <p className="text-xs text-gray-400">Liq Price</p>
            <p className="font-mono text-sm text-yellow-400">
              ${Number.parseFloat(position.liquidation_price).toLocaleString()}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {hasPosition && (
          <>
            <div>
              <p className="text-xs text-gray-400">Position Size</p>
              <p className="font-mono text-sm text-white">
                {position.position}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Avg Entry Price</p>
              <p className="font-mono text-sm text-white">
                ${Number.parseFloat(position.avg_entry_price).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Position Value</p>
              <p className="font-mono text-sm text-white">
                ${Number.parseFloat(position.position_value).toLocaleString()}
              </p>
            </div>
          </>
        )}

        <div className={hasPosition ? "" : "col-span-2"}>
          <p className="text-xs text-gray-400">Unrealized PnL</p>
          <p className={`font-mono text-sm ${pnlColor}`}>
            ${Number.parseFloat(position.unrealized_pnl).toLocaleString()}
          </p>
        </div>

        {hasPosition && (
          <div>
            <p className="text-xs text-gray-400">Margin Fraction</p>
            <p className="font-mono text-sm text-white">
              {position.initial_margin_fraction}%
            </p>
          </div>
        )}
      </div>

      {position.open_order_count > 0 && (
        <div className="mt-3 border-t border-gray-700 pt-3">
          <p className="text-xs text-blue-400">
            {position.open_order_count} open order
            {position.open_order_count !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
