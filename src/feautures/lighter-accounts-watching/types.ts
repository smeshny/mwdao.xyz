export type LighterPosition = {
  market_id: number;
  symbol: string;
  initial_margin_fraction: string;
  open_order_count: number;
  pending_order_count: number;
  position_tied_order_count: number;
  sign: 1 | -1; // 1 for Long, -1 for Short
  position: string;
  avg_entry_price: string;
  position_value: string;
  unrealized_pnl: string;
  realized_pnl: string;
  liquidation_price: string;
  margin_mode: number;
  allocated_margin: string;
};

export type LighterAccount = {
  code: number;
  account_type: number;
  index: number;
  l1_address: string;
  cancel_all_time: number;
  total_order_count: number;
  total_isolated_order_count: number;
  pending_order_count: number;
  available_balance: string;
  status: number; // 1 is active, 0 is inactive
  collateral: string;
  account_index: number;
  name: string;
  description: string;
  can_invite: boolean;
  referral_points_percentage: string;
  positions: LighterPosition[];
  total_asset_value: string;
  cross_asset_value: string;
  shares: unknown[];
};

export type LighterAccountResponse = {
  code: number;
  total: number;
  accounts: LighterAccount[];
};

export type WatchedAccount = {
  l1_address: string;
  account?: LighterAccount;
  lastUpdated?: Date;
  error?: string;
  groupName?: string;
};

export type WalletGroup = {
  id: string;
  name: string;
  initialBalance?: string;
  createdAt: Date;
};
