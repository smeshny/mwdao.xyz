"use client";

import type { ChangeEvent } from "react";

import { Search } from "lucide-react";

type FundingArbitrageSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function FundingArbitrageSearch({
  value,
  onChange,
  placeholder = "Search Markets",
}: FundingArbitrageSearchProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="bg-background flex min-w-64 flex-1 items-center gap-2 rounded-md border px-3 py-2 text-sm">
      <Search className="text-muted-foreground size-4" />
      <input
        aria-label="Поиск по инструментам"
        className="placeholder:text-muted-foreground flex-1 bg-transparent outline-none"
        onChange={handleChange}
        placeholder={placeholder}
        type="text"
        value={value}
      />
    </div>
  );
}
