"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  fetchLighterFundingRates,
  LIGHTER_FUNDING_WINDOW_HOURS,
} from "../services/lighter";
import {
  fetchPacificaFundingSnapshots,
  PACIFICA_FUNDING_WINDOW_HOURS,
  type PacificaFundingSnapshot,
} from "../services/pacifica";
import type { FundingArbitrageOpportunity, LighterFundingRate } from "../types";
import {
  calculateSpreadMetrics,
  derivePacificaSymbol,
  normalizeSymbol,
} from "../utils";

export type UseFundingArbitrageOptions = {
  maxSymbols?: number;
  refreshIntervalMs?: number;
  targetSymbols?: string[];
};

export type UseFundingArbitrageResult = {
  opportunities: FundingArbitrageOpportunity[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refetch: () => Promise<void>;
};

export function useFundingArbitrage(
  options: UseFundingArbitrageOptions = {}
): UseFundingArbitrageResult {
  const { maxSymbols, refreshIntervalMs, targetSymbols } = options;

  const [opportunities, setOpportunities] = useState<
    FundingArbitrageOpportunity[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  const normalizedTargetSymbols = useMemo(() => {
    if (!targetSymbols || targetSymbols.length === 0) {
      return null;
    }

    return targetSymbols.map(normalizeSymbol);
  }, [targetSymbols]);

  const buildOpportunities = useCallback(
    async (signal: AbortSignal) => {
      setLoading(true);
      setError(null);

      try {
        const [lighterRates, pacificaSnapshots] = await Promise.all([
          fetchLighterFundingRates({ signal }),
          fetchPacificaFundingSnapshots({ signal }),
        ]);

        const lighterMap = createLighterFundingMap(lighterRates);
        const pacificaMap = createPacificaFundingMap(pacificaSnapshots);

        const baseSymbols =
          normalizedTargetSymbols ?? Array.from(lighterMap.keys());

        const symbolsToConsider = limitSymbols(baseSymbols, maxSymbols);

        const combined = symbolsToConsider
          .map((symbol) =>
            buildOpportunityForSymbol({
              symbol,
              lighterMap,
              pacificaMap,
            })
          )
          .filter(isDefined);

        const sorted = combined.sort(
          (a, b) => Math.abs(b.spread) - Math.abs(a.spread)
        );

        setOpportunities(sorted);
        setLastUpdated(new Date());
      } catch (unknownError) {
        if ((unknownError as Error).name === "AbortError") {
          return;
        }

        setError(
          (unknownError as Error).message ||
            "Unable to load funding arbitrage data."
        );
        setOpportunities([]);
      } finally {
        setLoading(false);
      }
    },
    [maxSymbols, normalizedTargetSymbols]
  );

  const refetch = useCallback(async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    await buildOpportunities(controller.signal);
  }, [buildOpportunities]);

  useEffect(() => {
    refetch();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [refetch]);

  useEffect(() => {
    if (!refreshIntervalMs) {
      return;
    }

    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }

    refreshTimerRef.current = setInterval(() => {
      refetch().catch(() => {
        // Errors are handled inside refetch, so swallow them here.
      });
    }, refreshIntervalMs);

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [refreshIntervalMs, refetch]);

  return {
    opportunities,
    loading,
    error,
    lastUpdated,
    refetch,
  };
}

function normalizeFundingRatePerHour(rate: number | null, windowHours: number) {
  if (rate === null) {
    return null;
  }

  if (!Number.isFinite(windowHours) || windowHours <= 0) {
    return rate;
  }

  return rate / windowHours;
}

function createLighterFundingMap(rates: LighterFundingRate[]) {
  const lighterMap = new Map<string, LighterFundingRate>();

  for (const rate of rates) {
    if (rate.exchange !== "lighter") {
      continue;
    }

    lighterMap.set(normalizeSymbol(rate.symbol), rate);
  }

  return lighterMap;
}

function createPacificaFundingMap(snapshots: PacificaFundingSnapshot[]) {
  const pacificaMap = new Map<string, PacificaFundingSnapshot>();

  for (const snapshot of snapshots) {
    pacificaMap.set(snapshot.normalizedSymbol, snapshot);
  }

  return pacificaMap;
}

function limitSymbols(symbols: string[], maxSymbols?: number) {
  if (typeof maxSymbols !== "number" || !Number.isFinite(maxSymbols)) {
    return symbols;
  }

  if (maxSymbols <= 0) {
    return [];
  }

  return symbols.slice(0, Math.floor(maxSymbols));
}

type OpportunityBuilderContext = {
  symbol: string;
  lighterMap: ReadonlyMap<string, LighterFundingRate>;
  pacificaMap: ReadonlyMap<string, PacificaFundingSnapshot>;
};

function buildOpportunityForSymbol({
  symbol,
  lighterMap,
  pacificaMap,
}: OpportunityBuilderContext) {
  const lighterEntry = lighterMap.get(symbol);
  if (!lighterEntry) {
    return null;
  }

  const pacificaSymbol = derivePacificaSymbol(symbol);
  const pacificaEntry = pacificaMap.get(pacificaSymbol);

  if (!pacificaEntry || pacificaEntry.fundingRate === null) {
    return null;
  }

  const pacificaWindow =
    pacificaEntry.windowHours ?? PACIFICA_FUNDING_WINDOW_HOURS;

  const pacificaFundingRate = normalizeFundingRatePerHour(
    pacificaEntry.fundingRate,
    pacificaWindow
  );

  const pacificaNextFundingRate = normalizeFundingRatePerHour(
    pacificaEntry.nextFundingRate,
    pacificaWindow
  );

  const lighterFundingRate = normalizeFundingRatePerHour(
    lighterEntry.rate,
    LIGHTER_FUNDING_WINDOW_HOURS
  );

  const spreadMetrics = calculateSpreadMetrics(
    pacificaFundingRate,
    lighterFundingRate
  );

  const opportunity: FundingArbitrageOpportunity = {
    symbol: lighterEntry.symbol,
    pacificaFundingRate,
    pacificaNextFundingRate,
    pacificaWindowHours: pacificaWindow,
    lighterFundingRate,
    lighterRawFundingRate: lighterEntry.rate,
    lighterWindowHours: LIGHTER_FUNDING_WINDOW_HOURS,
    spread: spreadMetrics.spread,
    spreadDirection: spreadMetrics.spreadDirection,
    spreadPercentage: spreadMetrics.spreadPercentage,
  };

  return opportunity;
}

function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
