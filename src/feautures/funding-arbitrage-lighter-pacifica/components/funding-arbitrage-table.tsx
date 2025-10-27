"use client";

import { ChevronDown, ChevronsUpDown, ChevronUp, Search } from "lucide-react";
import type * as React from "react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useFundingArbitrage } from "../hooks/use-funding-arbitrage";
import type { FundingArbitrageOpportunity } from "../types";
import { calculateSpreadMetrics, formatRate } from "../utils";
import { SpreadIndicator } from "./spread-indicator";

type FundingArbitrageTableProps = {
  maxSymbols?: number;
  refreshIntervalMs?: number;
  targetSymbols?: string[];
};

type TimeframeOption = {
  value: TimeframeValue;
  label: string;
  hours: number;
};

type TimeframeValue = "1h" | "8h" | "1d" | "1w" | "1y";

const HOURS_IN_DAY = 24;
const DAYS_IN_WEEK = 7;
const DAYS_IN_YEAR = 365;

const TIMEFRAMES: TimeframeOption[] = [
  { value: "1h", label: "Hourly", hours: 1 },
  { value: "8h", label: "8 Hours", hours: 8 },
  { value: "1d", label: "Day", hours: HOURS_IN_DAY },
  { value: "1w", label: "Week", hours: HOURS_IN_DAY * DAYS_IN_WEEK },
  { value: "1y", label: "Year", hours: HOURS_IN_DAY * DAYS_IN_YEAR },
];

const LOADING_ROW_COUNT = 6;
const LOADING_SKELETON_KEYS = Array.from(
  { length: LOADING_ROW_COUNT },
  (_, index) => `loading-row-${index}`
);
const FUNDING_RATE_PRECISION = 6;

export function FundingArbitrageTable(props: FundingArbitrageTableProps = {}) {
  const [timeframe, setTimeframe] = useState<TimeframeValue>("1h");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<
    "symbol" | "pacifica" | "pacificaNext" | "lighter" | "spread" | "spreadAbs"
  >("spreadAbs");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const { opportunities, loading, error, lastUpdated, refetch } =
    useFundingArbitrage({
      maxSymbols: props.maxSymbols,
      refreshIntervalMs: props.refreshIntervalMs,
      targetSymbols: props.targetSymbols,
    });

  const toggleSort = (
    nextKey:
      | "symbol"
      | "pacifica"
      | "pacificaNext"
      | "lighter"
      | "spread"
      | "spreadAbs"
  ) => {
    if (sortKey === nextKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(nextKey);
      setSortDir(nextKey === "symbol" ? "asc" : "desc");
    }
  };

  const selectedTimeframe =
    TIMEFRAMES.find((entry) => entry.value === timeframe) ?? TIMEFRAMES[0];

  const subtitle = useMemo(() => {
    if (loading) {
      return "Подгружаем ставки фондирования...";
    }

    if (error) {
      return "Не удалось загрузить данные. Попробуйте обновить страницу.";
    }

    return "Сравнение ставок фондирования Pacifica и Lighter для поиска арбитража.";
  }, [error, loading]);

  const tableCaption = useMemo(() => {
    if (selectedTimeframe.value === "1h") {
      return "Pacifica публикует ставку каждый час, Lighter — каждые 8 часов. Все значения приведены к ставке за час.";
    }

    return `Все значения сконвертированы к ставке за выбранный интервал (${selectedTimeframe.label.toLowerCase()}).`;
  }, [selectedTimeframe]);

  const filteredAndSorted = useMemo(() => {
    const q = searchQuery.trim().toUpperCase();

    const filtered = opportunities.filter((op) =>
      q.length === 0 ? true : op.symbol.toUpperCase().includes(q)
    );

    const comparator = makeComparator(
      sortKey,
      sortDir,
      selectedTimeframe.hours
    );

    return filtered.slice().sort((a, b) => comparator(a, b));
  }, [opportunities, searchQuery, selectedTimeframe.hours, sortDir, sortKey]);

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-semibold text-2xl tracking-tight">
            Funding Arbitrage Monitor
          </h1>
          <p className="max-w-2xl text-muted-foreground text-sm">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated ? (
            <span className="text-muted-foreground text-xs">
              Обновлено {lastUpdated.toLocaleTimeString()}
            </span>
          ) : null}
          <Button disabled={loading} onClick={() => refetch()}>
            {loading ? "Обновление..." : "Обновить"}
          </Button>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-64 flex-1 items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm">
          <Search className="size-4 text-muted-foreground" />
          <input
            aria-label="Поиск по инструментам"
            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Markets"
            type="text"
            value={searchQuery}
          />
        </div>
        <ButtonGroup
          aria-label="Выбор интервала расчета"
          className="rounded-lg bg-muted p-1"
        >
          {TIMEFRAMES.map((option) => (
            <Button
              aria-pressed={timeframe === option.value}
              key={option.value}
              onClick={() => setTimeframe(option.value)}
              size="sm"
              type="button"
              variant={timeframe === option.value ? "default" : "ghost"}
            >
              {option.label}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/60 bg-destructive/10 p-6 text-destructive">
          <p className="font-medium">Ошибка загрузки данных.</p>
          <p className="text-destructive/80 text-sm">
            {error}
            {"  "}
            Попробуйте нажать «Обновить».
          </p>
        </div>
      ) : (
        <div className="rounded-lg border bg-background p-4 shadow-sm">
          <Table>
            <TableCaption>{tableCaption}</TableCaption>
            <TableHeader>
              <TableRow>
                <SortableHead
                  active={sortKey === "symbol"}
                  ariaLabel="Сортировать по инструменту"
                  direction={sortDir}
                  onClick={() => toggleSort("symbol")}
                  scope="col"
                  widthClass="w-[140px]"
                >
                  Market
                </SortableHead>
                <SortableHead
                  active={sortKey === "pacifica"}
                  ariaLabel="Сортировать по Pacifica"
                  direction={sortDir}
                  onClick={() => toggleSort("pacifica")}
                >
                  Pacifica ({selectedTimeframe.label})
                </SortableHead>
                <SortableHead
                  active={sortKey === "pacificaNext"}
                  ariaLabel="Сортировать по Pacifica Next"
                  direction={sortDir}
                  onClick={() => toggleSort("pacificaNext")}
                >
                  Pacifica Next ({selectedTimeframe.label})
                </SortableHead>
                <SortableHead
                  active={sortKey === "lighter"}
                  ariaLabel="Сортировать по Lighter"
                  direction={sortDir}
                  onClick={() => toggleSort("lighter")}
                >
                  Lighter ({selectedTimeframe.label})
                </SortableHead>
                <SortableHead
                  active={sortKey === "spread" || sortKey === "spreadAbs"}
                  ariaLabel="Сортировать по Спреду"
                  direction={sortDir}
                  onClick={() =>
                    toggleSort(sortKey === "spreadAbs" ? "spread" : "spreadAbs")
                  }
                >
                  Spread ({selectedTimeframe.label})
                </SortableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? LOADING_SKELETON_KEYS.map((key) => (
                    <TableRow key={key}>
                      <TableCell colSpan={5}>
                        <div className="h-5 w-full animate-pulse rounded bg-muted" />
                      </TableCell>
                    </TableRow>
                  ))
                : renderOpportunityRows(filteredAndSorted, selectedTimeframe)}
              {!loading && opportunities.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center" colSpan={5}>
                    Нет доступных рынков для сравнения.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}

function SortableHead(props: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  direction: "asc" | "desc";
  ariaLabel?: string;
  scope?: React.ThHTMLAttributes<HTMLTableHeaderCellElement>["scope"];
  widthClass?: string;
}) {
  let Icon = ChevronsUpDown;
  if (props.active) {
    Icon = props.direction === "asc" ? ChevronUp : ChevronDown;
  }
  let ariaSort: React.ThHTMLAttributes<HTMLTableHeaderCellElement>["aria-sort"];
  if (props.active) {
    ariaSort = props.direction === "asc" ? "ascending" : "descending";
  } else {
    ariaSort = undefined;
  }
  return (
    <TableHead
      aria-label={props.ariaLabel}
      aria-sort={ariaSort}
      className={props.widthClass}
      scope={props.scope}
    >
      <button
        className="inline-flex items-center gap-2 text-left hover:underline"
        onClick={props.onClick}
        type="button"
      >
        <span>{props.children}</span>
        <Icon className="size-3.5 text-muted-foreground" />
      </button>
    </TableHead>
  );
}

function renderOpportunityRows(
  opportunities: FundingArbitrageOpportunity[],
  timeframe: TimeframeOption
) {
  return opportunities.map((opportunity) => {
    const pacificaFunding = scaleRate(
      opportunity.pacificaFundingRate,
      timeframe.hours
    );
    const pacificaNextFunding = scaleRate(
      opportunity.pacificaNextFundingRate,
      timeframe.hours
    );
    const lighterFunding = scaleRate(
      opportunity.lighterFundingRate,
      timeframe.hours
    );

    const spreadMetrics = calculateSpreadMetrics(
      pacificaFunding,
      lighterFunding
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

function scaleRate(rate: number | null, hours: number) {
  if (rate === null) {
    return null;
  }

  return rate * hours;
}

function makeComparator(
  sortKey:
    | "symbol"
    | "pacifica"
    | "pacificaNext"
    | "lighter"
    | "spread"
    | "spreadAbs",
  sortDir: "asc" | "desc",
  hours: number
) {
  function valueFor(op: FundingArbitrageOpportunity): string | number | null {
    switch (sortKey) {
      case "symbol":
        return op.symbol.toUpperCase();
      case "pacifica":
        return scaleRate(op.pacificaFundingRate, hours);
      case "pacificaNext":
        return scaleRate(op.pacificaNextFundingRate, hours);
      case "lighter":
        return scaleRate(op.lighterFundingRate, hours);
      case "spread": {
        const p = scaleRate(op.pacificaFundingRate, hours);
        const l = scaleRate(op.lighterFundingRate, hours);
        return p !== null && l !== null ? p - l : null;
      }
      case "spreadAbs": {
        const p = scaleRate(op.pacificaFundingRate, hours);
        const l = scaleRate(op.lighterFundingRate, hours);
        return p !== null && l !== null ? Math.abs(p - l) : null;
      }
      default:
        return null;
    }
  }

  return (a: FundingArbitrageOpportunity, b: FundingArbitrageOpportunity) => {
    const av = valueFor(a);
    const bv = valueFor(b);

    return compareComparable(toComparable(av), toComparable(bv), sortDir);
  };
}

type Comparable =
  | { type: "str"; str: string }
  | { type: "num"; num: number }
  | { type: "missing" };

function toComparable(value: string | number | null): Comparable {
  if (typeof value === "string") {
    return { type: "str", str: value };
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return { type: "num", num: value };
  }
  return { type: "missing" };
}

function compareComparable(
  a: Comparable,
  b: Comparable,
  dir: "asc" | "desc"
): number {
  const d = dir === "asc" ? 1 : -1;

  if (a.type === "missing" && b.type !== "missing") {
    return 1;
  }
  if (a.type !== "missing" && b.type === "missing") {
    return -1;
  }

  if (a.type === "str" && b.type === "str") {
    return d * a.str.localeCompare(b.str);
  }
  if (a.type === "num" && b.type === "num") {
    return d * (a.num - b.num);
  }
  if (a.type === "str" && b.type !== "str") {
    return -1;
  }
  if (a.type !== "str" && b.type === "str") {
    return 1;
  }
  return 0;
}
