import type {
  PacificaMarketInfoEntry,
  PacificaMarketInfoResponse,
} from "../types";
import { normalizeSymbol } from "../utils";

export const PACIFICA_FUNDING_WINDOW_HOURS = 1;

const PACIFICA_BASE_URL =
  process.env.NEXT_PUBLIC_PACIFICA_API_BASE_URL ?? "https://api.pacifica.fi";

const PACIFICA_MARKET_INFO_PATH = "/api/v1/info";

export type FetchPacificaMarketInfoOptions = {
  signal?: AbortSignal;
};

export type PacificaFundingSnapshot = {
  symbol: string;
  normalizedSymbol: string;
  fundingRate: number | null;
  nextFundingRate: number | null;
  windowHours: number;
};

export async function fetchPacificaMarketInfo(
  options: FetchPacificaMarketInfoOptions = {},
) {
  const { signal } = options;
  const url = `${PACIFICA_BASE_URL}${PACIFICA_MARKET_INFO_PATH}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    signal,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Pacifica market info: ${response.status} ${response.statusText}`,
    );
  }

  const payload = (await response.json()) as PacificaMarketInfoResponse;

  if (!(payload.success && Array.isArray(payload.data))) {
    throw new Error("Pacifica market info response is not valid.");
  }

  return payload.data;
}

export async function fetchPacificaFundingSnapshots(
  options: FetchPacificaMarketInfoOptions = {},
) {
  const marketInfo = await fetchPacificaMarketInfo(options);

  return marketInfo.map(createFundingSnapshot);
}

function createFundingSnapshot(
  entry: PacificaMarketInfoEntry,
): PacificaFundingSnapshot {
  return {
    symbol: entry.symbol,
    normalizedSymbol: normalizeSymbol(entry.symbol),
    fundingRate: safeParseNumber(entry.funding_rate),
    nextFundingRate: safeParseNumber(entry.next_funding_rate),
    windowHours: PACIFICA_FUNDING_WINDOW_HOURS,
  };
}

function safeParseNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return null;
    }

    const numericValue = Number(trimmed);
    return Number.isFinite(numericValue) ? numericValue : null;
  }

  return Number.isFinite(value) ? value : null;
}
