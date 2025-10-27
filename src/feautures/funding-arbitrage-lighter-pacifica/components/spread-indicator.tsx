"use client";

import { cn } from "@/lib/utils";

import type { FundingArbitrageOpportunity } from "../types";
import { formatPercentage, formatRate } from "../utils";

type SpreadIndicatorProps = {
  opportunity: Pick<
    FundingArbitrageOpportunity,
    "spread" | "spreadDirection" | "spreadPercentage"
  >;
  pacificaRate?: number | null;
  lighterRate?: number | null;
};

const SPREAD_RATE_PRECISION = 6;
const SPREAD_PERCENT_PRECISION = 4;

export function SpreadIndicator({
  opportunity,
  pacificaRate,
  lighterRate,
}: SpreadIndicatorProps) {
  const { spread, spreadDirection, spreadPercentage } = opportunity;

  const variantClassNames = getVariantClassNames(spreadDirection);
  const spreadLabel = getSpreadLabel(spreadDirection);
  const suggestion = getArbSuggestion(pacificaRate, lighterRate);

  return (
    <div className="flex flex-col gap-1">
      <span
        className={cn(
          "inline-flex w-fit items-center rounded-full px-2 py-0.5 font-medium text-xs uppercase tracking-wide",
          variantClassNames
        )}
      >
        {spreadLabel}
      </span>
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium">
          {formatRate(spread, SPREAD_RATE_PRECISION)}
        </span>
        <span className="text-muted-foreground">
          ({formatPercentage(spreadPercentage, SPREAD_PERCENT_PRECISION)})
        </span>
      </div>
      {suggestion ? (
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex w-fit items-center rounded-full bg-blue-500/15 px-2 py-0.5 font-medium text-blue-500 text-xs uppercase tracking-wide dark:bg-blue-500/10">
            {suggestion.short === "pacifica"
              ? "Short Pacifica"
              : "Short Lighter"}
          </span>
          <span className="inline-flex w-fit items-center rounded-full bg-emerald-500/15 px-2 py-0.5 font-medium text-emerald-500 text-xs uppercase tracking-wide dark:bg-emerald-500/10">
            {suggestion.long === "pacifica" ? "Long Pacifica" : "Long Lighter"}
          </span>
        </div>
      ) : null}
    </div>
  );
}

function getVariantClassNames(
  spreadDirection: FundingArbitrageOpportunity["spreadDirection"]
) {
  if (spreadDirection === "pacifica_leads") {
    return "bg-emerald-500/15 text-emerald-500 dark:bg-emerald-500/10";
  }

  if (spreadDirection === "lighter_leads") {
    return "bg-red-500/15 text-red-500 dark:bg-red-500/10";
  }

  return "bg-muted text-muted-foreground";
}

function getSpreadLabel(
  spreadDirection: FundingArbitrageOpportunity["spreadDirection"]
) {
  switch (spreadDirection) {
    case "pacifica_leads":
      return "Pacifica > Lighter";
    case "lighter_leads":
      return "Lighter > Pacifica";
    default:
      return "Parity";
  }
}

type Suggestion = {
  short: "pacifica" | "lighter";
  long: "pacifica" | "lighter";
} | null;

function getArbSuggestion(
  pacificaRate?: number | null,
  lighterRate?: number | null
): Suggestion {
  if (pacificaRate == null || lighterRate == null) {
    return null;
  }
  if (pacificaRate === lighterRate) {
    return null;
  }
  if (pacificaRate > lighterRate) {
    return { short: "pacifica", long: "lighter" };
  }
  return { short: "lighter", long: "pacifica" };
}
