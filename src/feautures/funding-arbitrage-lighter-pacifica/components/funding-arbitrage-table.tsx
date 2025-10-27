"use client";

import { useMemo, useState } from "react";

import { useFundingArbitrage } from "../hooks/use-funding-arbitrage";
import type { FundingArbitrageOpportunity } from "../types";
import { calculateSpreadMetrics, formatRate } from "../utils";
import { FundingArbitrageError } from "./funding-arbitrage-error";
import { FundingArbitrageSearch } from "./funding-arbitrage-search";
import { FundingArbitrageSkeleton } from "./funding-arbitrage-skeleton";
import {
  FundingArbitrageTimeframeSelector,
  TIMEFRAMES,
  type TimeframeValue,
} from "./funding-arbitrage-timeframe-selector";
import { SortableTableHead } from "./sortable-table-head";
import { SpreadIndicator } from "./spread-indicator";
import {
  scaleRate,
  makeComparator,
  type SortKey,
  type SortDirection,
} from "../utils/sorting";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type FundingArbitrageTableProps = {
  maxSymbols?: number;
  refreshIntervalMs?: number;
  targetSymbols?: string[];
};

const FUNDING_RATE_PRECISION = 6;

export function FundingArbitrageTable(props: FundingArbitrageTableProps = {}) {
  const [timeframe, setTimeframe] = useState<TimeframeValue>("1h");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("spreadAbs");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  const { opportunities, loading, error, lastUpdated, refetch } =
    useFundingArbitrage({
      maxSymbols: props.maxSymbols,
      refreshIntervalMs: props.refreshIntervalMs,
      targetSymbols: props.targetSymbols,
    });

  const toggleSort = (nextKey: SortKey) => {
    if (sortKey === nextKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(nextKey);
      setSortDir(nextKey === "symbol" ? "asc" : "desc");
    }
  };

  const selectedTimeframe =
    TIMEFRAMES.find((entry) => entry.value === timeframe) ?? TIMEFRAMES[0];

  const tableCaption = useMemo(() => {
    if (selectedTimeframe.value === "1h") {
      return "Pacifica публикует ставку каждый час, Lighter — каждые 8 часов. Все значения приведены к ставке за час.";
    }

    return `Все значения сконвертированы к ставке за выбранный интервал (${selectedTimeframe.label.toLowerCase()}).`;
  }, [selectedTimeframe]);

  const filteredAndSorted = useMemo(() => {
    const q = searchQuery.trim().toUpperCase();

    const filtered = opportunities.filter((op) =>
      q.length === 0 ? true : op.symbol.toUpperCase().includes(q),
    );

    const comparator = makeComparator(
      sortKey,
      sortDir,
      selectedTimeframe.hours,
    );

    return filtered.slice().sort((a, b) => comparator(a, b));
  }, [opportunities, searchQuery, selectedTimeframe.hours, sortDir, sortKey]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-64 flex-1 items-center gap-2">
            <FundingArbitrageSearch
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          <FundingArbitrageTimeframeSelector
            value={timeframe}
            onChange={setTimeframe}
          />
        </div>
        {error && (
          <div className="pt-2">
            <FundingArbitrageError error={error} />
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="bg-background rounded-lg border p-4 shadow-sm">
          <Table>
            <TableCaption>{tableCaption}</TableCaption>
            <TableHeader>
              <TableRow>
                <SortableTableHead
                  active={sortKey === "symbol"}
                  ariaLabel="Sort by market"
                  direction={sortDir}
                  onClick={() => toggleSort("symbol")}
                  scope="col"
                  widthClass="w-[140px]"
                >
                  Market
                </SortableTableHead>
                <SortableTableHead
                  active={sortKey === "pacifica"}
                  ariaLabel="Sort by Pacifica rate"
                  direction={sortDir}
                  onClick={() => toggleSort("pacifica")}
                >
                  Pacifica ({selectedTimeframe.label})
                </SortableTableHead>
                <SortableTableHead
                  active={sortKey === "pacificaNext"}
                  ariaLabel="Sort by Pacifica Next rate"
                  direction={sortDir}
                  onClick={() => toggleSort("pacificaNext")}
                >
                  Pacifica Next ({selectedTimeframe.label})
                </SortableTableHead>
                <SortableTableHead
                  active={sortKey === "lighter"}
                  ariaLabel="Sort by Lighter rate"
                  direction={sortDir}
                  onClick={() => toggleSort("lighter")}
                >
                  Lighter ({selectedTimeframe.label})
                </SortableTableHead>
                <SortableTableHead
                  active={sortKey === "spread" || sortKey === "spreadAbs"}
                  ariaLabel="Sort by spread"
                  direction={sortDir}
                  onClick={() =>
                    toggleSort(sortKey === "spreadAbs" ? "spread" : "spreadAbs")
                  }
                >
                  Spread ({selectedTimeframe.label})
                </SortableTableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <FundingArbitrageSkeleton />
              ) : (
                renderOpportunityRows(filteredAndSorted, selectedTimeframe)
              )}
              {!loading && opportunities.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center" colSpan={5}>
                    No markets available for comparison.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CardFooter className="bg-muted/50 flex items-center justify-between border-t px-6 py-3">
        <div className="text-muted-foreground text-sm">
          {lastUpdated ? (
            <>Last updated {lastUpdated.toLocaleTimeString()}</>
          ) : (
            <>Loading data...</>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={loading}
        >
          {loading ? "Updating..." : "Refresh"}
        </Button>
      </CardFooter>
    </Card>
  );
}

function renderOpportunityRows(
  opportunities: FundingArbitrageOpportunity[],
  timeframe: (typeof TIMEFRAMES)[0],
) {
  return opportunities.map((opportunity) => {
    const pacificaFunding = scaleRate(
      opportunity.pacificaFundingRate,
      timeframe.hours,
    );
    const pacificaNextFunding = scaleRate(
      opportunity.pacificaNextFundingRate,
      timeframe.hours,
    );
    const lighterFunding = scaleRate(
      opportunity.lighterFundingRate,
      timeframe.hours,
    );

    const spreadMetrics = calculateSpreadMetrics(
      pacificaFunding,
      lighterFunding,
    );

    return (
      <TableRow key={opportunity.symbol}>
        <TableCell className="font-medium">{opportunity.symbol}</TableCell>
        <TableCell>
          {formatRate(pacificaFunding, FUNDING_RATE_PRECISION)}
        </TableCell>
        <TableCell>
          {formatRate(pacificaNextFunding, FUNDING_RATE_PRECISION)}
        </TableCell>
        <TableCell>
          <div className="flex flex-col">
            <span>{formatRate(lighterFunding, FUNDING_RATE_PRECISION)}</span>
          </div>
        </TableCell>
        <TableCell>
          <SpreadIndicator
            lighterRate={lighterFunding}
            opportunity={spreadMetrics}
            pacificaRate={pacificaFunding}
          />
        </TableCell>
      </TableRow>
    );
  });
}
