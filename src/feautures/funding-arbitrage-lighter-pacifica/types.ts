export type PacificaMarketInfoResponse = {
  success: boolean;
  data: PacificaMarketInfoEntry[];
  error: unknown;
  code: unknown;
};

export type PacificaMarketInfoEntry = {
  symbol: string;
  tick_size: string;
  min_tick: string;
  max_tick: string;
  lot_size: string;
  max_leverage: number;
  isolated_only: boolean;
  min_order_size: string;
  max_order_size: string;
  funding_rate: string | null;
  next_funding_rate: string | null;
};

export type LighterFundingRatesResponse = {
  code: number;
  message?: string;
  funding_rates: LighterFundingRate[];
};

export type LighterFundingRate = {
  market_id: number;
  exchange: "binance" | "bybit" | "hyperliquid" | "lighter";
  symbol: string;
  rate: number;
};

export type FundingRateSnapshot = {
  symbol: string;
  pacificaFundingRate: number | null;
  pacificaNextFundingRate: number | null;
  lighterFundingRate: number | null;
  pacificaWindowHours: number;
  lighterWindowHours: number | null;
  lighterRawFundingRate: number | null;
};

export type FundingArbitrageOpportunity = FundingRateSnapshot & {
  spread: number;
  spreadDirection: "pacifica_leads" | "lighter_leads" | "neutral";
  spreadPercentage: number | null;
};
