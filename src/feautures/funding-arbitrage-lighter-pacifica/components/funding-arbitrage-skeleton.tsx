"use client";

import { TableCell, TableRow } from "@/components/ui/table";

type FundingArbitrageSkeletonProps = {
  rows?: number;
  columns?: number;
};

export function FundingArbitrageSkeleton({
  rows = 6,
  columns = 5,
}: FundingArbitrageSkeletonProps) {
  return Array.from({ length: rows }, (_, index) => (
    <TableRow key={`loading-row-${index}`}>
      <TableCell colSpan={columns}>
        <div className="bg-muted h-5 w-full animate-pulse rounded" />
      </TableCell>
    </TableRow>
  ));
}
