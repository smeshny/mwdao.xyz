import type { FundingArbitrageOpportunity } from "../types";

export type SortKey =
  | "symbol"
  | "pacifica"
  | "pacificaNext"
  | "lighter"
  | "spread"
  | "spreadAbs";
export type SortDirection = "asc" | "desc";

type Comparable =
  | { type: "str"; str: string }
  | { type: "num"; num: number }
  | { type: "missing" };

export function makeComparator(
  sortKey: SortKey,
  sortDir: SortDirection,
  hours: number,
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

export function scaleRate(rate: number | null, hours: number): number | null {
  if (rate === null) {
    return null;
  }

  return rate * hours;
}

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
  dir: SortDirection,
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
