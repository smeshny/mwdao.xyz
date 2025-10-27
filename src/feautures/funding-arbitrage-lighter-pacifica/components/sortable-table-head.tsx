"use client";

import type { ReactNode } from "react";

import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";

import type { SortDirection } from "../utils/sorting";


import { TableHead } from "@/components/ui/table";

type SortableTableHeadProps = {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
  direction: SortDirection;
  ariaLabel?: string;
  scope?: React.ThHTMLAttributes<HTMLTableHeaderCellElement>["scope"];
  widthClass?: string;
};

export function SortableTableHead({
  children,
  onClick,
  active = false,
  direction,
  ariaLabel,
  scope,
  widthClass,
}: SortableTableHeadProps) {
  const Icon = active
    ? direction === "asc"
      ? ChevronUp
      : ChevronDown
    : ChevronsUpDown;

  let ariaSort: React.ThHTMLAttributes<HTMLTableHeaderCellElement>["aria-sort"];
  if (active) {
    ariaSort = direction === "asc" ? "ascending" : "descending";
  }

  return (
    <TableHead
      aria-label={ariaLabel}
      aria-sort={ariaSort}
      className={widthClass}
      scope={scope}
    >
      <button
        className="inline-flex items-center gap-2 text-left hover:underline"
        onClick={onClick}
        type="button"
      >
        <span>{children}</span>
        <Icon className="text-muted-foreground size-3.5" />
      </button>
    </TableHead>
  );
}
