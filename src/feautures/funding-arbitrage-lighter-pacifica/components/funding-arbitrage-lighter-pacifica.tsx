"use client";

import { useEffect, useState } from "react";

import { FundingArbitrageTable } from "./funding-arbitrage-table";

export function FundingArbitrageLighterPacifica() {
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show loading state during hydration to prevent mismatch
  if (!isMounted) {
    return (
      <div className="container mx-auto space-y-8 px-4 lg:px-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Funding Arbitrage Monitor
          </h1>
          <p className="text-muted-foreground">
            Compare funding rates across Pacifica and Lighter exchanges
          </p>
        </div>

        {/* Loading skeleton */}
        <div className="animate-pulse">
          <div className="rounded-lg border bg-background p-4 shadow-sm">
            <div className="bg-muted h-8 w-48 rounded mb-4"></div>
            <div className="bg-muted h-64 w-full rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-10 px-4 lg:px-6">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Funding Arbitrage Monitor
        </h1>
        <p className="text-muted-foreground max-w-3xl text-lg">
          Compare funding rates across Pacifica and Lighter exchanges to find
          arbitrage opportunities in real-time
        </p>
      </div>

      <FundingArbitrageTable />
    </div>
  );
}
