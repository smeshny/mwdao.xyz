import type { LighterFundingRatesResponse } from "../types";

export const LIGHTER_FUNDING_WINDOW_HOURS = 8;

const LIGHTER_BASE_URL =
  process.env.NEXT_PUBLIC_LIGHTER_API_BASE_URL ??
  "https://mainnet.zklighter.elliot.ai";

const LIGHTER_FUNDING_RATES_PATH = "/api/v1/funding-rates";

export type FetchLighterFundingOptions = {
  signal?: AbortSignal;
};

export async function fetchLighterFundingRates(
  options: FetchLighterFundingOptions = {}
) {
  const { signal } = options;

  const url = `${LIGHTER_BASE_URL}${LIGHTER_FUNDING_RATES_PATH}`;

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
      `Failed to fetch Lighter funding rates: ${response.status} ${response.statusText}`
    );
  }

  const payload = (await response.json()) as LighterFundingRatesResponse;

  return payload.funding_rates.filter((entry) => entry.exchange === "lighter");
}
