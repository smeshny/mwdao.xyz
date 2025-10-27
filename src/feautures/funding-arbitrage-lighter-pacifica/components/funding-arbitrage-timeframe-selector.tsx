"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

export type TimeframeValue = "1h" | "8h" | "1d" | "1w" | "1y";

type TimeframeOption = {
  value: TimeframeValue;
  label: string;
  hours: number;
};

type FundingArbitrageTimeframeSelectorProps = {
  value: TimeframeValue;
  onChange: (value: TimeframeValue) => void;
};

const HOURS_IN_DAY = 24;
const DAYS_IN_WEEK = 7;
const DAYS_IN_YEAR = 365;

export const TIMEFRAMES: TimeframeOption[] = [
  { value: "1h", label: "Hourly", hours: 1 },
  { value: "8h", label: "8 Hours", hours: 8 },
  { value: "1d", label: "Day", hours: HOURS_IN_DAY },
  { value: "1w", label: "Week", hours: HOURS_IN_DAY * DAYS_IN_WEEK },
  { value: "1y", label: "Year", hours: HOURS_IN_DAY * DAYS_IN_YEAR },
];

export function FundingArbitrageTimeframeSelector({
  value,
  onChange,
}: FundingArbitrageTimeframeSelectorProps) {
  return (
    <ButtonGroup
      aria-label="Выбор интервала расчета"
      className="bg-muted rounded-lg p-1"
    >
      {TIMEFRAMES.map((option) => (
        <Button
          aria-pressed={value === option.value}
          key={option.value}
          onClick={() => onChange(option.value)}
          size="sm"
          type="button"
          variant={value === option.value ? "default" : "ghost"}
        >
          {option.label}
        </Button>
      ))}
    </ButtonGroup>
  );
}
