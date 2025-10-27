"use client";

import { Button } from "@/components/ui/button";

type FundingArbitrageHeaderProps = {
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  onRefresh: () => void;
};

export function FundingArbitrageHeader({
  loading,
  error,
  lastUpdated,
  onRefresh,
}: FundingArbitrageHeaderProps) {
  const subtitle = getSubtitle(loading, error);

  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Funding Arbitrage Monitor
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        {lastUpdated ? (
          <span className="text-muted-foreground text-xs">
            Обновлено {lastUpdated.toLocaleTimeString()}
          </span>
        ) : null}
        <Button disabled={loading} onClick={onRefresh}>
          {loading ? "Обновление..." : "Обновить"}
        </Button>
      </div>
    </header>
  );
}

function getSubtitle(loading: boolean, error: string | null): string {
  if (loading) {
    return "Подгружаем ставки фондирования...";
  }

  if (error) {
    return "Не удалось загрузить данные. Попробуйте обновить страницу.";
  }

  return "Сравнение ставок фондирования Pacifica и Lighter для поиска арбитража.";
}
