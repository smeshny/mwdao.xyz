"use client";

import type { LighterPosition } from "../types";

import { Card, CardContent } from "@/components/ui/card";

type PositionCardProps = {
  position: LighterPosition;
  compact?: boolean;
};

export function PositionCard({ position, compact = false }: PositionCardProps) {
  const hasPosition = Number.parseFloat(position.position) !== 0;
  const hasUnrealizedPnL = Number.parseFloat(position.unrealized_pnl) !== 0;

  if (!(hasPosition || hasUnrealizedPnL)) {
    return null;
  }

  const positionType = position.sign === 1 ? "Long" : "Short";
  const positionTypeColor =
    position.sign === 1 ? "text-green-600" : "text-red-600";
  const pnlColor =
    Number.parseFloat(position.unrealized_pnl) >= 0
      ? "text-green-600"
      : "text-red-600";

  // Compact version
  if (compact) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-medium text-sm">{position.symbol}</span>
          {hasPosition && (
            <span
              className={`rounded px-1.5 py-0.5 text-xs font-medium ${positionTypeColor} bg-muted/50`}
            >
              {positionType}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs">
          {hasPosition && (
            <>
              <span className="text-muted-foreground">
                Size: <span className="font-mono font-medium">{position.position}</span>
              </span>
              <span className="text-muted-foreground">
                Value: <span className="font-mono font-medium">${Number.parseFloat(position.position_value).toLocaleString()}</span>
              </span>
            </>
          )}
          <span className={`${pnlColor} font-mono font-medium`}>
            PnL: ${Number.parseFloat(position.unrealized_pnl).toLocaleString()}
          </span>
          {Number.parseFloat(position.liquidation_price) > 0 && (
            <span className="text-yellow-600 font-mono font-medium">
              Liq: ${Number.parseFloat(position.liquidation_price).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Full version
  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold">{position.symbol}</h3>
            {hasPosition && (
              <span
                className={`rounded px-2 py-1 text-xs font-medium ${positionTypeColor} bg-muted`}
              >
                {positionType}
              </span>
            )}
          </div>
          {Number.parseFloat(position.liquidation_price) > 0 && (
            <div className="text-right">
              <p className="text-muted-foreground text-xs">Liq Price</p>
              <p className="font-mono text-sm text-yellow-600">
                $
                {Number.parseFloat(position.liquidation_price).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {hasPosition && (
            <>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">Position Size</p>
                <p className="font-mono text-sm">{position.position}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">Avg Entry Price</p>
                <p className="font-mono text-sm">
                  $
                  {Number.parseFloat(position.avg_entry_price).toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">Position Value</p>
                <p className="font-mono text-sm">
                  ${Number.parseFloat(position.position_value).toLocaleString()}
                </p>
              </div>
            </>
          )}

          <div className={hasPosition ? "space-y-1" : "col-span-2 space-y-1"}>
            <p className="text-muted-foreground text-xs">Unrealized PnL</p>
            <p className={`font-mono text-sm ${pnlColor}`}>
              ${Number.parseFloat(position.unrealized_pnl).toLocaleString()}
            </p>
          </div>

          {hasPosition && (
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs">Margin Fraction</p>
              <p className="font-mono text-sm">
                {position.initial_margin_fraction}%
              </p>
            </div>
          )}
        </div>

        {position.open_order_count > 0 && (
          <div className="mt-3 border-t pt-3">
            <p className="text-xs text-blue-600">
              {position.open_order_count} open order
              {position.open_order_count !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
