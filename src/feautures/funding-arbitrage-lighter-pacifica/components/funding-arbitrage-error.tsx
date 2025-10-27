"use client";

type FundingArbitrageErrorProps = {
  error: string;
};

export function FundingArbitrageError({ error }: FundingArbitrageErrorProps) {
  return (
    <div className="border-destructive/60 bg-destructive/10 text-destructive rounded-lg border p-6">
      <p className="font-medium">Ошибка загрузки данных.</p>
      <p className="text-destructive/80 text-sm">
        {error}
        {"  "}
        Попробуйте нажать «Обновить».
      </p>
    </div>
  );
}
