import type { FundingArbitrageOpportunity } from "./types";

const PERP_SUFFIX_REGEX = /PERP$/u;
const THOUSAND_PREFIX = "1000";
const THOUSAND_PREFIX_LENGTH = THOUSAND_PREFIX.length;
const THOUSAND_SYMBOL_PREFIX = "K";
const PERCENT_SCALE = 100;
const SMALL_RATE_THRESHOLD = 1e-6;
const EXTENDED_PRECISION_THRESHOLD = 1e-3;
const MIN_RATE_DECIMALS = 6;
const EXTENDED_RATE_DECIMALS = 8;
const EXPONENTIAL_PRECISION = 2;

export function normalizeSymbol(symbol: string) {
  return symbol.trim().toUpperCase();
}

export function derivePacificaSymbol(symbol: string) {
  let normalized = normalizeSymbol(symbol);

  if (normalized.includes("-")) {
    normalized = normalized.split("-")[0] ?? normalized;
  }

  if (PERP_SUFFIX_REGEX.test(normalized)) {
    normalized = normalized.replace(PERP_SUFFIX_REGEX, "");
  }

  if (
    normalized.startsWith(THOUSAND_PREFIX) &&
    normalized.length > THOUSAND_PREFIX_LENGTH
  ) {
    normalized = `${THOUSAND_SYMBOL_PREFIX}${normalized.slice(
      THOUSAND_PREFIX_LENGTH
    )}`;
  }

  return normalized;
}

export function calculateSpreadMetrics(
  pacificaRate: number | null,
  lighterRate: number | null
): Pick<
  FundingArbitrageOpportunity,
  "spread" | "spreadDirection" | "spreadPercentage"
> {
  if (pacificaRate === null || lighterRate === null) {
    return {
      spread: 0,
      spreadDirection: "neutral",
      spreadPercentage: null,
    };
  }

  const spread = pacificaRate - lighterRate;

  let spreadDirection: FundingArbitrageOpportunity["spreadDirection"] =
    "neutral";
  if (spread > 0) {
    spreadDirection = "pacifica_leads";
  } else if (spread < 0) {
    spreadDirection = "lighter_leads";
  }

  const denominator = lighterRate === 0 ? pacificaRate || 1 : lighterRate;
  const spreadPercentage =
    denominator === 0 ? null : (spread / denominator) * PERCENT_SCALE;

  return {
    spread,
    spreadDirection,
    spreadPercentage,
  };
}

export function formatPercentage(value: number | null, fractionDigits = 4) {
  if (value === null || Number.isNaN(value)) {
    return "—";
  }

  return `${value.toFixed(fractionDigits)}%`;
}

export function formatRate(
  value: number | null,
  fractionDigits = MIN_RATE_DECIMALS
) {
  if (value === null || Number.isNaN(value)) {
    return "—";
  }

  const abs = Math.abs(value);

  if (abs !== 0 && abs < SMALL_RATE_THRESHOLD) {
    return value.toExponential(EXPONENTIAL_PRECISION);
  }

  const digits =
    abs < EXTENDED_PRECISION_THRESHOLD
      ? Math.max(fractionDigits, EXTENDED_RATE_DECIMALS)
      : fractionDigits;

  return value.toFixed(digits);
}
